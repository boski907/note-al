const authCardEl = document.getElementById("auth-card");
const workspaceEl = document.getElementById("workspace");
const logoutBtn = document.getElementById("logout-btn");
const authStatusEl = document.getElementById("auth-status");
const cloudBadgeEl = document.getElementById("cloud-badge");
const subscribeBtn = document.getElementById("subscribe-btn");
const manageBtn = document.getElementById("manage-btn");
const billingStatusEl = document.getElementById("billing-status");
const metricTotalEl = document.getElementById("metric-total");
const metricTopEventEl = document.getElementById("metric-top-event");
const metricFlashcardsEl = document.getElementById("metric-flashcards");
const metricAiEl = document.getElementById("metric-ai");
const refreshLearningBtn = document.getElementById("refresh-learning-btn");
const learningStatusEl = document.getElementById("learning-status");
const learningMasteryEl = document.getElementById("learning-mastery");
const learningDueEl = document.getElementById("learning-due");
const learningFocusEl = document.getElementById("learning-focus");
const learningNextEl = document.getElementById("learning-next");
const upgradeLearningBtn = document.getElementById("upgrade-learning-btn");
const adCheckBtn = document.getElementById("ad-check-btn");
const adCheckStatusEl = document.getElementById("ad-check-status");

const notesListEl = document.getElementById("notes-list");
const searchInputEl = document.getElementById("search-input");
const titleEl = document.getElementById("note-title");
const tagsEl = document.getElementById("note-tags");
const editorEl = document.getElementById("note-editor");
const newBtn = document.getElementById("new-note-btn");
const saveBtn = document.getElementById("save-btn");
const deleteBtn = document.getElementById("delete-btn");
const aiOutputEl = document.getElementById("ai-output");
const aiButtons = [...document.querySelectorAll("[data-ai]")];
const feedbackAiBtn = document.querySelector('[data-ai="feedback"]');
const upgradeAiBtn = document.getElementById("upgrade-ai-btn");
const formatButtons = [...document.querySelectorAll("[data-cmd]")];
const clearFormatBtn = document.getElementById("clear-format-btn");
const recordBtn = document.getElementById("record-btn");
const genCardsBtn = document.getElementById("gen-cards-btn");
const studyBtn = document.getElementById("study-btn");
const testprepBtn = document.getElementById("testprep-btn");
const sourceFilesEl = document.getElementById("source-files");
const sourceUrlsEl = document.getElementById("source-urls");
const importFilesBtn = document.getElementById("import-files-btn");
const importUrlsBtn = document.getElementById("import-urls-btn");
const upgradeSourcesBtn = document.getElementById("upgrade-sources-btn");
const sourceStatusEl = document.getElementById("source-status");

const overlayEl = document.getElementById("study-overlay");
const overlayTitleEl = document.getElementById("overlay-title");
const overlayBodyEl = document.getElementById("overlay-body");
const overlayCloseEl = document.getElementById("overlay-close");
const analyticsStatusEl = document.getElementById("analytics-status");

const onboardingOverlayEl = document.getElementById("onboarding-overlay");
const onboardingCloseEl = document.getElementById("onboarding-close");
const onboardingStartEl = document.getElementById("onboarding-start");
const onboardingStudyEl = document.getElementById("onboarding-study");
const onboardingEmailEl = document.getElementById("onboarding-email");
const onboardingEmailSaveEl = document.getElementById("onboarding-email-save");
const onboardingEmailStatusEl = document.getElementById("onboarding-email-status");
const onboardingTipsEl = document.getElementById("onboarding-tips");

const adBottomBarEl = document.getElementById("ad-bottom-bar");
const adBottomSlotEl = document.getElementById("ad-bottom-slot");
const outputAdsOverlayEl = document.getElementById("output-ads-overlay");
const outputAdSlotAEl = document.getElementById("output-ad-slot-a");
const outputAdSlotBEl = document.getElementById("output-ad-slot-b");
const outputAdSlotCEl = document.getElementById("output-ad-slot-c");
const outputAdsContinueEl = document.getElementById("output-ads-continue");

let adsenseCfg = null;
let adFree = false;
let billingLoaded = false;

let token = localStorage.getItem("ai_notes_token") || "";
let me = null;
let notes = [];
let filteredNotes = [];
let currentId = null;
let recorder = null;
let recordingStream = null;
let recordingChunks = [];
let recordingMimeType = "";
let monetizedOutputCount = 0;
let sourceImportCount = 0;

function setDisabled(el, disabled, title = "") {
  if (!el) return;
  el.disabled = Boolean(disabled);
  if (title) el.title = title;
  else el.removeAttribute("title");
}

function setHidden(el, hidden) {
  if (!el) return;
  el.classList.toggle("hidden", Boolean(hidden));
}

function authScopedKey(prefix) {
  return `${prefix}_${me?.id || "anon"}`;
}

function setAnalyticsStatus(msg, isError = false) {
  analyticsStatusEl.textContent = msg;
  analyticsStatusEl.style.color = isError ? "#b91c1c" : "#0f172a";
}

function setAdCheckStatus(msg, isError = false) {
  adCheckStatusEl.textContent = msg;
  adCheckStatusEl.style.color = isError ? "#b91c1c" : "#0f172a";
}

function setMetric(el, value) {
  if (el) el.textContent = String(value);
}

function formatEventName(name) {
  const raw = String(name || "").trim();
  if (!raw) return "-";
  return raw.replaceAll(".", " ");
}

function setLearningStatus(msg, isError = false) {
  learningStatusEl.textContent = msg;
  learningStatusEl.style.color = isError ? "#b91c1c" : "#0f172a";
}

