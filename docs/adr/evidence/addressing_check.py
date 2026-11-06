"""Go/no-go check A: run Switch 0.31.0's own addressing policy code against the demo cast.
Run with the Switch Console venv python (see ADR 0001)."""
from switch_core.addressing import owner_only_policy, default_agent_policy, AddressingPolicy, AddressingRule

ROOM, GROUP = "committee", "society"
TREASURER, CHAIRMAN, MEMBER7, UNLINKED = "u-treasurer", "u-chairman", "u-member7", None
CLERK_AGENT_OWNER = "u-chairman"

def ask(policy, owner, sender_users, kind="user", sender_owner=None):
    return policy.allows(room_id=ROOM, group_id=GROUP, sender_kind=kind, sender_id="x",
                         sender_user_ids=sender_users, sender_owner_user_id=sender_owner,
                         owner_user_id=owner)

checks = []
for name, pol in [("owner_only", owner_only_policy([])), ("default (owner+owner_agents)", default_agent_policy())]:
    checks += [
        (f"{name}: Treasurer -> treasurer-agent", ask(pol, TREASURER, [TREASURER]), True),
        (f"{name}: member-7 -> treasurer-agent", ask(pol, TREASURER, [MEMBER7]), False),
        (f"{name}: Chairman -> treasurer-agent", ask(pol, TREASURER, [CHAIRMAN]), False),
        (f"{name}: unlinked chat account -> treasurer-agent", ask(pol, TREASURER, []), False),
        (f"{name}: clerk agent (owned by Chairman) -> treasurer-agent", ask(pol, TREASURER, [], "agent", CLERK_AGENT_OWNER), False),
        (f"{name}: platform -> treasurer-agent", ask(pol, TREASURER, [], "platform"), False),
    ]
# Custom rule: treasurer-agent owned by a deployer, Treasurer named explicitly, committee room only
custom = AddressingPolicy(rules=[AddressingRule(rooms=[ROOM], users=[TREASURER], agents=[])])
checks += [
    ("custom users=[Treasurer]: Treasurer", custom.allows(room_id=ROOM, group_id=GROUP, sender_kind="user", sender_id=TREASURER, sender_user_ids=[TREASURER], sender_owner_user_id=None, owner_user_id="u-deployer"), True),
    ("custom users=[Treasurer]: member-7", custom.allows(room_id=ROOM, group_id=GROUP, sender_kind="user", sender_id=MEMBER7, sender_user_ids=[MEMBER7], sender_owner_user_id=None, owner_user_id="u-deployer"), False),
    ("custom users=[Treasurer]: Treasurer in general-body", custom.allows(room_id="general-body", group_id=GROUP, sender_kind="user", sender_id=TREASURER, sender_user_ids=[TREASURER], sender_owner_user_id=None, owner_user_id="u-deployer"), False),
]
ok = True
for label, got, want in checks:
    ok &= got == want
    print(("PASS" if got == want else "FAIL"), label, "->", "allowed" if got else "refused")
assert ok, "addressing behaviour differs from ADR 0001"
print("ALL PASS")
