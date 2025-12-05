# Skyzer Cloud API

Backend API der Skyzer Cloud Plattform, gebaut mit **NestJS**, **PostgreSQL**, **Prisma** und **Pterodactyl Integration**.

## 🚀 Quick Start

```bash
# Dependencies installieren
pnpm install

# Development Server starten
pnpm dev

# Production Build
pnpm build
pnpm start:prod
```

## 📁 Struktur

```
src/
├── modules/
│   ├── auth/              # JWT + Pterodactyl User Creation
│   ├── products/          # Product Management
│   ├── orders/            # Orders & Checkout
│   ├── webhooks/          # Tebex + Pterodactyl Webhooks
│   ├── ptero/             # Pterodactyl API Client
│   ├── admin/             # Admin Dashboard
│   ├── users/             # User Management
│   └── servers/           # Server Management
├── common/
│   ├── modules/           # Shared Modules (Database, Cookie)
│   └── services/          # Shared Services (Prisma)
├── app.module.ts
└── main.ts
```

## 🔑 Environment Variables

```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/skyzer_cloud
JWT_SECRET=your-secret-key
PTERODACTYL_URL=http://pterodactyl:8080
PTERODACTYL_API_KEY=your-api-key
TEBEX_SECRET=your-tebex-secret
API_PORT=3001
```

## 📚 API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - List user orders
- `GET /api/orders/:id` - Get order details

### Admin
- `GET /api/admin/products` - All products
- `POST /api/admin/products` - Create product
- `GET /api/admin/orders` - All orders
- `GET /api/admin/users` - All users

### Webhooks
- `POST /api/webhooks/tebex` - Tebex payment webhook
- `POST /api/webhooks/pterodactyl` - Pterodactyl events

## 🧪 Testing

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:cov
```

## 📖 Documentation

Full API docs available at `/api/docs` (Swagger)

## 🔐 Security

- JWT Authentication
- Argon2 Password Hashing
- Rate Limiting
- CORS enabled
- CSP Headers
- Input Validation (Zod/class-validator)

## 🐛 Troubleshooting

### Database connection error
```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Check connection string
echo $DATABASE_URL
```

### Pterodactyl API error
```bash
# Verify API key
curl -H "Authorization: Bearer YOUR_KEY" http://pterodactyl:8080/api/application
```

## 📝 License

MIT
