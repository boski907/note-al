const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const dns = require("dns").promises;
const net = require("net");
const { URL } = require("url");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx <= 0) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile(path.join(__dirname, ".env"));

const NODE_ENV = process.env.NODE_ENV || "development";
const IS_PROD = NODE_ENV === "production" || Boolean(process.env.RENDER_SERVICE_ID || process.env.RENDER);

// On Render (and most PaaS), you must listen on 0.0.0.0, not 127.0.0.1.
const HOST = process.env.HOST || (IS_PROD ? "0.0.0.0" : "127.0.0.1");
const PORT = Number(process.env.PORT || 3000);

// Security / abuse limits (keep these fairly generous; tune down once you have real traffic patterns).
const DEFAULT_MAX_BODY_BYTES = Number(process.env.MAX_BODY_BYTES || 24_000_000); // 24MB
const TRANSCRIBE_MAX_BODY_BYTES = Number(process.env.TRANSCRIBE_MAX_BODY_BYTES || 20_000_000); // 20MB (base64 JSON)
const STRIPE_WEBHOOK_MAX_BODY_BYTES = Number(process.env.STRIPE_WEBHOOK_MAX_BODY_BYTES || 2_000_000); // 2MB

const RATE_LIMIT_ENABLED = (process.env.RATE_LIMIT_ENABLED || (IS_PROD ? "1" : "0")) !== "0";
const RATE_LIMIT_SHARED = (process.env.RATE_LIMIT_SHARED || (IS_PROD ? "1" : "0")) !== "0";
const RL_AUTH_WINDOW_MS = Number(process.env.RL_AUTH_WINDOW_MS || 10 * 60 * 1000); // 10 min
const RL_AUTH_LOGIN_MAX = Number(process.env.RL_AUTH_LOGIN_MAX || 20);
const RL_AUTH_REGISTER_MAX = Number(process.env.RL_AUTH_REGISTER_MAX || 10);

const RL_AI_WINDOW_MS = Number(process.env.RL_AI_WINDOW_MS || 60 * 1000); // 1 min
const RL_AI_MAX_PER_IP = Number(process.env.RL_AI_MAX_PER_IP || 30);
const RL_AI_MAX_PER_USER = Number(process.env.RL_AI_MAX_PER_USER || 60);
const SECURITY_MONITORING_ENABLED = (process.env.SECURITY_MONITORING_ENABLED || "1") !== "0";
const SECURITY_EVENT_RETENTION_DAYS = Math.max(1, Number(process.env.SECURITY_EVENT_RETENTION_DAYS || 14));
const SECURITY_ALERT_RETENTION_DAYS = Math.max(1, Number(process.env.SECURITY_ALERT_RETENTION_DAYS || 30));
const SECURITY_EVENT_MAX_ITEMS = Math.max(100, Number(process.env.SECURITY_EVENT_MAX_ITEMS || 20000));
const SECURITY_ALERT_MAX_ITEMS = Math.max(50, Number(process.env.SECURITY_ALERT_MAX_ITEMS || 5000));
const SECURITY_ALERT_COOLDOWN_MS = Math.max(60_000, Number(process.env.SECURITY_ALERT_COOLDOWN_MS || 15 * 60 * 1000));
const SECURITY_ALERT_WEBHOOK_URL = String(process.env.SECURITY_ALERT_WEBHOOK_URL || "").trim();
const SECURITY_ALERT_WEBHOOK_TIMEOUT_MS = Math.max(
  1000,
  Number(process.env.SECURITY_ALERT_WEBHOOK_TIMEOUT_MS || 5000)
);
const SECURITY_ALERT_WEBHOOK_FORMAT = String(process.env.SECURITY_ALERT_WEBHOOK_FORMAT || "auto")
  .trim()
  .toLowerCase();
const SECURITY_ALERT_WEBHOOK_BEARER_TOKEN = String(process.env.SECURITY_ALERT_WEBHOOK_BEARER_TOKEN || "").trim();
const SECURITY_ALERT_CONSOLE_ENABLED = (process.env.SECURITY_ALERT_CONSOLE_ENABLED || "1") !== "0";

// Per-user quota limits (separate from burst rate limiting). Designed to cap cost exposure.
// These apply primarily to AI / import endpoints that can incur variable costs.
const USAGE_LIMITS_ENABLED = (process.env.USAGE_LIMITS_ENABLED || (IS_PROD ? "1" : "0")) !== "0";
const FREE_DAILY_AI_OUTPUT_LIMIT = Number(process.env.FREE_DAILY_AI_OUTPUT_LIMIT || 60);
const PREMIUM_DAILY_AI_OUTPUT_LIMIT = Number(process.env.PREMIUM_DAILY_AI_OUTPUT_LIMIT || 500);
const FREE_DAILY_FLASHCARD_GEN_LIMIT = Number(process.env.FREE_DAILY_FLASHCARD_GEN_LIMIT || 20);
const PREMIUM_DAILY_FLASHCARD_GEN_LIMIT = Number(process.env.PREMIUM_DAILY_FLASHCARD_GEN_LIMIT || 200);
const FREE_DAILY_SOURCE_IMPORT_LIMIT = Number(process.env.FREE_DAILY_SOURCE_IMPORT_LIMIT || 20);
const PREMIUM_DAILY_SOURCE_IMPORT_LIMIT = Number(process.env.PREMIUM_DAILY_SOURCE_IMPORT_LIMIT || 200);
const FREE_DAILY_TRANSCRIBE_LIMIT = Number(process.env.FREE_DAILY_TRANSCRIBE_LIMIT || 10);
const PREMIUM_DAILY_TRANSCRIBE_LIMIT = Number(process.env.PREMIUM_DAILY_TRANSCRIBE_LIMIT || 200);

function safeJsonParse(txt) {
  if (!txt) return null;
  try {
    return JSON.parse(txt);
  } catch {
    return { _raw: String(txt) };
  }
}
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const OPENAI_VISION_MODEL = process.env.OPENAI_VISION_MODEL || OPENAI_MODEL;
const OPENAI_BUILDER_MODEL = process.env.OPENAI_BUILDER_MODEL || OPENAI_MODEL;
const OPENAI_TRANSCRIBE_MODEL = process.env.OPENAI_TRANSCRIBE_MODEL || "gpt-4o-mini-transcribe";

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const USE_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const ADSENSE_CLIENT = process.env.ADSENSE_CLIENT || "";
const ADSENSE_SLOT_BOTTOM = process.env.ADSENSE_SLOT_BOTTOM || "";
const ADSENSE_SLOT_BREAK = process.env.ADSENSE_SLOT_BREAK || "";
const ADS_ENABLED = (process.env.ADS_ENABLED || "0") === "1";
const CSRF_ORIGIN_CHECK_ENABLED = (process.env.CSRF_ORIGIN_CHECK_ENABLED || (IS_PROD ? "1" : "0")) !== "0";
const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "notematica_auth";
const AUTH_COOKIE_MAX_AGE_SEC = Math.max(60, Number(process.env.AUTH_COOKIE_MAX_AGE_SEC || 60 * 60 * 24 * 30)); // 30d
const AUTH_COOKIE_SAMESITE = String(process.env.AUTH_COOKIE_SAMESITE || "Lax");

// Owner-only features (like the in-app Builder chatbox). Comma-separated emails.
const OWNER_EMAILS = (process.env.OWNER_EMAILS || "lboski@live.com")
  .split(",")
  .map((x) => String(x || "").trim().toLowerCase())
  .filter(Boolean);
// Temporary private mode: only owner accounts can access authenticated app features.
const OWNER_ONLY_MODE = (process.env.OWNER_ONLY_MODE || "1") !== "0";

const APP_BASE_URL = process.env.APP_BASE_URL || `http://${HOST}:${PORT}`;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const STRIPE_PRICE_ID_PREMIUM_10 =
  process.env.STRIPE_PRICE_ID_PREMIUM_10 || process.env.STRIPE_PRICE_ID_ADFREE_599 || "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";
const PROFILE_NAME_MAX_CHARS = Math.max(20, Number(process.env.PROFILE_NAME_MAX_CHARS || 80));
const PROFILE_BIO_MAX_CHARS = Math.max(80, Number(process.env.PROFILE_BIO_MAX_CHARS || 280));
const PROFILE_AVATAR_MAX_CHARS = Math.max(60000, Number(process.env.PROFILE_AVATAR_MAX_CHARS || 200000));

const PUBLIC_DIR = path.join(__dirname, "public");
const DATA_DIR = path.join(__dirname, "data");
const NOTES_FILE = path.join(DATA_DIR, "notes.json");
const FLASHCARDS_FILE = path.join(DATA_DIR, "flashcards.json");
const ANALYTICS_FILE = path.join(DATA_DIR, "analytics.json");
const ONBOARDING_FILE = path.join(DATA_DIR, "onboarding_emails.json");
const SHARES_FILE = path.join(DATA_DIR, "shares.json");
const REFERRALS_FILE = path.join(DATA_DIR, "referrals.json");
const FEEDBACK_FILE = path.join(DATA_DIR, "feedback.json");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json");
const ACCOUNT_PROFILES_FILE = path.join(DATA_DIR, "account_profiles.json");
const USAGE_COUNTERS_FILE = path.join(DATA_DIR, "usage_counters.json");
const SECURITY_EVENTS_FILE = path.join(DATA_DIR, "security_events.json");
const SECURITY_ALERTS_FILE = path.join(DATA_DIR, "security_alerts.json");

function ensureJsonFile(filePath, initialValue) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(initialValue, null, 2), "utf8");
  }
}

function loadJson(filePath, initialValue) {
  ensureJsonFile(filePath, initialValue);
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return initialValue;
  }
}

function saveJson(filePath, data) {
  ensureJsonFile(filePath, []);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function httpError(statusCode, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

function getClientIp(req) {
  // Only trust X-Forwarded-For in production where we expect a proxy/load balancer.
  const xff = String(req.headers["x-forwarded-for"] || "");
  if (IS_PROD && xff) {
    const first = xff.split(",")[0].trim();
    if (first) return first;
  }
  return String(req.socket?.remoteAddress || "");
}

function contentSecurityPolicyValue() {
  const directives = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'self'",
    "script-src 'self' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://js.stripe.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://pagead2.googlesyndication.com https://www.google-analytics.com https://region1.google-analytics.com https://js.stripe.com",
    "frame-src 'self' https://checkout.stripe.com https://js.stripe.com https://hooks.stripe.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://pagead2.googlesyndication.com",
    "media-src 'self' data: blob:",
    "worker-src 'self' blob:",
    "form-action 'self' https://checkout.stripe.com"
  ];
  if (IS_PROD) directives.push("upgrade-insecure-requests");
  return directives.join("; ");
}

function securityHeaders() {
  const headers = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Content-Security-Policy": contentSecurityPolicyValue(),
    // Keep this permissive enough for your voice feature.
    "Permissions-Policy": "camera=(), geolocation=(), microphone=(self), payment=(), usb=()"
  };

  // Safe to set for your public domain in production; browsers ignore it on plain HTTP.
  if (IS_PROD) headers["Strict-Transport-Security"] = "max-age=15552000; includeSubDomains"; // 180d
  return headers;
}

function getCorsAllowedOrigin(origin) {
  const o = String(origin || "").trim();
  if (!o) return "";

  const allow = new Set(
    String(process.env.CORS_ALLOW_ORIGINS || "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean)
  );

  // Known safe origins for native wrappers + your site.
  [
    "capacitor://localhost",
    "ionic://localhost",
    "http://localhost",
    "https://localhost",
    "https://notematica.com",
    "https://www.notematica.com"
  ].forEach((x) => allow.add(x));

  return allow.has(o) ? o : "";
}

function isStateChangingMethod(method) {
  const m = String(method || "").toUpperCase();
  return m === "POST" || m === "PUT" || m === "PATCH" || m === "DELETE";
}

function normalizeOriginFromUrl(raw) {
  const v = String(raw || "").trim();
  if (!v) return "";
  try {
    return new URL(v).origin.toLowerCase();
  } catch {
    return "";
  }
}

function requestHostOrigins(req) {
  const host = String(req?.headers?.host || "").trim().toLowerCase();
  if (!host) return new Set();
  return new Set([`https://${host}`, `http://${host}`]);
}

function isTrustedRequestOrigin(req, origin) {
  const o = String(origin || "").trim().toLowerCase();
  if (!o) return false;
  if (getCorsAllowedOrigin(o)) return true;
  if (requestHostOrigins(req).has(o)) return true;

  const appOrigin = normalizeOriginFromUrl(APP_BASE_URL);
  if (appOrigin && o === appOrigin) return true;
  return false;
}

function validateCsrfOrigin(req) {
  const method = String(req?.method || "").toUpperCase();
  const route = safeRequestPath(req);
  if (!isStateChangingMethod(method) || !route.startsWith("/api/")) {
    return { ok: true, reason: "not_state_changing" };
  }

  const origin = normalizeOriginFromUrl(req?.headers?.origin || "");
  const refererOrigin = normalizeOriginFromUrl(req?.headers?.referer || "");
  const candidate = origin || refererOrigin;
  if (!candidate) {
    // Non-browser clients may omit these. Keep local/dev usable while enforcing in production.
    return { ok: !IS_PROD, reason: "missing_origin_or_referer" };
  }

  if (!isTrustedRequestOrigin(req, candidate)) {
    return { ok: false, reason: "untrusted_origin", origin: candidate };
  }
  return { ok: true, reason: "trusted_origin", origin: candidate };
}

function applyCors(req, res) {
  const origin = req.headers.origin || "";
  const allowed = getCorsAllowedOrigin(origin);
  if (!allowed) return;
  res.setHeader("Access-Control-Allow-Origin", allowed);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
}

function json(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store",
    ...securityHeaders()
  });
  res.end(body);
}

function sendFile(req, res, filePath) {
  const method = String(req?.method || "GET").toUpperCase();
  if (method !== "GET" && method !== "HEAD") {
    res.writeHead(405, {
      Allow: "GET, HEAD",
      ...securityHeaders()
    });
    res.end("Method not allowed");
    return;
  }

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, securityHeaders());
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (statErr, stat) => {
    if (statErr || !stat?.isFile()) {
      res.writeHead(404, securityHeaders());
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType =
      ext === ".html"
        ? "text/html; charset=utf-8"
        : ext === ".css"
          ? "text/css; charset=utf-8"
          : ext === ".js"
            ? "application/javascript; charset=utf-8"
            : ext === ".svg"
              ? "image/svg+xml"
              : ext === ".png"
                ? "image/png"
                : ext === ".jpg" || ext === ".jpeg"
                  ? "image/jpeg"
                  : ext === ".webp"
                    ? "image/webp"
                    : ext === ".ico"
                      ? "image/x-icon"
                      : ext === ".mp4"
                        ? "video/mp4"
                        : ext === ".json"
                          ? "application/json; charset=utf-8"
                          : ext === ".txt"
                            ? "text/plain; charset=utf-8"
                            : "application/octet-stream";

    const baseHeaders = {
      "Content-Type": contentType,
      "Cache-Control": IS_PROD ? "public, max-age=300" : "no-store",
      ...securityHeaders()
    };

    // Safari and most browsers rely on byte-range requests for MP4 playback.
    if (contentType === "video/mp4") {
      baseHeaders["Accept-Ranges"] = "bytes";
    }

    if (filePath === path.join(PUBLIC_DIR, "index.html")) {
      fs.readFile(filePath, (readErr, data) => {
        if (readErr) {
          res.writeHead(404, securityHeaders());
          res.end("Not found");
          return;
        }
        const html = data.toString("utf8").replaceAll("__ADSENSE_CLIENT__", ADSENSE_CLIENT || "");
        res.writeHead(200, {
          "Content-Type": contentType,
          "Cache-Control": "no-store",
          ...securityHeaders()
        });
        if (req.method === "HEAD") {
          res.end();
          return;
        }
        res.end(html);
      });
      return;
    }

    const total = stat.size;
    const range = String(req.headers.range || "").trim();
    if (range && range.startsWith("bytes=")) {
      const m = /bytes=(\d*)-(\d*)/.exec(range);
      if (!m) {
        res.writeHead(416, {
          "Content-Range": `bytes */${total}`,
          ...baseHeaders
        });
        res.end();
        return;
      }
      const start = m[1] === "" ? 0 : Number.parseInt(m[1], 10);
      const end = m[2] === "" ? total - 1 : Number.parseInt(m[2], 10);
      if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end < start || start >= total) {
        res.writeHead(416, {
          "Content-Range": `bytes */${total}`,
          ...baseHeaders
        });
        res.end();
        return;
      }
      const cappedEnd = Math.min(end, total - 1);
      const chunkSize = cappedEnd - start + 1;
      res.writeHead(206, {
        ...baseHeaders,
        "Content-Range": `bytes ${start}-${cappedEnd}/${total}`,
        "Content-Length": chunkSize
      });
      if (req.method === "HEAD") {
        res.end();
        return;
      }
      const stream = fs.createReadStream(filePath, { start, end: cappedEnd });
      stream.on("error", () => {
        if (!res.headersSent) {
          res.writeHead(500, securityHeaders());
          res.end("Failed to read file");
        } else {
          res.destroy();
        }
      });
      stream.pipe(res);
      return;
    }

    res.writeHead(200, {
      ...baseHeaders,
      "Content-Length": total
    });
    if (req.method === "HEAD") {
      res.end();
      return;
    }
    const stream = fs.createReadStream(filePath);
    stream.on("error", () => {
      if (!res.headersSent) {
        res.writeHead(500, securityHeaders());
        res.end("Failed to read file");
      } else {
        res.destroy();
      }
    });
    stream.pipe(res);
  });
}

