import fs from 'node:fs';

const path = 'linktree.html';
const oldBio = '<p class="bio">Marketer, media buyer, founder, and AI systems builder. Practical tools for income, identity, and freedom.</p>';
const newBio = '<p class="bio">👇 I help people escape poverty, tap into abundance, and build a successful life through money, mindset, God, manifestation, business, AI, freedom, and inner work.</p>';

let html = fs.readFileSync(path, 'utf8');
if (!html.includes(oldBio)) throw new Error('Current Linktree bio was not found.');
html = html.replace(oldBio, newBio);
fs.writeFileSync(path, html, 'utf8');

const finalHtml = fs.readFileSync(path, 'utf8');
if (!finalHtml.includes(newBio)) throw new Error('New Linktree bio was not applied.');
if (finalHtml.includes(oldBio)) throw new Error('Old Linktree bio is still present.');
