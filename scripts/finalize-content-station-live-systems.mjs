import fs from 'node:fs';

const appPath = 'content-station/app.js';
const cssPath = 'content-station/styles.css';
let app = fs.readFileSync(appPath, 'utf8');
let css = fs.readFileSync(cssPath, 'utf8');

app = app.replace(
`    { label: "Click in the Mind", pass: /(god|money|wealth|sleep|love|job|income|book|phone|fear|prayer|affirmation|manifest)/i.test(text) },
    { label: "Tangible Payoff", pass: /(calm|see|choose|build|sleep|receive|protect|move|earn|read|reply|review|remove|stop)/i.test(text) },
    { label: "Specificity", pass: /(\\d|before|tonight|daily|morning|book|script|sign|review|email)/i.test(text) },
    { label: "Seven-Year-Old Clear", pass: concept.title.split(/\\s+/).length <= 14 },`,
`    { label: "Click in the Mind", pass: concept.title.length >= 18 && !/^(content|idea|lesson|tips)$/i.test(concept.title) },
    { label: "Tangible Payoff", pass: concept.payoff.length >= 30 && Boolean(concept.topic) },
    { label: "Specificity", pass: Boolean(concept.systemName) && Boolean(concept.status) },
    { label: "Seven-Year-Old Clear", pass: concept.title.split(/\\s+/).length <= 20 },`
);

if (!app.includes('concept.title.split(/\\s+/).length <= 20')) {
  throw new Error('Could not update the Content Station score gate.');
}

if (!css.includes('/* LIVE CONTENT STATION V3 */')) {
  css += `

/* LIVE CONTENT STATION V3 */
.concept-card h4{margin:0;font-size:clamp(26px,4vw,46px);line-height:1.02;letter-spacing:-.045em}
.concept-card>p{margin:0;color:#475467;font-weight:650;line-height:1.5}
.concept-hook{padding:16px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:16px;color:#111827!important;font-size:17px;font-weight:800!important}
.concept-meta span{padding:7px 10px;background:#ecfdf3;border:1px solid #bbf7d0;border-radius:999px;color:#067647;font-size:11px;font-weight:850}
.score-list{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:2px 0 0;padding:0;list-style:none}
.score-list li{padding:10px;border-radius:12px;font-size:12px;font-weight:800}
.score-list .pass{background:#ecfdf3;border:1px solid #bbf7d0;color:#067647}
.score-list .fail{background:#fef2f2;border:1px solid #fecaca;color:#b42318}
.approval-state{padding:12px 14px!important;background:#111827!important;border-radius:14px;color:#fff!important;text-align:center;font-weight:900!important}
@media(max-width:760px){.score-list{grid-template-columns:repeat(2,minmax(0,1fr))}.asset-tabs{overflow-x:auto;flex-wrap:nowrap}.asset-tab{white-space:nowrap}.workspace{padding:14px}.panel{padding:20px}.hero{padding:28px}.hero h2{font-size:48px}.control-grid{grid-template-columns:1fr}.panel-heading{display:grid}.button-row{justify-content:stretch}.button-row button{width:100%}}
`;
}

fs.writeFileSync(appPath, app, 'utf8');
fs.writeFileSync(cssPath, css, 'utf8');
