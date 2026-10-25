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


## Managed owner password UI

With `MASTER_PLAN_AUTH_MODE=neon`, manual-key authentication is disabled (including old signed key sessions). The hosted UI supports password sign-in, owner-email OTP setup/recovery, and authenticated password change. Managed Neon Auth stores password hashes, verifies OTPs and sessions, and applies provider rate limits. The office does not store or log plaintext passwords or codes.

Required **branch-scoped Preview** variables:
- `MASTER_PLAN_NEON_AUTH_URL`: exact provisioned managed Auth base URL, HTTPS.
- `MASTER_PLAN_OWNER_ID`: pre-provisioned owner's immutable provider user ID.
- `MASTER_PLAN_OWNER_EMAIL`: matching owner email, confirmed through the Vercel control plane.
- `MASTER_PLAN_ORIGIN`: exact stable office origin; also allow only this deployment origin in Neon Auth domains.
- `MASTER_PLAN_SESSION_SECRET`: retained server secret for the pinned Neon toolkit's cookie signing.
- `MASTER_PLAN_DATA_GZIP`: retained private snapshot; not moved or exposed.

No database connection string is needed in this app: the managed Auth service uses its own private Neon database. Do not connect database credentials to every preview branch. The Neon provider may permit other account registrations; those accounts gain **no office access**. Backend checks provider-validated session, exact owner ID + email + emailVerified and expiry before any snapshot. The UI has no signup route or first-visitor account claim.

`/api/master-plan-auth` exposes only fixed-owner sign-in, email OTP request/reset, authenticated password change and logout. All mutations require exact Origin and JSON. Response bodies are sanitized; provider tokens are never forwarded into JavaScript. The pinned `@neondatabase/auth/server` adapter handles secure cookies. Every protected session lookup bypasses session-data caching. Reset verifies the newly signed-in owner and explicitly revokes other sessions before forwarding its cookie. Password change requests other-session revocation. Legacy auth remains solely for deliberate rollback with mode unset, never as an automatic fallback in Neon mode.

Before declaring setup complete, the owner must receive their OTP and enter their own password on the hosted UI. Verify actual provider emailVerified transition, login, cookies, logout, wrong-owner denial and reset revocation. Test stubs do not establish those live outcomes. Never read the password, OTP or browser cookies through automation. No provider account, password or OTP fixture belongs in committed source.
