import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const SITE_DIR = join(import.meta.dirname, '..', 'site');
const LIVE_DOMAIN = 'https://streamseast.ws';

function fixRelativePaths(html, pageDepth) {
  let result = html;
  const depth = pageDepth;

  function absToRel(url) {
    if (!url || url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) {
      if (url && !url.includes(LIVE_DOMAIN) && !url.includes('cdn.') && !url.includes('espncdn') && !url.includes('fonts.') && !url.includes('google') && !url.includes('histats') && !url.includes('cloudflareinsights')) {
        return url;
      }
      if (url && url.includes(LIVE_DOMAIN)) {
        const pathPart = url.replace(LIVE_DOMAIN, '').replace(/\/\//g, '/');
        if (depth === 0) return pathPart;
        return '../'.repeat(depth).slice(0, -1) + pathPart;
      }
      return url;
    }
    if (url.startsWith('//')) {
      return url;
    }
    return url;
  }

  result = result.replace(/(href|src|action)=["']([^"']*)["']/gi, (match, attr, url) => {
    const fixed = absToRel(url);
    return `${attr}="${fixed}"`;
  });

  result = result.replace(/content=["']([^"']*)["']/gi, (match, url) => {
    const fixed = absToRel(url);
    return `content="${fixed}"`;
  });

  return result;
}

export { fixRelativePaths };
