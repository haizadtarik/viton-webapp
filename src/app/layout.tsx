import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Virtual Try-On | AI-Powered Fashion Experience',
  description: 'See how an outfit looks on you in seconds. Powered by AI technology for the ultimate virtual try-on experience.',
  keywords: ['virtual try-on', 'AI fashion', 'clothing visualization', 'outfit preview'],
  authors: [{ name: 'Virtual Try-On Team' }],
  creator: 'Virtual Try-On App',
  publisher: 'Virtual Try-On App',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Virtual Try-On | AI-Powered Fashion Experience',
    description: 'See how an outfit looks on you in seconds. Powered by AI technology.',
    url: '/',
    siteName: 'Virtual Try-On',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Virtual Try-On App',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Virtual Try-On | AI-Powered Fashion Experience',
    description: 'See how an outfit looks on you in seconds. Powered by AI technology.',
    images: ['/og-image.png'],
    creator: '@virtualtryon',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#5B7FFF" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Virtual Try-On" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className={`${inter.className} antialiased bg-background-gradient`}>
        <div className="min-h-screen">
          <main className="relative">
            {children}
          </main>
        </div>
        
        {/* Background Pattern */}
        <div className="fixed inset-0 pointer-events-none opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-200/20 to-transparent" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-secondary-200/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-primary-200/20 to-transparent rounded-full blur-3xl" />
        </div>
      </body>
    </html>
  );
}
