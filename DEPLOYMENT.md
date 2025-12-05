# Skyzer Cloud - Production Deployment Guide

Vollständige Anleitung zur Deployment einer **Skyzer Cloud** Instanz auf einem Linux VPS mit Docker, Nginx, SSL und Auto-Updates.

## 📋 Voraussetzungen

- **OS**: Ubuntu 20.04+ oder Debian 11+
- **RAM**: Mindestens 4GB (8GB empfohlen)
- **Disk**: 50GB+ verfügbar
- **Network**: Port 80, 443 offen (HTTP/HTTPS)
- **Domain**: Gültiger Domain Name mit DNS-Zugriff
- **Services**: Docker, Docker Compose, Git installiert

## 🚀 Installation Schritt für Schritt

### 1. Server vorbereiten

```bash
# System aktualisieren
sudo apt update && sudo apt upgrade -y

# Benötigte Packages installieren
sudo apt install -y \
  apt-transport-https \
  ca-certificates \
  curl \
  gnupg \
  lsb-release \
  git \
  certbot

# Docker installieren
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Docker Compose installieren
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# User zu docker group hinzufügen
sudo usermod -aG docker $USER
newgrp docker

# Testen
docker --version
docker-compose --version
```

### 2. Repository clonen

```bash
# Direktory erstellen
mkdir -p /opt/skyzer && cd /opt/skyzer

# Repository clonen (als root oder mit sudo)
sudo git clone https://github.com/yourusername/skyzer-cloud.git .
sudo chown -R $USER:$USER .

# oder privates Repo mit SSH
git clone git@github.com:yourusername/skyzer-cloud.git
```

### 3. Umgebungsvariablen konfigurieren

```bash
# .env aus Template erstellen
cp .env.example .env

# Mit strongem Editor öffnen und bearbeiten
nano .env
```

**Wichtige Variablen für Production:**

```bash
# Database
DATABASE_URL=postgresql://skyzer:strong-password-here@postgres:5432/skyzer_cloud

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# JWT Secret (generieren mit: openssl rand -base64 32)
JWT_SECRET=your-generated-secret-key-here

# Pterodactyl
PTERODACTYL_URL=https://pterodactyl.yourdomain.com
PTERODACTYL_API_KEY=your-pterodactyl-admin-api-key

# Tebex
TEBEX_SECRET=your-tebex-webhook-secret
TEBEX_CHECKOUT_BASE_URL=https://checkout.tebex.io

# Frontend
FRONTEND_URL=https://skyzer.yourdomain.com
API_PORT=3001
NODE_ENV=production

# Email (Optional, für Transaktions-Mails)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.your-sendgrid-api-key
SMTP_FROM=noreply@skyzer.yourdomain.com

# Sentry (Error Tracking)
SENTRY_DSN=https://your-sentry-dsn
```

### 4. SSL Zertifikate mit Let's Encrypt

```bash
# Certbot für domains ausführen
sudo certbot certonly --standalone \
  -d skyzer.yourdomain.com \
  -d api.yourdomain.com \
  -d ptero.yourdomain.com \
  --email admin@yourdomain.com \
  --agree-tos \
  --non-interactive

# Zertifikate nach project kopieren
sudo cp /etc/letsencrypt/live/skyzer.yourdomain.com/fullchain.pem ./certs/cert.pem
sudo cp /etc/letsencrypt/live/skyzer.yourdomain.com/privkey.pem ./certs/key.pem
sudo chown $USER:$USER ./certs/*
```

### 5. Nginx konfigurieren

```bash
# Nginx config update mit deinen domains
nano nginx.conf

# Änderungen:
# - Ersetze "yourdomain.com" mit deinem echten Domain
# - Stelle sicher SSL-Zertifikate korrekt konfiguriert sind
```

### 6. Docker Images bauen und starten

```bash
# Images bauen (optional, docker-compose macht das automatisch)
docker-compose build

# Services starten (detached mode)
docker-compose up -d

# Status überprüfen
docker-compose ps

# Logs ansehen
docker-compose logs -f
```

### 7. Database initialisieren

```bash
# Warten bis postgres ready ist
sleep 10

# Migrations ausführen
docker-compose exec api pnpm db:migrate:deploy

# Optional: Seed-Daten hinzufügen
docker-compose exec api pnpm db:seed
```

### 8. Health Check

```bash
# Überprüfe alle Services
curl http://localhost/health
# Response: healthy

# API ist erreichbar
curl http://localhost:3001/api/products
# Response: { "success": true, "data": [...] }

# Frontend lädt
curl http://localhost:3000/
# Response: HTML Seite
```

## 🔄 SSL Zertifikate automatisch erneuern

```bash
# Crontab öffnen
sudo crontab -e

# Diese Zeile hinzufügen (erneuert täglich um 3 Uhr morgens)
0 3 * * * /usr/bin/certbot renew --quiet && sudo cp /etc/letsencrypt/live/skyzer.yourdomain.com/fullchain.pem /opt/skyzer/certs/cert.pem && sudo cp /etc/letsencrypt/live/skyzer.yourdomain.com/privkey.pem /opt/skyzer/certs/key.pem && sudo chown 1000:1000 /opt/skyzer/certs/* && docker-compose -C /opt/skyzer reload
```

