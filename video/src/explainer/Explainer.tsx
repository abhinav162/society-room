import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Avatar, Backdrop, C, Check, DockedHeadline, fade, MONO, PEOPLE, SANS, Sfx, useSpring, Who, Words} from '../launch/kit';
import {Ask, End, Hook, Layers, Limit, Live, Meeting, Refuse, Reveal, Template} from '../launch/Launch';
import durations from './durations.json';
import {schedule} from './schedule.mjs';

type T = Record<string, number>;
type P = {t: T; len: number};
const D = durations as Record<string, number>;
const end = (t: T, id: string) => t[id] + Math.ceil(D[id] * 30);

export const PLAN = schedule(D);
export const EXPLAINER_FRAMES = PLAN.reduce((a, b) => a + b.len, 0);

const Center: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', fontFamily: SANS, color: C.text, ...style}}>{children}</AbsoluteFill>
);

// ---------- why 1: societies skyline, then the volunteers who are liable
const BUILDINGS = [
  {x: 120, w: 190, h: 330}, {x: 330, w: 150, h: 430}, {x: 500, w: 220, h: 290}, {x: 740, w: 170, h: 470},
  {x: 930, w: 240, h: 360}, {x: 1190, w: 160, h: 420}, {x: 1370, w: 210, h: 310}, {x: 1600, w: 200, h: 400},
];
const Societies: React.FC<P> = ({t}) => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [t.w1 + 10, t.w1 + 120], [0, 115172], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (x) => 1 - (1 - x) ** 3}));
  const lit = fade(f, t.w1, t.w1 + 200);
  const vol = fade(f, t.w2 - 5, t.w2 + 15);
  const pop = [useSpring(t.w2), useSpring(t.w2 + 6), useSpring(t.w2 + 12)];
  let seed = 3;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  return (
    <AbsoluteFill>
      <Backdrop glow={C.warn} />
      <AbsoluteFill style={{opacity: 1 - vol * 0.85}}>
        <svg width={1920} height={1080} style={{position: 'absolute'}}>
          {BUILDINGS.map((b, i) => {
            const rise = interpolate(f, [i * 3, i * 3 + 30], [b.h, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (x) => 1 - (1 - x) ** 3});
            const y = 1080 - b.h + rise;
            const cols = Math.floor((b.w - 30) / 34), rows = Math.floor((b.h - 50) / 44);
            return (
              <g key={i}>
                <rect x={b.x} y={y} width={b.w} height={b.h} rx={6} fill="#12151C" stroke="rgba(255,255,255,0.07)" />
                {Array.from({length: rows * cols}, (_, k) => {
                  const on = rnd() < lit * 0.85;
                  return <rect key={k} x={b.x + 18 + (k % cols) * 34} y={y + 30 + Math.floor(k / cols) * 44} width={18} height={24} rx={3} fill={on ? '#FBBF24' : 'rgba(255,255,255,0.05)'} opacity={on ? 0.75 : 1} />;
                })}
              </g>
            );
          })}
        </svg>
        <div style={{position: 'absolute', top: 140, width: '100%', textAlign: 'center', fontFamily: SANS, color: C.text}}>
          <div style={{fontSize: 170, fontWeight: 800, letterSpacing: -7, fontVariantNumeric: 'tabular-nums'}}>{n.toLocaleString('en-IN')}</div>
          <div style={{fontSize: 36, color: '#C5CAD4', opacity: fade(f, t.w1 + 40, t.w1 + 60)}}>co-operative housing societies in Maharashtra</div>
        </div>
      </AbsoluteFill>
      {f >= t.w2 - 5 && (
        <Center style={{flexDirection: 'column', gap: 40}}>
          <div style={{display: 'flex', gap: 40}}>
            {['Chairman', 'Secretary', 'Treasurer'].map((r, i) => {
              const s = pop[i];
              return (
                <div key={r} style={{width: 300, padding: 30, borderRadius: 24, background: C.panel, border: `1px solid ${C.line}`, textAlign: 'center', opacity: s, transform: `translateY(${(1 - s) * 40}px)`}}>
                  <svg width={90} height={90} viewBox="0 0 90 90"><circle cx={45} cy={30} r={18} fill="#8B93A3" /><path d="M12 84c4-22 18-32 33-32s29 10 33 32z" fill="#8B93A3" /></svg>
                  <div style={{fontSize: 30, fontWeight: 700, marginTop: 10}}>{r}</div>
                  <div style={{fontSize: 20, color: C.muted, marginTop: 4}}>Unpaid volunteer</div>
                </div>
              );
            })}
          </div>
          <div style={{display: 'flex', gap: 24, opacity: fade(f, t.w2 + 60, t.w2 + 75)}}>
            <div style={{fontSize: 34, padding: '14px 30px', borderRadius: 16, background: `${C.warn}1c`, border: `1px solid ${C.warn}66`, color: C.warn, fontWeight: 700}}>Sign off on lakhs of rupees</div>
            <div style={{fontSize: 34, padding: '14px 30px', borderRadius: 16, background: `${C.bad}1c`, border: `1px solid ${C.bad}66`, color: C.bad, fontWeight: 700, opacity: fade(f, t.w2 + 110, t.w2 + 125)}}>Personally liable</div>
          </div>
        </Center>
      )}
    </AbsoluteFill>
  );
};

