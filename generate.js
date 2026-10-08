// generate.js — يولّد صفحات عربية + كردية ببيانات حقيقية
const fs = require('fs');
const path = require('path');
const regions = require('./regions.json');

const SITE = 'https://alwairaq.com';
const OUT = './docs';

const KURDISH_GOVS = ['erbil', 'sulaymaniyah', 'duhok', 'halabja'];
const GOV_NAMES_KU = {
  erbil: 'هەولێر',
  sulaymaniyah: 'سلێمانی',
  duhok: 'دهۆک',
  halabja: 'هەڵەبجە'
};

// ═══════════════════════════════════════════════════════
// 62 منتجاً — بلا أسعار (البقال يحدد السعر)
// ═══════════════════════════════════════════════════════
const PRODUCTS = [
  { f:'alwa-iraq-tomato-01.webp',            ar:'طماطم',          ku:'تەماتە' },
  { f:'alwa-iraq-cucumber-01.webp',          ar:'خيار',           ku:'خەیار' },
  { f:'alwa-iraq-potato-01.webp',            ar:'بطاطا',          ku:'پەتاتە' },
  { f:'alwa-iraq-onion-01.webp',             ar:'بصل',            ku:'پیاز' },
  { f:'alwa-iraq-carrot-01.webp',            ar:'جزر',            ku:'گێزەر' },
  { f:'alwa-iraq-eggplant-01.webp',          ar:'باذنجان',        ku:'بادمجان' },
  { f:'alwa-iraq-zucchini-01.webp',          ar:'كوسا',           ku:'کولەکە' },
  { f:'alwa-iraq-okra-01.webp',              ar:'بامية',          ku:'بامیە' },
  { f:'alwa-iraq-green-beans-01.webp',       ar:'لوبيا خضراء',    ku:'لۆبیای سەوز' },
  { f:'alwa-iraq-peas-01.webp',              ar:'بازلاء',         ku:'بازێلا' },
  { f:'alwa-iraq-fava-beans-01.webp',        ar:'فول',            ku:'فاوا' },
  { f:'alwa-iraq-cabbage-01.webp',           ar:'ملفوف',          ku:'کەلەم' },
  { f:'alwa-iraq-cauliflower-01.webp',       ar:'قرنبيط',         ku:'گوڵپی' },
  { f:'alwa-iraq-broccoli-01.webp',          ar:'بروكلي',         ku:'برۆکلی' },
  { f:'alwa-iraq-beetroot-01.webp',          ar:'شمندر',          ku:'شەمەندەر' },
  { f:'alwa-iraq-turnip-01.webp',            ar:'شلغم',           ku:'شەلجام' },
  { f:'alwa-iraq-red-radish-01.webp',        ar:'فجل أحمر',       ku:'تورپی سوور' },
  { f:'alwa-iraq-leek-01.webp',              ar:'كراث',           ku:'کوڕاث' },
  { f:'alwa-iraq-garlic-01.webp',            ar:'ثوم',            ku:'سیر' },
  { f:'alwa-iraq-pumpkin-01.webp',           ar:'يقطين',          ku:'کەدوو' },
  { f:'alwa-iraq-sweet-potato-01.webp',      ar:'بطاطا حلوة',     ku:'پەتاتەی شیرین' },
  { f:'alwa-iraq-spinach-01.webp',           ar:'سبانخ',          ku:'سپێناخ' },
  { f:'alwa-iraq-swiss-chard-01.webp',       ar:'سلق',            ku:'سەلەق' },
  { f:'alwa-iraq-lettuce-01.webp',           ar:'خس',             ku:'کاهوو' },
  { f:'alwa-iraq-celery-01.webp',            ar:'كرفس',           ku:'کەرەوز' },
  { f:'alwa-iraq-green-onion-01.webp',       ar:'بصل أخضر',       ku:'پیازی سەوز' },
  { f:'alwa-iraq-arugula-01.webp',           ar:'جرجير',          ku:'جەرجیر' },
  { f:'alwa-iraq-parsley-01.webp',           ar:'بقدونس',         ku:'بەقدوونس' },
  { f:'alwa-iraq-coriander-01.webp',         ar:'كزبرة',          ku:'گشنیز' },
  { f:'alwa-iraq-dill-01.webp',              ar:'شبت',            ku:'شەوێت' },
  { f:'alwa-iraq-mint-01.webp',              ar:'نعنع',           ku:'نەعنا' },
  { f:'alwa-iraq-basil-01.webp',             ar:'حبق',            ku:'ڕەیحان' },
  { f:'alwa-iraq-malva-01.webp',             ar:'خبازة',          ku:'خەبازە' },
  { f:'alwa-iraq-chili-01.webp',             ar:'فلفل حار',       ku:'بیبەری تیژ' },
  { f:'alwa-iraq-green-pepper-mild-01.webp', ar:'فلفل أخضر',      ku:'بیبەری سەوز' },
  { f:'alwa-iraq-colored-bell-pepper-01.webp',ar:'فلفل ملون',     ku:'بیبەری ڕەنگاوڕەنگ' },
  { f:'alwa-iraq-mushroom-01.webp',          ar:'مشروم',          ku:'قارچک' },
  { f:'alwa-iraq-dates-01.webp',             ar:'تمر',            ku:'خورما' },
  { f:'alwa-iraq-banana-01.webp',            ar:'موز',            ku:'مۆز' },
  { f:'alwa-iraq-orange-01.webp',            ar:'برتقال',         ku:'پرتەقاڵ' },
  { f:'alwa-iraq-tangerine-01.webp',         ar:'يوسفي',          ku:'پرتەقاڵی مندەلین' },
  { f:'alwa-iraq-lemon-01.webp',             ar:'ليمون',          ku:'لیمۆ' },
  { f:'alwa-iraq-grape-01.webp',             ar:'عنب',            ku:'ترێ' },
  { f:'alwa-iraq-pomegranate-01.webp',       ar:'رمان',           ku:'هەنار' },
  { f:'alwa-iraq-fig-01.webp',               ar:'تين',            ku:'هەنجیر' },
  { f:'alwa-iraq-mulberry-01.webp',          ar:'توت',            ku:'توو' },
  { f:'alwa-iraq-apricot-01.webp',           ar:'مشمش',           ku:'قەیسی' },
  { f:'alwa-iraq-peach-01.webp',             ar:'خوخ',            ku:'قۆخ' },
  { f:'alwa-iraq-plum-01.webp',              ar:'برقوق',          ku:'هەڵووژە' },
  { f:'alwa-iraq-cherry-01.webp',            ar:'كرز',            ku:'گێلاس' },
  { f:'alwa-iraq-pear-01.webp',              ar:'كمثرى',          ku:'هەرمێ' },
  { f:'alwa-iraq-quince-01.webp',            ar:'سفرجل',          ku:'بێهی' },
  { f:'alwa-iraq-watermelon-01.webp',        ar:'رقي',            ku:'زەبەش' },
  { f:'alwa-iraq-melon-01.webp',             ar:'شمام',           ku:'شەمامە' },
  { f:'alwa-iraq-dosakai-melon-01.webp',     ar:'بطيخ دوساكاي',   ku:'دۆساکای' },
  { f:'alwa-iraq-strawberry-01.webp',        ar:'فراولة',         ku:'فڕاولە' },
  { f:'alwa-iraq-kiwi-01.webp',              ar:'كيوي',           ku:'کیوی' },
  { f:'alwa-iraq-guava-01.webp',             ar:'جوافة',          ku:'گوایا' },
  { f:'alwa-iraq-mango-01.webp',             ar:'مانجو',          ku:'مانگۆ' },
  { f:'alwa-iraq-pineapple-01.webp',         ar:'أناناس',         ku:'ئەناناس' },
  { f:'alwa-iraq-avocado-01.webp',           ar:'أفوكادو',        ku:'ئەڤۆکادۆ' },
  { f:'alwa-iraq-sidr-01.webp',              ar:'سدر',            ku:'سیدر' },
];

