# GAME STUDIO MASTER SOP — Games Directory

**Version:** 1.0 · **Status:** ACTIVE — 2026-10-20  
**Scope:** `/games/**` in the SeanAli and Angelique Ali repositories and reusable as the standard for future game projects.  
**Purpose:** Give a single human creative director and AI development agents a shared, enforceable system for making exceptionally enjoyable, polished, accessible browser games without repetitive, directionless revisions.

> **North star:** Build a game children choose to play again because the moment-to-moment experience is genuinely delightful, the world rewards exploration and creativity, and everything feels coherent and responsive. Do not confuse lots of code, locations, props, content, or successful tests with a great game.

## 0. Authority, interpretation, and safety

1. Read the repository-root `AGENTS.md` first when present. All existing Panamá Aventura invariants, architecture notes, testing obligations, and local-first/no-unapproved-release rules remain in force. This file **adds a game-studio quality layer**; it does not replace or weaken root instructions.
2. Read the latest explicit request, game-specific instructions, current sources, actual build state, and relevant documentation. A newer explicit user request controls creative scope; data integrity, child safety, and release authorization remain mandatory.
3. **Never push, merge, or deploy without explicit authorization from the owner.** Creating an unreviewed GitHub branch/commit is not a substitute for the local-first workflow; keep changes in the existing local checkout whenever available. Do not alter production just to get a preview.
4. **Integrated full-game work, not patches:** update the real project sources and assets coherently. Do not deliver an isolated demonstration, partial replacement, downloadable patch, or second incompatible system in place of the whole game. This does **not** mean rewrite every file: make the smallest *complete* change required across all dependent modules, and verify the integrated game.
5. Never claim the game is complete, tested, locally previewable to the user, or live unless the evidence exists. Distinguish *implemented*, *automated checks passed*, *visually/play-tested*, *release-ready*, and *production verified*.
6. If execution tools or the local checkout are inaccessible, do not pretend to have changed files or run tests. Supply an exact unverified implementation/diff or mark the task blocked; do not push risky changes merely to preview them.

## 1. The studio quality bar: play experience before feature volume

The design principles to learn from Minecraft, SimCity, GTA, and other enduring games are **agency, discoverability, systemic interactions, readable feedback, a distinct world, and emergent stories**. They are not a demand to copy copyrighted worlds, art, mechanics, characters, brands, or other protected content.

Every game must excel at these eight outcomes:

1. **Immediate delight** — movement, actions, camera, animation, sound, and reactions feel good right away.
2. **Clarity** — a new player knows how to start and can achieve something without the developer explaining.
3. **Freedom and purpose** — the player can choose meaningful activities, not just wander aimlessly.
4. **Coherent living world** — people, animals, vehicles, terrain, roads, buildings, and simulated behavior belong together.
5. **Visible consequences** — actions change a real shared state, including building, earning, collecting, helping, and saving.
6. **Distinctive presentation** — a consistent art/audio style, strong landmarks, readable scale, polished transitions, and authentic details.
7. **Reliability** — correct save/load, controls, collisions, performance, and mobile/desktop behavior.
8. **Reasons to return** — self-directed projects, meaningful discovery, variation, social or simulated relationships, or creative mastery without coercive engagement tactics.

**Quality > quantity.** A fantastic interactive neighborhood is worth more than ten bland, sprawling regions. A working vehicle with satisfying controls is worth more than five decorative vehicles. If a requested expansion risks spreading unfinished mechanics, establish one gold-standard vertical slice first.

## 2. The one-page game identity (required for new games; maintain for existing ones)

Keep a concise game design document in the game's directory (such as `GAME_DESIGN.md`) with:

- **Audience and needs:** target approximate age, reading level, devices, accessibility needs, and whether a parent may participate. Do not assume all kids are alike.
- **Player fantasy:** one concrete sentence — e.g. “I can explore a living Panama, help people, build places, and make the world my own.”
- **Three gameplay pillars:** e.g. Explore / Build / Connect. No vague pillars like “be amazing.”
- **Core loop:** action → immediate feedback → useful reward/result → new choice → repeat.
- **Creative constraints:** art/audio style, violence/safety boundaries, localization, performance targets, data handling, and legal/asset rights.
- **First-session promise:** what a player can *actually do* in 15 seconds, 3 minutes, and 15 minutes. Treat these as testable design targets, not universally guaranteed outcomes.
- **What is deliberately excluded:** protect focus; resist unrelated systems added solely because they are possible.
- **Current playable truth:** features verified working, work in progress, known limitations, and next gold-standard slice.

