from tests.unit.test_template import load


def test_every_room_agent_exists_and_has_an_owner_rule():
    res = load()
    for room in (r for r in res.values() if r["type"] == "room"):
        for key in room["agents"]:
            assert res[key]["type"] == "agent"
            assert "addressing" in res[key]
