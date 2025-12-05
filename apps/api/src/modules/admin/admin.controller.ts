import { Controller, Get, Post, Body, Param, UseGuards, Delete, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Products
  @Get('products')
  @ApiOperation({ summary: 'Get all products (admin)' })
  async getAllProducts() {
    const products = await this.adminService.getAllProducts();
    return { success: true, data: products };
  }

  @Post('products')
  @ApiOperation({ summary: 'Create product' })
  async createProduct(@Body() data: any) {
    const product = await this.adminService.createProduct(data);
    return { success: true, data: product };
  }

  @Put('products/:id')
  @ApiOperation({ summary: 'Update product' })
  async updateProduct(@Param('id') id: string, @Body() data: any) {
    const product = await this.adminService.updateProduct(id, data);
    return { success: true, data: product };
  }

  @Delete('products/:id')
  @ApiOperation({ summary: 'Delete product' })
  async deleteProduct(@Param('id') id: string) {
    await this.adminService.deleteProduct(id);
    return { success: true };
  }

  // Orders
  @Get('orders')
  @ApiOperation({ summary: 'Get all orders (admin)' })
  async getAllOrders() {
    const orders = await this.adminService.getAllOrders();
    return { success: true, data: orders };
  }

  // Users
  @Get('users')
  @ApiOperation({ summary: 'Get all users (admin)' })
  async getAllUsers() {
    const users = await this.adminService.getAllUsers();
    return { success: true, data: users };
  }

  @Put('users/:id/suspend')
  @ApiOperation({ summary: 'Suspend user' })
  async suspendUser(@Param('id') id: string, @Body() data: any) {
    await this.adminService.suspendUser(id, data.reason);
    return { success: true };
  }

  // Logs
  @Get('audit-logs')
  @ApiOperation({ summary: 'Get audit logs' })
  async getAuditLogs() {
    const logs = await this.adminService.getAuditLogs();
    return { success: true, data: logs };
  }

  @Get('webhook-logs')
  @ApiOperation({ summary: 'Get webhook logs' })
  async getWebhookLogs() {
    const logs = await this.adminService.getWebhookLogs();
    return { success: true, data: logs };
  }
}
