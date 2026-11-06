# Flip the Switch hackathon: research and recommendation

_Written 2026-11-06 ~19:15 IST. About 28.5 hours remain to the deadline._

Sources: [W] = https://www.wemakedevs.org/hackathons/switch · [R] = https://www.wemakedevs.org/hackathons/switch/resources · [D] = https://www.devtoolsacademy.com/hackathons/flip-the-switch · [Docs] = https://docs.switchagents.ai/

## 1. Hackathon facts

- **Theme:** "Turn your solo agent into a teammate." Build a workflow in a team chat where at least one AI agent and one person get a real task done together, connected through **Switch** (open-source software from SandboxAQ that puts AI agents into team chat). [W]
- **What Switch is:** each chat channel becomes a "room", a shared log of messages, instructions, roles, tasks and knowledge. Agents join with their own name. Claude Code, Codex and OpenCode work out of the box through **Switch Console**, the desktop app, which runs a local server in Docker. Custom agents join through the agent protocol (server-sent events in, HTTP out). The local install ships **Mattermost**, so no Slack admin is needed. Rooms are set up from YAML templates (agents, roles, room, kickoff message). [W][R][Docs]
- **Required tech:** Switch is mandatory and must be central. The README must show how it was used. [W]
- **Tracks and prizes ($10,000 total):** [W]
  - Track 1, Best Business Workflow: $2,000
  - Track 2, Best Personal or Creative Workflow: $2,000
  - Track 3, Best Core Contribution: $100 × 20 for pull requests (PRs) to Switch. Only issues labelled `hackathon` count, and you must be assigned before you start.
  - Side tracks (stackable): Code with Wispr $500 (build by voice, attach the Wispr scorecard); Best Blog, AirPods 5; #HowISwitch posts, keyboards for the top 5. Every submitter gets a certificate.
- **Judging:** Use of Switch **30%** (would it stop working without Switch?) · Technical execution **25%** (does it run, can someone clone and reproduce it?) · Creativity and impact **25%** (a fresh idea that solves a real team problem) · Presentation **20%** (the demo video and README make the Switch usage clear). [D] (Weights render as 0% on [W] because they animate in; criteria names from [W].) Process: WeMakeDevs reviews everything and builds a shortlist; finalists are judged by Switch, DevTools Academy and WeMakeDevs. [W]
- **Team size:** solo or up to 4. Free, open worldwide. [W]
- **Submission:** a public repo, a short demo video of the workflow running, and a README covering which agents, how the channel is set up and how to run it. A blog post is optional. [D] **UNCONFIRMED:** the submission form location (probably the WeMakeDevs hackathon dashboard after sign-in), the maximum video length, and whether a deployed link is needed (none is mentioned anywhere).
- **Originality:** existing agents, libraries and templates are fine, but the Switch setup and the workflow must be built during the event. AI coding tools are allowed, but you must be able to explain the work. [W]
- **Deadline:** **Saturday 7 November 2026, 11:59 PM IST** (= 1:29 PM EST). The event started 4 Nov, 12:01 AM IST. [W][D]
- **Registration:** needs a WeMakeDevs account. The page shows 7,605 registered and a live "Register" button. **UNCONFIRMED:** whether the human is already registered. [R]

## 2. Project ideas

**A. Hiring Huddle (Track 1)**
- Pitch: a recruiting room where a sourcer agent, a screener agent and a human hiring manager take a job opening from job description (JD) to shortlist to approved outreach.
- Tech: Switch + Mattermost; two Claude Code agents (or Claude Code plus Codex); room documents hold the JD and the scoring rubric.
- Demo: the manager posts a JD. The screener scores 10 sample resumes against the rubric and posts a ranked shortlist with reasons. The manager pushes back on one candidate. The sourcer drafts tailored outreach. The manager approves, and the decision is logged in the room.
- Feasibility: **High.** Risk: it could look like "an LLM scoring resumes"; the human-in-the-loop decisions and the hand-offs between agents have to carry it.

**B. Ship Room: bug to merged PR (Track 1)**
- Pitch: a GitHub issue lands in the room. A triager agent restates it, a fixer agent (Claude Code) writes a fix on a branch, a reviewer agent (Codex) reviews it, and a human approves the merge.
- Tech: Switch, Claude Code, Codex, the GitHub CLI (`gh`).
- Demo: a real bug in a small sample repo goes to a merged PR in about 3 minutes, entirely in chat.
- Feasibility: **High.** Risk: it is the most common idea in the field and close to Switch's own `triage-pair` template, so it scores low on creativity.

