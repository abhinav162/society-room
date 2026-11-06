#!/usr/bin/env python3
"""Generates architecture.svg and payment-gate.svg. Run: python3 make.py. Source of truth for
the architecture is docs/architecture.md section 2; the payment gate is docs/prd.md B2-B4."""
import html, pathlib

INK, MUTE, BLUE, RED, GREEN, AMBER = "#222", "#666", "#2f5fb3", "#b3261e", "#1e7a3c", "#a15c00"
FILL = {"n": "#fff", "sw": "#eaf0fb", "ag": "#e8f4ec", "bad": "#fdecea", "ok": "#e8f4ec", "warn": "#fff4e0"}

class Svg:
    def __init__(s, w, h, title):
        s.w, s.h, s.o = w, h, []
        s.o.append(f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" font-family="Helvetica,Arial,sans-serif" font-size="13">'
                   f'<defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="{INK}"/></marker></defs>'
                   f'<rect width="{w}" height="{h}" fill="#fff"/><text x="20" y="30" font-size="18" font-weight="bold">{html.escape(title)}</text>')
    def box(s, x, y, w, h, lines, kind="n", bold=0, stroke=INK, dash=False):
        s.o.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{FILL[kind]}" stroke="{stroke}"{" stroke-dasharray=\"5 3\"" if dash else ""}/>')
        n = len(lines); y0 = y + h / 2 - (n - 1) * 8 + 4
        for i, l in enumerate(lines):
            s.o.append(f'<text x="{x+w/2}" y="{y0+16*i}" text-anchor="middle" font-weight="{"bold" if i < bold else "normal"}">{html.escape(l)}</text>')
    def group(s, x, y, w, h, label):
        s.o.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="none" stroke="{MUTE}" stroke-dasharray="6 4"/>'
                   f'<text x="{x+10}" y="{y+18}" fill="{MUTE}" font-size="12">{html.escape(label)}</text>')
    def arrow(s, x1, y1, x2, y2, label="", color=INK, dash=False, lx=0, ly=-6):
        s.o.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="1.5" marker-end="url(#a)"{" stroke-dasharray=\"5 3\"" if dash else ""}/>')
        if label: s.o.append(f'<text x="{(x1+x2)/2+lx}" y="{(y1+y2)/2+ly}" text-anchor="middle" font-size="11" fill="{color}">{html.escape(label)}</text>')
    def save(s, p):
        pathlib.Path(p).write_text("\n".join(s.o + ["</svg>"]))

def architecture(p):
    s = Svg(1160, 640, "Society Room: architecture")
    s.group(20, 50, 230, 540, "Mattermost (bundled with Switch Console)")
    s.box(40, 100, 190, 80, ["#committee (private)", "Chairman, Secretary,", "Treasurer, member-7"], bold=1)
    s.box(40, 400, 190, 80, ["#general-body", "residents"], bold=1)
    s.group(270, 50, 270, 540, "Switch server 0.31 (local)")
    s.box(290, 100, 230, 80, ["room: committee", "role meeting-chair (exclusive lease)"], "sw", bold=1)
    s.box(325, 215, 195, 60, ["Switch addressing:", "treasurer-agent = owner only"], "warn", bold=1, stroke=AMBER)
    s.box(290, 400, 230, 80, ["room: general-body"], "sw", bold=1)
    s.group(580, 50, 200, 540, "Agents (Claude Code sessions)")
    for i, n in enumerate(["clerk", "byelaw", "treasurer-agent"]):
        s.box(600, 100 + i * 70, 160, 50, [n], "ag", bold=1)
    s.box(600, 410, 160, 50, ["concierge"], "ag", bold=1)
    s.box(830, 150, 300, 100, ["society CLI = only writer of records", "quorum, limit, gate, records"], "warn", bold=1, stroke=AMBER)
    s.box(830, 330, 300, 150, ["room/ (plain files)", "byelaws.yaml  members.yaml", "invoices/  agenda.md  meeting.json", "minutes.md  ledger.md", "resolutions.jsonl (hash chain)"], bold=1)
    s.arrow(230, 140, 290, 140, "", dash=False); s.arrow(290, 140, 230, 140)
    s.arrow(230, 440, 290, 440); s.arrow(290, 440, 230, 440)
    s.arrow(420, 180, 420, 215, "")
    s.arrow(520, 245, 600, 265, "")
    s.arrow(520, 125, 600, 125, ""); s.arrow(520, 160, 600, 190, "")
    s.arrow(305, 180, 305, 400, "linked: published records", color=BLUE, lx=-52, ly=0)
    s.arrow(520, 440, 600, 435, "")
    s.arrow(760, 125, 830, 185, ""); s.arrow(760, 195, 830, 200, ""); s.arrow(760, 265, 830, 220, "")
    s.o.append(f'<text x="795" y="108" font-size="11" fill="{INK}" text-anchor="middle">shell: society ...</text>')
    s.arrow(980, 250, 980, 330, "writes", color=GREEN, lx=24, ly=0)
    s.arrow(760, 440, 830, 420, "read only", dash=True, ly=14)
    s.arrow(730, 410, 890, 250, "agenda add only", color=AMBER, lx=-30, ly=40)
    s.o.append(f'<text x="20" y="620" fill="{MUTE}" font-size="12">Switch decides who may instruct an agent. Deterministic code decides what is allowed. The LLM only talks.</text>')
    s.save(p)

