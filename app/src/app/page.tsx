import Link from 'next/link';
import type { Metadata } from 'next';
import { T } from '@/tokens/design';
import { PAGE_META, generateFAQSchema, generateBreadcrumbs, BASE_URL } from '@/lib/seo';

const pageMeta = PAGE_META['/'];

export const metadata: Metadata = {
  title: pageMeta.title,
  description: pageMeta.description,
  keywords: pageMeta.keywords,
  openGraph: {
    title: pageMeta.title,
    description: pageMeta.description,
    url: BASE_URL,
    type: 'website',
    images: [{ url: `${BASE_URL}/og-home.png`, width: 1200, height: 630, alt: 'Play musical instruments' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageMeta.title,
    description: pageMeta.description,
  },
};

const INSTRUMENTS = [
  { name: 'Tabla',  culture: 'India',   accent: '#C2703A', emoji: '🥁' },
  { name: 'Sitar',  culture: 'India',   accent: '#8B5E3C', emoji: '🪕' },
  { name: 'Koto',   culture: 'Japan',   accent: '#6B4C3B', emoji: '🎵' },
  { name: 'Erhu',   culture: 'China',   accent: '#A0522D', emoji: '🎻' },
  { name: 'Mbira',  culture: 'Zimbabwe',accent: '#7B6B3D', emoji: '✨' },
  { name: 'Kora',   culture: 'W. Africa',accent:'#8B7355', emoji: '🎶' },
  { name: 'Harp',   culture: 'Ancient', accent: '#4A4A8A', emoji: '🎼' },
  { name: 'Djembe', culture: 'W. Africa',accent:'#8B4513', emoji: '🪘' },
];

export default function LandingPage() {
  return (
    <div style={{ width: '100%', minHeight: '100vh', background: T.ink, color: T.cream, fontFamily: T.font }}>

      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 10, background: T.ink,
        borderBottom: `2px solid ${T.cream}22`,
        padding: '0 32px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: -0.5 }}>PLAYABLE INSTRUMENT</span>
          <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 1.6, opacity: 0.4 }}>
            AS SEEN AT THE MET · NYC
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/library" style={{
            padding: '9px 14px', background: 'transparent', color: `${T.cream}88`,
            textDecoration: 'none', fontFamily: T.mono,
            fontSize: 10, letterSpacing: 1.4, fontWeight: 700,
            border: `1.5px solid ${T.cream}22`,
          }}>LIBRARY</Link>
          <Link href="/capture" style={{
            padding: '9px 16px', background: T.cream, color: T.ink,
            textDecoration: 'none', fontFamily: T.mono,
            fontSize: 10, letterSpacing: 1.4, fontWeight: 700,
          }}>PHOTOGRAPH AN INSTRUMENT →</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: '80px 32px 100px',
        borderBottom: `2px solid ${T.cream}22`,
        display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 64, alignItems: 'center',
      }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28,
            padding: '6px 12px', background: `${T.cream}12`,
            border: `1px solid ${T.cream}22`,
            fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6, fontWeight: 700,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.red }} />
            WON FIRST PLACE · CLAUDE × THE MET HACKATHON · NYC
          </div>

          <h1 style={{
            margin: '0 0 28px', fontWeight: 900, fontSize: 96,
            lineHeight: 0.86, letterSpacing: -4, color: T.cream,
          }}>
            Photograph it.<br />
            <span style={{ color: T.red }}>Play it.</span>
          </h1>

          <p style={{
            margin: '0 0 40px', maxWidth: 520, fontSize: 20,
            lineHeight: 1.45, opacity: 0.72,
          }}>
            Point your camera at any instrument — real, painted, or sculpted. AI identifies
            it. You play it instantly. No music knowledge. No account.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <Link href="/capture" style={{
              display: 'inline-block', textDecoration: 'none',
              padding: '18px 32px', background: T.red, color: T.cream,
              border: `2px solid ${T.red}`, fontWeight: 900, fontSize: 18,
              letterSpacing: -0.3, boxShadow: `6px 6px 0 0 ${T.cream}33`,
            }}>
              📷 PHOTOGRAPH AN INSTRUMENT
            </Link>
            <Link href="/play" style={{
              display: 'inline-block', textDecoration: 'none',
              padding: '18px 24px', background: 'transparent', color: `${T.cream}88`,
              border: `1.5px solid ${T.cream}33`,
              fontFamily: T.mono, fontSize: 11, letterSpacing: 1.4, fontWeight: 700,
            }}>
              OR TYPE A VIBE →
            </Link>
          </div>

          <div style={{
            marginTop: 28, display: 'flex', gap: 28,
            fontFamily: T.mono, fontSize: 10, letterSpacing: 1.4, opacity: 0.45,
          }}>
            <span>NO ACCOUNT NEEDED</span>
            <span>WORKS IN BROWSER</span>
            <span>100+ INSTRUMENTS</span>
          </div>
        </div>

        {/* Instrument grid preview */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10,
        }}>
          {INSTRUMENTS.map((inst) => (
            <Link key={inst.name} href={`/capture?instrument=${inst.name.toLowerCase()}`}
              style={{
                textDecoration: 'none',
                padding: '20px 18px',
                border: `1.5px solid ${inst.accent}55`,
                background: `${inst.accent}12`,
                display: 'flex', flexDirection: 'column', gap: 10,
                transition: 'background 150ms',
              }}>
              <span style={{ fontSize: 28 }}>{inst.emoji}</span>
              <div>
                <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: -0.4, color: T.cream }}>{inst.name}</div>
                <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 1.4, color: inst.accent, marginTop: 2 }}>
                  {inst.culture.toUpperCase()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{
        padding: '80px 32px', borderBottom: `2px solid ${T.cream}22`,
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
      }}>
        <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6, opacity: 0.45, gridColumn: '1/-1', marginBottom: 40 }}>
          HOW IT WORKS
        </div>
        {[
          {
            n: '01', t: 'Photograph any instrument',
            d: 'Real or in a painting. A tabla at the Met, a guitar on the wall, a sitar in your grandparents\' home.',
          },
          {
            n: '02', t: 'AI identifies it instantly',
            d: 'Claude recognises the instrument, its cultural origin, and loads the right synth engine. In under 3 seconds.',
          },
          {
            n: '03', t: 'Play it. Record it. Share it.',
            d: 'Strings, percussion, keys — each instrument gets its own playable interface. Export WAV + MIDI.',
          },
        ].map((f, i) => (
          <div key={f.n} style={{ padding: '0 32px', borderLeft: i > 0 ? `2px solid ${T.cream}15` : 'none' }}>
            <span style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: 1.6, fontWeight: 700, color: T.red }}>{f.n}</span>
            <h3 style={{ margin: '12px 0 14px', fontWeight: 900, fontSize: 32, letterSpacing: -1, lineHeight: 1, color: T.cream }}>
              {f.t}
            </h3>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, opacity: 0.65 }}>{f.d}</p>
          </div>
        ))}
      </section>

      {/* Cultural instruments showcase */}
      <section style={{ padding: '80px 32px', borderBottom: `2px solid ${T.cream}22` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 32 }}>
          <h2 style={{ margin: 0, fontWeight: 900, fontSize: 52, letterSpacing: -2, color: T.cream }}>
            Every culture.<br />Every era.
          </h2>
          <span style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.4, opacity: 0.4 }}>
            15 INSTRUMENTS · 10 CULTURES · MORE COMING
          </span>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[
            ['Tabla', '#C2703A'], ['Sitar', '#8B5E3C'], ['Bansuri', '#4A7C59'],
            ['Erhu', '#A0522D'], ['Koto', '#6B4C3B'], ['Mbira', '#7B6B3D'],
            ['Kora', '#8B7355'], ['Guitar', '#6B3A2A'], ['Violin', '#7B3F00'],
            ['Harp', '#4A4A8A'], ['Flute', '#2E6B4F'], ['Djembe', '#8B4513'],
            ['Trumpet', '#B8860B'], ['Piano', '#1A1A4E'],
          ].map(([name, accent]) => (
            <span key={name} style={{
              padding: '8px 14px',
              border: `1.5px solid ${accent}44`,
              background: `${accent}18`,
              color: T.cream,
              fontFamily: T.mono, fontSize: 11, letterSpacing: 0.8, fontWeight: 700,
            }}>{name}</span>
          ))}
        </div>
      </section>

      {/* The Met connection */}
      <section style={{
        padding: '80px 32px', borderBottom: `2px solid ${T.cream}22`,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center',
      }}>
        <div>
          <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6, opacity: 0.45, marginBottom: 20 }}>
            ORIGIN STORY
          </div>
          <h2 style={{ margin: '0 0 20px', fontWeight: 900, fontSize: 52, letterSpacing: -2, lineHeight: 0.9, color: T.cream }}>
            Born at<br />The Met.
          </h2>
          <p style={{ margin: '0 0 24px', fontSize: 17, lineHeight: 1.5, opacity: 0.7 }}>
            This project won first place at a Claude × Met Museum hackathon in New York City.
            The challenge: make art more immersive for museum visitors. The solution: let anyone
            photograph an instrument in a painting and play it.
          </p>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, opacity: 0.55 }}>
            Built with Claude Code. Zero prior coding experience. One afternoon.
          </p>
        </div>
        <div style={{
          padding: 32, border: `2px solid ${T.cream}22`,
          background: `${T.cream}06`,
        }}>
          <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 1.6, opacity: 0.45, marginBottom: 16 }}>
            THE IDEA
          </div>
          <p style={{
            margin: 0, fontWeight: 900, fontSize: 28, lineHeight: 1.1,
            letterSpacing: -0.5, color: T.cream,
          }}>
            "What if every instrument in every painting could be played?"
          </p>
          <div style={{
            marginTop: 24, fontFamily: T.mono, fontSize: 10, letterSpacing: 1.4,
            opacity: 0.4,
          }}>
            ASIAN ART DEPARTMENT · THE MET · NEW YORK
          </div>
        </div>
      </section>

      {/* Big CTA */}
      <section style={{ padding: '100px 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', right: -100, top: -100, width: 400, height: 400,
          borderRadius: '50%', background: T.red, opacity: 0.12,
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', maxWidth: 800 }}>
          <h2 style={{
            margin: '0 0 32px', fontWeight: 900, fontSize: 100,
            lineHeight: 0.88, letterSpacing: -4, color: T.cream,
          }}>
            What instrument<br />will you play?
          </h2>
          <Link href="/capture" style={{
            display: 'inline-block', textDecoration: 'none',
            padding: '20px 36px', background: T.red, color: T.cream,
            fontWeight: 900, fontSize: 20, letterSpacing: -0.3,
            boxShadow: `8px 8px 0 0 ${T.cream}22`,
          }}>
            📷 PHOTOGRAPH AN INSTRUMENT →
          </Link>
          <div style={{
            marginTop: 20, fontFamily: T.mono, fontSize: 10, letterSpacing: 1.4, opacity: 0.4,
          }}>
            FREE · NO ACCOUNT · WORKS IN ANY BROWSER
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '24px 32px',
        borderTop: `2px solid ${T.cream}15`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: T.mono, fontSize: 10, letterSpacing: 1.4, opacity: 0.35,
      }}>
        <span>© PLAYABLE INSTRUMENT — 2026</span>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/play" style={{ color: 'inherit', textDecoration: 'none' }}>TYPE A VIBE</Link>
          <Link href="/library" style={{ color: 'inherit', textDecoration: 'none' }}>LIBRARY</Link>
        </div>
      </footer>
    </div>
  );
}
