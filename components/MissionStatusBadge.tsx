import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { MissionStatus, statusLabels } from '@/types/mission';
export function MissionStatusBadge({ status }: { status: MissionStatus }) { return <View style={styles.badge}><Text style={styles.text}>{statusLabels[status]}</Text></View>; }
const styles = StyleSheet.create({ badge: { backgroundColor: '#FFF1E7', borderRadius: 18, paddingHorizontal: 10, paddingVertical: 7 }, text: { color: Colors.light.secondary, fontSize: 11, fontWeight: '800' } });