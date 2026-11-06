# ADR 0002: The rules engine is a CLI and the only writer of records

- Status: Accepted
- Date: 2026-11-06

## Context

Quorum, the bye-law 156 limits and the payment gate must be deterministic and tested (TEAM.md, definition of done). The agents are Claude Code sessions that Switch Console runs, and they have a shell. We have about 28 hours.

## Decision

- Write the rules in one Python package, `society_room`, exposed as `uv run society <command>`.
- Agents call it through their shell and relay its one-line output, `OK …` or `REFUSED <reason>`, word for word.
- The CLI is the only writer of `room/` records. The gate (`book`) re-derives every condition itself and trusts no agent's word.

## Options rejected

- **The LLM follows rules written in its prompt.** That fails the pitch: "not by a prompt".
- **An MCP server or HTTP service for the engine.** It adds a process and a protocol, and buys nothing a CLI does not already give us.
- **A custom Switch agent built on the agent protocol** (server-sent events in, HTTP out). That means more code and more failure modes, and Claude Code agents are already supported.

## Consequences

- Every rule has unit tests on the CLI's functions. The integration tests drive the CLI against a temporary `room/`.
- An agent could still skip the CLI and edit `ledger.md` by hand. The mitigations are agent instructions and a ledger check (`society verify`: every ledger line resolves to an invoice and a passed resolution) that the demo and the auditor export both run.
- Status on main as of 29e87f2: the rule functions exist (`society_room/rules.py`, `society_room/records.py`), but there is no CLI yet. The thin `society` entry point (in `pyproject.toml` `[project.scripts]`) wraps them, and belongs to the booking guard (PER-93) and agent wiring (PER-95) tasks.
