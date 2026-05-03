import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import type { Database } from '../../types/supabase'

type VitalSign = Database['public']['Tables']['vital_signs']['Row']
type VitalSignInsert = Database['public']['Tables']['vital_signs']['Insert']

// Busca sinais vitais de um turno
export function useShiftVitalSigns(shiftId: string) {
  return useQuery({
    queryKey: ['vital_signs', shiftId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vital_signs')
        .select('*')
        .eq('shift_id', shiftId)
        .order('measured_at', { ascending: false })
      
      if (error) throw error
      return data as VitalSign[]
    },
    enabled: !!shiftId,
  })
}

// Mutation: registrar sinais vitais
export function useAddVitalSigns() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (vitals: any) => {
      // Lógica de alerta
      let alert_triggered = false
      if (vitals.spo2 && vitals.spo2 < 92) alert_triggered = true
      if (vitals.systolic_bp && (vitals.systolic_bp > 160 || vitals.systolic_bp < 90)) alert_triggered = true
      if (vitals.heart_rate && (vitals.heart_rate > 100 || vitals.heart_rate < 50)) alert_triggered = true
      if (vitals.temperature && vitals.temperature > 37.8) alert_triggered = true
      if (vitals.glucose && (vitals.glucose > 180 || vitals.glucose < 70)) alert_triggered = true

      const { clinic_id, ...vitalData } = vitals

      const { data, error } = await (supabase.from('vital_signs') as any)
        .insert({
          ...vitalData,
          alert_triggered,
          measured_at: vitalData.measured_at || new Date().toISOString()
        })
        .select()
        .single()
      
      if (error) throw error
      if (!data) throw new Error('Falha ao registrar sinais vitais')

      // Se disparou alerta, cria registro na tabela alerts
      if (alert_triggered) {
        await (supabase.from('alerts') as any).insert({
          patient_id: vitals.patient_id,
          clinic_id: clinic_id,
          severity: 'high',
          type: 'vitals',
          message: `Sinais vitais alterados para o paciente.`,
          vital_sign_id: data.id
        })
      }

      return data as VitalSign
    },
    onSuccess: (data) => {
      if (data && (data as any).shift_id) {
        queryClient.invalidateQueries({ queryKey: ['vital_signs', (data as any).shift_id] })
      }
    }
  })
}
