import { SITE, CATEGORIES, SOCIAL } from './config.mjs';
import { esc, stripHtml, truncate, readMinutes, wordCount, formatDate, formatShortDate, initials, prepareContent } from './util.mjs';

/* ---------- Alamat ---------- */
export const catById = id => CATEGORIES.find(category => category.id === id);
export const articleUrl = article => `/${article.slug}/`;
export const categoryUrl = (id, page = 1) => (page > 1 ? `/kategori/${id}/halaman/${page}/` : `/kategori/${id}/`);
export const homeUrl = (page = 1) => (page > 1 ? `/halaman/${page}/` : '/');
export const abs = path => `${SITE.url}${path}`;

const jsonLd = data => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
const ICON = {
  search: 'M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
  pin: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
  mail: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
  phone: 'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z',
  instagram: 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.81.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.81-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.81-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.81.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 3.68A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4zm6.4-10.4a1.44 1.44 0 1 1-1.44-1.44 1.44 1.44 0 0 1 1.44 1.44z',
  tiktok: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  youtube: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  rss: 'M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20 5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z',
};
const svg = name => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICON[name]}"/></svg>`;
const socialIcons = () => (SOCIAL.tiktok ? `<a href="${esc(SOCIAL.tiktok)}" target="_blank" rel="noopener noreferrer" aria-label="TikTok">${svg('tiktok')}</a>` : '') + (SOCIAL.youtube ? `<a href="${esc(SOCIAL.youtube)}" target="_blank" rel="noopener noreferrer" aria-label="YouTube">${svg('youtube')}</a>` : '');

/* ---------- Pecahan halaman ---------- */
function logoImg(ctx, className = 'logo-mark') {
  const alt = `${SITE.brand} Jurnal`;
  if (ctx.logo.includes('ik.imagekit.io') && ctx.logo.includes('tr=f-jpg')) {
    return `<picture><source srcset="${esc(ctx.logo.replace('tr=f-jpg', 'tr=f-avif'))}" type="image/avif"><source srcset="${esc(ctx.logo.replace('tr=f-jpg', 'tr=f-webp'))}" type="image/webp"><img class="${className}" src="${esc(ctx.logo)}" width="172" height="50" alt="${esc(alt)}"></picture>`;
  }
  return `<img class="${className}" src="${esc(ctx.logo)}" width="172" height="50" alt="${esc(alt)}">`;
}

function header(ctx, path) {
  const links = ctx.navCats.map(category => {
    const current = path.startsWith(`/kategori/${category.id}/`) ? ' aria-current="page"' : '';
    return `<li><a href="${categoryUrl(category.id)}"${current}>${esc(category.nav)}</a></li>`;
  }).join('');
  const instagram = ctx.contact.instagram ? `https://www.instagram.com/${ctx.contact.instagram.replace(/^@/, '')}` : '';
  return `
<div class="topbar">
  <div class="container topbar-inner">
    <div class="topbar-left"><span>Jurnal properti, wisata &amp; pariwisata Bandung</span></div>
    <div class="topbar-right">
      <a href="${SITE.mainUrl}">yourhome.id</a>
      ${instagram ? `<a href="${esc(instagram)}" rel="noopener" aria-label="Instagram">${svg('instagram')}</a>` : ''}${socialIcons()}
      <a href="/rss.xml" aria-label="RSS">${svg('rss')}</a>
    </div>
  </div>
</div>
<nav class="navbar" id="navbar" aria-label="Navigasi utama">
  <div class="container nav-inner">
    <a href="/" class="logo" aria-label="${esc(SITE.name)} - beranda">${logoImg(ctx)}</a>
    <ul class="nav-links" id="navLinks">
      <li><a href="${SITE.mainUrl}">Beranda</a></li>
      <li><a href="/"${path === '/' ? ' aria-current="page"' : ''}>Jurnal</a></li>
      ${links}
    </ul>
    <div class="nav-actions">
      <form class="search-box" action="/cari/" method="get" role="search">
        ${svg('search')}
        <input type="search" name="q" class="search-input" placeholder="Cari artikel..." aria-label="Cari artikel">
      </form>
      <a href="${SITE.mainUrl}" class="btn btn-primary" target="_blank" rel="noopener noreferrer" title="Sewa penginapan, villa, dan kosan di YOUR HOME">Sewa Penginapan</a>
      <button class="menu-toggle" id="menuToggle" aria-label="Buka menu" aria-expanded="false" aria-controls="navLinks">&#9776;</button>
    </div>
  </div>
</nav>`;
}

