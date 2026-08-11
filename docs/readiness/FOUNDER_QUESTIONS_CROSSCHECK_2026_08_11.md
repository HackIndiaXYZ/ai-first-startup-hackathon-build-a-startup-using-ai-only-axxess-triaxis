# Founder Questions Cross-Check

**Date:** 2026-08-11  
**Scope:** Cross-check of the founder-questions live tracking file supplied in this session against the current repository, prior audit docs, and current source state.  
**Purpose:** Document relevant corrections, stale rows, and carry-forward actionability not already cleanly captured elsewhere. This file does not replace `docs/audit/FOUNDER_QUESTIONS.md`; it is a reconciliation note.

## Summary

The founder-questions tracker is mostly valuable and already captured in the audit tree. This
reconciliation found three important cleanups; the high-confidence canonical audit-doc corrections
have now been applied:

1. **Commit attribution math needs correction.** The tracker repeats a founder-human commit count that treats GitHub Actions commits as founder commits.
2. **Repo/codebase age needs narrower wording.** The repo appears to contain the full technical history of the codebase, but not the full company/customer-discovery history.
3. **Several rows are stale after later implementation.** Most notably Q-008 appears fixed in current source/tests, while Q-004/Q-005/Q-006/Q-007 remain open security/privacy work and should not be softened.

## Cross-Check Table

| Question | Current tracker state | Cross-check result | Documentation action |
|---|---|---|---|
| Q-001 | Answered as process/governance context | Already documented in `docs/audit/FOUNDER_QUESTIONS.md` | No change required |
| Q-002 | States the repo contains 100% of AXXESS and treats repo age as company/product age | Partially correct but over-broad. Evidence supports "this repo contains the full technical/codebase history"; it should not erase February/March 2026 company, concept, discovery, incorporation, and stakeholder work. | Applied to `docs/audit/FOUNDER_QUESTIONS.md` and `docs/audit/00_BASELINE.md` |
| Q-003 | Claims 669 total commits and 618 human commits at the audit baseline | Numerically off. At commit `dfec8de`, direct `git log` count gives 669 total commits, 594 founder-human commits, and 75 bot/service commits. The difference is mainly 19 GitHub Actions commits under the `axxess-triaxis` display name that were counted as human in the tracker. | Applied to `docs/audit/FOUNDER_QUESTIONS.md`, `docs/audit/00_BASELINE.md`, and `docs/audit/01_REPOSITORY_EVOLUTION.md`; also reconciled the stale reference in `docs/audit/11_ENGINEERING_VELOCITY.md` |
| Q-004 | Partially cleared; 4/6 resource types tested; cleanup leak found then manually cleaned | Still materially open. The earlier cross-check found the harness still lacks `author_user_id` in the `knowledge_articles` create body and does not insert into `public.users`. `workflow_timeline_events` remains one of the previously untested resource types. | Keep open. Tie to the security hardening remediation plan rather than claiming harness completion |
| Q-005 | Open: RAG should fail closed on cross-tenant rows | Still open. Current RAG code still uses a soft filter pattern rather than a hard `assertTenantBoundary`-style guard. | Keep open and prioritize with Q-004 |
| Q-006 | Open: privacy export/delete queued-state | Still open. Current routes still behave as canned or queued acknowledgements rather than a real export/delete lifecycle. | Keep open; document as privacy/compliance gap |
| Q-007 | Open: agent approval audit trail | Still open. `src/app/api/approvals/[id]/route.ts` still lacks the audit-write behavior described by the security hardening prompt. | Keep open; tie to approval/security sprint |
| Q-008 | Open in tracker: Settings tab tests failed after Security tab removal | Stale. Current source defaults invalid/missing Settings tabs to `profile`; current tests explicitly assert `security` and `integrations` are not valid tabs and fallback to `profile`. | Applied to `docs/audit/FOUNDER_QUESTIONS.md`; targeted test execution should be recorded separately if run |
| Q-009 | Resolved from PostHog artifact, with caveats | Correctly resolved-with-caveats. The artifact supports real PostHog traffic/error evidence, but not the founder's original rough figures exactly. | No inflation: cite the artifact-backed values, not the original rough "40+ / 300+ / 10-15%" wording as exact |
| Q-010 | Memory exhaustion / test reliability open | Still relevant. This should feed directly into code-bloat, large-file, and CI-split guardrails; it is not just a local inconvenience. | Carry into deletion/bloat-control roadmap and CI reliability docs |
| Q-011 | JioGenNext nuanced rejection/product-interest framing resolved | Already documented as a useful, non-inflated traction signal | No change required unless the pitch/traction log needs a one-line cross-reference |
| Q-012 | LOI count resolved | Substantively captured in readiness/GTM docs as 5 signed LOIs plus 2 incoming, but still founder-stated unless source artifacts are linked | Keep the "source artifact needed" label until signed LOI files or redacted summaries are linked |
| Q-013 | Advance payment amount resolved | Captured as INR 25k-30k total advance-payment commitment, with one written source and four oral commitments. Older wording in the LOI/payment tracker may still mention dollar-denominated oral ranges. | Sync commercial ledger wording so it does not conflict with the resolved Q-013 amount |

