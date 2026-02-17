<?php
// MySQL (PDO) connection and table initialization
// Configure via environment variables or edit the defaults below
$dbHost = getenv('DB_HOST') ?: '127.0.0.1';
$dbPort = getenv('DB_PORT') ?: '3306';
$dbName = getenv('DB_NAME') ?: 'antifraud';
$dbUser = getenv('DB_USER') ?: 'root';
$dbPass = getenv('DB_PASS') ?: '';

try {
    $dsn = "mysql:host={$dbHost};port={$dbPort};charset=utf8mb4";
    // connect without dbname first to ensure database exists
    $tmp = new PDO($dsn, $dbUser, $dbPass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

    // create database if it doesn't exist
    $tmp->exec("CREATE DATABASE IF NOT EXISTS `" . str_replace('`','``',$dbName) . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    // now connect to the actual database
    $dsnDb = "mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4";
    $pdo = new PDO($dsnDb, $dbUser, $dbPass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

    // create table if not exists
    $create = "CREATE TABLE IF NOT EXISTS `victims` (
      `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
      `name` VARCHAR(255) NOT NULL,
      `email` VARCHAR(191) DEFAULT NULL,
      `phone` VARCHAR(50) DEFAULT NULL,
      `dob` DATE DEFAULT NULL,
      `last_four` VARCHAR(10) DEFAULT NULL,
      `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

    $pdo->exec($create);

} catch (Exception $e) {
    header('Content-Type: application/json', true, 500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    exit;
}
