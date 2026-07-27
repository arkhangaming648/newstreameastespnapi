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

function navHeader(R) {
  return `<nav class="navbar navbar-expand-md navbar-light sticky-top">
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
</ul></div></div></div></nav>`;
}

function footerHTML(R) {
  return `<footer class="bg-dark text-white mt-5 pt-4 pb-2">
<div class="container-lg">
<div class="row mb-4"><div class="col-12 text-center mb-3"><p class="mb-1 fw-bold">Get connected with us on social networks:</p>
<div>
<a href="#" class="text-white me-3"><i class="fab fa-facebook-f"></i></a>
<a href="#" class="text-white me-3"><i class="fab fa-twitter"></i></a>
<a href="#" class="text-white me-3"><i class="fab fa-instagram"></i></a>
<a href="#" class="text-white me-3"><i class="fab fa-youtube"></i></a>
<a href="#" class="text-white"><i class="fab fa-reddit-alien"></i></a>
</div></div></div>
<div class="row">
<div class="col-md-4 mb-3">
<h6 class="text-uppercase fw-bold">StreamEast</h6>
<p class="small text-white-50">StreamEast offers news about sports events like football, basketball, hockey, soccer and college sports. Including game date and time, location and venue, standings, latest news from various sources and how to watch with TV schedule.</p>
</div>
<div class="col-md-4 mb-3">
<h6 class="text-uppercase fw-bold">Competitions</h6>
<ul class="list-unstyled small">
<li><a href="${R}soccer/index.html" class="text-white-50 text-decoration-none">Champions League</a></li>
<li><a href="${R}soccer/index.html" class="text-white-50 text-decoration-none">Premier League</a></li>
<li><a href="${R}soccer/index.html" class="text-white-50 text-decoration-none">LaLiga</a></li>
<li><a href="${R}soccer/index.html" class="text-white-50 text-decoration-none">Serie A</a></li>
<li><a href="${R}soccer/index.html" class="text-white-50 text-decoration-none">Ligue 1</a></li>
</ul>
</div>
<div class="col-md-4 mb-3">
<h6 class="text-uppercase fw-bold">Teams</h6>
<ul class="list-unstyled small">
<li><a href="${R}soccer/index.html" class="text-white-50 text-decoration-none">Liverpool</a></li>
<li><a href="${R}soccer/index.html" class="text-white-50 text-decoration-none">Manchester United</a></li>
<li><a href="${R}soccer/index.html" class="text-white-50 text-decoration-none">Real Madrid</a></li>
<li><a href="${R}soccer/index.html" class="text-white-50 text-decoration-none">Barcelona</a></li>
<li><a href="${R}soccer/index.html" class="text-white-50 text-decoration-none">Paris Saint-Germain</a></li>
</ul>
</div>
</div>
<div class="row"><div class="col-12 text-center"><p class="small text-white-50 mb-0">&copy;2026 Streameast</p></div></div>
</div></footer>`;
}

function renderStatsTable(statsArray, homeName, awayName) {
  if (!statsArray || statsArray.length === 0) return '';
  const rows = statsArray.map(s => {
    const hv = esc(s.homeValue || '0');
    const av = esc(s.awayValue || '0');
    const lbl = esc(s.label || s.name || '');
    return `<tr><td class="text-end">${av}</td><td class="text-center fw-bold small">${lbl}</td><td>${hv}</td></tr>`;
  }).join('\n');
  return `<div class="card mb-3"><h3 class="card-header">Statistics</h3>
<div class="card-body p-0"><table class="table table-dark table-striped mb-0"><thead><tr>
<th class="text-end">${esc(awayName || 'Away')}</th><th class="text-center"></th><th>${esc(homeName || 'Home')}</th>
</tr></thead><tbody>${rows}</tbody></table></div></div>`;
}

function renderRosters(rosters) {
  if (!rosters || rosters.length < 2) return '';
  const sections = rosters.map(r => {
    const tName = r.team ? r.team.name : 'Team';
    const formation = r.formation || '';
    const starters = (r.players || []).filter(p => p.starter);
    const subs = (r.players || []).filter(p => !p.starter);
    const playerRows = starters.map(p => {
      const a = p.athlete || {};
      const pos = a.positionAbbr || a.position || '';
      return `<tr><td>${esc(p.jersey)}</td><td>${esc(a.shortName || a.fullName || '')}</td><td>${esc(pos)}</td></tr>`;
    }).join('\n');
    const subList = subs.map(p => {
      const a = p.athlete || {};
      return esc(a.shortName || a.fullName || '');
    }).filter(Boolean).join(', ');
    return `<div class="col-md-6 mb-3"><div class="card h-100"><div class="card-header fw-bold">${esc(tName)}${formation ? ` (${esc(formation)})` : ''}</div>
<div class="card-body p-0"><table class="table table-dark table-striped mb-0"><thead><tr><th>#</th><th>Player</th><th>Pos</th></tr></thead><tbody>${playerRows}</tbody></table></div>
${subList ? `<div class="card-footer small text-white-50"><span class="fw-bold">Substitutes:</span> ${esc(subList)}</div>` : ''}
</div></div>`;
  }).join('\n');
  return `<div class="card mb-3"><h3 class="card-header">Line-Ups</h3>
<div class="card-body"><div class="row">${sections}</div></div></div>`;
}

