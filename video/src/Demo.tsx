import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {FPS, Msg, Scene, Shot, scenes} from './manifest';
import captions from './captions.json';

const INK = '#222', BLUE = '#2f5fb3', AMBER = '#a15c00';
const font = 'Helvetica, Arial, sans-serif';
const PAD = 0.9; // seconds of air after each voice-over
const frames = (s: Scene) => Math.ceil((s.voiceSec + PAD + (s.extra ?? 0)) * FPS);
const AUDIO_AT = 0.3; // seconds into the scene when the voice-over starts
export const totalFrames = () => scenes.reduce((n, s) => n + frames(s), 0);

const Bar = ({title}: {title: string}) => (
  <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 84, background: INK, color: '#fff', fontFamily: font,
    fontSize: 38, fontWeight: 700, display: 'flex', alignItems: 'center', padding: '0 48px', zIndex: 5}}>{title}</div>
);

const TextScene = ({s}: {s: Scene}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = s.voice.split(' ');
  const per = (frames(s) - FPS) / words.length; // words appear as they are spoken
  const marks = s.marks ?? [];
  let i = 0;
  const out = words.map((w, k) => {
    const on = f >= k * per * 0.9;
    const idx = i; i += w.length + 1;
    const hit = marks.some((m) => s.voice.indexOf(m) <= idx && idx < s.voice.indexOf(m) + m.length);
    return <span key={k} style={{opacity: on ? 1 : 0.12, color: hit ? '#ffd27a' : '#fff', fontWeight: hit ? 700 : 400}}>{w} </span>;
  });
  const pop = spring({frame: f, fps, config: {damping: 200}});
  return (
    <AbsoluteFill style={{background: INK, fontFamily: font, color: '#fff', padding: '130px 160px'}}>
      <div style={{fontSize: 96, fontWeight: 800, transform: `translateY(${(1 - pop) * 40}px)`, opacity: pop}}>{s.title}</div>
      <div style={{fontSize: 32, color: '#9db8e8', marginTop: 12, marginBottom: 60}}>{s.sub}</div>
      <div style={{fontSize: 44, lineHeight: 1.45, maxWidth: 1500}}>{out}</div>
    </AbsoluteFill>
  );
};

const ImageScene = ({s}: {s: Scene}) => {
  const f = useCurrentFrame();
  const n = frames(s);
  const scale = interpolate(f, [0, n], [1, 1.04]);
  return (
    <AbsoluteFill style={{background: '#fff'}}>
      <Bar title={s.title} />
      <Img src={staticFile(`design/${s.image}`)} style={{position: 'absolute', top: 84, left: 0, width: 1920, height: 996, objectFit: 'contain', transform: `scale(${scale})`}} />
      <Captions id={s.id} />
      {s.repo ? <EndCard s={s} /> : null}
    </AbsoluteFill>
  );
};


// Word-timed captions: script words timed by whisper.cpp offsets (scripts/captions.py).
const Captions = ({id}: {id: string}) => {
  const f = useCurrentFrame();
  const t = f / FPS - AUDIO_AT;
  const ws = (captions as Record<string, {t: string; a: number; b: number}[]>)[id] ?? [];
  if (!ws.length || t < 0) return null;
  let cur = ws.findIndex((w) => t >= w.a && t < w.b);
  if (cur < 0) cur = t >= ws[ws.length - 1].b ? -1 : 0;
  if (cur < 0) return null;
  const start = Math.floor(cur / 8) * 8;
  const chunk = ws.slice(start, start + 8);
  return (
    <div style={{position: 'absolute', left: 140, right: 140, bottom: 36, textAlign: 'center', zIndex: 8}}>
      <span style={{display: 'inline-block', background: 'rgba(0,0,0,0.72)', borderRadius: 12, padding: '10px 26px', fontFamily: font, fontSize: 42, color: '#cfd6e4'}}>
        {chunk.map((w, k) => <span key={k} style={{color: start + k === cur ? '#ffd27a' : '#cfd6e4', fontWeight: start + k === cur ? 700 : 400}}>{w.t} </span>)}
      </span>
    </div>
  );
};