// ═══════════════════════════════════════════════════════
// العلاوي المركزية الحقيقية حسب المحافظة
// ═══════════════════════════════════════════════════════
const CENTRAL_MARKETS = {
  baghdad: [
    'علوة بغداد المركزية (الرمل)',
    'علوة الرشيد النموذجية',
    'علوة التعاون',
    'علوة جميلة',
    'علوة التاجيات',
    'علوة البالوني',
    'علوة الزيدان'
  ],
  karbala: ['علوة الإمامين - كربلاء'],
  wasit: ['علوة الكوت'],
  'al-muthanna': ['علوة السماوة'],
  basra: ['علوة حمدان - البصرة'],
  kirkuk: ['علوة كركوك النموذجية'],
  erbil: ['علوة عنكاوا - أربيل'],
  sulaymaniyah: ['علوة السليمانية', 'علوة كلار'],
  anbar: ['علوة بغداد المركزية (الرمل)'],
  najaf: ['علوة كربلاء (الإمامين)', 'علوة الحلة'],
  babil: ['علوة الحلة'],
  'dhi-qar': ['علوة الناصرية'],
  maysan: ['علوة العمارة'],
  'al-qadisiyah': ['علوة الديوانية'],
  'salah-al-din': ['علوة بغداد المركزية (الرمل)'],
  diyala: ['علوة بعقوبة'],
  duhok: ['علوة دهوك'],
  nineveh: ['علوة الموصل'],
  halabja: ['علوة السليمانية', 'علوة حلبجة']
};

const MARKETS_KU = {
  erbil: ['عەلوەی عەنکاوا - هەولێر'],
  sulaymaniyah: ['عەلوەی سلێمانی', 'عەلوەی کەلار'],
  duhok: ['عەلوەی دهۆک'],
  halabja: ['عەلوەی سلێمانی', 'عەلوەی هەڵەبجە']
};

// ═══════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════
function hash(s){let h=0;for(let i=0;i<s.length;i++){h=((h<<5)-h+s.charCodeAt(i))|0;}return Math.abs(h);}

function pickN(seed,n,total){
  const h=hash(seed);const out=new Set();let i=0;
  while(out.size<n && i<total*4){out.add((h+i*7)%total);i++;}
  return [...out].slice(0,n);
}

function pickProducts(seed,n=9){
  return pickN(seed,n,PRODUCTS.length).map(i=>PRODUCTS[i]);
}

function pickOne(seed,arr){return arr[hash(seed)%arr.length];}

function nearbyAreas(gov,currentSlug,n=5){
  const others=gov.a.filter(a=>a.s!==currentSlug);
  if(!others.length)return[];
  return pickN(currentSlug+gov.g,n,others.length).map(i=>others[i]);
}

