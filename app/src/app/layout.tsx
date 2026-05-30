import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PAD/01 — A Playable Instrument',
  description: "Type a vibe. Hit a pad. That's it.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
