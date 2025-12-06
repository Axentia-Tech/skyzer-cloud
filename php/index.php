<?php
require_once __DIR__ . '/vendor/autoload.php';

use SkyzerCloud\Core\Router;
use SkyzerCloud\Core\Database;
use Dotenv\Dotenv;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Initialize database connection
Database::getInstance();

// Start session
session_start();

// Initialize router
$router = new Router();

// Define routes
require_once __DIR__ . '/routes.php';

// Dispatch request
$router->dispatch();

