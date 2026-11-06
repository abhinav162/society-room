// Storyboard = docs/demo-script.md. Shots are real screenshots in public/shots/ (see public/shots/README.md).
export const FPS = 30;
export const W = 1920;
export const H = 1080;

export type Shot = {
  src: string; // file in public/shots
  who?: string; // who posted (caption chip)
  caption?: string; // typed in over the shot (a posted line or a reply)
  zoom?: {cx: number; cy: number; s: number}; // focus point in % of the image, scale
  weight?: number; // share of the scene time (default 1)
};
export type Scene = {
  id: string;
  voice: string; // voice-over text, word for word from the script
  voiceSec: number; // measured length of audio/<id>.mp3
  kind: 'text' | 'image' | 'shots' | 'chat';
  title: string;
  sub?: string;
  image?: string; // for kind image: file in public/design
  shots?: Shot[];
  marks?: string[]; // text kind: phrases to highlight
  room?: string; // chat kind: channel name
  chat?: Msg[]; // chat kind: messages, appear at `at` seconds of the voice-over
  proof?: {src: string; note: string}; // chat kind: real screenshot held after the chat
  extra?: number; // seconds added after the voice-over (proof cut)
  repo?: string; // closing card
};
export type Msg = {who: string; text: string; at: number; kind?: 'user' | 'bot' | 'switch' | 'sys'; key?: boolean; typing?: number};

export const scenes: Scene[] = [
  {
    id: 'opening', kind: 'text', title: 'Society Room', sub: 'Money leaves only after a recorded, quorate, bye-law-compliant resolution',
    voice: "In Maharashtra, housing society committees are unpaid volunteers who sign for crores, and registrars dissolve committees that cannot show a recorded resolution. Apps like MyGate log who approved a payment. Society Room makes sure they had the right to: an invoice, a quorate vote by name, and the bye-law limit. Rules are enforced by Switch roles and deterministic code, not by a prompt. First buyer: the society's auditor, who signs off on exactly these records.",
    voiceSec: 32.3,
    marks: ['unpaid volunteers', 'dissolve committees', 'an invoice', 'a quorate vote by name', 'the bye-law limit', 'not by a prompt', "the society's auditor"],
  },
  {id: 'b1', kind: 'image', title: 'B1: one template, whole society', image: 'architecture.png',
    voice: 'One template creates both rooms and four agents.', voiceSec: 5.6},
  {id: 'b2', kind: 'chat', room: 'committee', title: 'B2: "just pay it" is refused', extra: 3,
    voice: "A resident says 'just pay it'. Switch itself stops the message: the agent never sees it. Even the Treasurer is refused: no resolution.", voiceSec: 9.2,
    proof: {src: 'b2-refused-channel.png', note: 'Real screenshot of the live run'},
    chat: [
      {who: 'abhinav', kind: 'user', at: 0.5, text: '@treasurer-agent pay the lift AMC invoice INV-068, 68000'},
      {who: 'Switch', kind: 'switch', at: 3.0, typing: 1.0, text: "I only take instructions from my owner, and this chat account isn't linked to a Switch user yet"},
      {who: 'user', kind: 'user', at: 6.0, text: '@treasurer-agent pay the lift AMC invoice INV-068, 68000'},
      {who: 'treasurer-agent', kind: 'bot', at: 8.2, typing: 1.8, key: true, text: 'REFUSED no passed resolution for invoice INV-068'},
    ]},
  {id: 'b3', kind: 'chat', room: 'committee', title: 'B3: quorum, vote by name, booked',
    voice: 'The Chairman opens the meeting; the clerk counts quorum, 20 needed, 41 present, and records the vote by name. Only now does the treasurer book: invoice, resolution and bye-law check, all three.', voiceSec: 13.1,
    chat: [
      {who: 'user', kind: 'user', at: 0.4, text: '@clerk open a meeting. Present: member-1 to member-41. I am the chair.'},
      {who: 'clerk', kind: 'sys', at: 2.0, text: 'assumed the meeting-chair role'},
      {who: 'clerk', kind: 'bot', at: 4.8, typing: 2.0, key: true, text: 'OK meeting open: 41 present, 20 needed, chair user'},
      {who: 'user', kind: 'user', at: 6.0, text: '@clerk record a vote on INV-068, motion "Pay lift AMC": member-1, member-2, member-3, member-4 aye; member-5 nay.'},
      {who: 'clerk', kind: 'bot', at: 7.5, typing: 1.0, key: true, text: 'OK R-001 passed 4-1 (0 abstain)'},
      {who: 'user', kind: 'user', at: 8.4, text: '@clerk close the meeting'},
      {who: 'clerk', kind: 'bot', at: 9.3, typing: 0.7, text: 'OK meeting closed'},
      {who: 'user', kind: 'user', at: 10.0, text: '@byelaw check INV-068'},
      {who: 'byelaw', kind: 'bot', at: 11.2, typing: 0.9, key: true, text: 'OK 68000 is within bye-law 156: committee limit 100000 for 51+ members'},
      {who: 'user', kind: 'user', at: 11.8, text: '@treasurer-agent book INV-068 under resolution R-001'},
      {who: 'treasurer-agent', kind: 'bot', at: 12.8, typing: 0.9, key: true, text: 'OK booked INV-068 68000 under R-001, mock UPI ref MOCK-INV-068-R-001'},
    ]},
  {id: 'b4', kind: 'chat', room: 'committee', title: 'B4: Rs 4 lakh goes to the AGM',
    voice: 'A Rs 4 lakh repainting bid is over the bye-law 156 limit for a society this size. It cannot be approved by the committee, even with a vote. It goes to the General Body agenda.', voiceSec: 13.0,
    chat: [
      {who: 'user', kind: 'user', at: 1.0, text: '@byelaw check INV-400'},
      {who: 'byelaw', kind: 'bot', at: 5.0, typing: 2.5, key: true, text: 'REFUSED over bye-law 156 limit \u20b91,00,000 (51+ members); referred to AGM'},
    ]},
  {id: 'b5', kind: 'chat', room: 'general-body', title: 'B5: a resident asks, the records answer', extra: 3,
    voice: 'In the General Body room a resident asks why the society paid the lift contractor. The concierge answers only from the published ledger and minutes, and cites them.', voiceSec: 11.2,
    proof: {src: 'b5-2-concierge-reply.png', note: 'Real screenshot of the live run'},
    chat: [
      {who: 'user', kind: 'user', at: 2.0, text: '@concierge Why did the society pay Rs 68,000 for the lift?'},
      {who: 'concierge', kind: 'bot', at: 7.0, typing: 2.5, key: true, text: "It was the lift's annual maintenance contract (AMC), invoice INV-068, approved by resolution R-001.\n\nFrom ledger.md:\n2026-11-06 \u00b7 INV-068 \u00b7 68000 \u00b7 R-001 \u00b7 byelaw OK \u00b7 PAID, mock UPI ref MOCK-INV-068-R-001\n\nFrom minutes.md:\n2026-11-06: R-001 passed 4-1 (0 abstain): Pay lift AMC (INV-068)\n\nresolutions.jsonl (R-001) records the motion \"Pay lift AMC\" with 4 aye and 1 nay, 41 present."},
    ]},
  {id: 'closing', kind: 'image', title: 'Switch decides who may instruct. The engine decides what is allowed.', image: 'payment-gate.png',
    voice: 'Switch decides who may instruct; the engine decides what is allowed. Same ledger the auditor signs.', voiceSec: 6.8, extra: 3, repo: 'github.com/abhinav162/society-room'},
];
