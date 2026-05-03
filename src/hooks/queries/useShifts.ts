import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import type { Database } from '../../types/supabase'

type ShiftWithPatient = Database['public']['Tables']['shifts']['Row'] & {
  patients: Database['public']['Tables']['patients']['Row'] | null
}

// Busca turnos do cuidador logado (hoje + futuros)
export function useMyShifts(caregiverId: string) {
  return useQuery({
    queryKey: ['shifts', caregiverId],
    queryFn: async () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const { data, error } = await (supabase.from('shifts') as any)
        .select(`*, patients(*)`)
        .eq('caregiver_id', caregiverId)
        .gte('start_time', today.toISOString())
        .order('start_time', { ascending: true })
      
      if (error) throw error
      return data as ShiftWithPatient[]
    },
    enabled: !!caregiverId,
  })
}

// Mutation: check-in (muda status para 'active', seta checkin_at)
export function useCheckIn() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ shiftId }: { shiftId: string }) => {
      const { data, error } = await (supabase.from('shifts') as any)
        .update({ 
          status: 'active', 
          checkin_at: new Date().toISOString() 
        })
        .eq('id', shiftId)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: (_, { shiftId }) => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] })
      queryClient.invalidateQueries({ queryKey: ['shift', shiftId] })
    }
  })
}

// Mutation: check-out (muda status para 'completed', seta checkout_at)
export function useCheckOut() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ shiftId }: { shiftId: string }) => {
      const { data, error } = await (supabase.from('shifts') as any)
        .update({ 
          status: 'completed', 
          checkout_at: new Date().toISOString() 
        })
        .eq('id', shiftId)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: (_, { shiftId }) => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] })
      queryClient.invalidateQueries({ queryKey: ['shift', shiftId] })
    }
  })
}

// Hook para buscar um turno específico
export function useShift(shiftId: string) {
  return useQuery({
    queryKey: ['shift', shiftId],
    queryFn: async () => {
      const { data, error } = await (supabase.from('shifts') as any)
        .select(`*, patients(*)`)
        .eq('id', shiftId)
        .single()
      
      if (error) throw error
      return data as ShiftWithPatient
    },
    enabled: !!shiftId,
  })
}
