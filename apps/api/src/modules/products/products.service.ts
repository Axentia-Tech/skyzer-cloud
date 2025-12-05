import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { ProductDto } from '@skyzer/shared';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllProducts() {
    const products = await this.prisma.product.findMany({
      where: { isActive: true },
      orderBy: { priceAmount: 'asc' },
    });

    return products.map((p) => this.mapProductToDto(p));
  }

  async getProduct(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.mapProductToDto(product);
  }

  private mapProductToDto(product: any): ProductDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      slug: product.slug,
      priceAmount: product.priceAmount,
      priceCurrency: product.priceCurrency,
      billingCycle: product.billingCycle,
      isFree: product.isFree,
      limits: product.limits,
      createdAt: product.createdAt.toISOString(),
    };
  }
}
