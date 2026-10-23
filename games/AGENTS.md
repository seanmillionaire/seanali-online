# Games Agent Instructions — Additive Directory Contract

**Scope:** `games/**` (especially `games/panama/` and `games/adventure/`).  
**Added:** 2026-10-23 · **Purpose:** Make the studio's new game-purpose and selective-interaction design requirements visible to agents working inside this folder. This file supplements—never replaces—the root `../AGENTS.md`, existing `GAME_RULES.md`, and `game-standards.md`.

## Mandatory reading order

1. `../AGENTS.md` — highest-priority repository rules including Panama geography, inventory, persistence, QA, and **local-first / no push, merge, or deployment without explicit owner approval**.
2. `GAME_RULES.md` and `game-standards.md` — existing bilingual, age-appropriate, UX and progression requirements for games.
3. `GAME_STUDIO_SOP_ADDENDUM_2026-10-23.md` — **the new additions**: educational living-world systems, work and earning, respect, country wellbeing, four game inspirations, and selective hyper-detail.
4. [Game Studio Master SOP (Drive)](https://drive.google.com/file/d/1l00IkE4M5TDImwuPB8ix5DERxg45QIxh/view) — existing studio-wide 2026-10-20 SOP. This new addendum is not a replacement for it.
5. Actual latest game source, current local uncommitted state and recent tests. The code—not this wish list—is the source of truth about **what is already live**.

If an instruction conflicts, preserve user-requested constraints, prior working gameplay, children's privacy, data integrity, and explicit release authorization. Do **not** redesign existing games because these documents changed.

## Panamá Aventura's purpose

Build an authentic, free-to-explore, Panama-inspired *everyday life* simulation in which children discover how real systems operate by playing. The world must be enjoyable without forced quizzes or a full story mode. Life wisdom, voluntary helpfulness, financial literacy, recycling, local food, environment, community and consequences are the design focus. Spectacular graphics may improve over time, but never displace purposeful gameplay.

**Inspiration translation:**
- **SimCity:** interconnected autonomous civic/economic systems.
- **Minecraft:** exploration, building, materials and persistent player agency.
- **Grand Theft Auto:** convincing freedom, geography, driving and reactive street life, **not** criminal content.
- **Scarface: The World Is Yours:** `SELECTIVE HYPER-DETAIL`—certain player actions deserve exceptional visual, physical and sonic response for memorability. **Never translate the game's adult gore or gun violence into a child-facing experience.**

**Nonnegotiable interaction pattern:** autonomous system → voluntary player contribution → visible, persistent world consequence. Optimize animation detail for these moments while respecting mobile performance, accessibility and child-safe content.

## Example high-value interactions

- Recycling: sort a bottle → bin fills → route truck empties it → facility processes materials → environment visibly benefits.
- Local cooking: collect/grow ingredients → prepare and cook with meaningful animation → serve → stock, wallet and NPC reactions update.
- Construction: collect/deliver materials → show staged building work → completed, enterable, saved structure.
- Work: see a market/delivery need and agreed payment → physically fulfill it → goods/stock update → one verified payout → reload safely.
- Gardening: plant → water → grow → harvest → sell/cook/compost.

Do not make every routine action slow or cinematic; provide fast-repeat/skip and accessibility alternatives. Do not fake outcomes or stage nonfunctional buttons.

## Core planned progression and systems

**Proposed first batch (NOT already installed just because specified here):**

1. **Panama City-first start / progressive destination unlocks:** city must be a satisfying full experience; existing saves handled carefully; achievement-based unlocking is fair and understandable.
2. **Work & Earn:** reuse `explore-state.js` wallet and existing inventory/vendor/transport mechanisms, with repeatable job contracts and safe payouts.
3. **Autonomous recycling/public works:** start one end-to-end city route, then expand appropriately across mainland neighborhoods; island handling differs.
4. **Respect & NPC reactions:** build trust for helpful behavior; local, reversible consequences for harmful behavior; **no penalty for idleness or time away**.
5. **Panama Wellbeing:** a separate, persistent measure of community/environmental improvements; baseline services continue without player.

**Later, after proof of play:** whole-food growth → market → cooking → compost cycle; savings, shops, business income, enterable houses, earned mansions/vehicles; separate wealth/respect/impact; optional story journey and `Panama Legend` milestone; privacy-protected online leaderboards and parent dashboards; parent-approved paid avatar customization/upgrades; adult-only affiliate promotion.

Keep game-earned coins and paid real-money products separate. Wealth never proves character or respect. Do not manipulate children into overplaying or purchases.

## Hard requirements for future implementations

- Start from the **complete existing game**, not an isolated recreated demo; preserve all prior land/roads/canal, buildings, NPCs, controls, quests, player inventory, existing coins, saves, and accessible activities.
- Use one authoritative store per system and versioned migrations; test backwards compatibility and anti-duplicate payouts.
- Simulate distant regions cheaply; render detail locally; use believable world routes, schedules and regional culture.
- Spanish-first with complete English support; readable child-first touch controls; low-friction discovery and sensory feedback.
- Any leaderboard/account involving children requires age-appropriate privacy, consent and anti-cheat architecture *before launch*. No public real names, contact details, exact location, unmoderated chat, or exact-wallet exposure by default.
- Define a complete vertical-slice player journey; verify the real rendered phone and desktop game plus automated cases; distinguish plans from verified features.
- **No unattended rollout:** changing this instruction file is not permission to modify the game or push to production. Local-first, explicit release authorization and evidence-based completion from root `AGENTS.md` remain binding.

## Check before reporting success

Can a new child notice the activity, perform it without coaching, enjoy the feedback, see a useful world response, make a meaningful next choice, and recover after restarting the game? Did the feature preserve prior systems and meet accessibility/performance targets? What was actually tested versus merely planned?
