import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useMyShifts, useCheckIn } from '../../hooks/queries/useShifts'
import { C, T } from '../../utils/tokens'

export default function ShiftsListPage() {
  const { profile } = useAuth()
  const { data: shifts, isLoading } = useMyShifts(profile?.id || '')
  const checkInMutation = useCheckIn()
  const navigate = useNavigate()

  const handleAction = async (shift: any) => {
    if (shift.status === 'scheduled') {
      await checkInMutation.mutateAsync({ shiftId: shift.id })
      navigate(`/caregiver/shift/${shift.id}`)
    } else if (shift.status === 'active') {
      navigate(`/caregiver/shift/${shift.id}`)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return { label: 'Agendado', bg: C.primaryLight, color: C.primary }
      case 'active':
        return { label: '● Em andamento', bg: C.successLight, color: C.success }
      case 'completed':
        return { label: 'Concluído', bg: C.border, color: C.textMid }
      case 'missed':
        return { label: 'Não realizado', bg: C.dangerLight, color: C.danger }
      default:
        return { label: status, bg: C.bg, color: C.textMid }
    }
  }

  return (
    <div style={{
      maxWidth: '500px',
      margin: '0 auto',
      minHeight: '100vh',
      background: C.bg,
      fontFamily: T.body,
      padding: '20px'
    }}>
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: C.accent,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          fontWeight: 800,
          fontFamily: T.display
        }}>
          {profile?.full_name?.charAt(0) || '?'}
        </div>
        <div>
          <h1 style={{ fontFamily: T.display, fontWeight: 800, fontSize: '20px', color: C.navy, margin: 0 }}>
            Olá, {profile?.full_name?.split(' ')[0]}
          </h1>
          <p style={{ fontSize: '13px', color: C.textMid, margin: '2px 0 0' }}>
            Seus turnos de hoje
          </p>
        </div>
      </header>

      {/* Shifts List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {isLoading ? (
          // Skeleton
          [1, 2].map(i => (
            <div key={i} style={{
              background: '#fff',
              borderRadius: '16px',
              height: '140px',
              animation: 'pulse 1.5s infinite ease-in-out'
            }} />
          ))
        ) : shifts && shifts.length > 0 ? (
          shifts.map(shift => {
            const badge = getStatusBadge(shift.status || '')
            return (
              <div key={shift.id} style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                border: `1px solid ${C.border}`
              }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: C.primaryLight,
                    color: C.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 800
                  }}>
                    {shift.patients?.full_name?.charAt(0) || '?'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontFamily: T.display, fontWeight: 700, fontSize: '15px', color: C.navy, margin: 0 }}>
                      {shift.patients?.full_name}
                    </h3>
                    <p style={{ fontSize: '12px', color: C.textMid, margin: '2px 0 0' }}>
                      Quarto: {shift.patients?.room_unit || 'N/A'}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: C.navy }}>
                      {new Date(shift.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div style={{ fontSize: '11px', color: C.textLight }}>
                      até {new Date(shift.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 700,
                    background: badge.bg,
                    color: badge.color
                  }}>
                    {badge.label}
                  </span>

                  {(shift.status === 'scheduled' || shift.status === 'active') && (
                    <button
                      onClick={() => handleAction(shift)}
                      disabled={checkInMutation.isPending}
                      style={{
                        background: shift.status === 'scheduled' ? C.primary : C.success,
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '8px 16px',
                        fontSize: '13px',
                        fontWeight: 700,
                        fontFamily: T.display,
                        cursor: 'pointer'
                      }}
                    >
                      {shift.status === 'scheduled' ? 'Fazer Check-in' : 'Continuar Turno'}
                    </button>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: C.textLight }}>
            <i className="fa-solid fa-calendar-xmark" style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}></i>
            <p style={{ fontSize: '15px', fontWeight: 600 }}>Nenhum turno agendado para hoje</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}
