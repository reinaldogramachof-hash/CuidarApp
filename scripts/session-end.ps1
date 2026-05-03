# =============================================================================
# CuidarApp — Script de Fim de Sessão
# Uso: .\scripts\session-end.ps1
# =============================================================================

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$ReportsDir = Join-Path $ProjectRoot "docs\session-reports"
$Date = Get-Date -Format "yyyy-MM-dd"
$DateTime = Get-Date -Format "yyyy-MM-dd HH:mm"
$ReportFile = Join-Path $ReportsDir "$Date.md"

Write-Host ""
Write-Host "=============================================" -ForegroundColor Magenta
Write-Host "  CuidarApp — FIM DE SESSÃO" -ForegroundColor Magenta
Write-Host "  $DateTime" -ForegroundColor Magenta
Write-Host "=============================================" -ForegroundColor Magenta
Write-Host ""

Set-Location $ProjectRoot

if (-Not (Test-Path $ReportsDir)) {
    New-Item -ItemType Directory -Path $ReportsDir | Out-Null
}

# --- 1. Verificar estado do código ---
Write-Host "[1/6] Verificando estado do código..." -ForegroundColor Yellow

$GitStatus = git status --short 2>&1
$ModifiedFiles = git diff --name-only HEAD 2>&1
$UntrackedFiles = git ls-files --others --exclude-standard 2>&1
$LastCommit = git log --oneline -1 2>&1
$Branch = git rev-parse --abbrev-ref HEAD 2>&1

Write-Host "  Branch: $Branch" -ForegroundColor White
Write-Host "  Último commit: $LastCommit" -ForegroundColor White

if ($ModifiedFiles) {
    Write-Host "  Arquivos modificados nesta sessão:" -ForegroundColor Yellow
    $ModifiedFiles | ForEach-Object { Write-Host "    $_" -ForegroundColor Gray }
} else {
    Write-Host "  Nenhum arquivo modificado." -ForegroundColor Gray
}

# --- 2. Verificações de segurança ---
Write-Host ""
Write-Host "[2/6] Verificações de segurança..." -ForegroundColor Yellow

$SecurityIssues = @()

# Verificar secrets hardcoded em arquivos modificados
if ($ModifiedFiles) {
    $SecretPatterns = @("api_key\s*=", "apiKey\s*:", "password\s*=", "service_role", "secret\s*=")
    foreach ($File in $ModifiedFiles) {
        $FullPath = Join-Path $ProjectRoot $File
        if (Test-Path $FullPath) {
            $Content = Get-Content $FullPath -Raw -ErrorAction SilentlyContinue
            foreach ($Pattern in $SecretPatterns) {
                if ($Content -match $Pattern) {
                    $SecurityIssues += "POSSÍVEL SECRET em $File (padrão: $Pattern)"
                }
            }
        }
    }
}

# Verificar .env.local no git
$GitIgnore = Join-Path $ProjectRoot ".gitignore"
if (Test-Path $GitIgnore) {
    $IgnoreContent = Get-Content $GitIgnore -Raw
    if ($IgnoreContent -notmatch "\.env\.local") {
        $SecurityIssues += ".env.local NÃO está no .gitignore!"
    }
}

if ($SecurityIssues.Count -gt 0) {
    Write-Host "  ALERTAS DE SEGURANÇA DETECTADOS:" -ForegroundColor Red
    $SecurityIssues | ForEach-Object { Write-Host "  !! $_" -ForegroundColor Red }
    Write-Host ""
    Write-Host "  SESSÃO BLOQUEADA: Resolva os alertas antes de commitar." -ForegroundColor Red
} else {
    Write-Host "  Nenhum problema de segurança detectado." -ForegroundColor Green
}

# --- 3. Linter ---
Write-Host ""
Write-Host "[3/6] Executando verificações de qualidade..." -ForegroundColor Yellow

