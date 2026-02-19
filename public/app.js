const authCardEl = document.getElementById("auth-card");
const workspaceEl = document.getElementById("workspace");
const logoutBtn = document.getElementById("logout-btn");
const startTutorialBtn = document.getElementById("start-tutorial-btn");
const authStatusEl = document.getElementById("auth-status");
const cloudBadgeEl = document.getElementById("cloud-badge");
const themeSelectEl = document.getElementById("theme-select");
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
const examModeEl = document.getElementById("exam-mode");
const tutorQuestionEl = document.getElementById("tutor-question");
const askTutorBtn = document.getElementById("ask-tutor-btn");
const tutorOutputEl = document.getElementById("tutor-output");
const planDaysEl = document.getElementById("plan-days");
const planMinutesEl = document.getElementById("plan-minutes");
const autoPlanBtn = document.getElementById("auto-plan-btn");
const planStatusEl = document.getElementById("plan-status");
const shareNoteBtn = document.getElementById("share-note-btn");
const shareStatusEl = document.getElementById("share-status");
const exportTxtBtn = document.getElementById("export-txt-btn");
const exportJsonBtn = document.getElementById("export-json-btn");
const exportPdfBtn = document.getElementById("export-pdf-btn");
const streakDaysEl = document.getElementById("streak-days");
const xpLevelEl = document.getElementById("xp-level");
const xpStatusEl = document.getElementById("xp-status");
const reminderTimeEl = document.getElementById("reminder-time");
const saveReminderBtn = document.getElementById("save-reminder-btn");
const testReminderBtn = document.getElementById("test-reminder-btn");
const reminderStatusEl = document.getElementById("reminder-status");
const refreshDashboardBtn = document.getElementById("refresh-dashboard-btn");
const dashboardHeatmapEl = document.getElementById("dashboard-heatmap");
const referralCodeInputEl = document.getElementById("referral-code-input");
const applyReferralBtn = document.getElementById("apply-referral-btn");
const myReferralCodeEl = document.getElementById("my-referral-code");
const referralStatusEl = document.getElementById("referral-status");
const feedbackTextEl = document.getElementById("feedback-text");
const sendFeedbackBtn = document.getElementById("send-feedback-btn");
const feedbackStatusEl = document.getElementById("feedback-status");

const overlayEl = document.getElementById("study-overlay");
const overlayTitleEl = document.getElementById("overlay-title");
const overlayBodyEl = document.getElementById("overlay-body");
const overlayCloseEl = document.getElementById("overlay-close");
const analyticsStatusEl = document.getElementById("analytics-status");

const focusToggleBtn = document.getElementById("focus-toggle-btn");
const clearOutputBtn = document.getElementById("clear-output-btn");
const tabBtnWriteEl = document.getElementById("tab-btn-write");
const tabBtnSourcesEl = document.getElementById("tab-btn-sources");
const tabBtnStudyEl = document.getElementById("tab-btn-study");
const tabWriteEl = document.getElementById("tab-write");
const tabSourcesEl = document.getElementById("tab-sources");
const tabStudyEl = document.getElementById("tab-study");
const sourcesListEl = document.getElementById("sources-list");
const sourcesRefreshBtn = document.getElementById("sources-refresh-btn");
const sourcesClearBtn = document.getElementById("sources-clear-btn");

const onboardingOverlayEl = document.getElementById("onboarding-overlay");
const onboardingCloseEl = document.getElementById("onboarding-close");
const onboardingStartEl = document.getElementById("onboarding-start");
const onboardingStudyEl = document.getElementById("onboarding-study");
const onboardingEmailEl = document.getElementById("onboarding-email");
const onboardingEmailSaveEl = document.getElementById("onboarding-email-save");
const onboardingEmailStatusEl = document.getElementById("onboarding-email-status");
const onboardingTipsEl = document.getElementById("onboarding-tips");
const tutorialOverlayEl = document.getElementById("tutorial-overlay");
const tutorialTitleEl = document.getElementById("tutorial-title");
const tutorialTextEl = document.getElementById("tutorial-text");
const tutorialProgressEl = document.getElementById("tutorial-progress");
const tutorialBackEl = document.getElementById("tutorial-back");
const tutorialNextEl = document.getElementById("tutorial-next");
const tutorialSkipEl = document.getElementById("tutorial-skip");

const adBottomBarEl = document.getElementById("ad-bottom-bar");
const adBottomSlotEl = document.getElementById("ad-bottom-slot");
const outputAdsOverlayEl = document.getElementById("output-ads-overlay");
const outputAdSlotAEl = document.getElementById("output-ad-slot-a");
const outputAdSlotBEl = document.getElementById("output-ad-slot-b");
const outputAdSlotCEl = document.getElementById("output-ad-slot-c");
const outputAdsContinueEl = document.getElementById("output-ads-continue");
const outputAdsCloseEl = document.getElementById("output-ads-close");

const builderChatToggleEl = document.getElementById("builder-chat-toggle");
const builderChatEl = document.getElementById("builder-chat");
const builderChatCloseEl = document.getElementById("builder-chat-close");
const builderChatMessagesEl = document.getElementById("builder-chat-messages");
const builderChatFormEl = document.getElementById("builder-chat-form");
const builderChatInputEl = document.getElementById("builder-chat-input");
const builderChatStatusEl = document.getElementById("builder-chat-status");
const builderChatChipEls = [...document.querySelectorAll("[data-builder-chip]")];

let adsenseCfg = null;
let adFree = false;
let billingLoaded = false;
const IS_NATIVE_SHELL = (() => {
  try {
    if (window.Capacitor && typeof window.Capacitor.isNativePlatform === "function") {
      return Boolean(window.Capacitor.isNativePlatform());
    }
    if (window.Capacitor && window.Capacitor.platform) return true;
    const ua = String(navigator.userAgent || "");
    return /\bCapacitor\b/i.test(ua);
  } catch {
    return false;
  }
})();

function syncBottomAdSafeArea() {
  const shown = adBottomBarEl && !adBottomBarEl.classList.contains("hidden");
  const height = shown ? Math.ceil(adBottomBarEl.getBoundingClientRect().height) : 0;
  document.documentElement.style.setProperty("--bottom-ad-height", `${height}px`);
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("/sw.js").catch(() => {});
}

let token = localStorage.getItem("ai_notes_token") || "";
let me = null;
let notes = [];
let filteredNotes = [];
let isOwner = false;
let activeTab = "write";
let currentId = null;
let recorder = null;
let recordingStream = null;
let recordingChunks = [];
let recordingMimeType = "";
let monetizedOutputCount = 0;
let sourceImportCount = 0;
let reminderTimer = null;
let lastInterstitialAt = 0;
let interstitialsThisSession = 0;
let sessionUpgradedAt = 0;
let lastTypingAt = 0;
let tutorialStepIndex = 0;
const tutorialSteps = [
  {
    title: "Your workspace",
    text: "Use this left panel to browse and search notes quickly.",
    selector: ".panel.left"
  },
  {
    title: "Write and save",
    text: "Edit your note here, then click Save to sync changes.",
    selector: "#note-editor"
  },
  {
    title: "AI tools",
    text: "Run summarize, improve, feedback, and tutor actions from this section.",
    selector: ".ai-tools"
  },
  {
    title: "Study mode",
    text: "Generate flashcards and run practice tests from these buttons.",
    selector: "#gen-cards-btn"
  },
  {
    title: "Progress",
    text: "Track mastery, streak, XP, and dashboard activity here.",
    selector: "#learning-mastery"
  },
  {
    title: "Reminders and sharing",
    text: "Set reminders, share notes, and export when ready.",
    selector: "#save-reminder-btn"
  }
];

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

function getThemeKey() {
  return authScopedKey("theme_v1");
}

function applyTheme(theme) {
  const t = theme === "clean" ? "clean" : "bold";
  document.body.setAttribute("data-theme", t);
  if (themeSelectEl) themeSelectEl.value = t;
}

function loadTheme() {
  const saved = localStorage.getItem(getThemeKey()) || "bold";
  applyTheme(saved);
}

