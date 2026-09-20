#!/usr/bin/env node
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const PORT = Number(process.env.BIT3UN_DEBUG_PORT || process.env.PORT || 3337);
const HOST = process.env.BIT3UN_DEBUG_HOST || "127.0.0.1";

const secretNames = [
  "KAVENEGAR_API_KEY",
  "KAVENEGAR_SENDER",
  "NOBITEX_API_KEY",
  "NOBITEX_TOKEN",
  "NOBITEX_TOMAN_PRICE_API",
  "MYSQL_HOST",
  "MYSQL_PORT",
  "MYSQL_DATABASE",
  "MYSQL_USER",
  "DB_HOST",
  "DB_NAME",
  "DB_USER",
  "WALLET_CONFIG_PATH",
  "WALLET_ADDRESSES_JSON"
];

const fallbackMarkets = [
  { symbol: "BTC", pair: "BTC/IRT", price: 3485670000, change24h: 2.35 },
  { symbol: "ETH", pair: "ETH/IRT", price: 204567000, change24h: 1.42 },
  { symbol: "USDT", pair: "USDT/IRT", price: 65320, change24h: -0.08 },
  { symbol: "BNB", pair: "BNB/IRT", price: 43650000, change24h: 1.88 },
  { symbol: "SOL", pair: "SOL/IRT", price: 8432000, change24h: 3.21 },
  { symbol: "XRP", pair: "XRP/IRT", price: 31240, change24h: -1.1 }
];

const fallbackWallets = [
  { asset: "USDT", network: "TRC20", address: "TQ8wQ3V6sH8p5n7r4j1k2b9m5c6d7e8f9g", state: "active" },
  { asset: "USDT", network: "BEP20", address: "0x4c8b0000000000000000000000000000a91e93c2", state: "active" },
  { asset: "BTC", network: "Bitcoin", address: "bc1qbit3un5afeaddressmasked0000000000", state: "active" },
  { asset: "ETH", network: "ERC20", address: "0x8e310000000000000000000000000000b17d2a4a", state: "active" }
];

let lastOrderbookBody = null;
let lastOrderbookAt = null;

function json(res, status, body) {
  const payload = JSON.stringify(body, null, 2);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "access-control-allow-origin": process.env.BIT3UN_CORS_ORIGIN || "https://bit3un.ir"
  });
  res.end(payload);
}

function configuredSecrets() {
  return Object.fromEntries(secretNames.map((name) => [name, Boolean(process.env[name])]));
}

async function commandStatus(command, args) {
  try {
    const { stdout, stderr } = await execFileAsync(command, args, { timeout: 2500, maxBuffer: 1024 * 64 });
    return { ok: true, output: `${stdout}${stderr}`.trim().slice(0, 1200) };
  } catch (error) {
    return { ok: false, output: `${error.message || error}`.slice(0, 1200) };
  }
}

async function loadWalletAddresses() {
  if (process.env.WALLET_ADDRESSES_JSON) {
    try {
      const parsed = JSON.parse(process.env.WALLET_ADDRESSES_JSON);
      if (Array.isArray(parsed)) return parsed;
      if (Array.isArray(parsed.addresses)) return parsed.addresses;
    } catch {
      return fallbackWallets;
    }
  }

  const filePath = process.env.WALLET_CONFIG_PATH;
  if (filePath && existsSync(filePath)) {
    try {
      const parsed = JSON.parse(await readFile(filePath, "utf8"));
      if (Array.isArray(parsed)) return parsed;
      if (Array.isArray(parsed.addresses)) return parsed.addresses;
    } catch {
      return fallbackWallets;
    }
  }

  return fallbackWallets;
}

async function health() {
  const [nginx, pm2] = await Promise.all([
    commandStatus("nginx", ["-t"]),
    commandStatus("pm2", ["jlist"])
  ]);

  return {
    status: "ok",
    timestamp: new Date().toISOString(),
    nginx: nginx.ok ? "syntax-ok" : "check-failed",
    pm2: pm2.ok ? "available" : "unavailable",
    externalApis: "masked",
    database: "read-only-no-probe",
    secrets: configuredSecrets()
  };
}

