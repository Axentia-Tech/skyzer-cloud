<?php

namespace SkyzerCloud\Models;

use SkyzerCloud\Core\Database;

class Product
{
    private \PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function getAll(): array
    {
        try {
            $stmt = $this->db->query("SELECT * FROM products WHERE is_active = true ORDER BY price_amount ASC");
            return $stmt->fetchAll() ?: [];
        } catch (\PDOException $e) {
            error_log("Product getAll error: " . $e->getMessage());
            return [];
        }
    }

    public function findById(string $id): ?array
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM products WHERE id = :id AND is_active = true");
            $stmt->execute(['id' => $id]);
            $result = $stmt->fetch();
            return $result ?: null;
        } catch (\PDOException $e) {
            error_log("Product findById error: " . $e->getMessage());
            return null;
        }
    }

    public function findBySlug(string $slug): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM products WHERE slug = :slug AND is_active = true");
        $stmt->execute(['slug' => $slug]);
        return $stmt->fetch() ?: null;
    }
}

