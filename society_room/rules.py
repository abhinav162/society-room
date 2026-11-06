"""Bye-law checks: deterministic code over room/byelaws.yaml, never an LLM decision."""

import math
from dataclasses import dataclass
from fractions import Fraction
from pathlib import Path

import yaml

ROOM = Path(__file__).parents[1] / "room"


def load_byelaws(path):
    return yaml.safe_load(Path(path).read_text())


def load_members(path):
    return yaml.safe_load(Path(path).read_text())["members"]


BYELAWS = load_byelaws(ROOM / "byelaws.yaml")


def quorum(member_count):
    q = BYELAWS["100"]["quorum"]
    return min(math.ceil(Fraction(q["fraction"]) * member_count), q["cap"])


def quorum_met(present, member_count):
    return present >= quorum(member_count)


def _tier(member_count):
    low = 1
    for t in BYELAWS["156"]["tiers"]:
        top = t["max_members"]
        if top is None or member_count <= top:
            label = f"{low}+" if top is None else f"{low}-{top}"
            return t["limit"], label
        low = top + 1
    raise ValueError("byelaws.yaml: bye-law 156 needs a last tier with max_members: null")


def committee_limit(member_count):
    return _tier(member_count)[0]


def limit_refusal(member_count):
    """The refusal text for a spend over the bye-law 156 limit (PRD B4-1)."""
    limit, label = _tier(member_count)
    return f"over bye-law 156 limit {inr(limit)} ({label} members); referred to AGM"


def inr(amount):
    """Rupees with Indian digit grouping: 100000 -> ₹1,00,000."""
    head, tail = str(amount)[:-3], str(amount)[-3:]
    groups = []
    while head:
        groups.insert(0, head[-2:])
        head = head[:-2]
    return "₹" + ",".join([*groups, tail])


def invoice_amount(room, invoice_id):
    """The amount on invoices/<id>.md, or None when there is no such invoice."""
    path = Path(room) / "invoices" / f"{invoice_id}.md"
    if not path.exists():
        return None
    return yaml.safe_load(path.read_text().split("---")[1])["amount"]


@dataclass(frozen=True)
class SpendCheck:
    ok: bool
    reason: str


def check_spend(amount, member_count):
    limit, label = _tier(member_count)
    rule = f"bye-law 156: committee limit {limit} for {label} members"
    if amount <= limit:
        return SpendCheck(True, f"{amount} is within {rule}")
    return SpendCheck(False, f"{amount} exceeds {rule}; needs General Body sanction, goes to AGM agenda")