function renderCommentary(commentary, keyEvents) {
  if (!commentary || commentary.length === 0) return '';
  const goalTimes = new Set();
  if (keyEvents) keyEvents.filter(e => e.scoringPlay).forEach(e => {
    if (e.clock) goalTimes.add(e.clock);
  });

  const items = commentary.filter(c => c.text).map(c => {
    const time = c.time || '';
    const isGoal = goalTimes.has(time);
    const cls = isGoal ? 'list-group-item-success fw-bold' : 'list-group-item-dark';
    return `<li class="list-group-item ${cls} py-1 small"><span class="badge bg-secondary me-2">${esc(time)}</span>${esc(c.text)}</li>`;
  }).join('\n');
  return `<div class="card mb-3"><h3 class="card-header">Match Commentary</h3>
<div class="card-body p-0"><ul class="list-group list-group-flush" style="max-height:400px;overflow-y:auto;">${items}</ul></div></div>`;
}

function renderNews(newsArticles, R, sportDir) {
  if (!newsArticles || newsArticles.length === 0) return '';
  const items = newsArticles.slice(0, 6).map(a => {
    const href = a.links && a.links.web ? a.links.web.href : '#';
    return `<div class="col-12 mb-1"><a href="${esc(href)}" target="_blank" rel="noopener" class="text-decoration-none"><p class="mb-0 small">&bull; ${esc(a.headline || '')}</p></a></div>`;
  }).join('\n');
  return `<div class="card mb-3"><h3 class="card-header">${esc(sportDir || '')} News</h3>
<div class="card-body py-2">${items}</div></div>`;
}

