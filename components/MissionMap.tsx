import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { MissionLocation, ExecutorLocation } from '@/types/mission';

export function MissionMap({ status }: { destination?: MissionLocation; executorLocation?: ExecutorLocation; status: string }) {
  return <View style={styles.empty}><Text style={styles.title}>Mapa disponível no dispositivo</Text><Text style={styles.text}>Abra no Expo Go para visualizar a localização da missão.</Text><Text style={styles.status}>{status}</Text></View>;
}
const styles = StyleSheet.create({ empty: { height: 180, borderRadius: 16, backgroundColor: '#EAF0FF', justifyContent: 'center', alignItems: 'center', padding: 20 }, title: { color: Colors.light.text, fontWeight: '800' }, text: { color: Colors.light.icon, textAlign: 'center', marginTop: 7 }, status: { color: Colors.light.tint, fontWeight: '800', marginTop: 12 } });