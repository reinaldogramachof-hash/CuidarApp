# Arquitetura do Sistema — CuidarApp

## Visão de Alto Nível

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENTES (Frontend)                   │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Admin Panel │  │  Family App  │  │ Caregiver App │  │
│  │  (Desktop /  │  │  (Mobile     │  │  (Mobile PWA) │  │
│  │   Tablet)    │  │   PWA)       │  │  [PENDENTE]   │  │
│  └──────┬───────┘  └──────┬───────┘  └───────┬───────┘  │
│         └─────────────────┴──────────────────┘          │
│                           │                             │
│              React (TypeScript) + Vite                  │
│              Tailwind CSS + Zustand + TanStack Query     │
└───────────────────────────┬─────────────────────────────┘
                            │ HTTPS / WebSocket
┌───────────────────────────▼─────────────────────────────┐
│                    SUPABASE (BaaS)                       │
│                                                          │
│  ┌────────────┐  ┌─────────────┐  ┌──────────────────┐  │
│  │    Auth    │  │  PostgreSQL │  │    Realtime      │  │
│  │  (JWT +    │  │  + RLS      │  │  (WebSocket)     │  │
│  │   LGPD)    │  │             │  │                  │  │
│  └────────────┘  └─────────────┘  └──────────────────┘  │
│                                                          │
│  ┌────────────┐  ┌─────────────────────────────────────┐ │
│  │  Storage   │  │         Edge Functions              │ │
│  │  (Fotos    │  │  (Lógica com service_role — Push    │ │
│  │  pacientes)│  │   Notifications, Alertas críticos)  │ │
│  └────────────┘  └─────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Camadas da Aplicação

### Frontend (React + TypeScript)
```
src/
├── components/
│   ├── admin/          ← Dashboard, Tabelas, Escalas
│   ├── family/         ← Timeline, Sinais Vitais, Alertas
│   ├── caregiver/      ← Check-in/out, Apontamento [PENDENTE]
│   └── shared/         ← LoadingSkeleton, ErrorBanner, etc.
├── hooks/
│   ├── useAuth.ts      ← Supabase Auth
│   ├── usePatients.ts  ← Query de pacientes
│   ├── useVitalSigns.ts← Query + Realtime de sinais vitais
│   └── useAlerts.ts    ← Query + Realtime de alertas
├── lib/
│   ├── supabase.ts     ← Client inicializado
│   └── validations/    ← Schemas Zod
├── store/
│   ├── authStore.ts    ← Usuário autenticado, role
│   └── uiStore.ts      ← Sidebar, tema, notificações
└── types/
    ├── supabase.ts     ← Tipos auto-gerados pelo Supabase CLI
    └── domain.ts       ← Tipos de domínio (Patient, VitalSign, etc.)
```

### Fluxo de Autenticação
```
1. Usuário entra email + senha
2. Supabase Auth valida → retorna JWT
3. Frontend persiste sessão via SDK
4. Ao fazer queries: JWT é enviado automaticamente
5. PostgreSQL RLS valida o JWT e filtra dados por role/clinic_id
6. TanStack Query mantém cache dos dados autenticados
```

### Fluxo de Dados em Tempo Real (Sinais Vitais)
```
Cuidador registra sinal vital
→ INSERT na tabela vital_signs
→ Supabase Realtime dispara para assinantes
→ Frontend do Familiar recebe atualização
→ TanStack Query invalida cache automaticamente
→ UI atualiza sem refresh

Se sinal crítico detectado:
→ Edge Function avalia thresholds
→ INSERT em tabela alerts
→ Push Notification via Service Worker
→ Familiar recebe alerta na tela bloqueada
```

## PWA Architecture

### Service Worker Strategy
| Recurso | Estratégia de Cache |
|---|---|
| Assets estáticos (JS, CSS, imagens) | Cache First |
| API calls (dados) | Network First |
| Dados de saúde sensíveis | Network Only (nunca cache) |
| Fontes | Stale-While-Revalidate |

### Perfis de Instalação
- Familiar: instala no smartphone como app nativo (manifest.json)
- Admin: pode instalar no tablet/desktop
- Cuidador: instala no smartphone (quando implementado)

## Decisões de Arquitetura Registradas

| Data | Decisão | Motivo |
|---|---|---|
| 2026-05-02 | Supabase sobre Firebase | Dados relacionais de saúde, RLS nativo, LGPD |
| 2026-05-02 | TanStack Query sobre SWR | Melhor integração com Supabase Realtime |
| 2026-05-02 | Zustand sobre Redux | Menor boilerplate, suficiente para o escopo |
| 2026-05-02 | Vite sobre CRA/Next.js | Performance de build, sem SSR necessário |