function footer(ctx) {
  const { contact } = ctx;
  const instagram = contact.instagram ? `https://www.instagram.com/${contact.instagram.replace(/^@/, '')}` : '';
  const phoneDigits = String(contact.phone || '').replace(/[^\d+]/g, '');
  const categoryLinks = ctx.navCats.map(category => `<li><a href="${categoryUrl(category.id)}">${esc(category.label)}</a></li>`).join('');
  return `
<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="/" aria-label="${esc(SITE.name)}">${ctx.footerLogo
          ? `<img class="logo-mark footer-logo" src="${esc(ctx.footerLogo)}" width="192" height="58" alt="${esc(`${SITE.brand} Jurnal`)}" loading="lazy">`
          : logoImg(ctx)}</a>
        <p><strong style="color:#fff;font-family:'Playfair Display',serif;font-weight:600">${esc(SITE.name)}</strong> menghadirkan panduan properti, wisata Bandung, dan pariwisata Indonesia dari tim ${esc(SITE.brand)}.</p>
        <div class="social-follow">
          <span class="social-title">Ikuti Kami</span>
          <div class="social-row">${instagram ? `<a href="${esc(instagram)}" rel="noopener" aria-label="Instagram">${svg('instagram')}</a>` : ''}${socialIcons()}<a href="/rss.xml" aria-label="RSS">${svg('rss')}</a></div>
        </div>
      </div>
      <div class="footer-col"><h4>Kategori</h4><ul>${categoryLinks || '<li><span style="color:rgba(255,255,255,.5);font-size:.88rem">Segera hadir</span></li>'}</ul></div>
      <div class="footer-col"><h4>Jelajahi</h4><ul>
        <li><a href="${SITE.mainUrl}">Beranda</a></li>
        <li><a href="/">Jurnal</a></li>
        <li><a href="/cari/">Cari Artikel</a></li>
        <li><a href="/rss.xml">RSS</a></li>
      </ul></div>
      <div class="footer-col"><h4>Hubungi Kami</h4><ul class="footer-contact">
        ${contact.location ? `<li>${svg('pin')}<span>${esc(contact.location)}</span></li>` : ''}
        ${contact.email ? `<li>${svg('mail')}<a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a></li>` : ''}
        ${contact.phone ? `<li>${svg('phone')}<a href="tel:${esc(phoneDigits)}">${esc(contact.phone)}</a></li>` : ''}
      </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <div>© ${ctx.year} ${esc(SITE.brand)} · ${esc(SITE.name)} — Comfort in Every Corner of Bandung.</div>
    </div>
  </div>
</footer>`;
}

