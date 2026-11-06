"""The payment gate (architecture section 7): book only what the records prove, never an LLM decision."""

from datetime import date

from society_room import records, rules

SEP = " · "


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
    amount = rules.invoice_amount(room, invoice_id)
    if amount is None:
        return f"REFUSED no invoice {invoice_id}"
    if resolution_id == "-" or _resolution(room, resolution_id, invoice_id) is None:
        return f"REFUSED no passed resolution for invoice {invoice_id}"
    spend = rules.check_spend(amount, _members(room))
    if not spend.ok:
        item = f"AGM sanction for {invoice_id} ({resolution_id}): {spend.reason}"
        agenda = room / "agenda.md"
        if not (agenda.exists() and f"- {item}" in agenda.read_text().splitlines()):
            records.append_agenda(agenda, item)
        return f"REFUSED {rules.limit_refusal(_members(room))}"
    if any(line.split(SEP)[1:2] == [invoice_id] for line in _lines(room)):
        return "REFUSED already booked"
    ref = f"MOCK-{invoice_id}-{resolution_id}"
    line = SEP.join(
        [
            date.today().isoformat(),
            invoice_id,
            str(amount),
            resolution_id,
            "byelaw OK",
            f"PAID, mock UPI ref {ref}",
        ]
    )
    with open(room / "ledger.md", "a") as f:
        f.write(line + "\n")
    return f"OK booked {invoice_id} {amount} under {resolution_id}, mock UPI ref {ref}"


def verify(room):
    """Re-check every ledger line against invoices and resolutions; catches hand edits."""
    if not records.verify_chain(room / "resolutions.jsonl"):
        return CHAIN_BROKEN
    for line in _lines(room):
        fields = line.split(SEP)
        amount = rules.invoice_amount(room, fields[1]) if len(fields) >= 4 else None
        if (
            amount is None
            or fields[2] != str(amount)
            or not rules.check_spend(amount, _members(room)).ok
            or _resolution(room, fields[3], fields[1]) is None
        ):
            return f"REFUSED {line}"
    return "OK"
