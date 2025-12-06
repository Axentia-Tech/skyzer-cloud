<?php

namespace SkyzerCloud\Core;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Auth
{
    private static ?array $user = null;

    public static function login(int $userId, string $email): void
    {
        $_SESSION['user_id'] = $userId;
        $_SESSION['user_email'] = $email;
        $_SESSION['logged_in'] = true;
    }

    public static function logout(): void
    {
        session_unset();
        session_destroy();
        self::$user = null;
    }

    public static function check(): bool
    {
        return isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true;
    }

    public static function user(): ?array
    {
        if (!self::check()) {
            return null;
        }

        if (self::$user === null) {
            $db = Database::getInstance()->getConnection();
            $stmt = $db->prepare("SELECT id, email, first_name, last_name, role, ptero_user_id FROM users WHERE id = :id");
            $stmt->execute(['id' => $_SESSION['user_id']]);
            self::$user = $stmt->fetch();
        }

        return self::$user;
    }

    public static function id(): ?int
    {
        return $_SESSION['user_id'] ?? null;
    }

    public static function requireAuth(): void
    {
        if (!self::check()) {
            View::redirect('/login');
        }
    }

    public static function generateToken(array $payload): string
    {
        $secret = $_ENV['JWT_SECRET'] ?? 'your-secret-key';
        return JWT::encode($payload, $secret, 'HS256');
    }

    public static function verifyToken(string $token): ?array
    {
        try {
            $secret = $_ENV['JWT_SECRET'] ?? 'your-secret-key';
            return (array) JWT::decode($token, new Key($secret, 'HS256'));
        } catch (\Exception $e) {
            return null;
        }
    }
}

