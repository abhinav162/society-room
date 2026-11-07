import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Avatar, Backdrop, C, Camera, Card, ChatWindow, Check, DockedHeadline, fade, MONO, Msg, PEOPLE, SANS, Sfx, Stage, useSpring, Who, Words} from './kit';

// Scene lengths in frames at 30 fps; 120 BPM music, so 60 frames is one bar (see scripts/audio.mjs).
export const SCENES: [string, number][] = [
  ['hook', 150], ['problem', 270], ['reveal', 180], ['template', 240], ['refuse', 240],
  ['meeting', 540], ['limit', 240], ['ask', 300], ['how', 360], ['end', 240],
];
export const LAUNCH_FRAMES = SCENES.reduce((a, [, d]) => a + d, 0);

const Center: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', fontFamily: SANS, color: C.text, ...style}}>{children}</AbsoluteFill>
);

// ---------------- 1. hook: a resident says "just pay it" and Switch blocks it
export const Hook = () => {
  const f = useCurrentFrame();
  const text = '@treasurer-agent just pay the lift contractor. ₹68,000.';
  const typed = text.slice(0, Math.round(interpolate(f, [4, 38], [0, text.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})));
  const sent = useSpring(42);
  const block = useSpring(62, {damping: 12, stiffness: 180});
  const shake = f >= 62 && f < 74 ? Math.sin(f * 2.4) * (74 - f) * 0.9 : 0;
  return (
    <AbsoluteFill>
      <Backdrop glow={f > 62 ? C.bad : C.brand} />
      <Center style={{flexDirection: 'column', gap: 26}}>
        <div style={{width: 1100, opacity: fade(f, 0, 6)}}>
          <div style={{display: 'flex', gap: 20, alignItems: 'flex-start', background: C.panel, border: `1px solid ${C.line}`, borderRadius: 22, padding: '26px 30px', transform: `translateY(${(1 - sent) * 10}px)`}}>
            <Avatar who="karan" size={56} />
            <div>
              <div style={{fontSize: 22, fontWeight: 700}}>Karan Patil <span style={{color: C.muted, fontWeight: 500, fontSize: 18}}>· Resident, A-107</span></div>
              <div style={{fontSize: 34, marginTop: 6}}>
                <span style={{color: C.brand}}>{typed.slice(0, 16)}</span>{typed.slice(16)}
                {f < 42 && <span style={{color: C.brand, opacity: f % 16 < 8 ? 1 : 0}}>|</span>}
              </div>
            </div>
          </div>
        </div>
        <div style={{width: 1100, opacity: block, transform: `translateY(${(1 - block) * 30}px) translateX(${shake}px)`}}>
          <div style={{display: 'flex', gap: 20, alignItems: 'center', background: `${C.bad}14`, border: `1px solid ${C.bad}88`, borderRadius: 22, padding: '24px 30px', boxShadow: `0 0 80px ${C.bad}33`}}>
            <div style={{fontSize: 44}}>⛨</div>
            <div>
              <div style={{fontFamily: MONO, fontSize: 20, letterSpacing: 3, color: C.bad}}>BLOCKED BY SWITCH</div>
              <div style={{fontSize: 28, marginTop: 4}}>Karan is not the treasurer agent's owner. The message never reached the agent.</div>
            </div>
          </div>
        </div>
        <div style={{marginTop: 30, height: 100}}>{f >= 92 && <Words text="Money moves only when the rules say so." at={92} size={64} />}</div>
      </Center>
      <Sfx at={42} name="pop" volume={0.4} />
      <Sfx at={62} name="thud" volume={0.9} />
    </AbsoluteFill>
  );
};

