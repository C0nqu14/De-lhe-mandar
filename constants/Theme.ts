/**
 * Design Tokens extraídos 1:1 dos HTML em ./screens
 * Material 3 - "De Lhe Mandar"
 */
export const palette = {
  surfaceContainerHighest: '#e5e2e1',
  onSecondary: '#ffffff',
  onPrimaryFixed: '#001946',
  primaryFixedDim: '#b0c6ff',
  tertiaryFixed: '#ffdbcb',
  secondaryFixed: '#ffdcc6',
  onSurface: '#1c1b1b',
  onError: '#ffffff',
  surfaceBright: '#fcf9f8',
  primaryFixed: '#d9e2ff',
  tertiaryFixedDim: '#ffb692',
  secondaryFixedDim: '#ffb786',
  tertiaryContainer: '#a44400',
  surface: '#fcf9f8',
  onSurfaceVariant: '#434653',
  primaryContainer: '#1e5cc8',
  onBackground: '#1c1b1b',
  onTertiaryFixedVariant: '#793000',
  onSecondaryContainer: '#642f00',
  background: '#fcf9f8',
  onPrimaryContainer: '#d3ddff',
  secondaryContainer: '#ff8928',
  secondary: '#964900',
  surfaceContainer: '#f0eded',
  surfaceDim: '#dcd9d9',
  onErrorContainer: '#93000a',
  outline: '#737784',
  surfaceVariant: '#e5e2e1',
  tertiary: '#7e3300',
  onSecondaryFixedVariant: '#723600',
  onTertiaryContainer: '#ffd4c1',
  inverseSurface: '#313030',
  inverseOnSurface: '#f3f0ef',
  error: '#ba1a1a',
  onTertiary: '#ffffff',
  onPrimaryFixedVariant: '#00419d',
  surfaceContainerLowest: '#ffffff',
  onTertiaryFixed: '#341100',
  surfaceContainerLow: '#f6f3f2',
  primary: '#0044a3',
  inversePrimary: '#b0c6ff',
  surfaceContainerHigh: '#eae7e7',
  outlineVariant: '#c3c6d5',
  errorContainer: '#ffdad6',
  onSecondaryFixed: '#311300',
  onPrimary: '#ffffff',
  surfaceTint: '#1858c4',
  // auxiliares
  success: '#008545',
} as const;

export const spacing = {
  base: 8,
  stackSm: 8,
  stackMd: 16,
  stackLg: 24,
  gutter: 16,
  containerMobile: 16,
  containerDesktop: 32,
} as const;

export const radius = {
  sm: 4,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  card: 24, // rounded-[24px] principal
  cardLarge: 32,
  full: 9999,
} as const;

export const typography = {
  labelMd: { fontSize: 14, lineHeight: 20, letterSpacing: 0.14, fontWeight: '500' as const, fontFamily: 'Inter_500Medium' },
  labelSm: { fontSize: 12, lineHeight: 16, fontWeight: '600' as const, fontFamily: 'Inter_600SemiBold' },
  bodyMd: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const, fontFamily: 'Inter_400Regular' },
  bodyLg: { fontSize: 18, lineHeight: 28, fontWeight: '400' as const, fontFamily: 'Inter_400Regular' },
  headlineMd: { fontSize: 24, lineHeight: 32, fontWeight: '600' as const, fontFamily: 'Inter_600SemiBold' },
  headlineLg: { fontSize: 32, lineHeight: 40, letterSpacing: -0.64, fontWeight: '700' as const, fontFamily: 'Inter_700Bold' },
  headlineLgMobile: { fontSize: 28, lineHeight: 34, letterSpacing: -0.28, fontWeight: '700' as const, fontFamily: 'Inter_700Bold' },
  headlineXl: { fontSize: 40, lineHeight: 48, letterSpacing: -0.8, fontWeight: '700' as const, fontFamily: 'Inter_700Bold' },
} as const;

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 2,
  },
  nav: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 8,
  },
} as const;
