<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $title ?? 'Skyzer Cloud - Minecraft Hosting' ?></title>
    <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
    <?php include __DIR__ . '/components/header.php'; ?>
    
    <main class="main-content">
        <?php 
        $viewFile = __DIR__ . '/' . ($GLOBALS['view'] ?? 'home/index') . '.php';
        if (file_exists($viewFile)) {
            extract($GLOBALS['viewData'] ?? []);
            include $viewFile;
        }
        ?>
    </main>
    
    <?php include __DIR__ . '/components/footer.php'; ?>
    
    <script src="/assets/js/main.js"></script>
</body>
</html>

