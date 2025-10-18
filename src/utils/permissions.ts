import { Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS, Permission } from 'react-native-permissions';

export interface PermissionConfig {
  permission: Permission;
  title: string;
  message: string;
  buttonPositive?: string;
  buttonNegative?: string;
}

export const PermissionConfigs: Record<string, PermissionConfig> = {
  CAMERA: {
    permission: Platform.select({
      ios: PERMISSIONS.IOS.CAMERA,
      android: PERMISSIONS.ANDROID.CAMERA,
    }) as Permission,
    title: 'Camera Permission',
    message: 'We need access to your camera to take photos and videos.',
    buttonPositive: 'Grant Access',
    buttonNegative: 'Cancel',
  },
  LOCATION: {
    permission: Platform.select({
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    }) as Permission,
    title: 'Location Permission',
    message: 'We need access to your location to provide location-based services.',
    buttonPositive: 'Grant Access',
    buttonNegative: 'Cancel',
  },
  PHOTO_LIBRARY: {
    permission: Platform.select({
      ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
      android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    }) as Permission,
    title: 'Photo Library Permission',
    message: 'We need access to your photo library to select and upload images.',
    buttonPositive: 'Grant Access',
    buttonNegative: 'Cancel',
  },
};

export type PermissionStatus = 'granted' | 'denied' | 'blocked' | 'unavailable' | 'limited';

export const checkPermission = async (
  permissionType: keyof typeof PermissionConfigs
): Promise<PermissionStatus> => {
  const config = PermissionConfigs[permissionType];
  if (!config) {
    throw new Error(`Unknown permission type: ${permissionType}`);
  }

  const result = await check(config.permission);
  return result as PermissionStatus;
};

export const requestPermission = async (
  permissionType: keyof typeof PermissionConfigs
): Promise<PermissionStatus> => {
  const config = PermissionConfigs[permissionType];
  if (!config) {
    throw new Error(`Unknown permission type: ${permissionType}`);
  }

  const result = await request(config.permission);
  return result as PermissionStatus;
};

export const requestPermissionWithRationale = async (
  permissionType: keyof typeof PermissionConfigs,
  showRationale: (config: PermissionConfig) => Promise<boolean>
): Promise<PermissionStatus> => {
  const currentStatus = await checkPermission(permissionType);

  if (currentStatus === 'granted') {
    return 'granted';
  }

  if (currentStatus === 'blocked') {
    return 'blocked';
  }

  const config = PermissionConfigs[permissionType];
  const shouldRequest = await showRationale(config);

  if (shouldRequest) {
    return await requestPermission(permissionType);
  }

  return 'denied';
};