function readBody(req, opts = {}) {
  const maxBytes = Number(opts.maxBytes || DEFAULT_MAX_BODY_BYTES);
  return new Promise((resolve, reject) => {
    const chunks = [];
    let bytes = 0;
    let aborted = false;
    req.on("data", (chunk) => {
      if (aborted) return;
      const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      bytes += buf.length;
      if (bytes > maxBytes) {
        aborted = true;
        // Stop reading ASAP to avoid buffering attacker payloads.
        try {
          req.destroy();
        } catch {
          // ignore
        }
        reject(httpError(413, "Payload too large"));
        return;
      }
      chunks.push(buf);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function parseJsonBody(raw) {
  try {
    return JSON.parse(raw || "{}");
  } catch {
    throw new Error("Invalid JSON payload");
  }
}

function createToken() {
  return crypto.randomBytes(32).toString("hex");
}

function parseCookieHeader(cookieHeader) {
  const out = {};
  const raw = String(cookieHeader || "");
  if (!raw) return out;
  for (const part of raw.split(";")) {
    const i = part.indexOf("=");
    if (i <= 0) continue;
    const key = part.slice(0, i).trim();
    const value = part.slice(i + 1).trim();
    if (!key) continue;
    try {
      out[key] = decodeURIComponent(value);
    } catch {
      out[key] = value;
    }
  }
  return out;
}

function normalizeSameSite(value) {
  const raw = String(value || "").trim().toLowerCase();
  if (raw === "none") return "None";
  if (raw === "strict") return "Strict";
  return "Lax";
}

function setAuthCookie(res, token, { maxAgeSec = AUTH_COOKIE_MAX_AGE_SEC } = {}) {
  const safeToken = String(token || "").trim();
  if (!safeToken) return;
  const parts = [
    `${AUTH_COOKIE_NAME}=${encodeURIComponent(safeToken)}`,
    "Path=/",
    "HttpOnly",
    `Max-Age=${Math.max(0, Number(maxAgeSec) || AUTH_COOKIE_MAX_AGE_SEC)}`,
    `SameSite=${normalizeSameSite(AUTH_COOKIE_SAMESITE)}`
  ];
  if (IS_PROD) parts.push("Secure");
  res.setHeader("Set-Cookie", parts.join("; "));
}

function canSetAuthCookieForToken(token) {
  const safeToken = String(token || "").trim();
  if (!safeToken) return false;
  // Keep margin under typical per-header limits (4KB-ish across some proxies/clients).
  return safeToken.length <= 3000;
}

function clearAuthCookie(res) {
  const parts = [
    `${AUTH_COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "Max-Age=0",
    "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    `SameSite=${normalizeSameSite(AUTH_COOKIE_SAMESITE)}`
  ];
  if (IS_PROD) parts.push("Secure");
  res.setHeader("Set-Cookie", parts.join("; "));
}

function getAuthToken(req) {
  const header = req.headers.authorization || "";
  if (header.startsWith("Bearer ")) return header.slice(7).trim();
  const cookies = parseCookieHeader(req.headers.cookie || "");
  return String(cookies[AUTH_COOKIE_NAME] || "").trim();
}

const _rateBuckets = new Map();
let _sharedRateLimitWarned = false;
let _sharedRateLimitUnavailable = false;

async function rateLimitConsumeShared(key, limit, windowMs) {
  if (!RATE_LIMIT_SHARED || !USE_SUPABASE || !SUPABASE_SERVICE_ROLE_KEY || _sharedRateLimitUnavailable) return null;
  try {
    const rows = await supabaseAdminRestRequest("/rest/v1/rpc/consume_security_rate_limit", "POST", {
      p_key: String(key || "").slice(0, 220),
      p_limit: Math.max(1, Math.floor(Number(limit) || 1)),
      p_window_ms: Math.max(1000, Math.floor(Number(windowMs) || 1000))
    });
    const rec = Array.isArray(rows) ? rows[0] : rows;
    if (!rec || typeof rec !== "object") return null;

    const ok = Boolean(rec.ok);
    const remaining = Math.max(0, Number(rec.remaining) || 0);
    const resetAtMs = parseIsoMs(rec.reset_at);
    return {
      ok,
      remaining,
      resetAt: resetAtMs > 0 ? resetAtMs : Date.now() + Math.max(1000, Number(windowMs) || 1000)
    };
  } catch (e) {
    _sharedRateLimitUnavailable = true;
    if (!_sharedRateLimitWarned) {
      _sharedRateLimitWarned = true;
      try {
        console.warn("Shared rate limiter unavailable; falling back to local memory buckets:", e instanceof Error ? e.message : e);
      } catch {
        // ignore logging errors
      }
    }
    return null;
  }
}

async function rateLimitConsume(key, limit, windowMs) {
  const shared = await rateLimitConsumeShared(key, limit, windowMs);
  if (shared) return shared;

  const now = Date.now();
  const bucket = _rateBuckets.get(key);
  if (!bucket || now >= bucket.resetAt) {
    _rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: Math.max(0, limit - 1), resetAt: now + windowMs };
  }
  bucket.count += 1;
  const remaining = Math.max(0, limit - bucket.count);
  return { ok: bucket.count <= limit, remaining, resetAt: bucket.resetAt };
}

function safeRequestPath(req) {
  try {
    const host = String(req?.headers?.host || "localhost");
    const pathname = new URL(String(req?.url || "/"), `http://${host}`).pathname;
    return String(pathname || "/").slice(0, 180);
  } catch {
    const raw = String(req?.url || "/");
    return String(raw.split("?")[0] || "/").slice(0, 180);
  }
}

function sanitizeSecurityString(value, maxLen = 180) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, Math.max(1, Number(maxLen) || 180));
}

function securityHash(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  return crypto.createHash("sha256").update(raw).digest("hex").slice(0, 20);
}

const SECURITY_SENSITIVE_META_KEY_RE =
  /(pass(word)?|token|authorization|cookie|secret|api[-_]?key|service[-_]?role|session|bearer)/i;

function sanitizeSecurityMeta(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};
  const out = {};
  for (const [rawKey, rawValue] of Object.entries(input).slice(0, 30)) {
    const key = sanitizeSecurityString(rawKey, 80);
    if (!key) continue;
    if (SECURITY_SENSITIVE_META_KEY_RE.test(key)) continue;

    if (typeof rawValue === "string") {
      out[key] = sanitizeSecurityString(rawValue, 240);
      continue;
    }
    if (typeof rawValue === "number" && Number.isFinite(rawValue)) {
      out[key] = rawValue;
      continue;
    }
    if (typeof rawValue === "boolean") {
      out[key] = rawValue;
      continue;
    }
    if (Array.isArray(rawValue)) {
      out[key] = rawValue
        .slice(0, 12)
        .map((v) => sanitizeSecurityString(v, 120))
        .filter(Boolean);
      continue;
    }
    if (rawValue && typeof rawValue === "object") {
      out[key] = "[object]";
    }
  }
  return out;
}

function normalizeSecuritySeverity(level) {
  const safe = String(level || "low").trim().toLowerCase();
  if (safe === "critical" || safe === "high" || safe === "medium" || safe === "low" || safe === "info") return safe;
  return "low";
}

function parseIsoMs(value) {
  const ms = Date.parse(String(value || ""));
  return Number.isFinite(ms) ? ms : 0;
}

function windowLabel(windowMs) {
  const mins = Math.max(1, Math.round(Number(windowMs || 0) / 60000));
  return mins === 1 ? "1 minute" : `${mins} minutes`;
}

function parseRateLimitKey(rawKey) {
  const key = String(rawKey || "");
  if (!key) return { scope: "unknown", identifier: "", bucket: "" };

  if (key.startsWith("ip:")) {
    const body = key.slice(3);
    const parts = body.split(":");
    if (parts.length >= 3) {
      return {
        scope: "ip",
        identifier: parts.slice(0, -2).join(":"),
        bucket: parts.slice(-2).join(":")
      };
    }
    return { scope: "ip", identifier: body, bucket: "" };
  }

  if (key.startsWith("user:")) {
    const body = key.slice(5);
    const i = body.indexOf(":");
    if (i > 0) {
      return {
        scope: "user",
        identifier: body.slice(0, i),
        bucket: body.slice(i + 1)
      };
    }
    return { scope: "user", identifier: body, bucket: "" };
  }

  return { scope: "unknown", identifier: "", bucket: key };
}

const securityState = {
  initialized: false,
  events: [],
  alerts: [],
  lastAlertAtByKey: new Map()
};

const SECURITY_ALERT_RULES = [
  {
    id: "auth-login-failed-ip-spike",
    eventType: "auth.login_failed",
    requireGroup: true,
    threshold: Math.max(2, Number(process.env.SEC_ALERT_LOGIN_FAIL_IP_THRESHOLD || 8)),
    windowMs: Math.max(60_000, Number(process.env.SEC_ALERT_LOGIN_FAIL_IP_WINDOW_MS || 10 * 60 * 1000)),
    cooldownMs: Math.max(60_000, Number(process.env.SEC_ALERT_LOGIN_FAIL_IP_COOLDOWN_MS || SECURITY_ALERT_COOLDOWN_MS)),
    severity: "high",
    title: "Potential brute-force login activity",
    groupBy: (event) => String(event.ipHash || ""),
    describe: (count, windowMs) => `${count} failed login attempts from one IP fingerprint within ${windowLabel(windowMs)}.`
  },
  {
    id: "auth-login-failed-email-spike",
    eventType: "auth.login_failed",
    requireGroup: true,
    threshold: Math.max(2, Number(process.env.SEC_ALERT_LOGIN_FAIL_EMAIL_THRESHOLD || 6)),
    windowMs: Math.max(60_000, Number(process.env.SEC_ALERT_LOGIN_FAIL_EMAIL_WINDOW_MS || 10 * 60 * 1000)),
    cooldownMs: Math.max(60_000, Number(process.env.SEC_ALERT_LOGIN_FAIL_EMAIL_COOLDOWN_MS || SECURITY_ALERT_COOLDOWN_MS)),
    severity: "medium",
    title: "Repeated login failures for one account fingerprint",
    groupBy: (event) => String(event.emailHash || ""),
    describe: (count, windowMs) => `${count} failed login attempts targeting one account fingerprint within ${windowLabel(windowMs)}.`
  },
  {
    id: "auth-unauthorized-ip-spike",
    eventType: "auth.unauthorized",
    requireGroup: true,
    threshold: Math.max(3, Number(process.env.SEC_ALERT_UNAUTHORIZED_IP_THRESHOLD || 20)),
    windowMs: Math.max(60_000, Number(process.env.SEC_ALERT_UNAUTHORIZED_IP_WINDOW_MS || 5 * 60 * 1000)),
    cooldownMs: Math.max(60_000, Number(process.env.SEC_ALERT_UNAUTHORIZED_IP_COOLDOWN_MS || SECURITY_ALERT_COOLDOWN_MS)),
    severity: "medium",
    title: "Unauthorized request burst",
    groupBy: (event) => String(event.ipHash || ""),
    describe: (count, windowMs) =>
      `${count} unauthorized API requests from one IP fingerprint within ${windowLabel(windowMs)}.`
  },
  {
    id: "rate-limit-exceeded-spike",
    eventType: "rate_limit.exceeded",
    requireGroup: true,
    threshold: Math.max(3, Number(process.env.SEC_ALERT_RATE_LIMIT_THRESHOLD || 25)),
    windowMs: Math.max(60_000, Number(process.env.SEC_ALERT_RATE_LIMIT_WINDOW_MS || 5 * 60 * 1000)),
    cooldownMs: Math.max(60_000, Number(process.env.SEC_ALERT_RATE_LIMIT_COOLDOWN_MS || SECURITY_ALERT_COOLDOWN_MS)),
    severity: "medium",
    title: "Rate-limit spike detected",
    groupBy: (event) => String(event.key || event.ipHash || "global"),
    describe: (count, windowMs) => `${count} rate-limit denials observed within ${windowLabel(windowMs)}.`
  },
  {
    id: "sources-import-blocked-url-spike",
    eventType: "sources.import_url_blocked",
    requireGroup: true,
    threshold: Math.max(2, Number(process.env.SEC_ALERT_BLOCKED_IMPORT_THRESHOLD || 3)),
    windowMs: Math.max(60_000, Number(process.env.SEC_ALERT_BLOCKED_IMPORT_WINDOW_MS || 30 * 60 * 1000)),
    cooldownMs: Math.max(60_000, Number(process.env.SEC_ALERT_BLOCKED_IMPORT_COOLDOWN_MS || SECURITY_ALERT_COOLDOWN_MS)),
    severity: "high",
    title: "Blocked source import URL activity",
    groupBy: (event) => String(event.ipHash || ""),
    describe: (count, windowMs) =>
      `${count} blocked URL import attempts from one IP fingerprint within ${windowLabel(windowMs)}.`
  },
  {
    id: "stripe-webhook-invalid-spike",
    eventType: "stripe.webhook_invalid",
    requireGroup: true,
    threshold: Math.max(2, Number(process.env.SEC_ALERT_STRIPE_WEBHOOK_THRESHOLD || 3)),
    windowMs: Math.max(60_000, Number(process.env.SEC_ALERT_STRIPE_WEBHOOK_WINDOW_MS || 30 * 60 * 1000)),
    cooldownMs: Math.max(60_000, Number(process.env.SEC_ALERT_STRIPE_WEBHOOK_COOLDOWN_MS || SECURITY_ALERT_COOLDOWN_MS)),
    severity: "high",
    title: "Invalid Stripe webhook signature burst",
    groupBy: (event) => String(event.ipHash || "global"),
    describe: (count, windowMs) => `${count} invalid Stripe webhook signature events within ${windowLabel(windowMs)}.`
  },
  {
    id: "server-5xx-spike",
    eventType: "server.error_5xx",
    threshold: Math.max(2, Number(process.env.SEC_ALERT_5XX_THRESHOLD || 8)),
    windowMs: Math.max(60_000, Number(process.env.SEC_ALERT_5XX_WINDOW_MS || 5 * 60 * 1000)),
    cooldownMs: Math.max(60_000, Number(process.env.SEC_ALERT_5XX_COOLDOWN_MS || SECURITY_ALERT_COOLDOWN_MS)),
    severity: "high",
    title: "Server 5xx error spike",
    groupBy: () => "global",
    describe: (count, windowMs) => `${count} server 5xx errors detected within ${windowLabel(windowMs)}.`
  }
];

function pruneSecurityState(nowMs = Date.now()) {
  const eventCutoffMs = nowMs - SECURITY_EVENT_RETENTION_DAYS * 24 * 60 * 60 * 1000;
  const alertCutoffMs = nowMs - SECURITY_ALERT_RETENTION_DAYS * 24 * 60 * 60 * 1000;

  securityState.events = securityState.events
    .filter((event) => parseIsoMs(event?.createdAt) >= eventCutoffMs)
    .slice(-SECURITY_EVENT_MAX_ITEMS);
  securityState.alerts = securityState.alerts
    .filter((alert) => parseIsoMs(alert?.createdAt) >= alertCutoffMs)
    .slice(-SECURITY_ALERT_MAX_ITEMS);
}

function initializeSecurityMonitoringState() {
  if (!SECURITY_MONITORING_ENABLED || securityState.initialized) return;

  const loadedEvents = loadJson(SECURITY_EVENTS_FILE, []);
  const loadedAlerts = loadJson(SECURITY_ALERTS_FILE, []);
  securityState.events = Array.isArray(loadedEvents) ? loadedEvents : [];
  securityState.alerts = Array.isArray(loadedAlerts) ? loadedAlerts : [];
  securityState.lastAlertAtByKey = new Map();

  for (const alert of securityState.alerts) {
    const key = sanitizeSecurityString(alert?.key || "", 220);
    if (!key) continue;
    const createdMs = parseIsoMs(alert?.createdAt);
    if (!createdMs) continue;
    const prev = Number(securityState.lastAlertAtByKey.get(key) || 0);
    if (createdMs > prev) securityState.lastAlertAtByKey.set(key, createdMs);
  }

  pruneSecurityState();
  saveJson(SECURITY_EVENTS_FILE, securityState.events);
  saveJson(SECURITY_ALERTS_FILE, securityState.alerts);
  securityState.initialized = true;
}

async function sendSecurityAlertWebhook(alert) {
  if (!SECURITY_ALERT_WEBHOOK_URL) return;

  function resolveSecurityAlertWebhookFormat(url) {
    const explicit = ["auto", "json", "slack", "discord"].includes(SECURITY_ALERT_WEBHOOK_FORMAT)
      ? SECURITY_ALERT_WEBHOOK_FORMAT
      : "auto";
    if (explicit !== "auto") return explicit;

    const raw = String(url || "").toLowerCase();
    if (raw.includes("hooks.slack.com")) return "slack";
    if (raw.includes("discord.com/api/webhooks") || raw.includes("discordapp.com/api/webhooks")) return "discord";
    return "json";
  }

  function securityAlertSummaryText(payload) {
    const sev = String(payload?.severity || "low").toUpperCase();
    const title = String(payload?.title || "Security alert");
    const count = Number(payload?.count || 0);
    const threshold = Number(payload?.threshold || 0);
    const windowMins = Math.max(1, Math.round(Number(payload?.windowMs || 0) / 60000));
    const when = String(payload?.createdAt || "");
    return `[${sev}] ${title} | count=${count} threshold=${threshold} window=${windowMins}m | at=${when}`;
  }

  function buildSecurityAlertWebhookPayload(payload) {
    const format = resolveSecurityAlertWebhookFormat(SECURITY_ALERT_WEBHOOK_URL);
    const summary = securityAlertSummaryText(payload);
    if (format === "slack") {
      return {
        format,
        body: {
          text: `${summary}\n${String(payload?.message || "").slice(0, 600)}`
        }
      };
    }
    if (format === "discord") {
      return {
        format,
        body: {
          content: `${summary}\n${String(payload?.message || "").slice(0, 600)}`
        }
      };
    }
    return {
      format: "json",
      body: {
        app: "notematica",
        generatedAt: new Date().toISOString(),
        summary,
        alert: payload
      }
    };
  }

  const built = buildSecurityAlertWebhookPayload(alert);
  const headers = { "Content-Type": "application/json" };
  if (SECURITY_ALERT_WEBHOOK_BEARER_TOKEN) {
    headers.Authorization = `Bearer ${SECURITY_ALERT_WEBHOOK_BEARER_TOKEN}`;
  }

  const ac = new AbortController();
  const timeout = setTimeout(() => ac.abort(), SECURITY_ALERT_WEBHOOK_TIMEOUT_MS);
  try {
    const response = await fetch(SECURITY_ALERT_WEBHOOK_URL, {
      method: "POST",
      signal: ac.signal,
      headers,
      body: JSON.stringify(built.body)
    });
    if (!response.ok) {
      console.warn("Security alert webhook failed:", response.status, `format=${built.format}`);
    }
  } catch (e) {
    console.warn("Security alert webhook error:", e instanceof Error ? e.message : e);
  } finally {
    clearTimeout(timeout);
  }
}

function notifySecurityAlert(alert) {
  if (SECURITY_ALERT_CONSOLE_ENABLED) {
    console.warn(
      "[SECURITY ALERT]",
      `[${String(alert.severity || "low").toUpperCase()}]`,
      alert.title,
      `count=${alert.count}`,
      `windowMs=${alert.windowMs}`,
      `group=${alert.group || "n/a"}`
    );
  }
  if (SECURITY_ALERT_WEBHOOK_URL) {
    void sendSecurityAlertWebhook(alert);
  }
}

function maybeRaiseSecurityAlerts(event) {
  if (!SECURITY_MONITORING_ENABLED) return [];
  initializeSecurityMonitoringState();

  const nowMs = parseIsoMs(event?.createdAt) || Date.now();
  const created = [];

  for (const rule of SECURITY_ALERT_RULES) {
    if (rule.eventType !== event.type) continue;
    const rawGroup = sanitizeSecurityString(rule.groupBy(event) || "", 120);
    if (rule.requireGroup && !rawGroup) continue;
    const group = rawGroup || "global";

    const sinceMs = nowMs - Number(rule.windowMs || 0);
    const matched = securityState.events.filter((candidate) => {
      if (candidate.type !== rule.eventType) return false;
      if (parseIsoMs(candidate.createdAt) < sinceMs) return false;
      const candidateGroup = sanitizeSecurityString(rule.groupBy(candidate) || "global", 120) || "global";
      return candidateGroup === group;
    });

    if (matched.length < Number(rule.threshold || 0)) continue;

    const key = `${rule.id}:${group}`;
    const lastAlertAt = Number(securityState.lastAlertAtByKey.get(key) || 0);
    const cooldownMs = Math.max(60_000, Number(rule.cooldownMs || SECURITY_ALERT_COOLDOWN_MS));
    if (lastAlertAt && nowMs - lastAlertAt < cooldownMs) continue;

    const alert = {
      id: crypto.randomUUID(),
      key,
      ruleId: rule.id,
      eventType: rule.eventType,
      severity: normalizeSecuritySeverity(rule.severity),
      title: sanitizeSecurityString(rule.title, 160) || "Security anomaly detected",
      message: sanitizeSecurityString(rule.describe(matched.length, rule.windowMs), 300),
      group,
      count: matched.length,
      threshold: Number(rule.threshold || 0),
      windowMs: Number(rule.windowMs || 0),
      firstSeenAt: matched[0]?.createdAt || event.createdAt,
      lastSeenAt: matched[matched.length - 1]?.createdAt || event.createdAt,
      sampleEventIds: matched.slice(-5).map((x) => String(x.id || "")).filter(Boolean),
      createdAt: new Date(nowMs).toISOString()
    };
    securityState.alerts.push(alert);
    securityState.lastAlertAtByKey.set(key, nowMs);
    created.push(alert);
  }

  if (created.length) {
    pruneSecurityState(nowMs);
    saveJson(SECURITY_ALERTS_FILE, securityState.alerts);
    for (const alert of created) notifySecurityAlert(alert);
  }
  return created;
}

function logSecurityEvent(eventType, options = {}) {
  if (!SECURITY_MONITORING_ENABLED) return null;
  initializeSecurityMonitoringState();

  const nowIso = new Date().toISOString();
  const event = {
    id: crypto.randomUUID(),
    type: sanitizeSecurityString(eventType || "security.unknown", 80) || "security.unknown",
    severity: normalizeSecuritySeverity(options.severity),
    createdAt: nowIso,
    ipHash: options.ip ? securityHash(String(options.ip)) : "",
    userId: sanitizeSecurityString(options.userId || "", 120),
    emailHash: options.email ? securityHash(String(options.email || "").trim().toLowerCase()) : "",
    route: sanitizeSecurityString(options.route || "", 180),
    method: sanitizeSecurityString(String(options.method || "").toUpperCase(), 12),
    reason: sanitizeSecurityString(options.reason || "", 220),
    status: Number.isFinite(options.status) ? Number(options.status) : 0,
    key: sanitizeSecurityString(options.key || "", 220),
    meta: sanitizeSecurityMeta(options.meta)
  };

  securityState.events.push(event);
  pruneSecurityState(parseIsoMs(nowIso));
  saveJson(SECURITY_EVENTS_FILE, securityState.events);
  maybeRaiseSecurityAlerts(event);
  return event;
}

async function rateLimitOr429(res, key, limit, windowMs, context = {}) {
  if (!RATE_LIMIT_ENABLED) return true;
  const out = await rateLimitConsume(key, limit, windowMs);
  if (out.ok) return true;

  const parsedKey = parseRateLimitKey(key);
  logSecurityEvent("rate_limit.exceeded", {
    severity: "medium",
    ip: String(context.ip || (parsedKey.scope === "ip" ? parsedKey.identifier : "")),
    userId: String(context.userId || (parsedKey.scope === "user" ? parsedKey.identifier : "")),
    route: String(context.route || ""),
    method: String(context.method || ""),
    reason: sanitizeSecurityString(parsedKey.bucket || "rate_limit", 120),
    key: sanitizeSecurityString(key, 220),
    meta: {
      limit: Number(limit) || 0,
      windowMs: Number(windowMs) || 0,
      remaining: Number(out.remaining) || 0
    }
  });

  json(res, 429, { error: "Too many requests. Please slow down." });
  return false;
}

function utcDateOnly(d = new Date()) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function utcMonthStartDateOnly(d = new Date()) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}-01`;
}

function nextUtcDayResetIso(d = new Date()) {
  const next = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1, 0, 0, 0, 0));
  return next.toISOString();
}

function usageLimitsForTier({ adFree }) {
  const premium = Boolean(adFree);
  return {
    ai_output: premium ? PREMIUM_DAILY_AI_OUTPUT_LIMIT : FREE_DAILY_AI_OUTPUT_LIMIT,
    flashcard_gen: premium ? PREMIUM_DAILY_FLASHCARD_GEN_LIMIT : FREE_DAILY_FLASHCARD_GEN_LIMIT,
    source_import: premium ? PREMIUM_DAILY_SOURCE_IMPORT_LIMIT : FREE_DAILY_SOURCE_IMPORT_LIMIT,
    transcribe: premium ? PREMIUM_DAILY_TRANSCRIBE_LIMIT : FREE_DAILY_TRANSCRIBE_LIMIT
  };
}

const entitlementCache = new Map(); // userId -> { expiresAt, value }

async function getCachedEntitlements(user) {
  const key = String(user?.id || "");
  if (!key) return { adFree: false };
  const cached = entitlementCache.get(key);
  const now = Date.now();
  if (cached && cached.expiresAt > now) return cached.value;

  // Owners always get full premium entitlements regardless of Stripe state.
  if (isOwnerUser(user)) {
    const ownerValue = { adFree: true, isOwner: true };
    entitlementCache.set(key, { expiresAt: now + 60_000, value: ownerValue });
    return ownerValue;
  }

  // Avoid calling Stripe for every request. Use the last known billing profile state.
  let adFree = false;
  if (USE_SUPABASE) {
    try {
      const profile = await getBillingProfile(user);
      adFree = Boolean(profile?.stripe_subscription_id) && isSubActive(String(profile?.subscription_status || ""));
    } catch {
      // Keep false if billing lookup fails.
    }
  }

  const value = { adFree, isOwner: false };
  entitlementCache.set(key, { expiresAt: now + 60_000, value }); // 60s TTL
  return value;
}

function loadUsageCountersLocal() {
  return loadJson(USAGE_COUNTERS_FILE, {});
}

function saveUsageCountersLocal(obj) {
  saveJson(USAGE_COUNTERS_FILE, obj || {});
}

async function tryConsumeUsage(user, { scope, period = "day", inc = 1, limit = 0 } = {}) {
  const safeScope = String(scope || "").trim().slice(0, 80);
  if (!safeScope) throw new Error("Missing usage scope");
  const safePeriod = period === "month" ? "month" : "day";
  const periodStart = safePeriod === "month" ? utcMonthStartDateOnly() : utcDateOnly();
  const safeInc = Math.max(1, Math.floor(Number(inc) || 1));
  const safeLimit = Math.max(0, Math.floor(Number(limit) || 0));

  if (!USE_SUPABASE) {
    const db = loadUsageCountersLocal();
    const key = `${user.id}:${safeScope}:${safePeriod}:${periodStart}`;
    const cur = Number(db[key] || 0);
    if (cur + safeInc > safeLimit) return { ok: false, used: cur, periodStart, resetAt: nextUtcDayResetIso() };
    db[key] = cur + safeInc;
    saveUsageCountersLocal(db);
    return { ok: true, used: Number(db[key] || 0), periodStart, resetAt: nextUtcDayResetIso() };
  }

  const rows = await supabaseRestRequest(
    "/rest/v1/rpc/try_consume_usage",
    "POST",
    { scope: safeScope, period: safePeriod, period_start: periodStart, inc: safeInc, quota_limit: safeLimit },
    user.token
  );
  const rec = Array.isArray(rows) ? rows[0] : rows;
  return {
    ok: Boolean(rec?.ok),
    used: Number(rec?.used || 0),
    periodStart,
    resetAt: nextUtcDayResetIso()
  };
}

async function enforceUsageOr429(res, user, { scope, inc, limit, period = "day", message = "" } = {}) {
  if (isOwnerUser(user)) return true;
  if (!USAGE_LIMITS_ENABLED) return true;
  if (!user?.id) return true;
  const safeLimit = Number(limit);
  if (!Number.isFinite(safeLimit) || safeLimit < 0) return true;

  let out;
  try {
    out = await tryConsumeUsage(user, { scope, inc, limit: safeLimit, period });
  } catch (e) {
    // Fail open if the quota function/table hasn't been deployed yet.
    try {
      console.warn("Usage limit check failed (allowing request):", e instanceof Error ? e.message : e);
    } catch {
      // ignore logging errors
    }
    return true;
  }
  if (out.ok) return true;

  const remaining = Math.max(0, safeLimit - Number(out.used || 0));
  res.setHeader("X-Usage-Scope", String(scope || ""));
  res.setHeader("X-Usage-Limit", String(safeLimit));
  res.setHeader("X-Usage-Used", String(out.used || 0));
  res.setHeader("X-Usage-Remaining", String(remaining));
  res.setHeader("X-Usage-Reset", String(out.resetAt || ""));
  json(res, 429, {
    error: message || "Daily limit reached. Try again tomorrow or upgrade.",
    scope: String(scope || ""),
    limit: safeLimit,
    used: Number(out.used || 0),
    remaining,
    resetsAt: out.resetAt || null
  });
  return false;
}

function sanitizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function sanitizeDisplayName(value, maxChars = PROFILE_NAME_MAX_CHARS) {
  return String(value || "")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, Math.max(20, Number(maxChars) || PROFILE_NAME_MAX_CHARS));
}

function sanitizeProfileBio(value, maxChars = PROFILE_BIO_MAX_CHARS) {
  return String(value || "")
    .replace(/\r/g, "")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .trim()
    .slice(0, Math.max(80, Number(maxChars) || PROFILE_BIO_MAX_CHARS));
}

function sanitizeAvatarDataUrl(value, { maxChars = PROFILE_AVATAR_MAX_CHARS, throwOnInvalid = false } = {}) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const compact = raw.replace(/\s+/g, "");
  if (compact.length > Math.max(60000, Number(maxChars) || PROFILE_AVATAR_MAX_CHARS)) {
    if (throwOnInvalid) throw new Error("Profile image is too large");
    return "";
  }
  const out = sanitizePreviewImageDataUrl(compact, { maxChars });
  if (!out && throwOnInvalid) throw new Error("Profile image must be PNG, JPG, JPEG, or WEBP");
  return out;
}

function isOwnerUser(user) {
  const email = sanitizeEmail(user?.email || "");
  if (!email) return false;
  return OWNER_EMAILS.includes(email);
}

function isOwnerEmail(email) {
  return OWNER_EMAILS.includes(sanitizeEmail(email || ""));
}

function looksLikeEmail(value) {
  const v = sanitizeEmail(value);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function sanitizeTags(tags) {
  if (!Array.isArray(tags)) return [];
  const cleaned = tags
    .map((t) => String(t || "").trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 20);
  return [...new Set(cleaned)];
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, passwordHash) {
  const [salt, expectedHash] = String(passwordHash || "").split(":");
  if (!salt || !expectedHash) return false;
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(expectedHash, "hex");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

async function supabaseAuthRequest(endpoint, method = "GET", body = null, accessToken = "") {
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: accessToken ? `Bearer ${accessToken}` : `Bearer ${SUPABASE_ANON_KEY}`
  };

  if (body !== null) headers["Content-Type"] = "application/json";

  const response = await fetch(`${SUPABASE_URL}${endpoint}`, {
    method,
    headers,
    body: body !== null ? JSON.stringify(body) : undefined
  });

  const txt = await response.text();
  const payload = safeJsonParse(txt) || {};
  if (!response.ok) {
    const detail =
      payload?.msg ||
      payload?.error_description ||
      payload?.error ||
      payload?._raw ||
      `Supabase auth error ${response.status}`;
    throw new Error(String(detail).slice(0, 800));
  }
  return payload;
}

async function supabaseRestRequest(endpoint, method = "GET", body = null, accessToken = "", prefer = "") {
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${accessToken}`
  };

  if (body !== null) headers["Content-Type"] = "application/json";
  if (prefer) headers.Prefer = prefer;

  const response = await fetch(`${SUPABASE_URL}${endpoint}`, {
    method,
    headers,
    body: body !== null ? JSON.stringify(body) : undefined
  });

  const txt = await response.text();
  const payload = safeJsonParse(txt);
  if (!response.ok) {
    const detail = payload?.message || payload?.hint || payload?._raw || `Supabase REST error ${response.status}`;
    throw new Error(String(detail).slice(0, 800));
  }
  return payload;
}

