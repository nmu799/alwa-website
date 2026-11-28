// generate-world.js — يولّد صفحات التصدير للدول الاثنتي عشرة (خارج العراق)
const fs = require('fs');
const path = require('path');
const worldRegions = require('./world-regions.json');

const SITE = 'https://alwairaq.com';
const OUT = './docs';

const STORE_ANDROID = 'https://play.google.com/store/apps/details?id=com.alwaa.app';
const STORE_IOS = 'https://apps.apple.com/us/app/%D8%B9%D9%84%D9%88%D8%A9-%D8%AE%D8%B6%D8%A7%D8%B1-%D9%88%D9%81%D9%88%D8%A7%D9%83%D9%87-%D8%AC%D9%85%D9%84%D8%A9-%D9%88%D9%85%D9%81%D8%B1%D8%AF/id6766648439';

const COUNTRY_SLUG = {
  TH:'thailand', CA:'canada', TR:'turkey', BE:'belgium', IT:'italy',
  ES:'spain', CN:'china', US:'usa', NL:'netherlands', MX:'mexico',
  EG:'egypt', SY:'syria'
};
const LANG = {
  TH:'th', CA:'en', TR:'tr', BE:'nl', IT:'it', ES:'es',
  CN:'zh', US:'en', NL:'nl', MX:'es', EG:'ar', SY:'ar'
};

