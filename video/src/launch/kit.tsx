import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';

export const SANS = loadInter('normal', {weights: ['400', '500', '600', '700', '800'], subsets: ['latin']}).fontFamily;
export const MONO = loadMono('normal', {weights: ['400', '500'], subsets: ['latin']}).fontFamily;

export const C = {
  bg: '#07080B',
  panel: '#0E1015',
  panel2: '#14171E',
  line: 'rgba(255,255,255,0.08)',
  text: '#ECEEF2',
  muted: '#8B93A3',
  brand: '#7C8CFF',
  ok: '#34D399',
  bad: '#FF5C6C',
  warn: '#FBBF24',
};

export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const useSpring = (at: number, cfg = {damping: 16, stiffness: 170}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - at, fps, config: cfg});
};
export const fade = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

export const Sfx: React.FC<{at: number; name: string; volume?: number}> = ({at, name, volume = 0.5}) =>
  at >= 0 ? (
    <Sequence from={at} durationInFrames={75} layout="none">
      <Audio src={staticFile(`launch/${name}.wav`)} volume={volume} />
    </Sequence>
  ) : null;

// Background: near-black with a soft brand glow and a faint grid.
export const Backdrop: React.FC<{glow?: string}> = ({glow = C.brand}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          opacity: 0.35,
          maskImage: 'radial-gradient(ellipse at 50% 40%, black 20%, transparent 70%)',
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(900px 500px at ${50 + 6 * Math.sin(f / 90)}% 0%, ${glow}33, transparent 70%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// Words rise in one by one.
export const Words: React.FC<{text: string; at?: number; size?: number; weight?: number; color?: string; stagger?: number; style?: React.CSSProperties}> = ({
  text, at = 0, size = 84, weight = 700, color = C.text, stagger = 3, style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{fontFamily: SANS, fontSize: size, fontWeight: weight, color, letterSpacing: -size * 0.035, lineHeight: 1.08, textAlign: 'center', ...style}}>
      {text.split(' ').map((w, i) => {
        const s = spring({frame: frame - at - i * stagger, fps, config: {damping: 18, stiffness: 140}});
        return (
          <span key={i} style={{display: 'inline-block', marginRight: size * 0.25, opacity: s, transform: `translateY(${(1 - s) * size * 0.45}px)`, filter: `blur(${(1 - s) * 8}px)`}}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

// Headline that starts big and centred, then docks at the top of the frame.
export const DockedHeadline: React.FC<{text: string; kicker: string; dockAt?: number}> = ({text, kicker, dockAt = 34}) => {
  const frame = useCurrentFrame();
  const d = fade(frame, dockAt, dockAt + 22);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-start', pointerEvents: 'none', zIndex: 10}}>
      <div style={{position: 'absolute', top: interpolate(d, [0, 1], [400, 34]), width: '100%', transform: `scale(${interpolate(d, [0, 1], [1, 0.62])})`, transformOrigin: '50% 0%'}}>
        <div style={{fontFamily: MONO, fontSize: 22, letterSpacing: 4, color: C.brand, textAlign: 'center', marginBottom: 18, opacity: fade(frame, 0, 10), textTransform: 'uppercase'}}>{kicker}</div>
        <Words text={text} size={76} />
      </div>
    </AbsoluteFill>
  );
};

// Area under a docked headline; the window rises into it.
export const Stage: React.FC<{at?: number; children: React.ReactNode}> = ({at = 40, children}) => {
  const s = useSpring(at, {damping: 20, stiffness: 120});
  return (
    <div style={{position: 'absolute', left: 0, top: 150, width: 1920, height: 930, overflow: 'hidden', opacity: s, transform: `translateY(${(1 - s) * 220}px)`}}>
      {children}
    </div>
  );
};

// Eased camera: keys are focus points in stage coordinates.
type Key = {f: number; x: number; y: number; s: number};
export const Camera: React.FC<{keys: Key[]; w?: number; h?: number; children: React.ReactNode}> = ({keys, w = 1920, h = 930, children}) => {
  const frame = useCurrentFrame();
  const fs = keys.map((k) => k.f);
  const p = (k: 'x' | 'y' | 's') =>
    keys.length === 1 ? keys[0][k] : interpolate(frame, fs, keys.map((q) => q[k]), {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const s = p('s');
  return (
    <div style={{position: 'absolute', width: w, height: h, transformOrigin: '0 0', transform: `translate(${w / 2 - p('x') * s}px, ${h / 2 - p('y') * s}px) scale(${s})`}}>
      {children}
    </div>
  );
};

// ---------- chat ----------
export type Who = 'rohan' | 'karan' | 'clerk' | 'treasurer' | 'byelaw' | 'concierge' | 'switch';
export const PEOPLE: Record<Who, {name: string; tag: string; color: string; glyph: string; bot?: boolean}> = {
  rohan: {name: 'Rohan Patil', tag: 'Treasurer · A-103', color: '#60A5FA', glyph: 'R'},
  karan: {name: 'Karan Patil', tag: 'Resident · A-107', color: '#F472B6', glyph: 'K'},
  clerk: {name: 'Clerk', tag: 'AGENT', color: '#A78BFA', glyph: '§', bot: true},
  treasurer: {name: 'Treasurer Agent', tag: 'AGENT', color: '#34D399', glyph: '₹', bot: true},
  byelaw: {name: 'Byelaw', tag: 'AGENT', color: '#FBBF24', glyph: '⚖', bot: true},
  concierge: {name: 'Concierge', tag: 'AGENT', color: '#22D3EE', glyph: '?', bot: true},
  switch: {name: 'Switch', tag: 'PLATFORM', color: '#FF5C6C', glyph: '⛨', bot: true},
};

export const Avatar: React.FC<{who: Who; size?: number}> = ({who, size = 46}) => {
  const p = PEOPLE[who];
  return (
    <div style={{width: size, height: size, borderRadius: p.bot ? size * 0.28 : size, flexShrink: 0, background: `linear-gradient(135deg, ${p.color}, ${p.color}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 700, fontSize: size * 0.46, color: '#0B0D12'}}>
      {p.glyph}
    </div>
  );
};

// @mentions in brand blue, `code` in mono pills.
const Rich: React.FC<{text: string}> = ({text}) => (
  <>
    {text.split(/(`[^`]+`|@[\w-]+)/g).map((t, i) =>
      t.startsWith('`') ? (
        <span key={i} style={{fontFamily: MONO, fontSize: '0.85em', background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: 6}}>{t.slice(1, -1)}</span>
      ) : t.startsWith('@') ? (
        <span key={i} style={{color: C.brand, background: `${C.brand}1f`, borderRadius: 6, padding: '0 4px'}}>{t}</span>
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
  const col = m[1] === 'OK' ? C.ok : C.bad;
  return (
    <span>
      <span style={{fontFamily: MONO, fontSize: 18, fontWeight: 600, color: col, background: `${col}22`, border: `1px solid ${col}55`, padding: '3px 10px', borderRadius: 7, marginRight: 12, verticalAlign: 3}}>{m[1]}</span>
      <span style={{fontFamily: MONO, fontSize: 23}}><Rich text={m[2]} /></span>
    </span>
  );
};

const MessageRow: React.FC<{m: Msg}> = ({m}) => {
  const s = useSpring(m.at, {damping: 18, stiffness: 160});
  const p = PEOPLE[m.who];
  const policy = m.policy;
  return (
    <div
      style={{
        display: 'flex', gap: 18, padding: '14px 28px', opacity: s, transform: `translateY(${(1 - s) * 18}px)`,
        background: policy ? `${C.bad}12` : 'transparent', borderLeft: policy ? `3px solid ${C.bad}` : '3px solid transparent',
      }}
    >
      <Avatar who={m.who} />
      <div style={{flex: 1, minWidth: 0}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4}}>
          <span style={{fontWeight: 700, fontSize: 22}}>{p.name}</span>
          <span style={{fontSize: 14, fontWeight: 600, letterSpacing: 1, color: p.bot ? p.color : C.muted, background: p.bot ? `${p.color}1c` : 'transparent', padding: p.bot ? '2px 7px' : 0, borderRadius: 5}}>{p.tag}</span>
          {policy && (
            <span style={{fontSize: 14, fontWeight: 600, letterSpacing: 1, color: C.bad, background: `${C.bad}1c`, padding: '2px 8px', borderRadius: 5}}>⛨ ENFORCED BY SWITCH · AGENT NOT INVOKED</span>
          )}
        </div>
        <div style={{fontSize: 23, lineHeight: 1.45, color: C.text}}>
          <Verdict text={m.text} />
        </div>
        {m.quote?.map((q, i) => (
          <div key={i} style={{marginTop: 10, borderLeft: `3px solid ${C.line}`, paddingLeft: 16, fontFamily: MONO, fontSize: 19, color: '#C9CED8'}}>{q}</div>
        ))}
      </div>
    </div>
  );
};

const estH = (m: Msg, w: number) => 80 + Math.ceil((m.text.length * 12) / (w - 120)) * 33 + (m.quote?.length ?? 0) * 40;

export type Typing = {from: number; send: number; text: string; who: Who};
export const ChatWindow: React.FC<{room: 'committee' | 'general-body'; msgs: Msg[]; typing?: Typing[]; w?: number; h?: number}> = ({room, msgs, typing = [], w = 1640, h = 880}) => {
  const frame = useCurrentFrame();
  const shown = msgs.filter((m) => m.at <= frame);
  const last = shown[shown.length - 1];
  const sLast = useSpring(last ? last.at : -100, {damping: 22, stiffness: 150});
  const listW = w - 300;
  const lift = last && last.at > 0 ? (1 - sLast) * estH(last, listW) : 0;
  const t = typing.find((x) => frame >= x.from && frame < x.send);
  const typed = t ? t.text.slice(0, Math.round(interpolate(frame, [t.from, t.send - 6], [0, t.text.length], {extrapolateRight: 'clamp'}))) : '';
  const working = msgs.find((m) => PEOPLE[m.who].bot && !m.policy && frame >= m.at - 26 && frame < m.at);
  const channels: [string, string][] = [['committee', '🔒'], ['general-body', '#']];
  return (
    <div style={{width: w, height: h, borderRadius: 22, overflow: 'hidden', background: C.panel, border: `1px solid ${C.line}`, boxShadow: '0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)', display: 'flex', flexDirection: 'column', fontFamily: SANS, color: C.text}}>
      <div style={{height: 52, display: 'flex', alignItems: 'center', gap: 10, padding: '0 22px', borderBottom: `1px solid ${C.line}`, background: C.panel2}}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <div key={c} style={{width: 14, height: 14, borderRadius: 7, background: c}} />)}
        <div style={{flex: 1, textAlign: 'center', fontSize: 17, color: C.muted, fontWeight: 500}}>Sunrise Heights CHS · Society Room</div>
      </div>
      <div style={{flex: 1, display: 'flex', minHeight: 0}}>
        <div style={{width: 300, borderRight: `1px solid ${C.line}`, padding: '24px 18px', background: '#0B0D11', display: 'flex', flexDirection: 'column', gap: 6}}>
          <div style={{fontSize: 20, fontWeight: 700, padding: '0 10px 18px'}}>Sunrise Heights</div>
          <div style={{fontSize: 13, letterSpacing: 2, color: C.muted, padding: '6px 10px'}}>ROOMS</div>
          {channels.map(([c, ic]) => (
            <div key={c} style={{fontSize: 19, padding: '9px 12px', borderRadius: 9, background: c === room ? `${C.brand}26` : 'transparent', color: c === room ? C.text : C.muted, fontWeight: c === room ? 600 : 500}}>
              <span style={{opacity: 0.7, marginRight: 10, fontSize: 15}}>{ic}</span>{c}
            </div>
          ))}
          <div style={{fontSize: 13, letterSpacing: 2, color: C.muted, padding: '22px 10px 6px'}}>AGENTS · VIA SWITCH</div>
          {(['clerk', 'treasurer', 'byelaw', 'concierge'] as Who[]).map((a) => (
            <div key={a} style={{display: 'flex', alignItems: 'center', gap: 12, padding: '7px 12px', fontSize: 18, color: '#C5CAD4'}}>
              <Avatar who={a} size={28} /> {PEOPLE[a].name}
              <div style={{marginLeft: 'auto', width: 9, height: 9, borderRadius: 5, background: C.ok, boxShadow: `0 0 8px ${C.ok}`}} />
            </div>
          ))}
        </div>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0}}>
          <div style={{height: 70, display: 'flex', alignItems: 'center', padding: '0 28px', borderBottom: `1px solid ${C.line}`, gap: 14}}>
            <span style={{fontSize: 23, fontWeight: 700}}>{room === 'committee' ? '🔒 committee' : '# general-body'}</span>
            <span style={{fontSize: 16, color: C.muted}}>{room === 'committee' ? '7 members · 3 agents · private' : '60 residents · concierge'}</span>
            <span style={{marginLeft: 'auto', fontSize: 14, color: C.muted, border: `1px solid ${C.line}`, borderRadius: 20, padding: '5px 12px'}}>Slack · Teams · Mattermost</span>
          </div>
          <div style={{flex: 1, overflow: 'hidden', position: 'relative'}}>
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, transform: `translateY(${lift}px)`, paddingBottom: 12}}>
              {shown.map((m, i) => <MessageRow key={i} m={m} />)}
            </div>
          </div>
          <div style={{height: 26, padding: '0 30px', fontSize: 16, color: C.muted, fontStyle: 'italic'}}>
            {working ? `${PEOPLE[working.who].name} is running the rules engine${'...'.slice(0, 1 + (Math.floor(frame / 8) % 3))}` : ''}
          </div>
          <div style={{margin: '0 24px 22px', height: 64, borderRadius: 14, border: `1px solid ${t ? C.brand + '88' : C.line}`, background: C.panel2, display: 'flex', alignItems: 'center', padding: '0 20px', fontSize: 21}}>
            {t ? (
              <span><Rich text={typed} /><span style={{opacity: frame % 20 < 10 ? 1 : 0, color: C.brand}}>|</span></span>
            ) : (
              <span style={{color: C.muted}}>Message {room}</span>
            )}
            <div style={{marginLeft: 'auto', width: 40, height: 40, borderRadius: 10, background: t ? C.brand : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0B0D12', fontWeight: 800}}>↑</div>
          </div>
        </div>
      </div>
      {msgs.filter((m) => m.at > 0).map((m, i) => (
        <Sfx key={i} at={m.at} name={m.text.startsWith('REFUSED') || m.policy ? 'thud' : m.text.startsWith('OK booked') || m.text.includes('passed') ? 'chime' : 'pop'} volume={m.policy || m.text.startsWith('REFUSED') ? 0.8 : 0.35} />
      ))}
    </div>
  );
};

// Floating card used for quorum, votes, the payment gate, limits.
export const Card: React.FC<{at: number; out?: number; title: string; children: React.ReactNode; w?: number; accent?: string; style?: React.CSSProperties}> = ({at, out, title, children, w = 560, accent = C.brand, style}) => {
  const frame = useCurrentFrame();
  const s = useSpring(at, {damping: 17, stiffness: 150});
  const o = out ? 1 - fade(frame, out, out + 12) : 1;
  if (frame < at) return null;
  return (
    <div style={{position: 'absolute', width: w, opacity: s * o, transform: `translateX(${(1 - s) * 80 + (1 - o) * 40}px) scale(${0.96 + 0.04 * s})`, background: 'rgba(20,23,30,0.92)', backdropFilter: 'blur(20px)', border: `1px solid ${accent}55`, borderRadius: 22, padding: 30, boxShadow: `0 30px 90px rgba(0,0,0,0.55), 0 0 60px ${accent}22`, fontFamily: SANS, color: C.text, ...style}}>
      <div style={{fontFamily: MONO, fontSize: 16, letterSpacing: 3, color: accent, marginBottom: 20}}>{title}</div>
      {children}
    </div>
  );
};

export const Check: React.FC<{at: number; label: string; detail: string; color?: string; mark?: string}> = ({at, label, detail, color = C.ok, mark = '✓'}) => {
  const frame = useCurrentFrame();
  const s = useSpring(at, {damping: 12, stiffness: 200});
  const on = frame >= at;
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '14px 0', borderBottom: `1px solid ${C.line}`}}>
      <div style={{width: 40, height: 40, borderRadius: 20, border: `2px solid ${on ? color : C.line}`, background: on ? `${color}22` : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color, fontWeight: 800, fontSize: 22, transform: `scale(${on ? 0.7 + 0.3 * s : 1})`}}>
        {on ? mark : ''}
      </div>
      <div>
        <div style={{fontSize: 24, fontWeight: 600, opacity: on ? 1 : 0.45}}>{label}</div>
        <div style={{fontSize: 18, color: C.muted, fontFamily: MONO}}>{detail}</div>
      </div>
    </div>
  );
};
