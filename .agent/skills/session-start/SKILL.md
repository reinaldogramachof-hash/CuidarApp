---
name: session-start
description: Protocolo de inicialização de sessão de desenvolvimento. Use ao receber o comando /session-start ou quando o usuário disser "vamos começar", "iniciando sessão" ou similar.
---

# Protocolo de Início de Sessão

**Objetivo:** Carregar todo o contexto necessário para a sessão de desenvolvimento sem
sobrecarga de contexto (context rot).

## Passos

### 1. Carregar Contexto Essencial
Leia os seguintes arquivos **nesta ordem** (não carregue tudo de uma vez):
- `@CLAUDE.md` — visão geral e papéis
- `@.agent/rules/00-project-overview.md` — estado atual do projeto
- O arquivo mais recente em `@docs/session-reports/` — pendências da última sessão

### 2. Verificar Estado do Projeto
Execute as seguintes verificações:
```bash
# Verificar arquivos modificados não commitados
git status

# Verificar o último commit para contexto
git log --oneline -5
```

### 3. Apresentar Resumo ao Arquiteto
Gere um briefing conciso com:
```
BRIEFING DE INÍCIO DE SESSÃO — [DATA/HORA]

Estado do Repositório:
- Arquivos modificados: [lista ou "nenhum"]
- Último commit: [hash e mensagem]

Pendências da Última Sessão:
- [item 1 dos próximos passos do último report]
- [item 2...]

Aguardando definição de missão pelo Arquiteto (Claude Code).
```

### 4. Aguardar Missão
NÃO iniciar nenhuma tarefa de código até receber a missão definida pelo Arquiteto.

## Restrições
- Não carregar `node_modules`, `dist`, arquivos `.lock` no contexto
- Não modificar nenhum arquivo durante o início de sessão
- Não iniciar implementação por conta própria