// ---------------- 2. problem
export const Problem = () => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [8, 60], [0, 115172], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => 1 - (1 - t) ** 3}));
  const inr = n.toLocaleString('en-IN');
  return (
    <AbsoluteFill>
      <Backdrop />
      <Sequence durationInFrames={95}>
        <Center style={{flexDirection: 'column'}}>
          <div style={{fontSize: 190, fontWeight: 800, letterSpacing: -8, fontVariantNumeric: 'tabular-nums', background: `linear-gradient(180deg, #fff, #9aa3b5)`, WebkitBackgroundClip: 'text', color: 'transparent'}}>{inr}</div>
          <div style={{fontSize: 38, color: C.muted, marginTop: 6, opacity: fade(f, 20, 40)}}>co-operative housing societies in Maharashtra alone.</div>
          <div style={{fontSize: 38, marginTop: 14, opacity: fade(f, 40, 60)}}>Each run by unpaid volunteers who are <span style={{color: C.warn}}>personally liable</span> for its money.</div>
        </Center>
      </Sequence>
      <Sequence from={95} durationInFrames={85}>
        <Center style={{flexDirection: 'column', gap: 30}}>
          <Words text="Registrars dissolve committees" size={86} />
          <Words text="that can't show a recorded resolution." size={86} at={10} color={C.warn} />
        </Center>
      </Sequence>
      <Sequence from={180}>
        <Strike />
      </Sequence>
      <Sfx at={95} name="whoosh" volume={0.35} />
      <Sfx at={180} name="whoosh" volume={0.35} />
    </AbsoluteFill>
  );
};
const Strike = () => {
  const f = useCurrentFrame();
  const w = fade(f, 28, 40);
  return (
    <Center style={{flexDirection: 'column', gap: 34}}>
      <div style={{position: 'relative'}}>
        <Words text="Society apps log who approved a payment." size={70} color={C.muted} />
        <div style={{position: 'absolute', left: 0, top: '55%', height: 6, width: `${w * 100}%`, background: C.bad, borderRadius: 3}} />
      </div>
      {f >= 42 && <Words text="None check they were allowed to." size={96} at={42} />}
    </Center>
  );
};

