# Security Hardening + A-102/A-103/A-109/A-110 Cross-Check

Date: 2026-08-11

Source checked: founder-provided attachment, `# Security Hardening Sprint: Q-004/005/006/007 + Release CI Split`, plus repository source/docs at current HEAD.

Purpose: capture relevant items from the attachment that are not already documented, or are now inconsistent with the current repository state. This is a cross-check only; it does not claim any item is closed.

## Executive Summary

The attachment contains two distinct work clusters:

1. Security/governance hardening: Q-004, Q-005, Q-006, Q-007, and a targeted release-CI split.
2. Product/actionable remediation: A-102, A-103, A-109, A-110.

Current repo state is split:

- The **security/governance cluster is still mostly not implemented** in source. Existing audit docs already identify Q-004 through Q-007 as open/partial, but the attachment adds a more executable remediation plan that was not yet captured as its own roadmap.
- The **A-102/A-103/A-109/A-110 product cluster appears implemented in source**, but `docs/readiness/ACTIONABLES_READINESS_MATRIX.md` still describes those rows as `No` / net-new / not built, and no dedicated closeout documents for those four items were found.

The main documentation gaps are therefore:

- Add a canonical Q-004/Q-005/Q-006/Q-007 security hardening roadmap/closeout tracker.
- Reconcile A-102/A-103/A-109/A-110 actionables matrix rows against current source.
- Create closeouts for A-102/A-103/A-109/A-110 before changing their status to `Yes`.
- Add or document the targeted security/release CI job, because no matching workflow was found by search.

## Cross-Check Table

| Item | Attachment Claim / Plan | Current Repo Evidence | Documentation Gap |
|---|---|---|---|
| Q-004 | Fix two untested harness resources: `knowledge_articles` needs `author_user_id`; `workflow_timeline_events` needs a matching `public.users` row in setup. | `scripts/verify-two-tenant-isolation.mjs` still creates `knowledge_articles` without `author_user_id` and `setUpTenant()` still creates `profiles`/membership/roles but not `public.users`. `docs/audit/FOUNDER_QUESTIONS.md` still marks Q-004 `PARTIALLY CLEARED`. | Attachment adds exact fixture fixes and acceptance condition. Needs roadmap and implementation tracking. |
| Q-005 | Keep service-role RAG path but add explicit hard tenant guard with `assertTenantBoundary`/`TenantAccessError`; throw loudly on mismatch. | `src/services/rag/tenantRagWorkflow.ts` still imports no `tenantGuard`, still queries `rag_document_chunks` with service-role, and still uses a soft `.filter((row) => row.organization_id === scope.organizationId)`. `docs/audit/FOUNDER_QUESTIONS.md` marks Q-005 `OPEN ISSUE`. | Existing docs identify risk, but the exact accepted fix shape from the attachment needs to be captured as canonical remediation scope. |
| Q-006 | Rewrite account deletion/privacy export routes to create real `privacy_requests` rows, compute/store `execution_plan`, and audit-log request creation. | `src/app/api/account/deletion-request/route.ts` still only audit-logs and returns a canned message; `src/app/api/privacy/export-request/route.ts` still returns a canned message and does not write a request row. `privacy_requests` table exists in migration `202607090001_sprint12_security_compliance_foundation.sql`. | Existing docs identify the stub gap, but the queued-state remediation plan should be documented as the current accepted product/security scope. |
| Q-007 | Add audit logs to approval decisions and `Always Allow` agent grants; optionally add DB trigger defense-in-depth. | `src/app/api/approvals/[id]/route.ts` still calls `approvalRequestsRepository.decide()` and `createGrant()` without `auditLogsRepository.record`. No migration covering approval/grant audit triggers was found. | Existing audit docs mark Q-007 open. Attachment adds exact audit actions/categories/metadata and dual-layer app+DB trigger option; document as remediation scope. |
| Release CI split | Add advisory-first `security-isolation-tests` job for targeted RAG/security/approval tests; do not run the live two-tenant harness automatically. | Search found no workflow named `security-isolation-tests` and no exact targeted job references for `tenantRagWorkflow.answerGrounding`, approval audit tests, or the proposed canonical release-CI shape. | Needs CI roadmap/doc update. Important distinction: live two-tenant harness remains manual/staging-only. |
| A-102 | AI Review Inbox edited/escalated decisions need real substance: edited text and escalation target. | Source now has `supabase/migrations/20260809120000_ai_review_decision_substance.sql`, `edited_answer`, `escalation_type`, `escalation_target` mappings in `src/services/ai/reviewInbox.ts`, and A-102 tests. | `ACTIONABLES_READINESS_MATRIX.md` still says A-102 is `No` / not scoped or built. No dedicated A-102 closeout doc found. |
| A-103 | Add real Reminder type/tab inside Tasks & Workflow. | Source now has `supabase/migrations/20260809130000_reminders.sql`, `Reminder` repository/types, `remindersRepository`, and A-103 tests. | `ACTIONABLES_READINESS_MATRIX.md` still says A-103 is `No` / not scoped or built. No dedicated A-103 closeout doc found. |
| A-109 | Remove Settings > Integrations tab; consolidate to sidebar `/integrations`; move unique settings-only features. | `src/features/settings/SettingsSection.tsx` now removes `integrations` from `validTabs`. `WhatsAppPhoneNumberField` exists under `src/features/integrations/`. `IntegrationsSection.tsx` renders `AgentConnectionsPanel` and the WhatsApp field. | `ACTIONABLES_READINESS_MATRIX.md` still says A-109 is `No` / not scoped or built. No dedicated A-109 closeout doc found. |
| A-110 | Add Executive Dashboard top section: Daily, Weekly, Monthly, Year-on-Year, Insights, Actionables. | Source now has `src/services/dashboard/dashboardSnapshotPeriods.ts`, `src/app/api/dashboard/snapshot-periods/route.ts`, `src/hooks/useDashboardSnapshotPeriods.ts`, `src/features/dashboard/DashboardSnapshotBar.tsx`, and tests. | `ACTIONABLES_READINESS_MATRIX.md` still says A-110 is `No` / not scoped or built. No dedicated A-110 closeout doc found. |

