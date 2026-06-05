import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
const API_URL = 'https://sua-api.exemplo.com'; 
 
const api = axios.create({ baseURL: API_URL });
 
// Interceptor: injeta Bearer token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@void:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
 
 
export interface Patient {
  id: number;
  name: string;
  condition: string;
  status: 'stable' | 'warning' | 'critical';
}
 
export interface TelemetryData {
  patientId: number;
  status: 'stable' | 'warning' | 'critical';
  heartRate: number;   // BPM
  spo2: number;        // %
  temperature: number; // °C
  emg: {
    bicepsRight: number;  // 0–100%
    bicepsLeft: number;
    quadRight: number;
    quadLeft: number;
  };
  imu: {
    kneeAngle: number;  // 0–180°
    hipAngle: number;
  };
}
 
 
const MOCK_PATIENTS: Patient[] = [
  { id: 1, name: 'Ana Souza', condition: 'Reabilitação pós-fratura fêmur', status: 'stable' },
  { id: 2, name: 'Carlos Lima', condition: 'Lesão LCA joelho direito', status: 'warning' },
  { id: 3, name: 'Maria Oliveira', condition: 'AVC isquêmico — fase aguda', status: 'critical' },
  { id: 4, name: 'João Ferreira', condition: 'Pós-artroplastia quadril', status: 'stable' },
  { id: 5, name: 'Beatriz Costa', condition: 'Paralisia cerebral — fisio motora', status: 'warning' },
];

 
export const telemetryService = {
  
  async getPatients(): Promise<Patient[]> {
    try {
      const { data } = await api.get<Patient[]>('/patients');
      return data;
    } catch {
      return MOCK_PATIENTS;
    }
  },
 
  async getPatient(id: number): Promise<Patient> {
    try {
      const { data } = await api.get<Patient>(`/patients/${id}`);
      return data;
    } catch {
      return MOCK_PATIENTS.find(p => p.id === id) ?? MOCK_PATIENTS[0];
    }
  },
 
  async getTelemetry(patientId: number): Promise<TelemetryData> {
    try {
      const { data } = await api.get<TelemetryData>(`/telemetry/${patientId}`);
      return data;
    } catch {
      const patient = MOCK_PATIENTS.find(p => p.id === patientId);
      return {
        patientId,
        status: patient?.status ?? 'stable',
        heartRate: 60 + Math.floor(Math.random() * 40),
        spo2: 94 + Math.floor(Math.random() * 6),
        temperature: parseFloat((36.2 + Math.random() * 1.5).toFixed(1)),
        emg: {
          bicepsRight: Math.floor(Math.random() * 80),
          bicepsLeft: Math.floor(Math.random() * 70),
          quadRight: Math.floor(Math.random() * 90),
          quadLeft: Math.floor(Math.random() * 85),
        },
        imu: {
          kneeAngle: Math.floor(Math.random() * 120),
          hipAngle: Math.floor(Math.random() * 90),
        },
      };
    }
  },
 
  
  async deletePatient(id: number): Promise<void> {
    try {
      await api.delete(`/patients/${id}`);
    } catch {
      // Mock: ignora erro em desenvolvimento
      console.warn(`[mock] Paciente ${id} removido localmente.`);
    }
  },
 
 
  async createPatient(patient: Omit<Patient, 'id'>): Promise<Patient> {
    const { data } = await api.post<Patient>('/patients', patient);
    return data;
  },
 

  async updatePatient(id: number, patient: Partial<Patient>): Promise<Patient> {
    const { data } = await api.put<Patient>(`/patients/${id}`, patient);
    return data;
  },
};