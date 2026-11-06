"""`python -m society_room`: one line out, 'OK ...' (exit 0) or 'REFUSED ...' (exit 1)."""

import argparse
import json
from datetime import UTC, datetime
from pathlib import Path

from society_room import ledger, records, rules

CHOICES = ("aye", "nay", "abstain")


class Refused(Exception):
    pass


def parse_votes(text):
    votes = dict(pair.split("=", 1) for pair in text.split(","))
    bad = [v for v in votes.values() if v not in CHOICES]
    if bad:
        raise ValueError(f"vote must be one of {', '.join(CHOICES)}, got {bad[0]}")
    return votes


def _members(room):
    return [m["id"] for m in rules.load_members(room / "members.yaml")]


def _meeting(room):
    path = room / "meeting.json"
    return json.loads(path.read_text()) if path.exists() else {"open": False}


def meeting_open(room, args):
    present = sorted(set(args.present.split(",")))  # a name listed twice is one person
    strangers = sorted(set(present) - set(_members(room)))
    if strangers:
        raise Refused(f"not members: {', '.join(strangers)}")
    needed = rules.quorum(len(_members(room)))
    if not rules.quorum_met(len(present), len(_members(room))):
        raise Refused(f"quorum not met ({len(present)}/{needed})")
    meeting = {
        "open": True,
        "opened_at": datetime.now(UTC).isoformat(),
        "present": present,
        "quorum_needed": needed,
        "quorate": True,
    }
    (room / "meeting.json").write_text(json.dumps(meeting, indent=2) + "\n")
    return f"meeting open: {len(present)} present, {needed} needed"


def meeting_close(room, args):
    meeting = _meeting(room)
    if not meeting["open"]:
        raise Refused("no open meeting")
    (room / "meeting.json").write_text(json.dumps({**meeting, "open": False}, indent=2) + "\n")
    return "meeting closed"


def vote(room, args):
    meeting = _meeting(room)
    if not (meeting["open"] and meeting.get("quorate")):
        raise Refused("no open quorate meeting")
    try:
        votes = parse_votes(args.votes)
    except ValueError as e:
        raise Refused(str(e)) from e
    absent = sorted(set(votes) - set(meeting["present"]))
    if absent:
        raise Refused(f"not present: {', '.join(absent)}")
    rec = records.append_resolution(
        room / "resolutions.jsonl", args.motion, args.invoice, votes, len(meeting["present"])
    )
    t = records.tally(votes)
    score = f"{t['aye']}-{t['nay']} ({t['abstain']} abstain)"
    if rec is None:
        raise Refused(f"motion failed {score}; nothing recorded")
    records.append_minute(room / "minutes.md", f"{rec['id']} passed {score}: {args.motion} ({args.invoice})")
    return f"{rec['id']} passed {score}"


def check(room, args):
    amount = rules.invoice_amount(room, args.id)
    if amount is None:
        raise Refused(f"no invoice {args.id}")
    members = len(_members(room))
    result = rules.check_spend(amount, members)
    if not result.ok:
        records.append_agenda(room / "agenda.md", f"AGM sanction for {args.id}: {result.reason}")
        raise Refused(rules.limit_refusal(members))
    return result.reason


def agenda_add(room, args):
    records.append_agenda(room / "agenda.md", args.text)
    return f"agenda item added: {args.text}"


def status(room, args):
    path = room / "resolutions.jsonl"
    rows = [x for x in path.read_text().splitlines() if x.strip()] if path.exists() else []
    last = json.loads(rows[-1])["id"] if rows else "none"
    chain = "verified" if records.verify_chain(path) else "BROKEN"
    state = "open" if _meeting(room)["open"] else "closed"
    return f"meeting {state}, last resolution {last}, chain {chain}"


def book(room, args):
    return ledger.book(room, args.invoice, args.resolution)


def verify(room, args):
    return ledger.verify(room)


def _parser():
    p = argparse.ArgumentParser(prog="society_room")
    p.add_argument("--room", type=Path, default=rules.ROOM)
    sub = p.add_subparsers(dest="command", required=True)

    meeting = sub.add_parser("meeting").add_subparsers(dest="action", required=True)
    o = meeting.add_parser("open")
    o.add_argument("--present", required=True)
    o.set_defaults(run=meeting_open)
    meeting.add_parser("close").set_defaults(run=meeting_close)

    v = sub.add_parser("vote")
    v.add_argument("--invoice", required=True)
    v.add_argument("--motion", required=True)
    v.add_argument("--votes", required=True)
    v.set_defaults(run=vote)

    c = sub.add_parser("check")
    c.add_argument("id")
    c.set_defaults(run=check)

    a = sub.add_parser("agenda").add_subparsers(dest="action", required=True).add_parser("add")
    a.add_argument("text")
    a.set_defaults(run=agenda_add)

    b = sub.add_parser("book")
    b.add_argument("invoice")
    b.add_argument("resolution", help="resolution id, or - for none")
    b.set_defaults(run=book)

    sub.add_parser("verify").set_defaults(run=verify)
    sub.add_parser("status").set_defaults(run=status)
    return p


def main(argv=None):
    args = _parser().parse_args(argv)
    try:
        out = args.run(args.room, args)
    except Refused as e:
        print(f"REFUSED {e}")
        return 1
    if args.run in (book, verify):  # ledger strings already start with OK or REFUSED
        print(out)
        return 0 if out.startswith("OK") else 1
    print(f"OK {out}")
    return 0
