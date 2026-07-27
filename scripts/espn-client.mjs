const BASE_SITE = 'https://site.api.espn.com/apis/site/v2/sports';
const BASE_WEB = 'https://site.web.api.espn.com/apis/v2/sports';

const DELAY_MS = 800;
let lastRequestTime = 0;

async function rateLimit() {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < DELAY_MS) {
    await new Promise(r => setTimeout(r, DELAY_MS - elapsed));
  }
  lastRequestTime = Date.now();
}

const FETCH_TIMEOUT_MS = 15000;

async function fetchJSON(url) {
  await rateLimit();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`ESPN API ${res.status}: ${url}`);
    }
    return res.json();
  } finally {
    clearTimeout(timer);
  }
}

function getScoreboardURL(sport, league, dateStr) {
  let url = `${BASE_SITE}/${sport}/${league}/scoreboard`;
  if (dateStr) url += `?dates=${dateStr}`;
  return url;
}

function getSummaryURL(sport, league, eventId) {
  return `${BASE_SITE}/${sport}/${league}/summary?event=${eventId}`;
}

function getNewsURL(sport, league) {
  return `${BASE_SITE}/${sport}/${league}/news?limit=6`;
}

function getStandingsURL(sport, league) {
  return `${BASE_SITE}/${sport}/${league}/standings`;
}

function getStandingsV2URL(sport, league) {
  return `${BASE_WEB}/${sport}/${league}/standings`;
}

function getTeamScheduleURL(sport, league, teamId, season) {
  let url = `${BASE_SITE}/${sport}/${league}/teams/${teamId}/schedule`;
  if (season) url += `?season=${season}`;
  return url;
}

function getTeamNewsURL(sport, league, teamId) {
  return `${BASE_SITE}/${sport}/${league}/teams/${teamId}/news`;
}

function getTeamInfoURL(sport, league, teamId) {
  return `${BASE_SITE}/${sport}/${league}/teams/${teamId}/statistics`;
}

async function fetchStandings(sport, league) {
  return fetchJSON(getStandingsURL(sport, league));
}

async function fetchStandingsV2(sport, league) {
  return fetchJSON(getStandingsV2URL(sport, league));
}

async function fetchTeamSchedule(sport, league, teamId, season) {
  return fetchJSON(getTeamScheduleURL(sport, league, teamId, season));
}

async function fetchTeamNews(sport, league, teamId) {
  return fetchJSON(getTeamNewsURL(sport, league, teamId));
}

async function fetchTeamInfo(sport, league, teamId) {
  return fetchJSON(getTeamInfoURL(sport, league, teamId));
}

function extractStandings(raw) {
  if (!raw || !raw.standings) return [];
  const results = [];
  for (const s of raw.standings) {
    if (!s.entries) continue;
    for (const e of s.entries) {
      if (!e.team) continue;
      const stats = {};
      (e.stats || []).forEach(st => { stats[st.name] = st.displayValue; });
      results.push({
        rank: parseInt(stats.rank) || results.length + 1,
        teamId: e.team.id,
        teamName: e.team.displayName || e.team.name || e.team.location || '',
        teamAbbrev: e.team.abbreviation || '',
        teamLogo: e.team.logos && e.team.logos[0] ? e.team.logos[0].href : null,
        gp: stats.gamesPlayed || stats.wins || '0',
        wins: stats.wins || '0',
        losses: stats.losses || '0',
        ties: stats.ties || '0',
        gd: stats.goalDifference || stats.pointsFor || '0',
        pts: stats.points || stats.rank || '0'
      });
    }
  }
  return results;
}

function extractStandingsV2(raw) {
  if (!raw || !raw.children || !raw.children[0] || !raw.children[0].standings) return [];
  const entries = raw.children[0].standings.entries || [];
  return entries.map(e => {
    if (!e.team) return null;
    const stats = {};
    (e.stats || []).forEach(st => { stats[st.name] = st.displayValue; });
    return {
      rank: e.note && e.note.rank ? parseInt(e.note.rank) : entries.indexOf(e) + 1,
      teamId: e.team.id,
      teamName: e.team.displayName || e.team.name || e.team.location || '',
      teamAbbrev: e.team.abbreviation || '',
      teamLogo: e.team.logos && e.team.logos[0] ? e.team.logos[0].href : null,
      gp: stats.gamesPlayed || '0',
      wins: stats.wins || '0',
      losses: stats.losses || '0',
      ties: stats.ties || '0',
      gd: stats.pointDifferential || stats.goalDifference || '0',
      pts: stats.points || '0'
    };
  }).filter(Boolean);
}

