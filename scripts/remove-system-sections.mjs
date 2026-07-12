import fs from 'node:fs';

const file = 'system.html';
let html = fs.readFileSync(file, 'utf8');

const removals = [
  {
    name: 'results proof section',
    pattern: /<section class="band yellow" id="proof">[\s\S]*?<span class="eyebrow">The results: updated May 2026<\/span>[\s\S]*?<\/section>/,
  },
  {
    name: 'what you get section',
    pattern: /<section class="band grey">[\s\S]*?<div class="warning-strip">You do not need more information\. You need a clear next step\.<\/div>[\s\S]*?<\/section>/,
  },
  {
    name: 'after joining section',
    pattern: /<section class="band">[\s\S]*?<span class="eyebrow">What happens after you join\?<\/span>[\s\S]*?<\/section>/,
  },
  {
    name: 'community build section',
    pattern: /<section class="band grey">[\s\S]*?<span class="eyebrow">What the community is using every day<\/span>[\s\S]*?<\/section>/,
  },
];

for (const { name, pattern } of removals) {
  if (!pattern.test(html)) throw new Error(`Could not find ${name}`);
  html = html.replace(pattern, '');
}

const laterProof = '<section class="band"><div class="wrap"><span class="eyebrow">Sean\'s proof</span>';
const anchoredProof = '<section class="band" id="proof"><div class="wrap"><span class="eyebrow">Sean\'s proof</span>';
if (!html.includes(anchoredProof)) {
  if (!html.includes(laterProof)) throw new Error('Could not find later Sean proof section');
  html = html.replace(laterProof, anchoredProof);
}

const removedMarkers = [
  'The results: updated May 2026',
  'What Used To Require A Team Can Now',
  'You do not need more information. You need a clear next step.',
  'Go From “I Have No Idea What To Build” To Something You Can Launch',
  'What happens after you join?',
  'You Do Not Have To Figure Out Where To Start',
  'What the community is using every day',
  'This Is What Members',
  'Open The System. Pick A Build. Start Moving.',
];

for (const marker of removedMarkers) {
  if (html.includes(marker)) throw new Error(`Removed marker still present: ${marker}`);
}

if (!html.includes('<section class="band" id="proof"><div class="wrap"><span class="eyebrow">Sean\'s proof</span>')) {
  throw new Error('Proof navigation anchor was not preserved');
}

fs.writeFileSync(file, html, 'utf8');
console.log('Removed four requested system page sections.');
