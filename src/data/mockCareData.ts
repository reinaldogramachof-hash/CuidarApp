import type {
  Activity,
  Alert,
  DailyReport,
  Medication,
  MedicationAdministration,
  Occurrence,
  Patient,
  User,
  VitalSign,
} from '../types/domain';

export const mockFamilyUser: User = {
  id: 'family-001',
  name: 'Mariana Silva',
  email: 'mariana@example.com',
  role: 'family',
  createdAt: '2026-05-01T08:00:00.000Z',
};

export const mockCaregiverUser: User = {
  id: 'caregiver-001',
  name: 'Ana Lima',
  email: 'ana.lima@example.com',
  role: 'caregiver',
  avatarUrl: 'https://i.pravatar.cc/150?img=32',
  createdAt: '2026-05-01T08:00:00.000Z',
};

export const mockPatient: Patient = {
  id: 'patient-001',
  name: 'Maria da Silva',
  age: 78,
  birthDate: '1948-03-14',
  address: 'Rua das Acácias, 142 – Moema, SP',
  photoUrl: 'https://i.pravatar.cc/150?img=47',
  dependencyLevel: 65,
  conditions: [
    { id: 'condition-001', name: 'Hipertensão' },
    { id: 'condition-002', name: 'Diabetes Tipo 2' },
    { id: 'condition-003', name: 'Mobilidade Reduzida' },
    { id: 'condition-004', name: 'Risco de Queda' },
  ],
  emergencyContact: {
    name: 'Mariana Silva',
    phone: '(11) 99999-0000',
    relationship: 'Filha',
  },
  createdAt: '2026-05-01T08:00:00.000Z',
  updatedAt: '2026-05-01T08:00:00.000Z',
};

export const mockMedications: Medication[] = [
  {
    id: 'med-001',
    patientId: mockPatient.id,
    name: 'Losartana',
    dose: '50mg',
    scheduledTimes: ['08:00', '20:00'],
    active: true,
  },
  {
    id: 'med-002',
    patientId: mockPatient.id,
    name: 'Atorvastatina',
    dose: '20mg',
    scheduledTimes: ['08:00'],
    active: true,
  },
  {
    id: 'med-003',
    patientId: mockPatient.id,
    name: 'Complexo B',
    dose: '1 comprimido',
    scheduledTimes: ['08:00'],
    active: true,
  },
  {
    id: 'med-004',
    patientId: mockPatient.id,
    name: 'Metformina',
    dose: '500mg',
    scheduledTimes: ['14:00'],
    active: true,
  },
];

export const mockMedicationAdministrations: MedicationAdministration[] = [
  {
    id: 'admin-001',
    medicationId: 'med-001',
    patientId: mockPatient.id,
    caregiverUserId: mockCaregiverUser.id,
    scheduledTime: '08:00',
    administeredAt: '2026-05-02T08:32:00.000Z',
    status: 'administered',
  },
  {
    id: 'admin-002',
    medicationId: 'med-002',
    patientId: mockPatient.id,
    caregiverUserId: mockCaregiverUser.id,
    scheduledTime: '08:00',
    administeredAt: '2026-05-02T08:33:00.000Z',
    status: 'administered',
  },
  {
    id: 'admin-003',
    medicationId: 'med-003',
    patientId: mockPatient.id,
    caregiverUserId: mockCaregiverUser.id,
    scheduledTime: '08:00',
    administeredAt: '2026-05-02T08:35:00.000Z',
    status: 'administered',
  },
  {
    id: 'admin-004',
    medicationId: 'med-004',
    patientId: mockPatient.id,
    caregiverUserId: mockCaregiverUser.id,
    scheduledTime: '14:00',
    status: 'pending',
  },
];

