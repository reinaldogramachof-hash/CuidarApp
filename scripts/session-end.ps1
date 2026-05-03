# =============================================================================
# CuidarApp - Script de Fim de Sessao
# Uso: .\scripts\session-end.ps1
# =============================================================================

$ErrorActionPreference = "Continue"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$ReportsDir = Join-Path $ProjectRoot "docs\session-reports"
$Date = Get-Date -Format "yyyy-MM-dd"
$DateTime = Get-Date -Format "yyyy-MM-dd HH:mm"
$ReportFile = Join-Path $ReportsDir "$Date.md"

Write-Host ""
Write-Host "=============================================" -ForegroundColor Magenta
Write-Host "  CuidarApp - FIM DE SESSAO" -ForegroundColor Magenta
Write-Host "  $DateTime" -ForegroundColor Magenta
Write-Host "=============================================" -ForegroundColor Magenta
Write-Host ""

Set-Location $ProjectRoot

if (-Not (Test-Path $ReportsDir)) {
    New-Item -ItemType Directory -Path $ReportsDir | Out-Null
}

# --- 1. Verificar estado do codigo ---
Write-Host "[1/6] Verificando estado do codigo..." -ForegroundColor Yellow

$ModifiedFiles = git diff --name-only HEAD$UntrackedFiles = git ls-files --others --exclude-standard$LastCommit = git log --oneline -1$Branch = git rev-parse --abbrev-ref HEAD
Write-Host "  Branch: $Branch" -ForegroundColor White
Write-Host "  Ultimo commit: $LastCommit" -ForegroundColor White

if ($ModifiedFiles) {
    Write-Host "  Arquivos modificados nesta sessao:" -ForegroundColor Yellow
    $ModifiedFiles | ForEach-Object { Write-Host "    $_" -ForegroundColor Gray }
} else {
    Write-Host "  Nenhum arquivo modificado." -ForegroundColor Gray
}

# --- 2. Verificacoes de seguranca ---
Write-Host ""
Write-Host "[2/6] Verificacoes de seguranca..." -ForegroundColor Yellow

$SecurityIssues = @()

if ($ModifiedFiles) {
    $SecretPatterns = @("api_key\s*=", "apiKey\s*:", "password\s*=", "service_role", "secret\s*=")
    foreach ($File in $ModifiedFiles) {
        $FullPath = Join-Path $ProjectRoot $File
        if (Test-Path $FullPath) {
            $Content = Get-Content $FullPath -Raw -ErrorAction SilentlyContinue
            foreach ($Pattern in $SecretPatterns) {
                if ($Content -match $Pattern) {
                    $SecurityIssues += "POSSIVEL SECRET em $File (padrao: $Pattern)"
                }
            }
        }
    }
}

$GitIgnore = Join-Path $ProjectRoot ".gitignore"
if (Test-Path $GitIgnore) {
    $IgnoreContent = Get-Content $GitIgnore -Raw
    if ($IgnoreContent -notmatch "\.env\*" -and $IgnoreContent -notmatch "\.env\.local") {
        $SecurityIssues += ".env.local NAO esta no .gitignore!"
    }
}

if ($SecurityIssues.Count -gt 0) {
    Write-Host "  ALERTAS DE SEGURANCA DETECTADOS:" -ForegroundColor Red
    $SecurityIssues | ForEach-Object { Write-Host "  !! $_" -ForegroundColor Red }
    Write-Host ""
    Write-Host "  SESSAO BLOQUEADA: Resolva os alertas antes de commitar." -ForegroundColor Red
} else {
    Write-Host "  Nenhum problema de seguranca detectado." -ForegroundColor Green
}

# --- 3. Linter ---
Write-Host ""
Write-Host "[3/6] Executando verificacoes de qualidade..." -ForegroundColor Yellow

