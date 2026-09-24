// generate.js — يولّد صفحات عربية + صفحات كردية (نسخة نهائية)
const fs = require('fs');
const path = require('path');
const regions = require('./regions.json');

const SITE = 'https://alwairaq.com';
const OUT = './docs';

// المحافظات الكردية
const KURDISH_GOVS = ['erbil', 'sulaymaniyah', 'duhok', 'halabja'];
const GOV_NAMES_KU = {
  erbil: 'هەولێر',
  sulaymaniyah: 'سلێمانی',
  duhok: 'دهۆک',
  halabja: 'هەڵبەجە'
};

// حذف المجلدات القديمة
if (fs.existsSync(OUT + '/iraq')) fs.rmSync(OUT + '/iraq', { recursive: true });
if (fs.existsSync(OUT + '/ckb')) fs.rmSync(OUT + '/ckb', { recursive: true });

// ═══════════════════════════════════════════
// قالب CSS مشترك
// ═══════════════════════════════════════════
const SHARED_CSS = `<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Cairo',system-ui,sans-serif;background:#fff;color:#1c1f26;line-height:1.75;padding:0}
.wrap{max-width:900px;margin:0 auto;padding:20px}
header{background:#04722b;color:#fff;padding:14px 0;margin-bottom:24px}
header .wrap{display:flex;gap:12px;align-items:center;padding:0 20px;flex-wrap:wrap}
header a{color:#fff;text-decoration:none;font-weight:600}
h1{color:#04722b;font-size:1.9rem;margin-bottom:12px}
h2{color:#035a22;font-size:1.3rem;margin:28px 0 12px}
h3{color:#035a22;font-size:1.1rem;margin:18px 0 8px}
p{margin-bottom:14px;color:#4b5160}
ul{margin:12px 0 20px 20px;color:#4b5160}
li{padding:4px 0}
a{color:#04722b}
.cta{display:inline-block;background:#ff6600;color:#fff;padding:14px 28px;border-radius:6px;font-weight:700;text-decoration:none;margin:20px 0}
.cta:hover{background:#cc5200}
footer{background:#023d17;color:#fff;text-align:center;padding:24px;margin-top:48px}
footer a{color:#f1c548}
</style>`;

// ═══════════════════════════════════════════
// قالب صفحة عربية — منطقة
// ═══════════════════════════════════════════
function makePage(gov, area) {
  const hasKu = KURDISH_GOVS.includes(gov.g);
  const kuHreflang = hasKu
    ? `<link rel="alternate" hreflang="ckb" href="${SITE}/ckb/iraq/${gov.g}/${area.s}/">`
    : '';

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>خضار وفواكه ${area.n} | توصيل من أقرب بقال — علوة ALWA</title>
<meta name="description" content="اطلب خضار وفواكه طازجة في ${area.n}، ${gov.ga}. توصيل سريع من أقرب بقال خلال دقائق عبر تطبيق علوة. أسعار الجملة من العلاوي المركزية.">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${SITE}/iraq/${gov.g}/${area.s}/">
<link rel="alternate" hreflang="ar" href="${SITE}/iraq/${gov.g}/${area.s}/">
${kuHreflang}
<link rel="alternate" hreflang="x-default" href="${SITE}/iraq/${gov.g}/${area.s}/">
<link rel="icon" type="image/png" href="/alwa.png">

<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"LocalBusiness",
  "name":"علوة ALWA — توصيل خضار وفواكه في ${area.n}",
  "url":"${SITE}/iraq/${gov.g}/${area.s}/",
  "image":"${SITE}/alwa-og.jpg",
  "areaServed":{"@type":"Place","name":"${area.n}، ${gov.ga}، العراق"},
  "address":{"@type":"PostalAddress","addressLocality":"${area.n}","addressRegion":"${gov.ga}","addressCountry":"IQ"}
}
</script>

<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"BreadcrumbList",
  "itemListElement":[
    {"@type":"ListItem","position":1,"name":"الرئيسية","item":"${SITE}/"},
    {"@type":"ListItem","position":2,"name":"${gov.ga}","item":"${SITE}/iraq/${gov.g}/"},
    {"@type":"ListItem","position":3,"name":"${area.n}","item":"${SITE}/iraq/${gov.g}/${area.s}/"}
  ]
}
</script>

${SHARED_CSS}
</head>
<body>

<header>
  <div class="wrap">
    <a href="/">علوة ALWA</a>
    <span>›</span>
    <a href="/iraq/${gov.g}/">${gov.ga}</a>
    <span>›</span>
    <span>${area.n}</span>
  </div>
</header>