## Security Cluster: Relevant Details Not Yet Captured as a Roadmap

### Q-004: Two-Tenant Harness Completion

Current canonical docs correctly say Q-004 is only partially cleared: 4 of 6 resource types passed once in production, while `knowledge_articles` and `workflow_timeline_events` remained unverified.

The attachment adds the concrete root causes:

- `knowledge_articles` fixture inserts without `author_user_id`, so the owning tenant cannot create its own test row before cross-tenant isolation is exercised.
- `workflow_timeline_events.actor_user_id` references `public.users(id)`, but the harness only inserts into `profiles`/membership/roles and does not create a matching `public.users` row.

Documented acceptance condition:

- Fix the fixture setup.
- Re-run manually against staging/non-production if available, or production only with throwaway tenants and monitored cleanup.
- Mark Q-004 fully cleared only if all 6 of 6 resource types pass cross-tenant read/write blocking.

### Q-005: RAG Tenant Boundary Hard Guard

Current state remains security-relevant:

- RAG persistent citations query `rag_document_chunks` through `supabaseAdminRest`.
- Isolation currently relies on query params plus a post-fetch filter.
- No hard `assertTenantBoundary` guard is present in `tenantRagWorkflow.ts`.

The attachment’s accepted scope is narrower than a rewrite:

- Keep the service-role path.
- Add a hard application-level tenant boundary assertion before any row contributes to citations/answers.
- Throw on mismatch instead of silently filtering.
- Add defensive write-side checks for ingested chunk rows.

Important carry-forward:

- `reviewTenantRagAnswer()` has a similar PATCH-with-filter pattern against AI audit/review tables. The attachment explicitly flags this as same risk class but out of scope for this pass. That should become a follow-up issue if not already tracked.

### Q-006: Privacy Request Queued-State, Not Full Execution

The attachment’s scope is intentionally honest:

- Build real request recording and execution-plan storage.
- Do not claim erasure/export execution is complete.

