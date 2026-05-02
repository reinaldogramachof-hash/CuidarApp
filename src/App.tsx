import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

/* ─── GOOGLE FONTS ─────────────────────────────────────────── */
const FontLoader = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);
  return null;
};

/* ─── DESIGN TOKENS ─────────────────────────────────────────── */
const C = {
  primary: "#1565C0",
  primaryDark: "#0D47A1",
  primaryLight: "#E3F2FD",
  primaryMid: "#BBDEFB",
  accent: "#00897B",
  accentLight: "#E0F2F1",
  warm: "#FFF8F0",
  surface: "#FFFFFF",
  bg: "#F4F7FB",
  navy: "#1A237E",
  textMid: "#546E7A",
  textLight: "#90A4AE",
  border: "#E0E7EF",
  warning: "#FF8F00",
  warningLight: "#FFF8E1",
  danger: "#E53935",
  dangerLight: "#FFEBEE",
  success: "#2E7D32",
  successLight: "#E8F5E9",
  info: "#0277BD",
  infoLight: "#E1F5FE",
};

const T = {
  display: "'Nunito', sans-serif",
  body: "'DM Sans', sans-serif",
};

/* ─── MOCK DATA ─────────────────────────────────────────────── */
const patient = {
  name: "Maria da Silva",
  age: 78,
  dob: "14/03/1948",
  address: "Rua das Acácias, 142 – Moema, SP",
  photo: "https://i.pravatar.cc/150?img=47",
  conditions: ["Hipertensão", "Diabetes Tipo 2", "Mobilidade Reduzida", "Risco de Queda"],
  dependencyLevel: 65,
  caregiver: { name: "Ana Lima", photo: "https://i.pravatar.cc/150?img=32", since: "07h32" },
  status: "present",
};

const timeline = [
  { time: "07h32", label: "Check-in de Ana Lima", icon: "fa-solid fa-check", done: true, type: "checkin" },
  { time: "08h00", label: "Café da manhã realizado", icon: "fa-solid fa-check", done: true, type: "food" },
  { time: "08h30", label: "Losartana 50mg administrada", icon: "fa-solid fa-check", done: true, type: "med" },
  { time: "09h15", label: "Banho assistido concluído", icon: "fa-solid fa-check", done: true, type: "care" },
  { time: "09h45", label: "Sinais vitais aferidos", icon: "fa-solid fa-check", done: true, type: "vitals" },
  { time: "12h00", label: "Almoço em andamento", icon: "fa-solid fa-rotate", done: false, type: "food", active: true },
  { time: "14h00", label: "Metformina 500mg pendente", icon: "fa-solid fa-hourglass-half", done: false, type: "med" },
  { time: "17h00", label: "Exercícios leves", icon: "fa-solid fa-hourglass-half", done: false, type: "care" },
  { time: "19h30", label: "Check-out previsto", icon: "fa-solid fa-hourglass-half", done: false, type: "checkout" },
];

const medications = [
  { name: "Losartana", dose: "50mg", time: "08h00", status: "done", by: "Ana Lima", at: "08h32" },
  { name: "Atorvastatina", dose: "20mg", time: "08h00", status: "done", by: "Ana Lima", at: "08h33" },
  { name: "Complexo B", dose: "1 comprimido", time: "08h00", status: "done", by: "Ana Lima", at: "08h35" },
  { name: "Metformina", dose: "500mg", time: "14h00", status: "pending" },
  { name: "Losartana", dose: "50mg", time: "20h00", status: "upcoming" },
];

const vitals = [
  { label: "Pressão Arterial", value: "120/80", unit: "mmHg", status: "ok", icon: "fa-solid fa-heart-pulse" },
  { label: "Glicemia", value: "98", unit: "mg/dL", status: "ok", icon: "fa-solid fa-droplet" },
  { label: "SpO₂", value: "97", unit: "%", status: "ok", icon: "fa-solid fa-lungs" },
  { label: "Temperatura", value: "36.4", unit: "°C", status: "ok", icon: "fa-solid fa-temperature-half" },
];

const weekDays = [
  { day: "Dom", date: 27, hasVisit: false },
  { day: "Seg", date: 28, hasVisit: true },
  { day: "Ter", date: 29, hasVisit: true },
  { day: "Qua", date: 30, hasVisit: true },
  { day: "Qui", date: 1, hasVisit: true },
  { day: "Sex", date: 2, hasVisit: true, today: true },
  { day: "Sáb", date: 3, hasVisit: false },
];

const upcomingVisits = [
  { date: "Sáb, 03/05", time: "08h00–19h00", caregiver: "Ana Lima", type: "Cuidado Diurno", status: "confirmed" },
  { date: "Dom, 04/05", time: "08h00–19h00", caregiver: "Patrícia Souza", type: "Cuidado Diurno", status: "pending" },
  { date: "Seg, 05/05", time: "08h00–19h00", caregiver: "Ana Lima", type: "Cuidado Diurno", status: "confirmed" },
];

const alerts = [
  { id: 1, type: "danger", label: "URGENTE", msg: "Metformina das 14h com 48min de atraso", time: "Agora", read: false },
  { id: 2, type: "warning", label: "ATENÇÃO", msg: "Ana Lima reportou queda leve — sem ferimentos", time: "Há 2h", read: false },
  { id: 3, type: "success", label: "INFO", msg: "Sinais vitais aferidos e dentro do normal", time: "Há 4h", read: true },
  { id: 4, type: "success", label: "INFO", msg: "Check-in confirmado às 07h32", time: "Há 5h", read: true },
  { id: 5, type: "info", label: "RELATÓRIO", msg: "Relatório semanal disponível para download", time: "Ontem", read: true },
];

const occurrences = [
  { date: "28/04", icon: "fa-solid fa-triangle-exclamation", color: C.warning, text: "Queda leve ao se levantar, sem ferimentos. Médico notificado." },
  { date: "25/04", icon: "fa-solid fa-circle-info", color: C.info, text: "Recusa alimentar no jantar. Ingeriu líquidos normalmente." },
];

/* ─── SHARED STYLES ─────────────────────────────────────────── */
const S = {
  card: {
    background: C.surface,
    borderRadius: 16,
    border: `1px solid ${C.border}`,
    boxShadow: "0 2px 12px rgba(21,101,192,0.06)",
    padding: 16,
  },
  cardElevated: {
    background: C.surface,
    borderRadius: 16,
    border: `1px solid ${C.border}`,
    boxShadow: "0 6px 24px rgba(21,101,192,0.10)",
    padding: 16,
  },
  btn: {
    background: C.primary,
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "12px 20px",
    fontFamily: T.display,
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    width: "100%",
  },
  btnOutline: {
    background: "transparent",
    color: C.primary,
    border: `1.5px solid ${C.primary}`,
    borderRadius: 12,
    padding: "11px 20px",
    fontFamily: T.display,
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    width: "100%",
  },
  badge: (color: string, bg: string) => ({
    background: bg,
    color: color,
    borderRadius: 20,
    padding: "3px 10px",
    fontSize: 11,
    fontFamily: T.body,
    fontWeight: 600,
    letterSpacing: "0.3px",
  }),
  sectionTitle: {
    fontFamily: T.display,
    fontWeight: 800,
    fontSize: 15,
    color: C.navy,
    marginBottom: 12,
    marginTop: 20,
  },
  screenTitle: {
    fontFamily: T.display,
    fontWeight: 800,
    fontSize: 20,
    color: C.navy,
  },
};

