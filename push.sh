#!/bin/bash
# Script Auto Commit & Push ke GitHub (Git Bash / Linux)
# Cara pakai:
#   ./push.sh "Pesan commit kamu"
# Atau cukup:
#   ./push.sh

set -e

echo -e "\033[36m🚀 Memulai proses Auto Commit & Push ke GitHub...\033[0m"

# 1. Cek perubahan git
if [ -z "$(git status --porcelain)" ]; then
    echo -e "\033[33mℹ️ Tidak ada perubahan berkas untuk di-commit.\033[0m"
    exit 0
fi

# 2. Ambil pesan commit dari argumen atau input prompt
MSG="$1"
if [ -z "$MSG" ]; then
    read -p "✏️  Masukkan pesan commit (tekan Enter untuk default 'update: $(date +'%Y-%m-%d %H:%M')'): " INPUT_MSG
    if [ -z "$INPUT_MSG" ]; then
        MSG="update: $(date +'%Y-%m-%d %H:%M')"
    else
        MSG="$INPUT_MSG"
    fi
fi

# 3. Git Add
echo -e "\033[32m➕ Menambahkan perubahan (git add .)...\033[0m"
git add .

# 4. Git Commit
echo -e "\033[32m📝 Membuat commit: '$MSG'...\033[0m"
git commit -m "$MSG"

# 5. Git Push
echo -e "\033[32m⬆️  Mengunggah ke GitHub (git push origin main)...\033[0m"
git push origin main

echo -e "\033[36m✅ PUSH KE GITHUB BERHASIL!\033[0m"
