#!/usr/bin/env node
import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer, request as httpRequest } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const HOST = process.env.BIT3UN_FRONTEND_HOST || "127.0.0.1";
const PORT = Number(process.env.BIT3UN_FRONTEND_PORT || process.env.PORT || 3004);
const ROOT = resolve(process.env.BIT3UN_FRONTEND_ROOT || process.cwd());
const DEBUG_HOST = process.env.BIT3UN_DEBUG_HOST || "127.0.0.1";
const DEBUG_PORT = Number(process.env.BIT3UN_DEBUG_PORT || 3337);

const mime = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".webmanifest", "application/manifest+json; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
  [".woff2", "font/woff2"]
]);

function hostEntry(hostHeader = "") {
  const host = hostHeader.toLowerCase().split(":")[0];
  if (host.startsWith("admin-panel.")) return "/public/admin-panel-redesign.html";
  if (host.startsWith("blog.")) return "/public/blog.html";
  return "/public/bit3un-exchange-pro.html";
}

function safePath(pathname) {
  const decoded = decodeURIComponent(pathname.split("?")[0] || "/");
  const clean = normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  const absolute = resolve(join(ROOT, clean));
  return absolute.startsWith(ROOT) ? absolute : null;
}

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, {
    "content-type": type,
    "cache-control": status === 200 ? "public, max-age=60" : "no-store"
  });
  res.end(body);
}

function proxyDebugApi(req, res, pathname) {
  const targetPath = pathname.replace(/^\/debug-api/, "/api") + (new URL(req.url || "/", "http://local").search || "");
  const proxyReq = httpRequest({
    host: DEBUG_HOST,
    port: DEBUG_PORT,
    path: targetPath,
    method: req.method,
    headers: { ...req.headers, host: `${DEBUG_HOST}:${DEBUG_PORT}` }
  }, (proxyRes) => {
    res.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
    proxyRes.pipe(res);
  });
  proxyReq.on("error", (error) => send(res, 502, JSON.stringify({ error: "debug_proxy_failed", message: error.message }), "application/json; charset=utf-8"));
  req.pipe(proxyReq);
}

async function serveFile(req, res, absolutePath) {
  try {
    const fileStat = await stat(absolutePath);
    if (!fileStat.isFile()) return false;
    res.writeHead(200, {
      "content-type": mime.get(extname(absolutePath)) || "application/octet-stream",
      "content-length": fileStat.size,
      "cache-control": extname(absolutePath) === ".html" ? "no-store" : "public, max-age=86400"
    });
    createReadStream(absolutePath).pipe(res);
    return true;
  } catch {
    return false;
  }
}

const server = createServer(async (req, res) => {
  try {
    if (req.url === "/healthz" || req.url === "/health") {
      return send(res, 200, JSON.stringify({ status: "ok", host: req.headers.host || "", entry: hostEntry(req.headers.host) }), "application/json; charset=utf-8");
    }

    const pathname = new URL(req.url || "/", "http://local").pathname;
    if (pathname.startsWith("/debug-api/")) return proxyDebugApi(req, res, pathname);

    let target = pathname === "/" ? hostEntry(req.headers.host) : pathname;

    if (!target.startsWith("/public/")) {
      target = hostEntry(req.headers.host);
    }

    const filePath = safePath(target);
    if (filePath && existsSync(filePath) && await serveFile(req, res, filePath)) return;
    if (target.startsWith("/public/assets/")) return send(res, 404, "Asset not found");

    const fallback = safePath(hostEntry(req.headers.host));
    if (fallback && await serveFile(req, res, fallback)) return;
    return send(res, 404, "Not found");
  } catch (error) {
    return send(res, 500, `Frontend router error: ${error.message}`);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Bit3un frontend router serving ${ROOT} on http://${HOST}:${PORT}`);
});
