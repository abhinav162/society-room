# ADR 0001: Hour-1 Switch go/no-go

- Status: Accepted (code-level evidence); live chat replay by Stanley pending, appended below when done
- Date: 2026-11-06
- Deciders: Oscar (architect), Stanley (platform)
- Switch version tested: switch-core **0.31.0**, the native server Switch Console runs locally (`~/Library/Application Support/switchdash/local-switch-server/native/switch-core/0.31.0`). Health `GET :63941/health` → `{"status":"ok"}`; Mattermost ping on :63942 → `OK`.

## Question

The demo depends on two Switch features:

- **(a)** A non-treasurer cannot instruct `treasurer-agent`. The refusal must come from Switch, not from the agent's prompt.
- **(b)** Opening a meeting through a role lease works, and someone can check who holds it.

## What we ran

1. Read the Switch docs: `internals/identity-and-access`, `getting-started/agent-settings`, `building/payments-room`, `resources/glossary` (Role) and `resources/room-commands`.
2. Read the installed 0.31.0 source: `switch_core/addressing.py` (the policy), `switch_core/delivery/addressing.py` (where a message is allowed or demoted), `switch_core/db/stores/room_role_store.py` (role leases) and `switch_core/template_guide.py` (the template `addressing:` field).
3. Ran Switch's own policy code against the demo cast: `docs/adr/evidence/addressing_check.py`, run with the Switch Console venv python. Output is in `docs/adr/evidence/addressing_check.out`: **15/15 PASS**.

```
PASS owner_only: Treasurer -> treasurer-agent -> allowed
PASS owner_only: member-7 -> treasurer-agent -> refused
PASS owner_only: Chairman -> treasurer-agent -> refused
PASS owner_only: unlinked chat account -> treasurer-agent -> refused
PASS owner_only: clerk agent (owned by Chairman) -> treasurer-agent -> refused
PASS owner_only: platform -> treasurer-agent -> refused
PASS default (owner+owner_agents): ... same six results
PASS custom users=[Treasurer]: Treasurer -> allowed
PASS custom users=[Treasurer]: member-7 -> refused
PASS custom users=[Treasurer]: Treasurer in general-body -> refused
ALL PASS
```

Reproduce it with: `"$HOME/Library/Application Support/switchdash/local-switch-server/native/switch-core/0.31.0/venv/bin/python3" docs/adr/evidence/addressing_check.py`

## What we found

**(a) Addressing.** Each agent has an allow-list policy that Switch evaluates on the server. The checks cover `@name`, `@alias`, `@role` and targeted messages, and commands such as `!reset` are gated the same way.

- A sender the policy does not admit has their message demoted to ordinary room chatter. Switch then posts one visible reply: *"You're not permitted to direct messages to me in this room — my operator has restricted who can address me here."* The agent never receives the message as an instruction, so the refusal is not an LLM decision. This is the judge's point.
- An agent's policy can only be changed by its owner or a workspace admin. The agent cannot change it (docs: "Policies aren't agent-facing").
- **Limit 1: the policy names Switch users, not committee roles.** Switch has no "Treasurer" concept. `owner` means whoever owns the agent. In a template, `addressing: owner` means **the person who runs the template** (`template_guide.py`: "default owner-agents (the deployer …)"). The template cannot name another user.
- **Limit 2: every human's Mattermost account must be linked to a Switch user.** An unlinked account matches nobody, so it is refused even if it belongs to the owner. Switch prints a separate "isn't linked" message in that case.

**(b) Role lease.** Switch roles are per room, and either shared or exclusive. An exclusive role is a **lease** with these rules:

- One live holder at a time. A second agent gets *"Role '…' is exclusive and currently held by another agent"*.
- One lease per agent, across all rooms.
- The lease is held while the holder's session runs, and released a few seconds after the session stops.
- `!roles` shows the holder, and `@role` reaches the holder. `@role` is still subject to the holder's own addressing policy, because `mentions_role` is one of the "addressed" paths that `permitted()` gates.

- **Limit 3: only agents hold roles.** "Who can take a role? Any agent in the room." A person cannot hold a lease. "Chairman holds the meeting lease" is not something Switch can express.
- **Limit 4: a lease lasts as long as a session, not as long as a meeting.** If the session restarts, the lease drops. A lease cannot be the record of whether a meeting is open.

## Decision

**(a) GO.** `treasurer-agent` runs with `addressing: owner`. **The Treasurer persona runs the template, so the Treasurer is the owner.** If someone else has to run it, the owner sets Custom rules in Switch Console: users = [Treasurer], agents = [], rooms = [committee]. That case is tested above too. Every demo human links their Mattermost account. Pitch line as written: refusal by Switch addressing, not by the prompt.

**(b) GO with a changed model.** We do not use the README fallback.

- The Chairman opens a meeting by addressing `@clerk`. Clerk's addressing admits only committee members.
- Clerk takes the **exclusive** role `meeting-chair`. `!roles` is the check, and a second meeting cannot start while the role is held.
- Whether the meeting is open, the quorum count and the votes are **deterministic engine state** in `meeting.json`, `minutes.md` and `resolutions.jsonl`, not the lease (Limit 4).
- The engine, not the lease, refuses a vote or a booking when no meeting is open or the meeting is not quorate.

**Fallback, if Stanley's live replay contradicts the code:** keep the lease only as the visible "a meeting is running" signal and gate everything on engine state. The README then says that addressing gates *who instructs*, and the engine gates *what is allowed*.

## Consequences

- `switch/society-room.yaml` (Stanley) is correct as it stands for `treasurer: addressing: owner`. Setup docs must say **"the Treasurer runs the template"** and **"every person links their Mattermost account"**.
- The template needs a `meeting-chair` exclusive role in `committee`. If v2 templates cannot define roles, an agent defines it at kickoff.
- `clerk` with `anyone_in: [committee]` lets any committee-room member, member-7 included, ask clerk things. That is acceptable: clerk only proposes, and the engine records the real votes by name against `members.yaml`.
- The demo needs at least 3 Mattermost accounts: Treasurer (deployer, linked), Chairman, member-7. Linking or leaving the Chairman and member-7 unlinked does not change beat 2. Either way they are refused.

## Live replay (Stanley), pending

Cast agreed with the human on 2026-11-06:
- Treasurer = Mattermost `user`, the Switch Console's own account. The Console is signed in as Switch user `admin`, who runs the template and so owns `treasurer-agent`.
- Non-owner = Mattermost `abhinav`, unlinked.

The code check covers both: the owner is allowed, and an unlinked account is refused. The only extra condition is that `user` is linked to `admin` (Console Home shows no "Link your Mattermost account").

Checks A1 (abhinav), A3 (user) and B2/B6 (`!roles`) go here, with screenshots in `docs/adr/evidence/`.