function clearLearningUi() {
  setMetric(learningMasteryEl, "-");
  setMetric(learningDueEl, "-");
  learningFocusEl.textContent = "";
  learningNextEl.textContent = "";
}

function applyPremiumFeatureGates() {
  const gated = !adFree;
  setDisabled(importFilesBtn, false);
  setDisabled(importUrlsBtn, false);
  setDisabled(refreshLearningBtn, false);
  setDisabled(feedbackAiBtn, false);
  setHidden(upgradeLearningBtn, !gated);
  setHidden(upgradeSourcesBtn, !gated);
  setHidden(upgradeAiBtn, !gated);
}

function loadOutputCounter() {
  const raw = localStorage.getItem(authScopedKey("output_count_v1")) || "0";
  const n = Number(raw);
  monetizedOutputCount = Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0;
  const rawImport = localStorage.getItem(authScopedKey("import_count_v1")) || "0";
  const m = Number(rawImport);
  sourceImportCount = Number.isFinite(m) ? Math.max(0, Math.floor(m)) : 0;
}

function saveOutputCounter() {
  localStorage.setItem(authScopedKey("output_count_v1"), String(monetizedOutputCount));
}

function saveImportCounter() {
  localStorage.setItem(authScopedKey("import_count_v1"), String(sourceImportCount));
}

function openOutputAdsOverlay() {
  outputAdsOverlayEl.classList.remove("hidden");
  outputAdsOverlayEl.setAttribute("aria-hidden", "false");
}

function closeOutputAdsOverlay() {
  outputAdsOverlayEl.classList.add("hidden");
  outputAdsOverlayEl.setAttribute("aria-hidden", "true");
  outputAdSlotAEl.innerHTML = "";
  outputAdSlotBEl.innerHTML = "";
  outputAdSlotCEl.innerHTML = "";
  setHidden(outputAdSlotCEl, true);
}

async function showAdInterstitial(adCount = 2) {
  if (adFree) return;
  const showThree = Number(adCount) >= 3;
  setHidden(outputAdSlotCEl, !showThree);
  openOutputAdsOverlay();

  if (adsenseCfg?.enabled && adsenseCfg.client && adsenseCfg.bottomSlot) {
    try {
      await loadAdSenseScript(adsenseCfg.client);
      renderAdInto(outputAdSlotAEl, { client: adsenseCfg.client, slot: adsenseCfg.bottomSlot }, { responsive: true });
      const slotB = adsenseCfg.breakSlot || adsenseCfg.bottomSlot;
      renderAdInto(outputAdSlotBEl, { client: adsenseCfg.client, slot: slotB }, { responsive: true });
      if (showThree) {
        renderAdInto(outputAdSlotCEl, { client: adsenseCfg.client, slot: slotB }, { responsive: true });
      }
    } catch {
      outputAdSlotAEl.textContent = "Ad unavailable right now.";
      outputAdSlotBEl.textContent = "Ad unavailable right now.";
      if (showThree) outputAdSlotCEl.textContent = "Ad unavailable right now.";
    }
  } else {
    outputAdSlotAEl.textContent = "Sponsored";
    outputAdSlotBEl.textContent = "Sponsored";
    if (showThree) outputAdSlotCEl.textContent = "Sponsored";
  }

  await new Promise((resolve) => {
    const onContinue = () => {
      outputAdsContinueEl.removeEventListener("click", onContinue);
      closeOutputAdsOverlay();
      resolve();
    };
    outputAdsContinueEl.addEventListener("click", onContinue);
  });
}

async function countOutputAndMaybeShowAds(eventName = "output.generic") {
  if (adFree) return;
  monetizedOutputCount += 1;
  saveOutputCounter();
  if (monetizedOutputCount % 4 !== 0) return;
  await showAdInterstitial(2);
  fireAndForgetTrack("ads.double_interstitial_shown", { atOutput: monetizedOutputCount, trigger: eventName });
}

async function countImportAndMaybeShowAds() {
  if (adFree) return;
  sourceImportCount += 1;
  saveImportCounter();
  if (sourceImportCount % 4 !== 0) return;
  await showAdInterstitial(3);
  fireAndForgetTrack("ads.triple_interstitial_shown", { atImport: sourceImportCount, trigger: "sources.import" });
}

function onboardingSeen() {
  return localStorage.getItem(authScopedKey("onboarding_seen_v1")) === "1";
}

function markOnboardingSeen() {
  localStorage.setItem(authScopedKey("onboarding_seen_v1"), "1");
}

