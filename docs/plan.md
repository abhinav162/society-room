# Society Room: build plan

Source: `docs/business-plan.md` section 8. Re-cut against `docs/prd.md` (story ids B1-B5, criteria B2-1..B5-3). PER-88 go/no-go still pending; it gates PER-94 only. Tracker: Linear project **Society Room** (team Abhinav, PER); this file mirrors it. Deadline: submit 22:00 IST Sat 2026-11-07.

Definition of done for every task: TEAM.md "Definition of done". Every code task: failing test first, `make test` green (unit + integration) with output in the merge note, smallest complete diff, reviewed and merged by Dwight.

Stack (from Stanley's harness): Python 3.12, uv, pytest, ruff. Code lives in the package `society_room/` at the repo root; unit tests in `tests/unit`, integration in `tests/integration`. Room data files in `room/`. Money and rule logic (quorum, bye-law limits, refusal, booking) is deterministic code with tests; agents only call it through a small CLI (`python -m society_room ...`).

## Tasks (in order; T = developer temp, max 2 at once)

| # | Task | Owner | Depends on | Acceptance test |
|---|---|---|---|---|
| 0 (PER-86, done) | PRD: stories, acceptance criteria, 5-beat demo, cut list (`docs/prd.md`) | Kelly | - | File exists; each demo beat has a testable criterion |
| 1 (PER-87) | Architecture + solution (`docs/architecture.md`, `docs/solution.md`): rooms, agents, roles, rules-engine boundary, data files | Oscar | - | Each PRD story maps to a Switch feature and a module |
| 2 (PER-88) | Hour-1 go/no-go: Switch `owner_only` addressing blocks a non-Treasurer message to `treasurer-agent`; meeting-open role lease works | Oscar + Stanley | - | Written result to Dwight and god; fall back to role lease if it fails |
| 3 (PER-89, done) | Test harness: `make test` runs unit + integration, CI (GitHub Actions), Switch/Mattermost setup scripts | Stanley | - | `make test` green on a clean clone with one sample unit and one integration test |
| 4 (PER-90) | Seed data: `byelaws.yaml` (Maharashtra limits), `members.yaml` (60 fictional members, quorum rule), `invoices/` (₹68k lift AMC, ₹4L repainting) | Temp A | 3 | B1-3, B1-4: loader test parses both YAML files and both invoices |
| 5 (PER-91) | Rules engine: quorum (bye-law 100: 2/3 or 20, whichever is less) and spend limit (bye-law 156: ₹25k/50k/1L by member count; above → AGM agenda) | Temp A | 4 | B3-1, B3-2, B4-1, B4-3: 19/20 present; ₹1,00,000 passes, ₹1,00,001 refers; 25/26 and 50/51 tiers |
| 6 (PER-92) | Records: `minutes.md` writer, `resolutions.jsonl` append (hash-chained, verify), `agenda.md` append | Temp B | 3 | B3-3, B3-4, B4-2: simple majority of votes cast; passed motion = 1 resolutions line + 1 minute; append + verify, tampered line fails |
| 7 (PER-93) | Booking guard: book to `ledger.md` only with invoice id + passed resolution id + bye-law pass; "PAID, mock UPI ref" | Temp B | 5, 6 | B2-3, B2-4, B3-5, B4-2: each missing piece refuses with its reason; over-limit refuses even with a resolution; all present writes one ledger line |
| 8 (PER-94) | Switch template: one YAML creates `#committee`, linked `#general-body`, four agents, roles, `treasurer-agent` addressing `owner_only` = Treasurer, room documents | Temp A | 2 | Integration test: apply template, rooms + agents + docs exist |
| 9 (PER-95) | Agents wired to the engine: `clerk` (open meeting, quorum, votes by name), `treasurer-agent`, `byelaw`, `concierge` (answers only from published files, cites line; unanswerable → agenda) | Temp A/B | 5-8 | Integration test per agent on the demo inputs |
| 10 (PER-96) | End-to-end demo run: beats 2-4 scripted, plus beat 5 Q&A | Temp | 9 | Integration test replays beats 2-5 and checks ledger, minutes, agenda |
| 11 (PER-97) | README (agents, channel setup, how to run) + clean-clone check | Stanley + Kelly | 10 | Fresh clone → setup → `make test` green, following README only |
| 12 (PER-98; wireframes done as PER-100) | Diagrams, high-fidelity, demo visuals | Pam | 0, 1 | Files in `design/` |
| 13 (PER-99) | Demo video + submission | Kelly + Pam + human | 11 | Video recorded; submitted before 22:00 IST |

## Cut list

As `docs/prd.md` section 7. Floor: B2, B3, B4 in `#committee` plus linked `#general-body`.