function saveTheme(theme) {
  localStorage.setItem(getThemeKey(), theme);
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

function areAdsEnabled() {
  return Boolean(adsenseCfg?.enabled && adsenseCfg?.client && adsenseCfg?.bottomSlot);
}

function canShowInterstitial() {
  if (!areAdsEnabled()) return false;
  if (adFree) return false;
  const now = Date.now();
  if (sessionUpgradedAt && now - sessionUpgradedAt < 30 * 60 * 1000) return false;
  if (lastInterstitialAt && now - lastInterstitialAt < 3 * 60 * 1000) return false;
  if (interstitialsThisSession >= 6) return false;
  if (recorder) return false;
  if (lastTypingAt && now - lastTypingAt < 10 * 1000) return false;
  return true;
}

async function showAdInterstitial(adCount = 2) {
  if (!canShowInterstitial()) return false;
  const showThree = Number(adCount) >= 3;
  setHidden(outputAdSlotCEl, !showThree);
  openOutputAdsOverlay();

  const gateSeconds = 20;
  let remaining = gateSeconds;
  const originalContinueText = outputAdsContinueEl.textContent || "Continue";
  const originalCloseText = outputAdsCloseEl ? outputAdsCloseEl.textContent || "Close" : "";
  setDisabled(outputAdsContinueEl, true);
  if (outputAdsCloseEl) setDisabled(outputAdsCloseEl, true);

  const updateGateLabels = () => {
    if (remaining > 0) {
      outputAdsContinueEl.textContent = `${originalContinueText} (${remaining})`;
      if (outputAdsCloseEl) outputAdsCloseEl.textContent = `${originalCloseText} (${remaining})`;
    } else {
      outputAdsContinueEl.textContent = originalContinueText;
      if (outputAdsCloseEl) outputAdsCloseEl.textContent = originalCloseText;
    }
  };
  updateGateLabels();
  const gateTimer = setInterval(() => {
    remaining = Math.max(0, remaining - 1);
    updateGateLabels();
    if (remaining <= 0) {
      clearInterval(gateTimer);
      setDisabled(outputAdsContinueEl, false);
      if (outputAdsCloseEl) setDisabled(outputAdsCloseEl, false);
    }
  }, 1000);

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
    let settled = false;
    const cleanup = () => {
      if (settled) return;
      settled = true;
      outputAdsContinueEl.removeEventListener("click", onContinue);
      if (outputAdsCloseEl) outputAdsCloseEl.removeEventListener("click", onClose);
      document.removeEventListener("keydown", onKeyDown);
      outputAdsOverlayEl.removeEventListener("click", onBackdrop);
      try {
        clearInterval(gateTimer);
      } catch {
        // ignore
      }
      outputAdsContinueEl.textContent = originalContinueText;
      setDisabled(outputAdsContinueEl, false);
      if (outputAdsCloseEl) {
        outputAdsCloseEl.textContent = originalCloseText;
        setDisabled(outputAdsCloseEl, false);
      }
    };

    const finish = () => {
      cleanup();
      closeOutputAdsOverlay();
      resolve();
    };

    const onContinue = (e) => {
      e.preventDefault();
      if (outputAdsContinueEl.disabled) return;
      finish();
    };

    const onClose = (e) => {
      e.preventDefault();
      if (outputAdsCloseEl && outputAdsCloseEl.disabled) return;
      finish();
    };

    const onKeyDown = (e) => {
      if (e.key !== "Escape") return;
      if (outputAdsContinueEl.disabled) return;
      finish();
    };

    const onBackdrop = (e) => {
      // Allow click-outside-to-close after the gate is done.
      if (e.target !== outputAdsOverlayEl) return;
      if (outputAdsContinueEl.disabled) return;
      finish();
    };

    outputAdsContinueEl.addEventListener("click", onContinue);
    if (outputAdsCloseEl) outputAdsCloseEl.addEventListener("click", onClose);
    document.addEventListener("keydown", onKeyDown);
    outputAdsOverlayEl.addEventListener("click", onBackdrop);
  });
  lastInterstitialAt = Date.now();
  interstitialsThisSession += 1;
  return true;
}

async function countOutputAndMaybeShowAds(eventName = "output.generic") {
  if (adFree || !areAdsEnabled()) return;
  monetizedOutputCount += 1;
  saveOutputCounter();
  if (monetizedOutputCount % 4 !== 0) return;
  const shown = await showAdInterstitial(2);
  if (shown) fireAndForgetTrack("ads.double_interstitial_shown", { atOutput: monetizedOutputCount, trigger: eventName });
}

async function countImportAndMaybeShowAds() {
  if (adFree || !areAdsEnabled()) return;
  sourceImportCount += 1;
  saveImportCounter();
  if (sourceImportCount % 4 !== 0) return;
  const shown = await showAdInterstitial(3);
  if (shown) fireAndForgetTrack("ads.triple_interstitial_shown", { atImport: sourceImportCount, trigger: "sources.import" });
}

function onboardingSeen() {
  return localStorage.getItem(authScopedKey("onboarding_seen_v1")) === "1";
}

function markOnboardingSeen() {
  localStorage.setItem(authScopedKey("onboarding_seen_v1"), "1");
}

function tutorialSeen() {
  return localStorage.getItem(authScopedKey("tutorial_seen_v1")) === "1";
}

function markTutorialSeen() {
  localStorage.setItem(authScopedKey("tutorial_seen_v1"), "1");
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

function setPlanStatus(msg, isError = false) {
  planStatusEl.textContent = msg;
  planStatusEl.style.color = isError ? "#b91c1c" : "#0f172a";
}

function setShareStatus(msg, isError = false) {
  shareStatusEl.textContent = msg;
  shareStatusEl.style.color = isError ? "#b91c1c" : "#0f172a";
}

function setReminderStatus(msg, isError = false) {
  reminderStatusEl.textContent = msg;
  reminderStatusEl.style.color = isError ? "#b91c1c" : "#0f172a";
}

function setReferralStatus(msg, isError = false) {
  referralStatusEl.textContent = msg;
  referralStatusEl.style.color = isError ? "#b91c1c" : "#0f172a";
}

function setFeedbackStatus(msg, isError = false) {
  feedbackStatusEl.textContent = msg;
  feedbackStatusEl.style.color = isError ? "#b91c1c" : "#0f172a";
}

function todayDateKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadXpState() {
  const raw = localStorage.getItem(authScopedKey("xp_state_v1")) || "{}";
  let s = {};
  try {
    s = JSON.parse(raw);
  } catch {
    s = {};
  }
  return {
    xp: Number(s.xp || 0),
    level: Math.max(1, Number(s.level || 1)),
    days: Array.isArray(s.days) ? s.days.slice(-120) : [],
    lastDate: String(s.lastDate || "")
  };
}

function saveXpState(s) {
  localStorage.setItem(authScopedKey("xp_state_v1"), JSON.stringify(s));
}

function computeStreak(days) {
  const set = new Set(days);
  let streak = 0;
  for (let i = 0; i < 365; i += 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (set.has(key)) streak += 1;
    else break;
  }
  return streak;
}

function refreshXpUi() {
  const s = loadXpState();
  const streak = computeStreak(s.days);
  streakDaysEl.textContent = `${streak} day${streak === 1 ? "" : "s"}`;
  xpLevelEl.textContent = `Lv ${s.level} (${s.xp} XP)`;
}

function awardXp(action, points = 5) {
  const s = loadXpState();
  s.xp += Number(points || 0);
  const nextLevel = Math.max(1, Math.floor(s.xp / 120) + 1);
  if (nextLevel > s.level) {
    xpStatusEl.textContent = `Level up! You reached Lv ${nextLevel} (${action}).`;
  }
  s.level = nextLevel;
  const today = todayDateKey();
  if (!s.days.includes(today)) s.days.push(today);
  s.lastDate = today;
  saveXpState(s);
  refreshXpUi();
}

function renderHeatmap(days = []) {
  if (!Array.isArray(days) || !days.length) {
    dashboardHeatmapEl.textContent = "No recent activity.";
    return;
  }
  const blocks = days.map((d) => {
    const n = Number(d.count || 0);
    const c = n === 0 ? "·" : n < 3 ? "░" : n < 6 ? "▒" : "▓";
    return `${d.date.slice(5)} ${c} ${n}`;
  });
  dashboardHeatmapEl.textContent = blocks.join("\n");
}

async function loadDashboard() {
  if (!token) return;
  try {
    const out = await api("/api/dashboard", { method: "GET" });
    renderHeatmap(out.last14Days || []);
  } catch (e) {
    dashboardHeatmapEl.textContent = `Dashboard error: ${e.message}`;
  }
}

async function requestNotificationPermission() {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  const p = await Notification.requestPermission();
  return p === "granted";
}

function scheduleReminderTick() {
  if (reminderTimer) clearInterval(reminderTimer);
  reminderTimer = setInterval(() => {
    const cfgRaw = localStorage.getItem(authScopedKey("reminder_cfg_v1")) || "{}";
    let cfg = {};
    try {
      cfg = JSON.parse(cfgRaw);
    } catch {
      cfg = {};
    }
    if (!cfg?.time) return;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const key = `${hh}:${mm}`;
    const firedKey = `${todayDateKey()}_${key}`;
    if (cfg.time === key && cfg.lastFired !== firedKey) {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Notematica reminder", { body: "You have study items due. Open Notematica to review." });
      }
      cfg.lastFired = firedKey;
      localStorage.setItem(authScopedKey("reminder_cfg_v1"), JSON.stringify(cfg));
    }
  }, 30000);
}