async function supabaseAdminRestRequest(endpoint, method = "GET", body = null, prefer = "") {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY for admin operation");
  }
  const headers = {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
  };
  if (body !== null) headers["Content-Type"] = "application/json";
  if (prefer) headers.Prefer = prefer;

  const response = await fetch(`${SUPABASE_URL}${endpoint}`, {
    method,
    headers,
    body: body !== null ? JSON.stringify(body) : undefined
  });

  const txt = await response.text();
  const payload = safeJsonParse(txt);
  if (!response.ok) {
    const detail =
      payload?.message || payload?.hint || payload?._raw || `Supabase admin REST error ${response.status}`;
    throw new Error(String(detail).slice(0, 800));
  }
  return payload;
}

async function supabaseAdminAuthRequest(endpoint, method = "GET", body = null) {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY for admin auth operation");
  }
  const headers = {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
  };
  if (body !== null) headers["Content-Type"] = "application/json";

  const response = await fetch(`${SUPABASE_URL}${endpoint}`, {
    method,
    headers,
    body: body !== null ? JSON.stringify(body) : undefined
  });

  const txt = await response.text();
  const payload = safeJsonParse(txt);
  if (!response.ok) {
    const detail = payload?.message || payload?.error_description || payload?.error || payload?._raw || `Supabase admin auth error ${response.status}`;
    throw new Error(String(detail).slice(0, 800));
  }
  return payload;
}

async function requireUser(req, res) {
  const token = getAuthToken(req);
  const authHeader = String(req.headers.authorization || "");
  const cookies = parseCookieHeader(req.headers.cookie || "");
  const hasBearer = authHeader.startsWith("Bearer ");
  const hasAuthCookie = String(cookies[AUTH_COOKIE_NAME] || "").trim().length > 0;
  const usingCookieSession = hasAuthCookie && !hasBearer;
  const ip = getClientIp(req);
  const route = safeRequestPath(req);
  const method = String(req.method || "").toUpperCase();

  const enforceCsrfOr403 = (userId = "", email = "") => {
    if (!CSRF_ORIGIN_CHECK_ENABLED || !usingCookieSession) return true;
    const check = validateCsrfOrigin(req);
    if (check.ok) return true;

    logSecurityEvent("auth.csrf_blocked", {
      severity: "high",
      ip,
      userId,
      email,
      route,
      method,
      reason: check.reason || "csrf_origin_validation_failed",
      status: 403,
      meta: {
        origin: normalizeOriginFromUrl(req.headers.origin || ""),
        refererOrigin: normalizeOriginFromUrl(req.headers.referer || "")
      }
    });
    json(res, 403, { error: "Forbidden" });
    return false;
  };

  if (!token) {
    logSecurityEvent("auth.unauthorized", {
      severity: "medium",
      ip,
      route,
      method,
      reason: "missing_auth_token",
      status: 401,
      meta: { hasBearer, hasAuthCookie }
    });
    clearAuthCookie(res);
    json(res, 401, { error: "Unauthorized" });
    return null;
  }

  if (USE_SUPABASE) {
    try {
      const user = await supabaseAuthRequest("/auth/v1/user", "GET", null, token);
      if (OWNER_ONLY_MODE && !isOwnerUser(user)) {
        logSecurityEvent("auth.owner_only_blocked", {
          severity: "medium",
          ip,
          userId: user.id,
          email: user.email,
          route,
          method,
          reason: "owner_only_mode_active",
          status: 403
        });
        clearAuthCookie(res);
        json(res, 403, { error: "This app is currently private." });
        return null;
      }
      if (!enforceCsrfOr403(user.id, user.email)) return null;
      if (hasBearer && !hasAuthCookie && canSetAuthCookieForToken(token)) setAuthCookie(res, token);
      return { id: user.id, email: user.email, token, metadata: user?.user_metadata || {} };
    } catch {
      logSecurityEvent("auth.unauthorized", {
        severity: "medium",
        ip,
        route,
        method,
        reason: "supabase_session_invalid",
        status: 401,
        meta: { hasBearer, hasAuthCookie }
      });
      clearAuthCookie(res);
      json(res, 401, { error: "Unauthorized" });
      return null;
    }
  }

  const sessions = loadJson(SESSIONS_FILE, []);
  const session = sessions.find((s) => s.token === token);
  if (!session) {
    logSecurityEvent("auth.unauthorized", {
      severity: "medium",
      ip,
      route,
      method,
      reason: "local_session_not_found",
      status: 401,
      meta: { hasBearer, hasAuthCookie }
    });
    clearAuthCookie(res);
    json(res, 401, { error: "Unauthorized" });
    return null;
  }

  const users = loadJson(USERS_FILE, []);
  const user = users.find((u) => u.id === session.userId);
  if (!user) {
    logSecurityEvent("auth.unauthorized", {
      severity: "medium",
      ip,
      route,
      method,
      reason: "local_user_not_found",
      status: 401,
      meta: { hasBearer, hasAuthCookie }
    });
    clearAuthCookie(res);
    json(res, 401, { error: "Unauthorized" });
    return null;
  }

  if (OWNER_ONLY_MODE && !isOwnerUser(user)) {
    logSecurityEvent("auth.owner_only_blocked", {
      severity: "medium",
      ip,
      userId: user.id,
      email: user.email,
      route,
      method,
      reason: "owner_only_mode_active",
      status: 403
    });
    clearAuthCookie(res);
    json(res, 403, { error: "This app is currently private." });
    return null;
  }

  session.lastSeenAt = new Date().toISOString();
  saveJson(SESSIONS_FILE, sessions);
  if (!enforceCsrfOr403(user.id, user.email)) return null;
  if (hasBearer && !hasAuthCookie && canSetAuthCookieForToken(token)) setAuthCookie(res, token);
  return {
    id: user.id,
    email: user.email,
    token,
    metadata: {
      display_name: sanitizeDisplayName(user.displayName || ""),
      bio: sanitizeProfileBio(user.bio || ""),
      avatar_data_url: sanitizeAvatarDataUrl(user.avatarDataUrl || "")
    }
  };
}

async function requireOwnerUser(req, res) {
  const user = await requireUser(req, res);
  if (!user) return null;
  if (isOwnerUser(user)) return user;

  logSecurityEvent("auth.owner_forbidden", {
    severity: "medium",
    ip: getClientIp(req),
    userId: user.id,
    route: safeRequestPath(req),
    method: String(req.method || "").toUpperCase(),
    reason: "owner_only_endpoint",
    status: 403
  });
  json(res, 403, { error: "Forbidden" });
  return null;
}

function stripeFormBody(obj) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(obj || {})) {
    if (v === undefined || v === null) continue;
    params.set(k, String(v));
  }
  return params.toString();
}

function timingSafeEqualString(a, b) {
  const ab = Buffer.from(String(a || ""), "utf8");
  const bb = Buffer.from(String(b || ""), "utf8");
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

function verifyStripeWebhookSignature(rawBody, signatureHeader, secret) {
  if (!secret) throw new Error("Missing STRIPE_WEBHOOK_SECRET");
  if (!signatureHeader) throw new Error("Missing Stripe-Signature header");

  const parts = String(signatureHeader)
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  let timestamp = "";
  const v1 = [];
  for (const part of parts) {
    const i = part.indexOf("=");
    if (i < 0) continue;
    const k = part.slice(0, i);
    const v = part.slice(i + 1);
    if (k === "t") timestamp = v;
    if (k === "v1") v1.push(v);
  }

  if (!timestamp || !v1.length) throw new Error("Invalid Stripe-Signature header");
  const signedPayload = `${timestamp}.${rawBody}`;
  const expected = crypto.createHmac("sha256", secret).update(signedPayload).digest("hex");
  const ok = v1.some((sig) => timingSafeEqualString(sig, expected));
  if (!ok) throw new Error("Invalid Stripe webhook signature");
}

async function stripeRequest(pathname, method = "POST", formObj = {}) {
  if (!STRIPE_SECRET_KEY) throw new Error("Stripe is not configured (missing STRIPE_SECRET_KEY)");
  const response = await fetch(`https://api.stripe.com/v1${pathname}`, {
    method,
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: method === "GET" ? undefined : stripeFormBody(formObj)
  });

  const txt = await response.text();
  const payload = txt ? JSON.parse(txt) : {};
  if (!response.ok) {
    const msg = payload?.error?.message || `Stripe error ${response.status}`;
    throw new Error(msg);
  }
  return payload;
}

async function getBillingProfile(user) {
  // Stored in Supabase with RLS; user can only read/update their own row.
  if (!USE_SUPABASE) return null;
  const rows = await supabaseRestRequest(
    `/rest/v1/billing_profiles?select=user_id,stripe_customer_id,stripe_subscription_id,subscription_status,current_period_end&user_id=eq.${encodeURIComponent(
      user.id
    )}&limit=1`,
    "GET",
    null,
    user.token
  );
  return rows?.[0] || null;
}

async function upsertBillingProfile(user, fields) {
  if (!USE_SUPABASE) return null;
  const rows = await supabaseRestRequest(
    "/rest/v1/billing_profiles?on_conflict=user_id",
    "POST",
    [
      {
        user_id: user.id,
        stripe_customer_id: fields.stripe_customer_id,
        stripe_subscription_id: fields.stripe_subscription_id,
        subscription_status: fields.subscription_status || "none",
        current_period_end: fields.current_period_end || null
      }
    ],
    user.token,
    "return=representation,resolution=merge-duplicates"
  );
  return rows?.[0] || null;
}

async function getBillingProfileByStripeRefs({ stripeSubscriptionId = "", stripeCustomerId = "" } = {}) {
  if (!USE_SUPABASE) return null;
  if (!stripeSubscriptionId && !stripeCustomerId) return null;

  if (stripeSubscriptionId) {
    const rows = await supabaseAdminRestRequest(
      `/rest/v1/billing_profiles?select=user_id,stripe_customer_id,stripe_subscription_id,subscription_status,current_period_end&stripe_subscription_id=eq.${encodeURIComponent(
        stripeSubscriptionId
      )}&limit=1`,
      "GET"
    );
    if (rows?.[0]) return rows[0];
  }

  if (stripeCustomerId) {
    const rows = await supabaseAdminRestRequest(
      `/rest/v1/billing_profiles?select=user_id,stripe_customer_id,stripe_subscription_id,subscription_status,current_period_end&stripe_customer_id=eq.${encodeURIComponent(
        stripeCustomerId
      )}&limit=1`,
      "GET"
    );
    if (rows?.[0]) return rows[0];
  }

  return null;
}

async function upsertBillingProfileAdmin(userId, fields) {
  if (!USE_SUPABASE) return null;
  if (!userId) return null;
  const rows = await supabaseAdminRestRequest(
    "/rest/v1/billing_profiles?on_conflict=user_id",
    "POST",
    [
      {
        user_id: userId,
        stripe_customer_id: fields.stripe_customer_id || null,
        stripe_subscription_id: fields.stripe_subscription_id || null,
        subscription_status: fields.subscription_status || "none",
        current_period_end: fields.current_period_end || null
      }
    ],
    "return=representation,resolution=merge-duplicates"
  );
  return rows?.[0] || null;
}

function isSubActive(status) {
  return status === "active" || status === "trialing";
}

async function getStripeUserIdFromCustomer(customerId) {
  if (!customerId) return "";
  try {
    const customer = await stripeRequest(`/customers/${customerId}`, "GET");
    return String(customer?.metadata?.user_id || "");
  } catch {
    return "";
  }
}

async function syncStripeSubscriptionRecord(sub, userIdHint = "") {
  const customerId =
    typeof sub?.customer === "string" ? sub.customer : String(sub?.customer?.id || "");
  const subscriptionId = String(sub?.id || "");
  const status = String(sub?.status || "unknown");
  const currentPeriodEnd = sub?.current_period_end
    ? new Date(Number(sub.current_period_end) * 1000).toISOString()
    : null;

  let userId =
    userIdHint ||
    String(sub?.metadata?.user_id || "") ||
    String(sub?.items?.data?.[0]?.metadata?.user_id || "");

  if (!userId) {
    const existing = await getBillingProfileByStripeRefs({
      stripeSubscriptionId: subscriptionId,
      stripeCustomerId: customerId
    });
    userId = String(existing?.user_id || "");
  }

  if (!userId && customerId) {
    userId = await getStripeUserIdFromCustomer(customerId);
  }

  if (!userId) return;

  await upsertBillingProfileAdmin(userId, {
    stripe_customer_id: customerId || null,
    stripe_subscription_id: subscriptionId || null,
    subscription_status: status,
    current_period_end: currentPeriodEnd
  });
}

async function handleStripeWebhookEvent(event) {
  const type = String(event?.type || "");
  const obj = event?.data?.object || {};

  if (type === "checkout.session.completed") {
    if (obj?.mode !== "subscription") return;
    const userId =
      String(obj?.metadata?.user_id || "") ||
      String(obj?.client_reference_id || "") ||
      (await getStripeUserIdFromCustomer(String(obj?.customer || "")));

    const subscriptionId = String(obj?.subscription || "");
    if (subscriptionId) {
      const sub = await stripeRequest(`/subscriptions/${subscriptionId}`, "GET");
      await syncStripeSubscriptionRecord(sub, userId);
      return;
    }

    if (userId) {
      await upsertBillingProfileAdmin(userId, {
        stripe_customer_id: String(obj?.customer || "") || null,
        stripe_subscription_id: null,
        subscription_status: String(obj?.payment_status || "incomplete"),
        current_period_end: null
      });
    }
    return;
  }

  if (
    type === "customer.subscription.created" ||
    type === "customer.subscription.updated" ||
    type === "customer.subscription.deleted"
  ) {
    await syncStripeSubscriptionRecord(obj);
    return;
  }
}

async function computeAdFreeStatus(user) {
  if (isOwnerUser(user)) {
    return { adFree: true, status: "owner", currentPeriodEnd: null };
  }
  const profile = await getBillingProfile(user);
  if (!profile?.stripe_subscription_id) {
    return { adFree: false, status: profile?.subscription_status || "none", currentPeriodEnd: profile?.current_period_end || null };
  }

  const sub = await stripeRequest(`/subscriptions/${profile.stripe_subscription_id}`, "GET");
  const status = String(sub.status || "unknown");
  const currentPeriodEnd = sub.current_period_end ? new Date(Number(sub.current_period_end) * 1000).toISOString() : null;

  // Best-effort sync back to Supabase so the client doesn't need to hit Stripe next time.
  try {
    await upsertBillingProfile(user, {
      stripe_customer_id: profile.stripe_customer_id,
      stripe_subscription_id: profile.stripe_subscription_id,
      subscription_status: status,
      current_period_end: currentPeriodEnd
    });
  } catch {
    // Ignore sync issues.
  }

  return { adFree: isSubActive(status), status, currentPeriodEnd };
}

async function listNotes(user) {
  if (USE_SUPABASE) {
    const rows = await supabaseRestRequest(
      "/rest/v1/notes?select=id,title,content_text,content_html,tags,updated_at&order=updated_at.desc",
      "GET",
      null,
      user.token
    );
    return (rows || []).map((r) => {
      const safeHtml = sanitizeRichTextHtml(r.content_html || "", { maxChars: 300000 });
      const safeText = cleanImportedText(String(r.content_text || "") || htmlToText(safeHtml)).slice(0, 300000);
      return {
        id: r.id,
        title: r.title || "Untitled",
        contentText: safeText,
        contentHtml: safeHtml,
        tags: Array.isArray(r.tags) ? r.tags : [],
        updatedAt: r.updated_at || new Date().toISOString()
      };
    });
  }

  const notes = loadJson(NOTES_FILE, []);
  return notes
    .filter((n) => n.userId === user.id)
    .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))
    .map((n) => {
      const safeHtml = sanitizeRichTextHtml(n.contentHtml || "", { maxChars: 300000 });
      const safeText = cleanImportedText(String(n.contentText || "") || htmlToText(safeHtml)).slice(0, 300000);
      return {
        id: n.id,
        title: String(n.title || "Untitled").slice(0, 160),
        contentText: safeText,
        contentHtml: safeHtml,
        tags: sanitizeTags(n.tags),
        updatedAt: n.updatedAt || new Date().toISOString()
      };
    });
}

async function trackEvent(user, eventName, payload = {}) {
  const safeName = String(eventName || "").trim().slice(0, 80);
  if (!safeName) return;

  const row = {
    id: crypto.randomUUID(),
    userId: user.id,
    eventName: safeName,
    payload: payload && typeof payload === "object" ? payload : {},
    createdAt: new Date().toISOString()
  };

  if (USE_SUPABASE) {
    await supabaseRestRequest(
      "/rest/v1/analytics_events",
      "POST",
      [
        {
          id: row.id,
          user_id: row.userId,
          event_name: row.eventName,
          payload: row.payload,
          created_at: row.createdAt
        }
      ],
      user.token
    );
    return;
  }

  const items = loadJson(ANALYTICS_FILE, []);
  items.push(row);
  saveJson(ANALYTICS_FILE, items.slice(-5000));
}

async function getAnalyticsSummary(user, days = 7) {
  const safeDays = Math.max(1, Math.min(90, Number(days) || 7));
  const since = new Date(Date.now() - safeDays * 24 * 60 * 60 * 1000).toISOString();

  let items = [];
  if (USE_SUPABASE) {
    const rows = await supabaseRestRequest(
      `/rest/v1/analytics_events?select=event_name,created_at&created_at=gte.${encodeURIComponent(
        since
      )}&order=created_at.desc&limit=5000`,
      "GET",
      null,
      user.token
    );
    items = (rows || []).map((r) => ({ eventName: r.event_name || "", createdAt: r.created_at }));
  } else {
    items = loadJson(ANALYTICS_FILE, [])
      .filter((e) => e.userId === user.id && String(e.createdAt || "") >= since)
      .map((e) => ({ eventName: e.eventName, createdAt: e.createdAt }));
  }

  const counts = {};
  for (const e of items) {
    const key = String(e.eventName || "unknown");
    counts[key] = (counts[key] || 0) + 1;
  }

  return {
    days: safeDays,
    total: items.length,
    counts
  };
}

async function getDashboardSummary(user) {
  const summary = await getAnalyticsSummary(user, 14);
  const byDay = {};
  for (let i = 13; i >= 0; i -= 1) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    byDay[d] = 0;
  }

  let events = [];
  if (USE_SUPABASE) {
    const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
    const rows = await supabaseRestRequest(
      `/rest/v1/analytics_events?select=event_name,created_at&created_at=gte.${encodeURIComponent(
        since
      )}&order=created_at.desc&limit=5000`,
      "GET",
      null,
      user.token
    );
    events = (rows || []).map((r) => ({ createdAt: r.created_at }));
  } else {
    events = loadJson(ANALYTICS_FILE, [])
      .filter((e) => e.userId === user.id)
      .map((e) => ({ createdAt: e.createdAt }));
  }

  for (const ev of events) {
    const k = String(ev.createdAt || "").slice(0, 10);
    if (k in byDay) byDay[k] += 1;
  }

  return {
    total: summary.total,
    counts: summary.counts,
    last14Days: Object.entries(byDay).map(([date, count]) => ({ date, count }))
  };
}

function makeReferralCode(userId) {
  return `NTE${String(userId || "").replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase()}${crypto
    .createHash("sha1")
    .update(String(userId || "x"))
    .digest("hex")
    .slice(0, 4)
    .toUpperCase()}`;
}

function upsertReferralUser(user) {
  const rows = loadJson(REFERRALS_FILE, []);
  let row = rows.find((r) => r.userId === user.id);
  if (!row) {
    row = {
      userId: user.id,
      code: makeReferralCode(user.id),
      referredBy: null,
      referrals: 0
    };
    rows.push(row);
    saveJson(REFERRALS_FILE, rows);
  }
  return row;
}

function applyReferral(user, code) {
  const rows = loadJson(REFERRALS_FILE, []);
  let me = rows.find((r) => r.userId === user.id);
  if (!me) {
    me = {
      userId: user.id,
      code: makeReferralCode(user.id),
      referredBy: null,
      referrals: 0
    };
    rows.push(me);
  }
  const normalized = String(code || "").trim().toUpperCase();
  if (!normalized) throw new Error("Code is required");
  if (me.code === normalized) throw new Error("You cannot use your own code");
  const owner = rows.find((r) => r.code === normalized);
  if (!owner) throw new Error("Referral code not found");
  if (me.referredBy) throw new Error("Referral already applied");
  me.referredBy = owner.userId;
  owner.referrals = Number(owner.referrals || 0) + 1;
  saveJson(REFERRALS_FILE, rows);
}

function createShareEntry(user, payload) {
  const items = loadJson(SHARES_FILE, []);
  const id = crypto.randomBytes(8).toString("hex");
  const safeHtml = sanitizeRichTextHtml(payload.contentHtml || "", { maxChars: 300000 });
  const safeText = cleanImportedText(String(payload.contentText || "") || htmlToText(safeHtml)).slice(0, 300000);
  items.push({
    id,
    userId: user.id,
    noteId: String(payload.noteId || ""),
    title: String(payload.title || "Shared note").slice(0, 160),
    contentText: safeText,
    contentHtml: safeHtml,
    createdAt: new Date().toISOString()
  });
  saveJson(SHARES_FILE, items.slice(-2000));
  return id;
}

function getShareEntry(shareId) {
  const items = loadJson(SHARES_FILE, []);
  const entry = items.find((x) => x.id === shareId);
  if (!entry) return null;
  const safeHtml = sanitizeRichTextHtml(entry.contentHtml || "", { maxChars: 300000 });
  const safeText = cleanImportedText(String(entry.contentText || "") || htmlToText(safeHtml)).slice(0, 300000);
  return {
    ...entry,
    contentText: safeText,
    contentHtml: safeHtml
  };
}

function saveFeedback(user, payload) {
  const items = loadJson(FEEDBACK_FILE, []);
  items.push({
    id: crypto.randomUUID(),
    userId: user.id,
    email: user.email || "",
    text: String(payload.text || "").slice(0, 4000),
    page: String(payload.page || "").slice(0, 200),
    createdAt: new Date().toISOString()
  });
  saveJson(FEEDBACK_FILE, items.slice(-5000));
}

async function saveOnboardingEmail(user, email, source = "onboarding_modal") {
  const cleanEmail = sanitizeEmail(email);
  if (!looksLikeEmail(cleanEmail)) {
    throw new Error("Invalid email");
  }

  if (USE_SUPABASE) {
    await trackEvent(user, "onboarding.email_capture", { email: cleanEmail, source: String(source || "onboarding_modal").slice(0, 40) });
    return;
  }

  const items = loadJson(ONBOARDING_FILE, []);
  const existing = items.find((x) => x.userId === user.id);
  const now = new Date().toISOString();
  if (existing) {
    existing.email = cleanEmail;
    existing.source = String(source || "onboarding_modal").slice(0, 40);
    existing.updatedAt = now;
  } else {
    items.push({
      id: crypto.randomUUID(),
      userId: user.id,
      email: cleanEmail,
      source: String(source || "onboarding_modal").slice(0, 40),
      createdAt: now,
      updatedAt: now
    });
  }
  saveJson(ONBOARDING_FILE, items);
}

