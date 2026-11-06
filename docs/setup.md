# Setup

## Prerequisites (human, once)
- Docker (OrbStack or Docker Desktop) running.
- Switch Console (macOS app) installed and a local server started in it. This starts Mattermost in Docker and a native Switch server (core 0.31.0).
- `uv` (https://docs.astral.sh/uv/).

## Check the stack
`make live-check` pings the local Mattermost (port read from Switch Console's `ports.json`) and checks its container. It never stops or touches other containers.

## Create the rooms
`switch/society-room.yaml` is a Switch version-2 template: agents `clerk`, `treasurer`, `concierge`; rooms `committee` (private) and `general-body`, linked in one group.
1. **The Treasurer persona runs the template.** `treasurer-agent` uses `addressing: owner`, so whoever runs the template owns it (ADR 0001). Every demo human must also link their Mattermost account.
2. In Switch Console choose to run a template from YAML and paste the file.
3. Set `room_dir` to the absolute path of this repo's `room/` folder. Each agent runs `cd {room_dir}/.. && uv run python -m society_room --room {room_dir} <cmd>`.
4. `uv` must be on the agents' PATH (check with `which uv` in the shell the Console starts agents from).
5. Machine and provider default to the first online machine and `claude`.
6. The template lints clean with Switch's own linter (`switch_core.template_lint.lint_template`).

## Hour-1 test (Oscar)
`treasurer` uses `addressing: owner`. Switch's addressing options are only `owner`, `owner-agents`, `anyone`, or `anyone_in: [rooms]`. It has no "Treasurer role" option, so `owner` means the person who deployed it. Test: post as a second human in `#committee`, address the treasurer, and see whether Switch refuses it. If it does not, use the role-lease fallback.

## Tests
- `make test` runs unit then integration (`tests/unit`, `tests/integration`); an empty suite is green.
- `make lint` runs ruff.
- Tests marked `@pytest.mark.live` run only with `SWITCH_LIVE=1`.
- CI (`.github/workflows/ci.yml`) runs `make lint` and `make test`.
