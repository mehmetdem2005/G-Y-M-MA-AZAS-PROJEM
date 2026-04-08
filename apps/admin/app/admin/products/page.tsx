'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProductsPage() {
  const { data, isLoading, error } = useSWR('/api/admin/products', fetcher);

  if (error) return <p role="alert">Ürünler yüklenemedi.</p>;
  if (isLoading) return <p>Yükleniyor...</p>;

  return (
    <section aria-labelledby="products-title">
      <h1 id="products-title" className="mb-4 text-2xl font-bold">
        Ürünler & Stok
      </h1>
      <ul className="space-y-2">
        {(data?.items || []).map((item: any) => (
          <li key={item.id} className="rounded border bg-white p-3">
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-gray-600">SKU: {item.sku} • Stok: {item.stock}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
