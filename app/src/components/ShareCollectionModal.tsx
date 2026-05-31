'use client';

import { useState } from 'react';
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
  const [copied, setCopied] = useState(false);
  const shareUrl = getCollectionShareUrl(collection);

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
          padding: '24px',
          width: '90%',
          maxWidth: '500px',
          fontFamily: 'ui-monospace, monospace',
        }}
      >
        <h2 style={{ marginTop: 0, fontSize: '16px', marginBottom: '16px', color: '#efece4' }}>
          Share Collection
        </h2>

        {/* Collection Info */}
        <div
          style={{
            background: '#0a0a0a',
            border: '1px solid #333',
            borderRadius: '4px',
            padding: '12px',
            marginBottom: '16px',
          }}
        >
          <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Collection:</div>
          <div style={{ fontSize: '14px', color: '#efece4', fontWeight: 'bold', marginBottom: '8px' }}>
            {collection.name}
          </div>
          <div style={{ fontSize: '11px', color: '#666' }}>
            {collection.instruments.length} instrument{collection.instruments.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Share URL */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: '#999' }}>
            Share Link
          </label>
          <div
            style={{
              display: 'flex',
              gap: '8px',
            }}
          >
            <input
              type="text"
              value={shareUrl}
              readOnly
              style={{
                flex: 1,
                padding: '8px 12px',
                background: '#0a0a0a',
                border: '1px solid #333',
                borderRadius: '4px',
                color: '#efece4',
                fontSize: '11px',
                fontFamily: 'monospace',
                boxSizing: 'border-box',
              }}
            />
            <button
              onClick={handleCopy}
              style={{
                padding: '8px 16px',
                background: copied ? '#4caf50' : '#222',
                border: '1px solid #444',
                borderRadius: '4px',
                color: copied ? '#000' : '#efece4',
                cursor: 'pointer',
                fontSize: '12px',
                fontFamily: 'ui-monospace, monospace',
                fontWeight: 'bold',
              }}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Social Share Buttons */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', color: '#999' }}>
            Share On:
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={shareOnTwitter}
              style={{
                flex: 1,
                padding: '10px',
                background: '#1da1f2',
                border: 'none',
                borderRadius: '4px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '12px',
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
                padding: '10px',
                background: '#5865f2',
                border: 'none',
                borderRadius: '4px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '12px',
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
            padding: '10px',
            background: '#222',
            border: '1px solid #444',
            borderRadius: '4px',
            color: '#efece4',
            cursor: 'pointer',
            fontSize: '12px',
            fontFamily: 'ui-monospace, monospace',
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
}
