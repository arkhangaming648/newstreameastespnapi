import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_DIR = join(__dirname, '..', 'site');

const LISTING_URL = 'https://streamseast.ws/boxing';
const BOXING_ICON = 'https://a.espncdn.com/combiner/i?img=/redesign/assets/img/icons/ESPN-icon-boxing.png';

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
  const competitors = ev._competitors || [];
  const home = competitors.find(c => c.homeAway === 'home');
  const away = competitors.find(c => c.homeAway === 'away');
  const vName = ev._venue ? ev._venue.fullName : '';
  const dateObj = new Date(ev.date);
  const dStr = dateObj.toISOString().slice(0,10);
  const dateFormatted = dateObj.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric', timeZone:'UTC' });
  const timeFormatted = dateObj.toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit', timeZone:'UTC', hour12:true });
  const statusText = ev.status && ev.status.type ? ev.status.type.shortDetail : dateFormatted;

  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><meta name="robots" content="index,follow">
<title>${esc(ev.name)} Live stream</title>
<meta name="description" content="Watch ${esc(ev.name)} live boxing streaming.">
<link rel="canonical" href="../../boxing/${ev.id}/${slugify(ev.shortName||ev.name)}/index.html">
<link rel="shortcut icon" href="../../nav.png" type="image/png">
<link rel="stylesheet" href="../../assets/css/style.css" type="text/css">
<link rel="preload" href="../../assets/css/mdb.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<meta property="og:title" content="${esc(ev.name)} Live stream">
<meta property="og:description" content="Watch ${esc(ev.name)} live boxing streaming.">
<meta property="og:image" content="../../og.webp">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#8B2E3D"></head>
<body>
<nav class="navbar navbar-expand-md navbar-light sticky-top">
<div class="container-lg align-items-center">
<a href="../../index.html"><img src="../../og.png" alt="StreamEast" style="width:37%;min-width:200px;height:auto;display:block;"></a>
<button class="navbar-toggler px-0" type="button" data-mdb-toggle="offcanvas" data-mdb-target="#offcanvasNavbar"><i class="fas fa-bars"></i></button>
<div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar">
<div class="offcanvas-header pb-0"><h5 class="offcanvas-title">Main Menu</h5><button class="navbar-toggler px-0"><i class="fas fa-bars"></i></button></div>
<div class="offcanvas-body"><ul class="nav navbar-nav ms-auto mb-2 mb-lg-0 justify-content-end flex-grow-1">
<li class="nav-item"><a class="nav-link" href="../../index.html"><span><i class="fas fa-home fa-lg"></i></span></a></li>
<li class="nav-item"><a class="nav-link" href="../../soccer/index.html">Soccer</a></li>
<li class="nav-item"><a class="nav-link" href="../../nba/index.html">NBA</a></li>
<li class="nav-item"><a class="nav-link" href="../../nfl/index.html">NFL</a></li>
<li class="nav-item"><a class="nav-link" href="../../nhl/index.html">NHL</a></li>
<li class="nav-item"><a class="nav-link" href="../../mlb/index.html">MLB</a></li>
<li class="nav-item"><a class="nav-link" href="../../mma/index.html">MMA</a></li>
<li class="nav-item"><a class="nav-link" href="../../boxing/index.html">Boxing</a></li>
<li class="nav-item"><a class="nav-link" href="../../f1/index.html">Formula 1</a></li>
</ul></div></div></div></nav>
<main class="container-lg"><div class="list-matches px-2"><div id="tbody3">
<nav aria-label="breadcrumb"><ol class="breadcrumb">
<li class="breadcrumb-item"><a class="linkUn" href="../../index.html">Home</a></li>
<li class="breadcrumb-item"><a class="linkUn" href="../index.html">Boxing</a></li>
<li class="breadcrumb-item active">${esc(ev.name)}</li>
</ol></nav>
<div class="d-flex mb-2"><div><h1 class="match-head">${esc(ev.name)}</h1><span>${esc(dateFormatted)} - Boxing</span></div></div>
<div id="mainBox" class="rounded"><div class="mph-main"><div class="mph-scoreboard">
${home ? `<div class="mph-team">${BOXING_ICON ? `<img class="mph-teamlogo" src="${BOXING_ICON}" width="70" height="70" alt="">` : ''}<div class="mph-teamname-text">${esc(home.team.displayName||home.team.name)}</div></div>` : ''}
<div class="mph-scoreline text-center"><span class="fw-bold"></span><br><span class="badge bg-danger" style="font-size:1.5em;margin:5px 0;">vs</span><br><span class="fw-bold"></span></div>
${away ? `<div class="mph-team">${BOXING_ICON ? `<img class="mph-teamlogo" src="${BOXING_ICON}" width="70" height="70" alt="">` : ''}<div class="mph-teamname-text">${esc(away.team.displayName||away.team.name)}</div></div>` : ''}
</div></div></div>
<div class="row px-3"><div class="col-md-8"><div class="card mb-3"><h3 class="card-header">About</h3><div class="card-body lh-base">${esc(ev.name)}${vName ? ` taking place at ${esc(vName)}` : ''}, on ${dateFormatted}. ${ev.shortName ? `${esc(ev.shortName)}.` : ''}</div></div></div>
<div class="col-md-4"><div class="card mb-3"><h3 class="card-header">Event Information</h3><div class="card-body lh-lg">
<i class="fas fa-trophy"></i> <span class="fw-bold">Competition: </span>Boxing<br>
<i class="fas fa-calendar"></i> <span class="fw-bold">Date: </span>${esc(dStr)}<br>
<i class="fas fa-clock"></i> <span class="fw-bold">Time: </span>${esc(timeFormatted)} UTC<br>
${vName ? `<i class="fas fa-location-arrow"></i> <span class="fw-bold">Venue: </span>${esc(vName)}<br>` : ''}
</div></div></div></div>
</div></div></main>
<script>let isLive="pre";</script>
<script src="../../js/app_ver%3D1698506434.js"></script>
</body></html>`;
}

function renderListing(matches) {
  const items = matches.map(m => {
    const home = m._competitors.find(c => c.homeAway === 'home');
    const away = m._competitors.find(c => c.homeAway === 'away');
    return `<div class="col-12"><a href="${m.id}/${slugify(m.shortName||m.name)}/index.html" class="text-decoration-none">
