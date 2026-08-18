# Site-wide Hamburger Menu Plan

## Repo facts
- Repo: seanmillionaire/seanali-online (static HTML site, live at seanali.online, deployed on Vercel)
- Branch: main. Styles are fully inline in every HTML file (no shared CSS file for the topbar).
- Two nav families:
  1. `topbar` family (38 pages): `<nav class="topbar"> .wrap.nav .brand + .nav-links|.navlinks`. Mobile rule (max-width 940px): `.nav-links a:not(.nav-cta){display:none}` — links vanish, no hamburger.
  2. `social-topbar` family (6 pages: feed, story, what-are-money-blocks, quit-your-9-to-5, how-to-reprogram, best-ai-manifestation-app): social-nav links hidden under 760px, replaced only by bottom tabbar.

## Canonical site-wide menu (consolidated from existing navs)
Sections grouped for the drawer:
- START HERE (/start-here/)
- LESSONS (/blog/) — "Lessons Learned"
- PRODUCTS (/products/)
- RESOURCES (/resources/)
- AI FREEDOM SYSTEM (/system.html)
- STORY (/story.html)
- ABOUT (/about-sean-ali/)
- WORK WITH ME (/work-with-me/)
- YOUTUBE (https://www.youtube.com/@RealSeanAli) — external
- Join Now CTA (/join.html)

Keep the same links for all pages to guarantee site-wide consistency (user's explicit request).
On the homepage, "Home" is the brand mark already; drawer still lists sections.

## Implementation approach (keeps repo's zero-dependency, inline-CSS style)
1. Create a shared, self-contained hamburger snippet (CSS + HTML + JS) added to every page's inline <style> + <nav> markup + a small inline script before </body>.
   - No external files, no build step, matches existing inline-CSS architecture.
2. Markup additions to nav:
   - Hamburger button (3 bars, transforms to X when open)
   - Slide-down drawer panel with grouped section links + CTA
3. Behavior:
   - Toggle on click; close on link click, Escape, outside click; lock body scroll when open; trap focus basics; aria-expanded.
   - Opens on mobile (< 941px); visible inline on desktop too as a subtle "All pages" list? Decision: keep desktop horizontal links on pages that have them, and ADD the hamburger on desktop too as an "All pages" access point — user said desktop nav has too many pages that aren't linked properly, so desktop hamburger also helps.
   - Final: hamburger visible at all widths; on desktop the horizontal links remain, hamburger opens full drawer for deep pages.
4. Pages:
   - All 38 topbar pages: add burger + drawer + styles + script.
   - 6 social-topbar pages: add same burger pattern styled into social-topbar, grouped links.
   - Landing/funnel pages without a topbar (join, webinar, games hub, portals, etc.): leave alone (they are conversion pages with no header nav).
5. Verify with a local server: desktop + mobile width, open/close, link clicks, Escape.
6. Commit + push main, confirm Vercel auto-redeploy.
