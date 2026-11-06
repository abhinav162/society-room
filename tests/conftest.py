import os
import shutil
from pathlib import Path

import pytest

ROOM = Path(__file__).parents[1] / "room"
# Records a live demo run writes into room/; tests start from the committed seed files only.
RECORDS = shutil.ignore_patterns("agenda.md", "minutes.md", "ledger.md", "resolutions.jsonl", "meeting.json")


@pytest.fixture
def seed_room(tmp_path):
    return Path(shutil.copytree(ROOM, tmp_path / "room", ignore=RECORDS))


def pytest_collection_modifyitems(config, items):
    if os.environ.get("SWITCH_LIVE") == "1":
        return
    skip = pytest.mark.skip(reason="live test: set SWITCH_LIVE=1")
    for item in items:
        if "live" in item.keywords:
            item.add_marker(skip)