$PackageJson = Join-Path $ProjectRoot "package.json"
if (Test-Path $PackageJson) {
    $PkgContent = Get-Content $PackageJson -Raw | ConvertFrom-Json
    $HasLint = $PkgContent.scripts.lint -ne $null
    $HasTypeCheck = $PkgContent.scripts."type-check" -ne $null

    if ($HasLint) {
        Write-Host "  Executando npm run lint..." -ForegroundColor Gray
        $LintResult = npm run lint 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  Lint: PASSOU" -ForegroundColor Green
        } else {
            Write-Host "  Lint: FALHOU" -ForegroundColor Red
            Write-Host "  Execute 'npm run lint' para ver os erros." -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "  package.json não encontrado — verificação ignorada." -ForegroundColor Gray
}

# --- 4. Gerar template do report ---
Write-Host ""
Write-Host "[4/6] Gerando template do Report de Sessão..." -ForegroundColor Yellow

$ModifiedFilesList = if ($ModifiedFiles) {
    ($ModifiedFiles | ForEach-Object { "- ``$_``" }) -join "`n"
} else {
    "- (nenhum arquivo modificado)"
}

$ReportTemplate = @"
# Report de Sessão — $Date

## Missão
[PREENCHER: Objetivo definido no início da sessão]

## Status: [COMPLETO | PARCIAL | BLOQUEADO]

## O Que Foi Feito

### Arquivos Modificados
$ModifiedFilesList

### Decisões Técnicas Tomadas
1. [Decisão] — Motivo: [justificativa]

### Artefatos Gerados
- [ ] Task List
- [ ] Plano de Implementação
- [ ] Walkthrough
- [ ] Screenshots de Validação UI

## Testes
- [ ] Lint passou
- [ ] TypeScript sem erros
- [ ] Validação visual (Browser Agent)
- [ ] Sem regressões detectadas

## Bloqueadores / Impedimentos
- (nenhum)

## Próximos Passos (Para a Próxima Sessão)
1. [Tarefa específica com arquivo de referência]
2. [Tarefa específica com arquivo de referência]

## Aprovação do Arquiteto
- [ ] APROVADO: Claude Code
- [ ] REVISAR: _______________

---
*Agente de Execução: Google Antigravity*
*Arquiteto: Claude Code*
*Data/Hora: $DateTime*
"@

if (-Not (Test-Path $ReportFile)) {
    Set-Content -Path $ReportFile -Value $ReportTemplate -Encoding UTF8
    Write-Host "  Template criado em: docs/session-reports/$Date.md" -ForegroundColor Green
    Write-Host "  Preencha o report antes de commitar!" -ForegroundColor Yellow
} else {
    Write-Host "  Report do dia já existe: docs/session-reports/$Date.md" -ForegroundColor Yellow
    Write-Host "  Verifique e atualize manualmente se necessário." -ForegroundColor Gray
}

# --- 5. Resumo do repositório ---
Write-Host ""
Write-Host "[5/6] Resumo do repositório..." -ForegroundColor Yellow

$Stats = @{
    Modificados = ($ModifiedFiles | Where-Object { $_ }).Count
    NaoTrackeados = ($UntrackedFiles | Where-Object { $_ }).Count
}

Write-Host "  Arquivos modificados: $($Stats.Modificados)" -ForegroundColor White
Write-Host "  Arquivos novos (não commitados): $($Stats.NaoTrackeados)" -ForegroundColor White

# --- 6. Instruções finais ---
Write-Host ""
Write-Host "[6/6] Próximos passos para encerrar a sessão." -ForegroundColor Yellow
Write-Host ""
Write-Host "=============================================" -ForegroundColor Magenta
Write-Host "  CHECKLIST FINAL:" -ForegroundColor Magenta
Write-Host ""

if ($SecurityIssues.Count -gt 0) {
    Write-Host "  [BLOQUEADO] Resolva os alertas de segurança!" -ForegroundColor Red
} else {
    Write-Host "  [OK] Segurança verificada" -ForegroundColor Green
}

Write-Host ""
Write-Host "  Passos a completar ANTES de encerrar:" -ForegroundColor White
Write-Host "  1. Preencher docs/session-reports/$Date.md" -ForegroundColor Gray
Write-Host "     (missão, decisões, próximos passos)" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. No Antigravity, executar /session-end" -ForegroundColor Gray
Write-Host "     para gerar o Walkthrough completo" -ForegroundColor Gray
Write-Host ""
Write-Host "  3. Aguardar aprovação do Arquiteto (Claude Code)" -ForegroundColor Gray
Write-Host ""
Write-Host "  4. Após aprovação, commitar o report:" -ForegroundColor Gray
Write-Host "     git add docs/session-reports/$Date.md" -ForegroundColor Gray
Write-Host "     git commit -m 'docs(session): report $Date'" -ForegroundColor Gray
Write-Host ""
Write-Host "  Até a próxima sessão!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Magenta
Write-Host ""
