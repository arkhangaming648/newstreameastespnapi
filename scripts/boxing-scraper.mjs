import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_DIR = join(__dirname, '..', 'site');

const LISTING_URL = 'https://streamseast.ws/boxing';
const BOXING_ICON = 'https://a.espncdn.com/combiner/i?img=/redesign/assets/img/icons/ESPN-icon-boxing.png';
const BOXING_ICON_CARD = BOXING_ICON + '&h=60&w=60&scale=crop&cquality=40';

const HISTATS = `<!-- Histats.com  START  (aync)-->
<script type="text/javascript">var _Hasync= _Hasync|| [];
_Hasync.push(['Histats.start', '1,5010743,4,0,0,0,00010000']);
_Hasync.push(['Histats.fasi', '1']);
_Hasync.push(['Histats.track_hits', '']);
(function() {
var hs = document.createElement('script'); hs.type = 'text/javascript'; hs.async = true;
hs.src = ('//s10.histats.com/js15_as.js');
(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(hs);
})();</script>
<noscript><a href="/" target="_blank"><img  src="//sstatic1.histats.com/0.gif?5010743&101" alt="website page counter" border="0"></a></noscript>
<!-- Histats.com  END  -->`;

const ADSTERRA = `<script src="https://pl30592651.effectivecpmnetwork.com/82/30/86/8230866782c98a617447bd4836a7da02.js"></script>`;

function navHeader(R) {
  return `<nav class="navbar navbar-expand-md navbar-light sticky-top">
<div class="container-lg align-items-center">
<a href="${R}"><img src="${R}og.png" alt="StreamEast" style="width:37%;min-width:200px;height:auto;display:block;"></a>
<button class="navbar-toggler px-0" type="button" data-mdb-toggle="offcanvas" data-mdb-target="#offcanvasNavbar"><i class="fas fa-bars"></i></button>
<div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar">
<div class="offcanvas-header pb-0"><h5 class="offcanvas-title">Main Menu</h5><button class="navbar-toggler px-0"><i class="fas fa-bars"></i></button></div>
<div class="offcanvas-body"><ul class="nav navbar-nav ms-auto mb-2 mb-lg-0 justify-content-end flex-grow-1">
<li class="nav-item"><a class="nav-link" href="${R}"><span><i class="fas fa-home fa-lg"></i></span></a></li>
<li class="nav-item"><a class="nav-link" href="${R}soccer/">Soccer</a></li>
<li class="nav-item"><a class="nav-link" href="${R}nba/">NBA</a></li>
<li class="nav-item"><a class="nav-link" href="${R}nfl/">NFL</a></li>
<li class="nav-item"><a class="nav-link" href="${R}nhl/">NHL</a></li>
<li class="nav-item"><a class="nav-link" href="${R}mlb/">MLB</a></li>
<li class="nav-item"><a class="nav-link" href="${R}mma/">MMA</a></li>
<li class="nav-item"><a class="nav-link" href="${R}boxing/">Boxing</a></li>
<li class="nav-item"><a class="nav-link" href="${R}f1/">Formula 1</a></li>
</ul></div></div></div></nav>`;
}

function footerHTML(R) {
  const l = (path) => `${R}${path}`;
  return `<footer class="text-center text-lg-start bg-light text-muted">
<section class="d-flex justify-content-center justify-content-lg-between p-3 border-bottom">
<div class="me-5 d-none d-lg-block"><span>Get connected with us on social networks:</span></div>
<div>
<a href="#" class="me-4 text-reset"><i class="fab fa-facebook-f"></i></a>
<a href="" class="me-4 text-reset"><i class="fab fa-twitter"></i></a>
<a href="" class="me-4 text-reset"><i class="fab fa-google"></i></a>
<a href="" class="me-4 text-reset"><i class="fab fa-instagram"></i></a>
<a href="" class="me-4 text-reset"><i class="fab fa-linkedin"></i></a>
</div>
</section>
<section class=""><div class="container text-center text-md-start mt-3">
<div class="row mt-3">
<div class="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
<h6 class="text-uppercase fw-bold mb-4">StreamEast</h6>
<p style="font-size:14px;">StreamEast offers news about sports events like football, basketball, hockey, soccer and college sports. Including game date and time, location and venue, standings, latest news from various sources and how to watch with TV schedule.</p>
</div>
<div class="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
<h6 class="text-uppercase fw-bold mb-4">Competitions</h6>
<ul class="list-unstyled mb-0">
<li><a class="linkUn text-muted" href="${l('soccer/leagues/uefa-champions-league/')}">Champions League</a></li>
<li><a class="linkUn text-muted" href="${l('soccer/leagues/english-premier-league/')}">Premier League</a></li>
<li><a class="linkUn text-muted" href="${l('soccer/leagues/spanish-laliga/')}">LaLiga</a></li>
<li><a class="linkUn text-muted" href="${l('soccer/leagues/italian-serie-a/')}">Serie A</a></li>
<li><a class="linkUn text-muted" href="${l('soccer/leagues/french-ligue-1/')}">Ligue 1</a></li>
</ul>
</div>
<div class="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
<h6 class="text-uppercase fw-bold mb-4">Teams</h6>
<ul class="list-unstyled mb-0">
<li><a class="linkUn text-muted" href="${l('soccer/team/364/liverpool/')}">Liverpool</a></li>
<li><a class="linkUn text-muted" href="${l('soccer/team/360/manchester-united/')}">Manchester United</a></li>
<li><a class="linkUn text-muted" href="${l('soccer/team/86/real-madrid/')}">Real Madrid</a></li>
<li><a class="linkUn text-muted" href="${l('soccer/team/83/barcelona/')}">Barcelona</a></li>
<li><a class="linkUn text-muted" href="${l('soccer/team/160/paris-saint-germain/')}">Paris Saint-Germain</a></li>
</ul>
</div>
</div></div></section>
<div class="text-center p-3" style="background-color:rgba(0,0,0,0.2);">&copy;2025 Streameast</div>
</footer>`;
}

