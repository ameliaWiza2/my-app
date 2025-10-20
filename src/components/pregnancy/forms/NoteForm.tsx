import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { HealthMetricsService } from '../../../services/pregnancy/HealthMetricsService';

export const NoteForm: React.FC<{ service: HealthMetricsService; onSaved?: () => void }>
= ({ service, onSaved }) => {
  const [date, setDate] = useState<string>(new Date().toISOString());
  const [text, setText] = useState<string>('');

  const save = async () => {
    if (!text.trim()) return;
    await service.addNote({ date, text });
    setText('');
    onSaved?.();
  };

  return (
    <View accessibilityLabel="Note entry form" style={styles.container}>
      <Text style={styles.label}>Date</Text>
      <TextInput accessibilityLabel="Note date input" style={styles.input} value={date} onChangeText={setDate} />
      <Text style={styles.label}>Note</Text>
      <TextInput accessibilityLabel="Note text input" style={styles.input} value={text} onChangeText={setText} />
      <Pressable accessibilityLabel="Save note" style={styles.button} onPress={save}>
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
