import Link from 'next/link';

export default function CartPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Sepet</h1>
      <p className="mb-4">Sepetinizdeki ürünler burada listelenir.</p>
      <Link className="rounded bg-primary px-4 py-2 text-white" href="/checkout">
        Ödemeye Geç
      </Link>
    </main>
  );
}