const T = {
  ar: {
    lang:'ar', dir:'rtl',
    title: (r, p) => `تصدير ${p} من ${r} للخليج وأوروبا بأفضل أسعار الجملة | علوة ALWA`,
    meta: (r, p) => `هل تبحث عن طريقة لتصدير ${p} من ${r}؟ علوة ALWA يربطك بمستوردي العراق والخليج مباشرة. سجل شركتك الآن.`,
    h1: (r) => `تصدير الخضار والفواكه من ${r}`,
    intros: [
      (r, p) => `تشتهر ${r} بإنتاج ${p} عالي الجودة. من خلال تطبيق علوة، يمكنك الآن تصدير هذا المنتج وغيره إلى العراق، الخليج، أوروبا وأمريكا بضغطة زر وبدون وسطاء.`,
      (r, p) => `هل تبحث عن طريقة لتصدير ${p} من ${r}؟ تطبيق علوة يفتح لك أسواق العراق والخليج مباشرة. سجّل شركتك، وانشر منتجاتك، وتواصل مع المشترين فوراً.`,
      (r, p) => `${r} تمتلك منتجات زراعية ممتازة مثل ${p} تستحق الوصول للعالم. علوة يمنحك منصة تصدير كاملة: حساب شركة، نشر المنتجات، وتسويق مباشر.`
    ],
    dest: [
      'تصدير إلى العراق — السوق الأكبر والأقرب جغرافياً',
      'تصدير إلى السعودية والإمارات والكويت وقطر — طلب متزايد على المنتجات الطازجة',
      'تصدير إلى الاتحاد الأوروبي — معايير جودة عالية وأسعار مميزة',
      'تصدير إلى أمريكا الشمالية — سوق واسع للمنتجات الاستوائية والموسمية',
      'تصدير إلى آسيا الوسطى وروسيا — فرص نمو كبيرة'
    ],
    specialtiesTitle: (r) => `بماذا تشتهر ${r}؟`,
    specialtiesDesc: (r) => `أبرز المنتجات الزراعية التي يمكن تصديرها من ${r}:`,
    otherRegionsTitle: (c) => `مناطق أخرى للتصدير في ${c}`,
    regTitle: 'كيف تنشئ حساب شركة تصدير في علوة؟',
    regIntro: 'اتبع الخطوات التالية لإنشاء حساب شركة تصدير جاهز للنشر:',
    steps: [
      'حمّل تطبيق علوة من Google Play أو App Store',
      'أنشئ حساب مكتب (Office Account) — الوحدة التي تدير شركاتك',
      'داخل المكتب، أنشئ حساب شركة (Company Account)',
      'املأ بيانات الشركة: الاسم، البلد، Gmail، رقم واتساب',
      'انشر منتجاتك التصديرية مع الصور والكميات المتاحة',
      'تواصل مع المشترين في العراق والخليج وأوروبا وأمريكا'
    ],
    fieldsTitle: 'بيانات الشركة المطلوبة',
    fields: [
      { l:'اسم الشركة', h:'الاسم التجاري الكامل' },
      { l:'البلد', h:'بلد المنشأ / التصدير' },
      { l:'البريد الإلكتروني (Gmail)', h:'للتواصل الرسمي' },
      { l:'رقم واتساب', h:'مع رمز الدولة' }
    ],
    faqs: [
      (r) => ({ q:`هل التسجيل في علوة مجاني للمصدرين في ${r}؟`, a:'نعم، التسجيل مجاني بالكامل. لا رسوم اشتراك ولا عمولة على الصفقات.' }),
      (r) => ({ q:'كم يستغرق إنشاء حساب شركة؟', a:'أقل من 5 دقائق. بعد تحميل التطبيق، تنشئ حساب مكتب ثم حساب شركة وتملأ البيانات الأربعة.' }),
      (r) => ({ q:`إلى أي دول يمكنني تصدير المنتجات من ${r}؟`, a:'العراق، السعودية، الإمارات، الكويت، قطر، عُمان، البحرين، ودول الاتحاد الأوروبي وأمريكا الشمالية.' }),
      (r) => ({ q:'هل أحتاج شركة مسجلة رسمياً؟', a:'يُفضّل ذلك لزيادة الثقة، لكن يمكنك البدء كتاجر فرد والتوسع لاحقاً.' }),
      (r) => ({ q:'كيف يتواصل معي المشترون؟', a:'عبر رقم واتساب والبريد الإلكتروني المسجلين في حساب شركتك.' })
    ],
    cta:'حمّل التطبيق وابدأ التصدير',
    contact:'تواصل مع فريق علوة',
    fProducts:'منتجات التصدير المتاحة',
    fFruits:'الفواكه',
    fVeg:'الخضروات',
    footer:'علوة ALWA — منصة تصدير الخضار والفواكه',
    empty:'المنتجات التفصيلية لهذه المنطقة ستُضاف قريباً. تواصل معنا لمعرفة المتاح للتصدير.'
  },

  en: {
    lang:'en', dir:'ltr',
    title: (r, p) => `Export ${p} from ${r} to Gulf & EU - Wholesale Prices | ALWA`,
    meta: (r, p) => `Looking to export ${p} from ${r}? ALWA connects you with importers in Iraq and the Gulf directly. Register your company now.`,
    h1: (r) => `Export Fruits & Vegetables from ${r}`,
    intros: [
      (r, p) => `${r} is famous for producing high-quality ${p}. Through ALWA, you can now export this and other products to Iraq, the Gulf, Europe, and the USA with one click and no middlemen.`,
      (r, p) => `Looking for a way to export ${p} from ${r}? ALWA opens the markets of Iraq and the Gulf directly to you. Register your company, publish products, and connect with buyers instantly.`,
      (r, p) => `${r} has excellent agricultural products like ${p} that deserve global reach. ALWA gives you a complete export platform: company account, product publishing, and direct marketing.`
    ],
    dest: [
      'Export to Iraq — the largest and closest market',
      'Export to Saudi Arabia, UAE, Kuwait and Qatar — growing demand for fresh produce',
      'Export to the European Union — high quality standards and premium prices',
      'Export to North America — vast market for tropical and seasonal products',
      'Export to Central Asia and Russia — significant growth opportunities'
    ],
    specialtiesTitle: (r) => `What is ${r} famous for?`,
    specialtiesDesc: (r) => `Top agricultural products available for export from ${r}:`,
    otherRegionsTitle: (c) => `Other export regions in ${c}`,
    regTitle: 'How to create an export company account on ALWA',
    regIntro: 'Follow these steps to set up a company account ready for publishing:',
    steps: [
      'Download the ALWA app from Google Play or the App Store',
      'Create an Office Account — the Office manages your companies',
      'Inside the Office, create a Company Account',
      'Fill in company data: name, country, Gmail, WhatsApp number',
      'Publish your export products with photos and available quantities',
      'Connect with buyers in Iraq, the Gulf, Europe and North America'
    ],
    fieldsTitle: 'Company registration data',
    fields: [
      { l:'Company name', h:'Full commercial name' },
      { l:'Country', h:'Country of origin / export' },
      { l:'Email (Gmail)', h:'For official communication' },
      { l:'WhatsApp number', h:'With country code' }
    ],
    faqs: [
      (r) => ({ q:`Is registration on ALWA free for exporters in ${r}?`, a:'Yes, completely free. No subscription fees, no commission on deals.' }),
      (r) => ({ q:'How long does it take to create a company account?', a:'Less than 5 minutes: create an Office Account, then a Company Account, then fill in the four fields.' }),
      (r) => ({ q:`Which countries can I export to from ${r}?`, a:'Iraq, Saudi Arabia, UAE, Kuwait, Qatar, Oman, Bahrain, plus EU and North America.' }),
      (r) => ({ q:'Do I need a formally registered company?', a:'Recommended for trust, but you can start as an individual trader and expand later.' }),
      (r) => ({ q:'How will buyers contact me?', a:'Via the WhatsApp number and email registered in your company account.' })
    ],
    cta:'Download the app and start exporting',
    contact:'Contact the ALWA team',
    fProducts:'Available export products',
    fFruits:'Fruits',
    fVeg:'Vegetables',
    footer:'ALWA — Fruits & Vegetables Export Platform',
    empty:'Detailed products for this region will be added soon. Contact us to learn about available exports.'
  },

  tr: {
    lang:'tr', dir:'ltr',
    title: (r, p) => `${r}'dan ${p} İhracatı - Körfez ve AB'ye Toptan Fiyatlar | ALWA`,
    meta: (r, p) => `${r}'dan ${p} ihraç etmek mi istiyorsunuz? ALWA sizi Irak ve Körfez'deki ithalatçılarla doğrudan buluşturur.`,
    h1: (r) => `${r}'dan Meyve Sebze İhracatı`,
    intros: [
      (r, p) => `${r} yüksek kaliteli ${p} üretimiyle ünlüdür. ALWA aracılığıyla bu ve diğer ürünleri Irak, Körfez, Avrupa ve ABD'ye tek tıkla ve aracısız ihraç edebilirsiniz.`,
      (r, p) => `${r}'dan ${p} ihraç etmenin bir yolunu mu arıyorsunuz? ALWA size Irak ve Körfez pazarlarını doğrudan açar. Şirketinizi kaydedin, ürünlerinizi yayınlayın.`,
      (r, p) => `${r}, ${p} gibi dünya pazarına ulaşmayı hak eden mükemmel tarım ürünlerine sahiptir. ALWA size tam bir ihracat platformu sunar.`
    ],
    dest: [
      'Irak\'a ihracat — en büyük ve en yakın pazar',
      'Suudi Arabistan, BAE, Kuveyt ve Katar\'a ihracat — taze ürünlere artan talep',
      'Avrupa Birliği\'ne ihracat — yüksek kalite standartları ve premium fiyatlar',
      'Kuzey Amerika\'ya ihracat — tropikal ve mevsimlik ürünler için geniş pazar',
      'Orta Asya ve Rusya\'ya ihracat — önemli büyüme fırsatları'
    ],
    specialtiesTitle: (r) => `${r} neyle ünlüdür?`,
    specialtiesDesc: (r) => `${r}'dan ihraç edilebilecek en önemli tarım ürünleri:`,
    otherRegionsTitle: (c) => `${c} bölgesindeki diğer ihracat bölgeleri`,
    regTitle: 'ALWA\'da ihracat şirket hesabı nasıl açılır',
    regIntro: 'Yayına hazır bir şirket hesabı oluşturmak için şu adımları izleyin:',
    steps: [
      'ALWA uygulamasını Google Play veya App Store\'dan indirin',
      'Bir Ofis Hesabı oluşturun — Ofis, şirketlerinizi yönetir',
      'Ofis içinde bir Şirket Hesabı oluşturun',
      'Şirket verilerini girin: ad, ülke, Gmail, WhatsApp numarası',
      'İhracat ürünlerinizi fotoğraf ve mevcut miktarlarla yayınlayın',
      'Irak, Körfez, Avrupa ve Kuzey Amerika\'daki alıcılarla iletişim kurun'
    ],
    fieldsTitle: 'Şirket kayıt verileri',
    fields: [
      { l:'Şirket adı', h:'Tam ticari unvan' },
      { l:'Ülke', h:'Menşe / ihracat ülkesi' },
      { l:'E-posta (Gmail)', h:'Resmi iletişim için' },
      { l:'WhatsApp numarası', h:'Ülke koduyla' }
    ],
    faqs: [
      (r) => ({ q:`${r}'da ALWA'ya kayıt ücretsiz mi?`, a:'Evet, tamamen ücretsiz. Abonelik ücreti yok, işlemlerden komisyon alınmaz.' }),
      (r) => ({ q:'Şirket hesabı açmak ne kadar sürer?', a:'5 dakikadan az: Ofis Hesabı oluşturun, ardından Şirket Hesabı açın.' }),
      (r) => ({ q:`${r}'dan hangi ülkelere ihracat yapabilirim?`, a:'Irak, Suudi Arabistan, BAE, Kuveyt, Katar, Umman, Bahreyn, AB ve Kuzey Amerika.' }),
      (r) => ({ q:'Resmi kayıtlı bir şirket gerekli mi?', a:'Güven için önerilir, ancak bireysel tüccar olarak başlayıp sonra büyüyebilirsiniz.' }),
      (r) => ({ q:'Alıcılar benimle nasıl iletişim kuracak?', a:'Şirket hesabınıza kayıtlı WhatsApp numarası ve e-posta üzerinden.' })
    ],
    cta:'Uygulamayı indir ve ihracata başla',
    contact:'ALWA ekibiyle iletişime geçin',
    fProducts:'Mevcut ihracat ürünleri',
    fFruits:'Meyveler',
    fVeg:'Sebzeler',
    footer:'ALWA — Meyve Sebze İhracat Platformu',
    empty:'Bu bölge için ayrıntılı ürünler yakında eklenecek. Mevcut ihracat ürünleri için bize ulaşın.'
  },

  nl: {
    lang:'nl', dir:'ltr',
    title: (r, p) => `Export ${p} uit ${r} naar Golf & EU - Groothandelsprijzen | ALWA`,
    meta: (r, p) => `Wilt u ${p} exporteren uit ${r}? ALWA verbindt u rechtstreeks met importeurs in Irak en de Golf.`,
    h1: (r) => `Export groenten en fruit uit ${r}`,
    intros: [
      (r, p) => `${r} is beroemd om de productie van hoogwaardige ${p}. Via ALWA kunt u dit en andere producten met één klik exporteren naar Irak, de Golf, Europa en de VS.`,
      (r, p) => `Op zoek naar een manier om ${p} uit ${r} te exporteren? ALWA opent de markten van Irak en de Golf direct voor u.`,
      (r, p) => `${r} heeft uitstekende landbouwproducten zoals ${p} die wereldwijde aandacht verdienen. ALWA biedt een compleet exportplatform.`
    ],
    dest: [
      'Export naar Irak — de grootste en dichtstbijzijnde markt',
      'Export naar Saoedi-Arabië, VAE, Koeweit en Qatar — groeiende vraag naar verse producten',
      'Export naar de Europese Unie — hoge kwaliteitsnormen en premium prijzen',
      'Export naar Noord-Amerika — enorme markt voor tropische en seizoensproducten',
      'Export naar Centraal-Azië en Rusland — aanzienlijke groeikansen'
    ],
    specialtiesTitle: (r) => `Waar is ${r} beroemd om?`,
    specialtiesDesc: (r) => `Belangrijkste landbouwproducten die beschikbaar zijn voor export uit ${r}:`,
    otherRegionsTitle: (c) => `Andere exportregio's in ${c}`,
    regTitle: 'Hoe maak je een exporthandelsaccount op ALWA',
    regIntro: 'Volg deze stappen om een klaar-voor-publicatie bedrijfsaccount aan te maken:',
    steps: [
      'Download de ALWA-app via Google Play of App Store',
      'Maak een Office-account aan — het Office beheert uw bedrijven',
      'Maak binnen het Office een Company-account aan',
      'Vul bedrijfsgegevens in: naam, land, Gmail, WhatsApp-nummer',
      'Publiceer uw exportproducten met foto\'s en beschikbare hoeveelheden',
      'Communiceer met kopers in Irak, de Golf, Europa en Noord-Amerika'
    ],
    fieldsTitle: 'Bedrijfsregistratiegegevens',
    fields: [
      { l:'Bedrijfsnaam', h:'Volledige handelsnaam' },
      { l:'Land', h:'Land van herkomst / export' },
      { l:'E-mail (Gmail)', h:'Voor officiële communicatie' },
      { l:'WhatsApp-nummer', h:'Met landcode' }
    ],
    faqs: [
      (r) => ({ q:`Is registratie op ALWA gratis voor exporteurs in ${r}?`, a:'Ja, volledig gratis. Geen abonnementskosten, geen commissie.' }),
      (r) => ({ q:'Hoe lang duurt het om een bedrijfsaccount aan te maken?', a:'Minder dan 5 minuten: Office-account, dan Company-account.' }),
      (r) => ({ q:`Naar welke landen kan ik exporteren vanuit ${r}?`, a:'Irak, Saoedi-Arabië, VAE, Koeweit, Qatar, Oman, Bahrein, plus de EU en Noord-Amerika.' }),
      (r) => ({ q:'Heb ik een formeel geregistreerd bedrijf nodig?', a:'Aanbevolen voor vertrouwen, maar u kunt als individuele handelaar beginnen.' }),
      (r) => ({ q:'Hoe nemen kopers contact met mij op?', a:'Via het WhatsApp-nummer en e-mailadres in uw bedrijfsaccount.' })
    ],
    cta:'Download de app en begin met exporteren',
    contact:'Neem contact op met het ALWA-team',
    fProducts:'Beschikbare exportproducten',
    fFruits:'Fruit',
    fVeg:'Groenten',
    footer:'ALWA — Groenten & Fruit Exportplatform',
    empty:'Gedetailleerde producten voor deze regio worden binnenkort toegevoegd.'
  },

  it: {
    lang:'it', dir:'ltr',
    title: (r, p) => `Esporta ${p} da ${r} verso Golfo e UE - Prezzi all'ingrosso | ALWA`,
    meta: (r, p) => `Vuoi esportare ${p} da ${r}? ALWA ti collega direttamente con gli importatori in Iraq e nel Golfo.`,
    h1: (r) => `Esporta frutta e verdura da ${r}`,
    intros: [
      (r, p) => `${r} è famosa per la produzione di ${p} di alta qualità. Tramite ALWA, ora puoi esportare questo e altri prodotti in Iraq, Golfo, Europa e USA con un clic.`,
      (r, p) => `Cerchi un modo per esportare ${p} da ${r}? ALWA apre direttamente i mercati di Iraq e Golfo.`,
      (r, p) => `${r} ha prodotti agricoli eccellenti come ${p} che meritano di raggiungere il mondo. ALWA ti offre una piattaforma di esportazione completa.`
    ],
    dest: [
      'Export verso l\'Iraq — il mercato più grande e vicino',
      'Export verso Arabia Saudita, EAU, Kuwait e Qatar — domanda crescente',
      'Export verso l\'Unione Europea — elevati standard qualitativi',
      'Export verso il Nord America — vasto mercato per prodotti tropicali',
      'Export verso Asia Centrale e Russia — significative opportunità'
    ],
    specialtiesTitle: (r) => `Per cosa è famosa ${r}?`,
    specialtiesDesc: (r) => `I principali prodotti agricoli disponibili per l'esportazione da ${r}:`,
    otherRegionsTitle: (c) => `Altre regioni di esportazione in ${c}`,
    regTitle: 'Come creare un conto aziendale per l\'export su ALWA',
    regIntro: 'Segui questi passaggi per creare un conto aziendale pronto:',
    steps: [
      'Scarica l\'app ALWA da Google Play o App Store',
      'Crea un Office Account — l\'Office gestisce le tue aziende',
      'All\'interno dell\'Office, crea un Company Account',
      'Compila i dati: nome, paese, Gmail, numero WhatsApp',
      'Pubblica i tuoi prodotti da esportazione',
      'Connettiti con acquirenti in Iraq, Golfo, Europa e Nord America'
    ],
    fieldsTitle: 'Dati di registrazione aziendale',
    fields: [
      { l:'Nome azienda', h:'Ragione sociale completa' },
      { l:'Paese', h:'Paese di origine / export' },
      { l:'Email (Gmail)', h:'Per comunicazioni ufficiali' },
      { l:'Numero WhatsApp', h:'Con prefisso internazionale' }
    ],
    faqs: [
      (r) => ({ q:`La registrazione su ALWA è gratuita per gli esportatori in ${r}?`, a:'Sì, completamente gratuita. Nessun costo.' }),
      (r) => ({ q:'Quanto tempo serve per creare un conto aziendale?', a:'Meno di 5 minuti: crea Office Account, poi Company Account.' }),
      (r) => ({ q:`Verso quali paesi posso esportare da ${r}?`, a:'Iraq, Arabia Saudita, EAU, Kuwait, Qatar, Oman, Bahrein, più UE e Nord America.' }),
      (r) => ({ q:'Serve un\'azienda formalmente registrata?', a:'Raccomandato, ma puoi iniziare come commerciante individuale.' }),
      (r) => ({ q:'Come mi contatteranno gli acquirenti?', a:'Tramite il numero WhatsApp e l\'email registrati.' })
    ],
    cta:'Scarica l\'app e inizia a esportare',
    contact:'Contatta il team ALWA',
    fProducts:'Prodotti da esportazione disponibili',
    fFruits:'Frutta',
    fVeg:'Verdura',
    footer:'ALWA — Piattaforma di Export Frutta e Verdura',
    empty:'I prodotti dettagliati per questa regione saranno aggiunti presto.'
  },

  es: {
    lang:'es', dir:'ltr',
    title: (r, p) => `Exportar ${p} desde ${r} al Golfo y UE - Precios al por mayor | ALWA`,
    meta: (r, p) => `¿Buscas exportar ${p} desde ${r}? ALWA te conecta directamente con importadores en Irak y el Golfo.`,
    h1: (r) => `Exportar frutas y verduras desde ${r}`,
    intros: [
      (r, p) => `${r} es famosa por producir ${p} de alta calidad. A través de ALWA, ahora puedes exportar este y otros productos a Irak, el Golfo, Europa y EE.UU.`,
      (r, p) => `¿Buscas una forma de exportar ${p} desde ${r}? ALWA te abre los mercados de Irak y el Golfo directamente.`,
      (r, p) => `${r} tiene excelentes productos agrícolas como ${p} que merecen llegar al mundo. ALWA te ofrece una plataforma completa.`
    ],
    dest: [
      'Exportar a Irak — el mercado más grande y cercano',
      'Exportar a Arabia Saudita, EAU, Kuwait y Catar — demanda creciente',
      'Exportar a la Unión Europea — altos estándares de calidad',
      'Exportar a Norteamérica — vasto mercado para productos tropicales',
      'Exportar a Asia Central y Rusia — oportunidades de crecimiento'
    ],
    specialtiesTitle: (r) => `¿Por qué es famosa ${r}?`,
    specialtiesDesc: (r) => `Principales productos agrícolas disponibles para exportación desde ${r}:`,
    otherRegionsTitle: (c) => `Otras regiones de exportación en ${c}`,
    regTitle: 'Cómo crear una cuenta de empresa exportadora en ALWA',
    regIntro: 'Sigue estos pasos para crear una cuenta de empresa lista:',
    steps: [
      'Descarga la app ALWA desde Google Play o App Store',
      'Crea una Office Account — la Office gestiona tus empresas',
      'Dentro de la Office, crea una Company Account',
      'Completa los datos: nombre, país, Gmail, número de WhatsApp',
      'Publica tus productos de exportación',
      'Conéctate con compradores en Irak, el Golfo, Europa y Norteamérica'
    ],
    fieldsTitle: 'Datos de registro de la empresa',
    fields: [
      { l:'Nombre de la empresa', h:'Razón social completa' },
      { l:'País', h:'País de origen / exportación' },
      { l:'Correo (Gmail)', h:'Para comunicación oficial' },
      { l:'Número de WhatsApp', h:'Con código de país' }
    ],
    faqs: [
      (r) => ({ q:`¿Es gratis registrarse en ALWA para exportadores en ${r}?`, a:'Sí, totalmente gratis. Sin cuotas ni comisiones.' }),
      (r) => ({ q:'¿Cuánto tarda crear una cuenta de empresa?', a:'Menos de 5 minutos: crea Office Account, luego Company Account.' }),
      (r) => ({ q:`¿A qué países puedo exportar desde ${r}?`, a:'Irak, Arabia Saudita, EAU, Kuwait, Catar, Omán, Baréin, más UE y Norteamérica.' }),
      (r) => ({ q:'¿Necesito una empresa registrada formalmente?', a:'Recomendado, pero puedes empezar como comerciante individual.' }),
      (r) => ({ q:'¿Cómo me contactarán los compradores?', a:'Mediante el número de WhatsApp y el correo registrados.' })
    ],
    cta:'Descarga la app y comienza a exportar',
    contact:'Contacta con el equipo de ALWA',
    fProducts:'Productos de exportación disponibles',
    fFruits:'Frutas',
    fVeg:'Verduras',
    footer:'ALWA — Plataforma de Exportación de Frutas y Verduras',
    empty:'Los productos detallados para esta región se añadirán pronto.'
  },

  zh: {
    lang:'zh', dir:'ltr',
    title: (r, p) => `从${r}出口${p}到海湾和欧盟 - 批发价格 | ALWA`,
    meta: (r, p) => `寻找从${r}出口${p}的方法？ALWA将您与伊拉克和海湾的进口商直接联系起来。`,
    h1: (r) => `从${r}出口水果和蔬菜`,
    intros: [
      (r, p) => `${r}以生产高品质的${p}而闻名。通过ALWA，您现在可以一键将这种产品和其他产品出口到伊拉克、海湾、欧洲和美国。`,
      (r, p) => `正在寻找从${r}出口${p}的方法？ALWA直接为您打开伊拉克和海湾市场。`,
      (r, p) => `${r}拥有像${p}这样优秀的农产品，应该走向世界。ALWA为您提供完整的出口平台。`
    ],
    dest: [
      '出口到伊拉克——最大且最近的市场',
      '出口到沙特、阿联酋、科威特和卡塔尔——需求旺盛',
      '出口到欧盟——高质量标准',
      '出口到北美——热带产品的巨大市场',
      '出口到中亚和俄罗斯——增长机会'
    ],
    specialtiesTitle: (r) => `${r}以什么闻名？`,
    specialtiesDesc: (r) => `可从${r}出口的主要农产品：`,
    otherRegionsTitle: (c) => `${c}的其他出口地区`,
    regTitle: '如何在ALWA上创建出口公司账户',
    regIntro: '按照以下步骤创建可发布的公司账户：',
    steps: [
      '从Google Play或App Store下载ALWA应用',
      '创建Office Account——Office管理您的公司',
      '在Office中创建Company Account',
      '填写信息：名称、国家、Gmail、WhatsApp号码',
      '发布您的出口产品',
      '与伊拉克、海湾、欧洲和北美的买家联系'
    ],
    fieldsTitle: '公司注册信息',
    fields: [
      { l:'公司名称', h:'完整商业名称' },
      { l:'国家', h:'原产国/出口国' },
      { l:'邮箱（Gmail）', h:'用于官方沟通' },
      { l:'WhatsApp号码', h:'含国家代码' }
    ],
    faqs: [
      (r) => ({ q:`在${r}注册ALWA免费吗？`, a:'是的，完全免费。没有订阅费，没有佣金。' }),
      (r) => ({ q:'创建公司账户需要多长时间？', a:'不到5分钟：先创建Office Account，再创建Company Account。' }),
      (r) => ({ q:`我可以从${r}向哪些国家出口？`, a:'伊拉克、沙特、阿联酋、科威特、卡塔尔、阿曼、巴林，以及欧盟和北美。' }),
      (r) => ({ q:'我需要正式注册的公司吗？', a:'建议注册以建立信任，但可以先以个体商人身份开始。' }),
      (r) => ({ q:'买家如何联系我？', a:'通过您公司账户注册的WhatsApp号码和邮箱。' })
    ],
    cta:'下载应用开始出口',
    contact:'联系ALWA团队',
    fProducts:'可出口的产品',
    fFruits:'水果',
    fVeg:'蔬菜',
    footer:'ALWA——水果蔬菜出口平台',
    empty:'该地区的详细产品即将添加。'
  },

  th: {
    lang:'th', dir:'ltr',
    title: (r, p) => `ส่งออก${p}จาก${r}ไปอ่าวและสหภาพยุโรป - ราคาขายส่ง | ALWA`,
    meta: (r, p) => `กำลังมองหาวิธีส่งออก${p}จาก${r}ใช่หรือไม่? ALWA เชื่อมต่อคุณกับผู้นำเข้าในอิรักและอ่าวเปอร์เซียโดยตรง`,
    h1: (r) => `ส่งออกผักและผลไม้จาก${r}`,
    intros: [
      (r, p) => `${r}มีชื่อเสียงในด้านการผลิต${p}คุณภาพสูง ผ่าน ALWA คุณสามารถส่งออกสินค้านี้และอื่น ๆ ไปยังอิรัก อ่าวเปอร์เซีย ยุโรป และสหรัฐฯ ได้ด้วยคลิกเดียว`,
      (r, p) => `กำลังมองหาวิธีส่งออก${p}จาก${r}อยู่หรือไม่? ALWA เปิดตลาดอิรักและอ่าวเปอร์เซียให้คุณโดยตรง`,
      (r, p) => `${r}มีผลิตภัณฑ์ทางการเกษตรที่ยอดเยี่ยมเช่น${p}ที่สมควรไปสู่ตลาดโลก ALWA มอบแพลตฟอร์มการส่งออกที่สมบูรณ์แบบ`
    ],
    dest: [
      'ส่งออกไปยังอิรัก — ตลาดที่ใหญ่ที่สุดและใกล้ที่สุด',
      'ส่งออกไปยังซาอุดีอาระเบีย สหรัฐอาหรับเอมิเรตส์ คูเวต และกาตาร์',
      'ส่งออกไปยังสหภาพยุโรป — มาตรฐานคุณภาพสูง',
      'ส่งออกไปยังอเมริกาเหนือ — ตลาดขนาดใหญ่',
      'ส่งออกไปยังเอเชียกลางและรัสเซีย — โอกาสเติบโต'
    ],
    specialtiesTitle: (r) => `${r}มีชื่อเสียงในเรื่องอะไร?`,
    specialtiesDesc: (r) => `ผลิตภัณฑ์ทางการเกษตรที่สำคัญสำหรับการส่งออกจาก${r}:`,
    otherRegionsTitle: (c) => `ภูมิภาคส่งออกอื่นๆ ใน${c}`,
    regTitle: 'วิธีสร้างบัญชีบริษัทส่งออกบน ALWA',
    regIntro: 'ทำตามขั้นตอนเหล่านี้เพื่อสร้างบัญชีบริษัท:',
    steps: [
      'ดาวน์โหลดแอป ALWA จาก Google Play หรือ App Store',
      'สร้าง Office Account — Office จัดการบริษัทของคุณ',
      'ภายใน Office สร้าง Company Account',
      'กรอกข้อมูลบริษัท: ชื่อ ประเทศ Gmail WhatsApp',
      'เผยแพร่สินค้าส่งออกของคุณ',
      'ติดต่อผู้ซื้อในอิรัก อ่าวเปอร์เซีย ยุโรป และอเมริกาเหนือ'
    ],
    fieldsTitle: 'ข้อมูลการลงทะเบียนบริษัท',
    fields: [
      { l:'ชื่อบริษัท', h:'ชื่อทางการค้าเต็ม' },
      { l:'ประเทศ', h:'ประเทศต้นทาง / ส่งออก' },
      { l:'อีเมล (Gmail)', h:'สำหรับการติดต่ออย่างเป็นทางการ' },
      { l:'หมายเลข WhatsApp', h:'พร้อมรหัสประเทศ' }
    ],
    faqs: [
      (r) => ({ q:`การลงทะเบียนบน ALWA ฟรีสำหรับผู้ส่งออกใน${r}หรือไม่?`, a:'ใช่ ฟรีทั้งหมด ไม่มีค่าสมาชิก' }),
      (r) => ({ q:'ใช้เวลานานเท่าไรในการสร้างบัญชีบริษัท?', a:'น้อยกว่า 5 นาที' }),
      (r) => ({ q:`ฉันสามารถส่งออกจาก${r}ไปยังประเทศใดได้บ้าง?`, a:'อิรัก ซาอุดีอาระเบีย สหรัฐอาหรับเอมิเรตส์ คูเวต กาตาร์ โอมาน บาห์เรน สหภาพยุโรป และอเมริกาเหนือ' }),
      (r) => ({ q:'ต้องมีบริษัทจดทะเบียนหรือไม่?', a:'แนะนำ แต่สามารถเริ่มเป็นพ่อค้ารายบุคคลได้' }),
      (r) => ({ q:'ผู้ซื้อจะติดต่อฉันได้อย่างไร?', a:'ผ่านหมายเลข WhatsApp และอีเมลที่ลงทะเบียน' })
    ],
    cta:'ดาวน์โหลดแอปและเริ่มส่งออก',
    contact:'ติดต่อทีม ALWA',
    fProducts:'สินค้าส่งออกที่มีอยู่',
    fFruits:'ผลไม้',
    fVeg:'ผัก',
    footer:'ALWA — แพลตฟอร์มส่งออกผักและผลไม้',
    empty:'สินค้าโดยละเอียดสำหรับภูมิภาคนี้จะถูกเพิ่มในเร็วๆ นี้'
  }
};