const LEAGUE_SLUG_MAP = {
  'uefa.champions': 'uefa-champions-league',
  'uefa.champions_qual': 'uefa-champions-league',
  'uefa.europa': 'uefa-europa-league',
  'uefa.europa_qual': 'uefa-europa-league',
  'eng.1': 'english-premier-league',
  'esp.1': 'spanish-laliga',
  'ita.1': 'italian-serie-a',
  'fra.1': 'french-ligue-1',
  'ger.1': 'german-bundesliga',
  'por.1': 'portuguese-liga',
  'ned.1': 'dutch-eredivisie',
  'sco.1': 'scottish-premiership',
  'tur.1': 'turkish-super-lig',
  'bel.1': 'belgian-pro-league',
  'aut.1': 'austrian-bundesliga',
  'swe.1': 'swedish-allsvenskan',
  'nor.1': 'norwegian-eliteserien',
  'den.1': 'danish-superliga',
  'gre.1': 'greek-super-league',
  'jpn.1': 'japanese-j-league',
  'ksa.1': 'saudi-professional-league',
  'usa.1': 'usa-mls',
  'mex.1': 'mexican-liga-bbva',
  'bra.1': 'brazilian-serie-a',
  'bra.2': 'brazilian-serie-b',
  'arg.1': 'argentinian-primera',
  'chi.1': 'chilean-primera-division',
  'par.1': 'paraguayan-primera',
  'club.friendly': 'club-friendly',
  'fifa.friendly': 'fifa-friendly',
  'conmebol.sudamericana': 'conmebol-sudamericana',
  'usa.nwsl': 'usa-nwsl',
  'nba': 'nba',
  'nfl': 'nfl',
  'nhl': 'nhl',
  'mlb': 'mlb',
  'ufc': 'ufc',
  'pfl': 'pfl',
  'bellator': 'bellator',
  'f1': 'f1'
};

function getLeagueSlug(leagueId) {
  return LEAGUE_SLUG_MAP[leagueId] || slugify(leagueId);
}

function getLeagueName(leagueId) {
  const names = {
    'uefa.champions': 'UEFA Champions League',
    'uefa.champions_qual': 'UEFA Champions League',
    'uefa.europa': 'UEFA Europa League',
    'uefa.europa_qual': 'UEFA Europa League',
    'eng.1': 'English Premier League',
    'esp.1': 'Spanish LALIGA',
    'ita.1': 'Italian Serie A',
    'fra.1': 'French Ligue 1',
    'ger.1': 'German Bundesliga',
    'por.1': 'Portuguese Liga',
    'ned.1': 'Dutch Eredivisie',
    'sco.1': 'Scottish Premiership',
    'tur.1': 'Turkish Super Lig',
    'bel.1': 'Belgian Pro League',
    'aut.1': 'Austrian Bundesliga',
    'swe.1': 'Swedish Allsvenskan',
    'nor.1': 'Norwegian Eliteserien',
    'den.1': 'Danish Superliga',
    'gre.1': 'Greek Super League',
    'jpn.1': 'Japanese J.League',
    'ksa.1': 'Saudi Professional League',
    'usa.1': 'USA MLS',
    'mex.1': 'Mexican Liga BBVA',
    'bra.1': 'Brazilian Serie A',
    'bra.2': 'Brazilian Serie B',
    'arg.1': 'Argentinian Primera',
    'chi.1': 'Chilean Primera División',
    'par.1': 'Paraguayan Primera',
    'club.friendly': 'Club Friendly',
    'fifa.friendly': 'FIFA Friendly',
    'conmebol.sudamericana': 'CONMEBOL Sudamericana',
    'usa.nwsl': 'USA NWSL',
    'nba': 'NBA',
    'nfl': 'NFL',
    'nhl': 'NHL',
    'mlb': 'MLB',
    'ufc': 'UFC',
    'pfl': 'PFL',
    'bellator': 'Bellator',
    'f1': 'Formula 1'
  };
  return names[leagueId] || leagueId;
}

