import { StyleSheet, Text, View } from 'react-native';
import { palette } from '@/constants/Theme';
export function MissionPriceBreakdown({ serviceAmount, purchaseAmount }: { serviceAmount: number; purchaseAmount: number }) {
  const total = serviceAmount + purchaseAmount;
  const fee = Math.round(serviceAmount * 0.1);
  return (
    <View style={styles.box}>
      <View style={styles.row}>
        <Text style={styles.label}>Valor do serviço</Text>
        <Text style={styles.value}>{serviceAmount.toLocaleString('pt-AO')} Kz</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Compras estimadas</Text>
        <Text style={styles.value}>{purchaseAmount.toLocaleString('pt-AO')} Kz</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Taxa (10%)</Text>
        <Text style={styles.value}>{fee.toLocaleString('pt-AO')} Kz</Text>
      </View>
      <View style={styles.total}>
        <Text style={styles.totalLabel}>Total estimado</Text>
        <Text style={styles.totalValue}>{total.toLocaleString('pt-AO')} Kz</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  box: { backgroundColor: palette.surfaceContainerLow, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(195,198,213,0.2)' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 },
  label: { color: palette.onSurfaceVariant, fontSize: 14 },
  value: { color: palette.onSurface, fontWeight: '700', fontSize: 14 },
  total: { borderTopWidth: 1, borderTopColor: palette.outlineVariant, paddingTop: 12, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between' },
  totalLabel: { color: palette.onSurface, fontWeight: '800' },
  totalValue: { color: palette.primary, fontSize: 18, fontWeight: '800' },
});
