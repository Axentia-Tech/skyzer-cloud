# 🚀 Skyzer Cloud - 5-Minute Quick Start

Starte Skyzer Cloud in **5 Minuten** ohne viel Konfiguration.

## ✅ Voraussetzungen (2 Min)

- Docker & Docker Compose installiert
- Git installiert
- Terminal/PowerShell offen

**Nicht installiert?** → [Docker Installation](https://docs.docker.com/get-docker/)

## 🎯 Quick Start (5 Min)

### Schritt 1: Repository klonen (30 Sekunden)

```bash
git clone https://github.com/yourusername/skyzer-cloud.git
cd skyzer-cloud
```

### Schritt 2: .env erstellen (1 Min)

```bash
cp .env.example .env
```

Öffne `.env` und ändere folgende Zeilen:

```bash
# Generiere sichere Secrets (https://passwordsgenerator.net/)
DATABASE_URL=postgresql://skyzer:NEUES_PASSWORD@postgres:5432/skyzer_cloud
JWT_SECRET=GENERIERTER_SECRET_KEY

# Für Tests (später mit echten Keys ersetzen)
PTERODACTYL_API_KEY=test-key
TEBEX_SECRET=test-secret
```

### Schritt 3: Services starten (2 Min)

```bash
# Starte alle Services
docker-compose up -d

# Warte 10 Sekunden
sleep 10

# Überprüfe Status
docker-compose ps

# Output sollte alle 7 Services als "running" zeigen ✓
```

### Schritt 4: Database initialisieren (1 Min)

```bash
# Führe Migrations aus
docker-compose exec api pnpm db:migrate:deploy

# Output sollte sein: "Applying migration `0_init`"
```

## 🎉 Fertig! Zugang

| Service | URL | Credentials |
|---------|-----|-------------|
| 🌐 Frontend | http://localhost:3000 | - |
| 🔌 API | http://localhost:3001 | - |
| 📚 API Docs | http://localhost:3001/api/docs | - |
| 🗄️ Database | localhost:5432 | skyzer / password |
| 🚀 Redis | localhost:6379 | - |

## 🧪 Test Registration

```bash
# 1. Öffne Frontend
open http://localhost:3000

# 2. Oder teste via API
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123!",
    "firstName": "Test",
    "lastName": "User"
  }'

# Response: { "success": true, "data": {...} }
```

## 📋 Häufige Befehle

```bash
# Logs anschauen
docker-compose logs -f api

# API neustarten
docker-compose restart api

# Alles herunterfahren
docker-compose down

# Alles neu starten
docker-compose down && docker-compose up -d

# Database Backup
docker-compose exec postgres pg_dump -U skyzer skyzer_cloud > backup.sql
```

## 🚨 Probleme?

| Problem | Lösung |
|---------|--------|
| Port 3000 already in use | `sudo lsof -i :3000; kill -9 PID` |
| Database connection error | `docker-compose logs postgres` |
| API not responding | Warte 30s und refreshe |
| Worker-Fehler | `docker-compose restart redis` |

## 🔧 Nächste Schritte

- [ ] **Pterodactyl Setup**: https://pterodactyl.io/
  - [ ] Panel installieren
  - [ ] Admin API Key generieren
  - [ ] Key in `.env` als `PTERODACTYL_API_KEY` setzen

- [ ] **Tebex Integration**: https://dashboard.tebex.io/
  - [ ] Konto erstellen
  - [ ] Webhook Secret kopieren
  - [ ] In `.env` als `TEBEX_SECRET` setzen

- [ ] **Produkte hinzufügen**:
  ```bash
  # API öffnen
  curl http://localhost:3001/api/admin/products \
    -X POST \
    -H "Authorization: Bearer admin-token"
  ```

- [ ] **Production Deployment**: Siehe [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📚 Weitere Ressourcen

- [README.md](./README.md) - Ausführliche Dokumentation
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Development & Debugging
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production Anleitung
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Projekt Übersicht

## 💡 Pro Tips

1. **Persistent Logs speichern**:
   ```bash
   docker-compose logs > logs-$(date +%s).txt
   ```

2. **Database Schema ansehen**:
   ```bash
   docker-compose exec postgres psql -U skyzer skyzer_cloud
   # In psql: \dt (tables anzeigen)
   ```

3. **API Testing mit Postman**:
   - Importiere OpenAPI Schema von http://localhost:3001/api-json
   - Alle Endpoints sind dokumentiert

4. **Real-time monitoring**:
   ```bash
   watch -n 1 'docker-compose ps'
   ```

---

**Fertig!** 🎉 Deine Skyzer Cloud Instanz läuft! 

Für Production: Lies [DEPLOYMENT.md](./DEPLOYMENT.md) durch.

Fragen? → support@skyzer.cloud