// ---------------- 3. reveal
export const Logo: React.FC<{size?: number}> = ({size = 120}) => (
  <div style={{width: size, height: size, borderRadius: size * 0.26, background: `linear-gradient(140deg, ${C.brand}, #4F5BD5)`, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: size * 0.09, padding: size * 0.22, boxShadow: `0 20px 80px ${C.brand}66`}}>
    {[1, 0.8, 0.55].map((w, i) => (
      <div key={i} style={{height: size * 0.09, width: `${w * 100}%`, borderRadius: size, background: i === 2 ? C.ok : 'rgba(255,255,255,0.92)'}} />
    ))}
  </div>
);
export const Reveal = () => {
  const f = useCurrentFrame();
  const s = useSpring(0, {damping: 13, stiffness: 120});
  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, ${C.brand}55, transparent ${20 + 40 * fade(f, 0, 30)}%)`, opacity: 1 - fade(f, 30, 120) * 0.6}} />
      <Center style={{flexDirection: 'column', gap: 34}}>
        <div style={{transform: `scale(${0.6 + 0.4 * s}) rotate(${(1 - s) * -12}deg)`, opacity: s}}>
          <Logo size={150} />
        </div>
        <Words text="Society Room" size={130} weight={800} at={8} stagger={5} />
        <div style={{fontSize: 38, color: '#C5CAD4', opacity: fade(f, 30, 50), textAlign: 'center', lineHeight: 1.4}}>
          A payment leaves your society only after a <b style={{color: C.text}}>quorate, recorded, bye-law-compliant</b> vote.
        </div>
        <div style={{display: 'flex', gap: 16, opacity: fade(f, 60, 80), marginTop: 10}}>
          {['Built on Switch', 'Agents in your team chat', 'Rules in code, not prompts'].map((t) => (
            <div key={t} style={{fontSize: 22, border: `1px solid ${C.line}`, background: C.panel, borderRadius: 40, padding: '10px 22px', color: '#C5CAD4'}}>{t}</div>
          ))}
        </div>
      </Center>
      <Sfx at={0} name="boom" volume={0.7} />
    </AbsoluteFill>
  );
};

// ---------------- 4. one template
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
const AGENTS: [Who, string, string][] = [
  ['clerk', 'Opens meetings, counts quorum, records votes by name', 'obeys: owner only'],
  ['treasurer', 'Books a payment only against a passed resolution', 'obeys: owner only'],
  ['byelaw', 'Checks every spend against bye-law 156', 'anyone in #committee'],
  ['concierge', 'Answers residents from the published records', 'anyone in #general-body'],
];
export const Template = () => {
  const f = useCurrentFrame();
  const chars = Math.round(interpolate(f, [40, 120], [0, YAML.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  return (
    <AbsoluteFill>
      <Backdrop />
      <DockedHeadline kicker="Set up in one step" text="One template. Two rooms. Four agents." />
      <Stage>
        <div style={{position: 'absolute', left: 110, top: 70, width: 760, height: 640, background: C.panel, border: `1px solid ${C.line}`, borderRadius: 22, overflow: 'hidden'}}>
          <div style={{height: 50, borderBottom: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', padding: '0 22px', fontFamily: MONO, fontSize: 17, color: C.muted, background: C.panel2}}>switch/society-room.yaml</div>
          <pre style={{margin: 0, padding: 28, fontFamily: MONO, fontSize: 25, lineHeight: 1.6, color: '#C9D1E0', whiteSpace: 'pre-wrap'}}>
            {YAML.slice(0, chars).split(/(owner|anyone_in)/).map((t, i) => (
              <span key={i} style={{color: t === 'owner' ? C.ok : t === 'anyone_in' ? C.warn : undefined}}>{t}</span>
            ))}
          </pre>
        </div>
        <div style={{position: 'absolute', left: 940, top: 70, width: 870, display: 'flex', flexDirection: 'column', gap: 18}}>
          {AGENTS.map(([who, job, rule], i) => {
            const at = 120 + i * 14;
            return (
              <Row key={who} at={at}>
                <Avatar who={who} size={60} />
                <div style={{flex: 1}}>
                  <div style={{fontSize: 27, fontWeight: 700}}>{PEOPLE[who].name}</div>
                  <div style={{fontSize: 20, color: C.muted}}>{job}</div>
                </div>
                <div style={{fontFamily: MONO, fontSize: 16, color: rule.includes('owner') ? C.ok : C.warn, border: `1px solid ${rule.includes('owner') ? C.ok : C.warn}55`, padding: '6px 12px', borderRadius: 8, whiteSpace: 'nowrap'}}>{rule}</div>
                <Sfx at={at} name="pop" volume={0.3} />
              </Row>
            );
          })}
          <div style={{display: 'flex', gap: 14, marginTop: 8, opacity: fade(f, 185, 200)}}>
            {['🔒 committee · private', '# general-body · residents'].map((r) => (
              <div key={r} style={{flex: 1, fontSize: 21, padding: '16px 20px', borderRadius: 14, background: `${C.brand}18`, border: `1px solid ${C.brand}44`}}>{r}</div>
            ))}
          </div>
        </div>
      </Stage>
    </AbsoluteFill>
  );
};
export const Row: React.FC<{at: number; children: React.ReactNode}> = ({at, children}) => {
  const s = useSpring(at);
  const f = useCurrentFrame();
  if (f < at) return <div style={{height: 104}} />;
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 20, padding: '20px 24px', background: C.panel, border: `1px solid ${C.line}`, borderRadius: 18, opacity: s, transform: `translateX(${(1 - s) * 60}px)`, fontFamily: SANS, color: C.text}}>
      {children}
    </div>
  );
};

// ---------------- committee history shared by the chat scenes (already on screen: at = -1)
const KICKOFF: Msg[] = [
  {at: -1, who: 'switch', text: 'Template kickoff: rooms committee and general-body, agents clerk, treasurer-agent, byelaw, concierge.'},
  {at: -1, who: 'clerk', text: 'Done: `meeting-chair` is now an exclusive role in this room. Only its holder chairs a meeting, opens and closes it, and records votes.'},
];

// ---------------- 5. even the treasurer is refused
export const Refuse = () => (
  <AbsoluteFill>
    <Backdrop />
    <DockedHeadline kicker="No resolution, no payment" text="Even the Treasurer can't skip the vote." />
    <Stage>
      <Camera keys={[{f: 0, x: 960, y: 465, s: 1}, {f: 95, x: 960, y: 465, s: 1}, {f: 140, x: 930, y: 640, s: 1.42}]}>
        <div style={{position: 'absolute', left: 140, top: 30}}>
          <ChatWindow
            room="committee"
            msgs={[...KICKOFF, {at: 88, who: 'rohan', text: '@treasurer-agent pay the lift AMC invoice INV-068, 68000'}, {at: 142, who: 'treasurer', text: 'REFUSED no passed resolution for invoice INV-068'}]}
            typing={[{from: 40, send: 88, who: 'rohan', text: '@treasurer-agent pay the lift AMC invoice INV-068, 68000'}]}
          />
        </div>
      </Camera>
    </Stage>
  </AbsoluteFill>
);

// ---------------- 6. the meeting: quorum, vote by name, gate, booked
const VOTERS: [string, boolean][] = [['Aarav Patil', true], ['Priya Patil', true], ['Rohan Patil', true], ['Sneha Patil', true], ['Vikram Patil', false]];
// Event frames; the explainer moves them to land on its narration.
export const MEETING_T = {open: 46, quorum: 96, vote: 196, passed: 226, close: 300, check: 346, checked: 372, book: 404, booked: 436, end: 540};
export const Meeting: React.FC<{T?: Partial<typeof MEETING_T>}> = ({T: over}) => {
  const T = {...MEETING_T, ...over};
  const f = useCurrentFrame();
  const present = Math.round(interpolate(f, [T.quorum + 4, T.quorum + 54], [0, 41], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
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
  const stamp = useSpring(T.booked + 10, {damping: 10, stiffness: 200});
  return (
    <AbsoluteFill>
      <Backdrop />
      <DockedHeadline kicker="Quorum · vote by name · then payment" text="Payment waits for a real resolution." />
      <Stage>
        <Camera keys={[{f: 0, x: 960, y: 465, s: 1}, {f: T.close, x: 960, y: 465, s: 1.04}, {f: T.end, x: 960, y: 480, s: 1.0}]}>
          <div style={{position: 'absolute', left: 70, top: 30}}>
            <ChatWindow room="committee" w={1180} msgs={msgs} typing={[{from: T.open - 38, send: T.open, who: 'rohan', text: '@clerk open a meeting. Present: member-1 to member-41. I am the chair.'}]} />
          </div>
        </Camera>
        <Card at={T.quorum + 2} out={T.vote - 6} title="QUORUM · BYE-LAW 100" style={{left: 1290, top: 80}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 10}}>
            {Array.from({length: 60}, (_, i) => (
              <div key={i} style={{height: 30, borderRadius: 15, background: i < present ? C.ok : 'rgba(255,255,255,0.08)', outline: i === 19 ? `2px solid ${C.warn}` : 'none', outlineOffset: 2}} />
            ))}
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 22, fontSize: 24}}>
            <span><b style={{fontSize: 44}}>{present}</b> <span style={{color: C.muted}}>of 60 present</span></span>
            <span style={{color: present >= 20 ? C.ok : C.warn, fontWeight: 700, alignSelf: 'center'}}>{present >= 20 ? '✓ QUORATE · 20 needed' : '20 needed'}</span>
          </div>
        </Card>
        <Card at={T.vote + 4} out={T.check - 20} title="RESOLUTION R-001 · PAY LIFT AMC" style={{left: 1290, top: 80}}>
          {VOTERS.map(([n, aye], i) => {
            const on = f >= T.vote + 10 + i * 5;
            return (
              <div key={n} style={{display: 'flex', alignItems: 'center', padding: '11px 0', borderBottom: `1px solid ${C.line}`, fontSize: 24, opacity: on ? 1 : 0.3}}>
                <span>{n}</span>
                <span style={{marginLeft: 'auto', fontFamily: MONO, fontSize: 18, fontWeight: 600, color: aye ? C.ok : C.bad, background: `${aye ? C.ok : C.bad}22`, padding: '4px 12px', borderRadius: 6}}>{on ? (aye ? 'AYE' : 'NAY') : '—'}</span>
              </div>
            );
          })}
          <div style={{marginTop: 20, fontSize: 30, fontWeight: 800, color: C.ok, opacity: fade(f, T.passed, T.passed + 10)}}>PASSED 4–1 · recorded by name</div>
        </Card>
        <Card at={T.check - 12} title="PAYMENT GATE · INV-068" accent={C.ok} style={{left: 1290, top: 80}}>
          <Check at={T.check} label="Invoice on file" detail="INV-068 · Sahyadri Lifts · ₹68,000" />
          <Check at={T.check + 10} label="Resolution passed" detail="R-001 · 4–1 · quorate (41/20)" />
          <Check at={T.checked} label="Within bye-law 156" detail="limit ₹1,00,000 for 51+ members" />
          <div style={{marginTop: 26, display: 'flex', justifyContent: 'center'}}>
            {f >= T.booked + 10 && (
              <div style={{transform: `scale(${2 - stamp}) rotate(-6deg)`, opacity: stamp, border: `4px solid ${C.ok}`, color: C.ok, borderRadius: 14, padding: '10px 28px', fontSize: 44, fontWeight: 800, letterSpacing: 4}}>
                PAID ₹68,000
                <div style={{fontFamily: MONO, fontSize: 15, letterSpacing: 1, fontWeight: 500, textAlign: 'center'}}>mock UPI ref MOCK-INV-068-R-001</div>
              </div>
            )}
          </div>
        </Card>
      </Stage>
    </AbsoluteFill>
  );
};

// ---------------- 7. over the limit -> AGM
export const Limit = () => {
  const f = useCurrentFrame();
  const g = fade(f, 100, 150);
  const amt = Math.round(400000 * g);
  return (
    <AbsoluteFill>
      <Backdrop glow={C.warn} />
      <DockedHeadline kicker="Bye-law 156" text="Over the limit? Not even a vote can approve it." />
      <Stage>
        <div style={{position: 'absolute', left: 70, top: 30}}>
          <ChatWindow
            room="committee"
            w={1180}
            msgs={[...KICKOFF, {at: 54, who: 'rohan', text: '@byelaw check INV-400'}, {at: 92, who: 'byelaw', text: 'REFUSED over bye-law 156 limit ₹1,00,000 (51+ members); referred to AGM'}]}
            typing={[{from: 20, send: 54, who: 'rohan', text: '@byelaw check INV-400'}]}
          />
        </div>
        <Card at={92} title="INV-400 · KONKAN PAINTERS" accent={C.warn} style={{left: 1290, top: 80}}>
          <div style={{fontSize: 24, color: C.muted}}>Repaint the building exterior</div>
          <div style={{fontSize: 64, fontWeight: 800, margin: '8px 0 26px', fontVariantNumeric: 'tabular-nums'}}>₹{amt.toLocaleString('en-IN')}</div>
          <div style={{position: 'relative', height: 44, background: 'rgba(255,255,255,0.06)', borderRadius: 10}}>
            <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${Math.min(g * 4, 1) * 25}%`, background: C.ok, borderRadius: '10px 0 0 10px'}} />
            <div style={{position: 'absolute', left: '25%', top: 0, bottom: 0, width: `${Math.max(0, g * 4 - 1) * 25}%`, background: C.warn}} />
            <div style={{position: 'absolute', left: '25%', top: -12, bottom: -12, width: 3, background: '#fff'}} />
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 16, color: C.muted, marginTop: 14}}>
            <span style={{marginLeft: '17%'}}>committee limit ₹1,00,000</span>
          </div>
          <div style={{marginTop: 26, fontSize: 26, fontWeight: 700, color: C.warn, opacity: fade(f, 155, 170)}}>→ Added to the AGM agenda</div>
          <div style={{fontSize: 20, color: C.muted, opacity: fade(f, 165, 180)}}>Only the General Body can sanction it.</div>
        </Card>
      </Stage>
    </AbsoluteFill>
  );
};

