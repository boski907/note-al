const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
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
const DEFAULT_MAX_BODY_BYTES = Number(process.env.MAX_BODY_BYTES || 12_000_000); // 12MB
const TRANSCRIBE_MAX_BODY_BYTES = Number(process.env.TRANSCRIBE_MAX_BODY_BYTES || 20_000_000); // 20MB (base64 JSON)
const STRIPE_WEBHOOK_MAX_BODY_BYTES = Number(process.env.STRIPE_WEBHOOK_MAX_BODY_BYTES || 2_000_000); // 2MB

const RATE_LIMIT_ENABLED = (process.env.RATE_LIMIT_ENABLED || (IS_PROD ? "1" : "0")) !== "0";
const RL_AUTH_WINDOW_MS = Number(process.env.RL_AUTH_WINDOW_MS || 10 * 60 * 1000); // 10 min
const RL_AUTH_LOGIN_MAX = Number(process.env.RL_AUTH_LOGIN_MAX || 20);
const RL_AUTH_REGISTER_MAX = Number(process.env.RL_AUTH_REGISTER_MAX || 10);

const RL_AI_WINDOW_MS = Number(process.env.RL_AI_WINDOW_MS || 60 * 1000); // 1 min
const RL_AI_MAX_PER_IP = Number(process.env.RL_AI_MAX_PER_IP || 30);
const RL_AI_MAX_PER_USER = Number(process.env.RL_AI_MAX_PER_USER || 60);

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

// Owner-only features (like the in-app Builder chatbox). Comma-separated emails.
const OWNER_EMAILS = (process.env.OWNER_EMAILS || "lboski@live.com")
  .split(",")
  .map((x) => String(x || "").trim().toLowerCase())
  .filter(Boolean);

const APP_BASE_URL = process.env.APP_BASE_URL || `http://${HOST}:${PORT}`;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const STRIPE_PRICE_ID_PREMIUM_10 =
  process.env.STRIPE_PRICE_ID_PREMIUM_10 || process.env.STRIPE_PRICE_ID_ADFREE_599 || "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

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
const USAGE_COUNTERS_FILE = path.join(DATA_DIR, "usage_counters.json");

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

