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
  kind: 'text' | 'image' | 'shots';
  title: string;
  sub?: string;
  image?: string; // for kind image: file in public/design
  shots?: Shot[];
  marks?: string[]; // text kind: phrases to highlight
};

export const scenes: Scene[] = [
  {
    id: 'opening', kind: 'text', title: 'Society Room', sub: 'Money leaves only after a recorded, quorate, bye-law-compliant resolution',
    voice: "In Maharashtra, housing society committees are unpaid volunteers who sign for crores, and registrars dissolve committees that cannot show a recorded resolution. Apps like MyGate log who approved a payment. Society Room makes sure they had the right to: an invoice, a quorate vote by name, and the bye-law limit. Rules are enforced by Switch roles and deterministic code, not by a prompt. First buyer: the society's auditor, who signs off on exactly these records.",
    voiceSec: 27.7,
    marks: ['unpaid volunteers', 'dissolve committees', 'an invoice', 'a quorate vote by name', 'the bye-law limit', 'not by a prompt', "the society's auditor"],
  },
  {id: 'b1', kind: 'image', title: 'B1: one template, whole society', image: 'architecture.png',
    voice: 'One template creates both rooms and four agents.', voiceSec: 2.8},
  {id: 'b2', kind: 'shots', title: 'B2: "just pay it" is refused',
    voice: "A resident says 'just pay it'. Switch itself stops the message: the agent never sees it. Even the Treasurer is refused: no resolution.", voiceSec: 8.5, shots: []},
  {id: 'b3', kind: 'shots', title: 'B3: quorum, vote by name, booked',
    voice: 'The Chairman opens the meeting; the clerk counts quorum, 20 needed, 41 present, and records the vote by name. Only now does the treasurer book: invoice, resolution and bye-law check, all three.', voiceSec: 12.5, shots: []},
  {id: 'b4', kind: 'shots', title: 'B4: Rs 4 lakh goes to the AGM',
    voice: 'A Rs 4 lakh repainting bid is over the bye-law 156 limit for a society this size. It cannot be approved by the committee, even with a vote. It goes to the General Body agenda.', voiceSec: 10.9, shots: []},
  {id: 'b5', kind: 'shots', title: 'B5: a resident asks, the records answer',
    voice: 'In the General Body room a resident asks why the society paid the lift contractor. The concierge answers only from the published ledger and minutes, and cites them.', voiceSec: 9.2, shots: []},
  {id: 'closing', kind: 'image', title: 'Switch decides who may instruct. The engine decides what is allowed.', image: 'payment-gate.png',
    voice: 'Switch decides who may instruct; the engine decides what is allowed. Same ledger the auditor signs.', voiceSec: 5.9},
];
