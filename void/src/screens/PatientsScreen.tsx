import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { telemetryService, Patient } from '../services/telemetryService';
 
export function PatientsScreen({ navigation }: any) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filtered, setFiltered] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
 
  const load = async () => {
    try {
      const data = await telemetryService.getPatients();
      setPatients(data);
      setFiltered(data);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os pacientes.');
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => { load(); }, []);
 
  useEffect(() => {
    if (!search.trim()) { setFiltered(patients); return; }
    const q = search.toLowerCase();
    setFiltered(patients.filter(p =>
      p.name.toLowerCase().includes(q) || p.condition.toLowerCase().includes(q)
    ));
  }, [search, patients]);
 
  const handleDelete = (id: number) => {
    Alert.alert('Remover Paciente', 'Confirmar remoção do monitoramento?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover', style: 'destructive',
        onPress: async () => {
          await telemetryService.deletePatient(id);
          setPatients(prev => prev.filter(p => p.id !== id));
        },
      },
    ]);
  };
 
  const statusColor = (s: string) =>
    s === 'critical' ? '#EF4444' : s === 'warning' ? '#F59E0B' : '#22C55E';
  const statusLabel = (s: string) =>
    s === 'critical' ? 'CRÍTICO' : s === 'warning' ? 'ATENÇÃO' : 'ESTÁVEL';
 
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#020414', '#050B28']} style={styles.bg}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pacientes</Text>
          <View style={{ width: 40 }} />
        </View>
 
        {/* Search */}
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome ou condição..."
            placeholderTextColor="#3A4A6A"
            value={search}
            onChangeText={setSearch}
          />
        </View>
 
        {loading
          ? <ActivityIndicator color="#4F8EF7" style={{ marginTop: 60 }} />
          : (
          <FlatList
            data={filtered}
            keyExtractor={item => String(item.id)}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhum paciente encontrado.</Text>
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('Telemetry', { patientId: item.id })}
                activeOpacity={0.8}
              >
                <View style={[styles.statusStripe, { backgroundColor: statusColor(item.status) }]} />
                <View style={styles.cardContent}>
                  <View style={styles.cardTop}>
                    <Text style={styles.patientName}>{item.name}</Text>
                    <View style={[styles.statusBadge, { borderColor: statusColor(item.status) + '40', backgroundColor: statusColor(item.status) + '15' }]}>
                      <Text style={[styles.statusText, { color: statusColor(item.status) }]}>
                        {statusLabel(item.status)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.condition}>{item.condition}</Text>
                  <View style={styles.cardBottom}>
                    <Text style={styles.patientId}>ID #{item.id}</Text>
                    <TouchableOpacity onPress={() => handleDelete(item.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                      <Text style={styles.deleteBtn}>Remover</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
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
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  searchWrapper: { paddingHorizontal: 20, paddingVertical: 12 },
  searchInput: {
    backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12,
    color: '#FFF', fontSize: 14,
  },
  list: { paddingHorizontal: 20, paddingBottom: 40, gap: 12 },
  card: {
    flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1,
    borderRadius: 14, overflow: 'hidden',
  },
  statusStripe: { width: 4 },
  cardContent: { flex: 1, padding: 16, gap: 6 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  patientName: { fontSize: 16, fontWeight: '600', color: '#E0E8FF' },
  statusBadge: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3 },
  statusText: { fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  condition: { fontSize: 13, color: '#7A8FB5' },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  patientId: { fontSize: 12, color: '#3A4A6A' },
  deleteBtn: { fontSize: 12, color: '#F87171', fontWeight: '500' },
  emptyText: { color: '#3A4A6A', textAlign: 'center', padding: 40, fontSize: 14 },
});