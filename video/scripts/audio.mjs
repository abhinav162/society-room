// Synthesises the launch video's music bed and UI sound effects, so no third-party track or licence is needed.
// usage: node scripts/audio.mjs [lengthS dropS outroS name]  -> public/launch/<name>.wav + {pop,thud,chime,whoosh,tick,boom}.wav
// defaults are the launch video; the explainer uses: node scripts/audio.mjs 180 30.3 174.7 music-explainer
import {writeFileSync} from 'node:fs';

const SR = 44100;
const OUT = new URL('../public/launch/', import.meta.url);

function wav(name, buf) {
  let peak = 0;
  for (const v of buf) peak = Math.max(peak, Math.abs(v));
  const g = peak > 0 ? 0.89 / peak : 1; // normalise to about -1 dBFS
  const b = Buffer.alloc(44 + buf.length * 2);
  b.write('RIFF', 0); b.writeUInt32LE(36 + buf.length * 2, 4); b.write('WAVE', 8);
  b.write('fmt ', 12); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22);
  b.writeUInt32LE(SR, 24); b.writeUInt32LE(SR * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34);
  b.write('data', 36); b.writeUInt32LE(buf.length * 2, 40);
  buf.forEach((v, i) => b.writeInt16LE(Math.round(Math.max(-1, Math.min(1, v * g)) * 32767), 44 + i * 2));
  writeFileSync(new URL(name + '.wav', OUT), b);
  console.log('wrote', name);
}

const hz = (m) => 440 * 2 ** ((m - 69) / 12);
const TAU = Math.PI * 2;
let seed = 7;
const noise = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x3fffffff) - 1;

// ---- music: 120 BPM, 92 s. Timeline matches src/launch/timeline.ts (seconds).
const [LEN, DROP, OUTRO] = [92, 14, 84].map((d, i) => +(process.argv[2 + i] ?? d)); // seconds: length, reveal hit, outro
const NAME = process.argv[5] ?? 'music';
const BEAT = 0.5, BAR = 2;
const m = new Float32Array(Math.ceil(LEN * SR));
const add = (t0, arr, gain = 1) => {
  const s = Math.floor(t0 * SR);
  for (let i = 0; i < arr.length && s + i < m.length; i++) m[s + i] += arr[i] * gain;
};

// chords (midi): Am, F, C, G ; outro resolves on C
const prog = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]];
const chordAt = (t) => (t >= OUTRO ? [48, 52, 55, 60] : prog[Math.floor(t / (BAR * 2)) % 4]);

// pad: soft saw-ish (5 harmonics), two detuned voices, slow-moving
for (let i = 0; i < m.length; i++) {
  const t = i / SR;
  const notes = t < DROP ? [57, 64] : chordAt(t);
  let v = 0;
  for (const n of notes) for (const d of [-0.07, 0.07]) {
    const f = hz(n + d);
    for (let h = 1; h <= 5; h++) v += Math.sin(TAU * f * h * t) / h ** 1.6;
  }
  const lvl = t < 5 ? 0.25 + 0.15 * (t / 5) : t < DROP ? 0.45 : t < OUTRO ? 0.38 : 0.5 * Math.max(0, 1 - (t - OUTRO) / (LEN - OUTRO));
  const fadeIn = Math.min(1, t / 1.5);
  m[i] += v * 0.05 * lvl * fadeIn;
}

// sub pulse in the hook/problem: one low note per beat, builds tension
for (let t = 0; t < DROP; t += BEAT) {
  const n = Math.floor(0.12 * SR), a = new Float32Array(n);
  for (let i = 0; i < n; i++) a[i] = Math.sin(TAU * hz(33) * i / SR) * Math.exp(-i / SR / 0.05);
  add(t, a, 0.35 * (0.4 + 0.6 * t / DROP));
}