const CSS = `<style>
*{box-sizing:border-box}
body{font-family:system-ui,-apple-system,'Segoe UI','Noto Sans Thai','Noto Sans SC','Cairo',sans-serif;line-height:1.65;color:#1c1f26;margin:0;background:#fff}
.wrap{max-width:900px;margin:0 auto;padding:20px}
header{background:#04722b;color:#fff;padding:14px 0;margin-bottom:24px}
header .wrap{display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding:0 20px}
header a{color:#fff;text-decoration:none;font-weight:600}
h1{color:#04722b;font-size:1.85rem;margin:0 0 12px;line-height:1.35}
h2{color:#035a22;font-size:1.3rem;margin:28px 0 12px}
h3{color:#035a22;font-size:1.05rem;margin:18px 0 8px}
p{margin:0 0 14px;color:#4b5160}
a{color:#04722b}
.stores{display:flex;gap:12px;flex-wrap:wrap;margin:16px 0}
.stores a{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:700;font-size:.95rem;color:#fff;background:#04722b;transition:opacity .2s}
.stores a.apple{background:#000}
.stores a:hover{opacity:.85}
.stores svg{width:20px;height:20px;fill:currentColor}
.dest{background:#f6fbf7;border:1px solid #e2efe5;border-radius:10px;padding:16px 20px;margin:20px 0}
.dest li{color:#035a22;padding:6px 0;list-style:none;position:relative;padding-left:22px}
.dest li:before{content:'✓';position:absolute;left:0;color:#04722b;font-weight:700}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:14px;margin:20px 0}
.card{background:#fff;border:1px solid #e2efe5;border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:12px;min-height:140px;box-shadow:0 2px 5px rgba(0,0,0,0.02)}
.card img{width:100%;height:100px;object-fit:contain;display:block;margin-bottom:10px}
.card .name{font-weight:700;color:#04722b;font-size:.95rem;line-height:1.3}
.card.no-img{background:#f6fbf7;border-style:dashed;border-color:#c8e6c9}
.steps{background:#fff8f0;border:1px solid #ffe2cc;border-radius:10px;padding:18px 20px 18px 40px;margin:20px 0}
.steps li{padding:8px 0;color:#4b5160;line-height:1.6}
.fields{background:#f6fbf7;border:1px solid #e2efe5;border-radius:10px;padding:16px 20px;margin:20px 0}
.fields .row{padding:10px 0;border-bottom:1px dashed #d9eadc}
.fields .row:last-child{border-bottom:none}
.fields .lbl{font-weight:700;color:#035a22;display:block}
.fields .hint{font-size:.85rem;color:#7a8290}
.faq{margin:20px 0}
.faq h3{margin-top:20px}
.faq p{font-size:.95rem}
.contact{background:#f6fbf7;border:1px solid #e2efe5;border-radius:10px;padding:16px 20px;margin:20px 0}
.contact a{display:inline-block;margin:4px 10px 4px 0;font-weight:600}
.regions{columns:2;list-style:none;padding:0;margin:20px 0}
.regions li{padding:6px 0;break-inside:avoid}
.other-areas{background:#fff;border:1px solid #e2efe5;border-radius:10px;padding:16px 20px;margin:20px 0;list-style:none}
.other-areas li{padding:8px 0;border-bottom:1px dashed #eee;margin:0}
.other-areas li:last-child{border:none}
footer{background:#023d17;color:#fff;text-align:center;padding:20px;margin-top:48px;font-size:.9rem}
footer p{margin:4px 0;color:#fff}
</style>`;

