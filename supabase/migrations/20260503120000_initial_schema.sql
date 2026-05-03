-- 1. Clinics
CREATE TABLE clinics (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  cnpj        text UNIQUE,
  address     text,
  phone       text,
  created_at  timestamptz DEFAULT now()
);
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;

-- 2. User Profiles
CREATE TABLE user_profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  clinic_id   uuid REFERENCES clinics(id),
  role        text CHECK (role IN ('admin', 'caregiver', 'family')),
  full_name   text NOT NULL,
  phone       text,
  avatar_url  text,
  created_at  timestamptz DEFAULT now()
);
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 3. Patients
CREATE TABLE patients (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id       uuid REFERENCES clinics(id) NOT NULL,
  full_name       text NOT NULL,
  date_of_birth   date,
  cpf             text,
  photo_url       text,
  condition       text,
  room_unit       text,
  is_active       boolean DEFAULT true,
  deleted_at      timestamptz,
  created_at      timestamptz DEFAULT now()
);
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- 4. Patient Family (Relationship)
CREATE TABLE patient_family (
  patient_id  uuid REFERENCES patients(id) ON DELETE CASCADE,
  user_id     uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  relation    text,
  PRIMARY KEY (patient_id, user_id)
);
ALTER TABLE patient_family ENABLE ROW LEVEL SECURITY;

-- 5. Shifts (Turnos)
CREATE TABLE shifts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id       uuid REFERENCES clinics(id),
  caregiver_id    uuid REFERENCES user_profiles(id),
  patient_id      uuid REFERENCES patients(id),
  start_time      timestamptz NOT NULL,
  end_time        timestamptz NOT NULL,
  checkin_at      timestamptz,
  checkout_at     timestamptz,
  status          text CHECK (status IN ('scheduled','active','completed','missed')),
  created_at      timestamptz DEFAULT now()
);
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;

-- 6. Care Events
CREATE TABLE care_events (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_id     uuid REFERENCES shifts(id) ON DELETE CASCADE,
  patient_id   uuid REFERENCES patients(id) ON DELETE CASCADE,
  caregiver_id uuid REFERENCES user_profiles(id),
  event_type   text CHECK (event_type IN ('feeding','hygiene','medication','dressing','repositioning','other')),
  notes        text,
  occurred_at  timestamptz DEFAULT now(),
  created_at   timestamptz DEFAULT now()
);
ALTER TABLE care_events ENABLE ROW LEVEL SECURITY;

-- 7. Vital Signs
CREATE TABLE vital_signs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      uuid REFERENCES patients(id) ON DELETE CASCADE,
  caregiver_id    uuid REFERENCES user_profiles(id),
  shift_id        uuid REFERENCES shifts(id),
  spo2            numeric(5,2),
  systolic_bp     integer,
  diastolic_bp    integer,
  heart_rate      integer,
  temperature     numeric(4,1),
  glucose         integer,
  alert_triggered boolean DEFAULT false,
  measured_at     timestamptz DEFAULT now(),
  created_at      timestamptz DEFAULT now()
);
ALTER TABLE vital_signs ENABLE ROW LEVEL SECURITY;

-- 8. Alerts
CREATE TABLE alerts (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id    uuid REFERENCES patients(id) ON DELETE CASCADE,
  clinic_id     uuid REFERENCES clinics(id),
  vital_sign_id uuid REFERENCES vital_signs(id),
  severity      text CHECK (severity IN ('low','medium','high','critical')),
  type          text,
  message       text NOT NULL,
  is_read       boolean DEFAULT false,
  created_at    timestamptz DEFAULT now()
);
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- 9. Audit Log
CREATE TABLE audit_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES user_profiles(id),
  action      text NOT NULL,
  table_name  text,
  record_id   uuid,
  metadata    jsonb,
  created_at  timestamptz DEFAULT now()
);
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
