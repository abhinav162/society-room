# Society Room: how this team works

Deadline: submit by **Sat 7 Nov 2026, 22:00 IST** (hard deadline 23:59 IST). Hackathon rules: `docs/research/hackathon-rules.md`. Business: `docs/business-plan.md` (MVP spec in section 8). Validation: `docs/research/validation.md`.

## Teams and owners

| Team | Agent | Owns |
|---|---|---|
| Product | Kelly, Product manager | `docs/prd.md`: user stories, acceptance criteria, the 5-beat demo, the cut list. Decides *what* and *in what order*. Only Kelly asks the human product questions (through Michael). |
| Design | Pam, Lead designer | `design/`: wireframes, then high-fidelity screens, the architecture and flow diagrams for the README and video, demo visuals. |
| Engineering | Dwight, Engineering lead | Plan, task split, code review, merges to `main`, the green-build gate. Only Dwight merges. |
| | Oscar, Architect | `docs/architecture.md` + ADRs (architecture decision records): rooms, agents, roles, who-obeys-whom, the rules engine boundary, data files. |
| | Toby, Solution architect | Maps each PRD story to Switch features and integrations: bye-law 156 rules data, mocked payment and invoice, ledger, auditor export. Owns `docs/solution.md` and the hour-1 Switch go/no-go test with Stanley. |
| | Stanley, Platform engineer | Switch Console + Docker + Mattermost setup scripts, `make test`, unit and integration test harness, CI (GitHub Actions), clean-clone check. |
| | Kevin, Developer | Features assigned by Dwight, test first. |
| | Ryan, Developer | Features assigned by Dwight, test first. |

## Flow (in order, but overlap where nothing blocks)

1. Kelly writes the PRD from the business plan (first 45 min). Oscar and Toby start the architecture in parallel from the same plan.
2. Hour-1 go/no-go (Toby + Stanley): does Switch itself stop a non-treasurer from instructing the treasurer agent, and does the meeting-open role lease work? Result goes to Dwight and Michael. If enforcement fails: fall back to the role-lease model and say so in the README.
3. Pam: wireframes for every demo beat, then high-fidelity and diagrams.
4. Dwight splits work into small tasks with acceptance tests; developers build them **test first**.
5. Review and merge by Dwight only when the gate below is green.
6. Kelly and Pam drive the README, demo script and video assets from hour 16.

## Definition of done (the gate)

- A failing test was written first, and now passes (`test-driven-development`).
- `make test` runs unit **and** integration tests; all green, with the output pasted in the merge note (`verification-before-completion`).
- The diff is the smallest complete change (`ponytail`, `karpathy-guidelines`): no features, options or abstractions the PRD did not ask for.
- Money and rule logic (quorum, bye-law 156 limits, refusal) is deterministic code with tests, never an LLM decision.
- Reviewed by Dwight (`requesting-code-review`, `ponytail-review`).

## Skills (in `.claude/skills/`, sources in `SOURCES.txt`)

| Skill | Who | Why |
|---|---|---|
| ponytail, ponytail-review | all engineering | smallest complete change, review for bloat |
| karpathy-guidelines | everyone | state assumptions, simplicity, surgical edits, verifiable goals |
| test-driven-development | developers, platform, eng lead | red, green, refactor |
| verification-before-completion | everyone | no "done" without fresh evidence |
| systematic-debugging | developers, platform | root cause before fixes |
| writing-plans | product, eng lead, architects | small, ordered, testable plans |
| requesting-code-review | eng lead, developers | structured review before merge |

## Rules

- Branches: one per task (`task/<id>-<slug>`), developers use `git worktree add .worktrees/<task>` so they never share a working tree. Only Dwight merges to `main`.
- Never push, force-push or rewrite history. Michael pushes to GitHub only on the human's word.
- Never open, print or commit any `.env` or secret. All data in the demo is fictional.
- Talk through the hive outbox. Product questions to Kelly, engineering to Dwight, anything needing the human to Michael (`god`).
- Send no message that only acknowledges.
