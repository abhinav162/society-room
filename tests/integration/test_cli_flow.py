import json
import subprocess
import sys
from pathlib import Path

import pytest

from society_room.cli import main

ROOM = Path(__file__).parents[2] / "room"
PASSING = "member-1=aye,member-2=aye,member-3=aye,member-4=aye,member-5=nay"
TIED = "member-1=aye,member-2=aye,member-3=nay,member-4=nay"


@pytest.fixture
def room(seed_room):
    return seed_room


def run(room, *argv):
    """Run the CLI as a user would; return (exit code, the one output line)."""
    p = subprocess.run(
        [sys.executable, "-m", "society_room", "--room", str(room), *argv],
        capture_output=True,
        text=True,
        check=False,
    )
    lines = p.stdout.splitlines()
    assert len(lines) == 1, p.stdout + p.stderr
    return p.returncode, lines[0]


def present(n):
    return ",".join(f"member-{i}" for i in range(1, n + 1))


def lines(path):
    return path.read_text().splitlines() if path.exists() else []


def test_b3_1_b3_2_quorum_19_refused_20_ok(room):
    code, out = run(room, "meeting", "open", "--present", present(19), "--chair", "chairman")
    assert (code, out) == (1, "REFUSED quorum not met (19/20)")
    assert not (room / "meeting.json").exists()
    assert run(room, "vote", "--invoice", "INV-068", "--motion", "m", "--votes", PASSING, "--by", "chairman")[0] == 1

    code, out = run(room, "meeting", "open", "--present", present(20), "--chair", "chairman")
    assert code == 0 and out.startswith("OK ")
    meeting = json.loads((room / "meeting.json").read_text())
    assert meeting["open"] and meeting["quorate"] and meeting["quorum_needed"] == 20
    assert len(meeting["present"]) == 20 and meeting["opened_at"]


def test_b3_3_b3_4_passed_motion_adds_one_resolution_and_one_minute(room):
    run(room, "meeting", "open", "--present", present(20), "--chair", "chairman")
    code, out = run(room, "vote", "--invoice", "INV-068", "--motion", "Pay lift AMC", "--votes", PASSING, "--by", "chairman")
    assert code == 0 and out.startswith("OK R-001") and "4-1" in out
    [rec] = [json.loads(x) for x in lines(room / "resolutions.jsonl")]
    assert rec["invoice_id"] == "INV-068" and rec["present"] == 20
    assert rec["votes"]["member-5"] == "nay"
    assert len(lines(room / "minutes.md")) == 1 and "R-001" in lines(room / "minutes.md")[0]


def test_tied_motion_records_nothing(room):
    run(room, "meeting", "open", "--present", present(20), "--chair", "chairman")
    code, out = run(room, "vote", "--invoice", "INV-068", "--motion", "m", "--votes", TIED, "--by", "chairman")
    assert code == 1 and out.startswith("REFUSED ")
    assert lines(room / "resolutions.jsonl") == [] and lines(room / "minutes.md") == []


def test_vote_without_meeting_refused(room):
    code, out = run(room, "vote", "--invoice", "INV-068", "--motion", "m", "--votes", PASSING, "--by", "chairman")
    assert code == 1 and out.startswith("REFUSED ")
    assert lines(room / "resolutions.jsonl") == []


def test_vote_by_absent_member_refused(room):
    run(room, "meeting", "open", "--present", present(20), "--chair", "chairman")
    code, out = run(room, "vote", "--invoice", "INV-068", "--motion", "m", "--votes", "member-21=aye", "--by", "chairman")
    assert code == 1 and "member-21" in out
    assert lines(room / "resolutions.jsonl") == []


def test_meeting_close_then_vote_refused(room):
    run(room, "meeting", "open", "--present", present(20), "--chair", "chairman")
    assert run(room, "meeting", "close", "--by", "chairman")[0] == 0
    assert run(room, "vote", "--invoice", "INV-068", "--motion", "m", "--votes", PASSING, "--by", "chairman")[0] == 1


def test_b4_1_b4_2_check_refers_400000_and_passes_68000(room):
    code, out = run(room, "check", "INV-400")
    assert (code, out) == (1, "REFUSED over bye-law 156 limit ₹1,00,000 (51+ members); referred to AGM")
    assert len(lines(room / "agenda.md")) == 1 and "INV-400" in lines(room / "agenda.md")[0]
    code, out = run(room, "check", "INV-068")
    assert code == 0 and out.startswith("OK ")
    assert len(lines(room / "agenda.md")) == 1


def test_agenda_add_and_status(room, capsys):
    assert main(["--room", str(room), "agenda", "add", "Repair water tank"]) == 0
    assert lines(room / "agenda.md") == ["- Repair water tank"]
    main(["--room", str(room), "meeting", "open", "--present", present(20), "--chair", "chairman"])
    main(["--room", str(room), "vote", "--invoice", "INV-068", "--motion", "m", "--votes", PASSING, "--by", "chairman"])
    capsys.readouterr()
    assert main(["--room", str(room), "status"]) == 0
    out = capsys.readouterr().out
    assert out.startswith("OK ") and "open" in out and "R-001" in out and "verified" in out


def test_duplicate_attendees_do_not_count_toward_quorum(room):  # B3-2
    code, out = run(room, "meeting", "open", "--present", ",".join(["member-1"] * 20), "--chair", "chairman")
    assert (code, out) == (1, "REFUSED quorum not met (1/20)")


def test_open_records_the_chair(room):
    code, out = run(room, "meeting", "open", "--present", present(20), "--chair", "chairman")
    assert (code, out) == (0, "OK meeting open: 20 present, 20 needed, chair chairman")
    assert json.loads((room / "meeting.json").read_text())["chair"] == "chairman"


def test_only_the_chair_may_close_or_vote(room):  # PER-88: an outsider's "close the meeting"
    run(room, "meeting", "open", "--present", present(20), "--chair", "chairman")
    before = (room / "meeting.json").read_text()
    assert run(room, "meeting", "close", "--by", "abhinav") == (1, "REFUSED only the chair chairman may close the meeting")
    vote = ("vote", "--invoice", "INV-068", "--motion", "m", "--votes", PASSING, "--by", "abhinav")
    assert run(room, *vote) == (1, "REFUSED only the chair chairman may record votes")
    assert (room / "meeting.json").read_text() == before
    assert lines(room / "resolutions.jsonl") == [] and lines(room / "minutes.md") == []


def test_state_refusals_come_before_the_chair_check(room):
    assert run(room, "meeting", "close", "--by", "abhinav") == (1, "REFUSED no open meeting")
    vote = ("vote", "--invoice", "INV-068", "--motion", "m", "--votes", PASSING, "--by", "abhinav")
    assert run(room, *vote) == (1, "REFUSED no open quorate meeting")