// ---------- why 2: an illustrative registrar order, stamped
const Registrar: React.FC<P> = ({t}) => {
  const f = useCurrentFrame();
  const paper = useSpring(t.w3 - 6, {damping: 18, stiffness: 120});
  const at = t.w3 + 70;
  const stamp = useSpring(at, {damping: 9, stiffness: 220});
  return (
    <AbsoluteFill>
      <Backdrop glow={C.bad} />
      <Center>
        <div style={{width: 880, height: 820, background: '#F4F1EA', borderRadius: 10, padding: '60px 70px', color: '#2A2A2A', fontFamily: SANS, transform: `rotate(-2deg) translateY(${(1 - paper) * 300}px)`, opacity: paper, boxShadow: '0 40px 120px rgba(0,0,0,0.6)', position: 'relative'}}>
          <div style={{textAlign: 'center', fontSize: 20, letterSpacing: 3, color: '#555'}}>OFFICE OF THE REGISTRAR, CO-OPERATIVE SOCIETIES</div>
          <div style={{textAlign: 'center', fontSize: 52, fontWeight: 800, margin: '24px 0 30px', letterSpacing: 6}}>ORDER</div>
          <div style={{fontSize: 26, lineHeight: 1.6}}>
            The managing committee of <span style={{background: '#ddd', color: 'transparent'}}>__________ CHS Ltd.</span> is hereby <b>dissolved</b>.
          </div>
          <div style={{fontSize: 26, lineHeight: 1.6, marginTop: 16}}>Reason: accounts, minutes and resolutions for the expenditure were not produced.</div>
          {[0.95, 0.88, 0.92, 0.6, 0.9, 0.75].map((w, i) => <div key={i} style={{height: 14, width: `${w * 100}%`, background: '#D9D4C8', borderRadius: 7, marginTop: 22}} />)}
          <div style={{position: 'absolute', right: 80, bottom: 70, fontSize: 20, color: '#666'}}>Illustration</div>
          {f >= at && (
            <div style={{position: 'absolute', left: 170, top: 330, transform: `rotate(-14deg) scale(${2.2 - 1.2 * stamp})`, opacity: Math.min(1, stamp * 1.4), border: '8px solid #D7263D', color: '#D7263D', padding: '10px 36px', fontSize: 92, fontWeight: 900, letterSpacing: 8, borderRadius: 14, mixBlendMode: 'multiply'}}>
              DISSOLVED
            </div>
          )}
        </div>
      </Center>
      <Sfx at={at} name="thud" volume={0.9} />
    </AbsoluteFill>
  );
};

