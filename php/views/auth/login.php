<div style="max-width: 500px; margin: 100px auto; padding: 40px; background-color: #151515; border: 1px solid #2a2a2a; border-radius: 12px;">
    <h1 style="font-size: 2.5rem; font-weight: 900; color: #ffffff; margin-bottom: 30px; text-align: center;">Login</h1>
    
    <?php if (!empty($error)): ?>
    <div style="padding: 15px; background-color: #ff2d2d20; border: 1px solid #ff2d2d; border-radius: 8px; color: #ff2d2d; margin-bottom: 20px;">
        <?= htmlspecialchars($error) ?>
    </div>
    <?php endif; ?>
    
    <?php if (!empty($errors)): ?>
    <div style="padding: 15px; background-color: #ff2d2d20; border: 1px solid #ff2d2d; border-radius: 8px; color: #ff2d2d; margin-bottom: 20px;">
        <ul style="margin: 0; padding-left: 20px;">
            <?php foreach ($errors as $error): ?>
            <li><?= htmlspecialchars($error) ?></li>
            <?php endforeach; ?>
        </ul>
    </div>
    <?php endif; ?>
    
    <form method="POST" action="/login">
        <div style="margin-bottom: 20px;">
            <label style="display: block; color: #ffffff; font-weight: 600; margin-bottom: 8px;">Email</label>
            <input 
                type="email" 
                name="email" 
                required 
                style="width: 100%; padding: 12px; background-color: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 8px; color: #ffffff; font-size: 1rem;"
                value="<?= htmlspecialchars($_POST['email'] ?? '') ?>"
            >
        </div>
        
        <div style="margin-bottom: 30px;">
            <label style="display: block; color: #ffffff; font-weight: 600; margin-bottom: 8px;">Password</label>
            <input 
                type="password" 
                name="password" 
                required 
                style="width: 100%; padding: 12px; background-color: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 8px; color: #ffffff; font-size: 1rem;"
            >
        </div>
        
        <button type="submit" class="btn btn-primary" style="width: 100%; padding: 14px; font-size: 1rem; margin-bottom: 20px;">
            Login
        </button>
    </form>
    
    <p style="text-align: center; color: #888;">
        Don't have an account? <a href="/register" style="color: #ff2d2d; font-weight: 600;">Register here</a>
    </p>
</div>

