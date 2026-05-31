'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Language, LANGUAGES } from '@/lib/i18n';

/**
 * Language selector dropdown
 * Displays current language + allows switching
 */
export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        background: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '6px',
        fontSize: '12px',
        fontFamily: 'ui-monospace, monospace',
      }}
    >
      <span style={{ opacity: 0.6 }}>🌐</span>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#efece4',
          fontSize: '12px',
          fontFamily: 'ui-monospace, monospace',
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        {(Object.entries(LANGUAGES) as [Language, string][]).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}
