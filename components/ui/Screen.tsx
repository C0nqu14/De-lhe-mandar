import { View, StyleSheet, ScrollView, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { palette } from '@/constants/Theme';

export function Screen({
  children,
  scroll = false,
  padded = true,
  style,
  contentStyle,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}) {
  const Wrapper = scroll ? ScrollView : View;
  const wrapperProps: any = scroll
    ? { contentContainerStyle: [padded && styles.content, contentStyle], showsVerticalScrollIndicator: false }
    : { style: [padded && styles.content, contentStyle] };

  return (
    <SafeAreaView style={[styles.safe, style]} edges={['top', 'bottom']}>
      <Wrapper {...wrapperProps}>{children}</Wrapper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  content: { paddingHorizontal: 16, paddingBottom: 24 },
});
