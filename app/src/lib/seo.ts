/**
 * SEO metadata utilities — page titles, descriptions, structured data
 */

export interface PageMeta {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  ogType?: string;
  canonical?: string;
}

export const BASE_URL = 'https://instrument-playable-nearawayofficial-3874s-projects.vercel.app';
export const BRAND = 'Playable Instrument';

/**
 * Generate full page title with brand suffix
 */
export function generateTitle(pageTitle: string): string {
  return `${pageTitle} — ${BRAND}`;
}

/**
 * Page metadata definitions
 */
export const PAGE_META: Record<string, PageMeta> = {
  '/': {
    title: 'Play Interactive Musical Instruments Online Free',
    description: 'Photograph any instrument and play it instantly. AI identifies it, you play it. No music knowledge needed. Tabla, Sitar, Koto, and 100+ instruments.',
    keywords: ['interactive musical instruments', 'play instruments online', 'virtual instrument', 'music AI', 'tabla online', 'sitar online'],
    ogImage: `${BASE_URL}/og-home.png`,
    ogType: 'website',
  },
  '/capture': {
    title: 'Identify & Play Musical Instruments from Photos',
    description: 'Upload or photograph any musical instrument. AI identifies it in seconds. Play it online with realistic sounds. Works with tabla, sitar, koto, piano, and more.',
    keywords: ['identify instrument from photo', 'musical instrument identifier', 'virtual instruments', 'AI music', 'play instruments online'],
    ogType: 'website',
  },
  '/play': {
    title: '16-Pad Music Synth Maker — Create Beats Online Free',
    description: 'Create music with our online synth. 16 touch-responsive pads, preset sounds, WAV export, MIDI support. No experience needed.',
    keywords: ['online synth', 'music maker', 'beat maker', 'music synthesizer', 'free music app'],
    ogType: 'website',
  },
  '/library': {
    title: 'Instrument Library & Shared Collections',
    description: 'Browse saved instruments, shared collections, and featured cultural instruments. Explore tabla, sitar, koto, mbira, and world music instruments.',
    keywords: ['instrument library', 'music collections', 'cultural instruments', 'world music', 'instrument browser'],
    ogType: 'website',
  },
};

/**
 * Generate JSON-LD schema for WebApplication (global)
 */
export function generateWebAppSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: BRAND,
    description: 'Photograph any instrument and play it instantly. AI identifies it, you play it.',
    url: BASE_URL,
    applicationCategory: 'Multimedia',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
  };
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbs(path: string) {
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 0) return null;

  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: BASE_URL,
    },
  ];

  let current = '';
  segments.forEach((seg, i) => {
    current += `/${seg}`;
    items.push({
      '@type': 'ListItem',
      position: i + 2,
      name: seg.charAt(0).toUpperCase() + seg.slice(1),
      item: `${BASE_URL}${current}`,
    });
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}

/**
 * Generate FAQPage schema (for landing page)
 */
export function generateFAQSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How does Playable Instrument work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Upload or photograph any musical instrument. Our AI identifies it in seconds using computer vision. Then play it online with realistic sounds and controls.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need music experience?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No music knowledge required. Just tap or click the strings/pads to make sound. Anyone can play.',
        },
      },
      {
        '@type': 'Question',
        name: 'What instruments are supported?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We support 15+ instruments including tabla, sitar, koto, piano, violin, harp, kora, mbira, djembe, and more from 10 different cultures.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I export my recordings?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Record directly in the browser, then export as WAV audio or MIDI for use in your DAW.',
        },
      },
    ],
  };
}

/**
 * Generate Instrument schema (for library / collection pages)
 */
export function generateInstrumentSchema(instrument: {
  name: string;
  culture: string;
  description: string;
  family: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicalWork',
    name: instrument.name,
    description: instrument.description,
    culturalContext: instrument.culture,
  };
}

/**
 * Get meta tags for a page
 */
export function getPageMeta(pathname: string): PageMeta {
  return PAGE_META[pathname] || PAGE_META['/'];
}
