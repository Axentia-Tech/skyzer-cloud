# Skyzer Cloud - API Testing & Development Notes

## Pterodactyl Integration

### Creating Pterodactyl Admin API Key

1. Open Pterodactyl Admin Panel: `https://pterodactyl.yourdomain.com/admin`
2. Go to **API Management** → **API Tokens**
3. Click **Create New** and select:
   - Scope: **Full** (for admin operations)
   - Description: "Skyzer Cloud Integration"
4. Copy the generated key and set it in `.env` as `PTERODACTYL_API_KEY`

### Testing Pterodactyl API

```bash
# Get current user (requires valid Bearer token)
curl -X GET "http://pterodactyl:8080/api/application/users" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"

# Create user
curl -X POST "http://pterodactyl:8080/api/application/users" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "user",
    "password": "securepass123",
    "first_name": "John",
    "last_name": "Doe"
  }'

# Create server
curl -X POST "http://pterodactyl:8080/api/application/servers" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Server",
    "user_id": 1,
    "nest_id": 1,
    "egg_id": 1,
    "allocation": {"default": 1},
    "limits": {"memory": 2048, "cpu": 200, "disk": 10240}
  }'
```

## Tebex Webhook Testing

### Testing Webhook Locally

```bash
# Simulate Tebex payment webhook
curl -X POST "http://localhost:3001/api/webhooks/tebex" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "tebex-order-123",
    "type": "order.completed",
    "status": "completed",
    "customer": {
      "id": "tebex-customer-1",
      "email": "customer@example.com",
      "name": "John Doe"
    },
    "packages": [
      {"id": 1, "name": "Pro Plan"}
    ],
    "price": {
      "amount": 15.00,
      "currency": "EUR"
    },
    "created_at": "2025-01-01T00:00:00Z",
    "metadata": {
      "orderId": "clv1a2b3c4d5e6f7g",
      "userId": "user-id-here",
      "productId": "product-id-here"
    }
  }'
```

## Local Development Tips

### Accessing Database

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U skyzer -d skyzer_cloud

# Common queries
SELECT * FROM "User";
SELECT * FROM "Order" WHERE status = 'PAID';
SELECT * FROM "WebhookLog" ORDER BY "createdAt" DESC LIMIT 10;
```

### Viewing Logs

```bash
# Real-time API logs
docker-compose logs -f api

# Worker logs
docker-compose logs -f worker

# All services
docker-compose logs -f
```

### Debugging Worker Jobs

```bash
# Connect to Redis and check queues
docker-compose exec redis redis-cli

# In redis-cli
> KEYS *
> HGETALL "bull:provisioning:*"
> LRANGE "bull:provisioning:waiting" 0 -1
```

### Testing Auth Flow

```bash
# 1. Register
curl -X POST "http://localhost:3001/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123!",
    "firstName": "Test",
    "lastName": "User"
  }'

# Response: { "success": true, "data": { "user": {...}, "tokens": {...} } }

# 2. Login
curl -X POST "http://localhost:3001/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123!"
  }'

# 3. Use token
TOKEN="your-access-token"
curl -X GET "http://localhost:3001/api/auth/me" \
  -H "Authorization: Bearer $TOKEN"
```

## Monitoring & Debugging

### Health Checks

```bash
# Nginx health
curl http://localhost/health

# API health
curl http://localhost:3001/health

# Database connection
docker-compose exec api npx ts-node -e "import { PrismaClient } from '@prisma/client'; const p = new PrismaClient(); p.\$disconnect();"
```

### Performance Monitoring

```bash
# Check Docker container stats
docker stats

# View resource usage
docker-compose stats
```

## Security Testing

### Testing Rate Limiting

```bash
# Should be blocked after 100 requests in 60s
for i in {1..150}; do
  curl http://localhost:3001/api/products
  echo "Request $i"
done
```

### Testing CORS

```bash
# Should include proper CORS headers
curl -i -X OPTIONS \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  http://localhost:3001/api/auth/login
```

### Testing CSP Headers

```bash
curl -i http://localhost/ | grep -i "content-security-policy"
```

## Useful Commands

```bash
# Restart specific service
docker-compose restart api

# Stop all services
docker-compose down

# Remove volumes (WARNING: deletes all data)
docker-compose down -v

# Rebuild images
docker-compose build --no-cache

# View specific service logs
docker-compose logs api --tail=100

# Execute command in container
docker-compose exec api npm test

# Create database backup
docker-compose exec postgres pg_dump -U skyzer skyzer_cloud > backup.sql

# Restore from backup
docker-compose exec -T postgres psql -U skyzer skyzer_cloud < backup.sql
```
