import React from 'react';
import {StyleProp, StyleSheet, Text, TextInput, TextInputProps, TextStyle, View, ViewStyle} from 'react-native';
import {useTheme} from '../../theme';

export type InputProps = TextInputProps & {
  label?: string;
  helperText?: string;
  errorText?: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  errorText,
  containerStyle,
  labelStyle,
  multiline,
  ...rest
}) => {
  const {theme} = useTheme();
  const hasError = Boolean(errorText);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text
          accessibilityLabel={`${label} label`}
          style={[
            styles.label,
            {
              color: theme.colors.text,
              marginBottom: theme.spacing.xs,
              fontSize: theme.typography.body.fontSize,
              fontWeight: theme.typography.bodyBold.fontWeight,
            },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      ) : null}
      <TextInput
        accessibilityHint={helperText}
        placeholderTextColor={theme.colors.textMuted}
        style={[
          styles.input,
          {
            borderColor: hasError ? theme.colors.error : theme.colors.border,
            color: theme.colors.text,
            backgroundColor: theme.colors.surfaceElevated,
            borderRadius: theme.radius.md,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: multiline ? theme.spacing.sm : theme.spacing.xs,
            fontSize: theme.typography.body.fontSize,
            minHeight: multiline ? 100 : 48,
          },
        ]}
        multiline={multiline}
        {...rest}
      />
      {helperText && !hasError ? (
        <Text
          style={[
            styles.helper,
            {
              color: theme.colors.textMuted,
              marginTop: theme.spacing.xs,
            },
          ]}
        >
          {helperText}
        </Text>
      ) : null}
      {hasError ? (
        <Text
          accessibilityLiveRegion="polite"
          style={[
            styles.helper,
            {
              color: theme.colors.error,
              marginTop: theme.spacing.xs,
            },
          ]}
        >
          {errorText}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
  },
  helper: {
    fontSize: 12,
    lineHeight: 16,
  },
});
