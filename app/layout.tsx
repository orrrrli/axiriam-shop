import type { Metadata } from 'next';
import { Tajawal } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import ToastProvider from '@/components/providers/ToastProvider';
import { BasketProvider } from '@/components/providers/BasketProvider';
import BasketDrawer from '@/components/BasketDrawer';

const tajawal = Tajawal({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '700', '800', '900'],
  variable: '--font-tajawal',
});

export const metadata: Metadata = {
  title: 'Axiriam | Gorros Quirúrgicos',
  description: 'Gorros quirúrgicos de alta calidad con diseños únicos para profesionales de la salud.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${tajawal.variable} font-sans`}>
        <AuthProvider>
          <BasketProvider>
            <ToastProvider />
            {children}
            <BasketDrawer />
          </BasketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
