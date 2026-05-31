import type { Metadata } from 'next';
import { decodeCollection } from '@/lib/collection';
import CollectionPlayer from '@/components/CollectionPlayer';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ data?: string }>;
}): Promise<Metadata> {
  const { data: encoded } = await searchParams;

  if (!encoded) {
    return {
      title: 'Collection Not Found',
      description: 'The collection you are looking for does not exist.',
    };
  }

  const collection = decodeCollection(encoded);

  if (!collection) {
    return {
      title: 'Invalid Collection',
      description: 'The collection link is invalid or corrupted.',
    };
  }

  const title = `${collection.name} - Playable Instrument Collection`;
  const description = `Play a collection of ${collection.instruments.length} instrument${collection.instruments.length !== 1 ? 's' : ''}: ${collection.instruments.join(', ')}`;
  const ogImage = `/api/og?collection=${encodeURIComponent(collection.name)}&instruments=${collection.instruments.join(',')}`;

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

export default async function CollectionSharePage({
  searchParams,
}: {
  searchParams: Promise<{ data?: string }>;
}) {
  const { data: encoded } = await searchParams;

  if (!encoded) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#0a0a0a',
          color: '#efece4',
          fontFamily: 'ui-monospace, monospace',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <h1 style={{ fontSize: '20px' }}>Collection Not Found</h1>
        <p style={{ fontSize: '12px', color: '#999' }}>
          The collection you are looking for does not exist.
        </p>
        <a href="/" style={{ fontSize: '12px', color: '#4caf50', textDecoration: 'underline' }}>
          Back to home
        </a>
      </div>
    );
  }

  const collection = decodeCollection(encoded);

  if (!collection) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#0a0a0a',
          color: '#efece4',
          fontFamily: 'ui-monospace, monospace',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <h1 style={{ fontSize: '20px' }}>Invalid Collection</h1>
        <p style={{ fontSize: '12px', color: '#999' }}>
          The collection link is invalid or corrupted.
        </p>
        <a href="/" style={{ fontSize: '12px', color: '#4caf50', textDecoration: 'underline' }}>
          Back to home
        </a>
      </div>
    );
  }

  return <CollectionPlayer collection={collection} />;
}
