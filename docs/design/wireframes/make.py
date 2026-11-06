#!/usr/bin/env python3
"""Generates the 5 low-fi beat wireframes (SVG). Run: python3 make.py. Fictional data only."""
import html, textwrap

W, H = 1100, 680
SIDE, DOCS = 190, 270
CX0, CX1 = SIDE, W - DOCS  # chat column
INK, MUTE, LINE, BG, PANEL = "#222", "#777", "#ccc", "#fff", "#f3f3f3"
RED, GREEN, BLUE = "#b3261e", "#1e7a3c", "#2f5fb3"

def esc(s): return html.escape(s, quote=True)

def wrap(text, n):
    return textwrap.wrap(text, n) or [""]

def svg(beat, title, subtitle, room, rooms, msgs, docs, note):
    o = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" font-family="Helvetica,Arial,sans-serif" font-size="13">',
         f'<rect width="{W}" height="{H}" fill="{BG}"/>',
         # beat banner
         f'<rect width="{W}" height="44" fill="{INK}"/>',
         f'<text x="16" y="28" fill="#fff" font-size="16" font-weight="bold">Beat {beat}: {esc(title)}</text>',
         f'<text x="{W-16}" y="28" fill="#bbb" text-anchor="end">{esc(subtitle)}</text>',
         # sidebar
         f'<rect y="44" width="{SIDE}" height="{H-44-30}" fill="{PANEL}"/>',
         f'<text x="14" y="72" font-weight="bold">Society Room</text>',
         f'<text x="14" y="90" fill="{MUTE}" font-size="11">Shanti Nagar CHS (fictional)</text>']
    y = 120
    for r, kind in rooms:
        on = r == room
        if on: o.append(f'<rect x="6" y="{y-16}" width="{SIDE-12}" height="24" rx="4" fill="#dcdcdc"/>')
        o.append(f'<text x="16" y="{y}" font-weight="{"bold" if on else "normal"}">{esc(r)}</text>'
                 f'<text x="{SIDE-14}" y="{y}" fill="{MUTE}" font-size="10" text-anchor="end">{esc(kind)}</text>')
        y += 32
    # chat header
    o.append(f'<text x="{CX0+16}" y="72" font-weight="bold" font-size="15">{esc(room)}</text>')
    o.append(f'<line x1="{CX0}" y1="84" x2="{CX1}" y2="84" stroke="{LINE}"/>')
    y = 104
    for m in msgs:
        kind, who, role, text = m
        if kind == "switch":  # platform notice
            lines = wrap(text, 78)
            h = 26 + 16 * len(lines)
            o.append(f'<rect x="{CX0+16}" y="{y}" width="{CX1-CX0-32}" height="{h}" rx="4" fill="#fdecea" stroke="{RED}"/>')
            o.append(f'<text x="{CX0+28}" y="{y+17}" fill="{RED}" font-weight="bold">{esc(who)}</text>')
            for i, l in enumerate(lines):
                o.append(f'<text x="{CX0+28}" y="{y+17+16*(i+1)}" fill="{RED}">{esc(l)}</text>')
            y += h + 10
            continue
        lines = wrap(text, 72)
        h = 24 + 16 * len(lines)
        agent = kind == "agent"
        o.append(f'<circle cx="{CX0+30}" cy="{y+14}" r="13" fill="{BLUE if agent else "#999"}"/>'
                 f'<text x="{CX0+30}" y="{y+19}" fill="#fff" text-anchor="middle" font-size="12">{esc(who[0].upper())}</text>')
        o.append(f'<text x="{CX0+52}" y="{y+12}" font-weight="bold">{esc(who)}</text>')
        bx = CX0 + 52 + 8 * len(who) + 6
        badge = ("AGENT" if agent else role)
        if badge:
            o.append(f'<rect x="{bx}" y="{y+1}" width="{7*len(badge)+10}" height="15" rx="3" fill="none" stroke="{BLUE if agent else MUTE}"/>'
                     f'<text x="{bx+5}" y="{y+12}" font-size="10" fill="{BLUE if agent else MUTE}">{esc(badge)}</text>')
        for i, l in enumerate(lines):
            o.append(f'<text x="{CX0+52}" y="{y+30+16*i}" fill="{INK}">{esc(l)}</text>')
        y += h + 6
    # input box
    o.append(f'<rect x="{CX0+16}" y="{H-30-44}" width="{CX1-CX0-32}" height="32" rx="4" fill="#fff" stroke="{LINE}"/>'
             f'<text x="{CX0+28}" y="{H-30-24}" fill="{MUTE}">Message {esc(room)}</text>')
    # docs panel
    o.append(f'<rect x="{CX1}" y="44" width="{DOCS}" height="{H-44-30}" fill="{PANEL}"/>'
             f'<text x="{CX1+14}" y="72" font-weight="bold">Room documents</text>')
    y = 96
    for name, lines_ in docs:
        o.append(f'<rect x="{CX1+10}" y="{y}" width="{DOCS-20}" height="{22+15*len(lines_)}" rx="4" fill="#fff" stroke="{LINE}"/>'
                 f'<text x="{CX1+20}" y="{y+16}" font-weight="bold" font-size="12">{esc(name)}</text>')
        for i, l in enumerate(lines_):
            o.append(f'<text x="{CX1+20}" y="{y+32+15*i}" fill="{MUTE}" font-size="11" font-family="Menlo,monospace">{esc(l)}</text>')
        y += 22 + 15 * len(lines_) + 10
    # footer note
    o.append(f'<rect y="{H-30}" width="{W}" height="30" fill="#eee"/>'
             f'<text x="16" y="{H-11}" fill="{MUTE}" font-size="12">Low-fi wireframe. {esc(note)}</text>')
    o.append('</svg>')
    return "\n".join(o)

