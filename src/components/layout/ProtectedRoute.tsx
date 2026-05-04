import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { C } from '../../utils/tokens'

interface ProtectedRouteProps {
  allowedRoles?: ('admin' | 'caregiver' | 'family')[]
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth()

  // Se está carregando pela PRIMEIRA VEZ (sem perfil), mostra o spinner
  if (loading && !profile) {
    return (
      <div style={{
        height: '100vh', width: '100vw',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: C.bg
      }}>
        <div style={{
          width: '40px', height: '40px',
          border: `4px solid ${C.primaryLight}`,
          borderTop: `4px solid ${C.primary}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // Se o carregamento terminou e não há usuário, vai para login
  if (!loading && !user) return <Navigate to="/login" replace />

  // Se já temos os dados (mesmo que loading seja true por um refresh em background),
  // verificamos a permissão. Só redirecionamos se o loading for FALSE e a role for incompatível.
  if (!loading && allowedRoles && (!profile?.role || !allowedRoles.includes(profile.role))) {
    return <Navigate to="/unauthorized" replace />
  }

  // Se ainda está carregando mas já temos o perfil (refresh), ou se tudo bate, renderiza
  return <Outlet />
}
