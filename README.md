# Society Room

**MyGate logs who approved a payment. Society Room makes sure they had the right to: an invoice, a quorate vote by name, and the bye-law limit, enforced by Switch roles and deterministic code, not by a prompt.**

Built for the Flip the Switch hackathon (Track 1, Best Business Workflow). Demo video: <link>

## The problem

A Maharashtra co-operative housing society is run by unpaid volunteer office bearers who carry personal liability for the society's money. Registrars dissolve committees that cannot show records, and audits lead to FIRs. Under model bye-law 156 a committee may approve repair spend only up to a limit that depends on society size, and above it the General Body must sanction first. Resident apps record who approved a payment; none ties a payment to a quorate, recorded resolution or checks that limit.

| Members | Committee limit (bye-law 156) | Above the limit |
|---|---|---|
| up to 25 | Rs 25,000 | goes to the General Body agenda |
| 26 to 50 | Rs 50,000 | same |
| 51 and above | Rs 1,00,000 | same |

Quorum (bye-law 100): 2/3 of members or 20, whichever is less. The demo society has 60 fictional members, so the limit is Rs 1,00,000 and quorum is 20. Product spec: [`docs/prd.md`](docs/prd.md).

## The demo (about 3 minutes)

1. One template creates `#committee`, `#general-body` and four agents.
2. A resident says "just pay it" to the treasurer agent. Switch refuses the message before the agent sees it. The Treasurer asking is refused too: no resolution.
3. The Chairman opens a meeting, the clerk counts quorum and records a vote by name, and only then does the treasurer book the Rs 68,000 invoice.
4. A Rs 4,00,000 repainting bid is over the bye-law 156 limit and goes to the AGM agenda, even with a committee vote.
5. A resident asks in `#general-body`; the concierge answers only by quoting the published ledger and minutes.

Rehearsal lines and expected replies: [`docs/demo-script.md`](docs/demo-script.md). Wireframes and diagrams: [`docs/design/`](docs/design/).

## How Switch is used

Without Switch there is no room, no addressing and no role to enforce. The split is one rule: **Switch decides who may instruct an agent; deterministic code decides what is allowed; the LLM only talks.**

- **Rooms.** `committee` (private) and `general-body` (residents) are created from one YAML template, [`switch/society-room.yaml`](switch/society-room.yaml), and linked so committee records are published to residents.
- **Addressing.** `treasurer-agent` and `clerk` use `addressing: owner`. Switch refuses anyone else on the server, before the agent runs. `byelaw` and `concierge` use `anyone_in` their room. The person who runs the template is the owner, so the Treasurer runs it.
- **Meeting lease.** The clerk holds the exclusive role `meeting-chair` while a meeting runs. `!roles` shows the holder.
- **Hash-chained records.** `resolutions.jsonl` links each resolution to the previous one by hash; `verify` fails if a line was edited by hand.
- **Agents run a CLI.** Quorum, the bye-law 156 check, the booking gate and the records are the `society_room` Python engine. Agents run it and relay its one output line (`OK ...` or `REFUSED ...`) word for word.

Evidence that Switch itself refuses outsiders (15/15 policy checks, plus a live replay): [`docs/adr/0001-switch-go-no-go.md`](docs/adr/0001-switch-go-no-go.md). Design: [`docs/architecture.md`](docs/architecture.md).

## Run it

Needs Docker, `uv`, and Switch Console with its local server. Step by step, with the accounts to create: [`docs/setup.md`](docs/setup.md). Then tests:

```bash
uv sync       # install dependencies
make lint     # ruff
make test     # unit, then integration tests; one test skips unless Switch Console's Python is importable (it runs Switch's template linter)
```

The tests need no Switch Console. The live demo does: follow `docs/setup.md`.

In a clone, set the template's `Society room folder` to the absolute path of your clone's `room/` (the default is the authors' machine). To restart the demo clean, delete `room/agenda.md`, `minutes.md`, `ledger.md`, `resolutions.jsonl` and `meeting.json`.

## Repo map

| Path | What |
|---|---|
| `society_room/` | the rules engine and CLI: quorum, bye-law 156 check, payment gate, records |
| `switch/society-room.yaml` | the Switch template: rooms, agents, addressing |
| `room/` | seed data (`byelaws.yaml`, `members.yaml`, `invoices/`); records grow here through the CLI |
| `tests/` | unit and integration tests, including a replay of demo beats B2 to B5 |
| `docs/` | PRD, architecture, ADRs, setup, demo script, design |
| `video/` | demo video sources |

## Limits

- Payment and invoice reading are mocked: a booked line reads "PAID, mock UPI ref". No money moves.
- All people, invoices and the society are fictional.
- Switch addressing names Switch users, not committee roles, so every person links their Mattermost account and the Treasurer must run the template.
- The engine cannot verify who voted; votes are what the clerk records in `committee`, where members are trusted to vote in their own names.
- `@byelaw` admits anyone in `committee`; an outsider can add AGM agenda items (no money moves).
- The resolutions hash is unkeyed: it shows records were not edited by hand, not who wrote them.
- Rules are Maharashtra model bye-laws only.

Full list: [`docs/architecture.md`](docs/architecture.md) section 9.
