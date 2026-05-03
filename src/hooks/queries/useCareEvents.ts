import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import type { Database } from '../../types/supabase'

type CareEvent = Database['public']['Tables']['care_events']['Row']
type CareEventInsert = Database['public']['Tables']['care_events']['Insert']

// Busca eventos de um turno
export function useCareEvents(shiftId: string) {
  return useQuery({
    queryKey: ['care_events', shiftId],
    queryFn: async () => {
      const { data, error } = await (supabase.from('care_events') as any)
        .select('*')
        .eq('shift_id', shiftId)
        .order('occurred_at', { ascending: false })
      
      if (error) throw error
      return data as CareEvent[]
    },
    enabled: !!shiftId,
  })
}

// Mutation: registrar evento
export function useAddCareEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (event: any) => {
      const { data, error } = await (supabase.from('care_events') as any)
        .insert({
          ...event,
          occurred_at: event.occurred_at || new Date().toISOString()
        })
        .select()
        .single()
      
      if (error) throw error
      if (!data) throw new Error('Falha ao registrar evento')
      return data
    },
    onSuccess: (data) => {
      if (data && (data as any).shift_id) {
        queryClient.invalidateQueries({ queryKey: ['care_events', (data as any).shift_id] })
      }
    }
  })
}
