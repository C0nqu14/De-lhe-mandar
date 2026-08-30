import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Text, View } from 'react-native';
import { calculateDistance } from '@/services/locationService';
import { MissionLocation, ExecutorLocation } from '@/types/mission';
import { palette } from '@/constants/Theme';

export function MissionMap({ destination, executorLocation, status }: { destination?: MissionLocation; executorLocation?: ExecutorLocation; status: string }) {
  const center = executorLocation ?? destination;
  if (!center) return <View style={styles.empty}><Text style={styles.emptyText}>Localização ainda não disponível.</Text></View>;
  const distance = executorLocation && destination ? calculateDistance(executorLocation.latitude, executorLocation.longitude, destination.latitude, destination.longitude) : null;
  return (
    <View style={styles.wrapper}>
      <MapView style={styles.map} initialRegion={{ latitude: center.latitude, longitude: center.longitude, latitudeDelta: 0.02, longitudeDelta: 0.02 }}>
        <Marker coordinate={{ latitude: center.latitude, longitude: center.longitude }} title="Nengue" />
        {destination && <Marker coordinate={destination as any} pinColor={palette.secondary} title="Destino" />}
      </MapView>
      <View style={styles.caption}>
        <Text style={styles.status}>{status}</Text>
        {distance !== null && <Text style={styles.distance}>{distance >= 1000 ? `${(distance / 1000).toFixed(1).replace('.', ',')} km` : `${distance} m`}</Text>}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  wrapper: { height: 240, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(195,198,213,0.2)' },
  map: { flex: 1 },
  caption: { position: 'absolute', bottom: 12, left: 12, right: 12, backgroundColor: palette.surfaceContainerLowest, borderRadius: 12, padding: 12, flexDirection: 'row', justifyContent: 'space-between', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  status: { color: palette.onSurface, fontWeight: '700', fontSize: 13 },
  distance: { color: palette.primary, fontWeight: '800', fontSize: 13 },
  empty: { height: 180, borderRadius: 16, backgroundColor: palette.surfaceContainerLow, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: palette.onSurfaceVariant },
});
