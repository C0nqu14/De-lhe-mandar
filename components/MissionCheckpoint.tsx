import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { MissionCheckpoint as Checkpoint } from '@/types/mission';

export function MissionCheckpoint({ checkpoint, completed }: { checkpoint: Checkpoint; completed: boolean }) {
  return <View style={styles.row}><View style={[styles.circle, completed && styles.active]}>{completed && <Ionicons name="checkmark" size={14} color="#FFF" />}</View><View style={styles.copy}><Text style={[styles.title, completed && styles.activeText]}>{checkpoint.description}</Text><Text style={styles.time}>{new Date(checkpoint.timestamp).toLocaleString('pt-AO')}</Text></View></View>;
}
const styles = StyleSheet.create({ row: { flexDirection: 'row', minHeight: 56 }, circle: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: '#C3C6D5', alignItems: 'center', justifyContent: 'center' }, active: { backgroundColor: Colors.light.tint, borderColor: Colors.light.tint }, copy: { marginLeft: 13, flex: 1 }, title: { color: Colors.light.icon, fontSize: 15 }, activeText: { color: Colors.light.text, fontWeight: '700' }, time: { color: '#999', fontSize: 11, marginTop: 4 } });