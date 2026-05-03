# Critérios de Segurança e LGPD — CuidarApp

## Classificação de Dados

| Categoria | Exemplos | Nível de Proteção |
|---|---|---|
| Dados de Identificação Pessoal | Nome, CPF, telefone | Alto |
| Dados de Saúde (Sensíveis) | Diagnósticos, sinais vitais, medicamentos | Crítico |
| Dados Operacionais | Turnos, escalas, horários | Médio |
| Dados de Acesso | Logs, audit trail | Alto |
| Metadados de Sessão | Timestamps, device info | Médio |

## Controles de Segurança

### Autenticação
| Controle | Implementação | Status |
|---|---|---|
| Login com email/senha | Supabase Auth | Pendente |
| Validação de senha forte | Zod (min 8 chars, 1 número, 1 maiúscula) | Pendente |
| Refresh automático de token | `supabase.auth.onAuthStateChange` | Pendente |
| Logout completo (limpa estado) | Zustand reset + Query invalidation | Pendente |
| Proteção de rotas | HOC/hook de verificação de sessão | Pendente |

### Autorização (RLS)
| Controle | Status |
|---|---|
| Admin acessa apenas dados de sua clínica | Pendente |
| Familiar acessa apenas dados de seu paciente | Pendente |
| Cuidador acessa apenas pacientes do turno ativo | Pendente |
| Nenhuma tabela sem RLS em produção | Pendente |

### Transmissão de Dados
| Controle | Implementação |
|---|---|
| HTTPS obrigatório | Vercel (automático) + Supabase (automático) |
| WSS para Realtime | Supabase Realtime (automático) |
| Dados sensíveis no body (não URL) | Padrão de implementação |

### Armazenamento de Dados
| Controle | Implementação |
|---|---|
| Chaves de API em variáveis de ambiente | `.env.local` |
| Service Worker não cacheia dados de saúde | Cache Strategy: Network Only para `/api/*` |
| Soft delete em pacientes | Campo `deleted_at` |

## LGPD — Implementação

### Artigos Aplicáveis
- Art. 7: Tratamento de dados pessoais — base legal: execução de contrato
- Art. 11: Dados sensíveis de saúde — consentimento explícito obrigatório
- Art. 18: Direitos do titular — acesso, retificação, exclusão, portabilidade

### Implementações Obrigatórias

**Consentimento:**
```
□ Modal de consentimento no primeiro acesso
□ Texto claro sobre quais dados são coletados e para quê
□ Data e IP do consentimento armazenados em audit_log
□ Opção de revogar consentimento
```

**Direito ao Esquecimento:**
```
□ Endpoint de exclusão de conta que remove dados pessoais
□ Anonymização de dados históricos (manter registros clínicos, remover identificação)
□ Prazo: atendimento em até 15 dias úteis
```

**Auditoria:**
```
□ Tabela audit_log registra: quem acessou, o quê, quando
□ Logs de acesso a dados de pacientes
□ Retenção de logs: 5 anos (padrão CFM)
□ Logs não editáveis (INSERT only, sem UPDATE/DELETE)
```

**Política de Retenção:**
```
□ Dados de sinais vitais: 5 anos após último registro (padrão CFM)
□ Dados de autenticação: 2 anos após inatividade
□ Logs de auditoria: 5 anos
□ Fotos de pacientes: enquanto paciente ativo + 2 anos
```

## Vetores de Ameaça e Mitigações

| Ameaça | Mitigação |
|---|---|
| Vazamento de credenciais de BD | `.env.local` no gitignore; nunca service_role no frontend |
| XSS via dados de paciente | Nunca `dangerouslySetInnerHTML`; dados sempre como texto |
| Acesso cross-clinic (admin) | RLS com `clinic_id` do JWT |
| Acesso cross-patient (familiar) | RLS com `patient_family` join |
| Injeção de Prompt (agentes IA) | Não executar código de fontes externas sem confirmação |
| Cache de dados sensíveis no browser | Service Worker: Network Only para dados de saúde |
| Sequestro de sessão | Tokens JWT de curta duração + refresh automático |
| Prompt Injection via dados maliciosos | Validação Zod em todos os inputs antes de processar |

## Checklist de Deploy para Produção

Antes de qualquer release em produção, verificar:
- [ ] Auditoria de segurança executada (`/security-audit`)
- [ ] Todas as tabelas têm RLS ativo
- [ ] `.env.local` não está no repositório
- [ ] `service_role` key não está no bundle frontend
- [ ] Política de privacidade acessível no app
- [ ] Consentimento LGPD implementado
- [ ] audit_log funcionando
- [ ] Soft delete implementado em pacientes
- [ ] Service Worker com Network Only para dados sensíveis
- [ ] HTTPS ativo (automático na Vercel)
