# Phase 0 Audit Baseline Cross-Check

Date: 2026-08-11

Source checked: founder-provided Phase 0 audit baseline attachment, current `docs/audit/00_BASELINE.md`, `docs/audit/FOUNDER_QUESTIONS.md`, git history at audit commit `dfec8de`, and current HEAD `f066090`.

Purpose: document relevant corrections, stale points, and interpretation guardrails not already cleanly captured by the Phase 0 audit docs.

## Executive Summary

The Phase 0 attachment is mostly already present in `docs/audit/00_BASELINE.md` and `docs/audit/FOUNDER_QUESTIONS.md`.

One important correction was identified and has now been applied to the canonical audit docs:

- The founder-human commit count at audit commit `dfec8de` is **594**, not 613 or 618, if `actions@users.noreply.github.com` commits are treated as CI/service commits rather than founder-human commits.

One interpretation needs tightening:

- Founder answer `"This repo contains 100% of AXXESS"` should be read as **100% of the AXXESS product codebase/repository evidence**, not as erasing the already-documented pre-repo company/customer-discovery history. The repo started on 2026-07-02; Triaxis/company and market-discovery history may still predate repo creation.

One time-bound metric is now stale:

- Phase 0’s `669 commits` and `35 migrations` were correct at `dfec8de` on 2026-08-10. Current HEAD `f066090` on 2026-08-11 has **760 commits** and **37 migration files**.

## What Was Already Documented

| Topic | Already documented where | Status |
|---|---|---|
| First commit `5c68e45`, 2026-07-02 | `docs/audit/00_BASELINE.md` | Already documented |
| Real foundation commit `fcb8788`, 173 files / 19,260 insertions | `docs/audit/00_BASELINE.md` | Already documented |
| Audit-time HEAD `dfec8de` | `docs/audit/00_BASELINE.md` | Already documented |
| Audit-time total commits: 669 | `docs/audit/00_BASELINE.md` | Already documented |
| Audit-time migrations: 35 | `docs/audit/00_BASELINE.md` | Already documented |
| Q-002 founder answer: repo contains 100% of AXXESS | `docs/audit/00_BASELINE.md`, `docs/audit/FOUNDER_QUESTIONS.md` | Already documented |
| Q-003 founder answer: `Triaxis Ventures <noreply@triaxis.ventures>` is founder-controlled | `docs/audit/00_BASELINE.md`, `docs/audit/FOUNDER_QUESTIONS.md` | Already documented |

## Correction: Founder-Human Commit Count at `dfec8de`

The attachment’s final Q-003 status says:

> Of 669 total commits, 56 are bot-attributed (51 dependabot, 3 Vercel, 1 vexo-ai, 1 posthog) and the remaining 613 are the founder's.

That misses the 19 `actions@users.noreply.github.com` commits that appear under the `axxess-triaxis` display name in the attachment’s own analysis.

Direct verification against `dfec8de`:

| Email | Count | Classification |
|---|---:|---|
| `noreply@triaxis.ventures` | 435 | Founder-controlled, per Q-003 |
| `sudipta1213@gmail.com` | 157 | Founder |
| `sudipta1213-3967@users.noreply.github.com` | 2 | Founder GitHub noreply |
| `49699333+dependabot[bot]@users.noreply.github.com` | 51 | Bot/service |
| `actions@users.noreply.github.com` | 19 | GitHub Actions/service |
| `vercel[bot]@users.noreply.github.com` | 3 | Bot/service |
| `206114724+posthog[bot]@users.noreply.github.com` | 1 | Bot/service |
| `259884853+vexo-ai[bot]@users.noreply.github.com` | 1 | Bot/service |

Corrected audit-time count:

- Total commits at `dfec8de`: **669**
- Founder-human commits: **594**
- Bot/service commits: **75**

Calculation:

- Founder-human: `435 + 157 + 2 = 594`
- Bot/service: `51 + 19 + 3 + 1 + 1 = 75`
- Total: `594 + 75 = 669`

## Current HEAD Update

Phase 0 is time-bound to `dfec8de`. It should not be silently updated, but current status should be known when quoting today’s repo metrics.

Current HEAD checked:

- HEAD: `f066090`
- Commit message: `docs(audit): redact exploit-level security detail before public push`
- Date: 2026-08-11

