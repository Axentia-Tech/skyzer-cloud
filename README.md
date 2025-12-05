# Skyzer Cloud - Complete Game Hosting Platform

**Skyzer Cloud** ist eine production-ready Hosting-Plattform (ähnlich Paymenter) mit modernem rot-schwarzem Game-Hosting Design. Vollständige Integration mit **Pterodactyl Panel**, **Tebex Payments**, automatischer Provisioning via **BullMQ Queue**, und Admin-Dashboard.

## 🎯 Features

- ✅ **User Management**: Registrierung, E-Mail-Verifizierung, JWT Auth, 2FA-Vorbereitung
- ✅ **Pterodactyl Integration**: Automatische User & Server-Erstellung bei Registrierung/Kauf
- ✅ **Payment Processing**: Tebex Webhook Handler, idempotent, mit Provisioning-Trigger
- ✅ **Background Jobs**: BullMQ Worker für create_server, delete_server, sync_status mit Retry-Logik
- ✅ **Iframe Embedding**: Pterodactyl Panel per Reverse Proxy (Nginx) nahtlos eingebettet
- ✅ **Admin Dashboard**: Produkte, Orders, Users, Logs verwalten
- ✅ **Modern UI**: React + Next.js mit Tailwind CSS, rot-schwarzes Game-Hosting Theme
- ✅ **Security**: Rate-Limiting, Password Hashing (Argon2), HTTPS, CSP, CORS
- ✅ **Logging & Monitoring**: Winston Logs, Webhook-Audit, Provisioning-Tracking
- ✅ **Database**: PostgreSQL + Prisma ORM mit vollständigem Schema
- ✅ **Docker**: Production-ready docker-compose mit allen Services

## 📋 Tech Stack

| Layer | Tech |
|-------|------|
| **Frontend** | React 18, Next.js 14, TypeScript, Tailwind CSS, Zustand, SWR |
| **Backend** | NestJS, TypeScript, JWT, Argon2, Passport.js |
| **Database** | PostgreSQL 16, Prisma ORM |
| **Cache/Queue** | Redis, BullMQ |
| **Pterodactyl** | API Client Module, Reverse Proxy via Nginx |
| **Payments** | Tebex Webhook Handler |
| **Reverse Proxy** | Nginx (SSL, CORS, iframe proxy) |
| **Container** | Docker, Docker Compose |
| **CI/CD** | GitHub Actions (ready) |

## 🚀 Quick Start

### Voraussetzungen

- Docker & Docker Compose
- Node.js 20+ (für lokale Entwicklung)
- pnpm (Paketmanager)
- PostgreSQL 16+ (wenn nicht über Docker)
- Redis (wenn nicht über Docker)

### Installation & Setup

1. **Repository klonen**
   ```bash
   git clone https://github.com/yourusername/skyzer-cloud.git
   cd skyzer-cloud
   ```

2. **Umgebungsvariablen setzen**
   ```bash
   cp .env.example .env.local
   # Bearbeite .env.local mit deinen echten Werten
   ```

3. **Dependencies installieren**
   ```bash
   pnpm install
   ```

4. **Database migrieren**
   ```bash
   pnpm db:migrate
   ```

5. **Entwicklungsserver starten**
   ```bash
   # Option A: Lokal (mit Docker-Services)
   pnpm dev

   # Option B: Mit Docker Compose (recommended)
   docker-compose up -d
   ```

6. **Zugriff**
   - Frontend: http://localhost:3000
   - API: http://localhost:3001
   - API Docs: http://localhost:3001/api/docs
   - Pterodactyl Panel: http://localhost/panel

## 📁 Projekt-Struktur