function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function slugify(str) {
  return String(str).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
}

function parseDateText(text) {
  const months = {Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};
  const m = text.match(/(\w+),\s+(\w+)\s+(\d+),\s+(\d+)\s*-\s*(\d+):(\d+)\s*(AM|PM)\s+PDT/);
  if (!m) return new Date().toISOString();
  const [, , month, day, year, hour, min, ap] = m;
  let h = parseInt(hour);
  if (ap === 'PM' && h !== 12) h += 12;
  if (ap === 'AM' && h === 12) h = 0;
  const d = new Date(Date.UTC(parseInt(year), months[month], parseInt(day), h, parseInt(min)));
  return d.toISOString();
}

function parseFighters(name) {
  const parts = name.split(/\s+vs\.?\s+/i);
  const hasVs = parts.length >= 2;
  let nameA = '', nameB = '';
  if (hasVs) {
    const last = parts.pop();
    const first = parts.join(' vs. ');
    const subA = first.split(':').pop().trim();
    const subB = last.split(':')[0].trim();
    nameA = subA || first;
    nameB = subB || last;
  }
  return { nameA, nameB, vs: hasVs };
}

function ensureDir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

async function fetchBoxingListing() {
  const res = await fetch(LISTING_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${LISTING_URL}`);
  return res.text();
}

function extractEvents(html) {
  const events = [];
  const cardRegex = /<a\s+href="[^"]*\?id=([a-f0-9]+)"[^>]*>[\s\S]*?<h5[^>]*>(.*?)<\/h5>[\s\S]*?<p[^>]*class="card-text text-secondary[^>]*>(.*?)<\/p>[\s\S]*?<p[^>]*class="card-text text-muted[^>]*>(.*?)<\/p>/g;
  let match;
  while ((match = cardRegex.exec(html)) !== null) {
    const hexId = match[1];
    const name = match[2].trim().replace(/&#039;/g,"'").replace(/&amp;/g,'&');
    const dateText = match[3].trim();
    const venueText = match[4].trim().replace(/&amp;/g,'&').replace(/&#039;/g,"'").replace(/\s*•\s*/g,', ');

    const fighters = parseFighters(name);
    const competitors = [];
    if (fighters.vs) {
      competitors.push({
        homeAway: 'home',
        team: { name: fighters.nameA, displayName: fighters.nameA, abbreviation: fighters.nameA.slice(0,3).toUpperCase(), logo: BOXING_ICON },
        score: ''
      });
      competitors.push({
        homeAway: 'away',
        team: { name: fighters.nameB, displayName: fighters.nameB, abbreviation: fighters.nameB.slice(0,3).toUpperCase(), logo: BOXING_ICON },
        score: ''
      });
    }

    const dateObj = new Date(parseDateText(dateText));
    const dateStr = dateObj.toISOString();

    events.push({
      id: hexId,
      name,
      shortName: fighters.vs ? `${fighters.nameA} vs ${fighters.nameB}` : name,
      date: dateStr,
      _competitors: competitors.length > 0 ? competitors : [],
      _venue: venueText ? { fullName: venueText } : null,
      league: { name: 'Boxing' },
      status: { type: { shortDetail: dateText } },
      competitions: []
    });
  }
  return events;
}

function renderMatchPage(ev) {
  const vName = ev._venue ? ev._venue.fullName : '';
  const dateObj = new Date(ev.date);
  const dStr = dateObj.toISOString().slice(0,10);
  const dateFormatted = dateObj.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric', timeZone:'UTC' });
  const R = '../../../';

  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><meta name="robots" content="index,follow">
<title>${esc(ev.name)} - Live Stream</title>
<meta name="description" content="Watch ${esc(ev.name)} live boxing streaming.">
<link rel="canonical" href="${R}boxing/${ev.id}/${slugify(ev.shortName||ev.name)}/">
<link rel="shortcut icon" href="${R}nav.png" type="image/png">
<link rel="stylesheet" href="${R}assets/css/style.css" type="text/css">
<link rel="preload" href="${R}assets/css/mdb.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<meta property="og:title" content="${esc(ev.name)} - Live Stream">
<meta property="og:description" content="Watch ${esc(ev.name)} live boxing streaming.">
<meta property="og:image" content="${R}og.webp">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#8B2E3D">${HISTATS}</head>
<body>
${navHeader(R)}
<main class="container-lg py-5">
<nav aria-label="breadcrumb"><ol class="breadcrumb text-secondary"><li class="breadcrumb-item"><a href="${R}" class="text-danger">Home</a></li><li class="breadcrumb-item"><a href="../../">Boxing</a></li><li class="breadcrumb-item active">${esc(ev.name)}</li></ol></nav>
<div class="row mt-4"><div class="col-12 text-center">
<h1 class="fw-bold text-white">${esc(ev.name)} - Live Stream</h1>
<p class="text-muted small">No stream available yet.</p>
</div></div>
<div class="row mt-4"><div class="col-md-8 mx-auto"><div class="card bg-dark border border-secondary"><div class="card-body">
<h3 class="card-title text-white">${esc(ev.name)}</h3>
<h5 class="text-muted">Fight Details</h5>
<ul class="list-unstyled text-white small">
<li><span class="fw-bold">Date:</span> ${esc(dateFormatted)}</li>
${vName ? `<li><span class="fw-bold">Venue:</span> ${esc(vName.split(',')[0].trim())}</li>` : ''}
${vName && vName.includes(',') ? `<li><span class="fw-bold">Location:</span> ${esc(vName.split(',').slice(1).join(',').trim())}</li>` : ''}
</ul>
</div></div></div></div>
</main>
${footerHTML(R)}
<script>let isLive="pre";</script>
<script src="${R}js/ind_ver=1698506434.js"></script>
${ADSTERRA}
</body></html>`;
}

function timeUntil(dateStr) {
  const now = Date.now();
  const diff = new Date(dateStr).getTime() - now;
  if (diff <= 0) return '';
  const hrs = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  if (hrs >= 24) {
    const days = Math.floor(hrs / 24);
    return days === 1 ? '1 day from now' : `${days} days from now`;
  }
  if (hrs >= 1) return hrs === 1 ? '1 hour from now' : `${hrs} hours from now`;
  return mins <= 1 ? '1 min from now' : `${mins} mins from now`;
}

function renderListing(matches) {
  const items = matches.map(m => {
    const home = m._competitors.find(c => c.homeAway === 'home');
    const away = m._competitors.find(c => c.homeAway === 'away');
    const countdown = m.date ? timeUntil(m.date) : '';
    return `<div class="col-12"><a href="${m.id}/${slugify(m.shortName||m.name)}/" class="text-decoration-none">
<div class="card bg-dark border border-secondary"><div class="card-body d-flex align-items-center py-3">
<div class="me-3"><img src="${BOXING_ICON_CARD}" alt="Gloves" class="rounded-circle"></div>
<div class="flex-grow-1">
<h5 class="card-title text-white mb-1 fs-5">${esc(m.name)}</h5>
<p class="card-text text-secondary small mb-1">${esc(m.status&&m.status.type?m.status.type.shortDetail:'')}</p>
${m._venue ? `<p class="card-text text-muted small mb-0">${esc(m._venue.fullName)}</p>` : ''}
</div>
<div class="text-end"><span class="badge bg-danger">Boxing</span>${countdown ? `<span class="d-block small text-white mt-1">${esc(countdown)}</span>` : ''}</div>
</div></div></a></div>`;
  }).join('\n');

  const R = '../';
  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><meta name="robots" content="index,follow">
<title>Boxing Streams | Live Boxing Events &amp; Fights</title>
<link rel="canonical" href=""><link rel="shortcut icon" href="${R}nav.png" type="image/png">
<link rel="stylesheet" href="${R}assets/css/style.css" type="text/css">
<link rel="preload" href="${R}assets/css/mdb.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<meta name="theme-color" content="#8B2E3D">${HISTATS}</head>
<body>
${navHeader(R)}
<main class="container-lg py-5">
<nav aria-label="breadcrumb"><ol class="breadcrumb text-secondary"><li class="breadcrumb-item"><a href="${R}" class="text-danger">Home</a></li><li class="breadcrumb-item active">Boxing</li></ol></nav>
<hr class="border-danger border-5 mb-7 w-250 mx-auto">
<div class="row g-3">${items||'<div class="col-12 text-center text-white"><p>No upcoming boxing events.</p></div>'}</div>
</main>
${footerHTML(R)}
${ADSTERRA}
</body></html>`;
}

export { fetchBoxingListing, extractEvents, renderMatchPage, renderListing };
