import { Body, Controller, Headers, Post, RawBodyRequest, Req, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Redis from 'ioredis';
import { createHmac, timingSafeEqual } from 'crypto';

@Controller('webhooks')
export class PaymentWebhookController {
  private redis: Redis | null = null;
  private processedEvents = new Set<string>();

  constructor(private prisma: PrismaService) {
    if (process.env.REDIS_URL) {
      this.redis = new Redis(process.env.REDIS_URL);
    }
  }

  @Post('stripe')
  async handleStripe(
    @Req() req: RawBodyRequest<Request>,
    @Body() body: { id: string; type: string; data?: { object?: { id?: string } } },
    @Headers('stripe-signature') stripeSignature?: string,
    @Headers('x-webhook-signature') signature?: string,
  ) {
    const event = this.parseAndVerifyEvent(req, body, stripeSignature, signature);

    const eventId = event.id;
    const processed = await this.markProcessed(eventId);
    if (!processed) return { received: true };

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntentId = event.data?.object?.id;
      if (paymentIntentId) {
        await this.prisma.order.update({
          where: { paymentIntentId },
          data: { status: 'PAID' },
        });
      }
    }

    await this.prisma.auditLog.create({
      data: { action: 'WEBHOOK_RECEIVED', entity: event.type, newData: { eventId } },
    });

    return { received: true };
  }

  private parseAndVerifyEvent(
    req: RawBodyRequest<Request>,
    body: { id: string; type: string; data?: { object?: { id?: string } } },
    stripeSignature?: string,
    signature?: string,
  ) {
    const stripeSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const stripeApiKey = process.env.STRIPE_SECRET;

    if (stripeSecret && stripeApiKey && stripeSignature && req.rawBody) {
      try {
        const stripe = require('stripe')(stripeApiKey);
        return stripe.webhooks.constructEvent(req.rawBody, stripeSignature, stripeSecret);
      } catch {
        throw new UnauthorizedException('Stripe webhook imzası geçersiz.');
      }
    }

    this.verifyHmacSignature(body, signature);
    return body;
  }

  private verifyHmacSignature(body: object, signature?: string) {
    const secret = process.env.WEBHOOK_SIGNATURE_SECRET;
    if (!secret) return;
    if (!signature) throw new UnauthorizedException('Webhook imzası eksik.');

    const expected = createHmac('sha256', secret).update(JSON.stringify(body)).digest('hex');
    const expectedBuf = Buffer.from(expected, 'hex');
    const providedBuf = Buffer.from(signature, 'hex');

    if (expectedBuf.length !== providedBuf.length || !timingSafeEqual(expectedBuf, providedBuf)) {
      throw new UnauthorizedException('Webhook imzası geçersiz.');
    }
  }

  private async markProcessed(eventId: string): Promise<boolean> {
    if (!eventId) return false;
    if (this.redis) {
      const result = await this.redis.sadd('webhook:processed', eventId);
      return Number(result) === 1;
    }

    if (this.processedEvents.has(eventId)) return false;
    this.processedEvents.add(eventId);
    return true;
  }
}