function hash(s){let h=0;for(let i=0;i<s.length;i++){h=((h<<5)-h+s.charCodeAt(i))|0;}return Math.abs(h);}
function pick(seed, arr){ return arr[hash(seed) % arr.length]; }

function card(p) {
  if (p.key) {
    return `<div class="card"><img src="/alwa-iraq-${p.key}-01.webp" alt="${p.name}" loading="lazy"><div class="name">${p.name}</div></div>`;
  }
  return `<div class="card no-img"><div class="name">${p.name}</div></div>`;
}

function storesBlock() {
  return `<div class="stores">
    <a href="${STORE_ANDROID}" target="_blank" rel="noopener">
      <svg viewBox="0 0 24 24"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/></svg>
      Google Play
    </a>
    <a class="apple" href="${STORE_IOS}" target="_blank" rel="noopener">
      <svg viewBox="0 0 24 24"><path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.4 12.36,4.16 13,3.5Z"/></svg>
      App Store
    </a>
  </div>`;
}

function makeRegionPage(country, region, t) {
  const slug = COUNTRY_SLUG[country.code];
  const url = `${SITE}/${slug}/${region.slug}/`;
  const seed = `${slug}/${region.slug}`;
  
  const fruits = region.fruits || [];
  const vegetables = region.vegetables || [];
  
  // اختيار "أشهر منتج" للاستخدام في العنوان
  let topProduct = "المنتجات الزراعية";
  if (fruits.length > 0) topProduct = fruits[0].name;
  else if (vegetables.length > 0) topProduct = vegetables[0].name;

  const intro = pick(seed+'-i', t.intros)(region.name, topProduct);
  const destinationsHtml = t.dest.map(d => `<li>${d}</li>`).join('');
  const fieldsHtml = t.fields.map(f => `<div class="row"><span class="lbl">${f.l}</span><span class="hint">${f.h}</span></div>`).join('');
  const stepsHtml = t.steps.map(s => `<li>${s}</li>`).join('');
  
  // أسئلة شائعة ديناميكية
  const faqsHtml = t.faqs.map(fn => {
    const f = fn(region.name);
    return `<h3>${f.q}</h3><p>${f.a}</p>`;
  }).join('');

  const fruitsHtml = fruits.length ? `<h2>${t.fFruits} — ${region.name}</h2><div class="grid">${fruits.map(p=>card(p)).join('')}</div>` : '';
  const vegHtml = vegetables.length ? `<h2>${t.fVeg} — ${region.name}</h2><div class="grid">${vegetables.map(p=>card(p)).join('')}</div>` : '';
  const emptyHtml = (!fruits.length && !vegetables.length) ? `<p style="background:#fff8f0;border:1px solid #ffe2cc;padding:14px;border-radius:8px">${t.empty}</p>` : '';

  // مناطق أخرى في نفس الدولة للربط الداخلي
  const otherRegions = country.regions.filter(r => r.slug !== region.slug).slice(0, 4);
  const otherRegionsHtml = otherRegions.map(r => `<li><a href="/${slug}/${r.slug}/">تصدير من ${r.name}</a></li>`).join('');

  return `<!DOCTYPE html>
<html lang="${t.lang}" dir="${t.dir}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${t.title(region.name, topProduct)}</title>
<meta name="description" content="${t.meta(region.name, topProduct)}">
<link rel="canonical" href="${url}">
<link rel="icon" type="image/png" href="/alwa.png">
<meta property="og:type" content="website">
<meta property="og:title" content="${t.title(region.name, topProduct)}">
<meta property="og:description" content="${t.meta(region.name, topProduct)}">
<meta property="og:url" content="${url}">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebPage","name":"${t.title(region.name, topProduct)}","url":"${url}","inLanguage":"${t.lang}","isPartOf":{"@type":"WebSite","name":"ALWA","url":"${SITE}/"}}
</script>
${CSS}
</head>
<body>
<header><div class="wrap"><a href="/">ALWA</a> › <a href="/${slug}/">${country.name}</a> › <span>${region.name}</span></div></header>
<main class="wrap">
<h1>${t.h1(region.name)}</h1>
<p>${intro}</p>
${storesBlock()}

<h2>${t.specialtiesTitle(region.name)}</h2>
<p>${t.specialtiesDesc(region.name)}</p>
${fruitsHtml}
${vegHtml}
${emptyHtml}

<ul class="dest">${destinationsHtml}</ul>

<h2>${t.regTitle}</h2>
<p>${t.regIntro}</p>
<ol class="steps">${stepsHtml}</ol>

<h2>${t.fieldsTitle}</h2>
<div class="fields">${fieldsHtml}</div>

<h2>${t.otherRegionsTitle(country.name)}</h2>
<ul class="other-areas">${otherRegionsHtml}</ul>

<div class="faq">
${faqsHtml}
</div>

<h2>${t.contact}</h2>
<div class="contact">
<a href="https://wa.me/9647813130254" target="_blank" rel="noopener">💬 WhatsApp</a>
<a href="mailto:alwairaqe@gmail.com">✉️ alwairaqe@gmail.com</a>
</div>
${storesBlock()}
</main>
<footer><p>© 2026 ${t.footer}</p><p><a href="/" style="color:#f1c548">ALWA</a></p></footer>
</body>
</html>`;
}

