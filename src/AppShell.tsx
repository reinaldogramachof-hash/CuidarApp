import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import { Logo } from './components';
import { PRODUCT_NAME, PRODUCT_TAGLINE } from './constants/product';
import { authService, type AuthProfile } from './services/authService';
import { supabase } from './services/supabaseClient';
import { colors, radii, shadows, typography } from './styles/theme';

type PatientRow = {
  id: string;
  name: string;
  age: number | null;
  address: string | null;
  conditions: string[];
  dependency_level: number | null;
};

type RelationshipRow = {
  id: string;
  patient_id: string;
  family_user_id: string;
  caregiver_user_id: string | null;
  invite_code: string;
  status: 'pending' | 'active' | 'inactive';
};

type ActivityRow = {
  id: string;
  type: string;
  title: string;
  description: string | null;
  occurred_at: string;
};

type AlertRow = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
};

type AuthMode = 'login' | 'register';
type RegisterRole = 'family' | 'caregiver';

const appShellStyle: CSSProperties = {
  minHeight: '100vh',
  background: `linear-gradient(160deg, ${colors.primaryLight} 0%, ${colors.bg} 48%, ${colors.accentLight} 100%)`,
  fontFamily: typography.body,
  color: colors.navy,
  padding: 20,
};

const containerStyle: CSSProperties = { width: '100%', maxWidth: 1120, margin: '0 auto' };

const cardStyle: CSSProperties = {
  background: colors.surface,
  border: `1px solid ${colors.border}`,
  borderRadius: radii.lg,
  boxShadow: shadows.card,
  padding: 18,
};

const inputStyle: CSSProperties = {
  width: '100%',
  border: `1px solid ${colors.border}`,
  borderRadius: radii.md,
  padding: '12px 14px',
  fontFamily: typography.body,
  fontSize: 14,
  boxSizing: 'border-box',
};

const buttonStyle: CSSProperties = {
  border: 'none',
  borderRadius: radii.md,
  padding: '12px 14px',
  background: colors.primary,
  color: colors.surface,
  fontFamily: typography.display,
  fontWeight: 800,
  cursor: 'pointer',
};

const secondaryButtonStyle: CSSProperties = {
  ...buttonStyle,
  background: colors.primaryLight,
  color: colors.primaryDark,
};

const sectionTitleStyle: CSSProperties = {
  fontFamily: typography.display,
  fontSize: 18,
  fontWeight: 800,
  color: colors.navy,
  margin: '0 0 12px',
};

