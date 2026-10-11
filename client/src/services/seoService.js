/**
 * Sri Sri ❤️ HealthCare - Dynamic SEO Management Service
 * Manages document title, meta description, Open Graph tags, canonical URLs
 * and seamless deep-linking query parameters.
 */

const TAB_SEO_DATA = {
  triage: {
    title: 'Sri Sri ❤️ HealthCare | ૨૪ કલાક AI મેડિકલ ડૉક્ટર & વોઇસ સિમ્પ્ટમ ટ્રાયેજ',
    description: 'શ્રી શ્રી હેલ્થકેર AI મેડિકલ ડૉક્ટર - ૨૦૦% સાચું વોઇસ નિદાન, આયુર્વેદિક અને એલોપેથિક ઉપચાર, ૮૫% સસ્તી જન ઔષધિ દવાઓ.',
    keywords: 'ai doctor, voice symptom triage, gujarati ai doctor, telemedicine gujarat'
  },
  ruralCare: {
    title: 'ગ્રામીણ સર્પદંશ સંજીવની (ASV) & ૧૦૮ ઇમરજન્સી લાઈફલાઈન | Sri Sri ❤️ HealthCare',
    description: 'ગ્રામીણ વિસ્તારો માટે તાત્કાલિક સાપ કરડવાની સારવાર, એન્ટિ સ્નેક વેનમ (ASV) સ્ટોક ટ્રેકર અને ૧૦૮ એમ્બ્યુલન્સ ઇમરજન્સી સેતુ.',
    keywords: 'snakebite emergency, asv anti snake venom, rural healthcare gujarat, 108 ambulance'
  },
  medLocator: {
    title: 'જન ઔષધિ કેન્દ્ર ૮૫% સસ્તી દવા રડાર | Sri Sri ❤️ HealthCare',
    description: 'નજીકના પ્રધાનમંત્રી જન ઔષધિ કેન્દ્રો શોધો અને બ્રાન્ડેડ દવાઓની સામે ૮૫% સુધી સસ્તી જેનરિક દવાઓની તાત્કાલિક માહિતી મેળવો.',
    keywords: 'jan aushadhi kendra, generic medicine radar, cheap medicines, dolo 650 generic price'
  },
  chatbot: {
    title: '૨૪ કલાક AI મેડિકલ ડૉક્ટર કન્સલ્ટેશન | Sri Sri ❤️ HealthCare',
    description: 'તમારા રોગના લક્ષણો પૂછો અને AI સુપર-ડૉક્ટર પાસેથી ચોક્કસ ક્લિનિકલ માર્ગદર્શન, ઘરેલું ઉપચાર અને દવાઓની સલાહ મેળવો.',
    keywords: 'ai doctor chat, 24/7 medical consultation, free healthcare chatbot'
  },
  encyclopedia: {
    title: 'સંપૂર્ણ દવા માર્ગદર્શિકા (Medicine Encyclopedia) | Sri Sri ❤️ HealthCare',
    description: 'હજારો દવાઓની ઉપયોગિતા, ડોઝ, આડઅસરો (Side Effects) અને જેનરિક વિકલ્પોની સરળ ગુજરાતી અને અંગ્રેજીમાં માહિતી.',
    keywords: 'medicine encyclopedia, drug side effects, medicine dose guide'
  },
  eye: {
    title: 'ઓનલાઇન આંખ પાવર તપાસ (AI Eye Power Scanner) | Sri Sri ❤️ HealthCare',
    description: 'ઘરે બેઠા સ્માર્ટફોન કે કોમ્પ્યુટરથી આંખની દ્રષ્ટિ ક્ષમતા (Visual Acuity) અને પાવર તપાસો - તદ્દન ફ્રી AI ઓપ્ટોમેટ્રી ટેસ્ટ.',
    keywords: 'online eye power check, eye test gujarati, visual acuity test, vision check'
  },
  vision: {
    title: 'AI વિઝન મેડિકલ ડાયગ્નોસ્ટિક્સ (Medical Image Scan) | Sri Sri ❤️ HealthCare',
    description: 'ચામડીના રોગ, એક્સ-રે, પ્રિસ્ક્રિપ્શન અને લેબ રિપોર્ટના ફોટો અપલોડ કરીને AI આધારિત ક્લિનિકલ વિશ્લેષણ મેળવો.',
    keywords: 'ai medical vision, skin disease ai, prescription scanner, lab report analysis'
  },
  vitals: {
    title: 'રીઅલ-ટાઇમ વાઇટલ્સ અને હાર્ટ રેટ સ્કેનર | Sri Sri ❤️ HealthCare',
    description: 'કેમેરા પલ્સ ડિટેક્શન ટેકનોલોજી દ્વારા તમારા હાર્ટ રેટ (BPM), તણાવ અને શરીરના મહત્વના વાઇટલ્સનું ત્વરિત માપન.',
    keywords: 'heart rate scanner, vitals monitor, camera pulse rate'
  },
  phc: {
    title: 'ગુજરાત PHC, CHC & 108 સરકારી હોસ્પિટલ નેવિગેટર | Sri Sri ❤️ HealthCare',
    description: 'ગુજરાતના તમામ જિલ્લાઓના પ્રાથમિક આરોગ્ય કેન્દ્રો (PHC), સામૂહિક આરોગ્ય કેન્દ્રો (CHC) અને સરકારી હોસ્પિટલો શોધો.',
    keywords: 'phc gujarat, chc hospital, government hospital near me, 108 emergency'
  },
  schemes: {
    title: 'PMJAY આયુષ્માન ભારત & મા અમૃતમ યોજના ઑપ્ટિમાઇઝર | Sri Sri ❤️ HealthCare',
    description: '૫ લાખ સુધીની મફત સારવાર આપતી સરકારી સ્વાસ્થ્ય યોજનાઓ, પાત્રતા ચકાસણી અને માન્ય હોસ્પિટલોની સંપૂર્ણ યાદી.',
    keywords: 'pmjay ayushman bharat, maa amrutam card, free hospital treatment gujarat'
  },
  homeLab: {
    title: 'ઘરે બેઠા લેબ ટેસ્ટ સેમ્પલ કલેક્શન | Sri Sri ❤️ HealthCare',
    description: 'બ્લડ ટેસ્ટ, ડાયાબિટીસ પ્રોફાઇલ, લિપિડ પ્રોફાઇલ વગેરેનું ઘરેથી ફ્રી સેમ્પલ કલેક્શન બુક કરો અને રિપોર્ટ ઓનલાઇન મેળવો.',
    keywords: 'home lab collection, blood test at home, diagnostic test gujarat'
  },
  doctorDirectory: {
    title: 'ગુજરાતના નિષ્ણાત ડૉક્ટર્સ ડિરેક્ટરી | Sri Sri ❤️ HealthCare',
    description: 'એમ.ડી. ફિઝિશિયન, બાળરોગ નિષ્ણાત, હૃદયરોગ નિષ્ણાત અને ગાયનેકોલોજિસ્ટ ડૉક્ટરોની ચકાસાયેલ પ્રોફાઇલ અને એપોઇન્ટમેન્ટ.',
    keywords: 'doctors in gujarat, verified doctor directory, find specialist doctor'
  },
  emotion: {
    title: 'માઇન્ડ & ઇમોશન ડીકોડર AI (Mental Wellness) | Sri Sri ❤️ HealthCare',
    description: 'માનસિક તણાવ, ચિંતા (Anxiety) અને મૂડનું AI વિશ્લેષણ અને યોગ, ધ્યાન તથા સકારાત્મક માર્ગદર્શન.',
    keywords: 'mental health ai, stress decoder, emotion wellness'
  }
};

