import { Controller, Post, Body, Param, UseGuards, Get, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create order (returns Tebex checkout link)' })
  async createOrder(@Req() req: any, @Body() body: { productId: string }) {
    const order = await this.ordersService.createOrder(req.user.sub, body.productId);
    return {
      success: true,
      data: order,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user orders' })
  async getUserOrders(@Req() req: any) {
    const orders = await this.ordersService.getUserOrders(req.user.sub);
    return {
      success: true,
      data: orders,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order details' })
  async getOrder(@Req() req: any, @Param('id') id: string) {
    const order = await this.ordersService.getOrder(id, req.user.sub);
    return {
      success: true,
      data: order,
    };
  }
}