// ---------------- 8. residents ask, the records answer
export const Ask = () => {
  const q = '@concierge Why did the society pay Rs 68,000 for the lift?';
  return (
    <AbsoluteFill>
      <Backdrop glow="#22D3EE" />
      <DockedHeadline kicker="Transparency for 60 residents" text="Residents ask. The records answer." />
      <Stage>
        <Camera keys={[{f: 0, x: 960, y: 465, s: 1}, {f: 120, x: 960, y: 465, s: 1}, {f: 170, x: 960, y: 590, s: 1.3}]}>
          <div style={{position: 'absolute', left: 140, top: 30}}>
            <ChatWindow
              room="general-body"
              msgs={[
                {at: -1, who: 'concierge', text: "Hi! I answer from the society's published ledger, minutes and agenda."},
                {at: 58, who: 'karan', text: q},
                {
                  at: 120, who: 'concierge',
                  text: "It was the lift's annual maintenance contract (AMC), invoice INV-068, approved by resolution R-001.",
                  quote: ['ledger.md   2026-11-06 · INV-068 · 68000 · R-001 · byelaw OK · PAID', 'minutes.md  R-001 passed 4-1 (0 abstain): Pay lift AMC (INV-068)'],
                },
              ]}
              typing={[{from: 14, send: 58, who: 'karan', text: q}]}
            />
          </div>
        </Camera>
      </Stage>
    </AbsoluteFill>
  );
};

