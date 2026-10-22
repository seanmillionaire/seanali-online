# TTS security hardening log — 2026-10-22

**Status:** Draft branch only; not merged or deployed.
**Repo:** `seanmillionaire/seanali-online`
**Base:** `main` at `56952ec8a3fb5dca94ddd3dea5960804c5d0b6ea`
**Branch:** `security/tts-hardening-20261022`

## Changes

| ID | Path | Original blob | Commits | Description |
| --- | --- | --- | --- | --- |
| SEC-TTS-001 | `api/tts.js` | `fecc73459e3f76fde6fadc22022f327c85a8dd4c` | `1ddc2e91d2dd9f1e432a9dafbcde7c53337cab9a`, `132e47155d348d8a7dfc2df5d75525a8e08c092c` | Durable Upstash limits on per-IP minute (6), per-IP day (60) and total day (500); provider calls fail closed if quota store unavailable; caller cannot select arbitrary premium model/voice; redact upstream errors and prevent shared caching of generated audio. |

## Required environment before deployment

Configure the following **in the deployment platform's encrypted environment/secret manager** (do not commit values):
- `ELEVENLABS_API_KEY` (existing, used for voice)
- `UPSTASH_REDIS_REST_URL` (Upstash Redis REST endpoint)
- `UPSTASH_REDIS_REST_TOKEN` (Upstash Redis REST token)
- `TTS_RATE_LIMIT_SALT` (new, long randomly generated private value; used to hash caller IP)
- Optional existing `ELEVENLABS_VOICE_ID`, `ELEVENLABS_MODEL_ID`.

Without all three quota environment variables, /api/tts returns **503 intentionally** instead of spending paid provider credits. Do not deploy before configuring and verifying them.

## Staging validation

1. Build and smoke test Vercel route with normal TTS request (valid model/voice) and verify playable audio.
2. Request another voice/model and verify 400; confirm existing front-end uses the default.
3. Simulate 7 requests from same IP in one minute; request 7 must be 429. Test 61 requests/day and global 501/day only against stubbed ElevenLabs, NOT the paid live service.
4. Disable Upstash credentials in staging; verify 503 and no outbound ElevenLabs request.
5. Confirm `x-vercel-forwarded-for` is reliably provided by the trusted Vercel ingress. If missing, all callers share the conservative fallback quota.
6. Verify generated audio uses `private, no-store`, errors never include upstream details, and no hidden customer traffic is cached publicly.
7. Confirm legitimate voice UX still works within limits. Set stricter thresholds or use authenticated user quotas for higher-scale deployments.

## Rollback

Before merge: close draft PR and delete branch. After merge: revert both commits using a new rollback PR. The previous unlimited endpoint is **not** a secure fallback; prefer temporarily disabling TTS if configuration fails.

**Not covered:** Distributed bot attacks beyond the 500/day cost cap, authenticated per-account attribution, WAF/bot mitigation, all other endpoints and full vulnerability/secret scanning.

No staging or live tests have been performed; no production changes.