export function layout(ctx, { title, description, path, ogImage, ogType = 'website', noindex = false, jsonld = [], head = '', body, bodyClass = '' }) {
  const canonical = abs(path);
  const image = ogImage || ctx.logo;
  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
<meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}">
<meta name="theme-color" content="#3E2723">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:locale" content="id_ID">
<meta property="og:type" content="${ogType}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(image)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(image)}">
${head}<link rel="alternate" type="application/rss+xml" title="${esc(SITE.name)}" href="/rss.xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/style.css?v=${ctx.cssVersion}">
${jsonld.map(jsonLd).join('\n')}
</head>
<body class="${bodyClass}">
<a class="skip-link" href="#konten">Langsung ke konten</a>
<div class="progress-bar" id="progressBar"></div>
${header(ctx, path)}
<main id="konten">
${body}
</main>
${footer(ctx)}
<script src="/assets/app.js" defer></script>
</body>
</html>
`;
}

/* ---------- Komponen ---------- */
const excerptOf = article => article.excerpt || truncate(stripHtml(article.content), 170);

function card(article) {
  const category = catById(article.category);
  return `<article class="article-card">
  <div class="article-img">
    <a href="${articleUrl(article)}" tabindex="-1" aria-hidden="true"><img src="${esc(article.cover_url)}" alt="${esc(article.cover_alt)}" width="800" height="450" loading="lazy" decoding="async"></a>
    ${category ? `<a class="article-cat cat-link" href="${categoryUrl(category.id)}">${esc(category.label)}</a>` : ''}
  </div>
  <div class="article-body">
    <div class="article-meta"><time datetime="${esc(article.published_at)}">${esc(formatShortDate(article.published_at))}</time><span>·</span><span>${readMinutes(article.content)} menit baca</span></div>
    <h3><a href="${articleUrl(article)}">${esc(article.title)}</a></h3>
    <p>${esc(excerptOf(article))}</p>
    <div class="article-foot">
      <div class="article-author"><div class="article-author-avatar">${esc(initials(article.author))}</div><span>${esc(article.author || 'Tim YOUR HOME')}</span></div>
      <span class="article-read">Baca selengkapnya →</span>
    </div>
  </div>
</article>`;
}

function sidebar(ctx, excludeIds = []) {
  const exclude = new Set(Array.isArray(excludeIds) ? excludeIds : [excludeIds]);
  const latest = ctx.latest.filter(article => !exclude.has(article.id)).slice(0, 5);
  const popular = latest.map(article => {
    const category = catById(article.category);
    return `<li><a class="popular-item" href="${articleUrl(article)}">
      <img class="popular-thumb" src="${esc(article.cover_url)}" alt="" width="74" height="74" loading="lazy" decoding="async">
      <span class="popular-info"><span class="pop-cat">${esc(category?.label || '')}</span><h5>${esc(article.title)}</h5><span class="pop-meta">${esc(formatShortDate(article.published_at))}</span></span>
    </a></li>`;
  }).join('');
  const categories = ctx.navCats.map(category => `<li><a href="${categoryUrl(category.id)}"><span>${esc(category.label)}</span><span class="count">${category.count}</span></a></li>`).join('');
  return `<aside class="sidebar" aria-label="Sidebar">
  ${popular ? `<section class="side-block"><div class="side-block-head"><h4>Artikel Terbaru</h4></div><ul class="popular-list">${popular}</ul></section>` : ''}
  ${categories ? `<section class="side-block cat-block"><div class="side-block-head"><h4>Kategori</h4></div><ul>${categories}</ul></section>` : ''}
  <section class="side-cta"><h4>Cari penginapan di Bandung?</h4><p>Villa, apartemen, guest house, dan kosan pilihan dari ${esc(SITE.brand)}.</p><a class="btn" href="${SITE.mainUrl}">Lihat Properti</a></section>
</aside>`;
}

function trendingStrip(ctx, excludeIds = []) {
  const exclude = new Set(excludeIds);
  const items = ctx.latest.filter(article => !exclude.has(article.id)).slice(0, 5);
  if (items.length < 2) return '';
  const cards = items.map((article, index) => {
    const category = catById(article.category);
    return `<a class="trend-card" href="${articleUrl(article)}">
      <span class="trend-num">${String(index + 1).padStart(2, '0')}</span>
      <span class="trend-info"><h5>${esc(article.title)}</h5><span>${esc(category?.label || '')} · ${readMinutes(article.content)} menit</span></span>
    </a>`;
  }).join('');
  return `<section class="trending">
  <div class="container">
    <div class="trending-head"><h3>Artikel Lainnya</h3></div>
    <div class="trending-grid">${cards}</div>
  </div>
