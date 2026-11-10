'use client';

import { useCallback, useEffect, useState } from 'react';
import { amiri } from '@/app/fonts';
import Image from 'next/image';
import Marquee from 'react-fast-marquee';
import { ExternalLink, BookOpen } from 'lucide-react';
import EnvelopeIntro from './EnvelopeIntro';
import {
  CARD_RATIO, CARD_WIDTH_CSS, CardText, Divider, FrameBorder, RoyalStyles, Sparkles,
  buildLines, formatDate, totalChars, type CardForm,
} from './royal';

export type PreviewForm = CardForm & { mapsLink: string };

const script = { fontFamily: 'cursive' } as const;

/** the opening block of the frame: its text writes itself once the envelope has opened */
function Hero({ form, active }: { form: CardForm; active: boolean }) {
  const [typed, setTyped] = useState(0);
  const [started, setStarted] = useState(false);
  const lines = buildLines(form);
  const total = totalChars(lines);

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setStarted(true), 900);
    return () => clearTimeout(t);
  }, [active]);

  useEffect(() => {
    if (!started || typed >= total) return;
    const id = setTimeout(() => setTyped((n) => n + 1), 55);
    return () => clearTimeout(id);
  }, [started, typed, total]);

  return (
    <section
      className="relative"
      style={{
        // exactly one card tall, so it lines up with the card shown during the envelope intro
        minHeight: `calc(var(--cw) / ${CARD_RATIO})`,
        paddingBlock: 'calc(var(--cw) * 0.15)',
        boxSizing: 'border-box',
      }}
    >
      <CardText lines={lines} typed={typed} inline />
      <div
        className="absolute left-0 right-0 flex justify-center pointer-events-none transition-opacity duration-1000"
        aria-hidden="true"
        style={{ bottom: '4cqw', opacity: active ? 1 : 0, transitionDelay: '3s' }}
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center animate-bounce bg-[#3A0E18]/70 border border-[#D4AF37]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12l7 7 7-7"></path>
          </svg>
        </div>
      </div>
    </section>
  );
}

/** a section inside the frame, separated from the previous one by a gold divider */
function Block({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex justify-center"><Divider /></div>
      <section className="flex flex-col items-center text-center" style={{ paddingBlock: '9cqw', gap: '2.5cqw' }}>
        {children}
      </section>
    </>
  );
}