function accountProfileFromMetadata(metadata = {}) {
  const src = metadata && typeof metadata === "object" ? metadata : {};
  return {
    displayName: sanitizeDisplayName(src.display_name || src.full_name || src.name || ""),
    bio: sanitizeProfileBio(src.bio || ""),
    avatarDataUrl: sanitizeAvatarDataUrl(src.avatar_data_url || "")
  };
}

function loadAccountProfiles() {
  const rows = loadJson(ACCOUNT_PROFILES_FILE, []);
  return Array.isArray(rows) ? rows : [];
}

function saveAccountProfiles(rows) {
  saveJson(ACCOUNT_PROFILES_FILE, Array.isArray(rows) ? rows : []);
}

function getStoredAvatarDataUrl(userId) {
  const uid = String(userId || "").trim();
  if (!uid) return "";
  const rows = loadAccountProfiles();
  const row = rows.find((x) => String(x.userId || "") === uid);
  return sanitizeAvatarDataUrl(row?.avatarDataUrl || "");
}

function upsertStoredAvatarDataUrl(userId, avatarDataUrl) {
  const uid = String(userId || "").trim();
  if (!uid) return;
  const safeAvatar = sanitizeAvatarDataUrl(avatarDataUrl || "");
  const rows = loadAccountProfiles();
  const idx = rows.findIndex((x) => String(x.userId || "") === uid);
  const now = new Date().toISOString();
  if (idx >= 0) {
    rows[idx].avatarDataUrl = safeAvatar;
    rows[idx].updatedAt = now;
  } else {
    rows.push({
      id: crypto.randomUUID(),
      userId: uid,
      avatarDataUrl: safeAvatar,
      createdAt: now,
      updatedAt: now
    });
  }
  saveAccountProfiles(rows);
}

async function getAccountProfile(user) {
  if (USE_SUPABASE) {
    const base = accountProfileFromMetadata(user?.metadata || {});
    const storedAvatar = getStoredAvatarDataUrl(user?.id || "");
    return {
      ...base,
      avatarDataUrl: storedAvatar || base.avatarDataUrl || "",
      updatedAt: null
    };
  }

  const users = loadJson(USERS_FILE, []);
  const row = users.find((u) => String(u.id || "") === String(user?.id || ""));
  return {
    displayName: sanitizeDisplayName(row?.displayName || row?.fullName || ""),
    bio: sanitizeProfileBio(row?.bio || ""),
    avatarDataUrl: sanitizeAvatarDataUrl(row?.avatarDataUrl || ""),
    updatedAt: row?.profileUpdatedAt || null
  };
}

async function upsertAccountProfile(user, payload = {}) {
  const displayName = sanitizeDisplayName(payload.displayName || "");
  const bio = sanitizeProfileBio(payload.bio || "");
  const rawAvatar = String(payload.avatarDataUrl || "").trim();
  const avatarDataUrl = sanitizeAvatarDataUrl(rawAvatar, { throwOnInvalid: Boolean(rawAvatar) });

  if (USE_SUPABASE) {
    const existingMeta = user?.metadata && typeof user.metadata === "object" ? user.metadata : {};
    upsertStoredAvatarDataUrl(user?.id || "", avatarDataUrl);
    await supabaseAuthRequest(
      "/auth/v1/user",
      "PUT",
      {
        data: {
          ...existingMeta,
          display_name: displayName || null,
          bio: bio || null,
          avatar_data_url: null
        }
      },
      user.token
    );
    return {
      displayName,
      bio,
      avatarDataUrl,
      updatedAt: new Date().toISOString()
    };
  }

  const users = loadJson(USERS_FILE, []);
  const idx = users.findIndex((u) => String(u.id || "") === String(user?.id || ""));
  if (idx < 0) throw new Error("User not found");
  users[idx].displayName = displayName;
  users[idx].bio = bio;
  users[idx].avatarDataUrl = avatarDataUrl;
  users[idx].profileUpdatedAt = new Date().toISOString();
  saveJson(USERS_FILE, users);
  return {
    displayName,
    bio,
    avatarDataUrl,
    updatedAt: users[idx].profileUpdatedAt
  };
}

function isSupabaseMissingRelationError(err) {
  const msg = String(err instanceof Error ? err.message : err || "").toLowerCase();
  return msg.includes("relation") && msg.includes("does not exist");
}

async function deleteSupabaseRowsByUser(tableName, userId) {
  const table = String(tableName || "").trim();
  if (!table) return;
  try {
    await supabaseAdminRestRequest(`/rest/v1/${table}?user_id=eq.${encodeURIComponent(userId)}`, "DELETE");
  } catch (err) {
    if (isSupabaseMissingRelationError(err)) return;
    throw err;
  }
}

async function deleteSupabaseUserData(userId) {
  const uid = String(userId || "").trim();
  if (!uid) return;
  const tables = ["notes", "flashcards", "analytics_events", "usage_counters", "billing_profiles"];
  for (const tableName of tables) {
    await deleteSupabaseRowsByUser(tableName, uid);
  }
  const profiles = loadAccountProfiles();
  saveAccountProfiles(profiles.filter((row) => String(row.userId || "") !== uid));
}

function deleteLocalUserData(userId) {
  const uid = String(userId || "").trim();
  if (!uid) return;

  const users = loadJson(USERS_FILE, []);
  saveJson(
    USERS_FILE,
    users.filter((u) => String(u.id || "") !== uid)
  );

  const sessions = loadJson(SESSIONS_FILE, []);
  saveJson(
    SESSIONS_FILE,
    sessions.filter((s) => String(s.userId || "") !== uid)
  );

  const notes = loadJson(NOTES_FILE, []);
  saveJson(
    NOTES_FILE,
    notes.filter((n) => String(n.userId || "") !== uid)
  );

  const cards = loadJson(FLASHCARDS_FILE, []);
  saveJson(
    FLASHCARDS_FILE,
    cards.filter((c) => String(c.userId || "") !== uid)
  );

  const events = loadJson(ANALYTICS_FILE, []);
  saveJson(
    ANALYTICS_FILE,
    events.filter((e) => String(e.userId || "") !== uid)
  );

  const shares = loadJson(SHARES_FILE, []);
  saveJson(
    SHARES_FILE,
    shares.filter((s) => String(s.userId || "") !== uid)
  );

  const feedback = loadJson(FEEDBACK_FILE, []);
  saveJson(
    FEEDBACK_FILE,
    feedback.filter((x) => String(x.userId || "") !== uid)
  );

  const onboarding = loadJson(ONBOARDING_FILE, []);
  saveJson(
    ONBOARDING_FILE,
    onboarding.filter((x) => String(x.userId || "") !== uid)
  );

  const referrals = loadJson(REFERRALS_FILE, []);
  saveJson(
    REFERRALS_FILE,
    referrals
      .filter((row) => String(row.userId || "") !== uid)
      .map((row) => (String(row.referredBy || "") === uid ? { ...row, referredBy: null } : row))
  );

  const counters = loadUsageCountersLocal();
  if (counters && typeof counters === "object") {
    for (const key of Object.keys(counters)) {
      if (key.startsWith(`${uid}:`)) delete counters[key];
    }
    saveUsageCountersLocal(counters);
  }

  const profiles = loadAccountProfiles();
  saveAccountProfiles(profiles.filter((row) => String(row.userId || "") !== uid));
}

async function cancelMembershipImmediatelyForUser(user) {
  if (!USE_SUPABASE) {
    return { hadSubscription: false, canceledNow: false, status: "none", currentPeriodEnd: null };
  }
  const existing = await getBillingProfile(user);
  const subscriptionId = String(existing?.stripe_subscription_id || "").trim();
  if (!subscriptionId) {
    return {
      hadSubscription: false,
      canceledNow: false,
      status: String(existing?.subscription_status || "none"),
      currentPeriodEnd: existing?.current_period_end || null
    };
  }
  if (!STRIPE_SECRET_KEY) throw new Error("Stripe is not configured");

  let status = String(existing?.subscription_status || "unknown");
  let currentPeriodEnd = existing?.current_period_end || null;
  let canceledNow = false;

  try {
    const sub = await stripeRequest(`/subscriptions/${subscriptionId}`, "GET");
    status = String(sub?.status || status);
    currentPeriodEnd = sub?.current_period_end ? new Date(Number(sub.current_period_end) * 1000).toISOString() : null;
    if (!["canceled", "incomplete_expired"].includes(status)) {
      const canceled = await stripeRequest(`/subscriptions/${subscriptionId}`, "DELETE");
      status = String(canceled?.status || "canceled");
      currentPeriodEnd = canceled?.current_period_end ? new Date(Number(canceled.current_period_end) * 1000).toISOString() : null;
      canceledNow = true;
    }
  } catch (err) {
    const msg = String(err instanceof Error ? err.message : err || "");
    if (/no such subscription/i.test(msg)) {
      status = "canceled";
      currentPeriodEnd = null;
      canceledNow = true;
    } else {
      throw err;
    }
  }

  await upsertBillingProfile(user, {
    stripe_customer_id: existing?.stripe_customer_id || null,
    stripe_subscription_id: subscriptionId,
    subscription_status: status,
    current_period_end: currentPeriodEnd
  });
  entitlementCache.delete(String(user.id || ""));
  return {
    hadSubscription: true,
    canceledNow,
    status,
    currentPeriodEnd
  };
}

async function upsertNote(user, payload) {
  const now = new Date().toISOString();
  const safeHtml = sanitizeRichTextHtml(payload.contentHtml || "", { maxChars: 300000 });
  const safeText = cleanImportedText(String(payload.contentText || "") || htmlToText(safeHtml)).slice(0, 300000);
  const note = {
    id: payload.id ? String(payload.id) : crypto.randomUUID(),
    title: String(payload.title || "").trim().slice(0, 160) || "Untitled",
    contentText: safeText,
    contentHtml: safeHtml || plainTextToSafeHtml(safeText, 300000),
    tags: sanitizeTags(payload.tags),
    updatedAt: now
  };

  if (USE_SUPABASE) {
    const rows = await supabaseRestRequest(
      "/rest/v1/notes?on_conflict=id",
      "POST",
      [
        {
          id: note.id,
          user_id: user.id,
          title: note.title,
          content_text: note.contentText,
          content_html: note.contentHtml,
          tags: note.tags,
          updated_at: note.updatedAt
        }
      ],
      user.token,
      "return=representation,resolution=merge-duplicates"
    );

    const row = rows?.[0] || {};
    const returnedHtml = sanitizeRichTextHtml(row.content_html || note.contentHtml, { maxChars: 300000 });
    const returnedText = cleanImportedText(String(row.content_text || note.contentText || "") || htmlToText(returnedHtml)).slice(
      0,
      300000
    );
    return {
      id: row.id || note.id,
      title: row.title || note.title,
      contentText: returnedText,
      contentHtml: returnedHtml,
      tags: Array.isArray(row.tags) ? row.tags : note.tags,
      updatedAt: row.updated_at || note.updatedAt
    };
  }

  const notes = loadJson(NOTES_FILE, []);
  const existingIndex = notes.findIndex((n) => n.id === note.id && n.userId === user.id);
  const stored = { ...note, userId: user.id };
  if (existingIndex >= 0) notes[existingIndex] = stored;
  else notes.push(stored);
  saveJson(NOTES_FILE, notes);
  return note;
}

async function deleteNote(user, noteId) {
  if (USE_SUPABASE) {
    await supabaseRestRequest(
      `/rest/v1/notes?id=eq.${encodeURIComponent(noteId)}`,
      "DELETE",
      null,
      user.token
    );
    return;
  }

  const notes = loadJson(NOTES_FILE, []);
  saveJson(
    NOTES_FILE,
    notes.filter((n) => !(n.id === noteId && n.userId === user.id))
  );
}

async function listFlashcards(user, { dueOnly = false, limit = 50 } = {}) {
  if (USE_SUPABASE) {
    const baseSelect =
      "id,note_id,front,back,tags,ease,interval_days,reps,lapses,due_at,last_reviewed_at,updated_at";
    const filters = [];
    if (dueOnly) filters.push(`due_at=lte.${encodeURIComponent(new Date().toISOString())}`);
    const filterStr = filters.length ? `&${filters.join("&")}` : "";
    const rows = await supabaseRestRequest(
      `/rest/v1/flashcards?select=${baseSelect}${filterStr}&order=due_at.asc&limit=${encodeURIComponent(
        String(limit)
      )}`,
      "GET",
      null,
      user.token
    );
    return (rows || []).map((r) => ({
      id: r.id,
      noteId: r.note_id || null,
      front: r.front || "",
      back: r.back || "",
      tags: Array.isArray(r.tags) ? r.tags : [],
      ease: Number(r.ease || 2.5),
      intervalDays: Number(r.interval_days || 0),
      reps: Number(r.reps || 0),
      lapses: Number(r.lapses || 0),
      dueAt: r.due_at,
      lastReviewedAt: r.last_reviewed_at || null,
      updatedAt: r.updated_at
    }));
  }

  const cards = loadJson(FLASHCARDS_FILE, []);
  const now = Date.now();
  const scoped = cards.filter((c) => c.userId === user.id);
  const filtered = dueOnly ? scoped.filter((c) => new Date(c.dueAt).getTime() <= now) : scoped;
  return filtered.sort((a, b) => String(a.dueAt).localeCompare(String(b.dueAt))).slice(0, limit);
}

async function upsertFlashcard(user, payload) {
  const nowIso = new Date().toISOString();
  const card = {
    id: payload.id ? String(payload.id) : crypto.randomUUID(),
    noteId: payload.noteId ? String(payload.noteId) : null,
    front: String(payload.front || "").trim(),
    back: String(payload.back || "").trim(),
    tags: sanitizeTags(payload.tags),
    ease: Number(payload.ease || 2.5),
    intervalDays: Number(payload.intervalDays || 0),
    reps: Number(payload.reps || 0),
    lapses: Number(payload.lapses || 0),
    dueAt: payload.dueAt ? String(payload.dueAt) : nowIso,
    lastReviewedAt: payload.lastReviewedAt ? String(payload.lastReviewedAt) : null,
    updatedAt: nowIso
  };

  if (!card.front || !card.back) throw new Error("Flashcard requires front and back");

  if (USE_SUPABASE) {
    const rows = await supabaseRestRequest(
      "/rest/v1/flashcards?on_conflict=id",
      "POST",
      [
        {
          id: card.id,
          user_id: user.id,
          note_id: card.noteId,
          front: card.front,
          back: card.back,
          tags: card.tags,
          ease: card.ease,
          interval_days: card.intervalDays,
          reps: card.reps,
          lapses: card.lapses,
          due_at: card.dueAt,
          last_reviewed_at: card.lastReviewedAt
        }
      ],
      user.token,
      "return=representation,resolution=merge-duplicates"
    );
    const r = rows?.[0] || {};
    return {
      id: r.id || card.id,
      noteId: r.note_id || card.noteId,
      front: r.front || card.front,
      back: r.back || card.back,
      tags: Array.isArray(r.tags) ? r.tags : card.tags,
      ease: Number(r.ease || card.ease),
      intervalDays: Number(r.interval_days || card.intervalDays),
      reps: Number(r.reps || card.reps),
      lapses: Number(r.lapses || card.lapses),
      dueAt: r.due_at || card.dueAt,
      lastReviewedAt: r.last_reviewed_at || card.lastReviewedAt,
      updatedAt: r.updated_at || card.updatedAt
    };
  }

  const cards = loadJson(FLASHCARDS_FILE, []);
  const idx = cards.findIndex((c) => c.id === card.id && c.userId === user.id);
  const stored = { ...card, userId: user.id };
  if (idx >= 0) cards[idx] = stored;
  else cards.push(stored);
  saveJson(FLASHCARDS_FILE, cards);
  return card;
}

async function deleteFlashcard(user, id) {
  if (USE_SUPABASE) {
    await supabaseRestRequest(`/rest/v1/flashcards?id=eq.${encodeURIComponent(String(id))}`, "DELETE", null, user.token);
    return;
  }
  const cards = loadJson(FLASHCARDS_FILE, []);
  saveJson(
    FLASHCARDS_FILE,
    cards.filter((c) => !(c.id === id && c.userId === user.id))
  );
}

function computeCardDifficulty(card) {
  const ease = Number(card.ease || 2.5);
  const lapses = Number(card.lapses || 0);
  const reps = Number(card.reps || 0);
  const interval = Number(card.intervalDays || 0);
  let score = 0;
  if (ease < 2.2) score += 2;
  if (ease < 1.8) score += 2;
  if (lapses >= 1) score += 1;
  if (lapses >= 3) score += 2;
  if (reps <= 1) score += 1;
  if (interval <= 1) score += 1;
  return score;
}

function estimateMastery(cards) {
  if (!cards.length) return 0;
  const total = cards.reduce((sum, c) => {
    const easeNorm = Math.max(0, Math.min(1, (Number(c.ease || 2.5) - 1.3) / (2.8 - 1.3)));
    const lapsePenalty = Math.min(0.45, Number(c.lapses || 0) * 0.08);
    const repBoost = Math.min(0.25, Number(c.reps || 0) * 0.03);
    return sum + Math.max(0, Math.min(1, easeNorm - lapsePenalty + repBoost));
  }, 0);
  return Math.round((100 * total) / cards.length);
}

function isCardDueAtOrBeforeNow(card, nowMs = Date.now()) {
  const ts = new Date(card?.dueAt || "").getTime();
  if (!Number.isFinite(ts)) return false;
  return ts <= nowMs;
}

function buildLearningPlanFromData(cards = [], dueCards = [], notes = []) {
  const weakTagMap = new Map();
  for (const c of cards) {
    const tags = Array.isArray(c.tags) && c.tags.length ? c.tags : ["untagged"];
    const diff = computeCardDifficulty(c);
    for (const t of tags.slice(0, 6)) {
      const key = String(t || "untagged").trim().toLowerCase() || "untagged";
      const prev = weakTagMap.get(key) || { tag: key, score: 0, cards: 0, due: 0 };
      prev.score += diff;
      prev.cards += 1;
      if (new Date(c.dueAt).getTime() <= Date.now()) prev.due += 1;
      weakTagMap.set(key, prev);
    }
  }

  const weakTags = [...weakTagMap.values()]
    .sort((a, b) => b.score - a.score || b.due - a.due)
    .slice(0, 3)
    .map((x) => ({ tag: x.tag, score: x.score, cards: x.cards, due: x.due }));

  const masteryScore = estimateMastery(cards);
  const notesWithoutTags = notes.filter((n) => !Array.isArray(n.tags) || n.tags.length === 0).length;
  const noCardsYet = cards.length === 0;

  const actions = [];
  if (noCardsYet) {
    actions.push("Generate flashcards from your top 1-2 notes to start spaced review.");
  } else {
    if (dueCards.length > 0) actions.push(`Review ${dueCards.length} due card(s) first before creating new content.`);
    if (weakTags.length > 0) actions.push(`Focus on weak topic: ${weakTags[0].tag}. Use feedback + test prep on that topic.`);
    if (masteryScore < 55) actions.push("Run a short daily loop (15 minutes): study due cards, then 5-question practice test.");
    else if (masteryScore < 75) actions.push("Run a medium daily loop (20 minutes): due cards + targeted practice test.");
    else actions.push("Mastery is strong. Keep a light maintenance review and add new advanced notes.");
  }
  if (notesWithoutTags > 0) {
    actions.push(`Tag ${notesWithoutTags} note(s) without tags for better personalized recommendations.`);
  }

  return {
    generatedAt: new Date().toISOString(),
    masteryScore,
    totalCards: cards.length,
    dueNow: dueCards.length,
    weakTags,
    nextActions: actions.slice(0, 4)
  };
}

async function buildLearningPlan(user) {
  const cards = await listFlashcards(user, { dueOnly: false, limit: 5000 });
  const dueCards = cards.filter((c) => isCardDueAtOrBeforeNow(c));
  const notes = await listNotes(user);
  return buildLearningPlanFromData(cards, dueCards, notes);
}

function analyticsCount(counts, key) {
  return Number((counts && counts[key]) || 0);
}

function aiOutputCountFromAnalyticsCounts(counts = {}) {
  const keys = [
    "ai.action",
    "tutor.ask",
    "flashcards.generate",
    "testprep.generate",
    "study.plan",
    "notes.transcribe"
  ];
  return keys.reduce((sum, k) => sum + analyticsCount(counts, k), 0);
}

function normalizeTopicLabel(value) {
  const raw = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s\-/.]/g, "");
  return raw.slice(0, 42);
}

function topicLabelFromTitle(title) {
  const cleaned = String(title || "")
    .trim()
    .replace(/[^\w\s-]/g, " ");
  if (!cleaned) return "";
  return normalizeTopicLabel(cleaned.split(/\s+/).slice(0, 4).join(" "));
}

async function getWorkspaceBrief(user) {
  const [notes, cards, analytics] = await Promise.all([
    listNotes(user),
    listFlashcards(user, { dueOnly: false, limit: 5000 }),
    getAnalyticsSummary(user, 7)
  ]);
  const dueCards = cards.filter((c) => isCardDueAtOrBeforeNow(c));
  const plan = buildLearningPlanFromData(cards, dueCards, notes);

  const topicMap = new Map();
  const pushTopic = (raw, weight = 1) => {
    const topic = normalizeTopicLabel(raw);
    if (!topic) return;
    const prev = topicMap.get(topic) || { topic, score: 0 };
    prev.score += Number(weight || 1);
    topicMap.set(topic, prev);
  };

  notes.forEach((note) => {
    const tags = Array.isArray(note?.tags) ? note.tags : [];
    if (tags.length) {
      tags.slice(0, 6).forEach((tag) => pushTopic(tag, 3));
      return;
    }
    pushTopic(topicLabelFromTitle(note?.title || ""), 1);
  });
  cards.forEach((card) => {
    const tags = Array.isArray(card?.tags) ? card.tags : [];
    tags.slice(0, 4).forEach((tag) => pushTopic(tag, 1));
  });

  const counts = analytics?.counts || {};
  const sourceImports7d = analyticsCount(counts, "sources.import");
  const aiOutputs7d = aiOutputCountFromAnalyticsCounts(counts);
  const lastEditedAt = notes.length ? String(notes[0]?.updatedAt || "") : "";
  const weakTags = Array.isArray(plan?.weakTags) ? plan.weakTags : [];
  const weakTag = weakTags.length ? String(weakTags[0]?.tag || "untagged").replaceAll('"', "") : "";

  const nextMoves = [];
  if (notes.length === 0) {
    nextMoves.push("Create your first notebook and capture one concrete learning objective.");
  }
  if (sourceImports7d === 0) {
    nextMoves.push("Import at least one source to unlock grounded answers with citations.");
  }
  if (dueCards.length > 0) {
    nextMoves.push(`Review ${dueCards.length} due flashcard(s) before generating new cards.`);
  }
  if (weakTag) {
    nextMoves.push(`Run a short tutor drill on weak topic "${weakTag}".`);
  }
  if (aiOutputs7d < 3 && notes.length > 0) {
    nextMoves.push("Use Summarize or Improve on one note to keep momentum.");
  }
  if (!nextMoves.length) {
    nextMoves.push("Keep momentum with a short loop: summarize one note, then run a practice test.");
  }

  return {
    generatedAt: new Date().toISOString(),
    overview: {
      notes: notes.length,
      flashcards: cards.length,
      dueNow: dueCards.length,
      masteryScore: Number(plan?.masteryScore || 0),
      actions7d: Number(analytics?.total || 0),
      aiOutputs7d,
      sourceImports7d,
      lastEditedAt
    },
    topTopics: [...topicMap.values()]
      .sort((a, b) => b.score - a.score || a.topic.localeCompare(b.topic))
      .slice(0, 6),
    nextMoves: nextMoves.slice(0, 4)
  };
}

