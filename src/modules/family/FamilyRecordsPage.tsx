import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { useFamilyPatient } from '../../hooks/queries/useFamilyPatient'
import { C, T } from '../../utils/tokens'
import { format, parseISO, isToday, isYesterday } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const EVENT_TYPES: Record<string, { label: string; icon: string; color: string }> = {
  feeding:       { label: 'Alimentação',  icon: 'fa-utensils',      color: '#d97706' },
  hygiene:       { label: 'Higiene',      icon: 'fa-shower',        color: 'var(--color-secondary)' },
  medication:    { label: 'Medicação',    icon: 'fa-pills',         color: 'var(--color-primary)' },
  repositioning: { label: 'Reposição',   icon: 'fa-rotate',        color: '#047857' },
  dressing:      { label: 'Curativo',    icon: 'fa-bandage',       color: 'var(--color-danger)' },
  other:         { label: 'Outro',       icon: 'fa-file-lines',    color: 'var(--color-text-mid)' },
}

export default function FamilyRecordsPage() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { data: familyData } = useFamilyPatient(profile?.id || '')
  const patientId = familyData?.patients?.id

  // Busca todos os eventos do paciente, ordenados por data
  const { data: events, isLoading } = useQuery({
    queryKey: ['patient_all_events', patientId],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('care_events') as any)
        .select('*')
        .eq('patient_id', patientId)
        .order('occurred_at', { ascending: false })
      
      if (error) throw error
      return data
    },
    enabled: !!patientId
  })

  const filteredEvents = events?.filter((e: any) => !e.notes?.startsWith('[CHECKLIST]')) || []

  // Agrupar por data (se houver múltiplos dias)
  const groupedEvents: Record<string, any[]> = {}
  filteredEvents.forEach(e => {
    const date = format(parseISO(e.occurred_at || ''), 'yyyy-MM-dd')
    if (!groupedEvents[date]) groupedEvents[date] = []
    groupedEvents[date].push(e)
  })

  const getDateLabel = (dateStr: string) => {
    const date = parseISO(dateStr)
    if (isToday(date)) return 'Hoje'
    if (isYesterday(date)) return 'Ontem'
    return format(date, "EEEE, d 'de' MMMM", { locale: ptBR })
  }

  const parseNotes = (notes: string | null) => {
    if (!notes) return null
    if (notes.includes(' | ')) {
      return notes.split(' | ').map(part => {
        const [label, ...val] = part.split(': ')
        return { label: label.trim(), value: val.join(': ').trim() }
      })
    }
    return notes
  }

  return (
    <div style={{
      maxWidth: '520px', margin: '0 auto', minHeight: '100vh',
      background: C.bg, fontFamily: T.body, paddingBottom: '40px'
    }}>
      {/* Header */}
      <header style={{
        padding: '16px 20px', display: 'flex', alignItems: 'center',
        background: '#fff', borderBottom: `1px solid ${C.border}`,
        position: 'sticky', top: 0, zIndex: 10
      }}>
        <button onClick={() => navigate('/family')} style={{
          background: 'none', border: 'none', color: C.navy, fontSize: '18px', cursor: 'pointer', padding: '8px'
        }}>
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <div style={{ marginLeft: '12px' }}>
          <h1 style={{ fontFamily: T.display, fontWeight: 800, fontSize: '18px', color: C.navy, margin: 0 }}>
            Histórico de Registros
          </h1>
          <p style={{ fontSize: '12px', color: C.textMid, margin: 0 }}>
            {familyData?.patients?.full_name}
          </p>
        </div>
      </header>

      <div style={{ padding: '20px' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: C.textMid }}>
            <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '24px', marginBottom: '12px' }}></i>
            <p>Carregando registros...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: C.textLight }}>
            <i className="fa-solid fa-clipboard-list" style={{ fontSize: '48px', opacity: 0.1, marginBottom: '16px' }}></i>
            <p>Nenhum registro encontrado para este período.</p>
          </div>
        ) : (
          Object.keys(groupedEvents).sort((a, b) => b.localeCompare(a)).map(date => (
            <div key={date} style={{ marginBottom: '24px' }}>
              <h3 style={{ 
                fontSize: '12px', fontWeight: 800, color: C.textLight, 
                marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' 
              }}>
                {getDateLabel(date)}
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {groupedEvents[date].map((event) => {
                  const info = EVENT_TYPES[event.event_type] ?? EVENT_TYPES.other
                  const details = parseNotes(event.notes)

                  return (
                    <div key={event.id} style={{
                      background: '#fff', borderRadius: '16px', padding: '16px',
                      border: `1px solid ${C.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            background: `${info.color}15`, color: info.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px'
                          }}>
                            <i className={`fa-solid ${info.icon}`}></i>
                          </div>
                          <span style={{ fontWeight: 700, fontSize: '14px', color: C.navy }}>{info.label}</span>
                        </div>
                        <span style={{ fontSize: '12px', color: C.textLight, fontWeight: 600 }}>
                          {format(parseISO(event.occurred_at), 'HH:mm')}
                        </span>
                      </div>

                      {Array.isArray(details) ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {details.map((det, idx) => (
                            <div key={idx} style={{ 
                              background: '#f8f9fa', padding: '4px 8px', borderRadius: '6px',
                              border: '1px solid #edf2f7', fontSize: '11px' 
                            }}>
                              <span style={{ color: C.textLight, fontWeight: 700, marginRight: '4px' }}>{det.label}</span>
                              <span style={{ color: C.navy, fontWeight: 600 }}>{det.value}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        details && <p style={{ fontSize: '13px', color: C.textMid, margin: 0, lineHeight: 1.5 }}>{details}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
