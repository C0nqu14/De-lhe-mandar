/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#1E5CC8';
const tintColorDark = '#FFFFFF';

export const Colors = {
  light: {
    text: '#1C1B1B',
    background: '#FCF9F8',
    tint: tintColorLight,
    secondary: '#F58220',
    icon: '#666666',
    tabIconDefault: '#666666',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#1C1B1B',
    tint: tintColorDark,
    secondary: '#F58220',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
