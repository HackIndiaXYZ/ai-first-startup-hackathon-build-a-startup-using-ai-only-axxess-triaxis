#!/usr/bin/env node
/**
 * axxess-triaxis-ci-mr-review-bot
 *
 * Fetches the diff of the current MR, sends it to Anthropic Claude for review,
 * and posts the structured feedback as a GitLab MR comment.
 *
 * Required environment variables (set as masked CI/CD variables):
 *   GITLAB_MR_BOT_TOKEN  – GitLab personal access token with `api` scope
 *   ANTHROPIC_API_KEY    – Anthropic API key
 *
 * GitLab CI variables used automatically:
 *   CI_PROJECT_ID, CI_MERGE_REQUEST_IID, CI_SERVER_URL
 */

import { execSync } from 'node:child_process';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const GITLAB_URL      = process.env.CI_SERVER_URL        ?? 'https://gitlab.com';
const PROJECT_ID      = process.env.CI_PROJECT_ID;
const MR_IID          = process.env.CI_MERGE_REQUEST_IID;
const BOT_TOKEN       = process.env.GITLAB_MR_BOT_TOKEN;
const ANTHROPIC_KEY   = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_MODEL = process.env.MR_BOT_MODEL ?? 'claude-opus-4-5';
const MAX_DIFF_CHARS  = 80_000; // stay well within context limits

// ---------------------------------------------------------------------------
// Guards
// ---------------------------------------------------------------------------
if (!PROJECT_ID || !MR_IID) {
  console.error('ERROR: This script must run inside a GitLab merge_request_event pipeline.');
  console.error('       CI_PROJECT_ID and CI_MERGE_REQUEST_IID must be set.');
  process.exit(1);
}
if (!BOT_TOKEN) {
  console.error('ERROR: GITLAB_MR_BOT_TOKEN is not set. Add it as a masked CI/CD variable.');
  process.exit(1);
}
if (!ANTHROPIC_KEY) {
  console.error('ERROR: ANTHROPIC_API_KEY is not set. Add it as a masked CI/CD variable.');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Minimal fetch wrapper that throws on non-2xx responses.
 * @param {string} url
 * @param {RequestInit} [opts]
 */
async function apiFetch(url, opts = {}) {
  const res = await fetch(url, opts);
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${res.statusText} — ${url}\n${body}`);
  }
  return res.json();
}

/** GitLab API base URL for this project. */
const GL_API = `${GITLAB_URL}/api/v4/projects/${encodeURIComponent(PROJECT_ID)}`;

/** Common GitLab auth headers. */
const glHeaders = {
  'PRIVATE-TOKEN': BOT_TOKEN,
  'Content-Type': 'application/json',
};

// ---------------------------------------------------------------------------
// Step 1 – Fetch MR metadata
// ---------------------------------------------------------------------------
console.log(`\n🔍  Fetching MR !${MR_IID} metadata…`);
const mr = await apiFetch(`${GL_API}/merge_requests/${MR_IID}`, {
  headers: glHeaders,
});
console.log(`    Title : ${mr.title}`);
console.log(`    Author: ${mr.author?.username}`);
console.log(`    Branch: ${mr.source_branch} → ${mr.target_branch}`);

// ---------------------------------------------------------------------------
// Step 2 – Fetch MR diff
// ---------------------------------------------------------------------------
console.log('\n📄  Fetching MR diff…');
const diffsRaw = await apiFetch(
  `${GL_API}/merge_requests/${MR_IID}/diffs?per_page=50`,
  { headers: glHeaders },
);

const diffText = diffsRaw
  .map((f) => [
    `--- a/${f.old_path}`,
    `+++ b/${f.new_path}`,
    f.diff ?? '',
  ].join('\n'))
  .join('\n\n');

const truncated = diffText.length > MAX_DIFF_CHARS;
const diffForReview = truncated
  ? diffText.slice(0, MAX_DIFF_CHARS) + '\n\n[… diff truncated for length …]'
  : diffText;

console.log(
  `    Files : ${diffsRaw.length}  |  Diff size: ${diffText.length} chars` +
  (truncated ? '  (truncated)' : ''),
);

// ---------------------------------------------------------------------------
// Step 3 – Ask Claude for a review
// ---------------------------------------------------------------------------
console.log(`\n🤖  Sending diff to ${ANTHROPIC_MODEL} for review…`);

const systemPrompt = `You are an expert code reviewer for the Axxess Triaxis project.
Your job is to review GitLab merge request diffs and provide clear, actionable feedback.

Always structure your response with these exact markdown sections:

## Summary
A 2-4 sentence overview of what the MR does.

## ✅ Strengths
Bullet list of things done well (skip if none).

## ⚠️ Issues
Numbered list of problems, each with:
- **Severity**: Critical | Major | Minor
- **File & line** (if applicable)
- **Description** and suggested fix

Skip this section if there are no issues.

## 💡 Suggestions
Optional improvements that are not blocking.

## Verdict
One of: **Approve** | **Request Changes** | **Needs Discussion**
Follow with a one-sentence rationale.

Be concise. Focus on correctness, security, performance, and maintainability.
Do not comment on style issues already covered by a linter.`;

const userPrompt = `Please review the following merge request.

**Title:** ${mr.title}
**Description:** ${mr.description ?? '(none)'}
**Branch:** \`${mr.source_branch}\` → \`${mr.target_branch}\`

### Diff
\`\`\`diff
${diffForReview}
\`\`\``;

const anthropicRes = await apiFetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'x-api-key': ANTHROPIC_KEY,
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json',
  },
  body: JSON.stringify({
    model: ANTHROPIC_MODEL,
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  }),
});

const reviewText = anthropicRes.content?.[0]?.text;
if (!reviewText) {
  console.error('ERROR: Anthropic returned an unexpected response shape:', JSON.stringify(anthropicRes));
  process.exit(1);
}

console.log('    Review received ✓');

// ---------------------------------------------------------------------------
// Step 4 – Post the review as an MR note
// ---------------------------------------------------------------------------
console.log('\n💬  Posting review comment to MR…');

const noteBody = [
  '<!-- axxess-triaxis-ci-mr-review-bot -->',
  '### 🤖 AI Code Review — `axxess-triaxis-ci-mr-review-bot`',
  '',
  reviewText,
  '',
  '---',
  `*Reviewed by [Claude](https://anthropic.com) (\`${ANTHROPIC_MODEL}\`) · Powered by [axxess-triaxis-ci-mr-review-bot](${GITLAB_URL}/triaxis-ventures-private-limited-group/axxess-triaxis/-/blob/main/scripts/mr-review-bot.mjs)*`,
].join('\n');

await apiFetch(`${GL_API}/merge_requests/${MR_IID}/notes`, {
  method: 'POST',
  headers: glHeaders,
  body: JSON.stringify({ body: noteBody }),
});

console.log('    Comment posted ✓');
console.log('\n✅  MR review bot finished successfully.');
