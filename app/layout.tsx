import type { Metadata } from 'next';
import Script from 'next/script';
import { Tajawal, Poppins, Inter, Montserrat, Geist, Source_Sans_3, Karla, Fustat } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/auth-provider';
import ToastProvider from '@/components/providers/toast-provider';
import { BasketProvider } from '@/components/providers/basket-provider';
import BasketDrawer from '@/components/organisms/basket-drawer';
import TransitionProvider from '@/components/transitions/transition-provider';
import Navbar from '@/components/organisms/navbar';

const tajawal = Tajawal({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '700', '800', '900'],
  variable: '--font-tajawal',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const karla = Karla({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-karla',
  display: 'swap',
});

const sourceSansPro = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-source-sans',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

const geist = Geist({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-geist',
  display: 'swap',
});

const fustat = Fustat({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-fustat',
  display: 'swap',
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
      <head>
        <Script
          src="https://upload-widget.cloudinary.com/latest/global/all.js"
          strategy="lazyOnload"
        />
      </head>
      <body className={`${tajawal.variable} ${poppins.variable} ${inter.variable} ${montserrat.variable} ${geist.variable} ${sourceSansPro.variable} ${karla.variable} ${fustat.variable} font-sans`}>
        <AuthProvider>
          <BasketProvider>
            <ToastProvider />
            <TransitionProvider>
              <Navbar></Navbar>
              {children}
            </TransitionProvider>
            <BasketDrawer />
          </BasketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
