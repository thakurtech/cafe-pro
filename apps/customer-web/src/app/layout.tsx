import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/CartContext';

export const metadata: Metadata = {
  title: 'customer-web',
  description: 'Restaurant OS',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
