import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Alert, View, Text, TextInput, StyleSheet, Pressable, Switch, Platform} from 'react-native';
import {FamilyRole, canEditPregnancy} from '../utils/rolePermissions';
import {PregnancyData, calculateGestationalAge} from '../services/pregnancy/ga';
import {PregnancyService} from '../services/pregnancy/PregnancyService';
import {NotificationsService} from '../services/notifications';
import { HealthService } from '../services/health/HealthService';

export type SettingsPregnancySectionProps = {
  role: FamilyRole;
  familyId?: string;
  initial: PregnancyData;
};

export const SettingsPregnancySection: React.FC<SettingsPregnancySectionProps> = ({role, familyId, initial}) => {
  const [lmp, setLmp] = useState(initial.lmpDate ?? '');
  const [manualEDD, setManualEDD] = useState(initial.manualEDD ?? '');
  const [saving, setSaving] = useState(false);
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [writebackEnabled, setWritebackEnabled] = useState(false);
  const prevEddRef = useRef<string | null>(null);

  const calc = useMemo(() => calculateGestationalAge(new Date(), {lmpDate: lmp || undefined, manualEDD: manualEDD || undefined}), [lmp, manualEDD]);
  const derivedEDD = calc.edd ? calc.edd.toISOString() : null;

  const editable = canEditPregnancy(role);

  useEffect(() => {
    (async () => {
      setSyncEnabled(await HealthService.isSyncEnabled());
      setWritebackEnabled(await HealthService.isPregnancyWritebackEnabled());
    })();
  }, []);

  const onToggleSync = async (val: boolean) => {
    const applied = await HealthService.setSyncEnabled(val);
    setSyncEnabled(applied);
    if (!applied && val) {
      Alert.alert('Health sync disabled', 'Unable to enable health sync due to missing permissions.');
    }
  };

  const onToggleWriteback = async (val: boolean) => {
    const applied = await HealthService.setPregnancyWritebackEnabled(val);
    setWritebackEnabled(applied);
    if (!applied && val) {
      Alert.alert('Write-back disabled', 'Unable to enable write-back due to missing permissions.');
    }
  };

  const handleSave = async () => {
    if (!editable) return;
    setSaving(true);
    const prevLmp = initial.lmpDate ?? null;
    const prevManual = initial.manualEDD ?? null;
    const prevCalc = calculateGestationalAge(new Date(), {lmpDate: prevLmp ?? undefined, manualEDD: prevManual ?? undefined});
    prevEddRef.current = prevCalc.edd ? prevCalc.edd.toISOString() : null;

    try {
      const next = await PregnancyService.upsertPregnancy({lmpDate: lmp || null, manualEDD: manualEDD || null});
      if (prevEddRef.current !== next.edd) {
        await NotificationsService.notify({
          type: 'EDD_CHANGED',
          familyId,
          previousEDD: prevEddRef.current,
          newEDD: next.edd ?? null,
        });
      }
      Alert.alert('Saved', 'Pregnancy details updated.');
    } catch (e) {
      setLmp(prevLmp ?? '');
      setManualEDD(prevManual ?? '');
      Alert.alert('Error', 'Failed to update pregnancy details. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container} accessibilityLabel="Pregnancy settings">
      <Text style={styles.header}>Pregnancy</Text>
      <Text accessibilityLabel="Role" style={styles.role}>Role: {role}</Text>

      <View style={styles.row}>
        <Text style={styles.label}>LMP (YYYY-MM-DD)</Text>
        <TextInput
          accessibilityLabel="LMP input"
          placeholder="YYYY-MM-DD"
          value={lmp}
          onChangeText={setLmp}
          editable={editable && !saving}
          style={[styles.input, !editable ? styles.disabled : null]}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Manual EDD (YYYY-MM-DD)</Text>
        <TextInput
          accessibilityLabel="Manual EDD input"
          placeholder="YYYY-MM-DD"
          value={manualEDD}
          onChangeText={setManualEDD}
          editable={editable && !saving}
          style={[styles.input, !editable ? styles.disabled : null]}
        />
      </View>

      <View style={styles.summary}>
        <Text>Source: {calc.source === 'lmp' ? 'LMP' : calc.source === 'manual' ? 'Manual' : 'Unknown'}</Text>
        <Text>EDD: {derivedEDD ? new Date(derivedEDD).toDateString() : 'Unknown'}</Text>
      </View>

      <View style={styles.row} accessibilityLabel="Health data sync">
        <Text style={styles.label}>{Platform.OS === 'ios' ? 'Apple Health Sync' : 'Google Fit Sync'}</Text>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          <Text>{syncEnabled ? 'On' : 'Off'}</Text>
          <Switch
            accessibilityLabel={Platform.OS === 'ios' ? 'Apple Health sync toggle' : 'Google Fit sync toggle'}
            value={syncEnabled}
            onValueChange={onToggleSync}
            disabled={saving}
          />
        </View>
      </View>

      <View style={styles.row} accessibilityLabel="Pregnancy write-back">
        <Text style={styles.label}>Write pregnancy data to {Platform.OS === 'ios' ? 'Health' : 'Health (unsupported)'}</Text>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          <Text>{writebackEnabled ? 'On' : 'Off'}</Text>
          <Switch
            accessibilityLabel="Pregnancy write-back toggle"
            value={writebackEnabled}
            onValueChange={onToggleWriteback}
            disabled={saving || !syncEnabled || Platform.OS !== 'ios'}
          />
        </View>
      </View>

      <Pressable
        accessibilityLabel="Save pregnancy settings"
        onPress={handleSave}
        disabled={!editable || saving}
        style={[styles.button, (!editable || saving) ? styles.buttonDisabled : null]}
      >
        <Text style={styles.buttonText}>{saving ? 'Saving…' : 'Save'}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  role: {
    marginBottom: 12,
    color: '#666',
  },
  row: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  disabled: {
    backgroundColor: '#f2f2f2',
    color: '#999',
  },
  summary: {
    marginTop: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#A0C8FF',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default SettingsPregnancySection;