// ---------------- 9. how it works + recorded live
const LAYERS: [string, string, string][] = [
  ['⛨  Switch', 'decides who may instruct each agent', C.bad],
  ['⚙  Rules engine', 'deterministic code: quorum, bye-law 156, payment gate', C.ok],
  ['✦  LLM', 'only talks: relays the engine’s one-line verdict, word for word', C.brand],
];
export const Layers = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Backdrop />
      
        <DockedHeadline kicker="Why you can trust it" text="Rules live in code, not in a prompt." />
        <Stage>
          <div style={{position: 'absolute', left: 260, top: 80, width: 1400, display: 'flex', flexDirection: 'column', gap: 22}}>
            {LAYERS.map(([name, what, col], i) => (
              <Row key={name} at={40 + i * 16}>
                <div style={{width: 300, fontSize: 36, fontWeight: 800, color: col}}>{name}</div>
                <div style={{fontSize: 30, color: '#D3D7E0'}}>{what}</div>
                <Sfx at={40 + i * 16} name="pop" volume={0.3} />
              </Row>
            ))}
            <div style={{display: 'flex', gap: 16, marginTop: 16, opacity: fade(f, 100, 120)}}>
              {['Hash-chained resolutions ledger', 'Exhibit-ready for the auditor', 'Payments mocked: no money held'].map((t) => (
                <div key={t} style={{flex: 1, textAlign: 'center', fontSize: 22, padding: '16px 10px', border: `1px solid ${C.line}`, borderRadius: 14, background: C.panel, color: '#C5CAD4'}}>{t}</div>
              ))}
            </div>
          </div>
        </Stage>
      
    </AbsoluteFill>
  );
};
export const Live = () => {
  const f = useCurrentFrame() + 180;
  const tilt = useSpring(-5, {damping: 20, stiffness: 90});
  return (
    <AbsoluteFill>
      <Backdrop />
      
        <AbsoluteFill style={{fontFamily: SANS, color: C.text}}>
          <div style={{position: 'absolute', left: 120, top: 250, width: 640}}>
            <div style={{fontFamily: MONO, fontSize: 22, letterSpacing: 4, color: C.brand, marginBottom: 20}}>RECORDED LIVE</div>
            <Words text="Every line is real agent output." size={66} style={{textAlign: 'left'}} />
            <div style={{marginTop: 34, display: 'flex', flexDirection: 'column', gap: 14, opacity: fade(f, 200, 225)}}>
              {['Switch + Mattermost, self-hosted', '15/15 Switch policy checks pass', 'Unit + integration tests in CI'].map((t) => (
                <div key={t} style={{fontSize: 26, color: '#C5CAD4'}}><span style={{color: C.ok, marginRight: 12}}>✓</span>{t}</div>
              ))}
            </div>
          </div>
          <div style={{position: 'absolute', left: 840, top: 150, width: 1000, perspective: 1600}}>
            <div style={{transform: `rotateY(${-12 * tilt + (1 - tilt) * -30}deg) rotateX(${3 * tilt}deg) translateX(${(1 - tilt) * 300}px)`, opacity: tilt, borderRadius: 18, overflow: 'hidden', boxShadow: '0 50px 140px rgba(0,0,0,0.7)', border: `1px solid ${C.line}`}}>
              <Img src={staticFile('shots/b3-6-final-committee.png')} style={{width: 1000, display: 'block', marginTop: -32, filter: 'brightness(1.25)'}} />
            </div>
          </div>
        </AbsoluteFill>
        <Sfx at={0} name="whoosh" volume={0.4} />
      
    </AbsoluteFill>
  );
};
const How = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={180}><Layers /></Sequence>
    <Sequence from={180}><Live /></Sequence>
  </AbsoluteFill>
);

