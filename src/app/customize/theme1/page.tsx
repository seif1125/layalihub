'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Amiri } from 'next/font/google';
import {
  MapPin, Copy, Check, BookOpen, ArrowLeft, ExternalLink, X, Send, SlidersHorizontal,
} from 'lucide-react';

const amiri = Amiri({ subsets: ['arabic'], weight: ['400', '700'] });

// Your WhatsApp number: digits only with country code (e.g. 2010xxxxxxxx)
const WHATSAPP_NUMBER = '';

// Frame image ratio (912 x 1180)
const RATIO = 912 / 1180;
const DRAWER_W = 420;

export default function CustomizePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState({
    groomEn: 'Ahmed',
    groomAr: 'أحمد',
    brideEn: 'Laila',
    brideAr: 'ليلى',
    locationEn: 'Grand Palace Hall, New Cairo',
    locationAr: 'قاعة القصر الكبير، القاهرة الجديدة',
    mapsLink: '',
  });
  const [guestbookOn, setGuestbookOn] = useState(false);
  const [privateToken, setPrivateToken] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDrawerOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const guestLink = `${origin}/invite/your-invitation`;
  const privateLink = privateToken ? `${origin}/guestbook/${privateToken}` : '';

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const validMaps = /^https?:\/\/(www\.)?(google\.[a-z.]+\/maps|maps\.google\.[a-z.]+|maps\.app\.goo\.gl|goo\.gl\/maps)/i.test(
    form.mapsLink.trim()
  );

  const toggleGuestbook = () => {
    const next = !guestbookOn;
    setGuestbookOn(next);
    if (next && !privateToken) setPrivateToken(crypto.randomUUID().replace(/-/g, '').slice(0, 16));
  };

  const copy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 1500);
    } catch {}
  };

  const orderMessage = [
    'Hello LayaliHub, I would like to order the Royal Burgundy invitation:',
    `Groom: ${form.groomEn} / ${form.groomAr}`,
    `Bride: ${form.brideEn} / ${form.brideAr}`,
    `Location (EN): ${form.locationEn}`,
    `Location (AR): ${form.locationAr}`,
    `Google Maps: ${validMaps ? form.mapsLink.trim() : 'not provided'}`,
    `Guestbook: ${guestbookOn ? `Yes (private key: ${privateToken})` : 'No'}`,
  ].join('\n');
  const orderHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderMessage)}`;

  const inputCls =
    'w-full rounded-xl border border-[#EAE3D2] bg-white px-4 py-3 text-sm text-[#2C2621] outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20';
  const labelCls = 'block text-xs uppercase tracking-widest text-[#8C6D33] font-semibold mb-2';

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#1a0610]">
      {/* FLOATING CONTROLS */}
      <Link
        href="/"
        className="fixed top-4 left-4 z-30 flex items-center gap-2 rounded-full bg-black/40 backdrop-blur px-4 py-2 text-xs uppercase tracking-widest text-[#F2E6C9] hover:bg-black/60 transition-colors"
      >
        <ArrowLeft size={14} /> Back
      </Link>

      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        aria-expanded={drawerOpen}
        aria-controls="order-drawer"
        className="fixed top-4 right-4 z-30 flex items-center gap-2 rounded-full bg-[#C5A059] px-5 py-2.5 text-xs uppercase tracking-widest font-medium text-[#2C2621] shadow-lg hover:bg-[#D4AF37] transition-colors"
      >
        <SlidersHorizontal size={14} /> Customize · تخصيص
      </button>

      {/* FULL-PAGE PREVIEW STAGE (shifts left when the drawer is open on desktop) */}
      <div
        className={`h-full w-full flex items-center justify-center transition-[padding] duration-300 ease-in-out ${
          drawerOpen ? 'md:pr-[420px]' : ''
        }`}
      >
        <Preview form={form} validMaps={validMaps} guestbookOn={guestbookOn} />
      </div>

      {/* BACKDROP (mobile only) */}
      <div
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* SIDE DRAWER */}
      <aside
        id="order-drawer"
        aria-hidden={!drawerOpen}
        style={{ width: `min(${DRAWER_W}px, 100vw)` }}
        className={`fixed top-0 right-0 z-50 h-[100dvh] flex flex-col bg-[#FDFBF7] shadow-2xl border-l border-[#EAE3D2] transition-[transform,visibility] duration-300 ease-in-out ${
          drawerOpen ? 'translate-x-0 visible' : 'translate-x-full invisible'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#EFECE6]">
          <div>
            <h1 className="font-serif text-2xl text-[#2C2621]">Your Order Details</h1>
            <p className="text-xs text-[#6B6156] font-light">The invitation updates live.</p>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close drawer"
            className="p-2 rounded-full hover:bg-[#F5F2EB] text-[#2C2621]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Groom (English)</label>
              <input className={inputCls} value={form.groomEn} onChange={update('groomEn')} />
            </div>
            <div>
              <label className={labelCls}>العريس (عربي)</label>
              <input className={inputCls} dir="rtl" value={form.groomAr} onChange={update('groomAr')} />
            </div>
            <div>
              <label className={labelCls}>Bride (English)</label>
              <input className={inputCls} value={form.brideEn} onChange={update('brideEn')} />
            </div>
            <div>
              <label className={labelCls}>العروس (عربي)</label>
              <input className={inputCls} dir="rtl" value={form.brideAr} onChange={update('brideAr')} />
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-[#EFECE6]">
            <div className="pt-4">
              <label className={labelCls}>Location (English)</label>
              <input className={inputCls} value={form.locationEn} onChange={update('locationEn')} />
            </div>
            <div>
              <label className={labelCls}>الموقع (عربي)</label>
              <input className={inputCls} dir="rtl" value={form.locationAr} onChange={update('locationAr')} />
            </div>
            <div>
              <label className={labelCls}>Google Maps Link</label>
              <input
                className={inputCls}
                placeholder="https://maps.app.goo.gl/..."
                value={form.mapsLink}
                onChange={update('mapsLink')}
              />
              {form.mapsLink && !validMaps && (
                <p className="text-xs text-red-600 mt-2">Please paste a valid Google Maps link.</p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-[#EAE3D2] bg-white p-4 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F5F2EB] flex items-center justify-center text-[#8C6D33] shrink-0">
                  <BookOpen size={18} />
                </div>
                <div>
                  <h2 className="font-serif text-lg text-[#2C2621] leading-tight">Guestbook · سجل الضيوف</h2>
                  <p className="text-xs text-[#6B6156] font-light mt-1">
                    Guests leave wishes; you read them on a private link.
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={guestbookOn}
                onClick={toggleGuestbook}
                className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${
                  guestbookOn ? 'bg-[#C5A059]' : 'bg-stone-300'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    guestbookOn ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>

            {guestbookOn && privateToken && (
              <div className="rounded-xl bg-[#F5F2EB] border border-[#E8E2D5] p-3 space-y-2">
                <span className="text-xs uppercase tracking-widest text-[#8C6D33] font-semibold">
                  Your private guestbook link
                </span>
                <div className="flex items-center gap-2">
                  <code className="flex-1 truncate text-xs bg-white rounded-lg px-3 py-2 border border-[#EAE3D2]">
                    {privateLink}
                  </code>
                  <button
                    onClick={() => copy(privateLink, 'private')}
                    className="p-2 rounded-lg bg-[#2C2621] text-white hover:bg-[#C5A059] transition-colors"
                    aria-label="Copy private link"
                  >
                    {copied === 'private' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                <p className="text-xs text-[#6B6156]">Keep this link to yourself. Do not share it with guests.</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <span className={labelCls}>Link for your guests</span>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate text-xs bg-[#F5F2EB] rounded-lg px-3 py-2 border border-[#EAE3D2]">
                {guestLink}
              </code>
              <button
                onClick={() => copy(guestLink, 'guest')}
                className="p-2 rounded-lg bg-[#2C2621] text-white hover:bg-[#C5A059] transition-colors"
                aria-label="Copy guest link"
              >
                {copied === 'guest' ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#EFECE6] bg-[#FDFBF7]">
          <a
            href={orderHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#2C2621] text-[#FDFBF7] py-3.5 rounded-xl text-xs uppercase tracking-widest font-medium hover:bg-[#C5A059] transition-all shadow-sm"
          >
            <Send size={14} /> Send Order via WhatsApp
          </a>
        </div>
      </aside>
    </div>
  );
}

/* ---------- Full-size invitation preview ---------- */
function Preview({
  form,
  validMaps,
  guestbookOn,
}: {
  form: {
    groomEn: string; groomAr: string; brideEn: string; brideAr: string;
    locationEn: string; locationAr: string; mapsLink: string;
  };
  validMaps: boolean;
  guestbookOn: boolean;
}) {
  return (
    <div
      className="relative shadow-2xl"
      style={{
        // Largest size that fits the available area while keeping the frame ratio
        width: `min(100%, calc(100dvh * ${RATIO}))`,
        aspectRatio: `${RATIO}`,
        containerType: 'inline-size',
      }}
    >
      <Image
        src="/images/frame.jpg"
        alt="Burgundy and gold invitation frame"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Content sits inside the gold frame. Sizes use container-width units so everything scales with the card. */}
      <div
        className="absolute flex flex-col items-center justify-center text-center text-[#F2E6C9]"
        style={{ left: '17%', right: '17%', top: '15%', bottom: '15%', gap: '2.6cqw' }}
      >
        <span className="uppercase text-[#D4AF37]" style={{ fontSize: '2.3cqw', letterSpacing: '0.3em' }}>
          Together with their families
        </span>
        <span className={`${amiri.className} text-[#D4AF37]`} dir="rtl" style={{ fontSize: '3.6cqw' }}>
          تتشرف بدعوتكم
        </span>

        <div className="bg-[#D4AF37]/60" style={{ width: '12cqw', height: '1px' }} />

        {/* English names */}
        <div className="flex flex-col items-center" style={{ gap: '0.6cqw' }}>
          <h2 className="font-serif text-[#D4AF37] leading-tight break-words" style={{ fontSize: '9.5cqw' }}>
            {form.groomEn || '—'}
          </h2>
          <div className="font-serif italic text-[#D4AF37]/70" style={{ fontSize: '5cqw' }}>&amp;</div>
          <h2 className="font-serif text-[#D4AF37] leading-tight break-words" style={{ fontSize: '9.5cqw' }}>
            {form.brideEn || '—'}
          </h2>
        </div>

        {/* Arabic names */}
        <h2
          className={`${amiri.className} font-bold text-[#F2E6C9] leading-tight break-words`}
          dir="rtl"
          style={{ fontSize: '8cqw' }}
        >
          {form.groomAr || '—'} <span className="text-[#D4AF37]/70">&amp;</span> {form.brideAr || '—'}
        </h2>

        <div className="bg-[#D4AF37]/60" style={{ width: '12cqw', height: '1px' }} />

        {/* Location */}
        <div className="flex flex-col items-center font-light" style={{ gap: '0.8cqw', fontSize: '3cqw' }}>
          <MapPin className="text-[#D4AF37]" style={{ width: '4cqw', height: '4cqw' }} />
          <span>{form.locationEn || '—'}</span>
          <span className={amiri.className} dir="rtl" style={{ fontSize: '3.8cqw' }}>
            {form.locationAr || '—'}
          </span>
        </div>

        {validMaps && (
          <a
            href={form.mapsLink.trim()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37] text-[#D4AF37] uppercase hover:bg-[#D4AF37] hover:text-[#3A0E18] transition-colors"
            style={{ fontSize: '2.2cqw', letterSpacing: '0.15em', padding: '1.2cqw 3cqw' }}
          >
            Open in Maps · افتح الخريطة
            <ExternalLink style={{ width: '2.6cqw', height: '2.6cqw' }} />
          </a>
        )}

        {guestbookOn && (
          <div
            className="w-full rounded-lg border border-[#D4AF37]/40 bg-black/15"
            style={{ padding: '1.4cqw 2.4cqw', fontSize: '2.2cqw' }}
          >
            <div className="flex items-center justify-center gap-2 text-[#D4AF37] uppercase tracking-widest">
              <BookOpen style={{ width: '2.6cqw', height: '2.6cqw' }} />
              Guestbook · سجل الضيوف
            </div>
            <div className="text-[#F2E6C9]/70">Leave your wishes for the couple…</div>
          </div>
        )}
      </div>
    </div>
  );
}