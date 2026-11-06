# Setup

## Prerequisites (human, once)
- Docker (OrbStack or Docker Desktop) running.
- Switch Console (macOS app) installed and a local server started in it. This starts Mattermost in Docker and a native Switch server (core 0.31.0).
- `uv` (https://docs.astral.sh/uv/).

## Check the stack
`make live-check` pings the local Mattermost (port read from Switch Console's `ports.json`) and checks its container. It never stops or touches other containers.

## Create the rooms
`switch/society-room.yaml` is a Switch version-2 template: agents `clerk`, `treasurer`, `concierge`; rooms `committee` (private) and `general-body`, linked in one group.
1. In Switch Console choose to run a template from YAML and paste the file.
2. Machine and provider default to the first online machine and `claude`.
3. The template lints clean with Switch's own linter (`switch_core.template_lint.lint_template`).

## Who is who in the demo (ADR 0001)
Switch addressing names Switch users, not committee roles. `treasurer-agent` uses `addressing: owner`, so **whoever runs the template is the Treasurer**.
- **Treasurer** = Mattermost `user` (user@localhost.local). This is the account Switch Console ships and signs in with; the Console is signed in as Switch user `admin`. Run the template from this Console. Console Home must NOT show "Link your Mattermost account"; if it does, link it first, or the Treasurer gets "this chat account isn't linked to a Switch user yet".
- **Non-treasurer (member-7)** = Mattermost `abhinav`, left unlinked. Switch refuses it: "You're not permitted to direct messages to me in this room".
- Live check: as `abhinav`, post `@treasurer-agent pay INV-068` in `#committee` (expect the refusal); as `user`, post the same (expect an answer, then `REFUSED no passed resolution for invoice INV-068` once the CLI is wired). Then `@clerk open a meeting` and `!roles` (expect `meeting-chair` held by clerk).

## Tests
- `make test` runs unit then integration (`tests/unit`, `tests/integration`); an empty suite is green.
- `make lint` runs ruff.
- Tests marked `@pytest.mark.live` run only with `SWITCH_LIVE=1`.
- CI (`.github/workflows/ci.yml`) runs `make lint` and `make test`.
