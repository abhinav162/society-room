"""The payment gate (architecture section 7): book only what the records prove, never an LLM decision."""

from datetime import date

import yaml

from society_room import records, rules

SEP = " · "


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


def book(room, invoice_id, resolution_id):
    invoice = _invoice(room, invoice_id)
    if invoice is None:
        return f"REFUSED no invoice {invoice_id}"
    if resolution_id == "-" or _resolution(room, resolution_id, invoice_id) is None:
        return f"REFUSED no passed resolution for invoice {invoice_id}"
    spend = rules.check_spend(invoice["amount"], _members(room))
    if not spend.ok:
        records.append_agenda(
            room / "agenda.md", f"AGM sanction for {invoice_id} ({resolution_id}): {spend.reason}"
        )
        return f"REFUSED {spend.reason}"
    if any(line.split(SEP)[1] == invoice_id for line in _lines(room)):
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
    for line in _lines(room):
        fields = line.split(SEP)
        if (
            len(fields) < 4
            or _invoice(room, fields[1]) is None
            or _resolution(room, fields[3], fields[1]) is None
        ):
            return f"REFUSED {line}"
    return "OK"
