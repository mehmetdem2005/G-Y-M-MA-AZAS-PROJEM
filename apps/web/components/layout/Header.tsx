import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b p-4">
      <nav aria-label="Ana menü" className="mx-auto flex max-w-5xl justify-between">
        <Link href="/">Moda</Link>
        <Link href="/cart">Sepet</Link>
      </nav>
    </header>
  );
}
