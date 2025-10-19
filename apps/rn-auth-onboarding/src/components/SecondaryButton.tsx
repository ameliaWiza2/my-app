import React from 'react';
import {
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
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
}

const SecondaryButton: React.FC<Props> = ({
  label,
  onPress,
  disabled = false,
  accessibilityHint,
  style
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({pressed}) => [
        styles.button,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style
      ]}
      accessibilityRole="button"
      accessibilityState={{disabled}}
      accessibilityHint={accessibilityHint}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2563eb'
  },
  pressed: {
    backgroundColor: 'rgba(37, 99, 235, 0.08)'
  },
  disabled: {
    opacity: 0.6
  },
  label: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 16
  }
});

export default SecondaryButton;
