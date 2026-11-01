
// sitemap.js — يولّد sitemap.xml (عربية + كردية + مقالات + هوية علوة)

const fs = require('fs');
const regions = require('./regions.json');

const SITE = 'https://alwairaq.com';
const today = new Date().toISOString().split('T')[0];
const KURDISH_GOVS = ['erbil', 'sulaymaniyah', 'duhok', 'halabja'];

// مفاتيح Supabase لجلب المقالات
const SUPABASE_URL = 'https://biaasenkbydtmyqbtvzx.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable__aROsRno3ozsTymS1KTuGg_yazb3C_U';

async function generateSitemap() {

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

<url>
<loc>${SITE}/</loc>
<lastmod>${today}</lastmod>
<priority>1.0</priority>
<changefreq>daily</changefreq>
</url>

<url>
<loc>${SITE}/news/</loc>
<lastmod>${today}</lastmod>
<priority>0.9</priority>
<changefreq>daily</changefreq>
</url>

<url>
<loc>${SITE}/about-alwa/</loc>
<lastmod>${today}</lastmod>
<priority>0.7</priority>
</url>
`;

    // الرئيسية والأخبار وصفحة الهوية الرسمية لعلوة
    let total = 3;

    regions.forEach(gov => {

        // صفحة المحافظة العربية
        xml += `<url><loc>${SITE}/iraq/${gov.g}/</loc><lastmod>${today}</lastmod><priority>0.9</priority></url>\n`;
        total++;

        // صفحات المناطق العربية
        gov.a.forEach(area => {
            xml += `<url><loc>${SITE}/iraq/${gov.g}/${area.s}/</loc><lastmod>${today}</lastmod><priority>0.8</priority></url>\n`;
            total++;
        });

        // النسخة الكردية
        if (KURDISH_GOVS.includes(gov.g)) {

            xml += `<url><loc>${SITE}/ckb/iraq/${gov.g}/</loc><lastmod>${today}</lastmod><priority>0.9</priority></url>\n`;
            total++;

            gov.a.forEach(area => {
                xml += `<url><loc>${SITE}/ckb/iraq/${gov.g}/${area.s}/</loc><lastmod>${today}</lastmod><priority>0.8</priority></url>\n`;
                total++;
            });
        }
    });

    // جلب المقالات المنشورة من Supabase وإضافتها إلى خريطة الموقع
    try {

        console.log("جاري جلب المقالات لخريطة الموقع...");

        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/articles?status=eq.published&select=slug,published_at`,
            {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                }
            }
        );

        if (res.ok) {

            const articles = await res.json();

            if (Array.isArray(articles)) {

                articles.forEach(article => {

                    const date = article.published_at
                        ? article.published_at.split('T')[0]
                        : today;

                    xml += `<url><loc>${SITE}/news/${article.slug}.html</loc><lastmod>${date}</lastmod><priority>0.8</priority></url>\n`;

                    total++;
                });
            }

        } else {

            console.error(
                "فشل جلب المقالات، كود الخطأ:",
                res.status
            );
        }

    } catch (e) {

        console.error(
            "حدث خطأ أثناء جلب المقالات لخريطة الموقع:",
            e
        );
    }

    // إغلاق خريطة الموقع
    xml += '\n</urlset>';

    // حفظ خريطة الموقع داخل مجلد docs
    fs.writeFileSync('./docs/sitemap.xml', xml, 'utf8');

    console.log(
        `✅ sitemap.xml يحتوي الآن على ${total} رابط (عربية + كردية + مقالات + هوية علوة)`
    );
}

generateSitemap();
