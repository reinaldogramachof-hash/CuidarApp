# Padrões de Tech Stack

**Escopo:** Global — aplica-se a todos os arquivos do projeto

## Frontend

### React
- SEMPRE use Componentes Funcionais + Hooks. NUNCA componentes de Classe.
- Prefira composição a herança.
- Use `React.memo` apenas quando houver prova de re-render desnecessário.

### TypeScript
- Strict mode obrigatório (`"strict": true` no tsconfig).
- NUNCA use o tipo `any`. Use `unknown` e faça type narrowing.
- Defina interfaces para todas as props, estados e respostas de API.
- Prefira `interface` a `type` para objetos. Use `type` para unions/intersections.

### Estilização
- Use **Tailwind CSS** exclusivamente.
- NÃO crie arquivos `.css` separados (exceto globals.css existente).
- NÃO use styled-components ou CSS-in-JS.
- Paleta corporativa:
  - Primária: `teal-600` / `green-600` (verde-azulado saúde)
  - Secundária: `slate-800` / `slate-900` (azul-marinho escuro)
  - Alerta: `red-500`, `amber-500`
  - Sucesso: `green-500`
- Transições suaves: sempre `transition-colors duration-200` em elementos interativos.

### Estado Global
- Use **Zustand** para estado global de aplicação (tema, usuário autenticado, etc).
- Use **TanStack Query (React Query)** para estado de servidor (fetch/cache de dados Supabase).
- NÃO use Redux ou Context API para estado global complexo.
- Context API é permitida apenas para temas e localização simples.

### Utilitários
- Datas: **date-fns**. NÃO use moment.js (deprecated) ou dayjs.
- Formulários: **react-hook-form** + **Zod** para validação.
- Ícones: manter os ícones já em uso no projeto (SVG inline ou biblioteca existente).

## Backend / Integração

### Supabase
- SEMPRE use o Supabase Client (`@supabase/supabase-js`) para todas as queries.
- NÃO construa queries SQL em string. Use o Query Builder do Supabase.
- Credenciais via variáveis de ambiente (`.env.local`): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- NÃO exponha a `service_role` key no frontend. Nunca.
- Use Edge Functions para lógica que requer `service_role`.

### API
- Valide toda entrada de usuário com **Zod** antes de enviar ao Supabase.
- Trate erros do Supabase explicitamente (`error.code`, `error.message`).
- Use TanStack Query para cache e revalidação automática.

## Qualidade de Código
- SEM PLACEHOLDERS. Implemente sempre o código completo.
- SEM comentários explicando o que o código faz (nomes autoexplicativos).
- Comentários permitidos apenas para restrições não óbvias ou workarounds.
- Funções com mais de 40 linhas devem ser decompostas.
- Arquivos com mais de 200 linhas devem ser divididos em módulos.
