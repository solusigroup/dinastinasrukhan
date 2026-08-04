<?php

/**
 * Script untuk mengekspor Database MySQL/MariaDB ke file .sql
 * Siap diimpor ke cPanel/phpMyAdmin di live production.
 */

$envFile = __DIR__ . '/.env';
$env = [];
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            list($name, $value) = explode('=', $line, 2);
            $name = trim($name);
            $value = trim($value, " \t\n\r\0\x0B\"'");
            $env[$name] = $value;
        }
    }
}

$host = $env['DB_HOST'] ?? '127.0.0.1';
$port = $env['DB_PORT'] ?? '3306';
$database = $env['DB_DATABASE'] ?? 'family_tree_nasrukhan';
$username = $env['DB_USERNAME'] ?? 'root';
$password = $env['DB_PASSWORD'] ?? '';

$outputFile = __DIR__ . '/database_dump.sql';

echo "Mengekspor database '$database' dari $host:$port...\n";

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$database;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
    ]);
} catch (PDOException $e) {
    die("Koneksi Database Gagal: " . $e->getMessage() . "\n");
}

$tables = [];
$stmt = $pdo->query("SHOW TABLES");
while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
    $tables[] = $row[0];
}

// Urutkan tabel agar anak (child) dihapus/dibuat sebelum induk (parent) untuk menghindari Foreign Key Error #1451
$priorityOrder = ['user_branch_assignments', 'spouses', 'family_members'];
usort($tables, function($a, $b) use ($priorityOrder) {
    $posA = array_search($a, $priorityOrder);
    $posB = array_search($b, $priorityOrder);
    if ($posA !== false && $posB !== false) return $posA <=> $posB;
    if ($posA !== false) return -1;
    if ($posB !== false) return 1;
    return $a <=> $b;
});

$sqlDump = "-- Database Dump untuk $database\n";
$sqlDump .= "-- Tanggal: " . date('Y-m-d H:i:s') . "\n";
$sqlDump .= "SET FOREIGN_KEY_CHECKS=0;\n";
$sqlDump .= "SET SQL_MODE = \"NO_AUTO_VALUE_ON_ZERO\";\n";
$sqlDump .= "SET time_zone = \"+00:00\";\n\n";

foreach ($tables as $table) {
    echo "Processing table: $table ...\n";

    $sqlDump .= "SET FOREIGN_KEY_CHECKS=0;\n";
    $sqlDump .= "DROP TABLE IF EXISTS `$table`;\n";

    $createStmt = $pdo->query("SHOW CREATE TABLE `$table`")->fetch(PDO::FETCH_ASSOC);
    $sqlDump .= $createStmt['Create Table'] . ";\n\n";

    $rowsStmt = $pdo->query("SELECT * FROM `$table`");
    $rows = $rowsStmt->fetchAll(PDO::FETCH_ASSOC);

    if (count($rows) > 0) {
        $columns = array_keys($rows[0]);
        $escapedColumns = array_map(function ($col) {
            return "`$col`";
        }, $columns);

        $sqlDump .= "INSERT INTO `$table` (" . implode(', ', $escapedColumns) . ") VALUES\n";

        $valuesList = [];
        foreach ($rows as $row) {
            $rowValues = [];
            foreach ($row as $val) {
                if (is_null($val)) {
                    $rowValues[] = "NULL";
                } else {
                    $rowValues[] = $pdo->quote($val);
                }
            }
            $valuesList[] = "(" . implode(', ', $rowValues) . ")";
        }

        $sqlDump .= implode(",\n", $valuesList) . ";\n\n";
    }
}

$sqlDump .= "SET FOREIGN_KEY_CHECKS=1;\n";

file_put_contents($outputFile, $sqlDump);

echo "\nSUCCESS! Database berhasil diekspor ke file:\n";
echo "$outputFile\n";
echo "Ukuran file: " . round(filesize($outputFile) / 1024, 2) . " KB\n";