</section>`;
}

function connectCta(ctx) {
  const { contact } = ctx;
  const instagram = contact.instagram ? `https://www.instagram.com/${contact.instagram.replace(/^@/, '')}` : '';
  const waDigits = String(contact.phone || '').replace(/[^\d]/g, '').replace(/^0/, '62');
  const whatsapp = waDigits ? `https://wa.me/${waDigits}` : '';
  const stats = [
    ctx.totalPublished ? { value: `${ctx.totalPublished}`, label: 'Artikel diterbitkan' } : null,
    ctx.navCats.length ? { value: `${ctx.navCats.length}`, label: 'Kategori dibahas' } : null,
  ].filter(Boolean);
  return `<section class="newsletter-cta" id="connect">
  <div class="container newsletter-inner">
    <span class="eyebrow">${esc(SITE.name)}</span>
    <h2>Mau Update Artikel &amp; Properti Terbaru?</h2>
    <p>Ikuti Instagram atau hubungi tim kami langsung untuk info properti, promo, dan cerita baru seputar Bandung.</p>
    <div class="newsletter-form" style="justify-content:center">
      ${instagram ? `<a class="btn btn-primary" href="${esc(instagram)}" rel="noopener">Ikuti Instagram</a>` : ''}
      ${whatsapp ? `<a class="btn btn-outline" style="color:var(--white);border-color:rgba(255,255,255,.5)" href="${esc(whatsapp)}" target="_blank" rel="noopener">Chat WhatsApp</a>` : ''}
    </div>
    ${stats.length ? `<div class="news-stats">${stats.map(stat => `<div class="news-stat"><strong>${esc(stat.value)}</strong><span>${esc(stat.label)}</span></div>`).join('')}</div>` : ''}
  </div>
</section>`;
}

function pager(page, pages, urlFor) {
  if (pages <= 1) return '';
  const items = [];
  const push = (label, target, current = false) => items.push(current ? `<span class="current" aria-current="page">${label}</span>` : `<a href="${urlFor(target)}">${label}</a>`);
  if (page > 1) items.push(`<a href="${urlFor(page - 1)}" rel="prev">← Sebelumnya</a>`);
  const shown = new Set([1, pages, page, page - 1, page + 1]);
  let last = 0;
  for (let number = 1; number <= pages; number++) {
    if (!shown.has(number)) continue;
    if (number - last > 1) items.push('<span class="gap">…</span>');
    push(number, number, number === page);
    last = number;
  }
  if (page < pages) items.push(`<a href="${urlFor(page + 1)}" rel="next">Berikutnya →</a>`);
  return `<nav class="pager" aria-label="Halaman">${items.join('')}</nav>`;
}

export const paginate = (items, size) => Array.from({ length: Math.max(1, Math.ceil(items.length / size)) }, (_, index) => items.slice(index * size, (index + 1) * size));

