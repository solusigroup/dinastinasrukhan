<?php

/**
 * Laravel Root Front Controller (Untuk Shared Hosting / Subdomain)
 */

define('LARAVEL_START', microtime(true));

// Cek Mode Maintenance
if (file_exists($maintenance = __DIR__.'/storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register Composer Autoloader
require __DIR__.'/vendor/autoload.php';

// Bootstrap Laravel & Handle Request
/** @var \Illuminate\Foundation\Application $app */
$app = require_once __DIR__.'/bootstrap/app.php';

$app->handleRequest(\Illuminate\Http\Request::capture());
