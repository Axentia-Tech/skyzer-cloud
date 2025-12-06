<?php

namespace SkyzerCloud\Models;

use SkyzerCloud\Core\Database;

class User
{
    private \PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function create(array $data): ?int
    {
        try {
            $stmt = $this->db->prepare("
                INSERT INTO users (email, password_hash, first_name, last_name, role, created_at, updated_at)
                VALUES (:email, :password_hash, :first_name, :last_name, :role, NOW(), NOW())
                RETURNING id
            ");

            $stmt->execute([
                'email' => $data['email'],
                'password_hash' => password_hash($data['password'], PASSWORD_ARGON2ID),
                'first_name' => $data['first_name'] ?? null,
                'last_name' => $data['last_name'] ?? null,
                'role' => $data['role'] ?? 'USER',
            ]);

            $result = $stmt->fetch();
            return $result['id'] ?? null;
        } catch (\PDOException $e) {
            error_log("User creation error: " . $e->getMessage());
            return null;
        }
    }

    public function findByEmail(string $email): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = :email");
        $stmt->execute(['email' => $email]);
        return $stmt->fetch() ?: null;
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch() ?: null;
    }

    public function updatePterodactylInfo(int $userId, int $pteroUserId, string $pteroUsername): bool
    {
        $stmt = $this->db->prepare("
            UPDATE users 
            SET ptero_user_id = :ptero_user_id, ptero_username = :ptero_username, updated_at = NOW()
            WHERE id = :id
        ");

        return $stmt->execute([
            'id' => $userId,
            'ptero_user_id' => $pteroUserId,
            'ptero_username' => $pteroUsername,
        ]);
    }

    public function verifyPassword(string $password, string $hash): bool
    {
        return password_verify($password, $hash);
    }
}