ROOMS = lambda: [("#committee", "private"), ("#general-body", "linked"), ("#vendors", "cut candidate")]

BEATS = [
 (1, "Template creates the society", "Open with the Lohegaon headline", "#committee",
  [
   ("human", "Chairman", "CHAIRMAN", "Creating Shanti Nagar CHS from society.yaml."),
   ("agent", "clerk", "", "Room ready. Roster loaded: 60 members, quorum rule = 2/3 of members or 20, whichever is less (bye-law 100)."),
   ("agent", "treasurer-agent", "", "Online. Only the Treasurer can instruct me. Nothing is booked without invoice id + resolution id + bye-law pass."),
   ("agent", "byelaw", "", "Loaded byelaws.yaml: 51+ members, committee limit Rs 1,00,000 (bye-law 156)."),
   ("agent", "concierge", "", "Online in #general-body. I answer only from published files."),
  ],
  [("members.yaml", ["60 members (fictional)", "quorum: min(2/3, 20)"]),
   ("byelaws.yaml", ["51+ members:", "  committee_limit: 100000"]),
   ("minutes.md", ["(empty)"]), ("ledger.md", ["(empty)"]), ("resolutions.jsonl", ["(empty)"])],
  "Cold open: headline card (Lohegaon committee dissolved) cuts to this screen. Rooms, 4 agents, docs from one YAML."),
 (2, "'Just pay it' is blocked", "Switch refuses; agent refuses again", "#committee",
  [("human", "lift-amc (vendor)", "VENDOR", "Invoice INV-068: Lift AMC, Rs 68,000. Attached invoices/INV-068.txt"),
   ("human", "member-7", "MEMBER", "@treasurer-agent just pay it"),
   ("switch", "Switch blocked this message", "", "member-7 is not the Treasurer. treasurer-agent accepts instructions from the Treasurer only (owner_only). Message was not delivered."),
   ("human", "Treasurer", "TREASURER", "@treasurer-agent pay INV-068"),
   ("agent", "treasurer-agent", "", "REFUSED no passed resolution for invoice INV-068"),
  ],
  [("invoices/", ["INV-068  Rs 68,000", "  lift AMC, Q4"]),
   ("resolutions.jsonl", ["(none for INV-068)"]), ("ledger.md", ["(empty)"])],
  "Red banner = refusal by role addressing (Switch), not by the LLM. Second refusal = rule check."),
 (3, "Quorum, vote by name, booked", "Resolution id links the payment", "#committee",
  [("human", "Chairman", "CHAIRMAN", "Opening a meeting. Agenda: INV-068 lift AMC Rs 68,000."),
   ("agent", "clerk", "", "Quorum: 41 of 60 present, need 20. Quorate. Motion recorded."),
   ("human", "Chairman", "CHAIRMAN", "Motion: approve Rs 68,000 to Lift AMC. Vote."),
   ("agent", "clerk", "", "Aye: Sharma, Iyer, Khan, Patil (4 of 5 committee). Nay: Desai. Tally 4 aye, 1 nay, 41 of 60 present. Passed. Resolution R-001 recorded."),
   ("agent", "byelaw", "", "Rs 68,000 <= Rs 1,00,000 limit (bye-law 156). Pass."),
   ("human", "Treasurer", "TREASURER", "@treasurer-agent pay INV-068 under R-001"),
   ("agent", "treasurer-agent", "", "Booked: INV-068, R-001, byelaw pass. PAID, mock UPI ref MOCK-INV-068-R-001."),
  ],
  [("minutes.md", ["2026-11-06: R-001 passed", "4-1 (0 abstain): Pay", "lift AMC (INV-068)"]),
   ("resolutions.jsonl", ["R-001 passed", "prev_hash: 9f2c.."]),
   ("ledger.md", ["2026-11-06 INV-068 68000", "R-001 byelaw OK PAID", "MOCK-INV-068-R-001"])],
  "Ledger line carries all three ids. Hash chain on resolutions (cut candidate)."),
 (4, "Rs 4 lakh bid goes to the AGM", "Bye-law 156 cap enforced in code", "#committee",
  [("human", "Secretary", "SECRETARY", "Repainting bid INV-400: Rs 4,00,000 from Rangoli Paints. Committee to approve?"),
   ("agent", "byelaw", "", "REFUSED over bye-law 156 limit Rs 1,00,000 (51+ members); referred to AGM"),
   ("agent", "byelaw", "", "Added to agenda.md: AGM sanction for INV-400."),
   ("human", "Treasurer", "TREASURER", "@treasurer-agent pay the repainting advance"),
   ("agent", "treasurer-agent", "", "REFUSED no passed resolution for invoice INV-400"),
  ],
  [("byelaws.yaml", ["51+ members:", "  committee_limit: 100000"]),
   ("agenda.md", ["- AGM sanction for", "  INV-400: over bye-law", "  156 limit"]),
   ("ledger.md", ["INV-068 PAID", "(no repainting line)"])],
  "Limit check is deterministic code over byelaws.yaml, cited by number."),
 (5, "A resident asks, the concierge cites", "Linked #general-body, read-only on drafts", "#general-body",
  [("human", "member-23", "RESIDENT", "Why did maintenance go up Rs 94 a month?"),
   ("agent", "concierge", "", "Ledger line INV-068 (Rs 68,000, lift AMC) was booked under resolution R-001, passed 4-1 in the 2026-11-06 minutes: 4 aye, 1 nay, 41 of 60 members present. Rs 68,000 / 60 flats / 12 months = about Rs 94 a month per flat."),
   ("human", "member-23", "RESIDENT", "I want to inspect the records (Section 154B-8)."),
   ("agent", "concierge", "", "Published for inspection: minutes.md, ledger.md, resolutions.jsonl. Drafts stay in #committee."),
   ("human", "member-31", "RESIDENT", "Who approved the painting?"),
   ("agent", "concierge", "", "Nobody yet. The Rs 4,00,000 repainting (INV-400) is on the AGM agenda; your question is filed there."),
  ],
  [("minutes.md", ["published", "R-001 passed 4-1"]), ("ledger.md", ["published", "INV-068 68000 PAID"]),
   ("resolutions.jsonl", ["published", "R-001"]), ("agenda.md", ["- AGM sanction for INV-400", "- question from member-31"])],
  "concierge answers only from published files; unanswerable = filed as agenda item."),
]

if __name__ == "__main__":
    import pathlib
    out = pathlib.Path(__file__).parent
    for beat, title, sub, room, msgs, docs, note in BEATS:
        (out / f"beat-{beat}.svg").write_text(svg(beat, title, sub, room, ROOMS(), msgs, docs, note))
        print("wrote", out / f"beat-{beat}.svg")
