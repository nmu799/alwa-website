const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://biaasenkbydtmyqbtvzx.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable__aROsRno3ozsTymS1KTuGg_yazb3C_U';

const SITE_URL = 'https://alwairaq.com';
const NEWS_DIR = './docs/news';

// دالة لجلب المقالات من Supabase بشكل آمن
async function fetchArticles() {
    console.log("جاري الاتصال بـ Supabase...");
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/articles?status=eq.published&select=*`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!res.ok) {
            console.error("خطأ من السيرفر:", res.status, res.statusText);
            const errorText = await res.text();
            console.error("تفاصيل الخطأ:", errorText);
            return [];
        }

        const data = await res.json();
        
        // التحقق من أن البيانات عبارة عن مصفوفة (Array)
        if (!Array.isArray(data)) {
            console.error("تنبيه: البيانات المستلمة ليست مصفوفة. البيانات هي:", data);
            return [];
        }
        
        return data;

    } catch (error) {
        console.error("فشل الاتصال تماماً:", error.message);
        return [];
    }
}

// دالة لإنشاء صفحة المقال
function generateArticleHtml(article) {
    const date = new Date(article.published_at).toLocaleDateString('ar-IQ', { year: 'numeric', month: 'long', day: 'numeric' });
    const image = article.image_url || `${SITE_URL}/alwa-og.jpg`;
    
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${article.seo_title || article.title} | علوة نيوز</title>
    <meta name="description" content="${article.seo_description || article.excerpt || ''}">
    <link rel="canonical" href="${SITE_URL}/news/${article.slug}.html">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${article.title}">
    <meta property="og:description" content="${article.seo_description || article.excerpt || ''}">
    <meta property="og:image" content="${image}">
    <meta property="og:url" content="${SITE_URL}/news/${article.slug}.html">
    <meta property="og:type" content="article">
    
    <!-- NewsArticle Schema for Google Discover -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": "${article.title}",
      "image": ["${image}"],
      "datePublished": "${article.published_at}",
      "dateModified": "${article.updated_at}",
      "author": [{"@type": "Person", "name": "${article.author_name}"}],
      "publisher": {"@type": "Organization", "name": "علوة نيوز", "logo": {"@type": "ImageObject", "url": "${SITE_URL}/AlwaLogo.svg"}}
    }
    </script>

    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root { --primary: #04722b; --orange: #ff6600; --bg: #f9f9f9; --ink: #1c1f26; }
        body { font-family: 'Cairo', sans-serif; background: var(--bg); color: var(--ink); margin: 0; line-height: 1.8; }
        header { background: #fff; padding: 15px; border-bottom: 3px solid var(--primary); text-align: center; }
        header img { height: 50px; }
        .container { max-width: 800px; margin: 20px auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        h1 { color: var(--primary); font-size: 1.8rem; margin-bottom: 10px; line-height: 1.4; }
        .meta { color: #666; font-size: 0.9rem; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
        .meta span { margin-left: 15px; }
        .main-image { width: 100%; border-radius: 8px; margin-bottom: 20px; object-fit: cover; max-height: 500px; }
        .content { font-size: 1.1rem; color: #333; }
        .content p { margin-bottom: 15px; }
        footer { text-align: center; padding: 20px; color: #666; font-size: 0.9rem; margin-top: 40px; border-top: 1px solid #ddd; }
        footer a { color: var(--primary); text-decoration: none; font-weight: bold; }
    </style>
</head>
<body>
    <header>
        <a href="${SITE_URL}"><img src="${SITE_URL}/AlwaLogo.svg" alt="علوة"></a>
    </header>
    <div class="container">
        <h1>${article.title}</h1>
        <div class="meta">
            <span>✍️ ${article.author_name}</span>
            <span>📅 ${date}</span>
            <span>📰 علوة نيوز</span>
        </div>
        ${article.image_url ? `<img src="${article.image_url}" alt="${article.title}" class="main-image">` : ''}
        <div class="content">
            ${article.content}
        </div>
    </div>
    <footer>
        <p>جميع الحقوق محفوظة &copy; ${new Date().getFullYear()} <a href="${SITE_URL}">علوة ALWA</a></p>
        <p><a href="${SITE_URL}/news/">العودة إلى قسم الأخبار</a></p>
    </footer>
</body>
</html>`;
}

