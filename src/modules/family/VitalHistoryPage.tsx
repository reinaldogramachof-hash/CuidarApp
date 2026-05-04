import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useFamilyPatient } from '../../hooks/queries/useFamilyPatient'
import { supabase } from '../../lib/supabase'
import { useQuery } from '@tanstack/react-query'
import { C, T } from '../../utils/tokens'
import { format, subDays, isToday, isYesterday, parseISO } from 'date-fns'
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { ptBR } from 'date-fns/locale'

export default function VitalHistoryPage() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { data: familyData } = useFamilyPatient(profile?.id || '')
  const patientId = familyData?.patients?.id

  const { data: vitals, isLoading } = useQuery({
    queryKey: ['vital_history', patientId],
    queryFn: async () => {
      const sevenDaysAgo = subDays(new Date(), 7).toISOString()
      const { data, error } = await (supabase
        .from('vital_signs') as any)
        .select('*')
        .eq('patient_id', patientId)
        .gte('measured_at', sevenDaysAgo)
        .order('measured_at', { ascending: false })
      
      if (error) throw error
      return data
    },
    enabled: !!patientId
  })

  const chartData = [...(vitals || [])].reverse().map(v => ({
    t: format(parseISO(v.measured_at), 'dd/MM'),
    spo2: v.spo2,
    fc: v.heart_rate,
  }))

  // Grouping vitals by date
  const groupedVitals: Record<string, any[]> = {}
  vitals?.forEach(v => {
    const date = format(parseISO(v.measured_at), 'yyyy-MM-dd')
    if (!groupedVitals[date]) groupedVitals[date] = []
    groupedVitals[date].push(v)
  })

  const getDateLabel = (dateStr: string) => {
    const date = parseISO(dateStr)
    if (isToday(date)) return 'Hoje'
    if (isYesterday(date)) return 'Ontem'
    return format(date, "EEE, d 'de' MMM", { locale: ptBR })
  }

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
        background: '#fff',
        borderBottom: `1px solid ${C.border}`,
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <button onClick={() => navigate('/family')} style={{
          background: 'none', border: 'none', color: C.navy, fontSize: '18px', cursor: 'pointer', padding: '8px'
        }}>
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <div style={{ marginLeft: '12px' }}>
          <h1 style={{ fontFamily: T.display, fontWeight: 800, fontSize: '18px', color: C.navy, margin: 0 }}>
            Histórico de Sinais Vitais
          </h1>
          <p style={{ fontSize: '12px', color: C.textMid, margin: 0 }}>
            {familyData?.patients?.full_name}
          </p>
        </div>
      </header>

      <div style={{ padding: '20px' }}>
        {/* ── Gráfico de Tendência ── */}
        {!isLoading && chartData.length > 1 && (
          <div style={{ background: '#fff', borderRadius: '16px', border: `1px solid ${C.border}`, padding: '16px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: C.textMid, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Tendência 7 dias
            </h3>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={chartData} margin={{ top: 5, right: 8, bottom: 0, left: -20 }}>
                <XAxis dataKey="t" tick={{ fontSize: 10, fill: C.textLight }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ fontSize: '12px', borderRadius: '8px', border: `1px solid ${C.border}` }}
                  formatter={(value: any, name: string) => [value ?? '--', name === 'spo2' ? 'SpO₂ (%)' : 'FC (bpm)']}
                />
                <Line type="monotone" dataKey="spo2" stroke={C.primary} strokeWidth={2} dot={false} name="spo2" />
                <Line type="monotone" dataKey="fc"   stroke={C.navy}    strokeWidth={2} dot={false} name="fc" />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: C.textMid }}>
                <div style={{ width: '16px', height: '2px', background: C.primary, borderRadius: '1px' }}></div>
                SpO₂
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: C.textMid }}>
                <div style={{ width: '16px', height: '2px', background: C.navy, borderRadius: '1px' }}></div>
                FC
              </div>
            </div>
          </div>
        )}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: C.textMid }}>Carregando histórico...</div>
        ) : Object.keys(groupedVitals).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: C.textLight, fontStyle: 'italic' }}>
            Nenhum sinal vital registrado nos últimos 7 dias
          </div>
        ) : (
          Object.keys(groupedVitals).sort((a, b) => b.localeCompare(a)).map(date => (
            <div key={date} style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: C.textMid, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {getDateLabel(date)}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {groupedVitals[date].map(v => (
                  <div key={v.id} style={{
                    background: '#fff',
                    padding: '16px',
                    borderRadius: '16px',
                    border: `1px solid ${C.border}`,
                    borderLeft: v.alert_triggered ? `4px solid ${C.danger}` : `1px solid ${C.border}`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: C.navy }}>
                        {format(parseISO(v.measured_at), 'HH:mm')}
                      </span>
                      {v.alert_triggered && (
                        <span style={{ fontSize: '10px', fontWeight: 800, color: C.danger, background: C.dangerLight, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                          Alerta
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px 8px' }}>
                      <VitalItem label="PA" value={`${v.systolic_bp}/${v.diastolic_bp}`} unit="mmHg" />
                      <VitalItem label="FC" value={v.heart_rate} unit="bpm" />
                      <VitalItem label="SpO2" value={v.spo2} unit="%" />
                      <VitalItem label="Temp" value={v.temperature} unit="°C" />
                      <VitalItem label="Glic" value={v.glucose} unit="mg/dL" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function VitalItem({ label, value, unit }: { label: string, value: any, unit: string }) {
  return (
    <div>
      <div style={{ fontSize: '10px', fontWeight: 700, color: C.textLight, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: '13px', fontWeight: 700, color: C.navy }}>
        {value || '--'} <span style={{ fontSize: '10px', fontWeight: 600, color: C.textMid }}>{unit}</span>
      </div>
    </div>
  )
}
