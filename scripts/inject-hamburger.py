#!/usr/bin/env python3
"""Inject a site-wide consistent hamburger menu into the Sean Ali online site.

Two nav families are supported:
  1. topbar     — the standard SEAN ALI brand header used by ~38 pages
  2. social-topbar — the social-style header used by 6 feed/story pages

Changes per page:
  - Add a hamburger button inside the nav, next to the brand
  - Add a slide-down drawer with a canonical, site-wide section list
  - Append shared menu CSS to the page's inline <style>
  - Append shared menu JS (toggle, close, escape, body-lock) before </body>

Usage:
  python3 scripts/inject-hamburger.py            # dry-run style info
  python3 scripts/inject-hamburger.py --commit   # actually write changes
"""
import re
import sys
import os

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COMMIT = "--commit" in sys.argv

# ---------------------------------------------------------------------------
# Canonical site-wide menu: one list for every page so the nav is consistent
# everywhere. Sections grouped exactly like the existing header/footer IA.
# ---------------------------------------------------------------------------
MENU = [
    ("GET STARTED", [
        ("/start-here/", "Start Here"),
        ("/blog/", "Lessons Learned"),
        ("/resources/", "Resources"),
    ]),
    ("BUILD & EARN", [
        ("/system.html", "AI Freedom System"),
        ("/products/", "Products"),
        ("/work-with-me/", "Work With Me"),
    ]),
    ("SEAN ALI", [
        ("/story.html", "My Story"),
        ("/about-sean-ali/", "About Sean"),
        ("https://www.youtube.com/@RealSeanAli", "YouTube"),
        ("https://panamauntold.com", "Panama Untold"),
    ]),
    ("FREE TOOLS", [
        ("/prompts.html", "Claude27 Prompt Guide"),
        ("https://hypnoticmeditations.ai", "Hypnotic Meditations"),
        ("/games/", "Education Games"),
    ]),
]
CTA = ("/join.html", "Join Now")

def menu_drawer_html():
    groups = []
    for heading, links in MENU:
        items = "".join(
            f'<a class="sa-menu-item" href="{href}">{label}</a>'
            for href, label in links
        )
        groups.append(f'<div class="sa-menu-group"><span class="sa-menu-heading">{heading}</span>{items}</div>')
    return f'''
<!-- Hamburger menu drawer (site-wide) -->
<div class="sa-menu" id="saMenu" aria-hidden="true">
  <div class="sa-menu-inner">
    <div class="sa-menu-head"><span class="sa-menu-head-label">Explore the site</span><button type="button" class="sa-menu-close" id="saMenuClose" aria-label="Close menu">✕</button></div>
    <div class="sa-menu-body">{''.join(groups)}<a class="sa-menu-cta" href="{CTA[0]}">{CTA[1]}</a></div>
  </div>
</div>'''

def burger_button():
    return '''<button type="button" class="sa-burger" id="saBurger" aria-label="Open menu" aria-expanded="false" aria-controls="saMenu"><span class="sa-burger-bar"></span><span class="sa-burger-bar"></span><span class="sa-burger-bar"></span></button>'''

# Shared CSS injected once per page (matches the site's bold, direct style).
MENU_CSS = """
/* ---- Site-wide hamburger menu (Sean Ali) ---- */
.sa-burger{display:none;flex-direction:column;justify-content:center;gap:5px;width:46px;height:46px;padding:0;border:2px solid #111;border-radius:9px;background:#fff;cursor:pointer;position:relative;z-index:60;flex-shrink:0}
.sa-burger-bar{display:block;width:20px;height:2px;margin:0 auto;background:#111;border-radius:2px;transition:transform .25s ease,opacity .2s ease}
.sa-burger[aria-expanded="true"] .sa-burger-bar:nth-child(1){transform:translateY(7px) rotate(45deg)}
.sa-burger[aria-expanded="true"] .sa-burger-bar:nth-child(2){opacity:0}
.sa-burger[aria-expanded="true"] .sa-burger-bar:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
.sa-menu{position:fixed;inset:0;z-index:70;background:rgba(9,9,9,.55);backdrop-filter:blur(4px);opacity:0;pointer-events:none;transition:opacity .25s ease;overflow-y:auto}
.sa-menu.open{opacity:1;pointer-events:auto}
.sa-menu-inner{max-width:560px;width:min(92%,560px);margin:0 auto;padding:0 0 60px;background:#fff;min-height:100%;box-shadow:0 30px 70px rgba(0,0,0,.35);transform:translateY(-18px);transition:transform .28s cubic-bezier(.23,1,.32,1)}
.sa-menu.open .sa-menu-inner{transform:none}
.sa-menu-head{position:sticky;top:0;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:18px 24px;border-bottom:1px solid #eaeaea;background:rgba(255,255,255,.97);backdrop-filter:blur(8px)}
.sa-menu-head-label{font-size:12px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:#595959}
.sa-menu-close{width:40px;height:40px;border:2px solid #111;border-radius:9px;background:#fff;color:#111;font-size:16px;font-weight:900;cursor:pointer}
.sa-menu-body{padding:10px 24px 0}
.sa-menu-group{padding:18px 0 2px}
.sa-menu-heading{display:block;margin:0 0 8px;font-size:11px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:#e11d24}
.sa-menu-item{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:15px 6px;border-bottom:1px solid #f0eeea;font-size:17px;font-weight:800;color:#151515;text-decoration:none;transition:padding .15s ease,color .15s ease}
.sa-menu-item:hover{padding-left:14px;color:#e11d24}
.sa-menu-item:after{content:"\\2192";color:#d7d7d7;font-size:15px}
.sa-menu-cta{display:block;margin:22px 6px 0;padding:18px;text-align:center;border-radius:9px;background:linear-gradient(135deg,#ff542e,#ff7a1a);color:#fff;font-size:16px;font-weight:900;text-transform:uppercase;text-decoration:none;box-shadow:0 10px 24px rgba(255,84,46,.28)}
body.sa-menu-open{overflow:hidden}
@media(min-width:941px){.sa-burger{display:inline-flex}.nav-links,.navlinks{gap:16px}.nav-links a,.navlinks a{font-size:12px}}
@media(max-width:940px){.sa-burger{display:inline-flex}.nav-links a:not(.nav-cta):not(.nav-links-keep):nth-child(1){display:none}.nav-links a:not(.nav-cta):not(.nav-links-keep):nth-child(2){display:none}.nav-links a:not(.nav-cta):not(.nav-links-keep):nth-child(3){display:none}.nav-links a:not(.nav-cta):not(.nav-links-keep):nth-child(4){display:none}.nav-links a:not(.nav-cta):not(.nav-links-keep):nth-child(5){display:none}.nav-links a:not(.nav-cta):not(.nav-links-keep):nth-child(6){display:none}}
@media(max-width:560px){.sa-menu-item{font-size:16px}}
"""

