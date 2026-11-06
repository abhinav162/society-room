import shutil
import subprocess
import sys
from pathlib import Path

import pytest

from tests.unit.test_template import load

ROOM = Path(__file__).parents[2] / "room"

# Each CLI command an agent's instructions tell it to run.
COMMANDS = {
    "clerk": ["meeting open", "vote", "meeting close"],
    "byelaw": ["check"],
    "treasurer_agent": ["book", "status"],
    "concierge": ["agenda add"],
}
PENDING = {"book"}  # treasurer `book` lands in a separate change


def test_every_room_agent_exists_and_has_an_owner_rule():
    res = load()
    for room in (r for r in res.values() if r["type"] == "room"):
        for key in room["agents"]:
            assert res[key]["type"] == "agent"
            assert "addressing" in res[key]


CASES = [
    pytest.param(
        agent,
        cmd,
        marks=[pytest.mark.xfail(reason="book not merged yet", strict=False)]
        if cmd in PENDING
        else [],
    )
    for agent, cmds in COMMANDS.items()
    for cmd in cmds
]


@pytest.mark.parametrize("agent,cmd", CASES)
def test_instructed_command_exists(agent, cmd, tmp_path):
    assert cmd in load()[agent]["instructions"]
    room = shutil.copytree(ROOM, tmp_path / "room")
    run = subprocess.run(
        [sys.executable, "-m", "society_room", "--room", str(room), *cmd.split(), "--help"],
        check=False,
        capture_output=True,
        text=True,
    )
    assert run.returncode == 0, run.stderr
