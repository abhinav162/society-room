// Warm, light score for ExplainerV2: 92 BPM, C-major plucked keys over a soft pad, brushed shaker, a quiet pulse under the live demo.
// Synthesised here so no third-party track or licence is needed.  usage: node scripts/score-v2.mjs [lengthS] [demoStartS] [demoEndS]
import {writeFileSync} from 'node:fs';

const SR = 44100;
const [LEN, DEMO0, DEMO1] = [180, 105, 168].map((d, i) => +(process.argv[2 + i] ?? d));
const TAU = Math.PI * 2;
const hz = (m) => 440 * 2 ** ((m - 69) / 12);
const m = new Float32Array(Math.ceil(LEN * SR));
let seed = 3;
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
const add = (t0, arr, g = 1) => {
  const s = Math.floor(t0 * SR);
  for (let i = 0; i < arr.length && s + i < m.length; i++) m[s + i] += arr[i] * g;
};

const BEAT = 60 / 92, BAR = BEAT * 4;
// Cmaj7, Am9, Fmaj7, G6 — gentle, resolves home every 8 bars
const PROG = [[60, 64, 67, 71], [57, 60, 64, 67, 71], [53, 57, 60, 64], [55, 59, 62, 64]];
const chord = (t) => PROG[Math.floor(t / (BAR * 2)) % 4];

// pad: two detuned triangle-ish voices per note, very soft, filtered by harmonic roll-off
for (let i = 0; i < m.length; i++) {
  const t = i / SR;
  const notes = chord(t);
  let v = 0;
  for (const n of notes) for (const d of [-0.05, 0.05]) {
    const f = hz(n - 12 + d);
    for (let h = 1; h <= 4; h += 2) v += Math.sin(TAU * f * h * t) / (h * h);
  }
  const env = Math.min(1, t / 3) * Math.min(1, Math.max(0, (LEN - t) / 4));
  m[i] += v * 0.03 * env;
}

// pluck: felt-piano style sine + 2nd harmonic with fast decay
const pluck = (f, dur = 0.9) => {
  const n = Math.floor(dur * SR), a = new Float32Array(n);
  for (let i = 0; i < n; i++) { const t = i / SR; a[i] = (Math.sin(TAU * f * t) + 0.25 * Math.sin(TAU * 2 * f * t) + 0.08 * Math.sin(TAU * 3 * f * t)) * Math.exp(-t / 0.35) * Math.min(1, i / 60); }
  return a;
};
// arpeggio pattern: 1 5 3 7 . 5 . 3 on 8ths, octave up every other bar
for (let bar = 0; bar * BAR < LEN; bar++) {
  const t0 = bar * BAR;
  const c = chord(t0);
  const pat = [0, 2, 1, 3, -1, 2, -1, 1];
  const up = bar % 2 ? 12 : 0;
  pat.forEach((k, j) => {
    if (k < 0) return;
    const n = c[k % c.length] + up;
    const t = t0 + j * (BEAT / 2);
    const inDemo = t >= DEMO0 && t < DEMO1;
    add(t, pluck(hz(n)), (j % 2 ? 0.16 : 0.22) * (inDemo ? 0.8 : 1) * Math.min(1, t / 4));
  });
  // bass: root on 1 and the "and" of 3, soft sine
  for (const b of [0, 2.5]) {
    const f = hz(c[0] - 24);
    const n = Math.floor(0.7 * SR), a = new Float32Array(n);
    for (let i = 0; i < n; i++) { const t = i / SR; a[i] = Math.sin(TAU * f * t) * Math.exp(-t / 0.4) * Math.min(1, i / 300); }
    add(t0 + b * BEAT, a, 0.3);
  }
}

// brushed shaker on off-beats, a soft kick under the demo section
const shaker = (() => { const n = Math.floor(0.07 * SR), a = new Float32Array(n); let p = 0;
  for (let i = 0; i < n; i++) { const x = rnd() * 2 - 1; a[i] = (x - p) * 0.5 * Math.exp(-i / SR / 0.02) * Math.min(1, i / 80); p = x; } return a; })();
const kick = (() => { const n = Math.floor(0.25 * SR), a = new Float32Array(n); let ph = 0;
  for (let i = 0; i < n; i++) { const t = i / SR; ph += TAU * (50 + 70 * Math.exp(-t / 0.03)) / SR; a[i] = Math.sin(ph) * Math.exp(-t / 0.1); } return a; })();
for (let t = 0; t < LEN - 4; t += BEAT / 2) {
  const idx = Math.round(t / (BEAT / 2));
  if (t > 6 && idx % 2 === 1) add(t, shaker, 0.5);
  if (t >= DEMO0 && t < DEMO1 && idx % 4 === 0) add(t, kick, 0.45);
}

// write 16-bit mono wav, normalised to -1 dBFS
let peak = 0;
for (const v of m) peak = Math.max(peak, Math.abs(v));
const g = 0.89 / peak;
const b = Buffer.alloc(44 + m.length * 2);
b.write('RIFF', 0); b.writeUInt32LE(36 + m.length * 2, 4); b.write('WAVE', 8);
b.write('fmt ', 12); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22);
b.writeUInt32LE(SR, 24); b.writeUInt32LE(SR * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34);
b.write('data', 36); b.writeUInt32LE(m.length * 2, 40);
m.forEach((v, i) => b.writeInt16LE(Math.round(Math.max(-1, Math.min(1, v * g)) * 32767), 44 + i * 2));
writeFileSync(new URL('../public/launch/music-v2.wav', import.meta.url), b);
console.log('wrote public/launch/music-v2.wav', LEN, 's');
