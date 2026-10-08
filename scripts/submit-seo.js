/**
 * Sri Sri ❤️ HealthCare - Automated SEO & Instant Indexing Submitter
 * Submits URLs to Google, Bing, Yahoo, Yandex via IndexNow API + Sitemaps
 * Configured for Live Domain: https://srisrihealthcare.netlify.app
 */

const https = require('https');

const HOST_NETLIFY = 'srisrihealthcare.netlify.app';
const HOST_CUSTOM = 'www.srisri111.com';
const KEY = 'e819b024479549cca96fb351658e4bb3';

const URLS = [
  `https://${HOST_NETLIFY}/`,
  `https://${HOST_NETLIFY}/?tab=triage`,
  `https://${HOST_NETLIFY}/?tab=ruralCare`,
  `https://${HOST_NETLIFY}/?tab=medLocator`,
  `https://${HOST_NETLIFY}/?tab=chatbot`,
  `https://${HOST_NETLIFY}/?tab=encyclopedia`,
  `https://${HOST_NETLIFY}/?tab=homeLab`,
  `https://${HOST_NETLIFY}/?tab=eye`,
  `https://${HOST_NETLIFY}/?tab=schemes`,
  `https://${HOST_NETLIFY}/?tab=phc`,
  `https://${HOST_CUSTOM}/`,
  `https://${HOST_CUSTOM}/?tab=triage`,
  `https://${HOST_CUSTOM}/?tab=ruralCare`,
  `https://${HOST_CUSTOM}/?tab=medLocator`,
  `https://${HOST_CUSTOM}/?tab=chatbot`
];

async function postIndexNow(host, urls) {
  return new Promise((resolve, reject) => {
    const targetUrls = urls.filter(u => u.includes(host));
    const payload = JSON.stringify({
      host: host,
      key: KEY,
      keyLocation: `https://${host}/${KEY}.txt`,
      urlList: targetUrls
    });

    const options = {
      hostname: 'api.indexnow.org',
      port: 443,
      path: '/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, data });
      });
    });

    req.on('error', err => reject(err));
    req.write(payload);
    req.end();
  });
}

async function pingSearchEngine(url) {
  return new Promise((resolve) => {
    const req = https.get(url, { timeout: 6000 }, (res) => {
      resolve({ url, statusCode: res.statusCode });
    });
    req.on('timeout', () => {
      req.destroy();
      resolve({ url, statusCode: 'TIMEOUT' });
    });
    req.on('error', (e) => {
      resolve({ url, statusCode: 'ERR', error: e.message });
    });
  });
}

async function main() {
  console.log('====================================================================');
  console.log('🕉️ SRI SRI ❤️ HEALTHCARE - SHUBH MUHURAT SEO SUBMISSION ENGINE');
  console.log(`⏰ Launch Timestamp: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
  console.log('====================================================================\n');

  // 1. Submit Netlify Domain to IndexNow (Bing, Yahoo, Naver, Seznam)
  console.log(`📡 [1/3] Submitting Live Cloud Domain (${HOST_NETLIFY}) to IndexNow...`);
  try {
    const res1 = await postIndexNow(HOST_NETLIFY, URLS);
    console.log(`   ✅ IndexNow Netlify Response Code: ${res1.statusCode} (200/202 = Success)`);
  } catch (err) {
    console.warn(`   ⚠️ IndexNow Notice:`, err.message);
  }

  // 2. Submit Custom Domain to IndexNow
  console.log(`\n📡 [2/3] Submitting Custom Domain (${HOST_CUSTOM}) to IndexNow...`);
  try {
    const res2 = await postIndexNow(HOST_CUSTOM, URLS);
    console.log(`   ✅ IndexNow Custom Domain Response Code: ${res2.statusCode} (200/202 = Success)`);
  } catch (err) {
    console.warn(`   ⚠️ IndexNow Notice:`, err.message);
  }

  // 3. Ping Google and Bing Sitemap Endpoints
  console.log(`\n📡 [3/3] Submitting Official Sitemaps to Global Search Engines...`);
  const sitemapNetlify = encodeURIComponent(`https://${HOST_NETLIFY}/sitemap.xml`);
  const sitemapCustom = encodeURIComponent(`https://${HOST_CUSTOM}/sitemap.xml`);
  
  const pings = [
    `https://www.bing.com/ping?sitemap=${sitemapNetlify}`,
    `https://www.bing.com/ping?sitemap=${sitemapCustom}`,
    `https://www.google.com/ping?sitemap=${sitemapNetlify}`
  ];

  for (const p of pings) {
    const r = await pingSearchEngine(p);
    console.log(`   🌐 Ping: ${r.url.substring(0, 50)}... => Status ${r.statusCode}`);
  }

  console.log('\n====================================================================');
  console.log('🎉 SHUBH MUHURAT SEO SUBMISSION COMPLETE! ALL SEARCH ENGINES NOTIFIED.');
  console.log('   Live Site: https://' + HOST_NETLIFY);
  console.log('====================================================================\n');
}

main().catch(console.error);