/* ─── ATOMS ────────────────────────────────────────────────── */
const Logo = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="24" fill="url(#paint0_linear)"/>
    <path d="M50 72C50 72 26 54 26 38.5C26 29.94 32.94 23 41.5 23C46.3 23 50 25.8 50 25.8C50 25.8 53.7 23 58.5 23C67.06 23 74 29.94 74 38.5C74 54 50 72 50 72Z" fill="white"/>
    <path d="M50 72C50 72 26 54 26 38.5C26 29.94 32.94 23 41.5 23C46.3 23 50 25.8 50 25.8L50 72Z" fill="white" fillOpacity="0.7"/>
    <path d="M43 45H57M50 38V52" stroke="#00897B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="paint0_linear" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1565C0"/>
        <stop offset="1" stopColor="#0D47A1"/>
      </linearGradient>
    </defs>
  </svg>
);

const Avatar = ({ src, size = 40, initials = "?" }: { src?: string, size?: number, initials?: string }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    overflow: "hidden", flexShrink: 0,
    background: C.primaryLight,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: T.display, fontWeight: 800, fontSize: size * 0.35, color: C.primary,
  }}>
    {src ? <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials}
  </div>
);

const StatusBadge = ({ status }: { status: "done" | "pending" | "upcoming" }) => {
  const cfg = {
    done: { label: <>Administrada <i className="fa-solid fa-check"></i></>, color: C.success, bg: C.successLight },
    pending: { label: "Pendente", color: C.warning, bg: C.warningLight },
    upcoming: { label: "Agendada", color: C.textMid, bg: C.bg },
  };
  const c = cfg[status];
  return <span style={S.badge(c.color, c.bg)}>{c.label}</span>;
};

const ProgressRing = ({ pct, size = 72, stroke = 6, color = C.primary }: { pct: number, size?: number, stroke?: number, color?: string }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.primaryLight} strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s ease" }} />
    </svg>
  );
};

const Divider = () => <div style={{ height: 1, background: C.border, margin: "12px 0" }} />;

/* ─── SCREENS ───────────────────────────────────────────────── */

/* SPLASH */
const SplashScreen = ({ onEnter }: { onEnter: () => void }) => (
  <div style={{
    height: "100%", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "space-between",
    background: `linear-gradient(160deg, #E3F2FD 0%, #F4F7FB 50%, #E0F2F1 100%)`,
    padding: "60px 28px 40px",
  }}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={{
        boxShadow: `0 12px 32px rgba(21,101,192,0.30)`,
        borderRadius: 24,
      }}>
        <Logo size={80} />
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: T.display, fontWeight: 900, fontSize: 32, color: C.primaryDark, letterSpacing: -0.5 }}>
          CuidarApp
        </div>
        <div style={{ fontFamily: T.body, fontSize: 14, color: C.textMid, marginTop: 6, lineHeight: 1.5 }}>
          Cuidado com quem importa,<br />visibilidade para você.
        </div>
      </div>
    </div>

    <div style={{ width: "100%", textAlign: "center" }}>
      <div style={{ fontSize: 64, marginBottom: 16, color: C.primary }}><i className="fa-solid fa-hands-holding-child"></i></div>
      <div style={{
        background: C.surface, borderRadius: 20, padding: 20,
        boxShadow: "0 8px 32px rgba(21,101,192,0.10)",
        border: `1px solid ${C.border}`,
        marginBottom: 24,
      }}>
        <div style={{ fontFamily: T.display, fontWeight: 700, fontSize: 14, color: C.navy, marginBottom: 4 }}>
          Acompanhe em tempo real
        </div>
        <div style={{ fontFamily: T.body, fontSize: 12, color: C.textMid, lineHeight: 1.6 }}>
          Medicação, visitas, alertas e evolução do seu familiar — tudo num só lugar.
        </div>
      </div>

      <button style={{ ...S.btn, marginBottom: 12, padding: "14px 20px", fontSize: 15, borderRadius: 14 }}
        onClick={onEnter}>
        Entrar na minha conta
      </button>
      <button style={{ ...S.btnOutline, padding: "13px 20px", fontSize: 15, borderRadius: 14 }}>
        Criar conta gratuita
      </button>
      <div style={{ fontFamily: T.body, fontSize: 11, color: C.textLight, marginTop: 16 }}>
        Seus dados protegidos com criptografia · LGPD
      </div>
    </div>
  </div>
);

