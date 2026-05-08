# CuidarApp - Relatorio de UI/UX

Data da revisao: 2026-05-08  
Escopo: experiencia visual, arquitetura de informacao, consistencia de interface, acessibilidade, responsividade e maturidade do design system.

## Resumo executivo

O CuidarApp ja tem uma direcao visual clara: uma linguagem clinica acolhedora, baseada em teal, superficies brancas, tipografia moderna e cards bem legiveis. A tela de login transmite confianca e cuidado, e os fluxos principais indicam boa compreensao das personas: administrador, medico, enfermagem, cuidador e familia.

O principal problema nao e falta de qualidade visual nas telas isoladas. O risco maior esta na falta de consolidacao do design system. Existem tokens globais, mas os componentes compartilhados de UI e layout ainda estao vazios, enquanto as telas recriam botoes, cards, badges, navegacao, modais e estados manualmente com muitos estilos inline. Isso aumenta inconsistencia, custo de manutencao e risco de acessibilidade.

Veredito: boa base visual para MVP, mas ainda nao esta pronto como sistema de produto escalavel. A prioridade deve ser transformar os padroes existentes em componentes reutilizaveis e corrigir acessibilidade, responsividade e textos antes de ampliar funcionalidades.

## Evidencias observadas

- Tokens visuais globais existem em `src/index.css` e `src/utils/tokens.ts`.
- Foram encontrados aproximadamente 997 usos de `style={{ ... }}` em `src`, indicando alto acoplamento visual por tela.
- Foram encontrados 10 componentes compartilhados retornando `null`, incluindo `Button`, `Card`, `Badge`, `Avatar`, `AppShell`, `Sidebar`, `BottomNav`, `VitalSignCard`, `TimelineItem` e `AlertItem`.
- Ha uso extensivo de Font Awesome inline, com cerca de 171 ocorrencias de `fa-solid` ou `fa-regular`.
- A tela de login foi validada visualmente em `http://127.0.0.1:3000/login`.
- A automacao de navegador nao conseguiu preencher o input de email por limitacao do driver com `type=email`, entao a revisao das telas internas foi feita por leitura de codigo.

## Pontos fortes

### Identidade visual

A paleta "Clinical Empathy" funciona bem para o dominio. O teal principal passa seguranca sem parecer frio demais, e a combinacao com branco, cinza claro e navy cria um ambiente adequado para saude.

Os cards de login, dashboards, paciente e turno ativo tem boa hierarquia e boa sensacao de produto. A linguagem visual e consistente no nivel macro: cantos arredondados, icones funcionais, sombras suaves e foco em conteudo operacional.

### Clareza por persona

As interfaces parecem pensadas para contextos diferentes:

- Admin: visao de KPIs, turnos, alertas e gestao.
- Medico: foco em pacientes, prescricoes e alertas criticos.
- Enfermagem: acompanhamento operacional e tarefas obrigatorias.
- Cuidador: fluxo mobile-first para turno ativo, checklist, eventos, sinais vitais e encerramento.
- Familia: acompanhamento simplificado, sinais vitais, cuidador ativo, linha do dia e comunicacao.

Essa separacao por papel e um dos pontos mais fortes do produto.

### Fluxos operacionais

O fluxo do cuidador tem boa intencao de UX: status do turno no topo, resumo clinico, checklist, plano de cuidado, medicamentos, eventos e encerramento. Isso segue bem a ordem mental de quem esta em campo.

O app tambem usa banners e estados de alerta para chamar atencao sem depender apenas de texto.

## Principais problemas

### 1. Design system ainda e mais intencao do que infraestrutura

Os tokens existem, mas os componentes compartilhados estao vazios. Na pratica, cada tela implementa seu proprio botao, card, badge, navegacao, modal, avatar e estado vazio.

Impacto:

- Inconsistencia visual entre Admin, Medico, Enfermagem, Cuidador e Familia.
- Maior risco de regressao visual.
- Dificuldade para aplicar acessibilidade de forma uniforme.
- Mais tempo para criar novas telas.
- Duplicacao de logica e estilos.

Recomendacao:

Criar uma camada real de componentes:

