import {
  mockActivities,
  mockAlerts,
  mockDailyReport,
  mockMedicationAdministrations,
  mockMedications,
  mockOccurrences,
  mockPatient,
  mockVitalSigns,
} from '../data/mockCareData';
import type {
  Activity,
  ActivityType,
  Alert,
  DailyReport,
  Medication,
  MedicationAdministration,
  Occurrence,
  OccurrenceSeverity,
  Patient,
  VitalSign,
} from '../types/domain';

export type CreateActivityInput = {
  patientId: string;
  caregiverUserId: string;
  type: ActivityType;
  title: string;
  description?: string;
  occurredAt?: string;
};

export type CreateOccurrenceInput = {
  patientId: string;
  caregiverUserId: string;
  severity: OccurrenceSeverity;
  type: Occurrence['type'];
  description: string;
  occurredAt?: string;
};

export type ConfirmMedicationInput = {
  medicationId: string;
  patientId: string;
  caregiverUserId: string;
  scheduledTime: string;
  administeredAt?: string;
  notes?: string;
};

const wait = async <T>(data: T): Promise<T> =>
  new Promise((resolve) => {
    window.setTimeout(() => resolve(data), 120);
  });

const createId = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;

export const careService = {
  async getPatient(patientId: string): Promise<Patient | null> {
    return wait(mockPatient.id === patientId ? mockPatient : null);
  },

  async listActivities(patientId: string): Promise<Activity[]> {
    return wait(mockActivities.filter((activity) => activity.patientId === patientId));
  },

  async createActivity(input: CreateActivityInput): Promise<Activity> {
    const now = new Date().toISOString();
    return wait({
      id: createId('activity'),
      patientId: input.patientId,
      caregiverUserId: input.caregiverUserId,
      type: input.type,
      title: input.title,
      description: input.description,
      occurredAt: input.occurredAt ?? now,
      createdAt: now,
    });
  },

  async listMedications(patientId: string): Promise<Medication[]> {
    return wait(mockMedications.filter((medication) => medication.patientId === patientId));
  },

  async listMedicationAdministrations(patientId: string): Promise<MedicationAdministration[]> {
    return wait(
      mockMedicationAdministrations.filter(
        (administration) => administration.patientId === patientId,
      ),
    );
  },

  async confirmMedication(input: ConfirmMedicationInput): Promise<MedicationAdministration> {
    const now = new Date().toISOString();
    return wait({
      id: createId('admin'),
      medicationId: input.medicationId,
      patientId: input.patientId,
      caregiverUserId: input.caregiverUserId,
      scheduledTime: input.scheduledTime,
      administeredAt: input.administeredAt ?? now,
      status: 'administered',
      notes: input.notes,
    });
  },

  async listOccurrences(patientId: string): Promise<Occurrence[]> {
    return wait(mockOccurrences.filter((occurrence) => occurrence.patientId === patientId));
  },

  async createOccurrence(input: CreateOccurrenceInput): Promise<Occurrence> {
    const now = new Date().toISOString();
    return wait({
      id: createId('occurrence'),
      patientId: input.patientId,
      caregiverUserId: input.caregiverUserId,
      severity: input.severity,
      type: input.type,
      description: input.description,
      occurredAt: input.occurredAt ?? now,
      createdAt: now,
    });
  },

  async listVitalSigns(patientId: string): Promise<VitalSign[]> {
    return wait(mockVitalSigns.filter((vitalSign) => vitalSign.patientId === patientId));
  },

  async listAlerts(patientId: string): Promise<Alert[]> {
    return wait(mockAlerts.filter((alert) => alert.patientId === patientId));
  },

  async getDailyReport(patientId: string, date: string): Promise<DailyReport | null> {
    const reportMatchesPatient = mockDailyReport.patientId === patientId;
    const reportMatchesDate = mockDailyReport.date === date;
    return wait(reportMatchesPatient && reportMatchesDate ? mockDailyReport : null);
  },
};
