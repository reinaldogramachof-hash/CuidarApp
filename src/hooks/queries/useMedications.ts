/* 
-- ═══ SPRINT 2: MÓDULO DE MEDICAMENTOS ═══
-- Executar no Supabase Studio > SQL Editor

-- 1. Prescrições ativas do paciente
create table if not exists prescriptions (
  id             uuid primary key default gen_random_uuid(),
  patient_id     uuid not null references patients(id) on delete cascade,
  clinic_id      uuid references clinics(id),
  prescribed_by  text,
  medication_name text not null,
  dose           text not null,
  route          text not null default 'Oral',
  frequency      text not null,           -- ex: "8/8h", "12/12h", "1x/dia"
  times_of_day   text[] not null default '{}', -- ex: ['08:00','20:00']
  start_date     date not null default current_date,
  end_date       date,
  notes          text,
  status         text not null default 'active'
                 check (status in ('active', 'suspended', 'completed')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- 2. Administrações por turno (uma linha por prescrição × turno)
create table if not exists medication_administrations (
  id              uuid primary key default gen_random_uuid(),
  prescription_id uuid not null references prescriptions(id) on delete cascade,
  shift_id        uuid not null references shifts(id) on delete cascade,
  caregiver_id    uuid not null references user_profiles(id),
  patient_id      uuid not null references patients(id),
  administered_at timestamptz not null default now(),
  dose_given      text,
  route_used      text,
  notes           text,
  created_at      timestamptz not null default now(),
  unique (prescription_id, shift_id)  -- impede duplo registro por turno
);

-- 3. RLS — políticas simples para MVP (refinar com auth.uid() na Sprint 3)
alter table prescriptions enable row level security;
alter table medication_administrations enable row level security;

create policy "select_prescriptions" on prescriptions for select using (true);
create policy "insert_prescriptions" on prescriptions for insert with check (true);

create policy "select_med_admin" on medication_administrations for select using (true);
create policy "insert_med_admin" on medication_administrations for insert with check (true);

-- 4. Seed de exemplo (substituir patient_id e clinic_id pelos valores reais)
-- insert into prescriptions (patient_id, medication_name, dose, route, frequency, times_of_day)
-- values
--   ('<patient_id>', 'Losartana',     '50mg',  'Oral', '1x/dia', ARRAY['08:00']),
--   ('<patient_id>', 'Metformina',    '500mg', 'Oral', '2x/dia', ARRAY['08:00','20:00']),
--   ('<patient_id>', 'Atorvastatina', '20mg',  'Oral', '1x/dia', ARRAY['20:00']);
*/

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

// Tipos inline — sem any nos dados de retorno
export type Prescription = {
  id: string
  patient_id: string
  medication_name: string
  dose: string
  route: string
  frequency: string
  times_of_day: string[]
  prescribed_by: string | null
  notes: string | null
  status: 'active' | 'suspended' | 'completed'
}

export type MedicationAdministration = {
  id: string
  prescription_id: string
  shift_id: string
  caregiver_id: string
  patient_id: string
  administered_at: string
  dose_given: string | null
  route_used: string | null
  notes: string | null
  prescription?: Pick<Prescription, 'medication_name' | 'dose' | 'route' | 'frequency'>
}

export function usePrescriptions(patientId: string) {
  return useQuery<Prescription[]>({
    queryKey: ['prescriptions', patientId],
    queryFn: async () => {
      const { data, error } = await (supabase.from('prescriptions') as any)
        .select('*')
        .eq('patient_id', patientId)
        .eq('status', 'active')
        .order('medication_name')
      
      if (error) throw error
      return data || []
    },
    enabled: !!patientId
  })
}

export function useShiftMedications(shiftId: string) {
  return useQuery<MedicationAdministration[]>({
    queryKey: ['shift_medications', shiftId],
    queryFn: async () => {
      const { data, error } = await (supabase.from('medication_administrations') as any)
        .select('*, prescription:prescriptions(medication_name, dose, route, frequency)')
        .eq('shift_id', shiftId)
      
      if (error) throw error
      return (data as any) || []
    },
    enabled: !!shiftId
  })
}

export function useAdministerMedication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {
      prescriptionId: string
      shiftId: string
      caregiverId: string
      patientId: string
      medicationName: string // Necessário para o evento de cuidado
      doseGiven?: string
      routeUsed?: string
      notes?: string
    }) => {
      // 1. Inserir a administração (com upsert para evitar duplicação)
      const { error: adminError } = await (supabase.from('medication_administrations') as any)
        .upsert({
          prescription_id: payload.prescriptionId,
          shift_id: payload.shiftId,
          caregiver_id: payload.caregiverId,
          patient_id: payload.patientId,
          dose_given: payload.doseGiven,
          route_used: payload.routeUsed,
          notes: payload.notes,
          administered_at: new Date().toISOString()
        }, { onConflict: 'prescription_id,shift_id' })

      if (adminError) throw adminError

      // 2. Inserir o care_event correspondente
      const eventNotes = `Medicamento: ${payload.medicationName} | Via: ${payload.routeUsed || 'Oral'} | Dose: ${payload.doseGiven || ''}`
      const { error: eventError } = await (supabase.from('care_events') as any)
        .insert({
          shift_id: payload.shiftId,
          patient_id: payload.patientId,
          caregiver_id: payload.caregiverId,
          event_type: 'medication',
          notes: eventNotes,
          occurred_at: new Date().toISOString()
        })

      if (eventError) throw eventError
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['shift_medications', variables.shiftId] })
      queryClient.invalidateQueries({ queryKey: ['care_events', variables.shiftId] })
    }
  })
}