function securityHeaders() {
  const headers = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "Referrer-Policy": "strict-origin-when-cross-origin",
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

function applyCors(req, res) {
  const origin = req.headers.origin || "";
  const allowed = getCorsAllowedOrigin(origin);
  if (!allowed) return;
  res.setHeader("Access-Control-Allow-Origin", allowed);
  res.setHeader("Vary", "Origin");
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

function getAuthToken(req) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return "";
  return header.slice(7).trim();
}

const _rateBuckets = new Map();
function rateLimitConsume(key, limit, windowMs) {
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

function rateLimitOr429(res, key, limit, windowMs) {
  if (!RATE_LIMIT_ENABLED) return true;
  const out = rateLimitConsume(key, limit, windowMs);
  if (out.ok) return true;
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

  const value = { adFree };
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

function isOwnerUser(user) {
  const email = sanitizeEmail(user?.email || "");
  if (!email) return false;
  return OWNER_EMAILS.includes(email);
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

async function requireUser(req, res) {
  const token = getAuthToken(req);
  if (!token) {
    json(res, 401, { error: "Unauthorized" });
    return null;
  }

  if (USE_SUPABASE) {
    try {
      const user = await supabaseAuthRequest("/auth/v1/user", "GET", null, token);
      return { id: user.id, email: user.email, token };
    } catch {
      json(res, 401, { error: "Unauthorized" });
      return null;
    }
  }

  const sessions = loadJson(SESSIONS_FILE, []);
  const session = sessions.find((s) => s.token === token);
  if (!session) {
    json(res, 401, { error: "Unauthorized" });
    return null;
  }

  const users = loadJson(USERS_FILE, []);
  const user = users.find((u) => u.id === session.userId);
  if (!user) {
    json(res, 401, { error: "Unauthorized" });
    return null;
  }

  session.lastSeenAt = new Date().toISOString();
  saveJson(SESSIONS_FILE, sessions);
  return { id: user.id, email: user.email, token };
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
    return (rows || []).map((r) => ({
      id: r.id,
      title: r.title || "Untitled",
      contentText: r.content_text || "",
      contentHtml: r.content_html || "",
      tags: Array.isArray(r.tags) ? r.tags : [],
      updatedAt: r.updated_at || new Date().toISOString()
    }));
  }

  const notes = loadJson(NOTES_FILE, []);
  return notes
    .filter((n) => n.userId === user.id)
    .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
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
  items.push({
    id,
    userId: user.id,
    noteId: String(payload.noteId || ""),
    title: String(payload.title || "Shared note").slice(0, 160),
    contentText: String(payload.contentText || "").slice(0, 300000),
    contentHtml: String(payload.contentHtml || "").slice(0, 300000),
    createdAt: new Date().toISOString()
  });
  saveJson(SHARES_FILE, items.slice(-2000));
  return id;
}

function getShareEntry(shareId) {
  const items = loadJson(SHARES_FILE, []);
  return items.find((x) => x.id === shareId) || null;
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

async function upsertNote(user, payload) {
  const now = new Date().toISOString();
  const note = {
    id: payload.id ? String(payload.id) : crypto.randomUUID(),
    title: String(payload.title || "").trim().slice(0, 160) || "Untitled",
    contentText: String(payload.contentText || ""),
    contentHtml: String(payload.contentHtml || ""),
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
    return {
      id: row.id || note.id,
      title: row.title || note.title,
      contentText: row.content_text || note.contentText,
      contentHtml: row.content_html || note.contentHtml,
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

async function buildLearningPlan(user) {
  const cards = await listFlashcards(user, { dueOnly: false, limit: 5000 });
  const dueCards = await listFlashcards(user, { dueOnly: true, limit: 2000 });
  const notes = await listNotes(user);

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

function normalizeImportedSources(rawSources, { maxSources = 6, maxCharsPerSource = 18000 } = {}) {
  const arr = Array.isArray(rawSources) ? rawSources : [];
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
  return srcs.map((s) => ({ id: s.id, name: s.name, url: s.url || "" }));
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

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 9000);
  let response;
  try {
    response = await fetch(raw, {
      method: "GET",
      redirect: "follow",
      signal: ac.signal,
      headers: {
        "User-Agent": "NotematicaSourceFetcher/1.0"
      }
    });
  } finally {
    clearTimeout(timer);
  }

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

async function importSources(body) {
  const fileSources = Array.isArray(body.sources) ? body.sources : [];
  const urls = Array.isArray(body.urls) ? body.urls : [];
  const out = [];

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

  return out;
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

async function runTutorAnswer(noteText, question, sources = []) {
  if (!OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY");
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
            "You are a study tutor. Use ONLY the provided context (note + sources). If uncertain, say what is missing. When you state a factual claim derived from sources, add bracket citations like [S1] inline."
        },
        {
          role: "user",
          content: `Context note:\n${noteText}\n\n${srcBlock ? `Sources:\n${srcBlock}\n\n` : ""}Student question:\n${question}\n\nRespond with: direct answer, short explanation, and one follow-up question.`
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
      if (pathname === "/api/health" && req.method === "GET") {
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
        if (!USE_SUPABASE) return json(res, 400, { error: "Billing requires Supabase mode" });
        if (!STRIPE_SECRET_KEY) return json(res, 400, { error: "Stripe is not configured" });
        const out = await computeAdFreeStatus(user);
        return json(res, 200, out);
      }

      if (pathname === "/api/ads/check" && req.method === "GET") {
        const user = await requireUser(req, res);
        if (!user) return;
        let adFree = false;
        if (USE_SUPABASE && STRIPE_SECRET_KEY) {
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

      if (pathname.startsWith("/api/share/") && req.method === "GET") {
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
        if (!rateLimitOr429(res, `ip:${ip}:auth:register`, RL_AUTH_REGISTER_MAX, RL_AUTH_WINDOW_MS)) return;
        const body = parseJsonBody(await readBody(req));
        const email = sanitizeEmail(body.email);
        const password = String(body.password || "");

        if (!email || !password || password.length < 8) {
          return json(res, 400, { error: "Email and password (min 8 chars) are required" });
        }

        if (USE_SUPABASE) {
          const result = await supabaseAuthRequest("/auth/v1/signup", "POST", { email, password });
          const token = result?.session?.access_token || "";
          const user = result?.user || result;
          return json(res, 200, {
            token,
            user: { id: user?.id || "", email: user?.email || email },
            message: token ? "Registered" : "Registered. Confirm email if your project requires it."
          });
        }

        const users = loadJson(USERS_FILE, []);
        if (users.some((u) => u.email === email)) return json(res, 409, { error: "Email already registered" });

        const user = {
          id: `u_${crypto.randomBytes(8).toString("hex")}`,
          email,
          passwordHash: hashPassword(password),
          createdAt: new Date().toISOString()
        };
        users.push(user);
        saveJson(USERS_FILE, users);

        const sessions = loadJson(SESSIONS_FILE, []);
        const token = createToken();
        sessions.push({ token, userId: user.id, createdAt: new Date().toISOString(), lastSeenAt: new Date().toISOString() });
        saveJson(SESSIONS_FILE, sessions);

        return json(res, 200, { token, user: { id: user.id, email: user.email } });
      }

      if (pathname === "/api/auth/login" && req.method === "POST") {
        if (!rateLimitOr429(res, `ip:${ip}:auth:login`, RL_AUTH_LOGIN_MAX, RL_AUTH_WINDOW_MS)) return;
        const body = parseJsonBody(await readBody(req));
        const email = sanitizeEmail(body.email);
        const password = String(body.password || "");

        if (USE_SUPABASE) {
          const result = await supabaseAuthRequest("/auth/v1/token?grant_type=password", "POST", { email, password });
          return json(res, 200, {
            token: result.access_token,
            user: { id: result.user?.id || "", email: result.user?.email || email }
          });
        }

        const users = loadJson(USERS_FILE, []);
        const user = users.find((u) => u.email === email);
        if (!user || !verifyPassword(password, user.passwordHash)) {
          return json(res, 401, { error: "Invalid credentials" });
        }

        const sessions = loadJson(SESSIONS_FILE, []);
        const token = createToken();
        sessions.push({ token, userId: user.id, createdAt: new Date().toISOString(), lastSeenAt: new Date().toISOString() });
        saveJson(SESSIONS_FILE, sessions);

        return json(res, 200, { token, user: { id: user.id, email: user.email } });
      }

      if (pathname === "/api/auth/logout" && req.method === "POST") {
        const token = getAuthToken(req);
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
        return json(res, 200, { user: { id: user.id, email: user.email, isOwner: isOwnerUser(user) } });
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
        if (!rateLimitOr429(res, `ip:${ip}:ai:flashcards`, RL_AI_MAX_PER_IP, RL_AI_WINDOW_MS)) return;
        if (!rateLimitOr429(res, `user:${user.id}:ai:flashcards`, RL_AI_MAX_PER_USER, RL_AI_WINDOW_MS)) return;
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
        if (!rateLimitOr429(res, `ip:${ip}:ai:generic`, RL_AI_MAX_PER_IP, RL_AI_WINDOW_MS)) return;
        if (!rateLimitOr429(res, `user:${user.id}:ai:generic`, RL_AI_MAX_PER_USER, RL_AI_WINDOW_MS)) return;
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

        if (!noteText.trim()) return json(res, 400, { error: "noteText is required" });

        const sources = normalizeImportedSources(body.sources, { maxSources: 6, maxCharsPerSource: 18000 });
        const output = await runAiAction(action, noteText, selectedText, sources);
        return json(res, 200, { output, citations: citationsFromSources(sources) });
      }

      if (pathname === "/api/tutor" && req.method === "POST") {
        const user = await requireUser(req, res);
        if (!user) return;
        if (!OPENAI_API_KEY) return json(res, 400, { error: "Missing OPENAI_API_KEY" });
        if (!rateLimitOr429(res, `ip:${ip}:ai:tutor`, RL_AI_MAX_PER_IP, RL_AI_WINDOW_MS)) return;
        if (!rateLimitOr429(res, `user:${user.id}:ai:tutor`, RL_AI_MAX_PER_USER, RL_AI_WINDOW_MS)) return;
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
        if (!noteText.trim() || !question.trim()) return json(res, 400, { error: "noteText and question are required" });
        const sources = normalizeImportedSources(body.sources, { maxSources: 6, maxCharsPerSource: 18000 });
        const answer = await runTutorAnswer(noteText, question, sources);
        return json(res, 200, { answer, citations: citationsFromSources(sources) });
      }

      if (pathname === "/api/assistant/chat" && req.method === "POST") {
        const user = await requireUser(req, res);
        if (!user) return;
        if (!isOwnerUser(user)) return json(res, 403, { error: "Forbidden" });
        if (!OPENAI_API_KEY) return json(res, 400, { error: "Missing OPENAI_API_KEY" });
        if (!rateLimitOr429(res, `ip:${ip}:ai:assistant`, RL_AI_MAX_PER_IP, RL_AI_WINDOW_MS)) return;
        if (!rateLimitOr429(res, `user:${user.id}:ai:assistant`, RL_AI_MAX_PER_USER, RL_AI_WINDOW_MS)) return;
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
        if (!rateLimitOr429(res, `ip:${ip}:ai:sources`, RL_AI_MAX_PER_IP, RL_AI_WINDOW_MS)) return;
        if (!rateLimitOr429(res, `user:${user.id}:ai:sources`, RL_AI_MAX_PER_USER, RL_AI_WINDOW_MS)) return;
        const body = parseJsonBody(await readBody(req, { maxBytes: DEFAULT_MAX_BODY_BYTES }));
        const tier = await getCachedEntitlements(user);
        const limits = usageLimitsForTier(tier);
        const fileSources = Array.isArray(body.sources) ? body.sources : [];
        const urls = Array.isArray(body.urls) ? body.urls : [];
        const requestedFileCount = Math.min(20, fileSources.length);
        const requestedUrlCount = Math.min(8, urls.length);
        const requested = requestedFileCount + requestedUrlCount;
        const mediaCount = fileSources
          .slice(0, 20)
          .filter((s) => String(s?.kind || "") === "media").length;
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
        const imported = await importSources(body);
        if (!imported.length) {
          return json(res, 400, { error: "No readable sources were imported" });
        }
        await trackEvent(user, "sources.import", {
          count: imported.length,
          fromFiles: imported.filter((i) => i.kind === "file").length,
          fromUrls: imported.filter((i) => i.kind === "url").length
        });
        return json(res, 200, { imported });
      }

      if (pathname === "/api/transcribe" && req.method === "POST") {
        const user = await requireUser(req, res);
        if (!user) return;
        if (!rateLimitOr429(res, `ip:${ip}:ai:transcribe`, RL_AI_MAX_PER_IP, RL_AI_WINDOW_MS)) return;
        if (!rateLimitOr429(res, `user:${user.id}:ai:transcribe`, RL_AI_MAX_PER_USER, RL_AI_WINDOW_MS)) return;
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
        if (!rateLimitOr429(res, `ip:${ip}:ai:testprep`, RL_AI_MAX_PER_IP, RL_AI_WINDOW_MS)) return;
        if (!rateLimitOr429(res, `user:${user.id}:ai:testprep`, RL_AI_MAX_PER_USER, RL_AI_WINDOW_MS)) return;
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
  ensureJsonFile(NOTES_FILE, []);
  ensureJsonFile(FLASHCARDS_FILE, []);
  ensureJsonFile(ANALYTICS_FILE, []);
  ensureJsonFile(ONBOARDING_FILE, []);
  ensureJsonFile(SHARES_FILE, []);
  ensureJsonFile(REFERRALS_FILE, []);
  ensureJsonFile(FEEDBACK_FILE, []);
  ensureJsonFile(USAGE_COUNTERS_FILE, {});
  console.log(`AI note app running on http://${HOST}:${PORT}`);
  console.log(`Storage mode: ${USE_SUPABASE ? "Supabase RLS mode" : "Local fallback mode"}`);
});
