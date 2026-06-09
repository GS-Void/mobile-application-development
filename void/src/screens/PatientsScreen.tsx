import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { telemetryService, Patient } from '../services/telemetryService';
import { useFocusEffect } from '@react-navigation/native';

export function PatientsScreen({ navigation }: any) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filtered, setFiltered] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const data = await telemetryService.getPatients();
      setPatients(data); setFiltered(data);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os pacientes da API Azure.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(React.useCallback(() => { load(); }, []));

  useEffect(() => {
    if (!search.trim()) { setFiltered(patients); return; }
    const q = search.toLowerCase();
    setFiltered(patients.filter(p => p.nome.toLowerCase().includes(q) || p.cpf.includes(q)));
  }, [search, patients]);

  const handleDelete = (id: number) => {
    Alert.alert('Remover Paciente', 'Confirmar exclusão no Banco de Dados?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: async () => {
          await telemetryService.deletePatient(id);
          setPatients(prev => prev.filter(p => p.id !== id));
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#020414', '#050B28']} style={styles.bg}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}><Text style={styles.backText}>←</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>Pacientes</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddPatient')} style={styles.addBtn}><Text style={styles.addText}>+ Novo</Text></TouchableOpacity>
        </View>

        <View style={styles.searchWrapper}>
          <TextInput style={styles.searchInput} placeholder="Buscar por nome ou CPF..." placeholderTextColor="#3A4A6A" value={search} onChangeText={setSearch} />
        </View>

        {loading ? <ActivityIndicator color="#4F8EF7" style={{ marginTop: 60 }} /> : (
          <FlatList data={filtered} keyExtractor={item => String(item.id)} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}
            ListEmptyComponent={<Text style={styles.emptyText}>Nenhum paciente encontrado na Azure.</Text>}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Telemetry', { patientId: item.id })} activeOpacity={0.8}>
                <View style={[styles.statusStripe, { backgroundColor: item.limiteEsforcoCritico > 50 ? '#EF4444' : '#22C55E' }]} />
                <View style={styles.cardContent}>
                  <View style={styles.cardTop}>
                    <Text style={styles.patientName}>{item.nome}</Text>
                  </View>
                  <Text style={styles.condition}>{item.email}</Text>
                  <View style={styles.cardBottom}>
                    <Text style={styles.patientId}>CPF: {item.cpf} | Limite: {item.limiteEsforcoCritico}</Text>
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
  container: { flex: 1, backgroundColor: '#020414' }, bg: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomColor: 'rgba(255,255,255,0.06)', borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }, backText: { color: '#4F8EF7', fontSize: 22, fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  addBtn: { backgroundColor: 'rgba(79,142,247,0.15)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  addText: { color: '#4F8EF7', fontWeight: 'bold' },
  searchWrapper: { paddingHorizontal: 20, paddingVertical: 12 },
  searchInput: { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, color: '#FFF', fontSize: 14 },
  list: { paddingHorizontal: 20, paddingBottom: 40, gap: 12 },
  card: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderRadius: 14, overflow: 'hidden' },
  statusStripe: { width: 4 }, cardContent: { flex: 1, padding: 16, gap: 6 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  patientName: { fontSize: 16, fontWeight: '600', color: '#E0E8FF' },
  condition: { fontSize: 13, color: '#7A8FB5' },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  patientId: { fontSize: 12, color: '#3A4A6A' }, deleteBtn: { fontSize: 12, color: '#F87171', fontWeight: '500' },
  emptyText: { color: '#3A4A6A', textAlign: 'center', padding: 40, fontSize: 14 },
});