import React from 'react';
import {Text as RNText, TextProps, TextStyle} from 'react-native';
import {useTheme} from '../../theme';

export type TypographyVariant = keyof ReturnType<typeof useTheme>['theme']['typography'];

export type TypographyProps = TextProps & {
  variant?: TypographyVariant;
  weight?: TextStyle['fontWeight'];
  align?: TextStyle['textAlign'];
};

export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body',
  weight,
  align,
  style,
  ...rest
}) => {
  const {
    theme: {typography, colors},
  } = useTheme();

  const variantStyle = typography[variant] ?? typography.body;

  return (
    <RNText
      style={[
        {
          color: colors.text,
          fontFamily: variantStyle.fontFamily,
          fontSize: variantStyle.fontSize,
          fontWeight: weight ?? variantStyle.fontWeight,
          lineHeight: variantStyle.lineHeight,
          textAlign: align,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
};
