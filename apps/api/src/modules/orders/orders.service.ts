import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/services/prisma.service';
import { OrderDto } from '@skyzer/shared';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async createOrder(userId: string, productId: string) {
    this.logger.debug(`Creating order for user ${userId}, product ${productId}`);

    // Get product
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Create order
    const order = await this.prisma.order.create({
      data: {
        userId,
        productId,
        status: 'PENDING',
        paymentAmount: product.priceAmount,
        paymentCurrency: product.priceCurrency,
      },
      include: { product: true },
    });

    this.logger.log(`Order created: ${order.id}`);

    // Generate Tebex checkout link
    // In real app, call Tebex API to create checkout
    const checkoutLink = this.generateTebexCheckoutLink(order.id, product);

    return {
      order: this.mapOrderToDto(order),
      checkoutLink,
    };
  }

  async getUserOrders(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((o) => this.mapOrderToDto(o));
  }

  async getOrder(id: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { product: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('You do not have access to this order');
    }

    return this.mapOrderToDto(order);
  }

  private generateTebexCheckoutLink(orderId: string, product: any): string {
    // This is a placeholder - in production, call Tebex API
    const baseUrl = this.configService.get('TEBEX_CHECKOUT_BASE_URL') || 'https://checkout.tebex.io';
    return `${baseUrl}/?orderId=${orderId}&productId=${product.tebexProductId}`;
  }

  private mapOrderToDto(order: any): OrderDto {
    return {
      id: order.id,
      userId: order.userId,
      productId: order.productId,
      product: order.product,
      status: order.status,
      paymentAmount: order.paymentAmount,
      paymentCurrency: order.paymentCurrency,
      isRecurring: order.isRecurring,
      createdAt: order.createdAt.toISOString(),
      paidAt: order.paidAt?.toISOString(),
      expiresAt: order.expiresAt?.toISOString(),
    };
  }
}
