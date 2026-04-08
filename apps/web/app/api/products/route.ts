export async function GET() {
  return Response.json({
    items: [
      { id: 'p1', name: 'Test Ürün', slug: 'test-urun', price: 999.9, image: '/placeholder.png', stock: 10 },
    ],
  });
}
