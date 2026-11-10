export const SONGS = [
  { id: 'butterfly-waltz', title: 'Butterfly Waltz — Brian Crain', file: '/music/Brian Crain - Butterfly Waltz (Overhead Camera).mp3' },
  { id: 'canon-in-d', title: "Canon in D — Pachelbel", file: "/music/Johann Pachelbel - Canon in D Jacob's Piano.mp3" },
] as const;

export type SongId = (typeof SONGS)[number]['id'];
export const DEFAULT_SONG: SongId = SONGS[0].id;
