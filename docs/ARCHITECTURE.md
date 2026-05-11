# Arquitetura inicial — CuidarApp

## 1. Objetivo

Este documento define uma arquitetura inicial para transformar o protótipo visual do CuidarApp em um MVP funcional, mantendo simplicidade e evolução gradual.

## 2. Princípios técnicos

- Começar simples.
- Separar domínio de interface.
- Evitar regras de negócio espalhadas em componentes.
- Tipar os principais modelos desde cedo.
- Remover mocks progressivamente.
- Priorizar fluxos do MVP antes de recursos avançados.

## 3. Estrutura recomendada

```txt
src/
  components/      Componentes reutilizáveis
  data/            Dados mockados e seeds temporárias
  features/        Fluxos por domínio do produto
  pages/           Telas principais
  services/        Integrações com backend, auth e notificações
  types/           Tipos TypeScript compartilhados
  utils/           Funções utilitárias
```

## 4. Domínios principais

Os tipos iniciais estão em:

```txt
src/types/domain.ts
```

Modelos principais:

- User
- Patient
- CareRelationship
- Medication
- MedicationAdministration
- Activity
- Occurrence
- VitalSign
- DailyReport
- Alert

## 5. Fluxos principais do MVP

### Familiar

1. Criar conta.
2. Cadastrar paciente.
3. Vincular cuidador.
4. Acompanhar linha do tempo.
5. Receber alertas.
6. Consultar relatório diário.

### Cuidador

1. Criar conta.
2. Aceitar vínculo com paciente.
3. Fazer check-in.
4. Registrar atividades.
5. Confirmar medicação.
6. Registrar ocorrência.
7. Fazer check-out.

## 6. Camadas sugeridas

### Interface

Responsável por renderizar telas e interações.

### Estado/aplicação

Responsável por controlar fluxo, dados em memória e ações do usuário.

### Serviço de dados

Responsável por falar com backend/BaaS.

### Domínio

Responsável por tipos, regras e estruturas centrais do produto.

## 7. Backend/BaaS sugerido para MVP

Para acelerar o MVP, uma solução BaaS pode ser usada inicialmente.

Opções comuns:

- Supabase
- Firebase
- Appwrite

Critérios de escolha:

- autenticação simples;
- banco de dados;
- regras de permissão;
- facilidade de deploy;
- custo inicial baixo;
- boa documentação.

## 8. Segurança e LGPD

Desde o MVP, considerar:

- autenticação obrigatória;
- controle de acesso por paciente;
- logs de alterações importantes;
- não expor dados sensíveis no frontend;
- política de privacidade;
- consentimento para uso dos dados;
- exclusão de dados mediante solicitação.

## 9. Decisões já tomadas

- IA não entra no MVP.
- O MVP terá familiar e cuidador como perfis iniciais.
- Relatório diário é a funcionalidade central.
- O produto começa como diário digital de cuidado, não como prontuário médico completo.

## 10. Próximos passos técnicos

1. Refatorar `src/App.tsx` em páginas/componentes menores.
2. Usar `src/data/mockCareData.ts` como fonte temporária de dados.
3. Criar serviços simulados antes do backend real.
4. Escolher backend/BaaS.
5. Implementar autenticação.
6. Persistir pacientes, atividades, medicações e relatórios.
