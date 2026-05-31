import { Suspense } from 'react';
import type { Metadata } from 'next';
import { NextRequest } from 'next/server';
import MobileGuard from '@/components/MobileGuard';
import CaptureFlow from '@/components/capture/CaptureFlow';
import { resolveInstrument } from '@/lib/instrumentLibrary';

export async function generateMetadata(
  { searchParams }: { searchParams: Promise<{ instrument?: string }> },
): Promise<Metadata> {
  const { instrument: instrumentId } = await searchParams;

  if (!instrumentId) {
    return {
      title: 'Photograph an Instrument — Playable Instrument',
      description: 'Point your camera at any instrument — real or painted. AI identifies it, you play it instantly.',
      openGraph: {
        title: 'Photograph an Instrument — Playable Instrument',
        description: 'Any instrument. Any culture. Any era. Photograph it. Play it.',
        type: 'website',
        images: [{ url: '/api/og?instrument=unknown' }],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Photograph an Instrument — Playable Instrument',
        description: 'Any instrument. Instantly playable.',
        images: ['/api/og?instrument=unknown'],
      },
    };
  }

  const def = resolveInstrument(instrumentId);
  const title = `${def.name} — Playable Instrument`;
  const description = `${def.description} ${def.culture}.`;
  const ogImage = `/api/og?instrument=${instrumentId}&name=${encodeURIComponent(def.name)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function CapturePage() {
  return (
    <MobileGuard>
      <Suspense fallback={null}>
        <CaptureFlow />
      </Suspense>
    </MobileGuard>
  );
}