function useCountdown(iso: string) {
  const [left, setLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
  useEffect(() => {
    const target = new Date(`${iso}T00:00:00`).getTime();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [iso]);
  return left;
}

export default function InvitationPreview({
  form,
  validMaps,
  guestbookOn,
}: {
  form: PreviewForm;
  validMaps: boolean;
  guestbookOn: boolean;
}) {
  const [revealed, setRevealed] = useState(false);
  const onReveal = useCallback(() => setRevealed(true), []);
  const countdown = useCountdown(form.date);
  const cells: [string, number | undefined][] = [
    ['Days', countdown?.d], ['Hours', countdown?.h], ['Mins', countdown?.m], ['Secs', countdown?.s],
  ];

  return (
    <main
      className="wedvite-invitation min-h-screen relative overflow-x-hidden notranslate"
      dir="ltr"
      style={{
        '--cw': CARD_WIDTH_CSS,
        '--background': 'transparent',
        '--foreground': '#F6EFE3',
        backgroundColor: '#2A080F',
        color: 'var(--foreground)',
        fontFamily: 'serif',
      } as React.CSSProperties}
    >
      <RoyalStyles />
      <EnvelopeIntro onReveal={onReveal} />

      {/* fixed backdrop: the frame's marbled burgundy, softly blurred, with drifting gold sparkles */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute"
          style={{
            inset: -60,
            backgroundImage: 'url("/images/frame.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(30px) brightness(.6)',
          }}
        />
        <Sparkles count={70} seed={7} />
      </div>

      <div className="relative z-10">
        {/* centers the first screen exactly where the envelope's card sits */}
        <div style={{ paddingTop: `max(0px, calc((100vh - var(--cw) / ${CARD_RATIO}) / 2))`, paddingBottom: 48 }}>
          {/* ONE FRAME holding every section */}
          <div className="relative mx-auto" style={{ width: '70%' }}>
            <FrameBorder />
            <Sparkles count={60} seed={21} />

            <div className="relative" style={{ containerType: 'inline-size' }}>
              <div style={{ padding: '0 5%' }}>
                <Hero form={form} active={revealed} />

                {/* COUNTDOWN */}
                <Block>
                  <h2 className="ei-foil" style={{ ...script, fontSize: '11cqw', lineHeight: 1.1 }}>Countdown</h2>
                  <p className="uppercase tracking-[0.25em] text-[#F2E6C9]/80" style={{ fontSize: '3cqw' }}>{formatDate(form.date)}</p>
                  <div className="grid grid-cols-4 w-full" style={{ gap: '1.5cqw', marginTop: '2cqw' }} dir="ltr">
                    {cells.map(([label, value]) => (
                      <div key={label} className="rounded-sm border border-[#D4AF37]/40 bg-black/20" style={{ padding: '2.5cqw 0.5cqw' }}>
                        <span className="block tabular-nums leading-none text-[#F9F3EA] font-light" style={{ fontSize: '6.5cqw' }}>
                          {value ?? '--'}
                        </span>
                        <span className="block text-[#D4AF37] uppercase" style={{ fontSize: '2.2cqw', letterSpacing: '0.15em', marginTop: '1.2cqw' }}>
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </Block>

                {/* WELCOME */}
                <Block>
                  <h2 className="ei-foil" style={{ ...script, fontSize: '13cqw', lineHeight: 1.1 }}>Welcome!</h2>
                  <p className="font-light text-[#F9F3EA]/90" style={{ fontSize: '3.7cqw', lineHeight: 1.9 }}>
                    We joyfully invite you to celebrate the beginning of our forever. Here you&apos;ll find everything you need for our special day.
                  </p>
                </Block>

                {/* GALLERY */}
                <Block>
                  <h2 className="ei-foil" style={{ ...script, fontSize: '11cqw', lineHeight: 1.1, marginBottom: '2cqw' }}>Our Moments</h2>
                  <div dir="ltr" className="w-full">
                    <Marquee speed={35} gradient={false}>
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                          key={i}
                          className="relative shrink-0 overflow-hidden rounded-sm shadow-2xl border border-[#D4AF37]/50"
                          style={{ height: '46cqw', width: '33cqw', marginInline: '1.5cqw' }}
                        >
                          <Image src={`/gallery/gallery-${i}.jpg`} alt={`Photo ${i}`} fill className="object-cover" />
                        </div>
                      ))}
                    </Marquee>
                  </div>
                </Block>

                {/* WHEN & WHERE */}
                <Block>
                  <h2 className="ei-foil" style={{ ...script, fontSize: '10cqw', lineHeight: 1.1 }}>When &amp; Where</h2>
                  <p className="text-[#D4AF37] uppercase font-bold" style={{ fontSize: '3.4cqw', letterSpacing: '0.22em' }}>{formatDate(form.date)}</p>
                  <h3 className="text-[#F9F3EA]" style={{ fontSize: '5.4cqw', lineHeight: 1.25 }}>{form.locationEn || '—'}</h3>
                  <p className={`${amiri.className} text-[#D4AF37]`} style={{ fontSize: '5cqw' }} dir="rtl">{form.locationAr || '—'}</p>
                  {validMaps && (
                    <a
                      href={form.mapsLink.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full font-semibold uppercase shadow-lg hover:brightness-110 transition"
                      style={{
                        marginTop: '2cqw', padding: '2.4cqw 6cqw', fontSize: '2.8cqw', letterSpacing: '0.2em',
                        background: 'linear-gradient(120deg, #B8892B, #F6E27A, #C9A227)', color: '#3A0E18',
                      }}
                    >
                      Open Maps <ExternalLink size={14} />
                    </a>
                  )}
                </Block>

                {/* GUESTBOOK */}
                {guestbookOn && (
                  <Block>
                    <BookOpen className="text-[#D4AF37]" style={{ width: '9cqw', height: '9cqw' }} />
                    <h2 className="ei-foil" style={{ ...script, fontSize: '10cqw', lineHeight: 1.1 }}>Guestbook</h2>
                    <p className="text-[#F9F3EA]/85" style={{ fontSize: '3.4cqw', lineHeight: 1.8 }}>
                      Your guests will be able to leave heartfelt messages and wishes directly on your digital invitation link.
                    </p>
                    <p className={`${amiri.className} text-[#D4AF37]`} style={{ fontSize: '4cqw' }} dir="rtl">سجل الضيوف مفعيل</p>
                  </Block>
                )}

                <div style={{ height: '8cqw' }} />
              </div>
            </div>
          </div>
        </div>

        <footer className="py-10 text-center text-xs tracking-widest uppercase text-[#D4AF37]/70 border-t border-[#D4AF37]/20 bg-[#1F050B]/80">
          LayaliHub &bull; Toscana Luxury Collection
        </footer>
      </div>
    </main>
  );
}