/* ---------- Beranda ---------- */
export function homePage(ctx, { hero, items, page, pages }) {
  const path = homeUrl(page);
  const pageSuffix = page > 1 ? ` – Halaman ${page}` : '';
  const title = page > 1 ? `Artikel Terbaru${pageSuffix} | ${SITE.name}` : `${SITE.name}: Properti, Wisata Bandung & Pariwisata Indonesia`;
  const description = page > 1 ? `Daftar artikel terbaru dari ${SITE.name}${pageSuffix}.` : SITE.description;

  const intro = page === 1
    ? `<section class="intro-band"><div class="container"><span class="eyebrow">${esc(SITE.name)}</span><h1>${esc(SITE.headline)}</h1><p>${esc(SITE.description)}</p></div></section>`
    : `<section class="page-head"><div class="container"><h1>Artikel Terbaru${esc(pageSuffix)}</h1></div></section>`;

  const heroHtml = page === 1 && hero ? (() => {
    const category = catById(hero.category);
    return `<section class="hero-article" aria-label="Artikel utama">
  <div class="hero-article-bg"><img src="${esc(hero.cover_url)}" alt="${esc(hero.cover_alt)}" fetchpriority="high" decoding="async"></div>
  <div class="container hero-article-content">
    <div class="hero-meta">${category ? `<a class="cat-pill" href="${categoryUrl(category.id)}">${esc(category.label)}</a>` : ''}<span class="meta-text"><time datetime="${esc(hero.published_at)}">${esc(formatDate(hero.published_at))}</time></span><span class="meta-dot">·</span><span class="meta-text">${readMinutes(hero.content)} menit baca</span></div>
    <h2><a href="${articleUrl(hero)}">${esc(hero.title)}</a></h2>
    <p class="hero-excerpt">${esc(excerptOf(hero))}</p>
    <a class="hero-read-cta" href="${articleUrl(hero)}">Baca artikel</a>
  </div>
</section>`;
  })() : '';

  const feed = items.length
    ? `<div class="article-grid">${items.map(card).join('')}</div>${pager(page, pages, homeUrl)}`
    : (hero ? '' : `<div class="empty-state"><h2>Artikel pertama segera hadir</h2><p>Kami sedang menyiapkan panduan terbaik untuk Anda. Kunjungi kembali dalam waktu dekat.</p></div>`);

  const shownIds = [hero?.id, ...items.map(article => article.id)].filter(Boolean);
  const trendingHtml = page === 1 ? trendingStrip(ctx, shownIds) : '';

  const body = `${intro}${heroHtml}${trendingHtml}
<section class="feed-section"><div class="container main-grid">
  <div>
    ${items.length || !hero ? `<div class="feed-head"><h2>${page === 1 ? 'Artikel Terbaru' : `Artikel Terbaru${esc(pageSuffix)}`}</h2></div>` : ''}
    ${feed}
  </div>
  ${sidebar(ctx, shownIds)}
</div></section>
${page === 1 ? connectCta(ctx) : ''}`;

  const jsonld = page === 1 ? [{
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': `${SITE.url}/#website`, url: `${SITE.url}/`, name: SITE.name, description: SITE.description, inLanguage: 'id-ID', publisher: { '@id': `${SITE.url}/#organization` }, potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: `${SITE.url}/cari/?q={search_term_string}` }, 'query-input': 'required name=search_term_string' } },
      { '@type': 'Organization', '@id': `${SITE.url}/#organization`, name: SITE.brand, url: SITE.mainUrl, logo: { '@type': 'ImageObject', url: ctx.logo } },
    ],
  }] : [];
  return layout(ctx, { title, description, path, ogImage: hero?.cover_url, jsonld, body });
}

/* ---------- Kategori ---------- */
export function categoryPage(ctx, category, { items, page, pages, total }) {
  const path = categoryUrl(category.id, page);
  const pageSuffix = page > 1 ? ` – Halaman ${page}` : '';
  const title = `${category.label}: Artikel & Panduan${pageSuffix} | ${SITE.brand}`;
  const body = `<section class="page-head"><div class="container">
  <ol class="breadcrumb"><li><a href="/">Beranda</a></li><li>${esc(category.label)}</li></ol>
  <h1>${esc(category.label)}${esc(pageSuffix)}</h1>
  <p>${esc(category.description)} <strong>${total} artikel.</strong></p>
</div></section>
<section class="feed-section"><div class="container main-grid">
  <div><div class="article-grid">${items.map(card).join('')}</div>${pager(page, pages, number => categoryUrl(category.id, number))}</div>
  ${sidebar(ctx, items.map(article => article.id))}
</div></section>`;
  const jsonld = [{
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', name: category.label, description: category.description, url: abs(path), inLanguage: 'id-ID', isPartOf: { '@id': `${SITE.url}/#website` } },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Beranda', item: `${SITE.url}/` },
        { '@type': 'ListItem', position: 2, name: category.label, item: abs(categoryUrl(category.id)) },
      ] },
    ],
  }];
  return layout(ctx, { title, description: `${category.description} Jelajahi ${total} artikel ${category.label}.`.slice(0, 200), path, ogImage: items[0]?.cover_url, jsonld, body });
}

