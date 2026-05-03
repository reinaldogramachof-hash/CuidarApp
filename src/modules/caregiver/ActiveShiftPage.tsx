import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useShift, useCheckOut } from '../../hooks/queries/useShifts'
import { useCareEvents, useAddCareEvent } from '../../hooks/queries/useCareEvents'
import { C, T } from '../../utils/tokens'
import VitalSignsModal from './VitalSignsModal'
import Toast from '../../components/ui/Toast'

export default function ActiveShiftPage() {
  const { shiftId } = useParams()
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { data: shift, isLoading: isLoadingShift } = useShift(shiftId || '')
  const { data: events } = useCareEvents(shiftId || '')
  const addEventMutation = useAddCareEvent()
  const checkOutMutation = useCheckOut()

  const [duration, setDuration] = useState('')
  const [showVitalsModal, setShowVitalsModal] = useState(false)
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<{ type: string, label: string, emoji: string } | null>(null)
  const [notes, setNotes] = useState('')

  // Duration counter
  useEffect(() => {
    if (!shift?.checkin_at) return

    const interval = setInterval(() => {
      const start = new Date(shift.checkin_at!).getTime()
      const now = new Date().getTime()
      const diff = now - start

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      setDuration(`${hours}h ${minutes}min`)
    }, 1000)

    return () => clearInterval(interval)
  }, [shift?.checkin_at])

  if (isLoadingShift) return null

  const eventTypes = [
    { type: 'feeding', label: 'Alimentação', emoji: '🍽️' },
    { type: 'hygiene', label: 'Higiene', emoji: '🚿' },
    { type: 'medication', label: 'Medicação', emoji: '💊' },
    { type: 'repositioning', label: 'Reposição', emoji: '🔄' },
    { type: 'dressing', label: 'Curativo', emoji: '🩹' },
    { type: 'other', label: 'Outro', emoji: '📝' },
  ]

  const handleAddEvent = async () => {
    if (!selectedEvent || !shift) return
    
    await addEventMutation.mutateAsync({
      shift_id: shift.id,
      patient_id: shift.patient_id,
      caregiver_id: profile?.id || '',
      event_type: selectedEvent.type as any,
      notes,
    })

    setSelectedEvent(null)
    setNotes('')
    setToast({ message: 'Evento registrado ✓', type: 'success' })
  }

  const handleCheckOut = async () => {
    if (!window.confirm('Confirmar check-out?')) return
    await checkOutMutation.mutateAsync({ shiftId: shiftId || '' })
    navigate('/caregiver')
  }

  return (
    <div style={{
      maxWidth: '500px',
      margin: '0 auto',
      minHeight: '100vh',
      background: C.bg,
      fontFamily: T.body,
      paddingBottom: '100px'
    }}>
      {/* Header */}
      <header style={{
        background: '#fff',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        borderBottom: `1px solid ${C.border}`,
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <button onClick={() => navigate('/caregiver')} style={{
          background: 'none', border: 'none', color: C.navy, fontSize: '18px', cursor: 'pointer', padding: '8px'
        }}>
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <h1 style={{ fontFamily: T.display, fontWeight: 800, fontSize: '18px', color: C.navy, margin: 0 }}>
            {shift?.patients?.full_name}
          </h1>
          <p style={{ fontSize: '12px', color: C.textMid, margin: 0 }}>
            Quarto: {shift?.patients?.room_unit}
          </p>
        </div>
        <div style={{ width: '34px' }}></div>
      </header>

      <div style={{ padding: '20px' }}>
        {/* Status Card */}
        <div style={{
          background: C.navy,
          borderRadius: '20px',
          padding: '20px',
          color: '#fff',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>
              <i className="fa-regular fa-clock"></i>
              Turno iniciado às {new Date(shift?.checkin_at || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: '24px' }}>
              {duration}
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '14px' }}>
            <i className="fa-solid fa-user-nurse" style={{ fontSize: '24px' }}></i>
          </div>
        </div>

        {/* Event Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: '24px'
        }}>
          {eventTypes.map(event => (
            <button
              key={event.type}
              onClick={() => setSelectedEvent(event)}
              style={{
                background: '#fff',
                border: `1.5px solid ${C.border}`,
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '24px' }}>{event.emoji}</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: C.navy, fontFamily: T.display }}>{event.label}</span>
            </button>
          ))}
        </div>

        {/* Vital Signs Button */}
        <button
          onClick={() => setShowVitalsModal(true)}
          style={{
            width: '100%',
            background: C.accent,
            color: '#fff',
            border: 'none',
            borderRadius: '16px',
            padding: '16px',
            fontFamily: T.display,
            fontWeight: 800,
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            cursor: 'pointer',
            marginBottom: '32px',
            boxShadow: `0 8px 16px ${C.accent}33`
          }}
        >
          <i className="fa-solid fa-chart-line"></i>
          Aferir Sinais Vitais
        </button>

        {/* Timeline */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontFamily: T.display, fontWeight: 800, fontSize: '16px', color: C.navy, marginBottom: '16px' }}>
            Timeline de Eventos
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {events && events.length > 0 ? (
              events.map(event => {
                const typeInfo = eventTypes.find(t => t.type === event.event_type) || eventTypes[5]
                return (
                  <div key={event.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    background: '#fff',
                    borderRadius: '12px',
                    borderLeft: `4px solid ${C.primary}`
                  }}>
                    <span style={{ fontSize: '18px' }}>{typeInfo.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: C.navy }}>{typeInfo.label}</div>
                      {event.notes && <div style={{ fontSize: '12px', color: C.textMid }}>{event.notes}</div>}
                    </div>
                    <div style={{ fontSize: '12px', color: C.textLight, fontWeight: 600 }}>
                      {new Date(event.occurred_at || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                )
              })
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: C.textLight, fontSize: '14px', fontStyle: 'italic' }}>
                Nenhum evento registrado ainda
              </div>
            )}
          </div>
        </div>

        {/* Footer Button */}
        <button
          onClick={handleCheckOut}
          disabled={checkOutMutation.isPending}
          style={{
            width: 'calc(100% - 40px)',
            maxWidth: '460px',
            position: 'fixed',
            bottom: '20px',
            background: C.danger,
            color: '#fff',
            border: 'none',
            borderRadius: '16px',
            padding: '16px',
            fontFamily: T.display,
            fontWeight: 800,
            fontSize: '16px',
            cursor: 'pointer',
            boxShadow: `0 8px 16px ${C.danger}33`
          }}
        >
          {checkOutMutation.isPending ? 'Finalizando...' : 'Finalizar Turno'}
        </button>
      </div>

      {/* Mini-modal for event notes */}
      {selectedEvent && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100,
          display: 'flex', alignItems: 'flex-end'
        }}>
          <div style={{
            width: '100%', maxWidth: '500px', margin: '0 auto', background: '#fff',
            borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px',
            animation: 'slideUp 0.3s ease-out'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ fontSize: '28px' }}>{selectedEvent.emoji}</span>
              <h3 style={{ fontFamily: T.display, fontWeight: 800, fontSize: '20px', color: C.navy, margin: 0 }}>
                {selectedEvent.label}
              </h3>
            </div>
            <textarea
              placeholder="Observações..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: '100%', height: '100px', padding: '16px', borderRadius: '16px',
                border: `1.5px solid ${C.border}`, outline: 'none', fontSize: '15px',
                fontFamily: T.body, marginBottom: '20px', resize: 'none'
              }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setSelectedEvent(null)} style={{
                flex: 1, padding: '14px', borderRadius: '12px', border: `1.5px solid ${C.border}`,
                background: 'none', fontWeight: 700, color: C.textMid, cursor: 'pointer'
              }}>
                Cancelar
              </button>
              <button onClick={handleAddEvent} disabled={addEventMutation.isPending} style={{
                flex: 2, padding: '14px', borderRadius: '12px', border: 'none',
                background: C.primary, color: '#fff', fontWeight: 700, cursor: 'pointer'
              }}>
                {addEventMutation.isPending ? 'Registrando...' : 'Registrar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showVitalsModal && (
        <VitalSignsModal
          onClose={() => setShowVitalsModal(false)}
          onSuccess={() => {
            setShowVitalsModal(false)
            setToast({ message: 'Sinais registrados ✓', type: 'success' })
          }}
          shift={shift!}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
