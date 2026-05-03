import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import type { Database } from '../../types/supabase'

type PatientRow = Database['public']['Tables']['patients']['Row']

// Busca o paciente vinculado ao familiar logado (via patient_family)
export function useFamilyPatient(userId: string) {
  return useQuery({
    queryKey: ['family_patient', userId],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('patient_family') as any)
        .select('relation, patients(*)')
        .eq('user_id', userId)
        .single()
      
      if (error) throw error
      return data as { relation: string, patients: PatientRow }
    },
    enabled: !!userId,
  })
}

// Busca o turno ativo ou mais recente do paciente
export function usePatientActiveShift(patientId: string) {
  return useQuery({
    queryKey: ['active_shift', patientId],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('shifts') as any)
        .select('*, caregiver:user_profiles!caregiver_id(full_name)')
        .eq('patient_id', patientId)
        .in('status', ['active', 'scheduled'])
        .order('start_time', { ascending: true })
        .limit(1)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      return data
    },
    enabled: !!patientId,
    refetchInterval: 30000, // revalida a cada 30s
  })
}

// Busca alertas não lidos do paciente
export function usePatientAlerts(patientId: string) {
  return useQuery({
    queryKey: ['alerts', patientId],
    queryFn: async () => {
      const { data, error } = await (supabase.from('alerts') as any)
        .select('*')
        .eq('patient_id', patientId)
        .eq('is_read', false)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },
    enabled: !!patientId,
  })
}
