// Measures leading/trailing silence in every narration clip (threshold 0.01, 40 ms pad) and writes
// src/explainer-v3/trims.json = {id: {start, end}} in seconds, so the V3 timeline can butt lines together.
import {readFileSync, writeFileSync} from 'node:fs';
import lines from '../src/explainer/lines.json' with {type: 'json'};

const TH = 0.01, PAD = 0.04;
const out = {};
for (const id of Object.keys(lines)) {
  const b = readFileSync(new URL(`../public/explainer/${id}.wav`, import.meta.url));
  const sr = b.readUInt32LE(24), ch = b.readUInt16LE(22), bits = b.readUInt16LE(34);
  const fmt = b.readUInt16LE(20); // 1 = pcm16, 3 = float32
  let p = 12, dataOff = 0, dataLen = 0;
  while (p < b.length) { const tag = b.toString('ascii', p, p + 4), len = b.readUInt32LE(p + 4); if (tag === 'data') { dataOff = p + 8; dataLen = len; break; } p += 8 + len; }
  const bps = bits / 8;
  const n = Math.floor(dataLen / bps / ch);
  const amp = (i) => Math.abs(fmt === 3 ? b.readFloatLE(dataOff + i * bps * ch) : b.readInt16LE(dataOff + i * bps * ch) / 32768);
  let a = 0, z = n - 1;
  while (a < n && amp(a) < TH) a++;
  while (z > a && amp(z) < TH) z--;
  const dur = n / sr;
  out[id] = {start: +Math.max(0, a / sr - PAD).toFixed(3), end: +Math.min(dur, z / sr + PAD).toFixed(3), dur: +dur.toFixed(3)};
}
writeFileSync(new URL('../src/explainer-v3/trims.json', import.meta.url), JSON.stringify(out, null, 1));
const cut = Object.values(out).reduce((s, t) => s + t.dur - (t.end - t.start), 0);
console.log(`trimmed ${cut.toFixed(1)}s of silence across ${Object.keys(out).length} clips`);