const AppShell = () => {
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [patients, setPatients] = useState<PatientRow[]>([]);
  const [relationships, setRelationships] = useState<RelationshipRow[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [registerRole, setRegisterRole] = useState<RegisterRole>('family');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [message, setMessage] = useState('Entre ou crie uma conta para validar os perfis reais.');
  const [isLoading, setIsLoading] = useState(true);

  const selectedPatient = patients.find((patient) => patient.id === selectedPatientId) ?? patients[0] ?? null;
  const activeInvite = relationships.find((item) => item.patient_id === selectedPatient?.id)?.invite_code;

  const unreadAlerts = useMemo(() => alerts.filter((alert) => !alert.read).length, [alerts]);

  useEffect(() => {
    const boot = async () => {
      try {
        const session = await authService.getSession();
        if (session?.user) {
          const currentProfile = await authService.getProfile(session.user.id);
          setProfile(currentProfile);
        }
      } catch (error) {
        setMessage(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };

    void boot();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setProfile(null);
        setPatients([]);
        setRelationships([]);
        setActivities([]);
        setAlerts([]);
        return;
      }

      void authService.getProfile(session.user.id).then(setProfile).catch((error) => setMessage(getErrorMessage(error)));
    });

    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!profile) return;
    void loadWorkspace(profile);
  }, [profile]);

  useEffect(() => {
    if (!selectedPatientId) return;
    void loadPatientFeed(selectedPatientId);
  }, [selectedPatientId]);

  const loadWorkspace = async (currentProfile: AuthProfile) => {
    setIsLoading(true);
    try {
      if (currentProfile.role === 'family') {
        const [{ data: patientData, error: patientError }, { data: relationshipData, error: relationshipError }] = await Promise.all([
          supabase
            .from('patients')
            .select('id, name, age, address, conditions, dependency_level')
            .eq('created_by', currentProfile.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('care_relationships')
            .select('id, patient_id, family_user_id, caregiver_user_id, invite_code, status')
            .eq('family_user_id', currentProfile.id),
        ]);

        if (patientError) throw patientError;
        if (relationshipError) throw relationshipError;

        setPatients((patientData ?? []) as PatientRow[]);
        setRelationships((relationshipData ?? []) as RelationshipRow[]);
        setSelectedPatientId(patientData?.[0]?.id ?? null);
      } else {
        const { data: relationshipData, error: relationshipError } = await supabase
          .from('care_relationships')
          .select('id, patient_id, family_user_id, caregiver_user_id, invite_code, status')
          .eq('caregiver_user_id', currentProfile.id);

        if (relationshipError) throw relationshipError;

        const patientIds = (relationshipData ?? []).map((item) => item.patient_id);
        const { data: patientData, error: patientError } = patientIds.length
          ? await supabase
              .from('patients')
              .select('id, name, age, address, conditions, dependency_level')
              .in('id', patientIds)
          : { data: [], error: null };

        if (patientError) throw patientError;

        setRelationships((relationshipData ?? []) as RelationshipRow[]);
        setPatients((patientData ?? []) as PatientRow[]);
        setSelectedPatientId(patientData?.[0]?.id ?? null);
      }
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const loadPatientFeed = async (patientId: string) => {
    try {
      const [{ data: activityData, error: activityError }, { data: alertData, error: alertError }] = await Promise.all([
        supabase
          .from('activities')
          .select('id, type, title, description, occurred_at')
          .eq('patient_id', patientId)
          .order('occurred_at', { ascending: false }),
        supabase
          .from('alerts')
          .select('id, title, message, read, created_at')
          .order('created_at', { ascending: false }),
      ]);

      if (activityError) throw activityError;
      if (alertError) throw alertError;

      setActivities((activityData ?? []) as ActivityRow[]);
      setAlerts((alertData ?? []) as AlertRow[]);
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  };

  const handleAuthSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const currentProfile = authMode === 'login'
        ? await authService.login({ email, password })
        : await authService.register({ name, email, password, role: registerRole });

      setProfile(currentProfile);
      setMessage(currentProfile ? `Acesso validado como ${currentProfile.role === 'family' ? 'Familiar' : 'Cuidador'}.` : 'Confira seu e-mail para confirmar o cadastro.');
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const createDemoPatient = async () => {
    if (!profile) return;
    setIsLoading(true);
    try {
      const { data: patient, error: patientError } = await supabase
        .from('patients')
        .insert({
          name: 'Maria da Silva',
          age: 78,
          address: 'Rua das Acácias, 142 – Moema, SP',
          conditions: ['Hipertensão', 'Diabetes Tipo 2', 'Mobilidade Reduzida'],
          dependency_level: 65,
          emergency_contact_name: profile.name,
          created_by: profile.id,
        })
        .select('id, name, age, address, conditions, dependency_level')
        .single();

      if (patientError) throw patientError;

      const code = `CUIDAR-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      const { error: relationshipError } = await supabase.from('care_relationships').insert({
        patient_id: patient.id,
        family_user_id: profile.id,
        invite_code: code,
        status: 'pending',
      });

      if (relationshipError) throw relationshipError;

      setMessage(`Paciente criado. Envie o código ${code} para o cuidador.`);
      await loadWorkspace(profile);
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const acceptInvite = async () => {
    if (!profile || !inviteCode.trim()) return;
    setIsLoading(true);
    try {
      const { error } = await supabase.rpc('accept_caregiver_invite', { invite: inviteCode.trim().toUpperCase() });
      if (error) throw error;
      setMessage('Convite aceito. Paciente vinculado ao perfil cuidador.');
      setInviteCode('');
      await loadWorkspace(profile);
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const createActivity = async (type: string, title: string) => {
    if (!profile || !selectedPatient) return;
    setIsLoading(true);
    try {
      const { error } = await supabase.from('activities').insert({
        patient_id: selectedPatient.id,
        caregiver_user_id: profile.id,
        type,
        title,
        description: `Registro criado por ${profile.name}.`,
      });
      if (error) throw error;

      if (type === 'occurrence') {
        const familyId = relationships.find((item) => item.patient_id === selectedPatient.id)?.family_user_id;
        if (familyId) {
          await supabase.from('alerts').insert({
            patient_id: selectedPatient.id,
            user_id: familyId,
            type: 'occurrence',
            title: 'OCORRÊNCIA',
            message: `${profile.name} registrou uma ocorrência para ${selectedPatient.name}.`,
          });
        }
      }

      setMessage(`${title} salvo no Supabase.`);
      await loadPatientFeed(selectedPatient.id);
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    await authService.logout();
    setMessage('Sessão encerrada.');
  };

  if (isLoading && !profile) {
    return <main style={appShellStyle}><div style={containerStyle}>Carregando CuidarApp...</div></main>;
  }

  return (
    <main style={appShellStyle}>
      <div style={containerStyle}>
        <Header profile={profile} onSignOut={signOut} />
        {!profile ? (
          <AuthPanel
            mode={authMode}
            role={registerRole}
            name={name}
            email={email}
            password={password}
            message={message}
            isLoading={isLoading}
            onModeChange={setAuthMode}
            onRoleChange={setRegisterRole}
            onNameChange={setName}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleAuthSubmit}
          />
        ) : (
          <Workspace
            profile={profile}
            patients={patients}
            selectedPatient={selectedPatient}
            relationships={relationships}
            activities={activities}
            alerts={alerts}
            unreadAlerts={unreadAlerts}
            inviteCode={inviteCode}
            activeInvite={activeInvite}
            message={message}
            isLoading={isLoading}
            onCreateDemoPatient={createDemoPatient}
            onInviteCodeChange={setInviteCode}
            onAcceptInvite={acceptInvite}
            onCreateActivity={createActivity}
          />
        )}
      </div>
    </main>
  );
};

const Header = ({ profile, onSignOut }: { profile: AuthProfile | null; onSignOut: () => void }) => (
  <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ boxShadow: shadows.logo, borderRadius: radii.logo, lineHeight: 0 }}><Logo size={64} /></div>
      <div>
        <h1 style={{ margin: 0, fontFamily: typography.display, fontSize: 32, color: colors.primaryDark }}>{PRODUCT_NAME}</h1>
        <p style={{ margin: '4px 0 0', color: colors.textMid }}>{PRODUCT_TAGLINE}</p>
      </div>
    </div>
    {profile && <button type="button" style={secondaryButtonStyle} onClick={onSignOut}>Sair</button>}
  </header>
);

type AuthPanelProps = {
  mode: AuthMode;
  role: RegisterRole;
  name: string;
  email: string;
  password: string;
  message: string;
  isLoading: boolean;
  onModeChange: (mode: AuthMode) => void;
  onRoleChange: (role: RegisterRole) => void;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
};

const AuthPanel = ({ mode, role, name, email, password, message, isLoading, onModeChange, onRoleChange, onNameChange, onEmailChange, onPasswordChange, onSubmit }: AuthPanelProps) => (
  <section style={{ ...cardStyle, maxWidth: 520, margin: '40px auto' }}>
    <h2 style={sectionTitleStyle}>{mode === 'login' ? 'Entrar no CuidarApp' : 'Criar acesso de validação'}</h2>
    <p style={{ color: colors.textMid }}>Use cadastro real via Supabase para validar o painel Familiar ou Cuidador.</p>
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
      {mode === 'register' && <input style={inputStyle} value={name} onChange={(event) => onNameChange(event.target.value)} placeholder="Nome" required />}
      <input style={inputStyle} value={email} onChange={(event) => onEmailChange(event.target.value)} placeholder="E-mail" type="email" required />
      <input style={inputStyle} value={password} onChange={(event) => onPasswordChange(event.target.value)} placeholder="Senha" type="password" required minLength={6} />
      {mode === 'register' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <button type="button" style={role === 'family' ? buttonStyle : secondaryButtonStyle} onClick={() => onRoleChange('family')}>Familiar</button>
          <button type="button" style={role === 'caregiver' ? buttonStyle : secondaryButtonStyle} onClick={() => onRoleChange('caregiver')}>Cuidador</button>
        </div>
      )}
      <button type="submit" style={buttonStyle} disabled={isLoading}>{isLoading ? 'Validando...' : mode === 'login' ? 'Entrar' : 'Criar conta'}</button>
    </form>
    <button type="button" style={{ ...secondaryButtonStyle, width: '100%', marginTop: 12 }} onClick={() => onModeChange(mode === 'login' ? 'register' : 'login')}>
      {mode === 'login' ? 'Criar nova conta' : 'Já tenho conta'}
    </button>
    <p style={{ color: colors.textMid, fontSize: 13 }}>{message}</p>
  </section>
);

type WorkspaceProps = {
  profile: AuthProfile;
  patients: PatientRow[];
  selectedPatient: PatientRow | null;
  relationships: RelationshipRow[];
  activities: ActivityRow[];
  alerts: AlertRow[];
  unreadAlerts: number;
  inviteCode: string;
  activeInvite?: string;
  message: string;
  isLoading: boolean;
  onCreateDemoPatient: () => void;
  onInviteCodeChange: (value: string) => void;
  onAcceptInvite: () => void;
  onCreateActivity: (type: string, title: string) => void;
};

const Workspace = ({ profile, patients, selectedPatient, relationships, activities, alerts, unreadAlerts, inviteCode, activeInvite, message, isLoading, onCreateDemoPatient, onInviteCodeChange, onAcceptInvite, onCreateActivity }: WorkspaceProps) => (
  <>
    <section style={{ ...cardStyle, background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`, color: colors.surface, border: 'none', marginBottom: 18 }}>
      <p style={{ margin: 0, opacity: 0.85 }}>Acesso real via Supabase Auth · Perfil {profile.role === 'family' ? 'Familiar' : 'Cuidador'}</p>
      <h2 style={{ margin: '12px 0 4px', fontFamily: typography.display, fontSize: 28 }}>Olá, {profile.name}</h2>
      <p style={{ margin: 0, opacity: 0.78 }}>{selectedPatient ? `${selectedPatient.name} · ${selectedPatient.age ?? '-'} anos` : 'Nenhum paciente vinculado ainda.'}</p>
      {activeInvite && <p style={{ marginBottom: 0 }}>Código para cuidador: <strong>{activeInvite}</strong></p>}
    </section>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 18 }}>
      <Metric title="Pacientes" value={String(patients.length)} />
      <Metric title="Vínculos" value={String(relationships.length)} />
      <Metric title="Registros" value={String(activities.length)} />
      <Metric title="Alertas" value={String(unreadAlerts)} />
    </div>

    {profile.role === 'family' ? (
      <FamilyPanel patients={patients} alerts={alerts} activities={activities} selectedPatient={selectedPatient} isLoading={isLoading} message={message} onCreateDemoPatient={onCreateDemoPatient} />
    ) : (
      <CaregiverPanel selectedPatient={selectedPatient} inviteCode={inviteCode} activities={activities} isLoading={isLoading} message={message} onInviteCodeChange={onInviteCodeChange} onAcceptInvite={onAcceptInvite} onCreateActivity={onCreateActivity} />
    )}
  </>
);

const Metric = ({ title, value }: { title: string; value: string }) => (
  <section style={cardStyle}>
    <p style={{ margin: 0, color: colors.textMid }}>{title}</p>
    <strong style={{ display: 'block', marginTop: 4, fontFamily: typography.display, fontSize: 28, color: colors.primary }}>{value}</strong>
  </section>
);

const FamilyPanel = ({ patients, alerts, activities, selectedPatient, isLoading, message, onCreateDemoPatient }: { patients: PatientRow[]; alerts: AlertRow[]; activities: ActivityRow[]; selectedPatient: PatientRow | null; isLoading: boolean; message: string; onCreateDemoPatient: () => void }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(280px, 0.75fr)', gap: 18 }}>
    <section style={cardStyle}>
      <h2 style={sectionTitleStyle}>Painel Familiar</h2>
      {!patients.length && <button type="button" style={buttonStyle} disabled={isLoading} onClick={onCreateDemoPatient}>Criar paciente de teste</button>}
      {selectedPatient && <p style={{ color: colors.textMid }}>Acompanhe os registros reais feitos pelo cuidador vinculado.</p>}
      <Feed activities={activities} />
      <p style={{ color: colors.textMid }}>{message}</p>
    </section>
    <section style={cardStyle}>
      <h2 style={sectionTitleStyle}>Alertas</h2>
      {alerts.length ? alerts.map((alert) => <p key={alert.id}><strong>{alert.title}</strong><br />{alert.message}</p>) : <p style={{ color: colors.textMid }}>Nenhum alerta real ainda.</p>}
    </section>
  </div>
);

const CaregiverPanel = ({ selectedPatient, inviteCode, activities, isLoading, message, onInviteCodeChange, onAcceptInvite, onCreateActivity }: { selectedPatient: PatientRow | null; inviteCode: string; activities: ActivityRow[]; isLoading: boolean; message: string; onInviteCodeChange: (value: string) => void; onAcceptInvite: () => void; onCreateActivity: (type: string, title: string) => void }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 0.75fr) minmax(0, 1.25fr)', gap: 18 }}>
    <section style={cardStyle}>
      <h2 style={sectionTitleStyle}>Painel Cuidador</h2>
      {!selectedPatient ? (
        <div style={{ display: 'grid', gap: 10 }}>
          <p style={{ color: colors.textMid }}>Digite o código enviado pelo familiar para vincular o paciente.</p>
          <input style={inputStyle} value={inviteCode} onChange={(event) => onInviteCodeChange(event.target.value)} placeholder="Ex.: CUIDAR-ABC123" />
          <button type="button" style={buttonStyle} disabled={isLoading} onClick={onAcceptInvite}>Aceitar convite</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          <p style={{ color: colors.textMid }}>Paciente vinculado: <strong>{selectedPatient.name}</strong></p>
          <button type="button" style={buttonStyle} onClick={() => onCreateActivity('check_in', 'Check-in realizado')}>Fazer check-in</button>
          <button type="button" style={secondaryButtonStyle} onClick={() => onCreateActivity('meal', 'Refeição realizada')}>Registrar refeição</button>
          <button type="button" style={secondaryButtonStyle} onClick={() => onCreateActivity('medication', 'Medicação administrada')}>Confirmar medicação</button>
          <button type="button" style={{ ...secondaryButtonStyle, background: colors.dangerLight, color: colors.danger }} onClick={() => onCreateActivity('occurrence', 'Ocorrência registrada')}>Registrar ocorrência</button>
          <button type="button" style={secondaryButtonStyle} onClick={() => onCreateActivity('check_out', 'Check-out realizado')}>Fazer check-out</button>
        </div>
      )}
      <p style={{ color: colors.textMid }}>{message}</p>
    </section>
    <section style={cardStyle}>
      <h2 style={sectionTitleStyle}>Registros enviados</h2>
      <Feed activities={activities} />
    </section>
  </div>
);

const Feed = ({ activities }: { activities: ActivityRow[] }) => (
  <div style={{ display: 'grid', gap: 10 }}>
    {activities.length ? activities.map((activity) => (
      <div key={activity.id} style={{ borderBottom: `1px solid ${colors.border}`, paddingBottom: 10 }}>
        <strong>{activity.title}</strong>
        <div style={{ color: colors.textMid, fontSize: 13 }}>{activity.type} · {new Date(activity.occurred_at).toLocaleString('pt-BR')}</div>
        {activity.description && <div style={{ color: colors.textMid, fontSize: 13 }}>{activity.description}</div>}
      </div>
    )) : <p style={{ color: colors.textMid }}>Nenhum registro real ainda.</p>}
  </div>
);

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return 'Não foi possível concluir a operação.';
};

export default AppShell;
