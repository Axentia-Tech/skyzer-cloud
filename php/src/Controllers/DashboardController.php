<?php

namespace SkyzerCloud\Controllers;

use SkyzerCloud\Core\View;
use SkyzerCloud\Core\Auth;
use SkyzerCloud\Models\Order;
use SkyzerCloud\Models\Server;
use SkyzerCloud\Services\PterodactylService;

class DashboardController
{
    public function index(): void
    {
        Auth::requireAuth();
        
        $user = Auth::user();
        $orderModel = new Order();
        $serverModel = new Server();
        $pteroService = new PterodactylService();

        $orders = $orderModel->getUserOrders($user['id']);
        $servers = $serverModel->getUserServers($user['id']);
        
        $pteroPanelUrl = $pteroService->getPanelUrl();

        View::render('dashboard/index', [
            'user' => $user,
            'orders' => $orders,
            'servers' => $servers,
            'pteroPanelUrl' => $pteroPanelUrl,
        ]);
    }
}