A task cannot be accepted as “better” simply because its art is richer or its implementation more complex. State what player behavior it should improve and what evidence will test that claim.

## 3. Design the fun loop before expanding the world

For every new feature, define:

**Player trigger → input/action → responsive feedback → outcome → persistent or immediate consequence → next choice.**

Example: Explore a barrio → notice a football match → play a short understandable challenge → earn a neighborhood badge or coins → use the reward to customize a place → see that change on return.

A feature must answer:

- Why would the player notice it?
- What are the exact controls?
- What enjoyable decision or skill does it involve?
- What happens when it succeeds, fails, or is abandoned?
- How does the game acknowledge the result?
- What breaks if the player reloads, switches modes, or walks away?

Avoid mechanics that create repetitive chores without interesting decisions. Use curiosity, experimentation, creativity, and gentle mastery rather than artificial pressure, deceptive timers, manipulative streaks, or endless grinding.

**No decorative promises:** every visible labeled action must actually function. If an interaction is not ready, remove the misleading affordance or honestly label it unavailable in a development build.

## 4. Vertical slices and scope prioritization

Before a giant expansion, prove one **gold-standard playable slice** with:

- One memorable complete location with clear visual identity and access routes.
- Character movement, camera, collisions, and mobile/desktop controls that feel reliable.
- At least one living NPC/animal/vehicle behavior where relevant.
- One complete activity and meaningful reward.
- One player-visible consequence and save/reload persistence.
- Polished UI, audio/visual feedback, and acceptable frame pacing.
- A child or new-player playtest and a captured list of usability problems.

Then reuse its systems to expand; don't reproduce all its logic in each district. Prioritize work in this order unless the explicit task requires otherwise:

1. Crashes, broken gameplay, blocked navigation, progress loss, child safety.
2. Core action feel: movement, camera, interaction, readable HUD.
3. Coherent world structure: distances, roads, geography, entrances, landmarks.
4. Working living systems and rewarding activities.
5. Large visible improvements to regional identity, environment, and animation.
6. Ambient detail and small decoration.

If development time is limited, improve an existing loop or area before adding another low-value feature.

## 5. World-building and geography

**World logic first; props last.** Canonical geography, terrain, biomes, travel corridors, roads, and settlement parcels establish where things may exist. Shared world rules determine where buildings, trees, NPCs, roads, wildlife, boats, vehicles, and player structures belong.

### Macro composition

- Give destinations enough separation that they read as distinct places; do not compress Colón, Monkey Island, Panama City, San Blas, and mountain regions into one contiguous-looking cluster.
- Balance authentic relationships with playable travel time. It is a stylized game, not a literal 1:1 GIS map.
- Use distinct silhouettes, landmarks, road approaches, vegetation, coastlines, building density, lighting, and ambient sound by region.
- Keep spacious landmarks and obvious walkable areas; don't fill every empty surface with assets.
- Compose traversal as journeys (approach → transition → arrival → activity), not abrupt teleports except when deliberately offered.

### Physical continuity

- Roads form a connected, navigable system with consistent widths, surface markings, smooth curves, plausible slopes, proper junctions, and clear right-of-way.
- Buildings and vegetation must not intrude on driveable lanes, major pathways, junctions, entrances, or visibility zones. Check bounding volumes and motion paths, not just object-center distances.
- Terrain, roads, docks, beaches, and water meet without floating geometry, hard seams, squared coastlines, deep clipping, or impassable transitions.
- Use terrain-aware and habitat-aware placement; respect slope, height, clearance, footprint, region, and water type.
- Flora should be varied in type, height, density, age, and patch shape, with open sightlines and natural gaps.
- Fix the **source generator** for repeated geometry errors instead of manually patching dozens of individual instances.

