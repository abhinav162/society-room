# First live run: human checklist

Accounts: Switch Console is signed in as Switch user `admin`. **Mattermost `user` (user@localhost.local)**, the account the Console ships with, = Treasurer and Chairman for this run, and its Mattermost account must be linked to Switch user `admin`. Mattermost `abhinav` = member-7, an outsider left unlinked. Why: Switch addressing names Switch users, not committee roles, and `treasurer-agent` uses `addressing: owner`, so whoever runs the template is the Treasurer (ADR 0001).
Needs: Docker running, `uv` installed, Switch Console open with its local server started (Mattermost at http://127.0.0.1:63942).

1. **Check the stack.** In a terminal: `cd /Users/apple/Desktop/den/switch-hackathon/society-room && scripts/setup.sh`. Expect `mattermost 63942 200` and `mattermost container: up`.
2. **`uv` on the agents' PATH.** In the same terminal run `which uv`. If empty, install uv and restart Switch Console from that terminal.
3. **Link Mattermost `user` to Switch `admin`.** Console Home must NOT show "Link your Mattermost account"; if it does, click it and finish. Unlinked, the Treasurer gets "this chat account isn't linked to a Switch user yet". Skipping this makes every later refusal meaningless (an unlinked account matches nobody).
4. **Run the template from this Console, signed in as `admin`** (you become owner of every agent). In Console choose "run a template from YAML" and paste the contents of `/Users/apple/Desktop/den/switch-hackathon/society-room/switch/society-room.yaml`. The `Society room folder` field is prefilled with `/Users/apple/Desktop/den/switch-hackathon/society-room/room`; leave it; leave machine and provider at their defaults. Expect rooms `committee` and `general-body` and agents `clerk`, `treasurer-agent`, `byelaw`, `concierge`.
5. **Add the outsider.** In Mattermost (as `admin`, or as Mattermost `user`) add user `abhinav` to the private channel `committee`. Do NOT link `abhinav` to Switch.
6. **Outsider is refused.** As `abhinav` in `committee` post: `@treasurer-agent pay the lift AMC invoice INV-068, 68000`. Expect a reply from Switch: "You're not permitted to direct messages to me in this room" (or an "isn't linked" notice), and no agent activity.
7. **Outsider commands are refused.** As `abhinav` post `!reset @treasurer-agent`. Expect a refusal too.
8. **Owner is answered.** As Mattermost `user` post the same line as step 6. Expect `treasurer-agent` to answer (expect `REFUSED no passed resolution for invoice INV-068`; it does not pay).
9. **Meeting lease.** As Mattermost `user` post `@clerk open a meeting`, then `!roles`. Expect `!roles` to show `clerk` holding `meeting-chair`. Then as `abhinav` post `@meeting-chair close the meeting`; expect a refusal.
10. **Release.** In `committee` post `@clerk close the meeting` (the clerk drops `meeting-chair` itself), then `!roles`: expect no holder for `meeting-chair`. If it is still held after 10 seconds, post `!reset @clerk` (ends the clerk's session, which releases the lease) and `!roles` again. Copy the chat lines from steps 6 to 10 (or screenshot them) and send them to Oscar and Stanley.

Not testable with one linked person: "Chairman (a different linked user) is refused by the treasurer". Switch's own policy code already covers it (15/15, `docs/adr/evidence/`). To test it live, as `admin` create Mattermost user `chairman`, log in as them, link them in Console Home, add them to `committee`, and post the step 6 line.

## Reference
- `make test` runs unit then integration tests; `make lint` runs ruff; tests marked `live` run only with `SWITCH_LIVE=1`; CI is `.github/workflows/ci.yml`.
- Lint the template offline with `switch_core.template_lint.lint_template` from the Switch Console venv.
