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
  const l = (path) => `${R}${path}`;
  return `<footer class="text-center text-lg-start bg-light text-muted">
<section class="d-flex justify-content-center justify-content-lg-between p-3 border-bottom">
<div class="me-5 d-none d-lg-block"><span>Get connected with us on social networks:</span></div>
<div>
<a href="https://www.facebook.com/" class="me-4 text-reset"><i class="fab fa-facebook-f"></i></a>
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
<li><a class="linkUn text-muted" href="${l('soccer/leagues/uefa-champions-league/index.html')}">Champions League</a></li>
<li><a class="linkUn text-muted" href="${l('soccer/leagues/english-premier-league/index.html')}">Premier League</a></li>
<li><a class="linkUn text-muted" href="${l('soccer/leagues/spanish-laliga/index.html')}">LaLiga</a></li>
<li><a class="linkUn text-muted" href="${l('soccer/leagues/italian-serie-a/index.html')}">Serie A</a></li>
<li><a class="linkUn text-muted" href="${l('soccer/leagues/french-ligue-1/index.html')}">Ligue 1</a></li>
</ul>
</div>
<div class="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
<h6 class="text-uppercase fw-bold mb-4">Teams</h6>
<ul class="list-unstyled mb-0">
<li><a class="linkUn text-muted" href="${l('soccer/team/364/liverpool/index.html')}">Liverpool</a></li>
<li><a class="linkUn text-muted" href="${l('soccer/team/360/manchester-united/index.html')}">Manchester United</a></li>
<li><a class="linkUn text-muted" href="${l('soccer/team/86/real-madrid/index.html')}">Real Madrid</a></li>
<li><a class="linkUn text-muted" href="${l('soccer/team/83/barcelona/index.html')}">Barcelona</a></li>
<li><a class="linkUn text-muted" href="${l('soccer/team/160/paris-saint-germain/index.html')}">Paris Saint-Germain</a></li>
</ul>
</div>
</div></div></section>
<div class="text-center p-3" style="background-color:rgba(0,0,0,0.2);">&copy;2025 <a href="https://streameast.gl/" class="text-reset">Streameast</a></div>
</footer>`;
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
<script src="${R}js/ind_ver=1698506434.js"></script>
</body></html>`;
}

function renderLeaguePage(sportCfg, leagueEvents, leagueSlug, leagueName, leagueId, standings, leagueLogo) {
  const R = '../../../';
  const items = leagueEvents.map(m => {
    const competitors = m._competitors || [];
    const home = extractTeam(competitors, 'home');
    const away = extractTeam(competitors, 'away');
    const dateISO = m.date;
    const slug = m.shortName ? slugify(m.shortName) : m.id;
    const href = `../../${m.id}/${slug}/index.html`;
    return `<a href="${href}" class="matches" aria-label="${esc(m.name)}">
<div class="matches-block border rounded-3 d-block ripple"><div class="matches-main"><div class="matches-team"><div class="team-line centered">
<div class="col-3-list">${home&&home.logo?`<img class="team-logo animation fade-in" src="${home.logo}" width="40" height="40" loading="lazy" alt="${esc(home.abbreviation)}">`:''}<span class="team-name">${esc(home?home.name:'')}</span></div>
<span class="prediction-score"><span class="matches-time"><div class="truncate">${formatTime(dateISO)}</div></span><span class="matches-time text-center"><span class="fw-bold fs-6">vs</span></span><span class="league text-center"></span></span>
<div class="col-3-list">${away&&away.logo?`<img class="team-logo animation fade-in" src="${away.logo}" width="40" height="40" loading="lazy" alt="${esc(away.abbreviation)}">`:''}<span class="team-name">${esc(away?away.name:'')}</span></div>
</div></div></div></div></a>`;
  }).join('\n');

  const standingsTable = standings && standings.length > 0 ? `<div style="mb-3">
