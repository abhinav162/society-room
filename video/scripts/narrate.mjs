// Narrates src/explainer/lines.json with Kokoro (open-source TTS, runs locally, free).
// usage: node scripts/narrate.mjs [voice]  -> public/explainer/<id>.wav + src/explainer/durations.json
import {KokoroTTS} from 'kokoro-js';
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';

const voice = process.argv[2] ?? 'am_michael';
const lines = JSON.parse(readFileSync(new URL('../src/explainer/lines.json', import.meta.url)));
const out = new URL('../public/explainer/', import.meta.url);
mkdirSync(out, {recursive: true});
const tts = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', {dtype: 'q8', device: 'cpu'});
const durations = {};
for (const [id, text] of Object.entries(lines)) {
  const a = await tts.generate(text, {voice, speed: 1.15});
  await a.save(new URL(`${id}.wav`, out).pathname);
  durations[id] = +(a.audio.length / a.sampling_rate).toFixed(3);
  console.log(id, durations[id]);
}
writeFileSync(new URL('../src/explainer/durations.json', import.meta.url), JSON.stringify(durations, null, 1) + '\n');
