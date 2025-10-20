import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { HealthMetricsService } from '../../../services/pregnancy/HealthMetricsService';

export const BPForm: React.FC<{ service: HealthMetricsService; onSaved?: () => void }>
= ({ service, onSaved }) => {
  const [date, setDate] = useState<string>(new Date().toISOString());
  const [systolic, setSystolic] = useState<string>('');
  const [diastolic, setDiastolic] = useState<string>('');
  const [note, setNote] = useState<string>('');

  const save = async () => {
    const sys = parseInt(systolic, 10);
    const dia = parseInt(diastolic, 10);
    if (isNaN(sys) || isNaN(dia)) return;
    await service.addBloodPressure({ date, systolic: sys, diastolic: dia, note });
    setSystolic(''); setDiastolic(''); setNote('');
    onSaved?.();
  };

  return (
    <View accessibilityLabel="Blood pressure entry form" style={styles.container}>
      <Text style={styles.label}>Date</Text>
      <TextInput accessibilityLabel="BP date input" style={styles.input} value={date} onChangeText={setDate} />
      <Text style={styles.label}>Systolic</Text>
      <TextInput accessibilityLabel="Systolic input" style={styles.input} value={systolic} onChangeText={setSystolic} keyboardType="numeric" />
      <Text style={styles.label}>Diastolic</Text>
      <TextInput accessibilityLabel="Diastolic input" style={styles.input} value={diastolic} onChangeText={setDiastolic} keyboardType="numeric" />
      <Text style={styles.label}>Note</Text>
      <TextInput accessibilityLabel="BP note input" style={styles.input} value={note} onChangeText={setNote} />
      <Pressable accessibilityLabel="Save blood pressure" style={styles.button} onPress={save}>
        <Text style={styles.buttonText}>Save</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 8 },
  label: { marginTop: 8, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 6 },
  button: { marginTop: 12, backgroundColor: '#007AFF', padding: 10, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
});