def gate(p):
    s = Svg(1160, 620, "The payment gate: money leaves only through these checks")
    s.box(20, 70, 160, 60, ["Invoice posted", "id INV-068"], bold=1)
    s.box(220, 70, 200, 60, ["Switch addressing", "who is instructing?"], "sw", bold=1)
    s.box(220, 190, 200, 60, ["Blocked by Switch", "not the Treasurer"], "bad", bold=1, stroke=RED)
    s.box(460, 70, 200, 60, ["treasurer-agent", "runs: society book"], "ag", bold=1)
    s.arrow(180, 100, 220, 100); s.arrow(420, 100, 460, 100, "")
    s.o.append(f'<text x="440" y="92" text-anchor="middle" font-size="11">Treasurer</text>')
    s.arrow(320, 130, 320, 190, "member-7 etc.", color=RED, ly=0, lx=40)
    gates = [(["1  Invoice id on file?"], ["REFUSED no invoice INV-068"]),
             (["2  Passed, quorate resolution", "for this invoice?"], ["REFUSED no passed resolution", "for invoice INV-068"]),
             (["3  Within bye-law 156 limit?"], ["REFUSED over bye-law 156 limit", "Rs 1,00,000 (51+ members);", "referred to AGM"]),
             (["4  Already booked?"], ["REFUSED already booked"])]
    s.o.append(f'<text x="20" y="330" font-weight="bold">society book checks, in this order (deterministic code)</text>')
    for i, (q, no) in enumerate(gates):
        gx = 20 + i * 215
        s.box(gx, 345, 200, 60, q, "warn", stroke=AMBER)
        if i < 3: s.arrow(gx + 200, 375, gx + 215, 375, "", color=GREEN)
        s.box(gx, 450, 200, 66, no, "bad", stroke=RED)
        s.arrow(gx + 100, 405, gx + 100, 450, "no", color=RED, lx=10, ly=0)
    s.box(880, 345, 260, 60, ["ledger.md line:", "invoice + resolution + byelaw pass", "PAID, mock UPI ref"], "ok", bold=1, stroke=GREEN)
    s.arrow(865, 375, 880, 375, "", color=GREEN)
    s.arrow(560, 130, 560, 330, "")
    s.o.append(f'<text x="20" y="565" fill="{MUTE}" font-size="12">Beats: 2 = blocked, then REFUSED at check 2. 3 = all checks pass, booked. 4 = INV-400 (Rs 4,00,000) fails check 3 and goes to agenda.md for the AGM.</text>')
    s.o.append(f'<text x="20" y="585" fill="{MUTE}" font-size="12">Limits by member count: Rs 25,000 / 50,000 / 1,00,000 (prd.md section 4). A committee vote cannot override check 3.</text>')
    s.save(p)

if __name__ == "__main__":
    d = pathlib.Path(__file__).parent
    architecture(d / "architecture.svg"); gate(d / "payment-gate.svg")
