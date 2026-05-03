# Workflow: Revisão de Código

**Gatilho:** `/review`

## Revisão de Código Abrangente

### 1. Carregamento de Contexto
- Identificar todos os arquivos modificados no branch atual: `git diff --name-only main`
- Carregar apenas os arquivos alterados (não o projeto inteiro)

### 2. Análise Estática
- Executar: `npm run lint` — capturar saída completa
- Executar: `npm run type-check` (ou `tsc --noEmit`) — capturar erros de tipo

### 3. Revisão Semântica
Para cada arquivo alterado, analisar:

**Segurança:**
- Existem secrets hardcoded?
- Existe `dangerouslySetInnerHTML` sem sanitização?
- Dados sensíveis em URLs ou logs?

**Qualidade:**
- Uso de `any` em TypeScript?
- Código incompleto (placeholders `// TODO`, `// ...rest of code`)?
- Funções com mais de 40 linhas?

**Padrões do Projeto:**
- Componentes de Classe em vez de Funcionais?
- Uso de bibliotecas proibidas (moment.js, Redux sem justificativa)?
- CSS inline ou arquivos `.css` separados criados?

**Performance:**
- Re-renders desnecessários (props mudando em cada render)?
- Queries sem `staleTime` configurado?
- Imagens sem otimização?

### 4. Validação Visual (se arquivos de UI foram alterados)
- Acionar subagente de navegador
- Navegar pelas rotas afetadas pelas mudanças
- Verificar responsividade mobile (375px) e desktop (1280px)
- Screenshot de evidência

### 5. Geração de Relatório
Gerar relatório categorizado:

```markdown
## Relatório de Revisão — [DATA]

### Crítico (deve corrigir antes de avançar)
- [ ] [arquivo:linha] — [descrição]

### Importante (corrigir na próxima sessão)
- [ ] [arquivo:linha] — [descrição]

### Menor (sugestão)
- [ ] [arquivo:linha] — [descrição]

### Aprovado sem ressalvas
- [arquivo] — OK
```

Apresentar ao Arquiteto (Claude Code) para revisão final.
