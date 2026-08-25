import { Colors } from '@/constants/Colors';
import { Notification, notificationService } from '@/services/notificationService';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function NotificationsScreen() {
  const [items, setItems] = useState<Notification[]>([]);
  useEffect(() => { void notificationService.list().then(setItems).catch(() => undefined); const unsubscribe = notificationService.subscribe((notification) => setItems((current) => [notification, ...current])); return unsubscribe; }, []);
  return <SafeAreaView style={styles.safe}><View style={styles.content}><Pressable onPress={() => router.back()} style={styles.back}><Ionicons name="arrow-back" size={24} color={Colors.light.text} /><Text style={styles.title}>Notificações</Text></Pressable>{items.map((item) => <Pressable key={item.id} onPress={() => void notificationService.markRead(item.id)} style={styles.item}><Ionicons name="checkmark-circle" size={25} color="#26864B" /><View><Text style={styles.itemTitle}>{item.title}</Text><Text style={styles.copy}>{item.message}</Text></View></Pressable>)}{items.length === 0 && <Text style={styles.muted}>Não existem notificações.</Text>}</View></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: '#FCF9F8' }, content: { padding: 20 }, back: { flexDirection: 'row', gap: 14, alignItems: 'center', marginBottom: 28 }, title: { color: Colors.light.text, fontSize: 25, fontWeight: '800' }, item: { flexDirection: 'row', gap: 13, padding: 16, backgroundColor: '#FFF', borderRadius: 14, marginBottom: 10 }, itemTitle: { color: Colors.light.text, fontWeight: '700' }, copy: { color: Colors.light.icon, marginTop: 4 }, muted: { color: Colors.light.icon, textAlign: 'center', marginTop: 35 } });
