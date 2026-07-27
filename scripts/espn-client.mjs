const BASE_SITE = 'https://site.api.espn.com/apis/site/v2/sports';

const DELAY_MS = 1200;
let lastRequestTime = 0;

async function rateLimit() {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < DELAY_MS) {
    await new Promise(r => setTimeout(r, DELAY_MS - elapsed));
  }
  lastRequestTime = Date.now();
}

async function fetchJSON(url) {
  await rateLimit();
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
  });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`ESPN API ${res.status}: ${url}`);
  }
  return res.json();
}

function getScoreboardURL(sport, league, dateStr) {
  return `${BASE_SITE}/${sport}/${league}/scoreboard?dates=${dateStr}`;
}

function getSummaryURL(sport, league, eventId) {
  return `${BASE_SITE}/${sport}/${league}/summary?event=${eventId}`;
}

function getNewsURL(sport, league) {
  return `${BASE_SITE}/${sport}/${league}/news?limit=6`;
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
  extractEvents,
  normalizeEvent,
  extractCombinedStats,
  extractRosters,
  extractCommentary,
  extractArticle,
  extractKeyEvents
};
