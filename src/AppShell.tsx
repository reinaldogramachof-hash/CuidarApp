import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { Avatar, Badge, Divider, Logo, ProgressRing } from './components';
import { PRODUCT_NAME, PRODUCT_POSITIONING, PRODUCT_TAGLINE } from './constants/product';
import { mockCaregiverUser, mockFamilyUser, mockPatient } from './data/mockCareData';
import { careService } from './services/careService';
import { colors, radii, shadows, typography } from './styles/theme';
import type { Activity, Alert, DailyReport, MedicationAdministration, Patient } from './types/domain';
import { formatTime } from './utils/date';

type ViewMode = 'family' | 'caregiver';

const loadFonts = () => {
  const existing = document.querySelector('[data-cuidarapp-fonts="true"]');

  if (existing) {
    return;
  }

  const link = document.createElement('link');
  link.href =
    'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap';
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

const containerStyle: CSSProperties = {
  width: '100%',
  maxWidth: 1120,
  margin: '0 auto',
};

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

const AppShell = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('family');
  const [patient, setPatient] = useState<Patient | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [dailyReport, setDailyReport] = useState<DailyReport | null>(null);
  const [administrations, setAdministrations] = useState<MedicationAdministration[]>([]);

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
    if (!administrations.length) {
      return 0;
    }

    const administered = administrations.filter((item) => item.status === 'administered').length;
    return Math.round((administered / administrations.length) * 100);
  }, [administrations]);

  const unreadAlerts = alerts.filter((alert) => !alert.read);
  const latestActivities = activities.slice(0, 5);

  const handleCreateQuickActivity = async (title: string, type: Activity['type']) => {
    const activity = await careService.createActivity({
      patientId: mockPatient.id,
      caregiverUserId: mockCaregiverUser.id,
      title,
      type,
    });

    setActivities((current) => [activity, ...current]);
  };

  return (
    <main style={appShellStyle}>
      <div style={containerStyle}>
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ boxShadow: shadows.logo, borderRadius: radii.logo, lineHeight: 0 }}>
              <Logo size={64} />
            </div>
            <div>
              <h1
                style={{
                  margin: 0,
                  fontFamily: typography.display,
                  fontSize: 32,
                  color: colors.primaryDark,
                  letterSpacing: -0.6,
                }}
              >
                {PRODUCT_NAME}
              </h1>
              <p style={{ margin: '4px 0 0', color: colors.textMid }}>{PRODUCT_TAGLINE}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              style={viewMode === 'family' ? buttonStyle : secondaryButtonStyle}
              onClick={() => setViewMode('family')}
            >
              Familiar
            </button>
            <button
              type="button"
              style={viewMode === 'caregiver' ? buttonStyle : secondaryButtonStyle}
              onClick={() => setViewMode('caregiver')}
            >
              Cuidador
            </button>
          </div>
        </header>

        <section
          style={{
            ...cardStyle,
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
            color: colors.surface,
            border: 'none',
            marginBottom: 18,
          }}
        >
          <p style={{ margin: 0, fontSize: 14, opacity: 0.85 }}>{PRODUCT_POSITIONING}</p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.4fr) minmax(260px, 0.6fr)',
              gap: 20,
              alignItems: 'center',
              marginTop: 18,
            }}
          >
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <Avatar src={patient?.photoUrl} size={72} initials="MS" alt={patient?.name} />
              <div>
                <h2 style={{ margin: 0, fontFamily: typography.display, fontSize: 24 }}>
                  {patient?.name ?? 'Carregando paciente...'}
                </h2>
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

            <div
              style={{
                background: 'rgba(255,255,255,0.14)',
                borderRadius: radii.lg,
                padding: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <Avatar src={mockCaregiverUser.avatarUrl} size={44} initials="AL" alt={mockCaregiverUser.name} />
              <div>
                <strong style={{ display: 'block' }}>{mockCaregiverUser.name}</strong>
                <span style={{ fontSize: 13, opacity: 0.75 }}>Cuidadora vinculada · em atendimento</span>
              </div>
            </div>
          </div>
        </section>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 14,
            marginBottom: 18,
          }}
        >
          <MetricCard title="Medicação" value={`${medicationProgress}%`} detail="doses administradas" tone="primary" />
          <MetricCard title="Alertas" value={String(unreadAlerts.length)} detail="pendentes" tone="danger" />
          <MetricCard title="Atividades" value={String(activities.length)} detail="registros no dia" tone="accent" />
          <MetricCard title="Relatório" value={dailyReport ? 'Pronto' : 'Pendente'} detail="resumo diário" tone="info" />
        </div>

        {viewMode === 'family' ? (
          <FamilyDashboard
            activities={latestActivities}
            alerts={alerts}
            dailyReport={dailyReport}
            medicationProgress={medicationProgress}
          />
        ) : (
          <CaregiverDashboard onCreateQuickActivity={handleCreateQuickActivity} activities={latestActivities} />
        )}
      </div>
    </main>
  );
};