/* DASHBOARD */
const DashboardScreen = ({ onAlerts }: { onAlerts: () => void }) => (
  <div style={{ padding: "0 20px 100px", overflowY: "auto", height: "100%" }}>
    {/* Header */}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0 8px" }}>
      <div>
        <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 20, color: C.navy }}>
          Olá, Mariana 👋
        </div>
        <div style={{ fontFamily: T.body, fontSize: 12, color: C.textMid, marginTop: 2 }}>
          Sexta-feira, 02 de maio de 2026
        </div>
      </div>
      <button onClick={onAlerts} style={{
        background: C.dangerLight, border: "none", borderRadius: 12, width: 44, height: 44,
        cursor: "pointer", position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, color: C.danger,
      }}>
        <i className="fa-regular fa-bell"></i>
        <span style={{
          position: "absolute", top: 6, right: 6, width: 10, height: 10,
          background: C.danger, borderRadius: "50%", border: "2px solid white",
        }} />
      </button>
    </div>

    {/* Hero card */}
    <div style={{
      ...S.cardElevated,
      background: `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryDark} 100%)`,
      border: "none", marginTop: 8,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div style={{ position: "relative" }}>
          <Avatar src={patient.photo} size={54} />
          <span style={{
            position: "absolute", bottom: 0, right: -2, width: 14, height: 14,
            background: "#4CAF50", borderRadius: "50%", border: "2px solid white",
          }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 16, color: "#fff" }}>
            {patient.name}
          </div>
          <div style={{ fontFamily: T.body, fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>
            {patient.age} anos · {patient.address.split("–")[1]}
          </div>
        </div>
      </div>
      <div style={{
        background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "10px 12px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar src={patient.caregiver.photo} size={28} />
          <div>
            <div style={{ fontFamily: T.body, fontWeight: 600, fontSize: 12, color: "#fff" }}>
              <i className="fa-solid fa-circle" style={{ fontSize: 10, color: "#4CAF50", marginRight: 4 }}></i> {patient.caregiver.name} presente
            </div>
            <div style={{ fontFamily: T.body, fontSize: 11, color: "rgba(255,255,255,0.65)" }}>
              desde {patient.caregiver.since}
            </div>
          </div>
        </div>
        <span style={{ ...S.badge("#fff", "rgba(255,255,255,0.2)"), fontSize: 10 }}>Ao vivo</span>
      </div>
    </div>

    {/* Metrics grid */}
    <div style={{ ...S.sectionTitle, marginTop: 20 }}>Resumo de hoje</div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      {[
        { icon: "fa-solid fa-pills", label: "Medicação", value: "3/4", sub: "doses", color: C.primary, bg: C.primaryLight },
        { icon: "fa-solid fa-clipboard-check", label: "Tarefas", value: "5/7", sub: "concluídas", color: C.accent, bg: C.accentLight },
        { icon: "fa-solid fa-triangle-exclamation", label: "Alertas", value: "2", sub: "pendentes", color: C.warning, bg: C.warningLight },
        { icon: "fa-regular fa-calendar-check", label: "Próxima visita", value: "Sáb", sub: "08h00", color: C.info, bg: C.infoLight },
      ].map((m, i) => (
        <div key={i} style={{ ...S.card, display: "flex", gap: 10, alignItems: "center", padding: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: m.bg, color: m.color,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
            <i className={m.icon}></i>
          </div>
          <div>
            <div style={{ fontFamily: T.body, fontSize: 11, color: C.textMid }}>{m.label}</div>
            <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 18, color: m.color, lineHeight: 1.1 }}>
              {m.value}
            </div>
            <div style={{ fontFamily: T.body, fontSize: 11, color: C.textLight }}>{m.sub}</div>
          </div>
        </div>
      ))}
    </div>

    {/* Timeline */}
    <div style={S.sectionTitle}>Linha do dia</div>
    <div style={{ ...S.card, padding: "16px 16px 8px" }}>
      {timeline.map((t, i) => (
        <motion.div 
          key={i} 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: i * 0.08 }}
          style={{ display: "flex", gap: 12, paddingBottom: 14, position: "relative" }}
        >
          {i < timeline.length - 1 && (
            <motion.div 
              initial={t.done ? { height: 0 } : false}
              animate={t.done ? { height: "100%" } : false}
              transition={{ duration: 0.5, delay: i * 0.08 + 0.2 }}
              style={{
                position: "absolute", left: 15, top: 22, bottom: 0,
                width: 2, background: t.done ? C.primaryMid : C.border,
                transformOrigin: "top"
              }} 
            />
          )}
          <motion.div
            initial={t.type === "checkin" ? { scale: 0, opacity: 0, rotate: -45 } : false}
            animate={t.type === "checkin" ? { scale: 1, opacity: 1, rotate: 0 } : false}
            transition={t.type === "checkin" ? { type: "spring", stiffness: 300, damping: 12, delay: 0.4 } : {}}
            style={{
              width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
              background: t.active ? C.primary : t.done ? C.primaryLight : C.bg,
              border: `2px solid ${t.active ? C.primary : t.done ? C.primaryMid : C.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, zIndex: 1, color: t.done ? C.primary : C.textMid,
          }}>
            {t.active ? <span style={{ width: 8, height: 8, background: "#fff", borderRadius: "50%" }} /> : <i className={t.icon}></i>}
          </motion.div>
          <div style={{ flex: 1, paddingTop: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontFamily: T.body, fontWeight: 600, fontSize: 13,
                color: t.active ? C.primary : t.done ? C.navy : C.textMid }}>
                {t.label}
              </span>
              {t.active && <span style={S.badge(C.primary, C.primaryLight)}>em andamento</span>}
            </div>
            <div style={{ fontFamily: T.body, fontSize: 11, color: C.textLight, marginTop: 1 }}>
              {t.time}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

/* SAÚDE */
const SaudeScreen = () => {
  const done = medications.filter(m => m.status === "done").length;
  const total = medications.length;
  const pct = Math.round((done / total) * 100);

  return (
    <div style={{ padding: "0 20px 100px", overflowY: "auto", height: "100%" }}>
      <div style={{ padding: "16px 0 8px", ...S.screenTitle }}>💊 Saúde</div>

      {/* Progress card */}
      <div style={{
        ...S.cardElevated,
        background: `linear-gradient(135deg, ${C.accent} 0%, #00695C 100%)`,
        border: "none",
        display: "flex", alignItems: "center", gap: 20,
      }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <ProgressRing pct={pct} size={80} stroke={7} color="#fff" />
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontFamily: T.display, fontWeight: 900, fontSize: 18, color: "#fff" }}>{pct}%</span>
          </div>
        </div>
        <div>
          <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 22, color: "#fff" }}>
            {done}/{total} doses
          </div>
          <div style={{ fontFamily: T.body, fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>
            administradas hoje
          </div>
          <span style={{ ...S.badge("#fff", "rgba(255,255,255,0.2)"), marginTop: 8, display: "inline-block" }}>
            {total - done} pendente{total - done !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Medications list */}
      <div style={S.sectionTitle}>Medicamentos do dia</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {medications.map((m, i) => (
          <div key={i} style={{
            ...S.card,
            borderLeft: `4px solid ${m.status === "done" ? C.accent : m.status === "pending" ? C.warning : C.border}`,
          }}>
            <div style={{ display: "flex", justifyItems: "space-between", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontFamily: T.display, fontWeight: 700, fontSize: 15, color: C.navy }}>
                  {m.name}
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 4, alignItems: "center" }}>
                  <span style={S.badge(C.textMid, C.bg)}>{m.dose}</span>
                  <span style={{ fontFamily: T.body, fontSize: 12, color: C.textMid }}>às {m.time}</span>
                </div>
                {m.status === "done" && (
                  <div style={{ fontFamily: T.body, fontSize: 11, color: C.accent, marginTop: 4 }}>
                    <i className="fa-solid fa-check"></i> Confirmado por {m.by} às {m.at}
                  </div>
                )}
              </div>
              <StatusBadge status={m.status as "done" | "pending" | "upcoming"} />
            </div>
          </div>
        ))}
      </div>

      {/* Vitals */}
      <div style={S.sectionTitle}>Sinais vitais</div>
      <div style={{ ...S.card, padding: 20 }}>
        <div style={{ fontFamily: T.body, fontSize: 11, color: C.textMid, marginBottom: 14 }}>
          Última aferição: hoje às 09h45 · por Ana Lima
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {vitals.map((v, i) => (
            <div key={i} style={{
              background: C.successLight, borderRadius: 12, padding: "12px 14px",
              border: `1px solid #C8E6C9`,
            }}>
              <div style={{ fontSize: 20, marginBottom: 4, color: C.success }}><i className={v.icon}></i></div>
              <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 18, color: C.success }}>
                {v.value}
                <span style={{ fontFamily: T.body, fontSize: 11, fontWeight: 400, color: C.textMid, marginLeft: 2 }}>
                  {v.unit}
                </span>
              </div>
              <div style={{ fontFamily: T.body, fontSize: 11, color: C.textMid, marginTop: 2 }}>{v.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* AGENDA */
const AgendaScreen = () => {
  const [selectedDay, setSelectedDay] = useState(5);

  return (
    <div style={{ padding: "0 20px 100px", overflowY: "auto", height: "100%" }}>
      <div style={{ padding: "16px 0 8px", ...S.screenTitle }}>📅 Agenda</div>

      {/* Week strip */}
      <div style={{ ...S.card, padding: "14px 10px" }}>
        <div style={{ display: "flex", justifyItems: "space-between", justifyContent: "space-between" }}>
          {weekDays.map((d, i) => (
            <button key={i} onClick={() => setSelectedDay(i)} style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: 4, padding: "8px 6px", borderRadius: 12, border: "none",
              background: selectedDay === i ? C.primary : "transparent",
              cursor: "pointer", minWidth: 38,
            }}>
              <span style={{
                fontFamily: T.body, fontSize: 10, fontWeight: 500,
                color: selectedDay === i ? "rgba(255,255,255,0.8)" : C.textMid,
                textTransform: "uppercase",
              }}>{d.day}</span>
              <span style={{
                fontFamily: T.display, fontWeight: 800, fontSize: 16,
                color: selectedDay === i ? "#fff" : d.today ? C.primary : C.navy,
              }}>{d.date}</span>
              <div style={{
                width: 5, height: 5, borderRadius: "50%",
                background: selectedDay === i ? "rgba(255,255,255,0.6)"
                  : d.hasVisit ? C.accent : C.border,
              }} />
            </button>
          ))}
        </div>
      </div>

      {/* Visit card */}
      {weekDays[selectedDay].hasVisit ? (
        <>
          <div style={{ ...S.sectionTitle }}>Visita do dia</div>
          <div style={{
            ...S.cardElevated,
            borderTop: `4px solid ${C.primary}`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={S.badge(C.success, C.successLight)}><i className="fa-solid fa-check"></i> Visita Confirmada</span>
              <span style={{ fontFamily: T.body, fontSize: 12, color: C.textMid }}>07h30–19h30</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <Avatar src={patient.caregiver.photo} size={40} />
              <div>
                <div style={{ fontFamily: T.display, fontWeight: 700, fontSize: 15, color: C.navy }}>
                  {patient.caregiver.name}
                </div>
                <div style={{ fontFamily: T.body, fontSize: 12, color: C.textMid }}>Cuidadora responsável</div>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
              {["Higiene", "Medicação", "Alimentação", "Exercícios", "Companhia"].map((tag, i) => (
                <span key={i} style={S.badge(C.primary, C.primaryLight)}>{tag}</span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ ...S.btn, flex: 1 }}>Ver plano completo</button>
              <button style={{ ...S.btnOutline, flex: 1, display: "flex", gap: "8px", alignItems: "center", justifyContent: "center" }}><i className="fa-regular fa-comment-dots"></i> Falar com Ana</button>
            </div>
          </div>
        </>
      ) : (
        <div style={{ ...S.card, textAlign: "center", padding: 32, marginTop: 16 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}><i className="fa-regular fa-calendar-xmark" style={{ color: C.textLight }}></i></div>
          <div style={{ fontFamily: T.display, fontWeight: 700, fontSize: 15, color: C.navy }}>
            Sem visita este dia
          </div>
          <div style={{ fontFamily: T.body, fontSize: 13, color: C.textMid, marginTop: 4 }}>
            Nenhuma visita programada.
          </div>
        </div>
      )}

      {/* Upcoming */}
      <div style={S.sectionTitle}>Próximas visitas</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {upcomingVisits.map((v, i) => (
          <div key={i} style={{
            ...S.card,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, flexShrink: 0,
              background: v.status === "confirmed" ? C.accentLight : C.warningLight,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
            }}>
              {v.status === "confirmed" ? <i className="fa-solid fa-check"></i> : <i className="fa-solid fa-hourglass-half"></i>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: T.display, fontWeight: 700, fontSize: 14, color: C.navy }}>{v.date}</div>
              <div style={{ fontFamily: T.body, fontSize: 12, color: C.textMid }}>{v.caregiver} · {v.time}</div>
            </div>
            <span style={S.badge(
              v.status === "confirmed" ? C.success : C.warning,
              v.status === "confirmed" ? C.successLight : C.warningLight
            )}>
              {v.status === "confirmed" ? "Confirmada" : "Aguardando"}
            </span>
          </div>
        ))}
      </div>

      {/* FAB */}
      <div style={{
        position: "fixed", bottom: 90, right: 24,
        background: C.primary, color: "#fff",
        borderRadius: 16, padding: "12px 18px",
        fontFamily: T.display, fontWeight: 700, fontSize: 13,
        boxShadow: `0 8px 24px rgba(21,101,192,0.35)`,
        cursor: "pointer", zIndex: 50,
      }}>
        <i className="fa-solid fa-plus"></i> Visita extra
      </div>
    </div>
  );
};

/* RELATÓRIOS */
const RelatoriosScreen = () => {
  const [period, setPeriod] = useState("Mês");

  return (
    <div style={{ padding: "0 20px 100px", overflowY: "auto", height: "100%" }}>
      <div style={{ padding: "16px 0 8px", ...S.screenTitle }}>📊 Relatórios</div>

      {/* Period tabs */}
      <div style={{
        display: "flex", background: C.bg, borderRadius: 12, padding: 4, gap: 4, marginBottom: 16,
      }}>
        {["Hoje", "Semana", "Mês"].map(p => (
          <button key={p} onClick={() => setPeriod(p)} style={{
            flex: 1, border: "none", borderRadius: 9, padding: "9px 0",
            fontFamily: T.display, fontWeight: 700, fontSize: 13, cursor: "pointer",
            background: period === p ? C.primary : "transparent",
            color: period === p ? "#fff" : C.textMid,
            transition: "all 0.2s ease",
          }}>{p}</button>
        ))}
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { label: "Visitas realizadas", value: "22", icon: "fa-solid fa-house-medical", color: C.primary, bg: C.primaryLight },
          { label: "Taxa de presença", value: "96%", icon: "fa-solid fa-calendar-check", color: C.success, bg: C.successLight },
          { label: "Medicações corretas", value: "98%", icon: "fa-solid fa-pills", color: C.accent, bg: C.accentLight },
          { label: "Ocorrências", value: "2", icon: "fa-solid fa-triangle-exclamation", color: C.warning, bg: C.warningLight },
        ].map((s, i) => (
          <div key={i} style={{ ...S.card, textAlign: "center", padding: 18 }}>
            <div style={{ fontSize: 26, marginBottom: 6, color: s.color }}><i className={s.icon}></i></div>
            <div style={{ fontFamily: T.display, fontWeight: 900, fontSize: 26, color: s.color }}>
              {s.value}
            </div>
            <div style={{ fontFamily: T.body, fontSize: 11, color: C.textMid, marginTop: 2 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Narrative */}
      <div style={S.sectionTitle}>Evolução do paciente</div>
      <div style={{ ...S.card }}>
        <div style={{ fontFamily: T.body, fontSize: 13, color: C.navy, lineHeight: 1.65 }}>
          Maria apresentou boa disposição esta semana. Apetite normalizado após ajuste da medicação. 
          Realizou caminhada leve na terça-feira com auxílio. Humor estável, interagindo bem com a família 
          durante as ligações. Pressão arterial dentro dos parâmetros.
        </div>
        <Divider />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar src={patient.caregiver.photo} size={28} initials="AL" />
          <div>
            <div style={{ fontFamily: T.body, fontWeight: 600, fontSize: 12, color: C.navy }}>
              Ana Lima · Cuidadora
            </div>
            <div style={{ fontFamily: T.body, fontSize: 11, color: C.textLight }}>02/05/2026</div>
          </div>
        </div>
      </div>

      {/* Occurrences */}
      <div style={S.sectionTitle}>Ocorrências do período</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {occurrences.map((o, i) => (
          <div key={i} style={{
            ...S.card,
            display: "flex", gap: 12, alignItems: "flex-start",
            borderLeft: `4px solid ${o.color}`,
          }}>
            <div style={{ fontSize: 20, marginTop: 2, color: o.color }}><i className={o.icon}></i></div>
            <div>
              <div style={{ fontFamily: T.body, fontSize: 11, color: C.textMid, marginBottom: 3 }}>
                {o.date}
              </div>
              <div style={{ fontFamily: T.body, fontSize: 13, color: C.navy, lineHeight: 1.5 }}>
                {o.text}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Download */}
      <button style={{
        ...S.btn, marginTop: 20, padding: "14px 20px", borderRadius: 14, fontSize: 15,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      }}>
        <i className="fa-solid fa-download"></i> Baixar relatório PDF
      </button>
    </div>
  );
};

/* ALERTAS */
const AlertasScreen = () => {
  const [activeTab, setActiveTab] = useState("Todos");
  const tabs = ["Todos", "Urgentes", "Saúde", "Rotina"];

  const filtered = activeTab === "Todos" ? alerts
    : activeTab === "Urgentes" ? alerts.filter(a => a.type === "danger" || a.type === "warning")
    : activeTab === "Saúde" ? alerts.filter(a => a.type === "success" || a.type === "danger")
    : alerts.filter(a => a.type === "info" || a.type === "success");

  const alertCfg: Record<string, { bg: string, color: string, border: string }> = {
    danger: { bg: C.dangerLight, color: C.danger, border: "#FFCDD2" },
    warning: { bg: C.warningLight, color: C.warning, border: "#FFE0B2" },
    success: { bg: C.successLight, color: C.success, border: "#C8E6C9" },
    info: { bg: C.infoLight, color: C.info, border: "#B3E5FC" },
  };

  return (
    <div style={{ padding: "0 20px 100px", overflowY: "auto", height: "100%" }}>
      <div style={{ padding: "16px 0 8px", ...S.screenTitle }}>🔔 Alertas</div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            border: "none", borderRadius: 20, padding: "7px 14px",
            fontFamily: T.body, fontWeight: 600, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap",
            background: activeTab === t ? C.primary : C.bg,
            color: activeTab === t ? "#fff" : C.textMid,
          }}>{t}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((a) => {
          const cfg = alertCfg[a.type];
          return (
            <div key={a.id} style={{
              ...S.card,
              background: a.read ? C.surface : cfg.bg,
              borderColor: a.read ? C.border : cfg.border,
              display: "flex", gap: 12, alignItems: "flex-start",
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                background: a.read ? C.border : cfg.color, marginTop: 6,
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={S.badge(cfg.color, a.read ? C.bg : cfg.bg)}>{a.label}</span>
                  <span style={{ fontFamily: T.body, fontSize: 11, color: C.textLight }}>{a.time}</span>
                </div>
                <div style={{ fontFamily: T.body, fontSize: 13, color: C.navy, lineHeight: 1.5 }}>
                  {a.msg}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* PERFIL */
const PerfilScreen = () => (
  <div style={{ padding: "0 20px 100px", overflowY: "auto", height: "100%" }}>
    <div style={{ padding: "16px 0 8px", ...S.screenTitle }}>👤 Ficha do Paciente</div>

    {/* Patient header */}
    <div style={{ ...S.cardElevated, textAlign: "center", padding: 24 }}>
      <div style={{ position: "relative", display: "inline-block", marginBottom: 12 }}>
        <Avatar src={patient.photo} size={80} />
        <span style={{
          position: "absolute", bottom: 2, right: 2, width: 18, height: 18,
          background: "#4CAF50", borderRadius: "50%", border: "3px solid white",
        }} />
      </div>
      <div style={{ fontFamily: T.display, fontWeight: 900, fontSize: 20, color: C.navy }}>
        {patient.name}
      </div>
      <div style={{ fontFamily: T.body, fontSize: 13, color: C.textMid, marginTop: 4 }}>
        {patient.age} anos · Nascida em {patient.dob}
      </div>
      <div style={{ fontFamily: T.body, fontSize: 12, color: C.textMid, marginTop: 2 }}>
        <i className="fa-solid fa-location-dot"></i> {patient.address}
      </div>
    </div>

    {/* Conditions */}
    <div style={S.sectionTitle}>Condições de saúde</div>
    <div style={{ ...S.card }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {patient.conditions.map((c, i) => (
          <span key={i} style={{
            ...S.badge(C.primary, C.primaryLight),
            fontSize: 12, padding: "5px 12px",
          }}>{c}</span>
        ))}
      </div>
    </div>

    {/* Dependency */}
    <div style={S.sectionTitle}>Nível de dependência</div>
    <div style={{ ...S.card }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontFamily: T.body, fontWeight: 600, fontSize: 13, color: C.navy }}>
          Dependência Moderada
        </span>
        <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 15, color: C.warning }}>
          {patient.dependencyLevel}%
        </span>
      </div>
      <div style={{ height: 8, background: C.bg, borderRadius: 8, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${patient.dependencyLevel}%`,
          background: `linear-gradient(90deg, ${C.accent}, ${C.warning})`,
          borderRadius: 8,
          transition: "width 1s ease",
        }} />
      </div>
      <div style={{ fontFamily: T.body, fontSize: 11, color: C.textLight, marginTop: 6 }}>
        Requer assistência em mobilidade, medicação e higiene
      </div>
    </div>

    {/* Caregiver */}
    <div style={S.sectionTitle}>Cuidadora responsável</div>
    <div style={{ ...S.card, display: "flex", alignItems: "center", gap: 12 }}>
      <Avatar src={patient.caregiver.photo} size={48} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: T.display, fontWeight: 700, fontSize: 15, color: C.navy }}>
          {patient.caregiver.name}
        </div>
        <div style={{ fontFamily: T.body, fontSize: 12, color: C.textMid }}>Cuidadora domiciliar · desde 2024</div>
      </div>
      <button style={{
        background: C.accentLight, border: "none", borderRadius: 10, padding: "8px 14px",
        fontFamily: T.body, fontWeight: 600, fontSize: 12, color: C.accent, cursor: "pointer",
        display: "flex", gap: "6px", alignItems: "center"
      }}><i className="fa-regular fa-comment-dots"></i> Chat</button>
    </div>

    {/* Emergency contacts */}
    <div style={S.sectionTitle}>Contatos de emergência</div>
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {[
        { name: "Mariana Silva", rel: "Filha", phone: "(11) 99878-5432", primary: true },
        { name: "Dr. Carlos Menezes", rel: "Médico de família", phone: "(11) 3456-7890" },
        { name: "SAMU", rel: "Emergência", phone: "192" },
      ].map((c, i) => (
        <div key={i} style={{
          ...S.card,
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <Avatar size={38} initials={c.name.charAt(0)} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: T.display, fontWeight: 700, fontSize: 14, color: C.navy }}>
              {c.name}
            </div>
            <div style={{ fontFamily: T.body, fontSize: 12, color: C.textMid }}>{c.rel}</div>
          </div>
          <a href={`tel:${c.phone}`} style={{
            background: C.primaryLight, border: "none", borderRadius: 10, padding: "8px 12px",
            fontFamily: T.body, fontWeight: 600, fontSize: 12, color: C.primary,
            cursor: "pointer", textDecoration: "none",
            display: "flex", gap: "6px", alignItems: "center"
          }}><i className="fa-solid fa-phone"></i> Ligar</a>
        </div>
      ))}
    </div>
  </div>
);

/* ─── BOTTOM NAV ────────────────────────────────────────────── */
const NAV_ITEMS = [
  { id: "dashboard", icon: "fa-solid fa-house", label: "Início" },
  { id: "saude", icon: "fa-solid fa-pills", label: "Saúde" },
  { id: "agenda", icon: "fa-solid fa-calendar-day", label: "Agenda" },
  { id: "relatorios", icon: "fa-solid fa-chart-pie", label: "Relatórios" },
  { id: "perfil", icon: "fa-solid fa-user", label: "Perfil" },
];

const BottomNav = ({ active, onChange }: { active: string, onChange: (id: string) => void }) => (
  <div style={{
    position: "absolute", bottom: 0, left: 0, right: 0,
    background: C.surface,
    borderTop: `1px solid ${C.border}`,
    boxShadow: "0 -4px 20px rgba(21,101,192,0.08)",
    display: "flex", alignItems: "center", justifyItems: "space-around", justifyContent: "space-around",
    padding: "8px 0 20px", zIndex: 100,
  }}>
    {NAV_ITEMS.map(item => (
      <button key={item.id} onClick={() => onChange(item.id)} style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        background: "none", border: "none", cursor: "pointer", flex: 1, padding: "0 4px",
        position: "relative",
      }}>
        {active === item.id && (
          <div style={{
            position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)",
            width: 28, height: 3, background: C.primary, borderRadius: 3,
          }} />
        )}
        <span style={{
          fontSize: 20,
          filter: active === item.id ? "none" : "grayscale(100%) opacity(50%)",
          transform: active === item.id ? "scale(1.1)" : "scale(1)",
          display: "block",
          transition: "all 0.2s ease",
        }}><i className={item.icon}></i></span>
        <span style={{
          fontFamily: T.body, fontWeight: 600, fontSize: 10,
          color: active === item.id ? C.primary : C.textLight,
          transition: "color 0.2s",
        }}>{item.label}</span>
      </button>
    ))}
  </div>
);

/* ─── STATUS BAR ─────────────────────────────────────────────── */
const StatusBar = () => {
  const [time, setTime] = useState(() => {
    const n = new Date();
    return `${String(n.getHours()).padStart(2,"0")}:${String(n.getMinutes()).padStart(2,"0")}`;
  });
  useEffect(() => {
    const t = setInterval(() => {
      const n = new Date();
      setTime(`${String(n.getHours()).padStart(2,"0")}:${String(n.getMinutes()).padStart(2,"0")}`);
    }, 30000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      height: 44, background: C.surface, display: "flex",
      alignItems: "center", justifyContent: "space-between",
      padding: "0 20px", borderBottom: `1px solid ${C.border}`,
      flexShrink: 0,
    }}>
      <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 14, color: C.navy }}>{time}</span>
      <span style={{ fontFamily: T.body, fontSize: 13, color: C.textMid, display: "flex", gap: "6px" }}>
        <i className="fa-solid fa-signal"></i>
        <i className="fa-solid fa-battery-full"></i>
      </span>
    </div>
  );
};

/* ─── ADMIN DASHBOARD ───────────────────────────────────────── */
const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", background: C.bg, fontFamily: T.body, overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{ width: 260, background: C.surface, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: 24, display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ background: C.primary, width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
             <i className="fa-solid fa-shield-heart" style={{ fontSize: 20 }}></i>
          </div>
          <div>
            <div style={{ fontFamily: T.display, fontWeight: 900, fontSize: 18, color: C.navy, letterSpacing: -0.5 }}>CuidarApp</div>
            <div style={{ fontSize: 11, color: C.textMid }}>Gestão de Clínicas</div>
          </div>
        </div>
        
        <div style={{ flex: 1, padding: "24px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { id: "overview", icon: "fa-solid fa-chart-line", label: "Visão Geral" },
            { id: "patients", icon: "fa-solid fa-bed-pulse", label: "Pacientes" },
            { id: "caregivers", icon: "fa-solid fa-user-nurse", label: "Cuidadores" },
            { id: "schedule", icon: "fa-solid fa-calendar-days", label: "Escalas" },
            { id: "alerts", icon: "fa-solid fa-bell", label: "Alertas" },
            { id: "reports", icon: "fa-solid fa-file-invoice", label: "Relatórios" },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, cursor: "pointer",
              border: "none", background: activeTab === t.id ? C.primaryLight : "transparent",
              color: activeTab === t.id ? C.primary : C.textMid, fontFamily: T.display, fontWeight: 700, fontSize: 14,
              transition: "all 0.2s"
            }}>
              <i className={t.icon} style={{ fontSize: 16, width: 20, textAlign: "center" }}></i>
              <span style={{ flex: 1, textAlign: "left" }}>{t.label}</span>
              {t.id === "alerts" && (
                <div style={{ background: C.danger, color: "#fff", fontSize: 10, padding: "3px 8px", borderRadius: 10 }}>2</div>
              )}
            </button>
          ))}
        </div>
        
        <div style={{ padding: 24, borderTop: `1px solid ${C.border}` }}>
          <button onClick={onLogout} style={{ border: "none", background: "transparent", color: C.danger, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontFamily: T.display, fontWeight: 700 }}>
             <i className="fa-solid fa-arrow-right-from-bracket"></i> Sair do Painel
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ height: 70, background: C.surface, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px" }}>
           <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 20, color: C.navy }}>
             Painel de Controle
           </div>
           
           <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
             <div style={{ position: "relative", cursor: "pointer" }}>
               <i className="fa-regular fa-bell" style={{ fontSize: 20, color: C.textMid }}></i>
               <div style={{ position: "absolute", top: -2, right: -4, width: 8, height: 8, background: C.danger, borderRadius: "50%" }}></div>
             </div>
             <div style={{ display: "flex", alignItems: "center", gap: 12, borderLeft: `1px solid ${C.border}`, paddingLeft: 16 }}>
               <Avatar src="https://i.pravatar.cc/150?img=11" size={36} />
               <div style={{ textAlign: "left" }}>
                 <div style={{ fontFamily: T.display, fontWeight: 700, fontSize: 13, color: C.navy }}>Carla Martins</div>
                 <div style={{ fontSize: 11, color: C.textMid }}>Gerente Operacional</div>
               </div>
             </div>
           </div>
        </div>
        
        <div style={{ flex: 1, overflowY: "auto", padding: 32 }}>
           {activeTab === "overview" ? <AdminOverview /> : (
             <div style={{ textAlign: "center", padding: 60, color: C.textMid }}>
                <i className="fa-solid fa-person-digging" style={{ fontSize: 40, marginBottom: 16, color: C.primaryLight }}></i>
                <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 20, color: C.navy }}>Em desenvolvimento</div>
                <p style={{ marginTop: 8 }}>Esta seção do painel será disponibilizada em breve.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

const AdminOverview = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1200, margin: "0 auto" }}>
      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
         {[
           { label: "Pacientes Ativos", value: "128", icon: "fa-solid fa-bed", color: C.primary },
           { label: "Cuidadores em Turno", value: "45", icon: "fa-solid fa-user-nurse", color: C.accent },
           { label: "Ocorrências (Hoje)", value: "3", icon: "fa-solid fa-triangle-exclamation", color: C.warning },
           { label: "Alertas Críticos", value: "1", icon: "fa-solid fa-truck-medical", color: C.danger },
         ].map((kpi, i) => (
           <div key={i} style={{ ...S.cardElevated, display: "flex", alignItems: "center", gap: 16 }}>
             <div style={{ width: 56, height: 56, borderRadius: 16, background: `${kpi.color}15`, color: kpi.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
               <i className={kpi.icon}></i>
             </div>
             <div>
               <div style={{ fontSize: 13, color: C.textMid, marginBottom: 4 }}>{kpi.label}</div>
               <div style={{ fontFamily: T.display, fontWeight: 900, fontSize: 28, color: C.navy, lineHeight: 1 }}>{kpi.value}</div>
             </div>
           </div>
         ))}
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
         {/* Monitored Visits */}
         <div style={{ ...S.cardElevated, padding: 0, overflow: "hidden" }}>
           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: `1px solid ${C.border}` }}>
             <div style={{ ...S.sectionTitle, margin: 0, fontSize: 16 }}>Visitas em Andamento</div>
             <button style={{ ...S.btnOutline, width: "auto", padding: "6px 14px", fontSize: 12 }}>Ver Todas</button>
           </div>
           
           <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
             <thead>
               <tr style={{ background: C.bg, fontFamily: T.body, fontSize: 12, color: C.textMid }}>
                 <th style={{ padding: "12px 24px", fontWeight: 600 }}>Paciente</th>
                 <th style={{ padding: "12px 24px", fontWeight: 600 }}>Cuidador(a)</th>
                 <th style={{ padding: "12px 24px", fontWeight: 600 }}>Status</th>
                 <th style={{ padding: "12px 24px", fontWeight: 600 }}>Último Registro</th>
               </tr>
             </thead>
             <tbody>
               {[
                 { p: "Maria da Silva", c: "Ana Lima", status: "ok", last: "Almoço (12:30)" },
                 { p: "João Ferreira", c: "Carla Santos", status: "warning", last: "Atraso no check-in" },
                 { p: "Cecília Mendes", c: "Patrícia Souza", status: "ok", last: "Medicação (14:00)" },
                 { p: "Antônio Rosa", c: "Roberto Dias", status: "danger", last: "Queda leve (11:15)" },
               ].map((v, i) => (
                 <tr key={i} style={{ borderBottom: i === 3 ? "none" : `1px solid ${C.border}` }}>
                   <td style={{ padding: "16px 24px", fontFamily: T.display, fontWeight: 700, color: C.navy, fontSize: 14 }}>{v.p}</td>
                   <td style={{ padding: "16px 24px", fontSize: 13, color: C.textMid }}>{v.c}</td>
                   <td style={{ padding: "16px 24px" }}>
                     {v.status === "ok" && <span style={S.badge(C.success, C.successLight)}><i className="fa-solid fa-check"></i> Normal</span>}
                     {v.status === "warning" && <span style={S.badge(C.warning, C.warningLight)}><i className="fa-solid fa-clock"></i> Atenção</span>}
                     {v.status === "danger" && <span style={S.badge(C.danger, C.dangerLight)}><i className="fa-solid fa-triangle-exclamation"></i> Crítico</span>}
                   </td>
                   <td style={{ padding: "16px 24px", fontSize: 13, color: C.textMid }}>{v.last}</td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
         
         {/* Action Center */}
         <div style={{ ...S.cardElevated }}>
           <div style={{ ...S.sectionTitle, margin: "0 0 16px 0", fontSize: 16 }}>Alertas do Sistema</div>
           <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
             <div style={{ padding: 16, borderRadius: 12, background: C.dangerLight, borderLeft: `4px solid ${C.danger}` }}>
               <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                 <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 14, color: C.danger }}>Urgência: Antônio Rosa</div>
                 <div style={{ fontSize: 12, color: C.danger, fontWeight: 700 }}>11:15</div>
               </div>
               <div style={{ fontSize: 13, color: C.textMid, lineHeight: 1.4 }}>Cuidador relatou queda leve sem ferimentos. Requer avaliação de supervisor.</div>
               <button style={{ ...S.btn, background: C.danger, padding: "8px 16px", width: "auto", marginTop: 12, fontSize: 12 }}>Assumir Caso</button>
             </div>
             
             <div style={{ padding: 16, borderRadius: 12, background: C.warningLight, borderLeft: `4px solid ${C.warning}` }}>
               <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                 <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 14, color: C.warning }}>Atraso: João Ferreira</div>
                 <div style={{ fontSize: 12, color: C.warning, fontWeight: 700 }}>Há 15 min</div>
               </div>
               <div style={{ fontSize: 13, color: C.textMid, lineHeight: 1.4 }}>Check-in programado para 13:00 ainda não realizado.</div>
               <button style={{ ...S.btnOutline, borderColor: C.warning, color: C.warning, padding: "8px 16px", width: "auto", marginTop: 12, fontSize: 12 }}>Notificar Cuidador</button>
             </div>
           </div>
         </div>
      </div>
    </div>
  );
};

/* ─── APP ROOT ───────────────────────────────────────────────── */
export default function App() {
  const [role, setRole] = useState<"family" | "admin" | null>(null);
  const [screen, setScreen] = useState("splash");
  const [prev, setPrev] = useState<string | null>(null);

  const navigate = (to: string) => {
    setPrev(screen);
    setScreen(to);
  };

  const isApp = screen !== "splash";

  const renderScreen = () => {
    switch (screen) {
      case "splash": return <SplashScreen onEnter={() => navigate("dashboard")} />;
      case "dashboard": return <DashboardScreen onAlerts={() => navigate("alertas")} />;
      case "saude": return <SaudeScreen />;
      case "agenda": return <AgendaScreen />;
      case "relatorios": return <RelatoriosScreen />;
      case "alertas": return <AlertasScreen />;
      case "perfil": return <PerfilScreen />;
      default: return null;
    }
  };

  return (
    <>
      <FontLoader />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { display: none; }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        button:active { transform: scale(0.97) !important; }
      `}</style>

      {!role ? (
        <div style={{
          height: "100vh", width: "100vw", background: C.bg,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: T.body, padding: 20
        }}>
          <div style={{
            background: "#fff", padding: 40, borderRadius: 24,
            boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
            maxWidth: 400, width: "100%", textAlign: "center"
          }}>
            <div style={{ marginBottom: 32 }}>
              <Logo size={70} />
              <div style={{ fontFamily: T.display, fontWeight: 900, fontSize: 24, color: C.navy, marginTop: 16 }}>
                Selecionar Perfil
              </div>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <button onClick={() => setRole("family")} style={{
                ...S.btnOutline, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12,
                justifyContent: "flex-start", background: C.bg, border: "none"
              }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: C.primaryLight, color: C.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                  <i className="fa-solid fa-house-chimney-user"></i>
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 15, color: C.navy }}>Familiar / Paciente</div>
                  <div style={{ fontSize: 12, color: C.textMid, fontWeight: 400 }}>Acesso via aplicativo mobile</div>
                </div>
              </button>
              
              <button onClick={() => setRole("admin")} style={{
                ...S.btnOutline, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12,
                justifyContent: "flex-start", background: C.accentLight, border: "none"
              }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#fff", color: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                  <i className="fa-solid fa-hospital-user"></i>
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 15, color: C.accent }}>Clínica / Gestão</div>
                  <div style={{ fontSize: 12, color: C.accent, opacity: 0.8, fontWeight: 400 }}>Painel de administrativo</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      ) : role === "admin" ? (
        <AdminDashboard onLogout={() => setRole(null)} />
      ) : (
      <div style={{
        minHeight: "100vh",
        background: "#1A1D23",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
        fontFamily: T.body,
      }}>
        <div style={{ position: "absolute", top: 20, left: 20 }}>
           <button onClick={() => setRole(null)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "8px 16px", borderRadius: 8, cursor: "pointer" }}><i className="fa-solid fa-chevron-left" style={{ marginRight: 8 }}></i> Trocar perfil</button>
        </div>

        {/* Phone frame */}
        <div style={{
          width: 390, height: 780,
          background: C.surface,
          borderRadius: 44,
          overflow: "hidden",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 10px #2A2D33, 0 0 0 12px #1A1D23",
          display: "flex", flexDirection: "column",
          position: "relative",
          flexShrink: 0,
        }}>
          {/* Notch */}
          <div style={{
            position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
            width: 120, height: 28, background: "#1A1D23",
            borderRadius: "0 0 20px 20px", zIndex: 200,
          }} />

          {/* Status bar */}
          <div style={{ paddingTop: 28, flexShrink: 0 }}>
            <StatusBar />
          </div>

          {/* Back button for sub-screens */}
          {screen === "alertas" && (
            <div style={{
              padding: "10px 20px 0",
              background: C.surface,
            }}>
              <button onClick={() => navigate("dashboard")} style={{
                background: C.bg, border: "none", borderRadius: 10, padding: "6px 12px",
                fontFamily: T.body, fontWeight: 600, fontSize: 13, color: C.navy, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <i className="fa-solid fa-chevron-left"></i> Voltar
              </button>
            </div>
          )}

          {/* Screen content */}
          <div style={{ flex: 1, overflow: "hidden", background: C.bg, position: "relative" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={screen}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  inset: 0,
                  overflowY: "auto",
                }}
              >
                {renderScreen()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom nav (only for main app screens) */}
          {isApp && screen !== "alertas" && (
            <BottomNav
              active={screen}
              onChange={navigate}
            />
          )}

          {/* Home indicator */}
          <div style={{
            position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
            width: 120, height: 4, background: "#1A1D23", borderRadius: 4, zIndex: 300,
          }} />
        </div>

        {/* Side legend */}
        <div style={{
          marginLeft: 32, color: "rgba(255,255,255,0.4)",
          fontFamily: T.body, fontSize: 12, lineHeight: 2,
          display: "flex", flexDirection: "column", gap: 4,
        }}>
          {NAV_ITEMS.map(n => (
            <div key={n.id} style={{
              cursor: "pointer",
              color: screen === n.id ? "#fff" : "rgba(255,255,255,0.3)",
              transition: "color 0.2s",
              display: "flex", alignItems: "center", gap: 8,
            }} onClick={() => navigate(n.id)}>
              <span style={{ width: 20, textAlign: "center" }}><i className={n.icon}></i></span>
              <span>{n.label}</span>
            </div>
          ))}
          <div style={{ marginTop: 8, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 8 }}>
            <div style={{ cursor: "pointer", display: "flex", gap: 8,
              color: screen === "alertas" ? "#fff" : "rgba(255,255,255,0.3)"
            }} onClick={() => navigate("alertas")}>
              <span style={{ width: 20, textAlign: "center" }}><i className="fa-solid fa-bell"></i></span><span>Alertas</span>
            </div>
          </div>
        </div>
      </div>
      )}
    </>
  );
}
