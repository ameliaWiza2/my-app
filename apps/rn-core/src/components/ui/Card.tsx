import React from 'react';
import {PropsWithChildren} from 'react';
import {StyleProp, StyleSheet, View, ViewProps, ViewStyle} from 'react-native';
import {useTheme} from '../../theme';

export type CardProps = ViewProps & {
  style?: StyleProp<ViewStyle>;
  accessibleLabel?: string;
};

export const Card: React.FC<PropsWithChildren<CardProps>> = ({
  children,
  style,
  accessibleLabel,
  ...rest
}) => {
  const {theme} = useTheme();
  return (
    <View
      accessibilityRole="summary"
      accessibilityLabel={accessibleLabel}
      style={[
        styles.base,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderRadius: theme.radius.lg,
          padding: theme.spacing.lg,
          borderColor: theme.colors.border,
          borderWidth: 1,
          shadowColor: '#000000',
          shadowOpacity: 0.1,
          shadowRadius: theme.elevation.md,
          shadowOffset: {width: 0, height: theme.elevation.sm},
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    width: '100%',
  },
});
