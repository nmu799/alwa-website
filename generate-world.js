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
    title: (r) => `تصدير خضار وفواكه من ${r} إلى الخليج وأوروبا وأمريكا | علوة ALWA`,
    meta: (r) => `صدّر خضار وفواكه من ${r} إلى العراق والخليج وأوروبا وأمريكا عبر تطبيق علوة. أنشئ حساب شركة تصدير في دقائق.`,
    h1: (r) => `تصدير خضار وفواكه من ${r}`,
    intros: [
      (r) => `من ${r} إلى أسواق العراق والخليج وأوروبا وأمريكا — تطبيق علوة يفتح باب التصدير الرقمي. سجّل شركتك، وانشر منتجاتك، وتواصل مع المشترين مباشرة.`,
      (r) => `هل تبحث عن طريقة لتصدير خضار وفواكه من ${r}؟ تطبيق علوة يربطك بمستوردي العراق والخليج بدون وسطاء. أنشئ حساب شركة خلال دقائق.`,
      (r) => `${r} تمتلك منتجات زراعية تستحق أن تصل إلى العالم. علوة ALWA يمنحك منصة تصدير كاملة: حساب شركة، نشر المنتجات، وتواصل مباشر مع المشترين.`,
      (r) => `صدّر من ${r} إلى الخليج وأمريكا وأوروبا بضغطة زر. علوة ALWA يجمع المصدرين والمشترين في منصة واحدة — بدون وسطاء، وبدون رسوم.`
    ],
    dest: [
      'تصدير إلى العراق — السوق الأكبر والأقرب جغرافياً',
      'تصدير إلى السعودية والإمارات والكويت وقطر — طلب متزايد على المنتجات الطازجة',
      'تصدير إلى الاتحاد الأوروبي — معايير جودة عالية وأسعار مميزة',
      'تصدير إلى أمريكا الشمالية — سوق واسع للمنتجات الاستوائية والموسمية',
      'تصدير إلى آسيا الوسطى وروسيا — فرص نمو كبيرة'
    ],
    prodTitle: (r) => `منتجات التصدير من ${r}`,
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
      { q:'هل التسجيل في علوة مجاني؟', a:'نعم، التسجيل مجاني بالكامل. لا رسوم اشتراك ولا عمولة على الصفقات.' },
      { q:'كم يستغرق إنشاء حساب شركة؟', a:'أقل من 5 دقائق. بعد تحميل التطبيق، تنشئ حساب مكتب ثم حساب شركة وتملأ البيانات الأربعة.' },
      { q:'إلى أي دول يمكنني التصدير؟', a:'العراق، السعودية، الإمارات، الكويت، قطر، عُمان، البحرين، ودول الاتحاد الأوروبي وأمريكا الشمالية.' },
      { q:'هل أحتاج شركة مسجلة رسمياً؟', a:'يُفضّل ذلك لزيادة الثقة، لكن يمكنك البدء كتاجر فرد والتوسع لاحقاً.' },
      { q:'كيف يتواصل معي المشترون؟', a:'عبر رقم واتساب والبريد الإلكتروني المسجلين في حساب شركتك.' }
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
    title: (r) => `Export Fruits & Vegetables from ${r} to the Gulf, EU & USA | ALWA`,
    meta: (r) => `Export fresh fruits and vegetables from ${r} to Iraq, the Gulf, Europe and North America via ALWA. Create an export company account in minutes.`,
    h1: (r) => `Export Fruits & Vegetables from ${r}`,
    intros: [
      (r) => `From ${r} to markets in Iraq, the Gulf, Europe and North America — ALWA opens the door to digital export. Register your company, publish your products, and connect directly with buyers.`,
      (r) => `Looking for a way to export fruits and vegetables from ${r}? ALWA connects you with importers in Iraq and the Gulf — no middlemen. Create a company account in minutes.`,
      (r) => `${r} produces premium agricultural goods that deserve global markets. ALWA gives you a complete export platform: company account, product publishing, and direct buyer contact.`,
      (r) => `Export from ${r} to the Gulf, America and Europe with one click. ALWA brings exporters and buyers together — no middlemen, no fees.`
    ],
    dest: [
      'Export to Iraq — the largest and closest market',
      'Export to Saudi Arabia, UAE, Kuwait and Qatar — growing demand for fresh produce',
      'Export to the European Union — high quality standards and premium prices',
      'Export to North America — vast market for tropical and seasonal products',
      'Export to Central Asia and Russia — significant growth opportunities'
    ],
    prodTitle: (r) => `Export products from ${r}`,
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
      { q:'Is registration on ALWA free?', a:'Yes, completely free. No subscription fees, no commission on deals.' },
      { q:'How long does it take to create a company account?', a:'Less than 5 minutes: create an Office Account, then a Company Account, then fill in the four fields.' },
      { q:'Which countries can I export to?', a:'Iraq, Saudi Arabia, UAE, Kuwait, Qatar, Oman, Bahrain, plus EU and North America.' },
      { q:'Do I need a formally registered company?', a:'Recommended for trust, but you can start as an individual trader and expand later.' },
      { q:'How will buyers contact me?', a:'Via the WhatsApp number and email registered in your company account.' }
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
    title: (r) => `${r}'dan Körfez, AB ve ABD'ye Meyve Sebze İhracatı | ALWA`,
    meta: (r) => `${r}'dan Irak, Körfez, Avrupa ve Kuzey Amerika'ya taze meyve sebze ihracatı. ALWA ile dakikalar içinde ihracat şirket hesabı açın.`,
    h1: (r) => `${r}'dan Meyve Sebze İhracatı`,
    intros: [
      (r) => `${r}'dan Irak, Körfez, Avrupa ve Kuzey Amerika pazarlarına — ALWA dijital ihracat kapısını açıyor. Şirketinizi kaydedin, ürünlerinizi yayınlayın, alıcılarla doğrudan iletişim kurun.`,
      (r) => `${r}'dan meyve sebze ihraç etmenin bir yolunu mu arıyorsunuz? ALWA sizi Irak ve Körfez ithalatçılarıyla aracısız buluşturur. Dakikalar içinde şirket hesabı oluşturun.`,
      (r) => `${r} dünya pazarlarına ulaşmayı hak eden premium tarım ürünleri üretiyor. ALWA tam bir ihracat platformu sunar: şirket hesabı, ürün yayınlama, doğrudan alıcı iletişimi.`,
      (r) => `${r}'dan Körfez, Amerika ve Avrupa'ya tek tıkla ihracat. ALWA ihracatçıları ve alıcıları bir araya getirir — aracısız, ücretsiz.`
    ],
    dest: [
      'Irak\'a ihracat — en büyük ve en yakın pazar',
      'Suudi Arabistan, BAE, Kuveyt ve Katar\'a ihracat — taze ürünlere artan talep',
      'Avrupa Birliği\'ne ihracat — yüksek kalite standartları ve premium fiyatlar',
      'Kuzey Amerika\'ya ihracat — tropikal ve mevsimlik ürünler için geniş pazar',
      'Orta Asya ve Rusya\'ya ihracat — önemli büyüme fırsatları'
    ],
    prodTitle: (r) => `${r}'dan ihracat ürünleri`,
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
      { q:'ALWA\'ya kayıt ücretsiz mi?', a:'Evet, tamamen ücretsiz. Abonelik ücreti yok, işlemlerden komisyon alınmaz.' },
      { q:'Şirket hesabı açmak ne kadar sürer?', a:'5 dakikadan az: Ofis Hesabı oluşturun, ardından Şirket Hesabı açın, dört alanı doldurun.' },
      { q:'Hangi ülkelere ihracat yapabilirim?', a:'Irak, Suudi Arabistan, BAE, Kuveyt, Katar, Umman, Bahreyn, AB ve Kuzey Amerika.' },
      { q:'Resmi kayıtlı bir şirket gerekli mi?', a:'Güven için önerilir, ancak bireysel tüccar olarak başlayıp sonra büyüyebilirsiniz.' },
      { q:'Alıcılar benimle nasıl iletişim kuracak?', a:'Şirket hesabınıza kayıtlı WhatsApp numarası ve e-posta üzerinden.' }
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
    title: (r) => `Export groenten en fruit uit ${r} naar Golf, EU en VS | ALWA`,
    meta: (r) => `Exporteer verse groenten en fruit uit ${r} naar Irak, de Golf, Europa en Noord-Amerika via ALWA. Open een exporthandelsaccount in minuten.`,
    h1: (r) => `Export groenten en fruit uit ${r}`,
    intros: [
      (r) => `Van ${r} naar markten in Irak, de Golf, Europa en Noord-Amerika — ALWA opent de deur naar digitale export. Registreer uw bedrijf, publiceer uw producten en communiceer rechtstreeks met kopers.`,
      (r) => `Op zoek naar een manier om groenten en fruit uit ${r} te exporteren? ALWA verbindt u met importeurs in Irak en de Golf — zonder tussenpersonen.`,
      (r) => `${r} produceert premium landbouwproducten die wereldmarkten verdienen. ALWA biedt een compleet exportplatform: bedrijfsaccount, productpublicatie en directe contacten met kopers.`,
      (r) => `Exporteer uit ${r} naar de Golf, Amerika en Europa met één klik. ALWA brengt exporteurs en kopers samen — zonder tussenpersonen, zonder kosten.`
    ],
    dest: [
      'Export naar Irak — de grootste en dichtstbijzijnde markt',
      'Export naar Saoedi-Arabië, VAE, Koeweit en Qatar — groeiende vraag naar verse producten',
      'Export naar de Europese Unie — hoge kwaliteitsnormen en premium prijzen',
      'Export naar Noord-Amerika — enorme markt voor tropische en seizoensproducten',
      'Export naar Centraal-Azië en Rusland — aanzienlijke groeikansen'
    ],
    prodTitle: (r) => `Exportproducten uit ${r}`,
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
      { q:'Is registratie op ALWA gratis?', a:'Ja, volledig gratis. Geen abonnementskosten, geen commissie op transacties.' },
      { q:'Hoe lang duurt het om een bedrijfsaccount aan te maken?', a:'Minder dan 5 minuten: Office-account, dan Company-account, dan de vier velden invullen.' },
      { q:'Naar welke landen kan ik exporteren?', a:'Irak, Saoedi-Arabië, VAE, Koeweit, Qatar, Oman, Bahrein, plus de EU en Noord-Amerika.' },
      { q:'Heb ik een formeel geregistreerd bedrijf nodig?', a:'Aanbevolen voor vertrouwen, maar u kunt als individuele handelaar beginnen en later uitbreiden.' },
      { q:'Hoe nemen kopers contact met mij op?', a:'Via het WhatsApp-nummer en e-mailadres dat in uw bedrijfsaccount is geregistreerd.' }
    ],
    cta:'Download de app en begin met exporteren',
    contact:'Neem contact op met het ALWA-team',
    fProducts:'Beschikbare exportproducten',
    fFruits:'Fruit',
    fVeg:'Groenten',
    footer:'ALWA — Groenten & Fruit Exportplatform',
    empty:'Gedetailleerde producten voor deze regio worden binnenkort toegevoegd. Neem contact met ons op voor beschikbare exportproducten.'
  },

  it: {
    lang:'it', dir:'ltr',
    title: (r) => `Esporta frutta e verdura da ${r} verso Golfo, UE e USA | ALWA`,
    meta: (r) => `Esporta frutta e verdura fresca da ${r} verso Iraq, Golfo, Europa e Nord America tramite ALWA. Crea un conto aziendale per l'export in pochi minuti.`,
    h1: (r) => `Esporta frutta e verdura da ${r}`,
    intros: [
      (r) => `Da ${r} ai mercati di Iraq, Golfo, Europa e Nord America — ALWA apre la porta all'export digitale. Registra la tua azienda, pubblica i tuoi prodotti e comunica direttamente con gli acquirenti.`,
      (r) => `Cerchi un modo per esportare frutta e verdura da ${r}? ALWA ti collega con importatori in Iraq e nel Golfo — senza intermediari.`,
      (r) => `${r} produce prodotti agricoli premium che meritano i mercati globali. ALWA offre una piattaforma completa: conto aziendale, pubblicazione prodotti e contatto diretto con gli acquirenti.`,
      (r) => `Esporta da ${r} verso Golfo, America ed Europa con un clic. ALWA unisce esportatori e acquirenti — senza intermediari, senza commissioni.`
    ],
    dest: [
      'Export verso l\'Iraq — il mercato più grande e vicino',
      'Export verso Arabia Saudita, EAU, Kuwait e Qatar — domanda crescente di prodotti freschi',
      'Export verso l\'Unione Europea — elevati standard qualitativi e prezzi premium',
      'Export verso il Nord America — vasto mercato per prodotti tropicali e stagionali',
      'Export verso Asia Centrale e Russia — significative opportunità di crescita'
    ],
    prodTitle: (r) => `Prodotti da esportazione da ${r}`,
    regTitle: 'Come creare un conto aziendale per l\'export su ALWA',
    regIntro: 'Segui questi passaggi per creare un conto aziendale pronto per la pubblicazione:',
    steps: [
      'Scarica l\'app ALWA da Google Play o App Store',
      'Crea un Office Account — l\'Office gestisce le tue aziende',
      'All\'interno dell\'Office, crea un Company Account',
      'Compila i dati aziendali: nome, paese, Gmail, numero WhatsApp',
      'Pubblica i tuoi prodotti da esportazione con foto e quantità disponibili',
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
      { q:'La registrazione su ALWA è gratuita?', a:'Sì, completamente gratuita. Nessun costo di abbonamento, nessuna commissione sulle transazioni.' },
      { q:'Quanto tempo serve per creare un conto aziendale?', a:'Meno di 5 minuti: crea Office Account, poi Company Account, poi compila i quattro campi.' },
      { q:'Verso quali paesi posso esportare?', a:'Iraq, Arabia Saudita, EAU, Kuwait, Qatar, Oman, Bahrein, più UE e Nord America.' },
      { q:'Serve un\'azienda formalmente registrata?', a:'Raccomandato per la fiducia, ma puoi iniziare come commerciante individuale ed espanderti.' },
      { q:'Come mi contatteranno gli acquirenti?', a:'Tramite il numero WhatsApp e l\'email registrati nel tuo conto aziendale.' }
    ],
    cta:'Scarica l\'app e inizia a esportare',
    contact:'Contatta il team ALWA',
    fProducts:'Prodotti da esportazione disponibili',
    fFruits:'Frutta',
    fVeg:'Verdura',
    footer:'ALWA — Piattaforma di Export Frutta e Verdura',
    empty:'I prodotti dettagliati per questa regione saranno aggiunti presto. Contattaci per conoscere i prodotti disponibili.'
  },

  es: {
    lang:'es', dir:'ltr',
    title: (r) => `Exportar frutas y verduras desde ${r} al Golfo, UE y EE.UU. | ALWA`,
    meta: (r) => `Exporta frutas y verduras frescas desde ${r} a Irak, el Golfo, Europa y Norteamérica mediante ALWA. Crea una cuenta de empresa exportadora en minutos.`,
    h1: (r) => `Exportar frutas y verduras desde ${r}`,
    intros: [
      (r) => `Desde ${r} a los mercados de Irak, el Golfo, Europa y Norteamérica — ALWA abre la puerta a la exportación digital. Registra tu empresa, publica tus productos y comunícate directamente con compradores.`,
      (r) => `¿Buscas una forma de exportar frutas y verduras desde ${r}? ALWA te conecta con importadores en Irak y el Golfo — sin intermediarios.`,
      (r) => `${r} produce productos agrícolas premium que merecen los mercados globales. ALWA ofrece una plataforma completa: cuenta de empresa, publicación de productos y contacto directo con compradores.`,
      (r) => `Exporta desde ${r} al Golfo, América y Europa con un clic. ALWA une exportadores y compradores — sin intermediarios, sin comisiones.`
    ],
    dest: [
      'Exportar a Irak — el mercado más grande y cercano',
      'Exportar a Arabia Saudita, EAU, Kuwait y Catar — demanda creciente de productos frescos',
      'Exportar a la Unión Europea — altos estándares de calidad y precios premium',
      'Exportar a Norteamérica — vasto mercado para productos tropicales y de temporada',
      'Exportar a Asia Central y Rusia — importantes oportunidades de crecimiento'
    ],
    prodTitle: (r) => `Productos de exportación desde ${r}`,
    regTitle: 'Cómo crear una cuenta de empresa exportadora en ALWA',
    regIntro: 'Sigue estos pasos para crear una cuenta de empresa lista para publicar:',
    steps: [
      'Descarga la app ALWA desde Google Play o App Store',
      'Crea una Office Account — la Office gestiona tus empresas',
      'Dentro de la Office, crea una Company Account',
      'Completa los datos de la empresa: nombre, país, Gmail, número de WhatsApp',
      'Publica tus productos de exportación con fotos y cantidades disponibles',
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
      { q:'¿Es gratis registrarse en ALWA?', a:'Sí, totalmente gratis. Sin cuotas de suscripción, sin comisiones en transacciones.' },
      { q:'¿Cuánto tarda crear una cuenta de empresa?', a:'Menos de 5 minutos: crea Office Account, luego Company Account, luego rellena los cuatro campos.' },
      { q:'¿A qué países puedo exportar?', a:'Irak, Arabia Saudita, EAU, Kuwait, Catar, Omán, Baréin, más UE y Norteamérica.' },
      { q:'¿Necesito una empresa registrada formalmente?', a:'Recomendado para generar confianza, pero puedes empezar como comerciante individual y ampliar.' },
      { q:'¿Cómo me contactarán los compradores?', a:'Mediante el número de WhatsApp y el correo registrados en tu cuenta de empresa.' }
    ],
    cta:'Descarga la app y comienza a exportar',
    contact:'Contacta con el equipo de ALWA',
    fProducts:'Productos de exportación disponibles',
    fFruits:'Frutas',
    fVeg:'Verduras',
    footer:'ALWA — Plataforma de Exportación de Frutas y Verduras',
    empty:'Los productos detallados de esta región se añadirán pronto. Contáctanos para conocer los productos disponibles.'
  },

  zh: {
    lang:'zh', dir:'ltr',
    title: (r) => `从${r}出口水果蔬菜到海湾、欧盟和美国 | ALWA`,
    meta: (r) => `通过ALWA应用从${r}向伊拉克、海湾、欧洲和北美出口新鲜水果和蔬菜。几分钟内创建出口公司账户。`,
    h1: (r) => `从${r}出口水果和蔬菜`,
    intros: [
      (r) => `从${r}到伊拉克、海湾、欧洲和北美市场——ALWA打开数字出口的大门。注册您的公司，发布产品，直接与买家沟通。`,
      (r) => `正在寻找从${r}出口水果和蔬菜的方法？ALWA将您与伊拉克和海湾的进口商联系起来——没有中间商。`,
      (r) => `${r}生产优质的农产品，应该进入全球市场。ALWA提供完整的出口平台：公司账户、产品发布和直接与买家联系。`,
      (r) => `从${r}一键出口到海湾、美国和欧洲。ALWA将出口商和买家聚集在一起——无中间商，无费用。`
    ],
    dest: [
      '出口到伊拉克——最大且最近的市场',
      '出口到沙特、阿联酋、科威特和卡塔尔——对新鲜产品需求旺盛',
      '出口到欧盟——高质量标准和溢价',
      '出口到北美——热带和季节性产品的巨大市场',
      '出口到中亚和俄罗斯——重大增长机会'
    ],
    prodTitle: (r) => `${r}出口产品`,
    regTitle: '如何在ALWA上创建出口公司账户',
    regIntro: '按照以下步骤创建可发布的公司账户：',
    steps: [
      '从Google Play或App Store下载ALWA应用',
      '创建Office Account——Office管理您的公司',
      '在Office中创建Company Account',
      '填写公司信息：名称、国家、Gmail、WhatsApp号码',
      '发布您的出口产品，附上照片和可用数量',
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
      { q:'在ALWA注册是免费的吗？', a:'是的，完全免费。没有订阅费，没有交易佣金。' },
      { q:'创建公司账户需要多长时间？', a:'不到5分钟：先创建Office Account，再创建Company Account，然后填写四项信息。' },
      { q:'我可以向哪些国家出口？', a:'伊拉克、沙特、阿联酋、科威特、卡塔尔、阿曼、巴林，以及欧盟和北美。' },
      { q:'我需要正式注册的公司吗？', a:'建议注册以建立信任，但可以先以个体商人身份开始，之后扩展。' },
      { q:'买家如何联系我？', a:'通过您公司账户注册的WhatsApp号码和邮箱。' }
    ],
    cta:'下载应用开始出口',
    contact:'联系ALWA团队',
    fProducts:'可出口的产品',
    fFruits:'水果',
    fVeg:'蔬菜',
    footer:'ALWA——水果蔬菜出口平台',
    empty:'该地区的详细产品即将添加。请与我们联系了解可出口的产品。'
  },

  th: {
    lang:'th', dir:'ltr',
    title: (r) => `ส่งออกผักและผลไม้จาก${r}ไปอ่าว ยุโรป และสหรัฐฯ | ALWA`,
    meta: (r) => `ส่งออกผักและผลไม้สดจาก${r}ไปยังอิรัก อ่าวเปอร์เซีย ยุโรป และอเมริกาเหนือผ่านแอป ALWA สร้างบัญชีบริษัทส่งออกได้ในไม่กี่นาที`,
    h1: (r) => `ส่งออกผักและผลไม้จาก${r}`,
    intros: [
      (r) => `จาก${r}ไปยังตลาดในอิรัก อ่าวเปอร์เซีย ยุโรป และอเมริกาเหนือ — ALWA เปิดประตูสู่การส่งออกดิจิทัล ลงทะเบียนบริษัท เผยแพร่สินค้า และติดต่อผู้ซื้อโดยตรง`,
      (r) => `กำลังมองหาวิธีส่งออกผักและผลไม้จาก${r}อยู่หรือไม่? ALWA เชื่อมคุณกับผู้นำเข้าในอิรักและอ่าวเปอร์เซีย — ไม่มีคนกลาง`,
      (r) => `${r}ผลิตสินค้าเกษตรคุณภาพพรีเมียมที่สมควรเข้าสู่ตลาดโลก ALWA มอบแพลตฟอร์มส่งออกครบวงจร: บัญชีบริษัท การเผยแพร่สินค้า และการติดต่อผู้ซื้อโดยตรง`,
      (r) => `ส่งออกจาก${r}ไปยังอ่าว อเมริกา และยุโรปด้วยคลิกเดียว ALWA รวมผู้ส่งออกและผู้ซื้อไว้ในแพลตฟอร์มเดียว — ไม่มีคนกลาง ไม่มีค่าธรรมเนียม`
    ],
    dest: [
      'ส่งออกไปยังอิรัก — ตลาดที่ใหญ่ที่สุดและใกล้ที่สุด',
      'ส่งออกไปยังซาอุดีอาระเบีย สหรัฐอาหรับเอมิเรตส์ คูเวต และกาตาร์ — ความต้องการสินค้าสดเพิ่มขึ้น',
      'ส่งออกไปยังสหภาพยุโรป — มาตรฐานคุณภาพสูงและราคาพรีเมียม',
      'ส่งออกไปยังอเมริกาเหนือ — ตลาดขนาดใหญ่สำหรับสินค้าเขตร้อนและตามฤดูกาล',
      'ส่งออกไปยังเอเชียกลางและรัสเซีย — โอกาสเติบโตที่สำคัญ'
    ],
    prodTitle: (r) => `สินค้าส่งออกจาก${r}`,
    regTitle: 'วิธีสร้างบัญชีบริษัทส่งออกบน ALWA',
    regIntro: 'ทำตามขั้นตอนเหล่านี้เพื่อสร้างบัญชีบริษัทพร้อมเผยแพร่:',
    steps: [
      'ดาวน์โหลดแอป ALWA จาก Google Play หรือ App Store',
      'สร้าง Office Account — Office จัดการบริษัทของคุณ',
      'ภายใน Office สร้าง Company Account',
      'กรอกข้อมูลบริษัท: ชื่อ ประเทศ Gmail หมายเลข WhatsApp',
      'เผยแพร่สินค้าส่งออกพร้อมรูปภาพและปริมาณที่มี',
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
      { q:'การลงทะเบียนบน ALWA ฟรีหรือไม่?', a:'ใช่ ฟรีทั้งหมด ไม่มีค่าสมาชิก ไม่มีค่าคอมมิชชั่นจากธุรกรรม' },
      { q:'ใช้เวลานานเท่าไรในการสร้างบัญชีบริษัท?', a:'น้อยกว่า 5 นาที: สร้าง Office Account จากนั้น Company Account แล้วกรอกสี่ช่อง' },
      { q:'ฉันสามารถส่งออกไปยังประเทศใดได้บ้าง?', a:'อิรัก ซาอุดีอาระเบีย สหรัฐอาหรับเอมิเรตส์ คูเวต กาตาร์ โอมาน บาห์เรน รวมถึงสหภาพยุโรปและอเมริกาเหนือ' },
      { q:'ต้องมีบริษัทจดทะเบียนอย่างเป็นทางการหรือไม่?', a:'แนะนำเพื่อสร้างความน่าเชื่อถือ แต่สามารถเริ่มเป็นพ่อค้ารายบุคคลและขยายในภายหลังได้' },
      { q:'ผู้ซื้อจะติดต่อฉันได้อย่างไร?', a:'ผ่านหมายเลข WhatsApp และอีเมลที่ลงทะเบียนในบัญชีบริษัทของคุณ' }
    ],
    cta:'ดาวน์โหลดแอปและเริ่มส่งออก',
    contact:'ติดต่อทีม ALWA',
    fProducts:'สินค้าส่งออกที่มีอยู่',
    fFruits:'ผลไม้',
    fVeg:'ผัก',
    footer:'ALWA — แพลตฟอร์มส่งออกผักและผลไม้',
    empty:'สินค้าโดยละเอียดสำหรับภูมิภาคนี้จะถูกเพิ่มในเร็วๆ นี้ ติดต่อเราเพื่อทราบสินค้าที่พร้อมส่งออก'
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
  const intro = pick(seed+'-i', t.intros)(region.name);
  const destinationsHtml = t.dest.map(d => `<li>${d}</li>`).join('');
  const fieldsHtml = t.fields.map(f => `<div class="row"><span class="lbl">${f.l}</span><span class="hint">${f.h}</span></div>`).join('');
  const stepsHtml = t.steps.map(s => `<li>${s}</li>`).join('');
  const faqsHtml = t.faqs.map(f => `<h3>${f.q}</h3><p>${f.a}</p>`).join('');
  const fruitsHtml = fruits.length ? `<h2>${t.fFruits} — ${region.name}</h2><div class="grid">${fruits.map(p=>card(p)).join('')}</div>` : '';
  const vegHtml = vegetables.length ? `<h2>${t.fVeg} — ${region.name}</h2><div class="grid">${vegetables.map(p=>card(p)).join('')}</div>` : '';
  const emptyHtml = (!fruits.length && !vegetables.length) ? `<p style="background:#fff8f0;border:1px solid #ffe2cc;padding:14px;border-radius:8px">${t.empty}</p>` : '';

  return `<!DOCTYPE html>
<html lang="${t.lang}" dir="${t.dir}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${t.title(region.name)}</title>
<meta name="description" content="${t.meta(region.name)}">
<link rel="canonical" href="${url}">
<link rel="icon" type="image/png" href="/alwa.png">
<meta property="og:type" content="website">
<meta property="og:title" content="${t.h1(region.name)}">
<meta property="og:description" content="${t.meta(region.name)}">
<meta property="og:url" content="${url}">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebPage","name":"${t.h1(region.name)}","url":"${url}","inLanguage":"${t.lang}","isPartOf":{"@type":"WebSite","name":"ALWA","url":"${SITE}/"}}
</script>
${CSS}
</head>
<body>
<header><div class="wrap"><a href="/">ALWA</a> › <a href="/${slug}/">${country.name}</a> › <span>${region.name}</span></div></header>
<main class="wrap">
<h1>${t.h1(region.name)}</h1>
<p>${intro}</p>
${storesBlock()}

<h2>${t.regTitle}</h2>
<p>${t.regIntro}</p>
<ol class="steps">${stepsHtml}</ol>

<h2>${t.fieldsTitle}</h2>
<div class="fields">${fieldsHtml}</div>

<ul class="dest">${destinationsHtml}</ul>

${fruitsHtml}
${vegHtml}
${emptyHtml}

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
  const list = country.regions.map(r => `<li><a href="/${slug}/${r.slug}/">${r.name}</a></li>`).join('');

  return `<!DOCTYPE html>
<html lang="${t.lang}" dir="${t.dir}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${t.title(country.name)}</title>
<meta name="description" content="${t.meta(country.name)}">
<link rel="canonical" href="${url}">
<link rel="icon" type="image/png" href="/alwa.png">
${CSS}
</head>
<body>
<header><div class="wrap"><a href="/">ALWA</a> › <span>${country.name}</span></div></header>
<main class="wrap">
<h1>${t.h1(country.name)}</h1>
<p>${pick(country.code+'-i', t.intros)(country.name)}</p>
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