<table class="table table-striped table-responsive text-center" style="font-size:13px;">
<thead><tr><th title="Rank">#</th><th class="text-start">TEAM</th><th title="Games Played">GP</th><th title="Goal Difference">GD</th><th title="Points">PTS</th></tr></thead>
<tbody>${standings.slice(0,20).map(s => `<tr>
<td>${s.rank}</td>
<td class="text-start text-nowrap"><a class="linkUn" href="../team/${s.teamId}/${slugify(s.teamName)}/index.html">${esc(s.teamName)}</a></td>
<td>${s.gp}</td><td>${s.gd}</td><td>${s.pts}</td>
</tr>`).join('\n')}</tbody></table></div>
<div class="d-grid gap-2"><a class="btn btn-light btn-sm w-100 mb-3" data-mdb-ripple-color="dark" href="#">Full Standings</a></div>` : '';

  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><meta name="robots" content="index,follow">
<title>${esc(leagueName)} Scores and Fixtures</title>
<meta name="description" content="Get ${esc(leagueName)} Live Scores, Fixtures, Results, Schedules, News and Live Streams">
<link rel="canonical" href="index.html"><link rel="shortcut icon" href="${R}nav.png" type="image/png">
<link rel="stylesheet" href="${R}assets/css/style.css" type="text/css">
<link rel="preload" href="${R}assets/css/mdb.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<meta name="theme-color" content="#8B2E3D"></head>
<body>
${navHeader(R)}
<main class="container-lg"><div class="list-matches px-2"><div id="tbody3">
<nav aria-label="breadcrumb"><ol class="breadcrumb">
<li class="breadcrumb-item"><a class="linkUn" href="${R}index.html">Home</a></li>
<li class="breadcrumb-item"><a class="linkUn" href="../../index.html">Football</a></li>
<li class="breadcrumb-item active">${esc(leagueName)}</li>
</ol></nav>
<h1 class="h1title mb-3">${leagueLogo ? `<img alt="${esc(leagueName)}" src="${leagueLogo}" width="40" height="40" style="vertical-align:top;">` : ''}<span class="">${esc(leagueName)}</span></h1>
<div class="row">
<div class="col-md-8 px-3">
<h2 class="widgetTitle text-start">${esc(leagueName)} Scores and Fixtures</h2>
<div class="px-1 my-3"></div>
<h2 class="card-title my-3 fw-bold" style="color:#00222e;font-family:Monda;font-size:1rem;"></h2>
${items || '<p class="text-muted">No matches found for today.</p>'}
</div>
<div class="col-md-4 px-3">
<h2 class="widgetTitle">${esc(leagueName)} Table</h2>
${standingsTable}
</div>
</div></div></main>
${footerHTML(R)}
<script src="${R}js/ind_ver=1698506434.js"></script>
</body></html>`;
}

function getScoreDisplay(team) {
  if (!team || team.score === undefined || team.score === null || team.score === '') return '';
  if (typeof team.score === 'object') return team.score.displayValue || team.score.value || '';
  return String(team.score);
}