/* ---------- Artikel ---------- */
export function articleTitle(article) {
  const base = article.meta_title || article.title;
  return base.length <= 48 ? `${base} | ${SITE.brand}` : base;
}

export function articleDescription(article) {
  return truncate(article.meta_description || article.excerpt || stripHtml(article.content), 160);
}

export function articlePage(ctx, article, related) {
  const category = catById(article.category);
  const path = articleUrl(article);
  const url = abs(path);
  const { html, toc } = prepareContent(article.content);
  const published = new Date(article.published_at);
  const modified = new Date(Math.max(new Date(article.updated_at || 0).getTime(), published.getTime()));
  const showUpdated = modified.getTime() - published.getTime() > 24 * 3600e3;
  const author = article.author || 'Tim YOUR HOME';
  const words = wordCount(article.content);
  const description = articleDescription(article);

  const tocHtml = toc.length >= 3
    ? `<nav class="toc" aria-label="Daftar isi"><strong>Daftar isi</strong><ol>${toc.map(item => `<li${item.level === 3 ? ' class="sub"' : ''}><a href="#${item.id}">${esc(item.text)}</a></li>`).join('')}</ol></nav>`
    : '';
  const shareText = encodeURIComponent(`${article.title} ${url}`);
  const body = `<article class="is-article">
<header class="post-head"><div class="container">
  <nav aria-label="Breadcrumb"><ol class="breadcrumb"><li><a href="/">Beranda</a></li>${category ? `<li><a href="${categoryUrl(category.id)}">${esc(category.label)}</a></li>` : ''}<li aria-current="page">${esc(truncate(article.title, 60))}</li></ol></nav>
  ${category ? `<a class="cat-pill" href="${categoryUrl(category.id)}">${esc(category.label)}</a>` : ''}
  <h1>${esc(article.title)}</h1>
  ${article.excerpt ? `<p class="post-lead">${esc(article.excerpt)}</p>` : ''}
  <div class="post-meta">
    <span class="author"><span class="avatar">${esc(initials(author))}</span>${esc(author)}</span><span>·</span>
    <time datetime="${esc(published.toISOString())}">${esc(formatDate(article.published_at))}</time><span>·</span>
    <span>${readMinutes(article.content)} menit baca</span>
    ${showUpdated ? `<span>·</span><span>Diperbarui <time datetime="${esc(modified.toISOString())}">${esc(formatDate(modified.toISOString()))}</time></span>` : ''}
  </div>
</div></header>
<div class="container">
  <figure class="post-cover"><img src="${esc(article.cover_url)}" alt="${esc(article.cover_alt)}" width="1200" height="675" fetchpriority="high" decoding="async"></figure>
  <div class="post-layout">
    <div>
      ${tocHtml}
      <div class="prose">${html}</div>
      ${article.tags?.length ? `<div class="post-tags" aria-label="Tag">${article.tags.map(tag => `<span>#${esc(tag)}</span>`).join('')}</div>` : ''}
      <div class="share"><strong>Bagikan:</strong>
        <a href="https://wa.me/?text=${shareText}" target="_blank" rel="noopener noreferrer nofollow">WhatsApp</a>
        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank" rel="noopener noreferrer nofollow">Facebook</a>
        <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(url)}" target="_blank" rel="noopener noreferrer nofollow">X</a>
        <button type="button" id="copyLink" data-url="${esc(url)}">Salin tautan</button>
      </div>
      <div class="author-box"><div class="avatar">${esc(initials(author))}</div><div><strong>${esc(author)}</strong><p>Penulis di ${esc(SITE.name)}, tim ${esc(SITE.brand)} yang mengelola villa, apartemen, dan guest house di Bandung.</p></div></div>
      <div class="cta-box"><h3>Rencanakan menginap Anda</h3><p>Temukan villa, apartemen, guest house, dan kosan pilihan di Bandung dari ${esc(SITE.brand)}.</p><a class="btn" href="${SITE.mainUrl}">Lihat properti</a></div>
    </div>
    ${sidebar(ctx, article.id)}
  </div>
</div>
</article>
${related.length ? `<section class="related" aria-label="Artikel terkait"><div class="container"><div class="section-head left"><span class="eyebrow">Baca juga</span><h2>Artikel terkait</h2></div><div class="article-grid">${related.map(card).join('')}</div></div></section>` : ''}`;

  const jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: truncate(article.title, 110),
      description,
      image: [article.cover_url],
      datePublished: published.toISOString(),
      dateModified: modified.toISOString(),
      author: { '@type': 'Person', name: author },
      publisher: { '@type': 'Organization', name: SITE.brand, url: SITE.mainUrl, logo: { '@type': 'ImageObject', url: ctx.logo } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      ...(category ? { articleSection: category.label } : {}),
      ...(article.tags?.length ? { keywords: article.tags.join(', ') } : {}),
      wordCount: words,
      inLanguage: 'id-ID',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Beranda', item: `${SITE.url}/` },
        ...(category ? [{ '@type': 'ListItem', position: 2, name: category.label, item: abs(categoryUrl(category.id)) }] : []),
        { '@type': 'ListItem', position: category ? 3 : 2, name: article.title, item: url },
      ],
    },
  ];
  const head = `<meta property="article:published_time" content="${esc(published.toISOString())}">
<meta property="article:modified_time" content="${esc(modified.toISOString())}">
${category ? `<meta property="article:section" content="${esc(category.label)}">\n` : ''}${(article.tags || []).map(tag => `<meta property="article:tag" content="${esc(tag)}">`).join('\n')}
`;
  return layout(ctx, { title: articleTitle(article), description, path, ogImage: article.cover_url, ogType: 'article', jsonld, head, body, bodyClass: 'is-post' });
}

