import Image from 'next/image';
import Link from 'next/link';

interface Props {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  stock: number;
}

export default function ProductCard({ slug, name, price, image, stock }: Props) {
  const outOfStock = stock === 0;

  return (
    <article className="group relative flex flex-col gap-2 rounded-lg border p-4 transition hover:shadow-md focus-within:ring-2 focus-within:ring-primary">
      <Link href={`/product/${slug}`} className="relative block aspect-[3/4] overflow-hidden rounded">
        <Image
          src={image}
          alt={`${name} ürün görseli`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition group-hover:scale-105"
          loading="lazy"
        />
        {outOfStock && (
          <span className="absolute right-2 top-2 rounded bg-red-600 px-2 py-1 text-xs text-white" role="status">
            Tükendi
          </span>
        )}
      </Link>
      <h3 className="line-clamp-2 text-base font-medium">{name}</h3>
      <div className="mt-auto flex items-center justify-between">
        <p className="text-lg font-bold" aria-label={`Fiyat: ${price} TL`}>
          {price.toFixed(2)} ₺
        </p>
        <button
          disabled={outOfStock}
          aria-disabled={outOfStock}
          className="rounded bg-primary px-3 py-1.5 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Sepete Ekle
        </button>
      </div>
    </article>
  );
}
