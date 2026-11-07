// Beat plan for the narrated explainer. Shared by Explainer.tsx and scripts/audio.mjs (music length).
// Each line: [line id, earliest frame in its beat]. A line starts at that frame or just after the previous line ends.
export const FPS = 30;
export const BEATS = [
  {id: 'societies', lines: [['w1', 4], ['w2', 0]]},
  {id: 'registrar', lines: [['w3', 10]], min: 200},
  {id: 'gap', lines: [['w4', 10], ['w4b', 0]]},
  {id: 'reveal', lines: [['w5', 20]], min: 120},
  {id: 'checks', lines: [['b1', 10], ['b2', 0], ['b3', 0], ['b4', 0]]},
  {id: 'personas', lines: [['b5', 10], ['b6', 0]]},
  {id: 'hub', lines: [['s1', 10]], min: 140},
  {id: 'template', lines: [['s2', 30], ['s3', 120]], min: 240},
  {id: 'gate', lines: [['s4', 10], ['s5', 0]]},
  {id: 'layers', lines: [['s6', 30]], min: 150},
  {id: 'live', lines: [['d1', 10]], min: 110},
  {id: 'hook', lines: [['d2', 0]], min: 150},
  {id: 'refuse', lines: [['d3', 70]], min: 200},
  {id: 'meeting', lines: [['d4', 10], ['d5', 0], ['d6', 0], ['d7', 0], ['d8', 0]]},
  {id: 'limit', lines: [['d9', 10], ['d10', 88]], min: 200},
  {id: 'ask', lines: [['d11', 18], ['d12', 118]], min: 220},
  {id: 'principle', lines: [['c1', 10], ['c1b', 0]]},
  {id: 'end', lines: [['c2', 10]], min: 150},
];
const GAP = 6; // frames between lines
const TAIL = 12; // frames after the last line of a beat

export function schedule(durations) {
  let from = 0;
  return BEATS.map((b) => {
    let prevEnd = -GAP;
    const t = {};
    for (const [id, want] of b.lines) {
      t[id] = Math.max(want, prevEnd + GAP);
      prevEnd = t[id] + Math.ceil(durations[id] * FPS);
    }
    const len = Math.max(b.min ?? 0, prevEnd + TAIL);
    const beat = {...b, from, len, t};
    from += len;
    return beat;
  });
}
