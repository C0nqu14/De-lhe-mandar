import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { MissionCard } from '@/components/MissionCard';
import { Colors } from '@/constants/Colors';
import { useMissions } from '@/hooks/useMission';
import { missionService } from '@/services/missionService';

export default function ExploreScreen() {
  const available = useMissions().filter((mission) => mission.status === 'AVAILABLE');
  return <SafeAreaView style={styles.safe}><FlatList data={available} keyExtractor={(item) => item.id} contentContainerStyle={styles.content} ListHeaderComponent={<View style={styles.heading}><View><Text style={styles.kicker}>PARA NENGUES</Text><Text style={styles.title}>Missões disponíveis</Text></View><Ionicons name="map-outline" size={28} color={Colors.light.tint} /></View>} renderItem={({ item }) => <MissionCard mission={item} onPress={() => router.push(`/mission/${item.id}`)} onAccept={() => { missionService.acceptMission(item.id); }} />} ListEmptyComponent={<Text style={styles.empty}>Não existem missões disponíveis neste momento.</Text>} /></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: '#FCF9F8' }, content: { padding: 20 }, heading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }, kicker: { color: Colors.light.secondary, fontSize: 11, fontWeight: '800', letterSpacing: 1 }, title: { color: Colors.light.text, fontSize: 26, fontWeight: '800', marginTop: 4 }, empty: { color: Colors.light.icon } });