import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont as loadFraunces} from '@remotion/google-fonts/Fraunces';
import {loadFont as loadInstrument} from '@remotion/google-fonts/InstrumentSans';
import {loadFont as loadPlex} from '@remotion/google-fonts/IBMPlexMono';

// ---------- identity: warm ledger paper, ink, one vermilion stamp colour
export const DISPLAY = loadFraunces('normal', {weights: ['400', '500', '600', '700'], subsets: ['latin']}).fontFamily;
loadFraunces('italic', {weights: ['400', '500', '600'], subsets: ['latin']});
export const TEXT = loadInstrument('normal', {weights: ['400', '500', '600', '700'], subsets: ['latin']}).fontFamily;
export const MONO = loadPlex('normal', {weights: ['400', '500', '600'], subsets: ['latin']}).fontFamily;

export const P = {
  paper: '#F4EFE6',
  card: '#FCFAF4',
  ink: '#1B1813',
  ink2: '#4A453C',
  mute: '#8A8273',
  line: 'rgba(27,24,19,0.14)',
  red: '#D5452B',
  green: '#1C7A5E',
  amber: '#D98E04',
  indigo: '#3D4BD6',
  cyan: '#1A7FA0',
  lilac: '#7A5AF5',
  pink: '#D64D86',
  blue: '#2F6FD6',
};

// ---------- motion: expo-out for entrances, in-out for camera, springs only for stamps
export const EO = Easing.bezier(0.16, 1, 0.3, 1);
export const EIO = Easing.bezier(0.83, 0, 0.17, 1);
export const ramp = (f: number, a: number, b: number, e = EO) => interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
export const useSpr = (at: number, cfg = {damping: 14, stiffness: 160}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - at, fps, config: cfg});
};

export const Sfx: React.FC<{at: number; name: string; volume?: number}> = ({at, name, volume = 0.5}) =>
  at >= 0 ? (
    <Sequence from={at} durationInFrames={75} layout="none">
      <Audio src={staticFile(`launch/${name}.wav`)} volume={volume} />
    </Sequence>
  ) : null;

// Paper field with a faint dot grid and a soft vignette. `tint` warms a corner per scene.
export const Paper: React.FC<{tint?: string; dark?: boolean}> = ({tint = P.amber, dark}) => (
  <AbsoluteFill style={{background: dark ? P.ink : P.paper}}>
    {!dark && (
      <>
        <AbsoluteFill style={{backgroundImage: `radial-gradient(${P.line} 1.2px, transparent 1.2px)`, backgroundSize: '28px 28px', opacity: 0.55}} />
        <AbsoluteFill style={{background: `radial-gradient(1200px 700px at 85% 110%, ${tint}2a, transparent 70%)`}} />
        <AbsoluteFill style={{background: 'radial-gradient(1400px 900px at 50% 40%, transparent 60%, rgba(27,24,19,0.07) 100%)'}} />
      </>
    )}
  </AbsoluteFill>
);

// Chapter strip: a persistent top-left label so scenes read as one document.
export const Chapter: React.FC<{n: string; title: string; dark?: boolean}> = ({n, title, dark}) => {
  const f = useCurrentFrame();
  const c = dark ? 'rgba(244,239,230,0.7)' : P.mute;
  return (
    <div style={{position: 'absolute', left: 80, top: 54, display: 'flex', alignItems: 'center', gap: 16, fontFamily: MONO, fontSize: 18, letterSpacing: 3, color: c, opacity: ramp(f, 4, 20)}}>
      <span style={{color: dark ? P.amber : P.red, fontWeight: 600}}>{n}</span>
      <span style={{width: ramp(f, 6, 30) * 40, height: 1, background: c}} />
      <span style={{textTransform: 'uppercase'}}>{title}</span>
    </div>
  );
};

// Wipe-in from a colour panel: the scene underneath slides a touch so the cut has weight.
export const Wipe: React.FC<{color?: string; d: number; children: React.ReactNode}> = ({color = P.red, d, children}) => {
  const f = useCurrentFrame();
  const w = ramp(f, 0, 18, EIO);
  const out = ramp(f, d - 10, d, EIO);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `translateX(${(1 - w) * -40}px) scale(${1 + out * 0.02})`, opacity: 1 - out}}>{children}</AbsoluteFill>
      <AbsoluteFill style={{background: color, transform: `translateX(${w * 100}%)`, transformOrigin: 'right'}} />
    </AbsoluteFill>
  );
};

