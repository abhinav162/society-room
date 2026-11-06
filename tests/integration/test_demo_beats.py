"""The demo, beats B2-B5, driven only through the CLI as the agents would run it."""

import json
import shutil
import subprocess
import sys
from pathlib import Path

ROOM = Path(__file__).parents[2] / "room"
PASSING = "member-1=aye,member-2=aye,member-3=aye,member-4=aye,member-5=nay"


def run(room, *argv):
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
    return [x for x in path.read_text().splitlines() if x.strip()] if path.exists() else []


def test_demo_beats_b2_to_b5(tmp_path):
    room = shutil.copytree(ROOM, tmp_path / "room")
    ledger = room / "ledger.md"

    # B2: no resolution, no payment.
    assert run(room, "book", "INV-068", "-") == (1, "REFUSED no passed resolution for invoice INV-068")
    assert lines(ledger) == []

    # B3: quorum, vote, book.
    assert run(room, "meeting", "open", "--present", present(19)) == (1, "REFUSED quorum not met (19/20)")
    assert run(room, "meeting", "open", "--present", present(41))[0] == 0
    code, out = run(room, "vote", "--invoice", "INV-068", "--motion", "Pay lift AMC", "--votes", PASSING)
    assert code == 0 and out.startswith("OK R-001")
    assert run(room, "meeting", "close")[0] == 0
    code, out = run(room, "check", "INV-068")
    assert code == 0 and out.startswith("OK ")
    code, out = run(room, "book", "INV-068", "R-001")
    assert code == 0 and out.startswith("OK booked") and not out.startswith("OK OK")
    [paid] = lines(ledger)
    assert "INV-068" in paid and "R-001" in paid and "PAID, mock UPI ref" in paid

    # B4: over the bye-law 156 limit, a passed resolution does not override it.
    assert run(room, "check", "INV-400") == (
        1,
        "REFUSED over bye-law 156 limit ₹1,00,000 (51+ members); referred to AGM",
    )
    assert len(lines(room / "agenda.md")) == 1
    run(room, "meeting", "open", "--present", present(41))
    code, out = run(room, "vote", "--invoice", "INV-400", "--motion", "Repaint", "--votes", PASSING)
    assert code == 0 and out.startswith("OK R-002")
    run(room, "meeting", "close")
    code, out = run(room, "book", "INV-400", "R-002")
    assert code == 1 and out.startswith("REFUSED over bye-law 156 limit")
    assert lines(ledger) == [paid]

    # B5-1: the published files hold every figure the concierge cites.
    assert paid.split(" · ")[2] == "68000"  # 68000 / 60 flats / 12 months ≈ ₹94.4, ~₹95 a month
    assert any("R-001" in m for m in lines(room / "minutes.md"))
    r1 = json.loads(lines(room / "resolutions.jsonl")[0])
    assert r1["id"] == "R-001" and r1["present"] == 41
    assert (r1["tally"]["aye"], r1["tally"]["nay"]) == (4, 1)

    assert run(room, "verify") == (0, "OK")
    code, out = run(room, "status")
    assert code == 0 and "chain verified" in out
