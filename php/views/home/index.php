<section class="site-hero" style="background-image: linear-gradient(135deg, rgba(255, 45, 45, 0.1) 0%, rgba(10, 10, 10, 0.8) 100%), url('https://images.unsplash.com/photo-1633356713697-e53cc1dc6ba1?w=1600&h=900&fit=crop');">
    <div class="hero-inner">
        <h1 class="h1 large">Next-Gen Minecraft Server Hosting</h1>
        <p class="lead">Fast • Reliable • Affordable</p>
        <p class="muted" style="font-size: 1.1rem; margin-bottom: 30px;">Enterprise-grade infrastructure with zero complexity. Start your free server in 67 seconds.</p>
        
        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin-bottom: 40px;">
            <a href="/pricing" class="btn btn-primary">Get Started Free</a>
            <button class="btn" style="background-color: transparent; border: 2px solid #fff; color: #fff;">Learn More</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 20px; margin-top: 60px;">
            <div style="padding: 20px; background-color: rgba(255, 45, 45, 0.15); border-radius: 8px; border: 1px solid rgba(255, 45, 45, 0.3);">
                <div style="font-size: 2.2rem; font-weight: 900; color: #ff2d2d; margin-bottom: 5px;">99.99%</div>
                <div style="font-size: 0.9rem; color: #aaa;">Uptime SLA</div>
            </div>
            <div style="padding: 20px; background-color: rgba(255, 45, 45, 0.15); border-radius: 8px; border: 1px solid rgba(255, 45, 45, 0.3);">
                <div style="font-size: 2.2rem; font-weight: 900; color: #ff2d2d; margin-bottom: 5px;">24/7</div>
                <div style="font-size: 0.9rem; color: #aaa;">Support</div>
            </div>
            <div style="padding: 20px; background-color: rgba(255, 45, 45, 0.15); border-radius: 8px; border: 1px solid rgba(255, 45, 45, 0.3);">
                <div style="font-size: 2.2rem; font-weight: 900; color: #ff2d2d; margin-bottom: 5px;">67s</div>
                <div style="font-size: 0.9rem; color: #aaa;">Setup Time</div>
            </div>
        </div>
    </div>
</section>

<section style="background-color: #0a0a0a; padding: 80px 20px; border-top: 1px solid #1f1f1f;">
    <div class="container">
        <h2 class="h1" style="text-align: center; margin-bottom: 15px;">Why Choose Skyzer Cloud?</h2>
        <p class="muted" style="text-align: center; margin-bottom: 60px; font-size: 1.1rem;">Everything you need for a professional Minecraft server</p>

        <div class="cards">
            <?php
            $features = [
                ['icon' => '🔌', 'title' => 'Plugin Installer', 'desc' => 'One-click installation, auto-updates, and compatibility checks'],
                ['icon' => '🧩', 'title' => 'Mods Support', 'desc' => 'Forge & Fabric support with automatic conflict detection'],
                ['icon' => '🌐', 'title' => 'Free Subdomains', 'desc' => 'Custom DNS, free subdomain per server, SSL included'],
                ['icon' => '🎮', 'title' => 'Game Control Panel', 'desc' => 'Powerful interface to manage everything in one place'],
                ['icon' => '🔄', 'title' => 'Version Changer', 'desc' => 'Java & Bedrock support with safe version rollbacks'],
                ['icon' => '🛡️', 'title' => 'DDoS Protection', 'desc' => 'Enterprise security with 24/7 monitoring, no extra fees'],
            ];
            foreach ($features as $feature):
            ?>
            <div class="card transition-smooth" style="cursor: pointer;" onmouseover="this.style.borderColor='#ff2d2d'; this.style.transform='translateY(-8px)';" onmouseout="this.style.borderColor='#1f1f1f'; this.style.transform='translateY(0)';">
                <div style="font-size: 2.5rem; margin-bottom: 15px;"><?= htmlspecialchars($feature['icon']) ?></div>
                <h3 class="title" style="margin-bottom: 10px;"><?= htmlspecialchars($feature['title']) ?></h3>
                <p style="font-size: 0.95rem; line-height: 1.6;"><?= htmlspecialchars($feature['desc']) ?></p>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<section style="background-image: linear-gradient(135deg, #ff2d2d 0%, #ff4444 100%); padding: 80px 20px; text-align: center;">
    <div style="max-width: 700px; margin: 0 auto;">
        <h2 class="h1" style="color: #fff; margin-bottom: 20px;">Start Your Minecraft Server Now</h2>
        <p style="font-size: 1.1rem; color: rgba(255, 255, 255, 0.95); margin-bottom: 30px;">Free 48-hour trial • No credit card required • Money-back guarantee</p>
        
        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin-bottom: 30px;">
            <a href="/pricing" class="btn" style="background-color: #fff; color: #ff2d2d; font-weight: 800;">Get Started Free</a>
            <button class="btn" style="background-color: transparent; color: #fff; border: 2px solid #fff; font-weight: 800;">View All Plans</button>
        </div>
        
        <p style="font-size: 0.95rem; color: rgba(255, 255, 255, 0.85); font-weight: 600;">✓ Satisfaction Guaranteed • ✓ 24/7 Support • ✓ Free Trial</p>
    </div>
</section>