```
skyzer-cloud/
├── apps/
│   ├── api/                  # NestJS Backend
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/           # JWT + Pterodactyl User Creation
│   │   │   │   ├── products/       # Product Management
│   │   │   │   ├── orders/         # Orders & Checkout
│   │   │   │   ├── webhooks/       # Tebex Webhook Handler
│   │   │   │   ├── ptero/          # Pterodactyl API Client
│   │   │   │   ├── admin/          # Admin Dashboard API
│   │   │   │   └── ...
│   │   │   └── main.ts
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── web/                  # React Frontend
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   ├── index.tsx        # Landing Page
│   │   │   │   ├── pricing.tsx      # Pricing Plans
│   │   │   │   ├── dashboard.tsx    # User Dashboard
│   │   │   │   └── ...
│   │   │   ├── components/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Layout.tsx
│   │   │   ├── store/
│   │   │   │   └── auth.ts          # Auth State (Zustand)
│   │   │   ├── lib/
│   │   │   │   └── api.ts           # API Client
│   │   │   └── styles/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── worker/               # BullMQ Background Jobs
│       ├── src/
│       │   └── index.ts      # Job Processors (create_server, delete_server, etc.)
│       ├── Dockerfile
│       └── package.json
│
├── packages/
│   ├── db/                   # Prisma Schema & Migrations
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── migrations/
│   │
│   └── shared/               # Shared Types (TypeScript)
│       ├── src/
│       │   └── index.ts      # Exported Types
│       └── package.json
│
├── scripts/                  # Utility Scripts
├── .github/
│   └── workflows/            # GitHub Actions (CI/CD)
├── docker-compose.yml        # Docker Compose
├── nginx.conf               # Nginx Reverse Proxy Config
├── .env.example             # Environment Template
├── README.md                # This file
└── package.json             # Root Workspace
```

## 🔧 Configuration

### Umgebungsvariablen

Erstelle `.env.local` basierend auf `.env.example`:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/skyzer_cloud

# Pterodactyl
PTERODACTYL_URL=https://pterodactyl.example.com
PTERODACTYL_API_KEY=your-api-key-from-pterodactyl-admin-panel

# Tebex
TEBEX_SECRET=your-tebex-webhook-secret-from-dashboard

# JWT
JWT_SECRET=generate-a-strong-random-key

# Frontend
FRONTEND_URL=https://skyzer.example.com
```

### Pterodactyl Integration

1. **Admin Panel öffnen**: `https://pterodactyl.example.com/admin`
2. **API Credentials erstellen**: Admin → API Tokens → Create New
3. **Application Key** kopieren und in `PTERODACTYL_API_KEY` setzen
4. **Pterodactyl URL** in `PTERODACTYL_URL` eintragen

### Tebex Integration

1. **Tebex Dashboard öffnen**: https://dashboard.tebex.io
2. **API Key** generieren (Integrations → API Tokens)
3. **Webhook Endpoint** registrieren: `https://yourdomain.com/api/webhooks/tebex`
4. **Webhook Secret** kopieren und in `TEBEX_SECRET` setzen

## 📚 API Dokumentation

### Auth Endpoints

```bash
# Register
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}

# Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

# Refresh Token
POST /api/auth/refresh
Authorization: Bearer <access_token>

# Get Profile
GET /api/auth/me
Authorization: Bearer <access_token>
```

### Products Endpoints

```bash
# Get All Products
GET /api/products

# Get Product
GET /api/products/:id
```

### Orders Endpoints

```bash
# Create Order (initiates Tebex checkout)
POST /api/orders
Authorization: Bearer <access_token>
{
  "productId": "product-id"
}

# Get User Orders
GET /api/orders
Authorization: Bearer <access_token>

# Get Order Details
GET /api/orders/:id
Authorization: Bearer <access_token>
```

### Webhooks

```bash
# Tebex Payment Webhook (called by Tebex)
POST /api/webhooks/tebex
{
  "id": "order-id",
  "type": "order.completed",
  "customer": {...},
  "packages": [...],
  "price": {...}
}
```

### Admin Endpoints

```bash
# Get All Products
GET /api/admin/products
Authorization: Bearer <admin-token>

# Create Product
POST /api/admin/products
Authorization: Bearer <admin-token>
{
  "name": "Pro Plan",
  "slug": "pro",
  "priceAmount": 15.00,
  "isFree": false,
  "limits": {
    "ram": 8096,
    "cpu": 200,
    "disk": 102400,
    "databases": 5,
    "backups": 10,
    "slots": 32
  }
}
```

Vollständige Dokumentation verfügbar unter: **http://localhost:3001/api/docs**

## 🎨 Design & Theme

