<?php
use SkyzerCloud\Core\Auth;
$user = Auth::user();
?>

<div style="max-width: 1400px; margin: 0 auto; padding: 40px 20px;">
    <h1 style="font-size: 3rem; font-weight: 900; color: #ffffff; margin-bottom: 40px;">Dashboard</h1>

    <!-- User Account Card -->
    <div class="card" style="padding: 30px; margin-bottom: 30px;">
        <h2 style="font-size: 2rem; font-weight: 800; color: #ffffff; margin-bottom: 20px;">Account Info</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
            <div>
                <p style="color: #888; font-size: 0.9rem; margin-bottom: 5px;">Email</p>
                <p style="font-weight: 600; color: #ffffff;"><?= htmlspecialchars($user['email']) ?></p>
            </div>
            <div>
                <p style="color: #888; font-size: 0.9rem; margin-bottom: 5px;">Status</p>
                <p style="font-weight: 600; color: #10b981;">Active</p>
            </div>
            <?php if (!empty($user['ptero_user_id'])): ?>
            <div>
                <p style="color: #888; font-size: 0.9rem; margin-bottom: 5px;">Pterodactyl User ID</p>
                <p style="font-weight: 600; color: #ffffff;"><?= htmlspecialchars($user['ptero_user_id']) ?></p>
            </div>
            <?php endif; ?>
        </div>
    </div>

    <!-- Servers Overview -->
    <div class="card" style="padding: 30px; margin-bottom: 30px;">
        <h2 style="font-size: 2rem; font-weight: 800; color: #ffffff; margin-bottom: 20px;">Your Servers</h2>
        <?php if (empty($servers)): ?>
        <div style="text-align: center; padding: 60px 20px; color: #888;">
            <p style="font-size: 1.1rem; margin-bottom: 20px;">No servers yet. Create your first server to get started!</p>
            <a href="/pricing" class="btn btn-primary">View Plans</a>
        </div>
        <?php else: ?>
        <div style="display: grid; gap: 20px;">
            <?php foreach ($servers as $server): ?>
            <div style="padding: 20px; background-color: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h3 style="font-size: 1.3rem; font-weight: 700; color: #ffffff; margin-bottom: 10px;">
                            <?= htmlspecialchars($server['product_name'] ?? 'Server') ?>
                        </h3>
                        <p style="color: #888; font-size: 0.9rem;">Status: <span style="color: #10b981;"><?= htmlspecialchars($server['status']) ?></span></p>
                    </div>
                    <?php if (!empty($server['ptero_server_id']) && !empty($pteroPanelUrl)): ?>
                    <a href="<?= htmlspecialchars($pteroPanelUrl) ?>/server/<?= htmlspecialchars($server['ptero_server_id']) ?>" target="_blank" class="btn btn-primary">Manage Server</a>
                    <?php endif; ?>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>
    </div>

    <!-- Pterodactyl Panel iframe -->
    <?php if (!empty($pteroPanelUrl) && !empty($user['ptero_user_id'])): ?>
    <div class="card" style="padding: 30px; margin-bottom: 30px;">
        <h2 style="font-size: 2rem; font-weight: 800; color: #ffffff; margin-bottom: 20px;">Control Panel</h2>
        <div style="position: relative; width: 100%; height: 800px; border: 1px solid #2a2a2a; border-radius: 8px; overflow: hidden;">
            <iframe 
                src="<?= htmlspecialchars($pteroPanelUrl) ?>" 
                style="width: 100%; height: 100%; border: none;"
                title="Pterodactyl Control Panel"
                allow="fullscreen"
            ></iframe>
        </div>
    </div>
    <?php endif; ?>

    <!-- Billing Section -->
    <div class="card" style="padding: 30px;">
        <h2 style="font-size: 2rem; font-weight: 800; color: #ffffff; margin-bottom: 20px;">Billing</h2>
        <?php if (empty($orders)): ?>
        <div style="text-align: center; padding: 40px 20px; color: #888;">
            <p>No orders yet.</p>
        </div>
        <?php else: ?>
        <div style="display: grid; gap: 15px;">
            <?php foreach ($orders as $order): ?>
            <div style="padding: 20px; background-color: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h3 style="font-size: 1.1rem; font-weight: 700; color: #ffffff; margin-bottom: 5px;">
                        <?= htmlspecialchars($order['product_name']) ?>
                    </h3>
                    <p style="color: #888; font-size: 0.9rem;">
                        <?= date('d.m.Y', strtotime($order['created_at'])) ?> • 
                        <?= htmlspecialchars($order['payment_currency']) ?> <?= number_format($order['payment_amount'], 2) ?>
                    </p>
                </div>
                <div>
                    <span style="padding: 6px 12px; background-color: <?= $order['status'] === 'PAID' ? '#10b98120' : '#f59e0b20' ?>; color: <?= $order['status'] === 'PAID' ? '#10b981' : '#f59e0b' ?>; border-radius: 6px; font-size: 0.85rem; font-weight: 600;">
                        <?= htmlspecialchars($order['status']) ?>
                    </span>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>
    </div>
</div>

