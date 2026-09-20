export const dynamic = "force-dynamic";

let cache: { at: number; data: unknown } | null = null;

export async function GET() {
  const now = Date.now();
  if (cache && now - cache.at < 30_000) return Response.json(cache.data);
  try {
    const r = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1",
      { signal: AbortSignal.timeout(8000), cache: "no-store" }
    );
    if (!r.ok) throw new Error(String(r.status));
    const data = await r.json();
    cache = { at: now, data };
    return Response.json(data);
  } catch {
    if (cache) return Response.json(cache.data);
    return Response.json([], { status: 502 });
  }
}