<div class="card bg-dark border border-secondary"><div class="card-body d-flex align-items-center py-3">
<div class="me-3"><img src="${BOXING_ICON}" alt="Boxing" class="rounded-circle" style="width:60px;height:60px;"></div>
<div class="flex-grow-1">
<h5 class="card-title text-white mb-1 fs-5">${esc(m.name)}</h5>
<p class="card-text text-secondary small mb-1">${esc(m.status&&m.status.type?m.status.type.shortDetail:'')}</p>
${m._venue ? `<p class="card-text text-muted small mb-0">${esc(m._venue.fullName)}</p>` : ''}
</div>
<div class="text-end"><span class="badge bg-danger">Boxing</span></div>
</div></div></a></div>`;
  }).join('\n');

  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><meta name="robots" content="index,follow">
<title>Boxing Streams | Live Boxing Events &amp; Fights</title>
<link rel="canonical" href="index.html"><link rel="shortcut icon" href="../nav.png" type="image/png">
<link rel="stylesheet" href="../assets/css/style.css" type="text/css">
<link rel="preload" href="../assets/css/mdb.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<meta name="theme-color" content="#8B2E3D"></head>
<body>
<nav class="navbar navbar-expand-md navbar-light sticky-top"><div class="container-lg align-items-center">
<a href="../index.html"><img src="../og.png" alt="StreamEast" style="width:37%;min-width:200px;height:auto;display:block;"></a>
<button class="navbar-toggler px-0" type="button" data-mdb-toggle="offcanvas" data-mdb-target="#offcanvasNavbar"><i class="fas fa-bars"></i></button>
<div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar">
<div class="offcanvas-header pb-0"><h5 class="offcanvas-title">Main Menu</h5><button class="navbar-toggler px-0"><i class="fas fa-bars"></i></button></div>
<div class="offcanvas-body"><ul class="nav navbar-nav ms-auto mb-2 mb-lg-0 justify-content-end flex-grow-1">
<li class="nav-item"><a class="nav-link" href="../index.html"><span><i class="fas fa-home fa-lg"></i></span></a></li>
<li class="nav-item"><a class="nav-link" href="../soccer/index.html">Soccer</a></li>
<li class="nav-item"><a class="nav-link" href="../nba/index.html">NBA</a></li>
<li class="nav-item"><a class="nav-link" href="../nfl/index.html">NFL</a></li>
<li class="nav-item"><a class="nav-link" href="../nhl/index.html">NHL</a></li>
<li class="nav-item"><a class="nav-link" href="../mlb/index.html">MLB</a></li>
<li class="nav-item"><a class="nav-link" href="../mma/index.html">MMA</a></li>
<li class="nav-item"><a class="nav-link" href="../boxing/index.html">Boxing</a></li>
<li class="nav-item"><a class="nav-link" href="../f1/index.html">Formula 1</a></li>
</ul></div></div></div></nav>
<main class="container-lg py-5">
<nav aria-label="breadcrumb"><ol class="breadcrumb text-secondary"><li class="breadcrumb-item"><a href="../index.html" class="text-danger">Home</a></li><li class="breadcrumb-item active">Boxing</li></ol></nav>
<hr class="border-danger border-5 mb-7 w-250 mx-auto">
<div class="row g-3">${items||'<div class="col-12 text-center text-white"><p>No upcoming boxing events.</p></div>'}</div>
</main></body></html>`;
}

export { fetchBoxingListing, extractEvents, renderMatchPage, renderListing };
