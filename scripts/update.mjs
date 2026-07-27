import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SITE_DIR = join(ROOT, 'site');
const MANIFEST_PATH = join(ROOT, 'manifest.json');
const CONFIG_PATH = join(ROOT, 'sports-config.json');

const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));

import { fetchScoreboard, fetchEventSummary, fetchNews, fetchStandings, extractEvents, normalizeEvent, extractCombinedStats, extractRosters, extractCommentary, extractArticle, extractKeyEvents, extractStandings, getLeagueSlug, getLeagueName, getLeagueLogo, LEAGUE_SLUG_MAP } from './espn-client.mjs';
import { renderMatchPage, renderSportListing, renderHomepage, renderLeaguePage, renderTeamPage, slugify } from './renderer.mjs';
import { fetchBoxingListing, extractEvents as extractBoxingEvents, renderMatchPage as renderBoxingMatch, renderListing as renderBoxingListing } from './boxing-scraper.mjs';

function loadManifest() {
  if (!existsSync(MANIFEST_PATH)) return {};
  try { return JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8')); } catch { return {}; }
}

function saveManifest(m) {
  writeFileSync(MANIFEST_PATH, JSON.stringify(m, null, 2));
}

function ensureDir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

function todayStr() {
  const d = new Date();
  return `${d.getUTCFullYear()}${String(d.getUTCMonth()+1).padStart(2,'0')}${String(d.getUTCDate()).padStart(2,'0')}`;
}

const DATE_STR = todayStr();

const FOOTER_TEAMS = [
  { id: '364', name: 'Liverpool', slug: 'liverpool' },
  { id: '360', name: 'Manchester United', slug: 'manchester-united' },
  { id: '86', name: 'Real Madrid', slug: 'real-madrid' },
  { id: '83', name: 'Barcelona', slug: 'barcelona' },
  { id: '160', name: 'Paris Saint-Germain', slug: 'paris-saint-germain' }
];

async function processSport(sportKey, sportCfg) {
  if (sportCfg.scrape) {
    console.log(`[${sportKey}] Using scrape mode...`);
    try {
      const html = await fetchBoxingListing();
      const events = extractBoxingEvents(html);
      console.log(`[${sportKey}] Found ${events.length} events`);
      return events;
    } catch (err) {
      console.error(`[${sportKey}] Scrape failed: ${err.message}`);
      return [];
    }
  }

  console.log(`[${sportKey}] Checking leagues: ${sportCfg.leagues.join(', ')}`);
  const allEvents = [];

  for (const league of sportCfg.leagues) {
    try {
      const data = await fetchScoreboard(sportCfg.sport, league, DATE_STR);
      if (!data) {
        console.log(`[${sportKey}/${league}] No data`);
        continue;
      }
      const events = extractEvents(data).map(e => {
        const n = normalizeEvent(e);
        if (n) n._sourceLeague = league;
        return n;
      }).filter(Boolean);
      console.log(`[${sportKey}/${league}] Found ${events.length} events`);
      allEvents.push(...events);
    } catch (err) {
      console.error(`[${sportKey}/${league}] Error: ${err.message}`);
    }
  }

  return allEvents;
}

async function processMatch(sportKey, sportCfg, event) {
  const eventId = String(event.id);
  const normalized = event;

  if (!normalized) {
    console.log(`[${sportKey}/${eventId}] Could not normalize event, skipping`);
    return;
  }

  let extra = {};
  if (!sportCfg.scrape) {
    const leagueForSummary = event._sourceLeague || sportCfg.leagues[0];
    try {
      const rawSummary = await fetchEventSummary(sportCfg.sport, leagueForSummary, eventId);
      if (rawSummary) {
        extra.stats = extractCombinedStats(rawSummary);
        extra.rosters = extractRosters(rawSummary);
        extra.commentary = extractCommentary(rawSummary);
        extra.article = extractArticle(rawSummary);
        extra.keyEvents = extractKeyEvents(rawSummary);
        extra.attendance = rawSummary.gameInfo && rawSummary.gameInfo.attendance ? String(rawSummary.gameInfo.attendance) : '';
      }
    } catch (err) {
      console.log(`[${sportKey}/${eventId}] Summary fetch failed: ${err.message}`);
    }
  }

  const shortName = normalized.shortName || normalized.name;
  const matchSlug = slugify(shortName);
  const pageDir = join(SITE_DIR, sportCfg.dir, eventId, matchSlug);
  ensureDir(pageDir);

  const html = sportCfg.scrape
    ? renderBoxingMatch(normalized)
    : renderMatchPage(normalized, sportCfg, extra);
  writeFileSync(join(pageDir, 'index.html'), html);
}

function getSportLabel(key) {
  const labels = {
    soccer: 'Soccer', nba: 'NBA', nfl: 'NFL', nhl: 'NHL',
    mlb: 'MLB', mma: 'MMA', f1: 'Formula 1', boxing: 'Boxing'
  };
  return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
}

async function fetchSportNews(sportCfg) {
  if (sportCfg.scrape) return [];
  const league = sportCfg.leagues[0];
  try {
    const data = await fetchNews(sportCfg.sport, league);
    if (data && data.articles) return data.articles;
  } catch (err) {
    // silent
  }
  return [];
}

function buildMatchGroups(events, sportKey, sportCfg) {
  if (!sportCfg.leagues || sportCfg.leagues.length <= 1) return null;
  const groups = [];
  for (const league of sportCfg.leagues) {
    const leagueEvents = events.filter(e => e._sourceLeague === league);
    if (leagueEvents.length === 0) continue;
    const leagueSlug = getLeagueSlug(league);
    const leagueName = getLeagueName(league);
    const leagueLogo = getLeagueLogo(league);
    groups.push({
      label: leagueName,
      slug: leagueSlug,
      logo: leagueLogo,
      leagueSlug,
      sportKey,
      events: leagueEvents
    });
  }
  return groups;
}

async function generateLeaguePages(sportKey, sportCfg, allEvents) {
  if (sportCfg.scrape) return;
  if (sportCfg.sport !== 'soccer') return;

  const leaguesToProcess = new Set();
  for (const event of allEvents) {
    if (event._sourceLeague) leaguesToProcess.add(event._sourceLeague);
  }

  for (const league of sportCfg.leagues) {
    const leagueEvents = allEvents.filter(e => e._sourceLeague === league);
    const leagueSlug = getLeagueSlug(league);
    const leagueName = getLeagueName(league);
    const leagueLogo = getLeagueLogo(league);

    const leagueDir = join(SITE_DIR, sportCfg.dir, 'leagues', leagueSlug);
    ensureDir(leagueDir);

    // Fetch standings
    let standings = [];
    try {
      const rawStandings = await fetchStandings(sportCfg.sport, league);
      if (rawStandings) {
        standings = extractStandings(rawStandings);
      }
    } catch (err) {
      console.log(`[${sportKey}/${league}] Standings fetch failed: ${err.message}`);
    }

    const html = renderLeaguePage(sportCfg, leagueEvents, leagueSlug, leagueName, league, standings, leagueLogo);
    writeFileSync(join(leagueDir, 'index.html'), html);
    console.log(`[${sportKey}] League page: ${sportCfg.dir}/leagues/${leagueSlug}/index.html (${leagueEvents.length} events, ${standings.length} teams)`);
  }
}

async function generateTeamPages(sportKey, sportCfg, allEvents, allSportEvents) {
  if (sportCfg.sport !== 'soccer') return;

  const teamMap = {};
  for (const event of allEvents) {
    const competitors = event._competitors || [];
    for (const c of competitors) {
      const t = c.team || c;
      if (t && t.id) {
        const tName = t.displayName || t.name || t.location || '';
        if (!teamMap[t.id]) {
          teamMap[t.id] = { id: t.id, name: tName, slug: slugify(tName), events: [] };
        }
        if (!teamMap[t.id].events.some(e => e.id === event.id)) {
          teamMap[t.id].events.push(event);
        }
      }
    }
  }

  // Add footer teams even if no events
  for (const ft of FOOTER_TEAMS) {
    if (!teamMap[ft.id]) {
      teamMap[ft.id] = { id: ft.id, name: ft.name, slug: ft.slug, events: [] };
    }
  }

  const teamDir = join(SITE_DIR, sportCfg.dir, 'team');
  ensureDir(teamDir);

  for (const [teamId, teamData] of Object.entries(teamMap)) {
    const teamSlug = teamData.slug;
    const tDir = join(teamDir, teamId, teamSlug);
    ensureDir(tDir);
    const html = renderTeamPage(sportCfg, teamData.events, teamId, teamData.name, teamSlug);
    writeFileSync(join(tDir, 'index.html'), html);
  }
  console.log(`[${sportKey}] Generated ${Object.keys(teamMap).length} team pages`);
}

async function main() {
  console.log(`=== StreamEast Updater ===`);
  console.log(`Date: ${DATE_STR}`);
  console.log();

  const manifest = loadManifest();
  if (!manifest.events) manifest.events = {};
  if (!manifest.lastUpdate) manifest.lastUpdate = {};

  const allSportEvents = {};
  const allSportNews = {};

  for (const [sportKey, sportCfg] of Object.entries(config)) {
    const events = await processSport(sportKey, sportCfg);
    allSportEvents[sportKey] = events;
    const dir = join(SITE_DIR, sportCfg.dir);
    ensureDir(dir);

    for (const event of events) {
      const eventId = String(event.id);
      const eventKey = `${sportKey}/${eventId}`;

      if (!manifest.events[eventKey]) {
        manifest.events[eventKey] = { sport: sportKey, id: eventId, firstSeen: new Date().toISOString() };
      }

      await processMatch(sportKey, sportCfg, event);
    }

    const newsArticles = await fetchSportNews(sportCfg);
    allSportNews[sportKey] = newsArticles;

    const matchGroups = buildMatchGroups(events, sportKey, sportCfg);
    const listingHtml = sportCfg.scrape
      ? renderBoxingListing(events)
      : renderSportListing(sportCfg, events, getSportLabel(sportKey), { news: newsArticles, matchGroups });
    writeFileSync(join(dir, 'index.html'), listingHtml);
    console.log(`[${sportKey}] Listing page updated (${events.length} events${newsArticles.length ? `, ${newsArticles.length} news` : ''})`);
  }

  // Generate league pages for soccer
  if (config.soccer) {
    await generateLeaguePages('soccer', config.soccer, allSportEvents.soccer || []);
  }

  // Generate team pages for soccer
  if (config.soccer) {
    await generateTeamPages('soccer', config.soccer, allSportEvents.soccer || [], allSportEvents);
  }

  const homepageHtml = renderHomepage(allSportEvents, { news: allSportNews });
  writeFileSync(join(SITE_DIR, 'index.html'), homepageHtml);
  console.log('[homepage] Updated');

  manifest.lastUpdate[DATE_STR] = new Date().toISOString();
  saveManifest(manifest);

  console.log();
  console.log('=== Update complete ===');
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
