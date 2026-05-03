# CuidarApp — Documento Central do Projeto

## Identidade do Projeto
**CuidarApp** é uma plataforma Web + PWA de gestão de Home Care que conecta três perfis:
Admin/Clínica, Familiar/Acompanhante e Cuidador. Stack: React (TypeScript) + Vite + Supabase.

## Time de IAs — Papéis e Responsabilidades

| Agente | Ferramenta | Papel |
|---|---|---|
| **Claude Code** | Anthropic Claude | **Arquiteto do Sistema / Orquestrador** |
| **Antigravity** | Google Antigravity (Gemini 3) | **Agente de Execução** |

### Claude Code (Arquiteto)
- Define arquitetura, decisões técnicas e estratégia de banco de dados
- Orquestra as missões delegadas ao Antigravity
- Revisa planos antes da execução de código
- Mantém documentação, regras e memória do projeto atualizadas
- Valida segurança e conformidade (LGPD)
- Aprova ou rejeita planos de implementação gerados pelo Antigravity
- Emite o **Report de Sessão** ao final de cada sessão

### Google Antigravity (Agente de Execução)
- Recebe missões estruturadas do Arquiteto
- Executa mudanças de código, testes e validações de UI
- Gera artefatos: Task List, Plano de Implementação, Walkthrough
- Aciona subagente de navegador para validação visual
- Reporta status e bloqueadores ao Arquiteto

---

## Estrutura do Repositório

```
CuidarApp/
├── .agent/
│   ├── rules/          ← Constituição (sempre carregada pelo Antigravity)
│   ├── skills/         ← Habilidades especializadas (carregadas just-in-time)
│   └── workflows/      ← Fluxos reutilizáveis (/session-start, /session-end, /review)
├── .agents/            ← Integração Graphify para Antigravity
│   ├── rules/          ← graphify.md (regras do knowledge graph)
│   └── workflows/      ← graphify.md (workflow /graphify)
├── .claude/
│   └── settings.json   ← PreToolUse hook do Graphify (Claude Code)
├── graphify-out/       ← Grafo gerado (gitignored — rebuild com graphify update .)
│   ├── graph.json      ← Knowledge graph serializado
│   ├── GRAPH_REPORT.md ← Relatório: nós centrais + comunidades
│   ├── graph.html      ← Visualização interativa (vis.js)
│   └── wiki/           ← Artigos gerados por conceito
├── docs/
│   ├── ARCHITECTURE.md ← Arquitetura do sistema
│   ├── DATABASE.md     ← Decisão e schema do banco de dados (Supabase)
│   ├── SECURITY.md     ← Critérios de segurança e LGPD
│   └── AGENT-ROLES.md  ← Detalhamento dos papéis dos agentes
├── scripts/
│   ├── session-start.ps1 ← Script de início de sessão (inclui graphify watch)
│   └── session-end.ps1   ← Script de fim de sessão + geração de report
├── src/                ← Código-fonte React/TypeScript
├── public/
│   ├── manifest.json
│   └── sw.js
├── CLAUDE.md           ← Este arquivo (lido pelo Claude Code)
└── Relatorio.md        ← Relatório técnico original do projeto
```

---

## Banco de Dados: Supabase (PostgreSQL)

**Decisão:** Supabase foi escolhido sobre Firebase pelos seguintes motivos:
1. PostgreSQL relacional — dados de saúde são estruturados e relacionais
2. Row Level Security (RLS) nativo — essencial para isolamento entre clínicas (LGPD)
3. Realtime subscriptions — sinais vitais em tempo real para familiares
4. Auth integrado — email/senha com suporte a LGPD
5. Storage integrado — fotos dos pacientes
6. O usuário já tem familiaridade com Supabase

Schema detalhado: ver [docs/DATABASE.md](docs/DATABASE.md)

---

## Regra de Ouro do Time

> Nenhuma linha de código é escrita sem que o Arquiteto (Claude Code) tenha aprovado
> o Plano de Implementação gerado pelo Antigravity. Plano primeiro, código depois.

---

## Protocolo de Sessão

### Início de Sessão
1. Executar `scripts/session-start.ps1`
2. Claude Code lê o último report de sessão em `docs/session-reports/`
3. Claude Code define as missões da sessão
4. Antigravity recebe as missões estruturadas

### Fim de Sessão
1. Antigravity gera o Walkthrough da sessão
2. Executar `scripts/session-end.ps1` — gera `docs/session-reports/YYYY-MM-DD.md`
3. Claude Code valida e assina o report

Ver protocolo completo: [.agent/rules/05-session-protocol.md](.agent/rules/05-session-protocol.md)

## Graphify — Cérebro Cognitivo do Projeto

Este projeto possui um knowledge graph em `graphify-out/` que indexa todo o código, documentação e regras de agentes.

**Regras para Claude Code:**
- Antes de responder perguntas de arquitetura ou codebase, ler `graphify-out/GRAPH_REPORT.md` para identificar nós centrais e estrutura de comunidades
- Se `graphify-out/wiki/index.md` existir, navegar por ele em vez de ler arquivos brutos
- Para perguntas cross-módulo ("como X se relaciona com Y"), preferir os comandos CLI abaixo em vez de grep:
  - `graphify query "<pergunta>"` — consulta por BFS/DFS no grafo
  - `graphify path "<A>" "<B>"` — caminho mais curto entre dois conceitos
  - `graphify explain "<conceito>"` — explicação plain-language de um nó
- Após modificar arquivos de código na sessão, executar `graphify update .` para manter o grafo atualizado (apenas AST, sem custo de API)
