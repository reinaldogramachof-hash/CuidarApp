import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { Avatar, Badge, Divider, Logo, ProgressRing } from './components';
import { PRODUCT_NAME, PRODUCT_POSITIONING, PRODUCT_TAGLINE } from './constants/product';
import { mockCaregiverUser, mockPatient } from './data/mockCareData';
import { careService } from './services/careService';
import { colors, radii, shadows, typography } from './styles/theme';
import type { Activity, ActivityType, Alert, DailyReport, MedicationAdministration, Patient } from './types/domain';
import { formatTime } from './utils/date';

type ViewMode = 'family' | 'caregiver';
type ShiftStatus = 'not_started' | 'active' | 'finished';

type QuickAction = {
  label: string;
  title: string;
  type: ActivityType;
  tone: 'primary' | 'accent' | 'warning' | 'danger' | 'info';
};

const loadFonts = () => {
  const existing = document.querySelector('[data-cuidarapp-fonts="true"]');
  if (existing) return;

  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap';
  link.rel = 'stylesheet';
  link.dataset.cuidarappFonts = 'true';
  document.head.appendChild(link);
};

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

const sectionTitleStyle: CSSProperties = {
  fontFamily: typography.display,
  fontSize: 18,
  fontWeight: 800,
  color: colors.navy,
  margin: '0 0 12px',
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

const toneMap = {
  primary: { color: colors.primary, background: colors.primaryLight },
  danger: { color: colors.danger, background: colors.dangerLight },
  accent: { color: colors.accent, background: colors.accentLight },
  info: { color: colors.info, background: colors.infoLight },
  warning: { color: colors.warning, background: colors.warningLight },
};

const quickActions: QuickAction[] = [
  { label: 'Refeição', title: 'Refeição realizada', type: 'meal', tone: 'accent' },
  { label: 'Higiene', title: 'Higiene/banho assistido', type: 'hygiene', tone: 'info' },
  { label: 'Medicação', title: 'Medicação administrada', type: 'medication', tone: 'primary' },
  { label: 'Sinais vitais', title: 'Sinais vitais aferidos', type: 'vitals', tone: 'accent' },
  { label: 'Observação', title: 'Observação geral registrada', type: 'observation', tone: 'warning' },
  { label: 'Ocorrência', title: 'Ocorrência registrada', type: 'occurrence', tone: 'danger' },
];

const AppShell = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('family');
  const [patient, setPatient] = useState<Patient | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [dailyReport, setDailyReport] = useState<DailyReport | null>(null);
  const [administrations, setAdministrations] = useState<MedicationAdministration[]>([]);
  const [shiftStatus, setShiftStatus] = useState<ShiftStatus>('active');
  const [lastSavedMessage, setLastSavedMessage] = useState('Protótipo MVP usando dados simulados.');

  useEffect(() => {
    loadFonts();

    const loadData = async () => {
      const patientId = mockPatient.id;
      const [patientData, activityData, alertData, reportData, medicationData] = await Promise.all([
        careService.getPatient(patientId),
        careService.listActivities(patientId),
        careService.listAlerts(patientId),
        careService.getDailyReport(patientId, '2026-05-02'),
        careService.listMedicationAdministrations(patientId),
      ]);

      setPatient(patientData);
      setActivities(activityData);
      setAlerts(alertData);
      setDailyReport(reportData);
      setAdministrations(medicationData);
    };

    void loadData();
  }, []);

  const medicationProgress = useMemo(() => {
    if (!administrations.length) return 0;
    const administered = administrations.filter((item) => item.status === 'administered').length;
    return Math.round((administered / administrations.length) * 100);
  }, [administrations]);

  const unreadAlerts = alerts.filter((item) => !item.read);
  const latestActivities = activities.slice(0, 7);

  const createActivity = async (title: string, type: ActivityType, description?: string) => {
    const activity = await careService.createActivity({
      patientId: mockPatient.id,
      caregiverUserId: mockCaregiverUser.id,
      title,
      type,
      description,
    });

    setActivities((current) => [activity, ...current]);
    setLastSavedMessage(`${title} salvo às ${formatTime(activity.occurredAt)}.`);

    if (type === 'occurrence') {
      setAlerts((current) => [
        {
          id: `alert-${Date.now()}`,
          patientId: mockPatient.id,
          type: 'occurrence',
          title: 'OCORRÊNCIA',
          message: `${mockCaregiverUser.name} registrou uma ocorrência para ${mockPatient.name}.`,
          read: false,
          createdAt: activity.createdAt,
        },
        ...current,
      ]);
    }
  };

  const handleCheckIn = async () => {
    setShiftStatus('active');
    await createActivity('Check-in realizado', 'check_in', 'Cuidadora iniciou o turno de cuidado.');
  };

  const handleCheckOut = async () => {
    setShiftStatus('finished');
    await createActivity('Check-out realizado', 'check_out', 'Cuidadora encerrou o turno de cuidado.');
  };

  const handleQuickAction = async (action: QuickAction) => {
    await createActivity(action.title, action.type, `Registro rápido: ${action.label}.`);

    if (action.type === 'medication') {
      setAdministrations((current) => {
        const pendingIndex = current.findIndex((item) => item.status === 'pending' || item.status === 'late');
        if (pendingIndex < 0) return current;

        return current.map((item, index) =>
          index === pendingIndex
            ? { ...item, status: 'administered', administeredAt: new Date().toISOString() }
            : item,
        );
      });
    }
  };

  return (
    <main style={appShellStyle}>
      <div style={containerStyle}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ boxShadow: shadows.logo, borderRadius: radii.logo, lineHeight: 0 }}>
              <Logo size={64} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontFamily: typography.display, fontSize: 32, color: colors.primaryDark, letterSpacing: -0.6 }}>
                {PRODUCT_NAME}
              </h1>
              <p style={{ margin: '4px 0 0', color: colors.textMid }}>{PRODUCT_TAGLINE}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" style={viewMode === 'family' ? buttonStyle : secondaryButtonStyle} onClick={() => setViewMode('family')}>
              Familiar
            </button>
            <button type="button" style={viewMode === 'caregiver' ? buttonStyle : secondaryButtonStyle} onClick={() => setViewMode('caregiver')}>
              Cuidador
            </button>
          </div>
        </header>

        <HeroCard patient={patient} shiftStatus={shiftStatus} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, margin: '18px 0' }}>
          <MetricCard title="Medicação" value={`${medicationProgress}%`} detail="doses administradas" tone="primary" />
          <MetricCard title="Alertas" value={String(unreadAlerts.length)} detail="pendentes" tone="danger" />
          <MetricCard title="Atividades" value={String(activities.length)} detail="registros no dia" tone="accent" />
          <MetricCard title="Turno" value={getShiftLabel(shiftStatus)} detail="status do cuidado" tone="info" />
        </div>

        {viewMode === 'family' ? (
          <FamilyDashboard
            activities={latestActivities}
            alerts={alerts}
            dailyReport={dailyReport}
            medicationProgress={medicationProgress}
            onOpenCaregiver={() => setViewMode('caregiver')}
          />
        ) : (
          <CaregiverDashboard
            activities={latestActivities}
            lastSavedMessage={lastSavedMessage}
            shiftStatus={shiftStatus}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            onQuickAction={handleQuickAction}
          />
        )}
      </div>
    </main>
  );
};

