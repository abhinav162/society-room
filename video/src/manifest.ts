// v4 "Just Pay It". Storyboard: video-concept.md section 3 with the human's overrides. Engine lines are the real log (src/chatlog.json).
export const FPS = 30;
export const W = 1920;
export const H = 1080;

export type Msg = {who: string; text: string; at: number; kind?: 'user' | 'bot' | 'switch' | 'lease'; key?: boolean; typing?: number};
export type Panel = {label: string; lines: string[]; at: number};
export type Scene = {
  id: string;
  voice: string;
  voiceSec: number; // measured length of audio/<id>.mp3
  kind: 'wa' | 'cards' | 'chat' | 'code' | 'panels' | 'end';
  title: string;
  extra?: number;
  room?: string;
  chat?: Msg[];
  proof?: {src: string; note: string; zoom: {x: number; y: number; s: number}};
  wa?: {at: number; who: string; text: string; red?: boolean}[];
  notice?: {at: number; head: string; text: string};
  stamp?: {at: number; lines: string[]};
  cards?: {text: string; at: number; hi?: boolean}[];
  code?: {file: string; lines: {text: string; at: number; hi?: boolean}[]}[];
  panels?: Panel[];
  repo?: string;
  built?: string[];
};

const Q = 'pay the lift AMC invoice INV-068, 68000';
export const scenes: Scene[] = [
  {id: 's1', kind: 'wa', title: 'One message', voice: 'One message.', voiceSec: 2.4, extra: 1.2,
    wa: [{at: 0.4, who: 'Secretary', text: 'Lift AMC bill INV-068, ₹68,000. Just pay it.'}]},
  {id: 's2', kind: 'wa', title: 'No resolution. No quorum record.', voiceSec: 13.2, extra: 1,
    voice: "A society treasurer is an unpaid volunteer who signs for the society's money. When the registrar asks for the resolution behind a payment and there is none, the volunteer who signed is answerable.",
    wa: [{at: 0, who: 'Secretary', text: 'Lift AMC bill INV-068, ₹68,000. Just pay it.'}, {at: 1.6, who: 'Treasurer', text: 'Done ✓✓ Paid ₹68,000 by UPI'}],
    notice: {at: 5.2, head: "REGISTRAR'S OFFICE (fictional sample)", text: 'Show the resolution approving the ₹68,000 payment to Lift AMC.'},
    stamp: {at: 9.8, lines: ['No resolution.', 'No quorum record.', 'The volunteer who signed is answerable.']}},
  {id: 's3', kind: 'cards', title: 'Society Room', voiceSec: 5.2, extra: 0.8,
    voice: 'Resident apps log who approved it. Society Room proves they had the right to.',
    cards: [{text: 'Resident apps log who approved it.', at: 0.2}, {text: 'Society Room proves they had the right to.', at: 2.9, hi: true}]},
  {id: 's4', kind: 'chat', room: 'committee', title: 'Refused by Switch. The agent never ran.', voiceSec: 11.4, extra: 1,
    voice: 'Same message, into Society Room. Switch refuses it before the treasurer agent sees it. Not a prompt: addressing, enforced by the platform.',
    chat: [
      {who: 'abhinav', kind: 'user', at: 0.4, text: '@treasurer-agent ' + Q},
      {who: 'Switch', kind: 'switch', at: 4.6, typing: 0.8, key: true, text: "I only take instructions from my owner, and this chat account isn't linked to a Switch user yet"},
    ]},
  {id: 's5', kind: 'code', title: 'addressing: owner = only the Treasurer may instruct', voiceSec: 10.8, extra: 1,
    voice: 'One template creates both rooms and four agents. The treasurer agent takes instructions from its owner only. Fifteen of fifteen addressing checks pass.',
    code: [
      {file: 'switch/society-room.yaml', lines: [
        {text: 'treasurer_agent:', at: 1.5}, {text: '  name: treasurer-agent', at: 2.2}, {text: '  addressing: owner', at: 3.5, hi: true}]},
      {file: 'docs/adr/evidence/addressing_check.out (Switch 0.31 policy code)', lines: [
        {text: 'PASS owner_only: Treasurer -> treasurer-agent -> allowed', at: 6.0},
        {text: 'PASS owner_only: member-7 -> treasurer-agent -> refused', at: 6.6},
        {text: 'PASS owner_only: unlinked chat account -> treasurer-agent -> refused', at: 7.2},
        {text: 'ALL PASS  (15/15)', at: 8.6, hi: true}]},
    ]},
  {id: 's6', kind: 'chat', room: 'committee', title: 'Even the owner: no resolution, no payment', voiceSec: 5.5, extra: 1.2,
    voice: 'Even the Treasurer is refused. No passed resolution for this invoice.',
    chat: [
      {who: 'user', kind: 'user', at: 0.3, text: '@treasurer-agent ' + Q},
      {who: 'treasurer-agent', kind: 'bot', at: 2.8, typing: 1.3, key: true, text: 'REFUSED no passed resolution for invoice INV-068'},
    ]},
  {id: 's7', kind: 'chat', room: 'committee', title: 'Exclusive role: meeting-chair · Quorum 41 present, 20 needed', voiceSec: 17.2, extra: 1,
    voice: 'The Chairman opens a meeting. The clerk takes the exclusive meeting-chair role, counts quorum, forty-one present, twenty needed, and records each vote by name. R-001 passes four to one, and the role is released.',
    chat: [
      {who: 'user', kind: 'user', at: 0.4, text: '@clerk open a meeting. Present: member-1 to member-41. I am the chair.'},
      {who: 'clerk', kind: 'lease', at: 3.8, text: 'assumed the meeting-chair role'},
      {who: 'clerk', kind: 'bot', at: 8.6, typing: 1.5, key: true, text: 'OK meeting open: 41 present, 20 needed, chair user'},
      {who: 'user', kind: 'user', at: 10.6, text: '@clerk record a vote on INV-068, motion "Pay lift AMC": member-1, member-2, member-3, member-4 aye; member-5 nay.'},
      {who: 'clerk', kind: 'bot', at: 14.2, typing: 1.0, key: true, text: 'OK R-001 passed 4-1 (0 abstain)'},
      {who: 'user', kind: 'user', at: 15.2, text: '@clerk close the meeting'},
      {who: 'clerk', kind: 'bot', at: 16.0, typing: 0.5, text: 'OK meeting closed'},
      {who: 'clerk', kind: 'lease', at: 16.5, text: 'released the meeting-chair role'},
    ]},
  {id: 's8', kind: 'chat', room: 'committee', title: 'Invoice + resolution + bye-law check = booked', voiceSec: 7.5, extra: 2,
    voice: 'Now, and only now, the treasurer agent books it: invoice, resolution and bye-law check, all three.',
    chat: [
      {who: 'user', kind: 'user', at: 0.3, text: '@byelaw check INV-068'},
      {who: 'byelaw', kind: 'bot', at: 2.4, typing: 0.8, key: true, text: 'OK 68000 is within bye-law 156: committee limit 100000 for 51+ members'},
      {who: 'user', kind: 'user', at: 4.0, text: '@treasurer-agent book INV-068 under resolution R-001'},
      {who: 'treasurer-agent', kind: 'bot', at: 6.0, typing: 0.9, key: true, text: 'OK booked INV-068 68000 under R-001, mock UPI ref MOCK-INV-068-R-001'},
    ]},
  {id: 's9', kind: 'panels', title: 'Every rupee links to an invoice, a resolution and a rule', voiceSec: 10.1, extra: 1.5,
    voice: 'This is what the auditor signs. The ledger line cites the invoice and the resolution. The resolution records who voted. The bye-law sets the limit.',
    panels: [
      {at: 2.0, label: 'ledger.md — line quoted by the concierge in the live run', lines: ['2026-11-06 · INV-068 · 68000 · R-001 · byelaw OK', 'PAID, mock UPI ref MOCK-INV-068-R-001']},
      {at: 5.0, label: 'resolutions.jsonl R-001 — votes by name (names: room/members.yaml, fictional)', lines: ['motion "Pay lift AMC": 4 aye, 1 nay, 41 present', 'aye: Aarav, Priya, Rohan, Sneha Patil   nay: Vikram Patil']},
      {at: 7.6, label: 'room/byelaws.yaml', lines: ['"156": tiers: ... {max_members: null, limit: 100000}']},
    ]},
  {id: 's10', kind: 'chat', room: 'committee', title: 'Rs 4,00,000 bid → AGM agenda, even with a vote', voiceSec: 10.5, extra: 1.5,
    voice: 'A four-lakh repainting bid is over the limit for a society this size. The committee cannot approve it, even by vote. It goes to the General Body.',
    chat: [
      {who: 'user', kind: 'user', at: 0.6, text: '@byelaw check INV-400'},
      {who: 'byelaw', kind: 'bot', at: 3.4, typing: 1.2, key: true, text: 'REFUSED over bye-law 156 limit ₹1,00,000 (51+ members); referred to AGM'},
    ]},
  {id: 's11', kind: 'chat', room: 'general-body', title: 'A member asks. The records answer.', voiceSec: 9.8, extra: 3.5,
    voice: "In the residents' room a member asks why the lift cost sixty-eight thousand. The concierge answers only from the published records, and cites them.",
    proof: {src: 'b5-2-concierge-reply.png', note: 'Real screenshot of the live run', zoom: {x: 41, y: 79, s: 2.1}},
    chat: [
      {who: 'user', kind: 'user', at: 0.8, text: '@concierge Why did the society pay Rs 68,000 for the lift?'},
      {who: 'concierge', kind: 'bot', at: 5.0, typing: 2.0, key: true, text: "It was the lift's annual maintenance contract (AMC), invoice INV-068, approved by resolution R-001.\n\nFrom ledger.md:\n2026-11-06 · INV-068 · 68000 · R-001 · byelaw OK · PAID, mock UPI ref MOCK-INV-068-R-001\n\nFrom minutes.md:\n2026-11-06: R-001 passed 4-1 (0 abstain): Pay lift AMC (INV-068)\n\nresolutions.jsonl (R-001) records the motion \"Pay lift AMC\" with 4 aye and 1 nay, 41 present."},
    ]},
  {id: 's12', kind: 'end', title: 'Built on Switch', voiceSec: 7.25, extra: 4,
    voice: 'Switch decides who may instruct. The engine decides what is allowed. Same ledger the auditor signs.', repo: 'github.com/abhinav162/society-room',
    built: ['Owner-only addressing: only the Treasurer can instruct the treasurer-agent', 'Exclusive meeting-chair role lease', 'Linked rooms: residents read published records', 'Deterministic engine, hash-chained records']},
];