## 📊 Monitoring & Logs

### Systemd Service (Optional für Auto-Restart)

```bash
# Service-Datei erstellen
sudo tee /etc/systemd/system/skyzer-cloud.service > /dev/null <<EOF
[Unit]
Description=Skyzer Cloud
After=docker.service
Requires=docker.service

[Service]
Type=forking
WorkingDirectory=/opt/skyzer
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Service aktivieren
sudo systemctl daemon-reload
sudo systemctl enable skyzer-cloud
sudo systemctl start skyzer-cloud
```

### Logs anzeigen

```bash
# Real-time logs
docker-compose logs -f api worker web

# Nur Fehler
docker-compose logs --tail=100 api | grep ERROR

# Speichere Logs in Datei
docker-compose logs > logs-$(date +%s).txt
```

### Backups erstellen

```bash
# Database backup
docker-compose exec postgres pg_dump -U skyzer skyzer_cloud > backup-$(date +%Y%m%d_%H%M%S).sql

# Backup zu S3 hochladen (AWS CLI)
aws s3 cp backup-*.sql s3://your-bucket/skyzer-backups/

# Automatisches tägliches Backup via Cron
0 2 * * * cd /opt/skyzer && docker-compose exec -T postgres pg_dump -U skyzer skyzer_cloud | gzip > backup-$(date +\%Y\%m\%d).sql.gz && aws s3 cp backup-*.sql.gz s3://your-bucket/skyzer-backups/
```

## 🚨 Monitoring & Alerts

### Prometheus & Grafana (Optional)

```yaml
# docker-compose.yml erweitern mit:
prometheus:
  image: prom/prometheus:latest
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml
    - prometheus_data:/prometheus
  ports:
    - '9090:9090'

grafana:
  image: grafana/grafana:latest
  ports:
    - '3002:3000'
  environment:
    GF_SECURITY_ADMIN_PASSWORD: admin
```

### Sentry Integration (Error Tracking)

Alle wichtigen Fehler werden automatisch zu Sentry gesendet.

```bash
# Überprüfe SENTRY_DSN ist in .env gesetzt
grep SENTRY_DSN .env

# Fehler testen
docker-compose exec api curl http://localhost:3001/api/non-existent
```

## 🔐 Security Hardening

### Firewall konfigurieren

```bash
# UFW aktivieren
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw enable

# Status überprüfen
sudo ufw status
```

### Fail2Ban (gegen Brute-Force)

```bash
sudo apt install -y fail2ban

# Konfigurieren
sudo tee /etc/fail2ban/jail.local > /dev/null <<EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
EOF

sudo systemctl restart fail2ban
```

## 🐛 Troubleshooting

| Problem | Lösung |
|---------|--------|
| **Port 80/443 nicht erreichbar** | Firewall-Regeln überprüfen: `sudo ufw status` |
| **SSL-Zertifikat ungültig** | Zertifikat erneuern: `sudo certbot renew` |
| **Database-Fehler** | Logs überprüfen: `docker-compose logs postgres` |
| **Worker verarbeitet keine Jobs** | Redis überprüfen: `docker-compose exec redis redis-cli ping` |
| **API antwortet nicht** | API Logs: `docker-compose logs api` |
| **Hoher RAM-Verbrauch** | Services neustarten: `docker-compose restart` |

## 📈 Performance Tuning

### PostgreSQL Optimierung

```sql
-- Verbinde zur Database
docker-compose exec postgres psql -U skyzer -d skyzer_cloud

-- Verbessere Performance
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET work_mem = '16MB';

-- Restart erforderlich
\q
docker-compose restart postgres
```

### Redis Optimierung

```bash
# Maxmemory setzen
docker-compose exec redis redis-cli CONFIG SET maxmemory 512mb
docker-compose exec redis redis-cli CONFIG SET maxmemory-policy allkeys-lru
```

## 🚀 Updates & Rollback

### Update durchführen

```bash
# Neue Version pullen
git pull origin main

# Images neu bauen
docker-compose build

# Migrations laufen
docker-compose exec api pnpm db:migrate:deploy

# Restart Services
docker-compose down
docker-compose up -d

# Überprüfe Status
docker-compose ps
```

### Rollback bei Fehler

```bash
# Letzten Commit überprüfen
git log --oneline -n 5

# Zu vorherigem Commit zurück
git reset --hard HEAD~1

# Services neustarten
docker-compose down
docker-compose build
docker-compose up -d
```

## 📞 Support & Kontakt

Für Probleme bei der Installation:

- 📧 Email: support@skyzer.cloud
- 💬 Discord: [Skyzer Community](https://discord.gg/skyzer)
- 📚 Docs: [skyzer.cloud/docs](https://skyzer.cloud/docs)

---

**Viel Erfolg mit deinem Skyzer Cloud Deployment!** 🚀
