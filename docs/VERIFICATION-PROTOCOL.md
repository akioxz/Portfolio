# Verification Protocol Reference

A standalone reference for what counts as "verified" vs. "claimed." Attach this alongside `SECURITY-CHECKLIST.md` for any continuation session, and always for audit/security-pass sessions.

## The core rule

A self-reported "done," "fixed," "verified," or "working" claim from an AI coding session is not evidence. It is a claim that must be checked against one of the following before being accepted:

1. An actual diff (before/after) of the changed files
2. Real command output (build logs, test output, a literal terminal paste) — not a paraphrase or summary of what the output "would show"
3. A reproducible manual step you can personally follow and confirm
4. For visual/UI claims: an actual screenshot from this session, not a description of what it should look like

## Specific failure modes to actively guard against

- **Fabricated evidence** — an AI describing a screenshot, benchmark result, or test output that was never actually produced. If a claim can't be traced to a real artifact from this session, treat it as unverified regardless of how confident or specific it sounds.
- **Happy-path-only testing** — confirming a feature works under ideal conditions without testing the failure path (missing input, expired token, network failure, malformed data). A feature is not verified until its failure paths are tested too.
- **Silent scope creep during "verification"** — an AI fixing something unrelated while claiming to verify the original item, making it unclear what was actually checked.
- **Stale-state assumptions** — treating a previous session's summary (including PROJECT_STATE.md) as still accurate without re-inspecting the actual current files. State drifts; always re-verify from the source, not from the last description of the source.

## Required behavior

- Diff before/after every claimed change — this is not optional, not even for "small" fixes
- For any auth/security-relevant change: explicitly test what happens when required config is missing, when input is malformed, and when a credential/token is expired or forged — not just the happy path
- For multi-file changes or migrations: verify the full set of changed files, not just the one that was the original target
- When reporting results, show the actual output (test run, build log, diff) inline — a description of results is not a substitute for the results themselves
- If verification cannot actually be performed (e.g. no test infrastructure exists, or a claim depends on a production environment you can't access), say so explicitly rather than presenting an unverified claim as verified

## How to apply this

Treat every "done" claim — your own or another AI session's — as a hypothesis to be checked, not a fact to be recorded. This applies retroactively too: if you're picking up a PROJECT_STATE.md written by a previous session, spot-check at least one of its "completed" claims against the actual code before trusting the rest.
