# Society Room: build plan

Source: `docs/business-plan.md` section 8. Draft from the business plan; re-cut when `docs/prd.md` (Kelly) and the hour-1 go/no-go (Oscar + Stanley) land. Tracker: Linear project **Society Room** (team Abhinav, PER); this file mirrors it. Deadline: submit 22:00 IST Sat 2026-11-07.

Definition of done for every task: TEAM.md "Definition of done". Every code task: failing test first, `make test` green (unit + integration) with output in the merge note, smallest complete diff, reviewed and merged by Dwight.

Money and rule logic (quorum, bye-law limits, refusal, booking) is deterministic code in `src/` with tests; agents only call it.

## Tasks (in order; T = developer temp, max 2 at once)

| # | Task | Owner | Depends on | Acceptance test |
|---|---|---|---|---|
| 0 (PER-86) | PRD: stories, acceptance criteria, 5-beat demo, cut list (`docs/prd.md`) | Kelly | - | File exists; each demo beat has a testable criterion |
| 1 (PER-87) | Architecture + solution (`docs/architecture.md`, `docs/solution.md`): rooms, agents, roles, rules-engine boundary, data files | Oscar | - | Each PRD story maps to a Switch feature and a module |
| 2 (PER-88) | Hour-1 go/no-go: Switch `owner_only` addressing blocks a non-Treasurer message to `treasurer-agent`; meeting-open role lease works | Oscar + Stanley | - | Written result to Dwight and god; fall back to role lease if it fails |
| 3 (PER-89) | Test harness: `make test` runs unit + integration, CI (GitHub Actions), Switch/Mattermost setup scripts | Stanley | - | `make test` green on a clean clone with one sample unit and one integration test |
| 4 (PER-90) | Seed data: `byelaws.yaml` (Maharashtra limits), `members.yaml` (60 fictional members, quorum rule), `invoices/` (₹68k lift AMC, ₹4L repainting) | Temp A | 3 | Loader test parses both YAML files and both invoices |
| 5 (PER-91) | Rules engine: quorum (bye-law 100: 2/3 or 20, whichever is less) and spend limit (bye-law 156: ₹25k/50k/1L by member count; above → AGM agenda) | Temp A | 4 | Unit tests: 60 members → quorum 20, limit ₹1L; ₹68k passes; ₹4L returns "AGM" |
| 6 (PER-92) | Records: `minutes.md` writer, `resolutions.jsonl` append (hash-chained, verify), `agenda.md` append | Temp B | 3 | Unit tests: append + verify passes; tampered line fails verify |
| 7 (PER-93) | Booking guard: book to `ledger.md` only with invoice id + passed resolution id + bye-law pass; "PAID, mock UPI ref" | Temp B | 5, 6 | Unit tests: each missing piece refuses with its reason; all present writes one ledger line |
| 8 (PER-94) | Switch template: one YAML creates `#committee`, linked `#general-body`, four agents, roles, `treasurer-agent` addressing `owner_only` = Treasurer, room documents | Temp A | 2 | Integration test: apply template, rooms + agents + docs exist |
| 9 (PER-95) | Agents wired to the engine: `clerk` (open meeting, quorum, votes by name), `treasurer-agent`, `byelaw`, `concierge` (answers only from published files, cites line; unanswerable → agenda) | Temp A/B | 5-8 | Integration test per agent on the demo inputs |
| 10 (PER-96) | End-to-end demo run: beats 2-4 scripted, plus beat 5 Q&A | Temp | 9 | Integration test replays beats 2-5 and checks ledger, minutes, agenda |
| 11 (PER-97) | README (agents, channel setup, how to run) + clean-clone check | Stanley + Kelly | 10 | Fresh clone → setup → `make test` green, following README only |
| 12 (PER-98) | Wireframes, diagrams, demo visuals | Pam | 0, 1 | Files in `design/` |
| 13 (PER-99) | Demo video + submission | Kelly + Pam + human | 11 | Video recorded; submitted before 22:00 IST |

## Cut list (from business plan, in order)

`#vendors` room → records-inspection beat → hash chain → Karnataka ruleset → any web dashboard. Floor: beats 2-4 in one room plus linked `#general-body`.
