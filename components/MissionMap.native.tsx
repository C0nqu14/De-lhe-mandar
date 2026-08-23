import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Text, View } from 'react-native';
import { calculateDistance } from '@/services/locationService';
import { MissionLocation, ExecutorLocation } from '@/types/mission';
import { Colors } from '@/constants/Colors';

export function MissionMap({ destination, executorLocation, status }: { destination?: MissionLocation; executorLocation?: ExecutorLocation; status: string }) {
  const center = executorLocation ?? destination;
  if (!center) return <View style={styles.empty}><Text style={styles.emptyText}>Localização ainda não disponível.</Text></View>;
  const distance = executorLocation && destination ? calculateDistance(executorLocation.latitude, executorLocation.longitude, destination.latitude, destination.longitude) : null;
  return <View style={styles.wrapper}><MapView style={styles.map} initialRegion={{ latitude: center.latitude, longitude: center.longitude, latitudeDelta: 0.02, longitudeDelta: 0.02 }}><Marker coordinate={{ latitude: center.latitude, longitude: center.longitude }} title="Nengue" />{destination && <Marker coordinate={destination} pinColor="#F58220" title="Destino" />}</MapView><View style={styles.caption}><Text style={styles.status}>{status}</Text>{distance !== null && <Text style={styles.distance}>{distance >= 1000 ? `${(distance / 1000).toFixed(1).replace('.', ',')} km` : `${distance} m`}</Text>}</View></View>;
}
const styles = StyleSheet.create({ wrapper: { height: 260, borderRadius: 16, overflow: 'hidden', marginBottom: 20 }, map: { flex: 1 }, caption: { position: 'absolute', bottom: 12, left: 12, right: 12, backgroundColor: '#FFF', borderRadius: 10, padding: 10, flexDirection: 'row', justifyContent: 'space-between' }, status: { color: Colors.light.text, fontWeight: '700' }, distance: { color: Colors.light.tint, fontWeight: '800' }, empty: { height: 180, borderRadius: 16, backgroundColor: '#EAF0FF', justifyContent: 'center', alignItems: 'center' }, emptyText: { color: Colors.light.icon } });