function slugify(str) {
  return String(str).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
}

function getLeagueLogo(leagueId) {
  const logos = {
    'uefa.champions': 'https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/2.png',
    'uefa.champions_qual': 'https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/2.png',
    'uefa.europa': 'https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/2310.png',
    'uefa.europa_qual': 'https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/2310.png',
    'eng.1': 'https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/23.png',
    'esp.1': 'https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/15.png',
    'ita.1': 'https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/12.png',
    'fra.1': 'https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/9.png',
    'ger.1': 'https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/10.png',
    'por.1': 'https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/14.png',
    'bra.1': 'https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/358.png',
    'bra.2': 'https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/2299.png',
    'arg.1': 'https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/21.png',
    'mex.1': 'https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/31.png',
    'swe.1': 'https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/16.png',
    'usa.1': 'https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/37.png',
    'chi.1': 'https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/86.png',
    'club.friendly': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/default-team-logo-500.png',
    'nba': 'https://a.espncdn.com/combiner/i?img=/i/leaguelogos/nba/500/nba.png',
    'nfl': 'https://a.espncdn.com/combiner/i?img=/i/leaguelogos/nfl/500/nfl.png',
    'nhl': 'https://a.espncdn.com/combiner/i?img=/i/leaguelogos/nhl/500/nhl.png',
    'mlb': 'https://a.espncdn.com/combiner/i?img=/i/leaguelogos/mlb/500/mlb.png',
    'f1': 'https://a.espncdn.com/combiner/i?img=/i/leaguelogos/f1/500/f1.png'
  };
  return logos[leagueId] || null;
}

async function fetchScoreboard(sport, league, dateStr) {
  return fetchJSON(getScoreboardURL(sport, league, dateStr));
}

async function fetchEventSummary(sport, league, eventId) {
  return fetchJSON(getSummaryURL(sport, league, eventId));
}

async function fetchNews(sport, league) {
  return fetchJSON(getNewsURL(sport, league));
}

function extractEvents(scoreboardData) {
  if (!scoreboardData || !scoreboardData.events) return [];
  return scoreboardData.events;
}

function buildName(competitors) {
  const home = competitors.find(c => c.homeAway === 'home');
  const away = competitors.find(c => c.homeAway === 'away');
  const hName = home ? (home.team ? home.team.displayName || home.team.name || home.team.location : home.displayName || home.name || '') : 'Home';
  const aName = away ? (away.team ? away.team.displayName || away.team.name || away.team.location : away.displayName || away.name || '') : 'Away';
  return `${hName} vs ${aName}`;
}

function buildShortName(competitors) {
  const home = competitors.find(c => c.homeAway === 'home');
  const away = competitors.find(c => c.homeAway === 'away');
  const hAbbr = home ? (home.team ? home.team.abbreviation : home.abbreviation || '') : '';
  const aAbbr = away ? (away.team ? away.team.abbreviation : away.abbreviation || '') : '';
  return hAbbr && aAbbr ? `${hAbbr} vs ${aAbbr}` : '';
}

function normalizeEvent(eventOrSummary) {
  let ev = eventOrSummary;
  let boxscore = eventOrSummary.boxscore;
  let format = eventOrSummary.format;
  let gameInfo = eventOrSummary.gameInfo;
  if (ev && ev.header) {
    ev = ev.header;
    boxscore = eventOrSummary.boxscore;
    format = eventOrSummary.format;
    gameInfo = eventOrSummary.gameInfo;
  }
  if (!ev) return null;

  const comp = ev.competitions && ev.competitions.length > 0 ? ev.competitions[0] : null;
  const competitors = comp ? comp.competitors : [];

  const name = ev.name || (comp ? (comp.name || comp.headline) : '') || buildName(competitors) || '';
  const shortName = buildShortName(competitors) || ev.shortName || (comp ? comp.shortName : '') || '';

  return {
    id: String(ev.id),
    name,
    shortName,
    date: ev.date || (comp ? comp.date : '') || '',
    competitions: ev.competitions || [],
    league: ev.league || (comp ? comp.league : null),
    status: comp ? comp.status : null,
    _competitors: competitors,
    _venue: comp ? comp.venue : (gameInfo ? gameInfo.venue : null),
    _boxscore: boxscore || null,
    _format: format || null
  };
}

