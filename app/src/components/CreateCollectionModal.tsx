'use client';

import { useState } from 'react';
import { resolveInstrument } from '@/lib/instrumentLibrary';
import type { InstrumentCollection } from '@/lib/collection';
import { isValidCollection } from '@/lib/collection';

interface CreateCollectionModalProps {
  instruments: { id: string; name: string }[];
  onCreate: (collection: InstrumentCollection) => void;
  onCancel: () => void;
}

/**
 * Modal to create new collection
 * - Input: collection name
 * - Checkboxes: select 1-5 instruments
 * - Create button (enabled only if valid)
 */
export default function CreateCollectionModal({
  instruments,
  onCreate,
  onCancel,
}: CreateCollectionModalProps) {
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const handleToggle = (instrumentId: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(instrumentId)) {
      newSelected.delete(instrumentId);
    } else if (newSelected.size < 5) {
      newSelected.add(instrumentId);
    }
    setSelected(newSelected);
  };

  const handleCreate = () => {
    const collection: InstrumentCollection = {
      name,
      instruments: Array.from(selected),
    };

    if (isValidCollection(collection)) {
      onCreate(collection);
    }
  };

  const isValid = name.length > 0 && selected.size >= 1 && selected.size <= 5;

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
        if (e.target === e.currentTarget) onCancel();
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
          maxHeight: '80vh',
          overflowY: 'auto',
          fontFamily: 'ui-monospace, monospace',
        }}
      >
        <h2 style={{ marginTop: 0, fontSize: '16px', marginBottom: '16px', color: '#efece4' }}>
          Create Collection
        </h2>

        {/* Name Input */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: '#999' }}>
            Collection Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Jazz Jam"
            style={{
              width: '100%',
              padding: '8px 12px',
              background: '#0a0a0a',
              border: '1px solid #333',
              borderRadius: '4px',
              color: '#efece4',
              fontSize: '13px',
              fontFamily: 'ui-monospace, monospace',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Instrument Checkboxes */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', color: '#999' }}>
            Pick Instruments (1-5)
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {instruments.map((inst) => (
              <label key={inst.id} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={selected.has(inst.id)}
                  onChange={() => handleToggle(inst.id)}
                  disabled={!selected.has(inst.id) && selected.size >= 5}
                  style={{ marginRight: '6px' }}
                />
                <span style={{ fontSize: '12px', color: '#efece4' }}>{inst.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Selection Count */}
        <div style={{ marginBottom: '16px', fontSize: '12px', color: '#666' }}>
          Selected: {selected.size}/5 instruments
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              background: '#222',
              border: '1px solid #444',
              borderRadius: '4px',
              color: '#999',
              cursor: 'pointer',
              fontSize: '12px',
              fontFamily: 'ui-monospace, monospace',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!isValid}
            style={{
              padding: '8px 16px',
              background: isValid ? '#4caf50' : '#333',
              border: 'none',
              borderRadius: '4px',
              color: isValid ? '#000' : '#666',
              cursor: isValid ? 'pointer' : 'not-allowed',
              fontSize: '12px',
              fontFamily: 'ui-monospace, monospace',
              fontWeight: 'bold',
            }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
