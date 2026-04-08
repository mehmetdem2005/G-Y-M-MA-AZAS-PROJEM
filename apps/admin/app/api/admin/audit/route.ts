export async function GET() {
  return Response.json({
    items: [
      { id: 'a1', action: 'CART_ADD', entity: 'DNM-001', actor: 'user_123', at: '2026-04-08T09:30:00Z' },
      { id: 'a2', action: 'WEBHOOK_RECEIVED', entity: 'payment_intent.succeeded', actor: 'system', at: '2026-04-08T10:10:00Z' },
    ],
  });
}
