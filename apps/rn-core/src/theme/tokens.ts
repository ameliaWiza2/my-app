export type ColorTokens = {
  background: string;
  surface: string;
  surfaceElevated: string;
  primary: string;
  primaryContrast: string;
  secondary: string;
  secondaryContrast: string;
  text: string;
  textMuted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
};

export type TypographyVariant = {
  fontFamily: string;
  fontSize: number;
  fontWeight: '400' | '500' | '600' | '700';
  lineHeight: number;
  letterSpacing?: number;
};

export type TypographyScale = {
  heading1: TypographyVariant;
  heading2: TypographyVariant;
  heading3: TypographyVariant;
  body: TypographyVariant;
  bodyBold: TypographyVariant;
  caption: TypographyVariant;
};

export type SpacingScale = {
  none: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
};

export type RadiusScale = {
  none: number;
  sm: number;
  md: number;
  lg: number;
  pill: number;
};

export type AppTheme = {
  colors: ColorTokens;
  spacing: SpacingScale;
  typography: TypographyScale;
  radius: RadiusScale;
  elevation: {
    sm: number;
    md: number;
    lg: number;
  };
};

const baseTypography: TypographyScale = {
  heading1: {
    fontFamily: 'System',
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  heading2: {
    fontFamily: 'System',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  heading3: {
    fontFamily: 'System',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  body: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodyBold: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  caption: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
};

const spacing: SpacingScale = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const radius: RadiusScale = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 16,
  pill: 999,
};

const lightColors: ColorTokens = {
  background: '#FFFFFF',
  surface: '#F5F5F5',
  surfaceElevated: '#FFFFFF',
  primary: '#2563EB',
  primaryContrast: '#FFFFFF',
  secondary: '#14B8A6',
  secondaryContrast: '#FFFFFF',
  text: '#111827',
  textMuted: '#6B7280',
  border: '#E5E7EB',
  success: '#16A34A',
  warning: '#F59E0B',
  error: '#DC2626',
};

const darkColors: ColorTokens = {
  background: '#0F172A',
  surface: '#111827',
  surfaceElevated: '#1F2937',
  primary: '#60A5FA',
  primaryContrast: '#0F172A',
  secondary: '#5EEAD4',
  secondaryContrast: '#0F172A',
  text: '#F9FAFB',
  textMuted: '#9CA3AF',
  border: '#1F2937',
  success: '#22C55E',
  warning: '#FBBF24',
  error: '#F87171',
};

export const lightTheme: AppTheme = {
  colors: lightColors,
  spacing,
  typography: baseTypography,
  radius,
  elevation: {
    sm: 2,
    md: 4,
    lg: 8,
  },
};

export const darkTheme: AppTheme = {
  colors: darkColors,
  spacing,
  typography: baseTypography,
  radius,
  elevation: {
    sm: 2,
    md: 6,
    lg: 12,
  },
};
