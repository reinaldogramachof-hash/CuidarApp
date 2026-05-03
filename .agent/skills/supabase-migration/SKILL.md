---
name: supabase-migration
description: Cria e aplica migrations de banco de dados Supabase de forma segura. Use quando o usuário pedir para "adicionar coluna", "criar tabela", "modificar schema", "nova tabela", "alterar banco" ou similar.
---

# Protocolo de Migration Supabase

**Objetivo:** Modificar o schema do banco de dados sem perda de dados acidental,
seguindo os padrões de segurança e LGPD do projeto.

## Passos

### 1. Analisar Estado Atual
- Leia `@.agent/rules/04-database.md` para o schema atual
- Liste as migrations existentes: `ls supabase/migrations/`
- Identifique a última migration aplicada

### 2. Gerar o Arquivo de Migration
```bash
# Criar arquivo de migration com timestamp
supabase migration new <nome_descritivo_snake_case>
```

Escrever o SQL no arquivo gerado em `supabase/migrations/`.

### 3. VERIFICAÇÃO DE SEGURANÇA CRÍTICA
Antes de qualquer execução, leia o SQL gerado e verifique:

**PARE IMEDIATAMENTE e sinalize ao Arquiteto se o SQL contiver:**
- `DROP TABLE` — perda irreversível de dados
- `DROP COLUMN` — perda irreversível de dados
- `DELETE FROM` sem `WHERE` — deleção em massa
- `TRUNCATE` — deleção em massa
- Remoção de políticas RLS existentes sem substituição
- Qualquer operação que possa violar LGPD

**Continue somente se aprovado ou se o SQL for apenas:**
- `CREATE TABLE`
- `ALTER TABLE ... ADD COLUMN`
- `CREATE INDEX`
- `CREATE POLICY`
- `INSERT INTO` (dados de seed)

### 4. Apresentar ao Arquiteto
Exibir o SQL completo e aguardar aprovação explícita antes de qualquer execução.

### 5. Aplicar Migration (somente após aprovação)
```bash
# Desenvolvimento
supabase db push

# Verificar que foi aplicada
supabase migration list
```

### 6. Verificação Pós-Migration
- Testar que as políticas RLS continuam funcionando
- Verificar que o TypeScript ainda compila (tipos do Supabase podem precisar regenerar)
- Regenerar tipos se necessário: `supabase gen types typescript --local > src/types/supabase.ts`

### 7. Atualizar Documentação
- Atualizar `@.agent/rules/04-database.md` com as novas tabelas/colunas
- Atualizar `@docs/DATABASE.md` se necessário

## Restrições
- NUNCA aplicar migrations sem aprovação do Arquiteto
- NUNCA apagar dados de produção sem backup confirmado
- Sempre usar nomes descritivos nas migrations (não `migration_001`)
- RLS obrigatório: toda nova tabela DEVE ter `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`