const BOT = new Set(['clerk', 'byelaw', 'treasurer-agent', 'concierge', 'Switch']);
const Msgs = ({m, t, last}: {m: Msg; t: number; last: boolean}) => {
  const kind = m.kind ?? 'bot';
  const bot = BOT.has(m.who);
  const typingFrom = m.at - (m.typing ?? 0);
  if (t < (kind === 'user' ? m.at : typingFrom)) return null;
  if (kind === 'sys') {
    return <div style={{margin: '4px 0 4px 74px', fontSize: 26, color: '#8a93a6', fontStyle: 'italic'}}>{m.who} {m.text}</div>;
  }
  const showTyping = kind !== 'user' && t < m.at;
  const n = kind === 'user' ? Math.floor(Math.min(1, (t - m.at) / 0.8) * m.text.length) : m.text.length;
  const pop = Math.min(1, Math.max(0, (t - m.at) / 0.25));
  const col = kind === 'switch' ? '#ff9c94' : '#e8ebf2';
  return (
    <div style={{display: 'flex', gap: 18, margin: '10px 0', padding: '8px 12px', borderRadius: 10,
      background: m.key && t >= m.at ? 'rgba(255,210,122,0.10)' : kind === 'switch' ? 'rgba(179,38,30,0.18)' : 'transparent',
      borderLeft: m.key && t >= m.at ? '5px solid #ffd27a' : '5px solid transparent'}}>
      <div style={{width: 52, height: 52, borderRadius: 26, background: bot ? '#2f5fb3' : '#3b8f5a', color: '#fff', fontSize: 26, fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 52px'}}>{m.who[0].toUpperCase()}</div>
      <div style={{flex: 1}}>
        <div style={{fontSize: 26, fontWeight: 700, color: '#fff'}}>{m.who}{bot ? <span style={{fontSize: 18, border: '1px solid #8a93a6', color: '#8a93a6', borderRadius: 4, padding: '1px 6px', marginLeft: 10}}>BOT</span> : null}</div>
        {showTyping ? <div style={{fontSize: 34, color: '#8a93a6', letterSpacing: 6}}>{'•'.repeat(1 + (Math.floor(t * 4) % 3))}</div> :
          <div style={{fontSize: 32, color: col, whiteSpace: 'pre-wrap', opacity: kind === 'user' ? 1 : pop, fontFamily: m.key ? 'Menlo, monospace' : font}}>{m.text.slice(0, n)}</div>}
      </div>
    </div>
  );
};

const ChatScene = ({s}: {s: Scene}) => {
  const f = useCurrentFrame();
  const t = f / FPS - AUDIO_AT;
  const msgs = s.chat ?? [];
  const proofAt = s.proof ? s.voiceSec + 0.6 : Infinity;
  const showProof = f / FPS >= proofAt;
  return (
    <AbsoluteFill style={{background: '#14161b', fontFamily: font}}>
      <Bar title={s.title} />
      <div style={{position: 'absolute', top: 84, left: 0, right: 0, height: 64, background: '#1c1f26', display: 'flex', alignItems: 'center', padding: '0 48px', color: '#e8ebf2', fontSize: 30, fontWeight: 700, justifyContent: 'space-between'}}>
        <span>{s.room === 'committee' ? '\u{1F512} ' : '\u{1F310} '}{s.room}</span>
        <span style={{fontSize: 22, fontWeight: 400, color: '#8a93a6'}}>Recreated from the live Mattermost log</span>
      </div>
      <div style={{position: 'absolute', top: 160, left: 100, right: 100, height: 740, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden'}}>
        {msgs.map((m, i) => <Msgs key={i} m={m} t={t} last={i === msgs.length - 1} />)}
      </div>
      {showProof && s.proof ? (
        <AbsoluteFill style={{background: '#111', opacity: interpolate(f / FPS, [proofAt, proofAt + 0.4], [0, 1], {extrapolateRight: 'clamp'})}}>
          <Img src={staticFile(`shots/${s.proof.src}`)} style={{position: 'absolute', top: 84, left: 0, width: 1920, height: 996, objectFit: 'contain'}} />
          <div style={{position: 'absolute', top: 100, right: 40, background: '#2f5fb3', color: '#fff', borderRadius: 10, padding: '8px 18px', fontSize: 26, zIndex: 6}}>{s.proof.note}</div>
          <Bar title={s.title} />
        </AbsoluteFill>
      ) : <Captions id={s.id} />}
    </AbsoluteFill>
  );
};

const EndCard = ({s}: {s: Scene}) => {
  const f = useCurrentFrame();
  const at = (s.voiceSec + 0.4) * FPS;
  if (f < at) return null;
  const o = interpolate(f, [at, at + 12], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: INK, opacity: o, fontFamily: font, color: '#fff', alignItems: 'center', justifyContent: 'center', zIndex: 20}}>
      <div style={{fontSize: 110, fontWeight: 800}}>Society Room</div>
      <div style={{fontSize: 36, color: '#9db8e8', margin: '20px 0 50px', maxWidth: 1400, textAlign: 'center'}}>Switch decides who may instruct. The engine decides what is allowed.</div>
      <div style={{fontSize: 52, fontFamily: 'Menlo, monospace', color: '#ffd27a'}}>{s.repo}</div>
    </AbsoluteFill>
  );
};

const ShotView = ({shot, len}: {shot: Shot; len: number}) => {
  const f = useCurrentFrame();
  const z = shot.zoom ?? {cx: 50, cy: 50, s: 1};
  const k = interpolate(f, [0, len], [1, z.s], {extrapolateRight: 'clamp'});
  const typed = shot.caption ? Math.floor(interpolate(f, [8, Math.max(24, len * 0.55)], [0, shot.caption.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})) : 0;
  const fade = interpolate(f, [0, 8], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#111', opacity: fade}}>
      <div style={{position: 'absolute', top: 84, left: 0, width: 1920, height: 830, overflow: 'hidden'}}>
        <Img src={staticFile(`shots/${shot.src}`)} style={{width: 1920, height: 830, objectFit: 'contain', transformOrigin: `${z.cx}% ${z.cy}%`, transform: `scale(${k})`}} />
      </div>
      {shot.caption ? (
        <div style={{position: 'absolute', left: 80, right: 80, bottom: 28, background: 'rgba(20,20,20,0.88)', border: `2px solid ${BLUE}`, borderRadius: 14,
          padding: '18px 28px', fontFamily: font, color: '#fff', fontSize: 30}}>
          {shot.who ? <span style={{color: '#9db8e8', fontWeight: 700, marginRight: 16}}>{shot.who}</span> : null}
          <span style={{fontFamily: 'Menlo, monospace'}}>{shot.caption.slice(0, typed)}</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const ShotsScene = ({s}: {s: Scene}) => {
  const shots = s.shots ?? [];
  const n = frames(s);
  const total = shots.reduce((a, x) => a + (x.weight ?? 1), 0) || 1;
  let at = 0;
  return (
    <AbsoluteFill style={{background: '#111'}}>
      {shots.map((x, i) => {
        const len = i === shots.length - 1 ? n - at : Math.round(((x.weight ?? 1) / total) * n);
        const el = <Sequence key={i} from={at} durationInFrames={len}><ShotView shot={x} len={len} /></Sequence>;
        at += len;
        return el;
      })}
      <Bar title={s.title} />
    </AbsoluteFill>
  );
};

export const Demo = () => {
  let at = 0;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scenes.map((s) => {
        const n = frames(s);
        const el = (
          <Sequence key={s.id} from={at} durationInFrames={n}>
            {s.kind === 'text' ? <TextScene s={s} /> : s.kind === 'image' ? <ImageScene s={s} /> : s.kind === 'chat' ? <ChatScene s={s} /> : <ShotsScene s={s} />}
            <Sequence from={Math.round(0.3 * FPS)}><Audio src={staticFile(`audio/${s.id}.mp3`)} /></Sequence>
          </Sequence>
        );
        at += n;
        return el;
      })}
    </AbsoluteFill>
  );
};
