import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MissionCard } from '@/components/MissionCard';
import { palette } from '@/constants/Theme';
import { useMissions } from '@/hooks/useMission';
import { AppHeader } from '@/components/AppHeader';

export default function HistoryScreen() {
  const missions = useMissions();
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <AppHeader title="Histórico" onBack={() => router.back()} />
      <FlatList
        data={missions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.heading}>
            <View><Text style={styles.kicker}>REGISTO</Text><Text style={styles.title}>Todas as missões</Text></View>
            <View style={styles.icon}><Ionicons name="time-outline" size={20} color={palette.primary} /></View>
          </View>
        }
        renderItem={({ item }) => <MissionCard mission={item} onPress={() => router.push(`/mission/${item.id}`)} />}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  content: { padding: 16 },
  heading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, backgroundColor: palette.surfaceContainerLowest, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(195,198,213,0.2)' },
  kicker: { color: palette.secondary, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  title: { color: palette.onSurface, fontSize: 22, fontWeight: '800', marginTop: 4 },
  icon: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(0,68,163,0.08)', alignItems: 'center', justifyContent: 'center' },
});
