import { Suspense } from 'react';
import type { Metadata } from 'next';
import MobileGuard from '@/components/MobileGuard';
import CaptureFlow from '@/components/capture/CaptureFlow';

export const metadata: Metadata = {
  title: 'Photograph an Instrument — Playable Instrument',
  description: 'Point your camera at any instrument — real or painted. AI identifies it, you play it instantly.',
  openGraph: {
    title: 'Photograph an Instrument — Playable Instrument',
    description: 'Any instrument. Any culture. Any era. Photograph it. Play it.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Photograph an Instrument — Playable Instrument',
    description: 'Any instrument. Instantly playable.',
  },
};

export default function CapturePage() {
  return (
    <MobileGuard>
      <Suspense fallback={null}>
        <CaptureFlow />
      </Suspense>
    </MobileGuard>
  );
}
