# CuidarApp

**CuidarApp** é um aplicativo para acompanhamento da rotina de cuidado de idosos e pessoas dependentes, conectando familiares e cuidadores em um fluxo simples, seguro e organizado.

> O app que dá tranquilidade para famílias acompanharem o cuidado de quem amam.

## Visão do produto

O CuidarApp nasce como um diário digital de cuidado domiciliar. A proposta inicial é permitir que cuidadores registrem atividades importantes do dia e que familiares acompanhem tudo com clareza, segurança e confiança.

No longo prazo, o produto pode evoluir para uma plataforma de gestão para cuidadores, famílias, pequenos prestadores de home care e empresas do setor.

## Problema que resolvemos

Famílias que contratam ou coordenam cuidados para idosos normalmente dependem de mensagens soltas em aplicativos de conversa, ligações e registros informais. Isso gera ansiedade, perda de informação, dificuldade de acompanhamento e pouca previsibilidade.

O CuidarApp organiza essa rotina em um único lugar, com registros estruturados, alertas, histórico e relatórios simples.

## Público inicial

### Usuários principais

- Familiar responsável pelo acompanhamento do paciente.
- Cuidador autônomo responsável pelos registros da rotina.

### Clientes pagantes iniciais

- Família do paciente.
- Cuidador autônomo que deseja profissionalizar seu atendimento.

## Proposta de valor

Para familiares, o CuidarApp oferece tranquilidade e visibilidade.

Para cuidadores, oferece organização, profissionalismo e prova de execução do serviço.

Para o mercado de cuidado domiciliar, cria uma base para padronizar registros, reduzir ruídos de comunicação e melhorar a confiança entre família e cuidador.

## MVP

O MVP deve ser simples e focado em validar o fluxo principal:

1. Familiar acompanha a rotina do paciente.
2. Cuidador registra atividades do dia.
3. O sistema organiza os registros em uma linha do tempo.
4. A família recebe notificações e alertas.
5. Um relatório diário simples é gerado.

### Funcionalidades prioritárias

- Cadastro de familiar.
- Cadastro de cuidador.
- Cadastro de paciente.
- Check-in e check-out do cuidador.
- Registro rápido de atividades.
- Registro de medicação.
- Registro de ocorrências.
- Linha do tempo do dia.
- Notificações por atividade.
- Alertas importantes.
- Relatório diário simples.

### Fora do MVP

- Inteligência artificial.
- Prontuário médico completo.
- Marketplace de cuidadores.
- Integrações clínicas avançadas.
- Gestão completa para empresas de home care.

## Diferenciais

- Tranquilidade emocional para famílias.
- Organização da rotina do cuidador.
- Prova de execução do serviço contratado.
- Comunicação mais estruturada que conversas soltas em aplicativos de mensagem.
- Base preparada para evolução gradual.

## Tom de marca

O CuidarApp deve comunicar segurança, profissionalismo e cuidado. A marca deve ser confiável, clara e acolhedora, evitando parecer fria demais ou excessivamente informal.

## Métricas de sucesso do MVP

- Familiar abre o app todos os dias.
- Cuidador registra atividades sem dificuldade.
- Redução de mensagens no WhatsApp sobre a rotina.
- Cliente aceita pagar após o piloto.

## Documentação

A documentação estratégica do projeto está disponível em:

- [`docs/PRODUCT_VISION.md`](docs/PRODUCT_VISION.md)
- [`docs/ROADMAP.md`](docs/ROADMAP.md)
- [`docs/MVP_SCOPE.md`](docs/MVP_SCOPE.md)
- [`docs/BACKLOG.md`](docs/BACKLOG.md)
- [`docs/VALIDATION_PLAN.md`](docs/VALIDATION_PLAN.md)

## Como rodar localmente

### Pré-requisitos

- Node.js
- npm

### Instalação

```bash
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env.local` com as variáveis necessárias.

```bash
GEMINI_API_KEY=sua_chave_aqui
```

> Observação: a IA não faz parte do MVP validado inicialmente. A variável pode existir por dependência do protótipo atual, mas a estratégia recomenda validar primeiro o fluxo básico de cuidado.

### Executar em desenvolvimento

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Lint/type-check

```bash
npm run lint
```

## Status do projeto

O projeto está em fase de refinamento de produto e validação de MVP. A versão atual funciona como protótipo visual e deve evoluir para um MVP funcional com dados reais, perfis de usuário e registros persistentes.
