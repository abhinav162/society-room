import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {FPS, Scene, Shot, scenes} from './manifest';

const INK = '#222', BLUE = '#2f5fb3', AMBER = '#a15c00';
const font = 'Helvetica, Arial, sans-serif';
const PAD = 0.9; // seconds of air after each voice-over
const frames = (s: Scene) => Math.ceil((s.voiceSec + PAD) * FPS);
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
      <Img src={staticFile(`shots/${shot.src}`)} style={{position: 'absolute', top: 84, left: 0, width: 1920, height: 996, objectFit: 'contain', transformOrigin: `${z.cx}% ${z.cy}%`, transform: `scale(${k})`}} />
      {shot.caption ? (
        <div style={{position: 'absolute', left: 80, right: 80, bottom: 50, background: 'rgba(20,20,20,0.88)', border: `2px solid ${BLUE}`, borderRadius: 14,
          padding: '18px 28px', fontFamily: font, color: '#fff', fontSize: 34}}>
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
            {s.kind === 'text' ? <TextScene s={s} /> : s.kind === 'image' ? <ImageScene s={s} /> : <ShotsScene s={s} />}
            <Sequence from={Math.round(0.3 * FPS)}><Audio src={staticFile(`audio/${s.id}.mp3`)} /></Sequence>
          </Sequence>
        );
        at += n;
        return el;
      })}
    </AbsoluteFill>
  );
};