<main class="wrap">
  <h1>خضار وفواكه ${area.n} — توصيل من أقرب بقال</h1>

  <p>اطلب الخضار والفواكه الطازجة في <strong>${area.n}</strong>، محافظة <strong>${gov.ga}</strong>، عبر تطبيق علوة ALWA. يصلك الطلب من أقرب بقال في منطقتك خلال دقائق، بأسعار الجملة من العلاوي المركزية.</p>

  <a class="cta" href="https://play.google.com/store/apps/details?id=com.alwaa.app" target="_blank" rel="noopener">حمّل التطبيق واطلب الآن</a>

  <h2>بقالون يخدمون ${area.n} الآن</h2>
  <p>يفتح التطبيق تلقائياً قائمة البقالين النشطين في ${area.n}. قارن العروض، اختر الأنسب، واستلم طلبك في مكانك.</p>

  <h2>أسعار اليوم في ${area.n}</h2>
  <p>تُحدَّث الأسعار يومياً اعتماداً على العلاوي المركزية في ${gov.ga}.</p>

  <h2>العلوي القريبة من ${area.n}</h2>
  <p>يخدم ${area.n} أقرب العلاوي في ${gov.ga}.</p>

  <h2>خدماتنا في ${area.n}</h2>
  <ul>
    <li>توصيل خضار وفواكه من أقرب بقال</li>
    <li>طلب بأسعار الجملة مباشرة من العلاوي</li>
    <li>بث مباشر للبضاعة من المكاتب داخل العلاوي</li>
    <li>شركات تجهيز المطاعم والفنادق في ${gov.ga}</li>
    <li>شركات تصدير الخضار والفواكه</li>
  </ul>

  <h2>أسئلة شائعة عن التوصيل في ${area.n}</h2>

  <h3>هل يوجد توصيل خضار في ${area.n}؟</h3>
  <p>نعم، عبر تطبيق علوة من أقرب بقال مسجل في ${area.n}.</p>

  <h3>كم يستغرق التوصيل في ${area.n}؟</h3>
  <p>من 5 إلى 60 دقيقة حسب عرض البقال الذي تختاره.</p>

  <h3>هل التوصيل مجاني؟</h3>
  <p>نعم، السعر المعروض من البقال يشمل التوصيل — بدون رسوم إضافية.</p>

  <h2>مناطق أخرى في ${gov.ga}</h2>
  <p><a href="/iraq/${gov.g}/">تصفح جميع مناطق ${gov.ga}</a></p>
</main>

<footer>
  <p>© 2026 علوة ALWA — سوق الجملة الرقمي للخضار والفواكه في العراق</p>
  <p><a href="/">الرئيسية</a></p>
</footer>

</body>
</html>`;
}

// ═══════════════════════════════════════════
// قالب صفحة كردية — منطقة
// ═══════════════════════════════════════════
function makeKuPage(gov, area, govNameKu) {
  return `<!DOCTYPE html>
<html lang="ckb" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>سەوزە و میوە لە ${area.n} | گەیاندن لە نزیکترین بەقال — عەلوە ALWA</title>
<meta name="description" content="سەوزە و میوەی تازە لە ${area.n}، پارێزگای ${govNameKu}. گەیاندن لە نزیکترین بەقال لە ماوەی چەند خولەکدا بە ئەپی عەلوە ALWA.">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${SITE}/ckb/iraq/${gov.g}/${area.s}/">
<link rel="alternate" hreflang="ar" href="${SITE}/iraq/${gov.g}/${area.s}/">
<link rel="alternate" hreflang="ckb" href="${SITE}/ckb/iraq/${gov.g}/${area.s}/">
<link rel="alternate" hreflang="x-default" href="${SITE}/iraq/${gov.g}/${area.s}/">
<link rel="icon" type="image/png" href="/alwa.png">

<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"LocalBusiness",
  "name":"عەلوە ALWA — گەیاندنی سەوزە و میوە لە ${area.n}",
  "url":"${SITE}/ckb/iraq/${gov.g}/${area.s}/",
  "image":"${SITE}/alwa-og.jpg",
  "areaServed":{"@type":"Place","name":"${area.n}، ${govNameKu}، عێراق"},
  "address":{"@type":"PostalAddress","addressLocality":"${area.n}","addressRegion":"${govNameKu}","addressCountry":"IQ"}
}
</script>

<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"BreadcrumbList",
  "itemListElement":[
    {"@type":"ListItem","position":1,"name":"سەرەکی","item":"${SITE}/"},
    {"@type":"ListItem","position":2,"name":"${govNameKu}","item":"${SITE}/ckb/iraq/${gov.g}/"},
    {"@type":"ListItem","position":3,"name":"${area.n}","item":"${SITE}/ckb/iraq/${gov.g}/${area.s}/"}
  ]
}
</script>

${SHARED_CSS}
</head>
<body>

