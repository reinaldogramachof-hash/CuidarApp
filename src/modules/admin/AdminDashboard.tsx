import { useAuth } from '../../hooks/useAuth'
import { useClinicSummary, useTodayShifts, useClinicAlerts, useMarkAlertRead } from '../../hooks/queries/useAdmin'
import { C, T } from '../../utils/tokens'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function AdminDashboard() {
  const { profile } = useAuth()
  const clinicId = profile?.clinic_id || ''
  
  const { data: summary } = useClinicSummary(clinicId)
  const { data: shifts } = useTodayShifts(clinicId)
  const { data: alerts } = useClinicAlerts(clinicId)
  const markReadMutation = useMarkAlertRead()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) return 'Bom dia'
    if (hour >= 12 && hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  const unreadAlerts = (alerts as any[])?.filter(a => !a.is_read).slice(0, 3)

  return (
    <div>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: T.display, fontWeight: 800, fontSize: '28px', color: C.navy, margin: '0 0 4px 0' }}>
          {getGreeting()}, {profile?.full_name?.split(' ')[0]}
        </h1>
        <p style={{ color: C.textMid, fontWeight: 600, fontSize: '14px', margin: 0, textTransform: 'capitalize' }}>
          {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </header>

      {/* KPI Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <KPICard icon="👥" label="Pacientes Ativos" value={summary?.totalPatients} color={C.primary} />
        <KPICard icon="📅" label="Turnos Hoje" value={summary?.todayShifts} color={C.accent} />
        <KPICard icon="✅" label="Em Andamento" value={summary?.activeShifts} color={C.success} />
        <KPICard icon="🔔" label="Alertas Pendentes" value={summary?.unreadAlerts} color={C.warning} />
      </div>

      {/* Alert Highlight */}
      {summary?.unreadAlerts && summary.unreadAlerts > 0 ? (
        <div style={{
          background: C.warningLight,
          border: `1px solid ${C.warning}`,
          borderRadius: '20px',
          padding: '20px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ fontSize: '24px' }}>⚠️</div>
          <div>
            <div style={{ fontWeight: 800, color: C.navy, fontSize: '16px' }}>Alertas de saúde detectados</div>
            <div style={{ fontSize: '13px', color: C.textMid }}>Existem {summary.unreadAlerts} alertas não lidos que requerem sua atenção.</div>
          </div>
        </div>
      ) : null}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }} className="dashboard-sections">
        {/* Today's Shifts */}
        <section>
          <h2 style={{ fontFamily: T.display, fontWeight: 800, fontSize: '18px', color: C.navy, marginBottom: '16px' }}>
            Turnos de Hoje
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {shifts && shifts.length > 0 ? (
              (shifts as any[]).map(shift => (
                <div key={shift.id} style={{
                  background: '#fff', padding: '16px', borderRadius: '16px', border: `1px solid ${C.border}`,
                  display: 'flex', alignItems: 'center', gap: '16px'
                }}>
                  <div style={{ width: '40px', height: '40px', background: C.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: C.primary }}>
                    {shift.patients?.full_name?.[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: C.navy, fontSize: '14px' }}>{shift.patients?.full_name}</div>
                    <div style={{ fontSize: '12px', color: C.textMid }}>Cuidador: {shift.caregiver?.full_name}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <StatusBadge status={shift.status} />
                    <div style={{ fontSize: '11px', color: C.textLight, marginTop: '4px', fontWeight: 600 }}>
                      {format(new Date(shift.start_time), 'HH:mm')} – {format(new Date(shift.end_time), 'HH:mm')}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '24px', background: '#fff', borderRadius: '16px', textAlign: 'center', color: C.textLight, fontSize: '14px', border: `1px dashed ${C.border}` }}>
                Nenhum turno programado para hoje
              </div>
            )}
          </div>
        </section>

        {/* Recent Alerts */}
        <section>
          <h2 style={{ fontFamily: T.display, fontWeight: 800, fontSize: '18px', color: C.navy, marginBottom: '16px' }}>
            Alertas Recentes
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {unreadAlerts && unreadAlerts.length > 0 ? (
              unreadAlerts.map((alert: any) => (
                <div key={alert.id} style={{
                  background: '#fff', padding: '16px', borderRadius: '16px', border: `1px solid ${C.border}`,
                  display: 'flex', gap: '16px'
                }}>
                  <div style={{ fontSize: '20px' }}>{getSeverityIcon(alert.severity)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: C.navy, fontSize: '14px' }}>{alert.patients?.full_name}</div>
                    <div style={{ fontSize: '13px', color: C.textMid, margin: '2px 0' }}>{alert.message}</div>
                    <div style={{ fontSize: '11px', color: C.textLight, fontWeight: 600 }}>{formatRelativeTime(alert.created_at)}</div>
                  </div>
                  <button 
                    onClick={() => markReadMutation.mutate({ alertId: alert.id, clinicId })}
                    style={{ background: 'none', border: 'none', color: C.primary, fontWeight: 700, fontSize: '12px', cursor: 'pointer', height: 'fit-content' }}
                  >
                    Marcar como lido
                  </button>
                </div>
              ))
            ) : (
              <div style={{ padding: '24px', background: '#fff', borderRadius: '16px', textAlign: 'center', color: C.textLight, fontSize: '14px', border: `1px dashed ${C.border}` }}>
                Nenhum alerta pendente
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

function KPICard({ icon, label, value, color }: any) {
  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '24px', border: `1px solid ${C.border}`, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
      <div style={{ fontSize: '24px', marginBottom: '12px', width: '44px', height: '44px', background: `${color}15`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <div style={{ fontSize: '28px', fontWeight: 800, color: C.navy, fontFamily: T.display }}>{value || 0}</div>
      <div style={{ fontSize: '12px', fontWeight: 600, color: C.textMid, marginTop: '2px' }}>{label}</div>
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
      padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 800,
      color: config.color, background: config.bg, textTransform: 'uppercase'
    }}>
      {config.label}
    </span>
  )
}

function getSeverityIcon(severity: string) {
  switch (severity) {
    case 'critical': return '🔴'
    case 'high': return '🟠'
    case 'medium': return '🟡'
    default: return '🔵'
  }
}

function formatRelativeTime(dateStr: string) {
  const date = new Date(dateStr)
  const diff = (new Date().getTime() - date.getTime()) / 1000
  if (diff < 60) return 'agora mesmo'
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `há ${Math.floor(diff / 3600)} h`
  return format(date, 'd/MM')
}