export const mockActivities: Activity[] = [
  {
    id: 'activity-001',
    patientId: mockPatient.id,
    caregiverUserId: mockCaregiverUser.id,
    type: 'check_in',
    title: 'Check-in de Ana Lima',
    occurredAt: '2026-05-02T07:32:00.000Z',
    createdAt: '2026-05-02T07:32:00.000Z',
  },
  {
    id: 'activity-002',
    patientId: mockPatient.id,
    caregiverUserId: mockCaregiverUser.id,
    type: 'meal',
    title: 'Café da manhã realizado',
    occurredAt: '2026-05-02T08:00:00.000Z',
    createdAt: '2026-05-02T08:00:00.000Z',
  },
  {
    id: 'activity-003',
    patientId: mockPatient.id,
    caregiverUserId: mockCaregiverUser.id,
    type: 'medication',
    title: 'Losartana 50mg administrada',
    occurredAt: '2026-05-02T08:32:00.000Z',
    createdAt: '2026-05-02T08:32:00.000Z',
  },
  {
    id: 'activity-004',
    patientId: mockPatient.id,
    caregiverUserId: mockCaregiverUser.id,
    type: 'hygiene',
    title: 'Banho assistido concluído',
    occurredAt: '2026-05-02T09:15:00.000Z',
    createdAt: '2026-05-02T09:15:00.000Z',
  },
  {
    id: 'activity-005',
    patientId: mockPatient.id,
    caregiverUserId: mockCaregiverUser.id,
    type: 'vitals',
    title: 'Sinais vitais aferidos',
    occurredAt: '2026-05-02T09:45:00.000Z',
    createdAt: '2026-05-02T09:45:00.000Z',
  },
];

export const mockOccurrences: Occurrence[] = [
  {
    id: 'occurrence-001',
    patientId: mockPatient.id,
    caregiverUserId: mockCaregiverUser.id,
    severity: 'medium',
    type: 'fall',
    description: 'Queda leve ao se levantar, sem ferimentos. Médico notificado.',
    occurredAt: '2026-04-28T15:00:00.000Z',
    createdAt: '2026-04-28T15:05:00.000Z',
  },
  {
    id: 'occurrence-002',
    patientId: mockPatient.id,
    caregiverUserId: mockCaregiverUser.id,
    severity: 'low',
    type: 'food_refusal',
    description: 'Recusa alimentar no jantar. Ingeriu líquidos normalmente.',
    occurredAt: '2026-04-25T19:20:00.000Z',
    createdAt: '2026-04-25T19:30:00.000Z',
  },
];

export const mockVitalSigns: VitalSign[] = [
  {
    id: 'vital-001',
    patientId: mockPatient.id,
    caregiverUserId: mockCaregiverUser.id,
    label: 'Pressão Arterial',
    value: '120/80',
    unit: 'mmHg',
    status: 'normal',
    measuredAt: '2026-05-02T09:45:00.000Z',
  },
  {
    id: 'vital-002',
    patientId: mockPatient.id,
    caregiverUserId: mockCaregiverUser.id,
    label: 'Glicemia',
    value: '98',
    unit: 'mg/dL',
    status: 'normal',
    measuredAt: '2026-05-02T09:45:00.000Z',
  },
  {
    id: 'vital-003',
    patientId: mockPatient.id,
    caregiverUserId: mockCaregiverUser.id,
    label: 'SpO₂',
    value: '97',
    unit: '%',
    status: 'normal',
    measuredAt: '2026-05-02T09:45:00.000Z',
  },
  {
    id: 'vital-004',
    patientId: mockPatient.id,
    caregiverUserId: mockCaregiverUser.id,
    label: 'Temperatura',
    value: '36.4',
    unit: '°C',
    status: 'normal',
    measuredAt: '2026-05-02T09:45:00.000Z',
  },
];

export const mockAlerts: Alert[] = [
  {
    id: 'alert-001',
    patientId: mockPatient.id,
    type: 'medication_late',
    title: 'URGENTE',
    message: 'Metformina das 14h com 48min de atraso',
    read: false,
    createdAt: '2026-05-02T14:48:00.000Z',
  },
  {
    id: 'alert-002',
    patientId: mockPatient.id,
    type: 'occurrence',
    title: 'ATENÇÃO',
    message: 'Ana Lima reportou queda leve — sem ferimentos',
    read: false,
    createdAt: '2026-05-02T12:00:00.000Z',
  },
  {
    id: 'alert-003',
    patientId: mockPatient.id,
    type: 'report_ready',
    title: 'RELATÓRIO',
    message: 'Relatório semanal disponível para download',
    read: true,
    createdAt: '2026-05-01T19:00:00.000Z',
  },
];

export const mockDailyReport: DailyReport = {
  id: 'report-001',
  patientId: mockPatient.id,
  date: '2026-05-02',
  summary: 'Dia estável, com medicações da manhã administradas, sinais vitais dentro do esperado e uma pendência de medicação à tarde.',
  checkInAt: '2026-05-02T07:32:00.000Z',
  activities: mockActivities,
  medicationAdministrations: mockMedicationAdministrations,
  occurrences: [],
  notes: 'Acompanhar administração da Metformina no período da tarde.',
  createdAt: '2026-05-02T19:30:00.000Z',
};
