# Private master plan

Route: `/admin/master-plan/`. The static shell contains no company snapshot, private repo metadata or credentials. All data comes from `/api/master-plan` after authentication. Do not put a JSON snapshot in this public repository.

Server-only environment variables:

- `MASTER_PLAN_ACCESS_KEY_SHA256`: SHA-256 hex digest of a cryptographically random 32-byte owner access key. Never use a human-chosen password; this endpoint intentionally supports high-entropy keys.
- `MASTER_PLAN_SESSION_SECRET`: independent random secret of at least 32 characters.
- `MASTER_PLAN_ORIGIN`: exact HTTPS origin of the deployment. POSTs from any other origin are rejected.
- `MASTER_PLAN_DATA_GZIP`: base64 gzip JSON snapshot, stored encrypted in the deployment environment. Maximum decoded size 1 MiB. Keep deployment configuration within provider limits.

The snapshot shape is `{ capturedAt, commits, builds, projects, priorities, sources }`; the frontend documents the fields consumed. Keep timestamps from verified sources. Commit dates are not push event timestamps. READY is a build result, not a live QA assertion. All recommendations must remain distinguishable from evidence. Refresh the snapshot through an authorized connector workflow and redeploy; reload only reads the installed snapshot. There is no scheduler, autonomous publishing or ad-spend action.

Sessions last eight hours with a Secure, HttpOnly, SameSite=Strict, host-only cookie. Rotating the session secret revokes all sessions. Missing configuration fails closed. Responses are private/no-store. Apply the supplied security headers and do not add analytics or third-party scripts to this route. Links use no-referrer.

Run `node --test tests/master-plan.test.mjs`. The test imports the handler as ESM without changing the repository module type. Visual QA should cover 320, 375, 390, 430, 768 and 1440px; test search, filters, details, evidence links, activity tabs and logout. Use a disposable access key and snapshot for tests.

Deploy first to an isolated preview branch with branch-scoped encrypted environment variables, verify unauthorized denial and authenticated rendering, then release only the reviewed change. Never place private snapshot data, screenshots or access keys in a public PR.
