# Panamá Aventura inventory repair

## Root cause and model

Ground banana IDs (`collected`, kind `fruit`) previously supplied the building bag;
tree harvests and puzzle/realm rewards supplied `food.banana`. Crafting spent only
the former, while eating and market trading spent only the latter. Harvesting and
eating did not refresh the HUD. Pickup notifications reported lifetime discovery
counts even after materials had been spent.

`food.banana` now holds the one spendable banana stock. Ground pickups, trees,
story rewards and realm baskets credit it; eating, crafting and market trades
all debit it. `foodTotal.banana` tracks acquired units for collection progress.
The bag shows available / collected, the food screen shows available stock,
and pickup messages show the remaining bag balance. Tree harvests, giant coconut
harvests, eating, crafting, trades, rewards and pickups refresh the HUD.

`inventoryVersion: 1` migrates old saves once: existing food plus unique ground
bananas minus bananas already spent on crafting. Never add harvest history back
into stock: those units may already have been eaten or traded. Migration and
reload retain IDs, tree depletion and crafting debits. New food supports 9,999
units rather than silently truncating at the old 99-unit load limit.

Old saves did not record all consumed bananas. The lifetime counter therefore
starts from recoverable stock plus recorded crafting use. It cannot reconstruct
all historical eating/trading. Collection goals include newly harvested/rewarded
bananas and do not decrease when stock is spent. Meal goals still count meals.

## Other systems traced

- Shells, gems, glow and reef treasure: unique pickup IDs are acquisition history;
  `craft.spent` is subtracted for available stock. Crafting validates the complete
  recipe and location before spending, and refuses repeated builds.
- Money bags: 24 unique IDs, separate from coin balance. Crafting consumes bag
  materials through `craft.spent.moneyBag`; the city discovery counter stays a
  lifetime count. The wallet awards each bag's five coins once.
- Shop: spends wallet coins, not bag materials. Re-equipping an owned hat does
  not charge again. Wallet reconstruction deduplicates rewards and purchases.
- Realm pearls, reef cleanup objects, sea chest and sky objects use their own
  unique quest history, separate from craftable sea treasure.
- Saving: existing `isla-adventure-v1` localStorage key and outer save version
  remain compatible. State normalization runs the inventory migration; module
  versions advance to avoid loading old spending logic with new state.

## Verification

Run `node tests/island-inventory.cjs` (no external packages): pickups, exhausted
harvests, duplicate IDs/rewards, wrong-site and repeated builds, multi-resource
spending, eating/trade debits, food rewards, collection goals, old-save variants,
repeated reloads, no resurrection of consumed stock, shells/gems/glow/sea treasure,
money bags and shop purchases. Passed locally with Node 24.19.0.

Run the preview server, install Playwright, then run
`BASE_URL=http://127.0.0.1:8765 node tests/island-inventory-browser.cjs`.
Optional `CHROME_PATH` selects a local Chrome executable; `SCREENSHOT_DIR` saves
screenshots. This uses the real Three.js scene and controls with isolated test
state: tree pickup updates HUD/food/bag, eating updates HUD, market trade updates
HUD and saved reload preserves stock. Screenshots and bag bounds cover 320×568,
375×667, 390×844, 430×844, 768×1024 and 1440×900. Local Chrome test passed with
software WebGL; this is not a physical-device playtest.

Wallet regression test and all adventure JavaScript syntax checks passed.
Three older DOM suites could not start because `jsdom` is unavailable.
`island-expanded-world.cjs` fails its `isletHeight(center) > 2` assertion on both
the original main source and the repaired source; this is a pre-existing world
expectation, not a passed check. No claim is made that the full legacy suite passes.
