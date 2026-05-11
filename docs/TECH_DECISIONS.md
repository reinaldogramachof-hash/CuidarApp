# Decisões Técnicas — CuidarApp

Este documento registra decisões técnicas importantes do projeto para evitar retrabalho e manter clareza durante a evolução do MVP.

## ADR-001 — Começar com serviços simulados antes do backend real

### Status

Aceita.

### Contexto

O projeto ainda está saindo de um protótipo visual para um MVP funcional. Antes de escolher e implementar um backend definitivo, é útil criar uma camada de serviços que simule as operações principais.

### Decisão

Criar serviços em `src/services/` para representar operações de autenticação e cuidado:

- `authService.ts`
- `careService.ts`

Esses serviços usam dados mockados temporariamente, mas expõem funções parecidas com as que serão usadas no backend real.

### Consequências positivas

- Reduz acoplamento entre telas e mocks.
- Facilita troca futura para Supabase, Firebase, Appwrite ou backend próprio.
- Permite desenvolver fluxos do MVP sem bloquear pela decisão de infraestrutura.
- Ajuda a desenhar melhor o contrato de dados.

### Consequências negativas

- Pode criar falsa sensação de funcionalidade real.
- Exige disciplina para substituir mocks por persistência real.

---

## ADR-002 — IA fora do MVP

### Status

Aceita.

### Contexto

O projeto possui dependência relacionada a Gemini/GenAI, mas o alinhamento de produto definiu que a IA não deve fazer parte do MVP inicial.

### Decisão

Manter compatibilidade com `GEMINI_API_KEY` no ambiente, mas não tratar IA como fluxo central do MVP.

### Consequências positivas

- Reduz complexidade inicial.
- Permite validar valor real do cuidado, registro e relatório.
- Evita depender de IA antes de haver dados úteis.

### Consequências negativas

- Recursos inteligentes ficam para uma fase posterior.

---

## ADR-003 — Backend/BaaS ainda não escolhido

### Status

Pendente.

### Contexto

O MVP precisará de autenticação, banco de dados e regras de acesso. As opções iniciais são:

- Supabase
- Firebase
- Appwrite
- Backend próprio

### Critérios de escolha

- Facilidade para autenticação.
- Banco de dados simples.
- Controle de permissões por paciente.
- Custo inicial baixo.
- Boa documentação.
- Facilidade de deploy.

### Recomendação inicial

Supabase é uma boa opção candidata para MVP por oferecer autenticação, banco Postgres, storage e políticas de acesso em uma única plataforma.

A decisão final deve ser tomada antes da Fase 1.
