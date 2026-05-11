# Backlog — CuidarApp

Este backlog organiza as principais histórias de usuário do MVP e das fases seguintes.

## Convenções

Prioridade:

- P0: essencial para MVP.
- P1: importante após fluxo básico.
- P2: melhoria futura.

Status sugeridos:

- A fazer.
- Em andamento.
- Em validação.
- Concluído.

---

## Épico 1 — Autenticação e perfis

### US-001 — Criar conta como familiar

**Como** familiar responsável,  
**quero** criar minha conta,  
**para** acompanhar a rotina de cuidado do paciente.

Prioridade: P0

Critérios de aceite:

- Usuário informa nome, e-mail e senha.
- Perfil é marcado como familiar.
- Usuário consegue acessar o painel após cadastro.

### US-002 — Criar conta como cuidador

**Como** cuidador,  
**quero** criar minha conta profissional,  
**para** registrar atividades dos pacientes que acompanho.

Prioridade: P0

Critérios de aceite:

- Usuário informa nome, e-mail e senha.
- Perfil é marcado como cuidador.
- Usuário consegue acessar a área do cuidador.

### US-003 — Login

**Como** usuário cadastrado,  
**quero** entrar na minha conta,  
**para** acessar meus pacientes e registros.

Prioridade: P0

---

## Épico 2 — Paciente

### US-004 — Cadastrar paciente

**Como** familiar,  
**quero** cadastrar um paciente,  
**para** centralizar as informações de cuidado.

Prioridade: P0

Campos mínimos:

- Nome.
- Idade ou data de nascimento.
- Condições principais.
- Observações.
- Contato de emergência.

### US-005 — Visualizar perfil do paciente

**Como** familiar ou cuidador autorizado,  
**quero** visualizar dados essenciais do paciente,  
**para** entender rapidamente o contexto do cuidado.

Prioridade: P0

---

## Épico 3 — Vínculo entre familiar, cuidador e paciente

### US-006 — Convidar cuidador

**Como** familiar,  
**quero** convidar um cuidador para acompanhar um paciente,  
**para** que ele possa registrar atividades.

Prioridade: P0

### US-007 — Aceitar vínculo com paciente

**Como** cuidador,  
**quero** aceitar um convite de cuidado,  
**para** registrar informações daquele paciente.

Prioridade: P0

---

## Épico 4 — Check-in e check-out

### US-008 — Registrar check-in

**Como** cuidador,  
**quero** registrar minha chegada,  
**para** que a família saiba que o cuidado começou.

Prioridade: P0

Critérios de aceite:

- Registro salva data e horário.
- Familiar visualiza status de presença.
- Registro aparece na linha do tempo.

### US-009 — Registrar check-out

**Como** cuidador,  
**quero** registrar minha saída,  
**para** encerrar o período de cuidado.

Prioridade: P0

### US-010 — Alertar check-in atrasado

**Como** familiar,  
**quero** receber alerta se o cuidador não fizer check-in no horário previsto,  
**para** agir rapidamente.

Prioridade: P1

---

## Épico 5 — Registro de atividades

### US-011 — Registro rápido de atividade

**Como** cuidador,  
**quero** registrar atividades com botões rápidos,  
**para** não perder tempo durante o cuidado.

Prioridade: P0

Tipos iniciais:

- Refeição.
- Higiene.
- Medicação.
- Sinais vitais.
- Mobilidade.
- Observação.
- Ocorrência.

### US-012 — Registro detalhado opcional

**Como** cuidador,  
**quero** adicionar detalhes quando necessário,  
**para** explicar melhor uma atividade ou ocorrência.

Prioridade: P1

---

## Épico 6 — Medicação

### US-013 — Cadastrar medicação do paciente

**Como** familiar,  
**quero** cadastrar medicações e horários,  
**para** acompanhar se foram administradas corretamente.

Prioridade: P0

### US-014 — Confirmar medicação administrada

