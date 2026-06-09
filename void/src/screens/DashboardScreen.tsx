import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { telemetryService, Patient } from '../services/telemetryService';

const MetricCard = ({ label, value, unit, color, trend }: any) => (
  <View style={[styles.metricCard, { borderColor: color + '30' }]}>
    <View style={[styles.metricDot, { backgroundColor: color }]} />
    <Text style={styles.metricLabel}>{label}</Text>
    <Text style={[styles.metricValue, { color }]}>{value}</Text>
    <Text style={styles.metricUnit}>{unit}</Text>
    {trend && <Text style={styles.metricTrend}>{trend}</Text>}
  </View>
);

const PatientRow = ({ patient, onPress }: { patient: Patient; onPress: () => void }) => {
  const statusColor = patient.limiteEsforcoCritico > 50 ? '#EF4444' : '#22C55E';
  return (
    <TouchableOpacity style={styles.patientRow} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>{patient.nome}</Text>
        <Text style={styles.patientMeta}>ID {patient.id} · CPF: {patient.cpf}</Text>
      </View>
      <View style={styles.patientRight}>
        <Text style={[styles.patientStatus, { color: statusColor }]}>
          {patient.limiteEsforcoCritico > 50 ? 'ALTO RISCO' : 'ESTÁVEL'}
        </Text>
        <Text style={styles.chevron}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

export function DashboardScreen({ navigation }: any) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const data = await telemetryService.getPatients();
      setPatients(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#020414', '#050B28']} style={styles.bg}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerSub}>VOID · TELEMETRIA</Text>
            <Text style={styles.headerTitle}>Dashboard</Text>
          </View>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.profileInitial}>OP</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); load(); }}
              tintColor="#4F8EF7"
            />
          }
        >
          {/* System metrics */}
          <Text style={styles.sectionLabel}>STATUS DO SISTEMA</Text>
          <View style={styles.metricsGrid}>
            <MetricCard label="Pacientes Ativos" value="12" unit="total" color="#4F8EF7" trend="▲ 2 hoje" />
            <MetricCard label="Alertas" value="3" unit="abertos" color="#F59E0B" trend="▼ 1 resolvido" />
            <MetricCard label="Sensores Online" value="248" unit="/ 256" color="#22C55E" trend="● ao vivo" />
            <MetricCard label="Latência Média" value="11" unit="ms" color="#A78BFA" />
          </View>

          {/* Patients list */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>PACIENTES EM MONITORAMENTO</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Patients')}>
              <Text style={styles.seeAll}>Ver todos →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.patientsList}>
            {loading
              ? <ActivityIndicator color="#4F8EF7" style={{ marginVertical: 24 }} />
              : patients.length === 0
              ? <Text style={styles.emptyText}>Nenhum paciente encontrado.</Text>
              : patients.slice(0, 5).map(p => (
                  <PatientRow
                    key={p.id}
                    patient={p}
                    onPress={() => navigation.navigate('Telemetry', { patientId: p.id })}
                  />
                ))
            }
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020414' },
  bg: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    borderBottomWidth: 1,
  },
  headerSub: { fontSize: 11, color: '#4F8EF7', letterSpacing: 2, fontWeight: '600', marginBottom: 2 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.5 },
  profileBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(79,142,247,0.15)',
    borderColor: 'rgba(79,142,247,0.3)', borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  profileInitial: { color: '#4F8EF7', fontWeight: '700', fontSize: 14 },
  scrollContent: { padding: 24, gap: 20, paddingBottom: 40 },
  sectionLabel: { fontSize: 11, color: '#5A6A8A', letterSpacing: 2, fontWeight: '600', marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  seeAll: { fontSize: 13, color: '#4F8EF7', fontWeight: '500' },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metricCard: {
    flex: 1, minWidth: '45%',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderRadius: 16,
    padding: 16, gap: 4,
  },
  metricDot: { width: 8, height: 8, borderRadius: 4, marginBottom: 4 },
  metricLabel: { fontSize: 11, color: '#5A6A8A', letterSpacing: 0.5 },
  metricValue: { fontSize: 28, fontWeight: '800', letterSpacing: 0.5 },
  metricUnit: { fontSize: 12, color: '#3A4A6A' },
  metricTrend: { fontSize: 11, color: '#4A5A7A', marginTop: 4 },
  patientsList: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1, borderRadius: 16, overflow: 'hidden',
  },
  patientRow: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, gap: 12,
    borderBottomColor: 'rgba(255,255,255,0.05)', borderBottomWidth: 1,
  },
  statusIndicator: { width: 8, height: 8, borderRadius: 4 },
  patientInfo: { flex: 1 },
  patientName: { fontSize: 15, fontWeight: '600', color: '#E0E8FF' },
  patientMeta: { fontSize: 12, color: '#5A6A8A', marginTop: 2 },
  patientRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  patientStatus: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  chevron: { color: '#3A4A6A', fontSize: 20, fontWeight: '300' },
  emptyText: { color: '#3A4A6A', textAlign: 'center', padding: 24, fontSize: 14 },
});
