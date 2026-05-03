import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useTodayShifts, useClinicPatients, useClinicCaregivers, useCreateShift } from '../../hooks/queries/useAdmin'
import { C, T } from '../../utils/tokens'
import { useForm } from 'react-hook-form'
import { format, isAfter, parseISO } from 'date-fns'

export default function ShiftsPage() {
  const { profile } = useAuth()
  const clinicId = profile?.clinic_id || ''
  
  const { data: shifts, isLoading } = useTodayShifts(clinicId)
  const { data: patients } = useClinicPatients(clinicId)
  const { data: caregivers } = useClinicCaregivers(clinicId)
  const createMutation = useCreateShift()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const { register, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm({
    defaultValues: {
      patient_id: '',
      caregiver_id: '',
      start_time: '',
      end_time: '',
    }
  })

  const onSubmit = async (data: any) => {
    if (!isAfter(parseISO(data.end_time), parseISO(data.start_time))) {
      alert('O horário de término deve ser após o início')
      return
    }

    await createMutation.mutateAsync({
      ...data,
      clinic_id: clinicId,
      status: 'scheduled'
    })
    setIsModalOpen(false)
    reset()
  }

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: T.display, fontWeight: 800, fontSize: '28px', color: C.navy, margin: 0 }}>Escalas</h1>
          <p style={{ color: C.textMid, fontSize: '14px', margin: 0 }}>Controle de turnos e cuidadores</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} style={{
          background: C.primary, color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 20px',
          fontFamily: T.display, fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <i className="fa-solid fa-plus"></i>
          Novo Turno
        </button>
      </header>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Carregando...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {(shifts as any[])?.map(shift => (
            <div key={shift.id} style={{
              background: '#fff', padding: '20px', borderRadius: '20px', border: `1px solid ${C.border}`,
              display: 'flex', alignItems: 'center', gap: '16px'
            }}>
              <div style={{ width: '48px', height: '48px', background: C.bg, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: C.primary }}>
                {shift.patients?.full_name?.[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, color: C.navy, fontSize: '15px' }}>{shift.patients?.full_name}</div>
                <div style={{ fontSize: '13px', color: C.textMid, fontWeight: 600 }}>Cuidador: {shift.caregiver?.full_name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <StatusBadge status={shift.status} />
                <div style={{ fontSize: '12px', color: C.textLight, marginTop: '6px', fontWeight: 700 }}>
                  {format(new Date(shift.start_time), 'HH:mm')} – {format(new Date(shift.end_time), 'HH:mm')}
                </div>
              </div>
            </div>
          ))}
          {shifts?.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: C.textLight, background: '#fff', borderRadius: '20px', border: `1px dashed ${C.border}` }}>
              Nenhum turno programado para hoje
            </div>
          )}
        </div>
      )}

      {/* Shift Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{
            background: '#fff', borderRadius: '24px', width: '100%', maxWidth: '440px',
            padding: '32px'
          }}>
            <h2 style={{ fontFamily: T.display, fontWeight: 800, fontSize: '20px', color: C.navy, marginBottom: '24px' }}>
              Novo Turno
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Paciente</label>
                <select {...register('patient_id', { required: true })} style={inputStyle}>
                  <option value="">Selecione um paciente</option>
                  {(patients as any[])?.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Cuidador</label>
                <select {...register('caregiver_id', { required: true })} style={inputStyle}>
                  <option value="">Selecione um cuidador</option>
                  {(caregivers as any[])?.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Início</label>
                <input type="datetime-local" {...register('start_time', { required: true })} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Término</label>
                <input type="datetime-local" {...register('end_time', { required: true })} style={inputStyle} />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{
                  flex: 1, padding: '14px', borderRadius: '12px', border: `1.5px solid ${C.border}`,
                  background: 'none', fontWeight: 700, color: C.textMid, cursor: 'pointer'
                }}>
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} style={{
                  flex: 2, padding: '14px', borderRadius: '12px', border: 'none',
                  background: C.primary, color: '#fff', fontWeight: 700, cursor: 'pointer'
                }}>
                  {isSubmitting ? 'Agendando...' : 'Agendar Turno'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const configs: any = {
    active: { label: 'Em andamento', color: C.success, bg: C.successLight },
    scheduled: { label: 'Agendado', color: C.accent, bg: C.accentLight },
    completed: { label: 'Concluído', color: C.textLight, bg: C.bg },
    missed: { label: 'Faltou', color: C.danger, bg: C.dangerLight },
  }
  const config = configs[status] || configs.scheduled
  return (
    <span style={{
      padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 800,
      color: config.color, background: config.bg, textTransform: 'uppercase'
    }}>
      {config.label}
    </span>
  )
}

const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 700, color: C.navy, marginBottom: '6px' }
const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '12px',
  border: `1.5px solid ${C.border}`,
  outline: 'none',
  fontSize: '14px',
  fontFamily: T.body,
  background: C.bg,
}
