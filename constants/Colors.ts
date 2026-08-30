/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { palette } from './Theme';

const tintColorLight = palette.primary;
const tintColorDark = '#FFFFFF';

export const Colors = {
  light: {
    text: palette.onSurface,
    background: palette.background,
    tint: tintColorLight,
    secondary: palette.secondary,
    secondaryContainer: palette.secondaryContainer,
    icon: palette.onSurfaceVariant,
    tabIconDefault: palette.onSurfaceVariant,
    tabIconSelected: tintColorLight,
    // tokens completos para migração 1:1 HTML -> RN
    palette,
  },
  dark: {
    text: '#ECEDEE',
    background: '#1C1B1B',
    tint: tintColorDark,
    secondary: palette.secondaryContainer,
    secondaryContainer: palette.secondaryContainer,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    palette,
  },
};
