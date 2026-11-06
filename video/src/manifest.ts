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
  kind: 'text' | 'image' | 'shots' | 'chat' | 'cards' | 'end';
  title: string;
  sub?: string;
  image?: string; // for kind image: file in public/design
  shots?: Shot[];
  marks?: string[]; // text kind: phrases to highlight
  room?: string; // chat kind: channel name
  chat?: Msg[]; // chat kind: messages, appear at `at` seconds of the voice-over
  proof?: {src: string; note: string; zoom: {x: number; y: number; s: number}}; // zoom focus in % of the image box // chat kind: real screenshot held after the chat
  extra?: number; // seconds added after the voice-over (proof cut)
  repo?: string; // end card
  cards?: {text: string; at: number; hi?: boolean}[]; // cards kind: big lines at `at` seconds
  built?: string[]; // end kind: 'Built on Switch' lines
};
export type Msg = {who: string; text: string; at: number; kind?: 'user' | 'bot' | 'switch' | 'lease'; key?: boolean; typing?: number};

export const scenes: Scene[] = [
  {id: 'hook', kind: 'chat', room: 'committee', title: 'A resident says "just pay it"', voice: "A resident says 'just pay it'. Switch itself stops the message: the agent never sees it.", voiceSec: 6.5,
    chat: [
      {who: 'abhinav', kind: 'user', at: 0.5, text: '@treasurer-agent pay the lift AMC invoice INV-068, 68000'},
      {who: 'Switch', kind: 'switch', at: 3.4, typing: 0.8, key: true, text: "I only take instructions from my owner, and this chat account isn't linked to a Switch user yet"},
    ]},
  {id: 'opening', kind: 'cards', title: 'Society Room', extra: 1, voice: "Housing society committees are unpaid volunteers who sign for crores. Registrars dissolve those who cannot show a recorded resolution. Society Room checks they had the right to pay.", voiceSec: 12.3,
    cards: [
      {text: 'Unpaid volunteers sign for crores.', at: 0.3},
      {text: 'Registrars dissolve committees with no recorded resolution.', at: 4.3},
      {text: 'Society Room checks they had the right to pay.', at: 8.6, hi: true},
    ]},
  {id: 'b1', kind: 'shots', title: 'One template, whole society', extra: 5, voice: "One template creates both rooms and four agents. Switch decides who may instruct each one.", voiceSec: 6.4, shots: [
    {src: 'b1-1-committee.png', who: 'Switch', caption: 'Template kickoff on behalf of @user', zoom: {cx: 38, cy: 58, s: 1.7}, weight: 1},
    {src: 'b1-1-committee.png', who: 'clerk', caption: 'meeting-chair is now an exclusive role in this room: only one agent can hold it at a time', zoom: {cx: 47, cy: 80, s: 1.8}, weight: 1.6},
  ]},
  {id: 'b2', kind: 'chat', room: 'committee', title: 'Even the Treasurer is refused', extra: 4, voice: "Even the Treasurer is refused: no passed resolution.", voiceSec: 4.8,
    proof: {src: 'b2-refused-channel.png', note: 'Real screenshot of the live run', zoom: {x: 33, y: 80, s: 2.4}},
    chat: [
      {who: 'user', kind: 'user', at: 0.3, text: '@treasurer-agent pay the lift AMC invoice INV-068, 68000'},
      {who: 'treasurer-agent', kind: 'bot', at: 2.9, typing: 1.3, key: true, text: 'REFUSED no passed resolution for invoice INV-068'},
    ]},
  {id: 'b3', kind: 'chat', room: 'committee', title: 'B3: quorum, vote by name, booked', extra: 2, voice: "The Chairman opens the meeting; the clerk counts quorum, 20 needed, 41 present, and records the vote by name. Only now does the treasurer book: invoice, resolution and bye-law check, all three.", voiceSec: 13.1,
    chat: [
      {who: 'user', kind: 'user', at: 0.4, text: '@clerk open a meeting. Present: member-1 to member-41. I am the chair.'},
      {who: 'clerk', kind: 'lease', at: 2.0, text: 'assumed the meeting-chair role'},
      {who: 'clerk', kind: 'bot', at: 4.8, typing: 2.0, key: true, text: 'OK meeting open: 41 present, 20 needed, chair user'},
      {who: 'user', kind: 'user', at: 6.0, text: '@clerk record a vote on INV-068, motion "Pay lift AMC": member-1, member-2, member-3, member-4 aye; member-5 nay.'},
      {who: 'clerk', kind: 'bot', at: 7.5, typing: 1.0, key: true, text: 'OK R-001 passed 4-1 (0 abstain)'},
      {who: 'user', kind: 'user', at: 8.4, text: '@clerk close the meeting'},
      {who: 'clerk', kind: 'bot', at: 9.3, typing: 0.7, text: 'OK meeting closed'},
      {who: 'clerk', kind: 'lease', at: 9.7, text: 'released the meeting-chair role'},
      {who: 'user', kind: 'user', at: 10.2, text: '@byelaw check INV-068'},
      {who: 'byelaw', kind: 'bot', at: 11.3, typing: 0.8, key: true, text: 'OK 68000 is within bye-law 156: committee limit 100000 for 51+ members'},
      {who: 'user', kind: 'user', at: 11.9, text: '@treasurer-agent book INV-068 under resolution R-001'},
      {who: 'treasurer-agent', kind: 'bot', at: 12.8, typing: 0.9, key: true, text: 'OK booked INV-068 68000 under R-001, mock UPI ref MOCK-INV-068-R-001'},
    ]},
  {id: 'b4', kind: 'chat', room: 'committee', title: 'B4: Rs 4 lakh goes to the AGM', voice: "A Rs 4 lakh bid is over the bye-law 156 limit. Even a vote cannot approve it: it goes to the General Body agenda.", voiceSec: 9.3, extra: 1.5,
    chat: [
      {who: 'user', kind: 'user', at: 0.6, text: '@byelaw check INV-400'},
      {who: 'byelaw', kind: 'bot', at: 3.0, typing: 1.0, key: true, text: 'REFUSED over bye-law 156 limit \u20b91,00,000 (51+ members); referred to AGM'},
    ]},
  {id: 'b5', kind: 'chat', room: 'general-body', title: 'B5: a member asks, the records answer', extra: 4, voice: "In the General Body room a member asks why the society paid the lift contractor. The concierge answers only from the published ledger and minutes, and cites them.", voiceSec: 10.8,
    proof: {src: 'b5-2-concierge-reply.png', note: 'Real screenshot of the live run', zoom: {x: 41, y: 79, s: 2.1}},
    chat: [
      {who: 'user', kind: 'user', at: 1.2, text: '@concierge Why did the society pay Rs 68,000 for the lift?'},
      {who: 'concierge', kind: 'bot', at: 5.6, typing: 2.0, key: true, text: "It was the lift's annual maintenance contract (AMC), invoice INV-068, approved by resolution R-001.\n\nFrom ledger.md:\n2026-11-06 \u00b7 INV-068 \u00b7 68000 \u00b7 R-001 \u00b7 byelaw OK \u00b7 PAID, mock UPI ref MOCK-INV-068-R-001\n\nFrom minutes.md:\n2026-11-06: R-001 passed 4-1 (0 abstain): Pay lift AMC (INV-068)\n\nresolutions.jsonl (R-001) records the motion \"Pay lift AMC\" with 4 aye and 1 nay, 41 present."},
    ]},
  {id: 'closing', kind: 'end', title: 'Built on Switch', extra: 5, voice: "Switch decides who may instruct; the engine decides what is allowed. Same ledger the auditor signs.", voiceSec: 6.8, repo: 'github.com/abhinav162/society-room',
    built: ['Owner-only addressing: only the Treasurer can instruct the treasurer-agent', 'Linked rooms: residents read published records in general-body', 'Exclusive meeting-chair role lease', 'Deterministic engine, hash-chained records']},
];