// ---------------- 10. end card
export const End = () => {
  const f = useCurrentFrame();
  const s = useSpring(0);
  return (
    <AbsoluteFill>
      <Backdrop />
      <Center style={{flexDirection: 'column', gap: 26}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 30, opacity: s, transform: `scale(${0.9 + 0.1 * s})`}}>
          <Logo size={110} />
          <div style={{fontSize: 110, fontWeight: 800, letterSpacing: -4}}>Society Room</div>
        </div>
        <div style={{fontSize: 40, color: '#C5CAD4', opacity: fade(f, 14, 30)}}>Governance your auditor can sign.</div>
        <div style={{fontSize: 26, color: C.muted, opacity: fade(f, 26, 42)}}>For Maharashtra co-operative housing societies · Early access ₹15 per flat / month</div>
        <div style={{marginTop: 26, opacity: fade(f, 40, 56), transform: `translateY(${(1 - fade(f, 40, 56)) * 20}px)`, background: C.text, color: '#0B0D12', fontSize: 30, fontWeight: 700, padding: '20px 40px', borderRadius: 16, fontFamily: MONO}}>
          github.com/abhinav162/society-room
        </div>
        <div style={{marginTop: 30, fontSize: 22, color: C.muted, opacity: fade(f, 60, 76)}}>Built on <b style={{color: C.text}}>Switch</b> · Flip the Switch 2026</div>
      </Center>
      <Sfx at={40} name="chime" volume={0.4} />
    </AbsoluteFill>
  );
};

const PARTS: Record<string, React.FC> = {hook: Hook, problem: Problem, reveal: Reveal, template: Template, refuse: Refuse, meeting: Meeting, limit: Limit, ask: Ask, how: How, end: End};

export const Launch: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Audio src={staticFile('launch/music.wav')} volume={0.55} />
      {SCENES.map(([id, d], i) => {
        const P = PARTS[id];
        const start = from;
        from += d;
        return (
          <Sequence key={id} from={start} durationInFrames={d}>
            <SceneFade d={d}><P /></SceneFade>
            {i > 2 && <Sfx at={0} name="whoosh" volume={0.25} />}
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
