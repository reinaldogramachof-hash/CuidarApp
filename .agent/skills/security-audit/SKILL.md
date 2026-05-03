---
name: security-audit
description: Auditoria de segurança do código. Use quando o usuário pedir "verificar segurança", "auditar código", antes de qualquer deploy, ou ao trabalhar com auth/RLS/dados de pacientes.
---

# Auditoria de Segurança — CuidarApp

**Objetivo:** Verificar que nenhuma vulnerabilidade de segurança ou violação de LGPD
foi introduzida no código antes de avançar para produção.

## Checklist de Auditoria

### 1. Secrets e Credenciais
```bash
# Buscar por possíveis secrets hardcoded
grep -r "api_key\|apikey\|password\|secret\|token\|supabase_url" src/ --include="*.ts" --include="*.tsx"
```
- [ ] Nenhum secret hardcoded encontrado
- [ ] `.env.local` está no `.gitignore`
- [ ] `.env.example` existe e está atualizado
- [ ] `VITE_SUPABASE_SERVICE_ROLE_KEY` NÃO existe no frontend

### 2. Row Level Security (Supabase)
Para cada tabela no schema `@.agent/rules/04-database.md`:
- [ ] RLS está habilitado (`SELECT * FROM pg_policies` no Supabase Studio)
- [ ] Policy para `SELECT`: usuários só veem dados do seu escopo
- [ ] Policy para `INSERT`: usuários só inserem dados do seu escopo
- [ ] Policy para `UPDATE`: usuários só alteram dados do seu escopo
- [ ] Sem tabelas com RLS desabilitado em produção

### 3. Validação de Entrada
- [ ] Formulários usam `react-hook-form` + `Zod`
- [ ] Schemas Zod cobrem todos os campos obrigatórios
- [ ] Inputs de texto têm `maxLength` definido
- [ ] Datas têm validação de range (não aceitar datas impossíveis)
- [ ] Uploads de arquivo: verificar tipo MIME e tamanho máximo

### 4. Autenticação e Autorização
- [ ] Rotas protegidas verificam sessão ativa antes de renderizar
- [ ] Redirecionamento para login quando sessão expirar
- [ ] Usuário não pode acessar dados de outro perfil (testar manualmente)
- [ ] Logout limpa completamente o estado da aplicação

### 5. XSS e Injeção
- [ ] Ausência de `dangerouslySetInnerHTML` (ou DOMPurify em uso se necessário)
- [ ] Dados de usuário exibidos como texto, não HTML
- [ ] URLs de redirecionamento validadas (não aceitar URLs externas arbitrárias)

### 6. LGPD
- [ ] Dados de pacientes não aparecem em URLs
- [ ] Logs de auditoria (`audit_log`) implementados para ações sensíveis
- [ ] Política de privacidade acessível no app
- [ ] Consentimento coletado no cadastro

### 7. PWA e Service Worker
- [ ] Service Worker não faz cache de dados sensíveis de pacientes
- [ ] Cache Strategy para dados de saúde: `Network First` (nunca Stale-While-Revalidate)
- [ ] Manifesto não expõe informações sensíveis

## Relatório de Auditoria
Ao final, gerar relatório com:
```markdown
# Relatório de Auditoria de Segurança — [DATA]

## Resultado: [APROVADO | REQUER CORREÇÕES]

### Itens Aprovados: [N]
### Itens Reprovados: [N]

### Críticos (bloqueiam deploy):
- [item]

### Importantes (corrigir na próxima sessão):
- [item]

### Observações:
- [observações gerais]
```

## Restrições
- Falhas CRÍTICAS bloqueiam qualquer deploy
- Reportar ao Arquiteto (Claude Code) antes de tentar corrigir falhas críticas
