
import pytest

from society_room import rules


@pytest.mark.parametrize("members,expected", [(60, 20), (30, 20), (27, 18), (25, 17), (3, 2)])
def test_quorum_is_two_thirds_or_20_whichever_is_less(members, expected):
    assert rules.quorum(members) == expected


def test_quorum_met_boundary_for_60_members():
    assert not rules.quorum_met(19, 60)
    assert rules.quorum_met(20, 60)


@pytest.mark.parametrize(
    "members,limit", [(1, 25000), (25, 25000), (26, 50000), (50, 50000), (51, 100000), (60, 100000)]
)
def test_committee_limit_tiers(members, limit):
    assert rules.committee_limit(members) == limit


def test_spend_at_limit_is_ok_and_cites_byelaw_156():
    r = rules.check_spend(100000, 60)
    assert r.ok
    assert "bye-law 156" in r.reason


def test_spend_one_rupee_over_limit_goes_to_agm():
    r = rules.check_spend(100001, 60)
    assert not r.ok
    assert "bye-law 156" in r.reason
    assert "100000" in r.reason
    assert "51+" in r.reason
    assert "AGM agenda" in r.reason


def test_lift_amc_ok_and_repainting_refused_for_60_members():
    assert rules.check_spend(68000, 60).ok
    assert not rules.check_spend(400000, 60).ok