MENU_JS = """
<script>
(function(){
  var burger=document.getElementById("saBurger");
  var menu=document.getElementById("saMenu");
  var close=document.getElementById("saMenuClose");
  if(!burger||!menu)return;
  function openMenu(){menu.classList.add("open");menu.setAttribute("aria-hidden","false");burger.setAttribute("aria-expanded","true");document.body.classList.add("sa-menu-open");}
  function closeMenu(){menu.classList.remove("open");menu.setAttribute("aria-hidden","true");burger.setAttribute("aria-expanded","false");document.body.classList.remove("sa-menu-open");}
  burger.addEventListener("click",function(e){e.stopPropagation();menu.classList.contains("open")?closeMenu():openMenu();});
  close.addEventListener("click",closeMenu);
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&menu.classList.contains("open"))closeMenu();});
  document.addEventListener("click",function(e){if(menu.classList.contains("open")&&!menu.contains(e.target)&&e.target!==burger)closeMenu();});
  menu.addEventListener("click",function(e){if(e.target.classList&&e.target.classList.contains("sa-menu-item")||e.target.classList&&e.target.classList.contains("sa-menu-cta"))setTimeout(closeMenu,150);});
})();
</script>
"""

# ---------------------------------------------------------------------------
# Page transforms
# ---------------------------------------------------------------------------

def transform_topbar(html, filepath):
    """Standard header. Burger goes after the brand; drawer after the nav."""
    # Insert burger right after the brand link inside .nav / .wrap
    brand_re = re.compile(r'(<a class="brand"[^>]*>SEAN <span>ALI</span></a>)')
    html, n = brand_re.subn(r'\1' + burger_button(), html, count=1)
    if n == 0:
        return None, "brand link not found"
    # Insert drawer after </nav> (the first main nav). If multiple navs,
    # append after the first topbar nav only.
    nav_end = html.find("</nav>")
    if nav_end == -1:
        return None, "closing nav tag not found"
    html = html[:nav_end + len("</nav>")] + menu_drawer_html() + html[nav_end + len("</nav>"):]

    # Append CSS before </style> (main page style block). If no inline style,
    # add a new <style> before </head>.
    style_end = html.find("</style>")
    if style_end != -1:
        html = html[:style_end] + MENU_CSS + html[style_end:]
    else:
        head_end = html.find("</head>")
        html = html[:head_end] + "<style>" + MENU_CSS + "</style>" + html[head_end:]

    # Append JS before </body>
    body_end = html.find("</body>")
    if body_end != -1:
        html = html[:body_end] + MENU_JS + html[body_end:]
    else:
        html += MENU_JS
    return html, "ok"