function makeCountryPage(country, t) {
  const slug = COUNTRY_SLUG[country.code];
  const url = `${SITE}/${slug}/`;
  const list = country.regions.map(r => `<li><a href="/${slug}/${r.slug}/">تصدير من ${r.name}</a></li>`).join('');

  return `<!DOCTYPE html>
<html lang="${t.lang}" dir="${t.dir}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${t.title(country.name, 'المنتجات الزراعية')}</title>
<meta name="description" content="${t.meta(country.name, 'المنتجات الزراعية')}">
<link rel="canonical" href="${url}">
<link rel="icon" type="image/png" href="/alwa.png">
${CSS}
</head>
<body>
<header><div class="wrap"><a href="/">ALWA</a> › <span>${country.name}</span></div></header>
<main class="wrap">
<h1>${t.h1(country.name)}</h1>
<p>${t.intros[0](country.name, 'المنتجات الزراعية')}</p>
${storesBlock()}
<h2>${t.regTitle}</h2>
<ol class="steps">${t.steps.map(s => `<li>${s}</li>`).join('')}</ol>
<h2>${t.fieldsTitle}</h2>
<div class="fields">${t.fields.map(f => `<div class="row"><span class="lbl">${f.l}</span><span class="hint">${f.h}</span></div>`).join('')}</div>
<h2>${t.fProducts} — ${country.name}</h2>
<ul class="regions">${list}</ul>
${storesBlock()}
</main>
<footer><p>© 2026 ${t.footer}</p></footer>
</body>
</html>`;
}

let totalRegions = 0;
worldRegions.countries.forEach(country => {
  const slug = COUNTRY_SLUG[country.code];
  const t = T[LANG[country.code]];
  if (!slug || !t) { console.warn(`skip ${country.code}`); return; }

  const dir = path.join(OUT, slug);
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true });
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), makeCountryPage(country, t));

  country.regions.forEach(region => {
    const rd = path.join(dir, region.slug);
    fs.mkdirSync(rd, { recursive: true });
    fs.writeFileSync(path.join(rd, 'index.html'), makeRegionPage(country, region, t));
    totalRegions++;
  });
});

console.log(`✅ ${worldRegions.countries.length} دول + ${totalRegions} منطقة`);
console.log(`📂 في: ${OUT}/{thailand,canada,turkey,belgium,italy,spain,china,usa,netherlands,mexico,egypt,syria}/`);