function renderTeamPage(sportCfg, teamInfo, fixtures, newsArticles, standings) {
  const R = '../../../../';
  const teamName = teamInfo.name || '';
  const teamLogo = teamInfo.logo || '';
  const leagueName = teamInfo.leagueName || '';
  const leagueSlug = teamInfo.leagueSlug || '';
  const leaguePosition = teamInfo.leaguePosition || '';
  const teamId = teamInfo.id || '';

  // Compact fixture items (left col)
  const fixtureItems = (fixtures || []).map(m => {
    const competitors = m._competitors || [];
    const home = extractTeam(competitors, 'home');
    const away = extractTeam(competitors, 'away');
    const dateISO = m.date;
    const slug = m.shortName ? slugify(m.shortName) : m.id;
    const href = `../../${m.id}/${slug}/index.html`;
    const hAbbr = home ? (home.abbreviation || home.name.substring(0,3).toUpperCase()) : '';
    const aAbbr = away ? (away.abbreviation || away.name.substring(0,3).toUpperCase()) : '';
    const hLogo = home && home.logo ? home.logo : '';
    const aLogo = away && away.logo ? away.logo : '';
    const scoreHome = getScoreDisplay(home);
    const scoreAway = getScoreDisplay(away);
    const hasScore = scoreHome !== '' && scoreAway !== '';
    const scoreDisplay = hasScore ? `${scoreHome}-${scoreAway}` : formatTime(dateISO);
    const scoreClass = hasScore ? 'badge bg-success' : 'badge bg-danger';
    return `<a href="${href}" class="matches team-match" aria-label="${esc(m.name)}" style="display:flex;align-items:center;padding:5px 0;border-bottom:1px solid #333;">
<div class="team-name-small" style="flex:1;display:flex;align-items:center;gap:5px;min-width:0;">
${hLogo ? `<img src="${hLogo}" width="20" height="20" alt="${esc(hAbbr)}">` : ''}
<span style="font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(hAbbr)}</span>
</div>
<div style="flex:0 0 auto;text-align:center;margin:0 10px;">
<span class="${scoreClass}" style="font-size:11px;white-space:nowrap;">${esc(scoreDisplay)}</span>
<div style="font-size:10px;color:#999;">${esc(leagueName)}</div>
</div>
<div class="team-name-small" style="flex:1;display:flex;align-items:center;gap:5px;min-width:0;justify-content:flex-end;">
<span style="font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(aAbbr)}</span>
${aLogo ? `<img src="${aLogo}" width="20" height="20" alt="${esc(aAbbr)}">` : ''}
</div>
</a>`;
  }).join('\n');

  // News items (middle col)
  const newsItems = (newsArticles || []).slice(0,4).map(a => {
    const img = a.images && a.images[0] ? a.images[0].url || a.images[0].href || a.images[0].src : (a.image ? a.image.url || a.image.href || a.image.src : '');
    const href = a.links && a.links.web ? a.links.web.href : '#';
    return `<div class="col-6 mb-3">
<div class="card h-100">
<a href="${esc(href)}" target="_blank" rel="noopener" class="text-decoration-none">
${img ? `<img class="card-img-top" src="${img}" width="360" height="144" loading="lazy" alt="${esc(a.headline||'')}" style="max-width:100%;height:auto;" onerror="this.remove()">` : ''}
<div class="card-body p-2">
<span class="side-news-title" style="font-size:13px;">${esc(a.headline||'')}</span>
<p class="card-text side-news-desc small mb-0">${esc(a.description||a.caption||'')}</p>
</div>
</a>
</div>
</div>`;
  }).join('\n') || '<p class="text-muted small">No news available.</p>';

  // Standings table (right col)
  const standingsTable = standings && standings.length > 0 ? `<table class="table table-striped table-responsive text-center" style="font-size:11px;margin-bottom:0;">
<thead><tr><th title="Rank">#</th><th class="text-start">TEAM</th><th title="Games Played">GP</th><th title="Goal Difference">GD</th><th title="Points">PTS</th></tr></thead>
<tbody>${standings.slice(0,20).map(s => `<tr>
<td>${s.rank}</td>
<td class="text-start text-nowrap" style="max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"><a class="linkUn" href="../team/${s.teamId}/${slugify(s.teamName)}/index.html" style="font-size:11px;">${esc(s.teamName)}</a></td>
<td>${s.gp}</td><td>${s.gd}</td><td><strong>${s.pts}</strong></td>
</tr>`).join('\n')}</tbody></table>
<div class="d-grid gap-2 mt-2"><a class="btn btn-light btn-sm w-100" href="../leagues/${leagueSlug}/index.html">Full Standings</a></div>` : '<p class="text-muted small">Standings not available.</p>';

  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><meta name="robots" content="index,follow">
<title>${esc(teamName)} - StreamEast</title>
<meta name="description" content="${esc(teamName)} scores, fixtures, standings and news">
<link rel="canonical" href="index.html"><link rel="shortcut icon" href="${R}nav.png" type="image/png">
<link rel="stylesheet" href="${R}assets/css/style.css" type="text/css">
<link rel="preload" href="${R}assets/css/mdb.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<meta property="og:title" content="${esc(teamName)} - StreamEast">
<meta property="og:description" content="Get ${esc(teamName)} fixtures, results and standings.">
<meta name="theme-color" content="#8B2E3D"></head>
<body>
${navHeader(R)}
<main class="container-lg"><div class="list-matches px-2"><div id="tbody3">
<nav aria-label="breadcrumb"><ol class="breadcrumb">
<li class="breadcrumb-item"><a class="linkUn" href="${R}index.html">Home</a></li>
<li class="breadcrumb-item"><a class="linkUn" href="../../index.html">Football</a></li>
<li class="breadcrumb-item active">${esc(teamName)}</li>
</ol></nav>

<div class="d-flex align-items-center gap-3 mb-3">
${teamLogo ? `<img src="${teamLogo}" width="60" height="60" alt="${esc(teamName)}">` : ''}
<div>
<h1 class="h1title mb-0">${esc(teamName)}</h1>
${leaguePosition ? `<span class="text-white-50 small">${esc(leaguePosition)}</span>` : ''}
</div>
</div>

<div class="row">
<div class="col-md-3 mb-3">
<h2 class="widgetTitle" style="font-size:14px;margin-bottom:8px;">2026 Fixtures</h2>
<div style="background:#1a1a2e;border-radius:8px;padding:8px;">
${fixtureItems || '<p class="text-muted small mb-0">No fixtures available.</p>'}
</div>
</div>

<div class="col-md-6 mb-3">
<h2 class="widgetTitle" style="font-size:14px;margin-bottom:8px;">News</h2>
<div class="row g-2">
${newsItems}
</div>
</div>

<div class="col-md-3 mb-3">
<h2 class="widgetTitle" style="font-size:14px;margin-bottom:8px;">${esc(leagueName)} Table</h2>
${standingsTable}
</div>
</div>
</div></main>
${footerHTML(R)}
<script src="${R}js/ind_ver=1698506434.js"></script>
</body></html>`;
}

function renderSportListing(sportCfg, matches, sportLabel, extra) {
  extra = extra || {};
  const newsArticles = extra.news || [];
  const matchGroups = extra.matchGroups || null;
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
<div class="col-3-list">${home&&home.logo?`<img class="team-logo animation fade-in" src="${home.logo}" width="40" height="40" loading="lazy" alt="${esc(home.abbreviation)}">`:''}<span class="team-name">${esc(home?home.name:'')}</span></div>
<span class="prediction-score"><span class="matches-time"><div class="truncate">${formatTime(dateISO)}</div></span><span class="matches-time text-center"><span class="fw-bold fs-6">vs</span></span><span class="league text-center"></span></span>
<div class="col-3-list">${away&&away.logo?`<img class="team-logo animation fade-in" src="${away.logo}" width="40" height="40" loading="lazy" alt="${esc(away.abbreviation)}">`:''}<span class="team-name">${esc(away?away.name:'')}</span></div>
</div></div></div></div></a>`;
  }).join('\n');

  const leftContent = matchGroups
    ? matchGroups.map((g, i) => {
        const isFirst = i === 0;
        const groupItems = g.events.map(m => {
          const c = m._competitors || [];
          const h = extractTeam(c, 'home');
          const a = extractTeam(c, 'away');
          const d = m.date;
          const s = m.shortName ? slugify(m.shortName) : m.id;
          return `<a href="${m.id}/${s}/index.html" class="matches" aria-label="${esc(m.name)}">
<div class="matches-block border rounded-3 d-block ripple"><div class="matches-main"><div class="matches-team"><div class="team-line centered">
<div class="col-3-list">${h&&h.logo?`<img class="team-logo animation fade-in" src="${h.logo}" width="40" height="40" loading="lazy" alt="${esc(h.abbreviation)}">`:''}<span class="team-name">${esc(h?h.name:'')}</span></div>
<span class="prediction-score"><span class="matches-time"><div class="truncate">${formatTime(d)}</div></span><span class="matches-time text-center"><span class="fw-bold fs-6">vs</span></span><span class="league text-center"></span></span>
<div class="col-3-list">${a&&a.logo?`<img class="team-logo animation fade-in" src="${a.logo}" width="40" height="40" loading="lazy" alt="${esc(a.abbreviation)}">`:''}<span class="team-name">${esc(a?a.name:'')}</span></div>
</div></div></div></div></a>`;
        }).join('\n');
        const accordionId = `sport-group-${i}`;
        return `<div class="accordion-item border-0">
<h2 class="accordion-header" style="color:#00222e;font-family:Monda;font-size:1rem;">
<button class="accordion-button ${isFirst?'':'collapsed'} py-2" type="button" data-mdb-toggle="collapse" data-mdb-target="#${accordionId}" style="box-shadow:unset;border-top:1px solid #ecedef;font-family:Verdana,Arial,Helvetica,sans-serif;color:#333;font-weight:600;white-space:nowrap;">
<a href="${g.leagueSlug ? R+g.sportKey+'/leagues/'+g.leagueSlug+'/index.html' : '#'}" style="text-decoration:none;color:inherit;" data-mdb-toggle="tooltip" title="See All">
${g.logo ? `<img alt="${esc(g.label)}" src="${g.logo}" width="40" height="40" style="margin-right:5px;">` : ''}</a>${esc(g.label)}
</button></h2>
<div id="${accordionId}" class="accordion-collapse collapse ${isFirst?'show':''}" style="overflow-x:auto;">
<div class="accordion-body px-0 pt-0 pb-3">${groupItems}</div></div></div>`;
      }).join('\n')
    : items;

  const title = esc(sportLabel);
  const sportIcon = sportCfg.sport === 'soccer' ? 'https://a.espncdn.com/combiner/i?img=/redesign/assets/img/icons/ESPN-icon-soccer.png&h=80&w=80&scale=crop&cquality=40' : '';

  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><meta name="robots" content="index,follow">