Current email-level count at HEAD:

| Email | Count | Classification |
|---|---:|---|
| `noreply@triaxis.ventures` | 464 | Founder-controlled |
| `sudipta1213@gmail.com` | 210 | Founder |
| `sudipta1213-3967@users.noreply.github.com` | 2 | Founder GitHub noreply |
| `49699333+dependabot[bot]@users.noreply.github.com` | 58 | Bot/service |
| `actions@users.noreply.github.com` | 19 | GitHub Actions/service |
| `vercel[bot]@users.noreply.github.com` | 3 | Bot/service |
| `198982749+Copilot@users.noreply.github.com` | 2 | Bot/service |
| `259884853+vexo-ai[bot]@users.noreply.github.com` | 1 | Bot/service |
| `206114724+posthog[bot]@users.noreply.github.com` | 1 | Bot/service |

Current corrected count:

- Total commits at `f066090`: **760**
- Founder-human commits: **676**
- Bot/service commits: **84**

Calculation:

- Founder-human: `464 + 210 + 2 = 676`
- Bot/service: `58 + 19 + 3 + 2 + 1 + 1 = 84`
- Total: `676 + 84 = 760`

## Migration Count Update

The attachment says 35 migration files as of audit time.

Verification:

| Point | Migration files |
|---|---:|
| Audit commit `dfec8de` | 35 |
| Current HEAD `f066090` | 37 |

Interpretation:

- Phase 0’s `35` is correct for the audit snapshot.
- Current reporting should use `37` unless intentionally quoting the Phase 0 snapshot.

## Interpretation Guardrail: Repo Age vs Company/Discovery Age

The Phase 0 docs currently state:

> repository age (39 days) equals product/company age

This should be tightened.

The founder answer `"This repo contains 100% of AXXESS"` resolves whether the current repository is a partial technical history. It does **not** necessarily mean Triaxis Ventures, customer discovery, company formation, or pre-code product thinking began only on 2026-07-02.

Recommended wording:

> The repository contains 100% of the AXXESS product codebase and technical implementation history available for audit. The codebase began on 2026-07-02. This does not erase separately documented founder/company/customer-discovery history before the repository existed.

Why this matters:

- Engineering velocity claims should use the 2026-07-02 repo start.
- Company/founder/customer-discovery timeline claims should use their own dated source artifacts, not the git start date.
- Investor-facing materials should not accidentally claim the company itself began on 2026-07-02 if other records say otherwise.

## Corrections Applied To Existing Docs

1. `docs/audit/00_BASELINE.md` now revises Q-003 final status from `613 founder's` to:
   - `594 founder-human commits and 75 bot/service commits at dfec8de`.

2. `docs/audit/FOUNDER_QUESTIONS.md` now revises the Q-003 status sentence. The prior text contained a math and wording error:
   - said `669 of 669 non-bot-attributed commits`
   - said `618 after excluding... = 618 human commits`
   - omitted the 19 `actions@users.noreply.github.com` service commits

   Corrected version:
   - `At dfec8de, 594 of 669 commits are founder-human after excluding 75 bot/service commits: 51 dependabot, 19 GitHub Actions, 3 Vercel, 1 vexo-ai, 1 posthog.`

3. `docs/audit/01_REPOSITORY_EVOLUTION.md` now revises the stale reference to `613 of 669 commits founder-authored`.

4. `docs/audit/00_BASELINE.md` and `docs/audit/FOUNDER_QUESTIONS.md` now narrow `product/company age` to `repository/codebase age` / complete technical history.

## What Not To Change

Do not rewrite the Phase 0 snapshot as if it were current HEAD.

Phase 0 should remain a dated audit snapshot:

- HEAD `dfec8de`
- 2026-08-10
- 669 commits
- 35 migrations

Instead, add a note that current HEAD has moved to:

- HEAD `f066090`
- 760 commits
- 37 migrations

## Current Conclusion

The Phase 0 attachment is mostly already documented, and the main corrections have now been applied before external quotation:

1. Correct founder-human commit count at `dfec8de`: **594**, not 613/618.
2. Treat `39 days` as repo/codebase age, not necessarily company/customer-discovery age.
3. Keep Phase 0 metrics time-bound; current HEAD has already moved to **760 commits** and **37 migrations**.