async function markets() {
  const body = await fetchNobitexOrderbooks();
  if (body) {
    const parsedMarkets = normalizeNobitexMarkets(body);
    if (parsedMarkets.length) return { source: lastOrderbookAt ? "nobitex" : "fallback", updatedAt: lastOrderbookAt || new Date().toISOString(), markets: parsedMarkets };
  }

  return { source: "fallback", warning: "nobitex-unavailable", updatedAt: new Date().toISOString(), markets: fallbackMarkets };
}

async function fetchNobitexOrderbooks() {
  const nobitexUrl = process.env.NOBITEX_TOMAN_PRICE_API || "https://apiv2.nobitex.ir/v3/orderbook/all";

  try {
    const response = await fetch(nobitexUrl, {
      headers: process.env.NOBITEX_API_KEY ? { Authorization: `Token ${process.env.NOBITEX_API_KEY}` } : {},
      signal: AbortSignal.timeout(Number(process.env.NOBITEX_TIMEOUT_MS || 12000))
    });
    if (!response.ok) throw new Error(`Nobitex HTTP ${response.status}`);
    lastOrderbookBody = await response.json();
    lastOrderbookAt = new Date().toISOString();
    return lastOrderbookBody;
  } catch (error) {
    return lastOrderbookBody;
  }
}

function normalizeNobitexMarkets(body) {
  const symbols = ["BTC", "ETH", "USDT", "BNB", "SOL", "XRP"];
  const divisor = Number(process.env.NOBITEX_PRICE_DIVISOR || 10);
  return symbols.map((symbol) => {
    const market = body?.[`${symbol}IRT`] || body?.[`${symbol}RLS`] || body?.markets?.[`${symbol}IRT`] || body?.markets?.[`${symbol}RLS`];
    if (!market) return null;
    const bestAsk = Number(market.asks?.[0]?.[0]);
    const bestBid = Number(market.bids?.[0]?.[0]);
    const lastTrade = Number(market.lastTradePrice);
    const price = lastTrade || (bestAsk && bestBid ? Math.round((bestAsk + bestBid) / 2) : bestAsk || bestBid);
    if (!Number.isFinite(price) || price <= 0) return null;
    const tomanPrice = divisor > 0 ? price / divisor : price;
    const tomanAsk = Number.isFinite(bestAsk) && divisor > 0 ? bestAsk / divisor : bestAsk;
    const tomanBid = Number.isFinite(bestBid) && divisor > 0 ? bestBid / divisor : bestBid;
    return {
      symbol,
      pair: `${symbol}/IRT`,
      price: Math.round(tomanPrice),
      bestAsk: Number.isFinite(tomanAsk) ? Math.round(tomanAsk) : null,
      bestBid: Number.isFinite(tomanBid) ? Math.round(tomanBid) : null,
      spread: Number.isFinite(tomanAsk) && Number.isFinite(tomanBid) ? Math.max(0, Math.round(tomanAsk - tomanBid)) : null,
      change24h: Number.isFinite(Number(market.dayChange)) ? Number(market.dayChange) : null,
      lastUpdate: market.lastUpdate || body.lastUpdate || null
    };
  }).filter(Boolean);
}

function normalizeBookRows(rows = [], divisor = 10) {
  return rows.slice(0, 20).map(([price, amount]) => ({
    price: Math.round(Number(price) / divisor),
    amount: Number(amount),
    total: Math.round((Number(price) / divisor) * Number(amount))
  })).filter((row) => Number.isFinite(row.price) && Number.isFinite(row.amount));
}