function extractStats(summaryData) {
  if (!summaryData || !summaryData.boxscore || !summaryData.boxscore.teams) return null;
  return summaryData.boxscore.teams.map(t => ({
    team: t.team ? { id: t.team.id, name: t.team.displayName || t.team.name, logo: t.team.logo } : null,
    stats: (t.statistics || []).map(s => ({
      name: s.name,
      label: s.label || s.name,
      homeValue: s.displayValue || '0',
      awayValue: '0'
    }))
  }));
}

function extractCombinedStats(summaryData) {
  if (!summaryData || !summaryData.boxscore || !summaryData.boxscore.teams) return [];
  const teams = summaryData.boxscore.teams;
  if (teams.length < 2) return [];
  const homeStats = teams[0].statistics || [];
  const awayStats = teams[1].statistics || [];
  const statMap = {};
  homeStats.forEach(s => { statMap[s.name] = { label: s.label || s.name, homeValue: s.displayValue || '0', awayValue: '0' }; });
  awayStats.forEach(s => {
    if (statMap[s.name]) statMap[s.name].awayValue = s.displayValue || '0';
    else statMap[s.name] = { label: s.label || s.name, homeValue: '0', awayValue: s.displayValue || '0' };
  });
  return Object.values(statMap);
}

function extractRosters(summaryData) {
  if (!summaryData || !summaryData.rosters) return [];
  return summaryData.rosters.map(r => ({
    team: r.team ? { id: r.team.id, name: r.team.displayName || r.team.name, abbreviation: r.team.abbreviation, logo: r.team.logos && r.team.logos[0] ? r.team.logos[0].href : null } : null,
    formation: r.formation || '',
    players: (r.roster || []).map(p => ({
      starter: p.starter || false,
      jersey: p.jersey || '',
      athlete: p.athlete ? {
        id: p.athlete.id,
        fullName: p.athlete.fullName,
        shortName: p.athlete.shortName,
        position: p.athlete.position ? p.athlete.position.name : '',
        positionAbbr: p.athlete.position ? p.athlete.position.abbreviation : ''
      } : null
    }))
  }));
}

function extractCommentary(summaryData) {
  if (!summaryData || !summaryData.commentary) return [];
  return summaryData.commentary.map(c => ({
    sequence: c.sequence,
    time: c.time ? c.time.displayValue || String(c.time.value) : '',
    text: c.text || ''
  }));
}

function extractArticle(summaryData) {
  if (!summaryData || !summaryData.article) return null;
  return {
    headline: summaryData.article.headline || '',
    content: summaryData.article.content || ''
  };
}

function extractKeyEvents(summaryData) {
  if (!summaryData || !summaryData.keyEvents) return [];
  return summaryData.keyEvents.map(e => ({
    text: e.text || '',
    shortText: e.shortText || '',
    clock: e.clock ? e.clock.displayValue || '' : '',
    type: e.type ? e.type.text || '' : '',
    scoringPlay: e.scoringPlay || false,
    team: e.team ? e.team.displayName || '' : ''
  }));
}

export {
  fetchScoreboard,
  fetchEventSummary,
  fetchNews,
  fetchStandings,
  fetchStandingsV2,
  fetchTeamSchedule,
  fetchTeamNews,
  fetchTeamInfo,
  extractEvents,
  normalizeEvent,
  extractCombinedStats,
  extractRosters,
  extractCommentary,
  extractArticle,
  extractKeyEvents,
  extractStandings,
  extractStandingsV2,
  getLeagueSlug,
  getLeagueName,
  getLeagueLogo,
  LEAGUE_SLUG_MAP
};
