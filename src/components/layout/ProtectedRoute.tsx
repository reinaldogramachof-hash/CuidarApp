import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { C } from '../../utils/tokens'

interface ProtectedRouteProps {
  allowedRoles?: ('admin' | 'caregiver' | 'family')[]
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth()

  if (loading) {
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

  if (!user) return <Navigate to="/login" replace />

  if (allowedRoles && (!profile?.role || !allowedRoles.includes(profile.role))) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}
