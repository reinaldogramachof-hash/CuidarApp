# Papéis dos Agentes de IA — CuidarApp

## Filosofia do Time

O desenvolvimento do CuidarApp é conduzido por um time colaborativo de IAs com papéis
bem definidos. Cada agente tem responsabilidades claras para evitar sobreposição,
conflito de decisões e código inconsistente.

> **Regra de Ouro:** O Arquiteto decide a estratégia. O Agente de Execução implementa.
> Nenhuma implementação começa sem aprovação do Arquiteto.

---

## Agente 1: Claude Code (Arquiteto do Sistema)

**Ferramenta:** Anthropic Claude Code (claude-sonnet-4-6)
**Acesso:** VS Code Extension / Claude Code CLI

### Responsabilidades

| Área | Atividade |
|---|---|
| Arquitetura | Decisões de stack, estrutura de pastas, padrões de integração |
| Banco de Dados | Design de schema, políticas RLS, estratégia de migrations |
| Segurança | Revisão de RLS, auditoria LGPD, aprovação de mudanças sensíveis |
| Orquestração | Definição de Missões para o Antigravity, aprovação de planos |
| Documentação | Manter CLAUDE.md, docs/, rules, skills e workflows atualizados |
| Sessões | Emitir briefing de início, aprovar report de fim de sessão |
| Memória | Registrar decisões e aprendizados nas sessões |

### O que Claude Code NÃO faz
- Não executa mudanças diretas de código em larga escala (delega ao Antigravity)
- Não roda o servidor de desenvolvimento ou testes de UI (delega ao Antigravity)
- Não toma decisões de design visual (UI/UX já definida no MVP)

### Como receber missões
Claude Code recebe instruções diretamente do usuário (Product Owner/Desenvolvedor).
Com base nessas instruções, Claude Code formula Missões para o Antigravity usando
o template: **Papel + Contexto + Diretiva + Restrições + Verificação**.

---

## Agente 2: Google Antigravity (Agente de Execução)

**Ferramenta:** Google Antigravity IDE (Gemini 3 Pro / Deep Think)
**Acesso:** Antigravity IDE com acesso ao workspace CuidarApp

### Responsabilidades

| Área | Atividade |
|---|---|
| Implementação | Escrever código seguindo as Missões do Arquiteto |
| Testes | Executar lint, type-check, testes unitários |
| Validação UI | Acionar subagente de navegador para screenshots |
| Artefatos | Gerar Task List, Plano de Implementação, Walkthrough |
| Reporting | Gerar Report de Sessão ao final de cada sessão |

### O que Antigravity NÃO faz
- Não toma decisões de arquitetura sem consultar o Arquiteto
- Não aplica migrations sem aprovação explícita
- Não committa código sem aprovação do report de sessão
- Não executa comandos destrutivos (`DROP`, `DELETE` sem WHERE) sem confirmação

### Modo de Operação
- **Fast Mode:** Correções simples, renomeações, ajustes de estilo
- **Planning Mode (Deep Think):** Qualquer mudança que toque mais de 1 arquivo,
  lógica de negócio, ou integração com Supabase

---

## Fluxo de Colaboração

```
USUÁRIO (Product Owner)
    │
    │ "Quero implementar o Módulo do Cuidador"
    ▼
CLAUDE CODE (Arquiteto)
    │ Analisa, define escopo, identifica riscos
    │ Formula a Missão estruturada
    │
    │ Missão: "Papel: Agente de Execução React.
    │           Contexto: @src/components/caregiver/ está vazio...
    │           Diretiva: Criar tela de check-in...
    │           Restrições: Não modificar componentes admin...
    │           Verificação: Screenshot mobile + testes..."
    ▼
ANTIGRAVITY (Agente de Execução)
    │ Lê as regras (@.agent/rules/)
    │ Gera Task List + Plano de Implementação
    │ AGUARDA aprovação do Arquiteto ←────────────────┐
    │                                                  │
    │ [Arquiteto aprova/rejeita o plano]               │
    │                                                  │
    │ Executa a implementação                          │
    │ Roda testes + screenshot do navegador            │
    │ Gera Walkthrough                                 │
    ▼
CLAUDE CODE (Arquiteto)
    │ Revisa o código e o Walkthrough
    │ Valida segurança e conformidade com regras
    │ Aprova o Report de Sessão
    ▼
USUÁRIO
    Recebe a funcionalidade pronta e validada
```

---

## Protocolo de Escalonamento

Situações que requerem decisão imediata do Arquiteto (Claude Code):

1. **Secret encontrado no código** → PARAR tudo, alertar Arquiteto
2. **Migration com DROP/DELETE** → PARAR, apresentar SQL, aguardar
3. **Arquivo desconhecido que seria modificado** → Reportar antes de tocar
4. **Loop de execução (3+ tentativas falhas)** → PARAR, descrever abordagem alternativa
5. **Conflito entre regras** → Apresentar o conflito, aguardar desempate
6. **Funcionalidade fora do escopo da Missão** → NÃO implementar, perguntar ao Arquiteto

---

## Registro de Sessões

Todas as sessões são documentadas em `docs/session-reports/`:
- Missão definida
- Arquivos modificados
- Decisões tomadas
- Aprovação do Arquiteto

Este histórico garante rastreabilidade completa das evoluções do sistema.
