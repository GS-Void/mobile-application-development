import { api } from './authService';

export interface Patient {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  limiteEsforcoCritico: number;
}

export interface TelemetryData {
  status: 'normal' | 'warning' | 'critical';
  heartRate: number;
  spo2: number;
  temperature: number;
  emg: {
    bicepsRight: number;
    bicepsLeft: number;
    quadRight: number;
    quadLeft: number;
  };
  imu: {
    kneeAngle: number;
    hipAngle: number;
  };
}

export const telemetryService = {
  
  // Listar todos os pacientes via API .NET (GET)
  async getPatients(): Promise<Patient[]> {
    const response = await api.get('/api/Pacientes');
    return response.data;
  },

  // Cadastrar um novo paciente na API .NET (POST)
  async createPatient(patientData: Omit<Patient, 'id'>): Promise<Patient> {
    const response = await api.post('/api/Pacientes', patientData);
    return response.data;
  },

  // Remover um paciente na API .NET (DELETE)
  async deletePatient(id: number): Promise<void> {
    await api.delete(`/api/Pacientes/${id}`);
  },

  // Buscar os dados de sensores em tempo real na API .NET (GET)
  async getTelemetry(patientId: number): Promise<TelemetryData> {
    const response = await api.get(`/api/Telemetria/${patientId}`);
    return response.data;
  }
  
};