// ═══════════════════════════════════════════════════════
// 6 قوالب مقدمة عربية
// ═══════════════════════════════════════════════════════
const AR_INTROS=[
  (a,g)=>`اطلب الخضار والفواكه الطازجة في <strong>${a}</strong>، محافظة <strong>${g}</strong>، عبر تطبيق علوة ALWA. يُرسل طلبك تلقائياً لكل البقالين في منطقتك، وتستقبل عروضهم، وتختار الأنسب — بسعر يحدده البقال ويشمل التوصيل.`,
  (a,g)=>`من العلاوي المركزية في <strong>${g}</strong> إلى باب منزلك في <strong>${a}</strong> — علوة ALWA يربطك بأقرب بقال في منطقتك، ويعرض لك العروض المتاحة لتختار الأنسب من حيث السعر ووقت التوصيل.`,
  (a,g)=>`تبحث عن خضار طازج وفواكه موسمية في <strong>${a}</strong>؟ تطبيق علوة يعرض لك البقالين النشطين في منطقتك بأسعارهم وأوقات توصيلهم، فتختار الأنسب بدون وسطاء.`,
  (a,g)=>`أصبح طلب الخضار والفواكه في <strong>${a}</strong> أسهل من أي وقت. علوة ALWA يربطك بأقرب بقال في منطقتك، ويعرض لك بضاعة العلاوي المركزية في ${g} عبر البث المباشر.`,
  (a,g)=>`<strong>${a}</strong> — خضار وفواكه طازجة يومياً. تطبيق علوة يُرسل طلبك لبقالي منطقتك، ويعرض عليك عروضهم، وتختار الأنسب بضغطة زر.`,
  (a,g)=>`مع علوة ALWA، تستطيع طلب الخضار والفواكه في <strong>${a}</strong> بضغطة زر. السعر يحدده البقال ويشمل التوصيل، وأنت تختار العرض الأنسب من بين العروض الواردة.`,
];

const KU_INTROS=[
  (a,g)=>`سەوزە و میوەی تازە لە <strong>${a}</strong>، پارێزگای <strong>${g}</strong> داوا بکە بە ئەپی <strong>عەلوە ALWA</strong>. داواکاریەکەت بۆ هەموو بەقالەکانی ناوچەکەت دەنێردرێت، پێشنیارەکانیان وەردەگریت، و باشترینیان هەڵدەبژێریت — بە نرخێک کە بەقال دیاری دەکات و گەیاندنیش لەخۆ دەگرێت.`,
  (a,g)=>`لە عەلوە ناوەندییەکانی <strong>${g}</strong> تا دەرگای ماڵەکەت لە <strong>${a}</strong> — عەلوە ALWA تۆ بە نزیکترین بەقال لە ناوچەکەت دەبەستێتەوە، و پێشنیارە بەردەستەکان پیشان دەدات بۆ هەڵبژاردنی باشترین لە ڕووی نرخ و کات.`,
  (a,g)=>`بەدوای سەوزەی تازە و میوەی وەرزیدا دەگەڕێیت لە <strong>${a}</strong>؟ ئەپی عەلوە بەقالە چالاکەکانی ناوچەکەت لەگەڵ نرخ و کاتی گەیاندنیان پیشان دەدات، و تۆ بێ نێوەندگیر باشترینیان هەڵدەبژێریت.`,
  (a,g)=>`داواکردنی سەوزە و میوە لە <strong>${a}</strong> هیچ کات ئاسانتر نەبووە. عەلوە ALWA تۆ بە نزیکترین بەقالەوە دەبەستێتەوە، و کاڵای عەلوە ناوەندییەکانی ${g} بە پەخشی ڕاستەوخۆ پیشان دەدات.`,
  (a,g)=>`<strong>${a}</strong> — سەوزە و میوەی تازە ڕۆژانە. ئەپی عەلوە داواکاریەکەت بۆ بەقالەکانی ناوچەکەت دەنێرێت، پێشنیارەکانیان پیشان دەدات، و تۆ بە یەک کلیک باشترینیان هەڵدەبژێریت.`,
];

// خدمات إضافية فريدة لكل منطقة
const EXTRA_SERVICES_AR=[
  'تتبّع الطلب مباشرة حتى وصوله إلى باب منزلك',
  'إمكانية استقبال عروض متعددة واختيار الأنسب',
  'الدفع نقداً عند التسليم — بدون دفع إلكتروني',
  'خيار التوصيل المجدول لوقت لاحق حسب اتفاقك مع البقال',
  'دعم فني متواصل 24/7 داخل التطبيق',
  'ضمان جودة — تواصل مع البقال مباشرة عند أي ملاحظة',
  'قائمة تسوق محفوظة لإعادة الطلب بضغطة',
  'إمكانية إلغاء الطلب خلال 40٪ من الوقت المتفق عليه',
  'توصيل من البقال مباشرة بدون وسطاء أو عمولات',
  'إمكانية طلب كميات صغيرة من 1 كغم فما فوق',
];
const EXTRA_SERVICES_KU=[
  'شوپانکردنی داواکاری ڕاستەوخۆ تا دەگاتە دەرگای ماڵەکەت',
  'توانای وەرگرتنی چەند پێشنیارێک و هەڵبژاردنی باشترینیان',
  'پارەدان بە کاش لە کاتی گەیاندن — بێ پارەدانی ئەلیکترۆنی',
  'هەڵبژاردەی گەیاندنی کاتژمێری بەپێی ڕێککەوتنت لەگەڵ بەقال',
  'پشتگیری تەکنیکی بەردەوام 24/7 لە ناو ئەپەکەدا',
  'دڵنیایی جۆر — ڕاستەوخۆ پەیوەندی بە بەقال بکە لە کاتی هەر تێبینییەک',
  'لیستی کڕینی پارێزراو بۆ داواکردنەوە بە یەک کلیک',
  'توانای هەڵوەشاندنەوەی داواکاری لە ماوەی 40٪ ی کاتی ڕێککەوتوو',
  'گەیاندن ڕاستەوخۆ لە بەقالەوە بێ نێوەندگیر و بێ کۆمیسیۆن',
  'توانای داواکردنی بڕی کەم لە 1 کیلۆگرام و سەرووتر',
];

