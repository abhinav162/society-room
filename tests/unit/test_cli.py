
import pytest

from society_room.cli import main, parse_votes
from society_room.rules import inr, invoice_amount


def test_parse_votes():
    assert parse_votes("member-1=aye,member-2=nay") == {"member-1": "aye", "member-2": "nay"}


def test_parse_votes_rejects_unknown_choice():
    with pytest.raises(ValueError):
        parse_votes("member-1=maybe")


def test_invoice_amount_reads_front_matter(tmp_path):
    (tmp_path / "invoices").mkdir()
    (tmp_path / "invoices" / "INV-1.md").write_text("---\nid: INV-1\namount: 500\n---\nbody\n")
    assert invoice_amount(tmp_path, "INV-1") == 500


def test_unknown_invoice_is_refused_with_one_line(tmp_path, capsys):
    assert main(["--room", str(tmp_path), "check", "INV-NONE"]) == 1
    out = capsys.readouterr().out.splitlines()
    assert len(out) == 1 and out[0].startswith("REFUSED ")


def test_inr_groups_indian_style():
    assert [inr(n) for n in (500, 25000, 100000, 400000, 12345678)] == [
        "₹500", "₹25,000", "₹1,00,000", "₹4,00,000", "₹1,23,45,678"
    ]


def test_book_and_verify_print_the_ledger_line_once(seed_room, capsys):
    room = seed_room
    assert main(["--room", str(room), "book", "INV-068", "-"]) == 1
    assert capsys.readouterr().out == "REFUSED no passed resolution for invoice INV-068\n"
    assert main(["--room", str(room), "verify"]) == 0
    assert capsys.readouterr().out == "OK\n"
