import fs from 'node:fs';

const path = 'linktree.html';
const before = '<p class="bio">👇 I help people escape poverty, tap into abundance, and build a successful life through money, mindset, God, manifestation, business, AI, freedom, and inner work.</p>';
const after = '<p class="bio">I help people escape poverty, tap into abundance, and build a successful life.</p>';
const html = fs.readFileSync(path, 'utf8');
if (!html.includes(before)) throw new Error('Expected Linktree bio not found');
fs.writeFileSync(path, html.replace(before, after));