### Panamá Aventura authenticity contract

Apply the existing root-AGENTS invariants for Panama City, Gorgona access, San Blas as many small islands, canal/Gatún freshwater versus marine habitats, Colón, Volcán Barú/Boquete, and persisted builders. Major visible authenticity comes first: skyline/street logic, colorful diablo rojo and local traffic, barrio soccer, vendors, marine wildlife and archipelago, dramatic mountains, real-looking mixed Panamanian forest, culturally appropriate ambient audio. Place each feature *where it makes sense*; don't sprinkle generic Panama props everywhere.

Realism does **not** justify harming playability. Optimize for believability at the player's viewing distance and game speed.

## 6. Living-world simulation and NPCs

A living world has **state, intention, and consequences**. It should not just have random animations.

- NPCs have simple roles, destinations, schedules or goals and a valid path through the existing world.
- Cars stay on roads; boats in navigable water; animals in suitable habitats; builders on valid parcels; residents do not walk through buildings or water unless designed for it.
- Characters can pursue routine activities independently of player input when appropriate.
- Completed NPC builds and player builds persist across sessions and remain physically accessible.
- Store authoritative state centrally and simulate distant entities economically; full physics/AI is not required when off-screen.
- Avoid flicker, teleporting, looping into obstacles, jitter, identical synchronized crowds, and endless collisions.
- When NPCs interact with the player, give clear signals about what they want and what happened.

A small number of believable characters beats dozens of lifeless or visibly buggy ones.

## 7. Systems architecture: one source of truth

Before changing a system, trace its producers, consumers, save representation, UI, and tests. Do not add alternate wallets, inventories, road maps, geography transforms, collision rules, or save stores in parallel with existing ones.

Typical contracts:

- **Inventory:** collect → displayed amount → consume/trade/build → save → reload yields one consistent result.
- **Building:** eligible location + available materials → placement feedback → valid geometry → ownership/state saved → persistent rendering.
- **Travel:** change vehicle/mount/swim/fly state → correct controls/camera/physics → safe exit/re-entry → stable save.
- **Friends:** call/follow/send home → NPC action → consistent UI and persisted relationship.
- **Map:** uses true canonical player/world coordinates and routes; map marker, labels, and locations remain aligned after geography migrations.
- **Missions:** discover → perform action → award result once → persist completion; prevent reward duplication after refresh.

Use versioned save schemas and deterministic migrations. Test old stored fixtures before replacing or removing anything. Preserve working content even when reorganizing internals. Prefer modular ownership and reusable configuration over long ad hoc conditionals and repeated overrides.

## 8. Responsive controls, camera, and game feel

**The input system is part of the game design, not a final CSS cleanup.**

- Mobile touch zones are large, visually distinct, reachable by a child, and clear of iOS safe areas. Target 44×44 CSS px or larger for primary touch controls unless game-specific testing shows a better alternative.
- Keep Backpack, Map, Friends, Build, and other primary game actions predictable. Avoid duplicate or overlapping controls; the movement zone must not be obstructed by HUD or toasts.
- Keyboard controls remain functional on desktop. Handle focus changes, pointer release, orientation changes, paused state, and re-entry.
- Normalize speeds to elapsed time; avoid movement speed differing wildly by frame rate. Tune acceleration, deceleration, turning, jumping, driving, boats, and mounts through playtesting.
- Camera follows reliably without hiding the character behind tall trees/buildings, clipping through geometry, unexpectedly swinging, or losing the player on transitions.
- Auto-adjust camera distance or occluder visibility where necessary. Give the player an easy way to re-center.
- Feedback is immediate and meaningful: responsive motion, visible highlight, brief sound, animation, readable status, and reward effects. Avoid constant particle noise or screen shaking.
- Support pause, reduced motion, and mute. Avoid autoplaying surprising loud audio, especially on mobile.

## 9. Art direction, animation, lighting, and sound

Maintain a game-specific **art/style bible** that includes reference frames, silhouette standards, world scale, character proportions, materials, lighting, sky/weather, typography/icons, animation principles, sound palette, and examples of what does *not* fit.

