import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useClinicAlerts, useMarkAlertRead } from '../../hooks/queries/useAdmin'
import { C, T } from '../../utils/tokens'
import { format } from 'date-fns'

export default function AlertsPage() {
  const { profile } = useAuth()
  const clinicId = profile?.clinic_id || ''
  const { data: alerts, isLoading } = useClinicAlerts(clinicId)
  const markReadMutation = useMarkAlertRead()

  const [filter, setFilter] = useState('all')

  const severities = [
    { id: 'all', label: 'Todos' },
    { id: 'critical', label: 'Crítico' },
    { id: 'high', label: 'Alto' },
    { id: 'medium', label: 'Médio' },
    { id: 'low', label: 'Baixo' },
  ]

  const filteredAlerts = (alerts as any[])?.filter(a => filter === 'all' || a.severity === filter)

  return (
    <div>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: T.display, fontWeight: 800, fontSize: '28px', color: C.navy, margin: 0 }}>Alertas</h1>
        <p style={{ color: C.textMid, fontSize: '14px', margin: 0 }}>Histórico de ocorrências de saúde</p>
      </header>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
        {severities.map(s => (
          <button
            key={s.id}
            onClick={() => setFilter(s.id)}
            style={{
              padding: '10px 20px', borderRadius: '12px', border: filter === s.id ? 'none' : `1.5px solid ${C.border}`,
              background: filter === s.id ? C.primary : '#fff', color: filter === s.id ? '#fff' : C.textMid,
              fontWeight: 700, fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap'
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Carregando...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredAlerts?.map((alert: any) => (
            <div key={alert.id} style={{
              background: alert.is_read ? '#fff' : getSeverityColor(alert.severity).bg,
              padding: '20px', borderRadius: '20px', border: `1px solid ${alert.is_read ? C.border : getSeverityColor(alert.severity).border}`,
              display: 'flex', gap: '16px', position: 'relative'
            }}>
              <div style={{ fontSize: '24px' }}>{getSeverityIcon(alert.severity)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 800, color: C.navy, fontSize: '15px' }}>{alert.patients?.full_name}</span>
                  <span style={{ fontSize: '11px', color: C.textLight, fontWeight: 700 }}>
                    {format(new Date(alert.created_at), 'dd/MM HH:mm')}
                  </span>
                </div>
                <div style={{ fontSize: '14px', color: alert.is_read ? C.textMid : C.navy, fontWeight: alert.is_read ? 500 : 700 }}>
                  {alert.message}
                </div>
                
                {!alert.is_read && (
                  <button 
                    onClick={() => markReadMutation.mutate({ alertId: alert.id, clinicId })}
                    style={{
                      marginTop: '12px', background: C.navy, color: '#fff', border: 'none',
                      padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    Marcar como lido
                  </button>
                )}
              </div>
              
              {!alert.is_read && (
                <div style={{ position: 'absolute', top: '10px', right: '10px', width: '8px', height: '8px', background: C.danger, borderRadius: '50%' }}></div>
              )}
            </div>
          ))}
          {filteredAlerts?.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: C.textLight, background: '#fff', borderRadius: '20px', border: `1px dashed ${C.border}` }}>
              Nenhum alerta encontrado
            </div>
          )}
        </div>
      )}
    </div>
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

function getSeverityColor(severity: string) {
  switch (severity) {
    case 'critical': return { bg: `${C.danger}08`, border: `${C.danger}33` }
    case 'high': return { bg: `${C.warning}08`, border: `${C.warning}33` }
    case 'medium': return { bg: `${C.warning}05`, border: `${C.warning}22` }
    default: return { bg: `${C.accent}05`, border: `${C.accent}22` }
  }
}
