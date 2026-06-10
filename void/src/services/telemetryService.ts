export interface Patient {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  limiteEsforcoCritico: number;
}
 
export interface TelemetryData {
  status: 'normal' | 'critical';
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
 
let mockPatients: Patient[] = [
  { id: 1, nome: 'Pedro Duarte',     cpf: '12345678901', email: 'pedro@void.com',     limiteEsforcoCritico: 40 },
  { id: 2, nome: 'Guilherme Macedo', cpf: '98765432109', email: 'guilherme@void.com', limiteEsforcoCritico: 75 },
  { id: 3, nome: 'Henrique Martins', cpf: '11122233344', email: 'henrique@void.com',  limiteEsforcoCritico: 30 },
  { id: 4, nome: 'Ana Souza',        cpf: '55566677788', email: 'ana@void.com',        limiteEsforcoCritico: 62 },
];
 
function rand(min: number, max: number) {
  return Math.round(min + Math.random() * (max - min));
}
 
export const telemetryService = {
  async getPatients(): Promise<Patient[]> {
    return Promise.resolve([...mockPatients]);
  },
 
  async createPatient(data: Omit<Patient, 'id'>): Promise<Patient> {
    const novo: Patient = { ...data, id: Date.now() };
    mockPatients.push(novo);
    return Promise.resolve(novo);
  },
 
  async deletePatient(id: number): Promise<void> {
    mockPatients = mockPatients.filter(p => p.id !== id);
    return Promise.resolve();
  },
 
  async getTelemetry(patientId: number): Promise<TelemetryData> {
    const patient = mockPatients.find(p => p.id === patientId);
    const isCritical = patient ? patient.limiteEsforcoCritico > 60 : false;
 
    return Promise.resolve({
      status: isCritical ? 'critical' : 'normal',
      heartRate:   rand(isCritical ? 100 : 60, isCritical ? 150 : 95),
      spo2:        rand(isCritical ? 88  : 95,  99),
      temperature: parseFloat((36 + Math.random() * 1.5).toFixed(1)),
      emg: {
        bicepsRight: rand(10, isCritical ? 90 : 50),
        bicepsLeft:  rand(10, isCritical ? 90 : 50),
        quadRight:   rand(15, isCritical ? 95 : 60),
        quadLeft:    rand(15, isCritical ? 95 : 60),
      },
      imu: {
        kneeAngle: rand(5, isCritical ? 140 : 60),
        hipAngle:  rand(5, isCritical ? 120 : 45),
      },
    });
  },
};