<header>
  <div class="wrap">
    <a href="/">عەلوە ALWA</a>
    <span>›</span>
    <a href="/ckb/iraq/${gov.g}/">${govNameKu}</a>
    <span>›</span>
    <span>${area.n}</span>
  </div>
</header>

<main class="wrap">
  <h1>سەوزە و میوە لە ${area.n} — گەیاندن لە نزیکترین بەقال</h1>

  <p>سەوزە و میوەی تازە لە <strong>${area.n}</strong>، پارێزگای <strong>${govNameKu}</strong> داوا بکە بە ئەپی <strong>عەلوە ALWA</strong>. داواکاریەکەت لە نزیکترین بەقال لە ناوچەکەتەوە دەگاتێت لە ماوەی چەند خولەکدا، بە نرخی بەکۆمەڵ لە عەلوە ناوەندییەکان.</p>

  <a class="cta" href="https://play.google.com/store/apps/details?id=com.alwaa.app" target="_blank" rel="noopener">ئەپەکە دابگرە و ئێستا داواکاری بکە</a>

  <h2>بەقالەکان ئێستا خزمەت بە ${area.n} دەکەن</h2>
  <p>ئەپەکە بە شێوەیەکی خۆکار لیستی بەقالە چالاکەکانی لە ${area.n} پیشان دەدات. پێشنیارەکان بەراورد بکە، باشترینیان هەڵبژێرە، و داواکاریەکەت لە شوێنی خۆت وەربگرە.</p>

  <h2>نرخی ئەمڕۆ لە ${area.n}</h2>
  <p>نرخەکان ڕۆژانە نوێ دەکرێنەوە بە پشتبەستن بە عەلوە ناوەندییەکانی ${govNameKu}.</p>

  <h2>عەلوەکانی نزیک لە ${area.n}</h2>
  <p>نزیکترین عەلوەکان لە ${govNameKu} خزمەت بە ${area.n} دەکەن.</p>

  <h2>خزمەتگوزارییەکانمان لە ${area.n}</h2>
  <ul>
    <li>گەیاندنی سەوزە و میوە لە نزیکترین بەقال</li>
    <li>داواکاری بە نرخی بەکۆمەڵ ڕاستەوخۆ لە عەلوەکان</li>
    <li>پەخشی ڕاستەوخۆی کاڵا لە ئۆفیسەکانی ناو عەلوەکان</li>
    <li>کۆمپانیاکانی دابینکردنی چێشتخانە و هۆتێلەکان</li>
    <li>کۆمپانیاکانی هەناردەکردنی سەوزە و میوە</li>
  </ul>

  <h2>پرسیارە باوەکان دەربارەی گەیاندن لە ${area.n}</h2>

  <h3>ئایا گەیاندنی سەوزە لە ${area.n} هەیە؟</h3>
  <p>بەڵێ، بە ئەپی عەلوە لە نزیکترین بەقالی تۆمارکراو لە ${area.n}.</p>

  <h3>گەیاندن لە ${area.n} چەند دەخایەنێت؟</h3>
  <p>لە 5 بۆ 60 خولەک بەپێی پێشنیاری بەقال کە هەڵدەبژێریت.</p>

  <h3>ئایا گەیاندن بەخۆڕاییە؟</h3>
  <p>بەڵێ، نرخی پیشاندراو لە لایەن بەقال گەیاندنیش لەخۆ دەگرێت — بێ کرێی زیادە.</p>

  <h2>ناوچەکانی تر لە ${govNameKu}</h2>
  <p><a href="/ckb/iraq/${gov.g}/">هەموو ناوچەکانی ${govNameKu}</a></p>
</main>

<footer>
  <p>© 2026 عەلوە ALWA — بازاڕی بەکۆمەڵی دیجیتاڵی بۆ سەوزە و میوە لە عێراق</p>
  <p><a href="/">سەرەکی</a></p>
</footer>

