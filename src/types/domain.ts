export type UserRole = 'family' | 'caregiver' | 'admin';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
};

export type PatientCondition = {
  id: string;
  name: string;
  notes?: string;
};

export type Patient = {
  id: string;
  name: string;
  birthDate?: string;
  age?: number;
  address?: string;
  photoUrl?: string;
  conditions: PatientCondition[];
  dependencyLevel?: number;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship?: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type CareRelationship = {
  id: string;
  patientId: string;
  familyUserId: string;
  caregiverUserId?: string;
  status: 'pending' | 'active' | 'inactive';
  createdAt: string;
};

export type MedicationScheduleStatus = 'pending' | 'administered' | 'late' | 'skipped' | 'upcoming';

export type Medication = {
  id: string;
  patientId: string;
  name: string;
  dose: string;
  instructions?: string;
  scheduledTimes: string[];
  active: boolean;
};

export type MedicationAdministration = {
  id: string;
  medicationId: string;
  patientId: string;
  caregiverUserId: string;
  scheduledTime: string;
  administeredAt?: string;
  status: MedicationScheduleStatus;
  notes?: string;
};

export type ActivityType =
  | 'check_in'
  | 'check_out'
  | 'medication'
  | 'meal'
  | 'hygiene'
  | 'vitals'
  | 'mobility'
  | 'observation'
  | 'occurrence';

export type Activity = {
  id: string;
  patientId: string;
  caregiverUserId: string;
  type: ActivityType;
  title: string;
  description?: string;
  occurredAt: string;
  createdAt: string;
};

export type OccurrenceSeverity = 'low' | 'medium' | 'high';

export type Occurrence = {
  id: string;
  patientId: string;
  caregiverUserId: string;
  severity: OccurrenceSeverity;
  type: 'fall' | 'pain' | 'food_refusal' | 'behavior_change' | 'malaise' | 'other';
  description: string;
  occurredAt: string;
  createdAt: string;
};

export type VitalSign = {
  id: string;
  patientId: string;
  caregiverUserId: string;
  label: string;
  value: string;
  unit?: string;
  status?: 'normal' | 'attention' | 'critical';
  measuredAt: string;
};

export type DailyReport = {
  id: string;
  patientId: string;
  date: string;
  summary: string;
  checkInAt?: string;
  checkOutAt?: string;
  activities: Activity[];
  medicationAdministrations: MedicationAdministration[];
  occurrences: Occurrence[];
  notes?: string;
  createdAt: string;
};

export type AlertType = 'check_in_late' | 'medication_late' | 'occurrence' | 'vital_change' | 'report_ready';

export type Alert = {
  id: string;
  patientId: string;
  type: AlertType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};
