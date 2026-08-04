param (
    [string]$msg = ""
)

$ErrorActionPreference = "Continue"

Write-Host "[1/4] Memulai Auto Commit & Push..." -ForegroundColor Cyan

if ([string]::IsNullOrWhitespace($msg)) {
    $dateStr = Get-Date -Format "yyyy-MM-dd HH:mm"
    $msg = "update: $dateStr"
}

Write-Host "[2/4] git add ." -ForegroundColor Green
git add .

Write-Host "[3/4] git commit -m '$msg'" -ForegroundColor Green
git commit -m "$msg"

Write-Host "[4/4] git push origin main" -ForegroundColor Green
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ">>> PUSH SUKSES! <<<" -ForegroundColor Cyan
} else {
    Write-Host ">>> PUSH GAGAL! Periksa log error di atas. <<<" -ForegroundColor Red
}