def transform_social(html, filepath):
    """Social-style header. Same drawer; burger added into .social-topbar."""
    html, n = re.subn(
        r'(<header class="social-topbar"[^>]*>(?:\s*)<a class="social-logo".*?</a>)',
        r'\1' + burger_button(),
        html, count=1, flags=re.DOTALL)
    if n == 0:
        # fallback: append after header's logo link anyway
        m = re.search(r'<a class="social-logo"[^>]*>.*?</a>', html, re.DOTALL)
        if not m:
            return None, "social logo link not found"
        html = html[:m.end()] + burger_button() + html[m.end():]

    # Drawer after the header's closing tag
    hm = re.search(r'<header class="social-topbar".*?</header>', html, re.DOTALL)
    if hm:
        html = html[:hm.end()] + menu_drawer_html() + html[hm.end():]
    else:
        return None, "social header block not found"

    # Ensure shared CSS exists: append to assets/social-blog.css instead of
    # every page? The site keeps social pages self-contained w/ shared css
    # file already linked. Append there for site-wide consistency.
    css_path = os.path.join(REPO, "assets", "social-blog.css")
    if COMMIT and os.path.exists(css_path):
        with open(css_path, "r") as f:
            css = f.read()
        if ".sa-burger{" not in css:
            with open(css_path, "a") as f:
                f.write("\n" + MENU_CSS)
    else:
        style_end = html.find("</style>")
        if style_end != -1 and ".social-topbar{" in html[:style_end]:
            html = html[:style_end] + MENU_CSS + html[style_end:]

    body_end = html.find("</body>")
    if body_end != -1:
        html = html[:body_end] + MENU_JS + html[body_end:]
    else:
        html += MENU_JS
    return html, "ok"

def collect_files():
    topbar, social, saas = [], [], []
    for root, _, files in os.walk(REPO):
        if "/.git" in root:
            continue
        for name in files:
            if not name.endswith(".html"):
                continue
            path = os.path.join(root, name)
            try:
                with open(path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read(200000)
            except Exception:
                continue
            if 'class="topbar"' in content and 'class="brand"' in content:
                topbar.append(path)
            elif 'class="social-topbar"' in content:
                social.append(path)
            elif 'class="saas-nav"' in content and 'class="topbar"' in content:
                saas.append(path)
    return topbar, social, saas

def transform_saas(html, filepath):
    """App-style page (sidebar + topbar). Attach burger next to the topbar title."""
    m = re.search(r'<div class="topbar">', html)
    if not m:
        return None, "saas topbar div not found"
    topbar_start = m.start()
    # find balanced close of the topbar div
    depth = 0
    i = topbar_start
    topbar_end = -1
    while i < len(html):
        open_i = html.find("<div", i)
        close_i = html.find("</div>", i)
        if close_i == -1:
            break
        if open_i != -1 and open_i < close_i:
            depth += 1
            i = open_i + 4
        else:
            depth -= 1
            if depth == 0:
                topbar_end = close_i + len("</div>")
                break
            i = close_i + 6
    if topbar_end == -1:
        return None, "saas topbar block not found"
    tm = re.search(r'<div class="topbar-title">.*?</div>\s*', html[topbar_start:topbar_end], re.DOTALL)
    if tm:
        ins = topbar_start + tm.end()
    else:
        ins = topbar_end
    html = html[:ins] + burger_button() + html[ins:]
    # topbar_end already points right after the balanced closing </div>.
    # Inserting the burger (same depth) does not move the balanced close, so
    # the drawer goes right after topbar_end.
    html = html[:topbar_end] + menu_drawer_html() + html[topbar_end:]
    style_end = html.find("</style>")
    if style_end != -1:
        html = html[:style_end] + MENU_CSS + html[style_end:]
    body_end = html.find("</body>")
    if body_end != -1:
        html = html[:body_end] + MENU_JS + html[body_end:]
    return html, "ok"

def main():
    topbar, social, saas = collect_files()
    print(f"topbar pages: {len(topbar)}, social pages: {len(social)}, saas pages: {len(saas)}")
    if not COMMIT:
        print("dry run — pass --commit to apply")
        return
    for path in topbar:
        with open(path, "r", encoding="utf-8") as f:
            html = f.read()
        if 'id="saBurger"' in html:
            print(f"skip (already injected): {os.path.relpath(path, REPO)}")
            continue
        new, status = transform_topbar(html, path)
        if new is None:
            print(f"FAIL {os.path.relpath(path, REPO)}: {status}")
            continue
        with open(path, "w", encoding="utf-8") as f:
            f.write(new)
        print(f"ok   {os.path.relpath(path, REPO)}")
    for path in social:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            html = f.read()
        if 'id="saBurger"' in html:
            print(f"skip (already injected): {os.path.relpath(path, REPO)}")
            continue
        new, status = transform_social(html, path)
        if new is None:
            print(f"FAIL {os.path.relpath(path, REPO)}: {status}")
            continue
        with open(path, "w", encoding="utf-8", errors="ignore") as f:
            f.write(new)
        print(f"ok   {os.path.relpath(path, REPO)}")
    for path in saas:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            html = f.read()
        if 'id="saBurger"' in html:
            print(f"skip (already injected): {os.path.relpath(path, REPO)}")
            continue
        new, status = transform_saas(html, path)
        if new is None:
            print(f"FAIL {os.path.relpath(path, REPO)}: {status}")
            continue
        with open(path, "w", encoding="utf-8", errors="ignore") as f:
            f.write(new)
        print(f"ok   {os.path.relpath(path, REPO)}")

if __name__ == "__main__":
    main()
