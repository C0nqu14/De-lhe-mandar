import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { palette, shadows } from '@/constants/Theme';

type Tab = { label: string; icon: keyof typeof Ionicons.glyphMap; iconActive: keyof typeof Ionicons.glyphMap; href: string };

const clientTabs: Tab[] = [
  { label: 'Home', icon: 'home-outline', iconActive: 'home', href: '/(client)/home' },
  { label: 'Missões', icon: 'document-text-outline', iconActive: 'document-text', href: '/(client)/mission/active' },
  { label: 'Alertas', icon: 'notifications-outline', iconActive: 'notifications', href: '/(client)/notifications' },
  { label: 'Profile', icon: 'person-outline', iconActive: 'person', href: '/(client)/profile' },
];

const executorTabs: Tab[] = [
  { label: 'Home', icon: 'home-outline', iconActive: 'home', href: '/(executor)/dashboard' },
  { label: 'Missões', icon: 'document-text-outline', iconActive: 'document-text', href: '/(executor)/available-missions' },
  { label: 'Alertas', icon: 'notifications-outline', iconActive: 'notifications', href: '/(executor)/notifications' },
  { label: 'Profile', icon: 'person-outline', iconActive: 'person', href: '/(executor)/profile' },
];

export function BottomNavigation({ executor = false }: { executor?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const tabs = executor ? executorTabs : clientTabs;

  return (
    <View style={styles.nav}>
      {tabs.map((tab) => {
        const active = pathname.includes(tab.href.replace(/\(.*\)\//, '')) || (tab.label === 'Home' && (pathname === '/' || pathname.includes('home') || pathname.includes('dashboard')));
        const color = active ? palette.primary : palette.onSurfaceVariant;
        return (
          <Pressable
            key={tab.label}
            onPress={() => router.push(tab.href as any)}
            style={styles.item}
          >
            <Ionicons name={active ? tab.iconActive : tab.icon} size={24} color={color} />
            <Text style={[styles.text, { color, fontWeight: active ? '700' : '500' }]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 64,
    backgroundColor: palette.surface,
    borderTopWidth: 1,
    borderTopColor: 'rgba(195,198,213,0.3)',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    ...shadows.nav,
    paddingBottom: 4,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
  text: { fontSize: 12, marginTop: 2, textAlign: 'center' },
});