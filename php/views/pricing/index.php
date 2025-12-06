<?php
// Default products if none in database
$defaultProducts = [
    ['name' => 'Chicken', 'ram' => '3GB', 'storage' => '5 GB', 'cpu' => '200%', 'price' => 'Free', 'color' => '#888888', 'popular' => false],
    ['name' => 'Zombie', 'ram' => '2GB', 'storage' => '5 GB', 'cpu' => '200%', 'price' => '€1.99', 'color' => '#4a9eff', 'popular' => false],
    ['name' => 'Skeleton', 'ram' => '3GB', 'storage' => '10 GB', 'cpu' => '200%', 'price' => '€2.99', 'color' => '#7c3aed', 'popular' => false],
    ['name' => 'Creeper', 'ram' => '4GB', 'storage' => '15 GB', 'cpu' => '250%', 'price' => '€3.99', 'color' => '#10b981', 'popular' => true],
    ['name' => 'Slime', 'ram' => '6GB', 'storage' => '20 GB', 'cpu' => '300%', 'price' => '€5.99', 'color' => '#f59e0b', 'popular' => false],
    ['name' => 'Villager', 'ram' => '8GB', 'storage' => '25 GB', 'cpu' => '400%', 'price' => '€7.99', 'color' => '#ec4899', 'popular' => false],
    ['name' => 'Ghast', 'ram' => '10GB', 'storage' => '30 GB', 'cpu' => '500%', 'price' => '€9.99', 'color' => '#14b8a6', 'popular' => false],
    ['name' => 'Blaze', 'ram' => '12GB', 'storage' => '40 GB', 'cpu' => '600%', 'price' => '€11.99', 'color' => '#f97316', 'popular' => false],
    ['name' => 'Enderman', 'ram' => '16GB', 'storage' => '50 GB', 'cpu' => '800%', 'price' => '€15.99', 'color' => '#6366f1', 'popular' => false],
];

// Convert database products to display format
$displayProducts = [];
if (!empty($products)) {
    foreach ($products as $product) {
            $limits = json_decode($product['limits'] ?? '{}', true);
            $displayProducts[] = [
                'id' => $product['id'],
                'name' => $product['name'],
                'ram' => ($limits['ram'] ?? 2048) / 1024 . 'GB',
                'storage' => ($limits['disk'] ?? 10240) / 1024 . ' GB',
                'cpu' => ($limits['cpu'] ?? 100) . '%',
                'price' => ($product['is_free'] ?? false) ? 'Free' : '€' . number_format($product['price_amount'] ?? 0, 2),
                'color' => '#ff2d2d',
                'popular' => false,
            ];
    }
} else {
    $displayProducts = $defaultProducts;
}
?>

<section style="background-image: linear-gradient(135deg, rgba(255, 45, 45, 0.1) 0%, rgba(20, 20, 20, 0.9) 100%), url('https://images.unsplash.com/photo-1633356713697-e53cc1dc6ba1?w=1600&h=900&fit=crop'); background-size: cover; background-position: center; background-attachment: fixed; padding: 100px 20px; text-align: center; position: relative;">
    <h1 style="font-size: 3.5rem; font-weight: 900; color: #ffffff; margin-bottom: 15px; text-shadow: 0 4px 20px rgba(0,0,0,0.7);">
        Simple, Transparent Pricing
    </h1>
    <p style="font-size: 1.3rem; color: #d0d0d0; margin-bottom: 10px;">
        Choose the perfect plan for your Minecraft server
    </p>
    <p style="font-size: 1.1rem; color: #ff2d2d; font-weight: 700; margin-bottom: 30px;">
        🎁 Free Tier • No Credit Card Required • Money-back Guarantee
    </p>
</section>

