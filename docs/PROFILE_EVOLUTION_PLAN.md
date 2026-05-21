# Plano de evolução por perfil — CuidarApp

## Objetivo

Separar a experiência do CuidarApp em dois perfis claros para o MVP:

- **Familiar:** acompanha, entende e ganha tranquilidade.
- **Cuidador:** registra a rotina com poucos cliques.

O paciente continua sendo o centro da experiência.

## Princípios de produto

1. O familiar deve entender o status do dia em poucos segundos.
2. O cuidador não pode sentir que o app virou burocracia.
3. Registros rápidos vêm antes de formulários completos.
4. Alertas devem ser úteis, poucos e acionáveis.
5. O relatório diário é a principal entrega de valor para a família.
6. IA continua fora do MVP.

---

## Perfil Familiar

### Pergunta central

> Está tudo bem com meu familiar hoje?

### Objetivo do perfil

Dar visibilidade, tranquilidade e histórico simples sobre o cuidado.

### Navegação recomendada

```txt
Início
Linha do dia
Saúde
Alertas
Relatório
Perfil
```

### Funcionalidades P0

- Visualizar paciente vinculado.
- Visualizar cuidador responsável/presente.
- Ver status do turno.
- Ver linha do tempo diária.
- Ver medicações administradas, pendentes e atrasadas.
- Ver alertas importantes.
- Ver ocorrências.
- Ver relatório diário.

### Funcionalidades P1

- Convidar cuidador por link ou código.
- Editar dados básicos do paciente.
- Cadastrar medicações.
- Compartilhar relatório.
- Configurar contatos de emergência.
- Controlar intensidade de notificações.

### Funcionalidades P2

- Histórico semanal/mensal.
- Comparativo de evolução.
- Exportação PDF avançada.
- Múltiplos familiares.
- Permissões por familiar.
- Planos e assinatura.

---

## Perfil Cuidador

### Pergunta central

> O que preciso registrar agora?

### Objetivo do perfil

Permitir que o cuidador registre a rotina do paciente com o menor atrito possível.

### Navegação recomendada

```txt
Hoje
Registrar
Medicação
Ocorrência
Paciente
```

Para o MVP inicial, a navegação pode começar mais simples:

```txt
Hoje
Registrar
Paciente
```

### Funcionalidades P0

- Visualizar paciente do turno.
- Fazer check-in.
- Fazer check-out.
- Registrar atividade rápida.
- Confirmar medicação.
- Registrar refeição.
- Registrar higiene.
- Registrar sinais vitais simples.
- Registrar ocorrência.
- Adicionar observação simples.

### Funcionalidades P1

- Registro detalhado opcional.
- Lista de pendências do turno.
- Marcar medicação como recusada.
- Editar registro recente.
- Anexar foto em ocorrência.
- Receber lembrete de pendência.

### Funcionalidades P2

- Agenda semanal do cuidador.
- Múltiplos pacientes por dia.
- Perfil profissional.
- Histórico de atendimentos.
- Controle de horas trabalhadas.
- Assinatura para cuidador profissional.

---

## Divisão de responsabilidade

| Área | Familiar | Cuidador |
|---|---|---|
| Status do dia | Visualiza | Atualiza via registros |
| Check-in/check-out | Visualiza | Executa |
| Medicação | Acompanha | Confirma/administra |
| Ocorrências | Recebe alerta | Registra |
| Relatório | Consulta/compartilha | Alimenta com registros |
| Paciente | Cadastra/edita | Consulta |

---

## Fluxo MVP ideal

```txt
1. Familiar cria conta
2. Familiar cadastra paciente
3. Familiar vincula cuidador
4. Cuidador faz check-in
5. Cuidador registra atividades do dia
6. Familiar acompanha linha do tempo
7. Cuidador registra ocorrência ou medicação
8. Familiar recebe alerta
9. Sistema gera relatório diário
10. Familiar valida valor do produto
```

---

## Primeiro incremento aprovado

Implementar uma versão visual e funcional com mock/local state:

- Seletor de perfil Familiar/Cuidador.
- Painel Familiar com linha do dia, saúde, alertas e relatório.
- Painel Cuidador com check-in, check-out e registro rápido.
- Registros feitos pelo cuidador aparecem na linha do tempo do familiar.
- Ocorrência registrada pelo cuidador gera alerta visual para o familiar.

Esse incremento prepara o projeto para a próxima etapa: autenticação e persistência.
