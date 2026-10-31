const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://biaasenkbydtmyqbtvzx.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable__aROsRno3ozsTymS1KTuGg_yazb3C_U';

const SITE_URL = 'https://alwairaq.com';
const NEWS_DIR = './docs/news';

// دالة جلب البيانات الآمنة
async function fetchData(endpoint) {
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("فشل الاتصال:", error.message);
        return [];
    }
}

// قالب صفحة المقال الفردي (مع إضافة BreadcrumbList)
function generateArticleHtml(article, categoryName) {
    const date = new Date(article.published_at).toLocaleDateString('ar-IQ', { year: 'numeric', month: 'long', day: 'numeric' });
    const image = article.image_url || `${SITE_URL}/alwa-og.jpg`;
    
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${article.title} | علوة نيوز</title>
    <meta name="description" content="${article.excerpt || ''}">
    <link rel="canonical" href="${SITE_URL}/news/${article.slug}.html">
    
    <meta property="og:title" content="${article.title}">
    <meta property="og:description" content="${article.excerpt || ''}">
    <meta property="og:image" content="${image}">
    <meta property="og:url" content="${SITE_URL}/news/${article.slug}.html">
    <meta property="og:type" content="article">
    
    <!-- Article Schema -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": "${article.title}",
      "image": ["${image}"],
      "datePublished": "${article.published_at}",
      "dateModified": "${article.updated_at}",
      "author": [{"@type": "Person", "name": "إدارة علوة"}],
      "publisher": {"@type": "Organization", "name": "علوة نيوز", "logo": {"@type": "ImageObject", "url": "${SITE_URL}/AlwaLogo.svg"}}
    }
    </script>

    <!-- BreadcrumbList Schema -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [{
        "@type": "ListItem",
        "position": 1,
        "name": "الرئيسية",
        "item": "${SITE_URL}/"
      },{
        "@type": "ListItem",
        "position": 2,
        "name": "علوة نيوز",
        "item": "${SITE_URL}/news/"
      },{
        "@type": "ListItem",
        "position": 3,
        "name": "${article.title}"
      }]
    }
    </script>

    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root { --primary: #04722b; --orange: #ff6600; --bg: #f9f9f9; --ink: #1c1f26; }
        body { font-family: 'Cairo', sans-serif; background: var(--bg); color: var(--ink); margin: 0; line-height: 1.8; }
        header { background: #fff; padding: 15px; border-bottom: 3px solid var(--primary); text-align: center; }
        header a { display: inline-block; }
        header img { height: 50px; }
        .container { max-width: 800px; margin: 20px auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .cat-badge { display: inline-block; background: #e8f3ec; color: var(--primary); padding: 4px 12px; border-radius: 4px; font-size: 0.9rem; font-weight: bold; margin-bottom: 10px; }
        h1 { color: var(--primary); font-size: 1.8rem; margin-bottom: 10px; line-height: 1.4; }
        .meta { color: #666; font-size: 0.9rem; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
        .meta span { margin-left: 15px; }
        .main-image { width: 100%; border-radius: 8px; margin-bottom: 20px; object-fit: cover; max-height: 500px; }
        .content { font-size: 1.1rem; color: #333; }
        footer { text-align: center; padding: 20px; color: #666; font-size: 0.9rem; margin-top: 40px; border-top: 1px solid #ddd; }
        footer a { color: var(--primary); text-decoration: none; font-weight: bold; }
    </style>
</head>
<body>
    <header>
        <a href="${SITE_URL}"><img src="${SITE_URL}/AlwaLogo.svg" alt="علوة"></a>
    </header>
    <div class="container">
        ${categoryName ? `<span class="cat-badge">${categoryName}</span>` : ''}
        <h1>${article.title}</h1>
        <div class="meta">
            <span>✍️ إدارة علوة</span>
            <span>📅 ${date}</span>
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

// قالب صفحة الأرشيف (مع السلايدر والتصنيفات)
function generateIndexHtml(articles, categories) {
    let cards = '';
    let sliderHtml = '';

    // بناء السلايدر (أحدث 5 مقالات)
    if (articles.length > 0) {
        const sliderArticles = articles.slice(0, 5);
        sliderArticles.forEach((a, index) => {
            sliderHtml += `
            <a href="${SITE_URL}/news/${a.slug}.html" class="slide ${index === 0 ? 'active' : ''}" style="background-image: url('${a.image_url || SITE_URL + '/alwa-og.jpg'}');">
                <div class="slide-content">
                    <h2>${a.title}</h2>
                </div>
            </a>`;
        });
    }

    // بناء بطاقات الأرشيف
    articles.forEach(a => {
        const date = new Date(a.published_at).toLocaleDateString('ar-IQ');
        const cat = categories.find(c => c.id === a.category_id);
        const catName = cat ? cat.name : 'عام';
        
        cards += `
        <a href="${SITE_URL}/news/${a.slug}.html" class="card" data-category="${a.category_id || 'all'}">
            ${a.image_url ? `<img src="${a.image_url}" alt="${a.title}">` : ''}
            <div class="card-body">
                <span class="cat-badge">${catName}</span>
                <h3>${a.title}</h3>
                <p>${a.excerpt || ''}</p>
                <div class="card-meta">📅 ${date}</div>
            </div>
        </a>`;
    });

    let filterButtons = `<button class="filter-btn active" onclick="filterNews('all', this)">كل الأخبار</button>`;
    categories.forEach(c => {
        filterButtons += `<button class="filter-btn" onclick="filterNews('${c.id}', this)">${c.name}</button>`;
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
        
        /* تنسيق السلايدر */
        .slider-wrapper { max-width: 1200px; margin: 20px auto 0; padding: 0 15px; }
        .slider { position: relative; width: 100%; height: 350px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.15); }
        .slide { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-size: cover; background-position: center; opacity: 0; transition: opacity 0.8s ease-in-out; text-decoration: none; display: flex; align-items: flex-end; }
        .slide.active { opacity: 1; z-index: 2; }
        .slide-content { background: linear-gradient(transparent, rgba(0,0,0,0.85)); width: 100%; padding: 20px; color: #fff; box-sizing: border-box; }
        .slide-content h2 { margin: 0; font-size: 1.5rem; line-height: 1.4; color: #fff; text-shadow: 1px 1px 3px rgba(0,0,0,0.8); }

        .filters { text-align: center; margin: 30px auto 20px; max-width: 1200px; padding: 0 15px; }
        .filter-btn { background: #fff; border: 1px solid #ccc; padding: 8px 16px; margin: 5px; border-radius: 20px; cursor: pointer; font-family: 'Cairo'; font-weight: 600; color: #555; transition: 0.2s; }
        .filter-btn:hover { border-color: var(--primary); color: var(--primary); }
        .filter-btn.active { background: var(--primary); color: #fff; border-color: var(--primary); }

        .container { max-width: 1200px; margin: 0 auto 30px; padding: 0 15px; display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .card { background: #fff; border-radius: 8px; overflow: hidden; text-decoration: none; color: inherit; box-shadow: 0 4px 10px rgba(0,0,0,0.05); transition: transform 0.2s; display: flex; flex-direction: column; }
        .card:hover { transform: translateY(-5px); }
        .card img { width: 100%; height: 200px; object-fit: cover; }
        .card-body { padding: 15px; flex-grow: 1; display: flex; flex-direction: column; }
        .cat-badge { display: inline-block; background: #fff0e6; color: var(--orange); padding: 2px 10px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; margin-bottom: 10px; width: fit-content; }
        .card h3 { margin: 0 0 10px; color: var(--primary); font-size: 1.2rem; }
        .card p { margin: 0 0 15px; color: #666; font-size: 0.9rem; flex-grow: 1; }
        .card-meta { font-size: 0.8rem; color: #999; margin-top: auto; }
        footer { text-align: center; padding: 30px; background: #023d17; color: #aaa; margin-top: 40px; }
        footer a { color: var(--orange); text-decoration: none; }

        @media (max-width: 768px) {
            .slider { height: 250px; }
            .slide-content h2 { font-size: 1.2rem; }
        }
    </style>
</head>
<body>
    <header>
        <h1>علوة نيوز</h1>
        <p>أخبار وأسواق الخضار والفواكه في العراق</p>
    </header>

    ${articles.length > 0 ? `
    <div class="slider-wrapper">
        <div class="slider">
            ${sliderHtml}
        </div>
    </div>
    ` : ''}

    <div class="filters">
        ${filterButtons}
    </div>

    <div class="container" id="news-container">
        ${cards || '<p style="text-align:center; grid-column: 1/-1;">لا توجد مقالات منشورة بعد.</p>'}
    </div>

    <footer>
        <p>تابعنا على تطبيق <a href="${SITE_URL}">علوة ALWA</a></p>
    </footer>

    <script>
        // حركة السلايدر التلقائية (كل 3 ثواني)
        let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');
        
        if (slides.length > 1) {
            setInterval(() => {
                slides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active');
            }, 3000);
        }

        // دالة تصفية المقالات
        function filterNews(categoryId, btn) {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const cards = document.querySelectorAll('.card');
            cards.forEach(card => {
                if(categoryId === 'all' || card.getAttribute('data-category') === categoryId) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        }
    </script>
</body>
</html>`;
}

async function main() {
    console.log('جاري جلب البيانات...');
    const articles = await fetchData('articles?status=eq.published&select=*&order=published_at.desc');
    const categories = await fetchData('categories?select=*');
    
    console.log(`تم العثور على ${articles.length} مقال و ${categories.length} تصنيف.`);
    
    if (!fs.existsSync(NEWS_DIR)) {
        fs.mkdirSync(NEWS_DIR, { recursive: true });
    }

    articles.forEach(article => {
        const cat = categories.find(c => c.id === article.category_id);
        const html = generateArticleHtml(article, cat ? cat.name : '');
        fs.writeFileSync(path.join(NEWS_DIR, `${article.slug}.html`), html);
        console.log(`تم إنشاء صفحة: ${article.slug}.html`);
    });

    const indexHtml = generateIndexHtml(articles, categories);
    fs.writeFileSync(path.join(NEWS_DIR, 'index.html'), indexHtml);
    console.log('تم إنشاء صفحة الأرشيف الرئيسية news/index.html');
}

main().catch(console.error);