// ═══════════════════════════════════════════════════════
// FAQ إضافية (واحدة تُختار لكل منطقة)
// ═══════════════════════════════════════════════════════
const EXTRA_FAQ_AR=[
  { q:'كيف يتم الدفع في التطبيق؟', a:'الدفع نقداً عند التسليم فقط. علوة لا يتعامل مع أي دفع إلكتروني، ولا يفرض أي رسوم.' },
  { q:'هل تطبيق علوة مجاني؟', a:'نعم، مجاني بالكامل بدون رسوم تسجيل أو عمولة على الطلبات.' },
  { q:'كم الحد الأدنى للطلب؟', a:'الحد الأدنى 1 كغم لكل منتج — بدون حد أدنى إجمالي للطلب.' },
  { q:'هل يمكنني الطلب من أكثر من بقال؟', a:'يُرسل طلبك تلقائياً لكل البقالين في منطقتك، وتستقبل عروضهم، ثم تختار واحداً منهم فقط.' },
  { q:'ما هو البقال الموصى به؟', a:'بعد 5 طلبات ناجحة وتقييم إيجابي من العملاء، يتحول البقال تلقائياً إلى "بقال موصى به" في منطقته.' },
  { q:'هل الأسعار قابلة للتفاوض؟', a:'نعم، السعر يحدده البقال بالكامل. التطبيق لا يفرض أي سعر ولا يتدخل في التسعير.' },
  { q:'هل يمكنني إلغاء الطلب؟', a:'نعم خلال 40٪ من الوقت المتفق عليه. بعد ذلك قد يُعرّض الحساب للحظر حمايةً لحقوق البقال.' },
];

const EXTRA_FAQ_KU=[
  { q:'پارەدان لە ئەپەکە چۆنە؟', a:'پارەدان بە کاش لە کاتی گەیاندن تەنها. عەلوە هیچ پارەدانێکی ئەلیکترۆنی نازانێت و هیچ کرێیەک ناسازێنێت.' },
  { q:'ئایا ئەپی عەلوە بەخۆڕاییە؟', a:'بەڵێ، بە تەواوی بەخۆڕاییە بێ کرێی تۆمارکردن یان کۆمیسیۆن لەسەر داواکاری.' },
  { q:'کەمترین بڕی داواکاری چەندە؟', a:'کەمترین بڕ 1 کیلۆگرام بۆ هەر بەرهەمێک — بێ کەمترین بڕی گشتی بۆ داواکاری.' },
  { q:'ئایا دەتوانم لە چەند بەقالێک داوا بکەم؟', a:'داواکاریەکەت بە شێوەیەکی خۆکار بۆ هەموو بەقالەکانی ناوچەکەت دەنێردرێت، پێشنیارەکانیان وەردەگریت، پاشان تەنها یەکێکیان هەڵدەبژێریت.' },
  { q:'بەقالی پێشنیارکراو چییە؟', a:'دوای 5 داواکاری سەرکەوتوو و هەڵسەنگاندنی ئەرێنی لە کڕیارەکان، بەقال بە شێوەیەکی خۆکار دەبێت بە "بەقالی پێشنیارکراو" لە ناوچەکەی.' },
  { q:'ئایا نرخەکان گفتوگۆی لەسەر دەکرێت؟', a:'بەڵێ، نرخ بە تەواوی لەلایەن بەقال دیاری دەکرێت. ئەپ هیچ نرخێک ناسازێنێت و دەستتێوەردان لە نرخدانان ناکات.' },
  { q:'ئایا دەتوانم داواکاری هەڵبوەشێنمەوە؟', a:'بەڵێ لە ماوەی 40٪ ی کاتی ڕێککەوتوو. دوای ئەوە لەوانەیە هەژمارەکە بلۆک بکرێت بۆ پاراستنی مافەکانی بەقال.' },
];

// ═══════════════════════════════════════════════════════
// CSS مشترك
// ═══════════════════════════════════════════════════════
const SHARED_CSS=`<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Cairo',system-ui,sans-serif;background:#fff;color:#1c1f26;line-height:1.75}
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
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px;margin:20px 0}
.card{background:#f6fbf7;border:1px solid #e2efe5;border-radius:10px;overflow:hidden;text-align:center;padding-bottom:12px}
.card img{width:100%;height:140px;object-fit:cover;display:block;background:#eaf3ec}
.card .name{font-weight:700;color:#04722b;margin:10px 4px 4px;font-size:.98rem}
.card .note{font-size:.72rem;color:#888;padding:0 6px}
.steps{background:#f6fbf7;border:1px solid #e2efe5;border-radius:10px;padding:20px;margin:20px 0;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px}
.step{text-align:center}
.step .num{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:#04722b;color:#fff;border-radius:50%;font-weight:700;margin-bottom:10px}
.step h4{color:#035a22;font-size:1rem;margin-bottom:6px}
.step p{font-size:.87rem;color:#4b5160;margin:0}
.markets-list{background:#fff8f0;border:1px solid #ffe2cc;border-radius:10px;padding:16px 20px;margin:16px 0}
.markets-list li{color:#8a4a00}
footer{background:#023d17;color:#fff;text-align:center;padding:24px;margin-top:48px}
footer a{color:#f1c548}
.contact{background:#f6fbf7;border:1px solid #e2efe5;border-radius:10px;padding:16px 20px;margin:20px 0}
.contact a{display:inline-block;margin:4px 10px 4px 0;font-weight:600}
</style>`;

// ═══════════════════════════════════════════════════════
// بطاقة منتج (بدون سعر)
// ═══════════════════════════════════════════════════════
function cardAr(p,areaName){
  return `<div class="card">
  <img src="/${p.f}" alt="${p.ar} طازج في ${areaName} — علوة ALWA" loading="lazy" width="300" height="200">
  <div class="name">${p.ar}</div>
  <div class="note">السعر يحدده البقال</div>
</div>`;
}

function cardKu(p,areaName){
  return `<div class="card">
  <img src="/${p.f}" alt="${p.ku} لە ${areaName} — عەلوە ALWA" loading="lazy" width="300" height="200">
  <div class="name">${p.ku}</div>
  <div class="note">نرخ لەلایەن بەقال دیاری دەکرێت</div>
</div>`;
}

