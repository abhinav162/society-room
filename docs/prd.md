# Society Room: PRD (hackathon MVP)

Owner: Kelly (product). Source: `docs/business-plan.md` section 8. Track 1, Best Business Workflow. Submit by Sat 2026-11-07 22:00 IST.

## 1. Problem

In a Maharashtra co-operative housing society (CHS), unpaid committee members can pay a vendor on a WhatsApp "just pay it". Registrars dissolve committees and file FIRs when payments lack a recorded resolution or exceed bye-law limits. Apps like MyGate log *who* approved a payment; none checks that they *had the right to*.

**Product promise:** money leaves only after an invoice, a quorate vote recorded by name, and a bye-law 156 check, enforced by Switch roles and deterministic code, not by a prompt.

## 2. Users

| User | Role in the demo | What they need |
|---|---|---|
| Treasurer | Only person who may instruct `treasurer-agent` | Protection: refuse unauthorised payment without personal blame |
| Chairman | Opens meetings, puts motions | One-step meeting with automatic quorum count |
| Secretary | Reads minutes and ledger | Minutes and resolutions written for them |
| Resident / member | Reads `#general-body`; `member-7` tries "just pay it" | Plain answers about their money, backed by records |
| Society auditor (buyer, not a live user) | Reads the exported files | Ledger lines each tied to an invoice id, resolution id and rule check |

## 3. Scope

- Fictional society: 60 members (51+ tier, so the limit is Rs 1,00,000). All data fictional.
- Rooms: `#committee` (private), `#general-body` (linked, residents). Agents: `clerk`, `treasurer-agent`, `byelaw`, `concierge`.
- Room documents: `byelaws.yaml`, `members.yaml`, `minutes.md`, `ledger.md`, `resolutions.jsonl`, `invoices/`, `agenda.md`.

## 4. Bye-law rules (deterministic code, never the LLM)

**Bye-law 156: repair spend the committee may approve without prior General Body sanction**

| Members in society | Committee limit | Above the limit |
|---|---|---|
| up to 25 | Rs 25,000 | Needs prior General Body sanction: item goes to AGM agenda |
| 26 to 50 | Rs 50,000 | same |
| 51 and above | Rs 1,00,000 | same |

**Quorum (bye-law 100):** 2/3 of members or 20, whichever is less. For 60 members: 2/3 = 40, so quorum = **20**.

Assumptions to confirm (flag to Kelly if wrong): "up to" is inclusive, so an amount equal to the limit passes; the limit applies to a single spend item, not a running total; the tier uses the member count in `members.yaml`.

## 5. The 5 demo beats as user stories

IDs are stable: Dwight maps tasks to them (`B1` to `B5`). Each criterion is a test the engineering team can automate; "observable" means check the room messages or files.

### B1. One template sets everything up
*As the demo operator, I run one command and get the whole society.*
- B1-1: One YAML template creates `#committee` and `#general-body`, the four agents and the room documents. Rerunning on a clean machine gives the same result.
- B1-2: `#general-body` is linked and read-only for residents on committee drafts; residents can post questions.
- B1-3: `members.yaml` has 60 fictional members, the roles Chairman, Secretary, Treasurer, plus `member-7`.
- B1-4: `byelaws.yaml` holds the 156 table and the quorum rule from section 4; no number is hard-coded in agent prompts.

### B2. "Just pay it" is refused
*As the Treasurer, I want a payment request from a non-treasurer to be stopped, so I am never pressured into an unrecorded payment.*
- B2-1: Rs 68,000 lift AMC invoice (`invoice id` set) is posted; `ledger.md` has no entry for it.
- B2-2: `member-7` messages `treasurer-agent` "just pay it". Switch blocks the message (addressing `owner_only` = Treasurer); the agent never sees it. If Switch cannot enforce this (hour-1 test), fall back to the role lease and state it in the README.
- B2-3: The Treasurer forwards the same request. `treasurer-agent` replies with a refusal naming the missing item ("no passed resolution for invoice X").
- B2-4: `ledger.md` is still unchanged after B2-2 and B2-3.

