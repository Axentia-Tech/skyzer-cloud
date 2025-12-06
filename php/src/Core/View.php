<?php

namespace SkyzerCloud\Core;

class View
{
    public static function render(string $view, array $data = []): void
    {
        extract($data);
        
        $viewFile = __DIR__ . '/../../views/' . $view . '.php';
        
        if (!file_exists($viewFile)) {
            throw new \Exception("View file not found: {$view}");
        }

        // Set view variable for layout
        $GLOBALS['view'] = $view;
        $GLOBALS['viewData'] = $data;
        
        require_once __DIR__ . '/../../views/layout.php';
    }

    public static function renderPartial(string $view, array $data = []): string
    {
        extract($data);
        
        $viewFile = __DIR__ . '/../../views/' . $view . '.php';
        
        if (!file_exists($viewFile)) {
            throw new \Exception("View file not found: {$view}");
        }

        ob_start();
        require $viewFile;
        return ob_get_clean();
    }

    public static function json(array $data, int $statusCode = 200): void
    {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }

    public static function redirect(string $url): void
    {
        header("Location: {$url}");
        exit;
    }
}

