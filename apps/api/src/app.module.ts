import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CookieModule } from './common/modules/cookie.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { AdminModule } from './modules/admin/admin.module';
import { PteroModule } from './modules/ptero/ptero.module';
import { UsersModule } from './modules/users/users.module';
import { ServersModule } from './modules/servers/servers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100,
    }),
    CookieModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    WebhooksModule,
    AdminModule,
    PteroModule,
    UsersModule,
    ServersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
