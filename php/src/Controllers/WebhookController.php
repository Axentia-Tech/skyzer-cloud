<?php

namespace SkyzerCloud\Controllers;

use SkyzerCloud\Core\View;
use SkyzerCloud\Models\Order;
use SkyzerCloud\Models\Server;
use SkyzerCloud\Models\Product;
use SkyzerCloud\Services\TebexService;
use SkyzerCloud\Services\PterodactylService;
use SkyzerCloud\Models\User;

class WebhookController
{
    public function tebex(): void
    {
        $payload = file_get_contents('php://input');
        $signature = $_SERVER['HTTP_X_TEBEX_SIGNATURE'] ?? $_SERVER['HTTP_X_WEBHOOK_SIGNATURE'] ?? '';

        $tebexService = new TebexService();
        
        // Verify webhook signature if available
        if (!empty($signature) && !$tebexService->verifyWebhook($payload, $signature)) {
            error_log("Tebex webhook signature verification failed");
            View::json(['error' => 'Invalid signature'], 401);
            return;
        }

        $data = json_decode($payload, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            error_log("Tebex webhook invalid JSON: " . json_last_error_msg());
            View::json(['error' => 'Invalid JSON'], 400);
            return;
        }

        $eventType = $data['type'] ?? $data['event'] ?? '';

        // Handle different event types
        if (in_array($eventType, ['payment.completed', 'order.completed', 'order.complete'])) {
            $this->handlePaymentCompleted($data);
        } elseif ($eventType === 'payment.failed') {
            $this->handlePaymentFailed($data);
        }

        View::json(['success' => true]);
    }

    private function handlePaymentFailed(array $data): void
    {
        $tebexOrderId = $data['id'] ?? $data['order_id'] ?? null;
        if (!$tebexOrderId) {
            return;
        }

        $orderModel = new Order();
        $order = $orderModel->findByTebexOrderId((string)$tebexOrderId);

        if ($order) {
            $orderModel->updateStatus($order['id'], 'FAILED');
        }
    }

    private function handlePaymentCompleted(array $data): void
    {
        $tebexOrderId = $data['id'] ?? $data['order_id'] ?? null;
        if (!$tebexOrderId) {
            error_log("Tebex webhook: No order ID found in payload");
            return;
        }

        $orderModel = new Order();
        $order = $orderModel->findByTebexOrderId((string)$tebexOrderId);

        if (!$order) {
            // Try to find by checkout ID
            $checkoutId = $data['checkout_id'] ?? $data['checkout'] ?? null;
            if ($checkoutId) {
                $db = \SkyzerCloud\Core\Database::getInstance()->getConnection();
                $stmt = $db->prepare("SELECT * FROM orders WHERE tebex_checkout_id = :checkout_id");
                $stmt->execute(['checkout_id' => $checkoutId]);
                $order = $stmt->fetch();
            }
            
            if (!$order) {
                error_log("Tebex webhook: Order not found for ID: {$tebexOrderId}");
                return;
            }
        }

        // Update order status
        $orderModel->updateStatus($order['id'], 'PAID', $tebexOrderId);

        // Provision server
        $productModel = new Product();
        $product = $productModel->findById($order['product_id']);

        if ($product) {
            $userModel = new User();
            $user = $userModel->findById($order['user_id']);

            if ($user && $user['ptero_user_id']) {
                $pteroService = new PterodactylService();
                $limits = json_decode($product['limits'], true);

                $serverConfig = [
                    'name' => 'Minecraft Server - ' . $order['id'],
                    'user_id' => $user['ptero_user_id'],
                    'egg_id' => $product['ptero_egg_id'] ?? 1,
                    'memory' => $limits['ram'] ?? 2048,
                    'disk' => $limits['disk'] ?? 10240,
                    'cpu' => $limits['cpu'] ?? 100,
                    'databases' => $limits['databases'] ?? 0,
                    'backups' => $limits['backups'] ?? 0,
                ];

                $pteroServer = $pteroService->createServer($serverConfig);

                if ($pteroServer) {
                    $serverModel = new Server();
                    $serverModel->create([
                        'user_id' => $user['id'],
                        'order_id' => $order['id'],
                        'ptero_server_id' => $pteroServer['attributes']['id'],
                        'status' => 'active',
                    ]);

                    $orderModel->updateStatus($order['id'], 'ACTIVE');
                }
            }
        }
    }
}

