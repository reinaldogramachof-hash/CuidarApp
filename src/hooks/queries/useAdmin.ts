import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import type { Database } from '../../types/supabase'

type Patient = Database['public']['Tables']['patients']['Row']
type PatientInsert = Database['public']['Tables']['patients']['Insert']
type PatientUpdate = Database['public']['Tables']['patients']['Update']
type Shift = Database['public']['Tables']['shifts']['Row']
type ShiftInsert = Database['public']['Tables']['shifts']['Insert']

// Conta resumos do dashboard
export function useClinicSummary(clinicId: string) {
  return useQuery({
    queryKey: ['clinic_summary', clinicId],
    queryFn: async () => {
      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)

      const [patientsRes, shiftsRes, alertsRes] = await Promise.all([
        (supabase.from('patients') as any).select('id', { count: 'exact' })
          .eq('clinic_id', clinicId).eq('is_active', true),
        (supabase.from('shifts') as any).select('id, status', { count: 'exact' })
          .eq('clinic_id', clinicId)
          .gte('start_time', todayStart.toISOString()),
        (supabase.from('alerts') as any).select('id', { count: 'exact' })
          .eq('clinic_id', clinicId).eq('is_read', false)
      ])
      
      return {
        totalPatients: patientsRes.count ?? 0,
        todayShifts: shiftsRes.count ?? 0,
        activeShifts: (shiftsRes.data as any[])?.filter(s => s.status === 'active').length ?? 0,
        unreadAlerts: alertsRes.count ?? 0,
      }
    },
    enabled: !!clinicId,
    refetchInterval: 60000,
  })
}

// Lista pacientes ativos da clínica
export function useClinicPatients(clinicId: string) {
  return useQuery({
    queryKey: ['clinic_patients', clinicId],
    queryFn: async () => {
      const { data, error } = await (supabase.from('patients') as any)
        .select('*')
        .eq('clinic_id', clinicId)
        .eq('is_active', true)
        .order('full_name', { ascending: true })
      
      if (error) throw error
      return data as Patient[]
    },
    enabled: !!clinicId,
  })
}

// Lista cuidadores da clínica
export function useClinicCaregivers(clinicId: string) {
  return useQuery({
    queryKey: ['clinic_caregivers', clinicId],
    queryFn: async () => {
      const { data, error } = await (supabase.from('user_profiles') as any)
        .select('*')
        .eq('clinic_id', clinicId)
        .eq('role', 'caregiver')
        .order('full_name', { ascending: true })
      
      if (error) throw error
      return data as any[]
    },
    enabled: !!clinicId,
  })
}

// Lista turnos do dia da clínica
export function useTodayShifts(clinicId: string) {
  return useQuery({
    queryKey: ['today_shifts', clinicId],
    queryFn: async () => {
      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)
      
      const { data, error } = await (supabase.from('shifts') as any)
        .select(`*, patients(*), caregiver:user_profiles!caregiver_id(full_name)`)
        .eq('clinic_id', clinicId)
        .gte('start_time', todayStart.toISOString())
        .order('start_time', { ascending: true })
      
      if (error) throw error
      return data as any[]
    },
    enabled: !!clinicId,
    refetchInterval: 30000,
  })
}

// Lista alertas não lidos da clínica
export function useClinicAlerts(clinicId: string) {
  return useQuery({
    queryKey: ['clinic_alerts', clinicId],
    queryFn: async () => {
      const { data, error } = await (supabase.from('alerts') as any)
        .select('*, patients(full_name)')
        .eq('clinic_id', clinicId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as any[]
    },
    enabled: !!clinicId,
  })
}

// Mutation: criar paciente
export function useCreatePatient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (patient: PatientInsert) => {
      const { data, error } = await (supabase.from('patients') as any)
        .insert(patient)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clinic_patients', (variables as any).clinic_id] })
      queryClient.invalidateQueries({ queryKey: ['clinic_summary', (variables as any).clinic_id] })
    }
  })
}

// Mutation: atualizar paciente
export function useUpdatePatient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, updates, clinicId: _clinicId }: { id: string, updates: PatientUpdate, clinicId: string }) => {
      const { data, error } = await (supabase.from('patients') as any)
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clinic_patients', (variables as any).clinicId] })
      queryClient.invalidateQueries({ queryKey: ['clinic_summary', (variables as any).clinicId] })
    }
  })
}

// Mutation: criar turno
export function useCreateShift() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (shift: ShiftInsert) => {
      const { data, error } = await (supabase.from('shifts') as any)
        .insert(shift)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['today_shifts', (variables as any).clinic_id] })
      queryClient.invalidateQueries({ queryKey: ['clinic_summary', (variables as any).clinic_id] })
    }
  })
}

// Mutation: marcar alerta como lido
export function useMarkAlertRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ alertId, clinicId: _clinicId }: { alertId: string, clinicId: string }) => {
      const { error } = await (supabase.from('alerts') as any)
        .update({ is_read: true })
        .eq('id', alertId)
      
      if (error) throw error
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clinic_alerts', (variables as any).clinicId] })
      queryClient.invalidateQueries({ queryKey: ['clinic_summary', (variables as any).clinicId] })
    }
  })
}