/* ---------- Pencarian dan 404 ---------- */
export function searchPage(ctx) {
  const body = `<section class="page-head"><div class="container">
  <h1>Cari artikel</h1>
  <form class="search-page-form" action="/cari/" method="get" role="search"><input type="search" id="q" name="q" placeholder="Ketik kata kunci, mis. villa Lembang" aria-label="Kata kunci" autofocus><button class="btn btn-primary" type="submit">Cari</button></form>
</div></section>
<section class="feed-section"><div class="container"><div id="results" aria-live="polite"></div><noscript><p>Aktifkan JavaScript untuk mencari, atau jelajahi <a href="/">beranda</a>.</p></noscript></div></section>
<script>
(function () {
  var params = new URLSearchParams(location.search), q = (params.get('q') || '').trim();
  var input = document.getElementById('q'), box = document.getElementById('results');
  input.value = q;
  if (!q) { box.innerHTML = '<p>Masukkan kata kunci untuk mulai mencari.</p>'; return; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  fetch('/search-index.json').then(function (r) { return r.json(); }).then(function (list) {
    var words = q.toLowerCase().split(/\\s+/).filter(Boolean);
    var hits = list.filter(function (item) {
      var hay = (item.t + ' ' + item.e + ' ' + item.c + ' ' + item.g).toLowerCase();
      return words.every(function (w) { return hay.indexOf(w) !== -1; });
    });
    box.innerHTML = hits.length
      ? '<p>' + hits.length + ' hasil untuk &ldquo;' + esc(q) + '&rdquo;</p>' + hits.map(function (item) {
          return '<div class="search-result"><span>' + esc(item.c) + '</span><a href="' + esc(item.u) + '">' + esc(item.t) + '</a><p>' + esc(item.e) + '</p></div>';
        }).join('')
      : '<p>Tidak ada artikel yang cocok dengan &ldquo;' + esc(q) + '&rdquo;. Coba kata kunci lain.</p>';
  }).catch(function () { box.innerHTML = '<p>Pencarian sedang tidak tersedia. Silakan coba lagi nanti.</p>'; });
})();
</script>`;
  return layout(ctx, { title: `Cari Artikel | ${SITE.name}`, description: `Cari artikel di ${SITE.name}.`, path: '/cari/', noindex: true, body });
}

