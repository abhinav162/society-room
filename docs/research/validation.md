# Society Room: validation

_Checked 2026-11-06, ~45 min, by worker-switch-validate. Every quote below was read on the linked page or in its search excerpt. Guesses are marked **guess**._

## 1. Coverage

| Source | Searches | Tool | Result |
|---|---|---|---|
| Indian Reddit (r/bangalore, r/mumbai, r/thane, r/LegalAdviceIndia, r/indianrealestate) | 4 | Firecrawl search; PolterTab (old.reddit, read only) for full threads | Worked. Reddit's JSON API returned 403 and Firecrawl scrape refused reddit.com, so full threads came via PolterTab. No specific hits for r/pune, r/gurgaon, r/hyderabad, r/chennai, r/delhi, r/IndiaInvestments (search returned other subs). |
| Quora | 2 | Firecrawl search | Partial. Mostly app-vendor answers and legal how-tos; no strong first-person posts. |
| LocalCircles | 3 | Firecrawl search, PolterTab | Partial. No RWA accounts/transparency survey found. Only a 2026 apartment lift survey (numbers via Business Today). |
| News (TOI, HT, ET, Moneycontrol) | 2 | Firecrawl search + scrape | Worked. The Hindu: no hit. |
| consumercomplaints.in, MouthShut | 1 | Firecrawl search | Weak. Registrar/repair complaints; the MouthShut ADDA page is promotional. |
| Play Store reviews (MyGate, NoBrokerHood, ADDA) | 1,500 newest reviews each | google-play-scraper (Node) | Worked. Needed the sandbox off (DNS). |
| Vendor feature pages | 5 | Firecrawl search + scrape | Worked. |
| State rules | 2 | Firecrawl search | Maharashtra confirmed (official PDF + secondary sources). Karnataka and Delhi not checked (time). |

## 2. Q1: is the problem real?

Yes. It is common, it reaches registrars and police, and committees get removed over it.

