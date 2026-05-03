---
name: session-end
description: Protocolo de encerramento de sessão. Use ao receber /session-end ou quando o usuário disser "vamos encerrar", "finalizando sessão", "até a próxima" ou similar.
---

# Protocolo de Fim de Sessão

**Objetivo:** Documentar tudo o que foi feito, garantindo que a próxima sessão inicie
com contexto completo e sem retrabalho.

## Passos

### 1. Consolidar Mudanças
```bash
# Listar todos os arquivos modificados na sessão
git diff --name-only HEAD
git status
```

### 2. Executar Validações Finais
- [ ] Executar linter: `npm run lint`
- [ ] Verificar se não há `console.log` de debug esquecidos
- [ ] Confirmar que nenhum segredo foi exposto (grep por `api_key`, `password`, `secret` em arquivos novos)
- [ ] Acionar subagente de navegador para screenshot final do estado da UI (se houve mudanças visuais)

### 3. Gerar o Report de Sessão
Criar o arquivo `docs/session-reports/YYYY-MM-DD.md` usando o template de
`@.agent/rules/05-session-protocol.md`.

Preencher todos os campos:
- Missão da sessão (copiar do briefing inicial)
- Status final: COMPLETO / PARCIAL / BLOQUEADO
- Arquivos modificados (da lista do git)
- Decisões técnicas tomadas (com justificativas)
- Artefatos gerados (checklist)
- Testes executados
- Bloqueadores encontrados
- **Próximos Passos** (mínimo 2 itens concretos para a próxima sessão)

### 4. Apresentar ao Arquiteto para Aprovação
Exibir o report gerado e aguardar a aprovação de Claude Code.

### 5. Commit do Report (se aprovado)
```bash
git add docs/session-reports/
git commit -m "docs(session): report YYYY-MM-DD — [resumo em uma linha]"
```

## Restrições
- O report DEVE existir antes de encerrar a sessão
- Não commitar código não aprovado junto com o report
- Se há código sem teste e sem aprovação, marcar como PARCIAL com nota explícita
