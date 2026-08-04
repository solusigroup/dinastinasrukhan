<?php
/**
 * Script Impor Database Otomatis ke Live Production
 * Mengimpor database_dump.sql (Data Family Members, Spouses, Users real)
 */

$envFile = __DIR__ . '/.env';
$env = [];
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            list($name, $value) = explode('=', $line, 2);
            $env[trim($name)] = trim($value, " \t\n\r\0\x0B\"'");
        }
    }
}

$host = $env['DB_HOST'] ?? '127.0.0.1';
$port = $env['DB_PORT'] ?? '3306';
$database = $env['DB_DATABASE'] ?? '';
$username = $env['DB_USERNAME'] ?? '';
$password = $env['DB_PASSWORD'] ?? '';

$sqlFile = __DIR__ . '/database_dump.sql';

if (!file_exists($sqlFile)) {
    die("<h2 style='color: red;'>Error: File database_dump.sql tidak ditemukan di root server!</h2>");
}

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$database;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
    
    // Matikan Foreign Key Checks agar DROP TABLE tidak error
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");

    $sql = file_get_contents($sqlFile);
    $pdo->exec($sql);

    // Hidupkan kembali Foreign Key Checks
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");

    echo "<div style='font-family: sans-serif; padding: 20px; border: 2px solid green; background: #eef9ee; border-radius: 8px;'>";
    echo "<h2 style='color: green;'>SUKSES IMPOR DATA BASE!</h2>";
    echo "<p>Data real <b>Family Members</b>, <b>Spouses (Pasangan)</b>, dan <b>Users</b> berhasil diimpor sepenuhnya ke database <code>$database</code>.</p>";
    echo "<p>Ukuran file SQL: " . round(filesize($sqlFile) / 1024, 2) . " KB</p>";
    echo "<hr><p style='color: red;'><b>PENTING:</b> Hapus file <code>import_database.php</code> dan <code>database_dump.sql</code> dari server setelah ini untuk alasan keamanan.</p>";
    echo "</div>";

} catch (Exception $e) {
    echo "<div style='font-family: sans-serif; padding: 20px; border: 2px solid red; background: #fdeeee; border-radius: 8px;'>";
    echo "<h2 style='color: red;'>GAGAL IMPOR DATABASE:</h2>";
    echo "<pre>" . htmlspecialchars($e->getMessage()) . "</pre>";
    echo "</div>";
}