1. **Pune, TOI:** the deputy registrar _"dissolved an 18-member managing committee of a housing society in Lohegaon for denying one of its members access to documents like audit reports, statement of accounts and income-expenditure details"_ (657 members). The order cites the members' _"legal right to inspect records (financials, minutes, audits)"_ under Section 154B-8 of the Maharashtra act. [link](https://timesofindia.indiatimes.com/city/pune/co-op-dept-dissolves-lohegaon-housing-society-body-for-denying-member-access-to-documents/articleshow/129522901.cms)
2. **Greater Noida, HT, 22 Sep 2025:** residents allege _"misuse of about ₹5 crore public funds"_; demands include a _"special audit for five years"_ and _"electricity bills paid for personal property from society account"_. The secretary called the allegations false. [link](https://www.hindustantimes.com/cities/noida-news/greater-noida-co-operative-housing-society-faces-fund-embezzlement-charge-probe-ordered-101758479787078.html)
3. **Thane, TOI:** committee dismissed; residents said it was _"mismanaging funds and taking decisions without holding annual general meetings"_. [link](https://timesofindia.indiatimes.com/city/thane/housing-society-committee-members-dismissed-over-fund-misuse/articleshow/48793367.cms) Also _"5 booked for mishandling co-op housing society funds"_ after a registrar-ordered audit. [link](https://timesofindia.indiatimes.com/city/thane/5-booked-for-mishandling-co-op-housing-society-funds/articleshow/98983618.cms)
4. **ET topic page:** a society _"increased maintenance fee of 6 homeowners selectively after they filed a case on Rs 3.08-crore misappropriation"_. [link](https://economictimes.indiatimes.com/topic/housing-society-misappropriation)
5. **r/bangalore**, "How common is it to see corruption in your apartment's resident's association?": top comment (52 points) _"Very. Lakhs get misappropriated in larger, luxury apartments."_ Another (12 points): _"they simply create excel without any bill proofs and the moment someone questions them they d play 'community bonding', we are doing it for 'free'"_. Counterpoint in the same thread (8 points): _"In our apartment complex, income and expenses are regularly published."_ [link](https://old.reddit.com/r/bangalore/comments/1i38wtl/)
6. **r/LegalAdviceIndia:** _"Society secretary and committee members are not sharing expense report since society was built, can I deny paying maintenance?"_ [link](https://www.reddit.com/r/LegalAdviceIndia/comments/1onc0uu/)
7. **r/mumbai:** _"Rule passed without vote in AGM/SGM. How is this even legal?"_ [link](https://www.reddit.com/r/mumbai/comments/1nquydo/), and _"minutes of AGM meeting not followed by managing committee"_. [link](https://www.reddit.com/r/mumbai/comments/1nher10/)
8. **WhatsApp approvals, admitted by a vendor.** MyGate's own expense page: _"invoices in one file, bills in another, approvals on WhatsApp, committees lose visibility."_ [link](https://mygate.com/society-erp/expense-management/)
9. **Survey (lift AMC beat only):** LocalCircles via Business Today, Jul 2026: 46% of lift users were stuck at least once last year, 33% have no confidence in their building's lifts, 21% say there is no proper AMC (annual maintenance contract). [link](https://www.businesstoday.in/india/story/got-a-lift-in-your-apartment-survey-says-46-residents-were-trapped-at-least-once-last-year-546526-2026-07-31) **I found no published survey number on accounts transparency.**

**The rule is confirmed.** Maharashtra model bye-law 156: the committee may spend on repairs up to ₹25,000 (up to 25 members), ₹50,000 (26–50) and ₹1,00,000 (51 and above). Above that, _"prior sanction of the meeting of the General Body of the Society shall be necessary"_ ([official PDF](https://sahakarayukta.maharashtra.gov.in/SITE/PDF/Rules_Acts_Bylaws/Model_Bye_Laws_of_Coop_Housing_Society_New_Flatowner_Type_%282-9-14%29%20%281%29.pdf); the rupee figures come from [MySocietyClub](https://mysocietyclub.com/bye-laws/maharashtra-cooperative-housing-society-bye-laws/deemed-conveyance)).

## 3. Q2: would societies adopt it?

- **Who buys:** the managing committee. NoBrokerHood: _"your society management committee needs to sign up with us"_ ([link](https://www.nobrokerhood.com/)). Residents cannot buy it themselves, so the people being audited hold the purchase decision.
- **The market already pays for this category.** Play Store installs: MyGate 5M+ (4.69★), NoBrokerHood 5M+ (4.63★), ADDA 1M+ (4.74★). NoBrokerHood claims _"over 25,000 housing communities"_.
- **Blockers:**
  - Committees that resist transparency. That is the Q1 evidence.
  - Elderly members. The r/indianrealestate thread on choosing an app: _"Some residents worry it might end up being too technical for elders"_ ([link](https://old.reddit.com/r/indianrealestate/comments/1o93u4h/)).
  - Distrust of vendors (_"I would not trust Nobroker with anything"_, 9 points, same thread).
  - Payment fees and glitches. These dominate low-star reviews, for example NoBrokerHood _"showed original maintenance amount of 4650, but it deducted 4814"_, and MyGate _"doesn't acknowledge maintenance payment made and asks for repeat payments"_.
  - Trust in AI around money. **guess:** no evidence found either way.
- **How to overcome:**
  - Sell to honest committee members as personal protection: committees are dissolved and debarred for exactly these lapses (items 1 and 3).
  - Make the treasurer agent a guardrail, not an autopilot: it refuses, it never pays on its own.
  - Residents only read and ask.

## 4. Q3: what already exists

| Product | Itemized bills | Expense approvals | Voting/polls | Minutes | Resident Q&A | Complaints (Play Store, low stars, 1,500 newest) |
|---|---|---|---|---|---|---|
| **NoBrokerHood** | Yes: _"View itemized maintenance bills"_ | Yes: _"multi-stage committee approval workflows"_, Treasurer + Secretary sign-off, budget caps per expense head ([link](https://www.nobrokerhood.com/solutions/society-accounting-system)) | Yes: _"Opinion Polls & Digital Elections"_ | Yes: _"publish digital minutes of meetings (MoM)"_ ([link](https://www.nobrokerhood.com/solutions/nobrokerhood-features)) | Helpdesk | 9 of 1,500 matched billing words: _"Improper accounting update"_, _"cannot generate proper receipt"_ |
| **MyGate** | Separate invoices per charge (a review asks to _"select all invoices at once"_) | Yes: single, multi-level and threshold approval; _"Each approval is logged with name, date and time"_; bills attached ([link](https://mygate.com/society-erp/expense-management/)) | Not checked | Not checked | **Yes, AI.** "Ask Society": _"residents … receive instant, policy-based answers"_ from _"the official documents … tagged by your society"_ ([link](https://mygate.com/blog/feature-in-focus/ask-society/)) | 21 of 1,500: payment not recorded, fees, ads; one review says it _"prioritizes builder control over resident rights"_ |
| **ADDA** | Yes (billing) | Yes: purchase request → purchase order → invoice → payment, _"Set the level of approvals"_ ([link](https://usa.adda.io/for-accountants)) | Yes: opinion polls, _"Online Ballot"_ | Stores _"meeting minutes and resolutions"_ ([link](https://adda.io/adda-for-large-communities)) | Helpdesk | 46 of 1,500: _"maintenence bill should come with signed audit report"_; _"not clearly mentioned month wise maintenance"_ |

**What the gap is not.** Itemized bills, approval chains, polls, minutes, and even an AI that answers residents already ship. The fixmyitch.md framing ("residents get a receipt that just says 'maintenance'") is false for any society on these apps. Do not pitch it that way.

**What the gap is (narrower, and real).** In every page I read, incumbent approval means named officers signing in sequence. None ties a payment to a **quorate, recorded resolution**, or checks the **bye-law 156 General Body limit** before booking. Ask Society answers from uploaded documents. Not verified: whether it can answer "why did my bill go up ₹400" by citing the ledger line, the minute and the vote. These are workflow rules across people and agents, not features of one app, which is exactly what Switch rooms show. The bigger market gap, a tool residents can use when their committee won't adopt one, cannot be sold through the committee. **guess:** that is out of scope for the hackathon.

## 5. Verdict: GO WITH CHANGES

The problem is real and serious: registrars dissolve committees, there are FIRs (first information reports, police complaints) and multi-crore allegations. The rule is citable. The product is not new as "society accounting", so the pitch must be **governance enforcement**, not transparency software.

**Pitch changes**
- Drop "receipts just say maintenance" and "nothing like this exists". Say instead: _"MyGate, NoBrokerHood and ADDA log who approved a payment. Society Room makes sure the payment had the right to be approved: an invoice, a quorate resolution, and the bye-law limit."_
- Open with the Lohegaon case: a committee was dissolved for not giving one member the accounts and minutes. Society Room makes that request a 10-second answer.

**Demo beats**
1. Template creates the rooms: **keep**.
2. ₹68,000 lift AMC invoice, "just pay it" refused: **keep**, and add the line "approvals on WhatsApp" from MyGate's own page. ₹68k is under the ₹1 lakh committee limit for 51+ members, so a committee resolution is the right gate.
3. Quorum and vote by name: **keep**. This is the core differentiator.
4. ₹4 lakh repainting bid goes to the AGM: **keep**, and cite bye-law 156 with the real limits.
5. Itemized bill plus "why +₹400": **change**. Itemized bills already exist, so the itemized bill is not the payoff. The payoff is the concierge citing the minute, the vote tally and the invoice. Optionally add a member's records-inspection request (Section 154B-8) answered from the published ledger.

**Risks:** judges who know MyGate may see "another society app"; lead with the rule enforcement in the first 20 seconds. Karnataka and Delhi rules were not checked, so present the demo as "Maharashtra model bye-laws" only.
