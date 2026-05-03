import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { C, T } from '../../utils/tokens'

export default function UnauthorizedPage() {
  const { signOut, profile } = useAuth()
  const navigate = useNavigate()

  const handleBack = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: C.bg,
      fontFamily: T.body,
      padding: '20px'
    }}>
      <div style={{
        background: '#fff',
        padding: '40px',
        borderRadius: '24px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          background: C.dangerLight,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          color: C.danger,
          fontSize: '28px',
        }}>
          <i className="fa-solid fa-lock"></i>
        </div>
        
        <h1 style={{
          fontFamily: T.display,
          fontWeight: 800,
          fontSize: '22px',
          color: C.navy,
          margin: '0 0 12px 0',
        }}>
          Acesso não permitido
        </h1>
        
        <div style={{
          fontSize: '14px',
          color: C.textMid,
          marginBottom: '24px',
          lineHeight: 1.5
        }}>
          <p style={{ margin: '0 0 12px 0' }}>
            Você não tem permissão para acessar esta área. Se acredita que isso é um erro, entre em contato com o administrador da sua clínica.
          </p>
          <div style={{ padding: '8px', background: '#F8FAFC', borderRadius: '8px', fontSize: '11px', color: C.textLight, border: `1px solid ${C.border}` }}>
            <strong>Status do Perfil:</strong><br/>
            {!profile ? '⚠️ Registro não encontrado no banco' : `✅ Role detectada: ${profile.role || 'Nula'}`}
          </div>
        </div>
        
        <button
          onClick={handleBack}
          style={{
            width: '100%',
            background: C.primary,
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            padding: '14px',
            fontFamily: T.display,
            fontWeight: 800,
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          Voltar para o Login
        </button>
      </div>
    </div>
  )
}
