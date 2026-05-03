# =============================================================================
# CuidarApp — Script de Início de Sessão
# Uso: .\scripts\session-start.ps1
# =============================================================================

$ErrorActionPreference = "Continue"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$ReportsDir = Join-Path $ProjectRoot "docs\session-reports"
$Date = Get-Date -Format "yyyy-MM-dd"
$DateTime = Get-Date -Format "yyyy-MM-dd HH:mm"
$GRAPHIFY = "C:\Users\reina\AppData\Local\Packages\PythonSoftwareFoundation.Python.3.13_qbz5n2kfra8p0\LocalCache\local-packages\Python313\Scripts\graphify.exe"

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  CuidarApp — INÍCIO DE SESSÃO" -ForegroundColor Cyan
Write-Host "  $DateTime" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# --- 1. Verificar estado do repositório ---
# Nota: passos renumerados para 1-6 após inclusão do Graphify
Write-Host "[1/5] Verificando estado do repositório..." -ForegroundColor Yellow

Set-Location $ProjectRoot

$GitStatus = git status --short
$LastCommit = git log --oneline -1
$Branch = git rev-parse --abbrev-ref HEAD

Write-Host "  Branch atual: $Branch" -ForegroundColor White
Write-Host "  Último commit: $LastCommit" -ForegroundColor White

if ($GitStatus) {
    Write-Host "  Arquivos modificados:" -ForegroundColor Yellow
    $GitStatus | ForEach-Object { Write-Host "    $_" -ForegroundColor Gray }
} else {
    Write-Host "  Repositório limpo (sem mudanças pendentes)" -ForegroundColor Green
}

# --- 2. Carregar último report de sessão ---
Write-Host ""
Write-Host "[2/5] Carregando último report de sessão..." -ForegroundColor Yellow

if (-Not (Test-Path $ReportsDir)) {
    New-Item -ItemType Directory -Path $ReportsDir | Out-Null
    Write-Host "  Diretório docs/session-reports/ criado." -ForegroundColor Gray
}

$LastReport = Get-ChildItem -Path $ReportsDir -Filter "*.md" | Sort-Object Name -Descending | Select-Object -First 1

if ($LastReport) {
    Write-Host "  Último report encontrado: $($LastReport.Name)" -ForegroundColor Green
    Write-Host ""
    Write-Host "  --- Próximos Passos do último report ---" -ForegroundColor Cyan

    $Content = Get-Content $LastReport.FullName -Raw
    $NextStepsMatch = [regex]::Match($Content, '## Próximos Passos.*?\n([\s\S]*?)(?=\n##|$)')
    if ($NextStepsMatch.Success) {
        $NextSteps = $NextStepsMatch.Groups[1].Value.Trim()
        $NextSteps -split "`n" | Where-Object { $_.Trim() -ne "" } | ForEach-Object {
            Write-Host "    $_" -ForegroundColor White
        }
    } else {
        Write-Host "    (Nenhum próximo passo registrado)" -ForegroundColor Gray
    }
    Write-Host "  ----------------------------------------" -ForegroundColor Cyan
} else {
    Write-Host "  Nenhum report anterior encontrado. Primeira sessão!" -ForegroundColor Green
}

# --- 3. Verificar dependências ---
Write-Host ""
Write-Host "[3/5] Verificando dependências do projeto..." -ForegroundColor Yellow

if (Test-Path (Join-Path $ProjectRoot "node_modules")) {
    Write-Host "  node_modules: OK" -ForegroundColor Green
} else {
    Write-Host "  node_modules não encontrado. Executando npm install..." -ForegroundColor Yellow
    Set-Location $ProjectRoot
    npm install
    Write-Host "  Dependências instaladas." -ForegroundColor Green
}

# --- 4. Verificar arquivo .env.local ---
Write-Host ""
Write-Host "[4/5] Verificando variáveis de ambiente..." -ForegroundColor Yellow

$EnvFile = Join-Path $ProjectRoot ".env.local"
$EnvExample = Join-Path $ProjectRoot ".env.example"

if (Test-Path $EnvFile) {
    $EnvContent = Get-Content $EnvFile
    $MissingVars = @()
    @("VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY") | ForEach-Object {
        $VarName = $_
        $HasVar = $EnvContent | Where-Object { $_ -match "^$VarName=.+" }
        if (-Not $HasVar) { $MissingVars += $VarName }
    }
    if ($MissingVars.Count -eq 0) {
        Write-Host "  .env.local: OK (variáveis Supabase presentes)" -ForegroundColor Green
    } else {
        Write-Host "  AVISO: Variáveis ausentes no .env.local:" -ForegroundColor Red
        $MissingVars | ForEach-Object { Write-Host "    - $_" -ForegroundColor Red }
    }
} else {
    Write-Host "  AVISO: .env.local não encontrado!" -ForegroundColor Red
    if (Test-Path $EnvExample) {
        Write-Host "  Copie .env.example para .env.local e preencha as variáveis." -ForegroundColor Yellow
    }
}

# --- 5. Graphify — Cérebro Cognitivo ---
Write-Host ""
Write-Host "[5/6] Verificando knowledge graph (Graphify)..." -ForegroundColor Yellow

$GraphJson = Join-Path $ProjectRoot "graphify-out\graph.json"

if (Test-Path $GRAPHIFY) {
    if (Test-Path $GraphJson) {
        Write-Host "  Grafo existente encontrado. Atualizando (AST-only, sem custo de API)..." -ForegroundColor Gray
        & $GRAPHIFY update $ProjectRoot 2>&1 | Select-Object -Last 3 | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
        Write-Host "  Knowledge graph atualizado." -ForegroundColor Green
    } else {
        Write-Host "  Grafo não encontrado. Execute manualmente para construir o grafo inicial:" -ForegroundColor Yellow
        Write-Host "  graphify ." -ForegroundColor Gray
        Write-Host "  (Isso requer ANTHROPIC_API_KEY configurada no ambiente)" -ForegroundColor Gray
    }

    Write-Host "  Iniciando graphify watch em background..." -ForegroundColor Gray
    Start-Process -FilePath $GRAPHIFY -ArgumentList "watch", $ProjectRoot -WindowStyle Hidden
    Write-Host "  Graphify watch: ATIVO (auto-sync ativado)" -ForegroundColor Green
} else {
    Write-Host "  Graphify não encontrado no PATH esperado." -ForegroundColor Yellow
    Write-Host "  Reinstale com: pip install graphifyy" -ForegroundColor Gray
}

# --- 6. Resumo e instruções ---
Write-Host ""
Write-Host "[6/6] Sessão pronta para iniciar." -ForegroundColor Yellow
Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  PRÓXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  1. Inicie o servidor de desenvolvimento:" -ForegroundColor White
Write-Host "     npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. No Antigravity, execute:" -ForegroundColor White
Write-Host "     /session-start" -ForegroundColor Gray
Write-Host ""
Write-Host "  3. Aguarde o briefing do Agente e defina" -ForegroundColor White
Write-Host "     a missão da sessão com o Arquiteto." -ForegroundColor White
Write-Host ""
Write-Host "  Bom desenvolvimento!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""
