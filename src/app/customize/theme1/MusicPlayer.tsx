'use client';

import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { SONGS, type SongId } from './music';

/**
 * Background music. Tries to start immediately; browsers block sound until the
 * visitor interacts with the page, so if that happens it starts on the first
 * tap / click / key press. Muting keeps the track running silently.
 */
export default function MusicPlayer({
  song, muted, setMuted,
}: { song: SongId; muted: boolean; setMuted: (m: boolean) => void }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const file = SONGS.find((s) => s.id === song)?.file ?? SONGS[0].file;

  // (re)load whenever the song changes and try to play right away
  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    a.src = encodeURI(file);
    a.load();
    a.play().catch(() => setPlaying(false));
  }, [file]);

  useEffect(() => {
    if (ref.current) ref.current.muted = muted;
  }, [muted]);

  // autoplay was blocked: start on the first user gesture
  useEffect(() => {
    if (playing) return;
    const start = () => { ref.current?.play().catch(() => {}); };
    const events = ['pointerdown', 'keydown', 'touchend'] as const;
    events.forEach((e) => window.addEventListener(e, start));
    return () => events.forEach((e) => window.removeEventListener(e, start));
  }, [playing]);

  return (
    <>
      <audio
        ref={ref}
        loop
        preload="auto"
        onPlaying={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        onClick={() => {
          setMuted(!muted);
          if (!playing) ref.current?.play().catch(() => {});
        }}
        aria-label={muted ? 'Unmute music' : 'Mute music'}
        aria-pressed={muted}
        className="fixed right-6 bottom-6 z-[100] w-12 h-12 rounded-full bg-[#3A0E18]/80 backdrop-blur-sm border border-[#D4AF37]/40 flex items-center justify-center text-[#F2E6C9] hover:bg-[#C9A227] hover:text-[#3A0E18] transition-all duration-300 shadow-xl"
      >
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
    </>
  );
}
