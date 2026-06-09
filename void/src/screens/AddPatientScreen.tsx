import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { telemetryService } from '../services/telemetryService';

export function AddPatientScreen({ navigation }: any) {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [limite, setLimite] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!nome || !cpf || !email || !limite) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    setLoading(true);
    try {
      await telemetryService.createPatient({
        nome,
        cpf,
        email,
        limiteEsforcoCritico: parseFloat(limite)
      });
      Alert.alert('Sucesso', 'Paciente salvo no Oracle!');
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Erro', 'Falha ao salvar. Verifique se o CPF é válido (11 dígitos).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#020414', '#050B28']} style={styles.bg}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}><Text style={styles.backText}>←</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>Novo Paciente</Text>
          <View style={{ width: 40 }} />
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome Completo</Text>
              <TextInput style={styles.input} placeholder="Ex: Ana Souza" placeholderTextColor="#3A4A6A" value={nome} onChangeText={setNome} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>CPF (11 dígitos, sem pontos)</Text>
              <TextInput style={styles.input} placeholder="11111111111" placeholderTextColor="#3A4A6A" value={cpf} onChangeText={setCpf} keyboardType="numeric" maxLength={11} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail de Contato</Text>
              <TextInput style={styles.input} placeholder="ana@email.com" placeholderTextColor="#3A4A6A" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Limite de Esforço Crítico (0.1 a 100.0)</Text>
              <TextInput style={styles.input} placeholder="Ex: 50.0" placeholderTextColor="#3A4A6A" value={limite} onChangeText={setLimite} keyboardType="numeric" />
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
              <LinearGradient colors={['#4F8EF7', '#2D5BE3']} style={styles.btnGradient}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Cadastrar Paciente</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020414' }, bg: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomColor: 'rgba(255,255,255,0.06)', borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }, backText: { color: '#4F8EF7', fontSize: 22, fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  form: { padding: 24, gap: 20 }, inputGroup: { gap: 8 }, label: { fontSize: 13, color: '#7A8FB5', fontWeight: '500' },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, color: '#FFF', fontSize: 15 },
  saveBtn: { borderRadius: 12, overflow: 'hidden', marginTop: 12 }, btnGradient: { paddingVertical: 16, alignItems: 'center' }, btnText: { color: '#FFF', fontSize: 16, fontWeight: '700' }
});