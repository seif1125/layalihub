'use client';

import { useMemo } from 'react';
import { amiri } from '@/app/fonts';

export const GOLD = '#D4AF37';
export const GOLD_LIGHT = '#F6E27A';

// frame.jpg is 912x1180; the card inside it spans x 84..828, y 100..1072
export const FRAME = { w: 912, h: 1180, x: 84, y: 100, cw: 744, ch: 972 };
export const CARD_RATIO = FRAME.cw / FRAME.ch;
// one width formula shared by the intro card and the hero card so they line up exactly
export const CARD_WIDTH_CSS = 'min(94vw, 68.8vh, 520px)';
export const cardWidthPx = (vw: number, vh: number) => Math.min(vw * 0.94, vh * 0.688, 520);

export type CardForm = {
  groomEn: string; groomAr: string; brideEn: string; brideAr: string;
  locationEn: string; locationAr: string; date: string; // ISO yyyy-mm-dd
};

export function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeSparkles(n: number, seed: number) {
  const r = rng(seed);
  return Array.from({ length: n }, () => ({
    left: r() * 100, top: r() * 100, size: 1.5 + r() * 3.5,
    delay: r() * 6, dur: 3 + r() * 5, drift: 10 + r() * 30,
  }));
}

export function Sparkles({ count, seed }: { count: number; seed: number }) {
  const items = useMemo(() => makeSparkles(count, seed), [count, seed]);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {items.map((s, i) => (
        <span
          key={i}
          className="ei-spark"
          style={{
            left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size,
            animationDelay: `${s.delay}s`, animationDuration: `${s.dur}s`,
            ['--drift' as string]: `${s.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

/** keyframes + foil text styles used by the intro and the invitation */
export function RoyalStyles() {
  return (
    <style>{`
      @keyframes ei-twinkle {
        0%, 100% { opacity: 0; transform: translateY(0) scale(.4); }
        50% { opacity: 1; transform: translateY(calc(var(--drift) * -1)) scale(1); }
      }
      @keyframes ei-shine {
        0% { transform: translateX(-120%) skewX(-20deg); }
        60%, 100% { transform: translateX(260%) skewX(-20deg); }
      }
      @keyframes ei-foil {
        0% { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
      }
      @keyframes ei-fadein {
        from { opacity: 0; transform: translateY(6px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .ei-spark {
        position: absolute; border-radius: 9999px;
        background: radial-gradient(circle, #fff6c8 0%, ${GOLD} 55%, transparent 72%);
        box-shadow: 0 0 6px 1px rgba(246,226,122,.7);
        opacity: 0; animation: ei-twinkle 5s ease-in-out infinite;
      }
      .ei-foil {
        background-image: linear-gradient(100deg, #B8892B 0%, #F6E27A 25%, #D4AF37 45%, #FFF3B0 55%, #C9A227 75%, #B8892B 100%);
        background-size: 200% 100%;
        -webkit-background-clip: text; background-clip: text;
        color: transparent; -webkit-text-fill-color: transparent;
        animation: ei-foil 5s linear infinite;
        filter: drop-shadow(0 1px 6px rgba(0,0,0,.45));
      }
      @media (prefers-reduced-motion: reduce) {
        .ei-spark, .ei-foil { animation: none; opacity: .8; }
      }
    `}</style>
  );
}

/** frame.jpg cropped exactly to the card, with moving gold sparkles and a light sweep */
export function FramedCard({
  style, children, sparkleSeed = 21,
}: { style?: React.CSSProperties; children?: React.ReactNode; sparkleSeed?: number }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: CARD_WIDTH_CSS,
        aspectRatio: `${FRAME.cw} / ${FRAME.ch}`,
        backgroundImage: 'url("/images/frame.jpg")',
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${(FRAME.w / FRAME.cw) * 100}% auto`,
        backgroundPosition: `${(FRAME.x / (FRAME.w - FRAME.cw)) * 100}% ${(FRAME.y / (FRAME.h - FRAME.ch)) * 100}%`,
        boxShadow: '0 25px 70px rgba(0,0,0,.65), 0 0 40px rgba(212,175,55,.18)',
        containerType: 'inline-size',
        fontFamily: 'serif',
        ...style,
      }}
    >
      <Sparkles count={26} seed={sparkleSeed} />
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-0 bottom-0 w-[35%]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(246,226,122,.16), transparent)',
            animation: 'ei-shine 6s ease-in-out infinite',
          }}
        />
      </div>
      {children}
    </div>
  );
}

type Line = { text: string; size: string; className?: string; rtl?: boolean; gold?: boolean; caps?: boolean };

export function buildLines(f: CardForm): Line[] {
  return [
    { text: "We're getting married", size: '3.1cqw', caps: true, className: 'tracking-[0.32em]' },
    { text: f.groomEn || '—', size: '11cqw', gold: true },
    { text: '&', size: '6cqw' },
    { text: f.brideEn || '—', size: '11cqw', gold: true },
    { text: `${f.groomAr || '—'} & ${f.brideAr || '—'}`, size: '6cqw', rtl: true, className: amiri.className },
    { text: formatDate(f.date), size: '4cqw', caps: true, gold: true, className: 'tracking-[0.25em] font-bold' },
    { text: f.locationEn || '', size: '3.6cqw' },
    { text: f.locationAr || '', size: '4.4cqw', rtl: true, className: amiri.className },
  ];
}

export const totalChars = (lines: Line[]) => lines.reduce((n, l) => n + l.text.length, 0);

export function Divider() {
  return (
    <svg viewBox="0 0 200 16" className="w-[42%] my-[2.2cqw]" aria-hidden="true" style={{ animation: 'ei-fadein 900ms ease both' }}>
      <defs>
        <linearGradient id="ei-dv" x1="0" x2="1">
          <stop offset="0" stopColor={GOLD} stopOpacity="0" />
          <stop offset=".5" stopColor={GOLD_LIGHT} />
          <stop offset="1" stopColor={GOLD} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 8H86M114 8H200" stroke="url(#ei-dv)" strokeWidth="1" />
      <path d="M100 1 106 8 100 15 94 8Z" fill={GOLD} />
      <circle cx="88" cy="8" r="1.6" fill={GOLD} />
      <circle cx="112" cy="8" r="1.6" fill={GOLD} />
    </svg>
  );
}

/** the text of the invitation, written out character by character */
export function CardText({ lines, typed, inline = false }: { lines: Line[]; typed: number; inline?: boolean }) {
  const starts = lines.map((_, i) => lines.slice(0, i).reduce((n, l) => n + l.text.length, 0));
  return (
    <div
      className={`${inline ? 'w-full h-full' : 'absolute'} flex flex-col items-center justify-center text-center`}
      style={inline ? { gap: '1.6cqw' } : { left: '13%', right: '13%', top: '13%', bottom: '13%', gap: '1.6cqw' }}
    >
      {lines.map((l, i) => {
        const show = Math.max(0, Math.min(l.text.length, typed - starts[i]));
        if (!l.text) return null;
        const typingHere = show > 0 && show < l.text.length;
        return (
          <div key={i} className="contents">
            <div
              dir={l.rtl ? 'rtl' : 'ltr'}
              className={`${l.gold ? 'ei-foil' : 'text-[#F2E6C9]'} ${l.caps ? 'uppercase' : ''} ${l.className ?? ''}`}
              style={{ fontSize: l.size, lineHeight: 1.15, minHeight: '1.15em', overflowWrap: 'anywhere' }}
            >
              {l.text.slice(0, show)}
              {typingHere && (
                <span
                  className="inline-block animate-pulse align-middle"
                  style={{ width: 2, height: '0.9em', marginLeft: 2, background: GOLD }}
                />
              )}
            </div>
            {(i === 0 || i === 4) && show > 0 && <Divider />}
          </div>
        );
      })}
    </div>
  );
}

/**
 * One tall frame that wraps the whole page. frame-card.jpg (744x972) is cut as a
 * 9-slice: the 225px corners keep the royal ornaments, the edges stretch.
 * Needs --cw (column width) set on an ancestor.
 */
export const FRAME_SLICE = 225;
export function FrameBorder() {
  const bw = `calc(var(--cw) * ${FRAME_SLICE / FRAME.cw})`;
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{
        borderStyle: 'solid',
        borderColor: 'transparent',
        borderWidth: bw,
        borderImage: `url("/images/frame-card.jpg") ${FRAME_SLICE} fill / ${bw} stretch`,
        boxShadow: '0 25px 70px rgba(0,0,0,.65), 0 0 40px rgba(212,175,55,.18)',
      }}
    />
  );
}
