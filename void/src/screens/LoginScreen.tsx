import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Animated, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { authService } from '../services/authService';

export function LoginScreen({ navigation }: any) {
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formOpacity = useRef(new Animated.Value(0)).current;
  const formY = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(formOpacity, { toValue: 1, duration: 700, delay: 200, useNativeDriver: true }),
      Animated.timing(formY, { toValue: 0, duration: 700, delay: 200, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!cpf || !email) { setError('Preencha CPF e E-mail.'); return; }
    setLoading(true); setError('');
    try {
      await authService.login(cpf, email);
      navigation.navigate('Dashboard');
    } catch (e: any) {
      setError('Credenciais inválidas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#020414', '#050B28', '#020414']} style={styles.bg}>
        <View style={styles.orb} />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
          <Animated.View style={[styles.card, { opacity: formOpacity, transform: [{ translateY: formY }] }]}>
            <View style={styles.header}>
              <View style={styles.logoMark}><Text style={styles.logoMarkText}>V</Text></View>
              <Text style={styles.title}>Acesso VOID</Text>
              <Text style={styles.subtitle}>Utilize as credenciais de Fisio cadastradas</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>CPF (Apenas números)</Text>
                <View style={styles.inputWrapper}>
                  <TextInput style={styles.input} placeholder="66666666666" placeholderTextColor="#3A4A6A" value={cpf} onChangeText={setCpf} keyboardType="numeric" />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>E-mail</Text>
                <View style={styles.inputWrapper}>
                  <TextInput style={styles.input} placeholder="roberto@void.com" placeholderTextColor="#3A4A6A" value={email} onChangeText={setEmail} autoCapitalize="none" />
                </View>
              </View>

              {error ? <View style={styles.errorBox}><Text style={styles.errorText}>⚠ {error}</Text></View> : null}

              <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.85} disabled={loading}>
                <LinearGradient colors={['#4F8EF7', '#2D5BE3']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.loginGradient}>
                  {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.loginButtonText}>Entrar no Sistema</Text>}
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}><Text style={styles.backText}>← Voltar</Text></TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020414' }, bg: { flex: 1 },
  orb: { position: 'absolute', top: -120, right: -80, width: 320, height: 320, borderRadius: 160, backgroundColor: 'rgba(79,142,247,0.08)' },
  keyboardView: { flex: 1, justifyContent: 'center', padding: 24 },
  card: { backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderRadius: 24, padding: 28, gap: 28 },
  header: { alignItems: 'center', gap: 12 },
  logoMark: { width: 56, height: 56, borderRadius: 16, backgroundColor: 'rgba(79,142,247,0.15)', borderColor: 'rgba(79,142,247,0.3)', borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  logoMarkText: { fontSize: 28, fontWeight: '900', color: '#4F8EF7', letterSpacing: 2 },
  title: { fontSize: 24, fontWeight: '700', color: '#FFFFFF', letterSpacing: 1 },
  subtitle: { fontSize: 14, color: '#5A6A8A', textAlign: 'center', lineHeight: 20 },
  form: { gap: 16 }, inputGroup: { gap: 8 }, label: { fontSize: 13, color: '#7A8FB5', fontWeight: '500', letterSpacing: 0.5 },
  inputWrapper: { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderRadius: 12 },
  input: { color: '#FFFFFF', fontSize: 15, paddingHorizontal: 16, paddingVertical: 14 },
  errorBox: { backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)', borderWidth: 1, borderRadius: 10, padding: 12 },
  errorText: { color: '#F87171', fontSize: 13 },
  loginButton: { borderRadius: 12, overflow: 'hidden', marginTop: 4, shadowColor: '#4F8EF7', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 8 },
  loginGradient: { paddingVertical: 17, alignItems: 'center', justifyContent: 'center' },
  loginButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  backButton: { alignItems: 'center', paddingVertical: 8 }, backText: { color: '#4F8EF7', fontSize: 14, fontWeight: '500' },
});