- Optimize the strongest visible impression first: skyline, terrain silhouette, region separation, buildings, trees, water, characters, vehicles, and camera framing.
- Keep visual assets consistent in style, geometry complexity, color language, and scale. A deliberate stylized look is better than inconsistent pseudo-realism.
- Prefer authentic, licensed or original assets; do not scrape copyrighted artwork, music, textures, voices, or recognizable proprietary game material.
- Avoid repetitive prefab grids, unlit generic objects, obvious low-resolution stretched textures, and unnecessary detail hidden at normal camera distance.
- Give important world events animation and audio cues that make them legible from a distance.
- Use region-appropriate environmental audio sparingly; sound must support place and play, not overwhelm it. Expose mute/volume controls.
- Inspect daylight, nighttime, interiors, rain/weather, vehicles, and camera extremes where affected. Check luminance, contrast, and navigation after lighting changes.

Do not replace the renderer/engine simply to achieve polish until a documented technical limitation and a prototype prove the benefit outweighs integration and migration costs.

## 10. Kid-first design, universal comprehension, and child protection

- Design for *actual observed* children in the intended age range, not assumptions about children.
- Show understandable icons and objects first; keep instructions short. Essential actions must not require advanced reading.
- Provide forgiving recovery: undo or recover destructive moves, respawn safely, avoid irreversible punishment for experimentation, and clearly save progress.
- Keep learning implicit where possible: actions teach through immediate response and safe exploration.
- Make the game pleasant without manipulation: no coercive streaks, deceptive urgency, exploitative reward schedules, or pressure to purchase.
- Default to no open chat, unsolicited contact, public child profiles, or unnecessary collection of personal information. If future online social features are introduced, perform a dedicated age-appropriate safety, moderation, privacy, consent, and legal review *before release*.
- Avoid intrusive external links, ads, and purchase actions inside child-focused play.
- Make readable text, contrast, reduced motion, sound controls, assistive input, focus states, and a usable pause/exit path part of acceptance criteria.
- Keep violence, frightening imagery, and unsafe behavioral modeling appropriate to the game and audience.

### Localization

- Use language-independent gameplay wherever possible.
- Spanish-first for Panamá Aventura, with complete and accurate English support; no mixed-language buttons, missing translations, hardcoded untranslated warnings, or culturally awkward auto-translations.
- Keep UI strings in structured localization sources; test longer labels on small phones.
- Avoid requiring knowledge of Panama to understand the objective. Authenticity should invite discovery, not block comprehension.
- Preserve locale and user language preference across reloads.

## 11. Performance budgets and technical reliability

Measure rather than guess. Establish a per-game baseline on a representative lower-powered supported phone and desktop. Do not promise universal 60 FPS.

**Starting targets to calibrate with real devices:**

- Aim for stable ~30 FPS on supported lower-powered phones, and ~60 FPS where hardware allows, with no sustained stalls or unusable input latency.
- Track frame-time spikes and worst-case areas as well as averages. A game that averages 60 FPS but freezes while entering the city is not smooth.
- Track initial usable load time and bytes transferred on ordinary mobile connections; set a concrete budget from measured baseline and target devices.
- Bound active geometry, draw calls, textures, particles, lights, audio instances, physics work, event listeners, and NPC updates.
- Use level of detail, instancing, culling, batching, texture compression, asset reuse, distance-based simulation, and pooling where appropriate.
- Avoid unintended high-frequency allocations, stacked render loops, leaks after entering/exiting game modes, and save writes every frame.
- Handle background-tab suspension, low memory, WebGL loss/recovery when feasible, orientation changes, slow asset loading, and unsupported devices gracefully.

When performance degrades, profile first; fix high-cost roots rather than deleting major gameplay features without approval. Every performance change must preserve visual legibility and functional correctness.

## 12. Every task must begin with a concrete execution brief

Before editing, write a compact internal task brief:

