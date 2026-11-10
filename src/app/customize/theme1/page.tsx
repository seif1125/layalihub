'use client';

import { useState } from 'react';
import InvitationPreview, { type PreviewForm } from './InvitationPreview';
import CustomizeDrawer from './CustomizeDrawer';
import MusicPlayer from './MusicPlayer';
import { DEFAULT_SONG, type SongId } from './music';

const SAMPLE_FORM: PreviewForm = {
  groomEn: 'Ahmed', groomAr: 'أحمد', brideEn: 'Layla', brideAr: 'ليلى',
  locationEn: 'Grand Palace Hall, Cairo', locationAr: 'قاعة القصر الكبير، القاهرة',
  date: '2027-05-22',
  mapsLink: '',
};

export default function CustomizeTheme1() {
  const [form, setForm] = useState<PreviewForm>(SAMPLE_FORM);
  const [guestbookOn, setGuestbookOn] = useState(false);
  const [song, setSong] = useState<SongId>(DEFAULT_SONG);
  const [muted, setMuted] = useState(false);
  const validMaps = /^https?:\/\/\S+$/i.test(form.mapsLink.trim());

  return (
    <>
      <InvitationPreview form={form} validMaps={validMaps} guestbookOn={guestbookOn} />
      <MusicPlayer song={song} muted={muted} setMuted={setMuted} />
      <CustomizeDrawer
        form={form}
        setForm={setForm}
        guestbookOn={guestbookOn}
        setGuestbookOn={setGuestbookOn}
        song={song}
        setSong={setSong}
        muted={muted}
        setMuted={setMuted}
        onReset={() => { setForm(SAMPLE_FORM); setGuestbookOn(false); setSong(DEFAULT_SONG); setMuted(false); }}
      />
    </>
  );
}
