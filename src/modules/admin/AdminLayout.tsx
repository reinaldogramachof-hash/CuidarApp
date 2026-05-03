import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useClinicSummary } from '../../hooks/queries/useAdmin'
import { C, T } from '../../utils/tokens'

export default function AdminLayout() {
  const { profile, signOut } = useAuth()
  const { data: summary } = useClinicSummary(profile?.clinic_id || '')
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const navItems = [
    { path: '/admin', icon: '🏠', label: 'Dashboard', exact: true },
    { path: '/admin/patients', icon: '👥', label: 'Pacientes' },
    { path: '/admin/shifts', icon: '📅', label: 'Escalas' },
    { path: '/admin/alerts', icon: '🔔', label: 'Alertas', badge: summary?.unreadAlerts },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, fontFamily: T.body }}>
      {/* Sidebar - Desktop */}
      <aside style={{
        width: '240px',
        background: C.navy,
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        zIndex: 100,
        borderRight: '1px solid rgba(255,255,255,0.1)'
      }} className="sidebar-desktop">
        <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: C.primary, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fa-solid fa-heart" style={{ fontSize: '14px', color: '#fff' }}></i>
          </div>
          <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: '18px', letterSpacing: '-0.5px' }}>CuidarApp</span>
        </div>

        <nav style={{ flex: 1, padding: '0 12px' }}>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '14px',
                marginBottom: '4px',
                position: 'relative'
              })}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              {item.label}
              {item.badge && item.badge > 0 && (
                <span style={{
                  position: 'absolute', right: '16px', background: C.danger, color: '#fff',
                  fontSize: '10px', padding: '2px 6px', borderRadius: '10px', fontWeight: 800
                }}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>{profile?.full_name}</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>Administrador</div>
          <button onClick={handleLogout} style={{
            width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)',
            background: 'transparent', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer'
          }}>
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: '240px' }} className="main-content">
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px 100px 20px' }}>
          <Outlet />
        </div>
      </main>

      {/* Bottom Nav - Mobile */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#fff', borderTop: `1px solid ${C.border}`,
        display: 'flex', justifyContent: 'space-around', padding: '12px 0',
        zIndex: 100
      }} className="bottom-nav-mobile">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            style={({ isActive }) => ({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'none',
              color: isActive ? C.primary : C.textLight,
              position: 'relative',
              width: '25%'
            })}
          >
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            <span style={{ fontSize: '10px', fontWeight: 700 }}>{item.label}</span>
            {item.badge && item.badge > 0 && (
              <span style={{
                position: 'absolute', top: '-4px', right: '25%', background: C.danger, color: '#fff',
                fontSize: '9px', padding: '1px 5px', borderRadius: '10px', fontWeight: 800,
                border: '2px solid #fff'
              }}>
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <style>{`
        @media (max-width: 767px) {
          .sidebar-desktop { display: none !important; }
          .main-content { marginLeft: 0 !important; }
          .main-content > div { padding: 20px 20px 80px 20px !important; }
        }
        @media (min-width: 768px) {
          .bottom-nav-mobile { display: none !important; }
        }
      `}</style>
    </div>
  )
}