**Como** cuidador,  
**quero** confirmar que uma medicação foi administrada,  
**para** manter a família informada.

Prioridade: P0

### US-015 — Alertar medicação atrasada

**Como** familiar,  
**quero** receber alerta de medicação atrasada,  
**para** evitar falhas importantes no cuidado.

Prioridade: P1

---

## Épico 7 — Ocorrências

### US-016 — Registrar ocorrência

**Como** cuidador,  
**quero** registrar uma ocorrência,  
**para** comunicar algo importante à família.

Prioridade: P0

Tipos sugeridos:

- Queda.
- Dor.
- Recusa alimentar.
- Alteração de comportamento.
- Mal-estar.
- Outro.

### US-017 — Definir gravidade da ocorrência

**Como** cuidador,  
**quero** indicar a gravidade da ocorrência,  
**para** orientar a urgência do alerta.

Prioridade: P1

---

## Épico 8 — Linha do tempo

### US-018 — Visualizar linha do tempo diária

**Como** familiar,  
**quero** ver uma linha do tempo do dia,  
**para** entender rapidamente o que aconteceu.

Prioridade: P0

### US-019 — Filtrar linha do tempo

**Como** familiar,  
**quero** filtrar registros por tipo,  
**para** encontrar informações específicas.

Prioridade: P2

---

## Épico 9 — Notificações e alertas

### US-020 — Receber notificação por atividade registrada

**Como** familiar,  
**quero** receber notificação quando o cuidador registrar uma atividade,  
**para** acompanhar a rotina em tempo real.

Prioridade: P1

### US-021 — Receber alerta de ocorrência

**Como** familiar,  
**quero** receber alerta quando houver ocorrência,  
**para** tomar providências se necessário.

Prioridade: P0

### US-022 — Configurar intensidade das notificações

**Como** familiar,  
**quero** escolher o nível de notificações,  
**para** evitar excesso de alertas.

Prioridade: P2

---

## Épico 10 — Relatório diário

### US-023 — Gerar relatório diário

**Como** familiar,  
**quero** receber um resumo diário,  
**para** acompanhar o cuidado sem precisar ler todos os registros.

Prioridade: P0

Conteúdo mínimo:

- Check-in e check-out.
- Atividades realizadas.
- Medicações administradas.
- Pendências.
- Ocorrências.
- Observações.

### US-024 — Compartilhar relatório

**Como** familiar,  
**quero** compartilhar o relatório,  
**para** enviar informações a outro responsável.

Prioridade: P1

---

## Épico 11 — Validação e monetização

### US-025 — Página de planos simples

**Como** potencial cliente,  
**quero** entender os planos disponíveis,  
**para** decidir se quero pagar pelo CuidarApp.

Prioridade: P1

### US-026 — Coletar interesse de pagamento

**Como** fundador,  
**quero** registrar intenção de pagamento dos usuários do piloto,  
**para** validar monetização.

Prioridade: P1

---

## Épico 12 — Futuro: IA

### US-027 — Resumo diário com IA

**Como** familiar,  
**quero** receber um resumo inteligente do dia,  
**para** entender rapidamente os pontos importantes.

Prioridade: P2

### US-028 — Organização de anotações com IA

**Como** cuidador,  
**quero** escrever uma observação livre e ter ajuda para organizá-la,  
**para** economizar tempo.

Prioridade: P2

---

## Backlog técnico inicial

- Renomear projeto no `package.json`.
- Separar componentes por tela.
- Criar estrutura de rotas.
- Definir tipos TypeScript.
- Remover mock hardcoded progressivamente.
- Criar camada de dados.
- Escolher backend/BaaS.
- Criar autenticação.
- Criar persistência de pacientes, usuários e registros.
- Criar regras básicas de permissão.
- Preparar ambiente de deploy.
- Adicionar documentação de variáveis de ambiente.
- Avaliar LGPD e segurança desde o início.
