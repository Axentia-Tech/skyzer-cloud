# Migration Guide: TypeScript/Next.js to PHP

Diese Anleitung hilft beim Übergang von der TypeScript/Next.js Version zur PHP Version.

## Datenbank-Migration

Die Datenbankstruktur bleibt gleich. Sie können die bestehende PostgreSQL-Datenbank weiterverwenden.

### Überprüfen Sie die Spaltennamen

Stellen Sie sicher, dass Ihre Datenbank die folgenden Spalten hat:

**Users Tabelle:**
- `id` (String/CUID)
- `email` (String, unique)
- `password_hash` (String)
- `first_name` (String, nullable)
- `last_name` (String, nullable)
- `role` (Enum: USER, ADMIN)
- `ptero_user_id` (Integer, nullable)
- `ptero_username` (String, nullable)
- `created_at` (DateTime)
- `updated_at` (DateTime)

**Products Tabelle:**
- `id` (String/CUID)
- `name` (String)
- `slug` (String, unique)
- `price_amount` (Float)
- `price_currency` (String, default: EUR)
- `is_free` (Boolean)
- `is_active` (Boolean)
- `tebex_product_id` (Integer, nullable)
- `ptero_egg_id` (Integer, nullable)
- `ptero_nest_id` (Integer, nullable)
- `limits` (JSON)
- `created_at` (DateTime)
- `updated_at` (DateTime)

**Orders Tabelle:**
- `id` (String/CUID)
- `user_id` (String, foreign key)
- `product_id` (String, foreign key)
- `status` (Enum: PENDING, PAID, FAILED, PROVISIONING, ACTIVE, CANCELLED, SUSPENDED)
- `tebex_order_id` (String, nullable, unique)
- `tebex_checkout_id` (String, nullable)
- `payment_amount` (Float)
- `payment_currency` (String)
- `created_at` (DateTime)
- `updated_at` (DateTime)
- `paid_at` (DateTime, nullable)

**Servers Tabelle:**
- `id` (String/CUID)
- `user_id` (String, foreign key)
- `order_id` (String, foreign key, unique)
- `ptero_server_id` (Integer, nullable)
- `ptero_node_id` (Integer, nullable)
- `status` (String)
- `created_at` (DateTime)
- `updated_at` (DateTime)

## Assets kopieren

Kopieren Sie die Produktbilder:

```bash
cp -r apps/web/public/assets/product_pictures php/assets/product_pictures
```

## Umgebungsvariablen

Erstellen Sie eine `.env` Datei basierend auf `.env.example`:

```bash
cd php
cp .env.example .env
```

Passen Sie die Werte an Ihre Umgebung an.

## Web Server Konfiguration

### Apache

Die `.htaccess` Datei ist bereits vorhanden. Stellen Sie sicher, dass `mod_rewrite` aktiviert ist.

### Nginx

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/php;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\. {
        deny all;
    }
}
```

## Composer Dependencies installieren

```bash
cd php
composer install
```

## Testen

1. **Datenbankverbindung testen:**
   ```php
   // Temporär in index.php hinzufügen
   try {
       Database::getInstance();
       echo "Database connection successful!";
   } catch (\Exception $e) {
       echo "Error: " . $e->getMessage();
   }
   ```

2. **Routes testen:**
   - `/` - Homepage
   - `/pricing` - Pricing Seite
   - `/login` - Login Seite
   - `/register` - Registrierung
   - `/dashboard` - Dashboard (nach Login)

## Bekannte Unterschiede

1. **Session-basierte Authentifizierung** statt JWT Cookies
2. **PHP Templates** statt React Components
3. **PDO** statt Prisma ORM
4. **Einfacheres Routing** statt Next.js Routing

## Troubleshooting

### "Class not found" Fehler
- Führen Sie `composer dump-autoload` aus

### Datenbankverbindungsfehler
- Überprüfen Sie die `.env` Datei
- Stellen Sie sicher, dass PostgreSQL läuft
- Überprüfen Sie die Berechtigungen

### 404 Fehler auf allen Seiten
- Überprüfen Sie die `.htaccess` Datei
- Stellen Sie sicher, dass `mod_rewrite` aktiviert ist
- Überprüfen Sie die Web Server Konfiguration

### Tebex Webhook funktioniert nicht
- Überprüfen Sie die Webhook URL in Tebex Dashboard
- Überprüfen Sie die Signatur-Verifizierung
- Schauen Sie in die Error Logs

## Support

Bei Problemen:
1. Überprüfen Sie die Error Logs
2. Aktivieren Sie Error Reporting in `.env`: `APP_ENV=development`
3. Kontaktieren Sie den Support