// ---------- why 3: what apps log vs what nobody checks
const Gap: React.FC<P> = ({t}) => {
  const f = useCurrentFrame();
  const rows: [string, string][] = [['Lift AMC · ₹68,000', 'Approved by Treasurer'], ['Repainting · ₹4,00,000', 'Approved by Secretary'], ['Water tank · ₹1,20,000', 'Approved by Chairman']];
  const qs = ['Was there a quorate vote?', 'Is it within the bye-law limit?', 'Is the invoice on file?'];
  return (
    <AbsoluteFill>
      <Backdrop />
      <div style={{position: 'absolute', left: 120, top: 150, width: 800, fontFamily: SANS, color: C.text}}>
        <div style={{fontFamily: MONO, fontSize: 22, letterSpacing: 4, color: C.muted, marginBottom: 24, opacity: fade(f, t.w4, t.w4 + 12)}}>WHAT SOCIETY APPS RECORD</div>
        {rows.map(([a, b], i) => {
          const s = useSpring(t.w4 + 10 + i * 10);
          return (
            <div key={a} style={{display: 'flex', alignItems: 'center', gap: 20, padding: '26px 28px', marginBottom: 16, background: C.panel, border: `1px solid ${C.line}`, borderRadius: 18, opacity: s, transform: `translateX(${(1 - s) * -60}px)`}}>
              <div style={{flex: 1}}>
                <div style={{fontSize: 30, fontWeight: 700}}>{a}</div>
                <div style={{fontSize: 22, color: C.muted}}>{b}</div>
              </div>
              <div style={{fontSize: 22, fontWeight: 700, color: C.ok, background: `${C.ok}1c`, padding: '8px 16px', borderRadius: 10}}>✓ APPROVED</div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 1000, top: 150, width: 800, fontFamily: SANS, color: C.text}}>
        <div style={{fontFamily: MONO, fontSize: 22, letterSpacing: 4, color: C.warn, marginBottom: 24, opacity: fade(f, t.w4b, t.w4b + 12)}}>WHAT NOBODY CHECKS</div>
        {qs.map((q, i) => {
          const s = useSpring(t.w4b + 25 + i * 18);
          return (
            <div key={q} style={{display: 'flex', alignItems: 'center', gap: 20, padding: '30px 28px', marginBottom: 16, border: `2px dashed ${C.warn}66`, borderRadius: 18, opacity: s, transform: `translateX(${(1 - s) * 60}px)`}}>
              <div style={{flex: 1, fontSize: 30, fontWeight: 600}}>{q}</div>
              <div style={{fontSize: 44, fontWeight: 800, color: C.warn}}>?</div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', bottom: 110, width: '100%', textAlign: 'center'}}>
        {f >= t.w4b + 90 && <Words text="Who approved ≠ allowed to approve." at={t.w4b + 90} size={60} />}
      </div>
    </AbsoluteFill>
  );
};

// ---------- benefits 1: three things must be true
const Checks: React.FC<P> = ({t}) => {
  const f = useCurrentFrame();
  const rel = fade(f, end(t, 'b4'), end(t, 'b4') + 15);
  return (
    <AbsoluteFill>
      <Backdrop glow={C.ok} />
      <DockedHeadline kicker="The rule Society Room enforces" text="Money moves only when three things are true." dockAt={t.b1 + 60} />
      {f >= t.b1 + 70 && (
        <div style={{position: 'absolute', left: 470, top: 260, width: 980, fontFamily: SANS, color: C.text, transform: 'scale(1.4)', transformOrigin: '50% 0'}}>
          <Check at={t.b2} label="There is an invoice" detail="INV-068 · Sahyadri Lifts · ₹68,000" />
          <Check at={t.b3 + 20} label="A quorate meeting voted for it, by name" detail="41 present, 20 needed · R-001 passed 4–1" />
          <Check at={t.b4 + 30} label="It is within the bye-law limit" detail="bye-law 156: ₹1,00,000 for 51+ members" />
          <div style={{marginTop: 30, fontSize: 34, fontWeight: 800, color: C.ok, opacity: rel, transform: `translateY(${(1 - rel) * 20}px)`}}>→ Only then is the payment booked.</div>
          <Sfx at={t.b2} name="pop" volume={0.4} />
          <Sfx at={t.b3 + 20} name="pop" volume={0.4} />
          <Sfx at={t.b4 + 30} name="chime" volume={0.4} />
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- benefits 2: who it helps
const Shield = ({c}: {c: string}) => (
  <svg width={84} height={84} viewBox="0 0 84 84"><path d="M42 6l30 11v22c0 20-13 32-30 39C25 71 12 59 12 39V17z" fill={`${c}33`} stroke={c} strokeWidth={4} /><path d="M29 42l9 9 18-19" fill="none" stroke={c} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Bubble = ({c}: {c: string}) => (
  <svg width={84} height={84} viewBox="0 0 84 84"><path d="M12 16h60v40H40L24 70V56H12z" fill={`${c}33`} stroke={c} strokeWidth={4} strokeLinejoin="round" /><path d="M26 32h32M26 42h20" stroke={c} strokeWidth={5} strokeLinecap="round" /></svg>
);
const Chain = ({c, f}: {c: string; f: number}) => (
  <svg width={300} height={84} viewBox="0 0 300 84">
    {[0, 1, 2].map((i) => (
      <g key={i} opacity={fade(f, i * 10, i * 10 + 10)}>
        <rect x={6 + i * 100} y={14} width={78} height={56} rx={10} fill={`${c}26`} stroke={c} strokeWidth={3} />
        <text x={45 + i * 100} y={48} fill={c} fontFamily={MONO} fontSize={17} textAnchor="middle">R-00{i + 1}</text>
        {i < 2 && <path d={`M${84 + i * 100} 42h22`} stroke={c} strokeWidth={4} />}
      </g>
    ))}
  </svg>
);
const Personas: React.FC<P> = ({t}) => {
  const f = useCurrentFrame();
  const cards: [number, React.ReactNode, string, string, string][] = [
    [t.b5, <Shield c={C.brand} />, 'Committee', 'Protected: every payment is backed by a recorded resolution.', C.brand],
    [t.b5 + 60, <Bubble c="#22D3EE" />, 'Residents', 'Ask in chat. Answers come straight from the published records.', '#22D3EE'],
    [t.b6, <Chain c={C.ok} f={f - t.b6 - 10} />, 'Auditor', 'A tamper-evident, hash-chained ledger, ready to sign.', C.ok],
  ];
  return (
    <AbsoluteFill>
      <Backdrop />
      <DockedHeadline kicker="Who it helps" text="Protection, trust and a clean audit." dockAt={20} />
      <div style={{position: 'absolute', left: 100, top: 300, width: 1720, display: 'flex', gap: 40, fontFamily: SANS, color: C.text}}>
        {cards.map(([at, icon, who, what, col]) => {
          const s = useSpring(at);
          return (
            <div key={who} style={{flex: 1, height: 480, padding: 44, borderRadius: 28, background: C.panel, border: `1px solid ${col}55`, boxShadow: `0 0 80px ${col}1a`, opacity: f >= at ? s : 0, transform: `translateY(${(1 - s) * 60}px)`}}>
              <div style={{height: 100}}>{icon}</div>
              <div style={{fontSize: 46, fontWeight: 800, marginTop: 30}}>{who}</div>
              <div style={{fontSize: 30, color: '#C5CAD4', marginTop: 16, lineHeight: 1.4}}>{what}</div>
              <Sfx at={at} name="pop" volume={0.35} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- switch 1: chat apps -> Switch -> agents
const APPS = ['Slack', 'Microsoft Teams', 'Discord', 'Mattermost'];
const AGENTS: Who[] = ['clerk', 'treasurer', 'byelaw', 'concierge'];
const Hub: React.FC<P> = ({t}) => {
  const f = useCurrentFrame();
  const hub = useSpring(t.s1 + 10, {damping: 12, stiffness: 140});
  const y = (i: number) => 330 + i * 150;
  return (
    <AbsoluteFill>
      <Backdrop />
      <DockedHeadline kicker="Built on Switch" text="Switch puts AI agents into your team chat." dockAt={t.s1 + 10} />
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        {[0, 1, 2, 3].map((i) => (
          <g key={i} opacity={fade(f, t.s1 + 20, t.s1 + 35)}>
            <path d={`M520 ${y(i) + 45} C 700 ${y(i) + 45}, 760 600, 900 600`} stroke={C.brand} strokeOpacity={0.5} strokeWidth={3} fill="none" strokeDasharray="10 12" strokeDashoffset={-f * 2} />
            <path d={`M1020 600 C 1160 600, 1220 ${y(i) + 45}, 1400 ${y(i) + 45}`} stroke={C.ok} strokeOpacity={0.5} strokeWidth={3} fill="none" strokeDasharray="10 12" strokeDashoffset={-f * 2} />
          </g>
        ))}
      </svg>
      {APPS.map((a, i) => {
        const s = useSpring(t.s1 + 14 + i * 4);
        return <div key={a} style={{position: 'absolute', left: 200, top: y(i), width: 320, height: 90, borderRadius: 18, background: C.panel, border: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontSize: 30, fontWeight: 600, color: C.text, opacity: s, transform: `translateX(${(1 - s) * -40}px)`}}>{a}</div>;
      })}
      <div style={{position: 'absolute', left: 860, top: 500, width: 200, height: 200, borderRadius: 48, background: `linear-gradient(140deg, ${C.brand}, #4F5BD5)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontSize: 40, fontWeight: 800, color: '#fff', transform: `scale(${hub})`, boxShadow: `0 0 120px ${C.brand}88`}}>Switch</div>
      {AGENTS.map((a, i) => {
        const s = useSpring(t.s1 + 24 + i * 4);
        return (
          <div key={a} style={{position: 'absolute', left: 1400, top: y(i), width: 340, height: 90, borderRadius: 18, background: C.panel, border: `1px solid ${PEOPLE[a].color}55`, display: 'flex', alignItems: 'center', gap: 18, padding: '0 22px', fontFamily: SANS, fontSize: 28, fontWeight: 600, color: C.text, opacity: s, transform: `translateX(${(1 - s) * 40}px)`}}>
            <Avatar who={a} size={50} /> {PEOPLE[a].name}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- switch 2: the owner passes, a non-owner is stopped at Switch
const Lane: React.FC<{y: number; who: Who; text: string; at: number; pass: boolean}> = ({y, who, text, at, pass}) => {
  const f = useCurrentFrame();
  const stop = 500;
  const x = pass
    ? interpolate(f, [at, at + 45, at + 90], [380, 800, 1260], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
    : interpolate(f, [at, at + 40, at + 52], [380, stop, stop - 40], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const hit = f >= at + 40;
  const col = pass ? C.ok : C.bad;
  return (
    <>
      <div style={{position: 'absolute', left: 110, top: y - 50, width: 260, display: 'flex', alignItems: 'center', gap: 16, fontFamily: SANS, color: C.text}}>
        <Avatar who={who} size={64} />
        <div><div style={{fontSize: 26, fontWeight: 700}}>{PEOPLE[who].name}</div><div style={{fontSize: 19, color: C.muted}}>{pass ? 'agent owner' : 'not the owner'}</div></div>
      </div>
      {f >= at && (
        <div style={{position: 'absolute', left: x, top: y - 32, padding: '14px 22px', borderRadius: 16, background: hit ? `${col}22` : C.panel2, border: `1px solid ${hit ? col : C.line}`, fontFamily: SANS, fontSize: 22, color: C.text, whiteSpace: 'nowrap', opacity: pass && f > at + 88 ? 0 : 1}}>{text}</div>
      )}
      {hit && (
        <div style={{position: 'absolute', left: 440, top: y + 44, fontFamily: MONO, fontSize: 22, fontWeight: 600, color: col, opacity: fade(f, at + 40, at + 50)}}>
          {pass ? '' : '✕ blocked by Switch'}
        </div>
      )}
      <Sfx at={at + 40} name={pass ? 'pop' : 'thud'} volume={pass ? 0.4 : 0.9} />
    </>
  );
};
const Gate: React.FC<P> = ({t}) => {
  const f = useCurrentFrame();
  const glow = fade(f, t.s4 + 100, t.s4 + 110) * (1 - fade(f, t.s4 + 150, t.s4 + 170));
  return (
    <AbsoluteFill>
      <Backdrop />
      <DockedHeadline kicker="Who may instruct an agent" text="Switch checks the sender before the agent runs." dockAt={10} />
      <div style={{position: 'absolute', left: 840, top: 260, width: 160, height: 620, borderRadius: 30, background: `${C.brand}14`, border: `2px solid ${C.brand}88`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, fontFamily: SANS, color: C.text}}>
        <div style={{fontSize: 60}}>⛨</div>
        <div style={{fontSize: 28, fontWeight: 800}}>Switch</div>
        <div style={{fontFamily: MONO, fontSize: 15, color: C.muted, textAlign: 'center'}}>addressing:<br />owner</div>
      </div>
      <div style={{position: 'absolute', left: 1420, top: 470, width: 420, padding: 26, borderRadius: 22, background: C.panel, border: `2px solid ${glow > 0 ? C.ok : C.line}`, boxShadow: `0 0 ${80 * glow}px ${C.ok}`, display: 'flex', alignItems: 'center', gap: 18, fontFamily: SANS, color: C.text}}>
        <Avatar who="treasurer" size={64} />
        <div><div style={{fontSize: 28, fontWeight: 700}}>Treasurer Agent</div><div style={{fontSize: 18, color: C.muted}}>runs the rules engine</div></div>
      </div>
      <Lane y={420} who="rohan" text="@treasurer-agent book INV-068" at={t.s4 + 20} pass />
      <Lane y={740} who="karan" text="@treasurer-agent just pay it" at={t.s5 + 40} pass={false} />
    </AbsoluteFill>
  );
};

// ---------- closing principle
const Principle: React.FC<P> = ({t}) => (
  <AbsoluteFill>
    <Backdrop />
    <Center style={{flexDirection: 'column', gap: 40}}>
      <Words text="Switch decides who may give instructions." at={t.c1} size={78} />
      <Words text="The code decides what is allowed." at={t.c1b} size={78} color={C.ok} />
    </Center>
  </AbsoluteFill>
);

const SCENE: Record<string, React.FC<P>> = {
  societies: Societies, registrar: Registrar, gap: Gap, reveal: Reveal, checks: Checks, personas: Personas, hub: Hub,
  template: Template, gate: Gate, layers: Layers, live: Live, hook: Hook, refuse: Refuse, limit: Limit, ask: Ask, principle: Principle, end: End,
  meeting: ({t, len}) => (
    <Meeting T={{open: t.d4 + 30, quorum: t.d5 + 20, vote: t.d6 - 20, passed: t.d6 + 50, close: t.d6 + 100, check: t.d7 - 20, checked: t.d7 + 40, book: t.d8 - 30, booked: t.d8 + 20, end: len}} />
  ),
};

export const Explainer: React.FC = () => {
  const total = EXPLAINER_FRAMES;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Audio src={staticFile('launch/music-explainer.wav')} volume={(x) => 0.16 * interpolate(x, [total - 60, total], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
      {PLAN.map((b) => {
        const S = SCENE[b.id];
        return (
          <Sequence key={b.id} from={b.from} durationInFrames={b.len}>
            <SceneFade d={b.len}><S t={b.t} len={b.len} /></SceneFade>
            {Object.entries(b.t as T).map(([id, at]) => (
              <Sequence key={id} from={at} layout="none">
                <Audio src={staticFile(`explainer/${id}.wav`)} volume={1} />
              </Sequence>
            ))}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const SceneFade: React.FC<{d: number; children: React.ReactNode}> = ({d, children}) => {
  const f = useCurrentFrame();
  const o = Math.min(fade(f, 0, 8), 1 - fade(f, d - 8, d));
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};
