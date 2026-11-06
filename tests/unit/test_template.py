import re
from pathlib import Path

import pytest
import yaml

TEMPLATE = Path(__file__).parents[2] / "switch" / "society-room.yaml"
CLI = "cd {room_dir}/.. && uv run python -m society_room --room {room_dir}"
AGENTS = ("clerk", "treasurer_agent", "byelaw", "concierge")


def doc():
    return yaml.safe_load(TEMPLATE.read_text())


def load():
    return doc()["resources"]


def test_template_is_version_2_with_both_rooms():
    rooms = {r["name"] for r in load().values() if r["type"] == "room"}
    assert rooms == {"committee", "general-body"}


def test_room_dir_is_a_string_param_prefilled_with_an_absolute_room_path():
    # Console locks "directory" params to the agents folder, so room_dir is a prefilled string.
    param = doc()["params"]["room_dir"]
    assert param["type"] == "string"
    assert Path(param["default"]).is_absolute() and param["default"].endswith("/room")


@pytest.mark.parametrize("key", AGENTS)
def test_agent_instructions_name_the_cli_in_three_lines(key):
    text = load()[key]["instructions"]
    assert CLI in text
    assert len(text.strip().splitlines()) <= 3


def test_no_rupee_amount_or_quorum_number_in_any_instruction():
    # B1-4: numbers come from the CLI, never from the prompt.
    for res in load().values():
        for field in ("instructions", "kickoff"):
            text = res.get(field, "")
            assert not re.search(r"\d|₹|\bRs\b|INR|rupee", text, re.IGNORECASE), (res["name"], text)


def test_treasurer_agent_is_owner_only():
    assert load()["treasurer_agent"]["addressing"] == "owner"


def test_treasurer_books_with_dash_instead_of_asking_for_a_resolution():
    # Live run: with no resolution named, the agent asked first; the CLI's refusal is the answer.
    assert "`-` when the message names none" in load()["treasurer_agent"]["instructions"]


def test_room_membership():
    res = load()
    assert set(res["committee"]["agents"]) == {"clerk", "treasurer_agent", "byelaw"}
    assert res["general_body"]["agents"] == ["concierge"]


def test_committee_kickoff_defines_meeting_chair():
    assert "meeting-chair" in load()["committee"]["kickoff"]


def test_template_lints_clean():
    lint = pytest.importorskip("switch_core.template_lint")
    result = lint.lint_template(TEMPLATE.read_text())
    assert result.errors == []


def test_clerk_vote_example_uses_the_cli_vote_words():
    text = load()["clerk"]["instructions"]
    assert "=aye" in text and "=nay" in text and "=yes" not in text


def test_clerk_is_owner_only_and_passes_the_sender_as_chair():
    # PER-88: Switch refuses outsiders before the clerk sees them; the CLI checks the chair.
    clerk = load()["clerk"]
    assert clerk["addressing"] == "owner"
    assert "--chair" in clerk["instructions"] and "--by" in clerk["instructions"]