export const updateSEOMeta = (tab, lang = 'gu') => {
  if (typeof document === 'undefined') return;

  const seo = TAB_SEO_DATA[tab] || TAB_SEO_DATA.triage;
  const canonicalBase = 'https://srisrihealthcare111.netlify.app';
  const targetUrl = tab && tab !== 'triage' ? `${canonicalBase}/?tab=${tab}` : `${canonicalBase}/`;

  // Update Document Title
  document.title = seo.title;

  // Update Meta Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', seo.description);
  }

  // Update Meta Keywords
  let metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords && seo.keywords) {
    metaKeywords.setAttribute('content', `sri sri healthcare, srisrihealthcare111.netlify.app, srisrihealthcare.netlify.app, ${seo.keywords}`);
  }

  // Update Canonical Link
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (canonicalLink) {
    canonicalLink.setAttribute('href', targetUrl);
  }

  // Update Open Graph Tags
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', seo.title);

  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', seo.description);

  let ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', targetUrl);

  // Update Twitter Cards
  let twitterTitle = document.querySelector('meta[name="twitter:title"]');
  if (twitterTitle) twitterTitle.setAttribute('content', seo.title);

  let twitterDesc = document.querySelector('meta[name="twitter:description"]');
  if (twitterDesc) twitterDesc.setAttribute('content', seo.description);

  let twitterUrl = document.querySelector('meta[name="twitter:url"]');
  if (twitterUrl) twitterUrl.setAttribute('content', targetUrl);

  // Sync URL query params without reloading
  if (typeof window !== 'undefined' && window.history) {
    const currentUrl = new URL(window.location.href);
    if (tab && tab !== 'triage') {
      currentUrl.searchParams.set('tab', tab);
    } else {
      currentUrl.searchParams.delete('tab');
    }
    if (lang && lang !== 'gu') {
      currentUrl.searchParams.set('lang', lang);
    } else {
      currentUrl.searchParams.delete('lang');
    }
    window.history.replaceState({}, '', currentUrl.toString());
  }
};

