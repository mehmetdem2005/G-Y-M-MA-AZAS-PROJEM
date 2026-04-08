'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Gösterge Paneli' },
  { href: '/admin/products', label: 'Ürünler & Stok' },
  { href: '/admin/orders', label: 'Siparişler' },
  { href: '/admin/audit', label: 'İşlem Kayıtları' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <nav className="w-64 border-r bg-white p-4" role="navigation" aria-label="Yönetim menüsü">
        <h1 className="mb-6 text-xl font-bold text-primary">ModaAdmin</h1>
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block rounded px-3 py-2 transition focus:outline-none focus:ring-2 focus:ring-primary ${
                    isActive ? 'bg-primary/10 font-medium text-primary' : 'hover:bg-gray-100'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <button
          onClick={logout}
          className="mt-6 w-full rounded border px-3 py-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Oturumu kapat"
        >
          Çıkış Yap
        </button>
      </nav>

      <main className="flex-1 overflow-auto p-6" role="main" id="admin-main">
        <a
          href="#admin-main"
          className="sr-only rounded bg-white px-2 py-1 shadow focus:not-sr-only focus:absolute focus:left-2 focus:top-2"
        >
          Ana içeriğe atla
        </a>
        {children}
      </main>
    </div>
  );
}
