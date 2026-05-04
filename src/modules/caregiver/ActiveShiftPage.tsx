import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useShift, useCheckOut } from '../../hooks/queries/useShifts'
import { useCareEvents, useAddCareEvent } from '../../hooks/queries/useCareEvents'
import VitalSignsModal from './VitalSignsModal'
import Toast from '../../components/ui/Toast'

const EVENT_TYPES = [
  { type: 'feeding',       label: 'Alimentação',  icon: 'fa-utensils',   color: '#d97706' },
  { type: 'hygiene',       label: 'Higiene',       icon: 'fa-shower',     color: 'var(--color-secondary)' },
  { type: 'medication',    label: 'Medicação',     icon: 'fa-pills',      color: 'var(--color-primary)' },
  { type: 'repositioning', label: 'Reposição',    icon: 'fa-rotate',     color: '#047857' },
  { type: 'dressing',      label: 'Curativo',     icon: 'fa-bandage',    color: 'var(--color-danger)' },
  { type: 'other',         label: 'Outro',        icon: 'fa-file-lines', color: 'var(--color-text-mid)' },
]

export default function ActiveShiftPage() {
  const { shiftId }   = useParams()
  const navigate      = useNavigate()
  const { profile }   = useAuth()
  const { data: shift, isLoading } = useShift(shiftId || '')
  const { data: events }           = useCareEvents(shiftId || '')
  const addEventMutation           = useAddCareEvent()
  const checkOutMutation           = useCheckOut()

  const [duration, setDuration]         = useState('')
  const [showVitals, setShowVitals]     = useState(false)
  const [selectedEvent, setSelected]    = useState<typeof EVENT_TYPES[0] | null>(null)
  const [notes, setNotes]               = useState('')
  const [toast, setToast]               = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    if (!shift?.checkin_at) return
    const id = setInterval(() => {
      const diff = Date.now() - new Date(shift.checkin_at!).getTime()
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      setDuration(`${h}h ${m}min`)
    }, 1000)
    return () => clearInterval(id)
  }, [shift?.checkin_at])

  if (isLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '28px', color: 'var(--color-primary)' }}></i>
    </div>
  )

  const handleAddEvent = async () => {
    if (!selectedEvent || !shift) return
    await addEventMutation.mutateAsync({
      shift_id: shift.id, patient_id: shift.patient_id,
      caregiver_id: profile?.id || '', event_type: selectedEvent.type as any, notes,
    })
    setSelected(null); setNotes('')
    setToast({ message: 'Evento registrado com sucesso ✓', type: 'success' })
  }

  const handleCheckOut = async () => {
    if (!window.confirm('Confirmar encerramento do turno?')) return
    await checkOutMutation.mutateAsync({ shiftId: shiftId || '' })
    navigate('/caregiver')
  }

  return (
    <div style={{
      maxWidth: '520px', margin: '0 auto', minHeight: '100vh',
      background: 'var(--color-bg)', fontFamily: 'var(--font-body)', paddingBottom: '100px',
    }}>

      {/* Header */}
      <header style={{
        background: '#fff', padding: '14px 20px', display: 'flex', alignItems: 'center',
        borderBottom: '1px solid var(--color-border-subtle)', position: 'sticky', top: 0, zIndex: 10,
      }}>
        <button onClick={() => navigate('/caregiver')} style={{
          background: 'none', border: 'none', color: 'var(--color-navy)', fontSize: '18px', cursor: 'pointer', padding: '6px',
        }}>
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px', color: 'var(--color-navy)', margin: 0 }}>
            {shift?.patients?.full_name}
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--color-text-mid)', margin: 0 }}>
            Quarto {shift?.patients?.room_unit}
          </p>
        </div>
        <div style={{ width: '30px' }}></div>
      </header>

      <div style={{ padding: '20px' }}>
        {/* Status Card */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
          borderRadius: '20px', padding: '20px', color: '#fff', marginBottom: '24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 8px 24px rgba(0,103,103,0.25)',
        }}>
          <div>
            <div style={{ fontSize: '13px', opacity: 0.8, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fa-regular fa-clock"></i>
              Turno iniciado às {new Date(shift?.checkin_at || '').toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '32px', lineHeight: 1 }}>
              {duration || '--'}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>em andamento</div>
          </div>
          <div style={{
            width: '56px', height: '56px', background: 'rgba(255,255,255,0.15)', borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px',
          }}>
            <i className="fa-solid fa-user-nurse"></i>
          </div>
        </div>

        {/* Registrar Evento */}
        <h2 className="section-title">Registrar Evento</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
          {EVENT_TYPES.map(ev => (
            <button key={ev.type} onClick={() => setSelected(ev)} style={{
              background: '#fff', border: `1.5px solid ${selectedEvent?.type === ev.type ? ev.color : 'var(--color-border-subtle)'}`,
              borderRadius: '14px', padding: '14px 8px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer',
              boxShadow: selectedEvent?.type === ev.type ? `0 4px 12px ${ev.color}30` : 'var(--shadow-card)',
              transform: selectedEvent?.type === ev.type ? 'scale(1.03)' : 'scale(1)',
              transition: 'all 0.15s',
            }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '10px', background: `${ev.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: ev.color, fontSize: '16px',
              }}>
                <i className={`fa-solid ${ev.icon}`}></i>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-navy)', textAlign: 'center', lineHeight: 1.3 }}>
                {ev.label}
              </span>
            </button>
          ))}
        </div>

        {/* Aferir Sinais Vitais */}
        <button onClick={() => setShowVitals(true)} style={{
          width: '100%', background: 'var(--color-navy)', color: '#fff', border: 'none',
          borderRadius: '14px', padding: '16px', fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
          cursor: 'pointer', marginBottom: '28px', boxShadow: '0 4px 16px rgba(25,28,29,0.2)',
        }}>
          <i className="fa-solid fa-heart-pulse"></i>
          Aferir Sinais Vitais
        </button>

        {/* Timeline */}
        <h2 className="section-title">Eventos do Turno</h2>
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid var(--color-border-subtle)', overflow: 'hidden' }}>
          {Array.isArray(events) && events.length > 0 ? (
            (events as any[]).map((ev, i) => {
              const info = EVENT_TYPES.find(t => t.type === ev.event_type) ?? EVENT_TYPES[5]
              return (
                <div key={ev.id} style={{
                  display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px',
                  borderBottom: i < events.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                    background: `${info.color}15`, color: info.color, fontSize: '14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <i className={`fa-solid ${info.icon}`}></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-navy)' }}>{info.label}</div>
                    {ev.notes && <div style={{ fontSize: '12px', color: 'var(--color-text-mid)', marginTop: '2px' }}>{ev.notes}</div>}
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-light)', fontWeight: 600 }}>
                    {new Date(ev.occurred_at || '').toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )
            })
          ) : (
            <div style={{ padding: '28px', textAlign: 'center', color: 'var(--color-text-light)', fontSize: '14px' }}>
              <i className="fa-solid fa-clock" style={{ fontSize: '20px', opacity: 0.3, marginBottom: '8px', display: 'block' }}></i>
              Nenhum evento registrado ainda
            </div>
          )}
        </div>
      </div>

      {/* Botão Encerrar Turno */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px 20px', background: 'var(--color-bg)', borderTop: '1px solid var(--color-border-subtle)' }}>
        <button onClick={handleCheckOut} disabled={checkOutMutation.isPending} style={{
          width: '100%', maxWidth: '480px', margin: '0 auto', display: 'block',
          background: checkOutMutation.isPending ? 'var(--color-text-light)' : 'var(--color-danger)',
          color: '#fff', border: 'none', borderRadius: '14px', padding: '16px',
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(186,26,26,0.3)',
        }}>
          {checkOutMutation.isPending
            ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Finalizando...</>
            : <><i className="fa-solid fa-right-from-bracket"></i> Encerrar Turno</>
          }
        </button>
      </div>

      {/* Modal anotação do evento */}
      {selectedEvent && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200,
          display: 'flex', alignItems: 'flex-end', backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            width: '100%', maxWidth: '520px', margin: '0 auto', background: '#fff',
            borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '28px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px', background: `${selectedEvent.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: selectedEvent.color, fontSize: '20px',
              }}>
                <i className={`fa-solid ${selectedEvent.icon}`}></i>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', color: 'var(--color-navy)', margin: 0 }}>
                {selectedEvent.label}
              </h3>
            </div>
            <textarea
              placeholder="Observações (opcional)..."
              value={notes} onChange={e => setNotes(e.target.value)}
              className="input-field"
              style={{ height: '100px', resize: 'none', marginBottom: '20px', display: 'block' }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setSelected(null)} className="btn-outline" style={{ flex: 1 }}>Cancelar</button>
              <button onClick={handleAddEvent} disabled={addEventMutation.isPending} className="btn-primary" style={{ flex: 2 }}>
                {addEventMutation.isPending ? 'Registrando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showVitals && (
        <VitalSignsModal onClose={() => setShowVitals(false)} onSuccess={() => { setShowVitals(false); setToast({ message: 'Sinais registrados ✓', type: 'success' }) }} shift={shift!} />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