<section style="background-color: #0a0a0a; padding: 80px 20px;">
    <div style="max-width: 1400px; margin: 0 auto;">
        <div style="display: flex; flex-wrap: wrap; gap: 25px; justify-content: center; align-items: flex-start;">
            <?php foreach ($displayProducts as $product): ?>
            <div class="pricing-card" style="position: relative; padding: 30px; background-color: #151515; border: <?= $product['popular'] ? '2px solid #ff2d2d' : '1px solid #2a2a2a' ?>; border-radius: 12px; transition: all 0.3s ease; transform: <?= $product['popular'] ? 'scale(1.05)' : 'scale(1)' ?>; box-shadow: <?= $product['popular'] ? '0 20px 60px rgba(255, 45, 45, 0.2)' : 'none' ?>; min-width: 300px; flex: 1 1 300px; max-width: 350px;">
                <?php if ($product['popular']): ?>
                <div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background-color: #ff2d2d; color: #ffffff; padding: 6px 16px; border-radius: 20px; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                    Most Popular
                </div>
                <?php endif; ?>
                
                <div style="margin-bottom: 20px; text-align: center;">
                    <img 
                        src="/assets/product_pictures/<?= strtolower($product['name']) ?>.jpg"
                        alt="<?= htmlspecialchars($product['name']) ?>"
                        style="width: 100px; height: 100px; border-radius: 10px; object-fit: cover; border: 3px solid <?= htmlspecialchars($product['color']) ?>; margin-bottom: 15px;"
                        onerror="this.src='/assets/product_pictures/Minecraft-<?= htmlspecialchars($product['name']) ?>-Head.jpg'"
                    >
                    <h3 style="font-size: 1.8rem; font-weight: 800; color: #ffffff; margin-bottom: 15px;">
                        <?= htmlspecialchars($product['name']) ?>
                    </h3>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
                        <div style="padding: 15px; background-color: <?= htmlspecialchars($product['color']) ?>20; border: 2px solid <?= htmlspecialchars($product['color']) ?>; border-radius: 8px; text-align: center;">
                            <div style="font-size: 1.8rem; font-weight: 900; color: <?= htmlspecialchars($product['color']) ?>;">
                                <?= htmlspecialchars($product['ram']) ?>
                            </div>
                            <div style="font-size: 0.85rem; color: #888888; margin-top: 3px;">RAM</div>
                        </div>
                        
                        <div style="padding: 15px; background-color: <?= htmlspecialchars($product['color']) ?>20; border: 2px solid <?= htmlspecialchars($product['color']) ?>; border-radius: 8px; text-align: center;">
                            <div style="font-size: 1.8rem; font-weight: 900; color: <?= htmlspecialchars($product['color']) ?>;">
                                <?= htmlspecialchars($product['cpu']) ?>
                            </div>
                            <div style="font-size: 0.85rem; color: #888888; margin-top: 3px;">CPU</div>
                        </div>
                    </div>
                </div>

                <div style="margin-bottom: 25px; padding-bottom: 25px; border-bottom: 1px solid #2a2a2a;">
                    <div style="font-size: 2.5rem; font-weight: 900; color: #ffffff; margin-bottom: 5px;">
                        <?= htmlspecialchars($product['price']) ?>
                    </div>
                    <div style="font-size: 0.95rem; color: #888888;">
                        per month
                    </div>
                </div>

                <button 
                    class="btn-get-started" 
                    data-product-id="<?= htmlspecialchars($product['id'] ?? '') ?>"
                    style="width: 100%; padding: 14px 20px; background-color: <?= $product['popular'] ? '#ff2d2d' : '#2a2a2a' ?>; color: #ffffff; border: none; border-radius: 8px; font-size: 1rem; font-weight: 700; cursor: pointer; transition: all 0.3s ease; margin-bottom: 15px;"
                    onmouseover="this.style.backgroundColor='<?= $product['popular'] ? '#ff1a1a' : '#3a3a3a' ?>';"
                    onmouseout="this.style.backgroundColor='<?= $product['popular'] ? '#ff2d2d' : '#2a2a2a' ?>';"
                >
                    Get Started
                </button>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<section style="background-color: #0a0a0a; padding: 80px 20px; border-top: 1px solid #2a2a2a;">
    <div style="max-width: 1000px; margin: 0 auto;">
        <h2 style="font-size: 2.5rem; font-weight: 900; color: #ffffff; text-align: center; margin-bottom: 60px;">
            Included in All Plans
        </h2>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px;">
            <?php
            $features = [
                ['icon' => '✓', 'title' => 'Free Tier', 'desc' => 'Try before you buy'],
                ['icon' => '✓', 'title' => '24/7 Support', 'desc' => 'Always here to help'],
                ['icon' => '✓', 'title' => 'Money-Back Guarantee', 'desc' => '100% satisfaction'],
                ['icon' => '✓', 'title' => 'DDoS Protection', 'desc' => 'Enterprise security'],
                ['icon' => '✓', 'title' => 'One-Click Installer', 'desc' => 'Plugins & mods'],
                ['icon' => '✓', 'title' => 'Easy Control Panel', 'desc' => 'Manage everything'],
            ];
            foreach ($features as $feature):
            ?>
            <div style="padding: 25px; background-color: #151515; border-radius: 8px; border: 1px solid #2a2a2a; text-align: center;">
                <div style="font-size: 2rem; font-weight: 900; color: #ff2d2d; margin-bottom: 10px;">
                    <?= htmlspecialchars($feature['icon']) ?>
                </div>
                <h3 style="font-size: 1.1rem; font-weight: 700; color: #ffffff; margin-bottom: 5px;">
                    <?= htmlspecialchars($feature['title']) ?>
                </h3>
                <p style="font-size: 0.95rem; color: #888888;">
                    <?= htmlspecialchars($feature['desc']) ?>
                </p>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<script>
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.btn-get-started').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            if (!productId) {
                window.location.href = '/register';
                return;
            }
            
            fetch('/api/orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'product_id=' + encodeURIComponent(productId)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success && data.checkout_url) {
                    window.location.href = data.checkout_url;
                } else {
                    alert('Error creating order. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error creating order. Please try again.');
            });
        });
    });
});
</script>