// drum one-shots
const kick = (() => { const n = 0.3 * SR, a = new Float32Array(n); let ph = 0;
  for (let i = 0; i < n; i++) { const t = i / SR; ph += TAU * (45 + 90 * Math.exp(-t / 0.03)) / SR; a[i] = Math.sin(ph) * Math.exp(-t / 0.12); } return a; })();
const hat = (() => { const n = 0.05 * SR, a = new Float32Array(n); let p = 0;
  for (let i = 0; i < n; i++) { const x = noise(); a[i] = (x - p) * Math.exp(-i / SR / 0.012); p = x; } return a; })();
const pluck = (f) => { const n = 0.25 * SR, a = new Float32Array(n);
  for (let i = 0; i < n; i++) { const t = i / SR; a[i] = (Math.sin(TAU * f * t) + 0.3 * Math.sin(TAU * 2 * f * t)) * Math.exp(-t / 0.07); } return a; };

for (let t = 0; t < LEN; t += BEAT / 2) {
  const inGroove = t >= DROP && t < OUTRO;
  const beatIdx = Math.round(t / (BEAT / 2));
  if (t >= 5 && t < OUTRO && beatIdx % 2 === 1) add(t, hat, inGroove ? 0.18 : 0.08); // off-beat hats
  if (!inGroove) continue;
  if (beatIdx % 2 === 0) add(t, kick, 0.55);
  // bass on 8ths, root of the chord
  const root = chordAt(t)[0] - 12;
  const n = Math.floor(0.22 * SR), b = new Float32Array(n);
  for (let i = 0; i < n; i++) b[i] = Math.sin(TAU * hz(root) * i / SR) * Math.min(1, i / 200) * Math.exp(-i / SR / 0.15);
  add(t, b, 0.22);
  // arpeggio on 16ths-ish, an octave up
  const ch = chordAt(t);
  add(t, pluck(hz(ch[beatIdx % ch.length] + 12)), 0.06);
}
// drop impact
add(DROP, (() => { const n = 2.5 * SR, a = new Float32Array(n);
  for (let i = 0; i < n; i++) { const t = i / SR; a[i] = Math.sin(TAU * (40 + 60 * Math.exp(-t / 0.08)) * t) * Math.exp(-t / 0.6) + 0.15 * noise() * Math.exp(-t / 0.25); } return a; })(), 0.6);
// global fade out
for (let i = 0; i < m.length; i++) { const t = i / SR; if (t > LEN - 3) m[i] *= (LEN - t) / 3; }
wav(NAME, m);

// ---- sound effects
const fx = (dur, fn) => { const a = new Float32Array(Math.floor(dur * SR)); for (let i = 0; i < a.length; i++) a[i] = fn(i / SR); return a; };
wav('pop', fx(0.09, (t) => Math.sin(TAU * (700 + 500 * Math.exp(-t / 0.02)) * t) * Math.exp(-t / 0.025)));
wav('tick', fx(0.02, (t) => noise() * Math.exp(-t / 0.003)));
wav('thud', fx(0.45, (t) => (Math.sin(TAU * (55 + 40 * Math.exp(-t / 0.04)) * t) + 0.5 * Math.sin(TAU * 110 * t) * Math.exp(-t / 0.05)) * Math.exp(-t / 0.14)));
wav('chime', fx(1.0, (t) => (Math.sin(TAU * 1318.5 * t) + 0.7 * Math.sin(TAU * 1975.5 * Math.max(0, t - 0.08)) * (t > 0.08)) * Math.exp(-t / 0.28)));
let lp = 0;
wav('whoosh', fx(0.6, (t) => { const k = 0.02 + 0.25 * (t / 0.6); lp += k * (noise() - lp); return lp * Math.sin(Math.PI * t / 0.6) ** 2; }));
wav('boom', fx(2.0, (t) => Math.sin(TAU * (38 + 70 * Math.exp(-t / 0.06)) * t) * Math.exp(-t / 0.5)));
