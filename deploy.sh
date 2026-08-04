#!/bin/bash
# ==============================================================================
# Script Deploy Otomatis - Dinasti Nasrukhan (Laravel + Inertia/React)
# ==============================================================================

set -e

# Pastikan aplikasi selalu di-up kembali jika terjadi error di tengah jalan
trap 'php artisan up 2>/dev/null || true' EXIT

echo "=== MEMULAI PROSES DEPLOYMENT ==="

# 1. Aktifkan Maintenance Mode
echo "[1/8] Mengaktifkan maintenance mode..."
php artisan down || true

# 2. Pull Kode Terbaru dari GitHub
echo "[2/8] Menarik kode terbaru dari branch main..."
git pull origin main

# 3. Install/Update PHP Dependencies (Composer)
echo "[3/8] Menginstall PHP dependencies (Composer)..."
composer install --no-dev --optimize-autoloader --no-interaction

# 4. Running Database Migration
echo "[4/8] Menjalankan migrasi database..."
php artisan migrate --force

# 5. Build Frontend Assets (Vite / React)
echo "[5/8] Membangun frontend assets (NPM)..."
if command -v npm &> /dev/null; then
    npm install
    npm run build
else
    echo "Warning: NPM tidak ditemukan di server, melewati npm run build."
fi

# 6. Clear & Cache Configuration
echo "[6/8] Memperbarui cache Laravel..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# 7. Pastikan Symlink Storage & Hak Akses
echo "[7/8] Menyetel storage link & permissions..."
php artisan storage:link || true
chmod -R 775 storage bootstrap/cache

# 8. Matikan Maintenance Mode
echo "[8/8] Mematikan maintenance mode..."
php artisan up

echo "=== DEPLOYMENT SELESAI & BERHASIL! ==="
