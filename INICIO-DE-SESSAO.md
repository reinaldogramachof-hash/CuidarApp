# Início de Sessão — CuidarApp

## Checklist

- [ ] **1. Abrir terminal PowerShell** na pasta do projeto
- [ ] **2. Executar o script de sessão**
- [ ] **3. Iniciar o servidor de desenvolvimento**
- [ ] **4. Verificar o último report de sessão**
- [ ] **5. Definir a missão da sessão com o Arquiteto**

---

## Comandos (copiar e colar)

**Terminal 1 — Script de sessão:**
```powershell
.\scripts\session-start.ps1
```

**Terminal 2 — Servidor de desenvolvimento:**
```powershell
npm run dev
```

---

## O que o script faz automaticamente

| Etapa | O que acontece |
|---|---|
| `[1/6]` Git status | Mostra branch atual e arquivos modificados |
| `[2/6]` Último report | Exibe os "Próximos Passos" da sessão anterior |
| `[3/6]` Dependências | Verifica `node_modules`, instala se necessário |
| `[4/6]` Variáveis de ambiente | Confirma `.env.local` com chaves Supabase |
| `[5/6]` Graphify | Atualiza o knowledge graph + ativa o watch em background |
| `[6/6]` Pronto | Sessão configurada |

---

## Último report de sessão

Os reports ficam em: `docs/session-reports/`

Abrir o mais recente para ver o que ficou pendente.

---

## Fim de sessão

```powershell
.\scripts\session-end.ps1
```

Gera o report em `docs/session-reports/YYYY-MM-DD.md`.

---

## Links rápidos

- [[CLAUDE]] — Documento central do projeto
- [[docs/ARCHITECTURE]] — Arquitetura do sistema
- [[docs/DATABASE]] — Schema do banco de dados
- [[graphify-out/GRAPH_REPORT]] — Knowledge graph
