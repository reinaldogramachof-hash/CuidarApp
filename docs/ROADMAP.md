# Roadmap — CuidarApp

## Visão geral

Este roadmap organiza a evolução do CuidarApp de protótipo visual para MVP funcional, depois para validação comercial e, por fim, para uma plataforma mais robusta de cuidado domiciliar.

## Fase 0 — Fundação do produto

**Objetivo:** alinhar estratégia, documentação e base técnica.

### Entregas

- Atualizar README com visão de produto.
- Documentar visão, MVP, backlog e validação.
- Revisar nome do projeto no `package.json`.
- Definir arquitetura inicial.
- Separar dados mockados de componentes visuais.
- Definir modelo básico de dados.
- Preparar deploy na Vercel.
- Remover dependências fora do MVP inicial.

### Resultado esperado

Projeto deixa de parecer template e passa a comunicar claramente produto, público, proposta de valor e próximos passos.

---

## Fase 1 — MVP funcional

**Objetivo:** transformar o protótipo em um fluxo funcional mínimo para familiar e cuidador.

### Entregas

#### Perfil familiar

- Cadastro/login.
- Tela inicial com paciente vinculado.
- Linha do tempo do dia.
- Visualização de alertas.
- Visualização do relatório diário.

#### Perfil cuidador

- Cadastro/login.
- Lista de pacientes vinculados.
- Check-in e check-out.
- Registro rápido de atividade.
- Registro de medicação.
- Registro de ocorrência.

#### Paciente

- Cadastro básico.
- Dados essenciais.
- Rotina do dia.
- Histórico de atividades.

#### Relatório diário

- Resumo automático baseado nos registros.
- Atividades realizadas.
- Medicações.
- Ocorrências.
- Observações.

### Resultado esperado

Uma família e um cuidador conseguem usar o produto em uma rotina real de teste.

---

## Roadmap operacional dos perfis

### Sprint 1 — Experiência visual por perfil

**Objetivo:** separar a experiência de Familiar e Cuidador usando dados mockados e estado local.

Entregas:

- Seletor de perfil Familiar/Cuidador.
- Painel Familiar com status, linha do dia, alertas e relatório.
- Painel Cuidador com paciente do turno, check-in, check-out e registro rápido.
- Registros feitos pelo cuidador refletindo na linha do tempo do familiar.
- Ocorrência simulada gerando alerta visual.

Critério de sucesso:

- O fluxo `cuidador registra → familiar acompanha` é compreensível sem explicação técnica.

### Sprint 2 — Fluxo Cuidador operacional

**Objetivo:** reduzir fricção do cuidador no registro da rotina.

Entregas:

- Check-in/check-out com estado do turno.
- Registro rápido por tipo: refeição, higiene, medicação, sinais vitais, mobilidade, observação e ocorrência.
- Confirmação de medicação pendente.
- Ocorrência com gravidade.
- Lista de pendências do turno.

Critério de sucesso:

- Uma atividade comum pode ser registrada em até 3 interações.

### Sprint 3 — Fluxo Familiar integrado

**Objetivo:** mostrar valor para a família a partir dos registros do cuidador.

Entregas:

- Linha do dia filtrável.
- Cartões de status do paciente.
- Alertas derivados de ocorrência e medicação atrasada.
- Relatório diário gerado a partir dos registros simulados.
- Tela de saúde com medicações e sinais vitais.

Critério de sucesso:

- O familiar entende o status do cuidado em poucos segundos.

### Sprint 4 — Autenticação e persistência

**Objetivo:** substituir mock/local state por dados reais.

Entregas:

- Escolha e configuração do BaaS.
- Autenticação de familiar e cuidador.
- Cadastro de paciente.
- Vínculo familiar-cuidador-paciente.
- Persistência de atividades, medicações, ocorrências, alertas e relatório.
- Regras básicas de permissão.

Critério de sucesso:

- Duas contas reais conseguem simular uma rotina de cuidado em produção.

---

## Fase 2 — Piloto com usuários reais

**Objetivo:** validar valor, usabilidade e disposição de pagamento.

### Entregas

- Selecionar 3 a 5 famílias.
- Selecionar 3 a 5 cuidadores autônomos.
- Rodar piloto controlado.
- Medir uso diário.
- Coletar feedback qualitativo.
- Testar preço inicial.
- Ajustar notificações e relatório.

### Métricas

- Familiar abre o app diariamente.
- Cuidador registra atividades todos os dias.
- Redução de mensagens no WhatsApp.
- Relatório diário é entendido sem explicação.
- Usuário demonstra intenção real de pagar.

### Resultado esperado

Evidência de que o produto resolve uma dor real e pode ser monetizado.

---

## Fase 3 — Produto pagável

**Objetivo:** preparar o CuidarApp para cobrança simples e uso contínuo.

### Entregas

- Planos de assinatura.
- Página de preços.
- Onboarding melhorado.
- Gestão de assinatura manual ou semi-automatizada.
- Melhorias de segurança.
- Termos de uso e política de privacidade.
- Ajustes LGPD.
- Exportação de relatório.

### Possíveis planos

#### Família

- 1 paciente.
- 1 ou mais cuidadores.
- Relatório diário.
- Alertas.

#### Cuidador Profissional

- Múltiplos pacientes.
- Relatórios por paciente.
- Histórico de atendimentos.
- Perfil profissional.

### Resultado esperado

Produto pronto para primeiros clientes pagantes.

---

## Fase 4 — Expansão para cuidadores e pequenos negócios

**Objetivo:** ampliar de uso individual para gestão leve.

### Entregas

- Painel para cuidador com múltiplos pacientes.
- Agenda semanal.
- Histórico por paciente.
- Relatórios semanais.
- Convite de familiares.
- Controle de permissões.
- Recursos para pequenos times.

### Resultado esperado

Produto passa a atender cuidadores profissionais e pequenos prestadores de serviço.

---

## Fase 5 — Plataforma para home care

**Objetivo:** evoluir para gestão B2B.

### Entregas

- Gestão de equipe.
- Gestão de pacientes.
- Escalas.
- Dashboard administrativo.
- Relatórios gerenciais.
- Auditoria de registros.
- Perfis e permissões avançadas.
- Indicadores de qualidade do cuidado.

### Resultado esperado

CuidarApp se torna uma plataforma de gestão para empresas de cuidado domiciliar.

---

## Fase 6 — Inteligência artificial

**Objetivo:** adicionar IA apenas depois de validar o fluxo básico e acumular dados úteis.

### Possíveis recursos

- Resumo diário automático melhorado.
- Resumo semanal.
- Organização de anotações livres.
- Detecção de padrões de risco.
- Sugestões de perguntas para consulta médica.
- Destaque de mudanças na rotina.

### Regra estratégica

IA deve aumentar valor percebido, não substituir o fluxo central do cuidador.

---

## Priorização resumida

| Fase | Foco | Prioridade |
|---|---|---|
| 0 | Documentação, fundação e deploy | Alta |
| 1 | MVP funcional | Alta |
| 2 | Piloto real | Alta |
| 3 | Produto pagável | Média/Alta |
| 4 | Cuidadores profissionais | Média |
| 5 | Home care B2B | Média/Futura |
| 6 | IA | Futura |

## Próximo marco recomendado

Implementar a Fase 1 com foco em:

1. seletor de perfil;
2. experiência familiar;
3. experiência cuidador;
4. check-in/check-out;
5. registro rápido;
6. reflexo dos registros na linha do tempo;
7. relatório diário simples.
