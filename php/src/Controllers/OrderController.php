<?php

namespace SkyzerCloud\Controllers;

use SkyzerCloud\Core\View;
use SkyzerCloud\Core\Auth;
use SkyzerCloud\Models\Product;
use SkyzerCloud\Models\Order;
use SkyzerCloud\Services\TebexService;

class OrderController
{
    public function create(): void
    {
        Auth::requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            View::json(['error' => 'Method not allowed'], 405);
            return;
        }

        $productId = $_POST['product_id'] ?? null;
        if (!$productId) {
            View::json(['error' => 'Product ID required'], 400);
            return;
        }

        $productModel = new Product();
        $product = $productModel->findById($productId);

        if (!$product) {
            View::json(['error' => 'Product not found'], 404);
            return;
        }

        $user = Auth::user();
        $tebexService = new TebexService();

        // Create checkout URL
        if (empty($product['tebex_product_id'])) {
            View::json(['error' => 'Product not configured for Tebex'], 400);
            return;
        }

        $items = [[
            'package' => $product['tebex_product_id'],
            'quantity' => 1,
        ]];

        $returnUrl = ($_ENV['APP_URL'] ?? 'http://localhost') . '/dashboard';
        $checkoutUrl = $tebexService->createCheckout($items, $returnUrl, $user['email']);

        if (!$checkoutUrl) {
            // Fallback: redirect to Tebex store directly
            $checkoutUrl = "https://yourstore.tebex.io/checkout/packages/{$product['tebex_product_id']}";
        }

        // Create order in database
        $orderModel = new Order();
        $orderId = $orderModel->create([
            'user_id' => $user['id'],
            'product_id' => $productId,
            'payment_amount' => $product['price_amount'],
            'payment_currency' => $product['price_currency'],
            'tebex_checkout_id' => $checkoutUrl,
        ]);

        View::json([
            'success' => true,
            'checkout_url' => $checkoutUrl,
            'order_id' => $orderId,
        ]);
    }
}

