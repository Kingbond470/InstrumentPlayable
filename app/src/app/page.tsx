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
        padding: 'clamp(12px, 2vw, 32px)',
        minHeight: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'clamp(8px, 2vw, 16px)' }}>
          <span style={{
            fontWeight: 900,
            fontSize: 'clamp(14px, 4vw, 18px)',
            letterSpacing: -0.5,
          }}>PLAYABLE INSTRUMENT</span>
          <span style={{
            fontFamily: T.mono,
            fontSize: 'clamp(7px, 1.5vw, 9px)',
            letterSpacing: 1.6,
            opacity: 0.4,
            display: ['none', 'none', 'none', 'inline'].includes('') ? 'none' : 'inline',
          }}>
            AS SEEN AT THE MET · NYC
          </span>
        </div>
        <div style={{ display: 'flex', gap: 'clamp(6px, 1vw, 8px)', flexWrap: 'wrap' }}>
          <Link href="/library" style={{
            padding: '7px 10px',
            background: 'transparent',
            color: `${T.cream}88`,
            textDecoration: 'none',
            fontFamily: T.mono,
            fontSize: 'clamp(8px, 1.5vw, 10px)',
            letterSpacing: 1.4,
            fontWeight: 700,
            border: `1.5px solid ${T.cream}22`,
            whiteSpace: 'nowrap',
          }}>LIBRARY</Link>
          <Link href="/capture" style={{
            padding: 'clamp(7px, 1vw, 9px) clamp(10px, 2vw, 16px)',
            background: T.cream,
            color: T.ink,
            textDecoration: 'none',
            fontFamily: T.mono,
            fontSize: 'clamp(8px, 1.5vw, 10px)',
            letterSpacing: 1.4,
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}>PHOTOGRAPH →</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: 'clamp(40px, 10vw, 100px) clamp(16px, 5vw, 32px)',
        borderBottom: `2px solid ${T.cream}22`,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'clamp(24px, 5vw, 64px)',
        alignItems: 'center',
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 'clamp(16px, 3vw, 28px)',
            padding: 'clamp(4px, 1vw, 6px) clamp(8px, 2vw, 12px)',
            background: `${T.cream}12`,
            border: `1px solid ${T.cream}22`,
            fontFamily: T.mono,
            fontSize: 'clamp(7px, 1.5vw, 10px)',
            letterSpacing: 1.6,
            fontWeight: 700,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.red }} />
            WON FIRST PLACE · CLAUDE × MET HACKATHON
          </div>

          <h1 style={{
            margin: '0 0 clamp(16px, 3vw, 28px)',
            fontWeight: 900,
            fontSize: 'clamp(32px, 8vw, 96px)',
            lineHeight: 0.86,
            letterSpacing: -4,
            color: T.cream,
          }}>
            Photograph it.<br />
            <span style={{ color: T.red }}>Play it.</span>
          </h1>

          <p style={{
            margin: '0 0 clamp(24px, 5vw, 40px)',
            maxWidth: 520,
            fontSize: 'clamp(14px, 3vw, 20px)',
            lineHeight: 1.45,
            opacity: 0.72,
          }}>
            Point your camera at any instrument — real, painted, or sculpted. AI identifies
            it. You play it instantly. No music knowledge. No account.
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(8px, 2vw, 14px)',
            flexWrap: 'wrap',
          }}>
            <Link href="/capture" style={{
              display: 'inline-block',
              textDecoration: 'none',
              padding: 'clamp(12px, 2vw, 18px) clamp(20px, 4vw, 32px)',
              background: T.red,
              color: T.cream,
              border: `2px solid ${T.red}`,
              fontWeight: 900,
              fontSize: 'clamp(12px, 2.5vw, 18px)',
              letterSpacing: -0.3,
              boxShadow: `clamp(3px, 1vw, 6px) clamp(3px, 1vw, 6px) 0 0 ${T.cream}33`,
              whiteSpace: 'nowrap',
            }}>
              📷 PHOTOGRAPH
            </Link>
            <Link href="/play" style={{
              display: 'inline-block',
              textDecoration: 'none',
              padding: 'clamp(12px, 2vw, 18px) clamp(16px, 3vw, 24px)',
              background: 'transparent',
              color: `${T.cream}88`,
              border: `1.5px solid ${T.cream}33`,
              fontFamily: T.mono,
              fontSize: 'clamp(9px, 1.5vw, 11px)',
              letterSpacing: 1.4,
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}>
              TYPE A VIBE →
            </Link>
          </div>

          <div style={{
            marginTop: 'clamp(16px, 3vw, 28px)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: 'clamp(12px, 2vw, 28px)',
            fontFamily: T.mono,
            fontSize: 'clamp(7px, 1.2vw, 10px)',
            letterSpacing: 1.4,
            opacity: 0.45,
          }}>
            <span>NO ACCOUNT</span>
            <span>WORKS IN BROWSER</span>
            <span>100+ INSTRUMENTS</span>
          </div>
        </div>

        {/* Instrument grid preview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 'clamp(8px, 2vw, 10px)',
        }}>
          {INSTRUMENTS.map((inst) => (
            <Link key={inst.name} href={`/capture?instrument=${inst.name.toLowerCase()}`}
              style={{
                textDecoration: 'none',
                padding: 'clamp(12px, 2vw, 20px)',
                border: `1.5px solid ${inst.accent}55`,
                background: `${inst.accent}12`,
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(6px, 1.5vw, 10px)',
                transition: 'background 150ms',
              }}>
              <span style={{ fontSize: 'clamp(20px, 4vw, 28px)' }}>{inst.emoji}</span>
              <div>
                <div style={{
                  fontWeight: 900,
                  fontSize: 'clamp(14px, 2.5vw, 18px)',
                  letterSpacing: -0.4,
                  color: T.cream,
                }}>{inst.name}</div>
                <div style={{
                  fontFamily: T.mono,
                  fontSize: 'clamp(7px, 1.2vw, 9px)',
                  letterSpacing: 1.4,
                  color: inst.accent,
                  marginTop: 2,
                }}>{inst.culture.toUpperCase()}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{
        padding: 'clamp(40px, 10vw, 80px) clamp(16px, 5vw, 32px)',
        borderBottom: `2px solid ${T.cream}22`,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 0,
      }}>
        <div style={{
          fontFamily: T.mono,
          fontSize: 'clamp(8px, 1.5vw, 10px)',
          letterSpacing: 1.6,
          opacity: 0.45,
          gridColumn: '1/-1',
          marginBottom: 'clamp(24px, 5vw, 40px)',
        }}>
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
          <div key={f.n} style={{
            padding: 'clamp(16px, 3vw, 32px)',
            borderLeft: i > 0 ? `2px solid ${T.cream}15` : 'none',
            borderTop: '2px solid transparent',
          }}>
            <span style={{
              fontFamily: T.mono,
              fontSize: 'clamp(9px, 1.5vw, 11px)',
              letterSpacing: 1.6,
              fontWeight: 700,
              color: T.red,
            }}>{f.n}</span>
            <h3 style={{
              margin: 'clamp(8px, 1.5vw, 12px) 0 clamp(8px, 1.5vw, 14px)',
              fontWeight: 900,
              fontSize: 'clamp(18px, 4vw, 32px)',
              letterSpacing: -1,
              lineHeight: 1,
              color: T.cream,
            }}>
              {f.t}
            </h3>
            <p style={{
              margin: 0,
              fontSize: 'clamp(13px, 2vw, 15px)',
              lineHeight: 1.5,
              opacity: 0.65,
            }}>{f.d}</p>
          </div>
        ))}
      </section>

      {/* Cultural instruments showcase */}
      <section style={{
        padding: 'clamp(40px, 10vw, 80px) clamp(16px, 5vw, 32px)',
        borderBottom: `2px solid ${T.cream}22`,
      }}>
        <div style={{
          display: 'flex',
          flexDirection: ['column', 'column', 'row'].includes('') ? 'column' : 'column',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 'clamp(16px, 3vw, 32px)',
          marginBottom: 'clamp(20px, 4vw, 32px)',
        }}>
          <h2 style={{
            margin: 0,
            fontWeight: 900,
            fontSize: 'clamp(28px, 6vw, 52px)',
            letterSpacing: -2,
            color: T.cream,
            lineHeight: 1.1,
          }}>
            Every culture.<br />Every era.
          </h2>
          <span style={{
            fontFamily: T.mono,
            fontSize: 'clamp(8px, 1.2vw, 10px)',
            letterSpacing: 1.4,
            opacity: 0.4,
            whiteSpace: 'nowrap',
          }}>
            15 INSTRUMENTS · 10 CULTURES
          </span>
        </div>
        <div style={{ display: 'flex', gap: 'clamp(6px, 1.5vw, 10px)', flexWrap: 'wrap' }}>
          {[
            ['Tabla', '#C2703A'], ['Sitar', '#8B5E3C'], ['Bansuri', '#4A7C59'],
            ['Erhu', '#A0522D'], ['Koto', '#6B4C3B'], ['Mbira', '#7B6B3D'],
            ['Kora', '#8B7355'], ['Guitar', '#6B3A2A'], ['Violin', '#7B3F00'],
            ['Harp', '#4A4A8A'], ['Flute', '#2E6B4F'], ['Djembe', '#8B4513'],
            ['Trumpet', '#B8860B'], ['Piano', '#1A1A4E'],
          ].map(([name, accent]) => (
            <span key={name} style={{
              padding: 'clamp(6px, 1.5vw, 8px) clamp(10px, 2vw, 14px)',
              border: `1.5px solid ${accent}44`,
              background: `${accent}18`,
              color: T.cream,
              fontFamily: T.mono,
              fontSize: 'clamp(9px, 1.5vw, 11px)',
              letterSpacing: 0.8,
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}>{name}</span>
          ))}
        </div>
      </section>

      {/* The Met connection */}
      <section style={{
        padding: 'clamp(40px, 10vw, 80px) clamp(16px, 5vw, 32px)',
        borderBottom: `2px solid ${T.cream}22`,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'clamp(24px, 5vw, 64px)',
        alignItems: 'center',
      }}>
        <div>
          <div style={{
            fontFamily: T.mono,
            fontSize: 'clamp(8px, 1.5vw, 10px)',
            letterSpacing: 1.6,
            opacity: 0.45,
            marginBottom: 'clamp(12px, 2vw, 20px)',
          }}>
            ORIGIN STORY
          </div>
          <h2 style={{
            margin: '0 0 clamp(12px, 2vw, 20px)',
            fontWeight: 900,
            fontSize: 'clamp(28px, 6vw, 52px)',
            letterSpacing: -2,
            lineHeight: 0.9,
            color: T.cream,
          }}>
            Born at<br />The Met.
          </h2>
          <p style={{
            margin: '0 0 clamp(16px, 3vw, 24px)',
            fontSize: 'clamp(14px, 2.5vw, 17px)',
            lineHeight: 1.5,
            opacity: 0.7,
          }}>
            This project won first place at a Claude × Met Museum hackathon in New York City.
            The challenge: make art more immersive for museum visitors. The solution: let anyone
            photograph an instrument in a painting and play it.
          </p>
          <p style={{
            margin: 0,
            fontSize: 'clamp(13px, 2vw, 15px)',
            lineHeight: 1.5,
            opacity: 0.55,
          }}>
            Built with Claude Code. Zero prior coding experience. One afternoon.
          </p>
        </div>
        <div style={{
          padding: 'clamp(20px, 3vw, 32px)',
          border: `2px solid ${T.cream}22`,
          background: `${T.cream}06`,
        }}>
          <div style={{
            fontFamily: T.mono,
            fontSize: 'clamp(8px, 1.2vw, 9px)',
            letterSpacing: 1.6,
            opacity: 0.45,
            marginBottom: 'clamp(12px, 2vw, 16px)',
          }}>
            THE IDEA
          </div>
          <p style={{
            margin: 0,
            fontWeight: 900,
            fontSize: 'clamp(18px, 4vw, 28px)',
            lineHeight: 1.1,
            letterSpacing: -0.5,
            color: T.cream,
          }}>
            "What if every instrument in every painting could be played?"
          </p>
          <div style={{
            marginTop: 'clamp(16px, 3vw, 24px)',
            fontFamily: T.mono,
            fontSize: 'clamp(8px, 1.2vw, 10px)',
            letterSpacing: 1.4,
            opacity: 0.4,
          }}>
            ASIAN ART DEPARTMENT · THE MET
          </div>
        </div>
      </section>

      {/* Big CTA */}
      <section style={{
        padding: 'clamp(50px, 10vw, 100px) clamp(16px, 5vw, 32px)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          right: 'clamp(-150px, -20vw, -100px)',
          top: 'clamp(-150px, -20vw, -100px)',
          width: 'clamp(300px, 40vw, 400px)',
          height: 'clamp(300px, 40vw, 400px)',
          borderRadius: '50%',
          background: T.red,
          opacity: 0.12,
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', maxWidth: 800 }}>
          <h2 style={{
            margin: '0 0 clamp(20px, 4vw, 32px)',
            fontWeight: 900,
            fontSize: 'clamp(36px, 10vw, 100px)',
            lineHeight: 0.88,
            letterSpacing: -4,
            color: T.cream,
          }}>
            What instrument<br />will you play?
          </h2>
          <Link href="/capture" style={{
            display: 'inline-block',
            textDecoration: 'none',
            padding: 'clamp(14px, 2.5vw, 20px) clamp(24px, 4vw, 36px)',
            background: T.red,
            color: T.cream,
            fontWeight: 900,
            fontSize: 'clamp(13px, 3vw, 20px)',
            letterSpacing: -0.3,
            boxShadow: `clamp(4px, 1.5vw, 8px) clamp(4px, 1.5vw, 8px) 0 0 ${T.cream}22`,
            whiteSpace: 'nowrap',
          }}>
            📷 PHOTOGRAPH
          </Link>
          <div style={{
            marginTop: 'clamp(12px, 2vw, 20px)',
            fontFamily: T.mono,
            fontSize: 'clamp(8px, 1.2vw, 10px)',
            letterSpacing: 1.4,
            opacity: 0.4,
          }}>
            FREE · NO ACCOUNT · WORKS IN BROWSER
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: 'clamp(16px, 3vw, 24px) clamp(12px, 3vw, 32px)',
        borderTop: `2px solid ${T.cream}15`,
        display: 'flex',
        flexDirection: ['column', 'column', 'row'].includes('') ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 'clamp(12px, 2vw, 20px)',
        fontFamily: T.mono,
        fontSize: 'clamp(8px, 1.2vw, 10px)',
        letterSpacing: 1.4,
        opacity: 0.35,
      }}>
        <span style={{ whiteSpace: 'nowrap' }}>© PLAYABLE INSTRUMENT — 2026</span>
        <div style={{ display: 'flex', gap: 'clamp(12px, 2vw, 24px)' }}>
          <Link href="/play" style={{ color: 'inherit', textDecoration: 'none' }}>TYPE A VIBE</Link>
          <Link href="/library" style={{ color: 'inherit', textDecoration: 'none' }}>LIBRARY</Link>
        </div>
      </footer>
    </div>
  );
}
