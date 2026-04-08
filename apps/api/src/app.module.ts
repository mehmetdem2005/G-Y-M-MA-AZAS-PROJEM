import { Module } from '@nestjs/common';
import { CartController } from './cart/cart.controller';
import { CartService } from './cart/cart.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PaymentWebhookController } from './payments/webhook.controller';
import { HealthController } from './health/health.controller';
import { AdminController } from './admin/admin.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev_access_secret',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [CartController, PaymentWebhookController, HealthController, AdminController],
  providers: [CartService, PrismaService, AuthService],
})
export class AppModule {}
