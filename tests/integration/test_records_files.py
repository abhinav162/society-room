import json

from society_room.records import (
    append_agenda,
    append_minute,
    append_resolution,
    find_passed_resolution,
    verify_chain,
)


def test_meeting_writes_all_three_files_and_reads_them_back(tmp_path):
    resolutions = tmp_path / "resolutions.jsonl"
    minutes = tmp_path / "minutes.md"
    agenda = tmp_path / "agenda.md"
    passing = {"Asha": "aye", "Ravi": "aye", "Meera": "aye", "Kiran": "aye", "Dev": "nay"}
    tied = {"Asha": "aye", "Ravi": "aye", "Meera": "nay", "Kiran": "nay"}

    # B3-4: a passed motion adds one resolution and one minute.
    rec = append_resolution(resolutions, "Pay lift AMC", "INV-68000", passing, 20)
    append_minute(minutes, f"{rec['id']} passed {rec['tally']['aye']}-{rec['tally']['nay']}")
    # A failed motion adds no resolution.
    assert append_resolution(resolutions, "Pay paint", "INV-30000", tied, 20) is None
    append_minute(minutes, "Motion on INV-30000 failed 2-2")
    # B4-2 / B5-2: an item goes to the AGM agenda.
    append_agenda(agenda, "AGM sanction for INV-30000")

    stored = [json.loads(line) for line in resolutions.read_text().splitlines()]
    assert stored == [rec] and rec["id"] == "R-001"
    assert verify_chain(resolutions)
    assert find_passed_resolution(resolutions, "INV-68000") == rec
    assert find_passed_resolution(resolutions, "INV-30000") is None
    assert len(minutes.read_text().splitlines()) == 2
    assert "R-001 passed 4-1" in minutes.read_text()
    assert agenda.read_text() == "- AGM sanction for INV-30000\n"
