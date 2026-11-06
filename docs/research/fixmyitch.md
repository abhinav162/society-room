# Switch ideas: Fix My Itch (Razorpay), India pass

_Written 2026-11-06 by worker-switch-itch. Research only._

## 1. Coverage

- **URL:** https://razorpay.com/m/fix-my-itch/ (one page with sections: Home, Insights, Top 10 Problems, All Problems with a category filter, Mission).
- **Tool path:** Firecrawl search found the URL. A plain `curl` of the page gave only the first 10 problems (the list is drawn in the browser by Framer). The page's JavaScript names its data file, a Framer CMS (content store) chunk: `framerusercontent.com/cms/8ZCJwP7SzPns2Vksz8BP/EsaspbJ2cnIe36QxcTLx/eqmxKV824-chunk-default-0.framercms`. I downloaded and decoded it. It holds **every problem the page can show: 141 problems** across 17 categories, each with title, description, category and six scores.
- **PolterTab not used:** the first path did not fail; the data file holds every field the page can show.
- **What does not exist:** no page per problem (the site's route list has only `/m/fix-my-itch/`; slugs are just "1"–"141"), **no upvotes, no comments, no per-problem verification record.** The only "verification" is site-wide copy: _"10,000+ Verified Problems"_, _"From 50K People And Counting"_, _"AI-Powered Curation"_. The public dataset is 141 items, not 10,000. Links below therefore point to the list, with the item number.
- **Scores per problem** (field names from the site's schema): `severity_score`, `tam_score` (market size), `competition_score`, `whitespace_score`, `frequency_score`, and **"Itch Score"** (0–100, shown on the page).
- **Crowding:** refreshed the checker's cache of entrant READMEs (282 repos from `gh search repos --match readme`, now 312 READMEs cached) and grepped word-bounded for each domain.

## 2. Most relevant problems (site's own numbers)

Housing societies are the strongest India cluster. **#81 "Why do apartment maintenance payments lack itemized breakdowns?"** Itch Score **72.2**, severity **9**, market **90**: _"Residents paying monthly society maintenance fees (₹3,000-10,000) receive no itemized breakdown of where money is spent… Residents cannot verify if charges are justified."_ Related society items: **#95 smart water sub-meters** (89.5; _"forcing societies to split bills equally"_), **#94 QR gates for visitor parking** (93.5; _"Society residents constantly clash over visitor parking"_), **#141 monsoon waterlogging** (71). Family and citizen items: **#51 wedding gift money** (73.5, frequency 9), **#52 heirs and bank accounts** (80), **#30 animal rescue** (76, frequency **10**). All at https://razorpay.com/m/fix-my-itch/#all-problems (item numbers are the site's slugs).

## 3. Candidates

S = Switch central, D = demo clarity, F = feasible in ~20 h, I = impact (all /5, my judgement). Crowding 1 = no rival, 5 = twin.

| # | Problem (site item, Itch Score) | Who in India | Crowding | S | D | F | I |
|---|---|---|---|---|---|---|---|
| 1 | Society maintenance with no itemized breakdown (#81, 72.2) | RWAs, co-op housing societies, committee vs residents | **2**: [societee-pool-helper-switch](https://github.com/ariesayush69/societee-pool-helper-switch) is a society chat agent for bulk service booking, different problem | 5 | 5 | 4 | 5 |
| 2 | Stray / injured animal: who to call (#30, 76) | citizens, animal NGOs, vets, municipal teams | **1** (no "animal rescue" or "stray" hit) | 4 | 4 | 4 | 4 |
| 3 | Society visitor parking fights (#94, 93.5) | residents, guards, committee | **1** | 4 | 4 | 4 | 3 |
| 4 | Equal water-bill split, no sub-meters (#95, 89.5) | societies | **1** | 3 | 3 | 3 | 4 (the meter is hardware; only the bill-split half fits Switch) |
| 5 | Wedding gift (shagun) money lost (#51, 73.5) | families at Indian weddings | **1** ([tableline](https://github.com/crisvond/tableline) is restaurant seating) | 3 | 4 | 5 | 3 |
| 6 | Heirs can't access bank accounts (#52, 80) | families, bank, CA / lawyer | **1** (no heir/succession hit) | 4 | 3 | 3 | 4 |
| 7 | School bus late, parents in the dark (#110, 75.6) | parents, transport desk, drivers | **1** | 4 | 4 | 4 | 3 |
| 8 | Freelancers ghost after part payment (#1, 76) | SMEs, freelancers | **2** (money half overlaps [change-order](https://github.com/ronkenx9/change-order)) | 4 | 4 | 4 | 3 |

## 4. Recommendation: **Society Room** (Track 1)

**Problem:** in an Indian housing society, residents pay ₹3,000–10,000 a month (site #81) and get a receipt that just says "maintenance". The managing committee spends the money in WhatsApp threads; residents cannot see what was approved, by whom, or why charges went up.

**Rule that makes Switch essential:** under the Maharashtra model bye-laws for co-op housing societies, the society's _"final authority… shall vest in its General Body"_ (bye-law 109) and committee meetings need a quorum (bye-law 126, table in 113) ([official PDF](https://sahakarayukta.maharashtra.gov.in/SITE/PDF/Rules_Acts_Bylaws/Model_Bye_Laws_of_Coop_Housing_Society_New_Flatowner_Type_%282-9-14%29%20%281%29.pdf)). Repair spending above a yearly limit needs General Body approval (secondary sources; **exact rupee limits not verified**). This is the same mechanism as Board Room, but grounded in Indian rules.

**Rooms and agents:**
- `committee` room: chairman, secretary, treasurer (humans). `clerk` agent (motions, quorum, `minutes.md`). `treasurer` agent (obeys only the treasurer; records an expense in `ledger.md` only with an invoice and a passed resolution). `bye-laws` agent (checks `byelaws.md`, flags spends above the limit for the AGM agenda).
- Linked `residents` room: `concierge` agent. It answers only from published `ledger.md` and minutes, never committee drafts, and files resident questions as agenda items. Residents can ask; they cannot instruct the treasurer agent.
- Optional `vendors` room where the lift AMC (annual maintenance contract) vendor posts invoices.

**Demo (5 beats):**
1. One template creates the three rooms, agents and fictional bye-laws.
2. The lift vendor posts a ₹68,000 invoice. A committee member says on chat "just pay it". The treasurer agent refuses: no resolution, no open meeting.
3. The chairman opens a meeting; the clerk checks quorum and records the vote by name; the treasurer agent books the expense.
4. A ₹4 lakh repainting bid exceeds the limit; the bye-laws agent moves it to the AGM agenda instead.
5. The monthly bill goes to `residents` itemized (security, lift AMC, water, sinking fund). A resident asks "why did maintenance go up ₹400?" and the concierge answers with the minute and the vote.

## 5. Comparison

- **vs Board Room (HOA):** Society Room **is Board Room in Indian clothes**: same rooms, same role-gated refusal, same public linked room, so the build plan carries over almost unchanged. It wins on judge familiarity (most Indian judges live in or know a society), on a published Indian rule (Maharashtra bye-laws instead of Florida statute), and on evidence that is India-specific (Razorpay's #81, severity 9). It loses a little on crowding (2 vs 1, one society-themed entry exists but it solves a different problem) and on evidence strength: Fix My Itch gives scores, not votes or real people's posts, while Board Room had Reddit threads.
- **vs Rescue Relay:** Fix My Itch #30 (animal rescue, frequency **10**, uncrowded) makes an India version of Rescue Relay possible: a citizen's report in a `report` room, routed to the nearest NGO room, handed to a volunteer driver, then a vet. It is vivid and empty of rivals, but its rules are customs, not law, and it fits Track 2. Society Room stays the stronger Track 1 entry; India-flavoured Rescue Relay is the best fallback.

**Guesses marked:** fit scores; the exact spend limits; that India-based judges relate more to societies than HOAs.