// ═══════════════════════════════════════════════════════
// صفحة منطقة عربية
// ═══════════════════════════════════════════════════════
function makePage(gov,area){
  const seed=`${gov.g}/${area.s}`;
  const hasKu=KURDISH_GOVS.includes(gov.g);
  const kuLink=hasKu?`<link rel="alternate" hreflang="ckb" href="${SITE}/ckb/iraq/${gov.g}/${area.s}/">`:'';

  const products=pickProducts(seed,9);
  const heroProduct=products[0];
  const intro=pickOne(seed+'-intro',AR_INTROS)(area.n,gov.ga);
  const extraService=pickOne(seed+'-svc',EXTRA_SERVICES_AR);
  const extraFaq=pickOne(seed+'-faq',EXTRA_FAQ_AR);

  const gridHtml=products.map(p=>cardAr(p,area.n)).join('\n');
  const nearby=nearbyAreas(gov,area.s,5);
  const nearbyHtml=nearby.map(a=>`<li><a href="/iraq/${gov.g}/${a.s}/">خضار وفواكه ${a.n}</a></li>`).join('');
  const markets=CENTRAL_MARKETS[gov.g]||['العلاوي المركزية في بغداد'];
  const marketsHtml=markets.map(m=>`<li>${m}</li>`).join('');

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>خضار وفواكه ${area.n} | توصيل من أقرب بقال خلال 30 دقيقة — علوة ALWA</title>
<meta name="description" content="اطلب خضار وفواكه طازجة في ${area.n}، ${gov.ga}، عبر تطبيق علوة ALWA. يُرسل طلبك لكل البقالين في منطقتك، وتستقبل عروضهم، وتختار الأنسب. التوصيل من 5 إلى 30 دقيقة. السعر يحدده البقال ويشمل التوصيل.">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${SITE}/iraq/${gov.g}/${area.s}/">
<link rel="alternate" hreflang="ar" href="${SITE}/iraq/${gov.g}/${area.s}/">
${kuLink}
<link rel="alternate" hreflang="x-default" href="${SITE}/iraq/${gov.g}/${area.s}/">
<link rel="icon" type="image/png" href="/alwa.png">
<meta property="og:type" content="website">
<meta property="og:title" content="خضار وفواكه ${area.n} — توصيل خلال 30 دقيقة">
<meta property="og:description" content="اطلب خضار وفواكه طازجة في ${area.n} من أقرب بقال عبر تطبيق علوة ALWA.">
<meta property="og:image" content="${SITE}/${heroProduct.f}">
<meta name="twitter:card" content="summary_large_image">

<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"LocalBusiness",
  "name":"علوة ALWA — توصيل خضار وفواكه في ${area.n}",
  "url":"${SITE}/iraq/${gov.g}/${area.s}/",
  "image":"${SITE}/${heroProduct.f}",
  "telephone":"+9647813130254",
  "email":"alwairaqe@gmail.com",
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
    <a href="/">علوة ALWA</a><span>›</span>
    <a href="/iraq/${gov.g}/">${gov.ga}</a><span>›</span>
    <span>${area.n}</span>
  </div>
</header>

<main class="wrap">
  <h1>خضار وفواكه ${area.n} — توصيل من أقرب بقال</h1>
  <p>${intro}</p>
  <a class="cta" href="https://play.google.com/store/apps/details?id=com.alwaa.app" target="_blank" rel="noopener">حمّل التطبيق واطلب الآن</a>

  <h2>كيف يعمل التطبيق في ${area.n}؟</h2>
  <div class="steps">
    <div class="step">
      <div class="num">1</div>
      <h4>حدّد موقعك</h4>
      <p>يعرض لك التطبيق البقالين النشطين في ${area.n} فقط.</p>
    </div>
    <div class="step">
      <div class="num">2</div>
      <h4>اختر منتجاتك</h4>
      <p>حدّد الكميات (الحد الأدنى 1 كغم) وأرسل طلبك.</p>
    </div>
    <div class="step">
      <div class="num">3</div>
      <h4>اختر العرض الأنسب</h4>
      <p>تصلك عروض البقالين في ${area.n}: السعر + وقت التوصيل (5-30 دقيقة).</p>
    </div>
  </div>

  <h2>تشكيلة من الخضار والفواكه المتوفرة في ${area.n}</h2>
  <p>هذه أمثلة على المنتجات المتاحة عبر بقالي ${area.n}. السعر النهائي يحدده البقال ويشمل خدمة التوصيل:</p>
  <div class="grid">
${gridHtml}
  </div>

  <h2>بقالون يخدمون ${area.n}</h2>
  <p>يفتح التطبيق تلقائياً قائمة البقالين النشطين في ${area.n}. يُرسل طلبك لكل بقالي المنطقة دفعة واحدة، ثم تختار العرض الأنسب من حيث السعر ووقت التوصيل. بعد 5 طلبات ناجحة، يتحول البقال تلقائياً إلى <strong>"بقال موصى به"</strong> في منطقته.</p>

  <h2>العلاوي المركزية التي تخدم ${gov.ga}</h2>
  <ul class="markets-list">${marketsHtml}</ul>
  <p>تستقبل المكاتب داخل هذه العلاوي بضائعها يومياً، ويعرضها تطبيق علوة عبر البث المباشر — لتشاهد البضاعة الحقيقية قبل أن تطلبها من بقالك.</p>

  <h2>خدمات علوة في ${area.n}</h2>
  <ul>
    <li>توصيل خضار وفواكه من أقرب بقال في ${area.n} خلال 5-30 دقيقة</li>
    <li>يُرسل طلبك لكل بقالي منطقتك وتختار العرض الأنسب</li>
    <li>بث مباشر من العلاوي المركزية في ${gov.ga}</li>
    <li>الدفع نقداً عند التسليم — بدون دفع إلكتروني أو عمولات</li>
    <li>تجهيز المطاعم والفنادق عبر شركات معتمدة في ${gov.ga}</li>
    <li>شركات تصدير الخضار والفواكه للعراق والخليج</li>
    <li>${extraService}</li>
  </ul>

  <h2>تواصل معنا</h2>
  <div class="contact">
    <p>فريق علوة جاهز لمساعدتك في أي وقت:</p>
    <a href="tel:+9647813130254">📞 +964 781 313 0254</a>
    <a href="https://wa.me/9647813130254" target="_blank" rel="noopener">💬 واتساب</a>
    <a href="mailto:alwairaqe@gmail.com">✉️ alwairaqe@gmail.com</a>
  </div>

  <h2>مناطق قريبة من ${area.n}</h2>
  <ul>${nearbyHtml}</ul>

  <h2>أسئلة شائعة عن التوصيل في ${area.n}</h2>

  <h3>هل يوجد توصيل خضار وفواكه في ${area.n}؟</h3>
  <p>نعم، عبر تطبيق علوة ALWA من أقرب بقال مسجل في ${area.n}. التطبيق يعرض البقالين المتاحين حالياً في منطقتك مع عروضهم ووقت التوصيل.</p>

  <h3>كم يستغرق التوصيل في ${area.n}؟</h3>
  <p>من 5 إلى 30 دقيقة حسب البقال الذي تختاره وقربه من عنوانك في ${area.n}.</p>

  <h3>هل التوصيل مجاني؟</h3>
  <p>نعم، السعر المعروض من البقال في ${area.n} يشمل التوصيل — بدون رسوم إضافية على العميل.</p>

  <h3>${extraFaq.q}</h3>
  <p>${extraFaq.a}</p>

  <h2>تصفح مناطق ${gov.ga}</h2>
  <p><a href="/iraq/${gov.g}/">جميع مناطق ${gov.ga} (${gov.a.length} منطقة) ←</a></p>
</main>

<footer>
  <p>© 2026 علوة ALWA — سوق الجملة الرقمي للخضار والفواكه في العراق</p>
  <p><a href="/">الرئيسية</a></p>
</footer>
</body>
</html>`;
}

// ═══════════════════════════════════════════════════════
// صفحة منطقة كردية
// ═══════════════════════════════════════════════════════
function makeKuPage(gov,area,govNameKu){
  const seed=`${gov.g}/${area.s}`;
  const products=pickProducts(seed,9);
  const heroProduct=products[0];
  const intro=pickOne(seed+'-intro',KU_INTROS)(area.n,govNameKu);
  const extraService=pickOne(seed+'-svc',EXTRA_SERVICES_KU);
  const extraFaq=pickOne(seed+'-faq',EXTRA_FAQ_KU);

  const gridHtml=products.map(p=>cardKu(p,area.n)).join('\n');
  const nearby=nearbyAreas(gov,area.s,5);
  const nearbyHtml=nearby.map(a=>`<li><a href="/ckb/iraq/${gov.g}/${a.s}/">سەوزە و میوە لە ${a.n}</a></li>`).join('');
  const markets=MARKETS_KU[gov.g]||['عەلوە ناوەندییەکانی هەرێم'];
  const marketsHtml=markets.map(m=>`<li>${m}</li>`).join('');

  return `<!DOCTYPE html>
<html lang="ckb" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>سەوزە و میوە لە ${area.n} | گەیاندن لە نزیکترین بەقال لە 30 خولەکدا — عەلوە ALWA</title>
<meta name="description" content="سەوزە و میوەی تازە لە ${area.n}، پارێزگای ${govNameKu}. داواکاریەکەت بۆ هەموو بەقالەکانی ناوچەکەت دەنێردرێت، پێشنیارەکانیان وەردەگریت، و باشترینیان هەڵدەبژێریت. گەیاندن لە 5 بۆ 30 خولەک.">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${SITE}/ckb/iraq/${gov.g}/${area.s}/">
<link rel="alternate" hreflang="ar" href="${SITE}/iraq/${gov.g}/${area.s}/">
<link rel="alternate" hreflang="ckb" href="${SITE}/ckb/iraq/${gov.g}/${area.s}/">
<link rel="alternate" hreflang="x-default" href="${SITE}/iraq/${gov.g}/${area.s}/">
<link rel="icon" type="image/png" href="/alwa.png">
<meta property="og:type" content="website">
<meta property="og:image" content="${SITE}/${heroProduct.f}">
<meta name="twitter:card" content="summary_large_image">

<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"LocalBusiness",
  "name":"عەلوە ALWA — گەیاندنی سەوزە و میوە لە ${area.n}",
  "url":"${SITE}/ckb/iraq/${gov.g}/${area.s}/",
  "image":"${SITE}/${heroProduct.f}",
  "telephone":"+9647813130254",
  "email":"alwairaqe@gmail.com",
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
    <a href="/">عەلوە ALWA</a><span>›</span>
    <a href="/ckb/iraq/${gov.g}/">${govNameKu}</a><span>›</span>
    <span>${area.n}</span>
  </div>
</header>

<main class="wrap">
  <h1>سەوزە و میوە لە ${area.n} — گەیاندن لە نزیکترین بەقال</h1>
  <p>${intro}</p>
  <a class="cta" href="https://play.google.com/store/apps/details?id=com.alwaa.app" target="_blank" rel="noopener">ئەپەکە دابگرە و ئێستا داواکاری بکە</a>

  <h2>ئەپەکە لە ${area.n} چۆن کار دەکات؟</h2>
  <div class="steps">
    <div class="step">
      <div class="num">1</div>
      <h4>شوێنت دیاری بکە</h4>
      <p>ئەپەکە تەنها بەقالە چالاکەکانی ${area.n} پیشان دەدات.</p>
    </div>
    <div class="step">
      <div class="num">2</div>
      <h4>بەرهەمەکانت هەڵبژێرە</h4>
      <p>بڕەکان دیاری بکە (کەمترین 1 کگم) و داواکاریەکەت بنێرە.</p>
    </div>
    <div class="step">
      <div class="num">3</div>
      <h4>باشترین پێشنیار هەڵبژێرە</h4>
      <p>پێشنیاری بەقالەکانی ${area.n} دەتگاتێت: نرخ + کاتی گەیاندن (5-30 خولەک).</p>
    </div>
  </div>

  <h2>هەڵبژاردەیەک لە سەوزە و میوە بەردەستەکان لە ${area.n}</h2>
  <p>ئەمانە نموونەی بەرهەمە بەردەستەکانن لە ڕێگەی بەقالەکانی ${area.n}. نرخی کۆتایی لەلایەن بەقال دیاری دەکرێت و خزمەتگوزاری گەیاندنیش لەخۆ دەگرێت:</p>
  <div class="grid">
${gridHtml}
  </div>

  <h2>بەقالەکان خزمەت بە ${area.n} دەکەن</h2>
  <p>ئەپەکە بە شێوەیەکی خۆکار لیستی بەقالە چالاکەکانی ${area.n} پیشان دەدات. داواکاریەکەت بۆ هەموو بەقالەکانی ناوچەکەت دەنێردرێت، پاشان باشترین پێشنیار لە ڕووی نرخ و کاتی گەیاندنەوە هەڵدەبژێریت. دوای 5 داواکاری سەرکەوتوو، بەقال بە شێوەیەکی خۆکار دەبێت بە <strong>"بەقالی پێشنیارکراو"</strong> لە ناوچەکەی.</p>

  <h2>عەلوە ناوەندییەکانی ${govNameKu}</h2>
  <ul class="markets-list">${marketsHtml}</ul>
  <p>ئۆفیسەکانی ناو ئەم عەلوەانە ڕۆژانە کاڵاکانیان وەردەگرن، و ئەپی عەلوە بە پەخشی ڕاستەوخۆ پیشانی دەدات — بۆ ئەوەی کاڵای ڕاستەقینە ببینیت پێش ئەوەی لە بەقالەکەت داواکاری بکەیت.</p>

  <h2>خزمەتگوزارییەکانی عەلوە لە ${area.n}</h2>
  <ul>
    <li>گەیاندنی سەوزە و میوە لە نزیکترین بەقال لە ${area.n} لە ماوەی 5-30 خولەکدا</li>
    <li>داواکاریەکەت بۆ هەموو بەقالەکانی ناوچەکەت دەنێردرێت و باشترینیان هەڵدەبژێریت</li>
    <li>پەخشی ڕاستەوخۆ لە عەلوە ناوەندییەکانی ${govNameKu}</li>
    <li>پارەدان بە کاش لە کاتی گەیاندن — بێ پارەدانی ئەلیکترۆنی یان کۆمیسیۆن</li>
    <li>دابینکردنی چێشتخانە و هۆتێلەکان لە ڕێگەی کۆمپانیا پشتڕاستکراوەکان لە ${govNameKu}</li>
    <li>کۆمپانیاکانی هەناردەکردنی سەوزە و میوە بۆ عێراق و کەنداو</li>
    <li>${extraService}</li>
  </ul>

  <h2>پەیوەندیمان پێوە بکە</h2>
  <div class="contact">
    <p>تیمی عەلوە ئامادەیە یارمەتیت بدات لە هەر کاتێکدا:</p>
    <a href="tel:+9647813130254">📞 +964 781 313 0254</a>
    <a href="https://wa.me/9647813130254" target="_blank" rel="noopener">💬 واتساپ</a>
    <a href="mailto:alwairaqe@gmail.com">✉️ alwairaqe@gmail.com</a>
  </div>

  <h2>ناوچەکانی نزیک لە ${area.n}</h2>
  <ul>${nearbyHtml}</ul>

  <h2>پرسیارە باوەکان دەربارەی گەیاندن لە ${area.n}</h2>

  <h3>ئایا گەیاندنی سەوزە و میوە لە ${area.n} هەیە؟</h3>
  <p>بەڵێ، بە ئەپی عەلوە ALWA لە نزیکترین بەقالی تۆمارکراو لە ${area.n}. ئەپەکە بەقالە بەردەستەکانی ناوچەکەت لەگەڵ پێشنیار و کاتی گەیاندن پیشان دەدات.</p>

  <h3>گەیاندن لە ${area.n} چەند دەخایەنێت؟</h3>
  <p>لە 5 بۆ 30 خولەک بەپێی بەقالی هەڵبژێردراو و نزیکی بۆ ناونیشانی تۆ لە ${area.n}.</p>

  <h3>ئایا گەیاندن بەخۆڕاییە؟</h3>
  <p>بەڵێ، نرخی پیشاندراو لەلایەن بەقالی ${area.n} گەیاندنیش لەخۆ دەگرێت — بێ کرێی زیادە.</p>

  <h3>${extraFaq.q}</h3>
  <p>${extraFaq.a}</p>

  <h2>ناوچەکانی ${govNameKu} بگەڕێ</h2>
  <p><a href="/ckb/iraq/${gov.g}/">هەموو ناوچەکانی ${govNameKu} (${gov.a.length} ناوچە) ←</a></p>
</main>

<footer>
  <p>© 2026 عەلوە ALWA — بازاڕی بەکۆمەڵی دیجیتاڵی بۆ سەوزە و میوە لە عێراق</p>
  <p><a href="/">سەرەکی</a></p>
</footer>
</body>
</html>`;
}

// ═══════════════════════════════════════════════════════
// صفحة محافظة عربية + كردية
// ═══════════════════════════════════════════════════════
function makeGovPage(gov){
  const list=gov.a.map(a=>`<li><a href="/iraq/${gov.g}/${a.s}/">خضار وفواكه ${a.n}</a></li>`).join('\n');
  const hasKu=KURDISH_GOVS.includes(gov.g);
  const kuLink=hasKu?`<link rel="alternate" hreflang="ckb" href="${SITE}/ckb/iraq/${gov.g}/">`:'';
  const markets=CENTRAL_MARKETS[gov.g]||['العلاوي المركزية في بغداد'];
  const marketsHtml=markets.map(m=>`<li>${m}</li>`).join('');
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>خضار وفواكه ${gov.ga} | توصيل من أقرب بقال — علوة ALWA</title>
<meta name="description" content="اطلب خضار وفواكه في محافظة ${gov.ga} عبر تطبيق علوة. توصيل من أقرب بقال في ${gov.a.length} منطقة خلال 5-30 دقيقة.">
<link rel="canonical" href="${SITE}/iraq/${gov.g}/">
<link rel="alternate" hreflang="ar" href="${SITE}/iraq/${gov.g}/">
${kuLink}
${SHARED_CSS}
</head>
<body>
<header><div class="wrap"><a href="/">علوة ALWA</a><span>›</span><span>${gov.ga}</span></div></header>
<main class="wrap">
<h1>خضار وفواكه ${gov.ga} — دليل كامل</h1>
<p>تصفح جميع مناطق ${gov.ga} (${gov.a.length} منطقة) واطلب خضارك وفواكهك من أقرب بقال خلال 5-30 دقيقة.</p>

<h2>العلاوي المركزية التي تخدم ${gov.ga}</h2>
<ul class="markets-list">${marketsHtml}</ul>

<h2>جميع مناطق ${gov.ga}</h2>
<ul style="columns:2;list-style:none;padding:0">${list}</ul>
<p style="margin-top:20px"><a href="/">← الرئيسية</a></p>
</main>
<footer><p>© 2026 علوة ALWA</p></footer>
</body></html>`;
}

