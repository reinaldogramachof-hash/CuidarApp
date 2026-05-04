# CuidarApp — Roadmap Técnico e Estratégico Completo

> **Versão:** 1.0 — Maio 2026
> **Autor:** Reinaldo Gramacho F. (Fundador) + Claude Code (Arquiteto de Sistema)
> **Status:** Documento vivo — atualizar a cada ciclo de decisão

---

## Sumário

1. [Identidade e Visão do Produto](#1-identidade-e-visão-do-produto)
2. [Mercado e Oportunidade](#2-mercado-e-oportunidade)
3. [Segmentos de Cliente](#3-segmentos-de-cliente)
4. [Modelo de Negócio](#4-modelo-de-negócio)
5. [Módulos do Produto — Especificação Completa](#5-módulos-do-produto--especificação-completa)
6. [Roadmap de Desenvolvimento — 3 Fases](#6-roadmap-de-desenvolvimento--3-fases)
7. [Arquitetura Técnica Expandida](#7-arquitetura-técnica-expandida)
8. [Schema de Banco — Expansão Planejada](#8-schema-de-banco--expansão-planejada)
9. [Go-to-Market e Parcerias Estratégicas](#9-go-to-market-e-parcerias-estratégicas)
10. [KPIs e Métricas de Sucesso](#10-kpis-e-métricas-de-sucesso)
11. [Riscos e Mitigações](#11-riscos-e-mitigações)

---

## 1. Identidade e Visão do Produto

### O que é o CuidarApp

O **CuidarApp** é uma plataforma SaaS vertical de gestão de cuidados de saúde que conecta três universos em um só ecossistema digital:

- **Profissionais de saúde** (cuidadores, enfermeiros, médicos, fisioterapeutas, terapeutas ocupacionais, nutricionistas)
- **Clínicas, residenciais e redes de home care**
- **Famílias** de pacientes que precisam de visibilidade e tranquilidade

### Missão

> Tornar o cuidado de saúde domiciliar e residencial rastreável, humano e acessível — do profissional autônomo que atende 5 pacientes até a rede com centenas de unidades.

### Visão de 5 Anos

Ser a plataforma de referência para gestão de cuidados de saúde no Brasil, com presença em todas as UFs, integrando o maior marketplace de profissionais de cuidado do país e habilitando novos braços de negócio para redes residenciais.

### Diferenciais Estratégicos

| Diferencial | Por que importa |
|---|---|
| **Escala solo → enterprise sem troca de sistema** | Nenhum concorrente cobre esse espectro com boa UX |
| **Portal familiar nativo** | Família informada = cliente satisfeito = retenção |
| **LGPD by design** | Supabase RLS + audit log desde a primeira linha de código |
| **Mobile-first + PWA offline** | Funciona no campo sem internet, instalável como app nativo |
| **Marketplace bidirecional integrado** | Família acha profissional; profissional acha cliente |
| **Rastreabilidade clínica completa** | Da prescrição à administração, tudo auditável |

---

## 2. Mercado e Oportunidade

### Contexto Demográfico

- Brasil tem **35 milhões** de pessoas com 60+ anos em 2024 → projetado **50 milhões** em 2030
- O mercado de home care cresce **18% ao ano** no Brasil (dados ABRAMAN/IBGE)
- Déficit estimado de **400.000 cuidadores** profissionais qualificados

### Tamanho de Mercado Endereçável

| Segmento | Estimativa Brasil | Penetração 5% | MRR (5% penetração) |
|---|---|---|---|
| Profissionais autônomos | ~120.000 | 6.000 usuários | R$ 474.000 |
| Micro equipes / home care | ~15.000 | 750 clientes | R$ 187.000 |
| Clínicas / residenciais | ~5.000 | 250 clientes | R$ 162.000 |
| Redes / Enterprise | ~200 | 10 contratos | R$ 30.000 |
| **Total** | | | **~R$ 853.000/mês** |

5% de penetração = **~R$ 10M ARR** — realista em 3–4 anos com execução focada.

### Concorrência e Vácuo de Mercado

```
COMPLEXIDADE ALTA ←───────────────────────────────→ COMPLEXIDADE BAIXA
CUSTO ALTO                                              CUSTO BAIXO

[MV / Tasy / Philips]          [GAP]           [WhatsApp / Planilha]
Hospitais grandes          ← CuidarApp →        Solo sem estrutura
R$5.000+/mês                                    R$0 (sem valor)
```

O CuidarApp ocupa o espaço entre os sistemas hospitalares caros/complexos e as soluções improvisadas (WhatsApp, papel, planilha).

---

## 3. Segmentos de Cliente

### Espectro de Personas

```
SOLO ──────────────────────────────────────────────── ENTERPRISE
  │                    │                   │                │
Autônomo          Micro Equipe          Clínica         Rede
1 profissional     2–8 profissionais    9–50 prof.      50+ / multi-unidade
1–5 pacientes      5–40 pacientes       40–300 pac.     300+ pacientes
```

### Persona 1 — Profissional Autônomo

**Quem é:** Cuidador, técnico de enfermagem ou enfermeiro que trabalha de forma independente, atende pacientes em domicílio, normalmente tem 2–8 pacientes simultâneos.

**Dor principal:** "Perco 2h por dia em WhatsApp com família, não tenho registro formal do que faço e não consigo comprovar qualidade para novos clientes."

**O que o CuidarApp resolve:**
- Organização de turnos e registros em um lugar
- Portal familiar que substitui atualizações manuais por WhatsApp
- Perfil público profissional que gera credibilidade e novos clientes via marketplace

---

### Persona 2 — Gestor de Home Care (Micro Equipe)

**Quem é:** Empreendedor de saúde que montou uma equipe pequena de cuidadores, presta serviço domiciliar, frequentemente ex-profissional autônomo que cresceu.

**Dor principal:** "Não consigo enxergar o que minha equipe fez hoje, fico dependendo de ligação ou WhatsApp de grupo. Quando um cliente reclama, não tenho como provar o que foi feito."

**O que o CuidarApp resolve:**
- Dashboard gerencial em tempo real
- Plano de Cuidados prescrito com checklist (cuidador sabe exatamente o que fazer)
- Relatório automático para família e para auditoria

---

### Persona 3 — Diretora/Coordenadora de Clínica ou Residencial

**Quem é:** Gestora de uma clínica de médio porte, residencial sênior ou clínica-dia. Gerencia equipe multiprofissional (médico, enfermeiro, fisio, TO, nutricionista, cuidadores).

**Dor principal:** "Meu sistema atual é um ERP hospitalar caro e ninguém da equipe sabe usar. Os cuidadores anotam em papel. A família liga toda hora perguntando como está o paciente."

**O que o CuidarApp resolve:**
- Sistema mobile-first que a equipe realmente usa
- Prontuário eletrônico com evoluções multiprofissionais
- Portal familiar que elimina 80% das ligações
- Relatórios de compliance para COREN/ANVISA

---

### Persona 4 — Diretor de Rede / Enterprise

**Quem é:** Diretor de operações de uma rede de residenciais (ex: Terça da Serra), operadora de saúde ou franqueadora de home care. Precisa de visibilidade centralizada de múltiplas unidades.

**Dor principal:** "Tenho 30 unidades e cada uma usa um sistema diferente. Não consigo padronizar protocolos nem ver indicadores consolidados."

**O que o CuidarApp resolve:**
- Painel multi-unidade com BI centralizado
- Protocolos e planos de cuidado padronizados pela rede
- Opção white-label para manter identidade da marca
- API para integração com ERPs e sistemas legados

---

### Persona 5 — Familiar (Usuário Final, não pagante)

**Quem é:** Filho/filha adulto(a) de um idoso que está sob cuidado profissional. Mora longe ou trabalha e não consegue acompanhar presencialmente.

**Dor principal:** "Não sei o que aconteceu com meu pai/minha mãe hoje. Preciso ligar para o cuidador toda hora e me sinto péssimo por não estar presente."

**O que o CuidarApp resolve:**
- Visibilidade em tempo real: sinais vitais, eventos do dia, medicações administradas
- Alertas inteligentes quando algo foge do padrão
- Canal de comunicação direto com a equipe de cuidado

---

## 4. Modelo de Negócio

### Planos SaaS

#### PLANO SOLO — Gratuito
**Estratégia:** Isca de aquisição. Remove toda barreira de entrada.

| Recurso | Limite |
|---|---|
| Profissionais | 1 |
| Pacientes ativos | 5 |
| Turnos e registros de eventos | Ilimitado |
| Sinais vitais | Ilimitado |
| Portal familiar básico | Incluído |
| Relatório PDF | 3/mês |
| Perfil no Marketplace | Básico (sem destaque) |
| Suporte | Comunidade |

---

#### PLANO PROFISSIONAL — R$ 79/mês
**Público:** Profissional autônomo estabelecido com carteira crescente.

Tudo do Solo, mais:

| Recurso | Limite |
|---|---|
| Pacientes ativos | 20 |
| Prontuário básico | Diagnósticos, alergias |
| Gestão de medicamentos | Prescrição + checklist de administração |
| Relatório PDF | Ilimitado |
| Portal familiar completo | Com chat básico |
| Perfil no Marketplace | Destacado com avaliações |
| Suporte | E-mail (48h) |

---

#### PLANO EQUIPE — R$ 249/mês
**Público:** Home care de pequeno porte, micro clínica, clínica-dia.

Tudo do Profissional, mais:

| Recurso | Limite |
|---|---|
| Profissionais | 10 |
| Pacientes ativos | 80 |
| Plano de Cuidados prescrito | Com checklist e progresso |
| Agenda multiprofissional | Incluída |
| Escalas clínicas | Barthel, Braden, Mini-Mental |
| Alertas de medicação não administrada | Incluído |
| Registro de ocorrências/incidentes | Incluído |
| Suporte | Chat (24h) |

---

#### PLANO CLÍNICA — R$ 649/mês
**Público:** Residencial sênior, clínica de médio porte, home care estabelecido.

Tudo do Equipe, mais:

| Recurso | Limite |
|---|---|
| Profissionais | Ilimitados |
| Pacientes ativos | 300 |
| Prontuário eletrônico completo | Com evoluções multiprofissionais |
| Assinatura digital | COREN/CRM |
| Gestão de quartos/leitos | Incluída |
| Gestão de contratos e modalidades | Permanente/Diurno/Temporário |
| Relatórios de compliance | ANVISA, COREN |
| BI da clínica | Painel de indicadores |
| Suporte | Prioritário (4h) |

---

#### PLANO REDE — Sob Consulta (R$ 1.800–12.000/mês)
**Público:** Redes nacionais, franqueadoras, operadoras de saúde.

Tudo do Clínica, mais:

| Recurso | Descrição |
|---|---|
| Multi-unidade | Gestão centralizada de N unidades |
| White-label | Plataforma sob marca do cliente |
| BI centralizado | Indicadores consolidados de toda a rede |
| API pública | Integração com ERPs e sistemas legados |
| Protocolos padronizados | Templates de Plano de Cuidados por rede |
| SLA contratual | Uptime 99,9%, suporte dedicado |
| Onboarding | Treinamento presencial ou online da equipe |

---

### Fontes de Receita Adicionais

#### Marketplace — Comissão de Conexão
- Família publica necessidade ou busca profissional na plataforma
- Profissional aceita a contratação via CuidarApp
- **Comissão:** 12% do primeiro mês do contrato (só na primeira conexão)
- Profissionais do plano Solo têm visibilidade básica; planos pagos têm destaque e mais conversões

#### White-label
- Rede licencia a plataforma sob sua própria marca
- Setup: R$ 5.000–25.000 (único, cobre customização)
- Mensalidade: negociada conforme volume de usuários e unidades

#### Dados Epidemiológicos Anonimizados (Futuro — Fase 3+)
- Relatórios agregados e anonimizados para operadoras de saúde, planos, pesquisadores
- LGPD-compliant: dados sempre anonimizados e sem identificação individual
- Fonte de receita B2B de alto valor sem custo de aquisição adicional

---

### Projeção de MRR — 18 Meses

| Marco | Mês | MRR Estimado |
|---|---|---|
| 20 usuários Solo → 5 convertem para Profissional | 3 | R$ 395 |
| 50 Profissional + 5 Equipe + 1 Clínica piloto | 6 | R$ 6.594 |
| 150 Profissional + 20 Equipe + 5 Clínica | 12 | R$ 18.595 |
| 300 Profissional + 50 Equipe + 15 Clínica + 1 Rede | 18 | R$ 43.035 |

---

## 5. Módulos do Produto — Especificação Completa

### Mapa de Módulos por Plano

```
                              SOLO   PROF   EQUIPE  CLÍNICA  REDE
──────────────────────────────────────────────────────────────────
CORE
  Autenticação & Perfis         ✓      ✓       ✓       ✓       ✓
  Gestão de Pacientes           ✓      ✓       ✓       ✓       ✓
  Turnos & Check-in/out         ✓      ✓       ✓       ✓       ✓
  Registro de Eventos           ✓      ✓       ✓       ✓       ✓
  Sinais Vitais                 ✓      ✓       ✓       ✓       ✓
  Portal Familiar Básico        ✓      ✓       ✓       ✓       ✓

CLÍNICO
  Prontuário Básico             —      ✓       ✓       ✓       ✓
  Gestão de Medicamentos        —      ✓       ✓       ✓       ✓
  Plano de Cuidados             —      —       ✓       ✓       ✓
  Escalas Clínicas              —      —       ✓       ✓       ✓
  Prontuário Completo           —      —       —       ✓       ✓
  Evoluções Multiprofissionais  —      —       —       ✓       ✓
  Assinatura Digital            —      —       —       ✓       ✓

EQUIPE & AGENDA
  Múltiplos Profissionais       —      —       ✓       ✓       ✓
  Agenda Multiprofissional      —      —       ✓       ✓       ✓
  Controle de Ponto             —      —       ✓       ✓       ✓
  Perfis Especializados*        —      —       —       ✓       ✓

FAMÍLIA & COMUNICAÇÃO
  Portal Completo               —      ✓       ✓       ✓       ✓
  Chat Família-Equipe           —      ✓       ✓       ✓       ✓
  Relatório PDF Automático      —      ✓       ✓       ✓       ✓
  Gestão de Visitas             —      —       —       ✓       ✓

OPERACIONAL
  Registro de Ocorrências       —      —       ✓       ✓       ✓
  Gestão de Quartos/Leitos      —      —       —       ✓       ✓
  Contratos e Modalidades       —      —       —       ✓       ✓
  Admissão e Triagem            —      —       —       ✓       ✓

COMPLIANCE & BI
  Relatórios ANVISA/COREN       —      —       —       ✓       ✓
  BI da Unidade                 —      —       —       ✓       ✓
  Auditoria e Logs              —      —       —       ✓       ✓

ENTERPRISE
  Multi-unidade                 —      —       —       —       ✓
  BI Centralizado               —      —       —       —       ✓
  White-label                   —      —       —       —       ✓
  API Pública                   —      —       —       —       ✓

MARKETPLACE
  Perfil Público Básico         ✓      —       —       —       —
  Perfil Destacado              —      ✓       ✓       ✓       ✓
  Busca de Profissionais        ✓      ✓       ✓       ✓       ✓
  Conexão com Comissão          —      ✓       ✓       ✓       ✓
```
*Perfis: médico, enfermeiro, fisioterapeuta, terapeuta ocupacional, nutricionista, psicólogo

---

### Detalhamento dos Módulos Prioritários

#### Módulo: Prontuário Eletrônico do Paciente (PEP)

**Objetivo:** Centralizar o histórico clínico completo do paciente.

**Campos:**
- Dados pessoais (nome, CPF, data de nascimento, foto, contatos)
- Modalidade de cuidado (domiciliar / diurno / permanente)
- Diagnósticos (CID-10, texto livre)
- Alergias e intolerâncias (medicamento/alimento) com grau de severidade
- Medicamentos ativos (nome, dosagem, frequência, via, início/fim, prescritor)
- Histórico de internações e cirurgias
- Contatos de emergência e médico de referência
- Plano de saúde e dados de cobertura
- Observações clínicas gerais

**Fluxo de acesso por role:**
- Admin/Clínica: leitura e escrita completa
- Médico: leitura e escrita de evolução médica
- Enfermeiro: leitura e escrita de evolução de enfermagem
- Fisio/TO/Nutri: leitura e escrita da sua especialidade
- Cuidador: leitura do resumo operacional (alergias, medicamentos, plano de cuidados)
- Familiar: leitura do resumo simplificado (sem dados clínicos técnicos)

---

#### Módulo: Gestão de Medicamentos

**Objetivo:** Fechar o ciclo de segurança: prescrição → administração → alerta de não-administrado.

**Sub-fluxos:**

1. **Prescrição** (médico/enfermeiro)
   - Seleciona medicamento da base (ANVISA/RENAME)
   - Define dosagem, via (oral/EV/IM/SC/tópica), frequência, horários
   - Define período (início → fim ou uso contínuo)
   - Assina digitalmente

2. **Checklist de Administração** (cuidador)
   - Na tela do turno: lista de medicações pendentes com horário
   - Cuidador marca como "administrado" com foto opcional do medicamento
   - Registro imutável com timestamp e ID do cuidador

3. **Alertas de Não-Administração**
   - Se horário passou e não foi registrado: alerta para cuidador (push)
   - Se cuidador não responde em 15 min: alerta para enfermeiro responsável
   - Se persiste: alerta para familiar e gestor

4. **Histórico de Administrações**
   - Relatório completo: quem administrou, quando, qual medicamento, qual dose
   - Exportável para PDF

**Regra crítica de segurança:** O sistema registra, nunca prescreve. A prescrição sempre parte de profissional habilitado (médico ou enfermeiro com CRM/COREN). O CuidarApp não tem responsabilidade clínica sobre prescrições.

---

#### Módulo: Plano de Cuidados Individualizado (PCI)

**Objetivo:** Transformar o cuidador de "registrador de eventos" em "executor de protocolo prescrito".

**Fluxo:**
1. Enfermeiro/médico cria o PCI com tarefas e frequências
2. Sistema gera automaticamente o checklist do turno do cuidador
3. Cuidador vê as tarefas na ordem certa, marca como concluídas
4. Progresso visível em tempo real para a família e para o gestor

**Tipos de tarefa:**
- Higiene (banho, higiene oral, cuidado de pele)
- Alimentação (refeição, hidratação, consistência da dieta)
- Mobilização (reposicionamento, transferência, deambulação)
- Medicação (delega ao módulo de medicamentos)
- Sinais vitais (com frequência prescrita)
- Curativos e procedimentos
- Estimulação cognitiva / atividade prescrita
- Tarefa livre (texto)

**Frequências possíveis:** Diária / Por turno / Semanal (dias específicos) / Mensal / Único

---

#### Módulo: Escalas Clínicas

**Objetivo:** Avaliações clínicas padronizadas e validadas, com histórico de evolução.

**Escalas incluídas:**

| Escala | Avalia | Periodicidade Sugerida |
|---|---|---|
| **Barthel** | Independência funcional nas AVDs | Mensal |
| **Braden** | Risco de úlcera por pressão | Semanal |
| **Mini-Mental (MEEM)** | Função cognitiva | Mensal |
| **Morse Fall Scale** | Risco de queda | Semanal |
| **Escala de Dor (EVA)** | Intensidade da dor | Por turno (se indicado) |
| **GDS-15** | Rastreio de depressão geriátrica | Trimestral |

**Funcionalidades:**
- Formulário digital guiado (passo a passo)
- Cálculo automático de score e classificação de risco
- Gráfico de evolução histórica
- Alertas quando score indica deterioração
- Assinatura do profissional responsável pela avaliação

---

#### Módulo: Marketplace — Conexão Família-Profissional

**Objetivo:** Canal de aquisição orgânica e fonte de receita via comissão.

**Fluxo da Família:**
1. Família cria conta gratuita no CuidarApp
2. Descreve a necessidade (tipo de cuidado, localização, horários, perfil do paciente)
3. Sistema sugere profissionais verificados da região
4. Família visualiza perfis, avaliações, especialidades e preços
5. Solicita contato → profissional aceita → conexão via chat interno
6. Contrato fechado: CuidarApp cobra 12% do primeiro mês

**Fluxo do Profissional:**
1. Profissional cria perfil (plano Solo ou superior)
2. Preenche especialidades, certificações, regiões de atendimento, disponibilidade
3. Recebe solicitações de contato de famílias
4. Gerencia novos clientes sem sair da plataforma que já usa para gestão

**Verificação de Profissionais:**
- Validação de COREN/CRM/CREFITO (integração futura com conselhos)
- Avaliações reais de famílias atendidas
- Badge "Verificado CuidarApp" para quem completar o perfil

---

#### Módulo: Portal Familiar

**Objetivo:** Eliminar a ansiedade da família, substituir comunicação reativa (ligações, WhatsApp) por transparência proativa.

**Visões disponíveis:**
- **Hoje:** Turno ativo, cuidador em serviço, progresso do PCI, eventos do dia
- **Sinais Vitais:** Última aferição + tendência + histórico de 7 dias com gráfico
- **Medicações:** O que foi administrado hoje, o que está pendente
- **Prontuário simplificado:** Diagnósticos, alergias, médico de referência (sem jargão técnico)
- **Equipe:** Quem é cada profissional, especialidade, contato

**Alertas proativos:**
- Sinal vital fora do parâmetro → push imediato
- Medicação não administrada no prazo → push com opção de contatar equipe
- Queda ou ocorrência registrada → push prioritário

**Relatório Diário PDF:**
- Gerado automaticamente às 20h
- Resume o dia: eventos, vitais, medicações, bem-estar geral
- Enviado por e-mail e disponível no app

---

## 6. Roadmap de Desenvolvimento — 3 Fases

### Status Atual (Linha de Base)

```
✅ IMPLEMENTADO
─────────────────────────────────────────────────────
• Design System completo (tokens CSS + TS)
• Autenticação (Supabase Auth + roles)
• 3 perfis funcionais (Admin, Familiar, Cuidador)
• AdminLayout (sidebar desktop + bottom nav mobile)
• Admin Dashboard (KPIs, turnos, alertas)
• Admin: Pacientes, Escalas, Alertas
• Caregiver: Active Shift, Registro de Eventos, Sinais Vitais
• Family: Home, Histórico de Vitais
• PWA configurada (manifest + service worker)

⚠️ GAPS PONTUAIS IDENTIFICADOS
─────────────────────────────────────────────────────
• FamilyHomePage: greeting ausente, bottom nav com active hardcoded
• VitalCard: sem indicador de tendência (↑↓)
• AdminDashboard: 1 coluna no desktop (sem grid 2col)
• ActiveShiftPage: window.confirm no checkout (sem modal visual)
• VitalHistoryPage: sem gráfico de linha
```

---

### Fase 1 — Produto Palpável (Semanas 1–10)

**Meta:** Ter um produto demonstrável para apresentar aos primos médicos no Terça da Serra SJC e para os tutores acadêmicos.

**Critério de sucesso:** Um profissional real consegue usar o CuidarApp para gerenciar um paciente real do início ao fim — prontuário, medicações, plano de cuidados, relatório para família — sem precisar de nenhuma planilha ou WhatsApp.

#### Sprint 1 (Semanas 1–2): Correções de UX e Prontuário Básico

- [ ] Greeting personalizado na FamilyHomePage
- [ ] Bottom nav com detecção de pathname ativo
- [ ] VitalCard com seta de tendência (↑↓ comparando com leitura anterior)
- [ ] AdminDashboard com grid 2-colunas no desktop
- [ ] Modal de confirmação de checkout no ActiveShiftPage
- [ ] Gráfico de linha no VitalHistoryPage (biblioteca: Recharts)
- [ ] **Expansão do Prontuário do Paciente:**
  - Campos: diagnóstico CID-10, alergias com severidade, histórico clínico, plano de saúde, médico de referência
  - Tela de edição de paciente no painel Admin

#### Sprint 2 (Semanas 3–5): Módulo de Medicamentos

- [ ] Schema de banco: tabela `prescriptions` + `medication_administrations`
- [ ] Tela de prescrição (Admin/Enfermeiro): adicionar medicamento com dosagem, via, horários
- [ ] Checklist de medicações no turno do cuidador (integrado ao ActiveShiftPage)
- [ ] Registro de administração com timestamp imutável
- [ ] Alerta de medicação pendente (Supabase Edge Function)
- [ ] Histórico de administrações no prontuário

#### Sprint 3 (Semanas 6–8): Plano de Cuidados

- [ ] Schema de banco: tabela `care_plans` + `care_tasks` + `task_executions`
- [ ] Tela de criação de PCI (Admin/Enfermeiro): adicionar tarefas com frequência e horário
- [ ] Checklist do Plano de Cuidados no turno do cuidador
- [ ] Progresso visual do turno (% de tarefas concluídas)
- [ ] Visibilidade do PCI simplificado no portal familiar

#### Sprint 4 (Semanas 9–10): Relatório PDF e Perfil Marketplace

- [ ] Geração de Relatório Diário em PDF (biblioteca: jsPDF ou Puppeteer via Edge Function)
- [ ] Envio automático por e-mail (Supabase + Resend)
- [ ] Tela de Perfil Público do Profissional (nome, especialidades, regiões, avaliações)
- [ ] Página pública `/profissionais` (não autenticada, SEO-friendly)

**Entregável da Fase 1:** Demo completo apresentável. O profissional autônomo tem tudo que precisa para substituir papel e WhatsApp.

---

### Fase 2 — Piloto Real e Primeiros Pagantes (Semanas 11–26)

**Meta:** 20–50 profissionais autônomos usando ativamente + contrato piloto com Terça da Serra SJC.

**Critério de sucesso:** Primeiro MRR real (pelo menos R$ 2.000/mês). Carta de parceria ou POC documentada com Terça da Serra.

#### Sprint 5–6 (Semanas 11–14): Escalas Clínicas

- [ ] Formulário digital para Barthel, Braden, Mini-Mental, Morse, EVA
- [ ] Cálculo automático de score e classificação de risco
- [ ] Histórico de evolução com gráfico por escala
- [ ] Alerta quando score piora em relação à última avaliação
- [ ] Exportação PDF por escala

#### Sprint 7–8 (Semanas 15–18): Equipe Multiprofissional

- [ ] Novos roles: `médico`, `enfermeiro`, `fisioterapeuta`, `nutricionista`, `terapeuta_ocupacional`, `psicólogo`
- [ ] Permissões por role (o que cada especialidade pode ver/editar)
- [ ] Evolução clínica por especialidade no prontuário
- [ ] Agenda multiprofissional (calendário de atendimentos)
- [ ] Assinatura digital por CRM/COREN

#### Sprint 9–10 (Semanas 19–22): Marketplace Completo

- [ ] Onboarding de família (sem necessidade de ter cuidador no sistema)
- [ ] Busca de profissionais por localização, especialidade, disponibilidade
- [ ] Chat interno entre família e profissional (pré-contratação)
- [ ] Fluxo de conexão com registro de comissão
- [ ] Sistema de avaliações (família avalia profissional após 30 dias)

#### Sprint 11–12 (Semanas 23–26): Compliance e Operacional (Plano Clínica)

- [ ] Gestão de quartos e leitos (mapa de ocupação)
- [ ] Gestão de contratos: modalidade (permanente/diurno/temporário), valor, vigência
- [ ] Fluxo de admissão completo (triagem + prontuário + PCI + alocação de quarto)
- [ ] Registro de ocorrências/incidentes com protocolo de acionamento
- [ ] Relatórios de compliance exportáveis (COREN/ANVISA)
- [ ] BI da clínica: painel de indicadores operacionais e clínicos

**Entregável da Fase 2:** Produto maduro para clínicas. Base de usuários real. Apresentação formal para Terça da Serra SJC.

---

### Fase 3 — Escala e Enterprise (Meses 7–18)

**Meta:** Formalizar contrato enterprise com Terça da Serra (piloto pago). Lançar white-label. Chegar a R$ 40.000+ MRR.

#### Módulos Enterprise

- [ ] Painel multi-unidade com switching de contexto
- [ ] BI centralizado por rede (métricas consolidadas)
- [ ] Protocolos e templates padronizados de PCI por rede
- [ ] Motor de white-label (logo, cores, domínio customizado)
- [ ] API REST pública documentada (Swagger/OpenAPI)
- [ ] SLA e monitoramento de uptime (99,9%)
- [ ] Onboarding automatizado para novas unidades

#### Integrações Estratégicas

- [ ] Integração TISS/TUSS (planos de saúde)
- [ ] Integração RNDS (Rede Nacional de Dados em Saúde - CONASS)
- [ ] Exportação HL7 FHIR (padrão internacional de interoperabilidade)
- [ ] Receituário digital integrado (plataformas habilitadas CFM)

---

## 7. Arquitetura Técnica Expandida

### Stack Atual (mantida e expandida)

```
Frontend          React 18 + TypeScript + Vite
Styling           Tailwind CSS + CSS Custom Properties (Design System)
State             TanStack Query + Zustand
Forms             React Hook Form + Zod
Icons             Font Awesome 6
Fonts             Manrope + Inter (Google Fonts)
Backend           Supabase (PostgreSQL + Auth + Realtime + Storage + Edge Functions)
PDF               jsPDF (cliente) / Puppeteer via Edge Function (servidor)
Charts            Recharts
PWA               Service Worker + Web App Manifest
Deploy            Vercel (frontend) + Supabase Cloud (backend)
```

### Novos Componentes de Infraestrutura (Fase 2+)

```
E-mail Transacional     Resend (integração nativa com Supabase)
Push Notifications      Web Push API + Supabase Edge Functions
Busca de Medicamentos   Base ANVISA/RENAME (CSV importado, pesquisa local)
Geolocalização          Browser Geolocation API (para confirmar presença do cuidador)
PDF Generation          jsPDF para relatórios simples; Puppeteer para relatórios complexos
Assinatura Digital      Certificado digital A1/A3 (Fase 2) ou hash + timestamp (Fase 1)
```

### Evolução de Perfis e Permissões

```typescript
type Role =
  | 'admin'              // Gestor da clínica/unidade
  | 'doctor'             // Médico — prescrição, evolução médica
  | 'nurse'              // Enfermeiro — PCI, medicamentos, escalas
  | 'physiotherapist'    // Fisioterapeuta — evolução fisio, agenda
  | 'occupational_therapist' // TO — evolução TO, agenda
  | 'nutritionist'       // Nutricionista — plano alimentar, evolução
  | 'psychologist'       // Psicólogo — evolução psicológica
  | 'caregiver'          // Cuidador — execução do PCI, eventos, vitais
  | 'family'             // Familiar — portal de visibilidade
  | 'network_admin'      // Admin de rede — multi-unidade (Enterprise)
```

---

## 8. Schema de Banco — Expansão Planejada

As tabelas abaixo se somam ao schema existente. Todas com RLS habilitado e `clinic_id` para isolamento.

### Fase 1 — Expansões Clínicas Core

```sql
-- Expansão da tabela patients (campos adicionais)
ALTER TABLE patients ADD COLUMN
  diagnosis_cid       text[],          -- Códigos CID-10
  allergies           jsonb,           -- [{name, severity, type}]
  health_plan         text,
  health_plan_number  text,
  reference_doctor    text,
  care_modality       text CHECK (care_modality IN ('home', 'daytime', 'permanent', 'temporary')),
  room_number         text,
  admission_date      date,
  clinical_notes      text;

-- Prescrições de medicamentos
CREATE TABLE prescriptions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id       uuid REFERENCES clinics(id),
  patient_id      uuid REFERENCES patients(id),
  prescribed_by   uuid REFERENCES user_profiles(id),  -- médico/enfermeiro
  medication_name text NOT NULL,
  dosage          text NOT NULL,
  route           text NOT NULL,  -- oral, EV, IM, SC, topica
  frequency       text NOT NULL,  -- '8h', '12h', '24h', 'custom'
  scheduled_times time[],         -- ex: {08:00, 14:00, 20:00}
  start_date      date NOT NULL,
  end_date        date,           -- null = uso contínuo
  is_active       boolean DEFAULT true,
  notes           text,
  digital_signature text,
  created_at      timestamptz DEFAULT now()
);

-- Registros de administração de medicamentos
CREATE TABLE medication_administrations (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id     uuid REFERENCES prescriptions(id),
  shift_id            uuid REFERENCES shifts(id),
  administered_by     uuid REFERENCES user_profiles(id),  -- cuidador
  scheduled_time      timestamptz NOT NULL,
  administered_at     timestamptz,        -- null = não administrado
  status              text NOT NULL CHECK (status IN ('pending', 'administered', 'refused', 'delayed')),
  notes               text,
  photo_url           text,              -- foto do medicamento (opcional)
  created_at          timestamptz DEFAULT now()
);

-- Planos de cuidados
CREATE TABLE care_plans (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id       uuid REFERENCES clinics(id),
  patient_id      uuid REFERENCES patients(id),
  created_by      uuid REFERENCES user_profiles(id),
  title           text NOT NULL,
  is_active       boolean DEFAULT true,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- Tarefas do plano de cuidados
CREATE TABLE care_tasks (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  care_plan_id    uuid REFERENCES care_plans(id),
  title           text NOT NULL,
  description     text,
  task_type       text NOT NULL,  -- hygiene, feeding, medication, mobility, vitals, other
  frequency       text NOT NULL,  -- daily, per_shift, weekly, monthly
  scheduled_days  int[],          -- 0=dom ... 6=sab (para frequência semanal)
  scheduled_time  time,
  order_index     int DEFAULT 0,
  is_active       boolean DEFAULT true
);

-- Execuções das tarefas por turno
CREATE TABLE task_executions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  care_task_id    uuid REFERENCES care_tasks(id),
  shift_id        uuid REFERENCES shifts(id),
  executed_by     uuid REFERENCES user_profiles(id),
  status          text NOT NULL CHECK (status IN ('pending', 'done', 'skipped')),
  notes           text,
  executed_at     timestamptz,
  created_at      timestamptz DEFAULT now()
);
```

### Fase 2 — Escalas, Equipe e Marketplace

```sql
-- Avaliações por escalas clínicas
CREATE TABLE clinical_assessments (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id       uuid REFERENCES clinics(id),
  patient_id      uuid REFERENCES patients(id),
  assessed_by     uuid REFERENCES user_profiles(id),
  scale_type      text NOT NULL,  -- barthel, braden, mmse, morse, eva, gds15
  score           numeric NOT NULL,
  risk_level      text,           -- low, moderate, high, critical
  answers         jsonb NOT NULL, -- respostas individuais de cada item da escala
  notes           text,
  digital_signature text,
  assessed_at     timestamptz DEFAULT now()
);

-- Evoluções clínicas por especialidade
CREATE TABLE clinical_notes (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id       uuid REFERENCES clinics(id),
  patient_id      uuid REFERENCES patients(id),
  author_id       uuid REFERENCES user_profiles(id),
  specialty       text NOT NULL,  -- medical, nursing, physio, occupational, nutritional, psychological
  content         text NOT NULL,
  digital_signature text,
  created_at      timestamptz DEFAULT now()
);

-- Agenda multiprofissional
CREATE TABLE appointments (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id       uuid REFERENCES clinics(id),
  patient_id      uuid REFERENCES patients(id),
  professional_id uuid REFERENCES user_profiles(id),
  type            text NOT NULL,  -- physio_session, medical_consultation, nutritional, occupational
  scheduled_at    timestamptz NOT NULL,
  duration_min    int DEFAULT 30,
  status          text DEFAULT 'scheduled',  -- scheduled, done, cancelled, no_show
  notes           text,
  created_at      timestamptz DEFAULT now()
);

-- Ocorrências e incidentes
CREATE TABLE incidents (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id       uuid REFERENCES clinics(id),
  patient_id      uuid REFERENCES patients(id),
  reported_by     uuid REFERENCES user_profiles(id),
  type            text NOT NULL,  -- fall, medication_error, pressure_ulcer, behavioral, other
  severity        text NOT NULL,  -- low, medium, high, critical
  description     text NOT NULL,
  actions_taken   text,
  follow_up       text,
  occurred_at     timestamptz NOT NULL,
  created_at      timestamptz DEFAULT now()
);

-- Gestão de quartos/leitos
CREATE TABLE rooms (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id       uuid REFERENCES clinics(id),
  number          text NOT NULL,
  type            text,  -- single, double, suite, icu_level
  is_occupied     boolean DEFAULT false,
  current_patient uuid REFERENCES patients(id),
  notes           text
);

-- Perfis públicos do marketplace
CREATE TABLE professional_profiles (
  id                  uuid PRIMARY KEY REFERENCES user_profiles(id),
  display_name        text NOT NULL,
  bio                 text,
  specialties         text[],         -- cuidador, enfermeiro, fisioterapeuta...
  certifications      text[],
  coren_crm           text,           -- número do conselho
  is_verified         boolean DEFAULT false,
  service_locations   text[],         -- cidades/bairros atendidos
  price_range_min     numeric,
  price_range_max     numeric,
  availability        jsonb,          -- disponibilidade por dia/horário
  rating              numeric,
  total_reviews       int DEFAULT 0,
  is_public           boolean DEFAULT false,
  updated_at          timestamptz DEFAULT now()
);

-- Avaliações do marketplace
CREATE TABLE marketplace_reviews (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid REFERENCES professional_profiles(id),
  reviewer_id     uuid REFERENCES user_profiles(id),
  rating          int CHECK (rating BETWEEN 1 AND 5),
  comment         text,
  created_at      timestamptz DEFAULT now()
);

-- Conexões do marketplace (com controle de comissão)
CREATE TABLE marketplace_connections (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id     uuid REFERENCES user_profiles(id),
  family_id           uuid REFERENCES user_profiles(id),
  status              text DEFAULT 'pending',  -- pending, accepted, contracted, completed
  contract_value      numeric,
  commission_value    numeric,
  commission_paid     boolean DEFAULT false,
  created_at          timestamptz DEFAULT now()
);
```

### Fase 3 — Enterprise e Multi-unidade

```sql
-- Unidades (para multi-unidade)
CREATE TABLE units (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id       uuid REFERENCES clinics(id),  -- rede mãe
  name            text NOT NULL,
  address         text,
  city            text,
  state           text,
  manager_id      uuid REFERENCES user_profiles(id),
  is_active       boolean DEFAULT true,
  created_at      timestamptz DEFAULT now()
);

-- Licenças e planos
CREATE TABLE subscriptions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id       uuid REFERENCES clinics(id),
  plan            text NOT NULL,  -- solo, professional, team, clinic, network
  status          text DEFAULT 'active',
  billing_cycle   text DEFAULT 'monthly',
  price           numeric NOT NULL,
  started_at      timestamptz DEFAULT now(),
  expires_at      timestamptz,
  stripe_sub_id   text  -- Stripe subscription ID (integração futura)
);
```

---

## 9. Go-to-Market e Parcerias Estratégicas

### Fase 1 — Fundação (Meses 1–3)

**Objetivo:** Produto palpável + primeiros usuários reais

**Ações:**
- Concluir Sprint 1–4 (Plano de Cuidados, Medicamentos, PDF, Marketplace básico)
- Criar landing page pública com formulário de interesse (waitlist)
- Onboardar 10–20 profissionais autônomos conhecidos ou via indicação direta
- Coletar feedback estruturado com formulário quinzenal

**Parceria Estratégica — Terça da Serra SJC:**
- Apresentar o produto para os primos médicos na unidade de São José dos Campos
- Proposta: POC (Proof of Concept) de 3 meses gratuito
- Objetivo da POC: validar o módulo de gestão de equipe multiprofissional em ambiente real
- Contrapartida solicitada: feedback clínico estruturado + carta de parceria + permissão de uso como caso de referência

### Fase 2 — Crescimento (Meses 4–9)

**Objetivo:** Monetização e pipeline enterprise

**Ações:**
- Lançar planos pagos (Profissional R$79 + Equipe R$249)
- Ativar marketplace com profissionais da base beta
- Usar Terça da Serra SJC como caso de sucesso para abordagem de outras clínicas
- Apresentar projeto para tutores acadêmicos com dados reais de usuários

**Canais de Aquisição:**
- SEO orgânico (blog sobre cuidado de idosos, regulação COREN/ANVISA)
- Indicação entre profissionais (viral loop do plano Solo gratuito)
- Marketplace (família que acha profissional → vira usuária fidelizada)
- Parcerias com escolas de cuidadores e cursos técnicos de enfermagem

### Fase 3 — Escala (Meses 10–18)

**Objetivo:** Enterprise + white-label + expansão nacional

**Ações:**
- Formalizar contrato pago com Terça da Serra (meta: R$3.000–8.000/mês)
- Prospectar 3–5 outras redes de residenciais com o caso Terça da Serra
- Avaliar captação de investimento-anjo (com MRR validado como prova)
- Lançar white-label como produto separado
- Iniciar integração TISS para planos de saúde (abre mercado de home care conveniado)

---

## 10. KPIs e Métricas de Sucesso

### Produto

| KPI | Meta Fase 1 | Meta Fase 2 | Meta Fase 3 |
|---|---|---|---|
| Usuários ativos (MAU) | 50 | 500 | 3.000 |
| Pacientes gerenciados | 150 | 2.000 | 15.000 |
| Turnos registrados/mês | 300 | 8.000 | 60.000 |
| Medicações administradas e registradas | 500 | 15.000 | 150.000 |
| Relatórios PDF gerados | 100 | 2.000 | 20.000 |

### Negócio

| KPI | Meta Fase 1 | Meta Fase 2 | Meta Fase 3 |
|---|---|---|---|
| MRR | R$ 0 (free) | R$ 8.000 | R$ 45.000 |
| Clientes pagantes | 0 | 80 | 400 |
| Churn mensal | — | < 5% | < 3% |
| LTV médio | — | R$ 1.200 | R$ 3.500 |
| CAC (custo de aquisição) | — | < R$ 150 | < R$ 200 |
| NPS | — | > 50 | > 65 |

### Marketplace

| KPI | Meta Fase 2 | Meta Fase 3 |
|---|---|---|
| Profissionais com perfil público | 100 | 1.000 |
| Conexões realizadas/mês | 10 | 100 |
| Receita de comissão/mês | R$ 500 | R$ 8.000 |

---

## 11. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Concorrente grande (MV, Salesforce Health) entra no SMB | Médio | Alto | Velocidade + rede de usuários estabelecida + nicho brasil-centric |
| Profissional autônomo não converte para pago | Médio | Médio | Freemium com limite real (5 pacientes); crescimento natural força upgrade |
| Erro em módulo de medicamentos gera incidente clínico | Baixo | Crítico | Nunca prescrever; dupla confirmação; disclaimer legal claro; seguro de responsabilidade |
| Regulação ANVISA/CFM exige certificação específica | Médio | Médio | Monitorar legislação; usar linguagem de "gestão" não "prescrição" |
| Perda de dados em falha do Supabase | Baixo | Alto | Backups diários automáticos + PITR habilitado no plano Supabase Pro |
| Fundador solo sem capacidade de entrega | Alto | Alto | Priorização rígida por fase; buscar co-fundador técnico após Fase 1 |
| Terça da Serra não avançar na parceria | Médio | Médio | Parceria é acelerador, não dependência; crescimento bottom-up não depende dela |

---

## Decisões Abertas (Pendentes)

> Estas decisões foram identificadas na sessão de 2026-05-03 e aguardam resposta do fundador.

| # | Decisão | Impacto | Prazo Sugerido |
|---|---|---|---|
| D1 | Sequência de módulos na Fase 1 (proposta: Medicamentos → Prontuário → PCI → PDF → Marketplace) | Define Sprint 1–4 | Imediato |
| D2 | Quando apresentar para os primos no Terça da Serra SJC | Define deadline da Fase 1 | Próximas 2 semanas |
| D3 | Marketplace como subseção do app ou landing page separada | Impacta SEO e aquisição | Antes do Sprint 4 |
| D4 | Buscar co-fundador técnico ou tutores como advisors | Define ritmo de desenvolvimento | Após Fase 1 concluída |
| D5 | Nome/posicionamento para o segmento enterprise (white-label) | Impacta proposta para Terça da Serra | Antes da apresentação |

---

*Documento gerado em 2026-05-03 com base nas sessões estratégicas de definição do produto CuidarApp.*
*Próxima revisão: após decisão do fundador sobre D1–D5 e conclusão do Sprint 1.*
