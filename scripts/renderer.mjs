function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function slugify(str) {
  return String(str).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
}

function formatDate(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  const m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const w = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  return `${w[d.getUTCDay()]}, ${m[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

function formatTime(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  let h = d.getUTCHours();
  const mi = String(d.getUTCMinutes()).padStart(2,'0');
  const ap = h>=12?'PM':'AM';
  h = h%12||12;
  return `${h}:${mi} ${ap} PDT`;
}

function formatLong(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  const m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const w = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  let h = d.getUTCHours();
  const mi = String(d.getUTCMinutes()).padStart(2,'0');
  const ap = h>=12?'PM':'AM';
  h = h%12||12;
  return `${w[d.getUTCDay()]} ${d.getUTCDate()} ${m[d.getUTCMonth()]} ${d.getUTCFullYear()} ${h}:${mi} ${ap} UTC`;
}

function extractTeam(competitors, side) {
  const c = competitors ? competitors.find(c => c.homeAway === side) : null;
  if (!c) return null;
  const t = c.team || c;
  return {
    id: t.id,
    name: t.displayName || t.name || t.location || '',
    abbreviation: t.abbreviation || '',
    logo: t.logo || (t.logos && t.logos[0] ? t.logos[0].href : null),
    score: c.score || '',
    winner: c.winner || false,
    homeAway: c.homeAway
  };
}

function renderMatchPage(normalized, sportCfg) {
  const ev = normalized;
  const competitors = ev._competitors || [];
  const venue = ev._venue;
  const home = extractTeam(competitors, 'home');
  const away = extractTeam(competitors, 'away');
  const eventId = ev.id;
  const matchSlug = ev.shortName ? slugify(ev.shortName) : 'match';
  const title = `${ev.name} Live stream`;
  const dateISO = ev.date;
  const leagueName = ev.league ? (ev.league.name || ev.league.slug || '') : '';
  const vName = venue ? (venue.fullName || venue.name || '') : '';
  const vCity = venue && venue.address ? (venue.address.city || '') : '';
  const vCountry = venue && venue.address ? (venue.address.country || '') : '';
  const statusText = ev.status && ev.status.type ? (ev.status.type.shortDetail || ev.status.type.description || '') : '';
  const R = '../../../';

  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><meta name="robots" content="index,follow">
<title>${esc(title)}</title>
<meta name="description" content="Summary of the ${esc(ev.name)} match.">
<link rel="canonical" href="${R}${sportCfg.dir}/${eventId}/${matchSlug}/index.html">
<link rel="shortcut icon" href="${R}nav.png" type="image/png">
<link rel="stylesheet" href="${R}assets/css/style.css" type="text/css">
<link rel="preload" href="${R}assets/css/mdb.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="Watch ${esc(ev.name)} live streaming.">
<meta property="og:image" content="${R}og.webp">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#8B2E3D"></head>
<body>
<nav class="navbar navbar-expand-md navbar-light sticky-top">
<div class="container-lg align-items-center">
<a href="${R}index.html"><img src="${R}og.png" alt="StreamEast" style="width:37%;min-width:200px;height:auto;display:block;"></a>
<button class="navbar-toggler px-0" type="button" data-mdb-toggle="offcanvas" data-mdb-target="#offcanvasNavbar"><i class="fas fa-bars"></i></button>
<div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar">
<div class="offcanvas-header pb-0"><h5 class="offcanvas-title">Main Menu</h5><button class="navbar-toggler px-0"><i class="fas fa-bars"></i></button></div>
<div class="offcanvas-body"><ul class="nav navbar-nav ms-auto mb-2 mb-lg-0 justify-content-end flex-grow-1">
<li class="nav-item"><a class="nav-link" href="${R}index.html"><span><i class="fas fa-home fa-lg"></i></span></a></li>
<li class="nav-item"><a class="nav-link" href="${R}soccer/index.html">Soccer</a></li>
<li class="nav-item"><a class="nav-link" href="${R}nba/index.html">NBA</a></li>
<li class="nav-item"><a class="nav-link" href="${R}nfl/index.html">NFL</a></li>
<li class="nav-item"><a class="nav-link" href="${R}nhl/index.html">NHL</a></li>
<li class="nav-item"><a class="nav-link" href="${R}mlb/index.html">MLB</a></li>
<li class="nav-item"><a class="nav-link" href="${R}mma/index.html">MMA</a></li>
<li class="nav-item"><a class="nav-link" href="${R}boxing/index.html">Boxing</a></li>
<li class="nav-item"><a class="nav-link" href="${R}f1/index.html">Formula 1</a></li>
</ul></div></div></div></nav>
<main class="container-lg"><div class="list-matches px-2"><div id="tbody3">
<nav aria-label="breadcrumb"><ol class="breadcrumb">
<li class="breadcrumb-item"><a class="linkUn" href="${R}index.html">Home</a></li>
<li class="breadcrumb-item"><a class="linkUn" href="../../index.html">${esc(leagueName)}</a></li>
<li class="breadcrumb-item active">${esc(ev.name)}</li>
</ol></nav>
<div class="d-flex mb-2"><div><h1 class="match-head">${esc(ev.name)}</h1><span>${formatDate(dateISO)} - ${esc(leagueName)}</span></div></div>
<div id="mainBox" class="rounded"><div class="mph-main"><div class="mph-scoreboard">
${home ? `<div class="mph-team">${home.logo ? `<img class="mph-teamlogo" src="${home.logo}" width="70" height="70" alt="${esc(home.abbreviation)}">` : ''}<div class="mph-teamname-text">${esc(home.name)}</div></div>` : ''}
<div class="mph-scoreline text-center"><span class="fw-bold">${home ? esc(home.score) : ''}</span><br><span class="badge bg-danger" style="font-size:1.5em;margin:5px 0;">vs</span><br><span class="fw-bold">${away ? esc(away.score) : ''}</span></div>
${away ? `<div class="mph-team">${away.logo ? `<img class="mph-teamlogo" src="${away.logo}" width="70" height="70" alt="${esc(away.abbreviation)}">` : ''}<div class="mph-teamname-text">${esc(away.name)}</div></div>` : ''}
</div></div></div>
<div class="row px-3"><div class="col-md-8"><div class="card mb-3"><h3 class="card-header">About</h3><div class="card-body lh-base">${esc(home ? home.name : 'Home')} are hosting ${esc(away ? away.name : 'Away')}${vName ? ` at ${esc(vName)}` : ''}${vCity ? `, ${esc(vCity)}${vCountry ? `, ${esc(vCountry)}` : ''}` : ''}, starting on ${formatLong(dateISO)}. The match is a part of the ${esc(leagueName)}.${statusText ? ` Status: ${esc(statusText)}.` : ''}</div></div></div>
<div class="col-md-4"><div class="card mb-3"><h3 class="card-header">Game Information</h3><div class="card-body lh-lg">
<i class="fas fa-trophy"></i> <span class="fw-bold">Competition: </span>${esc(leagueName)}<br>
<i class="fas fa-calendar"></i> <span class="fw-bold">Date: </span>${formatDate(dateISO)}<br>
<i class="fas fa-clock"></i> <span class="fw-bold">Time: </span>${formatTime(dateISO)}<br>
${vName ? `<i class="fas fa-location-arrow"></i> <span class="fw-bold">Venue: </span>${esc(vName)}<br>` : ''}
${vCity ? `<i class="fas fa-map-marker-alt"></i> <span class="fw-bold">Location: </span>${esc(vCity)}${vCountry ? `, ${esc(vCountry)}` : ''}<br>` : ''}
</div></div></div></div>
</div></div></main>
<script>let isLive="pre";let url="https://www.espn.com/${sportCfg.sport}/match?gameId=${eventId}&xhr=1";</script>
<script src="${R}js/app_ver%3D1698506434.js"></script>
</body></html>`;
}

