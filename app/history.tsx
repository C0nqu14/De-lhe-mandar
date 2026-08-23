import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { MissionCard } from '@/components/MissionCard';
import { Colors } from '@/constants/Colors';
import { useMissions } from '@/hooks/useMission';
export default function HistoryScreen() { const missions = useMissions(); return <SafeAreaView style={styles.safe}><FlatList data={missions} keyExtractor={(item) => item.id} contentContainerStyle={styles.content} ListHeaderComponent={<View style={styles.heading}><View><Text style={styles.kicker}>REGISTO</Text><Text style={styles.title}>Histórico</Text></View><Ionicons name="time-outline" size={28} color={Colors.light.tint} /></View>} renderItem={({ item }) => <MissionCard mission={item} onPress={() => router.push(`/mission/${item.id}`)} />} /></SafeAreaView>; }
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: '#FCF9F8' }, content: { padding: 20 }, heading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }, kicker: { color: Colors.light.secondary, fontSize: 11, fontWeight: '800', letterSpacing: 1 }, title: { color: Colors.light.text, fontSize: 28, fontWeight: '800', marginTop: 5 } });