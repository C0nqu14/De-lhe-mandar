import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { createConfirmationPayload } from '@/services/qrService';
import { Mission } from '@/types/mission';
import { palette, radius } from '@/constants/Theme';

export function MissionQRCode({ mission }: { mission: Mission }) {
  const value = JSON.stringify(createConfirmationPayload(mission));
  return (
    <View style={styles.card}>
      <View style={styles.qrWrap}>
        <View style={[styles.corner, styles.tl]} />
        <View style={[styles.corner, styles.tr]} />
        <View style={[styles.corner, styles.bl]} />
        <View style={[styles.corner, styles.br]} />
        <QRCode value={value} size={190} color={palette.onSurface} backgroundColor="#FFFFFF" />
      </View>
      <Text style={styles.label}>Código de confirmação</Text>
      <Text style={styles.code}>{mission.confirmationCode ?? '------'}</Text>
      <Pressable onPress={() => Clipboard.setStringAsync(mission.confirmationCode ?? '')} style={styles.copyBtn}>
        <Text style={styles.copy}>Copiar OTP • {mission.confirmationCode ?? '------'}</Text>
      </Pressable>
      <Text style={styles.note}>Este QR contém apenas um token desta missão. Mostre ao Nengue.</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  card: { alignItems: 'center', backgroundColor: '#FFF', padding: 24, borderRadius: radius.card, borderWidth: 1, borderColor: 'rgba(195,198,213,0.3)', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 16, elevation: 2 },
  qrWrap: { padding: 16, backgroundColor: '#FFF', borderRadius: 16, position: 'relative' },
  corner: { position: 'absolute', width: 18, height: 18, borderColor: palette.primary, borderWidth: 2 },
  tl: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 12 },
  tr: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 12 },
  bl: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 12 },
  br: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 12 },
  label: { color: palette.onSurfaceVariant, fontSize: 12, marginTop: 18, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' },
  code: { color: palette.primary, fontSize: 24, fontWeight: '800', letterSpacing: 4, marginTop: 6 },
  copyBtn: { backgroundColor: palette.surfaceContainerLow, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 9999, marginTop: 12 },
  copy: { color: palette.primary, fontSize: 13, fontWeight: '700' },
  note: { color: palette.onSurfaceVariant, fontSize: 11, marginTop: 12, textAlign: 'center' },
});
