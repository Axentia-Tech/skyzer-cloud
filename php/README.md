# Skyzer Cloud - PHP Version

Modern Minecraft Hosting Billing Platform rebuilt in PHP.

## Features

- ✅ Modern MVC Architecture
- ✅ User Authentication (Login/Register)
- ✅ Pterodactyl Integration (iframe + API)
- ✅ Tebex Payment Integration
- ✅ Responsive Modern Design
- ✅ PostgreSQL Database
- ✅ Session Management

## Installation

1. **Install Dependencies**
   ```bash
   cd php
   composer install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Database Setup**
   - Create PostgreSQL database
   - Import schema from `packages/db/prisma/schema.prisma` or run migrations

4. **Web Server Configuration**
   
   **Apache (.htaccess included)**
   - Enable mod_rewrite
   - Point document root to `php/` directory
   
   **Nginx**
   ```nginx
   location / {
       try_files $uri $uri/ /index.php?$query_string;
   }
   ```

5. **Set Permissions**
   ```bash
   chmod -R 755 php/
   chown -R www-data:www-data php/
   ```

## Requirements

- PHP >= 8.1
- PostgreSQL
- Composer
- Apache/Nginx with mod_rewrite

## Structure

```
php/
├── src/
│   ├── Core/          # Core classes (Router, Database, Auth, View)
│   ├── Controllers/   # Controllers
│   ├── Models/        # Database models
│   └── Services/      # External services (Pterodactyl, Tebex)
├── views/             # PHP templates
├── assets/            # CSS, JS, images
├── routes.php         # Route definitions
└── index.php          # Entry point
```

## Usage

1. Start your web server
2. Navigate to your domain
3. Register/Login
4. View pricing and create orders
5. Access Pterodactyl panel via iframe in dashboard

## Configuration

### Pterodactyl
- Set `PTERODACTYL_URL` to your panel URL
- Set `PTERODACTYL_API_KEY` from admin panel

### Tebex
- Set `TEBEX_SECRET_KEY` and `TEBEX_PUBLIC_KEY`
- Configure webhook URL: `https://yourdomain.com/api/webhooks/tebex`

## Security

- Password hashing with Argon2ID
- Session-based authentication
- SQL injection protection (PDO prepared statements)
- XSS protection (htmlspecialchars in views)
- CSRF protection (recommended to add)

## License

MIT

