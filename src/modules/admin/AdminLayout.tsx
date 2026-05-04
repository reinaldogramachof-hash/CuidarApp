import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useClinicSummary } from '../../hooks/queries/useAdmin'

export default function AdminLayout() {
  const { profile, signOut } = useAuth()
  const { data: summary } = useClinicSummary(profile?.clinic_id || '')
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const navItems = [
    { path: '/admin',          icon: 'fa-house',      label: 'Painel',    exact: true },
    { path: '/admin/patients', icon: 'fa-users',       label: 'Pacientes' },
    { path: '/admin/shifts',   icon: 'fa-calendar-days', label: 'Escalas' },
    { path: '/admin/alerts',   icon: 'fa-bell',        label: 'Alertas', badge: summary?.unreadAlerts },
  ]

  const initials = profile?.full_name?.split(' ').map((n: string) => n[0]).slice(0, 2).join('') || 'A'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)', fontFamily: 'var(--font-body)' }}>

      {/* ── Sidebar Desktop ── */}
      <aside style={{
        width: '260px', background: 'var(--color-navy)', color: '#fff',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, bottom: 0, zIndex: 100,
        borderRight: '1px solid rgba(255,255,255,0.08)',
      }} className="sidebar-desktop">

        {/* Logo */}
        <div style={{ padding: '28px 24px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{
            width: '36px', height: '36px',
            background: 'var(--color-primary)',
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 36 36" fill="none">
              <path d="M18 30C18 30 6 21 6 13C6 9.13 9.13 6 13 6C15.3 6 18 8 18 8C18 8 20.7 6 23 6C26.87 6 30 9.13 30 13C30 21 18 30 18 30Z" fill="white"/>
              <path d="M14 18H22M18 14V22" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px' }}>CuidarApp</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Painel Admin</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path} end={item.exact}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '11px 14px', borderRadius: '10px',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
                background: isActive ? 'rgba(111,215,214,0.15)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--color-primary-mid)' : '3px solid transparent',
                textDecoration: 'none', fontWeight: 600, fontSize: '14px',
                marginBottom: '4px', position: 'relative', transition: 'all 0.15s',
              })}
            >
              <i className={`fa-solid ${item.icon}`} style={{ width: '18px', textAlign: 'center' }}></i>
              {item.label}
              {item.badge != null && item.badge > 0 && (
                <span style={{
                  marginLeft: 'auto', background: 'var(--color-danger)', color: '#fff',
                  fontSize: '10px', padding: '2px 7px', borderRadius: 'var(--radius-full)', fontWeight: 800,
                }}>{item.badge}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Usuário + Sair */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
            background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px',
          }}>{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {profile?.full_name}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Administrador</div>
          </div>
          <button onClick={handleLogout} title="Sair" style={{
            background: 'rgba(255,255,255,0.1)', border: 'none', color: 'rgba(255,255,255,0.7)',
            borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
          </button>
        </div>
      </aside>

      {/* ── Conteúdo Principal ── */}
      <main style={{ flex: 1, marginLeft: '260px' }} className="main-content">
        <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '40px 28px 100px' }}>
          <Outlet />
        </div>
      </main>

      {/* ── Bottom Nav Mobile ── */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'var(--color-navy)', borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', justifyContent: 'space-around', padding: '8px 0 12px',
        zIndex: 100,
      }} className="bottom-nav-mobile">
        {navItems.map(item => (
          <NavLink key={item.path} to={item.path} end={item.exact}
            style={({ isActive }) => ({
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              textDecoration: 'none', color: isActive ? 'var(--color-primary-mid)' : 'rgba(255,255,255,0.45)',
              position: 'relative', width: '25%', fontSize: '10px', fontWeight: 700,
            })}
          >
            <i className={`fa-solid ${item.icon}`} style={{ fontSize: '20px' }}></i>
            <span>{item.label}</span>
            {item.badge != null && item.badge > 0 && (
              <span style={{
                position: 'absolute', top: '-4px', right: '25%',
                background: 'var(--color-danger)', color: '#fff',
                fontSize: '9px', padding: '1px 5px', borderRadius: 'var(--radius-full)', fontWeight: 800,
                border: '2px solid var(--color-navy)',
              }}>{item.badge}</span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