function makeKuGovPage(gov,govNameKu){
  const list=gov.a.map(a=>`<li><a href="/ckb/iraq/${gov.g}/${a.s}/">سەوزە و میوە لە ${a.n}</a></li>`).join('\n');
  const markets=MARKETS_KU[gov.g]||['عەلوە ناوەندییەکانی هەرێم'];
  const marketsHtml=markets.map(m=>`<li>${m}</li>`).join('');
  return `<!DOCTYPE html>
<html lang="ckb" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>سەوزە و میوە لە ${govNameKu} | گەیاندن لە نزیکترین بەقال — عەلوە ALWA</title>
<meta name="description" content="سەوزە و میوە لە پارێزگای ${govNameKu} داوا بکە بە ئەپی عەلوە. گەیاندن لە نزیکترین بەقال لە ${gov.a.length} ناوچە لە 5-30 خولەکدا.">
<link rel="canonical" href="${SITE}/ckb/iraq/${gov.g}/">
<link rel="alternate" hreflang="ar" href="${SITE}/iraq/${gov.g}/">
<link rel="alternate" hreflang="ckb" href="${SITE}/ckb/iraq/${gov.g}/">
${SHARED_CSS}
</head>
<body>
<header><div class="wrap"><a href="/">عەلوە ALWA</a><span>›</span><span>${govNameKu}</span></div></header>
<main class="wrap">
<h1>سەوزە و میوە لە ${govNameKu} — ڕێبەری تەواو</h1>
<p>هەموو ناوچەکانی ${govNameKu} (${gov.a.length} ناوچە) بگەڕێ و سەوزە و میوەکەت لە نزیکترین بەقال لە 5-30 خولەکدا داوا بکە.</p>

<h2>عەلوە ناوەندییەکانی ${govNameKu}</h2>
<ul class="markets-list">${marketsHtml}</ul>

<h2>هەموو ناوچەکانی ${govNameKu}</h2>
<ul style="columns:2;list-style:none;padding:0">${list}</ul>
<p style="margin-top:20px"><a href="/">← سەرەکی</a></p>
</main>
<footer><p>© 2026 عەلوە ALWA</p></footer>
</body></html>`;
}

