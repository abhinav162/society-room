# Society Room → "Quorum": a governance-enforcement layer for India's committee-run bodies

_Written 2026-11-06 ~21:10 IST by worker-switch-founder. Every number is linked; **est.** marks my estimate. Builds on `ideas/society-validation.md` (incumbents already ship bills, approvals, polls, minutes, AI Q&A; the open gap is enforcement)._

## 1. One-line business

**Quorum: money leaves a committee-run body only after a quorate, recorded, bye-law-compliant resolution.** The first product is for Maharashtra co-operative housing societies (CHS); the rules engine, the resolution ledger and the agent roles carry to every body that is governed by a committee and audited by a registrar.

## 2. Wedge and ICP

- **Wedge:** registered CHS in Maharashtra with 51+ members (the ₹1 lakh committee repair limit under model bye-law 156 applies to them; [official bye-laws PDF](https://sahakarayukta.maharashtra.gov.in/SITE/PDF/Rules_Acts_Bylaws/Model_Bye_Laws_of_Coop_Housing_Society_New_Flatowner_Type_%282-9-14%29%20%281%29.pdf), limits via [MySocietyClub](https://mysocietyclub.com/bye-laws/maharashtra-cooperative-housing-society-bye-laws/deemed-conveyance)). 70% of the state's 1.25 lakh societies are in Pune and Mumbai ([TOI](https://timesofindia.indiatimes.com/city/pune/draft-rules-for-cooperative-housing-societies-likely-to-be-notified-in-two-weeks-state/articleshow/122166132.cms)), so one city is the beachhead.
- **Who feels the pain:** honest treasurers and secretaries. Registrars dissolve committees for not sharing accounts and minutes (Lohegaon, 657 members, [TOI](https://timesofindia.indiatimes.com/city/pune/co-op-dept-dissolves-lohegaon-housing-society-body-for-denying-member-access-to-documents/articleshow/129522901.cms)); FIRs follow registrar audits ([TOI Thane](https://timesofindia.indiatimes.com/city/thane/5-booked-for-mishandling-co-op-housing-society-funds/articleshow/98983618.cms)). Office bearers are unpaid volunteers carrying personal liability.
- **Who pays, and the shortest path to revenue:** not the committee first. **The society's accountant or panel auditor.** Every Maharashtra CHS must be audited by 31 July by a Registrar-empanelled auditor ([Tickboxes](https://tickboxes.in/blog/housing-society-audit-guide/); [empanelment PDF](https://sahakarayukta.maharashtra.gov.in/site/PDF/Rules_Acts_Bylaws/Auditor_Classification_ABCD.pdf)). These firms already bill societies monthly for accounting (a practitioner quotes ₹30–35 per member per month plus ~₹100 per member audit fee, [Facebook group post](https://www.facebook.com/groups/754242027999846/posts/5865170686906929/), anecdotal) and sign off on exactly the resolutions we enforce. One firm serving 30–50 societies is one sale that lands 30–50 societies.
- **Second buyer:** the managing committee directly (it is who the apps sell to: _"your society management committee needs to sign up with us"_, [NoBrokerHood](https://www.nobrokerhood.com/)).
- **Third:** the apps themselves, as a partner "governance" module (ADDA already names its top plan "Govern" with "RWA governance tools", [SoftwareSuggest](https://www.softwaresuggest.com/adda)).

## 3. Market sizing (horizon, with sources)

| Segment | Published count | Source |
|---|---|---|
| Co-op housing societies, Maharashtra | **1,15,172** (53% of 2,17,410 co-ops); TOI uses 1.25 lakh, >2 crore members | [Govt of Maharashtra deck, cooperation.gov.in](https://www.cooperation.gov.in/sites/default/files/2023-06/Cooperation%20conference%20-%20Govt%20of%20Maharashtra.pdf); [TOI](https://timesofindia.indiatimes.com/city/pune/after-six-year-wait-maha-clears-long-pending-cooperative-housing-society-rules/articleshow/131145413.cms) |
| Credit co-operatives, Maharashtra | 20,546 | same deck |
| All co-operatives, India | >8 lakh (~2 lakh credit, ~6 lakh non-credit), ~30 crore members | [National Cooperative Policy 2025](https://www.cooperation.gov.in/sites/default/files/2025-07/NCP%28Eng%29_24Jul2025_Final.pdf); [PIB](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2147166) |
| Apartment RWAs, Bengaluru (BAF members only) | 1,180+ RWAs, ~2.5 lakh households | [Citizen Matters](https://citizenmatters.in/bengaluru-apartment-residents-charter/) |
| Digitised gated communities (overlapping vendor claims) | MyGate 27,000+ communities, 5.7M households; NoBrokerHood 25,000+; ADDA 25,000+ | [MyGate](https://mygate.com/blog/housing-society/why-mygate-is-indias-most-secure-society-app/), [Instagram/MyGate PR](https://www.instagram.com/p/DZcEAE7TOv5/), [Play Store ADDA](https://play.google.com/store/apps/details?id=com.threefiveeight.adda&hl=en_US) |
| NGOs on NGO Darpan | 1,87,395 (93,623 are registered societies) | [CSR Universe, 2023 data](https://thecsruniverse.com/articles/ngos-in-india-2023-state-and-category-wise-ngos-list-based-on-ngo-darpan-data) |
| Public and religious trusts, Maharashtra | 8 lakh registered; 3.95 lakh found defunct in 2018 | [TOI](https://timesofindia.indiatimes.com/city/pune/state-charity-commissioner-de-registers-1-lakh-trusts/articleshow/62867514.cms) |
| Schools (each with an RTE School Management Committee) | 14.71 lakh (UDISE+ 2024-25) | [UDISE+ analysis](https://educationforallinindia.com/from-classrooms-to-policy-analysing-udise-2024-25-data/); [PIB](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2300408&lang=2&reg=48) |
| DPIIT-recognised startups (boards) | 2 lakh+ (Dec 2025) | [PIB](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2214872&lang=1&reg=3) |
| Section 8 companies | exact count not found; MCA says OPC + Section 8 + Nidhi + others are ~10% of ~20 lakh active companies, so **est.** well under 2 lakh | [MCA CDM](https://mcacdm.nic.in/) |

**Revenue reality check:** MyGate, the category leader, reported FY25 revenue of ₹186.7 crore and a ₹15.3 crore loss ([SaasRise](https://www.saasrise.com/deals/mygate-raises-225-crore-from-dharana-capital-72817b60-56dc-41fb-8149-9bffef4de1b1)). Society software is a real but thin-margin category; the governance layer must price on liability avoided, not on convenience.

**Why now:** Maharashtra cleared new CHS rules after a six-year wait ([TOI](https://timesofindia.indiatimes.com/city/pune/after-six-year-wait-maha-clears-long-pending-cooperative-housing-society-rules/articleshow/131145413.cms)) and is drafting Model Bye-Laws 2026 ([TOI](https://timesofindia.indiatimes.com/city/pune/housing-society-bye-laws-propose-modern-framework/articleshow/133281274.cms)). Karnataka's Apartment (Ownership and Management) Bill 2026, passed by the Assembly, requires a CA audit, filing audited accounts with a competent authority within six months, a 50% quorum for major-repair decisions, and ratification of urgent spends at the next general body ([bill text, kla.kar.nic.in](https://kla.kar.nic.in/council/house/bills/159/4e.pdf)). Two big states are turning committee habits into statutory duties at once.

## 4. Pricing (INR) and distribution

- **Benchmarks:** MyGate says vendors charge _"per flat per month, or … slabs"_ and a medium society pays _"a few hundred rupees per flat per year"_ ([MyGate blog](https://mygate.com/blog/housing-society/cost-vs-value-society-accounting-software/)). Official auditor fee scales exist (Goa panel: ₹5,000–12,750 per society, [coopgoa.gov.in](https://www.coopgoa.gov.in/Download/Audit%20Fees%20Payable%20%20to%20the%20Panel%20of%20Auditors%20applicable%20from%20F.Y.%202019-2020.pdf)).
- **Proposed:** Society plan **₹15 per flat per month** (100 flats ≈ ₹18,000/yr, under one month of a society accountant's retainer at the anecdotal ₹30/member/month). Accountant/auditor partner plan: ₹999 per society per month for unlimited societies, white-labelled, with the partner keeping the retainer. Platform API for MyGate/NoBrokerHood/ADDA: per-society annual licence. **est.** 1,000 societies × 100 flats × ₹15 × 12 = ₹1.8 crore ARR; 5,000 Maharashtra societies ≈ ₹9 crore ARR.
- **Distribution, in order:** (1) society accountants and panel auditors in Pune and Mumbai; (2) honest committees via the registrar-dissolution story; (3) integration partner to the three apps rather than a rival; (4) facility-management firms for large gated communities (India FM market USD 80.7 bn in 2025, [Mordor](https://www.mordorintelligence.com/industry-reports/india-facility-management-market)).

## 5. Competition and moat

- **Incumbents:** NoBrokerHood (multi-stage approvals, budget caps per head), MyGate (threshold approvals, "Ask Society" AI), ADDA ("Govern" plan). All log _who_ approved; none ties a payment to a quorate resolution or the bye-law 156 limit (validation report, section 4).
- **Why they have not built it:** their buyer is the committee, so a product that _refuses_ the buyer creates churn; their revenue is gate security and payment flows, not compliance; refusal rules are state-specific (Maharashtra bye-laws, Karnataka 2026 Act, Delhi Societies Registration Act RWAs), which is a long tail for a pan-India app.
- **Moat (compounds with time):** (a) a per-state rules engine kept current with notified bye-laws and amendments; (b) a tamper-evident resolution ledger (invoice → motion → quorum → vote by name → payment) built to be exhibit-ready in Section 91 disputes before co-operative courts and registrars ([Maharashtra Cooperative Courts](https://mahcoop.dcourts.gov.in/)); (c) auditor channel lock-in, since the auditor signs off on the same ledger; (d) agent roles, not prompts, do the refusing, so the enforcement claim survives an audit.

## 6. Risks

| Risk | Mitigation |
|---|---|
| Legal advice liability | Ship rules as the society's own configured bye-laws with citations; the auditor confirms the ruleset; agents cite, never advise. |
| Liability with money | Never hold or move funds. The gate approves a payment instruction; the bank, UPI or the app executes it. |
| Adoption: committees that resist transparency, elderly members, WhatsApp habit | Sell protection to office bearers (dissolution, FIR cases); residents only read and ask; auditor pushes it. |
| AI trust around money | Deterministic engine (quorum math, limit check, roster) refuses; the LLM only drafts minutes and explains. |
| Incumbents copy a "resolution required" toggle | Likely within 12–18 months. Defence: multi-state engine, auditor channel, admissible ledger; acceptable exit is acquisition by one of the three. |
| Sizing: vendor counts overlap and self-reported | Treat 25k–27k as the digitised ceiling per vendor, not a sum. |

## 7. Is a different wedge or idea better? No.

Credit co-ops (20,546 in Maharashtra) have higher stakes but sit under RBI/registrar supervision with long sales cycles. NGOs and school committees have the governance need but near-zero willingness to pay. Startup boards are served by cap-table and board tools. CHS is the only segment with a statutory spend limit, a mandatory annual auditor, a registrar that dissolves committees, and an India judge panel that lives in one. Rival check today (`gh search repos "flip the switch" <term> --match readme --created '>2026-11-03'` plus the 312 cached READMEs): "housing society" hits only [societee-pool-helper-switch](https://github.com/ariesayush69/societee-pool-helper-switch) (service pooling); "quorum" hits two developer merge-gate tools ([threadbranch](https://github.com/Chandan11232/threadbranch), [Sindarin](https://github.com/kartikangiras/sindarin)); "RWA", "resident welfare", "committee quorum", "NGO board" return nothing. Crowding stays 2.

## 8. Hackathon MVP (Track 1, ~20h solo)

**Pitch line (README and video):** _"MyGate logs who approved a payment. Society Room makes sure they had the right to: an invoice, a quorate vote by name, and the bye-law limit, enforced by Switch roles, not by a prompt."_

**Rooms (one YAML template creates all):**
- `#committee` (private): humans Chairman, Secretary, Treasurer (and a `member-7` who tries "just pay it").
- `#general-body` (linked, residents): read-only on committee drafts; residents ask questions.
- `#vendors` (cut candidate): lift AMC vendor posts invoices.

**Agents and who obeys whom:**
- `clerk` (committee): opens meetings, checks quorum from `members.yaml` (bye-law 100: 2/3 of members or 20, whichever is less, [MySocietyClub](https://mysocietyclub.com/bye-laws/maharashtra-cooperative-housing-society-bye-laws/special-general-body-meetings)), records motions and votes by name into `minutes.md` and `resolutions.jsonl`.
- `treasurer-agent` (committee): **addressing `owner_only` = Treasurer**. This is the role that gates payment. Switch itself refuses messages from anyone else (per the judge's note: refusal by addressing, not by the LLM). It books to `ledger.md` only when an invoice id, a passed resolution id and a `byelaw` pass are present.
- `byelaw` (committee): deterministic check over `byelaws.yaml` (member count → ₹25k/50k/1L limit); above limit, it moves the item to the AGM agenda instead of approving.
- `concierge` (general-body): answers residents only from published `ledger.md`, `minutes.md`, `resolutions.jsonl`; files unanswerable questions as agenda items.

**Room documents:** `byelaws.yaml`, `members.yaml` (roster, quorum rule), `minutes.md`, `ledger.md`, `resolutions.jsonl` (hash-chained), `invoices/`, `agenda.md`.

**5-beat demo (≈3 min):**
1. Template creates both rooms, four agents, documents. Open with the Lohegaon dissolution headline.
2. ₹68,000 lift AMC invoice lands. `member-7`: "just pay it." Switch blocks the message to `treasurer-agent`; Treasurer forwards; the agent refuses: no resolution.
3. Chairman opens a meeting; `clerk` counts quorum, records a vote by name; `treasurer-agent` books the expense with invoice + resolution ids.
4. ₹4 lakh repainting bid: `byelaw` cites bye-law 156 (₹1 lakh limit for 51+ members) and moves it to the AGM agenda.
5. In `#general-body` a resident asks "why did maintenance go up ₹400?"; `concierge` cites the ledger line, the minute and the tally. A member asks to inspect records (Section 154B-8) and gets the published files.

**Real vs mocked:** real: Switch rooms, linked room, roles and addressing, agents, quorum math, limit check, minutes, hash chain, concierge Q&A. Mocked: payment (ledger line "PAID, mock UPI ref"), invoice OCR (vendor posts text), roster of 60 fictional members.

**Cut list, in order:** `#vendors` room → records-inspection beat → hash chain → Karnataka ruleset → any web dashboard. Floor is beats 2–4 in one room plus the linked `#general-body`.

## 9. What the human must decide

1. Name: keep "Society Room" for the hackathon; reserve "Quorum" (or similar) for the business.
2. Confirm Switch addressing really blocks non-owner messages to `treasurer-agent` in hour 1; if not, fall back to the role lease model and say so in the README.
3. Maharashtra-only rules in the demo (Karnataka 2026 Act is a README footnote).
4. Whether to pitch the business framing in the video (30 seconds) or keep it README-only.
5. Post-hackathon: talk to two Pune society auditors before writing any more code.
