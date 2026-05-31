import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { BASE_URL, generateWebAppSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Play Interactive Musical Instruments Online Free — Playable Instrument',
  description: 'Photograph any instrument and play it instantly. AI identifies it, you play it. No music knowledge needed. Tabla, Sitar, Koto, Piano, and 100+ instruments.',
  keywords: ['interactive musical instruments', 'play instruments online', 'virtual instrument', 'music AI', 'tabla online', 'sitar online'],

  // Viewport and mobile
  viewport: 'width=device-width, initial-scale=1.0, viewport-fit=cover',

  // Canonical & alternate
  alternates: {
    canonical: BASE_URL,
    languages: {
      'en-US': `${BASE_URL}`,
      'es': `${BASE_URL}/?lang=es`,
      'zh': `${BASE_URL}/?lang=zh`,
      'hi': `${BASE_URL}/?lang=hi`,
      'ar': `${BASE_URL}/?lang=ar`,
    },
  },

  // Open Graph
  openGraph: {
    type: 'website',
    url: BASE_URL,
    title: 'Play Interactive Musical Instruments Online Free',
    description: 'Photograph any instrument and play it instantly. AI identifies it, you play it. No music knowledge needed.',
    siteName: 'Playable Instrument',
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Play musical instruments by photographing them',
      },
    ],
    locale: 'en_US',
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Play Interactive Musical Instruments Online',
    description: 'Photograph any instrument and play it instantly. AI identifies it.',
    images: [`${BASE_URL}/og-image.png`],
    creator: '@PlayableInstrument',
  },

  // Verification & robots
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

  // App metadata
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Playable Instrument',
  },

  // Icons
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },

  // Other
  generator: 'Next.js',
  referrer: 'strict-origin-when-cross-origin',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* JSON-LD Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateWebAppSchema()) }} />

        {/* Additional meta tags */}
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#0a0a0a" />

        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Manifest for PWA */}
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