// ═══════════════════════════════════════════════════════
// التوليد
// ═══════════════════════════════════════════════════════
if(fs.existsSync(OUT+'/iraq'))fs.rmSync(OUT+'/iraq',{recursive:true});
if(fs.existsSync(OUT+'/ckb'))fs.rmSync(OUT+'/ckb',{recursive:true});

let arCount=0,kuCount=0;

regions.forEach(gov=>{
  const govDir=path.join(OUT,'iraq',gov.g);
  fs.mkdirSync(govDir,{recursive:true});
  fs.writeFileSync(path.join(govDir,'index.html'),makeGovPage(gov));

  gov.a.forEach(area=>{
    const d=path.join(govDir,area.s);
    fs.mkdirSync(d,{recursive:true});
    fs.writeFileSync(path.join(d,'index.html'),makePage(gov,area));
    arCount++;
  });

  if(KURDISH_GOVS.includes(gov.g)){
    const govNameKu=GOV_NAMES_KU[gov.g];
    const kuDir=path.join(OUT,'ckb','iraq',gov.g);
    fs.mkdirSync(kuDir,{recursive:true});
    fs.writeFileSync(path.join(kuDir,'index.html'),makeKuGovPage(gov,govNameKu));

    gov.a.forEach(area=>{
      const d=path.join(kuDir,area.s);
      fs.mkdirSync(d,{recursive:true});
      fs.writeFileSync(path.join(d,'index.html'),makeKuPage(gov,area,govNameKu));
      kuCount++;
    });
  }
});

console.log(`✅ ${arCount} صفحة منطقة عربية + ${regions.length} صفحة محافظة`);
console.log(`✅ ${kuCount} صفحة منطقة كردية + ${KURDISH_GOVS.length} صفحة محافظة`);
console.log(`📂 في: ${OUT}/iraq/ و ${OUT}/ckb/`);
