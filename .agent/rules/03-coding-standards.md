# Padrões de Desenvolvimento

**Escopo:** Global — aplica-se a todos os arquivos de código

## Estrutura de Arquivos

### Convenção de Nomenclatura
- Componentes React: `PascalCase` (ex: `PatientCard.tsx`)
- Hooks: `camelCase` com prefixo `use` (ex: `usePatientData.ts`)
- Utilitários: `camelCase` (ex: `formatVitalSign.ts`)
- Tipos/Interfaces: `PascalCase` com sufixo de contexto (ex: `PatientProfile`, `VitalSignReading`)
- Constantes: `UPPER_SNAKE_CASE` (ex: `MAX_ALERT_THRESHOLD`)
- Arquivos de teste: `<nome>.test.tsx` ou `<nome>.spec.ts`

### Organização de Diretórios
```
src/
├── components/
│   ├── admin/          ← Componentes exclusivos do painel Admin
│   ├── family/         ← Componentes exclusivos do app Familiar
│   ├── caregiver/      ← Componentes exclusivos do app Cuidador
│   └── shared/         ← Componentes reutilizáveis entre perfis
├── hooks/              ← Custom hooks (queries, auth, realtime)
├── lib/
│   ├── supabase.ts     ← Cliente Supabase inicializado
│   └── validations/    ← Schemas Zod
├── store/              ← Zustand stores
├── types/              ← Interfaces e tipos TypeScript globais
├── utils/              ← Funções utilitárias puras
└── pages/              ← (se usar file-based routing)
```

## Padrões de Componente

### Estrutura de um Componente
```tsx
// 1. Imports externos
// 2. Imports internos (componentes, hooks, utils, types)
// 3. Interface de Props
// 4. Definição do componente
// 5. Export default
```

### Regras de Componente
- Um componente por arquivo.
- Props opcionais com `?` e valor default via desestruturação.
- Evitar prop drilling além de 2 níveis — usar Zustand ou Context.
- Loading states e error states sempre tratados explicitamente.

## Padrões de Integração com Supabase

### Custom Hooks com TanStack Query
```tsx
// Padrão obrigatório para queries de dados
export function usePatients(clinicId: string) {
  return useQuery({
    queryKey: ['patients', clinicId],
    queryFn: () => fetchPatients(clinicId),
    staleTime: 30_000,
  });
}
```

### Tratamento de Erros
- SEMPRE verificar o `error` retornado pelo Supabase client.
- Erros de autenticação (`401`, `403`) devem redirecionar para o login.
- Erros de dados devem exibir um toast/banner amigável ao usuário.
- NUNCA exibir mensagens de erro técnicas do banco para o usuário final.

## Git e Versionamento

### Commits
- Formato: `<tipo>(<escopo>): <descrição>` (Conventional Commits)
- Tipos: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`
- Exemplos:
  - `feat(caregiver): add check-in screen with vital signs form`
  - `fix(auth): correct session refresh on token expiry`
  - `docs(database): update RLS policies documentation`

### Branches
- `main` — produção, protegida
- `develop` — integração
- `feat/<nome>` — novas funcionalidades
- `fix/<nome>` — correções

### Proibido
- NUNCA commitar `.env.local`, `node_modules`, `dist`.
- NUNCA fazer force push em `main` ou `develop`.
- NUNCA pular hooks de commit (`--no-verify`).

## Testes

### Prioridades
1. Lógica de negócio crítica (cálculo de alertas de sinais vitais)
2. Componentes de formulário (validação, submit)
3. Hooks de integração com Supabase (mock do client)

### Ferramentas
- Unit/Component: Vitest + React Testing Library
- Tipagem de testes: nunca usar `any` em mocks
