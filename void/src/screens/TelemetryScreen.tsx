import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { telemetryService, TelemetryData } from '../services/telemetryService';
 
const SensorBar = ({ label, value, max, unit, color }: any) => {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <View style={sensorStyles.container}>
      <View style={sensorStyles.row}>
        <Text style={sensorStyles.label}>{label}</Text>
        <Text style={[sensorStyles.value, { color }]}>{value} <Text style={sensorStyles.unit}>{unit}</Text></Text>
      </View>
      <View style={sensorStyles.track}>
        <View style={[sensorStyles.fill, { width: `${pct}%` as any, backgroundColor: color }]} />
      </View>
    </View>
  );
};
 
const sensorStyles = StyleSheet.create({
  container: { gap: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  label: { fontSize: 13, color: '#7A8FB5' },
  value: { fontSize: 18, fontWeight: '700' },
  unit: { fontSize: 12, fontWeight: '400', color: '#5A6A8A' },
  track: { height: 6, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3 },
});
 
export function TelemetryScreen({ route, navigation }: any) {
  const { patientId } = route.params ?? { patientId: 1 };
  const [data, setData] = useState<TelemetryData | null>(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    telemetryService.getTelemetry(patientId).then(d => {
      setData(d);
      setLoading(false);
    });
    // Simula atualização a cada 5s
    const interval = setInterval(async () => {
      const d = await telemetryService.getTelemetry(patientId);
      setData(d);
    }, 5000);
    return () => clearInterval(interval);
  }, [patientId]);
 
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#020414', '#050B28']} style={styles.bg}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerSub}>TELEMETRIA EM TEMPO REAL</Text>
            <Text style={styles.headerTitle}>Paciente #{patientId}</Text>
          </View>
          <View style={styles.liveDot}>
            <View style={styles.livePulse} />
            <Text style={styles.liveText}>AO VIVO</Text>
          </View>
        </View>
 
        {loading
          ? <ActivityIndicator color="#4F8EF7" style={{ marginTop: 60 }} />
          : (
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            {/* Alert banner se crítico */}
            {data?.status === 'critical' && (
              <View style={styles.alertBanner}>
                <Text style={styles.alertText}>⚠ ALERTA CRÍTICO — Intervenção recomendada</Text>
              </View>
            )}
 
            {/* Vitals card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>SINAIS VITAIS</Text>
              <View style={styles.vitalsGrid}>
                <View style={styles.vitalItem}>
                  <Text style={styles.vitalValue}>{data?.heartRate ?? '--'}</Text>
                  <Text style={styles.vitalLabel}>BPM</Text>
                  <Text style={styles.vitalName}>Freq. Cardíaca</Text>
                </View>
                <View style={styles.vitalDivider} />
                <View style={styles.vitalItem}>
                  <Text style={styles.vitalValue}>{data?.spo2 ?? '--'}</Text>
                  <Text style={styles.vitalLabel}>%</Text>
                  <Text style={styles.vitalName}>SpO₂</Text>
                </View>
                <View style={styles.vitalDivider} />
                <View style={styles.vitalItem}>
                  <Text style={styles.vitalValue}>{data?.temperature ?? '--'}</Text>
                  <Text style={styles.vitalLabel}>°C</Text>
                  <Text style={styles.vitalName}>Temperatura</Text>
                </View>
              </View>
            </View>
 
            {/* Sensors */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>SENSORES MUSCULARES (EMG)</Text>
              <View style={styles.sensorsGap}>
                <SensorBar label="Bíceps D." value={data?.emg?.bicepsRight ?? 0} max={100} unit="%" color="#4F8EF7" />
                <SensorBar label="Bíceps E." value={data?.emg?.bicepsLeft ?? 0} max={100} unit="%" color="#7B6CF7" />
                <SensorBar label="Quadríceps D." value={data?.emg?.quadRight ?? 0} max={100} unit="%" color="#22C55E" />
                <SensorBar label="Quadríceps E." value={data?.emg?.quadLeft ?? 0} max={100} unit="%" color="#F59E0B" />
              </View>
            </View>
 
            {/* IMU */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>MOVIMENTO (IMU)</Text>
              <View style={styles.sensorsGap}>
                <SensorBar label="Ângulo Joelho" value={data?.imu?.kneeAngle ?? 0} max={180} unit="°" color="#A78BFA" />
                <SensorBar label="Ângulo Quadril" value={data?.imu?.hipAngle ?? 0} max={180} unit="°" color="#EC4899" />
              </View>
            </View>
 
            {/* Actions */}
            <TouchableOpacity
              style={styles.reportBtn}
              onPress={() => navigation.navigate('Profile')}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['rgba(79,142,247,0.15)', 'rgba(45,91,227,0.15)']}
                style={styles.reportGradient}
              >
                <Text style={styles.reportBtnText}>📋 Gerar Relatório do Paciente</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}
 
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020414' },
  bg: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
    borderBottomColor: 'rgba(255,255,255,0.06)', borderBottomWidth: 1,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backText: { color: '#4F8EF7', fontSize: 22, fontWeight: '600' },
  headerCenter: { alignItems: 'center' },
  headerSub: { fontSize: 10, color: '#4F8EF7', letterSpacing: 2, fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  liveDot: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  livePulse: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E' },
  liveText: { fontSize: 10, color: '#22C55E', fontWeight: '700', letterSpacing: 1 },
  scroll: { padding: 20, gap: 16, paddingBottom: 40 },
  alertBanner: {
    backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)',
    borderWidth: 1, borderRadius: 12, padding: 14,
  },
  alertText: { color: '#F87171', fontSize: 13, fontWeight: '600', textAlign: 'center' },
  card: {
    backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1, borderRadius: 18, padding: 20, gap: 16,
  },
  cardTitle: { fontSize: 11, color: '#5A6A8A', letterSpacing: 2, fontWeight: '600' },
  vitalsGrid: { flexDirection: 'row', alignItems: 'center' },
  vitalItem: { flex: 1, alignItems: 'center', gap: 2 },
  vitalValue: { fontSize: 34, fontWeight: '800', color: '#FFFFFF' },
  vitalLabel: { fontSize: 13, color: '#4F8EF7', fontWeight: '600' },
  vitalName: { fontSize: 11, color: '#5A6A8A' },
  vitalDivider: { width: 1, height: 48, backgroundColor: 'rgba(255,255,255,0.07)' },
  sensorsGap: { gap: 18 },
  reportBtn: { borderRadius: 14, overflow: 'hidden' },
  reportGradient: {
    paddingVertical: 17, alignItems: 'center',
    borderColor: 'rgba(79,142,247,0.25)', borderWidth: 1, borderRadius: 14,
  },
  reportBtnText: { color: '#7BB3FB', fontSize: 15, fontWeight: '600' },
});