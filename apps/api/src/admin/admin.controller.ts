import { Controller, Get } from '@nestjs/common';

@Controller('admin')
export class AdminController {
  @Get('metrics')
  metrics() {
    return {
      dailyRevenue: 12450.5,
      conversionRate: 3.8,
      pendingOrders: 12,
      lowStockItems: 6,
      csat: 4.4,
    };
  }

  @Get('products')
  products() {
    return {
      items: [
        { id: 'v1', name: 'Denim Ceket', sku: 'DNM-001', stock: 18 },
        { id: 'v2', name: 'Basic T-Shirt', sku: 'TSH-002', stock: 4 },
      ],
    };
  }

  @Get('audit')
  audit() {
    return {
      items: [
        { id: 'a1', action: 'CART_ADD', entity: 'DNM-001', actor: 'user_123', at: '2026-04-08T09:30:00Z' },
        { id: 'a2', action: 'WEBHOOK_RECEIVED', entity: 'payment_intent.succeeded', actor: 'system', at: '2026-04-08T10:10:00Z' },
      ],
    };
  }
}
