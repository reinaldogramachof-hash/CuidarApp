import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '../../hooks/useAuth'
import { useAddVitalSigns } from '../../hooks/queries/useVitalSigns'
import { C, T } from '../../utils/tokens'

const vitalsSchema = z.object({
  spo2: z.string().optional().transform(v => v ? Number(v) : undefined).pipe(z.number().min(50).max(100).optional()),
  systolic_bp: z.string().optional().transform(v => v ? Number(v) : undefined).pipe(z.number().min(40).max(250).optional()),
  diastolic_bp: z.string().optional().transform(v => v ? Number(v) : undefined).pipe(z.number().min(40).max(250).optional()),
  heart_rate: z.string().optional().transform(v => v ? Number(v) : undefined).pipe(z.number().min(20).max(250).optional()),
  temperature: z.string().optional().transform(v => v ? Number(v) : undefined).pipe(z.number().min(30).max(45).optional()),
  glucose: z.string().optional().transform(v => v ? Number(v) : undefined).pipe(z.number().min(20).max(500).optional()),
})

type VitalsFormValues = z.infer<typeof vitalsSchema>

interface VitalSignsModalProps {
  onClose: () => void
  onSuccess: () => void
  shift: any
}

export default function VitalSignsModal({ onClose, onSuccess, shift }: VitalSignsModalProps) {
  const { profile } = useAuth()
  const addVitalsMutation = useAddVitalSigns()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<any>({
    resolver: zodResolver(vitalsSchema)
  })

  const onSubmit = async (data: VitalsFormValues) => {
    // Only register filled fields
    const payload: any = {
      shift_id: shift.id,
      patient_id: shift.patient_id,
      caregiver_id: profile?.id || '',
      clinic_id: profile?.clinic_id || '',
    }
    
    if (data.spo2) payload.spo2 = data.spo2
    if (data.systolic_bp) payload.systolic_bp = data.systolic_bp
    if (data.diastolic_bp) payload.diastolic_bp = data.diastolic_bp
    if (data.heart_rate) payload.heart_rate = data.heart_rate
    if (data.temperature) payload.temperature = data.temperature
    if (data.glucose) payload.glucose = data.glucose

    if (Object.keys(payload).length <= 3) {
      alert('Preencha ao menos um campo')
      return
    }

    await addVitalsMutation.mutateAsync(payload)
    onSuccess()
  }

  const InputField = ({ label, name, unit, placeholder }: { label: string, name: keyof VitalsFormValues, unit: string, placeholder: string }) => (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: C.navy, marginBottom: '6px' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          {...register(name)}
          type="number"
          step="any"
          placeholder={placeholder}
          style={{
            width: '100%', padding: '12px 16px', borderRadius: '12px',
            border: `1.5px solid ${errors[name] ? C.danger : C.border}`,
            outline: 'none', fontSize: '15px'
          }}
        />
        <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: C.textLight, fontWeight: 600 }}>
          {unit}
        </span>
      </div>
      {errors[name] && <span style={{ color: C.danger, fontSize: '11px', marginTop: '4px', display: 'block' }}>{String(errors[name]?.message)}</span>}
    </div>
  )

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div style={{
        background: '#fff', borderRadius: '24px', width: '100%', maxWidth: '400px',
        padding: '24px', maxHeight: '90vh', overflowY: 'auto'
      }}>
        <h2 style={{ fontFamily: T.display, fontWeight: 800, fontSize: '20px', color: C.navy, marginBottom: '24px', textAlign: 'center' }}>
          Aferir Sinais Vitais
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <InputField label="SpO2" name="spo2" unit="%" placeholder="98" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <InputField label="PAS" name="systolic_bp" unit="mmHg" placeholder="120" />
            <InputField label="PAD" name="diastolic_bp" unit="mmHg" placeholder="80" />
          </div>
          <InputField label="Frequência Cardíaca" name="heart_rate" unit="bpm" placeholder="72" />
          <InputField label="Temperatura" name="temperature" unit="°C" placeholder="36.5" />
          <InputField label="Glicemia" name="glucose" unit="mg/dL" placeholder="100" />

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, padding: '14px', borderRadius: '12px', border: `1.5px solid ${C.border}`,
              background: 'none', fontWeight: 700, color: C.textMid, cursor: 'pointer'
            }}>
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} style={{
              flex: 1, padding: '14px', borderRadius: '12px', border: 'none',
              background: C.accent, color: '#fff', fontWeight: 700, cursor: 'pointer'
            }}>
              {isSubmitting ? 'Registrando...' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
