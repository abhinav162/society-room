"""Meeting records: resolutions.jsonl (hash-chained), minutes.md, agenda.md."""

import hashlib
import json
from datetime import date
from pathlib import Path

GENESIS = "0" * 64


def tally(votes):
    counts = {c: list(votes.values()).count(c) for c in ("aye", "nay", "abstain")}
    # Simple majority of votes cast: abstentions are not cast votes (PRD B3-3).
    return {**counts, "passed": counts["aye"] > counts["nay"]}


def _hash(record):
    body = {k: v for k, v in record.items() if k != "hash"}
    return hashlib.sha256(json.dumps(body, sort_keys=True).encode()).hexdigest()


def _read(path):
    path = Path(path)
    if not path.exists():
        return []
    return [json.loads(line) for line in path.read_text().splitlines() if line.strip()]


def append_resolution(path, motion, invoice_id, votes, present):
    """Append a passed motion and return it; a failed motion is not recorded (None)."""
    result = tally(votes)
    if not result["passed"]:
        return None
    records = _read(path)
    record = {
        "id": f"R-{len(records) + 1:03d}",
        "motion": motion,
        "invoice_id": invoice_id,
        "votes": dict(votes),
        "tally": result,
        "present": present,
        "passed": True,
        "prev_hash": records[-1]["hash"] if records else GENESIS,
    }
    record["hash"] = _hash(record)
    with open(path, "a") as f:
        f.write(json.dumps(record) + "\n")
    return record


def verify_chain(path):
    prev = GENESIS
    for record in _read(path):
        if record.get("prev_hash") != prev or record.get("hash") != _hash(record):
            return False
        prev = record["hash"]
    return True


def find_passed_resolution(path, invoice_id):
    for record in _read(path):
        if record["invoice_id"] == invoice_id and record["passed"]:
            return record
    return None


def append_minute(minutes_path, text):
    with open(minutes_path, "a") as f:
        f.write(f"- {date.today().isoformat()}: {text}\n")


def append_agenda(agenda_path, item):
    with open(agenda_path, "a") as f:
        f.write(f"- {item}\n")