Minimum remediation acceptance:

- `account/deletion-request` and `privacy/export-request` insert real `privacy_requests` rows.
- `buildPrivacyExecutionPlan()` is invoked and stored in `execution_plan`.
- Both routes audit-log their request creation.
- Response copy says queued/planned, not completed.

Explicitly not done in that scope:

- Actual object deletion.
- Actual vector chunk deletion.
- Actual cache purge.
- Actual export package assembly/signing.

### Q-007: Agent Approval Audit Trail

Current route still has the gap:

- `PATCH /api/approvals/[id]` decides an approval and may create an agent grant.
- It does not write `audit_logs`.

Attachment adds exact audit semantics:

- `approval.approved` or `approval.rejected`
- `agent_grant.created` when `alwaysAllow` creates a grant
- category: `ai-governance`
- metadata: decision reason, agent connection id, tool name, always-allow flag

Recommended documentation treatment:

- Treat app-level audit logging as required.
- Treat DB trigger extension as defense-in-depth and a separate subtask unless implemented in the same sprint.

## Product Cluster: Source Has Moved Ahead of Docs

The attachment’s second cluster has largely landed in source, based on code markers and files present.

However, because the actionables matrix still describes A-102/A-103/A-109/A-110 as unbuilt, those rows should not be quoted externally until reconciled.

Recommended safe status language before a full closeout:

| Item | Interim Status |
|---|---|
| A-102 | Code-present; needs closeout, verification summary, migration-apply status, and live/HITL proof before `Yes`. |
| A-103 | Code-present; needs closeout, migration-apply status, and live/HITL proof before `Yes`. |
| A-109 | Code-present; needs closeout and live UI proof that Settings no longer exposes the duplicate tab and `/integrations` carries migrated fields. |
| A-110 | Code-present; needs closeout and live dashboard proof that all six requested sub-sections render with real/honest data states. |

## Documentation Actions Recommended

1. Create a dedicated security hardening roadmap:
   - `docs/readiness/SECURITY_HARDENING_Q004_Q005_Q006_Q007_ROADMAP_2026_08_11.md`
2. Create a security hardening checklist:
   - `docs/readiness/SECURITY_HARDENING_Q004_Q005_Q006_Q007_CHECKLIST_2026_08_11.md`
3. After implementation, create one closeout per item or one combined closeout with separate sections:
   - Q-004 harness fixture fix and rerun
   - Q-005 RAG tenant guard
   - Q-006 privacy queued-state
   - Q-007 approval/grant audit trail
   - CI advisory security-isolation job
4. Create or locate closeouts for A-102/A-103/A-109/A-110.
5. Update `ACTIONABLES_READINESS_MATRIX.md` only after each closeout cites:
   - files changed
   - migrations added/applied
   - tests run
   - live or code-level proof
   - residual blocker if any

## Highest-Risk Unclosed Items

| Rank | Item | Why It Matters |
|---:|---|---|
| 1 | Q-005 RAG service-role tenant isolation | A failure here could expose one tenant’s document content through an AI answer. |
| 2 | Q-006 privacy request stubs | Enterprise/public-sector buyers will not accept erasure/export claims if the routes are only canned responses. |
| 3 | Q-007 missing approval/grant audit trail | Agent approvals are high-autonomy actions and must be traceable in the same audit system as other privileged actions. |
| 4 | Q-004 partial harness coverage | Tenant isolation has strong proof for 4/6 resources but still lacks complete repeatable coverage. |
| 5 | A-102/A-103/A-109/A-110 documentation drift | Source appears ahead of the matrix; external reporting can become inaccurate if not reconciled. |

## Current Conclusion

The attachment is not redundant.

The repo already documents the existence of Q-004 through Q-007, but not the full executable remediation shape contained in the attachment. Those details should be promoted into a formal security hardening roadmap/checklist.

For A-102/A-103/A-109/A-110, the opposite problem exists: source appears to have moved ahead of documentation. The relevant missing work is not planning; it is closeout, matrix reconciliation, migration/live-proof status, and evidence-chain documentation.

