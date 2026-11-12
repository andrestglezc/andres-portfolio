// Visitor counter. GET reads the count, POST adds one (the page posts once per
// browser session). The number lives in a Redis database reached over its REST
// API (Upstash, or Vercel KV which uses the same protocol). Until the two
// environment variables below are set, this returns `count: null` and the page
// simply hides the counter. Nothing about the visitor is stored: no IP, no cookie.

export const dynamic = 'force-dynamic';

const KEY = 'nos:visits';

function store() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ''), token } : null;
}

async function command(path: string): Promise<number | null> {
  const s = store();
  if (!s) return null;
  try {
    const res = await fetch(`${s.url}/${path}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${s.token}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) return null;
    const n = Number(((await res.json()) as { result?: unknown }).result);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

const reply = (count: number | null) => Response.json({ count }, { headers: { 'Cache-Control': 'no-store' } });

export async function GET() {
  return reply(await command(`get/${KEY}`));
}

export async function POST(request: Request) {
  // Only this site's own pages may add to the count; other sites cannot inflate it from a visitor's browser.
  const site = request.headers.get('sec-fetch-site');
  if (site && site !== 'same-origin') return new Response(null, { status: 403 });
  return reply(await command(`incr/${KEY}`));
}
