import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(private readonly prisma: PrismaService) {}

  async processTebexWebhook(payload: any) {
    /**
     * Tebex Webhook Handler
     * 
     * This function:
     * 1. Validates webhook signature (should verify HMAC)
     * 2. Extracts order metadata (orderId, userId, productId)
     * 3. Checks for idempotency (prevent duplicate processing)
     * 4. Updates order status to PAID
     * 5. Triggers provisioning job in queue
     * 6. Logs webhook for audit
     */

    // TODO: Verify webhook signature using Tebex secret

    // Extract order data
    const orderId = payload.metadata?.orderId;
    const eventType = payload.type; // e.g., "order.completed"

    if (!orderId) {
      this.logger.warn(`Tebex webhook missing orderId: ${JSON.stringify(payload)}`);
      return { status: 'skipped' };
    }

    // Check for idempotency
    const existingLog = await this.prisma.webhookLog.findFirst({
      where: {
        orderId,
        provider: 'tebex',
        eventType,
      },
    });

    if (existingLog?.processed) {
      this.logger.log(`Tebex webhook already processed: ${orderId}`);
      return { status: 'already_processed' };
    }

    try {
      // Get order
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        this.logger.error(`Order not found: ${orderId}`);
        return { status: 'order_not_found' };
      }

      // Update order to PAID
      await this.prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'PAID',
          paidAt: new Date(),
          tebexOrderId: payload.id,
        },
      });

      // Log webhook
      await this.prisma.webhookLog.create({
        data: {
          orderId,
          provider: 'tebex',
          eventType,
          payload,
          processed: true,
          processedAt: new Date(),
          result: { status: 'success' },
        },
      });

      this.logger.log(`Order paid: ${orderId}`);

      // TODO: Trigger provisioning job in BullMQ queue

      return { status: 'success', orderId };
    } catch (error) {
      this.logger.error(`Error processing Tebex webhook: ${error.message}`);

      // Log error
      await this.prisma.webhookLog.create({
        data: {
          orderId,
          provider: 'tebex',
          eventType,
          payload,
          processed: false,
          error: error.message,
        },
      });

      throw error;
    }
  }

  async processPterodactylWebhook(payload: any) {
    /**
     * Pterodactyl Webhook Handler
     * 
     * Handles server lifecycle events:
     * - server.installed
     * - server.install_failed
     * - token.created
     * etc.
     */

    this.logger.debug(`Processing Pterodactyl webhook: ${payload.type}`);

    // Log for audit
    await this.prisma.webhookLog.create({
      data: {
        orderId: '', // If needed, map server to order
        provider: 'pterodactyl',
        eventType: payload.type,
        payload,
        processed: true,
        processedAt: new Date(),
      },
    });

    return { status: 'logged' };
  }
}