1. **Player-facing objective:** what becomes more fun, functional, understandable, or beautiful?
2. **Current reality:** what does the integrated game do today? What is confirmed vs assumed?
3. **Affected systems:** exact modules, shared data, saves, art, input, collisions, and adjacent scenes.
4. **Preservation list:** working behaviors, assets, game states, and saved progress that must remain intact.
5. **Acceptance tests:** observable success conditions, including mobile/desktop gameplay and failure cases.
6. **Risk and rollback:** what could break; how to reverse locally and migrate data safely.

Do not ask for trivial micro-decisions that the existing identity, SOP, and references already resolve. Make reversible defaults and show the result. Escalate only choices involving fundamental game identity, major cost, irreversible content deletion, privacy/safety, or publishing authorization.

## 13. Mandatory local-first development loop

**Discover, don't assume, the active checkout or server state.** The repo-root instructions record a Mac workspace path and `tools/local-preview.sh` which defaults to `http://127.0.0.1:8001/games/`; verify the path and available port before use. Do not stop unrelated servers. A server bound to 127.0.0.1 on an agent machine is not automatically accessible from the user's phone.

Execution sequence:

**A. Inspect** — check Git status, current branch, uncommitted work, game route, relevant source modules, tests, and recent regressions. Protect unfinished work.

**B. Reproduce** — start the existing local preview (if available) and observe current behavior on target desktop/mobile viewports. Capture a before-state screenshot or precise baseline.

**C. Plan integration** — identify authoritative shared systems and dependencies. Define tests *before* making changes.

**D. Implement** — improve real project files with coherent modular changes. No temporary “second game,” dangling fake interactions, unnecessary rewrites, or one-off patches that bypass architecture.

**E. Play and visually inspect** — personally run or automate the actual player journey. Check the affected area AND the world around it. Refresh and retest after fixes.

**F. Regression-test** — run relevant existing suites plus new cases for the changed behavior. Address regressions, record unrelated existing failures separately, and never present a failing full suite as all-green.

**G. Review quality** — ask: Is it more enjoyable? Is it readable? Does it look intentional? Does it preserve everything? Is it performant enough? Would an unfamiliar child know what to do?

**H. Package locally** — provide preview instructions, exact change summary, observed screenshots/test evidence, and remaining risks. Commit only as an appropriate local checkpoint where supported.

**I. Release only with permission** — pushing, merging, or deploying requires explicit owner authorization. Production verification is a separate step after an approved release.

Continue local iterations until the complete affected gameplay passes its acceptance criteria. Do not call an isolated code patch “done.”

## 14. Verification matrix: code, behavior, visuals, users

A feature does not pass merely because source code compiles.

### Automated code and state tests

- Relevant syntax/import/build/lint checks.
- Deterministic tests for geometry generation, road graph connectivity, clearing and placement, save migration, inventory consistency, reward duplication, and state transitions.
- Lifecycle tests for mount/unmount/re-entry, listener cleanup, save/reload, and multiple exploration modes.
- Edge tests for empty inventory, failed build placement, obstructed destinations, language changes, and missing/slow assets.

### Mandatory playable journeys

- Open game → start → move/turn/camera → perform activity → reward → save → reload → resume.
- Open/close Backpack, Map, Friends, Build, settings, and any affected dialogs.
- Travel into and out of changed regions using real routes; walk/drive/boat/fly where applicable.
- Test edge boundaries, region transitions, crowded areas, collisions, underwater/coastline boundaries, and destination paths.
- Confirm actions produce expected state changes once and persist correctly.

### Visual/mobile checks

Test where accessible at ~320px, 375px, 390px, 430px, tablet ~768px, and a desktop viewport, in portrait and landscape where gameplay supports both. Inspect actual frames for clipped UI, illegible labels, hidden buttons, camera occlusion, misplaced objects, stretched textures, off-screen controls, bad lighting, unnatural terrain seams, and frame stutter. A CSS viewport emulator does not replace real-device touch and performance testing.

Capture before/after screenshots at key representative areas. Never mark visual QA passed based only on the source diff.

### Real-player usability

When feasible, observe age-appropriate testers with guardian consent. Give them the game without coaching. Record whether they can begin, control their character, understand available actions, experience a satisfying result, recover from confusion, and choose to continue. Note spontaneous enjoyment and frustration. Protect children's privacy; don't publish identifiable recordings without appropriate consent.

