import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Avatar, DISPLAY, EIO, EO, Icon, MONO, P, PEOPLE, ramp, Sfx, TEXT, useSpr, Who} from '../explainer-v2/kit';

export {Avatar, DISPLAY, EIO, EO, Icon, MONO, P, PEOPLE, ramp, Sfx, TEXT, useSpr};
export type {Who};

// ---------- camera over the 1920x1080 stage, with optional perspective tilt on establishing shots
export type CamKey = {f: number; x: number; y: number; s: number; rx?: number; ry?: number};
export const Cam: React.FC<{keys: CamKey[]; children: React.ReactNode}> = ({keys, children}) => {
  const f = useCurrentFrame();
  const fs = keys.map((k) => k.f);
  const p = (k: keyof CamKey, d = 0) => (keys.length === 1 ? keys[0][k] ?? d : interpolate(f, fs, keys.map((q) => q[k] ?? d), {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EIO}));
  const s = p('s', 1);
  // feather the frame edges once zoomed in, so text cropped by a push-in dissolves instead of being sliced
  const e = interpolate(s, [1.15, 1.35], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const mask = e > 0 ? `linear-gradient(90deg, transparent, #000 ${8 * e}%, #000 ${100 - 8 * e}%, transparent), linear-gradient(180deg, transparent, #000 ${6 * e}%, #000 ${100 - 6 * e}%, transparent)` : undefined;
  return (
    <AbsoluteFill style={{perspective: 2400, perspectiveOrigin: '50% 50%', WebkitMaskImage: mask, WebkitMaskComposite: 'source-in', maskComposite: 'intersect'}}>
      <div style={{position: 'absolute', width: 1920, height: 1080, transformOrigin: '0 0', transform: `translate(${960 - p('x') * s}px, ${540 - p('y') * s}px) scale(${s})`}}>
        <div style={{position: 'absolute', width: 1920, height: 1080, transformOrigin: '50% 50%', transform: `rotateX(${p('rx')}deg) rotateY(${p('ry')}deg)`}}>{children}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- cursor with eased path and click ripples (stage coordinates; put it inside <Cam>)
export type CurKey = {f: number; x: number; y: number; click?: boolean};
export const Cursor: React.FC<{keys: CurKey[]; hideAfter?: number}> = ({keys, hideAfter}) => {
  const f = useCurrentFrame();
  if (f < keys[0].f - 10 || (hideAfter !== undefined && f > hideAfter)) return null;
  const fs = keys.map((k) => k.f);
  const x = interpolate(f, fs, keys.map((k) => k.x), {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EIO});
  const y = interpolate(f, fs, keys.map((k) => k.y), {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EIO});
  const click = keys.find((k) => k.click && f >= k.f && f < k.f + 14);
  const press = keys.some((k) => k.click && f >= k.f && f < k.f + 5);
  return (
    <div style={{position: 'absolute', left: x, top: y, pointerEvents: 'none', zIndex: 50}}>
      {click && <div style={{position: 'absolute', left: -2, top: -2, width: 44, height: 44, marginLeft: -22, marginTop: -22, borderRadius: 22, border: `2px solid ${P.indigo}`, opacity: 1 - (f - click.f) / 14, transform: `scale(${0.3 + (f - click.f) / 14})`}} />}
      <svg width={30} height={36} viewBox="0 0 30 36" style={{transform: `scale(${press ? 0.88 : 1})`, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))'}}>
        <path d="M4 2l20 16-9 1 5 11-4 2-5-11-7 7z" fill="#fff" stroke="#111" strokeWidth={1.6} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

// ---------- desktop
const Wallpaper: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(1100px 800px at 15% 10%, #F6E3C8 0%, transparent 60%), radial-gradient(900px 700px at 85% 25%, #D9DCF6 0%, transparent 60%), radial-gradient(1000px 800px at 60% 100%, #CFE3DB 0%, transparent 60%), linear-gradient(180deg, #EFE9DD, #E6DFD2)`}} />
);
const Dock: React.FC = () => (
  <div style={{position: 'absolute', left: '50%', bottom: 10, transform: 'translateX(-50%)', display: 'flex', gap: 10, padding: 8, borderRadius: 20, background: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)'}}>
    {['#3D4BD6', '#1C7A5E', '#D5452B', '#D98E04', '#1A7FA0', '#7A5AF5', '#1B1813'].map((c, i) => (
      <div key={i} style={{width: 44, height: 44, borderRadius: 11, background: `linear-gradient(160deg, ${c}, ${c}aa)`, boxShadow: '0 4px 10px rgba(0,0,0,0.15)'}} />
    ))}
  </div>
);
export const Desktop: React.FC<{children: React.ReactNode; app?: string; dim?: number; blur?: number}> = ({children, app = 'Society Room', dim = 0, blur = 0}) => (
  <AbsoluteFill style={{fontFamily: TEXT, color: P.ink, filter: blur ? `blur(${blur}px)` : undefined}}>
    <Wallpaper />
    <div style={{position: 'absolute', left: 0, top: 0, right: 0, height: 30, background: 'rgba(255,255,255,0.35)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', padding: '0 18px', fontSize: 14, fontWeight: 600, gap: 22, borderBottom: '1px solid rgba(0,0,0,0.06)'}}>
      <span style={{fontSize: 16}}>●</span><span>{app}</span><span style={{fontWeight: 400}}>File</span><span style={{fontWeight: 400}}>Edit</span><span style={{fontWeight: 400}}>View</span><span style={{fontWeight: 400}}>Window</span>
      <span style={{marginLeft: 'auto', fontWeight: 500, display: 'flex', gap: 16}}><span>◔ 92%</span><span>Thu 6 Nov</span><span>11:02 PM</span></span>
    </div>
    {children}
    <Dock />
    {dim > 0 && <AbsoluteFill style={{background: `rgba(27,24,19,${dim})`}} />}
  </AbsoluteFill>
);

export const Win: React.FC<{x: number; y: number; w: number; h: number; title: string; children: React.ReactNode; at?: number; tabs?: string[]}> = ({x, y, w, h, title, children, at = -100, tabs}) => {
  const f = useCurrentFrame();
  const p = ramp(f, at, at + 28);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 14, overflow: 'hidden', background: P.card, boxShadow: '0 40px 100px rgba(27,24,19,0.28), 0 0 0 1px rgba(27,24,19,0.12)', display: 'flex', flexDirection: 'column', opacity: p, transform: `translateY(${(1 - p) * 40}px) scale(${0.97 + 0.03 * p})`, fontFamily: TEXT, color: P.ink}}>
      <div style={{height: 44, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', background: '#EFEAE0', borderBottom: `1px solid ${P.line}`}}>
        {['#E5684F', '#E9B64B', '#5DBB7A'].map((c) => <div key={c} style={{width: 12, height: 12, borderRadius: 6, background: c, boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.15)'}} />)}
        {tabs ? (
          <div style={{display: 'flex', gap: 2, marginLeft: 14, fontFamily: MONO, fontSize: 13}}>
            {tabs.map((t, i) => <div key={t} style={{padding: '6px 14px', borderRadius: '8px 8px 0 0', background: i === 0 ? P.card : 'transparent', color: i === 0 ? P.ink : P.mute, marginTop: 10}}>{t}</div>)}
          </div>
        ) : (
          <div style={{flex: 1, textAlign: 'center', fontSize: 14, color: P.mute, fontWeight: 500}}>{title}</div>
        )}
      </div>
      <div style={{flex: 1, minHeight: 0, position: 'relative'}}>{children}</div>
    </div>
  );
};

// ---------- the chat client
const Rich: React.FC<{text: string}> = ({text}) => (
  <>
    {text.split(/(`[^`]+`|@[\w-]+)/g).map((t, i) =>
      t.startsWith('`') ? <span key={i} style={{fontFamily: MONO, fontSize: '0.85em', background: 'rgba(27,24,19,0.07)', padding: '1px 7px', borderRadius: 6}}>{t.slice(1, -1)}</span>
      : t.startsWith('@') ? <span key={i} style={{color: P.indigo, background: `${P.indigo}14`, borderRadius: 6, padding: '0 4px', fontWeight: 600}}>{t}</span>
      : <span key={i}>{t}</span>,
    )}
  </>
);
const Verdict: React.FC<{text: string}> = ({text}) => {
  const m = /^(OK|REFUSED) (.*)$/s.exec(text);
  if (!m) return <Rich text={text} />;
  const col = m[1] === 'OK' ? P.green : P.red;
  return (
    <span>
      <span style={{fontFamily: MONO, fontSize: 15, fontWeight: 600, color: P.card, background: col, padding: '3px 9px', borderRadius: 6, marginRight: 10, verticalAlign: 2, letterSpacing: 1}}>{m[1]}</span>
      <span style={{fontFamily: MONO, fontSize: 20, color: P.ink}}><Rich text={m[2]} /></span>
    </span>
  );
};

export type Cite = {file: string; where: string; excerpt: string};
export type Msg = {at: number; who: Who; text: string; time?: string; policy?: boolean; sys?: boolean; banner?: {at: number; text: string; sub?: string}; cites?: {at: number; open: number; items: Cite[]}; replies?: number; seen?: boolean};

const Notice: React.FC<{m: Msg; p: number}> = ({m, p}) => {
  const c = m.sys ? P.indigo : P.red;
  return (
  <div style={{margin: '10px 24px', padding: '14px 18px', borderRadius: 12, background: `${c}0e`, border: `1px solid ${c}44`, display: 'flex', gap: 14, alignItems: 'flex-start', opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 12}px)`}}>
    <div style={{width: 34, height: 34, borderRadius: 9, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}><Icon.toggle size={22} color={P.card} /></div>
    <div style={{flex: 1}}>
      <div style={{display: 'flex', gap: 10, alignItems: 'center', marginBottom: 3}}>
        <span style={{fontWeight: 700, fontSize: 17}}>Switch</span>
        <span style={{fontFamily: MONO, fontSize: 12, letterSpacing: 1, color: P.card, background: c, padding: '2px 8px', borderRadius: 5}}>{m.sys ? 'SYSTEM' : 'POLICY · AGENT NOT INVOKED'}</span>
        {m.time && <span style={{fontFamily: MONO, fontSize: 12, color: P.mute, marginLeft: 'auto'}}>{m.time}</span>}
      </div>
      <div style={{fontSize: 19, lineHeight: 1.45}}>{m.text}</div>
    </div>
  </div>
  );
};

const Row: React.FC<{m: Msg; focus: boolean; dimmed: boolean}> = ({m, focus, dimmed}) => {
  const f = useCurrentFrame();
  const p = ramp(f, m.at, m.at + 18);
  if (m.policy || m.sys) return <Notice m={m} p={m.at < 0 ? 1 : p} />;
  const who = PEOPLE[m.who];
  const banner = m.banner && f >= m.banner.at ? ramp(f, m.banner.at, m.banner.at + 20) : 0;
  const cites = m.cites && f >= m.cites.at;
  const open = m.cites ? ramp(f, m.cites.open, m.cites.open + 22) : 0;
  return (
    <div style={{display: 'flex', gap: 14, padding: '10px 24px', opacity: (m.at < 0 ? 1 : Math.min(1, p * 1.5)) * (dimmed ? 0.45 : 1), filter: dimmed ? 'blur(1.2px)' : undefined, transform: `translateY(${(1 - (m.at < 0 ? 1 : p)) * 12}px)`, background: focus ? 'rgba(27,24,19,0.04)' : 'transparent', position: 'relative'}}>
      <Avatar who={m.who} size={40} />
      <div style={{flex: 1, minWidth: 0}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 9, marginBottom: 2}}>
          <span style={{fontWeight: 700, fontSize: 18}}>{who.name}</span>
          <span style={{fontFamily: MONO, fontSize: 11.5, letterSpacing: 1, color: who.bot ? who.color : P.mute, background: who.bot ? `${who.color}18` : 'transparent', padding: who.bot ? '1px 6px' : 0, borderRadius: 4}}>{who.tag}</span>
          <span style={{fontFamily: MONO, fontSize: 12, color: P.mute}}>{m.time ?? '11:02 PM'}</span>
        </div>
        <div style={{fontSize: 20, lineHeight: 1.45}}><Verdict text={m.text} /></div>
        {m.banner && banner > 0 && (
          <div style={{marginTop: 10, padding: '10px 14px', borderRadius: 10, background: `${P.amber}14`, border: `1px solid ${P.amber}66`, borderLeft: `4px solid ${P.amber}`, opacity: banner, transform: `translateY(${(1 - banner) * 8}px)`}}>
            <div style={{fontSize: 17, fontWeight: 700, color: '#7A4F00'}}>{m.banner.text}</div>
            {m.banner.sub && <div style={{fontSize: 15, color: P.ink2, marginTop: 2}}>{m.banner.sub}</div>}
          </div>
        )}
        {m.cites && cites && (
          <div style={{marginTop: 10}}>
            <div style={{display: 'flex', gap: 8}}>
              {m.cites.items.map((c) => (
                <span key={c.file} style={{fontFamily: MONO, fontSize: 13, padding: '4px 10px', borderRadius: 14, border: `1px solid ${P.cyan}66`, color: P.cyan, background: `${P.cyan}0d`, display: 'inline-flex', gap: 6, alignItems: 'center'}}>
                  <Icon.invoice size={14} color={P.cyan} />{c.file} · {c.where}
                </span>
              ))}
            </div>
            <div style={{overflow: 'hidden', maxHeight: open * 150, opacity: open}}>
              {m.cites.items.map((c) => (
                <div key={c.file} style={{marginTop: 8, padding: '8px 12px', borderLeft: `3px solid ${P.cyan}`, background: '#F3F6F5', borderRadius: '0 8px 8px 0', fontFamily: MONO, fontSize: 15, color: P.ink2}}>
                  <span style={{color: P.cyan}}>{c.file}</span> {c.excerpt}
                </div>
              ))}
            </div>
          </div>
        )}
        {(m.replies || m.seen) && (
          <div style={{display: 'flex', gap: 14, marginTop: 6, fontSize: 13, color: P.mute, alignItems: 'center'}}>
            {m.replies ? <span style={{color: P.indigo, fontWeight: 600}}>↩ {m.replies} {m.replies > 1 ? 'replies' : 'reply'} · Following</span> : null}
            {m.seen && <span>✓✓ Seen by 6</span>}
          </div>
        )}
      </div>
      {focus && (
        <div style={{position: 'absolute', right: 20, top: -10, display: 'flex', gap: 2, background: P.card, border: `1px solid ${P.line}`, borderRadius: 8, padding: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 13}}>
          {['↩', '☆', '⋯'].map((g) => <span key={g} style={{width: 26, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', color: P.ink2}}>{g}</span>)}
        </div>
      )}
    </div>
  );
};

const estH = (m: Msg, w: number) => 70 + Math.ceil((m.text.length * 11) / (w - 120)) * 29 + (m.banner ? 70 : 0) + (m.cites ? 50 : 0);

export type Typing = {from: number; send: number; text: string; who: Who};
export const Chat: React.FC<{room: 'committee' | 'general-body'; msgs: Msg[]; typing?: Typing[]; focus?: number; panel?: React.ReactNode; compact?: boolean; agentsAt?: number; me?: Who}> = ({room, msgs, typing = [], focus, panel, compact, agentsAt = -100, me = 'rohan'}) => {
  const f = useCurrentFrame();
  const shown = msgs.filter((m) => m.at <= f);
  const last = shown[shown.length - 1];
  const pLast = last && last.at > 0 ? ramp(f, last.at, last.at + 20) : 1;
  const lift = last && last.at > 0 ? (1 - pLast) * estH(last, 1000) : 0;
  const t = typing.find((x) => f >= x.from && f < x.send);
  const typed = t ? t.text.slice(0, Math.round(interpolate(f, [t.from, t.send - 4], [0, t.text.length], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'}))) : '';
  const working = msgs.find((m) => PEOPLE[m.who].bot && !m.policy && f >= m.at - 24 && f < m.at);
  const focusOn = focus !== undefined && f >= focus;
  return (
    <div style={{position: 'absolute', inset: 0, display: 'flex', fontFamily: TEXT, color: P.ink}}>
      {!compact && (
        <div style={{width: 250, borderRight: `1px solid ${P.line}`, padding: '18px 12px', background: '#F5F1E8', display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px 14px'}}><span style={{fontFamily: DISPLAY, fontSize: 20, fontWeight: 600}}>Sunrise Heights</span><span style={{fontSize: 12, color: P.mute}}>⌄</span></div>
          <div style={{margin: '0 6px 14px', height: 30, borderRadius: 8, background: 'rgba(27,24,19,0.06)', display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: 13, color: P.mute, gap: 6}}>⌕ Search</div>
          <div style={{fontFamily: MONO, fontSize: 11, letterSpacing: 2, color: P.mute, padding: '6px 8px'}}>ROOMS</div>
          {(['committee', 'general-body'] as const).map((c) => (
            <div key={c} style={{display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, padding: '7px 10px', borderRadius: 8, background: c === room ? `${P.indigo}14` : 'transparent', color: c === room ? P.indigo : P.ink2, fontWeight: c === room ? 600 : 500}}>
              {c === 'committee' ? <Icon.lock size={16} color={c === room ? P.indigo : P.mute} /> : <Icon.hash size={16} color={c === room ? P.indigo : P.mute} />}
              {c}
              {c !== room && <span style={{marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: P.card, background: P.red, borderRadius: 10, padding: '1px 7px'}}>{c === 'committee' ? 2 : 3}</span>}
            </div>
          ))}
          <div style={{fontFamily: MONO, fontSize: 11, letterSpacing: 2, color: P.mute, padding: '18px 8px 6px', display: 'flex', alignItems: 'center', gap: 6}}>AGENTS · VIA SWITCH <Icon.toggle size={14} color={P.indigo} /></div>
          {(['clerk', 'treasurer', 'byelaw', 'concierge'] as Who[]).map((a, i) => {
            const p = agentsAt < 0 ? 1 : ramp(f, agentsAt + i * 8, agentsAt + i * 8 + 16);
            return (
              <div key={a} style={{display: 'flex', alignItems: 'center', gap: 10, padding: '5px 10px', fontSize: 15, color: P.ink2, opacity: p, transform: `translateX(${(1 - p) * -14}px)`}}>
                <Avatar who={a} size={24} /> {PEOPLE[a].name}
                <div style={{marginLeft: 'auto', width: 8, height: 8, borderRadius: 4, background: P.green}} />
              </div>
            );
          })}
          <div style={{marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 8px', fontSize: 14, color: P.ink2}}><Avatar who={me} size={26} /> {PEOPLE[me].name} <span style={{marginLeft: 'auto', color: P.mute}}>⚙</span></div>
        </div>
      )}
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0}}>
        <div style={{height: 54, display: 'flex', alignItems: 'center', padding: '0 22px', borderBottom: `1px solid ${P.line}`, gap: 10, flexShrink: 0}}>
          {room === 'committee' ? <Icon.lock size={19} color={P.ink} /> : <Icon.hash size={19} color={P.ink} />}
          <span style={{fontSize: 19, fontWeight: 700}}>{room}</span>
          <span style={{fontSize: 13, color: P.mute}}>{room === 'committee' ? '7 members · 3 agents · private' : '60 residents · concierge'}</span>
          {!compact && <span style={{marginLeft: 'auto', display: 'flex', gap: 14, color: P.mute, fontSize: 15}}><span>☆</span><span>⚲</span><span>ⓘ</span></span>}
        </div>
        <div style={{flex: 1, display: 'flex', minHeight: 0}}>
          <div style={{flex: 1, position: 'relative', overflow: 'hidden', minWidth: 0}}>
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, transform: `translateY(${lift}px)`, paddingBottom: 8}}>
              {shown.map((m, i) => <Row key={i} m={m} focus={focusOn && m.at === focus} dimmed={focusOn && m.at !== focus} />)}
            </div>
            <div style={{position: 'absolute', right: 4, top: 10, bottom: 10, width: 6, borderRadius: 3, background: 'rgba(27,24,19,0.05)'}}><div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: '38%', borderRadius: 3, background: 'rgba(27,24,19,0.18)'}} /></div>
          </div>
          {panel && <div style={{width: 400, borderLeft: `1px solid ${P.line}`, background: '#FAF7F0', flexShrink: 0, position: 'relative', overflow: 'hidden'}}>{panel}</div>}
        </div>
        <div style={{height: 22, padding: '0 26px', fontSize: 13, color: P.mute, fontStyle: 'italic', flexShrink: 0}}>
          {working ? `${PEOPLE[working.who].name} is typing${'...'.slice(0, 1 + (Math.floor(f / 8) % 3))}` : ''}
        </div>
        <div style={{margin: '0 20px 18px', borderRadius: 12, border: `1.5px solid ${t ? P.indigo : P.line}`, background: '#FBF9F4', boxShadow: t ? `0 0 0 4px ${P.indigo}1a` : 'none', flexShrink: 0}}>
          <div style={{height: 50, display: 'flex', alignItems: 'center', padding: '0 16px', fontSize: 18}}>
            {t ? <span><Rich text={typed} /><span style={{opacity: f % 20 < 10 ? 1 : 0, color: P.indigo}}>|</span></span> : <span style={{color: P.mute}}>Message {room}</span>}
          </div>
          <div style={{height: 36, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 14, fontSize: 14, color: P.mute, borderTop: `1px solid ${P.line}`}}>
            <b>B</b><i>I</i><span style={{textDecoration: 'line-through'}}>S</span><span style={{fontFamily: MONO}}>{'<>'}</span><span>@</span><span>☺</span><span>⎘</span>
            <div style={{marginLeft: 'auto', width: 30, height: 26, borderRadius: 7, background: t ? P.indigo : 'rgba(27,24,19,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: P.card, fontWeight: 800, fontSize: 14}}>➤</div>
          </div>
        </div>
      </div>
      {msgs.filter((m) => m.at > 0).map((m, i) => (
        <Sfx key={i} at={m.at} name={m.text.startsWith('REFUSED') || m.policy ? 'thud' : m.text.startsWith('OK booked') || m.text.includes('passed') ? 'chime' : 'pop'} volume={m.policy || m.text.startsWith('REFUSED') ? 0.7 : 0.3} />
      ))}
    </div>
  );
};

// ---------- side panel primitives (live inside the chat window)
export const PanelHead: React.FC<{title: string; sub?: string; accent?: string}> = ({title, sub, accent = P.indigo}) => (
  <div style={{padding: '18px 22px 14px', borderBottom: `1px solid ${P.line}`}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 8, fontFamily: MONO, fontSize: 12, letterSpacing: 2, color: accent}}><span style={{width: 8, height: 8, borderRadius: 4, background: accent}} />{title}</div>
    {sub && <div style={{fontSize: 15, color: P.mute, marginTop: 4}}>{sub}</div>}
  </div>
);
export const Tick: React.FC<{at: number; label: string; detail: string; color?: string}> = ({at, label, detail, color = P.green}) => {
  const f = useCurrentFrame();
  const s = useSpr(at, {damping: 11, stiffness: 220});
  const on = f >= at;
  return (
    <div style={{display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 22px', borderBottom: `1px solid ${P.line}`}}>
      <div style={{width: 30, height: 30, borderRadius: 15, border: `2px solid ${on ? color : P.line}`, background: on ? color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${on ? 0.7 + 0.3 * s : 1})`, flexShrink: 0, marginTop: 2}}>
        {on && <svg width={16} height={16} viewBox="0 0 20 20" fill="none" stroke={P.card} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 10l4 4 8-9" /></svg>}
      </div>
      <div>
        <div style={{fontSize: 18, fontWeight: 600, opacity: on ? 1 : 0.45}}>{label}</div>
        <div style={{fontSize: 14, color: P.mute, fontFamily: MONO, marginTop: 2}}>{detail}</div>
      </div>
      <span style={{marginLeft: 'auto', fontFamily: MONO, fontSize: 11, letterSpacing: 1, color: on ? color : P.mute, marginTop: 8}}>{on ? 'PASS' : 'WAIT'}</span>
    </div>
  );
};

// ---------- code editor window body
export const Code: React.FC<{text: string; chars?: number; hl?: (t: string) => React.ReactNode; file: string}> = ({text, chars, hl, file}) => {
  const shown = chars === undefined ? text : text.slice(0, chars);
  const lines = shown.split('\n');
  return (
    <div style={{position: 'absolute', inset: 0, display: 'flex', fontFamily: MONO, fontSize: 19, lineHeight: 1.65}}>
      <div style={{width: 200, background: '#F5F1E8', borderRight: `1px solid ${P.line}`, padding: '14px 0', fontSize: 14, color: P.ink2}}>
        <div style={{padding: '4px 16px', fontFamily: TEXT, fontWeight: 700, letterSpacing: 1, fontSize: 12, color: P.mute}}>EXPLORER</div>
        {['switch/', `  ${file}`, 'rules/', '  payment.py', '  quorum.py', 'ledger.md', 'minutes.md'].map((l) => (
          <div key={l} style={{padding: '3px 16px', whiteSpace: 'pre', background: l.trim() === file ? `${P.indigo}14` : 'transparent', color: l.trim() === file ? P.indigo : P.ink2}}>{l}</div>
        ))}
      </div>
      <div style={{flex: 1, padding: '14px 0', overflow: 'hidden'}}>
        {text.split('\n').map((_, i) => (
          <div key={i} style={{display: 'flex'}}>
            <span style={{width: 56, textAlign: 'right', paddingRight: 18, color: P.mute, fontSize: 15, userSelect: 'none', flexShrink: 0}}>{i + 1}</span>
            <span style={{whiteSpace: 'pre', color: P.ink2}}>{i < lines.length ? (hl ? hl(lines[i]) : lines[i]) : ''}{i === lines.length - 1 && chars !== undefined && chars < text.length ? <span style={{color: P.indigo}}>▍</span> : null}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------- phone
export const Phone: React.FC<{x: number; y: number; children: React.ReactNode; at?: number}> = ({x, y, children, at = -100}) => {
  const f = useCurrentFrame();
  const p = ramp(f, at, at + 30);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 430, height: 880, borderRadius: 58, background: '#1B1813', padding: 12, boxShadow: '0 50px 120px rgba(27,24,19,0.4)', opacity: p, transform: `translateY(${(1 - p) * 60}px)`}}>
      <div style={{width: '100%', height: '100%', borderRadius: 48, background: P.card, overflow: 'hidden', position: 'relative'}}>
        <div style={{height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', fontSize: 15, fontWeight: 600, fontFamily: TEXT}}><span>11:04</span><span>●●● ᯤ ▮</span></div>
        <div style={{position: 'absolute', left: '50%', top: 12, width: 120, height: 32, marginLeft: -60, borderRadius: 16, background: '#1B1813'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 54, bottom: 0}}>{children}</div>
      </div>
    </div>
  );
};