function scheduleReview(card, grade) {
  // grade: 0=again, 1=hard, 2=good, 3=easy
  const now = new Date();
  let ease = Number(card.ease || 2.5);
  let intervalDays = Number(card.intervalDays || 0);
  let reps = Number(card.reps || 0);
  let lapses = Number(card.lapses || 0);

  if (grade <= 0) {
    ease = Math.max(1.3, ease - 0.2);
    reps = 0;
    intervalDays = 0;
    lapses += 1;
    const due = new Date(now.getTime() + 10 * 60 * 1000);
    return { ease, intervalDays, reps, lapses, dueAt: due.toISOString(), lastReviewedAt: now.toISOString() };
  }

  if (grade === 1) ease = Math.max(1.3, ease - 0.15);
  if (grade === 3) ease = ease + 0.15;

  reps += 1;
  if (reps === 1) intervalDays = grade === 1 ? 1 : grade === 2 ? 2 : 3;
  else if (reps === 2) intervalDays = grade === 1 ? 3 : grade === 2 ? 5 : 7;
  else {
    const mult = grade === 1 ? Math.max(1.2, ease - 0.2) : grade === 2 ? ease : ease + 0.3;
    intervalDays = Math.max(1, Math.ceil(intervalDays * mult));
  }

  const due = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);
  return { ease, intervalDays, reps, lapses, dueAt: due.toISOString(), lastReviewedAt: now.toISOString() };
}

function extractJsonArray(text) {
  const s = String(text || "").trim();
  const start = s.indexOf("[");
  const end = s.lastIndexOf("]");
  if (start >= 0 && end > start) return s.slice(start, end + 1);
  return s;
}

function extractJsonObject(text) {
  const s = String(text || "").trim();
  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  if (start >= 0 && end > start) return s.slice(start, end + 1);
  return s;
}

function toNormalizedBulletList(value, { max = 10, maxItemChars = 260 } = {}) {
  const rows = Array.isArray(value) ? value : String(value || "").split(/\n+/);
  const out = [];
  const seen = new Set();
  for (const row of rows) {
    if (out.length >= Math.max(1, Number(max) || 10)) break;
    const normalized = cleanImportedText(String(row || ""))
      .replace(/^[\s\-*•\d.)]+/, "")
      .replace(/\s+/g, " ")
      .trim();
    if (!normalized) continue;
    if (/^(key points?|important details?|feedback|action items?|ignored (as )?irrelevant|notes?)[:]?$/i.test(normalized)) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(normalized.slice(0, Math.max(40, Number(maxItemChars) || 260)));
  }
  return out;
}

function isUnreadableScreenshotText(value) {
  const msg = cleanImportedText(String(value || ""));
  if (!msg) return true;
  return /^no readable text found\.?$/i.test(msg) || /^text is unreadable\.?$/i.test(msg);
}

function buildImageStudySourceText(rawText, fileName = "") {
  const raw = cleanImportedText(String(rawText || ""));
  if (!raw) return "";
  if (isUnreadableScreenshotText(raw)) return "";

  let parsed = null;
  try {
    parsed = JSON.parse(extractJsonObject(raw));
  } catch {
    parsed = null;
  }

  const fromParsed = (keys, max = 8) => {
    if (!parsed || typeof parsed !== "object") return [];
    const list = Array.isArray(keys) ? keys : [keys];
    for (const key of list) {
      if (!(key in parsed)) continue;
      return toNormalizedBulletList(parsed[key], { max });
    }
    return [];
  };

  let readable = true;
  if (parsed && typeof parsed === "object") {
    if (parsed.readable_text === false || parsed.readableText === false) readable = false;
    const statusMsg = cleanImportedText(String(parsed.message || parsed.status || ""));
    if (statusMsg && isUnreadableScreenshotText(statusMsg)) readable = false;
  }
  if (!readable) return "";

  let keyPoints = fromParsed(["key_points", "keyPoints", "summary"], 8);
  const importantDetails = fromParsed(["important_details", "importantDetails", "facts"], 10);
  const feedback = fromParsed(["feedback", "study_feedback", "studyFeedback"], 8);
  const actionItems = fromParsed(["action_items", "actionItems", "todo"], 8);
  const ignoredIrrelevant = fromParsed(["ignored_irrelevant", "ignoredIrrelevant", "ignored"], 6);

  if (!keyPoints.length) {
    const fallbackLines = toNormalizedBulletList(filterNoisyLines(raw), { max: 10, maxItemChars: 280 });
    keyPoints = fallbackLines.slice(0, 8);
  }
  if (!keyPoints.length && !importantDetails.length && !feedback.length && !actionItems.length) return "";

  const sections = [];
  if (keyPoints.length) sections.push(`Key points\n${keyPoints.map((x) => `- ${x}`).join("\n")}`);
  if (importantDetails.length) sections.push(`Important details\n${importantDetails.map((x) => `- ${x}`).join("\n")}`);
  if (feedback.length) sections.push(`Feedback\n${feedback.map((x) => `- ${x}`).join("\n")}`);
  if (actionItems.length) sections.push(`Action items\n${actionItems.map((x) => `- ${x}`).join("\n")}`);
  if (ignoredIrrelevant.length) sections.push(`Ignored as irrelevant\n${ignoredIrrelevant.map((x) => `- ${x}`).join("\n")}`);

  const title = cleanImportedText(String(fileName || "").slice(0, 120));
  const combined = cleanImportedText(`${title ? `Screenshot: ${title}\n\n` : ""}${sections.join("\n\n")}`);
  return combined.slice(0, 140000);
}

const IMAGE_SECTION_KEYS = [
  { id: "key_points", label: "Key points" },
  { id: "important_details", label: "Important details" },
  { id: "feedback", label: "Feedback" },
  { id: "action_items", label: "Action items" },
  { id: "ignored_irrelevant", label: "Ignored as irrelevant" }
];

const IMAGE_SECTION_HEADER_TO_KEY = new Map(IMAGE_SECTION_KEYS.map((x) => [x.label.toLowerCase(), x.id]));

function normalizeSourceLineForCompare(value) {
  return cleanImportedText(String(value || ""))
    .replace(/^screenshot:\s*/i, "")
    .replace(/^[\s\-*•\d.)]+/, "")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();
}

function buildSourceLineSet(content, { maxLines = 120 } = {}) {
  const lines = String(content || "").split(/\n+/);
  const set = new Set();
  for (const rawLine of lines) {
    if (set.size >= Math.max(10, Number(maxLines) || 120)) break;
    const line = normalizeSourceLineForCompare(rawLine);
    if (!line || line.length < 8) continue;
    if (IMAGE_SECTION_HEADER_TO_KEY.has(line)) continue;
    set.add(line.slice(0, 260));
  }
  return set;
}

function buildSourceTokenSet(content, { maxTokens = 280 } = {}) {
  const text = normalizeSourceLineForCompare(content).replace(/[^a-z0-9\s]/g, " ");
  const stop = new Set([
    "the",
    "and",
    "for",
    "with",
    "this",
    "that",
    "from",
    "your",
    "have",
    "has",
    "are",
    "was",
    "were",
    "will",
    "into",
    "about",
    "when",
    "where",
    "which",
    "also",
    "more",
    "than",
    "they",
    "them",
    "their",
    "what",
    "how",
    "you",
    "can",
    "not",
    "all",
    "one",
    "two"
  ]);
  const set = new Set();
  for (const token of text.split(/\s+/)) {
    if (set.size >= Math.max(20, Number(maxTokens) || 280)) break;
    if (token.length < 4) continue;
    if (stop.has(token)) continue;
    set.add(token);
  }
  return set;
}

function intersectionSize(aSet, bSet) {
  let count = 0;
  const [small, large] = aSet.size <= bSet.size ? [aSet, bSet] : [bSet, aSet];
  for (const v of small) {
    if (large.has(v)) count += 1;
  }
  return count;
}

function sourceSimilarityScore(aContent, bContent) {
  const aLines = buildSourceLineSet(aContent);
  const bLines = buildSourceLineSet(bContent);
  const aTokens = buildSourceTokenSet(aContent);
  const bTokens = buildSourceTokenSet(bContent);

  let lineScore = 0;
  if (aLines.size && bLines.size) {
    const sharedLines = intersectionSize(aLines, bLines);
    lineScore = sharedLines / Math.max(1, Math.min(aLines.size, bLines.size));
  }

  let tokenScore = 0;
  if (aTokens.size && bTokens.size) {
    const sharedTokens = intersectionSize(aTokens, bTokens);
    tokenScore = sharedTokens / Math.max(1, Math.min(aTokens.size, bTokens.size));
  }

  return Math.max(lineScore, tokenScore);
}

function parseImageSourceSections(content) {
  const sections = Object.fromEntries(IMAGE_SECTION_KEYS.map((x) => [x.id, []]));
  const rawLines = String(content || "").split("\n");
  let current = "key_points";

  for (const rawLine of rawLines) {
    const line = cleanImportedText(String(rawLine || ""));
    if (!line) continue;
    if (/^screenshot:\s*/i.test(line)) continue;
    const headerKey = IMAGE_SECTION_HEADER_TO_KEY.get(line.toLowerCase());
    if (headerKey) {
      current = headerKey;
      continue;
    }
    const bullet = cleanImportedText(line.replace(/^[\s\-*•]+/, ""));
    if (!bullet) continue;
    sections[current].push(bullet.slice(0, 280));
  }

  return sections;
}

function mergeUniqueSectionLines(existing = [], incoming = [], max = 18) {
  const out = [];
  const seen = new Set();
  for (const row of [...existing, ...incoming]) {
    if (out.length >= Math.max(4, Number(max) || 18)) break;
    const clean = cleanImportedText(String(row || "")).replace(/^[\s\-*•]+/, "");
    if (!clean) continue;
    const key = normalizeSourceLineForCompare(clean);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(clean.slice(0, 280));
  }
  return out;
}

function buildMergedImageSourceContent(names = [], sections = {}) {
  const titleNames = Array.isArray(names) ? names.filter(Boolean) : [];
  const head =
    titleNames.length <= 1
      ? titleNames[0]
        ? `Screenshot: ${titleNames[0]}`
        : "Screenshot source"
      : `Screenshots merged (${titleNames.length}): ${titleNames.slice(0, 4).join(", ")}${
          titleNames.length > 4 ? ` +${titleNames.length - 4} more` : ""
        }`;

  const parts = [];
  for (const section of IMAGE_SECTION_KEYS) {
    const rows = Array.isArray(sections?.[section.id]) ? sections[section.id] : [];
    if (!rows.length) continue;
    parts.push(`${section.label}\n${rows.map((x) => `- ${x}`).join("\n")}`);
  }

  if (!parts.length) return "";
  return cleanImportedText(`${head}\n\n${parts.join("\n\n")}`).slice(0, 140000);
}

function sanitizePreviewImageDataUrl(value, { maxChars = 180000 } = {}) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const compact = raw.replace(/\s+/g, "");
  if (compact.length > Math.max(32000, Number(maxChars) || 180000)) return "";
  if (!compact.startsWith("data:image/")) return "";
  const marker = ";base64,";
  const markerAt = compact.indexOf(marker);
  if (markerAt <= "data:image/".length) return "";
  const mime = compact.slice("data:image/".length, markerAt).toLowerCase();
  if (!["png", "jpeg", "jpg", "webp"].includes(mime)) return "";
  const payload = compact.slice(markerAt + marker.length);
  if (!payload || !/^[a-z0-9+/=]+$/i.test(payload)) return "";
  return compact;
}

function mergeSimilarImageSources(rows = []) {
  const images = Array.isArray(rows) ? rows : [];
  if (!images.length) return [];

  const groups = [];
  for (const src of images) {
    const name = cleanImportedText(String(src?.name || "")).slice(0, 120) || "screenshot";
    const content = cleanImportedText(String(src?.content || "")).slice(0, 140000);
    const previewImage = sanitizePreviewImageDataUrl(src?.previewImage);
    if (!content) continue;
    const candidate = {
      names: [name],
      sections: parseImageSourceSections(content),
      signature: content,
      previewImage
    };

    let merged = false;
    for (const group of groups) {
      const sim = sourceSimilarityScore(group.signature, candidate.signature);
      if (sim < 0.64) continue;
      group.names = mergeUniqueSectionLines(group.names, candidate.names, 50);
      for (const section of IMAGE_SECTION_KEYS) {
        group.sections[section.id] = mergeUniqueSectionLines(group.sections[section.id], candidate.sections[section.id], 20);
      }
      if (!group.previewImage && candidate.previewImage) group.previewImage = candidate.previewImage;
      group.signature = buildMergedImageSourceContent(group.names, group.sections);
      merged = true;
      break;
    }
    if (!merged) groups.push(candidate);
  }

  const out = [];
  for (const group of groups) {
    const content = cleanImportedText(group.signature || buildMergedImageSourceContent(group.names, group.sections));
    if (!content) continue;
    const name =
      group.names.length <= 1 ? String(group.names[0] || "screenshot").slice(0, 120) : `Merged screenshots (${group.names.length})`;
    const merged = { name, kind: "image", content: content.slice(0, 140000) };
    if (group.previewImage) merged.previewImage = group.previewImage;
    out.push(merged);
  }
  return out;
}

function dedupeImportedSourceRows(rows = [], { threshold = 0.92 } = {}) {
  const arr = Array.isArray(rows) ? rows : [];
  const out = [];
  for (const src of arr) {
    const content = cleanImportedText(String(src?.content || ""));
    if (!content) continue;
    let isDup = false;
    for (const existing of out) {
      const crossImage = String(existing?.kind || "") === "image" || String(src?.kind || "") === "image";
      const sim = sourceSimilarityScore(existing.content, content);
      const limit = crossImage ? 0.86 : Math.max(0.82, Number(threshold) || 0.92);
      if (sim >= limit) {
        if (!existing.previewImage) {
          const previewImage = sanitizePreviewImageDataUrl(src?.previewImage);
          if (previewImage) existing.previewImage = previewImage;
        }
        isDup = true;
        break;
      }
    }
    if (isDup) continue;
    out.push({
      ...src,
      content: content.slice(0, 140000)
    });
  }
  return out;
}

function normalizeImportedSources(rawSources, { maxSources = 6, maxCharsPerSource = 18000 } = {}) {
  const arr = dedupeImportedSourceRows(Array.isArray(rawSources) ? rawSources : [], { threshold: 0.92 });
  const out = [];
  let idx = 0;
  for (const s of arr) {
    if (out.length >= maxSources) break;
    const content = String(s?.content || "").trim();
    if (!content) continue;
    idx += 1;
    const id = `S${idx}`;
    const name = String(s?.name || "").trim().slice(0, 160) || id;
    const url = /^https?:\/\//i.test(String(s?.url || "").trim())
      ? String(s.url).trim()
      : /^https?:\/\//i.test(name)
        ? name
        : "";
    out.push({
      id,
      name,
      url,
      kind: String(s?.kind || "").trim().slice(0, 40),
      content: content.slice(0, maxCharsPerSource)
    });
  }
  return out;
}

function formatSourcesForPrompt(sources) {
  const srcs = Array.isArray(sources) ? sources : [];
  if (!srcs.length) return "";
  const parts = [];
  for (const s of srcs) {
    const head = `${s.id} | ${s.name}${s.url ? ` (${s.url})` : ""}`.trim();
    parts.push(`[${head}]\n${String(s.content || "").trim()}`);
  }
  return parts.join("\n\n");
}

function citationsFromSources(sources) {
  const srcs = Array.isArray(sources) ? sources : [];
  return srcs.map((s) => ({ id: s.id, name: s.name, url: s.url || "", kind: s.kind || "" }));
}

function cleanImportedText(value) {
  return String(value || "")
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function decodeHtmlEntities(s) {
  return String(s || "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d{1,6});/g, (_, n) => {
      const code = Number(n);
      if (!Number.isFinite(code)) return "";
      try {
        return String.fromCodePoint(code);
      } catch {
        return "";
      }
    });
}

const NOTE_ALLOWED_TAGS = new Set([
  "p",
  "br",
  "div",
  "span",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "ul",
  "ol",
  "li",
  "blockquote",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "pre",
  "code",
  "a"
]);
const NOTE_VOID_TAGS = new Set(["br"]);

function escapeHtmlText(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeSafeHref(rawHref) {
  const decoded = decodeHtmlEntities(String(rawHref || "").trim()).replace(/[\u0000-\u001f\u007f\s]+/g, "");
  if (!decoded) return "";
  if (decoded.startsWith("#") || decoded.startsWith("/")) return decoded.slice(0, 800);
  if (/^https?:\/\/.+/i.test(decoded)) return decoded.slice(0, 800);
  if (/^mailto:[^<>]+/i.test(decoded)) return decoded.slice(0, 800);
  if (/^tel:[+0-9(). -]+$/i.test(decoded)) return decoded.slice(0, 800);
  return "";
}

function plainTextToSafeHtml(text, maxChars = 300000) {
  const cleaned = cleanImportedText(String(text || "").slice(0, maxChars));
  if (!cleaned) return "";
  return escapeHtmlText(cleaned).replace(/\n/g, "<br>");
}

function sanitizeRichTextHtml(value, { maxChars = 300000 } = {}) {
  let html = String(value || "");
  if (!html) return "";

  html = html.replace(/\0/g, "").slice(0, maxChars * 3);
  html = html.replace(/<!--[\s\S]*?-->/g, "");
  html = html.replace(
    /<\s*(script|style|iframe|object|embed|svg|math|form|textarea|button|select|option|meta|link|base|template|noscript)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi,
    ""
  );
  html = html.replace(
    /<\s*\/?\s*(script|style|iframe|object|embed|svg|math|form|textarea|button|select|option|meta|link|base|template|noscript)[^>]*\/?\s*>/gi,
    ""
  );

  const sanitized = html.replace(/<([^>]+)>/g, (full, inside) => {
    const raw = String(inside || "").trim();
    if (!raw || raw.startsWith("!")) return "";
    const isClosing = raw.startsWith("/");
    const tagMatch = raw.match(/^\/?\s*([a-zA-Z0-9]+)/);
    if (!tagMatch) return "";
    const tag = String(tagMatch[1] || "").toLowerCase();
    if (!NOTE_ALLOWED_TAGS.has(tag)) return "";
    if (isClosing) return NOTE_VOID_TAGS.has(tag) ? "" : `</${tag}>`;

    const attrs = [];
    if (tag === "a") {
      let href = "";
      let title = "";
      let targetBlank = false;
      const attrRe = /([^\s"'<>`=\/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
      let m;
      while ((m = attrRe.exec(raw)) !== null) {
        const key = String(m[1] || "").toLowerCase();
        const val = String(m[2] ?? m[3] ?? m[4] ?? "");
        if (key.startsWith("on")) continue;
        if (key === "href") href = normalizeSafeHref(val);
        if (key === "title") title = cleanImportedText(decodeHtmlEntities(val)).slice(0, 180);
        if (key === "target" && val.toLowerCase() === "_blank") targetBlank = true;
      }
      if (href) {
        attrs.push(`href="${escapeHtmlText(href)}"`);
        if (targetBlank) {
          attrs.push('target="_blank"');
          attrs.push('rel="noopener noreferrer"');
        }
      }
      if (title) attrs.push(`title="${escapeHtmlText(title)}"`);
    }

    return `<${tag}${attrs.length ? ` ${attrs.join(" ")}` : ""}>`;
  });

  return String(sanitized).trim().slice(0, maxChars);
}

const BLOCKED_IMPORT_HOSTS = new Set([
  "localhost",
  "localhost.localdomain",
  "metadata",
  "metadata.google.internal",
  "169.254.169.254"
]);

function normalizeHostForCompare(hostname) {
  return String(hostname || "")
    .trim()
    .toLowerCase()
    .replace(/\.+$/g, "");
}

function isUnsafeIPv4Address(ip) {
  const parts = String(ip || "")
    .split(".")
    .map((p) => Number(p));
  if (parts.length !== 4 || parts.some((p) => !Number.isInteger(p) || p < 0 || p > 255)) return true;
  const [a, b] = parts;
  if (a === 0 || a === 10 || a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  if (a === 198 && (b === 18 || b === 19)) return true;
  if (a >= 224) return true;
  return false;
}

function isUnsafeIPv6Address(ip) {
  const normalized = String(ip || "").toLowerCase();
  if (!normalized) return true;
  if (normalized === "::" || normalized === "::1") return true;
  if (
    normalized.startsWith("fe8") ||
    normalized.startsWith("fe9") ||
    normalized.startsWith("fea") ||
    normalized.startsWith("feb")
  ) {
    return true; // fe80::/10 link-local
  }
  if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true; // fc00::/7 unique-local
  if (normalized.startsWith("::ffff:")) {
    const mapped = normalized.slice("::ffff:".length);
    if (net.isIP(mapped) === 4) return isUnsafeIPv4Address(mapped);
  }
  return false;
}

function isUnsafeIpAddress(ip) {
  const family = net.isIP(String(ip || ""));
  if (family === 4) return isUnsafeIPv4Address(ip);
  if (family === 6) return isUnsafeIPv6Address(ip);
  return true;
}

async function assertSafeImportUrl(rawUrl) {
  let parsed;
  try {
    parsed = new URL(String(rawUrl || "").trim());
  } catch {
    throw new Error("Invalid URL");
  }

  if (!/^https?:$/i.test(parsed.protocol)) {
    throw new Error("Only http/https URLs are supported");
  }
  if (parsed.username || parsed.password) {
    throw new Error("URLs with credentials are not allowed");
  }
  if (parsed.port && parsed.port !== "80" && parsed.port !== "443") {
    throw new Error("Only ports 80 and 443 are allowed");
  }

  const host = normalizeHostForCompare(parsed.hostname);
  if (!host) throw new Error("Invalid hostname");
  if (
    BLOCKED_IMPORT_HOSTS.has(host) ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal")
  ) {
    throw new Error("Blocked host for security reasons");
  }

  const literalIp = net.isIP(host);
  if (literalIp && isUnsafeIpAddress(host)) {
    throw new Error("Blocked host for security reasons");
  }

  if (!literalIp) {
    let resolved = [];
    try {
      resolved = await dns.lookup(host, { all: true, verbatim: true });
    } catch {
      throw new Error("Could not resolve host");
    }
    const ips = (resolved || []).map((r) => String(r?.address || "")).filter(Boolean);
    if (!ips.length || ips.some((ip) => isUnsafeIpAddress(ip))) {
      throw new Error("Blocked host for security reasons");
    }
  }

  return parsed.toString();
}

async function fetchSafeUrlWithRedirects(rawUrl, { timeoutMs = 9000, maxRedirects = 4, headers = {} } = {}) {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);
  try {
    let current = await assertSafeImportUrl(rawUrl);
    for (let i = 0; i <= maxRedirects; i += 1) {
      const res = await fetch(current, {
        method: "GET",
        redirect: "manual",
        signal: ac.signal,
        headers
      });

      const status = Number(res.status || 0);
      if (status >= 300 && status < 400) {
        const location = String(res.headers.get("location") || "").trim();
        if (!location) throw new Error(`Redirect missing location (${status})`);
        current = await assertSafeImportUrl(new URL(location, current).toString());
        continue;
      }

      return { response: res, finalUrl: current };
    }
    throw new Error("Too many redirects");
  } finally {
    clearTimeout(timer);
  }
}

function extractHtmlTitle(html) {
  const raw = String(html || "");
  const m = raw.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!m) return "";
  const t = decodeHtmlEntities(m[1])
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
  return t;
}

function filterNoisyLines(text) {
  const raw = String(text || "");
  const lines = raw
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const out = [];
  for (const line of lines) {
    const l = line;
    const lower = l.toLowerCase();

    // Drop typical JS/config noise that sometimes leaks when HTML is truncated mid-script.
    if (
      lower.includes("this.gbar_") ||
      lower.includes("__closure__") ||
      lower.includes("spdx-license") ||
      lower.includes("function(") ||
      lower.includes("prototype.") ||
      lower.includes("var ") ||
      lower.includes("const ") ||
      lower.includes("let ") ||
      lower.includes("window.") ||
      lower.includes("globalthis") ||
      lower.includes("document.") ||
      lower.includes("settimeout(") ||
      lower.includes("googleapis") ||
      lower.includes("gstatic.com") ||
      lower.includes("googlesyndication")
    ) {
      continue;
    }

    // Drop lines that are mostly symbols (minified code).
    const symbolHits = (l.match(/[{}[\];=<>]/g) || []).length;
    if (l.length >= 120 && symbolHits / l.length > 0.08) continue;

    // Drop extremely long single-line blobs.
    if (l.length > 420) continue;

    out.push(l);
  }

  return cleanImportedText(out.join("\n"));
}

function decodeBase64Payload(base64) {
  const cleaned = String(base64 || "");
  const onlyBase64 = cleaned.includes(",") ? cleaned.split(",").pop() : cleaned;
  if (!onlyBase64) return Buffer.alloc(0);
  return Buffer.from(onlyBase64, "base64");
}

function htmlToText(html) {
  const raw = String(html || "");
  const title = extractHtmlTitle(raw);
  const withoutScripts = raw
    // If HTML was truncated mid-script, match until end-of-string.
    .replace(/<script\b[^>]*>[\s\S]*?(<\/script>|$)/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?(<\/style>|$)/gi, " ")
    .replace(/<noscript\b[^>]*>[\s\S]*?(<\/noscript>|$)/gi, " ")
    .replace(/<\/(p|div|li|h1|h2|h3|h4|h5|h6|tr|section|article|main)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ");

  const decoded = decodeHtmlEntities(withoutScripts)
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n");

  const cleaned = filterNoisyLines(cleanImportedText(decoded));
  const merged = title && cleaned && !cleaned.toLowerCase().startsWith(title.toLowerCase())
    ? `${title}\n\n${cleaned}`
    : (cleaned || title || "");
  return cleanImportedText(merged);
}

function decodePdfEscapedString(v) {
  return String(v || "")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/\\\\/g, "\\");
}

function extractTextFromPdfBuffer(buffer) {
  const streams = [];
  const raw = buffer.toString("latin1");
  const streamRe = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
  let m;
  while ((m = streamRe.exec(raw)) !== null) streams.push(m[1]);

  const candidates = [raw];
  for (const s of streams) {
    try {
      const inflated = require("zlib").inflateSync(Buffer.from(s, "latin1")).toString("latin1");
      candidates.push(inflated);
    } catch {
      // Some streams are not flate encoded.
    }
  }

  const pieces = [];
  for (const text of candidates) {
    const tj = text.match(/\((?:\\.|[^\\)])*\)\s*Tj/g) || [];
    for (const token of tj) {
      const inner = token.replace(/\)\s*Tj$/, "").replace(/^\(/, "");
      pieces.push(decodePdfEscapedString(inner));
    }
    const tjArray = text.match(/\[(.*?)\]\s*TJ/gs) || [];
    for (const arr of tjArray) {
      const inner = arr.replace(/\]\s*TJ$/s, "").replace(/^\[/, "");
      const parts = inner.match(/\((?:\\.|[^\\)])*\)/g) || [];
      for (const part of parts) {
        pieces.push(decodePdfEscapedString(part.slice(1, -1)));
      }
    }
  }

  return cleanImportedText(pieces.join(" "));
}

