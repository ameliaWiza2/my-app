import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle
} from 'react-native';

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
}

const PrimaryButton: React.FC<Props> = ({
  label,
  onPress,
  disabled = false,
  loading = false,
  accessibilityHint,
  style
}) => {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({pressed}) => [
        styles.button,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style
      ]}
      accessibilityRole="button"
      accessibilityState={{disabled: isDisabled, busy: loading}}
      accessibilityHint={accessibilityHint}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center'
  },
  disabled: {
    opacity: 0.6
  },
  pressed: {
    opacity: 0.8
  },
  label: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16
  }
});

export default PrimaryButton;
