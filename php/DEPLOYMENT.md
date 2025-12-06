# Deployment Guide

## Voraussetzungen

- PHP >= 8.1
- PostgreSQL
- Composer
- Apache/Nginx
- SSL-Zertifikat (für Production)

## Schritt 1: Server Setup

### Ubuntu/Debian

```bash
# PHP installieren
sudo apt update
sudo apt install php8.1 php8.1-fpm php8.1-pgsql php8.1-curl php8.1-mbstring php8.1-xml php8.1-zip

# PostgreSQL installieren
sudo apt install postgresql postgresql-contrib

# Composer installieren
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

## Schritt 2: Projekt deployen

```bash
# Repository klonen oder Dateien hochladen
cd /var/www
git clone your-repo skyzer-cloud
cd skyzer-cloud/php

# Dependencies installieren
composer install --no-dev --optimize-autoloader

# Berechtigungen setzen
sudo chown -R www-data:www-data .
sudo chmod -R 755 .
```

## Schritt 3: Datenbank Setup

```bash
# PostgreSQL Datenbank erstellen
sudo -u postgres psql
CREATE DATABASE skyzer_cloud;
CREATE USER skyzer_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE skyzer_cloud TO skyzer_user;
\q
```

## Schritt 4: Umgebungsvariablen

```bash
cp .env.example .env
nano .env
```

Wichtige Variablen:
```env
DB_HOST=localhost
DB_NAME=skyzer_cloud
DB_USER=skyzer_user
DB_PASSWORD=your_secure_password

APP_URL=https://yourdomain.com
APP_ENV=production

JWT_SECRET=generate-a-strong-random-key-here
PTERODACTYL_URL=https://pterodactyl.yourdomain.com
PTERODACTYL_API_KEY=your-api-key
TEBEX_SECRET_KEY=your-tebex-secret
TEBEX_PUBLIC_KEY=your-tebex-public-key
```

## Schritt 5: Nginx Konfiguration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    root /var/www/skyzer-cloud/php;
    index index.php;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

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

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

## Schritt 6: SSL Zertifikat (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Schritt 7: PHP-FPM optimieren

```bash
sudo nano /etc/php/8.1/fpm/php.ini
```

Wichtige Einstellungen:
```ini
memory_limit = 256M
upload_max_filesize = 64M
post_max_size = 64M
max_execution_time = 300
```

## Schritt 8: Cron Jobs (optional)

Für regelmäßige Aufgaben:

```bash
sudo crontab -e
```

```cron
# Database backup täglich um 2 Uhr
0 2 * * * pg_dump -U skyzer_user skyzer_cloud > /backups/skyzer_cloud_$(date +\%Y\%m\%d).sql
```

## Schritt 9: Monitoring

### Error Logs überwachen

```bash
tail -f /var/log/nginx/error.log
tail -f /var/log/php8.1-fpm.log
```

### Application Logs

Die PHP-Anwendung loggt Fehler in:
- `/var/log/php_errors.log` (konfigurierbar in php.ini)

## Schritt 10: Performance Optimierung

### OpCache aktivieren

```bash
sudo nano /etc/php/8.1/fpm/php.ini
```

```ini
opcache.enable=1
opcache.memory_consumption=128
opcache.interned_strings_buffer=8
opcache.max_accelerated_files=10000
opcache.revalidate_freq=2
```

### Nginx Caching

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Sicherheit

1. **Firewall konfigurieren:**
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

2. **Dateiberechtigungen:**
   ```bash
   sudo chmod 600 .env
   sudo chmod -R 755 assets/
   ```

3. **PHP Security:**
   - `display_errors = Off` in Production
   - `expose_php = Off`
   - Regelmäßige Updates

## Backup Strategie

```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="skyzer_cloud"
DB_USER="skyzer_user"

# Database backup
pg_dump -U $DB_USER $DB_NAME > $BACKUP_DIR/db_$DATE.sql

# Files backup
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /var/www/skyzer-cloud/php

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

## Troubleshooting

### 500 Internal Server Error
- Überprüfen Sie die Error Logs
- Überprüfen Sie die Dateiberechtigungen
- Überprüfen Sie die PHP-FPM Konfiguration

### Datenbankverbindungsfehler
- Überprüfen Sie die `.env` Datei
- Testen Sie die Verbindung: `psql -U skyzer_user -d skyzer_cloud`

### Langsame Performance
- Aktivieren Sie OpCache
- Überprüfen Sie die Datenbank-Indizes
- Nutzen Sie einen CDN für statische Assets

## Updates

```bash
cd /var/www/skyzer-cloud/php
git pull
composer install --no-dev --optimize-autoloader
sudo systemctl reload php8.1-fpm
sudo systemctl reload nginx
```

