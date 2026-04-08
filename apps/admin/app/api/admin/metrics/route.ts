export async function GET() {
  return Response.json({
    dailyRevenue: 12450.5,
    conversionRate: 3.8,
    pendingOrders: 12,
    lowStockItems: 6,
    csat: 4.4,
  });
}
