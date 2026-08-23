import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/Colors';
export function AppHeader({ title, onBack }: { title: string; onBack?: () => void }) { return <View style={styles.header}>{onBack ? <Pressable onPress={onBack}><Ionicons name="arrow-back" size={24} color={Colors.light.text} /></Pressable> : <View style={styles.space} />}<Text style={styles.title}>{title}</Text><View style={styles.space} /></View>; }
const styles = StyleSheet.create({ header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }, title: { color: Colors.light.text, fontSize: 17, fontWeight: '800' }, space: { width: 24 } });