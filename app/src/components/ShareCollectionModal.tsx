'use client';

import { useState } from 'react';
import { useViewport } from '@/hooks/useViewport';
import type { InstrumentCollection } from '@/lib/collection';
import { getCollectionShareUrl } from '@/lib/collection';
import { trackEvent } from '@/lib/analytics';

interface ShareCollectionModalProps {
  collection: InstrumentCollection;
  onClose: () => void;
}

/**
 * Modal to share collection
 * - Display shareable URL
 * - Copy to clipboard button
 * - Social share buttons (Discord, Twitter, Email)
 */
export default function ShareCollectionModal({
  collection,
  onClose,
}: ShareCollectionModalProps) {
  const viewport = useViewport();
  const [copied, setCopied] = useState(false);
  const shareUrl = getCollectionShareUrl(collection);

  const isMobile = viewport?.isMobile ?? true;
  const isTablet = viewport?.isTablet ?? false;

  // Responsive modal width
  const modalWidth = isMobile ? '95vw' : isTablet ? '80vw' : '500px';
  const modalMaxWidth = isMobile ? '100%' : isTablet ? '600px' : '500px';
  const padding = isMobile ? '16px' : '24px';
  const gap = isMobile ? '6px' : '8px';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackEvent('collection_shared', {
        collectionName: collection.name,
        instrumentCount: collection.instruments.length,
        via: 'copy',
      });
    } catch {
      // Fallback: select text
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOnTwitter = () => {
    const text = `Check out my ${collection.name} collection on Playable Instrument: ${shareUrl}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
    trackEvent('collection_shared', {
      collectionName: collection.name,
      via: 'twitter',
    });
  };

  const shareOnDiscord = () => {
    const text = `Check out my **${collection.name}** collection:\n${shareUrl}`;
    // Discord doesn't have a native share intent, but we copy to clipboard
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    trackEvent('collection_shared', {
      collectionName: collection.name,
      via: 'discord',
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '8px',
          padding,
          width: modalWidth,
          maxWidth: modalMaxWidth,
          fontFamily: 'ui-monospace, monospace',
          margin: isMobile ? '10px' : '0',
        }}
      >
        <h2 style={{ marginTop: 0, fontSize: isMobile ? '14px' : '16px', marginBottom: padding, color: '#efece4' }}>
          Share Collection
        </h2>

        {/* Collection Info */}
        <div
          style={{
            background: '#0a0a0a',
            border: '1px solid #333',
            borderRadius: '4px',
            padding: isMobile ? '10px' : '12px',
            marginBottom: padding,
          }}
        >
          <div style={{ fontSize: isMobile ? '11px' : '12px', color: '#999', marginBottom: '4px' }}>Collection:</div>
          <div style={{ fontSize: isMobile ? '12px' : '14px', color: '#efece4', fontWeight: 'bold', marginBottom: '8px' }}>
            {collection.name}
          </div>
          <div style={{ fontSize: isMobile ? '10px' : '11px', color: '#666' }}>
            {collection.instruments.length} instrument{collection.instruments.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Share URL */}
        <div style={{ marginBottom: padding }}>
          <label style={{ display: 'block', fontSize: isMobile ? '11px' : '12px', marginBottom: '6px', color: '#999' }}>
            Share Link
          </label>
          <div
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap,
            }}
          >
            <input
              type="text"
              value={shareUrl}
              readOnly
              style={{
                flex: 1,
                padding: isMobile ? '10px 10px' : '8px 12px',
                background: '#0a0a0a',
                border: '1px solid #333',
                borderRadius: '4px',
                color: '#efece4',
                fontSize: isMobile ? '10px' : '11px',
                fontFamily: 'monospace',
                boxSizing: 'border-box',
                minWidth: 0,
              }}
            />
            <button
              onClick={handleCopy}
              style={{
                padding: isMobile ? '10px 12px' : '8px 16px',
                background: copied ? '#4caf50' : '#222',
                border: '1px solid #444',
                borderRadius: '4px',
                color: copied ? '#000' : '#efece4',
                cursor: 'pointer',
                fontSize: isMobile ? '11px' : '12px',
                fontFamily: 'ui-monospace, monospace',
                fontWeight: 'bold',
                flexShrink: 0,
              }}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Social Share Buttons */}
        <div style={{ marginBottom: padding }}>
          <label style={{ display: 'block', fontSize: isMobile ? '11px' : '12px', marginBottom: gap, color: '#999' }}>
            Share On:
          </label>
          <div style={{ display: 'flex', gap }}>
            <button
              onClick={shareOnTwitter}
              style={{
                flex: 1,
                padding: isMobile ? '10px 8px' : '10px',
                background: '#1da1f2',
                border: 'none',
                borderRadius: '4px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: isMobile ? '10px' : '12px',
                fontFamily: 'ui-monospace, monospace',
                fontWeight: 'bold',
              }}
            >
              Twitter
            </button>
            <button
              onClick={shareOnDiscord}
              style={{
                flex: 1,
                padding: isMobile ? '10px 8px' : '10px',
                background: '#5865f2',
                border: 'none',
                borderRadius: '4px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: isMobile ? '10px' : '12px',
                fontFamily: 'ui-monospace, monospace',
                fontWeight: 'bold',
              }}
            >
              Discord
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: isMobile ? '10px 12px' : '10px',
            background: '#222',
            border: '1px solid #444',
            borderRadius: '4px',
            color: '#efece4',
            cursor: 'pointer',
            fontSize: isMobile ? '11px' : '12px',
            fontFamily: 'ui-monospace, monospace',
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
}
