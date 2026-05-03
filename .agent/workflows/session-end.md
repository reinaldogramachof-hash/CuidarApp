# Workflow: Fim de Sessão

**Gatilho:** `/session-end`

## Execução

1. Invocar skill `session-end` via `@.agent/skills/session-end/SKILL.md`
2. Executar validações finais (lint, grep por secrets)
3. Acionar subagente de navegador para screenshot do estado atual da UI
4. Gerar arquivo `docs/session-reports/YYYY-MM-DD.md` com o template do protocolo
5. Apresentar report ao Arquiteto (Claude Code) para aprovação
6. Aguardar aprovação antes de commitar
