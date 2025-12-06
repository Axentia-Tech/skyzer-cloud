<?php

use SkyzerCloud\Core\Router;
use SkyzerCloud\Core\Auth;

// Home
$router->get('/', 'HomeController@index');

// Pricing
$router->get('/pricing', 'PricingController@index');

// Auth
$router->get('/login', 'AuthController@showLogin');
$router->post('/login', 'AuthController@login');
$router->get('/register', 'AuthController@showRegister');
$router->post('/register', 'AuthController@register');
$router->get('/logout', 'AuthController@logout');

// Dashboard (protected)
$router->get('/dashboard', 'DashboardController@index', [
    function() {
        Auth::requireAuth();
        return true;
    }
]);

// Orders (protected)
$router->post('/api/orders/create', 'OrderController@create', [
    function() {
        Auth::requireAuth();
        return true;
    }
]);

// Webhooks
$router->post('/api/webhooks/tebex', 'WebhookController@tebex');

// Legal pages
$router->get('/terms', function() {
    \SkyzerCloud\Core\View::render('legal/terms');
});

$router->get('/privacy', function() {
    \SkyzerCloud\Core\View::render('legal/privacy');
});

$router->get('/refund', function() {
    \SkyzerCloud\Core\View::render('legal/refund');
});