- `Button`: variantes `primary`, `secondary`, `outline`, `ghost`, `danger`, estados `loading` e `disabled`.
- `Card`: variantes `default`, `elevated`, `interactive`, `critical`.
- `Badge`: severidade, status e papel de usuario.
- `Avatar`: iniciais, foto, fallback e tamanho.
- `AppShell`: layout responsivo com sidebar/bottom nav.
- `BottomNav` e `Sidebar`: navegacao padronizada por perfil.
- `Modal` ou `BottomSheet`: confirmacao, formulario e alerta.
- `EmptyState`, `LoadingState`, `ErrorState`.
- `KpiCard`, `AlertItem`, `TimelineItem`, `VitalSignCard`.

### 2. Inconsistencia entre shells e navegacao

O Admin usa sidebar escura fixa. Medico e Enfermagem usam sidebar branca sticky. Familia usa bottom nav centralizada com max-width. Cuidador nao tem shell proprio, funcionando como fluxo mobile isolado.

Essa diversidade pode ser adequada por persona, mas hoje parece mais acidental do que sistemica.

Recomendacao:

Definir um modelo por contexto:

- Backoffice: Admin, Medico e Enfermagem devem compartilhar um mesmo shell responsivo, mudando apenas nav items, icone e label do papel.
- Field app: Cuidador deve manter experiencia mobile-first, com header sticky e acoes fixas.
- Family app: Familia pode manter mobile-first simplificado, mas deve compartilhar tokens, bottom nav e cards com cuidador.

### 3. Acessibilidade dos icones e botoes

Muitos botoes usam apenas icones Font Awesome ou icone + texto sem `aria-label`. No snapshot da tela de login, o botao de ver senha aparece com nome acessivel como caractere de icone. Isso e ruim para leitores de tela.

Exemplos de risco:

- Botao de mostrar senha.
- Botao de logout com apenas icone.
- Itens de bottom nav com icones.
- Cards clicaveis ou botoes de filtro.
- Alertas com icones que carregam significado visual.

Recomendacao:

- Todo botao apenas com icone deve ter `aria-label`.
- Icones decorativos devem ter `aria-hidden="true"`.
- Alertas devem usar texto explicito alem de cor/icone.
- Toasts devem usar `aria-live`.
- Modais devem ter foco inicial, fechamento por Esc, trap de foco e `role="dialog"`.

### 4. Estados de loading, erro e vazio ainda sao inconsistentes

Ha boas ideias de empty states em algumas telas, mas nao ha padrao unico. Alguns loadings usam spinner isolado; outros texto simples como "Carregando KPIs..."; erros de query nem sempre aparecem como estado amigavel.

Recomendacao:

Padronizar:

- Loading de tela: skeleton ou spinner com texto curto.
- Loading de card: placeholder local.
- Erro recuperavel: mensagem clara + botao tentar novamente.
- Estado vazio: icone, titulo, descricao e acao quando aplicavel.
- Estado offline/PWA: mensagem propria, especialmente para cuidador em campo.

### 5. Hierarquia visual boa, mas densidade varia demais

Admin e dashboards usam uma densidade operacional boa. Familia e Cuidador usam densidade mais mobile e acolhedora. Porem, alguns cards de KPI, cards clinicos e listas usam tamanhos de borda, raio, sombra e padding diferentes sem regra clara.

Recomendacao:

Definir escala:

- Cards de painel: raio 12px, padding 20-24px.
- Cards mobile de tarefa/evento: raio 12-16px, padding 14-18px.
- Modais/bottom sheets: raio superior 20-24px.
- Botoes: altura minima 44px desktop, 48px mobile.
- Bottom nav: altura segura com `env(safe-area-inset-bottom)`.

### 6. Problemas de encoding/texto em arquivos

Varios arquivos exibem caracteres corrompidos em comentarios e strings, como `AtenÃ§Ã£o`, `MÃ©dico`, `PrescriÃ§Ãµes`. Parte do app pode renderizar corretamente dependendo da origem do texto, mas o codigo mostra sinais de encoding misto.

Impacto:

- Risco de texto quebrado em producao.
- Dificuldade de manutencao.
- Percepcao de baixa qualidade se aparecer na interface.

Recomendacao:

Normalizar todos os arquivos para UTF-8 e revisar strings visiveis de UI.

### 7. Uso de estilos inline em escala alta

