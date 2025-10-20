import { Platform, Alert } from 'react-native';
import SecureStorage from '../SecureStorage';
import { mapAll, parseBloodPressureSamples, parseStepSamples, parseWeightSamples } from './mappers';
import type {
  HealthMetric,
  RawBloodPressureSample,
  RawQuantitySample,
  HealthPermissions,
} from './types';
import { check, request, PERMISSIONS } from 'react-native-permissions';

const STORAGE_KEYS = {
  SYNC_ENABLED: (platform: string) => `health:${platform}:syncEnabled`,
  WRITE_PREGNANCY_ENABLED: (platform: string) => `health:${platform}:writePregnancyEnabled`,
};

export const HealthService = {
  // Permissions
  ensurePermissions: async (): Promise<HealthPermissions> => {
    if (Platform.OS === 'ios') {
      const sharePerm: any = (PERMISSIONS as any)?.IOS?.HEALTH_SHARE || 'ios.permission.HEALTH_SHARE';
      const updatePerm: any = (PERMISSIONS as any)?.IOS?.HEALTH_UPDATE || 'ios.permission.HEALTH_UPDATE';
      const readStatus = await check(sharePerm);
      const writeStatus = await check(updatePerm);
      const readGranted = readStatus === 'granted' || readStatus === 'limited';
      const writeGranted = writeStatus === 'granted' || writeStatus === 'limited';
      if (!readGranted) {
        const r = await request(sharePerm);
        if (r !== 'granted' && r !== 'limited') {
          return { read: false, writePregnancy: false };
        }
      }
      if (!writeGranted) {
        const r = await request(updatePerm);
        if (r !== 'granted' && r !== 'limited') {
          return { read: true, writePregnancy: false };
        }
      }
      return { read: true, writePregnancy: true };
    }

    if (Platform.OS === 'android') {
      const activityPerm: any = (PERMISSIONS as any)?.ANDROID?.ACTIVITY_RECOGNITION || 'android.permission.ACTIVITY_RECOGNITION';
      const bodySensorsPerm: any = (PERMISSIONS as any)?.ANDROID?.BODY_SENSORS || 'android.permission.BODY_SENSORS';
      const r1 = await request(activityPerm);
      const r2 = await request(bodySensorsPerm);
      return { read: r1 === 'granted' || r1 === 'limited', writePregnancy: false };
    }

    return { read: false, writePregnancy: false };
  },

  isSyncEnabled: async (): Promise<boolean> => {
    const key = STORAGE_KEYS.SYNC_ENABLED(Platform.OS);
    const v = await SecureStorage.getItem(key);
    return v === '1';
  },

  setSyncEnabled: async (enabled: boolean): Promise<boolean> => {
    if (enabled) {
      const perms = await HealthService.ensurePermissions();
      if (!perms.read) {
        Alert.alert('Permission required', 'Health permissions are required to sync data.');
        return false;
      }
    }
    const key = STORAGE_KEYS.SYNC_ENABLED(Platform.OS);
    await SecureStorage.setItem(key, enabled ? '1' : '0');
    return enabled;
  },

  isPregnancyWritebackEnabled: async (): Promise<boolean> => {
    const key = STORAGE_KEYS.WRITE_PREGNANCY_ENABLED(Platform.OS);
    const v = await SecureStorage.getItem(key);
    return v === '1';
  },

  setPregnancyWritebackEnabled: async (enabled: boolean): Promise<boolean> => {
    if (Platform.OS === 'ios' && enabled) {
      const perms = await HealthService.ensurePermissions();
      if (!perms.writePregnancy) {
        Alert.alert('Permission required', 'Health write permissions are required to write pregnancy data.');
        return false;
      }
    }
    const key = STORAGE_KEYS.WRITE_PREGNANCY_ENABLED(Platform.OS);
    await SecureStorage.setItem(key, enabled ? '1' : '0');
    return enabled;
  },

  // Read API
  readMetrics: async (
    options: {
      weight?: boolean;
      bloodPressure?: boolean;
      steps?: boolean;
      startDate?: Date;
      endDate?: Date;
    } = {}
  ): Promise<HealthMetric[]> => {
    const syncEnabled = await HealthService.isSyncEnabled();
    if (!syncEnabled) return [];

    const start = options.startDate ?? new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);
    const end = options.endDate ?? new Date();

    if (Platform.OS === 'ios') {
      // Dynamic import to avoid hard dependency during tests
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const AppleHealth = require('react-native-health');
        const to = (d: Date) => d.toISOString();
        const queries: any[] = [];
        if (options.weight) {
          queries.push({ type: 'Weight', unit: 'kg' });
        }
        if (options.bloodPressure) {
          queries.push({ type: 'BloodPressure' });
        }
        if (options.steps) {
          queries.push({ type: 'StepCount' });
        }
        const resp = await AppleHealth.getSamples({ startDate: to(start), endDate: to(end), types: queries });
        const mapped = mapAll({
          weight: resp.weight as RawQuantitySample[] | undefined,
          bloodPressure: resp.bloodPressure as RawBloodPressureSample[] | undefined,
          steps: resp.steps as RawQuantitySample[] | undefined,
        });
        return mapped;
      } catch (e) {
        return [];
      }
    }

    if (Platform.OS === 'android') {
      // Placeholder: integrate Google Fit in future
      return [];
    }

    return [];
  },

  // Write pregnancy-related metrics back to HealthKit (iOS only). No-op on others.
  writePregnancyData: async (data: { lmpDate?: string | null; edd?: string | null; gestationalAgeWeeks?: number | null }): Promise<boolean> => {
    const writeEnabled = await HealthService.isPregnancyWritebackEnabled();
    if (!writeEnabled) return false;
    if (Platform.OS !== 'ios') return false;

    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const AppleHealth = require('react-native-health');
      const payload: any = {};
      if (data.lmpDate) payload.LMP = data.lmpDate; // depends on lib support
      if (data.edd) payload.EDD = data.edd;
      if (typeof data.gestationalAgeWeeks === 'number') payload.GestationalAge = data.gestationalAgeWeeks;
      await AppleHealth.savePregnancy(payload);
      return true;
    } catch (e) {
      return false;
    }
  },

  // Expose mappers for testing
  __debug: {
    parseWeightSamples,
    parseBloodPressureSamples,
    parseStepSamples,
  },
};

export type { HealthMetric } from './types';