## Corrected Commit Attribution

Direct reconstruction at the audit baseline commit `dfec8de`:

| Category | Count | Basis |
|---|---:|---|
| Total commits | 669 | `git rev-list --count dfec8de` |
| Founder-human commits | 594 | `noreply@triaxis.ventures` + `sudipta1213@gmail.com` + `sudipta1213-3967@users.noreply.github.com` |
| Bot/service commits | 75 | Dependabot, GitHub Actions, Vercel, PostHog bot, Vexo AI bot |

Current HEAD observed during the same cross-check had moved to 760 total commits and 37 migrations. This current count should not be mixed into the Phase 0 baseline without dating it separately.

## Stale Or Misleading Rows Reconciled First

1. **Q-003:** Replaced the 618/613 human-commit figures with 594 founder-human commits at `dfec8de`, and called out the 19 GitHub Actions service commits separately.
2. **Q-002:** Replaced "full company/product history" framing with "full technical/codebase history."
3. **Q-008:** Updated the tracker to reflect that current code/tests have reconciled the Settings fallback problem.
4. **Q-012/Q-013:** Left untouched in this pass because the correction confidence depends on commercial-source artifacts, not code-only evidence.

## Carry-Forward Open Work

| Cluster | Why it matters | Next action |
|---|---|---|
| Q-004/Q-005 | Tenant isolation harness and RAG fail-closed behavior are security foundations | Execute the security hardening sprint; do not close based only on intent |
| Q-006 | Privacy export/delete is a buyer/compliance trust surface | Convert acknowledgement routes into a real queued/export/delete lifecycle or explicitly label as pending |
| Q-007 | Agent approvals without audit rows weaken the agentic-governance story | Add decision audit logging and tests |
| Q-010 | Memory exhaustion affects build/test reliability and developer velocity | Tie to code deletion, CI split, large-file audit, and bloat guardrails |

## Evidence Notes

- `docs/audit/FOUNDER_QUESTIONS.md` already contains most of the question trail and should remain the canonical question log.
- `docs/readiness/PHASE0_AUDIT_BASELINE_CROSSCHECK_2026_08_11.md` contains the detailed Phase 0 count correction.
- `docs/readiness/SECURITY_HARDENING_AND_A102_A110_CROSSCHECK_2026_08_11.md` contains the detailed Q-004/Q-005/Q-006/Q-007 security remediation cross-check.
- Current Settings source confirms Q-008 has likely been fixed: `src/features/settings/SettingsSection.tsx` defaults to `profile`, and `src/features/settings/SettingsSection.tabs.test.tsx` asserts `security` and `integrations` are no longer valid tabs.

## Status

This cross-check is documentation-only. No source behavior was changed. Canonical audit-doc
corrections for Q-002, Q-003, and Q-008 were applied on 2026-08-11.
