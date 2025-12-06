<?php

namespace SkyzerCloud\Models;

use SkyzerCloud\Core\Database;

class Order
{
    private \PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function create(array $data): ?string
    {
        try {
            $stmt = $this->db->prepare("
                INSERT INTO orders (user_id, product_id, status, payment_amount, payment_currency, tebex_checkout_id, created_at, updated_at)
                VALUES (:user_id, :product_id, :status, :payment_amount, :payment_currency, :tebex_checkout_id, NOW(), NOW())
                RETURNING id
            ");

            $stmt->execute([
                'user_id' => $data['user_id'],
                'product_id' => $data['product_id'],
                'status' => $data['status'] ?? 'PENDING',
                'payment_amount' => $data['payment_amount'],
                'payment_currency' => $data['payment_currency'] ?? 'EUR',
                'tebex_checkout_id' => $data['tebex_checkout_id'] ?? null,
            ]);

            $result = $stmt->fetch();
            return $result['id'] ?? null;
        } catch (\PDOException $e) {
            error_log("Order creation error: " . $e->getMessage());
            return null;
        }
    }

    public function findByTebexOrderId(string $tebexOrderId): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM orders WHERE tebex_order_id = :tebex_order_id");
        $stmt->execute(['tebex_order_id' => $tebexOrderId]);
        return $stmt->fetch() ?: null;
    }

    public function updateStatus(string $orderId, string $status, ?string $tebexOrderId = null): bool
    {
        $sql = "UPDATE orders SET status = :status, updated_at = NOW()";
        $params = ['order_id' => $orderId, 'status' => $status];

        if ($tebexOrderId) {
            $sql .= ", tebex_order_id = :tebex_order_id, paid_at = NOW()";
            $params['tebex_order_id'] = $tebexOrderId;
        }

        $sql .= " WHERE id = :order_id";

        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }

    public function getUserOrders(int $userId): array
    {
        $stmt = $this->db->prepare("
            SELECT o.*, p.name as product_name, p.slug as product_slug
            FROM orders o
            JOIN products p ON o.product_id = p.id
            WHERE o.user_id = :user_id
            ORDER BY o.created_at DESC
        ");
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll();
    }

    public function findById(string $id, ?int $userId = null): ?array
    {
        $sql = "SELECT o.*, p.name as product_name, p.slug as product_slug
                FROM orders o
                JOIN products p ON o.product_id = p.id
                WHERE o.id = :id";
        
        $params = ['id' => $id];
        
        if ($userId) {
            $sql .= " AND o.user_id = :user_id";
            $params['user_id'] = $userId;
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetch() ?: null;
    }
}