function renderSportListing(sportCfg, matches, sportLabel) {
  const items = matches.map(m => {
    const competitors = m._competitors || (m.competitions && m.competitions[0] ? m.competitions[0].competitors : []);
    const home = extractTeam(competitors, 'home');
    const away = extractTeam(competitors, 'away');
    const dateISO = m.date;
    const slug = m.shortName ? slugify(m.shortName) : m.id;
    const href = `${m.id}/${slug}/index.html`;
    return `<a href="${href}" class="matches" aria-label="${esc(m.name)}">
<div class="matches-block border rounded-3 d-block ripple"><div class="matches-main"><div class="matches-team"><div class="team-line centered">
<div class="col-3-list">${home&&home.logo?`<img class="team-logo" src="${home.logo}" width="40" height="40" loading="lazy" alt="${esc(home.abbreviation)}">`:''}<span class="team-name">${esc(home?home.name:'')}</span></div>
<span class="prediction-score"><span class="matches-time"><div class="truncate">${formatTime(dateISO)}</div></span><span class="matches-time text-center"><span class="fw-bold fs-6">vs</span></span><span class="league text-center"></span></span>
<div class="col-3-list">${away&&away.logo?`<img class="team-logo" src="${away.logo}" width="40" height="40" loading="lazy" alt="${esc(away.abbreviation)}">`:''}<span class="team-name">${esc(away?away.name:'')}</span></div>
</div></div></div></div></a>`;
  }).join('\n');

  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><meta name="robots" content="index,follow">
<title>${esc(sportLabel)} Streams | Live ${esc(sportLabel)} Events</title>
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
<nav aria-label="breadcrumb"><ol class="breadcrumb text-secondary"><li class="breadcrumb-item"><a href="../index.html" class="text-danger">Home</a></li><li class="breadcrumb-item active">${esc(sportLabel)}</li></ol></nav>
<hr class="border-danger border-5 mb-7 w-250 mx-auto"><div class="row g-3">
${items||'<div class="col-12 text-center text-white"><p>No upcoming matches found.</p></div>'}
</div></main></body></html>`;
}

function renderHomepage(sportMatches) {
  const sections = Object.entries(sportMatches).filter(([,ms])=>ms&&ms.length).map(([name,matches])=>{
    const label = name.charAt(0).toUpperCase()+name.slice(1);
    return `<div class="sport mb-4"><h2 class="h-title">${esc(label)}</h2>${matches.slice(0,10).map(m=>{
      const competitors = m._competitors || (m.competitions && m.competitions[0] ? m.competitions[0].competitors : []);
      const home = extractTeam(competitors, 'home');
      const away = extractTeam(competitors, 'away');
      const dateISO = m.date;
      const slug = m.shortName ? slugify(m.shortName) : m.id;
      return `<a href="${name}/${m.id}/${slug}/index.html" class="matches"><div class="matches-block border rounded-3 d-block ripple"><div class="matches-main"><div class="matches-team"><div class="team-line centered">
<div class="col-3-list">${home&&home.logo?`<img class="team-logo" src="${home.logo}" width="40" height="40" loading="lazy" alt="">`:''}<span class="team-name">${esc(home?home.name:'')}</span></div>
<span class="prediction-score"><span class="matches-time"><div class="truncate">${formatTime(dateISO)}</div></span><span class="matches-time text-center"><span class="fw-bold fs-6">vs</span></span></span>
<div class="col-3-list">${away&&away.logo?`<img class="team-logo" src="${away.logo}" width="40" height="40" loading="lazy" alt="">`:''}<span class="team-name">${esc(away?away.name:'')}</span></div>
</div></div></div></div></a>`;
    }).join('\n')}</div>`;
  }).join('\n');

  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><meta name="robots" content="index,follow">
<title>StreamEast - Free Live Sports Streaming HD | NFL, NBA, UFC, Soccer &amp; MMA</title>
<meta name="description" content="StreamEast delivers free HD live sports.">
<link rel="canonical" href="index.html"><link rel="shortcut icon" href="nav.png" type="image/png">
<link rel="stylesheet" href="assets/css/style.css" type="text/css">
<link rel="preload" href="assets/css/mdb.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<meta property="og:title" content="StreamEast - Free Live Sports Streaming">
<meta property="og:description" content="Watch live streaming free HD.">
<meta property="og:image" content="og.webp"><meta name="theme-color" content="#8B2E3D"></head>
<body>
<nav class="navbar navbar-expand-md navbar-light sticky-top"><div class="container-lg align-items-center">
<a href="index.html"><img src="og.png" alt="StreamEast" style="width:37%;min-width:200px;height:auto;display:block;"></a>
<button class="navbar-toggler px-0" type="button" data-mdb-toggle="offcanvas" data-mdb-target="#offcanvasNavbar"><i class="fas fa-bars"></i></button>
<div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar">
<div class="offcanvas-header pb-0"><h5 class="offcanvas-title">Main Menu</h5><button class="navbar-toggler px-0"><i class="fas fa-bars"></i></button></div>
<div class="offcanvas-body"><ul class="nav navbar-nav ms-auto mb-2 mb-lg-0 justify-content-end flex-grow-1">
<li class="nav-item"><a class="nav-link" href="index.html"><span><i class="fas fa-home fa-lg"></i></span></a></li>
<li class="nav-item"><a class="nav-link" href="soccer/index.html">Soccer</a></li>
<li class="nav-item"><a class="nav-link" href="nba/index.html">NBA</a></li>
<li class="nav-item"><a class="nav-link" href="nfl/index.html">NFL</a></li>
<li class="nav-item"><a class="nav-link" href="nhl/index.html">NHL</a></li>
<li class="nav-item"><a class="nav-link" href="mlb/index.html">MLB</a></li>
<li class="nav-item"><a class="nav-link" href="mma/index.html">MMA</a></li>
<li class="nav-item"><a class="nav-link" href="boxing/index.html">Boxing</a></li>
<li class="nav-item"><a class="nav-link" href="f1/index.html">Formula 1</a></li>
</ul></div></div></div></nav>
<main class="container-lg py-5"><div class="row"><div class="col-12">
${sections||'<p class="text-white text-center">Loading matches...</p>'}
</div></div></main></body></html>`;
}

export { renderMatchPage, renderSportListing, renderHomepage, slugify };