</body>
</html>`;
}

// ═══════════════════════════════════════════
// قالب صفحة عربية — محافظة
// ═══════════════════════════════════════════
function makeGovPage(gov) {
  const list = gov.a
    .map(a => `<li><a href="/iraq/${gov.g}/${a.s}/">خضار وفواكه ${a.n}</a></li>`)
    .join('\n');

  const hasKu = KURDISH_GOVS.includes(gov.g);
  const kuHreflang = hasKu
    ? `<link rel="alternate" hreflang="ckb" href="${SITE}/ckb/iraq/${gov.g}/">`
    : '';

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>خضار وفواكه ${gov.ga} | توصيل من أقرب بقال — علوة ALWA</title>
<meta name="description" content="اطلب خضار وفواكه في محافظة ${gov.ga} عبر تطبيق علوة. توصيل من أقرب بقال في ${gov.a.length} منطقة.">
<link rel="canonical" href="${SITE}/iraq/${gov.g}/">
<link rel="alternate" hreflang="ar" href="${SITE}/iraq/${gov.g}/">
${kuHreflang}
<style>
body{font-family:'Cairo',sans-serif;padding:20px;max-width:900px;margin:0 auto;line-height:1.75}
h1{color:#04722b;margin-bottom:20px}
ul{columns:2;list-style:none;padding:0}
li{padding:6px 0;border-bottom:1px solid #eee}
a{color:#04722b;text-decoration:none}
a:hover{text-decoration:underline}
</style>
</head>
<body>
<h1>خضار وفواكه ${gov.ga} — دليل كامل</h1>
<p>تصفح جميع مناطق ${gov.ga} (${gov.a.length} منطقة) واطلب خضارك وفواكهك من أقرب بقال.</p>
<ul>${list}</ul>
<p><a href="/">← الرئيسية</a></p>
</body>
</html>`;
}

// ═══════════════════════════════════════════
// قالب صفحة كردية — محافظة
// ═══════════════════════════════════════════
function makeKuGovPage(gov, govNameKu) {
  const list = gov.a
    .map(a => `<li><a href="/ckb/iraq/${gov.g}/${a.s}/">سەوزە و میوە لە ${a.n}</a></li>`)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="ckb" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>سەوزە و میوە لە ${govNameKu} | گەیاندن لە نزیکترین بەقال — عەلوە ALWA</title>
<meta name="description" content="سەوزە و میوە لە پارێزگای ${govNameKu} داوا بکە بە ئەپی عەلوە. گەیاندن لە نزیکترین بەقال لە ${gov.a.length} ناوچە.">
<link rel="canonical" href="${SITE}/ckb/iraq/${gov.g}/">
<link rel="alternate" hreflang="ar" href="${SITE}/iraq/${gov.g}/">
<link rel="alternate" hreflang="ckb" href="${SITE}/ckb/iraq/${gov.g}/">
<style>
body{font-family:'Cairo',sans-serif;padding:20px;max-width:900px;margin:0 auto;line-height:1.75}
h1{color:#04722b;margin-bottom:20px}
ul{columns:2;list-style:none;padding:0}
li{padding:6px 0;border-bottom:1px solid #eee}
a{color:#04722b;text-decoration:none}
a:hover{text-decoration:underline}
</style>
</head>
<body>
<h1>سەوزە و میوە لە ${govNameKu} — ڕێبەری تەواو</h1>
<p>هەموو ناوچەکانی ${govNameKu} (${gov.a.length} ناوچە) بگەڕێ و سەوزە و میوەکەت لە نزیکترین بەقال داوا بکە.</p>
<ul>${list}</ul>
<p><a href="/">← سەرەکی</a></p>
</body>
</html>`;
}

// ═══════════════════════════════════════════
// التوليد
// ═══════════════════════════════════════════
let arAreaCount = 0;
let kuAreaCount = 0;

regions.forEach(gov => {
  // صفحة المحافظة العربية
  const govDir = path.join(OUT, 'iraq', gov.g);
  fs.mkdirSync(govDir, { recursive: true });
  fs.writeFileSync(path.join(govDir, 'index.html'), makeGovPage(gov));

  // صفحات المناطق العربية
  gov.a.forEach(area => {
    const areaDir = path.join(govDir, area.s);
    fs.mkdirSync(areaDir, { recursive: true });
    fs.writeFileSync(path.join(areaDir, 'index.html'), makePage(gov, area));
    arAreaCount++;
  });

  // النسخة الكردية
  if (KURDISH_GOVS.includes(gov.g)) {
    const govNameKu = GOV_NAMES_KU[gov.g];
    const kuGovDir = path.join(OUT, 'ckb', 'iraq', gov.g);
    fs.mkdirSync(kuGovDir, { recursive: true });
    fs.writeFileSync(path.join(kuGovDir, 'index.html'), makeKuGovPage(gov, govNameKu));

    gov.a.forEach(area => {
      const kuAreaDir = path.join(kuGovDir, area.s);
      fs.mkdirSync(kuAreaDir, { recursive: true });
      fs.writeFileSync(path.join(kuAreaDir, 'index.html'), makeKuPage(gov, area, govNameKu));
      kuAreaCount++;
    });
  }
});

console.log(`✅ ${arAreaCount} صفحة منطقة عربية + ${regions.length} صفحة محافظة عربية`);
console.log(`✅ ${kuAreaCount} صفحة منطقة كردية + ${KURDISH_GOVS.length} صفحة محافظة كردية`);
console.log(`📂 في: ${OUT}/iraq/ و ${OUT}/ckb/`);
