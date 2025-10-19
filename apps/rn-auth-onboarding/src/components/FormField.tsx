import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View
} from 'react-native';

interface Props extends TextInputProps {
  label: string;
  error?: string | null;
}

const FormField: React.FC<Props> = ({label, error, style, ...textInputProps}) => {
  const inputId = textInputProps.accessibilityLabel ?? label;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...textInputProps}
        style={[styles.input, error ? styles.inputError : null, style]}
        accessibilityLabel={inputId}
        accessibilityHint={textInputProps.accessibilityHint}
        placeholderTextColor="#9ca3af"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16
  },
  label: {
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 6,
    fontWeight: '500'
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827'
  },
  inputError: {
    borderColor: '#dc2626'
  },
  error: {
    marginTop: 6,
    fontSize: 13,
    color: '#dc2626'
  }
});

export default FormField;