function downloadTextFile(filename, text, mime = "text/plain") {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
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
  renderSourcesManager();
  renderNotes();
}

function clearEditor() {
  currentId = null;
  titleEl.value = "";
  tagsEl.value = "";
  editorEl.innerHTML = "";
  aiOutputEl.textContent = "";
  renderSourcesManager();
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
  const base =
    (typeof window !== "undefined" && window.__API_BASE_URL ? String(window.__API_BASE_URL) : "").replace(/\/+$/, "");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${base}${path}`, {
    ...options,
    headers
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.error || `${res.status} ${res.statusText}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

function formatQuotaError(e, fallback) {
  if (!e || e.status !== 429) return "";
  const resetIso = e.data && e.data.resetsAt ? String(e.data.resetsAt) : "";
  let resetText = "";
  if (resetIso) {
    const dt = new Date(resetIso);
    if (!Number.isNaN(dt.getTime())) resetText = ` Resets: ${dt.toLocaleString()}.`;
  }
  return `${fallback || "Daily limit reached."}${resetText}`;
}

const BUILDER_CHAT_KEY = "notematica_builder_chat_v1";

function loadBuilderChat() {
  try {
    const raw = localStorage.getItem(BUILDER_CHAT_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((m) => ({
        role: m && m.role === "assistant" ? "assistant" : "user",
        content: String(m && m.content ? m.content : "").slice(0, 8000)
      }))
      .filter((m) => m.content.trim())
      .slice(-30);
  } catch {
    return [];
  }
}

function saveBuilderChat(messages) {
  try {
    localStorage.setItem(BUILDER_CHAT_KEY, JSON.stringify((messages || []).slice(-60)));
  } catch {
    // ignore storage issues
  }
}

let builderChatMessages = loadBuilderChat();

function setBuilderChatStatus(msg, isError = false) {
  if (!builderChatStatusEl) return;
  builderChatStatusEl.textContent = msg || "";
  builderChatStatusEl.style.color = isError ? "#b91c1c" : "#0f172a";
}

function renderBuilderChatMessages() {
  if (!builderChatMessagesEl) return;
  builderChatMessagesEl.innerHTML = "";

  const msgs = builderChatMessages.length
    ? builderChatMessages
    : [
        {
          role: "assistant",
          content:
            "Ask me what to do next and I’ll give you step-by-step instructions for Notematica (Render, Supabase, Stripe, AdSense, app store builds). Don’t paste API keys or secrets."
        }
      ];

  for (const m of msgs) {
    const div = document.createElement("div");
    div.className = `builder-msg ${m.role === "assistant" ? "assistant" : "user"}`;
    div.textContent = String(m.content || "");
    builderChatMessagesEl.appendChild(div);
  }

  builderChatMessagesEl.scrollTop = builderChatMessagesEl.scrollHeight;
}

function openBuilderChat() {
  if (!builderChatEl) return;
  if (!isOwner) return;
  builderChatEl.classList.remove("hidden");
  builderChatEl.setAttribute("aria-hidden", "false");
  renderBuilderChatMessages();
  setBuilderChatStatus("");
  setTimeout(() => builderChatInputEl && builderChatInputEl.focus(), 30);
}

function closeBuilderChat() {
  if (!builderChatEl) return;
  builderChatEl.classList.add("hidden");
  builderChatEl.setAttribute("aria-hidden", "true");
  setBuilderChatStatus("");
}

async function sendBuilderChatMessage(text) {
  const msg = String(text || "").trim();
  if (!msg) return;
  if (!token) {
    setBuilderChatStatus("Sign in first, then ask here.", true);
    return;
  }
  if (!navigator.onLine) {
    setBuilderChatStatus("You look offline. Reconnect and try again.", true);
    return;
  }

  builderChatMessages.push({ role: "user", content: msg });
  builderChatMessages = builderChatMessages.slice(-30);
  saveBuilderChat(builderChatMessages);
  renderBuilderChatMessages();

  setBuilderChatStatus("Thinking...");
  try {
    const out = await api("/api/assistant/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: builderChatMessages.slice(-12),
        clientContext: {
          origin: String(location.origin || ""),
          nativeShell: Boolean(IS_NATIVE_SHELL),
          adFree: Boolean(adFree)
        }
      })
    });
    const answer = String(out.answer || "").trim() || "(No answer)";
    builderChatMessages.push({ role: "assistant", content: answer });
    builderChatMessages = builderChatMessages.slice(-30);
    saveBuilderChat(builderChatMessages);
    renderBuilderChatMessages();
    setBuilderChatStatus("");
  } catch (e) {
    const quota = formatQuotaError(e, "Chat limit reached.");
    setBuilderChatStatus(quota ? quota : `Chat error: ${e.message}`, true);
  }
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

function renderAdInto(container, { client, slot }, { responsive = true, autoHideIfEmpty = false, emptyCheckMs = 2200 } = {}) {
  if (!container) return;
  container.innerHTML = "";
  container.classList.remove("ad-empty");

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

  if (autoHideIfEmpty) {
    setTimeout(() => {
      try {
        const iframe = container.querySelector("iframe");
        const hasRealAd = Boolean(iframe && iframe.offsetHeight > 8);
        if (!hasRealAd) container.classList.add("ad-empty");
        else container.classList.remove("ad-empty");
      } catch {
        // ignore ad measurement issues
      }
    }, Math.max(300, Number(emptyCheckMs) || 2200));
  }
}

