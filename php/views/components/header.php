<?php
use SkyzerCloud\Core\Auth;
$isLoggedIn = Auth::check();
$user = Auth::user();
?>
<header class="header transition-smooth">
    <div class="header-inner">
        <a href="/" class="logo">⚡ Skyzer Cloud</a>
        <nav class="nav">
            <a href="/pricing" style="color: inherit; font-size: 0.95rem; font-weight: 600;">Minecraft</a>
            <a href="/bot-hosting" style="color: inherit; font-size: 0.95rem; font-weight: 600;">Bot Hosting</a>
            <?php if ($isLoggedIn): ?>
                <a href="/dashboard" class="btn" style="padding: 10px 24px; font-size: 0.9rem; background: transparent; border: 2px solid #ff2d2d; color: #ff2d2d;">Dashboard</a>
                <a href="/logout" class="btn" style="padding: 10px 24px; font-size: 0.9rem; background: transparent; border: 2px solid #666; color: #666;">Logout</a>
            <?php else: ?>
                <a href="/login" class="btn" style="padding: 10px 24px; font-size: 0.9rem; background: transparent; border: 2px solid #666; color: #666;">Login</a>
                <a href="/register" class="btn btn-primary" style="padding: 10px 24px; font-size: 0.9rem;">Register</a>
            <?php endif; ?>
        </nav>
    </div>
</header>

