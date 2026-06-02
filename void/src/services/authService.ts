import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://sua-api.exemplo.com'; // Substitua pela URL real

const api = axios.create({ baseURL: API_URL });

// Interceptor: injeta Bearer token em todas as requisições
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@void:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  /**
   * POST /auth/login — autentica e salva o JWT
   */
  async login(email: string, password: string): Promise<void> {
    const { data } = await api.post('/auth/login', { email, password });
    await AsyncStorage.setItem('@void:token', data.token);
    await AsyncStorage.setItem('@void:user', JSON.stringify(data.user));
  },

  /**
   * Remove o token e encerra a sessão
   */
  async logout(): Promise<void> {
    await AsyncStorage.multiRemove(['@void:token', '@void:user']);
  },

  /**
   * Retorna o token salvo (ou null)
   */
  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem('@void:token');
  },

  /**
   * Verifica se o usuário está autenticado
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem('@void:token');
    return !!token;
  },
};