**C. Trading Desk (Track 2, reuses `den/capita`)**
- Pitch: a research agent posts paper-trade ideas, a risk agent vetoes rule breaks, and the human approves orders sent to OpenAlgo paper trading. Tech: Switch, Claude Code, capita/OpenAlgo.
- Feasibility: **Medium.** Risk: 7 Nov is a Saturday (markets closed, so replayed data); hard for judges to reproduce; touches broker secrets.

**D. Job-Hunt Pit Crew (Track 2, reuses `den/my-soul` and `resumate`)**
- Pitch: agents find roles, tailor a resume and draft a cover note; the human approves each one in chat. Tech: Switch, Claude Code.
- Feasibility: **Medium-High.** Risk: personal data in a public repo; it reads as a single-player chatbot rather than teamwork.

**E. Core contribution (Track 3, alongside any idea)**
- Pitch: one or two real PRs on issues labelled `hackathon`.
- Feasibility: **Low-Medium.** Risk: needs assignment by @petr-sandbox first, which may not come in time; $100 per PR at most.

## 3. Recommendation: A, Hiring Huddle (Track 1)

- **Use of Switch (30%):** the workflow only exists in the room. It needs several agents, hand-offs between them by name, human sign-off, and room documents (JD, rubric) and decisions. Remove Switch and nothing is left.
- **Creativity and impact (25%):** most of ~7,600 registrants will build developer workflows like B. A hiring loop is a real team problem that non-developers recognise, and the human works in recruiting tech (HireQuotient), so the domain knowledge is real.
- **Technical execution (25%):** it runs fully locally with Switch Console + Mattermost + Claude Code and sample resumes in the repo. Judges can clone and reproduce it with no third-party accounts.
- **Feasibility:** no external APIs. The hardest part is Switch setup, which takes about 10 minutes according to the quickstart.

Keep B as the fallback if A's demo feels thin by hour 14. It reuses the same setup.

## 4. Build plan

**MVP scope**
- One room template (`hiring-huddle.template.yaml`): agents `screener` and `sourcer`, the human as hiring manager.
- Room materials: the JD, a scoring rubric, and room rules such as "never contact a candidate without manager approval" and "log every decision".
- `samples/`: 8–10 synthetic resumes (Markdown or PDF), clearly fake.
- Flow: post JD → ranked shortlist with reasons → manager challenges one → agent revises → outreach drafts → manager approves → decision logged.
- Optional: an interview-scheduling step that posts proposed slots.
- README with an architecture diagram, setup steps and screenshots. A 2–3 minute demo video.

**Stack:** Switch Console (macOS), Docker, the bundled Mattermost, Claude Code (and Codex as the second agent if available), Markdown files for the data. No custom server unless time allows; a small agent built on the agent protocol is the stretch goal.

**Milestones (hours from now; the deadline is hour ~28.5)**
- 0–2: Docker + Switch Console + quickstart; switch-buddy answering in Mattermost.
- 2–4: write the room template and rules; two agents in one room.
- 4–9: JD, rubric, synthetic resumes; tune instructions until the flow runs end to end twice.
- 9–15: sleep / buffer.
- 15–19: polish hand-offs and the decision log; scheduling step if stable.
- 19–22: README, diagram, screenshots; clean-clone test.
- 22–25: record and edit the demo video.
- 25–28.5: submit, optional blog/#HowISwitch, buffer. **Submit by 10 PM IST on 7 Nov at the latest.**

**The human must do these personally**
- Sign in or register at wemakedevs.org for the hackathon and confirm where the submission form is.
- Install Docker Desktop and Switch Console (macOS arm64 build from GitHub releases).
- Make sure Claude Code (and optionally Codex) is logged in with a working subscription or API key.
- Create the public GitHub repo; record the voice-over for the demo video; post the submission.
- Optional: install Wispr Flow with the WEMAKEDEVS promo and use it while building (+$500 side track); star the Switch repo (keyboard draw); join the Discord for help.

## 5. Open questions for the human

1. Are you already registered, and do you have a team, or are you solo?
2. Is a hiring workflow OK to show publicly, given your employer? Any conflict-of-interest or IP concern with HireQuotient?
3. Which agents can you use right now: Claude Code only, or Codex as well?
4. Do you want the extra side tracks (Wispr voice build, blog post), which add about 2 hours?
5. If A feels too close to your day job, do you prefer B (developer workflow, safer to build) or C (trading, more personal)?
