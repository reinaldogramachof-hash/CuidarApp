import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useFamilyPatient, usePatientActiveShift, usePatientAlerts } from '../../hooks/queries/useFamilyPatient'
import { useCareEvents } from '../../hooks/queries/useCareEvents'
import { useShiftVitalSigns } from '../../hooks/queries/useVitalSigns'
import { C, T } from '../../utils/tokens'

export default function FamilyHomePage() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  
  const { data: familyData, isLoading: isLoadingPatient } = useFamilyPatient(profile?.id || '')
  const patient = familyData?.patients
  
  const { data: activeShift } = usePatientActiveShift(patient?.id || '')
  const { data: alerts } = usePatientAlerts(patient?.id || '')
  
  const { data: vitals } = useShiftVitalSigns(activeShift?.id || '')
  const { data: events } = useCareEvents(activeShift?.id || '')
  
  const lastVitals = vitals?.[0]
  const recentEvents = events?.slice(0, 5)

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const isNormal = (type: string, value: number | null | undefined) => {
    if (value === null || value === undefined) return true
    switch (type) {
      case 'spo2': return value >= 92
      case 'systolic': return value >= 90 && value <= 160
      case 'heart_rate': return value >= 50 && value <= 100
      case 'temperature': return value <= 37.8
      case 'glucose': return value >= 70 && value <= 180
      default: return true
    }
  }

  const eventTypes = [
    { type: 'feeding', label: 'Alimentação', emoji: '🍽️' },
    { type: 'hygiene', label: 'Higiene', emoji: '🚿' },
    { type: 'medication', label: 'Medicação', emoji: '💊' },
    { type: 'repositioning', label: 'Reposição', emoji: '🔄' },
    { type: 'dressing', label: 'Curativo', emoji: '🩹' },
    { type: 'other', label: 'Outro', emoji: '📝' },
  ]

  return (
    <div style={{
      maxWidth: '500px',
      margin: '0 auto',
      minHeight: '100vh',
      background: C.bg,
      fontFamily: T.body,
      paddingBottom: '40px'
    }}>
      {/* Header */}
      <header style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#fff',
        borderBottom: `1px solid ${C.border}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', background: C.primary, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <i className="fa-solid fa-heart" style={{ fontSize: '14px' }}></i>
          </div>
          <span style={{ fontFamily: T.display, fontWeight: 900, fontSize: '18px', color: C.navy }}>CuidarApp</span>
        </div>
        <button onClick={handleLogout} style={{
          background: 'none', border: 'none', color: C.textMid, fontWeight: 600, fontSize: '14px', cursor: 'pointer'
        }}>
          Sair
        </button>
      </header>

      <div style={{ padding: '20px' }}>
        {/* Patient Hero Card */}
        <div style={{
          background: `linear-gradient(135deg, ${C.primary} 0%, ${C.navy} 100%)`,
          borderRadius: '24px',
          padding: '24px',
          color: '#fff',
          marginBottom: '24px',
          boxShadow: '0 12px 24px rgba(21, 101, 192, 0.2)'
        }}>
          {isLoadingPatient ? (
            <div style={{ height: '100px' }}>Carregando...</div>
          ) : (
            <>
              <h1 style={{ fontFamily: T.display, fontWeight: 800, fontSize: '24px', margin: '0 0 4px 0' }}>
                {patient?.full_name}
              </h1>
              <p style={{ fontSize: '12px', opacity: 0.8, marginBottom: '20px' }}>
                {patient?.condition || 'Nenhuma condição registrada'}
              </p>
              
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.15)', marginBottom: '20px' }}></div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>
                    {activeShift?.status === 'active' ? (
                      <>
                        <span style={{ width: '8px', height: '8px', background: '#4ADE80', borderRadius: '50%' }}></span>
                        Cuidador ativo: {activeShift.caregiver?.full_name}
                      </>
                    ) : activeShift?.status === 'scheduled' ? (
                      <>
                        <span style={{ width: '8px', height: '8px', background: '#FACC15', borderRadius: '50%' }}></span>
                        Próximo turno: {new Date(activeShift.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </>
                    ) : (
                      'Nenhum turno hoje'
                    )}
                  </div>
                  {activeShift && (
                    <div style={{ fontSize: '12px', opacity: 0.7 }}>
                      {new Date(activeShift.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(activeShift.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-user-shield" style={{ fontSize: '18px' }}></i>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Alerts Badge */}
        {alerts && alerts.length > 0 && (
          <div style={{
            background: C.dangerLight,
            border: `1.5px solid ${C.danger}`,
            borderRadius: '16px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
            color: C.danger,
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer'
          }}>
            <span style={{ fontSize: '18px' }}>⚠️</span>
            <span>{alerts.length} alerta(s) ativo(s)</span>
          </div>
        )}

        {/* Last Vital Signs */}
        <section style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontFamily: T.display, fontWeight: 800, fontSize: '18px', color: C.navy, margin: 0 }}>
              Últimos Sinais Vitais
            </h2>
            <button onClick={() => navigate('/family/vitals')} style={{
              background: 'none', border: 'none', color: C.primary, fontWeight: 700, fontSize: '13px', cursor: 'pointer'
            }}>
              Ver histórico
            </button>
          </div>

          {!lastVitals ? (
            <div style={{ padding: '24px', background: '#fff', borderRadius: '20px', textAlign: 'center', color: C.textLight, fontSize: '14px', border: `1px solid ${C.border}` }}>
              Nenhuma aferição registrada hoje
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <VitalCard icon="💓" label="Pressão Art." value={`${lastVitals.systolic_bp || '--'}/${lastVitals.diastolic_bp || '--'}`} unit="mmHg" isNormal={isNormal('systolic', lastVitals.systolic_bp)} />
              <VitalCard icon="🫀" label="Freq. Cardíaca" value={lastVitals.heart_rate} unit="bpm" isNormal={isNormal('heart_rate', lastVitals.heart_rate)} />
              <VitalCard icon="🫁" label="SpO2" value={lastVitals.spo2} unit="%" isNormal={isNormal('spo2', lastVitals.spo2)} />
              <VitalCard icon="🌡️" label="Temperatura" value={lastVitals.temperature} unit="°C" isNormal={isNormal('temperature', lastVitals.temperature)} />
              <VitalCard icon="🍬" label="Glicemia" value={lastVitals.glucose} unit="mg/dL" isNormal={isNormal('glucose', lastVitals.glucose)} />
            </div>
          )}
        </section>

        {/* Timeline */}
        <section>
          <h2 style={{ fontFamily: T.display, fontWeight: 800, fontSize: '18px', color: C.navy, marginBottom: '16px' }}>
            Eventos de Hoje
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentEvents && recentEvents.length > 0 ? (
              recentEvents.map(event => {
                const typeInfo = eventTypes.find(t => t.type === event.event_type) || eventTypes[5]
                return (
                  <div key={event.id} style={{
                    display: 'flex', gap: '16px', padding: '16px', background: '#fff', borderRadius: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)', border: `1px solid ${C.border}`
                  }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                      {typeInfo.emoji}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, color: C.navy, fontSize: '14px' }}>{typeInfo.label}</span>
                        <span style={{ fontSize: '12px', color: C.textLight, fontWeight: 600 }}>{new Date(event.occurred_at || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      {event.notes && <p style={{ fontSize: '13px', color: C.textMid, margin: 0 }}>{event.notes}</p>}
                    </div>
                  </div>
                )
              })
            ) : (
              <div style={{ padding: '24px', background: '#fff', borderRadius: '20px', textAlign: 'center', color: C.textLight, fontSize: '14px', border: `1px solid ${C.border}` }}>
                Nenhum evento registrado ainda
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

function VitalCard({ icon, label, value, unit, isNormal }: any) {
  return (
    <div style={{
      background: isNormal ? '#fff' : C.dangerLight,
      padding: '16px',
      borderRadius: '20px',
      border: `1.5px solid ${isNormal ? C.border : C.danger}`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
    }}>
      <div style={{ fontSize: '20px', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontSize: '20px', fontWeight: 800, color: isNormal ? C.navy : C.danger, fontFamily: T.display }}>
        {value || '--'}
        <span style={{ fontSize: '12px', fontWeight: 600, color: C.textLight, marginLeft: '4px' }}>{unit}</span>
      </div>
      <div style={{ fontSize: '11px', fontWeight: 600, color: C.textMid, marginTop: '4px' }}>{label}</div>
    </div>
  )
}
