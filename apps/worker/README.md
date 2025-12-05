# Skyzer Cloud Worker

Background job processor für **Skyzer Cloud**, gebaut mit **BullMQ**, **Redis**, **Node.js** und **TypeScript**.

## 🚀 Quick Start

```bash
# Dependencies installieren
pnpm install

# Development Server starten
pnpm dev

# Production Build
pnpm build
pnpm start
```

## 🔧 Environment Variables

```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/skyzer_cloud
REDIS_HOST=redis
REDIS_PORT=6379
PTERODACTYL_URL=http://pterodactyl:8080
PTERODACTYL_API_KEY=your-api-key
NODE_ENV=production
```

## 📋 Job Types

### create_server
Erstellt einen neuen Server auf Pterodactyl nach erfolgreicher Zahlung.

```typescript
{
  jobType: 'create_server',
  orderId: 'order-id',
  userId: 'user-id',
  serverId: 'server-id',
  payload: {
    productId: 'product-id'
  }
}
```

### delete_server
Löscht einen Server von Pterodactyl (bei Kündigung).

```typescript
{
  jobType: 'delete_server',
  serverId: 'server-id',
  pteroServerId: 12345
}
```

### sync_status
Synchronisiert Server-Status mit Pterodactyl.

```typescript
{
  jobType: 'sync_status',
  serverId: 'server-id',
  pteroServerId: 12345
}
```

### update_limits
Aktualisiert Server-Ressourcen-Limits.

```typescript
{
  jobType: 'update_limits',
  serverId: 'server-id',
  pteroServerId: 12345,
  payload: {
    ram: 8096,
    cpu: 200,
    disk: 102400
  }
}
```

## 🏗️ Architecture

```
src/
├── workers/
│   ├── provisioning.ts     # Provisioning Queue & Processors
│   ├── sync.ts             # Sync Workers
│   └── retry.ts            # Retry Logic
├── handlers/
│   ├── create-server.ts
│   ├── delete-server.ts
│   └── ...
├── services/
│   ├── pterodactyl.ts      # Pterodactyl API Client
│   └── database.ts
└── index.ts                # Main Entry Point
```

## 🔄 Workflow

1. **Job enqueued** in BullMQ (from API or Webhook)
2. **Worker picks up** the job from Redis queue
3. **Execute** specific handler (create_server, etc.)
4. **API calls** to Pterodactyl
5. **Update database** with results
6. **Emit events** for real-time updates
7. **Retry** on failure (up to 3 times)
8. **Log** all operations

## 📊 Monitoring

### View Active Jobs
```bash
# Connect to Redis
docker-compose exec redis redis-cli

# List all queues
> KEYS bull:*

# Check queue stats
> HGETALL "bull:provisioning:meta"

# View waiting jobs
> LRANGE "bull:provisioning:waiting" 0 -1

# View active jobs
> LRANGE "bull:provisioning:active" 0 -1

# View failed jobs
> LRANGE "bull:provisioning:failed" 0 -1
```

### Logs
```bash
docker-compose logs -f worker
```

## 🔄 Retry Logic

- **Max Retries**: 3
- **Backoff**: Exponential (1s, 2s, 4s)
- **Failed Jobs**: Logged in database and admin panel
- **Manual Retry**: Via admin API

## 🚨 Error Handling

```typescript
try {
  // Execute job
  await executeProvisioning(job.data);
} catch (error) {
  if (job.attemptsMade < 3) {
    // Retry the job
    throw error;
  } else {
    // Mark as permanently failed
    await markJobFailed(job.id, error.message);
    // Notify admin
    await notifyAdminOfFailure(job.data);
  }
}
```

## 🧪 Testing

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch
```

## 📖 BullMQ Documentation

- [BullMQ Docs](https://docs.bullmq.io/)
- [Queue patterns](https://docs.bullmq.io/guide/patterns)
- [Troubleshooting](https://docs.bullmq.io/guide/troubleshooting)

## 🐛 Troubleshooting

### Jobs not processing
```bash
# Check Redis connection
docker-compose logs redis

# Check worker is running
docker-compose logs worker | grep "Workers initialized"

# Verify Redis is healthy
docker-compose exec redis redis-cli ping
# Response: PONG
```

### High memory usage
```bash
# Check job queue size
docker-compose exec redis redis-cli DBSIZE

# Clear failed jobs
docker-compose exec redis redis-cli FLUSHDB

# Monitor memory
docker stats worker
```

### Job timeout
```typescript
// Increase timeout in job options
queue.add('create_server', data, {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000
  },
  timeout: 300000 // 5 minutes
});
```

## 📝 License

MIT