// دالة لإنشاء صفحة الأرشيف الرئيسية للأخبار
function generateIndexHtml(articles) {
    let cards = '';
    articles.forEach(a => {
        const date = new Date(a.published_at).toLocaleDateString('ar-IQ');
        cards += `
        <a href="${SITE_URL}/news/${a.slug}.html" class="card">
            ${a.image_url ? `<img src="${a.image_url}" alt="${a.title}">` : ''}
            <div class="card-body">
                <h3>${a.title}</h3>
                <p>${a.excerpt || ''}</p>
                <div class="card-meta">📅 ${date} | ✍️ ${a.author_name}</div>
            </div>
        </a>`;
    });

    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>علوة نيوز | أخبار وأسواق الخضار والفواكه في العراق</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root { --primary: #04722b; --orange: #ff6600; --bg: #f6f7f9; --ink: #1c1f26; }
        body { font-family: 'Cairo', sans-serif; background: var(--bg); margin: 0; color: var(--ink); }
        header { background: var(--primary); color: #fff; padding: 20px; text-align: center; }
        header h1 { margin: 0; font-size: 2rem; }
        header p { margin: 5px 0 0; color: #d4edda; }
        .container { max-width: 1200px; margin: 30px auto; padding: 0 15px; display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .card { background: #fff; border-radius: 8px; overflow: hidden; text-decoration: none; color: inherit; box-shadow: 0 4px 10px rgba(0,0,0,0.05); transition: transform 0.2s; display: flex; flex-direction: column; }
        .card:hover { transform: translateY(-5px); }
        .card img { width: 100%; height: 200px; object-fit: cover; }
        .card-body { padding: 15px; flex-grow: 1; display: flex; flex-direction: column; }
        .card h3 { margin: 0 0 10px; color: var(--primary); font-size: 1.2rem; }
        .card p { margin: 0 0 15px; color: #666; font-size: 0.9rem; flex-grow: 1; }
        .card-meta { font-size: 0.8rem; color: #999; margin-top: auto; }
        footer { text-align: center; padding: 30px; background: #023d17; color: #aaa; margin-top: 40px; }
        footer a { color: var(--orange); text-decoration: none; }
    </style>
</head>
<body>
    <header>
        <h1>علوة نيوز</h1>
        <p>أخبار وأسواق الخضار والفواكه في العراق</p>
    </header>
    <div class="container">
        ${cards || '<p style="text-align:center; grid-column: 1/-1;">لا توجد مقالات منشورة بعد.</p>'}
    </div>
    <footer>
        <p>تابعنا على تطبيق <a href="${SITE_URL}">علوة ALWA</a></p>
    </footer>
</body>
</html>`;
}

// التشغيل الرئيسي
async function main() {
    console.log('بدء العملية...');
    const articles = await fetchArticles();
    
    if (articles.length === 0) {
        console.log('لم يتم العثور على مقالات منشورة أو حدث خطأ في الجلب. سيتم إنشاء صفحة فارغة.');
    } else {
        console.log(`تم العثور على ${articles.length} مقال منشور.`);
    }
    
    if (!fs.existsSync(NEWS_DIR)) {
        fs.mkdirSync(NEWS_DIR, { recursive: true });
    }

    // إنشاء صفحة لكل مقال
    articles.forEach(article => {
        const html = generateArticleHtml(article);
        fs.writeFileSync(path.join(NEWS_DIR, `${article.slug}.html`), html);
        console.log(`تم إنشاء صفحة: ${article.slug}.html`);
    });

    // إنشاء صفحة الأرشيف
    const indexHtml = generateIndexHtml(articles);
    fs.writeFileSync(path.join(NEWS_DIR, 'index.html'), indexHtml);
    console.log('تم إنشاء صفحة الأرشيف الرئيسية news/index.html');
}

main().catch(console.error);
