<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('db:export', function () {
    $database = config('database.connections.' . config('database.default') . '.database');
    $outputFile = base_path('database_dump.sql');
    $this->info("Mengekspor database '$database' ke $outputFile ...");

    $tables = DB::select('SHOW TABLES');
    $tableKey = 'Tables_in_' . $database;

    $sqlDump = "-- Database Dump untuk $database\n";
    $sqlDump .= "-- Tanggal: " . date('Y-m-d H:i:s') . "\n";
    $sqlDump .= "SET FOREIGN_KEY_CHECKS=0;\n";
    $sqlDump .= "SET SQL_MODE = \"NO_AUTO_VALUE_ON_ZERO\";\n";
    $sqlDump .= "SET time_zone = \"+00:00\";\n\n";

    foreach ($tables as $tableObj) {
        $table = $tableObj->$tableKey ?? current((array)$tableObj);
        $this->line("Processing table: $table ...");

        $sqlDump .= "DROP TABLE IF EXISTS `$table`;\n";
        $createStmt = DB::select("SHOW CREATE TABLE `$table`")[0];
        $sqlDump .= $createStmt->{'Create Table'} . ";\n\n";

        $rows = DB::table($table)->get();
        if ($rows->count() > 0) {
            $columns = array_keys((array)$rows[0]);
            $escapedColumns = array_map(fn($col) => "`$col`", $columns);
            $sqlDump .= "INSERT INTO `$table` (" . implode(', ', $escapedColumns) . ") VALUES\n";

            $valuesList = [];
            foreach ($rows as $row) {
                $rowValues = [];
                foreach ((array)$row as $val) {
                    if (is_null($val)) {
                        $rowValues[] = "NULL";
                    } else {
                        $rowValues[] = DB::connection()->getPdo()->quote($val);
                    }
                }
                $valuesList[] = "(" . implode(', ', $rowValues) . ")";
            }
            $sqlDump .= implode(",\n", $valuesList) . ";\n\n";
        }
    }

    $sqlDump .= "SET FOREIGN_KEY_CHECKS=1;\n";
    file_put_contents($outputFile, $sqlDump);

    $this->info("BERHASIL! Database diekspor ke: database_dump.sql (" . round(filesize($outputFile) / 1024, 2) . " KB)");
})->purpose('Ekspor seluruh struktur & data database lokal ke database_dump.sql');