Skyzer Cloud nutzt ein modernes **rot-schwarzes Game-Hosting Theme**:

- **Primary Color**: `#E11D2B` (Skyzer Red)
- **Dark Background**: `#0B0B0B`
- **Card Background**: `#121212`
- **Text Color**: `#EDEDED`
- **Accent**: `#FF6B6B`

Inspiriert von: **WiseHosting.com** und **ReviveNode.com**

## 🔐 Security Features

- ✅ **JWT Authentication** mit HttpOnly Cookies
- ✅ **Password Hashing** via Argon2
- ✅ **Rate Limiting** (100 requests/min per IP)
- ✅ **CORS** konfiguriert
- ✅ **CSP Headers** (Content-Security-Policy)
- ✅ **HTTPS** via Nginx + Let's Encrypt
- ✅ **Input Validation** (Zod/class-validator)
- ✅ **Webhook Signature Verification** (Tebex)
- ✅ **Idempotency** für Webhook-Handler
- ✅ **Secrets Management** via .env

## 🧪 Testing

```bash
# Unit Tests
pnpm test

# Watch Mode
pnpm test:watch

# Coverage
pnpm test:cov

# E2E Tests (Playwright)
pnpm test:e2e
```

## 📦 Deployment

### Docker Compose (Development/Staging)

```bash
docker-compose up -d
```

### Production Deployment (Linux VPS)

1. **Server Setup**
   ```bash
   sudo apt update && sudo apt install -y docker.io docker-compose git
   sudo usermod -aG docker $USER
   ```

2. **Clone & Setup**
   ```bash
   git clone https://github.com/yourusername/skyzer-cloud.git
   cd skyzer-cloud
   cp .env.example .env
   # Edit .env mit echten Werten
   ```

3. **SSL Certificates** (Let's Encrypt)
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot certonly --standalone -d yourdomain.com
   # Certs nach ./certs kopieren
   ```

4. **Start Services**
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

5. **Database Migration**
   ```bash
   docker-compose exec api pnpm db:migrate:deploy
   ```

### GitHub Actions CI/CD (Optional)

Erstelle `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build & Push Docker Images
        run: |
          docker-compose build
          # Push to registry (Docker Hub, ECR, etc.)
      - name: Deploy
        run: |
          # SSH zu VPS und docker-compose pull + up
```

## 🛠️ Maintenance

### Database Backups

```bash
# Manual Backup
docker-compose exec postgres pg_dump -U skyzer skyzer_cloud > backup-$(date +%s).sql

# Restore
docker-compose exec -T postgres psql -U skyzer skyzer_cloud < backup.sql
```

### Logs

```bash
# API Logs
docker-compose logs -f api

# Worker Logs
docker-compose logs -f worker

# Nginx Logs
docker-compose logs -f nginx
```

### Health Check

```bash
curl http://localhost/health
# Response: healthy
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| **Port bereits in Use** | `docker-compose down` und neu starten |
| **Pterodactyl Connection Error** | Überprüfe `PTERODACTYL_URL` und API Key |
| **Tebex Webhook nicht empfangen** | Webhook URL in Tebex Dashboard konfigurieren |
| **Worker verarbeitet Jobs nicht** | Redis Connection überprüfen: `docker-compose logs redis` |
| **Database Migration fehlgeschlagen** | `docker-compose exec api pnpm db:migrate:resolve` |

## 📖 Dokumentation

- [Pterodactyl API Docs](https://pterodactyl.io/client-api/)
- [Tebex Developer](https://developer.tebex.io/)
- [NestJS Docs](https://docs.nestjs.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs/)
- [BullMQ Docs](https://docs.bullmq.io/)

## 📝 License

MIT License - Frei zu verwenden für kommerzielle und private Projekte.

## 🤝 Contributing

Pull Requests sind willkommen! Bitte erstelle einen Feature Branch und beschreibe deine Änderungen.

## 📞 Support

- 📧 Email: support@skyzer.cloud
- 💬 Discord: [Skyzer Discord](https://discord.gg/skyzer)
- 🐦 Twitter: [@skyzer_cloud](https://twitter.com/skyzer_cloud)

---

**Viel Erfolg mit Skyzer Cloud!** 🚀
