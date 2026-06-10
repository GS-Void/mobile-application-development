import AsyncStorage from '@react-native-async-storage/async-storage';
 
export const authService = {
  async login(cpf: string, email: string): Promise<void> {
    if (!cpf || !email) throw new Error('Credenciais inválidas.');
    await AsyncStorage.setItem('@void:token', 'token_local_demo');
    await AsyncStorage.setItem(
      '@void:user',
      JSON.stringify({ nome: 'Operador VOID', role: 'Fisioterapeuta Sênior' })
    );
  },
 
  async logout(): Promise<void> {
    await AsyncStorage.multiRemove(['@void:token', '@void:user']);
  },
 
  async isLoggedIn(): Promise<boolean> {
    const token = await AsyncStorage.getItem('@void:token');
    return token !== null;
  },
};