async function initAdsense() {
  if (IS_NATIVE_SHELL) {
    // AdSense web units should not run inside native store wrappers.
    adBottomBarEl.classList.add("hidden");
    adBottomBarEl.setAttribute("aria-hidden", "true");
    syncBottomAdSafeArea();
    return;
  }
  if (adFree) {
    syncBottomAdSafeArea();
    return;
  }
  if (!adsenseCfg?.enabled || !adsenseCfg.client || !adsenseCfg.bottomSlot) {
    adBottomBarEl.classList.add("hidden");
    adBottomBarEl.setAttribute("aria-hidden", "true");
    syncBottomAdSafeArea();
    return;
  }

  await loadAdSenseScript(adsenseCfg.client);
  adBottomBarEl.classList.remove("hidden");
  adBottomBarEl.setAttribute("aria-hidden", "false");
  renderAdInto(
    adBottomSlotEl,
    { client: adsenseCfg.client, slot: adsenseCfg.bottomSlot },
    { responsive: false, autoHideIfEmpty: true, emptyCheckMs: 2500 }
  );
  setTimeout(() => {
    try {
      if (adBottomSlotEl.classList.contains("ad-empty")) {
        adBottomBarEl.classList.add("ad-empty");
      } else {
        adBottomBarEl.classList.remove("ad-empty");
      }
      syncBottomAdSafeArea();
    } catch {
      // ignore
    }
  }, 2800);
  syncBottomAdSafeArea();
  // Re-measure after the ad slot has a chance to size itself.
  setTimeout(syncBottomAdSafeArea, 600);
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
      setBillingStatus("Premium active.");
      // Hide ads immediately if they were already shown.
      adBottomBarEl.classList.add("hidden");
      adBottomBarEl.setAttribute("aria-hidden", "true");
      syncBottomAdSafeArea();
    } else {
      setBillingStatus(areAdsEnabled() ? "Free plan (ads enabled)." : "Free plan (ads currently disabled).");
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
    lines.push(`Premium plan active: ${server.adFree ? "yes" : "no"}`);
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
  setBillingStatus("Opening premium checkout...");
  try {
    const data = await api("/api/billing/create-checkout-session", { method: "POST" });
    if (!data.url) throw new Error("Missing checkout url");
    fireAndForgetTrack("billing.checkout_start", { plan: "premium_10_monthly" });
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
  const upgradedKey = authScopedKey("upgraded_at_v1");
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
  lastInterstitialAt = 0;
  interstitialsThisSession = 0;
  sessionUpgradedAt = 0;
  sessionStorage.removeItem(upgradedKey);
  closeOutputAdsOverlay();
  closeTutorial(false);
  clearLearningUi();
  streakDaysEl.textContent = "0 days";
  xpLevelEl.textContent = "Lv 1";
  xpStatusEl.textContent = "";
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
    isOwner = Boolean(me && me.isOwner);
    setAuthStatus(`Signed in as ${me.email}`);
    setHidden(builderChatToggleEl, !isOwner);
    if (!isOwner) closeBuilderChat();
    setActiveTab(loadActiveTab());
  } catch {
    token = "";
    me = null;
    isOwner = false;
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

function sourcesKeyForNote(noteId) {
  return authScopedKey(`note_sources_v1_${noteId || "draft"}`);
}

function sourcesKeyForCurrentNote() {
  return sourcesKeyForNote(currentId);
}

function loadSourcesForCurrentNote() {
  try {
    const raw = localStorage.getItem(sourcesKeyForCurrentNote()) || "[]";
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveSourcesForCurrentNote(sources) {
  try {
    localStorage.setItem(sourcesKeyForCurrentNote(), JSON.stringify(sources || []));
  } catch {
    // ignore
  }
}

function mergeImportedSourcesIntoCurrent(imported = []) {
  if (!Array.isArray(imported) || imported.length === 0) return;
  const existing = loadSourcesForCurrentNote();
  const now = Date.now();
  const next = [...existing];
  for (const s of imported) {
    const name = String(s?.name || "").trim().slice(0, 200);
    const content = String(s?.content || "").trim();
    if (!name || !content) continue;
    const url = /^https?:\/\//i.test(name) ? name : "";
    next.push({
      name,
      url,
      kind: String(s?.kind || "").trim().slice(0, 40),
      content: content.slice(0, 140000),
      addedAt: now
    });
  }
  // De-dupe by (name+first 120 chars) to avoid repeated imports.
  const seen = new Set();
  const deduped = [];
  for (const s of next.slice(-40)) {
    const key = `${s.name}::${String(s.content || "").slice(0, 120)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(s);
  }
  saveSourcesForCurrentNote(deduped);
}

function getAiSourcesForRequest(maxSources = 6) {
  const all = loadSourcesForCurrentNote();
  const sorted = [...all].sort((a, b) => Number(b.addedAt || 0) - Number(a.addedAt || 0));
  return sorted.slice(0, maxSources).map((s) => ({
    name: s.name,
    url: s.url || "",
    kind: s.kind || "",
    content: String(s.content || "").slice(0, 18000)
  }));
}

function setActiveTab(name) {
  const n = name === "sources" ? "sources" : name === "study" ? "study" : "write";
  activeTab = n;
  setHidden(tabWriteEl, n !== "write");
  setHidden(tabSourcesEl, n !== "sources");
  setHidden(tabStudyEl, n !== "study");
  tabBtnWriteEl?.classList.toggle("active", n === "write");
  tabBtnSourcesEl?.classList.toggle("active", n === "sources");
  tabBtnStudyEl?.classList.toggle("active", n === "study");
  try {
    localStorage.setItem(authScopedKey("active_tab_v1"), n);
  } catch {}
  if (n === "sources") renderSourcesManager();
}

function loadActiveTab() {
  try {
    const v = String(localStorage.getItem(authScopedKey("active_tab_v1")) || "study");
    return v === "sources" || v === "write" ? v : "study";
  } catch {
    return "study";
  }
}

function renderSourcesManager() {
  if (!sourcesListEl) return;
  const list = loadSourcesForCurrentNote();
  sourcesListEl.innerHTML = "";

  if (!currentId) {
    sourcesListEl.innerHTML = `<div class="muted">Open or save a note to attach sources.</div>`;
    return;
  }

  if (!list.length) {
    sourcesListEl.innerHTML = `<div class="muted">No sources yet. Import files or URLs above.</div>`;
    return;
  }

  const sorted = list
    .map((s, i) => ({ s, i }))
    .sort((a, b) => Number(b.s.addedAt || 0) - Number(a.s.addedAt || 0));

  for (const { s, i } of sorted) {
    const wrap = document.createElement("div");
    wrap.className = "source-item";
    const head = document.createElement("div");
    head.className = "source-item-head";

    const left = document.createElement("div");
    const title = document.createElement("div");
    title.className = "source-item-title";
    title.textContent = String(s.name || "Source").slice(0, 240);
    const meta = document.createElement("div");
    meta.className = "source-item-meta";
    const kind = String(s.kind || "source").slice(0, 30);
    const when = s.addedAt ? new Date(Number(s.addedAt)).toLocaleString() : "";
    meta.textContent = `${kind}${when ? ` • ${when}` : ""}`;
    left.appendChild(title);
    left.appendChild(meta);

    const actions = document.createElement("div");
    actions.className = "row wrap";
    const url = String(s.url || "");
    if (url) {
      const open = document.createElement("a");
      open.className = "ghost";
      open.textContent = "Open";
      open.href = url;
      open.target = "_blank";
      open.rel = "noreferrer";
      actions.appendChild(open);
    }
    const rm = document.createElement("button");
    rm.className = "ghost danger";
    rm.type = "button";
    rm.textContent = "Remove";
    rm.addEventListener("click", () => {
      const next = loadSourcesForCurrentNote();
      next.splice(i, 1);
      saveSourcesForCurrentNote(next);
      renderSourcesManager();
    });
    actions.appendChild(rm);

    head.appendChild(left);
    head.appendChild(actions);

    const snippet = document.createElement("div");
    snippet.className = "source-item-snippet";
    snippet.textContent = String(s.content || "").trim().slice(0, 220) || "(empty)";

    wrap.appendChild(head);
    wrap.appendChild(snippet);
    sourcesListEl.appendChild(wrap);
  }
}

function renderCitationsInline(citations = []) {
  const arr = Array.isArray(citations) ? citations : [];
  if (!arr.length) return null;
  const wrap = document.createElement("div");
  wrap.className = "muted";
  wrap.style.marginTop = "0.75rem";
  wrap.style.fontSize = "0.78rem";
  wrap.textContent = "Sources: ";
  arr.forEach((c, i) => {
    const id = String(c?.id || "").trim();
    const url = String(c?.url || "").trim();
    const name = String(c?.name || "").trim();
    const label = id || `S${i + 1}`;
    const a = document.createElement("a");
    a.textContent = `[${label}]`;
    a.style.marginRight = "0.45rem";
    a.style.fontWeight = "800";
    a.style.color = "#164e63";
    a.href = url || "#";
    if (url) {
      a.target = "_blank";
      a.rel = "noreferrer";
      a.title = name || url;
    } else {
      a.addEventListener("click", (e) => e.preventDefault());
      a.title = name || label;
    }
    wrap.appendChild(a);
  });
  return wrap;
}

function setOutputWithCitations(el, text, citations = []) {
  if (!el) return;
  el.innerHTML = "";
  const main = document.createElement("div");
  main.textContent = String(text || "");
  el.appendChild(main);
  const cit = renderCitationsInline(citations);
  if (cit) el.appendChild(cit);
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
    mergeImportedSourcesIntoCurrent(out.imported || []);
    setSourceStatus(`Imported ${out.imported?.length || 0} source(s) into this note.`);
    renderSourcesManager();
    fireAndForgetTrack("sources.import_client", { count: out.imported?.length || 0 });
    awardXp("import", 6);
    await countImportAndMaybeShowAds();
  } catch (e) {
    const quota = formatQuotaError(e, "Import limit reached.");
    setSourceStatus(quota ? quota : `Import failed: ${e.message}`, true);
  }
}

async function askTutor() {
  const question = String(tutorQuestionEl.value || "").trim();
  const noteText = editorEl.innerText.trim();
  if (!question) return (tutorOutputEl.textContent = "Enter a tutor question.");
  if (!noteText) return (tutorOutputEl.textContent = "Add note text first.");
  tutorOutputEl.textContent = "Tutor is thinking...";
  try {
    const out = await api("/api/tutor", {
      method: "POST",
      body: JSON.stringify({ question, noteText, sources: getAiSourcesForRequest(6) })
    });
    setOutputWithCitations(tutorOutputEl, out.answer || "No tutor response.", out.citations || []);
    awardXp("tutor", 8);
    await countOutputAndMaybeShowAds("tutor.ask");
  } catch (e) {
    const quota = formatQuotaError(e, "Tutor limit reached.");
    tutorOutputEl.textContent = quota ? quota : `Tutor error: ${e.message}`;
  }
}

async function generateAutoPlan() {
  const days = Number(planDaysEl.value || 7);
  const minutes = Number(planMinutesEl.value || 20);
  setPlanStatus("Generating plan...");
  try {
    const out = await api("/api/study/plan", {
      method: "POST",
      body: JSON.stringify({ days, minutesPerDay: minutes })
    });
    const lines = (out.plan || []).map((p) => `Day ${p.day}: ${p.focus} (${p.minutes}m)`);
    setPlanStatus(lines.join("\n") || "No plan generated.");
    awardXp("plan", 10);
    await countOutputAndMaybeShowAds("study.plan");
  } catch (e) {
    setPlanStatus(`Plan error: ${e.message}`, true);
  }
}

async function shareCurrentNote() {
  if (!currentId) return setShareStatus("Open a note first.", true);
  const note = notes.find((n) => n.id === currentId);
  if (!note) return setShareStatus("Note not found.", true);
  setShareStatus("Creating share link...");
  try {
    const out = await api("/api/share/create", {
      method: "POST",
      body: JSON.stringify({
        noteId: note.id,
        title: note.title,
        contentText: note.contentText,
        contentHtml: note.contentHtml
      })
    });
    const link = `${window.location.origin}/share.html?id=${encodeURIComponent(out.shareId)}`;
    await navigator.clipboard.writeText(link).catch(() => {});
    setShareStatus(`Share link ready: ${link}`);
    awardXp("share", 6);
  } catch (e) {
    setShareStatus(`Share error: ${e.message}`, true);
  }
}

function exportCurrentNoteTxt() {
  if (!currentId) return setShareStatus("Open a note first.", true);
  const note = notes.find((n) => n.id === currentId);
  if (!note) return;
  const body = `${note.title}\n\n${note.contentText || ""}`;
  downloadTextFile(`${(note.title || "note").replaceAll(/\s+/g, "_")}.txt`, body, "text/plain");
  awardXp("export", 3);
}

function exportCurrentNoteJson() {
  if (!currentId) return setShareStatus("Open a note first.", true);
  const note = notes.find((n) => n.id === currentId);
  if (!note) return;
  downloadTextFile(
    `${(note.title || "note").replaceAll(/\s+/g, "_")}.json`,
    JSON.stringify(note, null, 2),
    "application/json"
  );
  awardXp("export", 3);
}

function exportCurrentNotePdf() {
  window.print();
  awardXp("export", 3);
}

async function loadReferralCode() {
  if (!token) return;
  try {
    const out = await api("/api/referral/code", { method: "GET" });
    myReferralCodeEl.textContent = `Your referral code: ${out.code}`;
  } catch (e) {
    myReferralCodeEl.textContent = `Referral error: ${e.message}`;
  }
}

async function applyReferralCode() {
  const code = String(referralCodeInputEl.value || "").trim().toUpperCase();
  if (!code) return setReferralStatus("Enter a referral code.", true);
  try {
    await api("/api/referral/apply", {
      method: "POST",
      body: JSON.stringify({ code })
    });
    setReferralStatus("Referral applied.");
    awardXp("referral", 5);
  } catch (e) {
    setReferralStatus(`Referral error: ${e.message}`, true);
  }
}

async function sendFeedbackReport() {
  const text = String(feedbackTextEl.value || "").trim();
  if (!text) return setFeedbackStatus("Write feedback first.", true);
  try {
    await api("/api/feedback/report", {
      method: "POST",
      body: JSON.stringify({
        text,
        page: location.pathname
      })
    });
    feedbackTextEl.value = "";
    setFeedbackStatus("Feedback sent. Thank you.");
    awardXp("feedback", 4);
  } catch (e) {
    setFeedbackStatus(`Feedback error: ${e.message}`, true);
  }
}

async function saveNote() {
  if (!token) return;
  const prevSourcesKey = sourcesKeyForCurrentNote();
  const prevSources = loadSourcesForCurrentNote();
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
  // If user imported sources before saving a new note (draft), move sources to the saved note id.
  try {
    const nextKey = sourcesKeyForCurrentNote();
    if (prevSources.length && prevSourcesKey !== nextKey && !localStorage.getItem(nextKey)) {
      localStorage.setItem(nextKey, JSON.stringify(prevSources));
      localStorage.removeItem(prevSourcesKey);
    }
  } catch {
    // ignore
  }
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
      body: JSON.stringify({ action, noteText, selectedText, sources: getAiSourcesForRequest(6) })
    });
    setOutputWithCitations(aiOutputEl, data.output || "(No output)", data.citations || []);
    fireAndForgetTrack("ai.action", { action });
    awardXp(action, 5);
    await countOutputAndMaybeShowAds(`ai.${action}`);
  } catch (err) {
    const quota = formatQuotaError(err, "AI limit reached.");
    aiOutputEl.textContent = quota ? quota : `Error: ${err.message}`;
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
  if (!tutorialSeen()) {
    setTimeout(() => openTutorial(), 120);
  }
}

function clearTutorialFocus() {
  document.querySelectorAll(".tutorial-focus").forEach((el) => el.classList.remove("tutorial-focus"));
}

function renderTutorialStep() {
  const step = tutorialSteps[tutorialStepIndex];
  if (!step) return;
  tutorialTitleEl.textContent = step.title;
  tutorialTextEl.textContent = step.text;
  tutorialProgressEl.textContent = `Step ${tutorialStepIndex + 1} of ${tutorialSteps.length}`;
  tutorialBackEl.disabled = tutorialStepIndex === 0;
  tutorialNextEl.textContent = tutorialStepIndex === tutorialSteps.length - 1 ? "Finish" : "Next";
  clearTutorialFocus();
  const target = document.querySelector(step.selector);
  if (target) {
    target.classList.add("tutorial-focus");
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function openTutorial() {
  tutorialStepIndex = 0;
  tutorialOverlayEl.classList.remove("hidden");
  tutorialOverlayEl.setAttribute("aria-hidden", "false");
  renderTutorialStep();
}

function closeTutorial(markSeen = true) {
  tutorialOverlayEl.classList.add("hidden");
  tutorialOverlayEl.setAttribute("aria-hidden", "true");
  clearTutorialFocus();
  if (markSeen) markTutorialSeen();
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

function clamp(n, min, max) {
  const x = Number(n);
  if (!Number.isFinite(x)) return min;
  return Math.max(min, Math.min(max, x));
}

function flashcardLayoutKey() {
  return authScopedKey("flashcard_layout_v1");
}

function loadFlashcardLayout() {
  try {
    const raw = localStorage.getItem(flashcardLayoutKey()) || "";
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (!obj || typeof obj !== "object") return null;
    return obj;
  } catch {
    return null;
  }
}

function saveFlashcardLayout(layout) {
  try {
    localStorage.setItem(flashcardLayoutKey(), JSON.stringify(layout));
  } catch {
    // ignore
  }
}

function attachDragResize(floatEl, stageEl, handleEl, resizerEl, getScale, setScale) {
  if (!floatEl || !stageEl || !handleEl) return;

  // Remove previous handlers if this is being re-attached.
  if (floatEl.__fc_cleanup) {
    try {
      floatEl.__fc_cleanup();
    } catch {
      // ignore
    }
    floatEl.__fc_cleanup = null;
  }

  const minW = 320;
  const minH = 260;

  const readLayout = () => {
    const left = Number.parseFloat(floatEl.style.left || "0") || 0;
    const top = Number.parseFloat(floatEl.style.top || "0") || 0;
    const width = Number.parseFloat(floatEl.style.width || "0") || floatEl.getBoundingClientRect().width;
    const height = Number.parseFloat(floatEl.style.height || "0") || floatEl.getBoundingClientRect().height;
    return { left, top, width, height, scale: getScale() };
  };

  const applyLayout = (layout, { persist = true } = {}) => {
    const stageRect = stageEl.getBoundingClientRect();
    const width = clamp(layout.width, minW, Math.max(minW, stageRect.width));
    const height = clamp(layout.height, minH, Math.max(minH, stageRect.height));
    const left = clamp(layout.left, 0, Math.max(0, stageRect.width - width));
    const top = clamp(layout.top, 0, Math.max(0, stageRect.height - height));

    floatEl.style.left = `${left}px`;
    floatEl.style.top = `${top}px`;
    floatEl.style.width = `${width}px`;
    floatEl.style.height = `${height}px`;
    setScale(layout.scale);
    if (persist) saveFlashcardLayout({ left, top, width, height, scale: layout.scale });
  };

  const onResizeWindow = () => {
    const existing = loadFlashcardLayout();
    if (existing) applyLayout(existing, { persist: false });
  };

  window.addEventListener("resize", onResizeWindow);

  let drag = null;
  const onHandleDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    e.preventDefault();
    const r = floatEl.getBoundingClientRect();
    const stageRect = stageEl.getBoundingClientRect();
    drag = {
      startX: e.clientX,
      startY: e.clientY,
      startLeft: r.left - stageRect.left,
      startTop: r.top - stageRect.top
    };
    handleEl.setPointerCapture?.(e.pointerId);
  };
  const onHandleMove = (e) => {
    if (!drag) return;
    e.preventDefault();
    const stageRect = stageEl.getBoundingClientRect();
    const width = floatEl.getBoundingClientRect().width;
    const height = floatEl.getBoundingClientRect().height;
    const left = clamp(drag.startLeft + (e.clientX - drag.startX), 0, Math.max(0, stageRect.width - width));
    const top = clamp(drag.startTop + (e.clientY - drag.startY), 0, Math.max(0, stageRect.height - height));
    floatEl.style.left = `${left}px`;
    floatEl.style.top = `${top}px`;
  };
  const onHandleUp = (e) => {
    if (!drag) return;
    e.preventDefault();
    drag = null;
    saveFlashcardLayout(readLayout());
  };

  handleEl.addEventListener("pointerdown", onHandleDown);
  handleEl.addEventListener("pointermove", onHandleMove);
  handleEl.addEventListener("pointerup", onHandleUp);
  handleEl.addEventListener("pointercancel", onHandleUp);

  let resize = null;
  const onResizerDown = (e) => {
    if (!resizerEl) return;
    if (e.button !== undefined && e.button !== 0) return;
    e.preventDefault();
    const r = floatEl.getBoundingClientRect();
    resize = { startX: e.clientX, startY: e.clientY, startW: r.width, startH: r.height };
    resizerEl.setPointerCapture?.(e.pointerId);
  };
  const onResizerMove = (e) => {
    if (!resize) return;
    e.preventDefault();
    const stageRect = stageEl.getBoundingClientRect();
    const left = Number.parseFloat(floatEl.style.left || "0") || 0;
    const top = Number.parseFloat(floatEl.style.top || "0") || 0;
    const maxW = Math.max(minW, stageRect.width - left);
    const maxH = Math.max(minH, stageRect.height - top);
    const w = clamp(resize.startW + (e.clientX - resize.startX), minW, maxW);
    const h = clamp(resize.startH + (e.clientY - resize.startY), minH, maxH);
    floatEl.style.width = `${w}px`;
    floatEl.style.height = `${h}px`;
  };
  const onResizerUp = (e) => {
    if (!resize) return;
    e.preventDefault();
    resize = null;
    saveFlashcardLayout(readLayout());
  };

  if (resizerEl) {
    resizerEl.addEventListener("pointerdown", onResizerDown);
    resizerEl.addEventListener("pointermove", onResizerMove);
    resizerEl.addEventListener("pointerup", onResizerUp);
    resizerEl.addEventListener("pointercancel", onResizerUp);
  }

  floatEl.__fc_cleanup = () => {
    window.removeEventListener("resize", onResizeWindow);
    handleEl.removeEventListener("pointerdown", onHandleDown);
    handleEl.removeEventListener("pointermove", onHandleMove);
    handleEl.removeEventListener("pointerup", onHandleUp);
    handleEl.removeEventListener("pointercancel", onHandleUp);
    if (resizerEl) {
      resizerEl.removeEventListener("pointerdown", onResizerDown);
      resizerEl.removeEventListener("pointermove", onResizerMove);
      resizerEl.removeEventListener("pointerup", onResizerUp);
      resizerEl.removeEventListener("pointercancel", onResizerUp);
    }
  };
}

async function fetchDueCount() {
  const data = await api("/api/flashcards/stats", { method: "GET" });
  return Number(data.dueCount || 0);
}

function offlineDueCardsKey() {
  return authScopedKey("offline_due_cards_v1");
}

function saveOfflineDueCards(cards) {
  try {
    const slim = (Array.isArray(cards) ? cards : []).slice(0, 200).map((c) => ({
      id: c.id,
      front: c.front,
      back: c.back,
      tags: c.tags || [],
      dueAt: c.dueAt || ""
    }));
    localStorage.setItem(offlineDueCardsKey(), JSON.stringify({ savedAt: Date.now(), cards: slim }));
  } catch {
    // ignore
  }
}

function loadOfflineDueCards() {
  try {
    const raw = localStorage.getItem(offlineDueCardsKey()) || "";
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const cards = Array.isArray(parsed?.cards) ? parsed.cards : [];
    return cards;
  } catch {
    return [];
  }
}

function flashcardReviewQueueKey() {
  return authScopedKey("offline_flashcard_reviews_v1");
}

function loadFlashcardReviewQueue() {
  try {
    const raw = localStorage.getItem(flashcardReviewQueueKey()) || "[]";
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveFlashcardReviewQueue(items) {
  try {
    localStorage.setItem(flashcardReviewQueueKey(), JSON.stringify(items || []));
  } catch {
    // ignore
  }
}

function isLikelyOfflineError(e) {
  const msg = String(e?.message || "");
  // Browser fetch failures typically look like this.
  return !navigator.onLine || msg.includes("Failed to fetch") || msg.includes("NetworkError");
}

async function submitFlashcardReviewOrQueue(id, grade) {
  try {
    const out = await api("/api/flashcards/review", {
      method: "POST",
      body: JSON.stringify({ id, grade })
    });
    return { queued: false, flashcard: out.flashcard || null };
  } catch (e) {
    if (!isLikelyOfflineError(e)) throw e;
    const q = loadFlashcardReviewQueue();
    q.push({ id: String(id || ""), grade: Number(grade), queuedAt: Date.now() });
    // Keep bounded.
    saveFlashcardReviewQueue(q.slice(-500));
    return { queued: true, flashcard: null };
  }
}

async function flushFlashcardReviewQueue() {
  if (!token) return;
  const q = loadFlashcardReviewQueue();
  if (!q.length) return;
  if (!navigator.onLine) return;

  const remaining = [];
  for (let i = 0; i < q.length; i += 1) {
    const item = q[i];
    try {
      await api("/api/flashcards/review", {
        method: "POST",
        body: JSON.stringify({ id: item.id, grade: item.grade })
      });
    } catch (e) {
      // Stop flushing if network looks down again; keep remaining.
      if (isLikelyOfflineError(e)) {
        remaining.push(item, ...q.slice(i + 1));
        break;
      }
      // For non-network errors, drop the item to avoid permanent stuck queues.
    }
  }
  saveFlashcardReviewQueue(remaining);
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
      body: JSON.stringify({ noteId: currentId, noteText, count: 10, sources: getAiSourcesForRequest(6) })
    });
    const created = data.created || [];
    const due = await fetchDueCount();
    setOutputWithCitations(
      aiOutputEl,
      `Created ${created.length} flashcards. Due now: ${due}.`,
      data.citations || []
    );
    fireAndForgetTrack("flashcards.generate", { count: created.length });
    awardXp("flashcards", 8);
    loadLearningPlan().catch(() => {});
    await countOutputAndMaybeShowAds("flashcards.generate");
  } catch (e) {
    const quota = formatQuotaError(e, "Flashcard limit reached.");
    aiOutputEl.textContent = quota ? quota : `Flashcards error: ${e.message}`;
  }
}

async function renderStudyDue() {
  openOverlay("Study due flashcards");
  overlayBodyEl.innerHTML = `<div class="muted">Loading due cards...</div>`;

  let cards = [];
  try {
    const data = await api("/api/flashcards?due=1&limit=50", { method: "GET" });
    cards = data.flashcards || [];
    if (cards.length) saveOfflineDueCards(cards);
  } catch (e) {
    cards = loadOfflineDueCards();
    if (!cards.length) throw e;
    // Show a subtle offline hint.
    aiOutputEl.textContent = "Offline mode: using your last saved due cards.";
  }

  if (!cards.length) {
    overlayBodyEl.innerHTML = `<div class="muted">No cards due right now. Generate more from a note.</div>`;
    return;
  }

  let idx = 0;
  let showBack = false;
  let reviewed = 0;

  // Movable/resizable flashcard panel.
  overlayBodyEl.innerHTML = "";
  const stage = document.createElement("div");
  stage.className = "flashcard-stage";
  overlayBodyEl.appendChild(stage);

  const float = document.createElement("div");
  float.className = "flashcard-float";
  stage.appendChild(float);

  let fcScale = 1;
  const applyScale = (v) => {
    fcScale = clamp(v, 0.85, 1.6);
    float.style.setProperty("--fc-scale", String(fcScale));
  };

  const setDefaultLayout = () => {
    const stageRect = stage.getBoundingClientRect();
    const width = Math.min(760, Math.max(360, Math.floor(stageRect.width * 0.92)));
    const height = Math.min(640, Math.max(320, Math.floor(stageRect.height * 0.74)));
    const left = Math.max(0, Math.floor((stageRect.width - width) / 2));
    const top = 12;
    float.style.left = `${left}px`;
    float.style.top = `${top}px`;
    float.style.width = `${width}px`;
    float.style.height = `${height}px`;
    applyScale(1);
    saveFlashcardLayout({ left, top, width, height, scale: 1 });
  };

  // Initialize layout once stage has a real size.
  setTimeout(() => {
    const saved = loadFlashcardLayout();
    if (!saved) return setDefaultLayout();
    float.style.left = `${Number(saved.left || 0)}px`;
    float.style.top = `${Number(saved.top || 0)}px`;
    if (saved.width) float.style.width = `${Number(saved.width)}px`;
    if (saved.height) float.style.height = `${Number(saved.height)}px`;
    applyScale(Number(saved.scale || 1));
  }, 0);

  function renderAdBreak(nextFn) {
    stage.innerHTML = "";

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

    stage.appendChild(box);

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
    stage.innerHTML = "";
    stage.appendChild(float);
    float.innerHTML = "";

    const head = document.createElement("div");
    head.className = "flashcard-float-head";

    const headLeft = document.createElement("div");
    headLeft.className = "muted";
    headLeft.textContent = `Card ${idx + 1} / ${cards.length}`;
    head.appendChild(headLeft);

    const headBtns = document.createElement("div");
    headBtns.className = "row wrap";

    const mkHeadBtn = (label, onClick) => {
      const b = document.createElement("button");
      b.className = "ghost";
      b.type = "button";
      b.textContent = label;
      b.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation(); // Don't start drag.
        onClick();
      });
      return b;
    };

    headBtns.appendChild(
      mkHeadBtn("A-", () => {
        applyScale(fcScale - 0.08);
        saveFlashcardLayout({ ...(loadFlashcardLayout() || {}), ...(() => {
          const r = float.getBoundingClientRect();
          const sr = stage.getBoundingClientRect();
          return { left: r.left - sr.left, top: r.top - sr.top, width: r.width, height: r.height, scale: fcScale };
        })() });
      })
    );
    headBtns.appendChild(
      mkHeadBtn("A+", () => {
        applyScale(fcScale + 0.08);
        saveFlashcardLayout({ ...(loadFlashcardLayout() || {}), ...(() => {
          const r = float.getBoundingClientRect();
          const sr = stage.getBoundingClientRect();
          return { left: r.left - sr.left, top: r.top - sr.top, width: r.width, height: r.height, scale: fcScale };
        })() });
      })
    );
    headBtns.appendChild(mkHeadBtn("Reset", () => setDefaultLayout()));
    head.appendChild(headBtns);

    float.appendChild(head);

    const body = document.createElement("div");
    body.className = "flashcard-float-body";

    const front = document.createElement("div");
    front.className = "card-face";
    front.innerHTML = `<h3>Front</h3><div class="mono"></div>`;
    front.querySelector(".mono").textContent = c.front;
    body.appendChild(front);

    const back = document.createElement("div");
    back.className = "card-face";
    back.innerHTML = `<h3>Back</h3><div class="mono"></div>`;
    back.querySelector(".mono").textContent = showBack ? c.back : "Click “Show answer”.";
    body.appendChild(back);

    if (!showBack) {
      const showBtn = document.createElement("button");
      showBtn.className = "ghost";
      showBtn.textContent = "Show answer";
      showBtn.addEventListener("click", () => {
        showBack = true;
        render();
      });
      body.appendChild(buttonRow([showBtn]));
    } else {
      const mk = (label, grade, cls = "ghost") => {
        const b = document.createElement("button");
        b.className = cls;
        b.textContent = label;
        b.addEventListener("click", async () => {
          await submitFlashcardReviewOrQueue(c.id, grade);
          fireAndForgetTrack("flashcards.review", { grade });
          loadLearningPlan().catch(() => {});
          idx += 1;
          reviewed += 1;
          showBack = false;
          if (idx >= cards.length) {
            stage.innerHTML = `<div class="muted">Done. You reviewed ${cards.length} cards.</div>`;
          } else {
            if (!adFree && areAdsEnabled() && reviewed % 3 === 0) {
              renderAdBreak(render);
            } else {
              render();
            }
          }
        });
        return b;
      };

      body.appendChild(buttonRow([mk("Again", 0), mk("Hard", 1), mk("Good", 2), mk("Easy", 3)]));
    }

    float.appendChild(body);

    const resizer = document.createElement("div");
    resizer.className = "fc-resizer";
    float.appendChild(resizer);

    attachDragResize(float, stage, head, resizer, () => fcScale, (v) => applyScale(v));
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
  const examMode = String(examModeEl?.value || "standard");

  let out;
  try {
    out = await api("/api/testprep/generate", {
      method: "POST",
      body: JSON.stringify({ noteText, numQuestions: 8, mode: examMode, sources: getAiSourcesForRequest(6) })
    });
  } catch (e) {
    const quota = formatQuotaError(e, "Practice test limit reached.");
    overlayBodyEl.innerHTML = `<div class="muted">${escapeHtml(quota ? quota : `Test prep error: ${e.message}`)}</div>`;
    return;
  }

  const questions = out.questions || [];
  fireAndForgetTrack("testprep.generate", { count: questions.length });
  awardXp("testprep", 7);
  await countOutputAndMaybeShowAds("testprep.generate");
  if (!questions.length) {
    overlayBodyEl.innerHTML = `<div class="muted">No questions generated.</div>`;
    return;
  }

  const form = document.createElement("div");
  if (examMode === "timed") {
    const timer = document.createElement("div");
    timer.className = "muted";
    let left = 10 * 60;
    timer.textContent = `Time left: 10:00`;
    const iv = setInterval(() => {
      left -= 1;
      const mm = String(Math.max(0, Math.floor(left / 60))).padStart(2, "0");
      const ss = String(Math.max(0, left % 60)).padStart(2, "0");
      timer.textContent = `Time left: ${mm}:${ss}`;
      if (left <= 0) clearInterval(iv);
    }, 1000);
    overlayBodyEl.appendChild(timer);
  }
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

  const scoreRow = document.createElement("div");
  scoreRow.className = "muted";
  scoreRow.style.marginBottom = "0.6rem";
  scoreRow.textContent = "Answer what you can, then grade.";

  function norm(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function getMcqSelected(i) {
    const checked = form.querySelector(`input[type="radio"][name="q_${i}"]:checked`);
    return checked ? String(checked.value || "") : "";
  }

  function getShortAnswer(i) {
    const input = form.querySelector(`textarea[data-q-index="${i}"]`);
    return input ? String(input.value || "") : "";
  }

  function resolveMcqCorrect(q) {
    const choices = Array.isArray(q.choices) ? q.choices : [];
    const ans = String(q.answer || "");
    const ansN = norm(ans);
    if (!choices.length) return ans;
    const exact = choices.find((c) => norm(c) === ansN);
    if (exact) return exact;
    if (/^[a-d]$/i.test(ansN)) {
      const idx = "abcd".indexOf(ansN.toLowerCase());
      return choices[idx] || ans;
    }
    return ans;
  }

  const gradeBtn = document.createElement("button");
  gradeBtn.textContent = "Grade test";
  gradeBtn.addEventListener("click", () => {
    const blocks = [...form.querySelectorAll(".card-face")];
    let correct = 0;
    let total = questions.length;

    blocks.forEach((b, i) => {
      const q = questions[i] || {};
      const type = q.type || "short";
      let ok = false;

      if (type === "mcq") {
        const picked = getMcqSelected(i);
        const correctChoice = resolveMcqCorrect(q);
        ok = norm(picked) && norm(picked) === norm(correctChoice);
      } else {
        const typed = getShortAnswer(i);
        // We don't auto-grade free-response reliably; show model answer and let students self-check.
        ok = false;
      }

      if (type === "mcq" && ok) correct += 1;

      const marker = document.createElement("div");
      marker.className = "muted";
      marker.style.marginTop = "0.6rem";
      marker.style.fontWeight = "800";
      marker.style.color = type === "mcq" ? (ok ? "#166534" : "#b91c1c") : "#0f172a";
      marker.textContent = type === "mcq" ? (ok ? "Correct" : "Incorrect") : "Free response (self-check)";
      b.appendChild(marker);
    });

    const mcqCount = questions.filter((q) => q.type === "mcq").length;
    const msg =
      mcqCount > 0
        ? `Score (MCQ only): ${correct}/${mcqCount}. Free-response is self-check.`
        : "No MCQ questions to auto-grade. Use self-check.";
    scoreRow.textContent = msg;
    gradeBtn.disabled = true;
  });

  const showBtn = document.createElement("button");
  showBtn.className = "ghost";
  showBtn.textContent = "Show answers";
  showBtn.addEventListener("click", () => {
    const blocks = [...form.querySelectorAll(".card-face")];
    blocks.forEach((b, i) => {
      if (b.querySelector(".testprep-answer")) return;
      const ans = document.createElement("div");
      ans.className = "mono testprep-answer";
      ans.style.marginTop = "0.8rem";
      ans.textContent = `Answer: ${questions[i].answer}\n\nExplanation: ${questions[i].explanation || ""}`.trim();
      b.appendChild(ans);

      const cites = Array.isArray(questions[i].citations) ? questions[i].citations : [];
      if (cites.length && Array.isArray(out.citations)) {
        const mapped = out.citations.filter((c) => cites.includes(String(c.id || "").trim()));
        const citEl = renderCitationsInline(mapped);
        if (citEl) b.appendChild(citEl);
      }
    });
    showBtn.disabled = true;
  });

  overlayBodyEl.innerHTML = "";
  overlayBodyEl.appendChild(scoreRow);
  overlayBodyEl.appendChild(form);
  const globalCites = renderCitationsInline(out.citations || []);
  overlayBodyEl.appendChild(buttonRow([gradeBtn, showBtn]));
  if (globalCites) overlayBodyEl.appendChild(globalCites);
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
      const quota = formatQuotaError(err, "Transcription limit reached.");
      aiOutputEl.textContent = quota ? quota : `Transcription error: ${err.message}`;
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
editorEl.addEventListener("input", () => {
  lastTypingAt = Date.now();
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
askTutorBtn.addEventListener("click", () => askTutor());
autoPlanBtn.addEventListener("click", () => generateAutoPlan());
shareNoteBtn.addEventListener("click", () => shareCurrentNote());
exportTxtBtn.addEventListener("click", () => exportCurrentNoteTxt());
exportJsonBtn.addEventListener("click", () => exportCurrentNoteJson());
exportPdfBtn.addEventListener("click", () => exportCurrentNotePdf());
refreshDashboardBtn.addEventListener("click", () => loadDashboard());
applyReferralBtn.addEventListener("click", () => applyReferralCode());
sendFeedbackBtn.addEventListener("click", () => sendFeedbackReport());
saveReminderBtn.addEventListener("click", async () => {
  const ok = await requestNotificationPermission();
  if (!ok) return setReminderStatus("Notification permission is required.", true);
  const time = String(reminderTimeEl.value || "").trim();
  if (!time) return setReminderStatus("Choose a reminder time.", true);
  localStorage.setItem(authScopedKey("reminder_cfg_v1"), JSON.stringify({ time, lastFired: "" }));
  scheduleReminderTick();
  setReminderStatus(`Reminder saved for ${time}.`);
});
testReminderBtn.addEventListener("click", async () => {
  const ok = await requestNotificationPermission();
  if (!ok) return setReminderStatus("Notification permission denied.", true);
  new Notification("Notematica test reminder", { body: "Your study reminder is active." });
  setReminderStatus("Test notification sent.");
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

if (tabBtnWriteEl) tabBtnWriteEl.addEventListener("click", () => setActiveTab("write"));
if (tabBtnSourcesEl) tabBtnSourcesEl.addEventListener("click", () => setActiveTab("sources"));
if (tabBtnStudyEl) tabBtnStudyEl.addEventListener("click", () => setActiveTab("study"));

if (focusToggleBtn) {
  focusToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("focus-mode");
    try {
      localStorage.setItem(authScopedKey("focus_mode_v1"), document.body.classList.contains("focus-mode") ? "1" : "0");
    } catch {}
  });
}

if (clearOutputBtn) {
  clearOutputBtn.addEventListener("click", () => {
    aiOutputEl.textContent = "";
    setPlanStatus("");
    tutorOutputEl.textContent = "";
  });
}

if (sourcesRefreshBtn) sourcesRefreshBtn.addEventListener("click", () => renderSourcesManager());
if (sourcesClearBtn) {
  sourcesClearBtn.addEventListener("click", () => {
    if (!currentId) return;
    if (!confirm("Clear all sources attached to this note?")) return;
    saveSourcesForCurrentNote([]);
    renderSourcesManager();
    setSourceStatus("Cleared sources for this note.");
  });
}

if (builderChatToggleEl) {
  builderChatToggleEl.addEventListener("click", () => {
    const open = builderChatEl && !builderChatEl.classList.contains("hidden");
    if (open) closeBuilderChat();
    else openBuilderChat();
  });
}
if (builderChatCloseEl) builderChatCloseEl.addEventListener("click", () => closeBuilderChat());
if (builderChatFormEl) {
  builderChatFormEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = String(builderChatInputEl?.value || "").trim();
    if (!v) return;
    if (builderChatInputEl) builderChatInputEl.value = "";
    sendBuilderChatMessage(v).catch(() => {});
  });
}
builderChatChipEls.forEach((b) => {
  b.addEventListener("click", () => {
    const text = String(b.dataset.builderChip || "").trim();
    if (!text) return;
    openBuilderChat();
    sendBuilderChatMessage(text).catch(() => {});
  });
});
window.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  const open = builderChatEl && !builderChatEl.classList.contains("hidden");
  if (open) closeBuilderChat();
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
startTutorialBtn.addEventListener("click", () => openTutorial());
tutorialSkipEl.addEventListener("click", () => closeTutorial(true));
tutorialBackEl.addEventListener("click", () => {
  tutorialStepIndex = Math.max(0, tutorialStepIndex - 1);
  renderTutorialStep();
});
tutorialNextEl.addEventListener("click", () => {
  if (tutorialStepIndex >= tutorialSteps.length - 1) {
    closeTutorial(true);
    return;
  }
  tutorialStepIndex += 1;
  renderTutorialStep();
});
tutorialOverlayEl.addEventListener("click", (e) => {
  if (e.target === tutorialOverlayEl) closeTutorial(true);
});
themeSelectEl.addEventListener("change", () => {
  const t = String(themeSelectEl.value || "bold");
  applyTheme(t);
  saveTheme(t);
});

(async function init() {
  if (!token) {
    window.location.href = "/login.html";
    return;
  }
  registerServiceWorker();
  await loadConfig();
  await loadMe();
  if (!me) {
    window.location.href = "/login.html";
    return;
  }
  try {
    const focusOn = localStorage.getItem(authScopedKey("focus_mode_v1")) === "1";
    if (focusOn) document.body.classList.add("focus-mode");
  } catch {}
  loadTheme();
  loadOutputCounter();
  const upgradedKey = authScopedKey("upgraded_at_v1");
  const upgradedAtRaw = sessionStorage.getItem(upgradedKey) || "0";
  sessionUpgradedAt = Number(upgradedAtRaw) || 0;
  const billingState = new URLSearchParams(location.search).get("billing");
  if (billingState === "success") {
    sessionUpgradedAt = Date.now();
    sessionStorage.setItem(upgradedKey, String(sessionUpgradedAt));
  }
  refreshXpUi();
  const reminderCfgRaw = localStorage.getItem(authScopedKey("reminder_cfg_v1")) || "{}";
  try {
    const reminderCfg = JSON.parse(reminderCfgRaw);
    if (reminderCfg?.time) reminderTimeEl.value = reminderCfg.time;
  } catch {}
  scheduleReminderTick();
  updateAuthUi();
  await loadNotes();
  await loadBillingStatus();
  await loadAnalyticsSummary();
  await loadLearningPlan();
  await loadDashboard();
  await loadReferralCode();
  flushFlashcardReviewQueue().catch(() => {});
  window.addEventListener("online", () => flushFlashcardReviewQueue().catch(() => {}));
  if (IS_NATIVE_SHELL) {
    // Store wrappers: avoid showing any purchase/upgrade CTAs or external billing portals.
    setHidden(subscribeBtn, true);
    setHidden(manageBtn, true);
    setHidden(upgradeLearningBtn, true);
    setHidden(upgradeSourcesBtn, true);
    setHidden(upgradeAiBtn, true);
  }
  // Keep safe area correct on resize/orientation changes (mobile Safari).
  window.addEventListener("resize", () => syncBottomAdSafeArea());
  if (!onboardingSeen()) openOnboarding();
  else if (!tutorialSeen()) openTutorial();
})();

subscribeBtn.addEventListener("click", () => startCheckout());
manageBtn.addEventListener("click", () => openPortal());
