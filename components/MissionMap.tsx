import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette } from '@/constants/Theme';
import { MissionLocation, ExecutorLocation } from '@/types/mission';

export function MissionMap({ status }: { destination?: MissionLocation; executorLocation?: ExecutorLocation; status: string }) {
  return (
    <View style={styles.empty}>
      <View style={styles.icon}><Ionicons name="map-outline" size={24} color={palette.primary} /></View>
      <Text style={styles.title}>Mapa disponível no dispositivo</Text>
      <Text style={styles.text}>Abra no Expo Go para visualizar a localização da missão.</Text>
      <View style={styles.chip}><Text style={styles.status}>{status}</Text></View>
    </View>
  );
}
const styles = StyleSheet.create({
  empty: { height: 180, borderRadius: 16, backgroundColor: palette.surfaceContainerLow, justifyContent: 'center', alignItems: 'center', padding: 20, borderWidth: 1, borderColor: 'rgba(195,198,213,0.2)', borderStyle: 'dashed' },
  icon: { width: 44, height: 44, borderRadius: 12, backgroundColor: palette.surfaceContainerLowest, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  title: { color: palette.onSurface, fontWeight: '700' },
  text: { color: palette.onSurfaceVariant, textAlign: 'center', marginTop: 6, fontSize: 12 },
  chip: { backgroundColor: palette.primaryFixed, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 9999, marginTop: 12 },
  status: { color: palette.onPrimaryFixed, fontWeight: '700', fontSize: 12 },
});
