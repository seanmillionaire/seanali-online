import fs from 'node:fs';

const path = 'system.html';
let html = fs.readFileSync(path, 'utf8');
const image = '<img class="avatar" src="https://statics.myclickfunnels.com/workspace/vGVGzP/image/20204117/file/904663e23eb23a39d6f2459104b7bccc.png" alt="Sean Ali">';

if (!html.includes(image)) {
  throw new Error('Sean hero image was not found in system.html');
}

html = html.replace(image, '');
fs.writeFileSync(path, html, 'utf8');

if (fs.readFileSync(path, 'utf8').includes(image)) {
  throw new Error('Sean hero image is still present');
}

console.log('Removed Sean image from the system page hero.');
