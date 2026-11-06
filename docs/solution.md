# Society Room: solution map

How each PRD criterion (`docs/prd.md` §5) is delivered: by which Switch feature, by which engine command (`society_room`, ADR 0002) and in which file. Switch behaviour is verified on 0.31.0 (ADR 0001). "Test" names the check Dwight's task must automate.

## Switch features used

| Switch feature | Where we use it | Verified |
|---|---|---|
| v2 YAML template (agents, rooms, group, links, kickoff) | `switch/society-room.yaml` creates everything (B1) | template lints clean (Stanley) |
| Private room bridged to Mattermost | `committee` (`channel_private`) | docs |
| Linked rooms in a group | `committee` → `general-body`, label "published records" (B1-2) | docs, template |
| Addressing policy `owner` | `treasurer-agent`: only the Treasurer, the template's deployer, may instruct it (B2-2) | **code run, 15/15** |
| Addressing `anyone_in: [room]` | `clerk`, `byelaw` in committee; `concierge` in general-body | code read |
| Visible refusal by Switch | the "You're not permitted…" reply in beat 2 | code read (`delivery/addressing.py`) |
| Exclusive role lease + `!roles` + `@role` | `meeting-chair`, held by clerk during a meeting (B3-1) | code read (`room_role_store.py`) |
| Room documents (optional) | published records attached in general-body, `!list-documents` | docs |

## Story map

| PRD | Switch feature | Engine command | Files | Test |
|---|---|---|---|---|
| B1-1 | template run by the Treasurer; kickoff defines `meeting-chair` | — | `switch/society-room.yaml` | live: rooms, agents, role exist after one run |
| B1-2 | group link committee → general-body | — | template | live: link shown |
| B1-3 | — | `society members` (loader) | `room/members.yaml` | unit: 60 members, roles present, `member-7` present |
| B1-4 | — | loader | `room/byelaws.yaml` | unit: tiers and quorum read from YAML; grep finds no limit in agent instructions |
| B2-1 | invoice text posted in committee | — | `room/invoices/INV-068.md` | unit: invoice parses; ledger has no entry |
| B2-2 | **addressing `owner`** on treasurer-agent | — | — | `docs/adr/evidence/addressing_check.py` + live A1 |
| B2-3 | Treasurer is admitted | `society book INV-068 -` → `REFUSED no passed resolution for invoice INV-068` | — | unit: refusal text |
| B2-4 | — | — | `ledger.md` | unit: unchanged after refusals |
| B3-1 | `@clerk`, **exclusive lease `meeting-chair`**, `!roles` | `society meeting open --present <ids…>` | `meeting.json` | unit: 60 members → quorum 20; live: `!roles` shows clerk |
| B3-2 | — | same, with 19 present → `REFUSED quorum not met (19/20)` | `meeting.json` | unit: 19 refused, 20 passes |
| B3-3 | clerk records votes by name from chat | `society vote --motion … --invoice INV-068 --yes <ids> --no <ids>` | — | unit: simple majority of votes cast; vote refused when no meeting is open; voter must be present |
| B3-4 | — | (part of `vote`) | `resolutions.jsonl`, `minutes.md` | unit: one line each, with resolution id and tally |
| B3-5 | Treasurer instructs treasurer-agent | `society book INV-068 R-001` → `OK booked … PAID, mock UPI ref` | `ledger.md` | unit: each missing piece refuses with its reason; all present → exactly one line |
| B4-1 | `@byelaw` | `society check INV-400` → `REFUSED over bye-law 156 limit ₹1,00,000 (51+ members); referred to AGM` | — | unit |
| B4-2 | — | `check` and `book` both refer | `agenda.md`, `ledger.md` | unit: passed resolution + ₹4L → still refused, agenda item added |
| B4-3 | — | `limit_for(members)`, `check` | `byelaws.yaml` | unit: ₹1,00,000 ok, ₹1,00,001 referred; 25/26 and 50/51 member boundaries |
| B5-1 | concierge in linked general-body | reads published files | `ledger.md`, `minutes.md`, `resolutions.jsonl` | live: reply cites the ledger line, resolution id and tally |
| B5-2 | concierge | `society agenda add --from resident --question …` | `agenda.md` | unit: append; live: says it cannot answer |
| B5-3 (cut candidate) | room documents in general-body | `society export` (copies the published files plus `verify` output) | `export/` | unit: export contains the 4 files and a verify OK |

## Integrations

| Integration | Real or mocked | How |
|---|---|---|
| Bye-law 156 limits | real rules, kept as data | `byelaws.yaml` tiers; the engine picks a tier from the `members.yaml` count |
| Quorum, bye-law 100 | real | `min(ceil(2/3 · members), 20)` from `byelaws.yaml` |
| Payment | **mocked** | the ledger line ends `PAID, mock UPI ref UPI-MOCK-<n>`; no money moves |
| Invoice | **mocked** | the vendor's text goes into `invoices/*.md`; no OCR |
| Ledger | real (file) | append-only `ledger.md`, written only by `book` |
| Auditor export | real (file) | `society export` + `society verify`; cut candidate along with B5-3 |
| Hash chain | real, cut list #3 | `prev_hash`/`hash` on `resolutions.jsonl`; `verify` fails on a tampered line |

## Task impact (for Dwight)

- **#8, template**: add a `room_dir` param (type `directory`) to every agent's instructions. Add a kickoff to committee: `@clerk define an exclusive role meeting-chair …`. The kickoff speaks as the deployer, so clerk's `anyone_in` admits it. Keep `treasurer: addressing: owner`, and state in setup that **the Treasurer runs the template**.
- **#5, #7, #6**: build them as CLI commands with the exact output strings above. The agents relay them, so the strings are the demo script.
- **#9**: each agent's instructions are three lines at most. For example: "Run `uv run society …` for every number or decision; post its output verbatim; never edit room/ yourself."
