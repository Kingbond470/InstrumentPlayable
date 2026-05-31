'use client';

import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import MobileGuard    from '@/components/MobileGuard';
import LanguageSelector from '@/components/LanguageSelector';
import HistorySidebar from '@/components/HistorySidebar';

export default function PlayPageClient() {
  return (
    <MobileGuard>
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
        <HistorySidebar onPlay={(instrumentId) => {
          // Dispatch event for OnboardingFlow to listen
          window.dispatchEvent(new CustomEvent('loadInstrument', { detail: { id: instrumentId } }));
        }} />
        <div style={{ marginLeft: '220px', width: 'calc(100vw - 220px)', height: '100vh' }}>
          <OnboardingFlow />
        </div>
        <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 1000 }}>
          <LanguageSelector />
        </div>
      </div>
    </MobileGuard>
  );
}
