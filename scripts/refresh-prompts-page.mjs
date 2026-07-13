import fs from 'node:fs';

const file = 'prompts.html';
let html = fs.readFileSync(file, 'utf8');

function replaceOnce(oldValue, newValue, label) {
  if (!html.includes(oldValue)) {
    throw new Error(`Missing expected ${label}`);
  }
  html = html.replace(oldValue, newValue);
}

if (!html.includes('id="claude27-release-styles"')) {
  const extraStyles = `

    /* limited-release energy without sacrificing the clean layout */
    body {
      background:
        radial-gradient(circle at 8% 8%, rgba(255, 215, 46, 0.20), transparent 27%),
        radial-gradient(circle at 92% 24%, rgba(255, 59, 29, 0.11), transparent 30%),
        #FFFFFF;
    }

    .urgency-bar {
      position: relative;
      z-index: 20;
      width: 100%;
      padding: 11px 18px;
      background: #111827;
      color: #FFFFFF;
      text-align: center;
      font-size: 0.84rem;
      line-height: 1.35;
      font-weight: 800;
      letter-spacing: 0.01em;
      box-shadow: 0 5px 18px rgba(17, 24, 39, 0.16);
    }

    .urgency-bar strong { color: #FFD72E; }

    .above-fold { padding-top: 1.65rem; }

    .eyebrow {
      background: #FFD72E;
      color: #111827;
      border: 2px solid #111827;
      box-shadow: 4px 4px 0 #111827;
      letter-spacing: 0.045em;
      text-transform: uppercase;
      animation: releaseFloat 2.8s ease-in-out infinite;
    }

    @keyframes releaseFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }

    h1 {
      font-size: clamp(2.35rem, 6vw, 3.4rem);
      line-height: 1.06;
      max-width: 760px;
      background: none;
      color: #111827;
    }

    h1 .hot { color: var(--orange-red); }

    .subhead {
      max-width: 690px;
      font-size: 1.18rem;
      font-weight: 500;
      margin-bottom: 0.85rem;
    }

    .availability {
      display: inline-flex;
      align-items: center;
      gap: 9px;
      margin: 0 auto 1rem;
      padding: 8px 14px;
      border-radius: 999px;
      background: #ECFDF3;
      color: #166534;
      border: 1px solid #BBF7D0;
      font-size: 0.82rem;
      font-weight: 800;
    }

    .live-dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: #22C55E;
      box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.45);
      animation: livePulse 1.8s infinite;
    }

    @keyframes livePulse {
      0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.45); }
      70% { box-shadow: 0 0 0 9px rgba(34, 197, 94, 0); }
      100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
    }

    .hype-row {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 9px;
      margin: 0 auto 1.45rem;
    }

    .hype-chip {
      padding: 9px 13px;
      border: 1px solid #E5E7EB;
      border-radius: 999px;
      background: rgba(255,255,255,0.92);
      color: #1F2937;
      font-size: 0.78rem;
      font-weight: 800;
      box-shadow: 0 7px 17px rgba(17,24,39,0.06);
    }

    .hype-chip strong { color: var(--orange-red); }

    .form-card {
      position: relative;
      overflow: visible;
      border: 3px solid #111827;
      border-radius: 26px;
      box-shadow: 10px 10px 0 #111827, 0 28px 55px rgba(255, 59, 29, 0.15);
      padding-top: 2.6rem;
    }

    .form-card::before {
      content: '';
      position: absolute;
      inset: 0 0 auto;
      height: 8px;
      border-radius: 22px 22px 0 0;
      background: linear-gradient(90deg, #FFD72E 0 34%, #FF3B1D 34% 68%, #111827 68% 100%);
    }

    .popular-ribbon {
      position: absolute;
      top: -17px;
      left: 50%;
      transform: translateX(-50%);
      white-space: nowrap;
      padding: 8px 15px;
      border: 2px solid #111827;
      border-radius: 999px;
      background: #FF3B1D;
      color: #FFFFFF;
      font-size: 0.72rem;
      font-weight: 900;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      box-shadow: 3px 3px 0 #111827;
    }

    .form-prompt {
      background: #FFF4B8;
      color: #111827;
      border: 1px solid #F5D94B;
      font-weight: 800;
    }

    .buttonContainer input.submit {
      min-height: 58px;
      border: 2px solid #111827 !important;
      border-radius: 12px !important;
      box-shadow: 5px 5px 0 #111827 !important;
      text-transform: uppercase;
      animation: ctaGlow 2.4s ease-in-out infinite;
    }

    @keyframes ctaGlow {
      0%, 100% { filter: brightness(1); }
      50% { filter: brightness(1.09); }
    }

    .buttonContainer input.submit:hover {
      transform: translate(-2px, -2px);
      box-shadow: 8px 8px 0 #111827 !important;
    }

    .cta-proof {
      margin-top: 13px;
      color: #374151;
      font-size: 0.76rem;
      line-height: 1.45;
      font-weight: 800;
    }

    .limited-box {
      width: 100%;
      max-width: 560px;
      margin: 1.35rem auto 0;
      padding: 14px 18px;
      border: 1px dashed rgba(255, 59, 29, 0.55);
      border-radius: 14px;
      background: #FFF8F0;
      color: #4B5563;
      font-size: 0.84rem;
      line-height: 1.45;
      font-weight: 600;
    }

    .limited-box strong { color: #111827; }

    .below-fold {
      border-top: 0;
      padding-top: 2rem;
    }

    .combined-info {
      border: 2px solid rgba(255, 59, 29, 0.26);
      box-shadow: 0 18px 42px rgba(17,24,39,0.08);
    }

    .guide-sub {
      display: inline-flex !important;
      padding: 7px 10px;
      border-radius: 999px;
      background: #FFF1ED;
    }

    .mini-proof {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
      margin: 12px 0 2px;
    }

    .mini-proof span {
      padding: 6px 9px;
      border-radius: 7px;
      background: #FFFFFF;
      border: 1px solid #E5E7EB;
      color: #374151;
      font-size: 0.72rem;
      font-weight: 800;
    }

    @media (max-width: 550px) {
      .urgency-bar { font-size: 0.76rem; }
      .container { padding-top: 1.15rem; }
      .above-fold { padding-top: 0.65rem; }
      .eyebrow { margin-bottom: 1.25rem; }
      h1 { font-size: 2.22rem; }
      .subhead { font-size: 1.03rem; }
      .form-card { padding: 2.45rem 1.2rem 1.5rem; box-shadow: 7px 7px 0 #111827; }
      .popular-ribbon { font-size: 0.64rem; }
      .hype-row { gap: 7px; }
      .hype-chip { font-size: 0.7rem; }
    }

    @media (prefers-reduced-motion: reduce) {
      .eyebrow, .live-dot, .buttonContainer input.submit { animation: none !important; }
    }
  `;

  replaceOnce('  </style>', `${extraStyles}\n  </style>`, 'closing style tag');

  replaceOnce(
    '<body>\n\n<main class="container">',
    '<body>\n\n<div class="urgency-bar">🔥 <strong>LIMITED FREE RELEASE:</strong> Claude27 is regularly $47 — get it free while access is open.</div>\n\n<main class="container">',
    'body opening'
  );

  replaceOnce(
    '<i class="fas fa-bolt"></i> FREE CLAUDE PROMPT GUIDE',
    '<i class="fas fa-bolt"></i> Limited Free Release · Regularly $47',
    'eyebrow copy'
  );

  replaceOnce(
    '<h1>27 Claude Prompts To Build Your First AI Income Stream</h1>',
    '<h1>27 Claude Prompts To Build Your First <span class="hot">AI Income Stream</span></h1>',
    'headline'
  );

  replaceOnce(
    '<div class="subhead">\n      If I had to start from zero today, these are the exact prompts I’d use to get my first buyer online.\n    </div>',
    '<div class="subhead">\n      The exact prompt pack I would open if I had to start from zero, find a clear offer, and get my first buyer online.\n    </div>\n\n    <div class="availability"><span class="live-dot"></span> Free access is open right now</div>\n\n    <div class="hype-row" aria-label="Offer highlights">\n      <span class="hype-chip">🔥 <strong>Regularly $47</strong></span>\n      <span class="hype-chip">⚡ Instant PDF access</span>\n      <span class="hype-chip">🚫 No payment required</span>\n    </div>',
    'subhead block'
  );

  replaceOnce(
    '<div class="form-card">\n      <div class="form-prompt">',
    '<div class="form-card">\n      <div class="popular-ribbon">Popular Free Guide</div>\n      <div class="form-prompt">',
    'form card opening'
  );

  replaceOnce(
    '<i class="fas fa-envelope"></i> Where should I send the free Claude27 guide?',
    '<i class="fas fa-envelope"></i> Where should I send your free Claude27 pack?',
    'form prompt'
  );

  replaceOnce(
    '<input name="submit" class="submit" type="submit" value="SEND ME THE 27 PROMPTS" tabindex="502" />',
    '<input name="submit" class="submit" type="submit" value="UNLOCK THE 27 PROMPTS FREE →" tabindex="502" />\n               <div class="cta-proof">⚡ Instant access · No payment required · Free for a limited time</div>',
    'submit button'
  );

  replaceOnce(
    '      </form>\n    </div>\n  </div>\n\n  <!-- BELOW THE FOLD:',
    '      </form>\n    </div>\n\n    <div class="limited-box"><strong>Free during this release.</strong> Claude27 is normally $47. Request it now and the PDF is yours to keep.</div>\n  </div>\n\n  <!-- BELOW THE FOLD:',
    'post-form block'
  );

  replaceOnce(
    '<i class="fas fa-file-pdf"></i> 27 proven prompts · instant PDF',
    '<i class="fas fa-fire"></i> Limited free release · 27 proven prompts · instant PDF',
    'guide subline'
  );

  replaceOnce(
    '<p>Find your offer, create content, build a landing page, write emails, and get your first buyer — all with Claude AI.</p>',
    '<p>Find your offer, create content, build a landing page, write emails, and get your first buyer — all with Claude AI.</p>\n        <div class="mini-proof"><span>Offer ideas</span><span>Landing pages</span><span>Email copy</span><span>First-buyer plan</span></div>',
    'guide description'
  );

  html = html.replace('<style>', '<style id="claude27-release-styles">');
  fs.writeFileSync(file, html, 'utf8');
}

const finalHtml = fs.readFileSync(file, 'utf8');
const required = [
  'LIMITED FREE RELEASE:',
  'Popular Free Guide',
  'Free access is open right now',
  'UNLOCK THE 27 PROMPTS FREE →',
  'Claude27 is normally $47',
  'Limited free release · 27 proven prompts',
  'id="claude27-release-styles"'
];

for (const marker of required) {
  if (!finalHtml.includes(marker)) throw new Error(`Missing final marker: ${marker}`);
}

if (!finalHtml.includes('action="https://www.aweber.com/scripts/addlead.pl"')) {
  throw new Error('AWeber form action was altered.');
}
if (!finalHtml.includes('value="awlist6946418"')) {
  throw new Error('AWeber list ID was altered.');
}
if (!finalHtml.includes('value="http://seanali.online/prompts-sent"')) {
  throw new Error('Thank-you redirect was altered.');
}

console.log('Claude27 prompts page refreshed with limited-release energy.');
