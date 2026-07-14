import fs from 'node:fs';

const file = 'linktree.html';
let html = fs.readFileSync(file, 'utf8');

const marker = '  <section class="links" id="main-links" aria-label="Sean Ali main links">\n';
const card = `    <a class="link-card featured" href="https://seanali.online/videos/moneyblocks1.html">\n      <span class="icon red">▶</span>\n      <span class="link-copy"><strong>Money Blocks Video</strong><span>Watch the training on the hidden beliefs keeping money stuck.</span></span>\n      <span class="arrow">›</span>\n    </a>\n`;

if (!html.includes(marker)) throw new Error('Main Links section marker not found.');
if (!html.includes('https://seanali.online/videos/moneyblocks1.html')) {
  html = html.replace(marker, marker + card);
}

fs.writeFileSync(file, html, 'utf8');

const finalHtml = fs.readFileSync(file, 'utf8');
const sectionStart = finalHtml.indexOf(marker);
const videoPosition = finalHtml.indexOf('https://seanali.online/videos/moneyblocks1.html');
const hypnoticPosition = finalHtml.indexOf('https://hypnoticmeditations.ai/', sectionStart);
if (videoPosition < sectionStart || videoPosition > hypnoticPosition) {
  throw new Error('Money Blocks Video was not restored to spot 1.');
}
