import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SITE_DIR = join(ROOT, 'site');
const MANIFEST_PATH = join(ROOT, 'manifest.json');
const CONFIG_PATH = join(ROOT, 'sports-config.json');

const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));

import { fetchScoreboard, fetchEventSummary, extractEvents, normalizeEvent } from './espn-client.mjs';
import { renderMatchPage, renderSportListing, renderHomepage, slugify } from './renderer.mjs';
import { fetchBoxingListing, extractEvents as extractBoxingEvents, renderMatchPage as renderBoxingMatch, renderListing as renderBoxingListing } from './boxing-scraper.mjs';

function loadManifest() {
  if (!existsSync(MANIFEST_PATH)) return {};
  try {
    return JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'));
  } catch { return {}; }
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
      const events = extractEvents(data).map(e => normalizeEvent(e)).filter(Boolean);
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
  const normalized = sportCfg.scrape ? event : (() => {
    const leagueForSummary = sportCfg.leagues[0];
    let summaryData = null;
    // summary fetch happens in parallel later if needed
    return event;
  })();

  if (!normalized) {
    console.log(`[${sportKey}/${eventId}] Could not normalize event, skipping`);
    return;
  }

  const shortName = normalized.shortName || normalized.name;
  const matchSlug = slugify(shortName);
  const pageDir = join(SITE_DIR, sportCfg.dir, eventId, matchSlug);
  ensureDir(pageDir);

  const html = sportCfg.scrape
    ? renderBoxingMatch(normalized)
    : renderMatchPage(normalized, sportCfg);
  writeFileSync(join(pageDir, 'index.html'), html);
  console.log(`[${sportKey}/${eventId}] Saved: ${sportCfg.dir}/${eventId}/${matchSlug}/index.html`);
}

function getSportLabel(key) {
  const labels = {
    soccer: 'Soccer', nba: 'NBA', nfl: 'NFL', nhl: 'NHL',
    mlb: 'MLB', mma: 'MMA', f1: 'Formula 1', boxing: 'Boxing'
  };
  return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
}

async function main() {
  console.log(`=== StreamEast Updater ===`);
  console.log(`Date: ${DATE_STR}`);
  console.log(`Site dir: ${SITE_DIR}`);
  console.log();

  const manifest = loadManifest();
  if (!manifest.events) manifest.events = {};
  if (!manifest.lastUpdate) manifest.lastUpdate = {};

  const allSportEvents = {};

  for (const [sportKey, sportCfg] of Object.entries(config)) {
    const events = await processSport(sportKey, sportCfg);
    allSportEvents[sportKey] = events;
    const dir = join(SITE_DIR, sportCfg.dir);
    ensureDir(dir);

    for (const event of events) {
      const eventId = String(event.id);
      const eventKey = `${sportKey}/${eventId}`;

      if (!manifest.events[eventKey]) {
        manifest.events[eventKey] = {
          sport: sportKey,
          id: eventId,
          firstSeen: new Date().toISOString()
        };
      }

      const alreadyExists = existsSync(join(SITE_DIR, sportCfg.dir, eventId));
      if (!alreadyExists || true) {
        await processMatch(sportKey, sportCfg, event);
      }
    }

    const listingHtml = sportCfg.scrape
      ? renderBoxingListing(events)
      : renderSportListing(sportCfg, events, getSportLabel(sportKey));
    writeFileSync(join(dir, 'index.html'), listingHtml);
    console.log(`[${sportKey}] Listing page updated`);
  }

  const homepageHtml = renderHomepage(allSportEvents);
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
