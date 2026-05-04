import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useFamilyPatient } from '../../hooks/queries/useFamilyPatient'
import { supabase } from '../../lib/supabase'
import { useQuery } from '@tanstack/react-query'
import { C, T } from '../../utils/tokens'

export default function FamilyTeamPage() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { data: familyData } = useFamilyPatient(profile?.id || '')
  const patientId = familyData?.patients?.id

  // Busca cuidadores que já trabalharam ou estão escalados para este paciente
  const { data: team, isLoading } = useQuery({
    queryKey: ['family_team', patientId],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('shifts') as any)
        .select(`
          caregiver:user_profiles!shifts_caregiver_id_fkey(*)
        `)
        .eq('patient_id', patientId)
        .order('start_time', { ascending: false })
      
      if (error) throw error
      
      // Remover duplicatas de cuidadores
      const uniqueCaregivers = new Map()
      data?.forEach((s: any) => {
        if (s.caregiver && !uniqueCaregivers.has(s.caregiver.id)) {
          uniqueCaregivers.set(s.caregiver.id, s.caregiver)
        }
      })
      
      return Array.from(uniqueCaregivers.values())
    },
    enabled: !!patientId
  })

  return (
    <div style={{
      maxWidth: '520px', margin: '0 auto', minHeight: '100vh',
      background: C.bg, fontFamily: T.body, paddingBottom: '40px'
    }}>
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
            Equipe de Cuidados
          </h1>
          <p style={{ fontSize: '12px', color: C.textMid, margin: 0 }}>
            Profissionais dedicados ao atendimento
          </p>
        </div>
      </header>

      <div style={{ padding: '20px' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: C.textMid }}>Carregando equipe...</div>
        ) : team?.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: C.textLight }}>
            <i className="fa-solid fa-user-nurse" style={{ fontSize: '48px', opacity: 0.1, marginBottom: '16px' }}></i>
            <p>Nenhum profissional escalado ainda.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {team?.map((member: any) => (
              <div key={member.id} style={{
                background: '#fff', borderRadius: '20px', padding: '20px',
                border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: '16px'
              }}>
                {member.avatar_url ? (
                  <img src={member.avatar_url} alt={member.full_name} style={{
                    width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover'
                  }} />
                ) : (
                  <div style={{
                    width: '60px', height: '60px', borderRadius: '50%', background: C.primary,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: '20px', fontWeight: 800, fontFamily: T.display
                  }}>
                    {member.full_name[0]}
                  </div>
                )}
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: T.display, fontWeight: 800, fontSize: '16px', color: C.navy, margin: '0 0 4px' }}>
                    {member.full_name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: C.textMid, fontSize: '12px' }}>
                    <i className="fa-solid fa-id-card"></i>
                    <span>Cuidador Profissional</span>
                  </div>
                  {member.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: C.primary, fontSize: '12px', marginTop: '4px', fontWeight: 600 }}>
                      <i className="fa-solid fa-phone"></i>
                      <span>{member.phone}</span>
                    </div>
                  )}
                </div>
                
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px', background: C.primaryLight,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.primary
                }}>
                  <i className="fa-solid fa-message"></i>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ 
          marginTop: '32px', padding: '20px', background: C.navy, borderRadius: '20px', color: '#fff'
        }}>
          <h4 style={{ fontFamily: T.display, fontWeight: 800, fontSize: '15px', marginBottom: '8px' }}>
            Canal de Suporte 24h
          </h4>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '16px', lineHeight: 1.5 }}>
            Caso precise falar com a coordenação clínica sobre a equipe, use o canal direto.
          </p>
          <button style={{
            width: '100%', padding: '12px', background: C.primary, color: '#fff', 
            border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '13px', cursor: 'pointer'
          }}>
            Falar com a Clínica
          </button>
        </div>
      </div>
    </div>
  )
}
