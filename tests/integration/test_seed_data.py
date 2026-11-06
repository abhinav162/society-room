from pathlib import Path

import yaml

from society_room import rules

ROOM = Path(__file__).parents[2] / "room"


def test_members_file_has_60_members_roles_and_member_7():
    members = rules.load_members(ROOM / "members.yaml")
    assert len(members) == 60
    assert len({m["id"] for m in members}) == 60
    roles = {m.get("role") for m in members}
    assert {"Chairman", "Secretary", "Treasurer"} <= roles
    assert "member-7" in {m["id"] for m in members}


def test_byelaws_file_drives_quorum_and_limits_for_the_real_roster():
    n = len(rules.load_members(ROOM / "members.yaml"))
    assert rules.quorum(n) == 20
    assert rules.committee_limit(n) == 100000


def test_both_invoices_parse_and_check_against_byelaw_156():
    invoices = {}
    for f in sorted((ROOM / "invoices").glob("*.md")):
        front = yaml.safe_load(f.read_text().split("---")[1])
        invoices[front["id"]] = front["amount"]
    assert invoices == {"INV-068": 68000, "INV-400": 400000}
    assert rules.check_spend(invoices["INV-068"], 60).ok
    assert not rules.check_spend(invoices["INV-400"], 60).ok


def test_byelaws_file_holds_156_tiers_and_quorum_rule():
    b = rules.load_byelaws(ROOM / "byelaws.yaml")
    assert [t["limit"] for t in b["156"]["tiers"]] == [25000, 50000, 100000]
    assert b["100"]["quorum"] == {"fraction": "2/3", "cap": 20}