export function notFoundPage(ctx) {
  const body = `<section class="page-head"><div class="container"><h1>Halaman tidak ditemukan</h1><p>Artikel yang Anda cari mungkin sudah dipindahkan atau dihapus.</p><p style="margin-top:20px"><a class="btn btn-primary" href="/">Kembali ke beranda</a></p></div></section>`;
  return layout(ctx, { title: `Halaman tidak ditemukan | ${SITE.name}`, description: 'Halaman tidak ditemukan.', path: '/404.html', noindex: true, body });
}

/* ---------- Sitemap, robots, RSS ---------- */
const xml = esc;

export function sitemapXml(articles, categories) {
  const newest = list => list.reduce((latest, article) => {
    const value = new Date(article.updated_at || article.published_at);
    return value > latest ? value : latest;
  }, new Date(0)).toISOString();
  const entries = [];
  if (articles.length) entries.push(`<url><loc>${xml(abs('/'))}</loc><lastmod>${newest(articles)}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>`);
  for (const category of categories) {
    const inCategory = articles.filter(article => article.category === category.id);
    entries.push(`<url><loc>${xml(abs(categoryUrl(category.id)))}</loc><lastmod>${newest(inCategory)}</lastmod><changefreq>daily</changefreq><priority>0.7</priority></url>`);
  }
  for (const article of articles) {
    const modified = new Date(Math.max(new Date(article.updated_at || 0).getTime(), new Date(article.published_at).getTime())).toISOString();
    entries.push(`<url><loc>${xml(abs(articleUrl(article)))}</loc><lastmod>${modified}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority><image:image><image:loc>${xml(article.cover_url)}</image:loc></image:image></url>`);
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join('\n')}
</urlset>
`;
}

export const robotsTxt = () => `User-agent: *
Allow: /
Disallow: /cari/

Sitemap: ${abs('/sitemap.xml')}
`;

export function rssXml(articles) {
  const items = articles.slice(0, SITE.rssLimit);
  const built = items.length ? new Date(items[0].published_at).toUTCString() : new Date(0).toUTCString();
  const cdata = value => `<![CDATA[${String(value).replace(/\]\]>/g, ']]]]><![CDATA[>')}]]>`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel>
<title>${xml(SITE.name)}</title>
<link>${xml(SITE.url)}/</link>
<description>${xml(SITE.description)}</description>
<language>id-ID</language>
<lastBuildDate>${built}</lastBuildDate>
<atom:link href="${xml(abs('/rss.xml'))}" rel="self" type="application/rss+xml"/>
${items.map(article => `<item>
<title>${xml(article.title)}</title>
<link>${xml(abs(articleUrl(article)))}</link>
<guid isPermaLink="true">${xml(abs(articleUrl(article)))}</guid>
<pubDate>${new Date(article.published_at).toUTCString()}</pubDate>
<dc:creator>${xml(article.author || 'Tim YOUR HOME')}</dc:creator>
${catById(article.category) ? `<category>${xml(catById(article.category).label)}</category>\n` : ''}<description>${xml(excerptOf(article))}</description>
<content:encoded>${cdata(article.content)}</content:encoded>
</item>`).join('\n')}
</channel>
</rss>
`;
}
