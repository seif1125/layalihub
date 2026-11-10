'use client';

import { useEffect, useState } from 'react';
import { FramedCard, RoyalStyles, Sparkles, GOLD, cardWidthPx } from './royal';

type Stage = 'closed' | 'opening' | 'rising' | 'reading' | 'gone';

// one gentle ease-in-out used by every move so the whole sequence feels continuous
const EASE = 'cubic-bezier(.65,0,.35,1)';

/**
 * Full-screen royal burgundy envelope. Flap opens, the card slides out,
 * the envelope drops away and the overlay dissolves into the real invitation.
 */
export default function EnvelopeIntro({ onReveal }: { onReveal: () => void }) {
  const [stage, setStage] = useState<Stage>('closed');
  const [dims, setDims] = useState<{ vw: number; vh: number; pw: number } | null>(null);

  useEffect(() => {
    const t = [
      setTimeout(() => setStage('opening'), 3000),  // flap opens (1.5s)
      setTimeout(() => setStage('rising'), 4600),   // card slides up out of the pocket (1.5s)
      setTimeout(() => setStage('reading'), 6300),  // envelope drops away, overlay dissolves
      setTimeout(() => setStage('gone'), 8600),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const measure = () => {
      const vw = window.innerWidth, vh = window.innerHeight;
      setDims({ vw, vh, pw: cardWidthPx(vw, vh) });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    if (stage === 'reading') onReveal();
  }, [stage, onReveal]);

  useEffect(() => {
    if (stage === 'gone') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [stage]);

  if (stage === 'gone') return null;

  const flapOpen = stage !== 'closed';
  const rising = stage === 'rising';
  const reading = stage === 'reading';

  const skip = () => setStage('reading');

  let cardTransform = 'translate(-50%, -50%)';
  let cardOpacity = 0;
  if (dims) {
    if (reading) { cardTransform = 'translate(-50%, -50%) translateY(0px) scale(1)'; cardOpacity = 1; }
    else if (rising) { cardTransform = `translate(-50%, -50%) translateY(${-0.02 * dims.vh}px) scale(.92)`; cardOpacity = 1; }
    else { cardTransform = `translate(-50%, -50%) translateY(${0.55 * dims.vh}px) scale(.85)`; }
  }

  return (
    <div
      className="fixed inset-0 z-[200] overflow-hidden"
      style={{
        backgroundColor: '#2A080F',
        backgroundImage: 'linear-gradient(rgba(25,4,10,.55), rgba(25,4,10,.7)), url("/images/frame.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: reading ? 0 : 1,
        transition: `opacity 1300ms ease ${reading ? '800ms' : '0ms'}`,
        pointerEvents: reading ? 'none' : 'auto',
      }}
      role="dialog"
      aria-label="Wedding invitation"
    >
      <RoyalStyles />
      <Sparkles count={70} seed={7} />

      {dims && (() => {
        const W = dims.vw, H = dims.vh, cx = W / 2;
        const sw = Math.max(1.5, Math.min(4, W * 0.0045));      // thin gold line
        const apexY = H * 0.34;                                  // where the pocket panels meet
        const flapH = H * 0.66;                                  // flap tip (bottom of the V)
        const rr = Math.min(W, H) * 0.07;                        // tip rounding
        const Ls = [W * 0.025, H * 0.095], Rs = [W * 0.975, H * 0.095];
        const tip = [cx, flapH];
        const toward = (from: number[], d: number) => {
          const dx = from[0] - tip[0], dy = from[1] - tip[1], len = Math.hypot(dx, dy);
          return [tip[0] + (dx / len) * d, tip[1] + (dy / len) * d];
        };
        const A = toward(Ls, rr * 1.6), B = toward(Rs, rr * 1.6);
        const flapEdge =
          `M0 ${H * 0.06} Q0 ${H * 0.078} ${Ls[0]} ${Ls[1]} L${A[0]} ${A[1]} Q${tip[0]} ${tip[1] + rr * 0.35} ${B[0]} ${B[1]} L${Rs[0]} ${Rs[1]} Q${W} ${H * 0.078} ${W} ${H * 0.06}`;
        const flapShape = `${flapEdge} L${W} 0 L0 0 Z`;
        const pocketLine =
          `M0 ${H * 0.955} Q${W * 0.012} ${H * 0.935} ${W * 0.05} ${H * 0.885} L${cx} ${apexY} L${W * 0.95} ${H * 0.885} Q${W * 0.988} ${H * 0.935} ${W} ${H * 0.955}`;

        const slide: React.CSSProperties = {
          opacity: reading ? 0 : 1,
          transform: reading ? 'translate3d(0,104%,0)' : 'translate3d(0,0,0)',
          transition: `transform 1600ms ${EASE}, opacity 1000ms ease 500ms`,
          willChange: 'transform, opacity',
        };

        return (
          <div className="absolute inset-0">
            {/* BACK of the envelope (lining seen when the flap is open) */}
            <div className="absolute inset-0" style={{ ...slide, zIndex: 1 }}>
              <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full">
                <defs>
                  <linearGradient id="ei-lining" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#2A0A13" /><stop offset="1" stopColor="#42101E" />
                  </linearGradient>
                </defs>
                <rect width={W} height={H} fill="url(#ei-lining)" />
              </svg>
            </div>

            {/* INVITATION CARD — sits between the back and the pocket */}
            <div
              className="absolute left-1/2 top-1/2"
              style={{
                transform: cardTransform,
                opacity: cardOpacity,
                transition: `transform 1700ms ${EASE}, opacity 800ms ease`,
                zIndex: 2,
                willChange: 'transform, opacity',
              }}
            >
              <FramedCard />
            </div>

            {/* FRONT of the envelope: pocket panels + flap */}
            <div className="absolute inset-0" style={{ ...slide, zIndex: 3, perspective: '1800px' }}>
              <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" style={{ zIndex: 20 }}>
                <defs>
                  <linearGradient id="ei-gold" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#E8C987" /><stop offset=".5" stopColor="#C9A05A" /><stop offset="1" stopColor="#E2BE7B" />
                  </linearGradient>
                  <linearGradient id="ei-pk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#5C1A2C" /><stop offset="1" stopColor="#4F1526" />
                  </linearGradient>
                  <radialGradient id="ei-vig" cx=".5" cy=".5" r=".75">
                    <stop offset=".55" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".32" />
                  </radialGradient>
                </defs>
                <polygon points={`0,0 ${cx},${apexY} 0,${H}`} fill="url(#ei-pk)" />
                <polygon points={`${W},0 ${cx},${apexY} ${W},${H}`} fill="url(#ei-pk)" />
                <polygon points={`0,${H} ${cx},${apexY} ${W},${H}`} fill="#591A2B" />
                <path d={pocketLine} fill="none" stroke="url(#ei-gold)" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
                <rect width={W} height={H} fill="url(#ei-vig)" />
              </svg>

              {/* flap — folds up and out of the top of the screen */}
              <div
                className="absolute left-0 right-0 top-0"
                style={{
                  height: flapH + rr,
                  transformOrigin: 'top center',
                  transform: flapOpen ? 'rotateX(180deg)' : 'rotateX(0deg)',
                  transition: `transform 1500ms ${EASE}, z-index 0s linear ${flapOpen ? '0.75s' : '0s'}`,
                  zIndex: flapOpen ? 5 : 30,
                  transformStyle: 'preserve-3d',
                  willChange: 'transform',
                }}
              >
                <svg viewBox={`0 0 ${W} ${flapH + rr}`} className="absolute inset-0 w-full h-full" style={{ backfaceVisibility: 'hidden', overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="ei-flapg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#601C30" /><stop offset="1" stopColor="#581828" />
                    </linearGradient>
                    <filter id="ei-flapsh" x="-5%" y="-5%" width="110%" height="120%">
                      <feDropShadow dx="0" dy={sw * 2.5} stdDeviation={sw * 3} floodColor="#000" floodOpacity=".45" />
                    </filter>
                  </defs>
                  <path d={flapShape} fill="url(#ei-flapg)" filter="url(#ei-flapsh)" />
                  <path d={flapEdge} fill="none" stroke="url(#ei-gold)" strokeWidth={sw * 1.7} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <svg viewBox={`0 0 ${W} ${flapH + rr}`} className="absolute inset-0 w-full h-full" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', overflow: 'visible' }}>
                  <path d={flapShape} fill="#33101C" />
                  <path d={flapEdge} fill="none" stroke="url(#ei-gold)" strokeWidth={sw * 1.2} strokeLinecap="round" strokeLinejoin="round" opacity=".8" />
                </svg>
              </div>
            </div>
          </div>
        );
      })()}

      {!reading && (
        <button
          onClick={skip}
          className="absolute bottom-6 right-6 text-[11px] uppercase tracking-widest hover:opacity-100"
          style={{ zIndex: 60, color: GOLD, opacity: 0.6 }}
        >
          Skip
        </button>
      )}
    </div>
  );
}