function unzipDocxEntry(buffer, entryName) {
  const sigLocal = 0x04034b50;
  const sigCentral = 0x02014b50;
  const sigEocd = 0x06054b50;

  const eocdSearchStart = Math.max(0, buffer.length - 65557);
  let eocdOffset = -1;
  for (let i = buffer.length - 22; i >= eocdSearchStart; i -= 1) {
    if (buffer.readUInt32LE(i) === sigEocd) {
      eocdOffset = i;
      break;
    }
  }
  if (eocdOffset < 0) throw new Error("Invalid DOCX (EOCD not found)");

  const centralDirOffset = buffer.readUInt32LE(eocdOffset + 16);
  const totalEntries = buffer.readUInt16LE(eocdOffset + 10);
  let ptr = centralDirOffset;

  for (let n = 0; n < totalEntries; n += 1) {
    if (ptr + 46 > buffer.length) break;
    if (buffer.readUInt32LE(ptr) !== sigCentral) break;

    const method = buffer.readUInt16LE(ptr + 10);
    const compressedSize = buffer.readUInt32LE(ptr + 20);
    const fileNameLen = buffer.readUInt16LE(ptr + 28);
    const extraLen = buffer.readUInt16LE(ptr + 30);
    const commentLen = buffer.readUInt16LE(ptr + 32);
    const localHeaderOffset = buffer.readUInt32LE(ptr + 42);
    const fileName = buffer.slice(ptr + 46, ptr + 46 + fileNameLen).toString("utf8");

    ptr += 46 + fileNameLen + extraLen + commentLen;
    if (fileName !== entryName) continue;

    if (localHeaderOffset + 30 > buffer.length) throw new Error("Invalid DOCX local header");
    if (buffer.readUInt32LE(localHeaderOffset) !== sigLocal) throw new Error("Invalid DOCX local signature");

    const localNameLen = buffer.readUInt16LE(localHeaderOffset + 26);
    const localExtraLen = buffer.readUInt16LE(localHeaderOffset + 28);
    const dataStart = localHeaderOffset + 30 + localNameLen + localExtraLen;
    const dataEnd = dataStart + compressedSize;
    if (dataEnd > buffer.length) throw new Error("Invalid DOCX entry size");

    const data = buffer.slice(dataStart, dataEnd);
    if (method === 0) return data;
    if (method === 8) return require("zlib").inflateRawSync(data);
    throw new Error(`Unsupported DOCX compression method: ${method}`);
  }

  throw new Error(`DOCX entry not found: ${entryName}`);
}