// Masked word rise. `*word*` sets the word in italic accent colour.
export const Head: React.FC<{text: string; at?: number; size?: number; color?: string; accent?: string; align?: 'left' | 'center'; stagger?: number; weight?: number; style?: React.CSSProperties}> = ({
  text, at = 0, size = 92, color = P.ink, accent = P.red, align = 'center', stagger = 2.5, weight = 500, style,
}) => {
  const f = useCurrentFrame();
  return (
    <div style={{fontFamily: DISPLAY, fontSize: size, fontWeight: weight, color, letterSpacing: -size * 0.025, lineHeight: 1.05, textAlign: align, ...style}}>
      {text.split(' ').map((w, i) => {
        const em = w.startsWith('*');
        const word = w.replace(/\*/g, '');
        const p = ramp(f, at + i * stagger, at + i * stagger + 22);
        return (
          <span key={i} style={{display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', paddingBottom: size * 0.12, marginBottom: -size * 0.12, marginRight: size * 0.22}}>
            <span style={{display: 'inline-block', transform: `translateY(${(1 - p) * 110}%)`, fontStyle: em ? 'italic' : 'normal', color: em ? accent : color, fontWeight: em ? 600 : weight}}>{word}</span>
          </span>
        );
      })}
    </div>
  );
};

// Body line that rises under its own mask.
export const Line: React.FC<{at: number; children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties}> = ({at, children, size = 30, color = P.ink2, style}) => {
  const f = useCurrentFrame();
  const p = ramp(f, at, at + 24);
  return (
    <div style={{overflow: 'hidden', fontFamily: TEXT, fontSize: size, color, lineHeight: 1.4, ...style}}>
      <div style={{transform: `translateY(${(1 - p) * 105}%)`, opacity: Math.min(1, p * 2)}}>{children}</div>
    </div>
  );
};

// Ink stamp: lands with overshoot and a slight rotation.
export const Stamp: React.FC<{at: number; text: string; color?: string; size?: number; rotate?: number; style?: React.CSSProperties; sub?: string}> = ({at, text, color = P.red, size = 84, rotate = -8, style, sub}) => {
  const f = useCurrentFrame();
  const s = useSpr(at, {damping: 9, stiffness: 260});
  if (f < at) return null;
  return (
    <div style={{position: 'absolute', transform: `rotate(${rotate}deg) scale(${1.8 - 0.8 * s})`, opacity: Math.min(1, s * 1.5) * 0.92, border: `${Math.max(4, size * 0.09)}px solid ${color}`, color, padding: `${size * 0.08}px ${size * 0.35}px`, borderRadius: size * 0.16, fontFamily: DISPLAY, fontWeight: 700, fontSize: size, letterSpacing: size * 0.06, lineHeight: 1.05, textAlign: 'center', mixBlendMode: 'multiply', ...style}}>
      {text}
      {sub && <div style={{fontFamily: MONO, fontSize: size * 0.2, letterSpacing: 1, fontWeight: 500}}>{sub}</div>}
    </div>
  );
};

// Card that rises in under a mask (no blur, no spring).
export const Rise: React.FC<{at: number; dy?: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, dy = 50, dur = 26, children, style}) => {
  const f = useCurrentFrame();
  const p = ramp(f, at, at + dur);
  return <div style={{opacity: Math.min(1, p * 1.6), transform: `translateY(${(1 - p) * dy}px)`, ...style}}>{children}</div>;
};

export const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties; accent?: string}> = ({children, style, accent}) => (
  <div style={{background: P.card, border: `1px solid ${P.line}`, borderRadius: 20, boxShadow: '0 18px 50px rgba(27,24,19,0.10), 0 1px 0 rgba(255,255,255,0.8) inset', fontFamily: TEXT, color: P.ink, borderTop: accent ? `5px solid ${accent}` : undefined, ...style}}>
    {children}
  </div>
);

