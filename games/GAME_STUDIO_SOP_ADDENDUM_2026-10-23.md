# Game Studio SOP — Purpose, Living Systems & Selective Hyper-Detail (Addendum)

**Added:** 2026-10-23 · **Status:** design contract / planned features, not proof of implementation  
**Scope:** Panamá Aventura in `/games/panama/` and `/games/adventure/`. Reuse broadly applicable experience-design principles in other games; do not force Panama-specific mechanics on unrelated games.  
**Additive only:** This supplements the active [Game Studio Master SOP](https://drive.google.com/file/d/1l00IkE4M5TDImwuPB8ix5DERxg45QIxh/view), repository-root `AGENTS.md`, `games/GAME_RULES.md`, and `games/game-standards.md`. Preserve every existing constraint, working feature, save, asset, performance rule, and explicit release restriction. This is NOT authorization to redesign, remake, implement every proposed feature, or deploy the game.

## A. North star: a living Panama that teaches everyday wisdom

**Panamá Aventura is an authentic Panama-inspired open-world life game where children learn by experiencing the consequences of useful, real-world actions.** Prioritize purpose, playability, and actionable learning over graphics alone, asset counts, quests, or time spent. The world should reward voluntary curiosity and responsible participation. It should be delightful even without a quest selected.

Teach through *simulation and visible cause and effect*, not a forced worksheet, lecture, or quiz. Appropriate themes include work, saving, thoughtful spending, entrepreneurship, food sourcing/preparation, recycling, resource cycles, public services, environmental care, cooperation, and relationships. Progress within a game does not prove real-world skill transfer; validate educational claims with actual playtests and parent feedback.

**Player-facing purpose:** Explore Panama; find work that genuinely helps a resident or system; earn and manage coins; create/build/own; gain trust through helpful conduct; improve community conditions; unlock new regions; pursue the optional `Panama Legend` achievement.

## B. Inspiration translated into original, child-safe rules

- **SimCity — living systems:** autonomous residents and services; roads, food supply, waste, construction, transport, and economy interconnect; one choice has multiple intelligible consequences.
- **Minecraft — agency and persistence:** collecting, building, crafting, experimenting, owning, and returning to changes that remain.
- **Grand Theft Auto — freedom and responsiveness:** a convincing continuous world with places to visit, vehicles to operate, and NPCs who respond to the player. Borrow world-design principles, not criminal behavior or copyrighted assets.
- **Scarface: The World Is Yours — *selective hyper-detail*:** memorable physical/visual/audio reactions at the moment an action matters. **DO NOT copy violent, graphic, gory, dismemberment, firearm, or frightening content.** Translate the memorable response into age-appropriate moments of building, cooking, recycling, planting, delivering, and helping.
- **Panamá Aventura's original synthesis:** world systems + creative ownership + explorable daily life + unusually satisfying, detailed, nonviolent interactions + practical wisdom.

### Selective hyper-detail acceptance standard

Invest animation and rendering work in *high-value player actions*, not expensive detail across every object. An important action should have: (1) obvious affordance; (2) tactile control and timely feedback; (3) believable multi-stage physical animation when appropriate; (4) meaningful, context-specific sound; (5) visible world-state change; (6) a saved/recoverable outcome; (7) another natural next choice.

Examples, **not mandatory simultaneous implementation**:

1. **Recycling:** pick up a bottle → place it in the correctly labeled bin → bin visibly fills → scheduled truck arrives and lifts/empties bin → material enters a sorting center → recovered resources contribute to a clean neighborhood.
2. **Cooking:** gather ingredients → rinse/chop/prepare safely in game → ingredients appear in pot/pan → steam and food appearance change → plate/serve → customer receives meal and stock/coins update.
3. **Construction:** deliver materials → site becomes active → foundations, framing, walls, windows and roof appear in logical stages → completed building becomes accessible and persists.
4. **Gardening:** plant → water → growth stages → harvestable produce → sell/cook/compost → useful new cycle.
5. **Work payout:** physical delivery/hand-off → recipient acknowledges work → inventory and recipient stock change → coins credited once → optional respect/impact award when justified.

Do not add long unskippable animations to routine actions. Allow fast-repeat or skip after discovery. Use distance-based animation/LOD and asset reuse, preserve mobile frame pacing, support reduced motion and sound settings, and test both first-time delight and repeated use.

## C. Three layers for every meaningful real-life system

1. **Autonomous world:** a functioning department, business, resident, or process continues without the player. Use credible schedules, destinations, resource inputs/outputs, paths, and background simulation.
2. **Voluntary participation:** the child notices a simple opportunity and can choose to help, experiment, or ignore it without being punished for idleness.
3. **Observable consequence:** the world visibly changes, a person responds, items/coins transfer, or a persistent project advances. An action must alter authoritative state, not display a detached fake reward.

One source of truth per wallet, inventory, job completion, NPC stock, region lock, profile, respect, and wellbeing. Avoid duplicate state stores and repeat-click reward exploits. Extend existing economy, inventory, roads, character, and save code instead of creating new incompatible systems.

## D. Core gameplay loop and the first playable vertical slice

**Explore → Notice a need → Help / Work → Earn → Save or spend → Build / improve → Gain justified respect → Improve Panama → Unlock → Explore again.**

Test one self-contained **Panama City** slice before rolling it across the country:

- A new player starts and can enjoy the city; the rest of the mainland remains visible/aspirational but unlocks through understandable, age-appropriate progress (existing users and saves must be migrated/handled thoughtfully).
- A market stall visibly needs supplies; the player delivers produce; it enters the stall inventory; they receive an agreed, visible coin payment; their wallet saves across reload.
- A garbage/recycling route operates independently; the player optionally sorts and places material; a vehicle follows a real road; the neighborhood reflects the outcome.
- Trust/respect increases for genuinely helpful behavior; a local resident acknowledges it; downtime and exploration cause no respect loss.
- An unobtrusive, readable city wellbeing/progress summary shows what improved and one optional next step.
- Retest with an unfamiliar child: Was it noticed, understood, satisfying, voluntary, and replayed? Never assume stickiness from leaderboards or spectacle alone.

## E. Autonomous public works: waste, recycling, compost

The intended mainland municipal waste cycle includes household bins, distinct recyclables and residual waste, collection vehicles, schedules/routes, workers, processing/sorting and disposal facilities, and organic compost where sensible. Different districts can have believable service scales; do not blindly stamp the same truck everywhere or send vehicles through impassable terrain. Island systems can be locally appropriate and do not need the continental municipal fleet.

Player can learn household sorting as a natural habit, help with collection/delivery, and observe where materials go. Real sorting rules vary by location: use clearly labeled in-game materials and do not teach every plastic/contaminated item is automatically recyclable. Build a complete working city route before extending the simulation mainland-wide.

## F. Local food and connected resource cycle

Prefer recognizable Panamanian foods, fruits, vegetables, farms, fish, markets, cooking and culturally accurate practices—not fast-food-centered progression. **Grow → harvest → transport/sell → cook/serve → consume → compost appropriate scraps → grow again.** Simulate authentic inputs, outputs, purchase/sale, storage, and sensible spoilage/availability where fun. Teach food variety and preparation, not shame or simplistic moral labels for individual foods. Reuse current `home-activities.js`, `panama-state.js`, `panama-life.js`, inventory and vendors; gradually replace unexplained unlimited restocks with understandable supply pathways.

## G. Work & Earn; wealth, respect, Panama wellbeing

**Work & Earn:** discover needs in the world—market deliveries, cooking, construction supplies, responsible recycling, community upkeep and later regional work. Show agreed pay before accepting. A completed task triggers a verified transfer of goods/services and an in-game coin payout, with idempotent completion IDs and a repeatable earnings ledger. No endless tapping for money, duplicate payout on refresh, or fake stock movement. Keep one spendable in-game wallet separate from real-money purchases.

**Wealth:** earn, save, spend, invest in homes/vehicles/businesses, and learn operating costs versus profits. Wealth is not moral worth and should not be the only winning score.

**Respect:** visible, understandable social trust earned by helpful conduct and kept distinct from money and playtime. Relevant harmful actions may cause proportional, local and repairable trust loss (litter → clean it, blocked road → honk/clear traffic, abandoned accepted work → restore reliability). Merely doing nothing, exploring, taking breaks, or not logging in has **no** penalty. NPCs may greet, trust, invite, recognize or occasionally gift helpful players; never bully, harass, deliberately blockade or stigmatize lower-scoring children.

**Panama Wellbeing / Impact:** a distinct simulated state for cleanliness, public services, nature, food access, infrastructure and community. Improvements have believable visible effects. NPC departments maintain a baseline; children are contributors, not solely responsible for keeping the country alive.

**Progression:** start within Panama City as a rich, genuinely complete play area; unlock Gorgona, the Canal/Colón, mountain regions and islands through tested achievement thresholds, avoiding long grind and preserving existing saved access. Story mode may later organize the same systems into an optional arc culminating in a `Panama Legend` milestone while free exploration remains rewarding.

## H. Authentic aspirational rewards, optional spending, and social features

Give children meaningful, usable in-game long-term goals—houses, mansions, vehicles, businesses, accessible interiors—earned through normal play. Show lifestyle rewards early as aspirations, never as bait for manipulative monetization. Current default playable character is Angelique; proposed adult-approved premium personalization permits a child to create a stylized in-game avatar. Do not require child photos or real names. Additional property/vehicle cosmetics or expansion purchases are hypotheses to validate with parents, not shipped entitlements. Free core education, base progression, and meaningful earning must remain accessible.

**Social/leaderboards are future work, not currently implemented:** verify scores server-side; allow parent-approved optional participation, privacy-protected display names, and public impact/respect *tiers* rather than children's exact wallet, location or identity; also offer weekly, private friends/family and personal-best views. No unrestricted messaging. Collaboration/country-wide achievements can be more important than competition. No purchases of public rank or respect. A private parent progress view may describe in-game practice, never promise proven life outcomes.

**Affiliate model is a future adult-facing business workflow:** optional approved adult partners share the free game, with attribution to parent-purchased upgrades after verified checkout/refund checks. Do not add affiliate tracking targeted at children or claim commission mechanics work before tested. Any actual purchase/attribution implementation requires age/privacy/legal review.

## I. Prioritized implementation — no premature story remake

1. Panama City onboarding and save-safe region unlocking, with existing free-play journeys respected.
2. One repeatable Work & Earn market/delivery loop using the current wallet/inventory.
3. One autonomous city waste/recycling collection route and visible household interaction; expand to mainland only after successful test.
4. Contextual Respect and NPC acknowledgment/recovery.
5. Panama Wellbeing and a lightweight, readable persistent progress view.

Next: connect food/agriculture/cooking/compost; add player-owned shops; deepen aspirational property/vehicle rewards; layer story over **existing** systems; then privacy-safe online features and adult-approved upgrades. Priorities are plans, not instructions to install everything in one batch.

## J. Definition of Done additions for these systems

For each relevant feature, verify:

- An independent system visibly acts without player input; a child can choose to participate; a real state change is observable.
- Work is useful, correctly paid, repeatable where intended, abuse-resistant, persists after reload, and debits real inventory/stock.
- Respect differs from wealth, does not decay for inactivity, and NPC feedback reflects behavior rather than arbitrary cruelty.
- Road-following vehicles, collisions, animal habitats, terrain clearance, and nearby world features remain coherent.
- Region locks and premium cosmetics do not strand old saves or gate essential educational content.
- Detailed animations enhance comprehension and retain acceptable lower-powered mobile performance; reduced-motion/sound paths work.
- Adult purchases and children's social features are designed safely and not mistaken for live functionality.
- Existing game systems are preserved, Spanish/English both work, and game scenarios are actually play-tested on phone/desktop.
- Findings distinguish **planned**, **implemented**, **tested**, and **deployed**. Root `AGENTS.md` local-first/no-release-without-approval rules still apply.

**Operational rule:** make only the scoped additions requested in a development task. Never interpret this SOP as blanket authorization for a new game build, broad rewrite, new features, publication, or monetization launch.
