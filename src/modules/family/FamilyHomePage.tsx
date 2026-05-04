import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useFamilyPatient, usePatientActiveShift, usePatientAlerts } from '../../hooks/queries/useFamilyPatient'
import { useCareEvents } from '../../hooks/queries/useCareEvents'
import { useShiftVitalSigns } from '../../hooks/queries/useVitalSigns'

const EVENT_TYPES: Record<string, { label: string; icon: string; color: string }> = {
  feeding:       { label: 'Alimentação',  icon: 'fa-utensils',      color: '#d97706' },
  hygiene:       { label: 'Higiene',      icon: 'fa-shower',        color: 'var(--color-secondary)' },
  medication:    { label: 'Medicação',    icon: 'fa-pills',         color: 'var(--color-primary)' },
  repositioning: { label: 'Reposição',   icon: 'fa-rotate',        color: '#047857' },
  dressing:      { label: 'Curativo',    icon: 'fa-bandage',       color: 'var(--color-danger)' },
  other:         { label: 'Outro',       icon: 'fa-file-lines',    color: 'var(--color-text-mid)' },
}

function isNormal(type: string, value: number | null | undefined) {
  if (value == null) return true
  switch (type) {
    case 'spo2':        return value >= 92
    case 'systolic':    return value >= 90 && value <= 160
    case 'heart_rate':  return value >= 50 && value <= 100
    case 'temperature': return value <= 37.8
    case 'glucose':     return value >= 70 && value <= 180
    default: return true
  }
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

export default function FamilyHomePage() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const { data: familyData, isLoading } = useFamilyPatient(profile?.id || '')
  const patient = familyData?.patients

  const { data: activeShift } = usePatientActiveShift(patient?.id || '')
  const { data: alerts }      = usePatientAlerts(patient?.id || '')
  const { data: vitals }      = useShiftVitalSigns(activeShift?.id || '')
  const { data: events }      = useCareEvents(activeShift?.id || '')

  const lastVitals   = vitals?.[0]
  const prevVitals   = vitals?.[1]
  const recentEvents = events?.slice(0, 5)
  const unreadAlerts = (alerts as any[])?.filter(a => !a.is_read) ?? []

  const handleLogout = async () => { await signOut(); navigate('/login') }

  return (
    <div style={{
      maxWidth: '520px', margin: '0 auto', minHeight: '100vh',
      background: 'var(--color-bg)', fontFamily: 'var(--font-body)', paddingBottom: '80px',
    }}>

      {/* ── Header ── */}
      <header style={{
        padding: '14px 20px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', background: '#fff',
        borderBottom: '1px solid var(--color-border-subtle)', position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', background: 'var(--color-primary)',
            borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <i className="fa-solid fa-heart" style={{ color: '#fff', fontSize: '14px' }}></i>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px', color: 'var(--color-navy)' }}>
            CuidarApp
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {unreadAlerts.length > 0 && (
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '36px', height: '36px', background: 'var(--color-danger-light)', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-danger)', fontSize: '16px',
              }}>
                <i className="fa-solid fa-bell"></i>
              </div>
              <span style={{
                position: 'absolute', top: '-3px', right: '-3px', background: 'var(--color-danger)',
                color: '#fff', fontSize: '9px', fontWeight: 800, padding: '1px 5px',
                borderRadius: 'var(--radius-full)', border: '2px solid #fff',
              }}>{unreadAlerts.length}</span>
            </div>
          )}
          <button onClick={handleLogout} style={{
            background: 'none', border: '1px solid var(--color-border)', borderRadius: '8px',
            color: 'var(--color-text-mid)', fontWeight: 600, fontSize: '13px', cursor: 'pointer',
            padding: '6px 12px',
          }}>Sair</button>
        </div>
      </header>

      <div style={{ padding: '20px' }}>
        {/* ── Saudação ── */}
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '22px', color: 'var(--color-navy)', margin: '0 0 4px' }}>
            {getGreeting()}, {profile?.full_name?.split(' ')[0]}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-mid)', margin: 0 }}>
            {patient?.full_name ? `Acompanhando ${patient.full_name}` : 'Carregando...'}
          </p>
        </div>

        {/* ── Card do Paciente ── */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-light)' }}>
            <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '24px' }}></i>
          </div>
        ) : (
          <div style={{
            background: 'var(--color-navy)', borderRadius: '20px', padding: '24px',
            color: '#fff', marginBottom: '20px', boxShadow: '0 8px 24px rgba(25,28,29,0.15)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              {patient?.photo_url ? (
                <img src={patient.photo_url} alt={patient.full_name} style={{
                  width: '68px', height: '68px', borderRadius: '50%', objectFit: 'cover',
                  border: '3px solid var(--color-primary)',
                }} />
              ) : (
                <div style={{
                  width: '68px', height: '68px', borderRadius: '50%', background: 'var(--color-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '24px',
                }}>
                  {patient?.full_name?.[0] ?? '?'}
                </div>
              )}
              <div style={{ flex: 1 }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', margin: '0 0 4px' }}>
                  {patient?.full_name ?? 'Paciente'}
                </h1>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', margin: 0 }}>
                  {patient?.condition || 'Sem condição registrada'}
                </p>
              </div>
              <span className="badge" style={{ background: 'rgba(111,215,214,0.2)', color: 'var(--color-primary-mid)', flexShrink: 0 }}>
                Estável
              </span>
            </div>

            {/* Cuidador ativo */}
            <div style={{
              background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: activeShift?.status === 'active' ? '#4ade80' : '#facc15',
                }}></div>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>
                  {activeShift?.status === 'active'
                    ? `${activeShift.caregiver?.full_name} — em serviço`
                    : activeShift?.status === 'scheduled'
                    ? `Próximo turno: ${new Date(activeShift.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    : 'Nenhum turno hoje'}
                </span>
              </div>
              {activeShift && (
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                  {new Date(activeShift.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}–
                  {new Date(activeShift.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          </div>
        )}

        {/* ── Banner de Alertas ── */}
        {unreadAlerts.length > 0 && (
          <div style={{
            background: 'var(--color-danger-light)', border: '1.5px solid var(--color-danger)',
            borderRadius: '14px', padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px',
            color: 'var(--color-danger)', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
          }} onClick={() => navigate('/family/vitals')}>
            <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '18px' }}></i>
            <span>{unreadAlerts.length} alerta{unreadAlerts.length > 1 ? 's' : ''} ativo{unreadAlerts.length > 1 ? 's' : ''} — toque para ver</span>
            <i className="fa-solid fa-chevron-right" style={{ marginLeft: 'auto', opacity: 0.6 }}></i>
          </div>
        )}

        {/* ── Sinais Vitais ── */}
        <section style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Sinais Vitais</h2>
            <button onClick={() => navigate('/family/vitals')} style={{
              background: 'none', border: 'none', color: 'var(--color-primary)',
              fontWeight: 700, fontSize: '13px', cursor: 'pointer',
            }}>
              Ver histórico <i className="fa-solid fa-arrow-right" style={{ fontSize: '11px' }}></i>
            </button>
          </div>

          {!lastVitals ? (
            <div style={{
              padding: '24px', background: '#fff', borderRadius: '16px', textAlign: 'center',
              color: 'var(--color-text-light)', fontSize: '14px', border: '1px solid var(--color-border-subtle)',
            }}>
              <i className="fa-solid fa-heart-pulse" style={{ fontSize: '24px', opacity: 0.3, marginBottom: '8px', display: 'block' }}></i>
              Nenhuma aferição registrada hoje
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <VitalCard icon="fa-heart"            label="Pressão Art."   value={`${lastVitals.systolic_bp ?? '--'}/${lastVitals.diastolic_bp ?? '--'}`} unit="mmHg" ok={isNormal('systolic', lastVitals.systolic_bp)}    cur={lastVitals.systolic_bp}  prev={prevVitals?.systolic_bp} />
              <VitalCard icon="fa-heart-pulse"      label="Freq. Cardíaca" value={lastVitals.heart_rate}  unit="bpm"   ok={isNormal('heart_rate', lastVitals.heart_rate)}   cur={lastVitals.heart_rate}   prev={prevVitals?.heart_rate} />
              <VitalCard icon="fa-lungs"            label="SpO₂"           value={lastVitals.spo2}        unit="%"     ok={isNormal('spo2', lastVitals.spo2)}                cur={lastVitals.spo2}         prev={prevVitals?.spo2} />
              <VitalCard icon="fa-temperature-half" label="Temperatura"    value={lastVitals.temperature} unit="°C"    ok={isNormal('temperature', lastVitals.temperature)}  cur={lastVitals.temperature}  prev={prevVitals?.temperature} />
              {lastVitals.glucose != null && (
                <VitalCard icon="fa-droplet" label="Glicemia" value={lastVitals.glucose} unit="mg/dL" ok={isNormal('glucose', lastVitals.glucose)} cur={lastVitals.glucose} prev={prevVitals?.glucose} />
              )}
            </div>
          )}
        </section>

        {/* ── Linha do Dia ── */}
        <section>
          <h2 className="section-title">Linha do Dia</h2>
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid var(--color-border-subtle)', overflow: 'hidden' }}>
            {Array.isArray(recentEvents) && recentEvents.length > 0 ? (
              recentEvents.map((event, i) => {
                const info = EVENT_TYPES[event.event_type] ?? EVENT_TYPES.other
                return (
                  <div key={event.id} style={{
                    display: 'flex', gap: '14px', padding: '14px 20px', alignItems: 'flex-start',
                    borderBottom: i < recentEvents.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                  }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                      background: `${info.color}15`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: info.color, fontSize: '15px',
                    }}>
                      <i className={`fa-solid ${info.icon}`}></i>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-navy)' }}>{info.label}</div>
                      {event.notes && <div style={{ fontSize: '12px', color: 'var(--color-text-mid)', marginTop: '2px' }}>{event.notes}</div>}
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-light)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {new Date(event.occurred_at || '').toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
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
        </section>
      </div>

      {/* ── Bottom Nav ── */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff',
        borderTop: '1px solid var(--color-border-subtle)', display: 'flex',
        justifyContent: 'space-around', padding: '8px 0 14px', zIndex: 10,
        boxShadow: '0 -2px 12px rgba(0,0,0,0.06)',
      }}>
        {[
          { label: 'Início',   icon: 'fa-house',       path: '/family' },
          { label: 'Sinais',   icon: 'fa-heart-pulse', path: '/family/vitals' },
          { label: 'Equipe',   icon: 'fa-users',       path: '/family/team' },
          { label: 'Registro', icon: 'fa-file-lines',  path: '/family/records' },
        ].map(item => {
          const isActive = item.path === '/family'
            ? location.pathname === '/family'
            : location.pathname.startsWith(item.path)
          return (
            <button key={item.label} onClick={() => navigate(item.path)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              background: 'none', border: 'none', cursor: 'pointer', width: '25%',
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-light)',
            }}>
              <i className={`fa-solid ${item.icon}`} style={{ fontSize: '20px' }}></i>
              <span style={{ fontSize: '10px', fontWeight: 700 }}>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

/* ─── VitalCard ─── */
function VitalCard({ icon, label, value, unit, ok, cur, prev }: any) {
  const trend = prev != null && cur != null
    ? cur > prev ? 'up' : cur < prev ? 'down' : 'stable'
    : null
  const trendArrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'
  const trendColor = trend === 'stable'
    ? 'var(--color-text-light)'
    : ok ? '#047857' : 'var(--color-danger)'

  return (
    <div style={{
      background: ok ? '#fff' : 'var(--color-danger-light)',
      padding: '14px 16px', borderRadius: '14px',
      border: `1.5px solid ${ok ? 'var(--color-border-subtle)' : 'var(--color-danger)'}`,
    }}>
      <div style={{ marginBottom: '8px', color: ok ? 'var(--color-primary)' : 'var(--color-danger)', fontSize: '18px' }}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <div style={{
        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px',
        color: ok ? 'var(--color-navy)' : 'var(--color-danger)',
      }}>
        {value ?? '--'}
        <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-text-light)', marginLeft: '3px' }}>{unit}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-mid)' }}>{label}</div>
        {trend && (
          <span style={{ fontSize: '13px', fontWeight: 800, color: trendColor }}>{trendArrow}</span>
        )}
      </div>
    </div>
  )
}
