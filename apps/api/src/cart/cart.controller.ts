import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('items')
  async addItem(@Body() body: { userId?: string | null; variantId: string; qty?: number }) {
    if (!body?.variantId) throw new BadRequestException('variantId zorunludur.');
    const qty = body.qty ?? 1;
    if (!Number.isInteger(qty) || qty < 1) {
      throw new BadRequestException('qty pozitif tam sayı olmalıdır.');
    }

    return this.cartService.addToCart(body.userId ?? null, body.variantId, qty);
  }
}