<title>${title} Streams | Live ${title} Events</title>
<link rel="canonical" href="index.html"><link rel="shortcut icon" href="${R}nav.png" type="image/png">
<link rel="stylesheet" href="${R}assets/css/style.css" type="text/css">
<link rel="preload" href="${R}assets/css/mdb.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<meta name="theme-color" content="#8B2E3D"></head>
<body>
${navHeader(R)}
<main class="container-lg overflow-auto"><div class="list-matches px-2"><div id="tbody3">
<nav aria-label="breadcrumb"><ol class="breadcrumb text-secondary"><li class="breadcrumb-item"><a href="${R}index.html" class="text-danger">Home</a></li><li class="breadcrumb-item active">${title}</li></ol></nav>
<div class="row gx-3">
<div class="${newsArticles.length ? 'col-md-8' : 'col-12'} py-2">
${sportIcon ? `<h1 class="h1title"><img alt="${title}" src="${sportIcon}" width="40" height="40" style="width:40px;height:40px;vertical-align:top;"><span class="">${title} Fixtures</span></h1>` : ''}
<div class="league-section row mx-0 mb-1 shadow-none" style="padding:0.75rem 0.25rem;"></div>
${matchGroups ? leftContent : `<div class="row g-3">${items || '<div class="col-12 text-center text-white"><p>No upcoming matches found.</p></div>'}</div>`}
</div>
${newsArticles.length ? `<div class="col-md-4 py-2"><div class="league-section p-0"><h3 class="card-header">${title} Headlines</h3><div class="card-body">${newsArticles.slice(0,6).map(a => {
  const img = a.images && a.images[0] ? a.images[0].url || a.images[0].href || a.images[0].src : (a.image ? a.image.url || a.image.href || a.image.src : '');
  return `${img ? `<img class="news-image-h animation fade-in" src="${img}" width="360" height="144" loading="lazy" alt="${esc(a.headline||'')}" style="max-width:100%;height:auto;" onerror="this.remove()">` : ''}
<span class="side-news-title">${esc(a.headline||'')}</span>
<p class="card-text side-news-desc">${esc(a.description||a.caption||'')}</p>`;
}).join('\n')}</div></div></div>` : ''}
</div></div></main>
${footerHTML(R)}
<script type="text/javascript" src="${R}assets/js/jquery.min.js"></script>
<script type="text/javascript" src="${R}assets/js/mdb.min.js"></script>
</body></html>`;
}

const SPORT_ICONS = {
  soccer: 'https://a.espncdn.com/combiner/i?img=/redesign/assets/img/icons/ESPN-icon-soccer.png&h=80&w=80&scale=crop&cquality=40',
  nba: 'https://a.espncdn.com/combiner/i?img=/redesign/assets/img/icons/ESPN-icon-basketball.png&h=80&w=80&scale=crop&cquality=40',
  nfl: 'https://a.espncdn.com/combiner/i?img=/redesign/assets/img/icons/ESPN-icon-football.png&h=80&w=80&scale=crop&cquality=40',
  nhl: 'https://a.espncdn.com/combiner/i?img=/redesign/assets/img/icons/ESPN-icon-hockey.png&h=80&w=80&scale=crop&cquality=40',
  mlb: 'https://a.espncdn.com/combiner/i?img=/redesign/assets/img/icons/ESPN-icon-baseball.png&h=80&w=80&scale=crop&cquality=40',
  mma: 'https://a.espncdn.com/combiner/i?img=/redesign/assets/img/icons/ESPN-icon-mma.png&h=80&w=80&scale=crop&cquality=40',
  boxing: 'https://a.espncdn.com/combiner/i?img=/redesign/assets/img/icons/ESPN-icon-boxing.png&h=80&w=80&scale=crop&cquality=40',
  f1: 'https://a.espncdn.com/combiner/i?img=/redesign/assets/img/icons/ESPN-icon-f1.png&h=80&w=80&scale=crop&cquality=40'
};

function renderHomepage(sportMatches, extra) {
  extra = extra || {};
  const allNews = extra.news || {};
  const R = '';

  const sections = Object.entries(sportMatches).filter(([,ms])=>ms&&ms.length).map(([name,matches], idx)=>{
    const label = name.charAt(0).toUpperCase()+name.slice(1);
    const icon = SPORT_ICONS[name] || '';
    const isFirst = idx === 0;
    const accordionId = `home-sport-${name}`;
    const groupItems = matches.slice(0,10).map(m=>{
      const competitors = m._competitors || [];
      const home = extractTeam(competitors, 'home');
      const away = extractTeam(competitors, 'away');
      const dateISO = m.date;
      const slug = m.shortName ? slugify(m.shortName) : m.id;
      return `<a href="${name}/${m.id}/${slug}/index.html" class="matches" aria-label="${esc(m.name)}">