// Eased camera over stage coordinates.
type Key = {f: number; x: number; y: number; s: number};
export const Camera: React.FC<{keys: Key[]; w?: number; h?: number; children: React.ReactNode}> = ({keys, w = 1920, h = 1080, children}) => {
  const frame = useCurrentFrame();
  const fs = keys.map((k) => k.f);
  const p = (k: 'x' | 'y' | 's') => (keys.length === 1 ? keys[0][k] : interpolate(frame, fs, keys.map((q) => q[k]), {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EIO}));
  const s = p('s');
  return <div style={{position: 'absolute', width: w, height: h, transformOrigin: '0 0', transform: `translate(${w / 2 - p('x') * s}px, ${h / 2 - p('y') * s}px) scale(${s})`}}>{children}</div>;
};

// ---------- icons (stroked, 2px grid, inherit colour)
const I: React.FC<{size?: number; color?: string; children: React.ReactNode; fill?: string}> = ({size = 48, color = P.ink, children}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
export const Icon = {
  invoice: (p: {size?: number; color?: string}) => <I {...p}><path d="M12 6h18l8 8v28H12z" /><path d="M30 6v8h8M18 24h14M18 31h14M18 38h8" /></I>,
  ballot: (p: {size?: number; color?: string}) => <I {...p}><path d="M8 24h32v16H8zM14 24V10h20v14" /><path d="M20 17l3 3 6-7" /><path d="M8 32h32" /></I>,
  scale: (p: {size?: number; color?: string}) => <I {...p}><path d="M24 8v32M12 40h24M10 16h28" /><path d="M10 16l-6 14h12zM38 16l-6 14h12z" /></I>,
  shield: (p: {size?: number; color?: string}) => <I {...p}><path d="M24 5l15 6v12c0 10-6.5 17-15 20C15.5 40 9 33 9 23V11z" /><path d="M17 24l5 5 9-10" /></I>,
  chat: (p: {size?: number; color?: string}) => <I {...p}><path d="M8 10h32v22H22l-9 8v-8H8z" /><path d="M16 18h16M16 24h10" /></I>,
  chain: (p: {size?: number; color?: string}) => <I {...p}><rect x={4} y={18} width={16} height={12} rx={3} /><rect x={28} y={18} width={16} height={12} rx={3} /><path d="M20 24h8" /></I>,
  toggle: (p: {size?: number; color?: string}) => <I {...p}><rect x={5} y={15} width={38} height={18} rx={9} /><circle cx={33} cy={24} r={6} fill={p.color ?? P.ink} stroke="none" /></I>,
  gear: (p: {size?: number; color?: string}) => <I {...p}><circle cx={24} cy={24} r={7} /><path d="M24 4v6M24 38v6M4 24h6M38 24h6M9.9 9.9l4.2 4.2M33.9 33.9l4.2 4.2M9.9 38.1l4.2-4.2M33.9 14.1l4.2-4.2" /></I>,
  spark: (p: {size?: number; color?: string}) => <I {...p}><path d="M24 6c1 10 8 17 18 18-10 1-17 8-18 18-1-10-8-17-18-18 10-1 17-8 18-18z" /></I>,
  person: (p: {size?: number; color?: string}) => <I {...p}><circle cx={24} cy={16} r={9} /><path d="M7 43c2-10 9-15 17-15s15 5 17 15" /></I>,
  rupee: (p: {size?: number; color?: string}) => <I {...p}><path d="M13 9h22M13 18h22M13 9h8a9 9 0 010 18h-8l16 14" /></I>,
  lock: (p: {size?: number; color?: string}) => <I {...p}><rect x={10} y={21} width={28} height={20} rx={4} /><path d="M16 21v-6a8 8 0 0116 0v6" /></I>,
  hash: (p: {size?: number; color?: string}) => <I {...p}><path d="M18 8l-4 32M34 8l-4 32M8 18h32M8 30h32" /></I>,
};

// ---------- chat (light shell)
export type Who = 'rohan' | 'karan' | 'clerk' | 'treasurer' | 'byelaw' | 'concierge' | 'switch';
export const PEOPLE: Record<Who, {name: string; tag: string; color: string; glyph: string; bot?: boolean}> = {
  rohan: {name: 'Rohan Patil', tag: 'Treasurer · A-103', color: P.blue, glyph: 'R'},
  karan: {name: 'Karan Patil', tag: 'Resident · A-107', color: P.pink, glyph: 'K'},
  clerk: {name: 'Clerk', tag: 'AGENT', color: P.lilac, glyph: 'C', bot: true},
  treasurer: {name: 'Treasurer Agent', tag: 'AGENT', color: P.green, glyph: '₹', bot: true},
  byelaw: {name: 'Byelaw', tag: 'AGENT', color: P.amber, glyph: 'B', bot: true},
  concierge: {name: 'Concierge', tag: 'AGENT', color: P.cyan, glyph: '?', bot: true},
  switch: {name: 'Switch', tag: 'PLATFORM', color: P.indigo, glyph: 'S', bot: true},
};

export const Avatar: React.FC<{who: Who; size?: number}> = ({who, size = 44}) => {
  const p = PEOPLE[who];
  return (
    <div style={{width: size, height: size, borderRadius: p.bot ? size * 0.3 : size, flexShrink: 0, background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontWeight: 700, fontSize: size * 0.48, color: P.card}}>
      {p.glyph}
    </div>
  );
};

const Rich: React.FC<{text: string}> = ({text}) => (
  <>
    {text.split(/(`[^`]+`|@[\w-]+)/g).map((t, i) =>
      t.startsWith('`') ? (
        <span key={i} style={{fontFamily: MONO, fontSize: '0.85em', background: 'rgba(27,24,19,0.07)', padding: '1px 7px', borderRadius: 6}}>{t.slice(1, -1)}</span>
      ) : t.startsWith('@') ? (
        <span key={i} style={{color: P.indigo, background: `${P.indigo}14`, borderRadius: 6, padding: '0 4px', fontWeight: 600}}>{t}</span>
      ) : (
        <span key={i}>{t}</span>
      ),
    )}
  </>
);

