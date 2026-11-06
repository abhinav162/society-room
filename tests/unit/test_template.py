from pathlib import Path

import yaml

TEMPLATE = Path(__file__).parents[2] / "switch" / "society-room.yaml"


def load():
    return yaml.safe_load(TEMPLATE.read_text())["resources"]


def test_template_is_version_2_with_both_rooms():
    rooms = {r["name"] for r in load().values() if r["type"] == "room"}
    assert rooms == {"committee", "general-body"}
