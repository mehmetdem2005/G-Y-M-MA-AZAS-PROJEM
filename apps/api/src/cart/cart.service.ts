import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Redis from 'ioredis';
import { randomBytes } from 'crypto';

@Injectable()
export class CartService {
  private redis: Redis | null = null;
  private memoryStock = new Map<string, number>();
  private memoryCarts = new Map<string, Record<string, string>>();

  private LOCK_SCRIPT = `
    local stock = tonumber(redis.call('GET', KEYS[1]))
    if stock and stock >= tonumber(ARGV[1]) then
      redis.call('DECRBY', KEYS[1], ARGV[1])
      redis.call('INCRBY', KEYS[1] .. ':reserved', ARGV[1])
      return 1
    end
    return 0
  `;

  constructor(private prisma: PrismaService) {
    if (process.env.REDIS_URL) {
      this.redis = new Redis(process.env.REDIS_URL);
    }
  }

  async addToCart(userId: string | null, variantId: string, qty: number = 1) {
    const reserved = await this.reserveStock(variantId, qty);
    if (!reserved) throw new ConflictException('Yetersiz stok. Lütfen adet kontrol edin.');

    const cartId = userId ? `cart:u:${userId}` : `cart:s:${this.generateSessionId()}`;
    const payload = { variantId, qty: qty.toString(), addedAt: Date.now().toString() };

    if (this.redis) {
      await this.redis.hset(cartId, payload);
      await this.redis.expire(cartId, 900);
    } else {
      this.memoryCarts.set(cartId, payload);
    }

    await this.prisma.auditLog.create({
      data: { userId, action: 'CART_ADD', entity: variantId, newData: { qty } },
    });

    return { success: true, ttl: 900 };
  }

  private async reserveStock(variantId: string, qty: number): Promise<boolean> {
    if (this.redis) {
      const result = await this.redis.eval(this.LOCK_SCRIPT, 1, `stock:${variantId}`, qty.toString());
      return Number(result) === 1;
    }

    const key = `stock:${variantId}`;
    const current = this.memoryStock.get(key) ?? 100;
    if (current < qty) return false;
    this.memoryStock.set(key, current - qty);
    return true;
  }

  private generateSessionId() {
    return randomBytes(16).toString('hex');
  }
}
