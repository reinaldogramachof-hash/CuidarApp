# Protocolo de Sessão de Desenvolvimento

**Escopo:** Ativado no início e fim de cada sessão de desenvolvimento

## Filosofia
Cada sessão é um "Sprint Micro". Começa com contexto claro, termina com evidência documentada.
O Report de Sessão é o artefato principal — rastreia o que foi feito, o que está pendente e
quais decisões foram tomadas.

---

## INÍCIO DE SESSÃO — Checklist do Arquiteto (Claude Code)

### Passo 1: Carregar Contexto
- Ler o último Report de Sessão em `docs/session-reports/`
- Verificar pendências da sessão anterior (campo "Bloqueadores" e "Próximos Passos")
- Confirmar estado atual do repositório

### Passo 2: Definir Missão da Sessão
O Arquiteto define claramente:
```
MISSÃO DA SESSÃO [DATA]:
Objetivo: <o que será alcançado ao final desta sessão>
Escopo: <arquivos/módulos que serão tocados>
Fora do Escopo: <o que NÃO será modificado nesta sessão>
Critério de Sucesso: <como saberemos que a missão foi cumprida>
Agente Responsável: Antigravity
```

### Passo 3: Briefing ao Antigravity
Transmitir a missão usando o template Papel + Contexto + Diretiva + Restrições + Verificação
(ver `.agent/rules/03-coding-standards.md` e o Meta-Prompt de inicialização abaixo).

### Meta-Prompt de Inicialização para Antigravity
```
Atue como Agente de Execução do projeto CuidarApp.
Arquiteto responsável: Claude Code.

Para cada tarefa que receber, NÃO comece a codificar imediatamente. Siga:
1. LOCALIZE os arquivos relevantes usando @referência explícita
2. PLANEJE e gere um Plano de Implementação listando efeitos colaterais
3. VERIFIQUE conformidade com @.agent/rules/
4. AGUARDE aprovação do Arquiteto (Claude Code)
5. EXECUTE apenas após aprovação
6. GERE o Walkthrough ao final com evidências

Comece lendo @CLAUDE.md e @.agent/rules/ para carregar o contexto do projeto.
```

---

## FIM DE SESSÃO — Checklist do Agente de Execução (Antigravity)

### Passo 1: Consolidar Artefatos
- Listar todos os arquivos modificados
- Confirmar que todos os testes passaram
- Confirmar que não há secrets expostos

### Passo 2: Gerar o Report de Sessão
O Antigravity gera o arquivo `docs/session-reports/YYYY-MM-DD.md` com o template abaixo.

### Passo 3: Validação Final do Arquiteto
Claude Code lê o report, valida as decisões e assina com `[APROVADO: Claude Code]` ou
`[REVISAR: <motivo>]`.

---

## Template de Report de Sessão

```markdown
# Report de Sessão — [DATA]

## Missão
[Objetivo definido no início da sessão]

## Status: [COMPLETO | PARCIAL | BLOQUEADO]

## O Que Foi Feito
### Arquivos Modificados
- `src/...` — [descrição da mudança]

### Decisões Técnicas Tomadas
1. [Decisão] — Motivo: [justificativa]

### Artefatos Gerados
- [ ] Task List
- [ ] Plano de Implementação
- [ ] Walkthrough
- [ ] Screenshots de Validação UI

## Testes
- [ ] Testes unitários passando
- [ ] Validação visual (Antigravity Browser Agent)
- [ ] Sem regressões detectadas

## Bloqueadores / Impedimentos
- [Se houver, descrever o bloqueador e o que é necessário para desbloquear]

## Próximos Passos (Para a Próxima Sessão)
1. [Tarefa específica]

## Aprovação do Arquiteto
[ ] APROVADO: Claude Code
[ ] REVISAR: _______________

---
Agente de Execução: Google Antigravity
Arquiteto: Claude Code
```

---

## Regras de Comunicação entre Agentes

| Situação | Antigravity deve... |
|---|---|
| Plano de implementação pronto | Apresentar ao Arquiteto e aguardar OK |
| Encontrar arquivo não mapeado | Reportar ao Arquiteto antes de modificar |
| Comando destrutivo necessário | PARAR e pedir confirmação explícita |
| Bloqueador técnico | Descrever o erro e aguardar orientação |
| Secret hardcoded encontrado | PARAR imediatamente e alertar o Arquiteto |
| Loop de execução detectado (3+ tentativas) | Parar, reportar abordagem diferente |