function escapeHtml(v) {
  return String(v)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function setSourceStatus(msg, isError = false) {
  sourceStatusEl.textContent = msg;
  sourceStatusEl.style.color = isError ? "#b91c1c" : "#0f172a";
}

function getSelectionTextWithinEditor() {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return "";
  const text = sel.toString().trim();
  if (!text) return "";
  const range = sel.getRangeAt(0);
  if (!editorEl.contains(range.commonAncestorContainer)) return "";
  return text;
}

function noteToPayload() {
  const tags = String(tagsEl.value || "")
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  return {
    id: currentId,
    title: titleEl.value.trim() || "Untitled",
    tags,
    contentHtml: editorEl.innerHTML,
    contentText: editorEl.innerText
  };
}

function applySearch() {
  const q = String(searchInputEl.value || "").trim().toLowerCase();
  if (!q) {
    filteredNotes = [...notes];
  } else {
    filteredNotes = notes.filter((n) => {
      const haystack = [n.title || "", n.contentText || "", (n.tags || []).join(" ")]
        .join("\n")
        .toLowerCase();
      return haystack.includes(q);
    });
  }
}

function renderNotes() {
  applySearch();
  notesListEl.innerHTML = "";

  if (!filteredNotes.length) {
    notesListEl.innerHTML = `<div class="note-meta">No matching notes.</div>`;
    return;
  }

  for (const note of filteredNotes) {
    const item = document.createElement("article");
    item.className = `note-item ${note.id === currentId ? "active" : ""}`;
    item.innerHTML = `
      <div class="note-title">${escapeHtml(note.title || "Untitled")}</div>
      <div class="note-meta">${escapeHtml(new Date(note.updatedAt || Date.now()).toLocaleString())}</div>
      <div class="note-tags">${escapeHtml((note.tags || []).join(", "))}</div>
    `;
    item.addEventListener("click", () => selectNote(note.id));
    notesListEl.appendChild(item);
  }
}

function selectNote(id) {
  const note = notes.find((n) => n.id === id);
  if (!note) return;
  currentId = note.id;
  titleEl.value = note.title || "";
  tagsEl.value = Array.isArray(note.tags) ? note.tags.join(", ") : "";
  editorEl.innerHTML = note.contentHtml || escapeHtml(note.contentText || "");
  aiOutputEl.textContent = "";
  renderNotes();
}

function clearEditor() {
  currentId = null;
  titleEl.value = "";
  tagsEl.value = "";
  editorEl.innerHTML = "";
  aiOutputEl.textContent = "";
  titleEl.focus();
  renderNotes();
}

function appendToEditor(text) {
  const clean = String(text || "").trim();
  if (!clean) return;
  editorEl.innerHTML += `${editorEl.innerHTML ? "<br><br>" : ""}${escapeHtml(clean).replaceAll("\n", "<br>")}`;
}

function setAuthStatus(msg, isError = false) {
  authStatusEl.textContent = msg;
  authStatusEl.style.color = isError ? "#b91c1c" : "#0f172a";
}

function updateAuthUi() {
  const loggedIn = Boolean(token && me);
  workspaceEl.style.opacity = loggedIn ? "1" : "0.55";
  workspaceEl.style.pointerEvents = loggedIn ? "auto" : "none";
  logoutBtn.style.display = loggedIn ? "inline-block" : "none";
}

async function api(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(path, {
    ...options,
    headers
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.error || `${res.status} ${res.statusText}`);
    error.status = res.status;
    throw error;
  }

  return data;
}

async function trackEvent(eventName, payload = {}) {
  if (!token || !eventName) return;
  try {
    await api("/api/analytics/event", {
      method: "POST",
      body: JSON.stringify({ eventName, payload })
    });
  } catch {
    // Analytics must not break core UX.
  }
}

function fireAndForgetTrack(eventName, payload = {}) {
  trackEvent(eventName, payload).catch(() => {});
}

async function loadConfig() {
  try {
    const cfg = await api("/api/config", { method: "GET" });
    cloudBadgeEl.textContent = cfg.cloudSync ? "Supabase cloud sync" : "Local mode";
    cloudBadgeEl.style.borderColor = cfg.cloudSync ? "#0284c7" : "#84cc16";
    cloudBadgeEl.style.background = cfg.cloudSync ? "#e0f2fe" : "#ecfccb";
    cloudBadgeEl.style.color = cfg.cloudSync ? "#075985" : "#365314";
    adsenseCfg = cfg.adsense || null;
    initAdsense().catch(() => {});
  } catch {
    cloudBadgeEl.textContent = "Config unavailable";
  }
}

function loadAdSenseScript(client) {
  return new Promise((resolve, reject) => {
    if (!client) return resolve();
    if (window.__adsense_loaded) return resolve();
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
    s.crossOrigin = "anonymous";
    s.onload = () => {
      window.__adsense_loaded = true;
      resolve();
    };
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

function renderAdInto(container, { client, slot }, { responsive = true } = {}) {
  if (!container) return;
  container.innerHTML = "";

  const ins = document.createElement("ins");
  ins.className = "adsbygoogle";
  ins.style.display = "block";
  ins.setAttribute("data-ad-client", client);
  ins.setAttribute("data-ad-slot", slot);
  ins.setAttribute("data-ad-format", responsive ? "auto" : "rectangle");
  ins.setAttribute("data-full-width-responsive", responsive ? "true" : "false");
  container.appendChild(ins);

  try {
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.push({});
  } catch {
    // AdSense can throw if blocked by browser/privacy extensions; ignore.
  }
}

async function initAdsense() {
  if (adFree) return;
  if (!adsenseCfg?.enabled) return;
  if (!adsenseCfg.client || !adsenseCfg.bottomSlot) return;

  await loadAdSenseScript(adsenseCfg.client);
  adBottomBarEl.classList.remove("hidden");
  adBottomBarEl.setAttribute("aria-hidden", "false");
  renderAdInto(adBottomSlotEl, { client: adsenseCfg.client, slot: adsenseCfg.bottomSlot }, { responsive: true });
}

function setBillingStatus(msg, isError = false) {
  billingStatusEl.textContent = msg;
  billingStatusEl.style.color = isError ? "#b91c1c" : "#0f172a";
}

async function loadBillingStatus() {
  if (!token) return;
  try {
    const data = await api("/api/billing/status", { method: "GET" });
    billingLoaded = true;
    adFree = Boolean(data.adFree);
    if (adFree) {
      setBillingStatus("Ad-free active.");
      // Hide ads immediately if they were already shown.
      adBottomBarEl.classList.add("hidden");
      adBottomBarEl.setAttribute("aria-hidden", "true");
    } else {
      setBillingStatus("Free plan (ads enabled).");
      initAdsense().catch(() => {});
    }
    applyPremiumFeatureGates();
  } catch (e) {
    setBillingStatus(`Billing status error: ${e.message}`, true);
    applyPremiumFeatureGates();
  }
}

async function loadAnalyticsSummary() {
  if (!token) return;
  try {
    const data = await api("/api/analytics/summary?days=7", { method: "GET" });
    setAnalyticsStatus(`Last 7d: ${data.total || 0} tracked actions`);
    const counts = data.counts || {};
    const entries = Object.entries(counts).sort((a, b) => Number(b[1]) - Number(a[1]));
    const top = entries[0] || null;
    const flashcards = entries
      .filter(([k]) => String(k).startsWith("flashcards."))
      .reduce((sum, [, n]) => sum + Number(n || 0), 0);
    const aiActions = Number(counts["ai.action"] || 0);
    setMetric(metricTotalEl, data.total || 0);
    setMetric(metricTopEventEl, top ? `${formatEventName(top[0])} (${top[1]})` : "-");
    setMetric(metricFlashcardsEl, flashcards);
    setMetric(metricAiEl, aiActions);
  } catch (e) {
    setAnalyticsStatus(`Analytics error: ${e.message}`, true);
    setMetric(metricTotalEl, "-");
    setMetric(metricTopEventEl, "-");
    setMetric(metricFlashcardsEl, "-");
    setMetric(metricAiEl, "-");
  }
}

async function loadLearningPlan() {
  if (!token) return;
  try {
    const plan = await api("/api/learning/plan", { method: "GET" });
    setMetric(learningMasteryEl, `${plan.masteryScore ?? 0}%`);
    setMetric(learningDueEl, plan.dueNow ?? 0);
    const weak = Array.isArray(plan.weakTags) ? plan.weakTags : [];
    learningFocusEl.textContent = weak.length
      ? `Focus topics: ${weak.map((w) => `${w.tag} (${w.due} due)`).join(", ")}`
      : "Focus topics: build cards from tagged notes to personalize recommendations.";
    const next = Array.isArray(plan.nextActions) ? plan.nextActions : [];
    learningNextEl.textContent = next.length ? `Next: ${next.join(" ")}` : "";
    setLearningStatus(`Plan updated ${new Date(plan.generatedAt || Date.now()).toLocaleTimeString()}.`);
  } catch (e) {
    clearLearningUi();
    setLearningStatus(`Learning plan error: ${e.message}`, true);
  }
}

async function loadServerAdCheck() {
  if (!token) return null;
  try {
    return await api("/api/ads/check", { method: "GET" });
  } catch {
    return null;
  }
}

async function runAdDiagnostics() {
  if (!token) {
    setAdCheckStatus("Log in first to run ad checks.", true);
    return;
  }

  const lines = [];
  const server = await loadServerAdCheck();
  if (server) {
    lines.push(`Server ad enabled: ${server.adsEnabled ? "yes" : "no"}`);
    lines.push(`Client configured: ${server.clientConfigured ? "yes" : "no"}`);
    lines.push(`Bottom slot configured: ${server.bottomSlotConfigured ? "yes" : "no"}`);
    lines.push(`Ad-free plan active: ${server.adFree ? "yes" : "no"}`);
  }

  if (adFree) {
    lines.push("Ads are intentionally hidden for your ad-free plan.");
    setAdCheckStatus(lines.join("\n"));
    return;
  }

  if (!adsenseCfg?.enabled || !adsenseCfg.client || !adsenseCfg.bottomSlot) {
    lines.push("AdSense env vars are incomplete. Set ADSENSE_CLIENT and ADSENSE_SLOT_BOTTOM in Render.");
    setAdCheckStatus(lines.join("\n"), true);
    return;
  }

  try {
    await loadAdSenseScript(adsenseCfg.client);
  } catch {
    lines.push("Could not load the AdSense script (likely blocker or network policy).");
    setAdCheckStatus(lines.join("\n"), true);
    return;
  }

  const insEl = adBottomSlotEl.querySelector("ins.adsbygoogle");
  const hasScriptTag = Boolean(document.querySelector('script[src*="adsbygoogle.js"]'));
  lines.push(`AdSense script tag present: ${hasScriptTag ? "yes" : "no"}`);
  lines.push(`Bottom ad element present: ${insEl ? "yes" : "no"}`);

  await new Promise((resolve) => setTimeout(resolve, 1400));
  const iframeCount = adBottomSlotEl.querySelectorAll("iframe").length;
  lines.push(`Rendered ad iframe count: ${iframeCount}`);
  if (iframeCount === 0) {
    lines.push("No creative yet. Common reasons: new AdSense site/domain review, low fill, ad blocker.");
  }

  setAdCheckStatus(lines.join("\n"), false);
}

async function startCheckout() {
  if (!token) return setBillingStatus("Log in first to subscribe.", true);
  setBillingStatus("Opening checkout...");
  try {
    const data = await api("/api/billing/create-checkout-session", { method: "POST" });
    if (!data.url) throw new Error("Missing checkout url");
    fireAndForgetTrack("billing.checkout_start", { plan: "adfree_599_monthly" });
    window.location.href = data.url;
  } catch (e) {
    setBillingStatus(`Checkout error: ${e.message}`, true);
  }
}

async function openPortal() {
  if (!token) return setBillingStatus("Log in first to manage subscription.", true);
  setBillingStatus("Opening billing portal...");
  try {
    const data = await api("/api/billing/portal", { method: "POST" });
    if (!data.url) throw new Error("Missing portal url");
    fireAndForgetTrack("billing.portal_open", {});
    window.location.href = data.url;
  } catch (e) {
    setBillingStatus(`Portal error: ${e.message}`, true);
  }
}

async function logout() {
  try {
    await api("/api/auth/logout", { method: "POST" });
  } catch {
    // Ignore server logout errors and clear client token.
  }
  token = "";
  me = null;
  notes = [];
  filteredNotes = [];
  localStorage.removeItem("ai_notes_token");
  setAuthStatus("Logged out.");
  renderNotes();
  clearEditor();
  updateAuthUi();
  adFree = false;
  billingLoaded = false;
  setBillingStatus("");
  setAnalyticsStatus("");
  setAdCheckStatus("");
  setMetric(metricTotalEl, "-");
  setMetric(metricTopEventEl, "-");
  setMetric(metricFlashcardsEl, "-");
  setMetric(metricAiEl, "-");
  monetizedOutputCount = 0;
  sourceImportCount = 0;
  closeOutputAdsOverlay();
  clearLearningUi();
  setLearningStatus("");
  setSourceStatus("");
  if (sourceUrlsEl) sourceUrlsEl.value = "";
  if (sourceFilesEl) sourceFilesEl.value = "";
  window.location.href = "/login.html";
}

async function loadMe() {
  if (!token) return;
  try {
    const data = await api("/api/auth/me", { method: "GET" });
    me = data.user;
    setAuthStatus(`Signed in as ${me.email}`);
  } catch {
    token = "";
    me = null;
    localStorage.removeItem("ai_notes_token");
  }
}

async function loadNotes() {
  if (!token) return;
  const data = await api("/api/notes", { method: "GET" });
  notes = data.notes || [];
  notes.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
  renderNotes();
  if (notes.length) selectNote(notes[0].id);
}

function parseUrlInput(raw) {
  return String(raw || "")
    .split(/[\n,]/)
    .map((x) => x.trim())
    .filter(Boolean);
}

function canImportFile(name) {
  const lower = String(name || "").toLowerCase();
  const allowed = [
    ".txt",
    ".md",
    ".csv",
    ".json",
    ".html",
    ".htm",
    ".xml",
    ".log",
    ".pdf",
    ".docx",
    ".mp4",
    ".mov",
    ".m4v",
    ".webm",
    ".mp3",
    ".wav",
    ".m4a",
    ".ogg"
  ];
  return allowed.some((ext) => lower.endsWith(ext));
}

function extOf(name) {
  const lower = String(name || "").toLowerCase();
  const idx = lower.lastIndexOf(".");
  return idx >= 0 ? lower.slice(idx) : "";
}

function isPdfExt(ext) {
  return ext === ".pdf";
}

function isDocxExt(ext) {
  return ext === ".docx";
}

function isMediaExt(ext) {
  return [".mp4", ".mov", ".m4v", ".webm", ".mp3", ".wav", ".m4a", ".ogg"].includes(ext);
}

async function readSelectedFilesAsSources() {
  const files = [...(sourceFilesEl.files || [])];
  const accepted = files.filter((f) => canImportFile(f.name)).slice(0, 20);
  const rejected = files.length - accepted.length;
  const sources = [];
  for (const f of accepted) {
    const ext = extOf(f.name);
    if (isPdfExt(ext)) {
      const base64 = await blobToBase64(f);
      sources.push({
        name: f.name,
        kind: "pdf",
        base64
      });
      continue;
    }

    if (isDocxExt(ext)) {
      const base64 = await blobToBase64(f);
      sources.push({
        name: f.name,
        kind: "docx",
        base64
      });
      continue;
    }

    if (isMediaExt(ext)) {
      const base64 = await blobToBase64(f);
      sources.push({
        name: f.name,
        kind: "media",
        mimeType: f.type || "audio/webm",
        base64
      });
      continue;
    }

    const text = String(await f.text()).trim();
    if (!text) continue;
    sources.push({
      name: f.name,
      kind: "text",
      content: text.slice(0, 140000)
    });
  }
  return { sources, rejected };
}

function renderImportedSources(imported = []) {
  if (!Array.isArray(imported) || !imported.length) return;
  const blocks = imported.map((src) => {
    const title = `Source: ${src.name}`;
    return `## ${title}\n${String(src.content || "").trim()}`;
  });
  appendToEditor(blocks.join("\n\n"));
}

async function importSources({ sources = [], urls = [] } = {}) {
  if (!token) return;
  if (!sources.length && !urls.length) {
    setSourceStatus("Select files or enter URLs first.", true);
    return;
  }
  setSourceStatus("Importing sources...");
  try {
    const out = await api("/api/sources/import", {
      method: "POST",
      body: JSON.stringify({ sources, urls })
    });
    renderImportedSources(out.imported || []);
    setSourceStatus(`Imported ${out.imported?.length || 0} source(s) into this note.`);
    fireAndForgetTrack("sources.import_client", { count: out.imported?.length || 0 });
    await countImportAndMaybeShowAds();
  } catch (e) {
    setSourceStatus(`Import failed: ${e.message}`, true);
  }
}

async function saveNote() {
  if (!token) return;
  const payload = noteToPayload();
  const data = await api("/api/notes", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  const saved = data.note;
  const idx = notes.findIndex((n) => n.id === saved.id);
  if (idx >= 0) notes[idx] = saved;
  else notes.unshift(saved);
  notes.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
  currentId = saved.id;
  renderNotes();
  aiOutputEl.textContent = "Saved.";
  fireAndForgetTrack("notes.save", { noteId: saved.id });
}

async function deleteNote() {
  if (!token || !currentId) return;
  await api(`/api/notes/${encodeURIComponent(currentId)}`, { method: "DELETE" });
  notes = notes.filter((n) => n.id !== currentId);
  currentId = null;
  if (notes.length) selectNote(notes[0].id);
  else clearEditor();
  renderNotes();
  aiOutputEl.textContent = "Deleted.";
  fireAndForgetTrack("notes.delete", {});
}

async function runAi(action) {
  const noteText = editorEl.innerText.trim();
  if (!noteText) {
    aiOutputEl.textContent = "Add note text first.";
    return;
  }

  aiOutputEl.textContent = "Thinking...";
  try {
    const selectedText = getSelectionTextWithinEditor();
    const data = await api("/api/ai", {
      method: "POST",
      body: JSON.stringify({ action, noteText, selectedText })
    });
    aiOutputEl.textContent = data.output || "(No output)";
    fireAndForgetTrack("ai.action", { action });
    await countOutputAndMaybeShowAds(`ai.${action}`);
  } catch (err) {
    aiOutputEl.textContent = `Error: ${err.message}`;
  }
}

function openOverlay(title) {
  overlayTitleEl.textContent = title;
  overlayEl.classList.remove("hidden");
  overlayEl.setAttribute("aria-hidden", "false");
}

function closeOverlay() {
  overlayEl.classList.add("hidden");
  overlayEl.setAttribute("aria-hidden", "true");
  overlayBodyEl.innerHTML = "";
}

function openOnboarding() {
  if (me?.email) onboardingEmailEl.value = me.email;
  onboardingEmailStatusEl.textContent = "";
  onboardingTipsEl.innerHTML = "";
  onboardingTipsEl.classList.add("hidden");
  onboardingOverlayEl.classList.remove("hidden");
  onboardingOverlayEl.setAttribute("aria-hidden", "false");
}

function closeOnboarding() {
  onboardingOverlayEl.classList.add("hidden");
  onboardingOverlayEl.setAttribute("aria-hidden", "true");
  markOnboardingSeen();
}

function setOnboardingEmailStatus(msg, isError = false) {
  onboardingEmailStatusEl.textContent = msg;
  onboardingEmailStatusEl.style.color = isError ? "#b91c1c" : "#0f172a";
}

function renderWelcomeTips(tips = []) {
  onboardingTipsEl.innerHTML = "";
  if (!Array.isArray(tips) || !tips.length) {
    onboardingTipsEl.classList.add("hidden");
    return;
  }
  for (const tip of tips) {
    const li = document.createElement("li");
    li.textContent = tip;
    onboardingTipsEl.appendChild(li);
  }
  onboardingTipsEl.classList.remove("hidden");
}

async function saveOnboardingEmail() {
  if (!token) return setOnboardingEmailStatus("Log in first.", true);
  const email = String(onboardingEmailEl.value || "").trim();
  if (!email.includes("@")) return setOnboardingEmailStatus("Enter a valid email address.", true);
  try {
    const out = await api("/api/onboarding/email", {
      method: "POST",
      body: JSON.stringify({ email, source: "onboarding_modal" })
    });
    setOnboardingEmailStatus("Saved. Welcome tips are ready.");
    renderWelcomeTips(out.tips || []);
    fireAndForgetTrack("onboarding.tips_viewed", { tipCount: (out.tips || []).length });
  } catch (e) {
    setOnboardingEmailStatus(`Could not save email: ${e.message}`, true);
  }
}

function buttonRow(buttons) {
  const row = document.createElement("div");
  row.className = "row wrap";
  buttons.forEach((b) => row.appendChild(b));
  return row;
}

async function fetchDueCount() {
  const data = await api("/api/flashcards/stats", { method: "GET" });
  return Number(data.dueCount || 0);
}

async function generateFlashcards() {
  const noteText = editorEl.innerText.trim();
  if (!noteText) {
    aiOutputEl.textContent = "Add note text first.";
    return;
  }
  aiOutputEl.textContent = "Generating flashcards...";
  try {
    const data = await api("/api/flashcards/generate", {
      method: "POST",
      body: JSON.stringify({ noteId: currentId, noteText, count: 10 })
    });
    const created = data.created || [];
    const due = await fetchDueCount();
    aiOutputEl.textContent = `Created ${created.length} flashcards. Due now: ${due}.`;
    fireAndForgetTrack("flashcards.generate", { count: created.length });
    loadLearningPlan().catch(() => {});
    await countOutputAndMaybeShowAds("flashcards.generate");
  } catch (e) {
    aiOutputEl.textContent = `Flashcards error: ${e.message}`;
  }
}

async function renderStudyDue() {
  openOverlay("Study due flashcards");
  overlayBodyEl.innerHTML = `<div class="muted">Loading due cards...</div>`;

  const data = await api("/api/flashcards?due=1&limit=50", { method: "GET" });
  const cards = data.flashcards || [];

  if (!cards.length) {
    overlayBodyEl.innerHTML = `<div class="muted">No cards due right now. Generate more from a note.</div>`;
    return;
  }

  let idx = 0;
  let showBack = false;
  let reviewed = 0;

  function renderAdBreak(nextFn) {
    overlayBodyEl.innerHTML = "";

    const box = document.createElement("div");
    box.className = "ad-break";

    const msg = document.createElement("div");
    msg.className = "muted";
    msg.textContent = "Sponsored break";
    box.appendChild(msg);

    const slot = document.createElement("div");
    slot.className = "ad-slot";
    box.appendChild(slot);

    const cont = document.createElement("button");
    cont.className = "ghost";
    cont.textContent = "Continue studying";
    cont.addEventListener("click", nextFn);
    box.appendChild(buttonRow([cont]));

    overlayBodyEl.appendChild(box);

    if (adsenseCfg?.enabled && adsenseCfg.client && adsenseCfg.breakSlot) {
      loadAdSenseScript(adsenseCfg.client)
        .then(() => renderAdInto(slot, { client: adsenseCfg.client, slot: adsenseCfg.breakSlot }, { responsive: true }))
        .catch(() => {});
    } else {
      slot.textContent = "Set ADSENSE_CLIENT + ADSENSE_SLOT_BREAK to enable.";
      slot.style.display = "grid";
      slot.style.placeItems = "center";
      slot.style.color = "var(--soft)";
    }
  }

  function render() {
    const c = cards[idx];
    overlayBodyEl.innerHTML = "";

    const wrap = document.createElement("div");
    const top = document.createElement("div");
    top.className = "muted";
    top.textContent = `Card ${idx + 1} / ${cards.length}`;
    wrap.appendChild(top);

    const front = document.createElement("div");
    front.className = "card-face";
    front.innerHTML = `<h3>Front</h3><div class="mono"></div>`;
    front.querySelector(".mono").textContent = c.front;
    wrap.appendChild(front);

    const back = document.createElement("div");
    back.className = "card-face";
    back.innerHTML = `<h3>Back</h3><div class="mono"></div>`;
    back.querySelector(".mono").textContent = showBack ? c.back : "Click “Show answer”.";
    wrap.appendChild(back);

    if (!showBack) {
      const showBtn = document.createElement("button");
      showBtn.className = "ghost";
      showBtn.textContent = "Show answer";
      showBtn.addEventListener("click", () => {
        showBack = true;
        render();
      });
      wrap.appendChild(buttonRow([showBtn]));
    } else {
      const mk = (label, grade, cls = "ghost") => {
        const b = document.createElement("button");
        b.className = cls;
        b.textContent = label;
        b.addEventListener("click", async () => {
          await api("/api/flashcards/review", {
            method: "POST",
            body: JSON.stringify({ id: c.id, grade })
          });
          fireAndForgetTrack("flashcards.review", { grade });
          loadLearningPlan().catch(() => {});
          idx += 1;
          reviewed += 1;
          showBack = false;
          if (idx >= cards.length) {
            overlayBodyEl.innerHTML = `<div class="muted">Done. You reviewed ${cards.length} cards.</div>`;
          } else {
            if (!adFree && reviewed % 3 === 0) {
              renderAdBreak(render);
            } else {
              render();
            }
          }
        });
        return b;
      };

      wrap.appendChild(buttonRow([mk("Again", 0), mk("Hard", 1), mk("Good", 2), mk("Easy", 3)]));
    }

    overlayBodyEl.appendChild(wrap);
  }

  render();
}

async function renderTestPrep() {
  const noteText = editorEl.innerText.trim();
  if (!noteText) {
    aiOutputEl.textContent = "Add note text first.";
    return;
  }

  openOverlay("Practice test");
  overlayBodyEl.innerHTML = `<div class="muted">Generating questions...</div>`;

  const out = await api("/api/testprep/generate", {
    method: "POST",
    body: JSON.stringify({ noteText, numQuestions: 8 })
  });

  const questions = out.questions || [];
  fireAndForgetTrack("testprep.generate", { count: questions.length });
  await countOutputAndMaybeShowAds("testprep.generate");
  if (!questions.length) {
    overlayBodyEl.innerHTML = `<div class="muted">No questions generated.</div>`;
    return;
  }

  const form = document.createElement("div");
  questions.forEach((q, i) => {
    const block = document.createElement("div");
    block.className = "card-face";
    const title = document.createElement("h3");
    title.textContent = `Q${i + 1} (${q.type})`;
    const prompt = document.createElement("div");
    prompt.className = "mono";
    prompt.textContent = q.question;
    block.appendChild(title);
    block.appendChild(prompt);

    if (q.type === "mcq" && Array.isArray(q.choices) && q.choices.length) {
      q.choices.forEach((choice, ci) => {
        const label = document.createElement("label");
        label.style.display = "flex";
        label.style.gap = "0.5rem";
        label.style.alignItems = "center";
        label.style.marginTop = "0.35rem";
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = `q_${i}`;
        radio.value = choice;
        const span = document.createElement("span");
        span.className = "mono";
        span.textContent = choice;
        label.appendChild(radio);
        label.appendChild(span);
        block.appendChild(label);
      });
    } else {
      const input = document.createElement("textarea");
      input.rows = 3;
      input.style.width = "100%";
      input.style.marginTop = "0.6rem";
      input.style.border = "1px solid var(--line)";
      input.style.borderRadius = "10px";
      input.style.padding = "0.55rem 0.65rem";
      input.style.fontFamily = "\"IBM Plex Mono\", monospace";
      input.dataset.qIndex = String(i);
      block.appendChild(input);
    }

    form.appendChild(block);
  });

  const gradeBtn = document.createElement("button");
  gradeBtn.textContent = "Show answers";
  gradeBtn.addEventListener("click", () => {
    const blocks = [...form.querySelectorAll(".card-face")];
    blocks.forEach((b, i) => {
      const ans = document.createElement("div");
      ans.className = "mono";
      ans.style.marginTop = "0.8rem";
      ans.textContent = `Answer: ${questions[i].answer}\n\nExplanation: ${questions[i].explanation || ""}`.trim();
      b.appendChild(ans);
    });
    gradeBtn.disabled = true;
  });

  overlayBodyEl.innerHTML = "";
  overlayBodyEl.appendChild(form);
  overlayBodyEl.appendChild(buttonRow([gradeBtn]));
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function stopRecording() {
  if (!recorder) return;
  recorder.stop();
  recordBtn.textContent = "Record voice note";
}

async function startRecording() {
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    aiOutputEl.textContent = "Voice recording is not supported in this browser.";
    return;
  }

  recordingStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  recordingMimeType = "";
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
    "audio/ogg"
  ];
  for (const t of candidates) {
    if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t)) {
      recordingMimeType = t;
      break;
    }
  }

  recorder = recordingMimeType ? new MediaRecorder(recordingStream, { mimeType: recordingMimeType }) : new MediaRecorder(recordingStream);
  recordingChunks = [];

  recorder.ondataavailable = (event) => {
    if (event.data?.size) recordingChunks.push(event.data);
  };

  recorder.onstop = async () => {
    try {
      if (!recordingChunks.length) {
        throw new Error("No audio captured. Try again, or use Chrome if Safari blocks recording.");
      }

      const mime = recordingMimeType || recorder.mimeType || "audio/webm";
      const blob = new Blob(recordingChunks, { type: mime });
      if (blob.size < 1024) {
        throw new Error("Audio capture too small. Record for a bit longer and try again.");
      }
      const audioBase64 = await blobToBase64(blob);
      aiOutputEl.textContent = "Transcribing...";
      const data = await api("/api/transcribe", {
        method: "POST",
        body: JSON.stringify({
          audioBase64,
          mimeType: mime
        })
      });
      if (data.text) {
        editorEl.innerHTML += `${editorEl.innerHTML ? "<br><br>" : ""}${escapeHtml(data.text)}`;
      }
      aiOutputEl.textContent = data.text || "No transcript returned.";
      fireAndForgetTrack("notes.transcribe", {});
    } catch (err) {
      aiOutputEl.textContent = `Transcription error: ${err.message}`;
    } finally {
      recordingStream?.getTracks().forEach((t) => t.stop());
      recorder = null;
      recordingStream = null;
      recordingChunks = [];
    }
  };

  recorder.start();
  recordBtn.textContent = "Stop recording";
  aiOutputEl.textContent = "Recording... click again to stop.";
}

logoutBtn.addEventListener("click", logout);
newBtn.addEventListener("click", clearEditor);
saveBtn.addEventListener("click", () => saveNote().catch((e) => (aiOutputEl.textContent = e.message)));
deleteBtn.addEventListener("click", () => deleteNote().catch((e) => (aiOutputEl.textContent = e.message)));
searchInputEl.addEventListener("input", renderNotes);

formatButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.execCommand(btn.dataset.cmd);
    editorEl.focus();
  });
});

