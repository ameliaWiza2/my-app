import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { HealthMetricsService } from '../../../services/pregnancy/HealthMetricsService';

export const WeightForm: React.FC<{ service: HealthMetricsService; onSaved?: () => void }>
= ({ service, onSaved }) => {
  const [date, setDate] = useState<string>(new Date().toISOString());
  const [kg, setKg] = useState<string>('');
  const [note, setNote] = useState<string>('');

  const save = async () => {
    const num = parseFloat(kg);
    if (isNaN(num)) return;
    await service.addWeight({ date, kg: num, note });
    setKg('');
    setNote('');
    onSaved?.();
  };

  return (
    <View accessibilityLabel="Weight entry form" style={styles.container}>
      <Text style={styles.label}>Date</Text>
      <TextInput accessibilityLabel="Weight date input" style={styles.input} value={date} onChangeText={setDate} />
      <Text style={styles.label}>Weight (kg)</Text>
      <TextInput accessibilityLabel="Weight value input" style={styles.input} value={kg} onChangeText={setKg} keyboardType="numeric" />
      <Text style={styles.label}>Note</Text>
      <TextInput accessibilityLabel="Weight note input" style={styles.input} value={note} onChangeText={setNote} />
      <Pressable accessibilityLabel="Save weight" style={styles.button} onPress={save}>
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
