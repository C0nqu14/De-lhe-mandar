import { palette } from '@/constants/Theme';
import { Notification, notificationService } from '@/services/notificationService';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const iconMap: Record<string, { icon: keyof typeof Ionicons.glyphMap; bg: string; color: string }> = {
  default: { icon: 'notifications-outline', bg: 'rgba(0,68,163,0.1)', color: palette.primary },
  shipping: { icon: 'bicycle-outline', bg: 'rgba(255,137,40,0.12)', color: palette.secondary },
  success: { icon: 'checkmark-circle-outline', bg: 'rgba(0,133,69,0.1)', color: '#008545' },
};

export default function NotificationsScreen() {
  const [items, setItems] = useState<Notification[]>([]);
  useEffect(() => {
    void notificationService.list().then(setItems).catch(() => undefined);
    const unsub = notificationService.subscribe((n) => setItems((c) => [n, ...c]));
    return unsub;
  }, []);

  const unread = items.filter((i) => !i.read).length;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.appbar}>
        <Pressable onPress={() => router.back()} hitSlop={12}><Ionicons name="arrow-back" size={22} color={palette.primary} /></Pressable>
        <Text style={styles.title}>Alertas</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryRow}>
          {unread > 0 ? (
            <View style={styles.chip}><Text style={styles.chipText}>{unread} Novas</Text></View>
          ) : null}
          <Pressable><Text style={styles.markAll}>Marcar todas como lidas</Text></Pressable>
        </View>

        {items.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="notifications-outline" size={32} color={palette.outline} />
            <Text style={styles.emptyText}>Não existem notificações.</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {items.map((item) => {
              const cfg = iconMap.default;
              const isNew = !item.read;
              return (
                <Pressable key={item.id} onPress={() => void notificationService.markRead(item.id)} style={[styles.item, isNew && styles.itemNew]}>
                  <View style={[styles.iconBox, { backgroundColor: cfg.bg }]}>
                    <Ionicons name={cfg.icon} size={18} color={cfg.color} />
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <View style={styles.itemTop}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      {isNew ? <View style={styles.dot} /> : null}
                    </View>
                    <Text style={styles.itemMsg}>{item.message}</Text>
                    <Text style={styles.time}>há 2h</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  appbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: palette.surface, borderBottomWidth: 1, borderBottomColor: 'rgba(195,198,213,0.3)' },
  title: { color: palette.onSurface, fontSize: 18, fontWeight: '700' },
  content: { paddingHorizontal: 16, paddingBottom: 24 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, marginBottom: 12 },
  chip: { backgroundColor: palette.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 9999 },
  chipText: { color: palette.onPrimary, fontSize: 12, fontWeight: '700' },
  markAll: { color: palette.primary, fontSize: 13, fontWeight: '600' },
  list: { backgroundColor: palette.surfaceContainerLowest, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(195,198,213,0.2)' },
  item: { flexDirection: 'row', gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: palette.surfaceContainer },
  itemNew: { backgroundColor: 'rgba(0,68,163,0.02)' },
  iconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  itemTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  itemTitle: { color: palette.onSurface, fontWeight: '700', fontSize: 14, flex: 1 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: palette.primary },
  itemMsg: { color: palette.onSurfaceVariant, fontSize: 13, lineHeight: 18 },
  time: { color: palette.outline, fontSize: 11 },
  empty: { backgroundColor: palette.surfaceContainerLowest, borderRadius: 16, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(195,198,213,0.2)', gap: 8, marginTop: 16 },
  emptyText: { color: palette.onSurfaceVariant },
});
