@echo off
rem Script Auto Commit & Push ke GitHub (Windows CMD)
rem Cara pakai:
rem   push.bat "Pesan commit kamu"
rem Atau cukup:
rem   push.bat

echo ===================================================
echo 🚀 Memulai proses Auto Commit & Push ke GitHub...
echo ===================================================

set MSG=%~1

if "%MSG%"=="" (
    set /p MSG="✏️  Masukkan pesan commit (tekan Enter untuk default 'update'): "
)

if "%MSG%"=="" (
    set MSG=update %date% %time%
)

echo ➕ Menambahkan perubahan (git add .)...
git add .

echo 📝 Membuat commit: "%MSG%"...
git commit -m "%MSG%"

echo ⬆️  Mengunggah ke GitHub (git push origin main)...
git push origin main

echo ===================================================
echo ✅ PUSH KE GITHUB BERHASIL!
echo ===================================================
