import shutil
from pathlib import Path

import pytest

from society_room.ledger import _inr, book, verify
from society_room.records import append_resolution

ROOM = Path(__file__).parents[2] / "room"
AYES = {"member-1": "aye", "member-2": "aye", "member-4": "nay"}


@pytest.fixture
def room(tmp_path):
    return Path(shutil.copytree(ROOM, tmp_path / "room"))


def resolve(room, invoice_id, present=20):
    return append_resolution(
        room / "resolutions.jsonl", f"Pay {invoice_id}", invoice_id, AYES, present
    )["id"]


def ledger(room):
    path = room / "ledger.md"
    return path.read_text() if path.exists() else ""


def test_no_invoice_refused(room):
    assert book(room, "INV-999", "R-001") == "REFUSED no invoice INV-999"
    assert ledger(room) == ""


def test_no_resolution_refused_naming_it(room):  # B2-3, B2-4
    assert book(room, "INV-068", "-") == "REFUSED no passed resolution for invoice INV-068"
    assert book(room, "INV-068", "R-001") == "REFUSED no passed resolution for invoice INV-068"
    assert ledger(room) == ""


def test_resolution_for_another_invoice_refused(room):
    rid = resolve(room, "INV-400")
    assert book(room, "INV-068", rid) == "REFUSED no passed resolution for invoice INV-068"
    assert ledger(room) == ""


def test_inquorate_resolution_refused(room):
    rid = resolve(room, "INV-068", present=19)  # quorum for 60 members is 20
    assert book(room, "INV-068", rid) == "REFUSED no passed resolution for invoice INV-068"
    assert ledger(room) == ""


def test_over_limit_refused_despite_resolution_and_goes_to_agenda(room):  # B4-2
    rid = resolve(room, "INV-400")
    out = book(room, "INV-400", rid)
    assert out == "REFUSED over bye-law 156 limit ₹1,00,000 (51+ members); referred to AGM"
    assert ledger(room) == ""
    assert len((room / "agenda.md").read_text().splitlines()) == 1


def test_books_one_line(room):  # B3-5
    rid = resolve(room, "INV-068")
    assert book(room, "INV-068", rid).startswith("OK booked INV-068")
    lines = ledger(room).splitlines()
    assert len(lines) == 1
    assert "INV-068" in lines[0] and rid in lines[0] and "PAID, mock UPI ref" in lines[0]


def test_second_booking_refused(room):
    rid = resolve(room, "INV-068")
    book(room, "INV-068", rid)
    before = ledger(room)
    assert book(room, "INV-068", rid) == "REFUSED already booked"
    assert ledger(room) == before


def test_inr():
    assert [_inr(n) for n in (100, 25000, 100000, 400000)] == [
        "100",
        "25,000",
        "1,00,000",
        "4,00,000",
    ]


def test_verify(room):
    assert verify(room) == "OK"
    rid = resolve(room, "INV-068")
    book(room, "INV-068", rid)
    assert verify(room) == "OK"
    forged = "2026-11-06 · INV-400 · 400000 · R-009 · byelaw OK · PAID, mock UPI ref X"
    with open(room / "ledger.md", "a") as f:
        f.write(forged + "\n")
    assert verify(room) == f"REFUSED {forged}"


def test_verify_catches_edited_resolution(room):
    rid = resolve(room, "INV-068")
    book(room, "INV-068", rid)
    path = room / "resolutions.jsonl"
    path.write_text(path.read_text().replace('"present": 20', '"present": 41'))
    assert verify(room) == "REFUSED resolutions.jsonl hash chain broken"


def test_book_survives_malformed_ledger_line(room):
    (room / "ledger.md").write_text("hand-written note\n")
    rid = resolve(room, "INV-068")
    assert book(room, "INV-068", rid).startswith("OK booked INV-068")
