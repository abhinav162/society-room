import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import durations from '../explainer/durations.json';
import {schedule} from '../explainer/schedule.mjs';
import {Avatar, Camera, Card, Chapter, Chat, Check, DISPLAY, EIO, Head, Icon, Line, MONO, Msg, P, Paper, PEOPLE, ramp, Rise, Sfx, Side, Stamp, TEXT, useSpr, Who, Wipe} from './kit';

type T = Record<string, number>;
type S = {t: T; len: number};
const D = durations as Record<string, number>;
const end = (t: T, id: string) => t[id] + Math.ceil(D[id] * 30);

export const PLAN = schedule(D);
export const EXPLAINER_V2_FRAMES = PLAN.reduce((a, b) => a + b.len, 0);

const Center: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', fontFamily: TEXT, color: P.ink, ...style}}>{children}</AbsoluteFill>
);

// ---------- 01 the problem: a rolling census number, then the volunteers who carry it
const Counter: React.FC<{value: number; size: number}> = ({value, size}) => (
  <div style={{fontFamily: DISPLAY, fontWeight: 600, fontSize: size, letterSpacing: -size * 0.04, lineHeight: 1, color: P.ink, fontVariantNumeric: 'tabular-nums'}}>{Math.floor(value).toLocaleString('en-IN')}</div>
);
const Society = ({x, y, h, on, w = 44}: {x: number; y: number; h: number; on: number; w?: number}) => (
  <g opacity={on} transform={`translate(${x} ${y - h * on}) scale(1 ${on})`}>
    <rect width={w} height={h} fill={P.ink} rx={2} />
    {Array.from({length: Math.floor((h - 8) / 14)}, (_, r) => [0, 1].map((c) => <rect key={r * 2 + c} x={9 + c * 18} y={8 + r * 14} width={8} height={8} fill={P.paper} opacity={0.75} />))}
  </g>
);
const Societies: React.FC<S> = ({t}) => {
  const f = useCurrentFrame();
  const n = interpolate(f, [t.w1 + 6, t.w1 + 150], [0, 115172], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (x) => 1 - (1 - x) ** 4});
  const swap = ramp(f, t.w2 - 10, t.w2 + 16, EIO);
  let seed = 11;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  const cols = 32;
  return (
    <AbsoluteFill>
      <Paper tint={P.amber} />
      <Chapter n="01" title="The problem" />
      <AbsoluteFill style={{opacity: 1 - swap, transform: `translateY(${-swap * 80}px)`}}>
        <div style={{position: 'absolute', left: 80, top: 250}}>
          <Counter value={n} size={300} />
          <div style={{marginTop: 26, display: 'flex', alignItems: 'baseline', gap: 18}}>
            <Line at={t.w1 + 30} size={44} color={P.ink}><span style={{fontFamily: DISPLAY, fontStyle: 'italic'}}>co-operative housing societies</span></Line>
            <Line at={t.w1 + 48} size={28} color={P.mute}>in Maharashtra · run by unpaid volunteers</Line>
          </div>
        </div>
        <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
          {Array.from({length: cols * 3}, (_, i) => {
            const c = i % cols, r = Math.floor(i / cols);
            const h = 50 + rnd() * 70;
            const on = ramp(f, t.w1 + 20 + c * 2.2 + r * 24, t.w1 + 40 + c * 2.2 + r * 24);
            return <Society key={i} x={80 + c * 56} y={1020 - r * 0} h={h * (1 - r * 0.25)} on={on * (r === 0 ? 1 : 0.35 - r * 0.1)} />;
          })}
        </svg>
      </AbsoluteFill>
      {f >= t.w2 - 10 && (
        <AbsoluteFill style={{opacity: swap}}>
          <div style={{position: 'absolute', left: 80, top: 190, width: 1760}}>
            <Head text="Unpaid volunteers sign off on *lakhs* of rupees." at={t.w2} size={84} align="left" />
          </div>
          <div style={{position: 'absolute', left: 80, top: 470, display: 'flex', gap: 28}}>
            {['Chairman', 'Secretary', 'Treasurer'].map((r, i) => (
              <Rise key={r} at={t.w2 + 20 + i * 8}>
                <Card style={{width: 400, padding: '34px 34px 30px', display: 'flex', gap: 22, alignItems: 'center'}}>
                  <div style={{width: 92, height: 92, borderRadius: 46, background: '#EFE8DA', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icon.person size={54} color={P.ink2} /></div>
                  <div>
                    <div style={{fontFamily: DISPLAY, fontSize: 36, fontWeight: 600}}>{r}</div>
                    <div style={{fontFamily: MONO, fontSize: 16, color: P.mute, letterSpacing: 1, marginTop: 4}}>UNPAID · VOLUNTEER</div>
                  </div>
                </Card>
              </Rise>
            ))}
          </div>
          <div style={{position: 'absolute', left: 80, top: 700, width: 1256}}>
            <Line at={t.w2 + 70} size={34} color={P.ink2}>Every signature is <b style={{color: P.ink}}>their own</b> name on <b style={{color: P.ink}}>the society's</b> money.</Line>
          </div>
          <Stamp at={t.w2 + 118} text="PERSONALLY LIABLE" size={78} rotate={-6} style={{left: 1180, top: 420}} />
          <Sfx at={t.w2 + 118} name="thud" volume={0.8} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ---------- 02 the registrar's order (an illustration)
const Registrar: React.FC<S> = ({t}) => {
  const f = useCurrentFrame();
  const p = ramp(f, t.w3 - 6, t.w3 + 30);
  const at = t.w3 + 62;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: P.red}} />
      <Chapter n="02" title="The registrar" dark />
      <div style={{position: 'absolute', right: 80, top: 54, fontFamily: MONO, fontSize: 16, letterSpacing: 2, color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.4)', padding: '6px 14px', borderRadius: 20}}>ILLUSTRATION · NO REAL SOCIETY OR OFFICE</div>
      <div style={{position: 'absolute', left: 80, top: 300, width: 620, color: P.card}}>
        <Head text="No recorded resolution? The committee is *dissolved.*" at={t.w3} size={76} align="left" color={P.card} accent="#FFD9A8" />
      </div>
      <Center>
        <div style={{position: 'absolute', left: 860, width: 900, height: 760, top: 160, background: P.card, borderRadius: 6, padding: '56px 64px', color: P.ink, fontFamily: TEXT, transform: `rotate(${-3 + p * 1}deg) translateY(${(1 - p) * 400}px)`, opacity: p, boxShadow: '0 50px 120px rgba(60,10,0,0.45)'}}>
          <div style={{textAlign: 'center', fontFamily: MONO, fontSize: 17, letterSpacing: 3, color: P.mute}}>OFFICE OF THE REGISTRAR · CO-OPERATIVE SOCIETIES</div>
          <div style={{textAlign: 'center', fontFamily: DISPLAY, fontSize: 56, fontWeight: 700, margin: '22px 0 26px', letterSpacing: 8}}>ORDER</div>
          <div style={{fontSize: 25, lineHeight: 1.6}}>The managing committee of <span style={{background: '#E8E2D5', color: 'transparent', borderRadius: 4}}>__________ CHS Ltd.</span> is hereby <b>dissolved</b>.</div>
          <div style={{fontSize: 25, lineHeight: 1.6, marginTop: 14}}>Reason: accounts, minutes and resolutions for the expenditure were not produced.</div>
          {[0.95, 0.88, 0.92, 0.6, 0.9, 0.75].map((w, i) => <div key={i} style={{height: 12, width: `${w * 100}%`, background: '#E8E2D5', borderRadius: 6, marginTop: 22}} />)}
          <Stamp at={at} text="DISSOLVED" size={96} rotate={-12} style={{left: 150, top: 300}} />
        </div>
      </Center>
      <Sfx at={at} name="thud" volume={0.9} />
    </AbsoluteFill>
  );
};

// ---------- 03 the gap: a ledger of what apps log vs. what nobody checks
const ROWS: [string, string, string][] = [['Lift AMC', '₹68,000', 'Treasurer'], ['Repainting', '₹4,00,000', 'Secretary'], ['Water tank', '₹1,20,000', 'Chairman']];
const QS = ['Quorate vote?', 'Within limit?', 'Invoice?'];
const Gap: React.FC<S> = ({t}) => {
  const f = useCurrentFrame();
  const cell: React.CSSProperties = {padding: '22px 26px', borderBottom: `1px solid ${P.line}`, fontSize: 27, whiteSpace: 'nowrap'};
  const th: React.CSSProperties = {...cell, fontFamily: MONO, fontSize: 15, letterSpacing: 2, color: P.mute, paddingBottom: 14};
  return (
    <AbsoluteFill>
      <Paper tint={P.red} />
      <Chapter n="03" title="The gap" />
      <div style={{position: 'absolute', left: 80, top: 150, width: 1760}}>
        <Head text="Apps record *who* approved. Nobody checks *if* they could." at={t.w4} size={66} align="left" />
      </div>
      <Rise at={t.w4 + 20} style={{position: 'absolute', left: 80, top: 400}}>
        <Card style={{overflow: 'hidden'}}>
          <table style={{borderCollapse: 'collapse', fontFamily: TEXT, color: P.ink}}>
            <thead>
              <tr>
                {['ITEM', 'AMOUNT', 'APPROVED BY'].map((h) => <th key={h} style={{...th, textAlign: 'left', background: '#F1ECE2'}}>{h}</th>)}
                {QS.map((q, i) => (
                  <th key={q} style={{...th, textAlign: 'center', background: f >= t.w4b + i * 14 ? `${P.red}10` : '#F1ECE2', color: f >= t.w4b + i * 14 ? P.red : P.mute}}>{q.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([a, b, c], r) => (
                <tr key={a} style={{opacity: ramp(f, t.w4 + 30 + r * 10, t.w4 + 45 + r * 10)}}>
                  <td style={{...cell, fontWeight: 600}}>{a}</td>
                  <td style={{...cell, fontFamily: MONO, fontSize: 24}}>{b}</td>
                  <td style={cell}><span style={{display: 'inline-flex', alignItems: 'center', gap: 10}}><span style={{width: 10, height: 10, borderRadius: 5, background: P.green}} />{c}</span></td>
                  {QS.map((q, i) => {
                    const s = ramp(f, t.w4b + 22 + i * 14 + r * 5, t.w4b + 40 + i * 14 + r * 5);
                    return <td key={q} style={{...cell, textAlign: 'center', width: 220}}><span style={{display: 'inline-block', fontFamily: DISPLAY, fontWeight: 700, fontSize: 40, color: P.red, opacity: s, transform: `translateY(${(1 - s) * -30}px)`}}>?</span></td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </Rise>
      <div style={{position: 'absolute', left: 80, top: 850, width: 1760}}>
        {f >= t.w4b + 70 && <Head text="Who approved *≠* allowed to approve." at={t.w4b + 70} size={60} align="left" accent={P.red} />}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 04 reveal
const Mark: React.FC<{size?: number}> = ({size = 120}) => (
  <div style={{width: size, height: size, borderRadius: size * 0.24, background: P.ink, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: size * 0.1, padding: size * 0.24}}>
    {[1, 0.72, 0.5].map((w, i) => <div key={i} style={{height: size * 0.09, width: `${w * 100}%`, borderRadius: size, background: i === 2 ? P.red : P.paper}} />)}
  </div>
);
const Reveal: React.FC<S> = ({t}) => {
  const f = useCurrentFrame();
  const s = useSpr(t.w5 - 8, {damping: 13, stiffness: 140});
  return (
    <AbsoluteFill>
      <Paper tint={P.green} />
      <Center style={{flexDirection: 'column', gap: 30}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 36, transform: `scale(${0.8 + 0.2 * s})`, opacity: s}}>
          <Mark size={130} />
          <Head text="Society Room" at={t.w5} size={150} weight={600} stagger={6} />
        </div>
        <Line at={t.w5 + 28} size={36} color={P.ink2} style={{textAlign: 'center'}}>
          Built to <span style={{fontFamily: DISPLAY, fontStyle: 'italic', color: P.red}}>close that gap.</span>
        </Line>
        <div style={{width: ramp(f, t.w5 + 20, t.w5 + 70) * 420, height: 3, background: P.ink, borderRadius: 2}} />
      </Center>
      <Sfx at={t.w5 - 4} name="boom" volume={0.5} />
    </AbsoluteFill>
  );
};

// ---------- 05 the rule: three things must be true
const THREE: [keyof typeof Icon, string, string, string][] = [
  ['invoice', 'There is an invoice', 'INV-068 · Sahyadri Lifts · ₹68,000', P.indigo],
  ['ballot', 'A quorate meeting voted, by name', '41 present, 20 needed · R-001 passed 4–1', P.lilac],
  ['scale', 'It is within the bye-law limit', 'bye-law 156 · ₹1,00,000 for 51+ members', P.amber],
];
const Checks: React.FC<S> = ({t}) => {
  const f = useCurrentFrame();
  const dock = ramp(f, t.b1 + 80, t.b1 + 110, EIO);
  const ats = [t.b2, t.b3 + 16, t.b4 + 22];
  const booked = end(t, 'b4') + 4;
  return (
    <AbsoluteFill>
      <Paper tint={P.green} />
      <Chapter n="04" title="The rule" />
      <div style={{position: 'absolute', left: 80, top: interpolate(dock, [0, 1], [380, 150]), width: 1760, transform: `scale(${1 - dock * 0.3})`, transformOrigin: '0 0'}}>
        <Head text="Money leaves only when *three* things are true." at={t.b1} size={82} align="left" accent={P.green} />
      </div>
      <div style={{position: 'absolute', left: 80, top: 330, display: 'flex', gap: 28}}>
        {THREE.map(([ic, label, detail, col], i) => {
          const Ic = Icon[ic];
          const on = f >= ats[i];
          const p = ramp(f, ats[i], ats[i] + 28);
          return (
            <Card key={label} accent={col} style={{width: 568, height: 520, padding: 40, opacity: 0.25 + 0.75 * p, transform: `translateY(${(1 - p) * 40}px)`}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div style={{width: 96, height: 96, borderRadius: 24, background: `${col}14`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Ic size={56} color={col} /></div>
                <div style={{fontFamily: DISPLAY, fontSize: 64, fontWeight: 600, color: `${col}66`, lineHeight: 1}}>0{i + 1}</div>
              </div>
              <div style={{fontFamily: DISPLAY, fontSize: 44, fontWeight: 600, lineHeight: 1.1, marginTop: 50, letterSpacing: -1}}>{label}</div>
              <div style={{fontFamily: MONO, fontSize: 19, color: P.mute, marginTop: 18, lineHeight: 1.5}}>{detail}</div>
              <div style={{position: 'absolute', left: 40, bottom: 34, display: 'flex', alignItems: 'center', gap: 12, fontFamily: MONO, fontSize: 16, letterSpacing: 2, color: on ? P.green : P.mute}}>
                <div style={{width: 26, height: 26, borderRadius: 13, background: on ? P.green : 'transparent', border: `2px solid ${on ? P.green : P.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  {on && <svg width={14} height={14} viewBox="0 0 20 20" fill="none" stroke={P.card} strokeWidth={3.5} strokeLinecap="round"><path d="M4 10l4 4 8-9" /></svg>}
                </div>
                {on ? 'TRUE' : 'PENDING'}
              </div>
              <Sfx at={ats[i]} name={i === 2 ? 'chime' : 'pop'} volume={0.4} />
            </Card>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 80, top: 900, width: 1200}}>
        <Line at={booked} size={40} color={P.ink}>→ Only then is the payment <b style={{color: P.green}}>booked.</b></Line>
      </div>
      <Stamp at={booked + 6} text="BOOKED" color={P.green} size={70} rotate={-7} style={{left: 1420, top: 860}} sub="INV-068 · R-001" />
    </AbsoluteFill>
  );
};

// ---------- 06 who it helps
const Personas: React.FC<S> = ({t}) => {
  const cards: [number, keyof typeof Icon, string, string, string][] = [
    [t.b5, 'shield', 'Committee', 'Protected: every payment is backed by a resolution recorded by name.', P.indigo],
    [t.b5 + 64, 'chat', 'Residents', 'Ask in chat. Answers come straight from the published records.', P.cyan],
    [t.b6, 'chain', 'Auditor', 'A tamper-evident, hash-chained ledger, ready to sign.', P.green],
  ];
  return (
    <AbsoluteFill>
      <Paper tint={P.cyan} />
      <Chapter n="05" title="Who it helps" />
      <div style={{position: 'absolute', left: 80, top: 150, width: 1760}}>
        <Head text="Protection, *trust,* and a clean audit." at={6} size={84} align="left" accent={P.cyan} />
      </div>
      <div style={{position: 'absolute', left: 80, top: 360, display: 'flex', gap: 28}}>
        {cards.map(([at, ic, who, what, col]) => {
          const Ic = Icon[ic];
          return (
            <Rise key={who} at={at}>
              <Card accent={col} style={{width: 568, height: 500, padding: 44}}>
                <div style={{width: 96, height: 96, borderRadius: 48, background: `${col}14`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Ic size={54} color={col} /></div>
                <div style={{fontFamily: DISPLAY, fontSize: 54, fontWeight: 600, marginTop: 44}}>{who}</div>
                <div style={{fontSize: 28, color: P.ink2, marginTop: 14, lineHeight: 1.45}}>{what}</div>
              </Card>
              <Sfx at={at} name="pop" volume={0.3} />
            </Rise>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 07 Switch: chat apps → Switch → agents
const APPS = ['Slack', 'Microsoft Teams', 'Discord', 'Mattermost'];
const AGENTS: Who[] = ['clerk', 'treasurer', 'byelaw', 'concierge'];
const Hub: React.FC<S> = ({t}) => {
  const f = useCurrentFrame();
  const hub = useSpr(t.s1 + 8, {damping: 12, stiffness: 150});
  const y = (i: number) => 360 + i * 150;
  const draw = ramp(f, t.s1 + 16, t.s1 + 60);
  return (
    <AbsoluteFill>
      <Paper tint={P.indigo} />
      <Chapter n="06" title="Built on Switch" />
      <div style={{position: 'absolute', left: 80, top: 150, width: 1760}}>
        <Head text="Switch puts agents *inside* the team chat." at={4} size={80} align="left" accent={P.indigo} />
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        {[0, 1, 2, 3].map((i) => (
          <g key={i} fill="none" strokeWidth={3} strokeDasharray={700} strokeDashoffset={700 * (1 - draw)} strokeLinecap="round">
            <path d={`M520 ${y(i) + 45} C 720 ${y(i) + 45}, 760 650, 880 650`} stroke={P.indigo} strokeOpacity={0.5} />
            <path d={`M1040 650 C 1160 650, 1200 ${y(i) + 45}, 1400 ${y(i) + 45}`} stroke={P.green} strokeOpacity={0.6} />
          </g>
        ))}
      </svg>
      {APPS.map((a, i) => (
        <Rise key={a} at={t.s1 + 10 + i * 4} dy={0} style={{position: 'absolute', left: 160, top: y(i)}}>
          <Card style={{width: 360, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 600}}>{a}</Card>
        </Rise>
      ))}
      <div style={{position: 'absolute', left: 850, top: 540, width: 220, height: 220, borderRadius: 54, background: P.indigo, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, color: P.card, fontFamily: DISPLAY, fontSize: 40, fontWeight: 600, transform: `scale(${hub})`, boxShadow: `0 30px 80px ${P.indigo}66`}}>
        <Icon.toggle size={70} color={P.card} />Switch
      </div>
      {AGENTS.map((a, i) => (
        <Rise key={a} at={t.s1 + 24 + i * 4} dy={0} style={{position: 'absolute', left: 1400, top: y(i)}}>
          <Card style={{width: 380, height: 90, display: 'flex', alignItems: 'center', gap: 18, padding: '0 22px', fontSize: 28, fontWeight: 600, borderLeft: `6px solid ${PEOPLE[a].color}`}}>
            <Avatar who={a} size={48} /> {PEOPLE[a].name}
          </Card>
        </Rise>
      ))}
      <Sfx at={t.s1 + 8} name="pop" volume={0.4} />
    </AbsoluteFill>
  );
};

// ---------- 08 one template
const YAML = `agents:
  - name: clerk
    addressing: owner
  - name: treasurer-agent
    addressing: owner
  - name: byelaw
    addressing: {anyone_in: [committee]}
  - name: concierge
    addressing: {anyone_in: [general_body]}
rooms: [committee, general-body]`;
const JOBS: [Who, string, string][] = [
  ['clerk', 'Opens meetings, counts quorum, records votes by name', 'owner only'],
  ['treasurer', 'Books a payment only against a passed resolution', 'owner only'],
  ['byelaw', 'Checks every spend against bye-law 156', 'anyone in committee'],
  ['concierge', 'Answers residents from the published records', 'anyone in general-body'],
];
const Template: React.FC<S> = ({t}) => {
  const f = useCurrentFrame();
  const chars = Math.round(interpolate(f, [t.s2 + 10, t.s2 + 110], [0, YAML.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  return (
    <AbsoluteFill>
      <Paper tint={P.indigo} />
      <Chapter n="07" title="One template" />
      <div style={{position: 'absolute', left: 80, top: 150, width: 1760}}>
        <Head text="One template. Two rooms. *Four* agents." at={t.s2} size={80} align="left" accent={P.indigo} />
      </div>
      <Rise at={t.s2 + 6} style={{position: 'absolute', left: 80, top: 330}}>
        <Card style={{width: 760, height: 640, overflow: 'hidden'}}>
          <div style={{height: 48, borderBottom: `1px solid ${P.line}`, display: 'flex', alignItems: 'center', padding: '0 22px', fontFamily: MONO, fontSize: 16, color: P.mute, background: '#F1ECE2'}}>switch/society-room.yaml</div>
          <pre style={{margin: 0, padding: 28, fontFamily: MONO, fontSize: 25, lineHeight: 1.6, color: P.ink2, whiteSpace: 'pre-wrap'}}>
            {YAML.slice(0, chars).split(/(owner|anyone_in)/).map((x, i) => <span key={i} style={{color: x === 'owner' ? P.green : x === 'anyone_in' ? P.amber : undefined, fontWeight: x === 'owner' || x === 'anyone_in' ? 600 : 400}}>{x}</span>)}
            <span style={{opacity: f % 16 < 8 && chars < YAML.length ? 1 : 0, color: P.indigo}}>▍</span>
          </pre>
        </Card>
      </Rise>
      <div style={{position: 'absolute', left: 880, top: 330, width: 960, display: 'flex', gap: 16, marginBottom: 18}}>
        {[['committee', 'private · 7 members', 'lock'], ['general-body', '60 residents', 'hash']].map(([r, d, ic], i) => {
          const Ic = Icon[ic as 'lock' | 'hash'];
          return (
            <Rise key={r} at={t.s2 + 40 + i * 8} style={{flex: 1}}>
              <Card style={{padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 14, borderLeft: `6px solid ${P.indigo}`}}>
                <Ic size={30} color={P.indigo} />
                <div><div style={{fontSize: 26, fontWeight: 700}}>{r}</div><div style={{fontSize: 17, color: P.mute}}>{d}</div></div>
              </Card>
            </Rise>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 880, top: 450, width: 960, display: 'flex', flexDirection: 'column', gap: 14}}>
        {JOBS.map(([who, job, rule], i) => (
          <Rise key={who} at={t.s3 + i * 14} dy={30}>
            <Card style={{display: 'flex', alignItems: 'center', gap: 20, padding: '16px 22px'}}>
              <Avatar who={who} size={56} />
              <div style={{flex: 1}}>
                <div style={{fontSize: 26, fontWeight: 700}}>{PEOPLE[who].name}</div>
                <div style={{fontSize: 19, color: P.mute}}>{job}</div>
              </div>
              <div style={{fontFamily: MONO, fontSize: 15, color: rule.includes('owner') ? P.green : P.amber, border: `1px solid ${rule.includes('owner') ? P.green : P.amber}66`, background: `${rule.includes('owner') ? P.green : P.amber}10`, padding: '6px 12px', borderRadius: 8, whiteSpace: 'nowrap'}}>{rule}</div>
            </Card>
            <Sfx at={t.s3 + i * 14} name="pop" volume={0.3} />
          </Rise>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 09 the gate: owner passes, non-owner is stopped at Switch
const Lane: React.FC<{y: number; who: Who; text: string; at: number; pass: boolean}> = ({y, who, text, at, pass}) => {
  const f = useCurrentFrame();
  const x = pass
    ? interpolate(f, [at, at + 50, at + 95], [420, 850, 1330], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EIO})
    : interpolate(f, [at, at + 42, at + 54], [420, 810, 770], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EIO});
  const hit = f >= at + 42;
  const col = pass ? P.green : P.red;
  return (
    <>
      <div style={{position: 'absolute', left: 100, top: y - 36, display: 'flex', alignItems: 'center', gap: 16, fontFamily: TEXT}}>
        <Avatar who={who} size={72} />
        <div><div style={{fontSize: 27, fontWeight: 700}}>{PEOPLE[who].name}</div><div style={{fontFamily: MONO, fontSize: 16, color: pass ? P.green : P.red, letterSpacing: 1}}>{pass ? 'OWNER OF THE AGENT' : 'NOT THE OWNER'}</div></div>
      </div>
      {f >= at && (
        <div style={{position: 'absolute', left: x, top: y - 30, padding: '14px 22px', borderRadius: 14, background: P.card, border: `2px solid ${hit ? col : P.line}`, boxShadow: '0 10px 30px rgba(27,24,19,0.12)', fontFamily: TEXT, fontSize: 23, whiteSpace: 'nowrap', opacity: pass && f > at + 93 ? 0 : 1}}>
          <span style={{color: P.indigo, fontWeight: 600}}>{text.split(' ')[0]}</span> {text.split(' ').slice(1).join(' ')}
        </div>
      )}
      {hit && !pass && (
        <div style={{position: 'absolute', left: 440, top: y + 44, fontFamily: MONO, fontSize: 21, fontWeight: 600, color: P.red, opacity: ramp(f, at + 44, at + 54)}}>✕ BLOCKED BY SWITCH · the agent never sees it</div>
      )}
      <Sfx at={at + 42} name={pass ? 'pop' : 'thud'} volume={pass ? 0.4 : 0.9} />
    </>
  );
};
const Gate: React.FC<S> = ({t}) => {
  const f = useCurrentFrame();
  const glow = ramp(f, t.s4 + 105, t.s4 + 115) * (1 - ramp(f, t.s4 + 160, t.s4 + 180));
  return (
    <AbsoluteFill>
      <Paper tint={P.indigo} />
      <Chapter n="08" title="Who may instruct an agent" />
      <div style={{position: 'absolute', left: 80, top: 150, width: 1760}}>
        <Head text="Switch checks the *sender* before the agent runs." at={4} size={76} align="left" accent={P.indigo} />
      </div>
      <div style={{position: 'absolute', left: 870, top: 350, width: 180, height: 620, borderRadius: 28, background: P.indigo, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, color: P.card, boxShadow: `0 30px 80px ${P.indigo}55`}}>
        <Icon.toggle size={64} color={P.card} />
        <div style={{fontFamily: DISPLAY, fontSize: 30, fontWeight: 600}}>Switch</div>
        <div style={{fontFamily: MONO, fontSize: 15, opacity: 0.8, textAlign: 'center', lineHeight: 1.5}}>addressing:<br />owner</div>
      </div>
      <Card style={{position: 'absolute', left: 1400, top: 590, width: 420, padding: 24, display: 'flex', alignItems: 'center', gap: 18, border: `2px solid ${glow > 0 ? P.green : P.line}`, boxShadow: `0 0 ${60 * glow}px ${P.green}66`}}>
        <Avatar who="treasurer" size={64} />
        <div><div style={{fontSize: 27, fontWeight: 700}}>Treasurer Agent</div><div style={{fontSize: 17, color: P.mute}}>runs the rules engine</div></div>
      </Card>
      <Lane y={520} who="rohan" text="@treasurer-agent book INV-068" at={t.s4 + 18} pass />
      <Lane y={840} who="karan" text="@treasurer-agent just pay it" at={t.s5 + 40} pass={false} />
    </AbsoluteFill>
  );
};

// ---------- 10 layers
const LAYERS: [keyof typeof Icon, string, string, string][] = [
  ['toggle', 'Switch', 'decides who may instruct each agent', P.indigo],
  ['gear', 'Rules engine', 'deterministic Python: quorum, bye-law 156, payment gate', P.green],
  ['spark', 'LLM', 'only talks: relays the engine’s one-line verdict, word for word', P.amber],
];
const Layers: React.FC<S> = ({t}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Paper tint={P.green} />
      <Chapter n="09" title="Why you can trust it" />
      <div style={{position: 'absolute', left: 80, top: 150, width: 1760}}>
        <Head text="Rules live in *code,* not in a prompt." at={4} size={80} align="left" accent={P.green} />
      </div>
      <div style={{position: 'absolute', left: 80, top: 360, width: 1760, display: 'flex', flexDirection: 'column', gap: 18}}>
        {LAYERS.map(([ic, name, what, col], i) => {
          const Ic = Icon[ic];
          return (
            <Rise key={name} at={t.s6 + i * 16} dy={30}>
              <Card style={{display: 'flex', alignItems: 'center', gap: 28, padding: '26px 32px', borderLeft: `8px solid ${col}`}}>
                <div style={{width: 76, height: 76, borderRadius: 20, background: `${col}14`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Ic size={44} color={col} /></div>
                <div style={{width: 300, fontFamily: DISPLAY, fontSize: 42, fontWeight: 600, color: col}}>{name}</div>
                <div style={{fontSize: 30, color: P.ink2}}>{what}</div>
              </Card>
              <Sfx at={t.s6 + i * 16} name="pop" volume={0.3} />
            </Rise>
          );
        })}
        <div style={{display: 'flex', gap: 16, marginTop: 10, opacity: ramp(f, t.s6 + 90, t.s6 + 110)}}>
          {['Hash-chained resolutions ledger', 'Exhibit-ready for the auditor', 'Payments mocked: no money held'].map((x) => (
            <div key={x} style={{flex: 1, textAlign: 'center', fontFamily: MONO, fontSize: 18, padding: '16px 10px', border: `1px solid ${P.line}`, borderRadius: 14, color: P.ink2, background: `${P.card}aa`}}>{x}</div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 11 recorded live
const Live: React.FC<S> = ({t}) => {
  const f = useCurrentFrame();
  const p = ramp(f, 0, 40);
  return (
    <AbsoluteFill>
      <Paper tint={P.red} />
      <Chapter n="10" title="Recorded live" />
      <div style={{position: 'absolute', left: 80, top: 300, width: 640}}>
        <div style={{display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: MONO, fontSize: 17, letterSpacing: 3, color: P.red, marginBottom: 22, opacity: ramp(f, t.d1, t.d1 + 10)}}>
          <span style={{width: 12, height: 12, borderRadius: 6, background: P.red, opacity: f % 30 < 15 ? 1 : 0.3}} />REC · SWITCH + MATTERMOST
        </div>
        <Head text="Every line is *real* agent output." at={t.d1} size={66} align="left" accent={P.red} />
        <div style={{marginTop: 30, display: 'flex', flexDirection: 'column', gap: 10}}>
          {['Switch + Mattermost, self-hosted', '15/15 Switch policy checks pass', 'Unit + integration tests in CI'].map((x, i) => (
            <Line key={x} at={t.d1 + 30 + i * 8} size={26} color={P.ink2}><span style={{color: P.green, marginRight: 12, fontWeight: 700}}>✓</span>{x}</Line>
          ))}
        </div>
      </div>
      <div style={{position: 'absolute', left: 800, top: 140, width: 1040, perspective: 1800}}>
        <div style={{transform: `rotateY(${-10 * p + (1 - p) * -30}deg) translateX(${(1 - p) * 260}px)`, opacity: p, borderRadius: 14, overflow: 'hidden', boxShadow: '0 50px 120px rgba(27,24,19,0.35)', border: `1px solid ${P.line}`}}>
          <Img src={staticFile('shots/b3-6-final-committee.png')} style={{width: 1040, display: 'block', marginTop: -26}} />
        </div>
      </div>
      <Sfx at={0} name="whoosh" volume={0.35} />
    </AbsoluteFill>
  );
};

// ---------- chat scenes (every agent line verbatim from the live run)
const KICKOFF: Msg[] = [
  {at: -1, who: 'switch', text: 'Template kickoff: rooms committee and general-body, agents clerk, treasurer-agent, byelaw, concierge.'},
  {at: -1, who: 'clerk', text: 'Done: `meeting-chair` is now an exclusive role in this room. Only its holder chairs a meeting, opens and closes it, and records votes.'},
];
const ChatHead: React.FC<{n: string; title: string; text: string; accent?: string}> = ({n, title, text, accent = P.red}) => (
  <>
    <Chapter n={n} title={title} />
    <div style={{position: 'absolute', left: 80, top: 86, width: 1760}}>
      <Head text={text} at={4} size={44} align="left" accent={accent} />
    </div>
  </>
);

const Hook: React.FC<S> = ({t}) => {
  const q = '@treasurer-agent just pay the lift contractor. ₹68,000.';
  return (
    <AbsoluteFill>
      <Paper tint={P.red} />
      <ChatHead n="11" title="Live" text="A resident says *just pay it.*" />
      <Camera keys={[{f: 0, x: 960, y: 580, s: 1}, {f: t.d2 + 70, x: 960, y: 580, s: 1}, {f: t.d2 + 110, x: 960, y: 600, s: 1.25}]}>
        <div style={{position: 'absolute', left: 140, top: 150}}>
          <Chat room="general-body" msgs={[{at: -1, who: 'concierge', text: "Hi! I answer from the society's published ledger, minutes and agenda."}, {at: t.d2 + 46, who: 'karan', text: q}, {at: t.d2 + 84, who: 'switch', policy: true, text: 'Karan is not the treasurer agent’s owner. The message never reached the agent.'}]} typing={[{from: t.d2 + 6, send: t.d2 + 46, who: 'karan', text: q}]} />
        </div>
      </Camera>
    </AbsoluteFill>
  );
};

const Refuse: React.FC<S> = ({t}) => {
  const q = '@treasurer-agent pay the lift AMC invoice INV-068, 68000';
  return (
    <AbsoluteFill>
      <Paper tint={P.red} />
      <ChatHead n="12" title="No resolution, no payment" text="Even the Treasurer *can’t* skip the vote." />
      <Camera keys={[{f: 0, x: 960, y: 580, s: 1}, {f: t.d3 + 30, x: 960, y: 580, s: 1}, {f: t.d3 + 75, x: 960, y: 600, s: 1.25}]}>
        <div style={{position: 'absolute', left: 140, top: 150}}>
          <Chat room="committee" msgs={[...KICKOFF, {at: 62, who: 'rohan', text: q}, {at: t.d3 + 20, who: 'treasurer', text: 'REFUSED no passed resolution for invoice INV-068'}]} typing={[{from: 16, send: 62, who: 'rohan', text: q}]} />
        </div>
      </Camera>
    </AbsoluteFill>
  );
};

const VOTERS: [string, boolean][] = [['Aarav Patil', true], ['Priya Patil', true], ['Rohan Patil', true], ['Sneha Patil', true], ['Vikram Patil', false]];
const Meeting: React.FC<S> = ({t, len}) => {
  const f = useCurrentFrame();
  const T = {open: t.d4 + 30, quorum: t.d5 + 20, vote: t.d6 - 20, passed: t.d6 + 50, close: t.d6 + 100, check: t.d7 - 20, checked: t.d7 + 40, book: t.d8 - 30, booked: t.d8 + 20, end: len};
  const present = Math.round(interpolate(f, [T.quorum + 4, T.quorum + 50], [0, 41], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const msgs: Msg[] = [
    ...KICKOFF,
    {at: T.open, who: 'rohan', text: '@clerk open a meeting. Present: member-1 to member-41. I am the chair.'},
    {at: T.open + 30, who: 'clerk', text: 'assumed the `meeting-chair` role.'},
    {at: T.quorum, who: 'clerk', text: 'OK meeting open: 41 present, 20 needed, chair user'},
    {at: T.vote, who: 'rohan', text: '@clerk record a vote on INV-068, motion "Pay lift AMC": member-1, member-2, member-3, member-4 aye; member-5 nay.'},
    {at: T.passed, who: 'clerk', text: 'OK R-001 passed 4-1 (0 abstain)'},
    {at: T.close, who: 'rohan', text: '@clerk close the meeting'},
    {at: T.close + 18, who: 'clerk', text: 'OK meeting closed · released the `meeting-chair` role.'},
    {at: T.check, who: 'rohan', text: '@byelaw check INV-068'},
    {at: T.checked, who: 'byelaw', text: 'OK 68000 is within bye-law 156: committee limit 100000 for 51+ members'},
    {at: T.book, who: 'rohan', text: '@treasurer-agent book INV-068 under resolution R-001'},
    {at: T.booked, who: 'treasurer', text: 'OK booked INV-068 68000 under R-001, mock UPI ref MOCK-INV-068-R-001'},
  ];
  return (
    <AbsoluteFill>
      <Paper tint={P.green} />
      <ChatHead n="13" title="Quorum · vote by name · then payment" text="Payment waits for a *real* resolution." accent={P.green} />
      <div style={{position: 'absolute', left: 80, top: 150}}>
        <Chat room="committee" w={1200} h={880} msgs={msgs} typing={[{from: T.open - 38, send: T.open, who: 'rohan', text: '@clerk open a meeting. Present: member-1 to member-41. I am the chair.'}]} />
      </div>
      <Side at={T.quorum + 2} out={T.vote - 6} title="QUORUM · BYE-LAW 100" accent={P.lilac} style={{left: 1320, top: 170}} w={520}>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 9}}>
          {Array.from({length: 60}, (_, i) => <div key={i} style={{height: 26, borderRadius: 13, background: i < present ? P.green : 'rgba(27,24,19,0.08)', outline: i === 19 ? `2px solid ${P.amber}` : 'none', outlineOffset: 2}} />)}
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 22, fontSize: 22}}>
          <span><b style={{fontFamily: DISPLAY, fontSize: 48}}>{present}</b> <span style={{color: P.mute}}>of 60 present</span></span>
          <span style={{color: present >= 20 ? P.green : P.amber, fontWeight: 700, fontFamily: MONO, fontSize: 16}}>{present >= 20 ? '✓ QUORATE · 20 NEEDED' : '20 NEEDED'}</span>
        </div>
      </Side>
      <Side at={T.vote + 4} out={T.check - 20} title="RESOLUTION R-001 · PAY LIFT AMC" accent={P.lilac} style={{left: 1320, top: 170}} w={520}>
        {VOTERS.map(([n, aye], i) => {
          const on = f >= T.vote + 10 + i * 5;
          return (
            <div key={n} style={{display: 'flex', alignItems: 'center', padding: '11px 0', borderBottom: `1px solid ${P.line}`, fontSize: 23, opacity: on ? 1 : 0.3}}>
              <span>{n}</span>
              <span style={{marginLeft: 'auto', fontFamily: MONO, fontSize: 16, fontWeight: 600, color: P.card, background: aye ? P.green : P.red, padding: '3px 12px', borderRadius: 6}}>{on ? (aye ? 'AYE' : 'NAY') : '—'}</span>
            </div>
          );
        })}
        <div style={{marginTop: 18, fontFamily: DISPLAY, fontSize: 30, fontWeight: 600, color: P.green, opacity: ramp(f, T.passed, T.passed + 10)}}>Passed 4–1 · recorded by name</div>
      </Side>
      <Side at={T.check - 12} title="PAYMENT GATE · INV-068" accent={P.green} style={{left: 1320, top: 170}} w={520}>
        <Check at={T.check} label="Invoice on file" detail="INV-068 · Sahyadri Lifts · ₹68,000" />
        <Check at={T.check + 10} label="Resolution passed" detail="R-001 · 4–1 · quorate (41/20)" />
        <Check at={T.checked} label="Within bye-law 156" detail="limit ₹1,00,000 for 51+ members" />
        <div style={{height: 150, position: 'relative'}}>
          <Stamp at={T.booked + 8} text="PAID ₹68,000" color={P.green} size={46} rotate={-5} style={{left: 40, top: 30}} sub="mock UPI ref MOCK-INV-068-R-001" />
        </div>
      </Side>
    </AbsoluteFill>
  );
};

const Limit: React.FC<S> = ({t}) => {
  const f = useCurrentFrame();
  const send = t.d9 + 36;
  const ref = t.d10 + 4;
  const g = ramp(f, ref, ref + 50);
  const amt = Math.round(400000 * g);
  return (
    <AbsoluteFill>
      <Paper tint={P.amber} />
      <ChatHead n="14" title="Bye-law 156" text="Over the limit? Not even a *vote* can approve it." accent={P.amber} />
      <div style={{position: 'absolute', left: 80, top: 150}}>
        <Chat room="committee" w={1200} h={880} msgs={[...KICKOFF, {at: send, who: 'rohan', text: '@byelaw check INV-400'}, {at: ref, who: 'byelaw', text: 'REFUSED over bye-law 156 limit ₹1,00,000 (51+ members); referred to AGM'}]} typing={[{from: t.d9 + 4, send, who: 'rohan', text: '@byelaw check INV-400'}]} />
      </div>
      <Side at={ref} title="INV-400 · KONKAN PAINTERS" accent={P.amber} style={{left: 1320, top: 170}} w={520}>
        <div style={{fontSize: 22, color: P.mute}}>Repaint the building exterior</div>
        <div style={{fontFamily: DISPLAY, fontSize: 68, fontWeight: 600, margin: '6px 0 24px', fontVariantNumeric: 'tabular-nums', letterSpacing: -2}}>₹{amt.toLocaleString('en-IN')}</div>
        <div style={{position: 'relative', height: 40, background: 'rgba(27,24,19,0.07)', borderRadius: 10}}>
          <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${Math.min(g * 4, 1) * 25}%`, background: P.green, borderRadius: '10px 0 0 10px'}} />
          <div style={{position: 'absolute', left: '25%', top: 0, bottom: 0, width: `${Math.max(0, g * 4 - 1) * 25}%`, background: P.amber, borderRadius: '0 10px 10px 0'}} />
          <div style={{position: 'absolute', left: '25%', top: -12, bottom: -12, width: 3, background: P.ink}} />
        </div>
        <div style={{fontFamily: MONO, fontSize: 15, color: P.mute, marginTop: 12, marginLeft: '19%'}}>committee limit ₹1,00,000</div>
        <div style={{marginTop: 26, fontFamily: DISPLAY, fontSize: 28, fontWeight: 600, color: P.amber, opacity: ramp(f, ref + 60, ref + 75)}}>→ Added to the AGM agenda</div>
        <div style={{fontSize: 19, color: P.mute, opacity: ramp(f, ref + 70, ref + 85)}}>Only the General Body can sanction it.</div>
      </Side>
    </AbsoluteFill>
  );
};

const Ask: React.FC<S> = ({t}) => {
  const q = '@concierge Why did the society pay Rs 68,000 for the lift?';
  const send = t.d11 + 60;
  return (
    <AbsoluteFill>
      <Paper tint={P.cyan} />
      <ChatHead n="15" title="Transparency for 60 residents" text="Residents ask. The *records* answer." accent={P.cyan} />
      <Camera keys={[{f: 0, x: 960, y: 580, s: 1}, {f: t.d12 + 10, x: 960, y: 580, s: 1}, {f: t.d12 + 55, x: 960, y: 600, s: 1.25}]}>
        <div style={{position: 'absolute', left: 140, top: 150}}>
          <Chat
            room="general-body"
            msgs={[
              {at: -1, who: 'concierge', text: "Hi! I answer from the society's published ledger, minutes and agenda."},
              {at: send, who: 'karan', text: q},
              {at: t.d12, who: 'concierge', text: "It was the lift's annual maintenance contract (AMC), invoice INV-068, approved by resolution R-001.", quote: ['ledger.md   2026-11-06 · INV-068 · 68000 · R-001 · byelaw OK · PAID', 'minutes.md  R-001 passed 4-1 (0 abstain): Pay lift AMC (INV-068)']},
            ]}
            typing={[{from: t.d11 + 10, send, who: 'karan', text: q}]}
          />
        </div>
      </Camera>
    </AbsoluteFill>
  );
};

// ---------- 16 principle, 17 end
const Principle: React.FC<S> = ({t}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: P.ink}} />
      <Center style={{flexDirection: 'column', gap: 36, alignItems: 'flex-start', paddingLeft: 120}}>
        <Head text="Switch decides *who* may give instructions." at={t.c1} size={88} color={P.paper} accent={P.amber} align="left" />
        <div style={{width: ramp(f, t.c1b - 6, t.c1b + 30) * 1400, height: 2, background: 'rgba(244,239,230,0.3)'}} />
        <Head text="The code decides *what* is allowed." at={t.c1b} size={88} color={P.paper} accent={P.green} align="left" />
      </Center>
      <div style={{position: 'absolute', right: 80, bottom: 60, fontFamily: MONO, fontSize: 16, letterSpacing: 3, color: 'rgba(244,239,230,0.5)'}}>NO LLM EVER DECIDES A PAYMENT</div>
    </AbsoluteFill>
  );
};
const End: React.FC<S> = ({t}) => {
  const f = useCurrentFrame();
  const s = useSpr(t.c2 - 6, {damping: 14, stiffness: 120});
  return (
    <AbsoluteFill>
      <Paper tint={P.red} />
      <Center style={{flexDirection: 'column', gap: 22}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 30, opacity: s, transform: `scale(${0.92 + 0.08 * s})`}}>
          <Mark size={110} />
          <div style={{fontFamily: DISPLAY, fontSize: 120, fontWeight: 600, letterSpacing: -4}}>Society Room</div>
        </div>
        <Line at={t.c2 + 20} size={44} color={P.ink} style={{fontFamily: DISPLAY, fontStyle: 'italic'}}>Governance your auditor can sign.</Line>
        <Line at={t.c2 + 36} size={24} color={P.mute}>For Maharashtra co-operative housing societies · Early access ₹15 per flat / month</Line>
        <Rise at={t.c2 + 50} dy={20} style={{marginTop: 22}}>
          <div style={{background: P.ink, color: P.paper, fontSize: 28, fontWeight: 500, padding: '18px 40px', borderRadius: 14, fontFamily: MONO}}>github.com/abhinav162/society-room</div>
        </Rise>
        <Line at={t.c2 + 70} size={20} color={P.mute}>Built on <b style={{color: P.ink}}>Switch</b> · Flip the Switch 2026</Line>
      </Center>
      <Sfx at={t.c2 + 40} name="chime" volume={0.4} />
      <AbsoluteFill style={{background: P.paper, opacity: ramp(f, 120, 150)}} />
    </AbsoluteFill>
  );
};

const SCENE: Record<string, React.FC<S>> = {
  societies: Societies, registrar: Registrar, gap: Gap, reveal: Reveal, checks: Checks, personas: Personas, hub: Hub, template: Template, gate: Gate,
  layers: Layers, live: Live, hook: Hook, refuse: Refuse, meeting: Meeting, limit: Limit, ask: Ask, principle: Principle, end: End,
};
const WIPE: Record<string, string> = {registrar: P.ink, reveal: P.red, checks: P.green, hub: P.indigo, live: P.red, principle: P.red, end: P.ink};

// Narration windows, absolute frames, for ducking the score.
const VOICE = PLAN.flatMap((b) => Object.entries(b.t as T).map(([id, at]) => [b.from + at, b.from + at + Math.ceil(D[id] * 30)] as [number, number]));
const musicVolume = (f: number) => {
  let duck = 0;
  for (const [a, b] of VOICE) duck = Math.max(duck, interpolate(f, [a - 12, a, b, b + 20], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const tail = interpolate(f, [EXPLAINER_V2_FRAMES - 70, EXPLAINER_V2_FRAMES], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (0.26 - 0.17 * duck) * tail;
};

export const ExplainerV2: React.FC = () => (
  <AbsoluteFill style={{background: P.paper}}>
    <Audio src={staticFile('launch/music-v2.wav')} volume={musicVolume} />
    {PLAN.map((b) => {
      const Sc = SCENE[b.id];
      return (
        <Sequence key={b.id} from={b.from} durationInFrames={b.len}>
          <Wipe d={b.len} color={WIPE[b.id] ?? P.paper}><Sc t={b.t} len={b.len} /></Wipe>
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
