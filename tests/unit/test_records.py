import json

from society_room.records import (
    append_agenda,
    append_minute,
    append_resolution,
    find_passed_resolution,
    tally,
    verify_chain,
)


def votes(aye, nay, abstain=0):
    names = iter(f"M{i}" for i in range(100))
    v = {}
    for choice, n in (("aye", aye), ("nay", nay), ("abstain", abstain)):
        for _ in range(n):
            v[next(names)] = choice
    return v


def lines(path):
    return path.read_text().splitlines() if path.exists() else []


def test_tally_four_aye_one_nay_passes():
    assert tally(votes(4, 1)) == {"aye": 4, "nay": 1, "abstain": 0, "passed": True}


def test_tally_tie_fails():
    assert tally(votes(2, 2))["passed"] is False


def test_tally_ignores_abstentions():
    assert tally(votes(2, 1, abstain=5))["passed"] is True


def test_passed_motion_appends_one_line_with_ids_and_chain(tmp_path):
    path = tmp_path / "resolutions.jsonl"
    r1 = append_resolution(path, "Pay lift AMC", "INV-1", votes(4, 1), 20)
    r2 = append_resolution(path, "Pay paint", "INV-2", votes(3, 0), 21)
    assert len(lines(path)) == 2
    assert (r1["id"], r2["id"]) == ("R-001", "R-002")
    assert r1["prev_hash"] == "0" * 64 and r2["prev_hash"] == r1["hash"]
    assert r1["votes"]["M0"] == "aye" and r1["tally"]["aye"] == 4
    assert r1["present"] == 20 and r1["passed"] is True
    assert json.loads(lines(path)[0]) == r1


def test_failed_motion_appends_nothing(tmp_path):
    path = tmp_path / "resolutions.jsonl"
    assert append_resolution(path, "Pay", "INV-1", votes(2, 2), 20) is None
    assert lines(path) == []


def test_verify_chain_true_after_two_appends(tmp_path):
    path = tmp_path / "resolutions.jsonl"
    append_resolution(path, "a", "INV-1", votes(4, 1), 20)
    append_resolution(path, "b", "INV-2", votes(4, 1), 20)
    assert verify_chain(path) is True


def test_verify_chain_false_after_editing_any_field_of_line_one(tmp_path):
    path = tmp_path / "resolutions.jsonl"
    append_resolution(path, "a", "INV-1", votes(4, 1), 20)
    append_resolution(path, "b", "INV-2", votes(4, 1), 20)
    original = lines(path)
    for field in json.loads(original[0]):
        rec = json.loads(original[0])
        rec[field] = "tampered"
        path.write_text("\n".join([json.dumps(rec), original[1]]) + "\n")
        assert verify_chain(path) is False, field


def test_find_passed_resolution_by_invoice_id(tmp_path):
    path = tmp_path / "resolutions.jsonl"
    append_resolution(path, "a", "INV-1", votes(4, 1), 20)
    r2 = append_resolution(path, "b", "INV-2", votes(4, 1), 20)
    assert find_passed_resolution(path, "INV-2") == r2
    assert find_passed_resolution(path, "INV-9") is None
    assert find_passed_resolution(tmp_path / "missing.jsonl", "INV-1") is None


def test_append_minute_adds_one_dated_entry(tmp_path):
    path = tmp_path / "minutes.md"
    append_minute(path, "R-001 passed 4-1")
    append_minute(path, "Meeting closed")
    assert len(lines(path)) == 2
    assert lines(path)[0].startswith("- 20") and lines(path)[0].endswith("R-001 passed 4-1")


def test_append_agenda_adds_one_item(tmp_path):
    path = tmp_path / "agenda.md"
    append_agenda(path, "AGM: sanction Rs 30,000 repaint")
    assert lines(path) == ["- AGM: sanction Rs 30,000 repaint"]
