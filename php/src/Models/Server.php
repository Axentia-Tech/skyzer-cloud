<?php

namespace SkyzerCloud\Models;

use SkyzerCloud\Core\Database;

class Server
{
    private \PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function create(array $data): ?string
    {
        $stmt = $this->db->prepare("
            INSERT INTO servers (user_id, order_id, ptero_server_id, ptero_node_id, status, created_at, updated_at)
            VALUES (:user_id, :order_id, :ptero_server_id, :ptero_node_id, :status, NOW(), NOW())
            RETURNING id
        ");

        $stmt->execute([
            'user_id' => $data['user_id'],
            'order_id' => $data['order_id'],
            'ptero_server_id' => $data['ptero_server_id'] ?? null,
            'ptero_node_id' => $data['ptero_node_id'] ?? null,
            'status' => $data['status'] ?? 'pending',
        ]);

        $result = $stmt->fetch();
        return $result['id'] ?? null;
    }

    public function getUserServers(int $userId): array
    {
        $stmt = $this->db->prepare("
            SELECT s.*, o.product_id, p.name as product_name
            FROM servers s
            JOIN orders o ON s.order_id = o.id
            JOIN products p ON o.product_id = p.id
            WHERE s.user_id = :user_id
            ORDER BY s.created_at DESC
        ");
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll();
    }

    public function findByOrderId(string $orderId): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM servers WHERE order_id = :order_id");
        $stmt->execute(['order_id' => $orderId]);
        return $stmt->fetch() ?: null;
    }

    public function updateStatus(string $serverId, string $status): bool
    {
        $stmt = $this->db->prepare("UPDATE servers SET status = :status, updated_at = NOW() WHERE id = :id");
        return $stmt->execute(['id' => $serverId, 'status' => $status]);
    }
}