$PackageJson = Join-Path $ProjectRoot "package.json"
if (Test-Path $PackageJson) {
    $PkgContent = Get-Content $PackageJson -Raw | ConvertFrom-Json
    $HasLint = $null -ne $PkgContent.scripts.lint

    if ($HasLint) {
        Write-Host "  Executando npm run lint..." -ForegroundColor Gray
        npm run lint
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  Lint: PASSOU" -ForegroundColor Green
        } else {
            Write-Host "  Lint: FALHOU" -ForegroundColor Red
            Write-Host "  Execute npm run lint para ver os erros." -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "  package.json nao encontrado - verificacao ignorada." -ForegroundColor Gray
}

# --- 4. Gerar template do report ---
Write-Host ""
Write-Host "[4/6] Gerando template do Report de Sessao..." -ForegroundColor Yellow

if ($ModifiedFiles) {
    $ModifiedFilesList = ($ModifiedFiles | ForEach-Object { "- $_" }) -join "`n"
} else {
    $ModifiedFilesList = "- (nenhum arquivo modificado)"
}

$ReportContent = "# Report de Sessao - $Date`n`n"
$ReportContent += "## Missao`n[PREENCHER: Objetivo definido no inicio da sessao]`n`n"
$ReportContent += "## Status: [COMPLETO | PARCIAL | BLOQUEADO]`n`n"
$ReportContent += "## O Que Foi Feito`n`n"
$ReportContent += "### Arquivos Modificados`n$ModifiedFilesList`n`n"
$ReportContent += "### Decisoes Tecnicas Tomadas`n1. [Decisao] - Motivo: [justificativa]`n`n"
$ReportContent += "### Artefatos Gerados`n- [ ] Task List`n- [ ] Plano de Implementacao`n- [ ] Walkthrough`n- [ ] Screenshots de Validacao UI`n`n"
$ReportContent += "## Testes`n- [ ] Lint passou`n- [ ] TypeScript sem erros`n- [ ] Validacao visual (Browser Agent)`n- [ ] Sem regressoes detectadas`n`n"
$ReportContent += "## Bloqueadores / Impedimentos`n- (nenhum)`n`n"
$ReportContent += "## Proximos Passos (Para a Proxima Sessao)`n1. [Tarefa especifica com arquivo de referencia]`n2. [Tarefa especifica com arquivo de referencia]`n`n"
$ReportContent += "## Aprovacao do Arquiteto`n- [ ] APROVADO: Claude Code`n- [ ] REVISAR: _______________`n`n"
$ReportContent += "---`n*Agente de Execucao: Google Antigravity*`n*Arquiteto: Claude Code*`n*Data/Hora: $DateTime*`n"

if (-Not (Test-Path $ReportFile)) {
    Set-Content -Path $ReportFile -Value $ReportContent -Encoding UTF8
    Write-Host "  Template criado em: docs/session-reports/$Date.md" -ForegroundColor Green
    Write-Host "  Preencha o report antes de commitar!" -ForegroundColor Yellow
} else {
    Write-Host "  Report do dia ja existe: docs/session-reports/$Date.md" -ForegroundColor Yellow
    Write-Host "  Verifique e atualize manualmente se necessario." -ForegroundColor Gray
}

# --- 5. Resumo do repositorio ---
Write-Host ""
Write-Host "[5/6] Resumo do repositorio..." -ForegroundColor Yellow

$CountModified = ($ModifiedFiles | Where-Object { $_ }).Count
$CountUntracked = ($UntrackedFiles | Where-Object { $_ }).Count

Write-Host "  Arquivos modificados: $CountModified" -ForegroundColor White
Write-Host "  Arquivos novos (nao commitados): $CountUntracked" -ForegroundColor White

# --- 6. Instrucoes finais ---
Write-Host ""
Write-Host "[6/6] Proximos passos para encerrar a sessao." -ForegroundColor Yellow
Write-Host ""
Write-Host "=============================================" -ForegroundColor Magenta
Write-Host "  CHECKLIST FINAL:" -ForegroundColor Magenta
Write-Host ""

if ($SecurityIssues.Count -gt 0) {
    Write-Host "  [BLOQUEADO] Resolva os alertas de seguranca!" -ForegroundColor Red
} else {
    Write-Host "  [OK] Seguranca verificada" -ForegroundColor Green
}

Write-Host ""
Write-Host "  Passos a completar ANTES de encerrar:" -ForegroundColor White
Write-Host "  1. Preencher docs/session-reports/$Date.md" -ForegroundColor Gray
Write-Host "     (missao, decisoes, proximos passos)" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. No Antigravity, executar /session-end" -ForegroundColor Gray
Write-Host "     para gerar o Walkthrough completo" -ForegroundColor Gray
Write-Host ""
Write-Host "  3. Aguardar aprovacao do Arquiteto (Claude Code)" -ForegroundColor Gray
Write-Host ""
Write-Host "  4. Apos aprovacao, commitar o report:" -ForegroundColor Gray
Write-Host "     git add docs/session-reports/$Date.md" -ForegroundColor Gray
Write-Host "     git commit -m 'docs(session): report $Date'" -ForegroundColor Gray
Write-Host ""
Write-Host "  Ate a proxima sessao!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Magenta
Write-Host ""