### B3. A recorded vote releases the payment
*As the Chairman, I open a meeting and the payment follows the vote, with no manual bookkeeping.*
- B3-1: Chairman opens a meeting; `clerk` counts members present against `members.yaml` and reports quorum met or not. With 60 members the threshold is 20.
- B3-2: Fewer than 20 present: `clerk` says quorum not met and records no resolution (testable with 19 and 20).
- B3-3: With quorum, a motion on the Rs 68,000 invoice is put; each vote is recorded by member name. A motion passes on a simple majority of votes cast (assumption).
- B3-4: A passed motion appends one line to `resolutions.jsonl` (resolution id, motion, invoice id, votes by name, tally) and one entry to `minutes.md`.
- B3-5: `byelaw` passes Rs 68,000 for 60 members (limit Rs 1,00,000). `treasurer-agent` books `ledger.md` with the invoice id, resolution id and "PAID, mock UPI ref". It books nothing if any of the three is missing.

### B4. Above the limit goes to the AGM
*As the Treasurer, I want over-limit spend stopped with the bye-law cited, so the committee does not breach it.*
- B4-1: A Rs 4,00,000 repainting bid is submitted; `byelaw` rejects it for committee approval and cites bye-law 156, Rs 1,00,000, 51+ members.
- B4-2: `byelaw` appends an item to `agenda.md` for the AGM; `ledger.md` has no entry. A passed committee resolution does not override this.
- B4-3: Boundary tests: Rs 1,00,000 passes and Rs 1,00,001 is referred (51+); the 25/26 and 50/51 member boundaries pick the right limit (Rs 25,000, 50,000, 1,00,000).

### B5. Residents get answers from the records
*As a resident, I ask why my bill changed and get the answer with proof.*
- B5-1: In `#general-body`, a resident asks "Why did maintenance go up Rs 94 a month?". `concierge` replies citing the ledger line (Rs 68,000 / 60 flats / 12 months = about Rs 94 a month per flat), the minute and the vote tally (4 aye, 1 nay, 41 of 60 members present); every figure appears in the published files.
- B5-2: A question the files cannot answer: `concierge` says so and adds an agenda item. It never invents an answer.
- B5-3 (cut candidate): A member asks to inspect records (Section 154B-8) and receives the published files.

## 6. Real and mocked

| Real | Mocked |
|---|---|
| Switch rooms, linked room, roles and addressing, agents | Payment: ledger line "PAID, mock UPI ref"; no money moves |
| Quorum math, limit check, refusal | Invoice OCR: the vendor posts text |
| Minutes, `resolutions.jsonl`, concierge Q&A | Roster: 60 fictional members |

## 7. Ordered cut list (what we will not build, in order of cutting)

Floor: beats B2, B3 and B4 in `#committee` plus the linked `#general-body`.

1. `#vendors` room (vendor posts the invoice directly in `#committee` instead).
2. B5-3 records-inspection beat.
3. Hash chain on `resolutions.jsonl` (plain append-only file; say "hash-chained" nowhere in the README).
4. Karnataka ruleset (one README footnote).
5. Any web dashboard.

Never built, any day: real payments, invoice OCR, multi-society support, login, a mobile app, other states' bye-laws, legal advice.

## 8. Not-goals that protect the pitch

- Never hold or move money. The gate approves a payment instruction only.
- Agents cite rules; they never advise. The LLM drafts minutes and explains; it does not decide quorum, limits or refusal.

## 9. Submission checklist (product-owned from hour 16)

- README: the pitch line, the 5 beats, how Switch is used (rooms, addressing, roles, linked room, documents), run steps, what is mocked.
- 3-minute demo video, with a 30-second business framing only if Michael confirms (open decision 4 in the plan).
- Clean-clone check by Stanley before submit.

## 10. Open questions (owner)

| Question | Owner | Default if unanswered |
|---|---|---|
| Does Switch addressing block `member-7` (hour-1 test)? | Oscar, Stanley | Fall back to role lease, say so in README |
| 30-second business framing in video? | Michael | Include, README as backup |
| Rule assumptions in section 4 | Kelly | As written |
