import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {FPS, Msg, Scene, scenes} from './manifest';
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


const fadeIn = (t: number, at: number) => interpolate(t, [at, at + 0.4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// Generic phone group chat (no brand marks), fictional names.
const WaScene = ({s}: {s: Scene}) => {
  const f = useCurrentFrame();
  const t = f / FPS - AUDIO_AT;
  const rise = interpolate(f, [0, 14], [60, 0], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#0b141a', fontFamily: font, alignItems: 'center'}}>
      <Bar title={s.title} />
      <div style={{position: 'absolute', top: 120, width: 760, height: 900, background: '#e5ddd5', borderRadius: 40, border: '10px solid #222', overflow: 'hidden', transform: `translateY(${rise}px)`}}>
        <div style={{background: '#1f7a6a', color: '#fff', padding: '18px 24px', fontSize: 30, fontWeight: 700}}>Sunrise CHS Committee<div style={{fontSize: 20, fontWeight: 400}}>fictional group</div></div>
        <div style={{padding: 24, display: 'flex', flexDirection: 'column', gap: 16}}>
          {(s.wa ?? []).map((m, i) => (
            <div key={i} style={{alignSelf: m.who === 'Secretary' ? 'flex-start' : 'flex-end', maxWidth: 560, background: m.who === 'Secretary' ? '#fff' : '#d9fdd3', borderRadius: 14, padding: '12px 18px', opacity: fadeIn(t, m.at), transform: `scale(${0.9 + 0.1 * fadeIn(t, m.at)})`}}>
              <div style={{fontSize: 20, fontWeight: 700, color: '#1f7a6a'}}>{m.who}</div>
              <div style={{fontSize: 30, color: '#111'}}>{m.text}</div>
            </div>
          ))}
        </div>
      </div>
      {s.notice ? (
        <div style={{position: 'absolute', right: 90, top: 240, width: 640, background: '#fffdf5', border: '3px solid #8a6d3b', color: '#222', padding: '26px 32px', boxShadow: '0 12px 40px rgba(0,0,0,0.5)', opacity: fadeIn(t, s.notice.at), transform: `rotate(2deg) translateY(${(1 - fadeIn(t, s.notice.at)) * 40}px)`}}>
          <div style={{fontSize: 22, letterSpacing: 2, color: '#8a6d3b', fontWeight: 700}}>{s.notice.head}</div>
          <div style={{fontSize: 36, marginTop: 14}}>{s.notice.text}</div>
        </div>
      ) : null}
      {s.stamp ? (
        <div style={{position: 'absolute', left: 80, top: 260, width: 520}}>
          {s.stamp.lines.map((l, i) => <div key={i} style={{fontSize: 44, fontWeight: 800, color: '#ff6b61', margin: '14px 0', opacity: fadeIn(t, s.stamp!.at + i * 0.9)}}>{l}</div>)}
        </div>
      ) : null}
      <Captions id={s.id} />
    </AbsoluteFill>
  );
};

const CodeScene = ({s}: {s: Scene}) => {
  const f = useCurrentFrame();
  const t = f / FPS - AUDIO_AT;
  return (
    <AbsoluteFill style={{background: '#14161b', fontFamily: font}}>
      <Bar title={s.title} />
      <div style={{position: 'absolute', top: 130, left: 100, right: 100}}>
        {(s.code ?? []).map((b, i) => (
          <div key={i} style={{margin: '0 0 36px', background: '#1c1f26', borderRadius: 12, padding: '18px 30px', border: '1px solid #2f3542'}}>
            <div style={{fontSize: 22, color: '#8a93a6', marginBottom: 10}}>{b.file}</div>
            {b.lines.map((l, k) => (
              <div key={k} style={{fontSize: 38, fontFamily: 'Menlo, monospace', whiteSpace: 'pre', color: l.hi ? '#ffd27a' : l.text.startsWith('PASS') ? '#7bd88f' : '#e8ebf2', fontWeight: l.hi ? 700 : 400, opacity: fadeIn(t, l.at), lineHeight: 1.5}}>{l.text}</div>
            ))}
          </div>
        ))}
      </div>
      <Captions id={s.id} />
    </AbsoluteFill>
  );
};

const PanelsScene = ({s}: {s: Scene}) => {
  const f = useCurrentFrame();
  const t = f / FPS - AUDIO_AT;
  return (
    <AbsoluteFill style={{background: '#14161b', fontFamily: font}}>
      <Bar title={s.title} />
      <div style={{position: 'absolute', top: 120, left: 100, right: 100}}>
        {(s.panels ?? []).map((p, i) => (
          <div key={i} style={{margin: '0 0 30px', background: '#1c1f26', borderLeft: '6px solid #ffd27a', borderRadius: 10, padding: '16px 30px', opacity: fadeIn(t, p.at), transform: `translateY(${(1 - fadeIn(t, p.at)) * 30}px)`}}>
            <div style={{fontSize: 24, color: '#8a93a6', marginBottom: 8}}>{p.label}</div>
            {p.lines.map((l, k) => <div key={k} style={{fontSize: 36, fontFamily: 'Menlo, monospace', color: '#e8ebf2', lineHeight: 1.45}}>{l}</div>)}
          </div>
        ))}
      </div>
      <Captions id={s.id} />
    </AbsoluteFill>
  );
};

const BOT = new Set(['clerk', 'byelaw', 'treasurer-agent', 'concierge', 'Switch']);
const Msgs = ({m, t, last}: {m: Msg; t: number; last: boolean}) => {
  const kind = m.kind ?? 'bot';
  const bot = BOT.has(m.who);
  const typingFrom = m.at - (m.typing ?? 0);
  if (t < (kind === 'user' ? m.at : typingFrom)) return null;
  if (kind === 'lease') {
    return <div style={{margin: '6px 0 6px 74px', alignSelf: 'flex-start', fontSize: 26, color: '#ffd27a', border: '1px solid #ffd27a', borderRadius: 20, padding: '4px 18px'}}>Switch role lease: {m.who} {m.text}</div>;
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
  const pz = s.proof ? interpolate(f / FPS, [proofAt, proofAt + 3], [s.proof.zoom.s * 0.8, s.proof.zoom.s], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
  return (
    <AbsoluteFill style={{background: '#14161b', fontFamily: font}}>
      <Bar title={s.title} />
      <div style={{position: 'absolute', top: 84, left: 0, right: 0, height: 64, background: '#1c1f26', display: 'flex', alignItems: 'center', padding: '0 48px', color: '#e8ebf2', fontSize: 30, fontWeight: 700, justifyContent: 'space-between'}}>
        <span>{s.room === 'committee' ? '\u{1F512} ' : '\u{1F310} '}{s.room}</span>
        <span style={{fontSize: 22, fontWeight: 400, color: '#8a93a6'}}>Replayed from the live Mattermost log</span>
      </div>
      <div style={{position: 'absolute', top: 160, left: 100, right: 100, height: 740, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden'}}>
        {msgs.map((m, i) => <Msgs key={i} m={m} t={t} last={i === msgs.length - 1} />)}
      </div>
      {showProof && s.proof ? (
        <AbsoluteFill style={{background: '#111', opacity: interpolate(f / FPS, [proofAt, proofAt + 0.4], [0, 1], {extrapolateRight: 'clamp'})}}>
          <Img src={staticFile(`shots/${s.proof.src}`)} style={{position: 'absolute', top: 84, left: 0, width: 1920, height: 996, objectFit: 'contain',
            transformOrigin: '0 0', transform: `translate(${960 - (s.proof.zoom.x / 100) * 1920 * pz}px, ${498 - (s.proof.zoom.y / 100) * 996 * pz}px) scale(${pz})`}} />
          <div style={{position: 'absolute', top: 100, right: 40, background: '#2f5fb3', color: '#fff', borderRadius: 10, padding: '8px 18px', fontSize: 26, zIndex: 6}}>{s.proof.note}</div>
          <Bar title={s.title} />
        </AbsoluteFill>
      ) : <Captions id={s.id} />}
    </AbsoluteFill>
  );
};

const CardsScene = ({s}: {s: Scene}) => {
  const f = useCurrentFrame();
  const t = f / FPS - AUDIO_AT;
  return (
    <AbsoluteFill style={{background: INK, fontFamily: font, color: '#fff', padding: '110px 150px', justifyContent: 'center'}}>
      {(s.cards ?? []).map((c, i) => {
        const o = interpolate(t, [c.at, c.at + 0.5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        return <div key={i} style={{fontSize: 90, fontWeight: 800, lineHeight: 1.2, margin: '30px 0', opacity: o, transform: `translateY(${(1 - o) * 30}px)`, color: c.hi ? '#ffd27a' : '#fff'}}>{c.text}</div>;
      })}
      <Captions id={s.id} />
    </AbsoluteFill>
  );
};

const EndScene = ({s}: {s: Scene}) => {
  const f = useCurrentFrame();
  const t = f / FPS - AUDIO_AT;
  const lines = s.built ?? [];
  return (
    <AbsoluteFill style={{background: INK, fontFamily: font, color: '#fff', padding: '90px 140px'}}>
      <div style={{fontSize: 96, fontWeight: 800}}>Built on Switch</div>
      <div style={{fontSize: 34, color: '#9db8e8', margin: '10px 0 44px'}}>Switch decides who may instruct; the engine decides what is allowed.</div>
      {lines.map((l, i) => {
        const at = 1.2 + i * 1.5;
        const o = interpolate(t, [at, at + 0.4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        return <div key={i} style={{fontSize: 40, margin: '14px 0', opacity: o, color: '#e8ebf2'}}><span style={{color: '#ffd27a'}}>{'\u25c6'} </span>{l}</div>;
      })}
      <div style={{position: 'absolute', left: 140, bottom: 150, fontSize: 56, fontFamily: 'Menlo, monospace', color: '#ffd27a', opacity: interpolate(t, [s.voiceSec, s.voiceSec + 0.6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>{s.repo}</div>
      <Captions id={s.id} />
    </AbsoluteFill>
  );
};

export const Demo = () => {
  let at = 0;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Audio src={staticFile('music/city.mp3')} loop volume={(f) => 0.11 * Math.min(1, (totalFrames() - f) / 60)} />
      {scenes.map((s) => {
        const n = frames(s);
        const el = (
          <Sequence key={s.id} from={at} durationInFrames={n}>
            {s.kind === 'wa' ? <WaScene s={s} /> : s.kind === 'code' ? <CodeScene s={s} /> : s.kind === 'panels' ? <PanelsScene s={s} /> : s.kind === 'chat' ? <ChatScene s={s} /> : s.kind === 'cards' ? <CardsScene s={s} /> : <EndScene s={s} />}
            <Sequence from={Math.round(0.3 * FPS)}><Audio src={staticFile(`audio/${s.id}.mp3`)} /></Sequence>
          </Sequence>
        );
        at += n;
        return el;
      })}
    </AbsoluteFill>
  );
};
