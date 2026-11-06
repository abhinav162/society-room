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
    voiceSec: 32.3,
    marks: ['unpaid volunteers', 'dissolve committees', 'an invoice', 'a quorate vote by name', 'the bye-law limit', 'not by a prompt', "the society's auditor"],
  },
  {id: 'b1', kind: 'image', title: 'B1: one template, whole society', image: 'architecture.png',
    voice: 'One template creates both rooms and four agents.', voiceSec: 5.6},
  {id: 'b2', kind: 'shots', title: 'B2: "just pay it" is refused',
    voice: "A resident says 'just pay it'. Switch itself stops the message: the agent never sees it. Even the Treasurer is refused: no resolution.", voiceSec: 9.2, shots: [
      {src: 'b2-1b-after-post.png', who: 'abhinav', caption: '@treasurer-agent pay the lift AMC invoice INV-068, 68000', zoom: {cx: 40.8, cy: 60, s: 1.15}, weight: 1},
      {src: 'b2-1d-switch-reply-thread.png', who: 'Switch', caption: "I only take instructions from my owner, and this chat account isn't linked to a Switch user yet", zoom: {cx: 71.3, cy: 78, s: 1.45}, weight: 1.5},
      {src: 'b2-2b-treasurer-asks.png', who: 'treasurer-agent', caption: 'Which resolution approves it? Reply with the resolution id, or "none".', zoom: {cx: 71.3, cy: 78, s: 1.45}, weight: 1},
      {src: 'b2-2d-refused-thread.png', who: 'treasurer-agent', caption: 'REFUSED no passed resolution for invoice INV-068', zoom: {cx: 73.2, cy: 86, s: 1.7}, weight: 1.5},
    ]},
  {id: 'b3', kind: 'shots', title: 'B3: quorum, vote by name, booked',
    voice: 'The Chairman opens the meeting; the clerk counts quorum, 20 needed, 41 present, and records the vote by name. Only now does the treasurer book: invoice, resolution and bye-law check, all three.', voiceSec: 13.1, shots: [
      {src: 'b3-6-final-committee.png', who: 'clerk', caption: 'OK meeting open: 41 present, 20 needed, chair user', zoom: {cx: 40.8, cy: 17, s: 1.6}, weight: 1},
      {src: 'b3-6-final-committee.png', who: 'clerk', caption: 'OK R-001 passed 4-1 (0 abstain)', zoom: {cx: 40.8, cy: 28, s: 1.6}, weight: 1},
      {src: 'b3-6-final-committee.png', who: 'clerk', caption: 'OK meeting closed', zoom: {cx: 40.8, cy: 42, s: 1.6}, weight: 0.7},
      {src: 'b3-6-final-committee.png', who: 'byelaw', caption: 'OK 68000 is within bye-law 156: committee limit 100000 for 51+ members', zoom: {cx: 40.8, cy: 58, s: 1.6}, weight: 1},
      {src: 'b3-6-final-committee.png', who: 'treasurer-agent', caption: 'OK booked INV-068 68000 under R-001, mock UPI ref MOCK-INV-068-R-001', zoom: {cx: 40.8, cy: 73, s: 1.6}, weight: 1.3},
    ]},
  {id: 'b4', kind: 'shots', title: 'B4: Rs 4 lakh goes to the AGM',
    voice: 'A Rs 4 lakh repainting bid is over the bye-law 156 limit for a society this size. It cannot be approved by the committee, even with a vote. It goes to the General Body agenda.', voiceSec: 13.0, shots: [
      {src: 'b3-6-final-committee.png', who: 'user', caption: '@byelaw check INV-400', zoom: {cx: 40.8, cy: 80, s: 1.5}, weight: 1},
      {src: 'b3-6-final-committee.png', who: 'byelaw', caption: 'REFUSED over bye-law 156 limit ₹1,00,000 (51+ members); referred to AGM', zoom: {cx: 40.8, cy: 88, s: 1.8}, weight: 1.6},
    ]},
  {id: 'b5', kind: 'shots', title: 'B5: a resident asks, the records answer',
    voice: 'In the General Body room a resident asks why the society paid the lift contractor. The concierge answers only from the published ledger and minutes, and cites them.', voiceSec: 11.2, shots: [
      {src: 'b5-2-concierge-reply.png', who: 'user', caption: '@concierge Why did the society pay Rs 68,000 for the lift?', zoom: {cx: 40.8, cy: 63, s: 1.5}, weight: 0.8},
      {src: 'b5-2-concierge-reply.png', who: 'concierge', caption: 'INV-068, approved by resolution R-001. From ledger.md: INV-068, 68000, R-001, PAID', zoom: {cx: 43.9, cy: 78, s: 1.5}, weight: 1.2},
      {src: 'b5-2-concierge-reply.png', who: 'concierge', caption: 'From minutes.md: R-001 passed 4-1 (0 abstain).', zoom: {cx: 43.9, cy: 88, s: 1.5}, weight: 1.2},
    ]},
  {id: 'closing', kind: 'image', title: 'Switch decides who may instruct. The engine decides what is allowed.', image: 'payment-gate.png',
    voice: 'Switch decides who may instruct; the engine decides what is allowed. Same ledger the auditor signs.', voiceSec: 6.8},
];
