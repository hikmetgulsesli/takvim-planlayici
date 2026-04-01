export const COLORS = {
  // Surface colors
  surface: '#131315',
  surfaceContainer: '#201f21',
  surfaceContainerLow: '#1c1b1d',
  surfaceContainerHigh: '#2a2a2c',
  surfaceContainerHighest: '#353437',
  surfaceBright: '#39393b',
  surfaceDim: '#131315',
  surfaceVariant: '#353437',
  background: '#131315',
  
  // On colors (text/icons on surfaces)
  onSurface: '#e5e1e4',
  onBackground: '#e5e1e4',
  onSurfaceVariant: '#bbc9cf',
  
  // Primary colors (cyan/turquoise)
  primary: '#a8e8ff',
  onPrimary: '#003642',
  primaryContainer: '#00d4ff',
  onPrimaryContainer: '#00586b',
  primaryFixed: '#b4ebff',
  onPrimaryFixed: '#001f27',
  primaryFixedDim: '#3cd7ff',
  onPrimaryFixedVariant: '#004e5f',
  inversePrimary: '#00677e',
  surfaceTint: '#3cd7ff',
  
  // Secondary colors (purple)
  secondary: '#e2b6ff',
  onSecondary: '#4d007a',
  secondaryContainer: '#8900d5',
  onSecondaryContainer: '#e9c3ff',
  secondaryFixed: '#f3daff',
  onSecondaryFixed: '#2f004d',
  secondaryFixedDim: '#e2b6ff',
  onSecondaryFixedVariant: '#6e00ab',
  
  // Tertiary colors (pink)
  tertiary: '#ffd4dc',
  onTertiary: '#66002b',
  tertiaryContainer: '#ffacbe',
  onTertiaryContainer: '#a10048',
  tertiaryFixed: '#ffd9e0',
  onTertiaryFixed: '#3f0018',
  tertiaryFixedDim: '#ffb1c2',
  onTertiaryFixedVariant: '#8f0040',
  
  // Error colors
  error: '#ffb4ab',
  onError: '#690005',
  errorContainer: '#93000a',
  onErrorContainer: '#ffdad6',
  
  // Outline colors
  outline: '#859398',
  outlineVariant: '#3c494e',
  
  // Inverse colors
  inverseSurface: '#e5e1e4',
  inverseOnSurface: '#313032',
  
  // Event colors
  eventBlue: '#3cd7ff',
  eventPurple: '#e2b6ff',
  eventGreen: '#a8e8ff',
  eventOrange: '#ffb4ab',
  eventRed: '#ffacbe',
  eventPink: '#ffd4dc',
} as const;

export const SPACING = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '2.5rem',  // 40px
  '3xl': '3rem',    // 48px
  '4xl': '4rem',    // 64px
} as const;

export const TYPOGRAPHY = {
  fontFamily: {
    headline: '"Space Grotesk", sans-serif',
    body: '"Be Vietnam Pro", sans-serif',
    label: '"Space Grotesk", sans-serif',
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
  },
} as const;

export const BORDER_RADIUS = {
  none: '0',
  sm: '0.25rem',   // 4px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',  // 6px
  lg: '0.5rem',    // 8px
  xl: '0.75rem',   // 12px
  '2xl': '1rem',   // 16px
  full: '9999px',
} as const;

export const SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  primary: '0 8px 24px rgba(128, 131, 255, 0.3)',
} as const;

export const TRANSITIONS = {
  fast: '150ms ease-in-out',
  DEFAULT: '200ms ease-in-out',
  slow: '300ms ease-in-out',
} as const;

export const Z_INDEX = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;