const getShiftLabel = (status: ShiftStatus) => {
  if (status === 'not_started') return 'Pendente';
  if (status === 'finished') return 'Encerrado';
  return 'Ativo';
};

const HeroCard = ({ patient, shiftStatus }: { patient: Patient | null; shiftStatus: ShiftStatus }) => (
  <section style={{ ...cardStyle, background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`, color: colors.surface, border: 'none' }}>
    <p style={{ margin: 0, fontSize: 14, opacity: 0.85 }}>{PRODUCT_POSITIONING}</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, alignItems: 'center', marginTop: 18 }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <Avatar src={patient?.photoUrl} size={72} initials="MS" alt={patient?.name} />
        <div>
          <h2 style={{ margin: 0, fontFamily: typography.display, fontSize: 24 }}>{patient?.name ?? 'Carregando paciente...'}</h2>
          <p style={{ margin: '6px 0 0', opacity: 0.78 }}>
            {patient?.age ? `${patient.age} anos` : 'Idade não informada'} · {patient?.address ?? 'Endereço não informado'}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
            {patient?.conditions.map((condition) => (
              <Badge key={condition.id} color={colors.surface} background="rgba(255,255,255,0.18)">
                {condition.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.14)', borderRadius: radii.lg, padding: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar src={mockCaregiverUser.avatarUrl} size={44} initials="AL" alt={mockCaregiverUser.name} />
        <div>
          <strong style={{ display: 'block' }}>{mockCaregiverUser.name}</strong>
          <span style={{ fontSize: 13, opacity: 0.75 }}>Cuidadora vinculada · turno {getShiftLabel(shiftStatus).toLowerCase()}</span>
        </div>
      </div>
    </div>
  </section>
);

type MetricCardProps = {
  title: string;
  value: string;
  detail: string;
  tone: keyof typeof toneMap;
};

const MetricCard = ({ title, value, detail, tone }: MetricCardProps) => {
  const toneConfig = toneMap[tone];
  return (
    <section style={cardStyle}>
      <p style={{ margin: 0, color: colors.textMid, fontSize: 13 }}>{title}</p>
      <strong style={{ display: 'block', marginTop: 4, fontFamily: typography.display, fontSize: 28, color: toneConfig.color }}>{value}</strong>
      <span style={{ color: colors.textLight, fontSize: 12 }}>{detail}</span>
    </section>
  );
};

type FamilyDashboardProps = {
  activities: Activity[];
  alerts: Alert[];
  dailyReport: DailyReport | null;
  medicationProgress: number;
  onOpenCaregiver: () => void;
};

const FamilyDashboard = ({ activities, alerts, dailyReport, medicationProgress, onOpenCaregiver }: FamilyDashboardProps) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(280px, 0.65fr)', gap: 18 }}>
    <section style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <div>
          <h2 style={sectionTitleStyle}>Linha do dia — Familiar</h2>
          <p style={{ margin: 0, color: colors.textMid, fontSize: 13 }}>Tudo que o cuidador registra aparece aqui para acompanhamento da família.</p>
        </div>
        <button type="button" style={secondaryButtonStyle} onClick={onOpenCaregiver}>Simular cuidador</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {activities.map((activity) => <TimelineItem key={activity.id} activity={activity} />)}
      </div>
    </section>

    <aside style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>Medicação</h2>
        <div style={{ position: 'relative', width: 96, height: 96, marginBottom: 12 }}>
          <ProgressRing percentage={medicationProgress} size={96} stroke={8} color={colors.accent} />
          <strong style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: typography.display, fontSize: 22, color: colors.accent }}>{medicationProgress}%</strong>
        </div>
        <p style={{ margin: 0, color: colors.textMid }}>Progresso das doses registradas hoje.</p>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>Alertas familiares</h2>
        {alerts.map((alert) => (
          <div key={alert.id} style={{ marginBottom: 12 }}>
            <Badge color={alert.read ? colors.textMid : colors.danger} background={alert.read ? colors.bg : colors.dangerLight}>{alert.title}</Badge>
            <p style={{ margin: '6px 0 0', color: colors.textMid, fontSize: 13 }}>{alert.message}</p>
          </div>
        ))}
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>Relatório diário</h2>
        <p style={{ margin: 0, color: colors.textMid, lineHeight: 1.5 }}>{dailyReport?.summary ?? 'Relatório ainda não gerado.'}</p>
      </section>
    </aside>
  </div>
);

type CaregiverDashboardProps = {
  activities: Activity[];
  lastSavedMessage: string;
  shiftStatus: ShiftStatus;
  onCheckIn: () => Promise<void>;
  onCheckOut: () => Promise<void>;
  onQuickAction: (action: QuickAction) => Promise<void>;
};

const CaregiverDashboard = ({ activities, lastSavedMessage, shiftStatus, onCheckIn, onCheckOut, onQuickAction }: CaregiverDashboardProps) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 0.75fr) minmax(0, 1.25fr)', gap: 18 }}>
    <section style={cardStyle}>
      <h2 style={sectionTitleStyle}>Hoje — Cuidador</h2>
      <p style={{ margin: '0 0 14px', color: colors.textMid }}>Paciente do turno: <strong>{mockPatient.name}</strong>. Registre a rotina com poucos cliques.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        <button type="button" style={shiftStatus === 'active' ? secondaryButtonStyle : buttonStyle} onClick={onCheckIn} disabled={shiftStatus === 'active'}>Fazer check-in</button>
        <button type="button" style={{ ...buttonStyle, background: shiftStatus === 'finished' ? colors.primaryLight : colors.danger, color: shiftStatus === 'finished' ? colors.primaryDark : colors.surface }} onClick={onCheckOut} disabled={shiftStatus === 'finished'}>Fazer check-out</button>
      </div>

      <div style={{ ...cardStyle, background: colors.bg, boxShadow: 'none', marginBottom: 16 }}>
        <strong style={{ display: 'block', color: colors.primaryDark }}>Última ação</strong>
        <span style={{ color: colors.textMid, fontSize: 13 }}>{lastSavedMessage}</span>
      </div>

      <h3 style={{ ...sectionTitleStyle, fontSize: 16 }}>Registro rápido</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
        {quickActions.map((action) => {
          const tone = toneMap[action.tone];
          return (
            <button key={action.type} type="button" onClick={() => onQuickAction(action)} style={{ ...secondaryButtonStyle, minHeight: 74, background: tone.background, color: tone.color, textAlign: 'left' }}>
              {action.label}
            </button>
          );
        })}
      </div>
    </section>

    <section style={cardStyle}>
      <h2 style={sectionTitleStyle}>Registros enviados</h2>
      <p style={{ margin: '0 0 14px', color: colors.textMid }}>Estes registros alimentam a linha do tempo do familiar.</p>
      {activities.map((activity, index) => (
        <div key={activity.id}>
          <TimelineItem activity={activity} compact />
          {index < activities.length - 1 && <Divider />}
        </div>
      ))}
    </section>
  </div>
);

const TimelineItem = ({ activity, compact = false }: { activity: Activity; compact?: boolean }) => {
  const tone = getActivityTone(activity.type);
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <div style={{ width: compact ? 26 : 32, height: compact ? 26 : 32, borderRadius: '50%', background: tone.background, border: `2px solid ${tone.color}`, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
          <strong style={{ display: 'block', color: colors.navy }}>{activity.title}</strong>
          <span style={{ color: colors.textLight, fontSize: 12 }}>{formatTime(activity.occurredAt)}</span>
        </div>
        <span style={{ color: tone.color, fontSize: 12, fontWeight: 700 }}>{getActivityLabel(activity.type)}</span>
        {activity.description && <p style={{ margin: '4px 0 0', color: colors.textMid, fontSize: 13 }}>{activity.description}</p>}
      </div>
    </div>
  );
};

const getActivityTone = (type: ActivityType) => {
  if (type === 'occurrence') return toneMap.danger;
  if (type === 'medication') return toneMap.primary;
  if (type === 'meal' || type === 'hygiene' || type === 'mobility') return toneMap.accent;
  if (type === 'check_in' || type === 'check_out') return toneMap.info;
  return toneMap.warning;
};

const getActivityLabel = (type: ActivityType) => {
  const labels: Record<ActivityType, string> = {
    check_in: 'Check-in',
    check_out: 'Check-out',
    medication: 'Medicação',
    meal: 'Refeição',
    hygiene: 'Higiene',
    vitals: 'Sinais vitais',
    mobility: 'Mobilidade',
    observation: 'Observação',
    occurrence: 'Ocorrência',
  };
  return labels[type];
};

export default AppShell;
