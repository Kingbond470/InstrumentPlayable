import { Suspense } from 'react';
import type { Metadata } from 'next';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import MobileGuard    from '@/components/MobileGuard';
import { decodeKit }  from '@/lib/shareUrl';

// P1 fix: dynamic OG meta tags so shared kit URLs render rich previews in
// Discord / iMessage / Twitter instead of a blank card.
export async function generateMetadata(
  { searchParams }: { searchParams: Promise<{ kit?: string }> },
): Promise<Metadata> {
  const { kit: encoded } = await searchParams;
  if (!encoded) {
    return {
      title: 'PAD/01 — A Playable Instrument',
      description: "Type a vibe. Hit a pad. That's it.",
    };
  }

  const kit = decodeKit(encoded);
  if (!kit) return { title: 'PAD/01' };

  const title       = `${kit.name} — PAD/01`;
  const description = `"${kit.prompt}" — ${kit.bpm} BPM · ${kit.key} · ${kit.mood}`;
  const ogImage     = `/api/og?instrument=unknown&name=${encodeURIComponent(kit.name)}`;

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

export default function PlayPage() {
  return (
    <MobileGuard>
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <Suspense fallback={null}>
          <OnboardingFlow />
        </Suspense>
      </div>
    </MobileGuard>
  );
}