export type Msg = {at: number; who: Who; text: string; quote?: string[]; policy?: boolean};

const Verdict: React.FC<{text: string}> = ({text}) => {
  const m = /^(OK|REFUSED) (.*)$/s.exec(text);
  if (!m) return <Rich text={text} />;
  const col = m[1] === 'OK' ? P.green : P.red;
  return (
    <span>
      <span style={{fontFamily: MONO, fontSize: 17, fontWeight: 600, color: P.card, background: col, padding: '3px 10px', borderRadius: 6, marginRight: 12, verticalAlign: 3, letterSpacing: 1}}>{m[1]}</span>
      <span style={{fontFamily: MONO, fontSize: 22, color: P.ink}}><Rich text={m[2]} /></span>
    </span>
  );
};

const MessageRow: React.FC<{m: Msg}> = ({m}) => {
  const f = useCurrentFrame();
  const p = ramp(f, m.at, m.at + 20);
  const who = PEOPLE[m.who];
  return (
    <div style={{display: 'flex', gap: 16, padding: '13px 26px', opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 14}px)`, background: m.policy ? `${P.red}0f` : 'transparent', borderLeft: `3px solid ${m.policy ? P.red : 'transparent'}`}}>
      <Avatar who={m.who} />
      <div style={{flex: 1, minWidth: 0}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3}}>
          <span style={{fontWeight: 700, fontSize: 21}}>{who.name}</span>
          <span style={{fontFamily: MONO, fontSize: 13, letterSpacing: 1, color: who.bot ? who.color : P.mute, background: who.bot ? `${who.color}18` : 'transparent', padding: who.bot ? '2px 7px' : 0, borderRadius: 5}}>{who.tag}</span>
          {m.policy && <span style={{fontFamily: MONO, fontSize: 13, letterSpacing: 1, color: P.card, background: P.red, padding: '2px 8px', borderRadius: 5}}>ENFORCED BY SWITCH · AGENT NOT INVOKED</span>}
        </div>
        <div style={{fontSize: 22, lineHeight: 1.45, color: P.ink}}><Verdict text={m.text} /></div>
        {m.quote?.map((q, i) => (
          <div key={i} style={{marginTop: 8, borderLeft: `3px solid ${P.cyan}66`, paddingLeft: 14, fontFamily: MONO, fontSize: 18, color: P.ink2}}>{q}</div>
        ))}
      </div>
    </div>
  );
};

const estH = (m: Msg, w: number) => 76 + Math.ceil((m.text.length * 12) / (w - 120)) * 32 + (m.quote?.length ?? 0) * 36;

export type Typing = {from: number; send: number; text: string; who: Who};
export const Chat: React.FC<{room: 'committee' | 'general-body'; msgs: Msg[]; typing?: Typing[]; w?: number; h?: number}> = ({room, msgs, typing = [], w = 1640, h = 860}) => {
  const f = useCurrentFrame();
  const shown = msgs.filter((m) => m.at <= f);
  const last = shown[shown.length - 1];
  const pLast = last && last.at > 0 ? ramp(f, last.at, last.at + 22) : 1;
  const lift = last && last.at > 0 ? (1 - pLast) * estH(last, w - 280) : 0;
  const t = typing.find((x) => f >= x.from && f < x.send);
  const typed = t ? t.text.slice(0, Math.round(interpolate(f, [t.from, t.send - 6], [0, t.text.length], {extrapolateRight: 'clamp'}))) : '';
  const working = msgs.find((m) => PEOPLE[m.who].bot && !m.policy && f >= m.at - 26 && f < m.at);
  return (
    <div style={{width: w, height: h, borderRadius: 18, overflow: 'hidden', background: P.card, border: `1px solid ${P.line}`, boxShadow: '0 30px 80px rgba(27,24,19,0.16)', display: 'flex', flexDirection: 'column', fontFamily: TEXT, color: P.ink}}>
      <div style={{height: 46, display: 'flex', alignItems: 'center', gap: 9, padding: '0 20px', borderBottom: `1px solid ${P.line}`, background: '#F1ECE2'}}>
        {['#E5684F', '#E9B64B', '#5DBB7A'].map((c) => <div key={c} style={{width: 12, height: 12, borderRadius: 6, background: c}} />)}
        <div style={{flex: 1, textAlign: 'center', fontSize: 16, color: P.mute, fontWeight: 500}}>Sunrise Heights CHS · Society Room</div>
      </div>
      <div style={{flex: 1, display: 'flex', minHeight: 0}}>
        <div style={{width: 280, borderRight: `1px solid ${P.line}`, padding: '22px 16px', background: '#F7F3EA', display: 'flex', flexDirection: 'column', gap: 4}}>
          <div style={{fontFamily: DISPLAY, fontSize: 22, fontWeight: 600, padding: '0 10px 16px'}}>Sunrise Heights</div>
          <div style={{fontFamily: MONO, fontSize: 12, letterSpacing: 2, color: P.mute, padding: '6px 10px'}}>ROOMS</div>
          {(['committee', 'general-body'] as const).map((c) => (
            <div key={c} style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, padding: '8px 12px', borderRadius: 9, background: c === room ? `${P.indigo}14` : 'transparent', color: c === room ? P.indigo : P.ink2, fontWeight: c === room ? 600 : 500}}>
              {c === 'committee' ? <Icon.lock size={18} color={c === room ? P.indigo : P.mute} /> : <Icon.hash size={18} color={c === room ? P.indigo : P.mute} />}
              {c}
            </div>
          ))}
          <div style={{fontFamily: MONO, fontSize: 12, letterSpacing: 2, color: P.mute, padding: '20px 10px 6px'}}>AGENTS · VIA SWITCH</div>
          {(['clerk', 'treasurer', 'byelaw', 'concierge'] as Who[]).map((a) => (
            <div key={a} style={{display: 'flex', alignItems: 'center', gap: 11, padding: '6px 12px', fontSize: 17, color: P.ink2}}>
              <Avatar who={a} size={26} /> {PEOPLE[a].name}
              <div style={{marginLeft: 'auto', width: 8, height: 8, borderRadius: 4, background: P.green}} />
            </div>
          ))}
        </div>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0}}>
          <div style={{height: 62, display: 'flex', alignItems: 'center', padding: '0 26px', borderBottom: `1px solid ${P.line}`, gap: 12}}>
            {room === 'committee' ? <Icon.lock size={22} color={P.ink} /> : <Icon.hash size={22} color={P.ink} />}
            <span style={{fontSize: 22, fontWeight: 700}}>{room}</span>
            <span style={{fontSize: 15, color: P.mute}}>{room === 'committee' ? '7 members · 3 agents · private' : '60 residents · concierge'}</span>
            <span style={{marginLeft: 'auto', fontFamily: MONO, fontSize: 13, color: P.mute, border: `1px solid ${P.line}`, borderRadius: 20, padding: '4px 12px'}}>Slack · Teams · Mattermost</span>
          </div>
          <div style={{flex: 1, overflow: 'hidden', position: 'relative'}}>
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, transform: `translateY(${lift}px)`, paddingBottom: 10}}>
              {shown.map((m, i) => <MessageRow key={i} m={m} />)}
            </div>
          </div>
          <div style={{height: 24, padding: '0 28px', fontSize: 15, color: P.mute, fontStyle: 'italic'}}>
            {working ? `${PEOPLE[working.who].name} is running the rules engine${'...'.slice(0, 1 + (Math.floor(f / 8) % 3))}` : ''}
          </div>
          <div style={{margin: '0 22px 20px', height: 58, borderRadius: 12, border: `1.5px solid ${t ? P.indigo : P.line}`, background: '#F7F3EA', display: 'flex', alignItems: 'center', padding: '0 18px', fontSize: 20}}>
            {t ? <span><Rich text={typed} /><span style={{opacity: f % 20 < 10 ? 1 : 0, color: P.indigo}}>|</span></span> : <span style={{color: P.mute}}>Message {room}</span>}
            <div style={{marginLeft: 'auto', width: 36, height: 36, borderRadius: 9, background: t ? P.indigo : 'rgba(27,24,19,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: P.card, fontWeight: 800}}>↑</div>
          </div>
        </div>
      </div>
      {msgs.filter((m) => m.at > 0).map((m, i) => (
        <Sfx key={i} at={m.at} name={m.text.startsWith('REFUSED') || m.policy ? 'thud' : m.text.startsWith('OK booked') || m.text.includes('passed') ? 'chime' : 'pop'} volume={m.policy || m.text.startsWith('REFUSED') ? 0.7 : 0.3} />
      ))}
    </div>
  );
};

// Side panel beside a chat: a ledger card with a mono title.
export const Side: React.FC<{at: number; out?: number; title: string; accent?: string; children: React.ReactNode; style?: React.CSSProperties; w?: number}> = ({at, out, title, accent = P.indigo, children, style, w = 540}) => {
  const f = useCurrentFrame();
  const p = ramp(f, at, at + 26);
  const o = out ? 1 - ramp(f, out, out + 12) : 1;
  if (f < at) return null;
  return (
    <Card accent={accent} style={{position: 'absolute', width: w, padding: 28, opacity: p * o, transform: `translateX(${(1 - p) * 60 + (1 - o) * 30}px)`, ...style}}>
      <div style={{fontFamily: MONO, fontSize: 15, letterSpacing: 3, color: accent, marginBottom: 18}}>{title}</div>
      {children}
    </Card>
  );
};

export const Check: React.FC<{at: number; label: string; detail: string; color?: string}> = ({at, label, detail, color = P.green}) => {
  const f = useCurrentFrame();
  const s = useSpr(at, {damping: 11, stiffness: 220});
  const on = f >= at;
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '13px 0', borderBottom: `1px solid ${P.line}`}}>
      <div style={{width: 38, height: 38, borderRadius: 19, border: `2px solid ${on ? color : P.line}`, background: on ? color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${on ? 0.7 + 0.3 * s : 1})`}}>
        {on && <svg width={20} height={20} viewBox="0 0 20 20" fill="none" stroke={P.card} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M4 10l4 4 8-9" /></svg>}
      </div>
      <div>
        <div style={{fontSize: 23, fontWeight: 600, opacity: on ? 1 : 0.4}}>{label}</div>
        <div style={{fontSize: 17, color: P.mute, fontFamily: MONO}}>{detail}</div>
      </div>
    </div>
  );
};
