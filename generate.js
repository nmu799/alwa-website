// generate.js — يولّد كل صفحات المناطق
const fs = require('fs');
const path = require('path');
const regions = require('./regions.json');

const SITE = 'https://alwairaq.com';
const OUT = './public';
let count = 0;

// حذف المجلد القديم
if (fs.existsSync(OUT + '/iraq')) {
  fs.rmSync(OUT + '/iraq', { recursive: true });
}

// قالب الصفحة
function makePage(gov, area) {
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
<link rel="alternate" hreflang="ckb" href="${SITE}/ckb/iraq/${gov.g}/${area.s}/">
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

<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Cairo',system-ui,sans-serif;background:#fff;color:#1c1f26;line-height:1.75;padding:0}
.wrap{max-width:900px;margin:0 auto;padding:20px}
header{background:#04722b;color:#fff;padding:14px 0;margin-bottom:24px}
header .wrap{display:flex;gap:12px;align-items:center;padding:0 20px}
header a{color:#fff;text-decoration:none;font-weight:600}
h1{color:#04722b;font-size:1.9rem;margin-bottom:12px}
h2{color:#035a22;font-size:1.3rem;margin:28px 0 12px}
p{margin-bottom:14px;color:#4b5160}
ul{margin:12px 0 20px 20px;color:#4b5160}
li{padding:4px 0}
a{color:#04722b}
.cta{display:inline-block;background:#ff6600;color:#fff;padding:14px 28px;border-radius:6px;font-weight:700;text-decoration:none;margin:20px 0}
.cta:hover{background:#cc5200}
footer{background:#023d17;color:#fff;text-align:center;padding:24px;margin-top:48px}
footer a{color:#f1c548}
</style>
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
  <p>تُحدَّث الأسعار يومياً اعتماداً على العلاوي المركزية في ${gov.ga}. <a href="/prices/${gov.g}/">اطلع على الأسعار اليومية</a>.</p>

  <h2>العلوي القريبة من ${area.n}</h2>
  <p>يخدم ${area.n} أقرب العلاوي في ${gov.ga}. <a href="/markets/">دليل العلاوي الكامل في العراق</a>.</p>

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
  <p><a href="/">الرئيسية</a> · <a href="/markets/">العلاوي</a> · <a href="/prices/">الأسعار</a></p>
</footer>
</body>
</html>`;
}

// توليد صفحة المحافظة
function makeGovPage(gov) {
  const list = gov.a.map(a => `<li><a href="/iraq/${gov.g}/${a.s}/">خضار وفواكه ${a.n}</a></li>`).join('\n');
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>خضار وفواكه ${gov.ga} | توصيل من أقرب بقال — علوة ALWA</title>
<meta name="description" content="اطلب خضار وفواكه في محافظة ${gov.ga} عبر تطبيق علوة. توصيل من أقرب بقال في ${gov.a.length} منطقة.">
<link rel="canonical" href="${SITE}/iraq/${gov.g}/">
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
<h1>خضار وفواكه ${gov.ga} — دليل كامل</h1>
<p>تصفح جميع مناطق ${gov.ga} (${gov.a.length} منطقة) واطلب خضارك وفواكهك من أقرب بقال.</p>
<ul>${list}</ul>
<p><a href="/">← الرئيسية</a></p>
</body>
</html>`;
}

// توليد كل شيء
regions.forEach(gov => {
  // صفحة المحافظة
  const govDir = path.join(OUT, 'iraq', gov.g);
  fs.mkdirSync(govDir, { recursive: true });
  fs.writeFileSync(path.join(govDir, 'index.html'), makeGovPage(gov));

  // صفحات المناطق
  gov.a.forEach(area => {
    const areaDir = path.join(govDir, area.s);
    fs.mkdirSync(areaDir, { recursive: true });
    fs.writeFileSync(path.join(areaDir, 'index.html'), makePage(gov, area));
    count++;
  });
});

console.log(`✅ تم توليد ${count} صفحة منطقة + ${regions.length} صفحة محافظة`);
console.log(`📂 في: ${OUT}/iraq/`);
