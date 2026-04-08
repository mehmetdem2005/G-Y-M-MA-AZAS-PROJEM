interface ProductPageProps {
  params: { slug: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Ürün: {params.slug}</h1>
      <p>Bu sayfa ürün detayları için placeholder olarak eklendi.</p>
      <button className="mt-4 rounded bg-primary px-4 py-2 text-white">Sepete Ekle</button>
    </main>
  );
}
