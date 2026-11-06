from pathlib import Path

from society_room.ledger import book, verify
from society_room.records import append_resolution

ROOM = Path(__file__).parents[2] / "room"


def test_refusals_then_booking_on_room_copy(seed_room):
    room = seed_room
    ledger = room / "ledger.md"
    votes = {f"member-{i}": "aye" for i in range(1, 21)}

    # Beat 2: no resolution yet, nothing is booked.
    assert book(room, "INV-068", "-") == "REFUSED no passed resolution for invoice INV-068"
    assert not ledger.exists()

    # Beat 3: a quorate passed resolution books exactly one line.
    rid = append_resolution(room / "resolutions.jsonl", "Pay lift AMC", "INV-068", votes, 20)["id"]
    assert book(room, "INV-068", rid).startswith("OK booked")
    # Beat 4: over the limit, refused even with a passed resolution.
    big = append_resolution(room / "resolutions.jsonl", "Repaint", "INV-400", votes, 20)["id"]
    assert book(room, "INV-400", big).startswith("REFUSED")

    assert len(ledger.read_text().splitlines()) == 1
    assert "AGM" in (room / "agenda.md").read_text()
    assert verify(room) == "OK"
