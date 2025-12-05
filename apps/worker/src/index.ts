import { Worker, Queue, QueueEvents, Job } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import * as winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'worker.log' }),
  ],
});

const redis = {
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT || '6379'),
};

const prisma = new PrismaClient();
const pteroUrl = process.env.PTERODACTYL_URL || 'http://pterodactyl:8080';
const pteroKey = process.env.PTERODACTYL_API_KEY;

const pteroAxios = axios.create({
  baseURL: pteroUrl,
  headers: {
    Authorization: `Bearer ${pteroKey}`,
    'Content-Type': 'application/json',
  },
});

/**
 * Provisioning Queue
 * Jobs: create_server, delete_server, update_limits, sync_status
 */
const provisioningQueue = new Queue('provisioning', { connection: redis });

// Process create_server jobs
const createServerWorker = new Worker(
  'provisioning',
  async (job: Job) => {
    if (job.name === 'create_server') {
      logger.info(`Processing create_server job: ${job.id}`);

      try {
        const data = job.data as any;
        const { orderId, userId, serverId, productId } = data;

        // Get order and product details
        const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: { product: true, user: true },
        });

        if (!order) throw new Error(`Order not found: ${orderId}`);

        // Create Pterodactyl server
        const pteroResponse = await pteroAxios.post('/api/application/servers', {
          name: `${order.product.name} - ${order.user.email}`,
          description: `Order ${orderId}`,
          user_id: order.user.pteroUserId,
          nest_id: order.product.pteroNestId,
          egg_id: order.product.pteroEggId,
          docker_image: 'ghcr.io/pterodactyl/yolks:java_17',
          startup: 'cd /home/container && java -Xmx{{SERVER_MEMORY}}M -Xms128M -jar server.jar nogui',
          limits: {
            memory: (order.product.limits as any).ram,
            swap: 0,
            disk: (order.product.limits as any).disk,
            io: 500,
            cpu: (order.product.limits as any).cpu,
          },
          feature_limits: {
            backups: (order.product.limits as any).backups,
            databases: (order.product.limits as any).databases,
            allocations: 1,
          },
          allocation: {
            default: 1, // TODO: Select node/allocation dynamically
          },
        });

        const pteroServerId = pteroResponse.data?.object?.id as number;

        // Update server in DB
        await prisma.server.update({
          where: { id: serverId },
          data: {
            pteroServerId,
            status: 'active',
          },
        });

        // Update order status
        await prisma.order.update({
          where: { id: orderId },
          data: { status: 'ACTIVE' },
        });

        logger.info(
          `Server created successfully: ${pteroServerId} for order ${orderId}`,
        );

        return {
          success: true,
          pteroServerId,
        };
      } catch (error: any) {
        logger.error(`Error creating server: ${error.message}`);

        // Retry logic
        if (job.attemptsMade < 3) {
          throw error; // BullMQ will retry
        }

        // Mark as failed
        const { orderId, serverId } = job.data as any;
        await prisma.server.update({
          where: { id: serverId },
          data: { status: 'failed' },
        });

        await prisma.order.update({
          where: { id: orderId },
          data: { status: 'FAILED' },
        });

        return { success: false, error: error.message };
      }
    }
  },
  { connection: redis, concurrency: 5 },
);

// Process delete_server jobs
const deleteServerWorker = new Worker(
  'provisioning',
  async (job: Job) => {
    if (job.name === 'delete_server') {
      logger.info(`Processing delete_server job: ${job.id}`);

      try {
        const { serverId, pteroServerId } = job.data as any;

        // Delete from Pterodactyl
        await pteroAxios.delete(`/api/application/servers/${pteroServerId}?force=true`);

        // Update in DB
        await prisma.server.update({
          where: { id: serverId },
          data: { status: 'terminated', terminatedAt: new Date() },
        });

        logger.info(`Server deleted: ${pteroServerId}`);

        return { success: true };
      } catch (error: any) {
        logger.error(`Error deleting server: ${error.message}`);
        throw error;
      }
    }
  },
  { connection: redis, concurrency: 5 },
);

// Event listeners
const queueEvents = new QueueEvents('provisioning', { connection: redis });

queueEvents.on('completed', ({ jobId, returnvalue }) => {
  logger.info(`Job completed: ${jobId}`);
});

queueEvents.on('failed', ({ jobId, failedReason }) => {
  logger.error(`Job failed: ${jobId} - ${failedReason}`);
});

async function startWorker() {
  logger.info('🚀 Starting Skyzer Cloud Worker...');

  try {
    await createServerWorker.waitUntilReady();
    await deleteServerWorker.waitUntilReady();
    logger.info('✅ Workers initialized and ready');
  } catch (error) {
    logger.error('❌ Failed to start workers:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, gracefully shutting down...');
  await createServerWorker.close();
  await deleteServerWorker.close();
  await prisma.$disconnect();
  process.exit(0);
});

startWorker().catch((error) => {
  logger.error('Fatal error:', error);
  process.exit(1);
});
