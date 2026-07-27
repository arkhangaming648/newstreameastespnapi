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
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
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

async function fetchScoreboard(sport, league, dateStr) {
  return fetchJSON(getScoreboardURL(sport, league, dateStr));
}

async function fetchEventSummary(sport, league, eventId) {
  return fetchJSON(getSummaryURL(sport, league, eventId));
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

export {
  fetchScoreboard,
  fetchEventSummary,
  extractEvents,
  normalizeEvent
};