Os estilos inline permitiram velocidade no MVP, mas agora dificultam consistencia, responsividade e revisao visual. Tambem tornam dificil aplicar temas, estados e variantes globais.

Recomendacao:

Migrar gradualmente para componentes e classes utilitarias controladas. Nao precisa refatorar tudo de uma vez:

1. Criar componentes base.
2. Aplicar em novas telas.
3. Migrar telas mais criticas: Login, ActiveShift, FamilyHome, AdminDashboard.
4. Depois migrar telas secundarias.

## Revisao por area

### Login

Pontos positivos:

- Visual limpo, confiavel e centrado.
- Boa hierarquia: logo, nome, promessa, campos, CTA.
- Estados de erro ja existem.
- CTA primario tem bom contraste.

Melhorias:

- Adicionar `aria-label` ao botao de mostrar/ocultar senha.
- Evitar icone sem texto acessivel.
- Revisar o texto "Dados protegidos com criptografia - LGPD" para nao prometer mais do que a implementacao garante.
- Considerar link de recuperacao de senha.
- Evitar navegacao durante render; mover redirect para `useEffect` para reduzir comportamento inesperado.

### Admin

Pontos positivos:

- KPI cards sao escaneaveis.
- Alertas recentes e turnos de hoje sao informacoes certas para primeira tela.
- Sidebar escura cria boa separacao de painel operacional.

Melhorias:

- Alinhar shell com Medico/Enfermagem ou justificar diferenca por papel.
- Dar mais estrutura aos filtros e tabelas em mobile.
- Padronizar estados vazios e erros.
- Adicionar labels acessiveis em botoes de acao.

### Medico

Pontos positivos:

- Dashboard objetivo.
- Foco em alertas criticos e pacientes.
- Navegacao simples.

Melhorias:

- A linguagem "Clinico" precisa ser consistente com "Medico".
- Cards de KPI poderiam ter comportamento e visual identicos aos de Admin/Enfermagem.
- Alertas criticos precisam de prioridade visual clara, mas sem depender apenas de vermelho.
- Patient profile precisa destacar risco clinico, prescricoes e tarefas em uma ordem decisoria.

### Enfermagem

Pontos positivos:

- Boa proximidade visual com medico.
- KPIs adequados ao papel.
- Tarefas obrigatorias aparecem como informacao relevante.

Melhorias:

- Evitar duplicacao quase identica de `DoctorLayout` e `NurseLayout`.
- Criar shell parametrizado por role.
- Dar mais destaque para fila de tarefas/pendencias, que e mais operacional que KPI.

### Cuidador

Pontos positivos:

- Melhor area do produto em termos de fluxo.
- Mobile-first adequado.
- Header sticky e CTA fixo ajudam no uso em campo.
- Checklist + eventos + sinais vitais seguem uma ordem natural.
- Modal de encerramento com bloqueios/avisos e uma boa protecao contra erro.

Melhorias:

- O botao fixo "Encerrar Turno" pode competir com conteudos no final da tela; garantir padding inferior suficiente em todos os estados.
- Eventos em grid de 3 colunas podem ficar apertados em telas pequenas ou com textos maiores.
- Acoes criticas deveriam ter confirmacao e texto acessivel padrao.
- Falta um estado offline/sem rede para contexto domiciliar.
- Tarefas obrigatorias e checklist deveriam ter progresso global visivel no topo.

### Familia

Pontos positivos:

- Linguagem mais calma e compreensivel.
- Card do paciente e cuidador ativo sao bons elementos emocionais e funcionais.
- Sinais vitais e linha do dia criam transparencia.
- Bottom nav com quatro itens e facil de entender.

Melhorias:

- Evitar excesso de dados clinicos sem explicacao contextual.
- Adicionar microcopy para valores alterados: "fora do esperado", "dentro do esperado", "aguardando afericao".
- Garantir que alertas tenham linguagem sem causar panico.
- Melhorar acessibilidade do bottom nav e dos botoes de telefone/logout.

## Acessibilidade

Prioridade alta:

- Adicionar `aria-label` a botoes icon-only.
- Marcar icones decorativos com `aria-hidden`.
- Garantir foco visivel em todos os botoes e inputs.
- Criar gerenciamento de foco em modais.
- Usar `aria-live` para toasts e mensagens de erro.
- Conferir contraste de textos em `C.textLight` sobre fundos claros.
- Nao depender apenas de cor para severidade de alerta.
- Garantir tamanho minimo de toque de 44px.

