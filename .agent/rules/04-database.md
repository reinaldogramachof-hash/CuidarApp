# Banco de Dados — Supabase (PostgreSQL)

**Escopo:** Ativado quando o contexto envolve banco de dados, migrations, queries, RLS ou Auth

## Decisão de Arquitetura

**Escolha: Supabase** sobre Firebase.

| Critério | Supabase | Firebase |
|---|---|---|
| Modelo de dados | PostgreSQL relacional | NoSQL (Firestore) |
| Dados de saúde | Ideal (estruturado, relacional) | Complexo (desnormalizado) |
| RLS (isolamento por clínica) | Nativo e declarativo | Manual e complexo |
| Realtime | WebSocket nativo | WebSocket nativo |
| Auth + LGPD | Integrado, open source | Integrado, Google |
| Queries complexas | SQL completo | Limitado |
| Familiaridade do time | Alta (usuário experiente) | Menor |

## Schema do Banco de Dados

### Tabela: `clinics`
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
name        text NOT NULL
cnpj        text UNIQUE
address     text
phone       text
created_at  timestamptz DEFAULT now()
```

### Tabela: `user_profiles`
```sql
id          uuid PRIMARY KEY REFERENCES auth.users(id)
clinic_id   uuid REFERENCES clinics(id)
role        text CHECK (role IN ('admin', 'caregiver', 'family'))
full_name   text NOT NULL
phone       text
avatar_url  text
created_at  timestamptz DEFAULT now()
```

### Tabela: `patients`
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
clinic_id       uuid REFERENCES clinics(id) NOT NULL
full_name       text NOT NULL
date_of_birth   date
cpf             text
photo_url       text
condition       text
room_unit       text
is_active       boolean DEFAULT true
deleted_at      timestamptz
created_at      timestamptz DEFAULT now()
```

### Tabela: `patient_family`
```sql
patient_id  uuid REFERENCES patients(id)
user_id     uuid REFERENCES user_profiles(id)
relation    text
PRIMARY KEY (patient_id, user_id)
```

### Tabela: `shifts`
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
clinic_id       uuid REFERENCES clinics(id)
caregiver_id    uuid REFERENCES user_profiles(id)
patient_id      uuid REFERENCES patients(id)
start_time      timestamptz NOT NULL
end_time        timestamptz NOT NULL
checkin_at      timestamptz
checkout_at     timestamptz
status          text CHECK (status IN ('scheduled','active','completed','missed'))
created_at      timestamptz DEFAULT now()
```

### Tabela: `care_events`
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
shift_id    uuid REFERENCES shifts(id)
patient_id  uuid REFERENCES patients(id)
caregiver_id uuid REFERENCES user_profiles(id)
event_type  text CHECK (event_type IN ('feeding','hygiene','medication','dressing','repositioning','other'))
notes       text
occurred_at timestamptz DEFAULT now()
created_at  timestamptz DEFAULT now()
```

### Tabela: `vital_signs`
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
patient_id      uuid REFERENCES patients(id)
caregiver_id    uuid REFERENCES user_profiles(id)
shift_id        uuid REFERENCES shifts(id)
spo2            numeric(5,2)       -- Saturação O2 (%)
systolic_bp     integer            -- Pressão sistólica
diastolic_bp    integer            -- Pressão diastólica
heart_rate      integer            -- BPM
temperature     numeric(4,1)       -- Graus Celsius
glucose         integer            -- mg/dL
alert_triggered boolean DEFAULT false
measured_at     timestamptz DEFAULT now()
created_at      timestamptz DEFAULT now()
```

### Tabela: `alerts`
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
patient_id      uuid REFERENCES patients(id)
clinic_id       uuid REFERENCES clinics(id)
vital_sign_id   uuid REFERENCES vital_signs(id)
severity        text CHECK (severity IN ('low','medium','high','critical'))
type            text
message         text NOT NULL
is_read         boolean DEFAULT false
created_at      timestamptz DEFAULT now()
```

### Tabela: `audit_log` (LGPD)
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id     uuid REFERENCES user_profiles(id)
action      text NOT NULL
table_name  text
record_id   uuid
metadata    jsonb
created_at  timestamptz DEFAULT now()
```

## Regras de Migration

1. Nunca escrever SQL DROP sem aprovação explícita do Arquiteto
2. Migrations são sempre arquivos versionados em `/supabase/migrations/`
3. Formato: `YYYYMMDDHHMMSS_descricao_snake_case.sql`
4. Após gerar uma migration, PARE e aguarde revisão antes de aplicar
5. Usar `supabase db push` apenas em desenvolvimento
6. Produção: CI/CD via `supabase db push --linked`

## Thresholds de Alertas de Sinais Vitais

```typescript
export const VITAL_THRESHOLDS = {
  spo2:        { critical: 90, warning: 94 },        // % — abaixo = alerta
  systolic_bp: { critical_high: 180, warning_high: 160, critical_low: 90 },
  diastolic_bp:{ critical_high: 120, warning_high: 100 },
  heart_rate:  { critical_high: 120, warning_high: 100, critical_low: 50 },
  temperature: { critical_high: 39.5, warning_high: 38.0, critical_low: 35.0 },
  glucose:     { critical_high: 400, warning_high: 250, critical_low: 70 },
}
```
