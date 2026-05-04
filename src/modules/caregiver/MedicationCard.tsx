import { useState } from 'react'
import { usePrescriptions, useShiftMedications, useAdministerMedication } from '../../hooks/queries/useMedications'
import { C, T } from '../../utils/tokens'

interface MedicationCardProps {
  shiftId: string
  patientId: string
  caregiverId: string
  onToast: (msg: string, type: 'success' | 'error') => void
}

export default function MedicationCard({ shiftId, patientId, caregiverId, onToast }: MedicationCardProps) {
  const { data: prescriptions, isLoading: loadingPrescriptions } = usePrescriptions(patientId)
  const { data: administeredMeds, isLoading: loadingAdministered } = useShiftMedications(shiftId)
  const adminMutation = useAdministerMedication()

  const [notes, setNotes] = useState<Record<string, string>>({})
  const [showNotes, setShowNotes] = useState<Record<string, boolean>>({})

  const handleAdminister = async (p: any) => {
    try {
      await adminMutation.mutateAsync({
        prescriptionId: p.id,
        shiftId,
        caregiverId,
        patientId,
        medicationName: p.medication_name,
        doseGiven: p.dose,
        routeUsed: p.route,
        notes: notes[p.id] || ''
      })
      onToast('Medicação registrada ✓', 'success')
      // Limpa nota se houver
      setNotes(prev => ({ ...prev, [p.id]: '' }))
      setShowNotes(prev => ({ ...prev, [p.id]: false }))
    } catch (err) {
      onToast('Erro ao registrar medicação', 'error')
    }
  }

  if (loadingPrescriptions || loadingAdministered) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <i className="fa-solid fa-circle-notch fa-spin" style={{ color: C.primary }}></i>
      </div>
    )
  }

  if (!prescriptions || prescriptions.length === 0) {
    return (
      <div style={{ 
        padding: '28px', textAlign: 'center', background: '#fff', 
        borderRadius: '16px', border: `1px solid ${C.border}` 
      }}>
        <i className="fa-solid fa-pills" style={{ fontSize: '20px', opacity: 0.2, marginBottom: '8px', display: 'block' }}></i>
        <span style={{ color: C.textLight, fontSize: '14px' }}>Nenhuma medicação prescrita</span>
      </div>
    )
  }

  const doneCount = administeredMeds?.length || 0
  const totalCount = prescriptions.length
  const allDone = doneCount === totalCount && totalCount > 0

  return (
    <div style={{
      background: '#fff', borderRadius: '16px', border: `1px solid ${C.border}`,
      marginBottom: '20px', overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px', display: 'flex', alignItems: 'center', 
        justifyContent: 'space-between', borderBottom: `1px solid ${C.borderSubtle}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fa-solid fa-pills" style={{ color: C.primary }}></i>
          <h3 style={{ 
            fontFamily: T.display, fontWeight: 700, fontSize: '15px', 
            color: C.navy, margin: 0 
          }}>
            Medicações do Turno
          </h3>
        </div>
        <div style={{
          padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 800,
          background: allDone ? C.primary : '#d97706', color: '#fff'
        }}>
          {doneCount}/{totalCount} ●
        </div>
      </div>

      {/* Lista de Medicamentos */}
      <div>
        {prescriptions.map((p, idx) => {
          const admin = administeredMeds?.find(a => a.prescription_id === p.id)
          const isDone = !!admin
          const isLast = idx === prescriptions.length - 1

          return (
            <div key={p.id} style={{
              padding: '14px 16px',
              borderBottom: isLast ? 'none' : `1px solid ${C.borderSubtle}`,
              borderLeft: `4px solid ${isDone ? '#047857' : '#d97706'}`,
              transition: 'all 0.2s'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="fa-solid fa-capsules" style={{ fontSize: '12px', color: isDone ? '#047857' : '#d97706' }}></i>
                    <span style={{ fontWeight: 700, fontSize: '14px', color: C.navy }}>{p.medication_name} {p.dose}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: C.textMid, marginTop: '2px' }}>
                    Via: {p.route} · {p.frequency}
                  </div>
                  {isDone && (
                    <div style={{ fontSize: '11px', color: '#047857', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <i className="fa-solid fa-check"></i>
                      Administrada às {new Date(admin.administered_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>

                {!isDone && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => setShowNotes(prev => ({ ...prev, [p.id]: !prev[p.id] }))}
                      style={{
                        background: C.borderSubtle, color: C.navy, borderRadius: '10px', 
                        padding: '8px 12px', fontSize: '12px', fontWeight: 700, border: 'none'
                      }}
                    >
                      <i className="fa-regular fa-comment"></i>
                    </button>
                    <button 
                      onClick={() => handleAdminister(p)}
                      disabled={adminMutation.isPending}
                      style={{
                        background: '#047857', color: '#fff', borderRadius: '10px', 
                        padding: '8px 14px', fontSize: '13px', fontWeight: 700, border: 'none',
                        opacity: adminMutation.isPending ? 0.7 : 1
                      }}
                    >
                      {adminMutation.isPending ? '...' : 'Administrar'}
                    </button>
                  </div>
                )}
              </div>

              {/* Input de Observação Inline */}
              {!isDone && showNotes[p.id] && (
                <div style={{ marginTop: '12px' }}>
                  <textarea
                    placeholder="Observação opcional..."
                    value={notes[p.id] || ''}
                    onChange={(e) => setNotes(prev => ({ ...prev, [p.id]: e.target.value }))}
                    className="input-field"
                    style={{ minHeight: '60px', padding: '10px', fontSize: '13px' }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
