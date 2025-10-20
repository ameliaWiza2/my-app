import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { HealthMetricsService } from '../../../services/pregnancy/HealthMetricsService';

export const FetalMovementForm: React.FC<{ service: HealthMetricsService; onSaved?: () => void }>
= ({ service, onSaved }) => {
  const [date, setDate] = useState<string>(new Date().toISOString());
  const [kicks, setKicks] = useState<string>('');
  const [note, setNote] = useState<string>('');

  const save = async () => {
    const k = parseInt(kicks, 10);
    if (isNaN(k)) return;
    await service.addFetalMovement({ date, kicks: k, note });
    setKicks(''); setNote('');
    onSaved?.();
  };

  return (
    <View accessibilityLabel="Fetal movement entry form" style={styles.container}>
      <Text style={styles.label}>Date</Text>
      <TextInput accessibilityLabel="FM date input" style={styles.input} value={date} onChangeText={setDate} />
      <Text style={styles.label}>Kicks</Text>
      <TextInput accessibilityLabel="Kicks input" style={styles.input} value={kicks} onChangeText={setKicks} keyboardType="numeric" />
      <Text style={styles.label}>Note</Text>
      <TextInput accessibilityLabel="FM note input" style={styles.input} value={note} onChangeText={setNote} />
      <Pressable accessibilityLabel="Save fetal movement" style={styles.button} onPress={save}>
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