clearFormatBtn.addEventListener("click", () => {
  document.execCommand("removeFormat");
  editorEl.focus();
});

aiButtons.forEach((btn) => btn.addEventListener("click", () => runAi(btn.dataset.ai)));
recordBtn.addEventListener("click", () => {
  if (recorder) {
    stopRecording();
  } else {
    startRecording().catch((e) => {
      aiOutputEl.textContent = `Recording error: ${e.message}`;
      recorder = null;
    });
  }
});

overlayCloseEl.addEventListener("click", closeOverlay);
overlayEl.addEventListener("click", (e) => {
  if (e.target === overlayEl) closeOverlay();
});

genCardsBtn.addEventListener("click", () => generateFlashcards());
studyBtn.addEventListener("click", () => {
  renderStudyDue().catch((e) => (aiOutputEl.textContent = `Study error: ${e.message}`));
});
testprepBtn.addEventListener("click", () => {
  renderTestPrep().catch((e) => (aiOutputEl.textContent = `Test prep error: ${e.message}`));
});
importFilesBtn.addEventListener("click", async () => {
  const { sources, rejected } = await readSelectedFilesAsSources();
  if (!sources.length) {
    setSourceStatus(
      rejected > 0
        ? "No supported files selected. Use text, PDF, DOCX, or video/audio files."
        : "Select files first.",
      true
    );
    return;
  }
  await importSources({ sources, urls: [] });
  if (rejected > 0) {
    setSourceStatus(`Imported ${sources.length}. Skipped ${rejected} unsupported file(s).`);
  }
});
importUrlsBtn.addEventListener("click", async () => {
  const urls = parseUrlInput(sourceUrlsEl.value).slice(0, 8);
  if (!urls.length) {
    setSourceStatus("Enter at least one URL.", true);
    return;
  }
  await importSources({ sources: [], urls });
});

