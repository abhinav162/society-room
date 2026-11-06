"""The payment gate (architecture section 7): book only what the records prove, never an LLM decision."""

from datetime import date

import yaml

from society_room import records, rules

SEP = " · "


def _inr(n):
    """Indian digit grouping: 400000 -> 4,00,000."""
    head, tail = str(n)[:-3], str(n)[-3:]
    groups = []
    while len(head) > 2:
        head, groups = head[:-2], [head[-2:], *groups]
    return ",".join([g for g in [head, *groups] if g] + [tail])


def _invoice(room, invoice_id):
    path = room / "invoices" / f"{invoice_id}.md"
    if not path.exists():
        return None
    return yaml.safe_load(path.read_text().split("---")[1])


def _members(room):
    return len(rules.load_members(room / "members.yaml"))


def _resolution(room, resolution_id, invoice_id):
    """The passed, quorate resolution with this id naming this invoice, else None."""
    for r in records._read(room / "resolutions.jsonl"):
        if (
            r["id"] == resolution_id
            and r["passed"]
            and r["invoice_id"] == invoice_id
            and rules.quorum_met(r["present"], _members(room))
        ):
            return r
    return None


def _lines(room):
    path = room / "ledger.md"
    return [line for line in path.read_text().splitlines() if line.strip()] if path.exists() else []


CHAIN_BROKEN = "REFUSED resolutions.jsonl hash chain broken"


def book(room, invoice_id, resolution_id):
    if not records.verify_chain(room / "resolutions.jsonl"):
        return CHAIN_BROKEN
    invoice = _invoice(room, invoice_id)
    if invoice is None:
        return f"REFUSED no invoice {invoice_id}"
    if resolution_id == "-" or _resolution(room, resolution_id, invoice_id) is None:
        return f"REFUSED no passed resolution for invoice {invoice_id}"
    spend = rules.check_spend(invoice["amount"], _members(room))
    if not spend.ok:
        limit, label = rules._tier(_members(room))
        item = f"AGM sanction for {invoice_id} ({resolution_id}): {spend.reason}"
        agenda = room / "agenda.md"
        if not (agenda.exists() and f"- {item}" in agenda.read_text().splitlines()):
            records.append_agenda(agenda, item)
        return f"REFUSED over bye-law 156 limit ₹{_inr(limit)} ({label} members); referred to AGM"
    if any(line.split(SEP)[1:2] == [invoice_id] for line in _lines(room)):
        return "REFUSED already booked"
    ref = f"MOCK-{invoice_id}-{resolution_id}"
    line = SEP.join(
        [
            date.today().isoformat(),
            invoice_id,
            str(invoice["amount"]),
            resolution_id,
            "byelaw OK",
            f"PAID, mock UPI ref {ref}",
        ]
    )
    with open(room / "ledger.md", "a") as f:
        f.write(line + "\n")
    return f"OK booked {invoice_id} {invoice['amount']} under {resolution_id}, mock UPI ref {ref}"


def verify(room):
    """Re-check every ledger line against invoices and resolutions; catches hand edits."""
    if not records.verify_chain(room / "resolutions.jsonl"):
        return CHAIN_BROKEN
    for line in _lines(room):
        fields = line.split(SEP)
        invoice = _invoice(room, fields[1]) if len(fields) >= 4 else None
        if (
            invoice is None
            or fields[2] != str(invoice["amount"])
            or not rules.check_spend(invoice["amount"], _members(room)).ok
            or _resolution(room, fields[3], fields[1]) is None
        ):
            return f"REFUSED {line}"
    return "OK"