Run lightweight playtests after each significant experience milestone. Treat opinions and metrics as evidence, not proof of universal appeal.

## 15. Quality gates and Definition of Done

**A change is DONE only when all relevant items are true:**

- [ ] Clear player benefit and acceptance criteria established.
- [ ] Real in-repository systems integrated; no competing source of truth.
- [ ] Feature fully operates in the playable game, including negative paths.
- [ ] Existing working gameplay and player progress are preserved.
- [ ] World geometry, roads, terrain, NPCs, and collisions remain coherent.
- [ ] Art/audio/UI are consistent and have been visually inspected.
- [ ] Controls and HUD work at supported desktop and phone sizes.
- [ ] Relevant automated tests pass; new regression tests added when warranted.
- [ ] Measured performance is acceptable for supported devices or limitation disclosed.
- [ ] Save migration, reload, localization, and accessibility checked when affected.
- [ ] No unapproved push/merge/deployment occurred.
- [ ] Exact verification evidence and remaining known problems reported honestly.

**Release-ready** additionally requires resolved blockers, reviewed diffs, appropriate backups/rollback, adequate end-to-end regression coverage, real-device smoke tests on representative targets, and explicit approval for deployment.

**Production verified** additionally requires proof that the correct revision is actually live, a fresh reload, and testing of the released player journey. A pushed commit or HTTP 200 alone is not live gameplay verification.

If checks cannot run, report *UNVERIFIED* or *BLOCKED* rather than checking them off.

## 16. Standard completion report (required every substantial task)

Use this concise format:

**Outcome:** One-sentence statement of the player-facing improvement.  
**Changed:** Exact modules, systems, and relevant assets.  
**Preserved:** Key features, world state, and save compatibility.  
**Tested:** Automated suites with pass/fail status; actual gameplay paths; phone/desktop viewports; visual comparisons; performance measurements where relevant.  
**Not verified:** Specific tests/devices/actions unavailable or unresolved.  
**Release status:** Local only / staged / explicitly approved and deployed / production visually verified; include revision and links only if real.  
**Next highest-leverage fix:** One concrete item, chosen from observed remaining weaknesses.

Never replace this evidence with “done,” “fixed,” “everything works,” or a long undifferentiated list of code edits.

## 17. Improving the process without endless back-and-forth

After significant user corrections, ask which systemic failure caused the rework: unclear acceptance criteria, uninspected architecture, weak visual references, missing gameplay test, geometry generator error, poor UI hierarchy, or skipped real-device checks. Fix the *process or shared system* rather than forcing the user to report the same problem repeatedly.

Keep a small **KNOWN_ISSUES / DESIGN_DECISIONS** record: root cause, proof, chosen rule, related tests, and date. Convert a bug corrected twice into a durable automated regression test when feasible. Keep lessons short and factual; don't allow documentation bloat to eclipse actual game development.

For every new feature, end with this final player-experience test:

> **If the player never knew how much code we wrote, would this make them enjoy the game more?**

If not, reconsider the feature, improve its interaction quality, or remove it from the priority queue.

---

## 18. Panamá Aventura repository orientation (verified from GitHub, 2026-10-20)

Existing files include:

- `games/index.html` — currently serves the Spanish-first game and web metadata.
- `games/adventure/app.js` — entry/app state and screen transitions.
- `games/adventure/explore.js` — integrated world exploration, many subsystem imports, input, camera, and gameplay coordination.
- `games/adventure/explore-state.js` — exploration/world state, travel and inventory dependencies.
- `games/adventure/geography.js` — canonical world bounds, destinations, geography transforms, and layout versioning. Current source includes `GEOGRAPHY_VERSION = 3` and a note that distances are compressed for play.
- `tools/local-preview.sh` — serves the checkout locally (default port 8001).
- `tests/` — includes world layout, road, persistence, wildlife, and browser checks referenced by root `AGENTS.md`.

**Do not assume this orientation remains current:** re-inspect files, check Git status, and verify actual runtime state before implementation. Keep the repo-root Panama-specific contracts as the source of truth for named regions, saved builders, wildlife habitats, road access, and geography migrations.
