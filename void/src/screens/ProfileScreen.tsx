import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { authService } from '../services/authService';
 
export function ProfileScreen({ navigation }: any) {
  const [user, setUser] = useState({ name: 'Operador VOID', role: 'Fisioterapeuta Sênior', email: 'operador@void.br', unit: 'UTI · Bloco C' });
 
  const handleLogout = async () => {
    await authService.logout();
    navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
  };
 
  const InfoRow = ({ label, value }: { label: string; value: string }) => (
<View style={styles.infoRow}>
<Text style={styles.infoLabel}>{label}</Text>
<Text style={styles.infoValue}>{value}</Text>
</View>
  );
 
  return (
<SafeAreaView style={styles.container}>
<LinearGradient colors={['#020414', '#050B28']} style={styles.bg}>
<View style={styles.header}>
<TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
<Text style={styles.backText}>←</Text>
</TouchableOpacity>
<Text style={styles.headerTitle}>Perfil</Text>
<View style={{ width: 40 }} />
</View>
 
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Avatar section */}
<View style={styles.avatarSection}>
<LinearGradient colors={['#4F8EF7', '#2D5BE3']} style={styles.avatar}>
<Text style={styles.avatarText}>OP</Text>
</LinearGradient>
<Text style={styles.userName}>{user.name}</Text>
<View style={styles.roleBadge}>
<Text style={styles.roleText}>{user.role}</Text>
</View>
</View>
 
          {/* Info card */}
<View style={styles.card}>
<Text style={styles.cardTitle}>INFORMAÇÕES</Text>
<InfoRow label="E-mail" value={user.email} />
<View style={styles.divider} />
<InfoRow label="Unidade" value={user.unit} />
<View style={styles.divider} />
<InfoRow label="Acesso" value="Nível 3 · Completo" />
<View style={styles.divider} />
<InfoRow label="Último login" value="Hoje, 08:47" />
</View>
 
          {/* System card */}
<View style={styles.card}>
<Text style={styles.cardTitle}>SISTEMA</Text>
<InfoRow label="Versão VOID" value="2.4.1" />
<View style={styles.divider} />
<InfoRow label="Protocolo ISS" value="Ativo" />
<View style={styles.divider} />
<InfoRow label="Sensores vinculados" value="248 / 256" />
</View>
 
          {/* Logout */}
<TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
<Text style={styles.logoutText}>Sair do Sistema</Text>
</TouchableOpacity>
</ScrollView>
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
  scroll: { padding: 24, gap: 20, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', gap: 12, paddingVertical: 8 },
  avatar: {
    width: 80, height: 80, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#4F8EF7', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4, shadowRadius: 16, elevation: 10,
  },
  avatarText: { fontSize: 28, fontWeight: '900', color: '#FFF', letterSpacing: 2 },
  userName: { fontSize: 22, fontWeight: '700', color: '#FFFFFF' },
  roleBadge: {
    backgroundColor: 'rgba(79,142,247,0.12)', borderColor: 'rgba(79,142,247,0.3)',
    borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6,
  },
  roleText: { color: '#7BB3FB', fontSize: 13, fontWeight: '600' },
  card: {
    backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1, borderRadius: 18, padding: 20, gap: 0,
  },
  cardTitle: { fontSize: 11, color: '#5A6A8A', letterSpacing: 2, fontWeight: '600', marginBottom: 16 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  infoLabel: { fontSize: 14, color: '#7A8FB5' },
  infoValue: { fontSize: 14, color: '#E0E8FF', fontWeight: '500' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)' },
  logoutBtn: {
    backgroundColor: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.2)',
    borderWidth: 1, borderRadius: 14, paddingVertical: 17, alignItems: 'center',
  },
  logoutText: { color: '#F87171', fontSize: 16, fontWeight: '600' },
});