function extractTextFromDocxBuffer(buffer) {
  const xmlBuffer = unzipDocxEntry(buffer, "word/document.xml");
  const xml = xmlBuffer.toString("utf8");
  const text = xml
    .replace(/<w:p\b[^>]*>/g, "\n")
    .replace(/<\/w:p>/g, "\n")
    .replace(/<w:tab\b[^>]*\/>/g, "\t")
    .replace(/<w:br\b[^>]*\/>/g, "\n")
    .replace(/<w:cr\b[^>]*\/>/g, "\n")
    .replace(/<\/w:t>/g, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  return cleanImportedText(text);
}

function extractYoutubeVideoId(inputUrl) {
  try {
    const u = new URL(String(inputUrl || ""));
    const host = u.hostname.toLowerCase();
    if (host.includes("youtu.be")) {
      return u.pathname.replaceAll("/", "").trim() || null;
    }
    if (host.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v.trim();
      const parts = u.pathname.split("/").filter(Boolean);
      const idx = parts.findIndex((p) => p === "shorts" || p === "embed" || p === "live");
      if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
    }
  } catch {
    // Ignore parse errors.
  }
  return null;
}

function parseYoutubeCaptionsFromWatchHtml(html) {
  const text = String(html || "");
  const marker = "ytInitialPlayerResponse = ";
  const idx = text.indexOf(marker);
  if (idx >= 0) {
    const start = idx + marker.length;
    const end = text.indexOf(";</script>", start);
    if (end > start) {
      const rawJson = text.slice(start, end).trim();
      try {
        return JSON.parse(rawJson);
      } catch {
        // Fallback below.
      }
    }
  }

  const jsonMatch = text.match(/"captions":\s*(\{[\s\S]*?\})\s*,\s*"videoDetails":/);
  if (!jsonMatch) return null;
  try {
    return { captions: JSON.parse(jsonMatch[1]) };
  } catch {
    return null;
  }
}

async function fetchYoutubeTranscript(url) {
  const videoId = extractYoutubeVideoId(url);
  if (!videoId) throw new Error("Invalid YouTube URL");

  const watch = await fetch(`https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; NotematicaBot/1.0)"
    }
  });
  if (!watch.ok) throw new Error(`Could not load YouTube page (${watch.status})`);
  const html = await watch.text();
  const player = parseYoutubeCaptionsFromWatchHtml(html);
  const tracks = player?.captions?.playerCaptionsTracklistRenderer?.captionTracks || [];
  if (!Array.isArray(tracks) || !tracks.length) {
    throw new Error("No captions available for this YouTube video");
  }

  const preferred =
    tracks.find((t) => String(t.languageCode || "").startsWith("en")) ||
    tracks[0];
  const baseUrl = String(preferred.baseUrl || "");
  if (!baseUrl) throw new Error("Caption track unavailable");

  const transcriptRes = await fetch(`${baseUrl}&fmt=json3`, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; NotematicaBot/1.0)"
    }
  });
  if (!transcriptRes.ok) throw new Error(`Could not load captions (${transcriptRes.status})`);
  const json = await transcriptRes.json().catch(() => ({}));
  const events = Array.isArray(json.events) ? json.events : [];
  const lines = [];
  for (const ev of events) {
    const segs = Array.isArray(ev.segs) ? ev.segs : [];
    const textLine = segs.map((s) => String(s.utf8 || "")).join("").trim();
    if (textLine) lines.push(textLine);
  }
  const textOut = cleanImportedText(lines.join("\n"));
  if (!textOut) throw new Error("Caption text was empty");
  return textOut;
}

async function fetchUrlAsSource(url) {
  const raw = String(url || "").trim();
  if (!/^https?:\/\//i.test(raw)) throw new Error("Only http/https URLs are supported");
  const { response } = await fetchSafeUrlWithRedirects(raw, {
    timeoutMs: 9000,
    maxRedirects: 4,
    headers: {
      "User-Agent": "NotematicaSourceFetcher/1.0"
    }
  });

  if (!response.ok) throw new Error(`Fetch failed (${response.status})`);
  const ctype = String(response.headers.get("content-type") || "").toLowerCase();
  const isTextLike = ctype.includes("text/") || ctype.includes("json") || ctype.includes("xml");
  if (!isTextLike) throw new Error(`Unsupported content type: ${ctype || "unknown"}`);

  const text = await response.text();
  // Keep more of the HTML before extracting text so we don't cut mid-script and leak JS into output.
  const capped = text.slice(0, 2_000_000);
  const parsedRaw = ctype.includes("html") ? htmlToText(capped) : cleanImportedText(capped);
  const parsed = cleanImportedText(String(parsedRaw || "").slice(0, 140000));
  if (!parsed) throw new Error("No readable text found at URL");
  return parsed;
}

function normalizeSearchResultUrl(href) {
  const raw = decodeHtmlEntities(String(href || "").trim()).replace(/&amp;/g, "&");
  if (!raw) return "";
  const withProto = raw.startsWith("//") ? `https:${raw}` : raw;
  try {
    const u = new URL(withProto);
    if (u.hostname.includes("duckduckgo.com") && u.pathname.startsWith("/l/")) {
      const uddg = u.searchParams.get("uddg");
      if (uddg) {
        try {
          return decodeURIComponent(uddg);
        } catch {
          return uddg;
        }
      }
    }
    return u.toString();
  } catch {
    return "";
  }
}

function extractDuckDuckGoResults(html, { limit = 6, kind = "web" } = {}) {
  const raw = String(html || "");
  const out = [];
  const seen = new Set();
  const anchorRe = /<a[^>]*class="[^"]*result__a[^"]*"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = anchorRe.exec(raw)) !== null) {
    if (out.length >= Math.max(1, Number(limit) || 6)) break;
    const url = normalizeSearchResultUrl(m[1]);
    if (!/^https?:\/\//i.test(url)) continue;
    if (seen.has(url)) continue;
    seen.add(url);
    const title = cleanImportedText(
      decodeHtmlEntities(String(m[2] || "").replace(/<[^>]+>/g, " "))
        .replace(/\s+/g, " ")
        .trim()
    );
    if (!title) continue;
    const near = raw.slice(m.index, Math.min(raw.length, m.index + 2400));
    let snippet = "";
    const snippetMatch = near.match(/<(?:a|div)[^>]*class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/(?:a|div)>/i);
    if (snippetMatch) {
      snippet = cleanImportedText(
        decodeHtmlEntities(String(snippetMatch[1] || "").replace(/<[^>]+>/g, " "))
          .replace(/\s+/g, " ")
          .trim()
      );
    }
    out.push({
      title: title.slice(0, 180),
      url,
      snippet: snippet.slice(0, 420),
      kind
    });
  }
  return out;
}

async function searchDuckDuckGo(query, { limit = 6 } = {}) {
  const q = String(query || "").trim();
  if (!q) return [];
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 9000);
  try {
    const res = await fetch(`https://duckduckgo.com/html/?q=${encodeURIComponent(q)}&kl=us-en`, {
      method: "GET",
      signal: ac.signal,
      headers: {
        "User-Agent": "NotematicaSearchBot/1.0"
      }
    });
    if (!res.ok) return [];
    const html = await res.text();
    return extractDuckDuckGoResults(html, { limit, kind: "web" });
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

async function buildLearningSearchSources(question, { maxSources = 6 } = {}) {
  const n = Math.max(1, Math.min(10, Number(maxSources) || 6));
  const [web, videos] = await Promise.all([
    searchDuckDuckGo(question, { limit: Math.max(3, n) }),
    searchDuckDuckGo(`site:youtube.com ${question}`, { limit: Math.max(2, Math.ceil(n / 2)) })
  ]);

  const merged = [];
  const seen = new Set();
  const pushUnique = (rows, kind) => {
    for (const r of rows) {
      const url = String(r?.url || "").trim();
      if (!/^https?:\/\//i.test(url) || seen.has(url)) continue;
      seen.add(url);
      merged.push({
        name: String(r?.title || url).slice(0, 160),
        url,
        kind,
        content: cleanImportedText(
          [
            String(r?.title || "").trim(),
            String(r?.snippet || "").trim(),
            `URL: ${url}`
          ]
            .filter(Boolean)
            .join("\n")
        ).slice(0, 18000)
      });
      if (merged.length >= n) return;
    }
  };

  pushUnique(web, "web_search");
  if (merged.length < n) pushUnique(videos, "video_search");
  return normalizeImportedSources(merged, { maxSources: n, maxCharsPerSource: 18000 });
}

function normalizeImageMimeType(rawMime, fileName = "") {
  const safe = String(rawMime || "")
    .split(";")[0]
    .trim()
    .toLowerCase();
  if (safe === "image/png" || safe === "image/jpeg" || safe === "image/webp" || safe === "image/gif") {
    return safe;
  }
  const ext = path.extname(String(fileName || "")).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  return "image/png";
}

async function extractTextFromImage(base64Payload, mimeType, fileName = "") {
  if (!OPENAI_API_KEY) throw new Error("Image import requires OPENAI_API_KEY");
  const base64 = String(base64Payload || "").includes(",")
    ? String(base64Payload).split(",").pop()
    : String(base64Payload || "");
  if (!base64) throw new Error("Image payload is required");

  const imageBuffer = Buffer.from(base64, "base64");
  if (!imageBuffer.length) throw new Error("Invalid image payload");
  if (imageBuffer.length > 12 * 1024 * 1024) throw new Error(`Image too large: ${fileName || "image"}`);

  const safeMime = normalizeImageMimeType(mimeType, fileName);
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: OPENAI_VISION_MODEL,
      input: [
        {
          role: "system",
          content: "You are an OCR + study extraction engine. Return only high-signal learning content from screenshots."
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Analyze this screenshot and return ONLY JSON (no markdown, no prose) with this schema:
{
  "readable_text": boolean,
  "key_points": string[],
  "important_details": string[],
  "feedback": string[],
  "action_items": string[],
  "ignored_irrelevant": string[]
}
Rules:
- Keep only study-relevant content.
- Ignore browser chrome, sidebars, ads, nav menus, cookie banners, and decorative UI.
- Include formulas, numbers, dates, definitions, and factual claims.
- "feedback" should include concise guidance on what to focus on or clarify while studying this content.
- If unreadable, set "readable_text" to false and leave arrays empty.
- Do not invent text that is not visible.`
            },
            {
              type: "input_image",
              image_url: `data:${safeMime};base64,${base64}`
            }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Image extraction error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const text =
    data.output_text ||
    data.output?.map((o) => o?.content?.map((c) => c?.text).join("")).join("\n") ||
    "";
  const structured = buildImageStudySourceText(String(text || ""), fileName);
  if (structured) return structured;
  const fallback = cleanImportedText(filterNoisyLines(String(text || ""))).slice(0, 140000);
  if (isUnreadableScreenshotText(fallback)) return "";
  return fallback;
}

async function importSources(body) {
  const fileSources = Array.isArray(body.sources) ? body.sources : [];
  const urls = Array.isArray(body.urls) ? body.urls : [];
  const out = [];
  const imageSources = [];

  for (const src of fileSources.slice(0, 20)) {
    const name = String(src?.name || "source.txt").slice(0, 120);
    const kind = String(src?.kind || "text");

    if (kind === "pdf") {
      const pdfBuffer = decodeBase64Payload(src?.base64);
      if (!pdfBuffer.length) continue;
      if (pdfBuffer.length > 20 * 1024 * 1024) throw new Error(`PDF too large: ${name}`);
      const content = extractTextFromPdfBuffer(pdfBuffer).slice(0, 140000);
      if (!content) throw new Error(`Could not extract readable text from PDF: ${name}`);
      out.push({ name, kind: "pdf", content });
      continue;
    }

    if (kind === "docx") {
      const docxBuffer = decodeBase64Payload(src?.base64);
      if (!docxBuffer.length) continue;
      if (docxBuffer.length > 20 * 1024 * 1024) throw new Error(`DOCX too large: ${name}`);
      const content = extractTextFromDocxBuffer(docxBuffer).slice(0, 140000);
      if (!content) throw new Error(`Could not extract readable text from DOCX: ${name}`);
      out.push({ name, kind: "docx", content });
      continue;
    }

    if (kind === "image") {
      try {
        const base64 = String(src?.base64 || "");
        const mimeType = String(src?.mimeType || "");
        const previewImage = sanitizePreviewImageDataUrl(src?.previewImage);
        const extracted = await extractTextFromImage(base64, mimeType, name);
        let content = cleanImportedText(extracted).slice(0, 140000);
        if (!content || /^no readable text found\.?$/i.test(content)) {
          // Keep screenshot imports even when OCR is weak so feed thumbnails still show.
          content = `Screenshot image uploaded: ${name}.`;
        }
        const imageRow = { name, kind: "image", content };
        if (previewImage) imageRow.previewImage = previewImage;
        imageSources.push(imageRow);
      } catch (e) {
        console.warn("Image import skipped:", name, e instanceof Error ? e.message : e);
      }
      continue;
    }

    if (kind === "media") {
      const base64 = String(src?.base64 || "");
      const mimeType = String(src?.mimeType || "audio/webm");
      const mediaBuffer = decodeBase64Payload(base64);
      if (!mediaBuffer.length) continue;
      if (mediaBuffer.length > 24 * 1024 * 1024) throw new Error(`Video/audio too large: ${name}`);
      const transcript = await transcribeAudio(base64, mimeType);
      const content = cleanImportedText(transcript).slice(0, 140000);
      if (!content) throw new Error(`No transcript returned for media: ${name}`);
      out.push({ name, kind: "media", content });
      continue;
    }

    const content = cleanImportedText(String(src?.content || "").slice(0, 140000));
    if (!content) continue;
    out.push({
      name,
      kind: "file",
      content
    });
  }

  for (const raw of urls.slice(0, 8)) {
    const url = String(raw || "").trim();
    if (!url) continue;
    const content = extractYoutubeVideoId(url) ? await fetchYoutubeTranscript(url) : await fetchUrlAsSource(url);
    out.push({
      name: url.slice(0, 120),
      kind: extractYoutubeVideoId(url) ? "youtube" : "url",
      content
    });
  }

  if (imageSources.length) {
    out.push(...mergeSimilarImageSources(imageSources));
  }
  return dedupeImportedSourceRows(out, { threshold: 0.92 });
}

async function generateFlashcardsFromText(noteText, count = 10, sources = []) {
  const n = Math.max(1, Math.min(25, Number(count) || 10));
  const srcBlock = formatSourcesForPrompt(sources);
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      input: [
        {
          role: "system",
          content:
            "Generate high-quality study flashcards grounded ONLY in the provided context. Output ONLY valid JSON (no markdown). Return an array of objects: {front: string, back: string, tags: string[], citations?: string[]} where citations are like [\"S1\",\"S2\"]. If the context is insufficient, do not invent facts; keep the card general and omit citations."
        },
        {
          role: "user",
          content: `Create ${n} flashcards from the context below.\n\nNote:\n${noteText}\n\n${srcBlock ? `Sources:\n${srcBlock}\n\n` : ""}Rules: Use only the note+sources. Add citations like [S1] in citations array when applicable.`
        }
      ]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const raw =
    data.output_text ||
    data.output?.map((o) => o?.content?.map((c) => c?.text).join("")).join("\n") ||
    "";

  const arr = JSON.parse(extractJsonArray(raw));
  if (!Array.isArray(arr)) throw new Error("AI did not return a JSON array");
  return arr
    .map((c) => ({
      front: String(c.front || "").trim(),
      back: String(c.back || "").trim(),
      tags: sanitizeTags(c.tags || []),
      citations: Array.isArray(c.citations) ? c.citations.map((x) => String(x || "").trim()).filter(Boolean).slice(0, 6) : []
    }))
    .filter((c) => c.front && c.back)
    .slice(0, n);
}

async function generateTestPrep(noteText, numQuestions = 8, mode = "standard", sources = []) {
  const n = Math.max(3, Math.min(20, Number(numQuestions) || 8));
  const srcBlock = formatSourcesForPrompt(sources);
  const modeHint =
    mode === "timed"
      ? "Favor concise, high-pressure exam questions."
      : mode === "weak"
        ? "Focus on likely weak points, common mistakes, and tricky distinctions."
        : "Balance foundational and application questions.";
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      input: [
        {
          role: "system",
          content:
            "Create exam-style practice questions grounded ONLY in the provided context. Output ONLY valid JSON (no markdown). Return {questions:[{type:\"mcq\"|\"short\",question:string,choices?:string[],answer:string,explanation:string,citations?:string[]}]} where citations are like [\"S1\",\"S2\"] and refer to the provided sources. If not supported by context, do not invent; keep it conceptual and omit citations."
        },
        {
          role: "user",
          content: `Create ${n} questions from the context below. ${modeHint}\n\nNote:\n${noteText}\n\n${srcBlock ? `Sources:\n${srcBlock}\n\n` : ""}Rules: Use only the note+sources. Include citations array when applicable.`
        }
      ]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const raw =
    data.output_text ||
    data.output?.map((o) => o?.content?.map((c) => c?.text).join("")).join("\n") ||
    "";
  const objText = raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
  const parsed = JSON.parse(objText);
  const questions = Array.isArray(parsed.questions) ? parsed.questions : [];
  return {
    questions: questions
      .map((q) => ({
        type: q.type === "mcq" ? "mcq" : "short",
        question: String(q.question || "").trim(),
        choices: Array.isArray(q.choices) ? q.choices.map((c) => String(c || "").trim()).filter(Boolean) : undefined,
        answer: String(q.answer || "").trim(),
        explanation: String(q.explanation || "").trim(),
        citations: Array.isArray(q.citations) ? q.citations.map((x) => String(x || "").trim()).filter(Boolean).slice(0, 6) : []
      }))
      .filter((q) => q.question && q.answer)
      .slice(0, n)
  };
}

async function generateStudyPlan(user, days = 7, minutesPerDay = 20) {
  const d = Math.max(1, Math.min(30, Number(days) || 7));
  const m = Math.max(5, Math.min(180, Number(minutesPerDay) || 20));
  const learning = await buildLearningPlan(user);
  const weak = (learning.weakTags || []).map((w) => w.tag);
  const plan = [];
  for (let i = 1; i <= d; i += 1) {
    const focus = weak.length ? weak[(i - 1) % weak.length] : "general review";
    const minutes = i % 3 === 0 ? m + 5 : m;
    plan.push({
      day: i,
      minutes,
      focus,
      steps: [
        `Review due flashcards for ${Math.max(8, Math.round(minutes * 0.5))} min`,
        `Run practice test in ${focus} for ${Math.max(5, Math.round(minutes * 0.35))} min`,
        `Update one note with key corrections (${Math.max(2, Math.round(minutes * 0.15))} min)`
      ]
    });
  }
  return {
    days: d,
    minutesPerDay: m,
    generatedAt: new Date().toISOString(),
    plan
  };
}

async function runTutorAnswer(noteText, question, sources = [], { mode = "local_context" } = {}) {
  if (!OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY");
  const srcBlock = formatSourcesForPrompt(sources);
  const usingWebSearch = mode === "web_search";
  const systemPrompt = usingWebSearch
    ? "You are a learning search tutor. Use ONLY the provided web sources. Prioritize high-signal study facts, skip irrelevant details, and be clear about uncertainty. Add bracket citations like [S1] for factual claims. End with 2-4 bullet points under 'Related resources' and reference source titles."
    : "You are a study tutor. Use ONLY the provided context (note + sources). If uncertain, say what is missing. When you state a factual claim derived from sources, add bracket citations like [S1] inline.";
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      input: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Context note:\n${noteText}\n\n${srcBlock ? `Sources:\n${srcBlock}\n\n` : ""}${usingWebSearch ? "Student search request" : "Student question"}:\n${question}\n\nRespond with: direct answer, short explanation, and ${usingWebSearch ? "key takeaways." : "one follow-up question."}`
        }
      ]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  return (
    data.output_text ||
    data.output?.map((o) => o?.content?.map((c) => c?.text).join("")).join("\n") ||
    ""
  ).trim();
}

async function runAiAction(action, noteText, selectedText, sources = []) {
  if (!OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY");

  const prompts = {
    summarize:
      "Summarize this note in 4-6 concise bullet points. Keep key facts and decisions.",
    improve:
      "Rewrite this note to be clearer and tighter while preserving meaning.",
    feedback:
      "Give actionable feedback on this note. Return three sections: Strengths, Gaps/risks, and Next improvements (3-5 bullets). Be specific and concise.",
    tasks:
      "Extract actionable tasks from this note as a markdown checklist. If none, say 'No clear tasks found.'"
  };

  const instruction = prompts[action] || prompts.summarize;
  const target = selectedText?.trim() ? selectedText.trim() : noteText.trim();
  const srcBlock = formatSourcesForPrompt(sources);

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      input: [
        {
          role: "system",
          content:
            "You help users refine notes. Use ONLY the provided context (note + sources). If you make factual claims derived from sources, add bracket citations like [S1] inline. If context is missing, say what is missing."
        },
        {
          role: "user",
          content: `${instruction}\n\nNote:\n${target}\n\n${srcBlock ? `Sources:\n${srcBlock}\n\n` : ""}`
        }
      ]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const output =
    data.output_text ||
    data.output?.map((o) => o?.content?.map((c) => c?.text).join("")).join("\n") ||
    "";

  return output.trim();
}

function sanitizeChatMessages(messages, { maxMessages = 12, maxChars = 2000 } = {}) {
  const arr = Array.isArray(messages) ? messages : [];
  const out = [];
  for (const m of arr.slice(-maxMessages)) {
    const roleRaw = String(m?.role || "").toLowerCase().trim();
    const role = roleRaw === "assistant" ? "assistant" : "user";
    const content = String(m?.content || "").trim().slice(0, maxChars);
    if (!content) continue;
    out.push({ role, content });
  }
  return out;
}

async function runBuilderAssistantChat(user, messages, clientContext = {}) {
  if (!OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY");

  const safeClient = clientContext && typeof clientContext === "object" ? clientContext : {};
  const origin = String(safeClient.origin || "").slice(0, 200);
  const nativeShell = Boolean(safeClient.nativeShell);
  const clientAdFree = Boolean(safeClient.adFree);

  const sys = [
    "You are Notematica's Builder Chat: a pragmatic app-building assistant.",
    "Goal: help the developer finish and ship the app. Give step-by-step instructions and checklists.",
    "Do not ask for or accept API keys, passwords, tokens, secret keys, or full config dumps. If the user pastes secrets, tell them to rotate them.",
    "When you suggest changes, prefer small, safe steps and mention where (Render, Supabase, Stripe, AdSense, Apple/Google consoles).",
    "If you are uncertain, ask 1-2 clarifying questions at the end.",
    "",
    "Known app facts:",
    `- Server: Node (single server.js). Supabase mode: ${USE_SUPABASE ? "on" : "off"}.`,
    `- Billing: Stripe web subscription exists (ad-free).`,
    `- Ads: AdSense web units; should not run in native shells.`,
    `- Usage limits: enabled=${USAGE_LIMITS_ENABLED}.`,
    `- Client origin: ${origin || "unknown"}. Native shell: ${nativeShell ? "yes" : "no"}. Client says ad-free: ${clientAdFree ? "yes" : "no"}.`,
    "",
    "Output format:",
    "- Start with the immediate next 1-3 steps.",
    "- Then include a short checklist (max 8 bullets).",
    "- Keep it concise and actionable."
  ].join("\n");

  const input = [{ role: "system", content: sys }, ...sanitizeChatMessages(messages)];

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: OPENAI_BUILDER_MODEL,
      input
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const text =
    data.output_text ||
    data.output?.map((o) => o?.content?.map((c) => c?.text).join("")).join("\n") ||
    "";
  return String(text || "").trim();
}

async function transcribeAudio(audioBase64, mimeType) {
  if (!OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY");

  const cleaned = String(audioBase64 || "");
  const base64 = cleaned.includes(",") ? cleaned.split(",").pop() : cleaned;
  if (!base64) throw new Error("audioBase64 is required");

  const audioBuffer = Buffer.from(base64, "base64");
  if (!audioBuffer.length) throw new Error("Invalid audio payload");

  const rawMime = String(mimeType || "").trim();
  const safeMime = rawMime ? rawMime.split(";")[0].trim() : "audio/webm";
  const ext =
    safeMime.includes("mp4") ? "mp4" : safeMime.includes("mpeg") ? "mp3" : safeMime.includes("wav") ? "wav" : safeMime.includes("ogg") ? "ogg" : "webm";
  const filename = `note-audio.${ext}`;

  const boundary = `----CodexBoundary${crypto.randomBytes(8).toString("hex")}`;
  const headA = Buffer.from(
    `--${boundary}\r\nContent-Disposition: form-data; name=\"model\"\r\n\r\n${OPENAI_TRANSCRIBE_MODEL}\r\n`
  );
  const headB = Buffer.from(
    `--${boundary}\r\nContent-Disposition: form-data; name=\"response_format\"\r\n\r\njson\r\n`
  );
  const headC = Buffer.from(
    `--${boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"${filename}\"\r\nContent-Type: ${safeMime}\r\n\r\n`
  );
  const tail = Buffer.from(`\r\n--${boundary}--\r\n`);
  const body = Buffer.concat([headA, headB, headC, audioBuffer, tail]);

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Transcription error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  return String(data.text || "").trim();
}

const server = http.createServer(async (req, res) => {
  const requestId = crypto.randomBytes(6).toString("hex");
  res.setHeader("X-Request-Id", requestId);
  try {
    const reqUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = reqUrl.pathname;
    const ip = getClientIp(req);

    if (pathname.startsWith("/api/")) {
      applyCors(req, res);
      if (req.method === "OPTIONS") {
        res.writeHead(204, { ...securityHeaders() });
        res.end();
        return;
      }
      if (pathname === "/api/health" && (req.method === "GET" || req.method === "HEAD")) {
        if (req.method === "HEAD") {
          res.writeHead(200, { "Cache-Control": "no-store", ...securityHeaders() });
          res.end();
          return;
        }
        return json(res, 200, { ok: true, time: new Date().toISOString() });
      }
      if (pathname === "/api/stripe/webhook" && req.method === "POST") {
        const rawBody = await readBody(req, { maxBytes: STRIPE_WEBHOOK_MAX_BODY_BYTES });
        try {
          verifyStripeWebhookSignature(rawBody, req.headers["stripe-signature"], STRIPE_WEBHOOK_SECRET);
          const event = parseJsonBody(rawBody);
          await handleStripeWebhookEvent(event);
          return json(res, 200, { received: true });
        } catch (e) {
          logSecurityEvent("stripe.webhook_invalid", {
            severity: "high",
            ip,
            route: pathname,
            method: req.method,
            reason: e instanceof Error ? e.message : "invalid_webhook",
            status: 400,
            meta: {
              hasStripeSignatureHeader: Boolean(req.headers["stripe-signature"])
            }
          });
          return json(res, 400, { error: e instanceof Error ? e.message : "Invalid webhook" });
        }
      }

      if (pathname === "/api/config" && req.method === "GET") {
        return json(res, 200, {
          cloudSync: USE_SUPABASE,
          provider: USE_SUPABASE ? "supabase" : "local",
          authMode: USE_SUPABASE ? "supabase" : "local",
          adsense: {
            enabled: Boolean(ADS_ENABLED && ADSENSE_CLIENT && ADSENSE_SLOT_BOTTOM),
            client: ADSENSE_CLIENT,
            bottomSlot: ADSENSE_SLOT_BOTTOM,
            breakSlot: ADSENSE_SLOT_BREAK || ADSENSE_SLOT_BOTTOM
          }
        });
      }

      if (pathname === "/api/billing/status" && req.method === "GET") {
        const user = await requireUser(req, res);
        if (!user) return;
        if (isOwnerUser(user)) {
          return json(res, 200, { adFree: true, status: "owner", currentPeriodEnd: null });
        }
        if (!USE_SUPABASE) return json(res, 400, { error: "Billing requires Supabase mode" });
        if (!STRIPE_SECRET_KEY) return json(res, 400, { error: "Stripe is not configured" });
        const out = await computeAdFreeStatus(user);
        return json(res, 200, out);
      }

      if (pathname === "/api/ads/check" && req.method === "GET") {
        const user = await requireUser(req, res);
        if (!user) return;
        let adFree = isOwnerUser(user);
        if (!adFree && USE_SUPABASE && STRIPE_SECRET_KEY) {
          try {
            const billing = await computeAdFreeStatus(user);
            adFree = Boolean(billing.adFree);
          } catch {
            // Keep adFree=false if billing lookup fails.
          }
        }
        return json(res, 200, {
          appBaseUrl: APP_BASE_URL,
          adsEnabled: Boolean(ADS_ENABLED && ADSENSE_CLIENT && ADSENSE_SLOT_BOTTOM),
          clientConfigured: Boolean(ADSENSE_CLIENT),
          bottomSlotConfigured: Boolean(ADSENSE_SLOT_BOTTOM),
          breakSlotConfigured: Boolean(ADSENSE_SLOT_BREAK || ADSENSE_SLOT_BOTTOM),
          adFree
        });
      }

      if (pathname === "/api/billing/create-checkout-session" && req.method === "POST") {
        const user = await requireUser(req, res);
        if (!user) return;
        if (!USE_SUPABASE) return json(res, 400, { error: "Billing requires Supabase mode" });
        if (!STRIPE_SECRET_KEY || !STRIPE_PRICE_ID_PREMIUM_10) {
          return json(res, 400, {
            error: "Stripe is not configured (missing STRIPE_SECRET_KEY or STRIPE_PRICE_ID_PREMIUM_10)"
          });
        }

        const existing = await getBillingProfile(user);
        let customerId = existing?.stripe_customer_id || "";
        if (!customerId) {
          const customer = await stripeRequest("/customers", "POST", { email: user.email || "", [`metadata[user_id]`]: user.id });
          customerId = customer.id;
          await upsertBillingProfile(user, {
            stripe_customer_id: customerId,
            stripe_subscription_id: existing?.stripe_subscription_id || null,
            subscription_status: existing?.subscription_status || "none",
            current_period_end: existing?.current_period_end || null
          });
        }

        const session = await stripeRequest("/checkout/sessions", "POST", {
          mode: "subscription",
          customer: customerId,
          client_reference_id: user.id,
          [`metadata[user_id]`]: user.id,
          [`subscription_data[metadata][user_id]`]: user.id,
          success_url: `${APP_BASE_URL}/?billing=success`,
          cancel_url: `${APP_BASE_URL}/?billing=cancel`,
          [`line_items[0][price]`]: STRIPE_PRICE_ID_PREMIUM_10,
          [`line_items[0][quantity]`]: 1,
          allow_promotion_codes: "true"
        });

        return json(res, 200, { url: session.url });
      }

      if (pathname === "/api/billing/portal" && req.method === "POST") {
        const user = await requireUser(req, res);
        if (!user) return;
        if (!USE_SUPABASE) return json(res, 400, { error: "Billing requires Supabase mode" });
        if (!STRIPE_SECRET_KEY) return json(res, 400, { error: "Stripe is not configured" });

        const existing = await getBillingProfile(user);
        if (!existing?.stripe_customer_id) {
          return json(res, 400, { error: "No Stripe customer found for this user. Subscribe first." });
        }

        const portal = await stripeRequest("/billing_portal/sessions", "POST", {
          customer: existing.stripe_customer_id,
          return_url: `${APP_BASE_URL}/`
        });

        return json(res, 200, { url: portal.url });
      }

      if (pathname === "/api/billing/cancel" && req.method === "POST") {
        const user = await requireUser(req, res);
        if (!user) return;
        if (isOwnerUser(user)) {
          return json(res, 200, {
            ok: true,
            status: "owner",
            currentPeriodEnd: null,
            message: "Owner account does not have a billable membership."
          });
        }
        if (!USE_SUPABASE) return json(res, 400, { error: "Billing requires Supabase mode" });
        if (!STRIPE_SECRET_KEY) return json(res, 400, { error: "Stripe is not configured" });

        const out = await cancelMembershipImmediatelyForUser(user);
        const message = !out.hadSubscription
          ? "No active membership found."
          : out.canceledNow
            ? "Membership canceled."
            : `Membership is already ${out.status || "inactive"}.`;
        try {
          await trackEvent(user, "billing.cancel", { status: out.status || "none", hadSubscription: Boolean(out.hadSubscription) });
        } catch {
          // non-blocking analytics
        }
        return json(res, 200, {
          ok: true,
          status: out.status || "none",
          currentPeriodEnd: out.currentPeriodEnd || null,
          message
        });
      }

      if (pathname === "/api/analytics/event" && req.method === "POST") {
        const user = await requireUser(req, res);
        if (!user) return;
        const body = parseJsonBody(await readBody(req));
        await trackEvent(user, body.eventName, body.payload || {});
        return json(res, 200, { ok: true });
      }

      if (pathname === "/api/analytics/summary" && req.method === "GET") {
        const user = await requireUser(req, res);
        if (!user) return;
        const days = Number(reqUrl.searchParams.get("days") || 7);
        const summary = await getAnalyticsSummary(user, days);
        return json(res, 200, summary);
      }

      if (pathname === "/api/dashboard" && req.method === "GET") {
        const user = await requireUser(req, res);
        if (!user) return;
        const out = await getDashboardSummary(user);
        return json(res, 200, out);
      }

      if (pathname === "/api/workspace/brief" && req.method === "GET") {
        const user = await requireUser(req, res);
        if (!user) return;
        const out = await getWorkspaceBrief(user);
        return json(res, 200, out);
      }

      if (pathname === "/api/security/alerts" && req.method === "GET") {
        const user = await requireOwnerUser(req, res);
        if (!user) return;
        initializeSecurityMonitoringState();
        const limit = Math.max(1, Math.min(200, Number(reqUrl.searchParams.get("limit") || 50)));
        const alerts = securityState.alerts.slice(-limit).reverse();
        return json(res, 200, {
          alerts,
          total: securityState.alerts.length,
          generatedAt: new Date().toISOString()
        });
      }

      if (pathname === "/api/security/events" && req.method === "GET") {
        const user = await requireOwnerUser(req, res);
        if (!user) return;
        initializeSecurityMonitoringState();
        const limit = Math.max(1, Math.min(500, Number(reqUrl.searchParams.get("limit") || 100)));
        const typeFilter = sanitizeSecurityString(reqUrl.searchParams.get("type") || "", 80);
        const severityRaw = sanitizeSecurityString(reqUrl.searchParams.get("severity") || "", 20).toLowerCase();
        const sinceMinutes = Number(reqUrl.searchParams.get("sinceMinutes") || 0);
        const sinceMs = Number.isFinite(sinceMinutes) && sinceMinutes > 0 ? Date.now() - sinceMinutes * 60 * 1000 : 0;

        let events = securityState.events;
        if (typeFilter) events = events.filter((event) => event.type === typeFilter);
        if (["critical", "high", "medium", "low", "info"].includes(severityRaw)) {
          events = events.filter((event) => event.severity === severityRaw);
        }
        if (sinceMs > 0) {
          events = events.filter((event) => parseIsoMs(event.createdAt) >= sinceMs);
        }

        events = events.slice(-limit).reverse();
        return json(res, 200, {
          events,
          total: securityState.events.length,
          generatedAt: new Date().toISOString()
        });
      }

      if (pathname.startsWith("/api/share/") && req.method === "GET") {
        if (OWNER_ONLY_MODE) {
          const user = await requireOwnerUser(req, res);
          if (!user) return;
        }
        const shareId = decodeURIComponent(pathname.replace("/api/share/", ""));
        const entry = getShareEntry(shareId);
        if (!entry) return json(res, 404, { error: "Share not found" });
        return json(res, 200, {
          id: entry.id,
          title: entry.title,
          contentText: entry.contentText,
          contentHtml: entry.contentHtml,
          createdAt: entry.createdAt
        });
      }

      if (pathname === "/api/onboarding/email" && req.method === "POST") {
        const user = await requireUser(req, res);
        if (!user) return;
        const body = parseJsonBody(await readBody(req));
        const email = sanitizeEmail(body.email);
        const source = String(body.source || "onboarding_modal");
        await saveOnboardingEmail(user, email, source);
        await trackEvent(user, "onboarding.welcome_tips_served", { source: source.slice(0, 40) });
        return json(res, 200, {
          ok: true,
          tips: [
            "Generate flashcards from each note, then review due cards daily.",
            "Use practice test mode before quizzes to find weak topics quickly.",
            "If ads appear blank, run the ad check and confirm AdSense site approval."
          ]
        });
      }

      if (pathname === "/api/auth/register" && req.method === "POST") {
        if (
          !(await rateLimitOr429(res, `ip:${ip}:auth:register`, RL_AUTH_REGISTER_MAX, RL_AUTH_WINDOW_MS, {
            ip,
            route: pathname,
            method: req.method
          }))
        )
          return;
        const body = parseJsonBody(await readBody(req));
        const email = sanitizeEmail(body.email);
        const password = String(body.password || "");

        if (!email || !password || password.length < 8) {
          return json(res, 400, { error: "Email and password (min 8 chars) are required" });
        }
        if (OWNER_ONLY_MODE && !isOwnerEmail(email)) {
          logSecurityEvent("auth.owner_only_blocked", {
            severity: "medium",
            ip,
            email,
            route: pathname,
            method: req.method,
            reason: "register_denied_owner_only",
            status: 403
          });
          clearAuthCookie(res);
          return json(res, 403, { error: "This app is currently private." });
        }

        if (USE_SUPABASE) {
          const result = await supabaseAuthRequest("/auth/v1/signup", "POST", { email, password });
          const token = result?.session?.access_token || "";
          const expiresIn = Number(result?.session?.expires_in || result?.expires_in || 0);
          const tokenFitsCookie = canSetAuthCookieForToken(token);
          if (token && tokenFitsCookie) setAuthCookie(res, token, { maxAgeSec: expiresIn > 0 ? expiresIn : AUTH_COOKIE_MAX_AGE_SEC });
          const user = result?.user || result;
          if (OWNER_ONLY_MODE && !isOwnerEmail(user?.email || email)) {
            clearAuthCookie(res);
            return json(res, 403, { error: "This app is currently private." });
          }
          return json(res, 200, {
            user: { id: user?.id || "", email: user?.email || email },
            token: token || "",
            auth: { mode: tokenFitsCookie ? "cookie" : "bearer", hasSession: Boolean(token) },
            message: token ? "Registered" : "Registered. Confirm email if your project requires it."
          });
        }

        const users = loadJson(USERS_FILE, []);
        if (users.some((u) => u.email === email)) return json(res, 409, { error: "Email already registered" });

        const user = {
          id: `u_${crypto.randomBytes(8).toString("hex")}`,
          email,
          passwordHash: hashPassword(password),
          displayName: "",
          bio: "",
          avatarDataUrl: "",
          createdAt: new Date().toISOString()
        };
        users.push(user);
        saveJson(USERS_FILE, users);

        const sessions = loadJson(SESSIONS_FILE, []);
        const token = createToken();
        sessions.push({ token, userId: user.id, createdAt: new Date().toISOString(), lastSeenAt: new Date().toISOString() });
        saveJson(SESSIONS_FILE, sessions);
        setAuthCookie(res, token);

        return json(res, 200, { user: { id: user.id, email: user.email }, auth: { mode: "cookie", hasSession: true } });
      }

      if (pathname === "/api/auth/login" && req.method === "POST") {
        if (
          !(await rateLimitOr429(res, `ip:${ip}:auth:login`, RL_AUTH_LOGIN_MAX, RL_AUTH_WINDOW_MS, {
            ip,
            route: pathname,
            method: req.method
          }))
        )
          return;
        const body = parseJsonBody(await readBody(req));
        const email = sanitizeEmail(body.email);
        const password = String(body.password || "");
        if (OWNER_ONLY_MODE && !isOwnerEmail(email)) {
          logSecurityEvent("auth.owner_only_blocked", {
            severity: "medium",
            ip,
            email,
            route: pathname,
            method: req.method,
            reason: "login_denied_owner_only",
            status: 403
          });
          clearAuthCookie(res);
          return json(res, 403, { error: "This app is currently private." });
        }

        if (USE_SUPABASE) {
          try {
            const result = await supabaseAuthRequest("/auth/v1/token?grant_type=password", "POST", { email, password });
            const token = result.access_token;
            const expiresIn = Number(result?.expires_in || 0);
            const loginEmail = sanitizeEmail(result?.user?.email || email);
            if (OWNER_ONLY_MODE && !isOwnerEmail(loginEmail)) {
              clearAuthCookie(res);
              return json(res, 403, { error: "This app is currently private." });
            }
            const tokenFitsCookie = canSetAuthCookieForToken(token);
            if (token && tokenFitsCookie) setAuthCookie(res, token, { maxAgeSec: expiresIn > 0 ? expiresIn : AUTH_COOKIE_MAX_AGE_SEC });
            return json(res, 200, {
              user: { id: result.user?.id || "", email: result.user?.email || email },
              token: token || "",
              auth: { mode: tokenFitsCookie ? "cookie" : "bearer", hasSession: Boolean(token) }
            });
          } catch {
            logSecurityEvent("auth.login_failed", {
              severity: "medium",
              ip,
              route: pathname,
              method: req.method,
              email,
              reason: "invalid_credentials",
              status: 401,
              meta: { provider: "supabase" }
            });
            return json(res, 401, { error: "Invalid credentials" });
          }
        }

        const users = loadJson(USERS_FILE, []);
        const user = users.find((u) => u.email === email);
        if (!user || !verifyPassword(password, user.passwordHash)) {
          logSecurityEvent("auth.login_failed", {
            severity: "medium",
            ip,
            route: pathname,
            method: req.method,
            email,
            reason: "invalid_credentials",
            status: 401,
            meta: { provider: "local" }
          });
          return json(res, 401, { error: "Invalid credentials" });
        }

        const sessions = loadJson(SESSIONS_FILE, []);
        const token = createToken();
        sessions.push({ token, userId: user.id, createdAt: new Date().toISOString(), lastSeenAt: new Date().toISOString() });
        saveJson(SESSIONS_FILE, sessions);
        setAuthCookie(res, token);

        return json(res, 200, { user: { id: user.id, email: user.email }, auth: { mode: "cookie", hasSession: true } });
      }

      if (pathname === "/api/auth/logout" && req.method === "POST") {
        const token = getAuthToken(req);
        clearAuthCookie(res);
        if (USE_SUPABASE) {
          if (!token) return json(res, 200, { ok: true });
          try {
            await supabaseAuthRequest("/auth/v1/logout", "POST", {}, token);
          } catch {
            // Do not leak logout failures to client.
          }
          return json(res, 200, { ok: true });
        }

        if (!token) return json(res, 200, { ok: true });
        const sessions = loadJson(SESSIONS_FILE, []);
        saveJson(SESSIONS_FILE, sessions.filter((s) => s.token !== token));
        return json(res, 200, { ok: true });
      }

      if (pathname === "/api/auth/me" && req.method === "GET") {
        const user = await requireUser(req, res);
        if (!user) return;
        const profile = await getAccountProfile(user);
        return json(res, 200, {
          user: {
            id: user.id,
            email: user.email,
            isOwner: isOwnerUser(user),
            displayName: profile.displayName || "",
            bio: profile.bio || "",
            avatarDataUrl: profile.avatarDataUrl || ""
          }
        });
      }

      if (pathname === "/api/account/profile" && req.method === "GET") {
        const user = await requireUser(req, res);
        if (!user) return;
        const profile = await getAccountProfile(user);
        return json(res, 200, { profile });
      }

      if (pathname === "/api/account/profile" && req.method === "POST") {
        const user = await requireUser(req, res);
        if (!user) return;
        const body = parseJsonBody(await readBody(req));
        const profile = await upsertAccountProfile(user, {
          displayName: body.displayName,
          bio: body.bio,
          avatarDataUrl: body.avatarDataUrl
        });
        try {
          await trackEvent(user, "account.profile_update", {});
        } catch {
          // non-blocking analytics
        }
        return json(res, 200, { profile });
      }

      if (pathname === "/api/account/password" && req.method === "POST") {
        const user = await requireUser(req, res);
        if (!user) return;
        const body = parseJsonBody(await readBody(req));
        const currentPassword = String(body.currentPassword || "");
        const newPassword = String(body.newPassword || "");
        if (!currentPassword || !newPassword || newPassword.length < 8) {
          return json(res, 400, { error: "Current password and new password (min 8 chars) are required." });
        }
        if (currentPassword === newPassword) {
          return json(res, 400, { error: "New password must be different from your current password." });
        }

        if (USE_SUPABASE) {
          await supabaseAuthRequest("/auth/v1/token?grant_type=password", "POST", {
            email: user.email,
            password: currentPassword
          });
          await supabaseAuthRequest("/auth/v1/user", "PUT", { password: newPassword }, user.token);
        } else {
          const users = loadJson(USERS_FILE, []);
          const idx = users.findIndex((u) => String(u.id || "") === String(user.id || ""));
          if (idx < 0) return json(res, 404, { error: "User not found" });
          const row = users[idx];
          if (!verifyPassword(currentPassword, row.passwordHash)) {
            return json(res, 401, { error: "Current password is incorrect." });
          }
          users[idx].passwordHash = hashPassword(newPassword);
          users[idx].updatedAt = new Date().toISOString();
          saveJson(USERS_FILE, users);
        }

        try {
          await trackEvent(user, "account.password_change", {});
        } catch {
          // non-blocking analytics
        }
        return json(res, 200, { ok: true });
      }

      if (pathname === "/api/account/delete" && req.method === "POST") {
        const user = await requireUser(req, res);
        if (!user) return;
        const body = parseJsonBody(await readBody(req));
        const confirmText = String(body.confirmText || "").trim().toUpperCase();
        const password = String(body.password || "");
        if (confirmText !== "DELETE") return json(res, 400, { error: "Type DELETE to confirm account deletion." });
        if (!password) return json(res, 400, { error: "Current password is required." });

        if (USE_SUPABASE) {
          if (!SUPABASE_SERVICE_ROLE_KEY) {
            return json(res, 500, { error: "Account deletion is not configured (missing SUPABASE_SERVICE_ROLE_KEY)." });
          }

          await supabaseAuthRequest("/auth/v1/token?grant_type=password", "POST", {
            email: user.email,
            password
          });

          try {
            await cancelMembershipImmediatelyForUser(user);
          } catch (err) {
            const msg = String(err instanceof Error ? err.message : err || "");
            if (msg) {
              return json(res, 400, {
                error: `Could not cancel membership automatically: ${msg}. Cancel membership first, then delete the account.`
              });
            }
            return json(res, 400, {
              error: "Could not cancel membership automatically. Cancel membership first, then delete the account."
            });
          }

          try {
            await trackEvent(user, "account.delete", { mode: "supabase" });
          } catch {
            // non-blocking analytics
          }
          await deleteSupabaseUserData(user.id);
          await supabaseAdminAuthRequest(`/auth/v1/admin/users/${encodeURIComponent(String(user.id))}`, "DELETE");
        } else {
          const users = loadJson(USERS_FILE, []);
          const row = users.find((u) => String(u.id || "") === String(user.id || ""));
          if (!row) return json(res, 404, { error: "User not found" });
          if (!verifyPassword(password, row.passwordHash)) {
            return json(res, 401, { error: "Current password is incorrect." });
          }
          try {
            await trackEvent(user, "account.delete", { mode: "local" });
          } catch {
            // non-blocking analytics
          }
          deleteLocalUserData(user.id);
        }

        entitlementCache.delete(String(user.id || ""));
        clearAuthCookie(res);
        return json(res, 200, { ok: true });
      }

      if (pathname === "/api/referral/code" && req.method === "GET") {
        const user = await requireUser(req, res);
        if (!user) return;
        const row = upsertReferralUser(user);
        return json(res, 200, { code: row.code, referrals: Number(row.referrals || 0) });
      }

      if (pathname === "/api/referral/apply" && req.method === "POST") {
        const user = await requireUser(req, res);
        if (!user) return;
        const body = parseJsonBody(await readBody(req));
        applyReferral(user, body.code);
        await trackEvent(user, "referral.apply", {});
        return json(res, 200, { ok: true });
      }

      if (pathname === "/api/feedback/report" && req.method === "POST") {
        const user = await requireUser(req, res);
        if (!user) return;
        const body = parseJsonBody(await readBody(req));
        if (!String(body.text || "").trim()) return json(res, 400, { error: "Feedback text is required" });
        saveFeedback(user, body);
        await trackEvent(user, "feedback.report", {});
        return json(res, 200, { ok: true });
      }

      if (pathname === "/api/notes" && req.method === "GET") {
        const user = await requireUser(req, res);
        if (!user) return;
        const notes = await listNotes(user);
        return json(res, 200, { notes });
      }

      if (pathname === "/api/notes" && req.method === "POST") {
        const user = await requireUser(req, res);
        if (!user) return;
        const body = parseJsonBody(await readBody(req));
        const note = await upsertNote(user, body);
        return json(res, 200, { note });
      }

      if (pathname.startsWith("/api/notes/") && req.method === "DELETE") {
        const user = await requireUser(req, res);
        if (!user) return;
        const id = decodeURIComponent(pathname.replace("/api/notes/", ""));
        await deleteNote(user, id);
        return json(res, 200, { ok: true });
      }

      if (pathname === "/api/flashcards" && req.method === "GET") {
        const user = await requireUser(req, res);
        if (!user) return;
        const dueOnly = reqUrl.searchParams.get("due") === "1";
        const limit = Number(reqUrl.searchParams.get("limit") || 50);
        const cards = await listFlashcards(user, { dueOnly, limit });
        return json(res, 200, { flashcards: cards });
      }

      if (pathname === "/api/flashcards" && req.method === "POST") {
        const user = await requireUser(req, res);
        if (!user) return;
        const body = parseJsonBody(await readBody(req));
        const card = await upsertFlashcard(user, body);
        return json(res, 200, { flashcard: card });
      }

      if (pathname.startsWith("/api/flashcards/") && req.method === "DELETE") {
        const user = await requireUser(req, res);
        if (!user) return;
        const id = decodeURIComponent(pathname.replace("/api/flashcards/", ""));
        await deleteFlashcard(user, id);
        return json(res, 200, { ok: true });
      }

      if (pathname === "/api/flashcards/generate" && req.method === "POST") {
        const user = await requireUser(req, res);
        if (!user) return;
        if (!OPENAI_API_KEY) return json(res, 400, { error: "Missing OPENAI_API_KEY" });
        if (
          !(await rateLimitOr429(res, `ip:${ip}:ai:flashcards`, RL_AI_MAX_PER_IP, RL_AI_WINDOW_MS, {
            ip,
            route: pathname,
            method: req.method,
            userId: user.id
          }))
        )
          return;
        if (
          !(await rateLimitOr429(res, `user:${user.id}:ai:flashcards`, RL_AI_MAX_PER_USER, RL_AI_WINDOW_MS, {
            ip,
            route: pathname,
            method: req.method,
            userId: user.id
          }))
        )
          return;
        const tier = await getCachedEntitlements(user);
        const limits = usageLimitsForTier(tier);
        if (
          !(await enforceUsageOr429(res, user, {
            scope: "flashcard_gen",
            inc: 1,
            limit: limits.flashcard_gen,
            message: "Daily flashcard generation limit reached. Try again tomorrow or upgrade."
          }))
        )
          return;
        const body = parseJsonBody(await readBody(req));
        const noteText = String(body.noteText || "");
        const noteId = body.noteId ? String(body.noteId) : null;
        const count = Number(body.count || 10);
        if (!noteText.trim()) return json(res, 400, { error: "noteText is required" });

        const sources = normalizeImportedSources(body.sources, { maxSources: 6, maxCharsPerSource: 18000 });
        const gen = await generateFlashcardsFromText(noteText, count, sources);
        const created = [];
        for (const c of gen) {
          const citations = Array.isArray(c.citations) ? c.citations : [];
          const backWithCitations =
            citations.length > 0 ? `${c.back}\n\nSources: ${citations.map((x) => `[${x}]`).join(" ")}` : c.back;
          created.push(
            await upsertFlashcard(user, {
              noteId,
              front: c.front,
              back: backWithCitations,
              tags: c.tags,
              dueAt: new Date().toISOString(),
              ease: 2.5,
              intervalDays: 0,
              reps: 0,
              lapses: 0
            })
          );
        }
        return json(res, 200, { created, citations: citationsFromSources(sources) });
      }

      if (pathname === "/api/flashcards/review" && req.method === "POST") {
        const user = await requireUser(req, res);
        if (!user) return;
        const body = parseJsonBody(await readBody(req));
        const id = String(body.id || "");
        const grade = Number(body.grade);
        if (!id) return json(res, 400, { error: "id is required" });
        if (![0, 1, 2, 3].includes(grade)) return json(res, 400, { error: "grade must be 0-3" });

        const cards = await listFlashcards(user, { dueOnly: false, limit: 500 });
        const current = cards.find((c) => String(c.id) === id);
        if (!current) return json(res, 404, { error: "Not found" });

        const next = scheduleReview(current, grade);
        const updated = await upsertFlashcard(user, { ...current, ...next });
        return json(res, 200, { flashcard: updated });
      }

      if (pathname === "/api/flashcards/stats" && req.method === "GET") {
        const user = await requireUser(req, res);
        if (!user) return;
        const due = await listFlashcards(user, { dueOnly: true, limit: 1000 });
        return json(res, 200, { dueCount: due.length });
      }

      if (pathname === "/api/learning/plan" && req.method === "GET") {
        const user = await requireUser(req, res);
        if (!user) return;
        const plan = await buildLearningPlan(user);
        return json(res, 200, plan);
      }

      if (pathname === "/api/study/plan" && req.method === "POST") {
        const user = await requireUser(req, res);
        if (!user) return;
        const body = parseJsonBody(await readBody(req));
        const out = await generateStudyPlan(user, body.days, body.minutesPerDay);
        return json(res, 200, out);
      }

      if (pathname === "/api/ai" && req.method === "POST") {
        const user = await requireUser(req, res);
        if (!user) return;
        if (!OPENAI_API_KEY) return json(res, 400, { error: "Missing OPENAI_API_KEY" });
        if (
          !(await rateLimitOr429(res, `ip:${ip}:ai:generic`, RL_AI_MAX_PER_IP, RL_AI_WINDOW_MS, {
            ip,
            route: pathname,
            method: req.method,
            userId: user.id
          }))
        )
          return;
        if (
          !(await rateLimitOr429(res, `user:${user.id}:ai:generic`, RL_AI_MAX_PER_USER, RL_AI_WINDOW_MS, {
            ip,
            route: pathname,
            method: req.method,
            userId: user.id
          }))
        )
          return;
        const tier = await getCachedEntitlements(user);
        const limits = usageLimitsForTier(tier);
        if (
          !(await enforceUsageOr429(res, user, {
            scope: "ai_output",
            inc: 1,
            limit: limits.ai_output,
            message: "Daily AI limit reached. Try again tomorrow or upgrade."
          }))
        )
          return;
        const body = parseJsonBody(await readBody(req));
        const action = String(body.action || "summarize");
        const noteText = String(body.noteText || "");
        const selectedText = String(body.selectedText || "");
        const sources = normalizeImportedSources(body.sources, { maxSources: 6, maxCharsPerSource: 18000 });
        if (!noteText.trim() && !sources.length) return json(res, 400, { error: "noteText or sources are required" });
        const output = await runAiAction(action, noteText, selectedText, sources);
        return json(res, 200, { output, citations: citationsFromSources(sources) });
      }

      if (pathname === "/api/tutor" && req.method === "POST") {
        const user = await requireUser(req, res);
        if (!user) return;
        if (!OPENAI_API_KEY) return json(res, 400, { error: "Missing OPENAI_API_KEY" });
        if (
          !(await rateLimitOr429(res, `ip:${ip}:ai:tutor`, RL_AI_MAX_PER_IP, RL_AI_WINDOW_MS, {
            ip,
            route: pathname,
            method: req.method,
            userId: user.id
          }))
        )
          return;
        if (
          !(await rateLimitOr429(res, `user:${user.id}:ai:tutor`, RL_AI_MAX_PER_USER, RL_AI_WINDOW_MS, {
            ip,
            route: pathname,
            method: req.method,
            userId: user.id
          }))
        )
          return;
        const tier = await getCachedEntitlements(user);
        const limits = usageLimitsForTier(tier);
        if (
          !(await enforceUsageOr429(res, user, {
            scope: "ai_output",
            inc: 1,
            limit: limits.ai_output,
            message: "Daily AI limit reached. Try again tomorrow or upgrade."
          }))
        )
          return;
        const body = parseJsonBody(await readBody(req));
        const noteText = String(body.noteText || "");
        const question = String(body.question || "");
        const preferWebSearch = Boolean(body.preferWebSearch);
        let sources = normalizeImportedSources(body.sources, { maxSources: 6, maxCharsPerSource: 18000 });
        if (!question.trim()) return json(res, 400, { error: "question is required" });
        let mode = "local_context";
        let tutorNoteText = noteText;

        if (preferWebSearch) {
          const webSources = await buildLearningSearchSources(question, { maxSources: 6 });
          if (webSources.length) {
            sources = webSources;
            tutorNoteText = "";
            mode = "web_search";
          } else if (!tutorNoteText.trim() && !sources.length) {
            return json(res, 502, { error: "Could not find web results right now. Try a more specific query." });
          }
        } else if (!tutorNoteText.trim() && !sources.length) {
          sources = await buildLearningSearchSources(question, { maxSources: 6 });
          mode = "web_search";
          if (!sources.length) {
            return json(res, 502, { error: "Could not find web results right now. Try a more specific query." });
          }
        }
        const answer = await runTutorAnswer(tutorNoteText, question, sources, { mode });
        return json(res, 200, { answer, citations: citationsFromSources(sources), mode });
      }

      if (pathname === "/api/assistant/chat" && req.method === "POST") {
        const user = await requireUser(req, res);
        if (!user) return;
        if (!isOwnerUser(user)) {
          logSecurityEvent("auth.owner_forbidden", {
            severity: "medium",
            ip,
            userId: user.id,
            route: pathname,
            method: req.method,
            reason: "assistant_chat_owner_only",
            status: 403
          });
          return json(res, 403, { error: "Forbidden" });
        }
        if (!OPENAI_API_KEY) return json(res, 400, { error: "Missing OPENAI_API_KEY" });
        if (
          !(await rateLimitOr429(res, `ip:${ip}:ai:assistant`, RL_AI_MAX_PER_IP, RL_AI_WINDOW_MS, {
            ip,
            route: pathname,
            method: req.method,
            userId: user.id
          }))
        )
          return;
        if (
          !(await rateLimitOr429(res, `user:${user.id}:ai:assistant`, RL_AI_MAX_PER_USER, RL_AI_WINDOW_MS, {
            ip,
            route: pathname,
            method: req.method,
            userId: user.id
          }))
        )
          return;
        const tier = await getCachedEntitlements(user);
        const limits = usageLimitsForTier(tier);
        if (
          !(await enforceUsageOr429(res, user, {
            scope: "ai_output",
            inc: 1,
            limit: limits.ai_output,
            message: "Daily chat limit reached. Try again tomorrow or upgrade."
          }))
        )
          return;
        const body = parseJsonBody(await readBody(req));
        const messages = sanitizeChatMessages(body.messages, { maxMessages: 12, maxChars: 2000 });
        const clientContext = body.clientContext && typeof body.clientContext === "object" ? body.clientContext : {};
        const answer = await runBuilderAssistantChat(user, messages, clientContext);
        await trackEvent(user, "assistant.chat", { messages: messages.length });
        return json(res, 200, { answer });
      }

      if (pathname === "/api/share/create" && req.method === "POST") {
        const user = await requireUser(req, res);
        if (!user) return;
        const body = parseJsonBody(await readBody(req));
        const shareId = createShareEntry(user, body);
        await trackEvent(user, "share.create", {});
        return json(res, 200, { shareId });
      }

      if (pathname === "/api/sources/import" && req.method === "POST") {
        const user = await requireUser(req, res);
        if (!user) return;
        if (
          !(await rateLimitOr429(res, `ip:${ip}:ai:sources`, RL_AI_MAX_PER_IP, RL_AI_WINDOW_MS, {
            ip,
            route: pathname,
            method: req.method,
            userId: user.id
          }))
        )
          return;
        if (
          !(await rateLimitOr429(res, `user:${user.id}:ai:sources`, RL_AI_MAX_PER_USER, RL_AI_WINDOW_MS, {
            ip,
            route: pathname,
            method: req.method,
            userId: user.id
          }))
        )
          return;
        const body = parseJsonBody(await readBody(req, { maxBytes: DEFAULT_MAX_BODY_BYTES }));
        const tier = await getCachedEntitlements(user);
        const limits = usageLimitsForTier(tier);
        const fileSources = Array.isArray(body.sources) ? body.sources : [];
        const urls = Array.isArray(body.urls) ? body.urls : [];
        const requestedFileCount = Math.min(20, fileSources.length);
        const requestedUrlCount = Math.min(8, urls.length);
        const requested = requestedFileCount + requestedUrlCount;
        const imageCount = fileSources
          .slice(0, 20)
          .filter((s) => String(s?.kind || "") === "image").length;
        const mediaCount = fileSources
          .slice(0, 20)
          .filter((s) => String(s?.kind || "") === "media").length;
        if (imageCount > 0 && !OPENAI_API_KEY) {
          return json(res, 503, { error: "Image screenshot import is unavailable (missing OPENAI_API_KEY)." });
        }
        if (requested > 0) {
          if (
            !(await enforceUsageOr429(res, user, {
              scope: "source_import",
              inc: requested,
              limit: limits.source_import,
              message: "Daily import limit reached. Try again tomorrow or upgrade."
            }))
          )
            return;
        }
        if (mediaCount > 0 && OPENAI_API_KEY) {
          if (
            !(await enforceUsageOr429(res, user, {
              scope: "transcribe",
              inc: mediaCount,
              limit: limits.transcribe,
              message: "Daily transcription limit reached. Try again tomorrow or upgrade."
            }))
          )
            return;
        }
        let imported = [];
        try {
          imported = await importSources(body);
        } catch (e) {
          const message = e instanceof Error ? e.message : "Import failed";
          const looksSecurityBlocked = /Blocked host for security reasons|Could not resolve host|Only http\/https URLs are supported|URLs with credentials are not allowed|Only ports 80 and 443 are allowed|Invalid URL/i.test(
            message
          );
          if (looksSecurityBlocked) {
            logSecurityEvent("sources.import_url_blocked", {
              severity: "high",
              ip,
              userId: user.id,
              route: pathname,
              method: req.method,
              reason: message,
              status: 400,
              meta: { requestedUrls: urls.length }
            });
            return json(res, 400, { error: message });
          }
          throw e;
        }
        if (!imported.length) {
          return json(res, 400, { error: "No readable sources were imported" });
        }
        await trackEvent(user, "sources.import", {
          count: imported.length,
          fromFiles: imported.filter((i) => i.kind !== "url" && i.kind !== "youtube").length,
          fromUrls: imported.filter((i) => i.kind === "url").length
        });
        return json(res, 200, { imported });
      }

      if (pathname === "/api/transcribe" && req.method === "POST") {
        const user = await requireUser(req, res);
        if (!user) return;
        if (
          !(await rateLimitOr429(res, `ip:${ip}:ai:transcribe`, RL_AI_MAX_PER_IP, RL_AI_WINDOW_MS, {
            ip,
            route: pathname,
            method: req.method,
            userId: user.id
          }))
        )
          return;
        if (
          !(await rateLimitOr429(res, `user:${user.id}:ai:transcribe`, RL_AI_MAX_PER_USER, RL_AI_WINDOW_MS, {
            ip,
            route: pathname,
            method: req.method,
            userId: user.id
          }))
        )
          return;
        const tier = await getCachedEntitlements(user);
        const limits = usageLimitsForTier(tier);
        if (
          !(await enforceUsageOr429(res, user, {
            scope: "transcribe",
            inc: 1,
            limit: limits.transcribe,
            message: "Daily transcription limit reached. Try again tomorrow or upgrade."
          }))
        )
          return;
        const body = parseJsonBody(await readBody(req, { maxBytes: TRANSCRIBE_MAX_BODY_BYTES }));
        const text = await transcribeAudio(body.audioBase64, body.mimeType);
        return json(res, 200, { text });
      }

      if (pathname === "/api/testprep/generate" && req.method === "POST") {
        const user = await requireUser(req, res);
        if (!user) return;
        if (!OPENAI_API_KEY) return json(res, 400, { error: "Missing OPENAI_API_KEY" });
        if (
          !(await rateLimitOr429(res, `ip:${ip}:ai:testprep`, RL_AI_MAX_PER_IP, RL_AI_WINDOW_MS, {
            ip,
            route: pathname,
            method: req.method,
            userId: user.id
          }))
        )
          return;
        if (
          !(await rateLimitOr429(res, `user:${user.id}:ai:testprep`, RL_AI_MAX_PER_USER, RL_AI_WINDOW_MS, {
            ip,
            route: pathname,
            method: req.method,
            userId: user.id
          }))
        )
          return;
        const tier = await getCachedEntitlements(user);
        const limits = usageLimitsForTier(tier);
        if (
          !(await enforceUsageOr429(res, user, {
            scope: "ai_output",
            inc: 1,
            limit: limits.ai_output,
            message: "Daily AI limit reached. Try again tomorrow or upgrade."
          }))
        )
          return;
        const body = parseJsonBody(await readBody(req));
        const noteText = String(body.noteText || "");
        const numQuestions = Number(body.numQuestions || 8);
        const mode = String(body.mode || "standard");
        if (!noteText.trim()) return json(res, 400, { error: "noteText is required" });
        const sources = normalizeImportedSources(body.sources, { maxSources: 6, maxCharsPerSource: 18000 });
        const out = await generateTestPrep(noteText, numQuestions, mode, sources);
        return json(res, 200, { ...out, citations: citationsFromSources(sources) });
      }

      return json(res, 404, { error: "Not found" });
    }

    const relativePath = pathname === "/" ? "/index.html" : pathname;
    const filePath = path.join(PUBLIC_DIR, relativePath);
    sendFile(req, res, filePath);
  } catch (error) {
    const status = error && typeof error === "object" && error.statusCode ? Number(error.statusCode) : 500;
    const message = error instanceof Error ? error.message : "Unexpected error";
    if (status >= 500) {
      logSecurityEvent("server.error_5xx", {
        severity: "high",
        ip: getClientIp(req),
        route: safeRequestPath(req),
        method: req.method,
        reason: message,
        status,
        meta: { requestId }
      });
    }
    try {
      console.error(`[${requestId}] ${req.method} ${String(req.url || "")} -> ${status}:`, error);
    } catch {
      // ignore logging errors
    }
    json(res, status, { error: status === 500 && IS_PROD ? "Internal server error" : message });
  }
});

server.listen(PORT, HOST, () => {
  ensureJsonFile(USERS_FILE, []);
  ensureJsonFile(SESSIONS_FILE, []);
  ensureJsonFile(ACCOUNT_PROFILES_FILE, []);
  ensureJsonFile(NOTES_FILE, []);
  ensureJsonFile(FLASHCARDS_FILE, []);
  ensureJsonFile(ANALYTICS_FILE, []);
  ensureJsonFile(ONBOARDING_FILE, []);
  ensureJsonFile(SHARES_FILE, []);
  ensureJsonFile(REFERRALS_FILE, []);
  ensureJsonFile(FEEDBACK_FILE, []);
  ensureJsonFile(USAGE_COUNTERS_FILE, {});
  ensureJsonFile(SECURITY_EVENTS_FILE, []);
  ensureJsonFile(SECURITY_ALERTS_FILE, []);
  initializeSecurityMonitoringState();
  console.log(`AI note app running on http://${HOST}:${PORT}`);
  console.log(`Storage mode: ${USE_SUPABASE ? "Supabase RLS mode" : "Local fallback mode"}`);
});
