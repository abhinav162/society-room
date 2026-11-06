# Demo script (rehearse and record from this page)

Target: under 3 minutes of final video. Agent replies take 5 to 30 seconds live, so record each beat, then cut the waiting in the edit and keep the voice-over over the cuts. Every "expected reply" below is the CLI's exact output line (verified by running the commands on the seeded room); the agent posts it word for word. Prose from `concierge` (beat 5) and Switch's own refusal text (beat 2) are the only non-fixed lines.

Cast: Mattermost `user` = Treasurer **and** Chairman (it runs the template, so it owns the agents). Mattermost `abhinav` = `member-7`, the outsider, not linked to Switch. Setup and linking: `docs/setup.md` steps 1 to 5.

## Step 0: reset and template (off camera)

Run in a terminal, from the repo root:

```bash
cd /Users/apple/Desktop/den/switch-hackathon/society-room
rm -f room/agenda.md room/minutes.md room/ledger.md room/resolutions.jsonl room/meeting.json
```

Then in Switch Console, signed in as `admin`: "run a template from YAML", paste `switch/society-room.yaml`, leave the room folder prefilled. Expect rooms `committee`, `general-body` and agents `clerk`, `treasurer-agent`, `byelaw`, `concierge`. If you re-run the template, delete the old rooms and agents first. Check `abhinav` is in `committee`, and in `general-body` for beat 5.

## Opening: the 30-second business framing (voice-over on the title card)

> "In Maharashtra, housing society committees are unpaid volunteers who sign for crores, and registrars dissolve committees that cannot show a recorded resolution. Apps like MyGate log who approved a payment. Society Room makes sure they had the right to: an invoice, a quorate vote by name, and the bye-law limit. Rules are enforced by Switch roles and deterministic code, not by a prompt. First buyer: the society's auditor, who signs off on exactly these records."

(About 70 words, 25 to 30 seconds.)

## B1: one template, whole society (about 10 s)

- Show: Console with the template run, then `#committee` and `#general-body` side by side with the four agents.
- Post: nothing (kickoff message from the template appears).
- Expected: clerk defines the `meeting-chair` role.
- Voice-over: "One template creates both rooms and four agents."

## B2: "just pay it" is refused (about 25 s), room `#committee`

| # | Who | Paste | Expected |
|---|---|---|---|
| 1 | `abhinav` | `@treasurer-agent pay the lift AMC invoice INV-068, 68000` | Switch replies at once: "I only take instructions from my owner, and this chat account isn't linked to a Switch user yet" (or "You're not permitted to direct messages to me in this room"). The agent does nothing. |
| 2 | `user` | `@treasurer-agent pay the lift AMC invoice INV-068, 68000` | `REFUSED no passed resolution for invoice INV-068` (about 30 s) |

- Voice-over: "A resident says 'just pay it'. Switch itself stops the message: the agent never sees it. Even the Treasurer is refused: no resolution."

## B3: quorum, vote by name, booked (about 45 s), room `#committee`, all posted by `user`

| # | Paste | Expected |
|---|---|---|
| 1 | `@clerk open a meeting. Present: member-1 to member-41. I am the chair.` | `OK meeting open: 41 present, 20 needed, chair user`. Then `!roles` shows `meeting-chair` held by Clerk. |
| 2 | `@clerk record a vote on INV-068, motion "Pay lift AMC": member-1, member-2, member-3, member-4 aye; member-5 nay.` | `OK R-001 passed 4-1 (0 abstain)` |
| 3 | `@clerk close the meeting` | `OK meeting closed` (role released: `!roles` shows no holder) |
| 4 | `@byelaw check INV-068` | `OK 68000 is within bye-law 156: committee limit 100000 for 51+ members` |
| 5 | `@treasurer-agent book INV-068 under resolution R-001` | `OK booked INV-068 68000 under R-001, mock UPI ref MOCK-INV-068-R-001` |

- Voice-over: "The Chairman opens the meeting; the clerk counts quorum, 20 needed, 41 present, and records the vote by name. Only now does the treasurer book: invoice, resolution and bye-law check, all three."
- Optional 5-second shot: `room/ledger.md` shows the `PAID, mock UPI ref` line.

## B4: Rs 4 lakh goes to the AGM (about 25 s), room `#committee`, posted by `user`

| # | Paste | Expected |
|---|---|---|
| 1 | `@byelaw check INV-400` (post it once only: each call adds an agenda line) | `REFUSED over bye-law 156 limit ₹1,00,000 (51+ members); referred to AGM` |

- Voice-over: "A Rs 4 lakh repainting bid is over the bye-law 156 limit for a society this size. It cannot be approved by the committee, even with a vote. It goes to the General Body agenda."
- Optional shot: `room/agenda.md` shows the INV-400 line.

## B5: a resident asks, the records answer (about 25 s), room `#general-body`, posted by `abhinav` (as a resident)

| # | Paste | Expected |
|---|---|---|
| 1 | `@concierge Why did maintenance go up Rs 95 a month?` | Prose, no CLI line. Must cite `ledger.md` (INV-068, 68000, R-001), `minutes.md` (R-001 passed 4-1) and say 68,000 / 60 flats / 12 months is about Rs 95 a month. If it invents a figure not in the files, re-record. |

- Voice-over: "In the General Body room a resident asks why the bill went up. The concierge answers only from the published ledger and minutes, and cites them."

## Closing (5 s)

> "Switch decides who may instruct; the engine decides what is allowed. Same ledger the auditor signs."

## Rehearsal checks (do not skip)

- Before each take run the reset in step 0, or beat 3 will say a resolution already exists.
- Run the whole script once with the camera off. Compare each reply to the table; if any CLI line differs, the CLI output is right: tell Kelly and the table is updated.
- PER-88 noted one failed tool call in the treasurer agent's thread though the answer was correct. Check the session log before recording.
- Hash limit to say only if asked: `resolutions.jsonl` proves records were not edited by hand, not who wrote them.