<div class="matches-block border rounded-3 d-block ripple"><div class="matches-main"><div class="matches-team"><div class="team-line centered">
<div class="col-3-list">${home&&home.logo?`<img class="team-logo animation fade-in" src="${home.logo}" width="40" height="40" loading="lazy" alt="${esc(home.abbreviation)}">`:''}<span class="team-name">${esc(home?home.name:'')}</span></div>
<span class="prediction-score"><span class="matches-time"><div class="truncate">${formatTime(dateISO)}</div></span><span class="matches-time text-center"><span class="fw-bold fs-6">vs</span></span><span class="league text-center"></span></span>
<div class="col-3-list">${away&&away.logo?`<img class="team-logo animation fade-in" src="${away.logo}" width="40" height="40" loading="lazy" alt="${esc(away.abbreviation)}">`:''}<span class="team-name">${esc(away?away.name:'')}</span></div>
</div></div></div></div></a>`;
    }).join('\n');
    return `<div class="accordion-item border-0">
<h2 class="accordion-header" style="color:#00222e;font-family:Monda;font-size:1rem;">
<button class="accordion-button ${isFirst?'':'collapsed'} py-2" type="button" data-mdb-toggle="collapse" data-mdb-target="#${accordionId}" style="box-shadow:unset;border-top:1px solid #ecedef;font-family:Verdana,Arial,Helvetica,sans-serif;color:#333;font-weight:600;white-space:nowrap;">
<a href="${name}/index.html" style="text-decoration:none;color:inherit;" data-mdb-toggle="tooltip" title="See All">
${icon ? `<img alt="${esc(label)}" src="${icon}" width="40" height="40" style="margin-right:5px;">` : ''}</a>${esc(label)}
</button></h2>
<div id="${accordionId}" class="accordion-collapse collapse ${isFirst?'show':''}" style="overflow-x:auto;">
<div class="accordion-body px-0 pt-0 pb-3">${groupItems}</div></div></div>`;
  }).join('\n');

  const allNewsItems = Object.values(allNews).flat().slice(0,6);

  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><meta name="robots" content="index,follow">
<title>StreamEast — Free Live Sports Streaming HD | NFL, NBA, UFC, Soccer &amp; MMA</title>
<meta name="description" content="StreamEast delivers free HD live sports. Watch NBA, NFL, NHL, MLB, UFC, Soccer, MMA, and football streams online — no sign-up required Just watch every streams in HD for free.">
<link rel="canonical" href="index.html"><link rel="shortcut icon" href="nav.png" type="image/png">
<link rel="stylesheet" href="assets/css/style.css" type="text/css">
<link rel="preload" href="assets/css/mdb.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<meta property="og:title" content="StreamEast - Free Live Sports Streaming">
<meta property="og:description" content="StreamEast delivers free HD live sports.">
<meta property="og:image" content="og.webp"><meta name="theme-color" content="#8B2E3D"></head>
<body>
${navHeader(R)}
<main class="container-lg overflow-auto"><div class="list-matches px-2"><div id="tbody3">
<div class="row gx-3">
<div class="${allNewsItems.length ? 'col-md-8' : 'col-12'} py-2">
<h1 class="h1title mb-3">Today's Matches</h1>
${sections||'<p class="text-muted text-center">No matches found for today.</p>'}
</div>
${allNewsItems.length ? `<div class="col-md-4 py-2"><div class="league-section p-0"><h3 class="card-header">Headlines</h3><div class="card-body">${allNewsItems.map(a => {
  const img = a.images && a.images[0] ? a.images[0].url || a.images[0].href || a.images[0].src : (a.image ? a.image.url || a.image.href || a.image.src : '');
  return `${img ? `<img class="news-image-h animation fade-in" src="${img}" width="360" height="144" loading="lazy" alt="${esc(a.headline||'')}" style="max-width:100%;height:auto;" onerror="this.remove()">` : ''}
<span class="side-news-title">${esc(a.headline||'')}</span>
<p class="card-text side-news-desc">${esc(a.description||a.caption||'')}</p>`;
}).join('\n')}</div></div></div>` : ''}
</div></div></main>
${footerHTML(R)}
<script type="text/javascript" src="assets/js/jquery.min.js"></script>
<script type="text/javascript" src="assets/js/mdb.min.js"></script>
</body></html>`;
}

export { renderMatchPage, renderSportListing, renderHomepage, renderLeaguePage, renderTeamPage, slugify };
