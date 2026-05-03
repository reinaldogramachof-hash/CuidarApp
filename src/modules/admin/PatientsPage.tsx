import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useClinicPatients, useCreatePatient, useUpdatePatient } from '../../hooks/queries/useAdmin'
import { C, T } from '../../utils/tokens'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const patientSchema = z.object({
  full_name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  date_of_birth: z.string().optional(),
  condition: z.string().optional(),
  room_unit: z.string().optional(),
  cpf: z.string().optional(),
})

type PatientFormValues = z.infer<typeof patientSchema>

export default function PatientsPage() {
  const { profile } = useAuth()
  const clinicId = profile?.clinic_id || ''
  const { data: patients, isLoading } = useClinicPatients(clinicId)
  const createMutation = useCreatePatient()
  const updateMutation = useUpdatePatient()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState<any>(null)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema)
  })

  const openModal = (patient: any = null) => {
    setEditingPatient(patient)
    if (patient) {
      reset({
        full_name: patient.full_name,
        date_of_birth: patient.date_of_birth || '',
        condition: patient.condition || '',
        room_unit: patient.room_unit || '',
        cpf: patient.cpf || '',
      })
    } else {
      reset({ full_name: '', date_of_birth: '', condition: '', room_unit: '', cpf: '' })
    }
    setIsModalOpen(true)
  }

  const onSubmit = async (data: PatientFormValues) => {
    if (editingPatient) {
      await updateMutation.mutateAsync({ id: editingPatient.id, updates: data, clinicId })
    } else {
      await createMutation.mutateAsync({ ...data, clinic_id: clinicId })
    }
    setIsModalOpen(false)
  }

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: T.display, fontWeight: 800, fontSize: '28px', color: C.navy, margin: 0 }}>Pacientes</h1>
          <p style={{ color: C.textMid, fontSize: '14px', margin: 0 }}>Gestão de residentes da clínica</p>
        </div>
        <button onClick={() => openModal()} style={{
          background: C.primary, color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 20px',
          fontFamily: T.display, fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <i className="fa-solid fa-plus"></i>
          Novo Paciente
        </button>
      </header>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Carregando...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {patients?.map(patient => (
            <div key={patient.id} style={{
              background: '#fff', padding: '24px', borderRadius: '24px', border: `1px solid ${C.border}`,
              display: 'flex', alignItems: 'flex-start', gap: '20px'
            }}>
              <div style={{
                width: '60px', height: '60px', background: C.bg, borderRadius: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '24px', fontWeight: 800, color: C.primary
              }}>
                {patient.full_name[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, color: C.navy, fontSize: '16px', marginBottom: '4px' }}>{patient.full_name}</div>
                <div style={{ fontSize: '13px', color: C.textMid, marginBottom: '2px' }}>{patient.condition || 'Sem condição informada'}</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: C.textLight }}>Quarto: {patient.room_unit || '--'}</div>
                
                <button onClick={() => openModal(patient)} style={{
                  marginTop: '16px', background: 'none', border: `1.5px solid ${C.border}`,
                  padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: 700,
                  color: C.navy, cursor: 'pointer'
                }}>
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Patient Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{
            background: '#fff', borderRadius: '24px', width: '100%', maxWidth: '440px',
            padding: '32px', position: 'relative'
          }}>
            <h2 style={{ fontFamily: T.display, fontWeight: 800, fontSize: '20px', color: C.navy, marginBottom: '24px' }}>
              {editingPatient ? 'Editar Paciente' : 'Novo Paciente'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: C.navy, marginBottom: '6px' }}>Nome Completo</label>
                <input {...register('full_name')} style={inputStyle(!!errors.full_name)} placeholder="Ex: Maria da Silva" />
                {errors.full_name && <span style={errorStyle}>{errors.full_name.message}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: C.navy, marginBottom: '6px' }}>Data Nasc.</label>
                  <input type="date" {...register('date_of_birth')} style={inputStyle(false)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: C.navy, marginBottom: '6px' }}>Quarto/Unidade</label>
                  <input {...register('room_unit')} style={inputStyle(false)} placeholder="Ex: 204-B" />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: C.navy, marginBottom: '6px' }}>Condição/Diagnóstico</label>
                <input {...register('condition')} style={inputStyle(false)} placeholder="Ex: Alzheimer leve" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: C.navy, marginBottom: '6px' }}>CPF</label>
                <input {...register('cpf')} style={inputStyle(false)} placeholder="000.000.000-00" />
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
                  {isSubmitting ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const inputStyle = (hasError: boolean) => ({
  width: '100%',
  padding: '12px 16px',
  borderRadius: '12px',
  border: `1.5px solid ${hasError ? C.danger : C.border}`,
  outline: 'none',
  fontSize: '14px',
  fontFamily: T.body,
  background: C.bg,
})

const errorStyle = {
  color: C.danger,
  fontSize: '11px',
  marginTop: '4px',
  display: 'block',
  fontWeight: 600
}
