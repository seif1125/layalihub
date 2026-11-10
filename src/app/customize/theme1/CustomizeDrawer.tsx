'use client';

import { useState } from 'react';
import { Settings2, X, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import type { PreviewForm } from './InvitationPreview';
import { SONGS, type SongId } from './music';

type Props = {
  form: PreviewForm;
  setForm: (f: PreviewForm) => void;
  guestbookOn: boolean;
  setGuestbookOn: (v: boolean) => void;
  song: SongId;
  setSong: (s: SongId) => void;
  muted: boolean;
  setMuted: (m: boolean) => void;
  onReset: () => void;
};

const fieldCls =
  'w-full rounded-lg bg-black/30 border border-[#D4AF37]/30 px-3 py-2 text-sm text-[#F9F3EA] placeholder:text-[#F2E6C9]/30 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/60 transition-colors';

export default function CustomizeDrawer({ form, setForm, guestbookOn, setGuestbookOn, song, setSong, muted, setMuted, onReset }: Props) {
  const [open, setOpen] = useState(false);
  const set = (k: keyof PreviewForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const text = (label: string, k: keyof PreviewForm, opts: { rtl?: boolean; type?: string; placeholder?: string } = {}) => (
    <label className="block">
      <span className="block mb-1 text-[11px] uppercase tracking-widest text-[#D4AF37]">{label}</span>
      <input
        type={opts.type ?? 'text'}
        dir={opts.rtl ? 'rtl' : 'ltr'}
        value={form[k]}
        onChange={set(k)}
        placeholder={opts.placeholder}
        className={fieldCls}
      />
    </label>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Customize invitation"
        className="fixed top-5 right-5 z-[150] flex items-center gap-2 rounded-full bg-[#3A0E18]/85 backdrop-blur-sm border border-[#D4AF37]/50 px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-[#F2E6C9] shadow-xl hover:bg-[#D4AF37] hover:text-[#3A0E18] transition-colors"
      >
        <Settings2 size={16} /> Customize
      </button>

      {/* backdrop */}
      <div
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-[160] bg-black/50 transition-opacity duration-500"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}
      />

      <aside
        aria-hidden={!open}
        className="fixed top-0 right-0 bottom-0 z-[170] flex flex-col border-l border-[#D4AF37]/40 shadow-2xl"
        style={{
          width: 'min(92vw, 380px)',
          background: 'linear-gradient(180deg, #4A0D1C, #2A080F)',
          transform: open ? 'translateX(0)' : 'translateX(105%)',
          transition: `transform 600ms cubic-bezier(.65,0,.35,1), visibility 0s linear ${open ? '0s' : '0.6s'}`,
          visibility: open ? 'visible' : 'hidden',
        }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#D4AF37]/25">
          <h2 className="text-2xl text-[#D4AF37]" style={{ fontFamily: 'cursive' }}>Customize</h2>
          <button onClick={() => setOpen(false)} aria-label="Close" className="text-[#F2E6C9] hover:text-[#D4AF37] transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          <section className="space-y-3">
            <h3 className="text-xs uppercase tracking-[0.25em] text-[#F2E6C9]/60">Couple</h3>
            {text('Groom (English)', 'groomEn')}
            {text('العريس (Arabic)', 'groomAr', { rtl: true })}
            {text('Bride (English)', 'brideEn')}
            {text('العروس (Arabic)', 'brideAr', { rtl: true })}
          </section>

          <section className="space-y-3">
            <h3 className="text-xs uppercase tracking-[0.25em] text-[#F2E6C9]/60">Date &amp; place</h3>
            {text('Wedding date', 'date', { type: 'date' })}
            {text('Location (English)', 'locationEn')}
            {text('الموقع (Arabic)', 'locationAr', { rtl: true })}
            {text('Google Maps link', 'mapsLink', { placeholder: 'https://maps.google.com/…' })}
          </section>

          <section className="space-y-3">
            <h3 className="text-xs uppercase tracking-[0.25em] text-[#F2E6C9]/60">Music</h3>
            <label className="block">
              <span className="block mb-1 text-[11px] uppercase tracking-widest text-[#D4AF37]">Song</span>
              <select
                value={song}
                onChange={(e) => setSong(e.target.value as SongId)}
                className={fieldCls}
              >
                {SONGS.map((s) => (
                  <option key={s.id} value={s.id} className="bg-[#2A080F] text-[#F9F3EA]">{s.title}</option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => setMuted(!muted)}
              aria-pressed={muted}
              className="flex items-center gap-2 rounded-full border border-[#D4AF37]/50 px-4 py-2 text-xs uppercase tracking-widest text-[#F2E6C9] hover:bg-[#D4AF37]/15 transition-colors"
            >
              {muted ? <VolumeX size={14} /> : <Volume2 size={14} />} {muted ? 'Unmute' : 'Mute'}
            </button>
          </section>

          <section>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-[#F9F3EA]">Guestbook</span>
              <input
                type="checkbox"
                checked={guestbookOn}
                onChange={(e) => setGuestbookOn(e.target.checked)}
                className="h-5 w-5 accent-[#D4AF37]"
              />
            </label>
          </section>
        </div>

        <div className="px-5 py-4 border-t border-[#D4AF37]/25 flex gap-3">
          <button
            onClick={onReset}
            className="flex items-center gap-2 rounded-full border border-[#D4AF37]/50 px-4 py-2 text-xs uppercase tracking-widest text-[#F2E6C9] hover:bg-[#D4AF37]/15 transition-colors"
          >
            <RotateCcw size={14} /> Reset
          </button>
          <button
            onClick={() => setOpen(false)}
            className="flex-1 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#3A0E18] shadow-lg"
            style={{ background: 'linear-gradient(120deg, #B8892B, #F6E27A, #C9A227)' }}
          >
            Done
          </button>
        </div>
      </aside>
    </>
  );
}
