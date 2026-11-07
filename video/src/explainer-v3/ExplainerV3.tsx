import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import trims from './trims.json';
import {buildTimeline} from './timeline.mjs';
import {Head, Stamp} from '../explainer-v2/kit';
import {Avatar, Cam, Chat, Code, Cursor, Desktop, DISPLAY, EIO, Icon, MONO, Msg, P, PanelHead, Phone, ramp, Sfx, TEXT, Tick, useSpr, Win} from './kit3';

type T = Record<string, number>;
type S = {t: T; e: T; len: number};
export const TL = buildTimeline(trims as Record<string, {start: number; end: number}>);
export const EXPLAINER_V3_FRAMES = TL.total;

// window geometry shared by every product shot
const WIN = {x: 100, y: 100, w: 1720, h: 900};
// Body line that rises under its own mask (padding keeps italic descenders).
const Line: React.FC<{at: number; children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties}> = ({at, children, size = 30, color = P.ink2, style}) => {
  const f = useCurrentFrame();
  const p = ramp(f, at, at + 24);
  return (
    <div style={{overflow: 'hidden', fontFamily: TEXT, fontSize: size, color, lineHeight: 1.4, paddingBottom: size * 0.2, marginBottom: -size * 0.2, ...style}}>
      <div style={{transform: `translateY(${(1 - p) * 105}%)`, opacity: Math.min(1, p * 2)}}>{children}</div>
    </div>
  );
};
const Chapter: React.FC<{n: string; title: string; dark?: boolean; rec?: boolean}> = ({n, title, dark, rec}) => {
  const f = useCurrentFrame();
  const c = dark ? 'rgba(244,239,230,0.7)' : P.mute;
  return (
    <div style={{position: 'absolute', left: 80, top: 40, display: 'flex', alignItems: 'center', gap: 14, fontFamily: MONO, fontSize: 15, letterSpacing: 3, color: c, opacity: ramp(f, 2, 16) * (1 - ramp(f, 130, 150)), zIndex: 60, padding: '6px 14px', borderRadius: 20, background: dark ? 'rgba(27,24,19,0.25)' : 'rgba(244,239,230,0.85)', boxShadow: dark ? 'none' : '0 2px 10px rgba(27,24,19,0.08)'}}>
      {rec && <span style={{width: 10, height: 10, borderRadius: 5, background: P.red, opacity: f % 30 < 15 ? 1 : 0.3}} />}
      <span style={{color: dark ? P.amber : P.red, fontWeight: 600}}>{n}</span>
      <span style={{width: ramp(f, 4, 28) * 32, height: 1, background: c}} />
      <span style={{textTransform: 'uppercase'}}>{title}</span>
    </div>
  );
};
const PaperBg: React.FC<{tint?: string}> = ({tint = P.amber}) => (
  <AbsoluteFill style={{background: P.paper}}>
    <AbsoluteFill style={{backgroundImage: `radial-gradient(${P.line} 1.2px, transparent 1.2px)`, backgroundSize: '28px 28px', opacity: 0.5}} />
    <AbsoluteFill style={{background: `radial-gradient(1200px 700px at 85% 110%, ${tint}26, transparent 70%)`}} />
  </AbsoluteFill>
);

