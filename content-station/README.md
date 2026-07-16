# Sean's Content Printer

The Revenue OS content printer turns one strong angle into a full content batch.

## Content Rule

- Each lane needs its own vocabulary.
- No Neville template pasted onto unrelated lanes.
- The promise earns the view.

## Content Lanes

- Neville Wealth
- Neville Manifestation
- Wallace Wattles
- AI Business
- Panama Untold

## Workflow

1. Print an angle. The app tests candidates first and only shows the strongest pass.
2. Approve the winner or remix.
3. Print the full asset batch:
   - YouTube slideshow HTML
   - YT shorts
   - IG captions
   - Vlog plan
   - Email broadcast
   - Email follow up

Drafts are saved in the browser with local storage. The current version does not call an AI model or external API.

## Content War Room

Before an idea appears, the app runs it through six validators:

- MrBeast: would millions care?
- Hormozi: does this create demand?
- Dan: does this build authority?
- Tai: is this attached to an existing market?
- Sean: would this still feel true in 5 years?
- Market: would a stranger search this today?

Each validator scores 0-10.
Publish line: 42/60.

Sean preference must also pass:

- Number
- Clickbait
- Outcome
- Timeframe

The graph shows pass/fail before assets are printed.

## Revenue Content Brain

Editable source docs live in:

`content-station/brain/`

Installed Google Drive source docs:

- `brain/source-index.md`
- `brain/sean-story.md`

The browser app also has a baked `SEAN_CONTENT_BRAIN` constant in `app.js`.

That internal brain currently drives:

- title requirements
- War Room validators
- publish threshold
- search/viral/trend/human terms
- banned language checks
- slideshow slide count
- asset quality expectations
- offer routing reference

When the brain docs change, update the baked constant so the app runtime matches the source docs.

## Open Locally

Open `index.html` in a browser.