onboardingCloseEl.addEventListener("click", closeOnboarding);
onboardingOverlayEl.addEventListener("click", (e) => {
  if (e.target === onboardingOverlayEl) closeOnboarding();
});
onboardingStartEl.addEventListener("click", () => {
  closeOnboarding();
  titleEl.focus();
});
onboardingStudyEl.addEventListener("click", () => {
  closeOnboarding();
  renderStudyDue().catch((e) => (aiOutputEl.textContent = `Study error: ${e.message}`));
});
onboardingEmailSaveEl.addEventListener("click", () => saveOnboardingEmail());
adCheckBtn.addEventListener("click", () => runAdDiagnostics());
refreshLearningBtn.addEventListener("click", () => loadLearningPlan());
upgradeLearningBtn.addEventListener("click", () => startCheckout());
upgradeSourcesBtn.addEventListener("click", () => startCheckout());
upgradeAiBtn.addEventListener("click", () => startCheckout());

(async function init() {
  if (!token) {
    window.location.href = "/login.html";
    return;
  }
  await loadConfig();
  await loadMe();
  if (!me) {
    window.location.href = "/login.html";
    return;
  }
  loadOutputCounter();
  updateAuthUi();
  await loadNotes();
  await loadBillingStatus();
  await loadAnalyticsSummary();
  await loadLearningPlan();
  if (!onboardingSeen()) openOnboarding();
})();

subscribeBtn.addEventListener("click", () => startCheckout());
manageBtn.addEventListener("click", () => openPortal());