type MetricCardProps = {
  title: string;
  value: string;
  detail: string;
  tone: 'primary' | 'danger' | 'accent' | 'info';
};

const toneMap = {
  primary: { color: colors.primary, background: colors.primaryLight },
  danger: { color: colors.danger, background: colors.dangerLight },
  accent: { color: colors.accent, background: colors.accentLight },
  info: { color: colors.info, background: colors.infoLight },
};

const MetricCard = ({ title, value, detail, tone }: MetricCardProps) => {
  const toneConfig = toneMap[tone];

  return (
    <section style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
        <div>
          <p style={{ margin: 0, color: colors.textMid, fontSize: 13 }}>{title}</p>
          <strong
            style={{
              display: 'block',
              marginTop: 4,
              fontFamily: typography.display,
              fontSize: 28,
              color: toneConfig.color,
            }}
          >
            {value}
          </strong>
          <span style={{ color: colors.textLight, fontSize: 12 }}>{detail}</span>
        </div>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: radii.md,
            background: toneConfig.background,
          }}
        />
      </div>
    </section>
  );
};

type FamilyDashboardProps = {
  activities: Activity[];
  alerts: Alert[];
  dailyReport: DailyReport | null;
  medicationProgress: number;
};

const FamilyDashboard = ({ activities, alerts, dailyReport, medicationProgress }: FamilyDashboardProps) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(280px, 0.65fr)', gap: 18 }}>
    <section style={cardStyle}>
      <h2 style={sectionTitleStyle}>Linha do dia</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {activities.map((activity) => (
          <div key={activity.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: colors.primaryLight,
                border: `2px solid ${colors.primaryMid}`,
                flexShrink: 0,
              }}
            />
            <div>
              <strong style={{ display: 'block', color: colors.navy }}>{activity.title}</strong>
              <span style={{ color: colors.textLight, fontSize: 12 }}>{formatTime(activity.occurredAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </section>

    <aside style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>Medicação</h2>
        <div style={{ position: 'relative', width: 96, height: 96, marginBottom: 12 }}>
          <ProgressRing percentage={medicationProgress} size={96} stroke={8} color={colors.accent} />
          <strong
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: typography.display,
              fontSize: 22,
              color: colors.accent,
            }}
          >
            {medicationProgress}%
          </strong>
        </div>
        <p style={{ margin: 0, color: colors.textMid }}>Progresso das doses registradas hoje.</p>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>Alertas</h2>
        {alerts.map((alert) => (
          <div key={alert.id} style={{ marginBottom: 12 }}>
            <Badge color={alert.read ? colors.textMid : colors.danger} background={alert.read ? colors.bg : colors.dangerLight}>
              {alert.title}
            </Badge>
            <p style={{ margin: '6px 0 0', color: colors.textMid, fontSize: 13 }}>{alert.message}</p>
          </div>
        ))}
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>Relatório diário</h2>
        <p style={{ margin: 0, color: colors.textMid, lineHeight: 1.5 }}>
          {dailyReport?.summary ?? 'Relatório ainda não gerado.'}
        </p>
      </section>
    </aside>
  </div>
);

type CaregiverDashboardProps = {
  activities: Activity[];
  onCreateQuickActivity: (title: string, type: Activity['type']) => Promise<void>;
};

const CaregiverDashboard = ({ activities, onCreateQuickActivity }: CaregiverDashboardProps) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 0.75fr) minmax(0, 1.25fr)', gap: 18 }}>
    <section style={cardStyle}>
      <h2 style={sectionTitleStyle}>Registro rápido</h2>
      <p style={{ margin: '0 0 14px', color: colors.textMid }}>
        Registre a rotina em poucos cliques. Formulários detalhados entram na próxima etapa do MVP.
      </p>
      <div style={{ display: 'grid', gap: 10 }}>
        <button type="button" style={buttonStyle} onClick={() => onCreateQuickActivity('Check-in realizado', 'check_in')}>
          Fazer check-in
        </button>
        <button type="button" style={secondaryButtonStyle} onClick={() => onCreateQuickActivity('Medicação administrada', 'medication')}>
          Confirmar medicação
        </button>
        <button type="button" style={secondaryButtonStyle} onClick={() => onCreateQuickActivity('Refeição realizada', 'meal')}>
          Registrar refeição
        </button>
        <button type="button" style={secondaryButtonStyle} onClick={() => onCreateQuickActivity('Ocorrência registrada', 'occurrence')}>
          Registrar ocorrência
        </button>
      </div>
    </section>

    <section style={cardStyle}>
      <h2 style={sectionTitleStyle}>Últimos registros</h2>
      {activities.map((activity, index) => (
        <div key={activity.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <strong style={{ display: 'block' }}>{activity.title}</strong>
              <span style={{ color: colors.textLight, fontSize: 12 }}>{activity.type}</span>
            </div>
            <span style={{ color: colors.textMid, fontSize: 13 }}>{formatTime(activity.occurredAt)}</span>
          </div>
          {index < activities.length - 1 && <Divider />}
        </div>
      ))}
    </section>
  </div>
);

export default AppShell;
