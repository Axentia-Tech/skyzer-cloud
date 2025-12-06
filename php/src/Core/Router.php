<?php

namespace SkyzerCloud\Core;

class Router
{
    private array $routes = [];
    private array $middlewares = [];

    public function get(string $path, $handler, array $middlewares = []): void
    {
        $this->addRoute('GET', $path, $handler, $middlewares);
    }

    public function post(string $path, $handler, array $middlewares = []): void
    {
        $this->addRoute('POST', $path, $handler, $middlewares);
    }

    public function put(string $path, $handler, array $middlewares = []): void
    {
        $this->addRoute('PUT', $path, $handler, $middlewares);
    }

    public function delete(string $path, $handler, array $middlewares = []): void
    {
        $this->addRoute('DELETE', $path, $handler, $middlewares);
    }

    private function addRoute(string $method, string $path, $handler, array $middlewares): void
    {
        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'handler' => $handler,
            'middlewares' => $middlewares,
        ];
    }

    public function dispatch(): void
    {
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $uri = rtrim($uri, '/') ?: '/';

        foreach ($this->routes as $route) {
            $pattern = $this->convertToRegex($route['path']);
            
            if ($route['method'] === $method && preg_match($pattern, $uri, $matches)) {
                // Execute middlewares
                foreach ($route['middlewares'] as $middleware) {
                    if (is_callable($middleware)) {
                        $result = $middleware();
                        if ($result === false) {
                            return;
                        }
                    }
                }

                // Extract parameters
                array_shift($matches);
                $params = $matches;

                // Execute handler
                if (is_callable($route['handler'])) {
                    call_user_func_array($route['handler'], $params);
                    return;
                } elseif (is_string($route['handler']) && strpos($route['handler'], '@') !== false) {
                    [$controller, $method] = explode('@', $route['handler']);
                    $controllerClass = "SkyzerCloud\\Controllers\\{$controller}";
                    if (class_exists($controllerClass)) {
                        $controllerInstance = new $controllerClass();
                        if (method_exists($controllerInstance, $method)) {
                            call_user_func_array([$controllerInstance, $method], $params);
                            return;
                        }
                    }
                }
            }
        }

        // 404 Not Found
        http_response_code(404);
        try {
            View::render('errors/404');
        } catch (\Exception $e) {
            echo "<h1>404 - Page Not Found</h1>";
        }
    }

    private function convertToRegex(string $path): string
    {
        $pattern = preg_replace('/\{(\w+)\}/', '([^/]+)', $path);
        return '#^' . $pattern . '$#';
    }
}

