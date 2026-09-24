// sitemap.js — يولّد sitemap.xml كامل
const fs = require('fs');
const regions = require('./regions.json');

const SITE = 'https://alwairaq.com';
const today = new Date().toISOString().split('T')[0];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
<url><loc>${SITE}/</loc><lastmod>${today}</lastmod><priority>1.0</priority><changefreq>daily</changefreq></url>
`;

let total = 1;

regions.forEach(gov => {
  xml += `<url><loc>${SITE}/iraq/${gov.g}/</loc><lastmod>${today}</lastmod><priority>0.9</priority></url>\n`;
  total++;

  gov.a.forEach(area => {
    xml += `<url><loc>${SITE}/iraq/${gov.g}/${area.s}/</loc><lastmod>${today}</lastmod><priority>0.8</priority></url>\n`;
    total++;
  });
});

xml += '</urlset>';

fs.writeFileSync('./docs/sitemap.xml', xml);

console.log(`✅ sitemap.xml يحتوي على ${total} رابط`);