// ---------- 01 editorial: the census number, then the people who carry it
const Societies: React.FC<S> = ({t}) => {
  const f = useCurrentFrame();
  const n = interpolate(f, [t.w1, t.w1 + 120], [0, 115172], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (x) => 1 - (1 - x) ** 4});
  const swap = ramp(f, t.w2 - 8, t.w2 + 14, EIO);
  return (
    <AbsoluteFill>
      <PaperBg />
      <Chapter n="01" title="The problem" />
      <AbsoluteFill style={{opacity: 1 - swap, transform: `translateY(${-swap * 60}px)`}}>
        <div style={{position: 'absolute', left: 80, top: 230}}>
          <div style={{fontFamily: DISPLAY, fontWeight: 600, fontSize: 330, letterSpacing: -14, lineHeight: 1, color: P.ink, fontVariantNumeric: 'tabular-nums'}}>{Math.floor(n).toLocaleString('en-IN')}</div>
          <div style={{marginTop: 20, display: 'flex', alignItems: 'baseline', gap: 18}}>
            <Line at={t.w1 + 36} size={50} color={P.ink}><span style={{fontFamily: DISPLAY, fontStyle: 'italic'}}>co-operative housing societies</span></Line>
            <Line at={t.w1 + 54} size={30} color={P.mute}>in Maharashtra</Line>
          </div>
          <div style={{marginTop: 30, width: ramp(f, t.w1 + 120, t.w1 + 200) * 1700, height: 2, background: P.ink}} />
          <Line at={t.w1 + 130} size={44} color={P.ink2} style={{marginTop: 24}}>Each one run by a committee of <b style={{color: P.ink}}>unpaid volunteers.</b></Line>
        </div>
      </AbsoluteFill>
      {f >= t.w2 - 8 && (
        <AbsoluteFill style={{opacity: swap}}>
          <div style={{position: 'absolute', left: 80, top: 230, width: 1760}}>
            <Head text="They sign off on *lakhs* of rupees." at={t.w2} size={132} align="left" />
            <div style={{height: 40}} />
            <Head text="And they are *personally* responsible for every one." at={t.w2 + 85} size={100} align="left" accent={P.red} color={P.ink2} />
          </div>
          <Sfx at={t.w2 + 85} name="thud" volume={0.5} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ---------- 02 the order, as a paper object under a camera move
const Registrar: React.FC<S> = ({t}) => {
  const f = useCurrentFrame();
  const at = t.w3 + 72;
  return (
    <AbsoluteFill style={{background: P.red}}>
      <Chapter n="02" title="The registrar" dark />
      <div style={{position: 'absolute', right: 80, top: 44, fontFamily: MONO, fontSize: 14, letterSpacing: 2, color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.4)', padding: '5px 12px', borderRadius: 20, zIndex: 60}}>ILLUSTRATION · NO REAL SOCIETY OR OFFICE</div>
      <Cam keys={[{f: 0, x: 1180, y: 330, s: 1.7, rx: 6, ry: -6}, {f: t.w3 + 60, x: 900, y: 560, s: 1.0, rx: 0, ry: 0}]}>
        <div style={{position: 'absolute', left: 80, top: 330, width: 560, color: P.card, opacity: ramp(f, t.w3 + 30, t.w3 + 50)}}>
          <Head text="No recorded resolution? The committee is *dissolved.*" at={t.w3 + 30} size={72} align="left" color={P.card} accent="#FFD9A8" />
        </div>
        <div style={{position: 'absolute', left: 700, top: 150, width: 920, height: 780, background: P.card, borderRadius: 4, padding: '60px 70px', color: P.ink, fontFamily: TEXT, transform: 'rotate(-2deg)', boxShadow: '0 60px 140px rgba(60,10,0,0.5)'}}>
          <div style={{textAlign: 'center', fontFamily: MONO, fontSize: 16, letterSpacing: 3, color: P.mute}}>OFFICE OF THE REGISTRAR · CO-OPERATIVE SOCIETIES</div>
          <div style={{textAlign: 'center', fontFamily: DISPLAY, fontSize: 60, fontWeight: 700, margin: '22px 0 28px', letterSpacing: 10}}>ORDER</div>
          <div style={{fontSize: 25, lineHeight: 1.65}}>The managing committee of <span style={{background: '#E8E2D5', color: 'transparent', borderRadius: 4}}>__________ CHS Ltd.</span> is hereby <b>dissolved</b> under the Act.</div>
          <div style={{fontSize: 25, lineHeight: 1.65, marginTop: 14}}>Reason: accounts, minutes and resolutions for the expenditure were not produced on inspection.</div>
          {[0.95, 0.88, 0.92, 0.6, 0.9, 0.75, 0.5].map((w, i) => <div key={i} style={{height: 11, width: `${w * 100}%`, background: '#E8E2D5', borderRadius: 6, marginTop: 22}} />)}
          <div style={{position: 'absolute', right: 70, bottom: 56, fontFamily: DISPLAY, fontStyle: 'italic', fontSize: 26, color: P.ink2}}>— Registrar</div>
          <Stamp at={at} text="DISSOLVED" size={100} rotate={-12} style={{left: 160, top: 330}} />
        </div>
      </Cam>
      <Sfx at={at} name="thud" volume={0.9} />
    </AbsoluteFill>
  );
};

// ---------- 03 editorial: the gap
const Gap: React.FC<S> = ({t}) => {
  const f = useCurrentFrame();
  const strike = ramp(f, t.w4b, t.w4b + 24);
  return (
    <AbsoluteFill>
      <PaperBg tint={P.red} />
      <Chapter n="03" title="The gap" />
      <div style={{position: 'absolute', left: 80, top: 250, width: 1760}}>
        <div style={{position: 'relative', display: 'inline-block'}}>
          <Head text="Apps record *who* approved a payment." at={t.w4} size={104} align="left" color={strike > 0 ? P.mute : P.ink} accent={strike > 0 ? P.mute : P.red} />
          <div style={{position: 'absolute', left: 0, top: '52%', height: 8, width: `${strike * 100}%`, background: P.red, borderRadius: 4}} />
        </div>
        <div style={{height: 50}} />
        {f >= t.w4b + 10 && <Head text="None check whether that person was *allowed* to." at={t.w4b + 10} size={104} align="left" accent={P.red} />}
      </div>
      <div style={{position: 'absolute', left: 80, bottom: 90, fontFamily: MONO, fontSize: 20, letterSpacing: 3, color: P.red, opacity: ramp(f, t.w4b + 70, t.w4b + 90)}}>WHO APPROVED  ≠  ALLOWED TO APPROVE</div>
      <Sfx at={t.w4b} name="whoosh" volume={0.3} />
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
  const s = useSpr(t.w5 - 6, {damping: 13, stiffness: 140});
  return (
    <AbsoluteFill>
      <PaperBg tint={P.green} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 26}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 36, transform: `scale(${0.8 + 0.2 * s})`, opacity: s}}>
          <Mark size={130} />
          <Head text="Society Room" at={t.w5} size={150} weight={600} stagger={6} />
        </div>
        <Line at={t.w5 + 24} size={36} color={P.ink2} style={{textAlign: 'center'}}>Built to <span style={{fontFamily: DISPLAY, fontStyle: 'italic', color: P.red}}>close that gap.</span></Line>
      </AbsoluteFill>
      <Sfx at={t.w5 - 4} name="boom" volume={0.5} />
    </AbsoluteFill>
  );
};

// ---------- shared chat history
const KICKOFF: Msg[] = [
  {at: -1, who: 'switch', sys: true, time: '10:58 PM', text: 'Template society-room applied: rooms committee and general-body; agents clerk, treasurer-agent, byelaw, concierge.'},
  {at: -1, who: 'clerk', time: '10:58 PM', text: 'Done: `meeting-chair` is now an exclusive role in this room. Only its holder chairs a meeting, opens and closes it, and records votes.'},
];
const MEETING_DONE: Msg[] = [
  {at: -1, who: 'rohan', time: '11:00 PM', text: '@clerk record a vote on INV-068, motion "Pay lift AMC": member-1, member-2, member-3, member-4 aye; member-5 nay.', replies: 1},
  {at: -1, who: 'clerk', time: '11:00 PM', text: 'OK R-001 passed 4-1 (0 abstain)'},
  {at: -1, who: 'rohan', time: '11:02 PM', text: '@byelaw check INV-068', replies: 1},
  {at: -1, who: 'byelaw', time: '11:02 PM', text: 'OK 68000 is within bye-law 156: committee limit 100000 for 51+ members'},
  {at: -1, who: 'rohan', time: '11:02 PM', text: '@treasurer-agent book INV-068 under resolution R-001', replies: 1},
  {at: -1, who: 'treasurer', time: '11:02 PM', text: 'OK booked INV-068 68000 under R-001, mock UPI ref MOCK-INV-068-R-001', seen: true},
];
const Shot: React.FC<{keys: Parameters<typeof Cam>[0]['keys']; children: React.ReactNode; dim?: number; blur?: number}> = ({keys, children, dim, blur}) => (
  <Cam keys={keys}><Desktop dim={dim} blur={blur}>{children}</Desktop></Cam>
);
const ESTABLISH = (f: number, s = 1) => [{f: 0, x: 960, y: 560, s: 0.94 * s, rx: 4, ry: -7}, {f, x: 960, y: 560, s, rx: 0, ry: 0}];

// ---------- 05 the rule, as the payment gate panel inside the app
const Checks: React.FC<S> = ({t, e}) => {
  const f = useCurrentFrame();
  const stamp = e.b4 + 2;
  return (
    <AbsoluteFill>
      <Chapter n="04" title="The rule" />
      <Shot keys={[...ESTABLISH(t.b1 + 30), {f: t.b2 - 10, x: 1290, y: 480, s: 1.55}, {f: stamp + 30, x: 1290, y: 560, s: 1.55}]}>
        <Win {...WIN} title="Sunrise Heights CHS · committee — Society Room">
          <Chat
            room="committee"
            msgs={[...KICKOFF, ...MEETING_DONE]}
            panel={
              <>
                <PanelHead title="PAYMENT GATE" sub="INV-068 · Sahyadri Lifts · ₹68,000" accent={P.green} />
                <div style={{padding: '10px 22px 4px', fontSize: 14, color: P.mute, fontFamily: MONO, letterSpacing: 1}}>MONEY LEAVES ONLY WHEN</div>
                <Tick at={t.b2 + 4} label="There is an invoice" detail="INV-068 on file · PDF attached" />
                <Tick at={t.b3 + 12} label="A quorate meeting voted, by name" detail="41 present, 20 needed · R-001 passed 4–1" />
                <Tick at={t.b4 + 14} label="Within the bye-law 156 limit" detail="₹68,000 ≤ ₹1,00,000 (51+ members)" />
                <div style={{position: 'relative', height: 220}}>
                  <div style={{position: 'absolute', left: 22, top: 22, fontSize: 15, color: P.mute, opacity: ramp(f, stamp - 4, stamp + 8)}}>All three true → the Treasurer Agent books it.</div>
                  <Stamp at={stamp} text="BOOKED" color={P.green} size={54} rotate={-7} style={{left: 110, top: 70}} sub="mock UPI ref MOCK-INV-068-R-001" />
                </div>
              </>
            }
          />
        </Win>
      </Shot>
      <Sfx at={t.b2 + 4} name="pop" volume={0.4} /><Sfx at={t.b3 + 12} name="pop" volume={0.4} /><Sfx at={t.b4 + 14} name="chime" volume={0.4} />
    </AbsoluteFill>
  );
};

// ---------- 06 who it helps: editorial over the app, pulled out of focus
const Personas: React.FC<S> = ({t}) => (
  <AbsoluteFill>
    <Shot keys={[{f: 0, x: 960, y: 540, s: 1.05}, {f: 280, x: 960, y: 540, s: 1.12}]} dim={0.08} blur={10}>
      <Win {...WIN} title="Sunrise Heights CHS · committee — Society Room"><Chat room="committee" msgs={[...KICKOFF, ...MEETING_DONE]} /></Win>
    </Shot>
    <Chapter n="05" title="Who it helps" />
    <div style={{position: 'absolute', left: 80, top: 250, width: 1760, display: 'flex', flexDirection: 'column', gap: 34}}>
      <Head text="The committee is *protected.*" at={t.b5} size={112} align="left" accent={P.indigo} />
      <Head text="Residents get answers they can *trust.*" at={t.b5 + 60} size={112} align="left" accent={P.cyan} />
      <Head text="The auditor gets a record to *sign.*" at={t.b6} size={112} align="left" accent={P.green} />
    </div>
  </AbsoluteFill>
);

// ---------- 07 Switch in the sidebar
const Hub: React.FC<S> = ({t}) => {
  const f = useCurrentFrame();
  const tip = ramp(f, t.s1 + 28, t.s1 + 44);
  return (
    <AbsoluteFill>
      <Chapter n="06" title="Built on Switch" />
      <Shot keys={[{f: 0, x: 960, y: 560, s: 1}, {f: t.s1 + 30, x: 330, y: 400, s: 2.1}]}>
        <Win {...WIN} title="Sunrise Heights CHS · committee — Society Room"><Chat room="committee" msgs={[...KICKOFF, ...MEETING_DONE]} /></Win>
        <div style={{position: 'absolute', left: 372, top: 368, padding: '8px 12px', borderRadius: 8, background: P.ink, color: P.paper, fontSize: 11, fontFamily: TEXT, whiteSpace: 'nowrap', opacity: tip, transform: `translateY(${(1 - tip) * 6}px)`, boxShadow: '0 6px 20px rgba(0,0,0,0.25)'}}>
          <b>Switch</b> · agents join Slack, Teams, Discord or Mattermost
          <div style={{position: 'absolute', left: 14, bottom: -5, width: 10, height: 10, background: P.ink, transform: 'rotate(45deg)'}} />
        </div>
        <Cursor keys={[{f: t.s1, x: 700, y: 700}, {f: t.s1 + 26, x: 334, y: 356}]} />
      </Shot>
    </AbsoluteFill>
  );
};

// ---------- 08 one template: the YAML in an editor, then the rooms and agents appear in the app
const YAML = `template: society-room
rooms:
  - committee        # private · managing committee
  - general-body     # every resident

agents:
  - name: clerk
    addressing: owner
  - name: treasurer-agent
    addressing: owner
  - name: byelaw
    addressing: {anyone_in: [committee]}
  - name: concierge
    addressing: {anyone_in: [general-body]}`;
const yamlHl = (l: string) => l.split(/(owner|anyone_in|#.*$)/).map((x, i) => <span key={i} style={{color: x === 'owner' ? P.green : x === 'anyone_in' ? P.amber : x.startsWith('#') ? P.mute : undefined, fontWeight: x === 'owner' || x === 'anyone_in' ? 600 : 400}}>{x}</span>);
const Template: React.FC<S> = ({t}) => {
  const f = useCurrentFrame();
  const chars = Math.round(interpolate(f, [t.s2 + 6, t.s2 + 150], [0, YAML.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  return (
    <AbsoluteFill>
      <Chapter n="07" title="One template" />
      <Shot keys={[{f: 0, x: 960, y: 560, s: 1.0, ry: -5}, {f: t.s2 + 40, x: 930, y: 540, s: 1.12, ry: 0}, {f: t.s3 - 10, x: 930, y: 540, s: 1.12}, {f: t.s3 + 30, x: 330, y: 400, s: 2.0}]}>
          <Win x={200} y={120} w={1520} h={820} title="switch/society-room.yaml" tabs={['society-room.yaml', 'payment.py']}>
            <Code text={YAML} chars={chars} hl={yamlHl} file="society-room.yaml" />
          </Win>
          <Win {...WIN} title="Sunrise Heights CHS · committee — Society Room" at={t.s3}>
            <Chat room="committee" msgs={KICKOFF} agentsAt={t.s3 + 24} />
          </Win>
      </Shot>
      <Sfx at={t.s3} name="whoosh" volume={0.35} />
      {[0, 1, 2, 3].map((i) => <Sfx key={i} at={t.s3 + 24 + i * 8} name="pop" volume={0.25} />)}
    </AbsoluteFill>
  );
};

// ---------- 09 who may instruct: the agent's settings in a Switch console panel, plus its decision log
const Gate: React.FC<S> = ({t}) => {
  const f = useCurrentFrame();
  const rows: [number, string, string, boolean][] = [[t.s4 + 50, 'Rohan Patil', 'owner', true], [t.s5 + 70, 'Karan Patil', 'not the owner', false]];
  return (
    <AbsoluteFill>
      <Chapter n="08" title="Who may instruct an agent" />
      <Shot keys={[{f: 0, x: 960, y: 560, s: 1}, {f: t.s4 + 24, x: 1260, y: 470, s: 1.6}]}>
        <Win {...WIN} title="Sunrise Heights CHS · committee — Society Room">
          <Chat
            room="committee"
            msgs={KICKOFF}
            panel={
              <>
                <PanelHead title="SWITCH · AGENT SETTINGS" sub="treasurer-agent" />
                <div style={{padding: '16px 22px', borderBottom: `1px solid ${P.line}`, display: 'flex', alignItems: 'center', gap: 12}}>
                  <Avatar who="treasurer" size={40} />
                  <div><div style={{fontSize: 18, fontWeight: 700}}>Treasurer Agent</div><div style={{fontSize: 13, color: P.mute}}>runs the payment rules engine</div></div>
                  <span style={{marginLeft: 'auto', fontSize: 11, fontFamily: MONO, color: P.green, background: `${P.green}18`, padding: '2px 8px', borderRadius: 10}}>ONLINE</span>
                </div>
                {[['addressing', 'owner', true], ['owner', 'Rohan Patil · A-103', false], ['rooms', 'committee', false]].map(([k, v, tog]) => (
                  <div key={k as string} style={{padding: '14px 22px', borderBottom: `1px solid ${P.line}`, display: 'flex', alignItems: 'center'}}>
                    <span style={{fontFamily: MONO, fontSize: 14, color: P.mute, width: 120}}>{k as string}</span>
                    <span style={{fontSize: 17, fontWeight: 600, color: tog ? P.green : P.ink}}>{v as string}</span>
                    {tog ? <span style={{marginLeft: 'auto', width: 44, height: 24, borderRadius: 12, background: P.green, position: 'relative'}}><span style={{position: 'absolute', right: 3, top: 3, width: 18, height: 18, borderRadius: 9, background: P.card}} /></span> : null}
                  </div>
                ))}
                <div style={{padding: '14px 22px 6px', fontFamily: MONO, fontSize: 12, letterSpacing: 2, color: P.mute}}>DECISIONS · CHECKED BEFORE THE AGENT RUNS</div>
                {rows.map(([at, who, why, ok]) => {
                  const p = ramp(f, at, at + 18);
                  if (f < at) return null;
                  return (
                    <div key={who} style={{margin: '6px 22px', padding: '12px 14px', borderRadius: 10, background: ok ? `${P.green}10` : `${P.red}10`, border: `1px solid ${ok ? P.green : P.red}44`, opacity: p, transform: `translateX(${(1 - p) * 20}px)`, display: 'flex', alignItems: 'center', gap: 10}}>
                      <Avatar who={who.startsWith('Rohan') ? 'rohan' : 'karan'} size={28} />
                      <div style={{flex: 1}}><div style={{fontSize: 15, fontWeight: 600}}>{who} → treasurer-agent</div><div style={{fontSize: 13, color: P.mute}}>{why}</div></div>
                      <span style={{fontFamily: MONO, fontSize: 12, fontWeight: 600, color: P.card, background: ok ? P.green : P.red, padding: '3px 9px', borderRadius: 6}}>{ok ? 'ALLOWED' : 'BLOCKED'}</span>
                    </div>
                  );
                })}
              </>
            }
          />
        </Win>
        <Cursor keys={[{f: t.s4, x: 1000, y: 800}, {f: t.s4 + 30, x: 1700, y: 372}, {f: t.s4 + 36, x: 1700, y: 372, click: true}, {f: t.s5 + 20, x: 1600, y: 760}]} />
      </Shot>
      <Sfx at={t.s4 + 50} name="pop" volume={0.4} /><Sfx at={t.s5 + 70} name="thud" volume={0.8} />
    </AbsoluteFill>
  );
};

// ---------- 10 rules in code
const PY = `def book_payment(inv, resolution, society):
    """Deterministic: the LLM only relays the string we return."""
    if inv is None:
        return "REFUSED no invoice on file"
    if resolution is None or not resolution.passed:
        return f"REFUSED no passed resolution for invoice {inv.id}"
    limit = byelaw_156_limit(society.members)
    if inv.amount > limit:
        return f"REFUSED over bye-law 156 limit {limit}; referred to AGM"
    ref = ledger.book(inv, resolution)          # hash-chained append
    return f"OK booked {inv.id} {inv.amount} under {resolution.id}, mock UPI ref {ref}"`;
const pyHl = (l: string) => l.split(/("[^"]*"|f"[^"]*"|#.*$|\b(?:def|if|return|or|not|is|None)\b)/).map((x, i) => <span key={i} style={{color: x.startsWith('"') || x.startsWith('f"') ? P.green : x.startsWith('#') ? P.mute : /^(def|if|return|or|not|is|None)$/.test(x) ? P.indigo : undefined, fontWeight: /^(def|if|return)$/.test(x) ? 600 : 400}}>{x}</span>);
const Layers: React.FC<S> = ({t}) => (
  <AbsoluteFill>
    <PaperBg tint={P.green} />
    <Chapter n="09" title="Why you can trust it" />
    <div style={{position: 'absolute', left: 80, top: 120, width: 1760, zIndex: 5}}>
      <Head text="The money rules are *code.* The AI only reports the result." at={t.s6} size={58} align="left" accent={P.green} />
    </div>
    <Cam keys={[{f: 0, x: 960, y: 540, s: 1}, {f: t.s6 + 160, x: 940, y: 560, s: 1.08}]}>
      <Win x={160} y={290} w={1600} h={740} title="rules/payment.py" tabs={['payment.py', 'quorum.py', 'society-room.yaml']} at={t.s6 - 10}>
        <Code text={PY} hl={pyHl} file="payment.py" />
      </Win>
    </Cam>
    <div style={{position: 'absolute', right: 80, bottom: 20, fontFamily: MONO, fontSize: 13, letterSpacing: 2, color: P.mute}}>ILLUSTRATIVE EXCERPT · 15/15 SWITCH POLICY CHECKS · UNIT + INTEGRATION TESTS IN CI</div>
  </AbsoluteFill>
);

// ---------- 11 recorded live
const Live: React.FC<S> = () => (
  <AbsoluteFill>
    <PaperBg tint={P.red} />
    <Chapter n="10" title="Recorded live · Switch + Mattermost · self-hosted" rec />
    <Cam keys={[{f: 0, x: 960, y: 560, s: 1.0, ry: -4}, {f: 70, x: 960, y: 560, s: 1.14, ry: 0}]}>
      <Win x={120} y={100} w={1680} h={930} title="localhost:8065 — Mattermost · committee">
        <Img src={staticFile('shots/b3-6-final-committee.png')} style={{width: 1680, display: 'block', position: 'absolute', top: -100, left: 0}} />
      </Win>
    </Cam>
  </AbsoluteFill>
);

// ---------- 12–16 the live run
const Hook: React.FC<S> = ({t}) => {
  const q = '@treasurer-agent just pay the lift contractor. ₹68,000.';
  const send = t.d2 + 22, notice = t.d2 + 68;
  return (
    <AbsoluteFill>
      <Chapter n="11" title="A resident tries to pay" rec />
      <Shot keys={[{f: 0, x: 960, y: 560, s: 1}, {f: notice - 6, x: 960, y: 560, s: 1}, {f: notice + 30, x: 1000, y: 650, s: 1.5}]}>
        <Win {...WIN} title="Sunrise Heights CHS · general-body — Society Room">
          <Chat room="general-body" focus={notice} me="karan"
            msgs={[{at: -1, who: 'concierge', time: '10:59 PM', text: "Hi! I answer from the society's published ledger, minutes and agenda."}, {at: send, who: 'karan', time: '11:01 PM', text: q}, {at: notice, who: 'switch', policy: true, time: '11:01 PM', text: 'Karan Patil is not the owner of treasurer-agent. The message was not delivered to the agent.'}]}
            typing={[{from: 4, send, who: 'karan', text: q}]} />
        </Win>
        <Cursor keys={[{f: 0, x: 900, y: 600}, {f: 3, x: 760, y: 930, click: true}, {f: send - 8, x: 1770, y: 964}, {f: send - 1, x: 1770, y: 964, click: true}, {f: send + 20, x: 1500, y: 700}]} />
      </Shot>
    </AbsoluteFill>
  );
};

const Refuse: React.FC<S> = ({t}) => {
  const q = '@treasurer-agent pay the lift AMC invoice INV-068, 68000';
  const send = t.d3 + 10, ref = t.d3 + 50;
  return (
    <AbsoluteFill>
      <Chapter n="12" title="No resolution, no payment" rec />
      <Shot keys={[{f: 0, x: 960, y: 560, s: 1}, {f: ref - 4, x: 960, y: 560, s: 1}, {f: ref + 28, x: 1000, y: 650, s: 1.5}]}>
        <Win {...WIN} title="Sunrise Heights CHS · committee — Society Room">
          <Chat room="committee" focus={ref} msgs={[...KICKOFF, {at: send, who: 'rohan', time: '11:00 PM', text: q}, {at: ref, who: 'treasurer', time: '11:00 PM', text: 'REFUSED no passed resolution for invoice INV-068'}]} typing={[{from: 2, send, who: 'rohan', text: q}]} />
        </Win>
        <Cursor keys={[{f: 0, x: 1100, y: 700}, {f: 2, x: 760, y: 930, click: true}, {f: send - 8, x: 1770, y: 964}, {f: send - 1, x: 1770, y: 964, click: true}, {f: send + 20, x: 1500, y: 700}]} />
      </Shot>
    </AbsoluteFill>
  );
};

const VOTERS: [string, boolean][] = [['Aarav Patil', true], ['Priya Patil', true], ['Rohan Patil', true], ['Sneha Patil', true], ['Vikram Patil', false]];
const Meeting: React.FC<S> = ({t}) => {
  const f = useCurrentFrame();
  const T = {open: t.d4 + 16, chair: t.d4 + 40, quorum: t.d5 + 10, vote: t.d6 + 2, passed: t.d6 + 52, close: t.d6 + 82, closed: t.d6 + 98, check: t.d7 + 6, checked: t.d7 + 62, book: t.d8 + 4, booked: t.d8 + 48};
  const present = Math.round(interpolate(f, [T.quorum + 2, T.quorum + 40], [0, 41], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const openText = '@clerk open a meeting. Present: member-1 to member-41. I am the chair.';
  const voteText = '@clerk record a vote on INV-068, motion "Pay lift AMC": member-1, member-2, member-3, member-4 aye; member-5 nay.';
  const msgs: Msg[] = [
    ...KICKOFF,
    {at: T.open, who: 'rohan', time: '10:59 PM', text: openText},
    {at: T.chair, who: 'clerk', time: '10:59 PM', text: 'assumed the `meeting-chair` role.'},
    {at: T.quorum, who: 'clerk', time: '10:59 PM', text: 'OK meeting open: 41 present, 20 needed, chair user'},
    {at: T.vote, who: 'rohan', time: '11:00 PM', text: voteText},
    {at: T.passed, who: 'clerk', time: '11:00 PM', text: 'OK R-001 passed 4-1 (0 abstain)'},
    {at: T.close, who: 'rohan', time: '11:01 PM', text: '@clerk close the meeting'},
    {at: T.closed, who: 'clerk', time: '11:01 PM', text: 'OK meeting closed · released the `meeting-chair` role.'},
    {at: T.check, who: 'rohan', time: '11:02 PM', text: '@byelaw check INV-068'},
    {at: T.checked, who: 'byelaw', time: '11:02 PM', text: 'OK 68000 is within bye-law 156: committee limit 100000 for 51+ members'},
    {at: T.book, who: 'rohan', time: '11:02 PM', text: '@treasurer-agent book INV-068 under resolution R-001'},
    {at: T.booked, who: 'treasurer', time: '11:02 PM', text: 'OK booked INV-068 68000 under R-001, mock UPI ref MOCK-INV-068-R-001'},
  ];
  const stage = f < T.vote ? 0 : f < T.check ? 1 : 2;
  return (
    <AbsoluteFill>
      <Chapter n="13" title="Quorum · vote by name · then payment" rec />
      <Shot keys={[{f: 0, x: 960, y: 560, s: 1}, {f: T.quorum, x: 960, y: 560, s: 1}, {f: T.quorum + 30, x: 1180, y: 440, s: 1.35}, {f: T.passed, x: 1180, y: 440, s: 1.35}, {f: T.passed + 30, x: 1100, y: 760, s: 1.3}, {f: T.checked, x: 1100, y: 760, s: 1.3}, {f: T.checked + 30, x: 1180, y: 520, s: 1.35}, {f: T.booked, x: 1180, y: 520, s: 1.35}, {f: T.booked + 30, x: 1200, y: 780, s: 1.35}]}>
        <Win {...WIN} title="Sunrise Heights CHS · committee — Society Room">
          <Chat
            room="committee" msgs={msgs} focus={f >= T.booked ? T.booked : undefined}
            typing={[{from: 2, send: T.open, who: 'rohan', text: openText}, {from: T.quorum + 30, send: T.vote, who: 'rohan', text: voteText}]}
            panel={
              <>
                {stage === 0 && (
                  <>
                    <PanelHead title="MEETING · LIVE" sub="Committee meeting · 6 Nov · chair Rohan Patil" accent={P.lilac} />
                    <div style={{padding: '18px 22px'}}>
                      <div style={{fontFamily: MONO, fontSize: 12, letterSpacing: 2, color: P.mute, marginBottom: 12}}>QUORUM · BYE-LAW 100</div>
                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 7}}>
                        {Array.from({length: 60}, (_, i) => <div key={i} style={{height: 22, borderRadius: 11, background: i < present ? P.green : 'rgba(27,24,19,0.08)', outline: i === 19 ? `2px solid ${P.amber}` : 'none', outlineOffset: 2}} />)}
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 18}}>
                        <span><b style={{fontFamily: DISPLAY, fontSize: 44}}>{present}</b> <span style={{color: P.mute, fontSize: 16}}>of 60 present</span></span>
                        <span style={{fontFamily: MONO, fontSize: 13, color: present >= 20 ? P.green : P.amber, fontWeight: 600}}>{present >= 20 ? '✓ QUORATE · 20 NEEDED' : '20 NEEDED'}</span>
                      </div>
                    </div>
                  </>
                )}
                {stage === 1 && (
                  <>
                    <PanelHead title="RESOLUTION R-001" sub="Pay lift AMC · INV-068 · ₹68,000" accent={P.lilac} />
                    <div style={{padding: '8px 22px'}}>
                      {VOTERS.map(([n, aye], i) => {
                        const on = f >= T.vote + 12 + i * 5;
                        return (
                          <div key={n} style={{display: 'flex', alignItems: 'center', padding: '11px 0', borderBottom: `1px solid ${P.line}`, fontSize: 18, opacity: on ? 1 : 0.35}}>
                            <span>{n}</span>
                            <span style={{marginLeft: 'auto', fontFamily: MONO, fontSize: 13, fontWeight: 600, color: P.card, background: aye ? P.green : P.red, padding: '2px 10px', borderRadius: 6}}>{on ? (aye ? 'AYE' : 'NAY') : '—'}</span>
                          </div>
                        );
                      })}
                      <div style={{marginTop: 16, fontFamily: DISPLAY, fontSize: 26, fontWeight: 600, color: P.green, opacity: ramp(f, T.passed, T.passed + 10)}}>Passed 4–1 · recorded by name</div>
                      <div style={{fontSize: 14, color: P.mute, marginTop: 4, opacity: ramp(f, T.passed, T.passed + 10)}}>Appended to minutes.md · hash-chained</div>
                    </div>
                  </>
                )}
                {stage === 2 && (
                  <>
                    <PanelHead title="PAYMENT GATE" sub="INV-068 · Sahyadri Lifts · ₹68,000" accent={P.green} />
                    <Tick at={T.check} label="There is an invoice" detail="INV-068 on file" />
                    <Tick at={T.check + 10} label="Resolution passed, quorate" detail="R-001 · 4–1 · 41 present / 20 needed" />
                    <Tick at={T.checked} label="Within bye-law 156" detail="₹68,000 ≤ ₹1,00,000 (51+ members)" />
                    <div style={{position: 'relative', height: 200}}>
                      <Stamp at={T.booked + 6} text="PAID ₹68,000" color={P.green} size={34} rotate={-6} style={{left: 40, top: 50}} sub="mock UPI ref MOCK-INV-068-R-001" />
                    </div>
                  </>
                )}
              </>
            }
          />
        </Win>
        <Cursor keys={[{f: 0, x: 1000, y: 700}, {f: 2, x: 760, y: 930, click: true}, {f: T.open - 6, x: 1370, y: 964}, {f: T.open - 1, x: 1370, y: 964, click: true}, {f: T.quorum + 30, x: 760, y: 930, click: true}, {f: T.vote - 6, x: 1370, y: 964}, {f: T.vote - 1, x: 1370, y: 964, click: true}, {f: T.vote + 20, x: 1200, y: 700}]} hideAfter={T.vote + 40} />
      </Shot>
    </AbsoluteFill>
  );
};

const Limit: React.FC<S> = ({t}) => {
  const send = t.d9 + 14, ref = t.d9 + 46, banner = t.d10 + 36;
  return (
    <AbsoluteFill>
      <Chapter n="14" title="Bye-law 156" rec />
      <Shot keys={[{f: 0, x: 960, y: 560, s: 1}, {f: ref, x: 960, y: 560, s: 1}, {f: ref + 30, x: 1000, y: 660, s: 1.45}]}>
        <Win {...WIN} title="Sunrise Heights CHS · committee — Society Room">
          <Chat room="committee" focus={ref}
            msgs={[...KICKOFF, ...MEETING_DONE.slice(4), {at: send, who: 'rohan', time: '11:03 PM', text: '@byelaw check INV-400'}, {at: ref, who: 'byelaw', time: '11:03 PM', text: 'REFUSED over bye-law 156 limit ₹1,00,000 (51+ members); referred to AGM', banner: {at: banner, text: 'INV-400 · Konkan Painters · ₹4,00,000 is 4× the committee limit', sub: 'Added to the AGM agenda — only the General Body can sanction it. No committee vote can.'}}]}
            typing={[{from: 2, send, who: 'rohan', text: '@byelaw check INV-400'}]} />
        </Win>
        <Cursor keys={[{f: 0, x: 1000, y: 700}, {f: 2, x: 760, y: 930, click: true}, {f: send - 6, x: 1770, y: 964}, {f: send - 1, x: 1770, y: 964, click: true}, {f: send + 20, x: 1500, y: 700}]} />
      </Shot>
    </AbsoluteFill>
  );
};

const Ask: React.FC<S> = ({t}) => {
  const q = '@concierge Why did the society pay Rs 68,000 for the lift?';
  const send = t.d11 + 50, ans = t.d12 + 8;
  return (
    <AbsoluteFill>
      <Shot keys={[{f: 0, x: 960, y: 540, s: 1.05}]} dim={0.1} blur={12}>
        <Win {...WIN} title="Sunrise Heights CHS · general-body — Society Room"><Chat room="general-body" msgs={[{at: -1, who: 'concierge', text: "Hi! I answer from the society's published ledger, minutes and agenda."}]} /></Win>
      </Shot>
      <Chapter n="15" title="Residents ask · the records answer" rec />
      <Cam keys={[{f: 0, x: 960, y: 560, s: 1, ry: -6}, {f: t.d11 + 20, x: 960, y: 560, s: 1, ry: 0}, {f: ans - 4, x: 960, y: 560, s: 1}, {f: ans + 30, x: 960, y: 680, s: 1.35}]}>
        <Phone x={745} y={100}>
          <Chat room="general-body" compact
            me="karan" msgs={[{at: -1, who: 'concierge', time: '10:59', text: "Hi! I answer from the society's published ledger, minutes and agenda."}, {at: send, who: 'karan', time: '11:04', text: q}, {at: ans, who: 'concierge', time: '11:04', text: "It was the lift's annual maintenance contract (AMC), invoice INV-068, approved by resolution R-001.", cites: {at: ans + 6, open: ans + 50, items: [{file: 'ledger.md', where: 'L12', excerpt: '2026-11-06 · INV-068 · 68000 · R-001 · byelaw OK · PAID'}, {file: 'minutes.md', where: 'R-001', excerpt: 'R-001 passed 4-1 (0 abstain): Pay lift AMC (INV-068)'}]}}]}
            typing={[{from: t.d11, send, who: 'karan', text: q}]} />
        </Phone>
      </Cam>
      <div style={{position: 'absolute', left: 80, top: 400, width: 520, fontFamily: TEXT, zIndex: 5}}>
        <Line at={t.d11 + 6} size={30} color={P.ink2}>In <b style={{color: P.ink}}>#general-body</b>, any of the 60 residents can ask.</Line>
        <Line at={t.d12 + 20} size={30} color={P.ink2} style={{marginTop: 18}}>The Concierge answers only from <b style={{color: P.ink}}>published</b> ledger and minutes — and cites the line.</Line>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 17 principle, 18 end
const Principle: React.FC<S> = ({t}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: P.ink}}>
      <AbsoluteFill style={{justifyContent: 'center', flexDirection: 'column', gap: 36, paddingLeft: 120}}>
        <Head text="Switch decides *who* may give instructions." at={t.c1} size={92} color={P.paper} accent={P.amber} align="left" />
        <div style={{width: ramp(f, t.c1b - 6, t.c1b + 30) * 1400, height: 2, background: 'rgba(244,239,230,0.3)'}} />
        <Head text="The code decides *what* is allowed." at={t.c1b} size={92} color={P.paper} accent={P.green} align="left" />
      </AbsoluteFill>
      <div style={{position: 'absolute', right: 80, bottom: 60, fontFamily: MONO, fontSize: 15, letterSpacing: 3, color: 'rgba(244,239,230,0.5)'}}>NO LLM EVER DECIDES A PAYMENT</div>
    </AbsoluteFill>
  );
};
const End: React.FC<S> = ({t, len}) => {
  const f = useCurrentFrame();
  const s = useSpr(t.c2 - 6, {damping: 14, stiffness: 120});
  return (
    <AbsoluteFill>
      <PaperBg tint={P.red} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 22, fontFamily: TEXT}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 30, opacity: s, transform: `scale(${0.92 + 0.08 * s})`}}>
          <Mark size={110} />
          <div style={{fontFamily: DISPLAY, fontSize: 120, fontWeight: 600, letterSpacing: -4, color: P.ink}}>Society Room</div>
        </div>
        <Line at={t.c2 + 18} size={44} color={P.ink} style={{fontFamily: DISPLAY, fontStyle: 'italic'}}>Governance your auditor can sign.</Line>
        <Line at={t.c2 + 34} size={24} color={P.mute}>For Maharashtra co-operative housing societies · Early access ₹15 per flat / month</Line>
        <div style={{marginTop: 22, opacity: ramp(f, t.c2 + 46, t.c2 + 66), background: P.ink, color: P.paper, fontSize: 28, padding: '18px 40px', borderRadius: 14, fontFamily: MONO}}>github.com/abhinav162/society-room</div>
        <Line at={t.c2 + 70} size={20} color={P.mute}>Built on <b style={{color: P.ink}}>Switch</b> · Flip the Switch 2026</Line>
      </AbsoluteFill>
      <Sfx at={t.c2 + 40} name="chime" volume={0.4} />
      <AbsoluteFill style={{background: P.paper, opacity: ramp(f, len - 30, len)}} />
    </AbsoluteFill>
  );
};

const SCENE: Record<string, React.FC<S>> = {
  societies: Societies, registrar: Registrar, gap: Gap, reveal: Reveal, checks: Checks, personas: Personas, hub: Hub, template: Template, gate: Gate,
  layers: Layers, live: Live, hook: Hook, refuse: Refuse, meeting: Meeting, limit: Limit, ask: Ask, principle: Principle, end: End,
};

// Cross-dissolve: each scene fades in over the previous one, which stays rendered for OVERLAP frames,
// so a cut never flashes the bare background. The first scene starts fully visible.
const OVERLAP = 6;
const Cut: React.FC<{children: React.ReactNode; instant?: boolean}> = ({children, instant}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{opacity: instant ? 1 : ramp(f, 0, OVERLAP)}}>{children}</AbsoluteFill>;
};

const musicVolume = (f: number) => {
  let duck = 0;
  for (const l of Object.values(TL.lines)) duck = Math.max(duck, interpolate(f, [l.at - 10, l.at, l.at + l.len, l.at + l.len + 14], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const tail = interpolate(f, [TL.total - 70, TL.total], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (0.24 - 0.16 * duck) * tail;
};

export const ExplainerV3: React.FC = () => (
  <AbsoluteFill style={{background: P.paper}}>
    <Audio src={staticFile('launch/music-v2.wav')} volume={musicVolume} />
    {TL.sections.map((s) => {
      const Sc = SCENE[s.id];
      return (
        <Sequence key={s.id} from={s.from} durationInFrames={s.len + OVERLAP}>
          <Cut instant={s.from === 0}><Sc t={s.t} e={s.e} len={s.len} /></Cut>
        </Sequence>
      );
    })}
    {Object.entries(TL.lines).map(([id, l]) => (
      <Sequence key={id} from={l.at} durationInFrames={l.len + 2} layout="none">
        <Audio src={staticFile(`explainer/${id}.wav`)} startFrom={l.startFrom} endAt={l.endAt} volume={1} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
