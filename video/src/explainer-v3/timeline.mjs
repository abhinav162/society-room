// Voice-first timeline for ExplainerV3: every line starts a fixed gap after the previous one ends
// (clip silence already trimmed), and visuals are keyed to the resulting line frames.
export const FPS = 30;
export const GAP = 0.3; // seconds between lines inside a section
export const GAP_SECTION = 0.7; // seconds at a section boundary
export const LEAD = 0.5; // seconds a section is on screen before its first line
export const INTRO = 0.6; // seconds before the first line
export const OUTRO = 3.0; // seconds after the last line

export const SECTIONS = [
  {id: 'societies', lines: ['w1', 'w2']},
  {id: 'registrar', lines: ['w3']},
  {id: 'gap', lines: ['w4', 'w4b']},
  {id: 'reveal', lines: ['w5']},
  {id: 'checks', lines: ['b1', 'b2', 'b3', 'b4']},
  {id: 'personas', lines: ['b5', 'b6']},
  {id: 'hub', lines: ['s1']},
  {id: 'template', lines: ['s2', 's3']},
  {id: 'gate', lines: ['s4', 's5']},
  {id: 'layers', lines: ['s6']},
  {id: 'live', lines: ['d1']},
  {id: 'hook', lines: ['d2']},
  {id: 'refuse', lines: ['d3']},
  {id: 'meeting', lines: ['d4', 'd5', 'd6', 'd7', 'd8']},
  {id: 'limit', lines: ['d9', 'd10']},
  {id: 'ask', lines: ['d11', 'd12']},
  {id: 'principle', lines: ['c1', 'c1b']},
  {id: 'end', lines: ['c2']},
];

const fr = (s) => Math.round(s * FPS);

// trims: {id: {start, end}} seconds inside each clip.
// Returns {lines: {id: {at, len, startFrom, endAt}}, sections: [{id, from, len, t, e}], total}
export function buildTimeline(trims) {
  const lines = {};
  let cursor = fr(INTRO);
  const starts = [];
  SECTIONS.forEach((s, si) => {
    if (si > 0) cursor += fr(GAP_SECTION - GAP);
    s.lines.forEach((id) => {
      const tr = trims[id];
      const len = fr(tr.end - tr.start);
      lines[id] = {at: cursor, len, startFrom: fr(tr.start), endAt: fr(tr.end)};
      cursor += len + fr(GAP);
    });
    starts.push(lines[s.lines[0]].at - fr(LEAD));
  });
  const total = cursor - fr(GAP) + fr(OUTRO);
  const sections = SECTIONS.map((s, i) => {
    const from = i === 0 ? 0 : starts[i];
    const to = i === SECTIONS.length - 1 ? total : starts[i + 1];
    const t = {}, e = {};
    for (const id of s.lines) { t[id] = lines[id].at - from; e[id] = t[id] + lines[id].len; }
    return {id: s.id, from, len: to - from, t, e};
  });
  return {lines, sections, total};
}

// Gap table: silence between consecutive lines, in seconds.
export function gaps(tl) {
  const ids = SECTIONS.flatMap((s) => s.lines);
  const g = [];
  for (let i = 1; i < ids.length; i++) {
    const a = tl.lines[ids[i - 1]], b = tl.lines[ids[i]];
    g.push({from: ids[i - 1], to: ids[i], gap: (b.at - (a.at + a.len)) / FPS});
  }
  return g;
}