function fallbackBook(symbol) {
  const cleanSymbol = String(symbol || "BTC").toUpperCase();
  const base = fallbackMarkets.find((item) => item.symbol === cleanSymbol)?.price || fallbackMarkets[0].price;
  const asks = Array.from({ length: 20 }, (_, index) => {
    const amount = Number((0.01 + index * 0.013).toFixed(6));
    const price = Math.round(base * (1 + (index + 1) * 0.0008));
    return { price, amount, total: Math.round(price * amount) };
  });
  const bids = Array.from({ length: 20 }, (_, index) => {
    const amount = Number((0.012 + index * 0.011).toFixed(6));
    const price = Math.round(base * (1 - (index + 1) * 0.0008));
    return { price, amount, total: Math.round(price * amount) };
  });
  return { source: "fallback", symbol: `${cleanSymbol}IRT`, asks, bids, lastTradePrice: base, updatedAt: new Date().toISOString() };
}

async function orderbook(symbol = "BTC") {
  const body = await fetchNobitexOrderbooks();
  const marketSymbol = `${String(symbol || "BTC").toUpperCase()}IRT`;
  const market = body?.[marketSymbol] || body?.markets?.[marketSymbol];
  if (!market) return fallbackBook(symbol);
  const divisor = Number(process.env.NOBITEX_PRICE_DIVISOR || 10);
  return {
    source: lastOrderbookAt ? "nobitex" : "fallback",
    symbol: marketSymbol,
    lastTradePrice: market.lastTradePrice ? Math.round(Number(market.lastTradePrice) / divisor) : null,
    updatedAt: new Date(Number(market.lastUpdate || Date.now())).toISOString(),
    asks: normalizeBookRows(market.asks, divisor),
    bids: normalizeBookRows(market.bids, divisor)
  };
}

async function chart(symbol = "BTC", resolution = "15") {
  const book = await orderbook(symbol);
  const center = book.lastTradePrice || book.asks[0]?.price || book.bids[0]?.price || fallbackMarkets.find((item) => item.symbol === symbol)?.price || fallbackMarkets[0].price;
  const spread = Math.max(1, Math.round(Math.abs((book.asks[0]?.price || center) - (book.bids[0]?.price || center))));
  const minutesByResolution = {
    "1": 1,
    "5": 5,
    "15": 15,
    "60": 60,
    "240": 240,
    "1D": 1440
  };
  const minutes = minutesByResolution[String(resolution)] || 15;
  const now = Math.floor(Date.now() / 1000);
  const candles = Array.from({ length: 48 }, (_, index) => {
    const wave = Math.sin((index + 1) / 4) * spread * (minutes >= 240 ? 8 : 3);
    const drift = (index - 47) * spread * (minutes >= 240 ? .7 : .2);
    const close = Math.round(center + wave + drift);
    const open = Math.round(close - Math.cos(index / 3) * spread * 2);
    return {
      time: now - (47 - index) * minutes * 60,
      open,
      high: Math.max(open, close) + spread,
      low: Math.max(1, Math.min(open, close) - spread),
      close,
      volume: Number((20 + index * 1.7).toFixed(2))
    };
  });
  return { source: book.source, symbol: book.symbol, updatedAt: book.updatedAt, candles };
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    if (req.method === "OPTIONS") return json(res, 204, {});
    if (url.pathname === "/api/debug/health") return json(res, 200, await health());
    if (url.pathname === "/api/markets") return json(res, 200, await markets());
    if (url.pathname === "/api/orderbook") return json(res, 200, await orderbook(url.searchParams.get("symbol") || "BTC"));
    if (url.pathname === "/api/chart") return json(res, 200, await chart(url.searchParams.get("symbol") || "BTC", url.searchParams.get("resolution") || "15"));
    if (url.pathname === "/api/wallet-addresses") return json(res, 200, { source: "server", addresses: await loadWalletAddresses() });
    if (url.pathname === "/api/debug/secrets") return json(res, 200, { secrets: configuredSecrets(), values: "masked" });
    return json(res, 404, { error: "not_found" });
  } catch (error) {
    return json(res, 500, { error: "agent_error", message: error.message });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Bit3un automated debugger agent listening on http://${HOST}:${PORT}`);
});
