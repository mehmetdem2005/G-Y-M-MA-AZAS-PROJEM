import { Inter } from 'next/font/google';
import '../globals.css';
import { AuthProvider } from '@/providers/auth';
import { CartProvider } from '@/providers/cart';
import SkipLink from '@/components/ui/SkipLink';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" dir="ltr">
      <body className={inter.className}>
        <SkipLink />
        <AuthProvider>
          <CartProvider>
            <a className="sr-only focus:not-sr-only" href="#main">
              Ana içeriğe atla
            </a>
            <Header />
            <main id="main" className="min-h-screen" role="main">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
