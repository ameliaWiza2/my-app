import React from 'react';
import {ActivityIndicator, GestureResponderEvent, Pressable, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle} from 'react-native';
import {useTheme} from '../../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';

export type ButtonProps = {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon,
  accessibilityLabel,
  style,
  textStyle,
}) => {
  const {theme} = useTheme();

  const backgroundColorMap: Record<ButtonVariant, string> = {
    primary: theme.colors.primary,
    secondary: theme.colors.secondary,
    outline: 'transparent',
  };

  const textColorMap: Record<ButtonVariant, string> = {
    primary: theme.colors.primaryContrast,
    secondary: theme.colors.secondaryContrast,
    outline: theme.colors.text,
  };

  const borderColorMap: Record<ButtonVariant, string> = {
    primary: theme.colors.primary,
    secondary: theme.colors.secondary,
    outline: theme.colors.border,
  };

  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      onPress={onPress}
      disabled={isDisabled}
      style={({pressed}) => [
        styles.base,
        {
          backgroundColor: backgroundColorMap[variant],
          borderColor: borderColorMap[variant],
          opacity: isDisabled ? 0.6 : pressed ? 0.9 : 1,
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.lg,
          borderRadius: theme.radius.md,
          shadowOpacity: variant === 'outline' ? 0 : 0.15,
          shadowRadius: theme.elevation.sm,
          shadowOffset: {width: 0, height: theme.elevation.sm / 2},
        },
        style,
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={textColorMap[variant]} />
        ) : (
          <>
            {icon ? <View style={{marginRight: theme.spacing.sm}}>{icon}</View> : null}
            <Text
              style={[
                styles.text,
                {
                  color: textColorMap[variant],
                  fontSize: theme.typography.body.fontSize,
                  fontWeight: theme.typography.bodyBold.fontWeight,
                  lineHeight: theme.typography.body.lineHeight,
                },
                textStyle,
              ]}
            >
              {title}
            </Text>
          </>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
});
