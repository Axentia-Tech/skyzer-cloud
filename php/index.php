<?php
// Error reporting for development
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Check if vendor directory exists
if (!file_exists(__DIR__ . '/vendor/autoload.php')) {
    die('Error: Composer dependencies not installed. Please run: composer install');
}

require_once __DIR__ . '/vendor/autoload.php';

use SkyzerCloud\Core\Router;
use SkyzerCloud\Core\Database;
use Dotenv\Dotenv;

// Load environment variables
try {
    if (file_exists(__DIR__ . '/.env')) {
        $dotenv = Dotenv::createImmutable(__DIR__);
        $dotenv->load();
    } else {
        // Try to create .env from .env.example
        if (file_exists(__DIR__ . '/.env.example')) {
            copy(__DIR__ . '/.env.example', __DIR__ . '/.env');
            $dotenv = Dotenv::createImmutable(__DIR__);
            $dotenv->load();
        } else {
            error_log('Warning: .env file not found. Using default values.');
        }
    }
} catch (\Exception $e) {
    error_log('Error loading .env file: ' . $e->getMessage());
}

// Initialize database connection
try {
    Database::getInstance();
} catch (\Exception $e) {
    error_log('Database connection error: ' . $e->getMessage());
    // Continue anyway - database might not be configured yet
}

// Start session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Initialize router
$router = new Router();

// Define routes
if (file_exists(__DIR__ . '/routes.php')) {
    require_once __DIR__ . '/routes.php';
} else {
    die('Error: routes.php not found');
}

// Dispatch request
try {
    $router->dispatch();
} catch (\Exception $e) {
    error_log('Router error: ' . $e->getMessage());
    http_response_code(500);
    echo '<h1>500 - Internal Server Error</h1>';
    if (ini_get('display_errors')) {
        echo '<pre>' . htmlspecialchars($e->getMessage()) . '</pre>';
        echo '<pre>' . htmlspecialchars($e->getTraceAsString()) . '</pre>';
    }
}

