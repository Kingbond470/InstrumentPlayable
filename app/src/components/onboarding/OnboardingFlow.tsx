'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import type { KitConfig } from '@/types/kit';
import { decodeKit } from '@/lib/shareUrl';
import PromptStep from './PromptStep';
import TuneStep   from './TuneStep';
import ReadyStep  from './ReadyStep';
import PadGrid    from '@/components/instruments/PadGrid';

type FlowState = 'prompt' | 'tuning' | 'ready' | 'playing';

export default function OnboardingFlow() {
  const params    = useSearchParams();
  const sharedKit = React.useMemo(() => {
    const raw = params.get('kit');
    return raw ? decodeKit(raw) : null;
  }, [params]);

  const [state, setState]           = React.useState<FlowState>(() => sharedKit ? 'playing' : 'prompt');
  const [promptText, setPromptText] = React.useState('');
  const [kit, setKit]               = React.useState<KitConfig | null>(sharedKit);
  const [tags, setTags]             = React.useState<string[]>([]);
  const [tagTotal, setTagTotal]     = React.useState(0);
  const [error, setError]           = React.useState<string | null>(null);
  const [fallback, setFallback]     = React.useState(false);

  const tune = React.useCallback(async (prompt: string) => {
    setPromptText(prompt);
    setState('tuning');
    setTags([]);
    setTagTotal(0);
    setError(null);

    try {
      const res  = await fetch('/api/parse-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: prompt }),
      });
      const data = await res.json() as { kit?: KitConfig; error?: string; fallback?: boolean };
      if (data.error || !data.kit) throw new Error(data.error ?? 'parse failed');
      setFallback(data.fallback ?? false);

      const kitTags = data.kit.tags ?? [];
      setTagTotal(kitTags.length);
      for (const tag of kitTags) {
        await new Promise<void>((r) => setTimeout(r, 360));
        setTags((t) => [...t, tag]);
      }

      setKit({ ...data.kit, prompt });
      setState('ready');

    } catch (e) {
      setError(e instanceof Error ? e.message : 'something went wrong');
      setState('prompt');
    }
  }, []);

  if (state === 'playing' && kit) {
    return <PadGrid kit={kit} onRetune={tune} />;
  }
  if (state === 'ready' && kit) {
    return <ReadyStep kit={kit} fallback={fallback} onPlay={() => setState('playing')} onRetune={tune} />;
  }
  if (state === 'tuning') {
    return <TuneStep prompt={promptText} tags={tags} total={tagTotal} />;
  }
  return <PromptStep onSubmit={tune} error={error} />;
}
