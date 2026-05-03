# Banco de Dados — Supabase

## Por que Supabase?

O CuidarApp lida com dados de saúde estruturados e relacionais: pacientes têm cuidadores,
cuidadores têm turnos, turnos têm eventos de cuidado e sinais vitais. Esse modelo
é naturalmente relacional, fazendo do PostgreSQL (via Supabase) a escolha ideal.

**Vantagens específicas para o projeto:**
- RLS (Row Level Security) nativo — isolamento entre clínicas sem lógica extra no frontend
- Realtime nativo — sinais vitais atualizados em tempo real para o familiar
- Auth integrado — Supabase Auth com JWT pronto para LGPD
- Storage integrado — fotos dos pacientes sem servidor adicional
- O desenvolvedor já tem familiaridade com a plataforma

## Schema Completo

Ver definições detalhadas em `.agent/rules/04-database.md`.

## Políticas RLS

### Tabela: `patients`
```sql
-- Admin vê apenas pacientes de sua clínica
CREATE POLICY "admin_select_patients"
ON patients FOR SELECT
TO authenticated
USING (
  clinic_id = (
    SELECT clinic_id FROM user_profiles WHERE id = auth.uid()
  )
  AND
  (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
);

-- Familiar vê apenas seu paciente
CREATE POLICY "family_select_patient"
ON patients FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT patient_id FROM patient_family WHERE user_id = auth.uid()
  )
);

-- Cuidador vê pacientes dos seus turnos ativos
CREATE POLICY "caregiver_select_patients"
ON patients FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT patient_id FROM shifts
    WHERE caregiver_id = auth.uid()
    AND status IN ('scheduled', 'active')
  )
);
```

### Tabela: `vital_signs`
```sql
-- Caregiver pode inserir sinais vitais apenas para pacientes do seu turno
CREATE POLICY "caregiver_insert_vitals"
ON vital_signs FOR INSERT
TO authenticated
WITH CHECK (
  caregiver_id = auth.uid()
  AND patient_id IN (
    SELECT patient_id FROM shifts
    WHERE caregiver_id = auth.uid() AND status = 'active'
  )
);

-- Familiar pode ler sinais vitais do seu paciente
CREATE POLICY "family_select_vitals"
ON vital_signs FOR SELECT
TO authenticated
USING (
  patient_id IN (
    SELECT patient_id FROM patient_family WHERE user_id = auth.uid()
  )
);

-- Admin pode ler todos os sinais vitais da sua clínica
CREATE POLICY "admin_select_vitals"
ON vital_signs FOR SELECT
TO authenticated
USING (
  patient_id IN (
    SELECT id FROM patients
    WHERE clinic_id = (
      SELECT clinic_id FROM user_profiles WHERE id = auth.uid()
    )
  )
);
```

## Thresholds de Alerta de Sinais Vitais

| Sinal | Crítico Baixo | Alerta Baixo | Normal | Alerta Alto | Crítico Alto |
|---|---|---|---|---|---|
| SpO2 (%) | < 90 | 90–93 | 94–100 | — | — |
| Pressão Sistólica | < 90 | 90–100 | 100–140 | 140–160 | > 160 |
| Pressão Diastólica | — | — | 60–90 | 90–110 | > 110 |
| Frequência Cardíaca | < 50 | 50–60 | 60–100 | 100–120 | > 120 |
| Temperatura (°C) | < 35,0 | 35,0–36,0 | 36,0–37,5 | 37,5–39,5 | > 39,5 |
| Glicemia (mg/dL) | < 70 | 70–80 | 80–160 | 160–250 | > 250 |

## Estratégia de Migrations

### Convenção de Nomenclatura
```
supabase/migrations/
├── 20260502120000_initial_schema.sql
├── 20260502130000_rls_policies.sql
├── 20260502140000_seed_data.sql
└── 20260515000000_add_caregiver_module.sql
```

### Checklist Antes de Aplicar Migration
1. SQL revisado pelo Arquiteto (Claude Code)
2. Não contém DROP sem aprovação
3. RLS habilitado em todas as novas tabelas
4. Tipos TypeScript regenerados após aplicação
5. Testado em ambiente local antes do staging

## Tipos TypeScript (Auto-gerados)

Após qualquer migration, regenerar:
```bash
supabase gen types typescript --local > src/types/supabase.ts
```

Nunca editar `src/types/supabase.ts` manualmente — é gerado automaticamente.

## Configuração de Ambiente

```bash
# .env.local (NUNCA commitar)
VITE_SUPABASE_URL=https://[project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=[anon-key]

# .env.example (commitar — sem valores)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

O cliente Supabase é inicializado em `src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```
