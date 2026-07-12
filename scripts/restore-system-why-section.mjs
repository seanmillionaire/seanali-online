import fs from 'node:fs';

const file = 'system.html';
let html = fs.readFileSync(file, 'utf8');

const contrast = '<section class="operator-contrast"><p>AI is moving fast.</p><p><strong>You do not have to be left behind.</strong></p><p>You just need a clear place to start.</p></section>';
const whySection = '<section class="band"><div class="wrap"><span class="eyebrow">Why I built this</span><div class="operator-story"><h2>AI Made Building A Business <span class="red">Simpler. Not Automatic.</span></h2><p>Before AI, building an online business often required designers, writers, developers, media buyers, and endless software.</p><p>I spent years buying traffic, building funnels, creating offers, and learning what actually makes people buy.</p><p>Today one person can use AI to do work that once required an entire team.</p><p class="story-hit">That means you can start without putting the rest of your life on hold.</p><p>AI does not remove the work. It makes the right work faster, simpler, and easier to fit around a busy life.</p><div class="operator-proof-strip"><span>Paid Traffic</span><span>Funnels</span><span>Offers</span><span>Customer Acquisition</span></div></div><div class="top-proof-grid"><figure class="top-proof-card"><img src="https://hypnoticmeditations.b-cdn.net/images/proof/100k%20a%20day.jpeg" alt="Sean Ali business results proof"><figcaption>Real results from building and marketing online offers.</figcaption></figure><figure class="top-proof-card"><img src="https://hypnoticmeditations.b-cdn.net/images/proof/sean_hypnotic.png" alt="Sean Ali Hypnotic Meditations business"><figcaption>A real online business built from ideas, offers, and consistent action.</figcaption></figure></div></div></section>';

if (!html.includes('Why I built this')) {
  if (!html.includes(contrast)) throw new Error('Could not find operator contrast insertion point');
  html = html.replace(contrast, `${contrast}\n${whySection}`);
}

const removedMarkers = [
  'The results: updated May 2026',
  'Go From “I Have No Idea What To Build” To Something You Can Launch',
  'What happens after you join?',
  'What the community is using every day',
];
for (const marker of removedMarkers) {
  if (html.includes(marker)) throw new Error(`Requested removed block returned: ${marker}`);
}
if (!html.includes('Why I built this')) throw new Error('Why section was not restored');
if (!html.includes('<section class="band" id="proof"><div class="wrap"><span class="eyebrow">Sean\'s proof</span>')) {
  throw new Error('Proof navigation anchor is missing');
}

fs.writeFileSync(file, html, 'utf8');
console.log('Restored the Why I built this section only.');