function renderMatchPage(normalized, sportCfg, extra) {
  extra = extra || {};
  const ev = normalized;
  const competitors = ev._competitors || [];
  const venue = ev._venue;
  const home = extractTeam(competitors, 'home');
  const away = extractTeam(competitors, 'away');
  const eventId = ev.id;
  const matchSlug = ev.shortName ? slugify(ev.shortName) : 'match';
  const dateISO = ev.date;
  const leagueName = ev.league ? (ev.league.name || ev.league.slug || '') : '';
  const leagueSlug = ev.league ? (ev.league.slug || '') : '';
  const vName = venue ? (venue.fullName || venue.name || '') : '';
  const vCity = venue && venue.address ? (venue.address.city || '') : '';
  const vCountry = venue && venue.address ? (venue.address.country || '') : '';
  const vAttendance = extra.attendance || '';
  const statusText = ev.status && ev.status.type ? (ev.status.type.shortDetail || ev.status.type.description || '') : '';
  const article = extra.article;
  const stats = extra.stats || [];
  const rosters = extra.rosters || [];
  const commentary = extra.commentary || [];
  const keyEvents = extra.keyEvents || [];
  const newsArticles = extra.news || [];
  const R = '../../../';

  const scoreDisplay = (home && home.score !== undefined && home.score !== '') || (away && away.score !== undefined && away.score !== '')
    ? `<span class="fw-bold fs-3">${home ? esc(home.score) : ''}</span><br><span class="badge bg-danger" style="font-size:1.2em;margin:5px 0;">vs</span><br><span class="fw-bold fs-3">${away ? esc(away.score) : ''}</span>`
    : `<span class="badge bg-danger" style="font-size:1.5em;margin:5px 0;">vs</span>`;

  const statusBadge = statusText ? `<span class="badge bg-success ms-2">${esc(statusText)}</span>` : '';

  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><meta name="robots" content="index,follow">
<title>${esc(ev.name)} Live stream</title>
<meta name="description" content="Summary of the ${esc(ev.name)} match.">
<link rel="canonical" href="${R}${sportCfg.dir}/${eventId}/${matchSlug}/index.html">
<link rel="shortcut icon" href="${R}nav.png" type="image/png">
<link rel="stylesheet" href="${R}assets/css/style.css" type="text/css">
<link rel="preload" href="${R}assets/css/mdb.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<meta property="og:title" content="${esc(ev.name)} Live stream">
<meta property="og:description" content="Watch ${esc(ev.name)} live streaming.">
<meta property="og:image" content="${R}og.webp">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#8B2E3D"></head>
<body>
${navHeader(R)}
<main class="container-lg pt-3">
<nav aria-label="breadcrumb"><ol class="breadcrumb">
<li class="breadcrumb-item"><a class="linkUn" href="${R}index.html">Home</a></li>
<li class="breadcrumb-item"><a class="linkUn" href="${R}${sportCfg.dir}/index.html">${esc(leagueName || sportCfg.dir)}</a></li>
<li class="breadcrumb-item active">${esc(ev.name)}</li>
</ol></nav>
<div class="d-flex mb-2 flex-wrap align-items-center"><div><h1 class="match-head mb-0">${esc(ev.name)}</h1><span class="small text-white-50">${formatDate(dateISO)} - ${esc(leagueName)}${statusBadge}</span></div></div>

${article ? `<div class="alert alert-secondary py-2 mb-3 small">${esc(article.headline)}</div>` : ''}

<div id="mainBox" class="rounded mb-3"><div class="mph-main"><div class="mph-scoreboard">
${home ? `<div class="mph-team">${home.logo ? `<img class="mph-teamlogo" src="${home.logo}" width="70" height="70" alt="${esc(home.abbreviation)}">` : ''}<div class="mph-teamname-text">${esc(home.name)}</div></div>` : ''}
<div class="mph-scoreline text-center">${scoreDisplay}</div>
${away ? `<div class="mph-team">${away.logo ? `<img class="mph-teamlogo" src="${away.logo}" width="70" height="70" alt="${esc(away.abbreviation)}">` : ''}<div class="mph-teamname-text">${esc(away.name)}</div></div>` : ''}
</div></div></div>

<div class="row">
<div class="col-lg-8">
${renderCommentary(commentary, keyEvents)}
</div>
<div class="col-lg-4">
<div class="card mb-3"><h3 class="card-header">Game Information</h3><div class="card-body lh-lg py-2 small">
<i class="fas fa-trophy"></i> <span class="fw-bold">Competition: </span>${esc(leagueName)}<br>
<i class="fas fa-calendar"></i> <span class="fw-bold">Date: </span>${formatDate(dateISO)}<br>
<i class="fas fa-clock"></i> <span class="fw-bold">Time: </span>${formatTime(dateISO)}<br>
${vName ? `<i class="fas fa-location-arrow"></i> <span class="fw-bold">Venue: </span>${esc(vName)}<br>` : ''}
${vCity ? `<i class="fas fa-map-marker-alt"></i> <span class="fw-bold">Location: </span>${esc(vCity)}${vCountry ? `, ${esc(vCountry)}` : ''}<br>` : ''}
${vAttendance ? `<i class="fas fa-users"></i> <span class="fw-bold">Attendance: </span>${esc(vAttendance)}<br>` : ''}
</div></div>
${renderStatsTable(stats, home ? home.name : 'Home', away ? away.name : 'Away')}
${renderNews(newsArticles, R, sportCfg.dir)}
</div>
</div>

${renderRosters(rosters)}
</main>
${footerHTML(R)}
<script>let isLive="pre";let url="https://www.espn.com/${sportCfg.sport}/match?gameId=${eventId}&xhr=1";</script>
<script src="${R}js/app_ver%3D1698506434.js"></script>
</body></html>`;
}

function renderSportListing(sportCfg, matches, sportLabel, extra) {
  extra = extra || {};
  const newsArticles = extra.news || [];
  const R = '../';

  const items = matches.map(m => {
    const competitors = m._competitors || [];
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
<link rel="canonical" href="index.html"><link rel="shortcut icon" href="${R}nav.png" type="image/png">
<link rel="stylesheet" href="${R}assets/css/style.css" type="text/css">
<link rel="preload" href="${R}assets/css/mdb.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<meta name="theme-color" content="#8B2E3D"></head>
<body>
${navHeader(R)}
<main class="container-lg py-5">
<nav aria-label="breadcrumb"><ol class="breadcrumb text-secondary"><li class="breadcrumb-item"><a href="${R}index.html" class="text-danger">Home</a></li><li class="breadcrumb-item active">${esc(sportLabel)}</li></ol></nav>
<hr class="border-danger border-5 mb-4 w-250 mx-auto">
${items ? `<div class="row g-3">${items}</div>` : '<div class="col-12 text-center text-white"><p>No upcoming matches found.</p></div>'}
${renderNews(newsArticles, R, sportLabel)}
</main>
${footerHTML(R)}
</body></html>`;
}

function renderHomepage(sportMatches, extra) {
  extra = extra || {};
  const allNews = extra.news || {};
  const R = '';

  const sections = Object.entries(sportMatches).filter(([,ms])=>ms&&ms.length).map(([name,matches])=>{
    const label = name.charAt(0).toUpperCase()+name.slice(1);
    return `<div class="sport mb-4"><h2 class="h-title">${esc(label)}</h2>${matches.slice(0,10).map(m=>{
      const competitors = m._competitors || [];
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
${navHeader(R)}
<main class="container-lg py-5"><div class="row"><div class="col-12">
${sections||'<p class="text-white text-center">Loading matches...</p>'}
</div></div></main>
${footerHTML(R)}
</body></html>`;
}

export { renderMatchPage, renderSportListing, renderHomepage, slugify };
