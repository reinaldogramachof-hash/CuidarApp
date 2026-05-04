import { useAuth } from '../../hooks/useAuth'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useClinicSummary, useTodayShifts, useClinicAlerts, useMarkAlertRead } from '../../hooks/queries/useAdmin'


export default function AdminDashboard() {
  const { profile } = useAuth()
  const clinicId = profile?.clinic_id || ''

  const { data: summary } = useClinicSummary(clinicId)
  const { data: shifts }  = useTodayShifts(clinicId)
  const { data: alerts }  = useClinicAlerts(clinicId)
  const markReadMutation  = useMarkAlertRead()

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Bom dia'
    if (h < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  const unreadAlerts = (alerts as any[])?.filter(a => !a.is_read).slice(0, 5)

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '28px',
          color: 'var(--color-navy)', margin: '0 0 4px',
        }}>
          {greeting()}, {profile?.full_name?.split(' ')[0]} 👋
        </h1>
        <p style={{ color: 'var(--color-text-mid)', fontSize: '14px', textTransform: 'capitalize' }}>
          {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </header>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <KPICard icon="fa-users"        label="Pacientes Ativos" value={summary?.totalPatients} color="var(--color-primary)"   bg="var(--color-primary-light)" />
        <KPICard icon="fa-calendar-days" label="Turnos Hoje"      value={summary?.todayShifts}   color="var(--color-secondary)" bg="var(--color-secondary-light)" />
        <KPICard icon="fa-circle-check"  label="Em Andamento"     value={summary?.activeShifts}  color="#047857"                 bg="#d1fae5" />
        <KPICard icon="fa-bell"          label="Alertas Pendentes" value={summary?.unreadAlerts}  color="var(--color-warning)"   bg="var(--color-warning-light)" urgent={summary?.unreadAlerts > 0} />
      </div>

      {/* Banner de alertas críticos */}
      {summary?.unreadAlerts > 0 && (
        <div style={{
          background: 'var(--color-danger-light)', border: '1px solid var(--color-danger)',
          borderRadius: '16px', padding: '16px 20px', marginBottom: '32px',
          display: 'flex', alignItems: 'center', gap: '16px',
        }}>
          <div style={{
            width: '40px', height: '40px', background: 'var(--color-danger)', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0,
          }}>
            <i className="fa-solid fa-triangle-exclamation"></i>
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: '15px' }}>
              {summary.unreadAlerts} alerta{summary.unreadAlerts > 1 ? 's' : ''} requer{summary.unreadAlerts > 1 ? 'em' : ''} atenção
            </div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-mid)', marginTop: '2px' }}>
              Verifique a aba de Alertas para tomar as ações necessárias.
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
        {/* Turnos do dia */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Turnos de Hoje</h2>
            <span style={{ fontSize: '12px', color: 'var(--color-text-light)', fontWeight: 600 }}>
              {Array.isArray(shifts) ? shifts.length : 0} escalados
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Array.isArray(shifts) && shifts.length > 0 ? (
              (shifts as any[]).map(shift => (
                <div key={shift.id} style={{
                  background: '#fff', padding: '16px 20px', borderRadius: '14px',
                  border: '1px solid var(--color-border-subtle)',
                  display: 'flex', alignItems: 'center', gap: '16px',
                  boxShadow: 'var(--shadow-card)',
                }}>
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '12px', flexShrink: 0,
                    background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', color: 'var(--color-primary)',
                  }}>
                    {shift.patients?.full_name?.[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: '14px' }}>
                      {shift.patients?.full_name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-mid)', marginTop: '2px' }}>
                      <i className="fa-solid fa-user-nurse" style={{ marginRight: '4px' }}></i>
                      {shift.caregiver?.full_name}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <ShiftBadge status={shift.status} />
                    <div style={{ fontSize: '11px', color: 'var(--color-text-light)', marginTop: '4px', fontWeight: 600 }}>
                      {format(new Date(shift.start_time), 'HH:mm')} – {format(new Date(shift.end_time), 'HH:mm')}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState icon="fa-calendar-xmark" text="Nenhum turno programado para hoje" />
            )}
          </div>
        </section>

        {/* Alertas recentes */}
        <section>
          <h2 className="section-title">Alertas Recentes</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Array.isArray(unreadAlerts) && unreadAlerts.length > 0 ? (
              unreadAlerts.map((alert: any) => (
                <div key={alert.id} style={{
                  background: '#fff', padding: '16px 20px', borderRadius: '14px',
                  border: '1px solid var(--color-border-subtle)', display: 'flex', gap: '16px',
                  borderLeft: `4px solid ${severityColor(alert.severity)}`,
                }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                    background: `${severityColor(alert.severity)}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: severityColor(alert.severity), fontSize: '16px',
                  }}>
                    <i className={severityIcon(alert.severity)}></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: '14px' }}>
                      {alert.patients?.full_name}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-mid)', margin: '3px 0' }}>
                      {alert.message}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-light)', fontWeight: 600 }}>
                      {formatRelativeTime(alert.created_at)}
                    </div>
                  </div>
                  <button
                    onClick={() => markReadMutation.mutate({ alertId: alert.id, clinicId })}
                    style={{
                      background: 'none', border: '1px solid var(--color-border)', borderRadius: '8px',
                      color: 'var(--color-primary)', fontWeight: 700, fontSize: '11px', cursor: 'pointer',
                      padding: '6px 10px', height: 'fit-content', whiteSpace: 'nowrap', transition: 'all 0.2s',
                    }}
                  >
                    Marcar lido
                  </button>
                </div>
              ))
            ) : (
              <EmptyState icon="fa-circle-check" text="Nenhum alerta pendente" />
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

/* ─── Sub-componentes ─── */
function KPICard({ icon, label, value, color, bg, urgent }: any) {
  return (
    <div style={{
      background: '#fff', padding: '20px', borderRadius: '16px',
      border: urgent ? `1.5px solid ${color}` : '1px solid var(--color-border-subtle)',
      boxShadow: 'var(--shadow-card)',
      transition: 'transform 0.2s',
    }}>
      <div style={{
        width: '44px', height: '44px', borderRadius: '12px', background: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color, fontSize: '18px', marginBottom: '16px',
      }}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '32px', color: 'var(--color-navy)', lineHeight: 1 }}>
        {value ?? 0}
      </div>
      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-mid)', marginTop: '6px' }}>
        {label}
      </div>
    </div>
  )
}

function ShiftBadge({ status }: { status: string }) {
  const map: any = {
    active:    { label: 'Em andamento', color: '#047857', bg: '#d1fae5' },
    scheduled: { label: 'Agendado',     color: 'var(--color-secondary)', bg: 'var(--color-secondary-light)' },
    completed: { label: 'Concluído',    color: 'var(--color-text-light)', bg: 'var(--color-bg)' },
    missed:    { label: 'Faltou',       color: 'var(--color-danger)', bg: 'var(--color-danger-light)' },
  }
  const c = map[status] || map.scheduled
  return (
    <span className="badge" style={{ background: c.bg, color: c.color }}>
      {c.label}
    </span>
  )
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{
      padding: '32px', background: '#fff', borderRadius: '14px', textAlign: 'center',
      color: 'var(--color-text-light)', fontSize: '14px',
      border: '1px dashed var(--color-border)',
    }}>
      <i className={`fa-solid ${icon}`} style={{ fontSize: '24px', marginBottom: '12px', display: 'block', opacity: 0.4 }}></i>
      {text}
    </div>
  )
}

function severityColor(s: string) {
  return s === 'critical' ? 'var(--color-danger)' : s === 'high' ? '#d97706' : s === 'medium' ? 'var(--color-warning)' : 'var(--color-secondary)'
}
function severityIcon(s: string) {
  return s === 'critical' ? 'fa-circle-exclamation' : s === 'high' ? 'fa-triangle-exclamation' : 'fa-circle-info'
}
function formatRelativeTime(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000
  if (diff < 60) return 'agora mesmo'
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `há ${Math.floor(diff / 3600)} h`
  return format(new Date(dateStr), "d 'de' MMM", { locale: ptBR })
}

