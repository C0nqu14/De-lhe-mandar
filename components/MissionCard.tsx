import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '@/constants/Colors';
import { Mission, statusLabels } from '@/types/mission';

type MissionCardProps = { mission: Mission; onPress?: () => void; onAccept?: () => void };

export function MissionCard({ mission, onPress, onAccept }: MissionCardProps) {
  const isDone = mission.status === 'COMPLETED';
  return (
    <TouchableOpacity activeOpacity={0.86} onPress={onPress} style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.iconBox}>
          <Ionicons name="briefcase-outline" size={21} color={Colors.light.tint} />
        </View>
        <View style={[styles.status, isDone && styles.doneStatus]}>
          <View style={[styles.dot, isDone && styles.doneDot]} />
          <Text style={[styles.statusText, isDone && styles.doneText]}>{statusLabels[mission.status]}</Text>
        </View>
      </View>
      <Text style={styles.title}>{mission.title}</Text>
      <Text numberOfLines={2} style={styles.description}>{mission.description}</Text>
      <View style={styles.metaRow}><View style={styles.meta}><Ionicons name="location-outline" size={16} color={Colors.light.icon} /><Text style={styles.metaText}>{mission.location}</Text></View><Text style={styles.metaText}>{mission.scheduledAt}</Text></View>
      <View style={styles.amounts}><Text style={styles.amount}>Serviço {mission.serviceAmount.toLocaleString('pt-AO')} Kz</Text><Text style={styles.amount}>Compras {mission.purchaseAmount.toLocaleString('pt-AO')} Kz</Text><Text style={styles.total}>{mission.totalAmount.toLocaleString('pt-AO')} Kz</Text></View>
      {onAccept && mission.status === 'AVAILABLE' && <TouchableOpacity onPress={onAccept} style={styles.accept}><Text style={styles.acceptText}>Aceitar Missão</Text></TouchableOpacity>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E5E2E1' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  iconBox: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#EAF0FF', alignItems: 'center', justifyContent: 'center' },
  status: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF1E7', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  doneStatus: { backgroundColor: '#E9F7EF' },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.light.secondary },
  doneDot: { backgroundColor: '#26864B' },
  statusText: { color: '#964900', fontSize: 12, fontWeight: '600', marginLeft: 6 },
  doneText: { color: '#26864B' },
  title: { color: Colors.light.text, fontSize: 18, fontWeight: '700', marginBottom: 5 },
  description: { color: Colors.light.icon, fontSize: 14, lineHeight: 21, marginBottom: 16 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  meta: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  metaText: { color: Colors.light.icon, fontSize: 13, marginLeft: 5 },
  price: { color: Colors.light.tint, fontSize: 16, fontWeight: '800' },
  amounts: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#F0EDED', marginTop: 12, paddingTop: 11 },
  amount: { color: Colors.light.icon, fontSize: 11 }, total: { color: Colors.light.tint, fontWeight: '800', fontSize: 13 },
  accept: { backgroundColor: Colors.light.tint, borderRadius: 10, alignItems: 'center', paddingVertical: 11, marginTop: 14 }, acceptText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
});