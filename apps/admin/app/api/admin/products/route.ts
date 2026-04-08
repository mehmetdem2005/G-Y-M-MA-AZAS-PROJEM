export async function GET() {
  return Response.json({
    items: [
      { id: 'v1', name: 'Denim Ceket', sku: 'DNM-001', stock: 18 },
      { id: 'v2', name: 'Basic T-Shirt', sku: 'TSH-002', stock: 4 },
    ],
  });
}
