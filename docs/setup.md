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
3. Lint offline with Switch's own linter (see `scripts/` notes in the PR); the file currently lints with no errors or warnings.

## Hour-1 test (Oscar)
`treasurer` uses `addressing: owner`. Switch's addressing options are only `owner`, `owner-agents`, `anyone`, or `anyone_in: [rooms]`. It has no "Treasurer role" option, so `owner` means the person who deployed it. Test: post as a second human in `#committee`, address the treasurer, and see whether Switch refuses it. If it does not, use the role-lease fallback.

## Tests
- `make test` runs unit then integration (`tests/unit`, `tests/integration`); an empty suite is green.
- `make lint` runs ruff.
- Tests marked `@pytest.mark.live` run only with `SWITCH_LIVE=1`.
- CI (`.github/workflows/ci.yml`) runs `make lint` and `make test`.
