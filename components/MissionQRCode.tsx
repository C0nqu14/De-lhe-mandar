import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { createConfirmationPayload } from '@/services/qrService';
import { Mission } from '@/types/mission';
import { Colors } from '@/constants/Colors';

export function MissionQRCode({ mission }: { mission: Mission }) {
  const value = JSON.stringify(createConfirmationPayload(mission));
  return <View style={styles.container}><QRCode value={value} size={190} color="#1C1B1B" backgroundColor="#FFFFFF" /><Text style={styles.label}>Código de confirmação</Text><Text style={styles.code}>{mission.confirmationCode ?? '------'}</Text><Pressable onPress={() => Clipboard.setStringAsync(mission.confirmationCode ?? '')}><Text style={styles.copy}>Copiar OTP</Text></Pressable><Text style={styles.note}>Este QR contém apenas um token desta missão.</Text></View>;
}
const styles = StyleSheet.create({ container: { alignItems: 'center', backgroundColor: '#FFF', padding: 20, borderRadius: 16 }, label: { color: Colors.light.icon, fontSize: 12, marginTop: 18 }, code: { color: Colors.light.tint, fontSize: 27, fontWeight: '800', letterSpacing: 5, marginTop: 5 }, copy: { color: Colors.light.tint, fontSize: 13, fontWeight: '700', marginTop: 10 }, note: { color: Colors.light.icon, fontSize: 11, marginTop: 10 } });