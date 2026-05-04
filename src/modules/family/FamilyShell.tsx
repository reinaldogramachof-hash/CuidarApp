import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { C, T } from '../../utils/tokens'
import FamilyHomePage from './FamilyHomePage'
import VitalHistoryPage from './VitalHistoryPage'
import FamilyRecordsPage from './FamilyRecordsPage'
import FamilyTeamPage from './FamilyTeamPage'

export default function FamilyShell() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div style={{ minHeight: '100vh', background: C.bg, paddingBottom: '70px' }}>
      <Routes>
        <Route index element={<FamilyHomePage />} />
        <Route path="vitals" element={<VitalHistoryPage />} />
        <Route path="records" element={<FamilyRecordsPage />} />
        <Route path="team" element={<FamilyTeamPage />} />
        <Route path="*" element={<Navigate to="" replace />} />
      </Routes>

      {/* ── Barra de Ações Fixas (Persistente) ── */}
      <nav style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: '520px', background: '#fff',
        borderTop: `1px solid ${C.border}`, display: 'flex',
        justifyContent: 'space-around', padding: '8px 0 14px', zIndex: 100,
        boxShadow: '0 -2px 12px rgba(0,0,0,0.06)',
      }}>
        {[
          { label: 'Início',   icon: 'fa-house',       path: '/family' },
          { label: 'Sinais',   icon: 'fa-heart-pulse', path: '/family/vitals' },
          { label: 'Equipe',   icon: 'fa-users',       path: '/family/team' },
          { label: 'Registro', icon: 'fa-file-lines',  path: '/family/records' },
        ].map(item => {
          const isActive = item.path === '/family'
            ? location.pathname === '/family'
            : location.pathname.startsWith(item.path)
            
          return (
            <button key={item.label} onClick={() => navigate(item.path)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              background: 'none', border: 'none', cursor: 'pointer', width: '25%',
              color: isActive ? C.primary : C.textLight,
            }}>
              <i className={`fa-solid ${item.icon}`} style={{ fontSize: '20px' }}></i>
              <span style={{ fontSize: '10px', fontWeight: 700 }}>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
