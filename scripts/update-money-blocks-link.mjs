import fs from 'node:fs';

const file = 'linktree.html';
let html = fs.readFileSync(file, 'utf8');

const oldCard = `<a class="link-card featured" href="https://seanali.online/videos/moneyblocks1.html">
      <span class="icon red">▶</span>
      <span class="link-copy"><strong>Money Blocks Video</strong><span>Watch the training on the hidden beliefs keeping money stuck.</span></span>
      <span class="arrow">›</span>
    </a>`;

const newCard = `<a class="link-card featured" href="https://seanali.online/flow">
      <span class="icon red">▶</span>
      <span class="link-copy"><strong>Remove Your Money Blocks</strong><span>Watch the training on the hidden beliefs keeping money stuck.</span></span>
      <span class="arrow">›</span>
    </a>`;

if (!html.includes(oldCard)) throw new Error('Expected first Money Blocks card not found.');
html = html.replace(oldCard, newCard);
fs.writeFileSync(file, html, 'utf8');

const finalHtml = fs.readFileSync(file, 'utf8');
if (!finalHtml.includes('href="https://seanali.online/flow"')) throw new Error('New flow link missing.');
if (!finalHtml.includes('<strong>Remove Your Money Blocks</strong>')) throw new Error('New card title missing.');
if (finalHtml.includes('https://seanali.online/videos/moneyblocks1.html')) throw new Error('Old video link remains.');