## Responsividade

O projeto ja usa padroes responsivos em varias telas, especialmente com grids `auto-fit` e bottom nav mobile. O ponto de atencao e que a responsividade esta dispersa em estilos inline e blocos `<style>` locais.

Recomendacao:

- Centralizar breakpoints.
- Padronizar shell desktop/mobile.
- Testar larguras: 360px, 390px, 768px, 1024px e 1280px.
- Validar textos longos: nomes de paciente, nomes de cuidador, medicamentos, prescricoes e alertas.

## Tom de voz e microcopy

O tom e acolhedor, mas precisa de ajuste por persona:

- Admin: direto, operacional, orientado a pendencias.
- Medico/Enfermagem: clinico, preciso, sem excesso emocional.
- Cuidador: claro, instrucional, com verbos de acao.
- Familia: tranquilizador, transparente e sem jargao.

Recomendacoes:

- Trocar abreviacoes internas como "Tarefas Obrig. Ativas" por textos mais claros.
- Evitar mensagens vagas como "Tudo tranquilo por enquanto" em contexto clinico; preferir "Nenhum alerta critico ativo".
- Padronizar termos: "Inicio" vs "Painel" vs "Dashboard"; "Alertas pendentes" vs "Nao lidos"; "Turno" vs "Plantao".

## Backlog priorizado

### P0 - Fundacao de design system

- Implementar `Button`, `Card`, `Badge`, `Avatar`, `Modal`, `BottomSheet`, `EmptyState`, `LoadingState`, `ErrorState`.
- Substituir botoes icon-only sem `aria-label`.
- Corrigir encoding UTF-8 das strings visiveis.
- Criar `AppShell` parametrizado para Admin/Medico/Enfermagem.

### P1 - Experiencia critica

- Revisar fluxo do cuidador em 360px e 390px.
- Padronizar modal de encerramento e modais de registro.
- Adicionar progresso global de checklist/plano de cuidado no turno ativo.
- Criar estados offline/erro para operacao em campo.
- Melhorar estados de erro de queries.

### P2 - Consistencia visual

- Migrar KPI cards para componente unico.
- Migrar alertas para `AlertItem`.
- Migrar timeline para `TimelineItem`.
- Migrar sinais vitais para `VitalSignCard`.
- Reduzir estilos inline nas telas principais.

### P3 - Refinamento

- Criar documentacao visual dos tokens.
- Definir escala tipografica oficial.
- Definir matriz de severidade para alertas.
- Criar checklist de QA visual por breakpoint.
- Adicionar testes visuais/snapshots para telas principais.

## Principios recomendados para evolucao

1. Clareza antes de densidade.
2. Segurança emocional para familia, precisao operacional para profissionais.
3. Acao primaria unica por tela ou por bloco.
4. Alertas sempre com severidade, contexto e proxima acao.
5. Dados clinicos sensiveis devem ser escaneaveis, mas nunca decorativos.
6. Mobile-first para cuidador e familia; desktop-efficient para backoffice.
7. Componentes compartilhados antes de novas telas.

## Checklist de aceite para novas telas

- Usa componentes compartilhados, nao estilos inline duplicados.
- Tem loading, erro e vazio definidos.
- Funciona em 360px, 390px, 768px e desktop.
- Botoes tem area minima de toque.
- Botoes icon-only tem `aria-label`.
- Modais gerenciam foco e fechamento.
- Texto longo nao quebra layout.
- Severidade nao depende apenas de cor.
- CTA primario e claro.
- Nao introduz novo padrao visual sem justificar.

## Conclusao

O CuidarApp tem uma base promissora e ja comunica bem o dominio de saude domiciliar. A experiencia mais forte hoje esta nos fluxos mobile de cuidado e familia, enquanto o backoffice tem boa estrutura de painel.

O proximo salto de qualidade nao depende de redesenhar tudo. Depende de consolidar o que ja funciona em componentes, padronizar shells, corrigir acessibilidade e transformar os padroes atuais em uma linguagem de produto unica. Isso vai deixar o app mais confiavel para usuarios e muito mais facil de evoluir.
