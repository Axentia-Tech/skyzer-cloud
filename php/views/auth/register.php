<div style="max-width: 500px; margin: 100px auto; padding: 40px; background-color: #151515; border: 1px solid #2a2a2a; border-radius: 12px;">
    <h1 style="font-size: 2.5rem; font-weight: 900; color: #ffffff; margin-bottom: 30px; text-align: center;">Register</h1>
    
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
    
    <form method="POST" action="/register">
        <div style="margin-bottom: 20px;">
            <label style="display: block; color: #ffffff; font-weight: 600; margin-bottom: 8px;">First Name</label>
            <input 
                type="text" 
                name="first_name" 
                required 
                style="width: 100%; padding: 12px; background-color: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 8px; color: #ffffff; font-size: 1rem;"
                value="<?= htmlspecialchars($_POST['first_name'] ?? '') ?>"
            >
        </div>
        
        <div style="margin-bottom: 20px;">
            <label style="display: block; color: #ffffff; font-weight: 600; margin-bottom: 8px;">Last Name</label>
            <input 
                type="text" 
                name="last_name" 
                required 
                style="width: 100%; padding: 12px; background-color: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 8px; color: #ffffff; font-size: 1rem;"
                value="<?= htmlspecialchars($_POST['last_name'] ?? '') ?>"
            >
        </div>
        
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
                minlength="8"
                style="width: 100%; padding: 12px; background-color: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 8px; color: #ffffff; font-size: 1rem;"
            >
            <p style="color: #888; font-size: 0.85rem; margin-top: 5px;">Minimum 8 characters</p>
        </div>
        
        <button type="submit" class="btn btn-primary" style="width: 100%; padding: 14px; font-size: 1rem; margin-bottom: 20px;">
            Register
        </button>
    </form>
    
    <p style="text-align: center; color: #888;">
        Already have an account? <a href="/login" style="color: #ff2d2d; font-weight: 600;">Login here</a>
    </p>
</div>

