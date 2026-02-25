const authCardEl = document.getElementById("auth-card");
const workspaceEl = document.getElementById("workspace");
const logoutBtn = document.getElementById("logout-btn");
const startTutorialBtn = document.getElementById("start-tutorial-btn");
const authStatusEl = document.getElementById("auth-status");
const cloudBadgeEl = document.getElementById("cloud-badge");
const themeSelectEl = document.getElementById("theme-select");
const subscribeBtn = document.getElementById("subscribe-btn");
const manageBtn = document.getElementById("manage-btn");
const cancelMembershipBtn = document.getElementById("cancel-membership-btn");
const billingStatusEl = document.getElementById("billing-status");
const profileDisplayNameEl = document.getElementById("profile-display-name");
const profileBioEl = document.getElementById("profile-bio");
const profileAvatarPreviewEl = document.getElementById("profile-avatar-preview");
const profileAvatarInputEl = document.getElementById("profile-avatar-input");
const profileAvatarRemoveBtn = document.getElementById("profile-avatar-remove-btn");
const profileSaveBtn = document.getElementById("profile-save-btn");
const profileStatusEl = document.getElementById("profile-status");
const passwordCurrentEl = document.getElementById("password-current");
const passwordNewEl = document.getElementById("password-new");
const passwordChangeBtn = document.getElementById("password-change-btn");
const passwordStatusEl = document.getElementById("password-status");
const deleteAccountConfirmEl = document.getElementById("delete-account-confirm");
const deleteAccountPasswordEl = document.getElementById("delete-account-password");
const deleteAccountBtn = document.getElementById("delete-account-btn");
const deleteAccountStatusEl = document.getElementById("delete-account-status");
const metricTotalEl = document.getElementById("metric-total");
const metricTopEventEl = document.getElementById("metric-top-event");
const metricFlashcardsEl = document.getElementById("metric-flashcards");
const metricAiEl = document.getElementById("metric-ai");
const refreshLearningBtn = document.getElementById("refresh-learning-btn");
const clearLearningBtn = document.getElementById("clear-learning-btn");
const learningStatusEl = document.getElementById("learning-status");
const learningMasteryEl = document.getElementById("learning-mastery");
const learningDueEl = document.getElementById("learning-due");
const learningFocusEl = document.getElementById("learning-focus");
const learningNextEl = document.getElementById("learning-next");
const upgradeLearningBtn = document.getElementById("upgrade-learning-btn");

const notesListEl = document.getElementById("notes-list");
const searchInputEl = document.getElementById("search-input");
const titleEl = document.getElementById("note-title");
const tagsEl = document.getElementById("note-tags");
const editorEl = document.getElementById("note-editor");
const newBtn = document.getElementById("new-note-btn");
const saveBtn = document.getElementById("save-btn");
const deleteBtn = document.getElementById("delete-btn");
const noteFlowStatusEl = document.getElementById("note-flow-status");
const noteFlowSaveNowBtn = document.getElementById("note-flow-save-now-btn");
const noteFlowInsertHeadingBtn = document.getElementById("note-flow-insert-heading-btn");
const noteFlowInsertChecklistBtn = document.getElementById("note-flow-insert-checklist-btn");
const noteOutlineListEl = document.getElementById("note-outline-list");
const noteHandoffTutorBtn = document.getElementById("note-handoff-tutor-btn");
const noteHandoffCardsBtn = document.getElementById("note-handoff-cards-btn");
const noteHandoffExamBtn = document.getElementById("note-handoff-exam-btn");
const noteHandoffPlanBtn = document.getElementById("note-handoff-plan-btn");
const noteHandoffStatusEl = document.getElementById("note-handoff-status");
const aiOutputEl = document.getElementById("ai-output");
const aiButtons = [...document.querySelectorAll("[data-ai]")];
const feedbackAiBtn = document.querySelector('[data-ai="feedback"]');
const upgradeAiBtn = document.getElementById("upgrade-ai-btn");
const formatButtons = [...document.querySelectorAll("[data-cmd]")];
const clearFormatBtn = document.getElementById("clear-format-btn");
const cleanSourceBlocksBtn = document.getElementById("clean-source-blocks-btn");
const recordBtn = document.getElementById("record-btn");
const clearRecordingBtn = document.getElementById("clear-recording-btn");
const genCardsBtn = document.getElementById("gen-cards-btn");
const studyBtn = document.getElementById("study-btn");
const testprepBtn = document.getElementById("testprep-btn");
const sourceFilesEl = document.getElementById("source-files");
const sourceAddFilesBtn = document.getElementById("source-add-files-btn");
const sourceUrlsEl = document.getElementById("source-urls");
const importFilesBtn = document.getElementById("import-files-btn");
const importUrlsBtn = document.getElementById("import-urls-btn");
const upgradeSourcesBtn = document.getElementById("upgrade-sources-btn");
const sourceStatusEl = document.getElementById("source-status");
const sourceFileSelectionEl = document.getElementById("source-file-selection");
const sourceDropZoneEl = document.getElementById("source-drop-zone");
const examModeEl = document.getElementById("exam-mode");
const tutorQuestionEl = document.getElementById("tutor-question");
const askTutorBtn = document.getElementById("ask-tutor-btn");
const tutorOutputEl = document.getElementById("tutor-output");
const tutorCopyBtn = document.getElementById("tutor-copy-btn");
const tutorInsertBtn = document.getElementById("tutor-insert-btn");
const tutorDropZoneEl = document.getElementById("tutor-drop-zone");
const tutorAttachSelectionEl = document.getElementById("tutor-attach-selection");
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
const sourcesFilterInputEl = document.getElementById("sources-filter-input");
const sourcesSortSelectEl = document.getElementById("sources-sort-select");
const sourcesCopyContextBtnEl = document.getElementById("sources-copy-context-btn");
const sourcesStatsEl = document.getElementById("sources-stats");

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

const navViewLinkEls = [...document.querySelectorAll("[data-view-link]")];
const routeViewEls = [...document.querySelectorAll("[data-route-view]")];
const railProfileBtnEl = document.getElementById("rail-profile-btn");
const topProfileBtnEl = document.getElementById("top-profile-btn");
const tabOpenSourcesBtn = document.getElementById("tab-open-sources-btn");
const tabOpenStudyBtn = document.getElementById("tab-open-study-btn");
const homeComposerInputEl = document.getElementById("home-composer-input");
const homeComposeBtnEl = document.getElementById("home-compose-btn");
const homeAttachBtnEl = document.getElementById("home-attach-btn");
const homeDropZoneEl = document.getElementById("home-drop-zone");
const homeAttachSelectionEl = document.getElementById("home-attach-selection");
const tutorAttachBtnEl = document.getElementById("tutor-attach-btn");
const chatAttachFilesEl = document.getElementById("chat-attach-files");
const homeComposeStatusEl = document.getElementById("home-compose-status");
const homeChipTranscribeEl = document.getElementById("home-chip-transcribe");
const homeChipFileSummaryEl = document.getElementById("home-chip-file-summary");
const homeChipHomeworkEl = document.getElementById("home-chip-homework");
const homeChipYoutubeEl = document.getElementById("home-chip-youtube");
const homeChipMoreEl = document.getElementById("home-chip-more");
const homeFeedViewAllEl = document.getElementById("home-feed-view-all");
const homeFeedClearEl = document.getElementById("home-feed-clear");
const homeLearningGridEl = document.getElementById("home-learning-grid");
const homeWelcomeMessageEl = document.getElementById("home-welcome-message");
const homeActionNewNoteEl = document.getElementById("home-action-new-note");
const homeActionImportEl = document.getElementById("home-action-import");
const homeActionStudyEl = document.getElementById("home-action-study");
const homeQuickStatusEl = document.getElementById("home-quick-status");
const homeRefreshMetricsBtnEl = document.getElementById("home-refresh-metrics-btn");
const homeMetricActionsEl = document.getElementById("home-metric-actions");
const homeMetricAiEl = document.getElementById("home-metric-ai");
const homeMetricDueEl = document.getElementById("home-metric-due");
const homeMetricMasteryEl = document.getElementById("home-metric-mastery");
const homeMetricStreakEl = document.getElementById("home-metric-streak");
const homeMetricLevelEl = document.getElementById("home-metric-level");
const homeNextActionEl = document.getElementById("home-next-action");
const homeFocusTopicEl = document.getElementById("home-focus-topic");
const homeUpgradeCardEl = document.getElementById("home-upgrade-card");
const homeUpgradeMessageEl = document.getElementById("home-upgrade-message");
const homeUpgradeBtnEl = document.getElementById("home-upgrade-btn");
const homeUpgradeDismissEl = document.getElementById("home-upgrade-dismiss");
const homeBriefGeneratedAtEl = document.getElementById("home-brief-generated-at");
const homeBriefSummaryEl = document.getElementById("home-brief-summary");
const homeBriefTopicsEl = document.getElementById("home-brief-topics");
const homeBriefActionsEl = document.getElementById("home-brief-actions");
const studyWorkflowRecallBtn = document.getElementById("study-workflow-recall-btn");
const studyWorkflowExamBtn = document.getElementById("study-workflow-exam-btn");
const studyWorkflowWeakBtn = document.getElementById("study-workflow-weak-btn");
const studyWorkflowStatusEl = document.getElementById("study-workflow-status");

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
const APP_VIEWS = ["home", "notes", "sources", "study_tools", "account"];
let currentView = "home";
let activeTab = "write";
let currentId = null;
let analyticsSummary = null;
let learningSummary = { masteryScore: 0, dueNow: 0, weakTags: [], nextActions: [] };
let workspaceBrief = null;
let workspaceBriefFetchedAt = 0;
let noteHasUnsavedChanges = false;
let noteAutoSaveTimer = null;
let noteAutoSaving = false;
let noteLastSavedAt = 0;
let studyWorkflowRunning = false;
let noteHandoffRunning = false;
let viewMotionTimer = null;
let tabMotionTimer = null;
let lastTutorAnswerText = "";
let lastTutorAnswerCitations = [];
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
let lastTranscriptSnapshot = "";
let lastTranscriptEntryId = 0;
let pendingAvatarDataUrl = "";
const SOURCE_UPLOAD_HINT = "No files selected yet. Tap Add files, drag/drop, or paste screenshots/files.";
const CHAT_UPLOAD_HINT = "Attach screenshots/files from your device with Add files, drag/drop, or paste.";
const SOURCE_ASSET_DB_NAME = "notematica_source_assets_v1";
const SOURCE_ASSET_STORE = "assets";
let sourceAssetDbPromise = null;
let overlayObjectUrls = [];
let overlayKeyHandler = null;
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

function isAppView(view) {
  return APP_VIEWS.includes(String(view || ""));
}

function uiViewStorageKey() {
  return authScopedKey("ui_view_v2");
}

function readViewFromUrl() {
  const q = new URLSearchParams(window.location.search).get("view");
  return isAppView(q) ? q : "";
}

function readStoredView() {
  try {
    const v = String(localStorage.getItem(uiViewStorageKey()) || "");
    if (isAppView(v) && v !== "account") return v;
  } catch {
    // ignore storage errors
  }
  return "";
}

function writeStoredView(view) {
  if (!me?.id) return;
  if (!isAppView(view) || view === "account") return;
  try {
    localStorage.setItem(uiViewStorageKey(), view);
  } catch {
    // ignore storage errors
  }
}

function syncViewInUrl(view, replaceHistory = true) {
  const url = new URL(window.location.href);
  url.searchParams.set("view", view);
  if (replaceHistory) window.history.replaceState({ view }, "", url);
  else window.history.pushState({ view }, "", url);
}

function updateRouteNavState(view) {
  navViewLinkEls.forEach((btn) => {
    const target = String(btn.dataset.viewLink || "");
    btn.classList.toggle("active", target === view);
  });
}

function triggerRouteEntranceMotion(view) {
  const target = String(view || "");
  const section = routeViewEls.find((el) => String(el?.dataset?.routeView || "") === target);
  if (!section) return;
  section.classList.remove("view-enter");
  // Force reflow so repeated selections replay the entrance motion.
  void section.offsetWidth;
  section.classList.add("view-enter");
  if (viewMotionTimer) clearTimeout(viewMotionTimer);
  viewMotionTimer = setTimeout(() => {
    section.classList.remove("view-enter");
  }, 420);
}

function setView(view, { persist = true, updateUrl = true, replaceHistory = true } = {}) {
  const next = isAppView(view) ? String(view) : "home";
  currentView = next;
  document.body.setAttribute("data-app-view", next);
  routeViewEls.forEach((section) => {
    const sectionView = String(section.dataset.routeView || "");
    setHidden(section, sectionView !== next);
  });
  updateRouteNavState(next);
  if (persist && next !== "account") writeStoredView(next);
  if (updateUrl) syncViewInUrl(next, replaceHistory);
  if (next === "notes" && activeTab !== "write") setActiveTab("write");
  if (next === "sources") renderSourcesManager();
  if (next === "home") {
    renderLearningFeed();
    updateHomeOutcomeMetrics();
    evaluatePremiumPrompt();
    loadWorkspaceBrief().catch(() => {});
  }
  triggerRouteEntranceMotion(next);
}

function renderView() {
  setView(currentView, { persist: false, updateUrl: false });
}

function updateProfileButtons() {
  const label = me ? "Profile" : "Sign in";
  if (railProfileBtnEl) railProfileBtnEl.textContent = label;
  if (topProfileBtnEl) topProfileBtnEl.textContent = label;
}

function updateHomeWelcomeMessage() {
  if (!homeWelcomeMessageEl) return;
  const displayName = String(me?.displayName || "").trim();
  if (displayName) {
    homeWelcomeMessageEl.textContent = `Welcome back, ${displayName}. Pick one focused action to keep momentum.`;
    return;
  }
  if (me?.email) {
    const user = String(me.email).split("@")[0] || "there";
    homeWelcomeMessageEl.textContent = `Welcome back, ${user}. Pick one focused action to keep momentum.`;
    return;
  }
  homeWelcomeMessageEl.textContent = "Welcome. Pick one focused action to start studying.";
}

function setProfileStatus(msg, isError = false) {
  if (!profileStatusEl) return;
  profileStatusEl.textContent = String(msg || "");
  profileStatusEl.style.color = isError ? "#b91c1c" : "#0f172a";
}

function setPasswordStatus(msg, isError = false) {
  if (!passwordStatusEl) return;
  passwordStatusEl.textContent = String(msg || "");
  passwordStatusEl.style.color = isError ? "#b91c1c" : "#0f172a";
}

function setDeleteAccountStatus(msg, isError = false) {
  if (!deleteAccountStatusEl) return;
  deleteAccountStatusEl.textContent = String(msg || "");
  deleteAccountStatusEl.style.color = isError ? "#b91c1c" : "#0f172a";
}

function setProfileAvatarPreview(url = "") {
  if (!profileAvatarPreviewEl) return;
  const src = String(url || "").trim() || "/logo-mark-notematica.svg";
  profileAvatarPreviewEl.src = src;
}

function populateAccountProfileForm() {
  if (profileDisplayNameEl) profileDisplayNameEl.value = String(me?.displayName || "");
  if (profileBioEl) profileBioEl.value = String(me?.bio || "");
  pendingAvatarDataUrl = String(me?.avatarDataUrl || "");
  setProfileAvatarPreview(pendingAvatarDataUrl);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(reader.error || new Error("Could not read file"));
      reader.readAsDataURL(file);
    } catch (e) {
      reject(e);
    }
  });
}

async function dataUrlToImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not decode image"));
    img.src = dataUrl;
  });
}

function byteLengthFromDataUrl(dataUrl) {
  const raw = String(dataUrl || "");
  const marker = ";base64,";
  const at = raw.indexOf(marker);
  if (at < 0) return raw.length;
  const b64 = raw.slice(at + marker.length);
  const padding = b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0;
  return Math.floor((b64.length * 3) / 4) - padding;
}

async function normalizeAvatarFile(file) {
  if (!(file instanceof File)) throw new Error("No image selected.");
  if (!/^image\//i.test(String(file.type || ""))) throw new Error("Profile photo must be an image file.");
  const original = await readFileAsDataUrl(file);
  const img = await dataUrlToImage(original);
  const maxSide = 360;
  const srcW = Math.max(1, Number(img.naturalWidth || img.width || 1));
  const srcH = Math.max(1, Number(img.naturalHeight || img.height || 1));
  const scale = Math.min(1, maxSide / srcW, maxSide / srcH);
  const width = Math.max(1, Math.round(srcW * scale));
  const height = Math.max(1, Math.round(srcH * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Image canvas is unavailable.");
  ctx.drawImage(img, 0, 0, width, height);
  const qualities = [0.84, 0.76, 0.68, 0.58];
  let out = "";
  for (const q of qualities) {
    out = canvas.toDataURL("image/jpeg", q);
    if (byteLengthFromDataUrl(out) <= 140000) return out;
  }
  if (!out) out = canvas.toDataURL("image/jpeg", 0.58);
  if (byteLengthFromDataUrl(out) > 200000) {
    throw new Error("Profile photo is too large. Use a smaller image.");
  }
  return out;
}

function formatRelativeDate(value) {
  const dt = new Date(value || Date.now());
  if (Number.isNaN(dt.getTime())) return "recent";
  const diffMs = Date.now() - dt.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays <= 0) return "today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 5) return `${diffWeeks} week${diffWeeks === 1 ? "" : "s"} ago`;
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths} month${diffMonths === 1 ? "" : "s"} ago`;
}

function thumbStyleFromSeed(seed) {
  const palettes = [
    ["#7f8dff", "#92e5ff"],
    ["#7e57c2", "#3f83f8"],
    ["#14b8a6", "#bef264"],
    ["#fb923c", "#facc15"],
    ["#ef4444", "#fb7185"],
    ["#06b6d4", "#6366f1"]
  ];
  let hash = 0;
  const s = String(seed || "notematica");
  for (let i = 0; i < s.length; i += 1) {
    hash = (hash * 31 + s.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(hash) % palettes.length;
  const [a, b] = palettes[idx];
  return `linear-gradient(135deg, ${a}, ${b})`;
}

function sanitizePreviewImage(value, maxChars = 160000) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const compact = raw.replace(/\s+/g, "");
  if (compact.length > Math.max(32000, Number(maxChars) || 160000)) return "";
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

function collectSourceMetadata(limit = 120) {
  const all = [];
  const suffix = `_${me?.id || "anon"}`;
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = String(localStorage.key(i) || "");
    if (!key.startsWith("note_sources_v1_")) continue;
    if (!key.endsWith(suffix)) continue;
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || "[]");
      if (!Array.isArray(parsed)) continue;
      parsed.forEach((s) => {
        const name = String(s?.name || s?.url || "Source").trim().slice(0, 180);
        const kind = String(s?.kind || (s?.url ? "url" : "source")).trim().slice(0, 32);
        const url = String(s?.url || "").trim();
        const previewImage = sanitizePreviewImage(s?.previewImage, 180000);
        const assetId = String(s?.assetId || "").trim();
        const mimeType = String(s?.mimeType || "").trim();
        const mediaKind = String(s?.mediaKind || "").trim().toLowerCase();
        all.push({
          name,
          kind,
          url,
          previewImage,
          assetId,
          mimeType,
          mediaKind,
          addedAt: Number(s?.addedAt || 0)
        });
      });
    } catch {
      // Ignore malformed local source entries.
    }
  }
  all.sort((a, b) => Number(b.addedAt || 0) - Number(a.addedAt || 0));
  return all.slice(0, limit);
}

/**
 * @typedef {{
 * id: string,
 * title: string,
 * topic: string,
 * updatedAt: string|number,
 * thumbStyle: string,
 * sourceRef: string,
 * previewImage?: string,
 * sourceKind?: string,
 * sourceName?: string,
 * sourceUrl?: string,
 * sourceAssetId?: string,
 * sourceMimeType?: string,
 * sourceMediaKind?: string
 * }} FeedCard
 */

function buildLearningFeed(noteRows = [], sourceRows = [], analytics = null, { resetAt = 0, showStarterFallback = true } = {}) {
  const toTime = (value) => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    const ms = new Date(value || 0).getTime();
    return Number.isFinite(ms) ? ms : 0;
  };

  const filteredNotes = [...(Array.isArray(noteRows) ? noteRows : [])]
    .filter((n) => toTime(n?.updatedAt) > Number(resetAt || 0))
    .sort((a, b) => toTime(b?.updatedAt) - toTime(a?.updatedAt));

  const filteredSources = [...(Array.isArray(sourceRows) ? sourceRows : [])]
    .map((s) => ({ ...s, _added: Number(s?.addedAt || toTime(s?.updatedAt || 0)) }))
    .filter((s) => Number(s._added || 0) > Number(resetAt || 0))
    .sort((a, b) => Number(b._added || 0) - Number(a._added || 0));

  /** @type {FeedCard[]} */
  const cards = [];
  const topicCounts = new Map();
  const seenTitles = new Set();

  const addTopic = (raw) => {
    const key = String(raw || "").trim().toLowerCase();
    if (!key) return;
    topicCounts.set(key, Number(topicCounts.get(key) || 0) + 1);
  };

  filteredNotes.forEach((n) => {
    const tags = Array.isArray(n?.tags) ? n.tags : [];
    tags.forEach(addTopic);
  });
  filteredSources.forEach((s) => addTopic(s?.kind));
  if (analytics?.topEvent) addTopic(String(analytics.topEvent || "").replaceAll(".", " "));

  const mostCommonTopic =
    [...topicCounts.entries()].sort((a, b) => Number(b[1]) - Number(a[1]))[0]?.[0]?.replace(/\b\w/g, (m) => m.toUpperCase()) ||
    "Study";

  const pushSourceCard = (s, index, prefix = "source") => {
    if (cards.length >= 9) return;
    const title = String(s?.name || s?.url || "").trim();
    if (!title || seenTitles.has(title.toLowerCase())) return;
    seenTitles.add(title.toLowerCase());
    const topic = String(s?.kind || mostCommonTopic || "Source").replace(/\b\w/g, (m) => m.toUpperCase());
    cards.push({
      id: `${prefix}-${index}`,
      title: title.slice(0, 72),
      topic,
      updatedAt: Number(s?._added || Date.now()),
      thumbStyle: thumbStyleFromSeed(`${topic}-${title}`),
      sourceRef: `source:${s?.url || s?.name || index}`,
      previewImage: sanitizePreviewImage(s?.previewImage, 180000),
      sourceKind: String(s?.kind || ""),
      sourceName: String(s?.name || ""),
      sourceUrl: String(s?.url || ""),
      sourceAssetId: String(s?.assetId || ""),
      sourceMimeType: String(s?.mimeType || ""),
      sourceMediaKind: String(s?.mediaKind || "")
    });
  };

  // Prioritize recent screenshot/image sources first so uploaded visuals show up immediately.
  const imageFirst = filteredSources.filter((s) => {
    const kind = String(s?.kind || "").toLowerCase();
    return Boolean(s?.previewImage) || kind.includes("image") || kind.includes("screenshot");
  });
  for (let i = 0; i < imageFirst.length && cards.length < 4; i += 1) {
    pushSourceCard(imageFirst[i], i, "source-image");
  }

  for (let i = 0; i < filteredNotes.length && cards.length < 9; i += 1) {
    const n = filteredNotes[i];
    const title = String(n?.title || "").trim() || String(n?.contentText || "Untitled note").trim().slice(0, 64);
    if (!title || seenTitles.has(title.toLowerCase())) continue;
    seenTitles.add(title.toLowerCase());
    const tags = Array.isArray(n?.tags) ? n.tags.filter(Boolean) : [];
    const topic = String(tags[0] || mostCommonTopic);
    cards.push({
      id: `note-${n.id || i}`,
      title,
      topic,
      updatedAt: n?.updatedAt || Date.now(),
      thumbStyle: thumbStyleFromSeed(`${topic}-${n.id || i}`),
      sourceRef: `note:${n.id || ""}`
    });
  }

  const remainingSources = filteredSources.filter((s) => !imageFirst.includes(s));
  for (let i = 0; i < remainingSources.length && cards.length < 9; i += 1) {
    pushSourceCard(remainingSources[i], i, "source");
  }

  if (analytics?.topEvent && cards.length < 9) {
    cards.push({
      id: "activity",
      title: `Keep momentum: ${String(formatEventName(analytics.topEvent || "")).slice(0, 50)}`,
      topic: "Recent activity",
      updatedAt: Date.now(),
      thumbStyle: thumbStyleFromSeed("analytics"),
      sourceRef: "starter:activity"
    });
  }

  if (cards.length) return cards;
  if (!showStarterFallback) return [];

  const starters = [
    { id: "starter-1", title: "Start with one focused note for today", topic: "Focus" },
    { id: "starter-2", title: "Import a PDF or lecture slide and summarize it", topic: "Sources" },
    { id: "starter-3", title: "Generate 10 flashcards from your notes", topic: "Flashcards" },
    { id: "starter-4", title: "Run a practice test and review mistakes", topic: "Test prep" },
    { id: "starter-5", title: "Ask tutor to explain a weak topic", topic: "Tutor" },
    { id: "starter-6", title: "Build a 7-day study plan", topic: "Planning" }
  ];
  return starters.map((s) => ({
    id: s.id,
    title: s.title,
    topic: s.topic,
    updatedAt: Date.now(),
    thumbStyle: thumbStyleFromSeed(s.id),
    sourceRef: `starter:${s.id}`
  }));
}

function renderLearningFeed() {
  if (!homeLearningGridEl) return;
  const sources = collectSourceMetadata(100);
  const resetAt = readHomeFeedResetAt();
  const cards = buildLearningFeed(notes, sources, analyticsSummary, {
    resetAt,
    showStarterFallback: !resetAt
  });
  homeLearningGridEl.innerHTML = "";
  if (!cards.length) {
    const empty = document.createElement("article");
    empty.className = "learning-empty";
    empty.innerHTML = `
      <h4>Momentum feed cleared</h4>
      <p>Import a new screenshot/source or update a note to repopulate your feed.</p>
      <button type="button" class="ghost learning-empty-reset-btn">Show all activity</button>
    `;
    const resetBtn = empty.querySelector(".learning-empty-reset-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        writeHomeFeedResetAt(0);
        renderLearningFeed();
        setHomeQuickStatus("Momentum feed restored.");
      });
    }
    homeLearningGridEl.appendChild(empty);
    return;
  }
  cards.forEach((card, index) => {
    const item = document.createElement("article");
    item.className = "learning-card";
    item.innerHTML = `
      <div class="learning-card-thumb">
        <span class="learning-card-index">${String(index + 1).padStart(2, "0")}</span>
      </div>
      <div class="learning-card-body">
        <span class="learning-card-topic">${escapeHtml(card.topic || "Study")}</span>
        <h4 class="learning-card-title">${escapeHtml(card.title || "Learning item")}</h4>
        <p class="learning-card-meta">${escapeHtml(formatRelativeDate(card.updatedAt))}</p>
      </div>
    `;
    const thumb = item.querySelector(".learning-card-thumb");
    if (thumb) {
      thumb.style.background = card.thumbStyle;
      const preview = sanitizePreviewImage(card.previewImage, 180000);
      if (preview) {
        const imageEl = document.createElement("img");
        imageEl.className = "learning-card-thumb-image";
        imageEl.loading = "lazy";
        imageEl.decoding = "async";
        imageEl.alt = `${String(card.topic || "Study")} source preview`;
        imageEl.src = preview;
        thumb.appendChild(imageEl);
      }
    }
    item.addEventListener("click", () => {
      const ref = String(card.sourceRef || "");
      if (ref.startsWith("note:")) {
        const noteId = ref.slice(5);
        setView("notes");
        if (noteId) selectNote(noteId);
        return;
      }
      if (ref.startsWith("source:")) {
        openMomentumSourceCard(card).catch(() => {
          setView("sources");
        });
        return;
      }
      setView("study_tools");
    });
    homeLearningGridEl.appendChild(item);
  });
}

function safeHttpUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  try {
    const u = new URL(raw);
    if (u.protocol !== "http:" && u.protocol !== "https:") return "";
    return u.toString();
  } catch {
    return "";
  }
}

function trackOverlayObjectUrl(url) {
  const u = String(url || "").trim();
  if (!u) return;
  overlayObjectUrls.push(u);
}

function releaseOverlayObjectUrls() {
  if (!Array.isArray(overlayObjectUrls) || !overlayObjectUrls.length) return;
  overlayObjectUrls.forEach((u) => {
    try {
      URL.revokeObjectURL(u);
    } catch {
      // ignore
    }
  });
  overlayObjectUrls = [];
}

function setOverlayKeyHandler(handler = null) {
  if (overlayKeyHandler) {
    try {
      window.removeEventListener("keydown", overlayKeyHandler);
    } catch {
      // ignore
    }
    overlayKeyHandler = null;
  }
  if (typeof handler === "function") {
    overlayKeyHandler = handler;
    window.addEventListener("keydown", overlayKeyHandler);
  }
}

function createMomentumPreviewHeader(topic, updatedAt) {
  const meta = document.createElement("div");
  meta.className = "momentum-preview-meta";
  const parts = [];
  if (topic) parts.push(String(topic));
  if (updatedAt) parts.push(`Updated ${formatRelativeDate(updatedAt)}`);
  meta.textContent = parts.join(" • ");
  return meta;
}

async function openMomentumSourceCard(card) {
  const kind = String(card?.sourceKind || "").toLowerCase();
  const title = String(card?.sourceName || card?.title || "Source").trim() || "Source";
  const sourceUrl = safeHttpUrl(card?.sourceUrl);
  const sourceAssetId = String(card?.sourceAssetId || "").trim();
  const sourceMimeType = String(card?.sourceMimeType || "").trim().toLowerCase();
  const sourceMediaKind = String(card?.sourceMediaKind || "").trim().toLowerCase();
  const previewImage = sanitizePreviewImage(card?.previewImage, 180000);
  const isImageKind =
    kind.includes("image") || kind.includes("screenshot") || sourceMediaKind === "image" || /^image\//.test(sourceMimeType);
  const isVideoKind =
    sourceMediaKind === "video" ||
    kind.includes("video") ||
    /^video\//.test(sourceMimeType) ||
    isLikelyVideoUrl(sourceUrl);
  const isAudioKind =
    sourceMediaKind === "audio" ||
    kind.includes("audio") ||
    /^audio\//.test(sourceMimeType) ||
    isLikelyAudioUrl(sourceUrl);
  const isMedia = kind.includes("media") || isVideoKind || isAudioKind;
  const isImage = isImageKind || (!isMedia && (Boolean(previewImage) || isLikelyImageUrl(sourceUrl)));

  if (!isImage && !isMedia && sourceUrl) {
    window.open(sourceUrl, "_blank", "noopener,noreferrer");
    return true;
  }

  const panel = document.createElement("section");
  panel.className = "momentum-preview";
  panel.appendChild(createMomentumPreviewHeader(card?.topic, card?.updatedAt));

  const titleEl = document.createElement("h3");
  titleEl.className = "momentum-preview-title";
  titleEl.textContent = title;
  panel.appendChild(titleEl);

  const actions = document.createElement("div");
  actions.className = "row wrap momentum-preview-actions";
  if (sourceUrl) {
    const openLink = document.createElement("a");
    openLink.className = "cta-btn ghost";
    openLink.href = sourceUrl;
    openLink.target = "_blank";
    openLink.rel = "noopener noreferrer";
    openLink.textContent = "Open source";
    actions.appendChild(openLink);
  }

  if (isImage) {
    openOverlay("Source Preview");
    const blob = sourceAssetId ? await readSourceAssetBlob(sourceAssetId) : null;
    let src = "";
    if (blob instanceof Blob && blob.size > 0) {
      src = URL.createObjectURL(blob);
      trackOverlayObjectUrl(src);
    } else if (previewImage) {
      src = previewImage;
    } else if (sourceUrl) {
      src = sourceUrl;
    }
    if (src) {
      const img = document.createElement("img");
      img.className = "momentum-preview-image";
      img.loading = "eager";
      img.decoding = "async";
      img.alt = `${title} screenshot`;
      img.src = src;
      panel.appendChild(img);
    } else {
      const msg = document.createElement("p");
      msg.className = "muted";
      msg.textContent = "No preview available for this image. Re-import this screenshot to enable preview.";
      panel.appendChild(msg);
    }
    if (actions.childElementCount) panel.appendChild(actions);
    overlayBodyEl.innerHTML = "";
    overlayBodyEl.appendChild(panel);
    return true;
  }

  if (isMedia) {
    openOverlay("Media Preview");
    const blob = sourceAssetId ? await readSourceAssetBlob(sourceAssetId) : null;
    let rendered = false;
    if (blob instanceof Blob && blob.size > 0) {
      const src = URL.createObjectURL(blob);
      trackOverlayObjectUrl(src);
      const mime = String(blob.type || sourceMimeType || "").toLowerCase();
      const mediaKind = sourceMediaKind || inferMediaKind(extOf(title), mime);
      if (mediaKind === "audio" || /^audio\//.test(mime) || isAudioKind) {
        const audio = document.createElement("audio");
        audio.className = "momentum-preview-media";
        audio.controls = true;
        audio.preload = "metadata";
        audio.src = src;
        panel.appendChild(audio);
      } else {
        const video = document.createElement("video");
        video.className = "momentum-preview-media";
        video.controls = true;
        video.playsInline = true;
        video.preload = "metadata";
        video.autoplay = true;
        video.src = src;
        if (previewImage) video.poster = previewImage;
        panel.appendChild(video);
      }
      rendered = true;
    }

    if (!rendered && sourceUrl) {
      if (isLikelyVideoUrl(sourceUrl)) {
        const yt = extractYoutubeVideoId(sourceUrl);
        if (yt) {
          const iframe = document.createElement("iframe");
          iframe.className = "momentum-preview-embed";
          iframe.src = `https://www.youtube.com/embed/${encodeURIComponent(yt)}`;
          iframe.title = title;
          iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
          iframe.allowFullscreen = true;
          panel.appendChild(iframe);
        } else {
          const video = document.createElement("video");
          video.className = "momentum-preview-media";
          video.controls = true;
          video.playsInline = true;
          video.preload = "metadata";
          video.autoplay = true;
          video.src = sourceUrl;
          if (previewImage) video.poster = previewImage;
          panel.appendChild(video);
        }
        rendered = true;
      } else if (isLikelyAudioUrl(sourceUrl)) {
        const audio = document.createElement("audio");
        audio.className = "momentum-preview-media";
        audio.controls = true;
        audio.preload = "metadata";
        audio.src = sourceUrl;
        panel.appendChild(audio);
        rendered = true;
      }
    }

    if (!rendered) {
      const msg = document.createElement("p");
      msg.className = "muted";
      msg.textContent = "Playback is unavailable for this media import on this device. Re-import this video/audio file to enable local playback.";
      panel.appendChild(msg);
    }

    if (actions.childElementCount) panel.appendChild(actions);
    overlayBodyEl.innerHTML = "";
    overlayBodyEl.appendChild(panel);
    return true;
  }

  return false;
}

function goToAccountView() {
  if (!token || !me) {
    window.location.href = "/welcome.html";
    return;
  }
  setView("account");
}

async function runHomePrompt() {
  const prompt = String(homeComposerInputEl?.value || "").trim();
  if (!prompt) return;
  if (tutorQuestionEl) tutorQuestionEl.value = prompt;
  if (homeComposerInputEl) homeComposerInputEl.value = "";
  setHomeComposeStatus("Searching web and video learning sources...");
  setView("study_tools");
  await askTutor({ preferWebSearch: true, source: "home" });
}

function authScopedKey(prefix) {
  return `${prefix}_${me?.id || "anon"}`;
}

function makeSourceAssetId() {
  try {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  } catch {
    // ignore
  }
  return `src_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function withIdbRequest(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error("IndexedDB request failed"));
  });
}

function openSourceAssetDb() {
  if (sourceAssetDbPromise) return sourceAssetDbPromise;
  if (!window.indexedDB) {
    sourceAssetDbPromise = Promise.resolve(null);
    return sourceAssetDbPromise;
  }
  sourceAssetDbPromise = new Promise((resolve) => {
    try {
      const req = window.indexedDB.open(SOURCE_ASSET_DB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(SOURCE_ASSET_STORE)) {
          db.createObjectStore(SOURCE_ASSET_STORE, { keyPath: "id" });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
  return sourceAssetDbPromise;
}

async function saveSourceAssetBlob(id, blob, meta = {}) {
  const assetId = String(id || "").trim();
  if (!assetId || !blob) return false;
  const db = await openSourceAssetDb();
  if (!db) return false;
  try {
    const tx = db.transaction(SOURCE_ASSET_STORE, "readwrite");
    const store = tx.objectStore(SOURCE_ASSET_STORE);
    await withIdbRequest(
      store.put({
        id: assetId,
        blob,
        name: String(meta?.name || ""),
        kind: String(meta?.kind || ""),
        mimeType: String(meta?.mimeType || blob.type || ""),
        createdAt: Date.now()
      })
    );
    return true;
  } catch {
    return false;
  }
}

async function readSourceAssetBlob(id) {
  const assetId = String(id || "").trim();
  if (!assetId) return null;
  const db = await openSourceAssetDb();
  if (!db) return null;
  try {
    const tx = db.transaction(SOURCE_ASSET_STORE, "readonly");
    const store = tx.objectStore(SOURCE_ASSET_STORE);
    const row = await withIdbRequest(store.get(assetId));
    return row?.blob || null;
  } catch {
    return null;
  }
}

async function deleteSourceAssetBlob(id) {
  const assetId = String(id || "").trim();
  if (!assetId) return;
  const db = await openSourceAssetDb();
  if (!db) return;
  try {
    const tx = db.transaction(SOURCE_ASSET_STORE, "readwrite");
    const store = tx.objectStore(SOURCE_ASSET_STORE);
    await withIdbRequest(store.delete(assetId));
  } catch {
    // ignore
  }
}

function homeFeedResetKey() {
  return authScopedKey("home_feed_reset_at_v1");
}

function readHomeFeedResetAt() {
  try {
    const raw = localStorage.getItem(homeFeedResetKey()) || "0";
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

function writeHomeFeedResetAt(ts = 0) {
  try {
    const n = Number(ts);
    if (!Number.isFinite(n) || n <= 0) {
      localStorage.removeItem(homeFeedResetKey());
      return;
    }
    localStorage.setItem(homeFeedResetKey(), String(Math.floor(n)));
  } catch {
    // ignore storage errors
  }
}

function learningPlanSuppressedKey() {
  return authScopedKey("learning_plan_suppressed_v1");
}

function isLearningPlanSuppressed() {
  try {
    return localStorage.getItem(learningPlanSuppressedKey()) === "1";
  } catch {
    return false;
  }
}

function setLearningPlanSuppressed(suppressed) {
  try {
    if (suppressed) localStorage.setItem(learningPlanSuppressedKey(), "1");
    else localStorage.removeItem(learningPlanSuppressedKey());
  } catch {
    // ignore storage errors
  }
}

function resetLearningPlanUi(message = "Personalized learning plan cleared. Click Refresh to rebuild.", { persist = true } = {}) {
  if (persist) setLearningPlanSuppressed(true);
  learningSummary = { masteryScore: 0, dueNow: 0, weakTags: [], nextActions: [] };
  clearLearningUi();
  setLearningStatus(message);
  updateHomeOutcomeMetrics();
}

function getThemeKey() {
  return authScopedKey("theme_v2");
}

function getLegacyThemeKey() {
  return authScopedKey("theme_v1");
}

function normalizeTheme(theme) {
  const raw = String(theme || "").trim().toLowerCase();
  return raw === "clean" || raw === "bold" || raw === "clyde" ? raw : "clyde";
}

function applyTheme(theme) {
  const t = normalizeTheme(theme);
  document.body.setAttribute("data-theme", t);
  if (themeSelectEl) themeSelectEl.value = t;
}

function loadTheme() {
  try {
    const saved = localStorage.getItem(getThemeKey()) || localStorage.getItem(getLegacyThemeKey()) || "clyde";
    const t = normalizeTheme(saved);
    applyTheme(t);
    localStorage.setItem(getThemeKey(), t);
  } catch {
    applyTheme("clyde");
  }
}

function saveTheme(theme) {
  localStorage.setItem(getThemeKey(), normalizeTheme(theme));
}

function setAnalyticsStatus(msg, isError = false) {
  analyticsStatusEl.textContent = msg;
  analyticsStatusEl.style.color = isError ? "#b91c1c" : "#0f172a";
}

function setMetric(el, value) {
  if (el) el.textContent = String(value);
}

function setHomeQuickStatus(msg, isError = false) {
  if (!homeQuickStatusEl) return;
  homeQuickStatusEl.textContent = msg;
  homeQuickStatusEl.style.color = isError ? "#b91c1c" : "#0f172a";
}

function clearMomentumFeed() {
  writeHomeFeedResetAt(Date.now());
  renderLearningFeed();
  setHomeQuickStatus("Momentum feed cleared. New uploads/notes will appear here.");
  fireAndForgetTrack("home.feed_cleared", {});
}

function clearPersonalizedLearningPlan() {
  resetLearningPlanUi("Personalized learning plan cleared. Click Refresh to rebuild.", { persist: true });
  fireAndForgetTrack("learning.plan_cleared", {});
}

function formatEventName(name) {
  const raw = String(name || "").trim();
  if (!raw) return "-";
  return raw.replaceAll(".", " ");
}

function analyticsCount(counts, key) {
  return Number((counts && counts[key]) || 0);
}

function aiOutputCountFromAnalytics(counts = {}) {
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

function homeNextActionText({ dueNow = 0, noteCount = 0, sourceCount = 0, aiOutputs7d = 0 } = {}) {
  const briefAction = Array.isArray(workspaceBrief?.nextMoves) ? String(workspaceBrief.nextMoves[0] || "").trim() : "";
  if (briefAction) return briefAction;
  if (dueNow > 0) return `Review ${dueNow} due flashcard(s).`;
  if (noteCount === 0) return "Create your first note, then run Summarize.";
  if (sourceCount === 0) return "Import at least one source for grounded answers and citations.";
  if (aiOutputs7d < 3) return "Run one AI action on your top note and save improvements.";
  const next = Array.isArray(learningSummary?.nextActions) ? learningSummary.nextActions[0] : "";
  if (next) return String(next);
  return "Open Study tools and run a short practice test.";
}

function formatWorkspaceBriefTime(iso) {
  const raw = String(iso || "").trim();
  if (!raw) return "";
  const dt = new Date(raw);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function renderWorkspaceBriefList(listEl, items, mapItem, emptyText) {
  if (!listEl) return;
  listEl.innerHTML = "";
  const arr = Array.isArray(items) ? items : [];
  if (!arr.length) {
    const li = document.createElement("li");
    li.textContent = String(emptyText || "No items yet.");
    listEl.appendChild(li);
    return;
  }
  arr.slice(0, 4).forEach((item) => {
    const li = document.createElement("li");
    li.textContent = mapItem(item);
    listEl.appendChild(li);
  });
}

function renderWorkspaceBrief() {
  if (!homeBriefSummaryEl || !homeBriefTopicsEl || !homeBriefActionsEl || !homeBriefGeneratedAtEl) return;

  if (!workspaceBrief || typeof workspaceBrief !== "object") {
    homeBriefGeneratedAtEl.textContent = "";
    homeBriefSummaryEl.textContent = "Workspace brief updates from your notes, flashcards, and activity.";
    renderWorkspaceBriefList(homeBriefTopicsEl, [], () => "", "Tag your notes to build a topic map.");
    renderWorkspaceBriefList(homeBriefActionsEl, [], () => "", "Your next moves will appear after activity.");
    return;
  }

  const overview = workspaceBrief.overview && typeof workspaceBrief.overview === "object" ? workspaceBrief.overview : {};
  const noteCount = Number(overview.notes || 0);
  const flashcardCount = Number(overview.flashcards || 0);
  const dueNow = Number(overview.dueNow || 0);
  const masteryScore = Number(overview.masteryScore || 0);
  const actions7d = Number(overview.actions7d || 0);
  const sourceImports7d = Number(overview.sourceImports7d || 0);

  homeBriefGeneratedAtEl.textContent = formatWorkspaceBriefTime(workspaceBrief.generatedAt)
    ? `Updated ${formatWorkspaceBriefTime(workspaceBrief.generatedAt)}`
    : "";
  homeBriefSummaryEl.textContent =
    `${noteCount} notes, ${flashcardCount} cards, ${dueNow} due, ${masteryScore}% mastery, ` +
    `${actions7d} actions in 7d, ${sourceImports7d} source imports.`;

  renderWorkspaceBriefList(
    homeBriefTopicsEl,
    workspaceBrief.topTopics,
    (item) => {
      const topic = String(item?.topic || "untagged");
      const score = Number(item?.score || 0);
      return score > 0 ? `${topic} (${score})` : topic;
    },
    "No topic map yet. Add tags to notes and cards."
  );
  renderWorkspaceBriefList(
    homeBriefActionsEl,
    workspaceBrief.nextMoves,
    (item) => String(item || "").trim(),
    "No actions yet. Keep writing and studying to generate guidance."
  );
}

async function loadWorkspaceBrief({ force = false } = {}) {
  if (!token) return null;
  const now = Date.now();
  if (!force && workspaceBrief && now - workspaceBriefFetchedAt < 45_000) {
    renderWorkspaceBrief();
    return workspaceBrief;
  }
  const out = await api("/api/workspace/brief", { method: "GET" });
  workspaceBrief = out && typeof out === "object" ? out : null;
  workspaceBriefFetchedAt = now;
  renderWorkspaceBrief();
  updateHomeOutcomeMetrics();
  return workspaceBrief;
}

function updateHomeOutcomeMetrics() {
  const counts = analyticsSummary?.counts || {};
  const actions7d = Number(analyticsSummary?.total || 0);
  const aiOutputs7d = aiOutputCountFromAnalytics(counts);
  const dueNow = Number(learningSummary?.dueNow || 0);
  const mastery = Number(learningSummary?.masteryScore || 0);
  const xpState = loadXpState();
  const streak = computeStreak(xpState.days || []);
  const noteCount = Array.isArray(notes) ? notes.length : 0;
  const sourceCount = collectSourceMetadata(120).length;

  setMetric(homeMetricActionsEl, actions7d);
  setMetric(homeMetricAiEl, aiOutputs7d);
  setMetric(homeMetricDueEl, dueNow);
  setMetric(homeMetricMasteryEl, `${mastery}%`);
  setMetric(homeMetricStreakEl, `${streak} day${streak === 1 ? "" : "s"}`);
  setMetric(homeMetricLevelEl, `Lv ${Math.max(1, Number(xpState.level || 1))}`);

  if (homeNextActionEl) {
    homeNextActionEl.textContent = `Next best action: ${homeNextActionText({ dueNow, noteCount, sourceCount, aiOutputs7d })}`;
  }
  if (homeFocusTopicEl) {
    const weak = Array.isArray(learningSummary?.weakTags) ? learningSummary.weakTags : [];
    homeFocusTopicEl.textContent = weak.length
      ? `Focus topic: ${weak[0].tag} (${weak[0].due} due)`
      : "Focus topic: build cards from tagged notes to get personalized weak-topic coaching.";
  }
}

function paywallPromptKey() {
  return authScopedKey("home_paywall_prompt_v1");
}

function loadPaywallPromptState() {
  try {
    const raw = localStorage.getItem(paywallPromptKey()) || "{}";
    const parsed = JSON.parse(raw);
    const dismissed = parsed?.dismissed && typeof parsed.dismissed === "object" ? parsed.dismissed : {};
    return {
      dismissed,
      lastReason: String(parsed?.lastReason || ""),
      lastShownAt: Number(parsed?.lastShownAt || 0)
    };
  } catch {
    return { dismissed: {}, lastReason: "", lastShownAt: 0 };
  }
}

function savePaywallPromptState(state) {
  try {
    localStorage.setItem(paywallPromptKey(), JSON.stringify(state || {}));
  } catch {
    // ignore storage issues
  }
}

function hideHomeUpgradePrompt() {
  setHidden(homeUpgradeCardEl, true);
}

function showHomeUpgradePrompt(reason, { force = false, payload = {} } = {}) {
  if (!homeUpgradeCardEl || !homeUpgradeMessageEl) return false;
  if (adFree || IS_NATIVE_SHELL) {
    hideHomeUpgradePrompt();
    return false;
  }
  const copy = {
    momentum: "You are using Notematica heavily this week. Upgrade to Premium ($10/mo) for higher daily limits and uninterrupted study flow.",
    source_depth: "You are importing lots of sources. Premium ($10/mo) gives higher daily source and transcription limits.",
    quota: "You reached a daily usage limit. Upgrade to Premium ($10/mo) to continue with higher limits today.",
    manual: "Upgrade to Premium ($10/mo) for higher daily AI limits and ad-free sessions."
  };
  const cooldownMs = reason === "quota" ? 2 * 60 * 60 * 1000 : 12 * 60 * 60 * 1000;
  const now = Date.now();
  const state = loadPaywallPromptState();
  const lastDismissed = Number((state.dismissed && state.dismissed[reason]) || 0);
  const recentlyShown = now - Number(state.lastShownAt || 0) < 15 * 60 * 1000;
  if (!force && (now - lastDismissed < cooldownMs || recentlyShown)) return false;

  homeUpgradeMessageEl.textContent = copy[reason] || copy.manual;
  setHidden(homeUpgradeCardEl, false);
  state.lastReason = reason;
  state.lastShownAt = now;
  savePaywallPromptState(state);
  fireAndForgetTrack("billing.promo_seen", { reason, ...payload });
  return true;
}

function dismissHomeUpgradePrompt() {
  const state = loadPaywallPromptState();
  const reason = state.lastReason || "manual";
  state.dismissed = state.dismissed || {};
  state.dismissed[reason] = Date.now();
  savePaywallPromptState(state);
  hideHomeUpgradePrompt();
  fireAndForgetTrack("billing.promo_dismiss", { reason });
}

function evaluatePremiumPrompt() {
  if (adFree || IS_NATIVE_SHELL) {
    hideHomeUpgradePrompt();
    return;
  }
  const aiOutputs7d = aiOutputCountFromAnalytics(analyticsSummary?.counts || {});
  const actions7d = Number(analyticsSummary?.total || 0);
  if (sourceImportCount >= 3) {
    showHomeUpgradePrompt("source_depth", { payload: { importCount: sourceImportCount } });
    return;
  }
  if (aiOutputs7d >= 12 || actions7d >= 28 || monetizedOutputCount >= 4) {
    showHomeUpgradePrompt("momentum", { payload: { aiOutputs7d, actions7d, outputCount: monetizedOutputCount } });
  }
}

function promptUpgradeForQuota(scope = "ai") {
  showHomeUpgradePrompt("quota", { payload: { scope } });
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
  if (gated) {
    setHomeQuickStatus("Free plan active. Upgrade for higher daily limits and faster study throughput.");
    evaluatePremiumPrompt();
  } else {
    setHomeQuickStatus("Premium active. Higher limits unlocked.");
    hideHomeUpgradePrompt();
  }
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
  monetizedOutputCount += 1;
  saveOutputCounter();
  evaluatePremiumPrompt();
  if (adFree || !areAdsEnabled()) return;
  if (monetizedOutputCount % 4 !== 0) return;
  const shown = await showAdInterstitial(2);
  if (shown) fireAndForgetTrack("ads.double_interstitial_shown", { atOutput: monetizedOutputCount, trigger: eventName });
}

async function countImportAndMaybeShowAds() {
  sourceImportCount += 1;
  saveImportCounter();
  evaluatePremiumPrompt();
  if (adFree || !areAdsEnabled()) return;
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

function setHomeComposeStatus(msg, isError = false) {
  if (!homeComposeStatusEl) return;
  homeComposeStatusEl.textContent = msg;
  homeComposeStatusEl.style.color = isError ? "#b91c1c" : "#0f172a";
}

function setUploadSelection(el, msg, isError = false) {
  if (!el) return;
  el.textContent = msg;
  el.style.color = isError ? "#b91c1c" : "var(--muted)";
}

function setSourceFileSelection(msg, isError = false) {
  setUploadSelection(sourceFileSelectionEl, msg, isError);
}

function setChatAttachSelection(msg, isError = false) {
  setUploadSelection(homeAttachSelectionEl, msg, isError);
  setUploadSelection(tutorAttachSelectionEl, msg, isError);
}

function setChatAttachStatus(msg, isError = false) {
  setHomeComposeStatus(msg, isError);
  setChatAttachSelection(msg, isError);
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
  updateHomeOutcomeMetrics();
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

function noteWordCount(text) {
  const parts = String(text || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return parts.length;
}

function noteReadMinutes(text) {
  const words = noteWordCount(text);
  if (!words) return 0;
  return Math.max(1, Math.round(words / 190));
}

function normalizeOutlineLine(line) {
  return String(line || "")
    .replace(/^#+\s*/, "")
    .replace(/^[-*•\d.)\s]+/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function buildNoteOutlineFromText(text, maxItems = 8) {
  const lines = String(text || "")
    .split(/\n+/)
    .map((line) => normalizeOutlineLine(line))
    .filter(Boolean);
  const out = [];
  const seen = new Set();
  for (const line of lines) {
    if (out.length >= maxItems) break;
    if (line.length < 8 || line.length > 96) continue;
    const headingLike = /:$/.test(line) || (/^[A-Za-z0-9]/.test(line) && !/[.!?]$/.test(line) && line.length <= 72);
    if (!headingLike) continue;
    const key = line.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(line);
  }
  if (out.length) return out;

  for (const line of lines) {
    if (out.length >= Math.min(4, maxItems)) break;
    if (line.length < 14 || line.length > 90) continue;
    const key = line.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(line);
  }
  return out;
}

function focusEditorOnSnippet(snippet) {
  const target = String(snippet || "").trim().toLowerCase();
  if (!target || !editorEl) return false;
  const walker = document.createTreeWalker(editorEl, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const text = String(node?.nodeValue || "");
    const at = text.toLowerCase().indexOf(target);
    if (at < 0) continue;
    try {
      const range = document.createRange();
      range.setStart(node, at);
      range.setEnd(node, Math.min(text.length, at + target.length));
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
      const parent = range.startContainer?.parentElement;
      parent?.scrollIntoView({ block: "center", behavior: "smooth" });
      editorEl.focus();
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

function renderNoteOutline(lines = []) {
  if (!noteOutlineListEl) return;
  noteOutlineListEl.innerHTML = "";
  const arr = Array.isArray(lines) ? lines : [];
  if (!arr.length) {
    const empty = document.createElement("div");
    empty.className = "muted";
    empty.textContent = "Add headings or short section lines to build a clickable outline.";
    noteOutlineListEl.appendChild(empty);
    return;
  }
  arr.forEach((line) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ghost note-outline-item";
    btn.textContent = line;
    btn.title = `Jump to "${line}"`;
    btn.addEventListener("click", () => {
      const ok = focusEditorOnSnippet(line);
      if (!ok && aiOutputEl) aiOutputEl.textContent = `Could not find "${line}" in the note.`;
    });
    noteOutlineListEl.appendChild(btn);
  });
}

function updateNoteFlowStatus({ message = "" } = {}) {
  if (!noteFlowStatusEl) return;
  const text = getAiReadyNoteText();
  const words = noteWordCount(text);
  const readMin = noteReadMinutes(text);
  const saveLabel = noteHasUnsavedChanges
    ? "Unsaved changes"
    : noteLastSavedAt
      ? `Saved ${new Date(noteLastSavedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
      : "Saved";
  const segments = [`${words} words`, `${readMin} min read`, saveLabel];
  if (message) segments.push(String(message));
  noteFlowStatusEl.textContent = segments.join(" · ");
  const outline = buildNoteOutlineFromText(text);
  renderNoteOutline(outline);
}

function clearNoteAutoSaveTimer() {
  if (!noteAutoSaveTimer) return;
  clearTimeout(noteAutoSaveTimer);
  noteAutoSaveTimer = null;
}

async function runNoteAutoSave() {
  if (noteAutoSaving || !noteHasUnsavedChanges) return;
  if (!token || !currentId) return;
  noteAutoSaving = true;
  updateNoteFlowStatus({ message: "Autosaving..." });
  try {
    await saveNote({ silent: true, reason: "autosave", refreshBrief: false });
  } catch {
    updateNoteFlowStatus({ message: "Autosave failed" });
  } finally {
    noteAutoSaving = false;
  }
}

function scheduleNoteAutoSave() {
  clearNoteAutoSaveTimer();
  if (!token || !currentId || !noteHasUnsavedChanges) return;
  noteAutoSaveTimer = setTimeout(() => {
    runNoteAutoSave().catch(() => {});
  }, 1400);
}

function markNoteDirtyAndRefresh() {
  noteHasUnsavedChanges = true;
  updateNoteFlowStatus();
  scheduleNoteAutoSave();
}

function setNoteCleanState(savedAtMs = 0) {
  noteHasUnsavedChanges = false;
  clearNoteAutoSaveTimer();
  noteLastSavedAt = Number(savedAtMs || Date.now()) || Date.now();
  updateNoteFlowStatus();
}

function insertIntoEditorAtCursor(text) {
  const safeText = String(text || "");
  if (!safeText || !editorEl) return;
  editorEl.focus();
  try {
    document.execCommand("insertText", false, safeText);
  } catch {
    editorEl.innerHTML += `${editorEl.innerHTML ? "<br>" : ""}${escapeHtml(safeText).replaceAll("\n", "<br>")}`;
  }
  markNoteDirtyAndRefresh();
}

function setNoteHandoffStatus(msg, isError = false) {
  if (!noteHandoffStatusEl) return;
  noteHandoffStatusEl.textContent = String(msg || "");
  noteHandoffStatusEl.style.color = isError ? "var(--danger)" : "var(--accent-hover)";
}

function noteHandoffQuestion() {
  const title = String(titleEl?.value || "").trim() || "this note";
  const tags = String(tagsEl?.value || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 3);
  const tagHint = tags.length ? ` Focus tags: ${tags.join(", ")}.` : "";
  return `Teach me "${title}" as a high-yield study guide with core concepts, pitfalls, and a short self-check.${tagHint}`;
}

async function runNoteToStudyHandoff(mode) {
  const flow = String(mode || "").trim();
  if (!flow) return;
  if (noteHandoffRunning) {
    setNoteHandoffStatus("Handoff already running. Please wait.");
    return;
  }
  const noteText = getAiReadyNoteText();
  if (!noteText) {
    setNoteHandoffStatus("Add note text first, then send to study tools.", true);
    return;
  }
  noteHandoffRunning = true;
  setNoteHandoffBusy(flow);
  try {
    setView("study_tools");
    if (flow === "tutor") {
      tutorQuestionEl.value = noteHandoffQuestion();
      setNoteHandoffStatus("Launching tutor handoff...");
      await askTutor({ preferWebSearch: false, source: "notes_handoff" });
      setNoteHandoffStatus("Tutor handoff complete.");
      fireAndForgetTrack("notes.handoff", { mode: "tutor" });
      return;
    }
    if (flow === "cards") {
      setNoteHandoffStatus("Generating flashcards from this note...");
      await generateFlashcards();
      setNoteHandoffStatus("Flashcard handoff complete.");
      fireAndForgetTrack("notes.handoff", { mode: "cards" });
      return;
    }
    if (flow === "exam") {
      if (examModeEl) examModeEl.value = "weak";
      setNoteHandoffStatus("Building practice exam from this note...");
      await renderTestPrep();
      setNoteHandoffStatus("Exam handoff complete.");
      fireAndForgetTrack("notes.handoff", { mode: "exam" });
      return;
    }
    if (flow === "plan") {
      setNoteHandoffStatus("Building study plan from this note...");
      await generateAutoPlan();
      setNoteHandoffStatus("Plan handoff complete.");
      fireAndForgetTrack("notes.handoff", { mode: "plan" });
      return;
    }
  } catch (e) {
    setNoteHandoffStatus(`Handoff failed: ${e.message}`, true);
  } finally {
    noteHandoffRunning = false;
    setNoteHandoffBusy("");
  }
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
  clearNoteAutoSaveTimer();
  currentId = note.id;
  titleEl.value = note.title || "";
  tagsEl.value = Array.isArray(note.tags) ? note.tags.join(", ") : "";
  editorEl.innerHTML = note.contentHtml || escapeHtml(note.contentText || "");
  aiOutputEl.textContent = "";
  const savedAtMs = new Date(note.updatedAt || Date.now()).getTime();
  setNoteCleanState(savedAtMs);
  setNoteHandoffStatus("Ready to send this note to tutor, cards, exam, or plan.");
  renderSourcesManager();
  renderNotes();
}

function clearEditor() {
  clearNoteAutoSaveTimer();
  currentId = null;
  titleEl.value = "";
  tagsEl.value = "";
  editorEl.innerHTML = "";
  aiOutputEl.textContent = "";
  noteHasUnsavedChanges = false;
  noteLastSavedAt = 0;
  updateNoteFlowStatus({ message: "Draft mode" });
  setNoteHandoffStatus("Draft note: add content, then launch a study handoff.");
  renderSourcesManager();
  titleEl.focus();
  renderNotes();
}

function appendToEditor(text) {
  const clean = String(text || "").trim();
  if (!clean) return;
  editorEl.innerHTML += `${editorEl.innerHTML ? "<br><br>" : ""}${escapeHtml(clean).replaceAll("\n", "<br>")}`;
  markNoteDirtyAndRefresh();
}

function stripLegacySourceDumpText(text) {
  const raw = String(text || "").replace(/\r/g, "");
  if (!raw) return "";
  if (!/^##\s*(source:|imported sources\s*\()/im.test(raw)) return raw.trim();

  const lines = raw.split("\n");
  const kept = [];
  let skipping = false;
  for (const rawLine of lines) {
    const line = String(rawLine || "");
    const trimmed = line.trim();
    const isLegacyStart = /^##\s*source:/i.test(trimmed) || /^##\s*imported sources\s*\(/i.test(trimmed);
    if (isLegacyStart) {
      skipping = true;
      continue;
    }
    if (skipping && /^##\s+/.test(trimmed) && !/^##\s*source:/i.test(trimmed) && !/^##\s*imported sources\s*\(/i.test(trimmed)) {
      skipping = false;
    }
    if (skipping) continue;
    kept.push(line);
  }
  return kept.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function getAiReadyNoteText() {
  const raw = editorEl.innerText.trim();
  return stripLegacySourceDumpText(raw);
}

async function cleanLegacySourceBlocksInEditor() {
  const beforeRaw = String(editorEl.innerText || "").replace(/\r/g, "");
  const cleaned = stripLegacySourceDumpText(beforeRaw);
  if (cleaned === beforeRaw.trim()) {
    aiOutputEl.textContent = "No old imported source blocks found in this note.";
    return false;
  }

  editorEl.innerHTML = cleaned ? escapeHtml(cleaned).replaceAll("\n", "<br>") : "";
  lastTypingAt = Date.now();

  if (token && currentId) {
    try {
      await saveNote();
      aiOutputEl.textContent = "Removed old source blocks and saved this note.";
      return true;
    } catch (e) {
      aiOutputEl.textContent = `Removed old source blocks. Save failed: ${e.message}`;
      return true;
    }
  }

  aiOutputEl.textContent = "Removed old source blocks. Click Save to keep changes.";
  return true;
}

function setAuthStatus(msg, isError = false) {
  authStatusEl.textContent = msg;
  authStatusEl.style.color = isError ? "#b91c1c" : "#0f172a";
}

function updateAuthUi() {
  const loggedIn = Boolean(token && me);
  if (workspaceEl) {
    workspaceEl.style.opacity = loggedIn ? "1" : "0.55";
    workspaceEl.style.pointerEvents = loggedIn ? "auto" : "none";
  }
  if (logoutBtn) logoutBtn.style.display = loggedIn ? "inline-block" : "none";
  updateProfileButtons();
}

async function api(path, options = {}) {
  const base =
    (typeof window !== "undefined" && window.__API_BASE_URL ? String(window.__API_BASE_URL) : "").replace(/\/+$/, "");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };
  if (token && token !== "__cookie__") headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${base}${path}`, {
    ...options,
    headers,
    credentials: "include"
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

function formatImportError(e) {
  const quota = formatQuotaError(e, "Import limit reached.");
  if (quota) {
    promptUpgradeForQuota("source_import");
    return quota;
  }
  const msg = String(e?.message || "").trim();
  if (Number(e?.status || 0) === 401) return "Session expired. Sign in again, then retry import.";
  if (Number(e?.status || 0) === 413 || /payload too large/i.test(msg)) {
    return "Upload is too large. Try fewer/smaller files (or one screenshot at a time).";
  }
  return `Import failed: ${msg || "Unknown error"}`;
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
    updateHomeOutcomeMetrics();
  } catch (e) {
    setBillingStatus(`Billing status error: ${e.message}`, true);
    applyPremiumFeatureGates();
    updateHomeOutcomeMetrics();
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
    const aiActions = aiOutputCountFromAnalytics(counts);
    setMetric(metricTotalEl, data.total || 0);
    setMetric(metricTopEventEl, top ? `${formatEventName(top[0])} (${top[1]})` : "-");
    setMetric(metricFlashcardsEl, flashcards);
    setMetric(metricAiEl, aiActions);
    analyticsSummary = {
      total: Number(data.total || 0),
      topEvent: top ? String(top[0]) : "",
      counts
    };
    renderLearningFeed();
    updateHomeOutcomeMetrics();
    evaluatePremiumPrompt();
  } catch (e) {
    setAnalyticsStatus(`Analytics error: ${e.message}`, true);
    setMetric(metricTotalEl, "-");
    setMetric(metricTopEventEl, "-");
    setMetric(metricFlashcardsEl, "-");
    setMetric(metricAiEl, "-");
    analyticsSummary = null;
    renderLearningFeed();
    updateHomeOutcomeMetrics();
  }
}

async function loadLearningPlan({ force = false } = {}) {
  if (!token) return;
  if (!force && isLearningPlanSuppressed()) {
    resetLearningPlanUi("Personalized learning plan is cleared. Click Refresh to rebuild.", { persist: true });
    return;
  }
  try {
    const plan = await api("/api/learning/plan", { method: "GET" });
    setLearningPlanSuppressed(false);
    learningSummary = {
      masteryScore: Number(plan.masteryScore || 0),
      dueNow: Number(plan.dueNow || 0),
      weakTags: Array.isArray(plan.weakTags) ? plan.weakTags : [],
      nextActions: Array.isArray(plan.nextActions) ? plan.nextActions : []
    };
    setMetric(learningMasteryEl, `${plan.masteryScore ?? 0}%`);
    setMetric(learningDueEl, plan.dueNow ?? 0);
    const weak = Array.isArray(plan.weakTags) ? plan.weakTags : [];
    learningFocusEl.textContent = weak.length
      ? `Focus topics: ${weak.map((w) => `${w.tag} (${w.due} due)`).join(", ")}`
      : "Focus topics: build cards from tagged notes to personalize recommendations.";
    const next = Array.isArray(plan.nextActions) ? plan.nextActions : [];
    learningNextEl.textContent = next.length ? `Next: ${next.join(" ")}` : "";
    setLearningStatus(`Plan updated ${new Date(plan.generatedAt || Date.now()).toLocaleTimeString()}.`);
    updateHomeOutcomeMetrics();
    evaluatePremiumPrompt();
  } catch (e) {
    learningSummary = { masteryScore: 0, dueNow: 0, weakTags: [], nextActions: [] };
    clearLearningUi();
    setLearningStatus(`Learning plan error: ${e.message}`, true);
    updateHomeOutcomeMetrics();
  }
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

async function loadAccountProfile() {
  if (!token) return;
  try {
    const data = await api("/api/account/profile", { method: "GET" });
    const profile = data?.profile || {};
    me = {
      ...(me || {}),
      displayName: String(profile.displayName || ""),
      bio: String(profile.bio || ""),
      avatarDataUrl: String(profile.avatarDataUrl || "")
    };
    populateAccountProfileForm();
    updateHomeWelcomeMessage();
    if (me?.email) setAuthStatus(`Signed in as ${me.email}${me.displayName ? ` (${me.displayName})` : ""}`);
    setProfileStatus("");
  } catch (e) {
    setProfileStatus(`Profile load error: ${e.message}`, true);
  }
}

async function saveAccountProfile() {
  if (!token) return setProfileStatus("Sign in first.", true);
  const displayName = String(profileDisplayNameEl?.value || "");
  const bio = String(profileBioEl?.value || "");
  setProfileStatus("Saving profile...");
  try {
    const out = await api("/api/account/profile", {
      method: "POST",
      body: JSON.stringify({
        displayName,
        bio,
        avatarDataUrl: pendingAvatarDataUrl || ""
      })
    });
    const profile = out?.profile || {};
    me = {
      ...(me || {}),
      displayName: String(profile.displayName || ""),
      bio: String(profile.bio || ""),
      avatarDataUrl: String(profile.avatarDataUrl || "")
    };
    populateAccountProfileForm();
    updateHomeWelcomeMessage();
    setAuthStatus(`Signed in as ${me.email}${me.displayName ? ` (${me.displayName})` : ""}`);
    setProfileStatus("Profile saved.");
  } catch (e) {
    setProfileStatus(`Profile save error: ${e.message}`, true);
  }
}

async function changeAccountPassword() {
  if (!token) return setPasswordStatus("Sign in first.", true);
  const currentPassword = String(passwordCurrentEl?.value || "");
  const newPassword = String(passwordNewEl?.value || "");
  if (!currentPassword || !newPassword) {
    setPasswordStatus("Enter your current and new password.", true);
    return;
  }
  if (newPassword.length < 8) {
    setPasswordStatus("New password must be at least 8 characters.", true);
    return;
  }
  setPasswordStatus("Updating password...");
  try {
    await api("/api/account/password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword })
    });
    if (passwordCurrentEl) passwordCurrentEl.value = "";
    if (passwordNewEl) passwordNewEl.value = "";
    setPasswordStatus("Password updated.");
  } catch (e) {
    setPasswordStatus(`Password update error: ${e.message}`, true);
  }
}

async function cancelMembership() {
  if (!token) return setBillingStatus("Log in first to manage subscription.", true);
  if (!confirm("Cancel your Premium membership now?")) return;
  setBillingStatus("Cancelling membership...");
  try {
    const out = await api("/api/billing/cancel", { method: "POST" });
    setBillingStatus(String(out?.message || "Membership canceled."));
    adFree = false;
    billingLoaded = false;
    await loadBillingStatus();
    await loadAnalyticsSummary();
    await loadLearningPlan({ force: true });
  } catch (e) {
    setBillingStatus(`Cancel membership error: ${e.message}`, true);
  }
}

async function deleteAccount() {
  if (!token) return setDeleteAccountStatus("Sign in first.", true);
  const confirmText = String(deleteAccountConfirmEl?.value || "").trim();
  const password = String(deleteAccountPasswordEl?.value || "");
  if (confirmText.toUpperCase() !== "DELETE") {
    setDeleteAccountStatus("Type DELETE to confirm account deletion.", true);
    return;
  }
  if (!password) {
    setDeleteAccountStatus("Enter your current password.", true);
    return;
  }
  if (!confirm("This permanently deletes your account and all stored data. Continue?")) return;
  setDeleteAccountStatus("Deleting account...");
  try {
    await api("/api/account/delete", {
      method: "POST",
      body: JSON.stringify({ confirmText, password })
    });
    token = "";
    me = null;
    localStorage.removeItem("ai_notes_token");
    window.location.href = "/welcome.html?account_deleted=1";
  } catch (e) {
    setDeleteAccountStatus(`Delete account error: ${e.message}`, true);
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
  setProfileStatus("");
  setPasswordStatus("");
  setDeleteAccountStatus("");
  setAnalyticsStatus("");
  setMetric(metricTotalEl, "-");
  setMetric(metricTopEventEl, "-");
  setMetric(metricFlashcardsEl, "-");
  setMetric(metricAiEl, "-");
  learningSummary = { masteryScore: 0, dueNow: 0, weakTags: [], nextActions: [] };
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
  setHomeComposeStatus("");
  setHomeQuickStatus("");
  setSourceFileSelection(SOURCE_UPLOAD_HINT);
  setChatAttachSelection(CHAT_UPLOAD_HINT);
  clearNoteAutoSaveTimer();
  noteHasUnsavedChanges = false;
  noteLastSavedAt = 0;
  updateNoteFlowStatus({ message: "Signed out" });
  setNoteHandoffStatus("");
  pendingAvatarDataUrl = "";
  if (profileDisplayNameEl) profileDisplayNameEl.value = "";
  if (profileBioEl) profileBioEl.value = "";
  if (passwordCurrentEl) passwordCurrentEl.value = "";
  if (passwordNewEl) passwordNewEl.value = "";
  if (deleteAccountConfirmEl) deleteAccountConfirmEl.value = "";
  if (deleteAccountPasswordEl) deleteAccountPasswordEl.value = "";
  setProfileAvatarPreview("");
  hideHomeUpgradePrompt();
  if (sourceUrlsEl) sourceUrlsEl.value = "";
  if (sourceFilesEl) sourceFilesEl.value = "";
  window.location.href = "/welcome.html";
}

async function loadMe() {
  try {
    const data = await api("/api/auth/me", { method: "GET" });
    const user = data?.user || {};
    me = {
      ...user,
      displayName: String(user.displayName || ""),
      bio: String(user.bio || ""),
      avatarDataUrl: String(user.avatarDataUrl || "")
    };
    token = "__cookie__";
    localStorage.removeItem("ai_notes_token");
    setAuthStatus(`Signed in as ${me.email}${me.displayName ? ` (${me.displayName})` : ""}`);
    populateAccountProfileForm();
    updateProfileButtons();
    updateHomeWelcomeMessage();
    setActiveTab(loadActiveTab());
  } catch {
    token = "";
    me = null;
    localStorage.removeItem("ai_notes_token");
    populateAccountProfileForm();
    updateProfileButtons();
    updateHomeWelcomeMessage();
  }
}

async function loadNotes() {
  if (!token) return;
  try {
    const data = await api("/api/notes", { method: "GET" });
    notes = data.notes || [];
    notes.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
    renderNotes();
    if (notes.length) {
      selectNote(notes[0].id);
    } else {
      clearNoteAutoSaveTimer();
      currentId = null;
      titleEl.value = "";
      tagsEl.value = "";
      editorEl.innerHTML = "";
      aiOutputEl.textContent = "";
      noteHasUnsavedChanges = false;
      noteLastSavedAt = 0;
      updateNoteFlowStatus({ message: "Draft mode" });
      setNoteHandoffStatus("Draft note: add content, then launch a study handoff.");
      renderSourcesManager();
    }
    renderLearningFeed();
    updateHomeOutcomeMetrics();
    await loadWorkspaceBrief({ force: true }).catch(() => {});
  } catch (e) {
    notes = [];
    filteredNotes = [];
    renderNotes();
    clearNoteAutoSaveTimer();
    currentId = null;
    titleEl.value = "";
    tagsEl.value = "";
    editorEl.innerHTML = "";
    noteHasUnsavedChanges = false;
    noteLastSavedAt = 0;
    updateNoteFlowStatus({ message: "Draft mode (sync unavailable)" });
    setNoteHandoffStatus("Draft note: add content, then launch a study handoff.");
    renderSourcesManager();
    renderLearningFeed();
    updateHomeOutcomeMetrics();
    const msg = String(e?.message || "unknown network issue");
    if (aiOutputEl) aiOutputEl.textContent = `Notes sync unavailable (${msg}). You can keep drafting and retry shortly.`;
    setHomeQuickStatus("Could not sync notebook list right now. Working in draft mode.", true);
  }
}

function parseUrlInput(raw) {
  return String(raw || "")
    .split(/[\n,]/)
    .map((x) => x.trim())
    .filter(Boolean);
}

function canImportFile(fileOrName, mimeType = "") {
  const name = typeof fileOrName === "string" ? fileOrName : String(fileOrName?.name || "");
  const mime = (typeof fileOrName === "string" ? mimeType : String(fileOrName?.type || "")).toLowerCase();
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
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".mp4",
    ".mov",
    ".m4v",
    ".webm",
    ".mp3",
    ".wav",
    ".m4a",
    ".ogg"
  ];
  if (allowed.some((ext) => lower.endsWith(ext))) return true;
  if (/^image\//i.test(mime)) return true;
  if (/^(audio|video)\//i.test(mime)) return true;
  if (mime === "application/pdf") return true;
  if (mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") return true;
  return false;
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

function isImageExt(ext) {
  return [".png", ".jpg", ".jpeg", ".webp"].includes(ext);
}

function isMediaExt(ext) {
  return [".mp4", ".mov", ".m4v", ".webm", ".mp3", ".wav", ".m4a", ".ogg"].includes(ext);
}

function inferMediaKind(ext, mime = "") {
  const m = String(mime || "").toLowerCase();
  if (/^video\//i.test(m)) return "video";
  if (/^audio\//i.test(m)) return "audio";
  if ([".mp4", ".mov", ".m4v", ".webm"].includes(ext)) return "video";
  if ([".mp3", ".wav", ".m4a", ".ogg"].includes(ext)) return "audio";
  return "media";
}

function extractYoutubeVideoId(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  try {
    const u = new URL(raw);
    const host = String(u.hostname || "").toLowerCase();
    if (host.includes("youtu.be")) return u.pathname.replace("/", "").slice(0, 20);
    if (host.includes("youtube.com")) {
      const qv = String(u.searchParams.get("v") || "").trim();
      if (qv) return qv.slice(0, 20);
      const parts = u.pathname.split("/").filter(Boolean);
      const marker = parts.findIndex((x) => x === "embed" || x === "shorts" || x === "live");
      if (marker >= 0 && parts[marker + 1]) return String(parts[marker + 1]).slice(0, 20);
    }
  } catch {
    // ignore parse errors
  }
  return "";
}

function isLikelyVideoUrl(value) {
  const v = String(value || "").trim().toLowerCase();
  return /^https?:\/\//.test(v) && (/\.(mp4|webm|m4v|mov)(\?|#|$)/.test(v) || Boolean(extractYoutubeVideoId(v)));
}

function isLikelyAudioUrl(value) {
  const v = String(value || "").trim().toLowerCase();
  return /^https?:\/\//.test(v) && /\.(mp3|wav|m4a|ogg)(\?|#|$)/.test(v);
}

function isLikelyImageUrl(value) {
  const v = String(value || "").trim().toLowerCase();
  return /^https?:\/\//.test(v) && /\.(png|jpg|jpeg|webp|gif)(\?|#|$)/.test(v);
}

async function buildVideoPreviewDataUrl(file, { maxWidth = 460, maxHeight = 280, quality = 0.72 } = {}) {
  if (!file) return "";
  let objectUrl = "";
  try {
    objectUrl = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.src = objectUrl;
    await new Promise((resolve, reject) => {
      let settled = false;
      const done = (ok) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        video.removeEventListener("loadeddata", onLoadedData);
        video.removeEventListener("error", onError);
        if (ok) resolve();
        else reject(new Error("Video preview failed"));
      };
      const onLoadedData = () => done(true);
      const onError = () => done(false);
      const timeout = setTimeout(() => done(false), 3500);
      video.addEventListener("loadeddata", onLoadedData, { once: true });
      video.addEventListener("error", onError, { once: true });
    });
    const srcW = Math.max(1, Number(video.videoWidth || 0));
    const srcH = Math.max(1, Number(video.videoHeight || 0));
    if (!srcW || !srcH) return "";
    const scale = Math.min(1, maxWidth / srcW, maxHeight / srcH);
    const width = Math.max(96, Math.round(srcW * scale));
    const height = Math.max(72, Math.round(srcH * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    ctx.drawImage(video, 0, 0, width, height);
    const out = canvas.toDataURL("image/jpeg", Math.max(0.45, Math.min(0.9, Number(quality) || 0.72)));
    return sanitizePreviewImage(out, 180000);
  } catch {
    return "";
  } finally {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }
}

function uniqueFiles(files = [], max = 20) {
  const arr = Array.isArray(files) ? files : Array.from(files || []);
  const seen = new Set();
  const out = [];
  for (const f of arr) {
    if (!f || typeof f.name !== "string") continue;
    const key = `${String(f.name)}:${Number(f.size || 0)}:${Number(f.lastModified || 0)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(f);
    if (out.length >= max) break;
  }
  return out;
}

function summarizeFileNames(files = [], limit = 3) {
  const arr = Array.isArray(files) ? files : [];
  if (!arr.length) return "";
  const names = arr.slice(0, limit).map((f) => String(f?.name || "file").slice(0, 60));
  const more = arr.length > limit ? ` +${arr.length - limit} more` : "";
  return `${names.join(", ")}${more}`;
}

function extractFilesFromDataTransfer(dataTransfer) {
  if (!dataTransfer) return [];
  const fromFiles = uniqueFiles(dataTransfer.files ? [...dataTransfer.files] : []);
  if (fromFiles.length) return fromFiles;
  const items = Array.from(dataTransfer.items || []);
  const fromItems = [];
  for (const item of items) {
    if (!item || item.kind !== "file") continue;
    const file = item.getAsFile?.();
    if (file) fromItems.push(file);
  }
  return uniqueFiles(fromItems);
}

function bindDropZone(el, { onFiles, onOpenPicker } = {}) {
  if (!el) return;
  let dragDepth = 0;
  const activate = () => el.classList.add("drag-active");
  const deactivate = () => el.classList.remove("drag-active");

  el.addEventListener("dragenter", (e) => {
    e.preventDefault();
    dragDepth += 1;
    activate();
  });
  el.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
    activate();
  });
  el.addEventListener("dragleave", (e) => {
    e.preventDefault();
    dragDepth = Math.max(0, dragDepth - 1);
    if (!dragDepth) deactivate();
  });
  el.addEventListener("drop", (e) => {
    e.preventDefault();
    dragDepth = 0;
    deactivate();
    const files = extractFilesFromDataTransfer(e.dataTransfer);
    if (!files.length) return;
    onFiles?.(files);
  });
  el.addEventListener("click", () => {
    onOpenPicker?.();
  });
  el.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    onOpenPicker?.();
  });
}

async function readFilesAsSources(files = []) {
  const incoming = uniqueFiles(files, 20);
  const accepted = incoming.filter((f) => canImportFile(f)).slice(0, 20);
  const rejected = incoming.length - accepted.length;
  const sources = [];
  for (const f of accepted) {
    const ext = extOf(f.name);
    const mime = String(f.type || "").toLowerCase();
    if (isPdfExt(ext) || mime === "application/pdf") {
      const base64 = await blobToBase64(f);
      sources.push({
        name: f.name,
        kind: "pdf",
        base64
      });
      continue;
    }

    if (isDocxExt(ext) || mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const base64 = await blobToBase64(f);
      sources.push({
        name: f.name,
        kind: "docx",
        base64
      });
      continue;
    }

    if (isImageExt(ext) || /^image\//i.test(mime)) {
      const base64 = await blobToBase64(f);
      const mimeType = f.type || (ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg");
      const previewImage = await buildImagePreviewDataUrl(f, { maxWidth: 460, maxHeight: 280, quality: 0.72 });
      const assetId = makeSourceAssetId();
      await saveSourceAssetBlob(assetId, f, { name: f.name, kind: "image", mimeType });
      sources.push({
        name: f.name,
        kind: "image",
        mimeType,
        previewImage,
        assetId,
        base64
      });
      continue;
    }

    if (isMediaExt(ext) || /^(audio|video)\//i.test(mime)) {
      const base64 = await blobToBase64(f);
      const mimeType = f.type || "audio/webm";
      const mediaKind = inferMediaKind(ext, mimeType);
      const previewImage = mediaKind === "video" ? await buildVideoPreviewDataUrl(f, { maxWidth: 460, maxHeight: 280, quality: 0.68 }) : "";
      const assetId = makeSourceAssetId();
      await saveSourceAssetBlob(assetId, f, { name: f.name, kind: "media", mimeType });
      sources.push({
        name: f.name,
        kind: "media",
        mimeType,
        mediaKind,
        previewImage,
        assetId,
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
  return { sources, rejected, accepted };
}

async function importFilesFromDevice(files, { setStatus = setSourceStatus, context = "sources" } = {}) {
  const list = uniqueFiles(files, 20);
  if (!list.length) {
    setStatus("No files detected. Add screenshots/images, docs, audio, or video files.", true);
    return { ok: false, importedCount: 0 };
  }
  const names = summarizeFileNames(list);
  if (context === "sources") {
    setSourceFileSelection(`Preparing ${list.length} file(s): ${names}`);
  } else {
    setChatAttachSelection(`Preparing ${list.length} file(s): ${names}`);
  }
  const { sources, rejected } = await readFilesAsSources(list);
  const out = await importPreparedSources(sources, rejected, { setStatus });
  if (context === "sources") {
    if (out.ok) setSourceFileSelection(`Attached ${out.importedCount} file(s): ${names}`);
    else setSourceFileSelection("Upload failed. Try again with smaller files.", true);
  } else {
    if (out.ok) setChatAttachSelection(`Attached ${out.importedCount} file(s): ${names}`);
    else setChatAttachSelection("Upload failed. Try again with smaller files.", true);
  }
  return out;
}

async function importSourcePickerFiles() {
  const files = [...(sourceFilesEl?.files || [])];
  if (!files.length) {
    setSourceFileSelection(SOURCE_UPLOAD_HINT);
    setSourceStatus("Choose files first.", true);
    return { ok: false, importedCount: 0 };
  }
  const out = await importFilesFromDevice(files, { setStatus: setSourceStatus, context: "sources" });
  if (sourceFilesEl) sourceFilesEl.value = "";
  return out;
}

async function importChatPickerFiles() {
  const files = [...(chatAttachFilesEl?.files || [])];
  if (!files.length) {
    setChatAttachSelection(CHAT_UPLOAD_HINT);
    return { ok: false, importedCount: 0 };
  }
  const out = await importFilesFromDevice(files, { setStatus: setChatAttachStatus, context: "chat" });
  if (chatAttachFilesEl) chatAttachFilesEl.value = "";
  return out;
}

async function handlePasteUpload(e) {
  const files = extractFilesFromDataTransfer(e.clipboardData);
  if (!files.length) return;
  if (!["home", "study_tools", "sources"].includes(currentView)) return;
  e.preventDefault();
  if (currentView === "sources") {
    await importFilesFromDevice(files, { setStatus: setSourceStatus, context: "sources" });
    return;
  }
  await importFilesFromDevice(files, { setStatus: setChatAttachStatus, context: "chat" });
}

function extractImportHighlights(imported = [], maxItems = 18) {
  const rows = [];
  const seen = new Set();
  const arr = Array.isArray(imported) ? imported : [];
  for (const src of arr) {
    const content = String(src?.content || "");
    const lines = content.split(/\n+/);
    for (const raw of lines) {
      if (rows.length >= Math.max(6, Number(maxItems) || 18)) return rows;
      let line = String(raw || "").trim();
      if (!line) continue;
      line = line.replace(/^[\s\-*•\d.)]+/, "").trim();
      if (!line || line.length < 12) continue;
      if (/^screenshot:\s*/i.test(line)) continue;
      if (/^(key points|important details|feedback|action items|ignored as irrelevant)$/i.test(line)) continue;
      const key = normalizeSourceLineForCompare(line).slice(0, 220);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      rows.push(line.slice(0, 240));
    }
  }
  return rows;
}

function renderImportedSources(imported = []) {
  if (!Array.isArray(imported) || !imported.length) return;
  const names = imported.map((s) => String(s?.name || "source").trim()).filter(Boolean);
  const shortNames = names.slice(0, 4).join(", ");
  const highlights = extractImportHighlights(imported, 16);
  const lines = [];
  lines.push(`## Imported sources (${imported.length})`);
  lines.push(`Files: ${shortNames}${names.length > 4 ? ` +${names.length - 4} more` : ""}`);
  if (highlights.length) {
    lines.push("");
    lines.push("Highlights");
    for (const row of highlights) lines.push(`- ${row}`);
  }
  lines.push("");
  lines.push("Use AI actions (Summarize / Feedback / Extract tasks) to work from attached sources.");
  appendToEditor(lines.join("\n"));
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

function normalizeSourceLineForCompare(value) {
  return String(value || "")
    .trim()
    .replace(/^screenshot:\s*/i, "")
    .replace(/^[\s\-*•\d.)]+/, "")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function buildSourceLineSet(content, maxLines = 100) {
  const out = new Set();
  const lines = String(content || "").split(/\n+/);
  for (const raw of lines) {
    if (out.size >= Math.max(10, Number(maxLines) || 100)) break;
    const line = normalizeSourceLineForCompare(raw);
    if (!line || line.length < 8) continue;
    if (line === "key points" || line === "important details" || line === "feedback" || line === "action items") continue;
    out.add(line.slice(0, 260));
  }
  return out;
}

function sourceSimilarityScore(aContent, bContent) {
  const a = buildSourceLineSet(aContent);
  const b = buildSourceLineSet(bContent);
  if (!a.size || !b.size) return 0;
  let shared = 0;
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  for (const line of small) {
    if (large.has(line)) shared += 1;
  }
  return shared / Math.max(1, Math.min(a.size, b.size));
}

function dedupeSourceEntries(list = [], { maxKeep = 40, threshold = 0.92, imageThreshold = 0.86 } = {}) {
  const arr = Array.isArray(list) ? list : [];
  const out = [];
  for (const row of arr) {
    const content = String(row?.content || "").trim();
    const name = String(row?.name || "").trim();
    if (!content || !name) continue;
    const previewImage = sanitizePreviewImage(row?.previewImage, 180000);
    let duplicateAt = -1;
    for (let j = 0; j < out.length; j += 1) {
      const prev = out[j];
      const isImagePair =
        String(prev?.kind || "").toLowerCase() === "image" || String(row?.kind || "").toLowerCase() === "image";
      const limit = isImagePair ? imageThreshold : threshold;
      if (sourceSimilarityScore(prev.content, content) >= limit) {
        duplicateAt = j;
        break;
      }
    }
    if (duplicateAt >= 0) {
      if (previewImage && !sanitizePreviewImage(out[duplicateAt]?.previewImage, 180000)) {
        out[duplicateAt].previewImage = previewImage;
      }
      if (!out[duplicateAt]?.assetId && row?.assetId) out[duplicateAt].assetId = String(row.assetId);
      if (!out[duplicateAt]?.mimeType && row?.mimeType) out[duplicateAt].mimeType = String(row.mimeType);
      if (!out[duplicateAt]?.mediaKind && row?.mediaKind) out[duplicateAt].mediaKind = String(row.mediaKind);
      continue;
    }
    const nextRow = { ...row };
    if (previewImage) nextRow.previewImage = previewImage;
    else delete nextRow.previewImage;
    if (nextRow.assetId) nextRow.assetId = String(nextRow.assetId).trim();
    if (nextRow.mimeType) nextRow.mimeType = String(nextRow.mimeType).trim();
    if (nextRow.mediaKind) nextRow.mediaKind = String(nextRow.mediaKind).trim().toLowerCase();
    out.push(nextRow);
  }
  return out.slice(-Math.max(6, Number(maxKeep) || 40));
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
    const previewImage = sanitizePreviewImage(s?.previewImage, 180000);
    const row = {
      name,
      url,
      kind: String(s?.kind || "").trim().slice(0, 40),
      content: content.slice(0, 140000),
      addedAt: now
    };
    if (previewImage) row.previewImage = previewImage;
    if (s?.assetId) row.assetId = String(s.assetId).trim();
    if (s?.mimeType) row.mimeType = String(s.mimeType).trim();
    if (s?.mediaKind) row.mediaKind = String(s.mediaKind).trim().toLowerCase();
    next.push(row);
  }
  const deduped = dedupeSourceEntries(next, { maxKeep: 40, threshold: 0.92, imageThreshold: 0.86 });
  saveSourcesForCurrentNote(deduped);
}

function getAiSourcesForRequest(maxSources = 6) {
  const all = loadSourcesForCurrentNote();
  const sorted = [...all].sort((a, b) => Number(b.addedAt || 0) - Number(a.addedAt || 0));
  const deduped = dedupeSourceEntries(sorted, { maxKeep: 60, threshold: 0.92, imageThreshold: 0.84 });
  return deduped.slice(0, maxSources).map((s) => ({
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
  const activePanel = n === "write" ? tabWriteEl : n === "sources" ? tabSourcesEl : tabStudyEl;
  if (activePanel) {
    activePanel.classList.remove("tab-enter");
    void activePanel.offsetWidth;
    activePanel.classList.add("tab-enter");
    if (tabMotionTimer) clearTimeout(tabMotionTimer);
    tabMotionTimer = setTimeout(() => activePanel.classList.remove("tab-enter"), 300);
  }
}

function loadActiveTab() {
  try {
    const v = String(localStorage.getItem(authScopedKey("active_tab_v1")) || "write");
    return v === "sources" || v === "study" || v === "write" ? v : "write";
  } catch {
    return "write";
  }
}

function getSourceRowsForManager(list = []) {
  const query = String(sourcesFilterInputEl?.value || "")
    .trim()
    .toLowerCase();
  const sortMode = String(sourcesSortSelectEl?.value || "recent");

  let rows = (Array.isArray(list) ? list : []).map((s, i) => ({ s, i }));
  if (query) {
    rows = rows.filter(({ s }) => {
      const hay = [s?.name || "", s?.kind || "", s?.content || "", s?.url || ""].join("\n").toLowerCase();
      return hay.includes(query);
    });
  }

  if (sortMode === "name") {
    rows.sort((a, b) => String(a.s?.name || "").localeCompare(String(b.s?.name || "")));
  } else if (sortMode === "kind") {
    rows.sort((a, b) => {
      const ak = String(a.s?.kind || "");
      const bk = String(b.s?.kind || "");
      const byKind = ak.localeCompare(bk);
      if (byKind !== 0) return byKind;
      return String(a.s?.name || "").localeCompare(String(b.s?.name || ""));
    });
  } else {
    rows.sort((a, b) => Number(b.s?.addedAt || 0) - Number(a.s?.addedAt || 0));
  }
  return rows;
}

function updateSourcesStats(allList = [], visibleRows = []) {
  if (!sourcesStatsEl) return;
  const allCount = Array.isArray(allList) ? allList.length : 0;
  const visibleCount = Array.isArray(visibleRows) ? visibleRows.length : 0;
  const chars = (Array.isArray(visibleRows) ? visibleRows : []).reduce(
    (sum, row) => sum + String(row?.s?.content || "").length,
    0
  );
  const approxWords = Math.max(0, Math.round(chars / 5));
  const reading = approxWords ? Math.max(1, Math.round(approxWords / 190)) : 0;
  sourcesStatsEl.textContent = `${visibleCount}/${allCount} sources visible · ${chars.toLocaleString()} chars · ~${reading} min read`;
}

function buildSourceContextBundle(rows = [], maxItems = 8) {
  const limited = (Array.isArray(rows) ? rows : []).slice(0, Math.max(1, Number(maxItems) || 8));
  if (!limited.length) return "";
  const blocks = limited.map((row, index) => {
    const s = row?.s || {};
    const name = String(s?.name || "Source").trim();
    const kind = String(s?.kind || "source").trim();
    const content = String(s?.content || "").trim().slice(0, 1400);
    const lines = [`[S${index + 1}] ${name}`, `Kind: ${kind}`];
    if (s?.url) lines.push(`URL: ${String(s.url).trim()}`);
    lines.push(content || "(no extracted text)");
    return lines.join("\n");
  });
  return blocks.join("\n\n---\n\n");
}

async function copyVisibleSourceContextBundle() {
  const list = loadSourcesForCurrentNote();
  const rows = getSourceRowsForManager(list);
  if (!rows.length) {
    setSourceStatus("No visible sources to copy.", true);
    return;
  }
  const bundle = buildSourceContextBundle(rows, 8);
  if (!bundle) {
    setSourceStatus("No source context to copy yet.", true);
    return;
  }
  await navigator.clipboard.writeText(bundle);
  setSourceStatus(`Copied ${Math.min(8, rows.length)} source block(s) to clipboard.`);
}

function renderSourcesManager() {
  if (!sourcesListEl) return;
  const list = loadSourcesForCurrentNote();
  sourcesListEl.innerHTML = "";
  const rows = getSourceRowsForManager(list);
  updateSourcesStats(list, rows);

  if (!list.length) {
    if (!currentId) {
      sourcesListEl.innerHTML = `<div class="muted">No note open yet. Imported files are attached to a draft and move to your first saved note.</div>`;
      return;
    }
    sourcesListEl.innerHTML = `<div class="muted">No sources yet. Import files or URLs above.</div>`;
    return;
  }

  if (!currentId) {
    const draftHint = document.createElement("div");
    draftHint.className = "muted";
    draftHint.style.marginBottom = "0.6rem";
    draftHint.textContent = "Draft sources (no note saved yet). Save a note and these attachments will move with it.";
    sourcesListEl.appendChild(draftHint);
  }

  if (!rows.length) {
    sourcesListEl.innerHTML = `<div class="muted">No sources match your current filter.</div>`;
    return;
  }

  for (const { s, i } of rows) {
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
    rm.addEventListener("click", async () => {
      const next = loadSourcesForCurrentNote();
      const removed = next[i];
      next.splice(i, 1);
      saveSourcesForCurrentNote(next);
      await deleteSourceAssetBlob(String(removed?.assetId || ""));
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
  wrap.className = "citation-inline";
  const labelEl = document.createElement("span");
  labelEl.className = "citation-inline-label";
  labelEl.textContent = "Sources:";
  wrap.appendChild(labelEl);
  arr.forEach((c, i) => {
    const id = String(c?.id || "").trim();
    const url = String(c?.url || "").trim();
    const name = String(c?.name || "").trim();
    const kind = String(c?.kind || "").trim().toLowerCase();
    const label = id || `S${i + 1}`;
    const title = name ? name.slice(0, 66) : kind.includes("video") ? "Video result" : "Source";
    const a = document.createElement("a");
    a.textContent = `[${label}] ${title}`;
    a.className = "citation-chip";
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

function setButtonBusy(btn, busy, busyLabel = "") {
  if (!btn) return;
  if (!btn.dataset.idleLabel) btn.dataset.idleLabel = String(btn.textContent || "");
  const isBusy = Boolean(busy);
  btn.disabled = isBusy;
  btn.classList.toggle("is-busy", isBusy);
  if (isBusy && busyLabel) btn.textContent = busyLabel;
  if (!isBusy) btn.textContent = String(btn.dataset.idleLabel || btn.textContent || "");
}

function setNoteHandoffBusy(flow = "") {
  const active = String(flow || "");
  const defs = [
    { key: "tutor", btn: noteHandoffTutorBtn, busyLabel: "Launching tutor..." },
    { key: "cards", btn: noteHandoffCardsBtn, busyLabel: "Generating cards..." },
    { key: "exam", btn: noteHandoffExamBtn, busyLabel: "Building exam..." },
    { key: "plan", btn: noteHandoffPlanBtn, busyLabel: "Building plan..." }
  ];
  defs.forEach(({ key, btn, busyLabel }) => {
    const engaged = Boolean(active);
    const selected = engaged && key === active;
    setButtonBusy(btn, engaged, selected ? busyLabel : "");
  });
}

function isLikelyTutorHeading(line) {
  const s = String(line || "").trim();
  if (!s) return false;
  if (/^#{1,3}\s+/.test(s)) return true;
  return /^[A-Za-z][A-Za-z0-9\s/&\-]{2,56}:$/.test(s);
}

function normalizeTutorHeading(line) {
  const s = String(line || "")
    .replace(/^#{1,3}\s+/, "")
    .replace(/:$/, "")
    .trim();
  return s || "Section";
}

function normalizeTutorBullet(line) {
  return String(line || "")
    .replace(/^[-*•]\s+/, "")
    .replace(/^\d+[.)]\s+/, "")
    .trim();
}

function parseTutorSections(text) {
  const lines = String(text || "").replace(/\r/g, "").split("\n");
  const sections = [];
  let current = { title: "Overview", bullets: [], paragraphs: [] };

  const pushCurrent = () => {
    if (!current.bullets.length && !current.paragraphs.length) return;
    sections.push(current);
  };

  lines.forEach((raw) => {
    const line = String(raw || "").trim();
    if (!line) return;
    if (isLikelyTutorHeading(line)) {
      pushCurrent();
      current = { title: normalizeTutorHeading(line), bullets: [], paragraphs: [] };
      return;
    }
    if (/^[-*•]\s+/.test(line) || /^\d+[.)]\s+/.test(line)) {
      const bullet = normalizeTutorBullet(line);
      if (bullet) current.bullets.push(bullet);
      return;
    }
    current.paragraphs.push(line);
  });
  pushCurrent();
  return sections.slice(0, 10);
}

function renderTutorStructuredOutput(el, text, citations = []) {
  if (!el) return;
  const body = String(text || "").trim();
  if (!body) {
    el.textContent = "No tutor response.";
    return;
  }
  const sections = parseTutorSections(body);
  el.innerHTML = "";

  const shell = document.createElement("section");
  shell.className = "tutor-structured-shell";
  if (!sections.length) {
    const p = document.createElement("p");
    p.className = "tutor-structured-paragraph";
    p.textContent = body;
    shell.appendChild(p);
  } else {
    sections.forEach((section, index) => {
      const block = document.createElement("article");
      block.className = "tutor-structured-block";
      const title = document.createElement("h4");
      title.className = "tutor-structured-title";
      title.textContent = String(section.title || `Section ${index + 1}`);
      block.appendChild(title);

      section.paragraphs.slice(0, 3).forEach((paragraph) => {
        const p = document.createElement("p");
        p.className = "tutor-structured-paragraph";
        p.textContent = paragraph;
        block.appendChild(p);
      });
      if (section.bullets.length) {
        const ul = document.createElement("ul");
        ul.className = "tutor-structured-list";
        section.bullets.slice(0, 8).forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          ul.appendChild(li);
        });
        block.appendChild(ul);
      }
      shell.appendChild(block);
    });
  }

  el.appendChild(shell);
  const cit = renderCitationsInline(citations);
  if (cit) el.appendChild(cit);
}

function setTutorResponse(text, citations = []) {
  lastTutorAnswerText = String(text || "");
  lastTutorAnswerCitations = Array.isArray(citations) ? citations : [];
  renderTutorStructuredOutput(tutorOutputEl, lastTutorAnswerText, lastTutorAnswerCitations);
  const hasAnswer = Boolean(String(lastTutorAnswerText || "").trim());
  if (tutorCopyBtn) tutorCopyBtn.disabled = !hasAnswer;
  if (tutorInsertBtn) tutorInsertBtn.disabled = !hasAnswer;
}

async function copyTutorAnswerToClipboard() {
  const text = String(lastTutorAnswerText || "").trim();
  if (!text) {
    setStudyWorkflowStatus("No tutor answer to copy yet.", true);
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    setStudyWorkflowStatus("Tutor answer copied.");
  } catch {
    const fallback = document.createElement("textarea");
    fallback.value = text;
    fallback.setAttribute("readonly", "readonly");
    fallback.style.position = "fixed";
    fallback.style.opacity = "0";
    document.body.appendChild(fallback);
    fallback.focus();
    fallback.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(fallback);
    if (!ok) throw new Error("Clipboard blocked");
    setStudyWorkflowStatus("Tutor answer copied.");
  }
}

function tutorAnswerWithCitationsText() {
  const body = String(lastTutorAnswerText || "").trim();
  if (!body) return "";
  const cites = Array.isArray(lastTutorAnswerCitations)
    ? lastTutorAnswerCitations
        .map((c) => String(c?.id || "").trim())
        .filter(Boolean)
    : [];
  if (!cites.length) return body;
  return `${body}\n\nSources: ${cites.map((id) => `[${id}]`).join(" ")}`;
}

function insertTutorAnswerIntoCurrentNote() {
  const text = tutorAnswerWithCitationsText();
  if (!text) {
    setStudyWorkflowStatus("No tutor answer to insert yet.", true);
    return;
  }
  setView("notes");
  setActiveTab("write");
  appendToEditor(`Tutor synthesis\n${text}`);
  setNoteHandoffStatus("Inserted tutor answer into your current note.");
  setStudyWorkflowStatus("Tutor answer inserted into note.");
}

function estimateSourceUploadSizeChars(src) {
  const b64 = String(src?.base64 || "");
  const text = String(src?.content || "");
  const preview = String(src?.previewImage || "");
  return b64.length + text.length + preview.length + 600;
}

function buildSourceImportBatches(sources, { maxItems = 4, maxChars = 7_000_000 } = {}) {
  const arr = Array.isArray(sources) ? sources : [];
  const batches = [];
  let current = [];
  let currentChars = 0;
  for (const src of arr) {
    const est = Math.max(800, estimateSourceUploadSizeChars(src));
    const over =
      current.length > 0 &&
      (current.length >= Math.max(1, Number(maxItems) || 4) || currentChars + est > Math.max(200000, Number(maxChars) || 7000000));
    if (over) {
      batches.push(current);
      current = [];
      currentChars = 0;
    }
    current.push(src);
    currentChars += est;
  }
  if (current.length) batches.push(current);
  return batches;
}

async function requestSourceImport({ sources = [], urls = [] } = {}) {
  return api("/api/sources/import", {
    method: "POST",
    body: JSON.stringify({ sources, urls })
  });
}

function hydrateImportedVisualData(imported = [], preparedSources = []) {
  const rows = Array.isArray(imported) ? imported : [];
  const prepared = Array.isArray(preparedSources) ? preparedSources : [];
  if (!rows.length || !prepared.length) return rows;
  const bySource = new Map();
  let fallbackVisual = null;
  prepared.forEach((src) => {
    const name = String(src?.name || "").trim().toLowerCase();
    const kind = String(src?.kind || "").trim().toLowerCase();
    const preview = sanitizePreviewImage(src?.previewImage, 180000);
    const assetId = String(src?.assetId || "").trim();
    const mimeType = String(src?.mimeType || "").trim();
    const mediaKind = String(src?.mediaKind || "").trim().toLowerCase();
    if (!name) return;
    const visual = {
      previewImage: preview || "",
      assetId: assetId || "",
      mimeType: mimeType || "",
      mediaKind: mediaKind || ""
    };
    bySource.set(`${kind}:${name}`, visual);
    bySource.set(name, visual);
    if (!fallbackVisual && (visual.previewImage || visual.assetId)) fallbackVisual = visual;
  });
  if (!fallbackVisual) return rows;
  return rows.map((row) => {
    const out = { ...row };
    const key = String(out?.name || "").trim().toLowerCase();
    const kind = String(out?.kind || "").trim().toLowerCase();
    const match = bySource.get(`${kind}:${key}`) || bySource.get(key) || fallbackVisual;
    const existingPreview = sanitizePreviewImage(out?.previewImage, 180000);
    if (!existingPreview && match?.previewImage) out.previewImage = match.previewImage;
    if (!out.assetId && match?.assetId) out.assetId = match.assetId;
    if (!out.mimeType && match?.mimeType) out.mimeType = match.mimeType;
    if (!out.mediaKind && match?.mediaKind) out.mediaKind = match.mediaKind;
    return out;
  });
}

function applyImportedSources(imported = []) {
  renderImportedSources(imported);
  mergeImportedSourcesIntoCurrent(imported);
  renderSourcesManager();
  renderLearningFeed();
}

async function importSources({ sources = [], urls = [], setStatus = setSourceStatus } = {}) {
  if (!token) {
    setStatus("Session expired. Sign in again, then retry import.", true);
    return { ok: false, importedCount: 0 };
  }
  if (!sources.length && !urls.length) {
    setStatus("Select files or enter URLs first.", true);
    return { ok: false, importedCount: 0 };
  }
  setStatus("Importing sources...");
  try {
    const out = await requestSourceImport({ sources, urls });
    const importedRaw = Array.isArray(out?.imported) ? out.imported : [];
    const imported = hydrateImportedVisualData(importedRaw, sources);
    applyImportedSources(imported);
    setStatus(`Imported ${imported.length} source(s) into this note.`);
    fireAndForgetTrack("sources.import_client", { count: imported.length });
    awardXp("import", 6);
    await countImportAndMaybeShowAds();
    return { ok: true, importedCount: imported.length };
  } catch (e) {
    setStatus(formatImportError(e), true);
    return { ok: false, importedCount: 0 };
  }
}

async function importPreparedSources(sources, rejected = 0, { setStatus = setSourceStatus } = {}) {
  const arr = Array.isArray(sources) ? sources : [];
  if (!arr.length) {
    setStatus(
      rejected > 0
        ? "No supported files selected. Use text, PDF, DOCX, screenshots/images, or video/audio files."
        : "Select files first.",
      true
    );
    return { ok: false, importedCount: 0 };
  }

  const batches = buildSourceImportBatches(arr);
  if (batches.length <= 1) {
    const out = await importSources({ sources: arr, urls: [], setStatus });
    if (out.ok && rejected > 0) {
      setStatus(`Imported ${arr.length}. Skipped ${rejected} unsupported file(s).`);
    }
    return out;
  }

  if (!token) {
    setStatus("Session expired. Sign in again, then retry import.", true);
    return { ok: false, importedCount: 0 };
  }

  let totalImported = 0;
  let failedFiles = 0;
  let lastErr = null;
  for (let i = 0; i < batches.length; i += 1) {
    const batch = batches[i];
    setStatus(`Importing sources... (${i + 1}/${batches.length})`);
    try {
      const out = await requestSourceImport({ sources: batch, urls: [] });
      const importedRaw = Array.isArray(out?.imported) ? out.imported : [];
      const imported = hydrateImportedVisualData(importedRaw, batch);
      totalImported += imported.length;
      applyImportedSources(imported);
    } catch (e) {
      failedFiles += batch.length;
      lastErr = e;
    }
  }

  if (totalImported > 0) {
    const skipped = rejected + failedFiles;
    setStatus(`Imported ${totalImported} source(s) into this note.${skipped > 0 ? ` Skipped ${skipped} file(s).` : ""}`);
    fireAndForgetTrack("sources.import_client", { count: totalImported });
    awardXp("import", 6);
    await countImportAndMaybeShowAds();
    return { ok: true, importedCount: totalImported };
  }

  if (lastErr) {
    setStatus(formatImportError(lastErr), true);
    return { ok: false, importedCount: 0 };
  }

  if (rejected > 0) {
    setStatus(`No supported files selected. Skipped ${rejected} unsupported file(s).`, true);
  }
  return { ok: false, importedCount: 0 };
}

async function askTutor({ preferWebSearch = false, source = "study_tools" } = {}) {
  const question = String(tutorQuestionEl.value || "").trim();
  const noteText = getAiReadyNoteText();
  const sources = getAiSourcesForRequest(6);
  const shouldPreferWeb = Boolean(preferWebSearch);
  if (!question) {
    setTutorResponse("Enter a tutor question.");
    return;
  }
  setTutorResponse(
    shouldPreferWeb || !(noteText || sources.length)
      ? "Searching the web for learning resources..."
      : "Tutor is thinking..."
  );
  try {
    const out = await api("/api/tutor", {
      method: "POST",
      body: JSON.stringify({ question, noteText, sources, preferWebSearch: shouldPreferWeb })
    });
    setTutorResponse(out.answer || "No tutor response.", out.citations || []);
    if (source === "home") {
      if (out.mode === "web_search") setHomeComposeStatus("Showing web pages and videos for your topic.");
      else setHomeComposeStatus("Using your current note and attached files.");
    } else if (source === "notes_handoff") {
      setNoteHandoffStatus("Tutor handoff answer generated.");
    }
    awardXp("tutor", 8);
    await countOutputAndMaybeShowAds("tutor.ask");
  } catch (e) {
    const quota = formatQuotaError(e, "Tutor limit reached.");
    if (quota) promptUpgradeForQuota("ai_output");
    setTutorResponse(quota ? quota : `Tutor error: ${e.message}`);
    if (source === "home") setHomeComposeStatus(quota ? quota : `Tutor error: ${e.message}`, true);
    if (source === "notes_handoff") setNoteHandoffStatus(quota ? quota : `Tutor error: ${e.message}`, true);
  }
}

function setStudyWorkflowStatus(msg, isError = false) {
  if (!studyWorkflowStatusEl) return;
  studyWorkflowStatusEl.textContent = String(msg || "");
  studyWorkflowStatusEl.style.color = isError ? "var(--danger)" : "var(--accent-hover)";
}

function setStudyWorkflowBusy(flow = "") {
  const active = String(flow || "");
  const defs = [
    { key: "recall", btn: studyWorkflowRecallBtn, busyLabel: "Running recall..." },
    { key: "exam", btn: studyWorkflowExamBtn, busyLabel: "Building exam..." },
    { key: "weak", btn: studyWorkflowWeakBtn, busyLabel: "Coaching weak topic..." }
  ];
  defs.forEach(({ key, btn, busyLabel }) => {
    const engaged = Boolean(active);
    const selected = engaged && key === active;
    setButtonBusy(btn, engaged, selected ? busyLabel : "");
  });
}

async function runStudyWorkflow(kind) {
  const flow = String(kind || "").trim();
  if (!flow) return;
  if (studyWorkflowRunning) {
    setStudyWorkflowStatus("Workflow already running. Please wait.");
    return;
  }
  studyWorkflowRunning = true;
  setStudyWorkflowBusy(flow);
  try {
    if (flow === "recall") {
      if (!getAiReadyNoteText()) {
        setStudyWorkflowStatus("Add note text first, then run Recall sprint.", true);
        return;
      }
      setStudyWorkflowStatus("Recall sprint: generating cards...");
      await generateFlashcards();
      setStudyWorkflowStatus("Recall sprint: opening due-card review...");
      await renderStudyDue();
      setStudyWorkflowStatus("Recall sprint ready. Grade cards with 1-4 keys.");
      return;
    }

    if (flow === "exam") {
      if (!getAiReadyNoteText()) {
        setStudyWorkflowStatus("Add note text first, then run Exam drill.", true);
        return;
      }
      setStudyWorkflowStatus("Exam drill: building practice test...");
      if (examModeEl) examModeEl.value = "timed";
      await renderTestPrep();
      setStudyWorkflowStatus("Exam drill ready (timed mode).");
      return;
    }

    if (flow === "weak") {
      setStudyWorkflowStatus("Weak-topic loop: refreshing personalized plan...");
      await loadLearningPlan({ force: true });
      const weak = Array.isArray(learningSummary?.weakTags) ? learningSummary.weakTags : [];
      const focus = weak.length ? String(weak[0]?.tag || "").trim() : "";
      if (focus) {
        tutorQuestionEl.value = `Teach me ${focus} from first principles, then give 3 quick checks to verify mastery.`;
      } else if (!String(tutorQuestionEl.value || "").trim()) {
        tutorQuestionEl.value = "Identify my weakest topic from this notebook and coach me through it with a short drill.";
      }
      setStudyWorkflowStatus("Weak-topic loop: generating tutor coaching...");
      await askTutor({ preferWebSearch: false, source: "study_tools" });
      if (examModeEl) examModeEl.value = "weak";
      setStudyWorkflowStatus("Weak-topic loop: generating follow-up practice...");
      await renderTestPrep();
      setStudyWorkflowStatus("Weak-topic loop ready. Review tutor output, then grade the practice set.");
      return;
    }
  } catch (e) {
    setStudyWorkflowStatus(`Workflow error: ${e.message}`, true);
  } finally {
    studyWorkflowRunning = false;
    setStudyWorkflowBusy("");
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

async function saveNote({ silent = false, reason = "manual", refreshBrief = true } = {}) {
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
  if (!silent) aiOutputEl.textContent = "Saved.";
  setNoteCleanState(new Date(saved.updatedAt || Date.now()).getTime());
  renderLearningFeed();
  updateHomeOutcomeMetrics();
  if (refreshBrief) await loadWorkspaceBrief({ force: true }).catch(() => {});
  fireAndForgetTrack("notes.save", { noteId: saved.id, reason: String(reason || "manual") });
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
  renderLearningFeed();
  updateHomeOutcomeMetrics();
  await loadWorkspaceBrief({ force: true }).catch(() => {});
  fireAndForgetTrack("notes.delete", {});
}

async function runAi(action) {
  const noteText = getAiReadyNoteText();
  const sources = getAiSourcesForRequest(6);
  if (!noteText && !sources.length) {
    aiOutputEl.textContent = "Add note text or import files first.";
    return;
  }

  aiOutputEl.textContent = "Thinking...";
  try {
    const selectedText = getSelectionTextWithinEditor();
    const data = await api("/api/ai", {
      method: "POST",
      body: JSON.stringify({ action, noteText, selectedText, sources })
    });
    setOutputWithCitations(aiOutputEl, data.output || "(No output)", data.citations || []);
    fireAndForgetTrack("ai.action", { action });
    awardXp(action, 5);
    await countOutputAndMaybeShowAds(`ai.${action}`);
  } catch (err) {
    const quota = formatQuotaError(err, "AI limit reached.");
    if (quota) promptUpgradeForQuota("ai_output");
    aiOutputEl.textContent = quota ? quota : `Error: ${err.message}`;
  }
}

function openOverlay(title) {
  releaseOverlayObjectUrls();
  setOverlayKeyHandler(null);
  overlayTitleEl.textContent = title;
  overlayEl.classList.remove("hidden");
  overlayEl.setAttribute("aria-hidden", "false");
}

function closeOverlay() {
  setOverlayKeyHandler(null);
  releaseOverlayObjectUrls();
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

function tutorialViewForSelector(selector) {
  const map = {
    ".panel.left": "notes",
    "#note-editor": "notes",
    ".ai-tools": "notes",
    "#gen-cards-btn": "study_tools",
    "#learning-mastery": "study_tools",
    "#save-reminder-btn": "account"
  };
  return map[String(selector || "")] || "";
}

function renderTutorialStep() {
  const step = tutorialSteps[tutorialStepIndex];
  if (!step) return;
  const stepView = tutorialViewForSelector(step.selector);
  if (stepView && stepView !== currentView) {
    setView(stepView, { persist: false, updateUrl: false });
  }
  if (String(step.selector || "") === "#save-reminder-btn") {
    const advanced = document.querySelector(".account-advanced");
    if (advanced && "open" in advanced) advanced.setAttribute("open", "open");
  }
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
  const noteText = getAiReadyNoteText();
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
    if (quota) promptUpgradeForQuota("flashcard_gen");
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
    box.className = "ad-break card-face";

    const title = document.createElement("h3");
    title.textContent = "Quick break";
    box.appendChild(title);

    const msg = document.createElement("div");
    msg.className = "muted";
    msg.textContent = "Take 20 seconds, then continue your review.";
    box.appendChild(msg);

    const slot = document.createElement("div");
    slot.className = "ad-slot";
    box.appendChild(slot);

    const cont = document.createElement("button");
    cont.className = "ghost";
    cont.textContent = "Continue studying";
    cont.addEventListener("click", nextFn);
    const row = buttonRow([cont]);
    row.classList.add("flashcard-actions");
    box.appendChild(row);

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
    headLeft.className = "flashcard-head-left";
    const counter = document.createElement("strong");
    counter.className = "flashcard-counter";
    counter.textContent = `Card ${idx + 1} / ${cards.length}`;
    const sub = document.createElement("span");
    sub.className = "flashcard-subline";
    const tags = Array.isArray(c?.tags) ? c.tags.filter(Boolean).slice(0, 3) : [];
    sub.textContent = tags.length ? `Focus: ${tags.join(", ")}` : "Review and grade your recall.";
    headLeft.appendChild(counter);
    headLeft.appendChild(sub);
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

    const progressWrap = document.createElement("div");
    progressWrap.className = "flashcard-progress";
    const progressText = document.createElement("span");
    progressText.className = "flashcard-progress-text";
    progressText.textContent = `${Math.round((idx / Math.max(1, cards.length)) * 100)}% complete`;
    const progressTrack = document.createElement("div");
    progressTrack.className = "flashcard-progress-track";
    const progressBar = document.createElement("div");
    progressBar.className = "flashcard-progress-bar";
    progressBar.style.width = `${Math.max(6, Math.round((idx / Math.max(1, cards.length)) * 100))}%`;
    progressTrack.appendChild(progressBar);
    progressWrap.appendChild(progressText);
    progressWrap.appendChild(progressTrack);
    body.appendChild(progressWrap);

    const front = document.createElement("div");
    front.className = "card-face flashcard-side flashcard-side-front";
    front.innerHTML = `<div class="flashcard-side-label">Prompt</div><div class="mono flashcard-side-text"></div>`;
    front.querySelector(".flashcard-side-text").textContent = c.front;
    body.appendChild(front);

    const back = document.createElement("div");
    back.className = "card-face flashcard-side flashcard-side-back";
    back.innerHTML = `<div class="flashcard-side-label">Answer</div><div class="mono flashcard-side-text"></div>`;
    back.querySelector(".flashcard-side-text").textContent = showBack ? c.back : "Press Show answer (Space).";
    body.appendChild(back);

    if (!showBack) {
      const showBtn = document.createElement("button");
      showBtn.className = "ghost flashcard-reveal-btn";
      showBtn.textContent = "Show answer (Space)";
      showBtn.addEventListener("click", () => {
        showBack = true;
        render();
      });
      const hint = document.createElement("div");
      hint.className = "flashcard-key-hint";
      hint.textContent = "Tip: Use Space to reveal, then press 1-4 to grade.";
      body.appendChild(hint);
      const row = buttonRow([showBtn]);
      row.classList.add("flashcard-actions");
      body.appendChild(row);
    } else {
      const mk = (label, grade, cls = "ghost") => {
        const b = document.createElement("button");
        b.className = `${cls} flashcard-grade-btn`;
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

      const againBtn = mk("1 Again", 0);
      againBtn.classList.add("danger");
      const hardBtn = mk("2 Hard", 1);
      const goodBtn = mk("3 Good", 2);
      const easyBtn = mk("4 Easy", 3);
      easyBtn.classList.add("flashcard-grade-easy");
      const row = buttonRow([againBtn, hardBtn, goodBtn, easyBtn]);
      row.classList.add("flashcard-actions");
      body.appendChild(row);
    }

    float.appendChild(body);

    const resizer = document.createElement("div");
    resizer.className = "fc-resizer";
    float.appendChild(resizer);

    attachDragResize(float, stage, head, resizer, () => fcScale, (v) => applyScale(v));
  }

  setOverlayKeyHandler((e) => {
    if (overlayEl.classList.contains("hidden")) return;
    if (String(overlayTitleEl?.textContent || "").toLowerCase() !== "study due flashcards") return;
    const hasCard = Boolean(stage.querySelector(".flashcard-float"));
    if (!hasCard) return;
    if (!showBack && (e.key === " " || e.key === "ArrowRight")) {
      e.preventDefault();
      showBack = true;
      render();
      return;
    }
    if (!showBack) return;
    const gradeMap = { "1": 0, "2": 1, "3": 2, "4": 3 };
    const mapped = gradeMap[String(e.key || "")];
    if (mapped === undefined) return;
    e.preventDefault();
    const btn = stage.querySelectorAll(".flashcard-grade-btn")[mapped];
    if (btn instanceof HTMLButtonElement) btn.click();
  });

  render();
}

async function renderTestPrep() {
  const noteText = getAiReadyNoteText();
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
    if (quota) promptUpgradeForQuota("ai_output");
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

  const shell = document.createElement("section");
  shell.className = "testprep-shell";

  const summary = document.createElement("div");
  summary.className = "card-face testprep-summary";
  summary.innerHTML = `
    <div class="testprep-summary-head">
      <span class="testprep-mode">${escapeHtml(examMode.replace(/\b\w/g, (m) => m.toUpperCase()))} mode</span>
      <strong>${questions.length} question${questions.length === 1 ? "" : "s"}</strong>
    </div>
    <p class="muted">Answer each prompt, then grade to see your auto-scored MCQ results and review explanations.</p>
  `;

  const scoreRow = document.createElement("div");
  scoreRow.className = "testprep-score";
  scoreRow.textContent = "Answer what you can, then click Grade test.";

  const form = document.createElement("div");
  form.className = "testprep-form";

  let timerInterval = null;
  if (examMode === "timed") {
    const timer = document.createElement("div");
    timer.className = "testprep-timer";
    let left = 10 * 60;
    timer.textContent = `Time left: 10:00`;
    timerInterval = setInterval(() => {
      if (overlayEl.classList.contains("hidden") || String(overlayTitleEl?.textContent || "").toLowerCase() !== "practice test") {
        clearInterval(timerInterval);
        timerInterval = null;
        return;
      }
      left -= 1;
      const mm = String(Math.max(0, Math.floor(left / 60))).padStart(2, "0");
      const ss = String(Math.max(0, left % 60)).padStart(2, "0");
      timer.textContent = `Time left: ${mm}:${ss}`;
      if (left <= 0 && timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }, 1000);
    summary.appendChild(timer);
  }

  shell.appendChild(summary);
  shell.appendChild(scoreRow);
  questions.forEach((q, i) => {
    const block = document.createElement("div");
    block.className = "card-face testprep-question";
    const title = document.createElement("h3");
    title.textContent = `Q${i + 1} (${String(q.type || "short").toUpperCase()})`;
    const prompt = document.createElement("div");
    prompt.className = "mono testprep-prompt";
    prompt.textContent = q.question;
    block.appendChild(title);
    block.appendChild(prompt);

    if (q.type === "mcq" && Array.isArray(q.choices) && q.choices.length) {
      q.choices.forEach((choice, ci) => {
        const label = document.createElement("label");
        label.className = "testprep-choice";
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = `q_${i}`;
        radio.value = choice;
        const span = document.createElement("span");
        span.className = "mono testprep-choice-text";
        span.textContent = `${String.fromCharCode(65 + ci)}. ${choice}`;
        label.appendChild(radio);
        label.appendChild(span);
        block.appendChild(label);
      });
    } else {
      const input = document.createElement("textarea");
      input.rows = 3;
      input.className = "testprep-answer-input";
      input.dataset.qIndex = String(i);
      block.appendChild(input);
    }

    form.appendChild(block);
  });
  shell.appendChild(form);

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
  gradeBtn.className = "testprep-grade-btn";
  gradeBtn.addEventListener("click", () => {
    const blocks = [...form.querySelectorAll(".testprep-question")];
    let correct = 0;

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
      marker.className = "testprep-marker";
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
    const blocks = [...form.querySelectorAll(".testprep-question")];
    blocks.forEach((b, i) => {
      if (b.querySelector(".testprep-answer")) return;
      const ans = document.createElement("div");
      ans.className = "mono testprep-answer";
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

  const actions = buttonRow([gradeBtn, showBtn]);
  actions.classList.add("testprep-actions");

  overlayBodyEl.innerHTML = "";
  overlayBodyEl.appendChild(shell);
  const globalCites = renderCitationsInline(out.citations || []);
  overlayBodyEl.appendChild(actions);
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

async function buildImagePreviewDataUrl(file, { maxWidth = 460, maxHeight = 280, quality = 0.72 } = {}) {
  if (!file) return "";
  let objectUrl = "";
  try {
    objectUrl = URL.createObjectURL(file);
    const img = await new Promise((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Image preview load failed"));
      el.src = objectUrl;
    });
    const sourceWidth = Math.max(1, Number(img.naturalWidth || img.width || 0));
    const sourceHeight = Math.max(1, Number(img.naturalHeight || img.height || 0));
    const scale = Math.min(1, maxWidth / sourceWidth, maxHeight / sourceHeight);
    const width = Math.max(96, Math.round(sourceWidth * scale));
    const height = Math.max(72, Math.round(sourceHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    ctx.drawImage(img, 0, 0, width, height);
    const out = canvas.toDataURL("image/jpeg", Math.max(0.45, Math.min(0.9, Number(quality) || 0.72)));
    return sanitizePreviewImage(out, 180000);
  } catch {
    return "";
  } finally {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }
}

async function stopRecording() {
  if (!recorder) return;
  recorder.stop();
  recordBtn.textContent = "Record voice note";
}

function appendTranscriptToEditor(text) {
  const transcript = String(text || "").trim();
  if (!transcript || !editorEl) return false;
  lastTranscriptSnapshot = editorEl.innerHTML;
  if (String(editorEl.textContent || "").trim()) {
    const spacer = document.createElement("div");
    spacer.setAttribute("data-transcript-divider", "1");
    spacer.innerHTML = "<br>";
    editorEl.appendChild(spacer);
  }
  const block = document.createElement("div");
  block.className = "transcript-entry";
  block.setAttribute("data-transcript-entry", "1");
  block.setAttribute("data-transcript-id", String(++lastTranscriptEntryId));
  block.textContent = transcript;
  editorEl.appendChild(block);
  return true;
}

function clearTranscriptionArea() {
  if (recorder) {
    aiOutputEl.textContent = "Stop recording first, then clear transcript.";
    return;
  }
  const transcriptNodes = [
    ...editorEl.querySelectorAll('[data-transcript-entry="1"]'),
    ...editorEl.querySelectorAll('[data-transcript-divider="1"]')
  ];
  if (transcriptNodes.length) {
    transcriptNodes.forEach((node) => node.remove());
    lastTranscriptSnapshot = "";
  } else if (lastTranscriptSnapshot) {
    editorEl.innerHTML = lastTranscriptSnapshot;
    lastTranscriptSnapshot = "";
  } else {
    const outputText = String(aiOutputEl.textContent || "").trim();
    const editorText = String(editorEl.innerText || "").trim();
    if (outputText && editorText && editorText === outputText) {
      editorEl.innerHTML = "";
    }
  }
  recordingChunks = [];
  recordingMimeType = "";
  aiOutputEl.textContent = "";
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
        appendTranscriptToEditor(data.text);
      }
      aiOutputEl.textContent = data.text || "No transcript returned.";
      fireAndForgetTrack("notes.transcribe", {});
    } catch (err) {
      const quota = formatQuotaError(err, "Transcription limit reached.");
      if (quota) promptUpgradeForQuota("transcribe");
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
if (profileSaveBtn) profileSaveBtn.addEventListener("click", () => saveAccountProfile());
if (passwordChangeBtn) passwordChangeBtn.addEventListener("click", () => changeAccountPassword());
if (cancelMembershipBtn) cancelMembershipBtn.addEventListener("click", () => cancelMembership());
if (deleteAccountBtn) deleteAccountBtn.addEventListener("click", () => deleteAccount());
if (profileAvatarInputEl) {
  profileAvatarInputEl.addEventListener("change", async () => {
    const file = profileAvatarInputEl.files?.[0];
    if (!file) return;
    try {
      const out = await normalizeAvatarFile(file);
      pendingAvatarDataUrl = out;
      setProfileAvatarPreview(out);
      setProfileStatus("Photo selected. Click Save profile.");
    } catch (e) {
      setProfileStatus(`Photo error: ${e.message}`, true);
    } finally {
      profileAvatarInputEl.value = "";
    }
  });
}
if (profileAvatarRemoveBtn) {
  profileAvatarRemoveBtn.addEventListener("click", () => {
    pendingAvatarDataUrl = "";
    setProfileAvatarPreview("");
    setProfileStatus("Profile photo removed. Click Save profile.");
  });
}
newBtn.addEventListener("click", clearEditor);
saveBtn.addEventListener("click", () => saveNote({ reason: "manual" }).catch((e) => (aiOutputEl.textContent = e.message)));
deleteBtn.addEventListener("click", () => deleteNote().catch((e) => (aiOutputEl.textContent = e.message)));
searchInputEl.addEventListener("input", renderNotes);
if (titleEl) {
  titleEl.addEventListener("input", () => {
    markNoteDirtyAndRefresh();
  });
}
if (tagsEl) {
  tagsEl.addEventListener("input", () => {
    markNoteDirtyAndRefresh();
  });
}
if (noteFlowSaveNowBtn) {
  noteFlowSaveNowBtn.addEventListener("click", () => {
    saveNote({ reason: "note_flow" }).catch((e) => (aiOutputEl.textContent = e.message));
  });
}
if (noteFlowInsertHeadingBtn) {
  noteFlowInsertHeadingBtn.addEventListener("click", () => {
    insertIntoEditorAtCursor("\n## Section heading\n");
  });
}
if (noteFlowInsertChecklistBtn) {
  noteFlowInsertChecklistBtn.addEventListener("click", () => {
    insertIntoEditorAtCursor("\n- [ ] Key point 1\n- [ ] Key point 2\n");
  });
}
if (noteHandoffTutorBtn) {
  noteHandoffTutorBtn.addEventListener("click", () => {
    runNoteToStudyHandoff("tutor").catch((e) => setNoteHandoffStatus(`Handoff failed: ${e.message}`, true));
  });
}
if (noteHandoffCardsBtn) {
  noteHandoffCardsBtn.addEventListener("click", () => {
    runNoteToStudyHandoff("cards").catch((e) => setNoteHandoffStatus(`Handoff failed: ${e.message}`, true));
  });
}
if (noteHandoffExamBtn) {
  noteHandoffExamBtn.addEventListener("click", () => {
    runNoteToStudyHandoff("exam").catch((e) => setNoteHandoffStatus(`Handoff failed: ${e.message}`, true));
  });
}
if (noteHandoffPlanBtn) {
  noteHandoffPlanBtn.addEventListener("click", () => {
    runNoteToStudyHandoff("plan").catch((e) => setNoteHandoffStatus(`Handoff failed: ${e.message}`, true));
  });
}

formatButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.execCommand(btn.dataset.cmd);
    editorEl.focus();
    markNoteDirtyAndRefresh();
  });
});

clearFormatBtn.addEventListener("click", () => {
  document.execCommand("removeFormat");
  editorEl.focus();
  markNoteDirtyAndRefresh();
});
if (cleanSourceBlocksBtn) {
  cleanSourceBlocksBtn.addEventListener("click", () => {
    cleanLegacySourceBlocksInEditor().catch((e) => {
      aiOutputEl.textContent = `Cleanup error: ${e.message}`;
    });
  });
}
editorEl.addEventListener("input", () => {
  lastTypingAt = Date.now();
  markNoteDirtyAndRefresh();
});

aiButtons.forEach((btn) => btn.addEventListener("click", () => runAi(btn.dataset.ai)));
if (recordBtn) {
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
}
if (clearRecordingBtn) {
  clearRecordingBtn.addEventListener("click", () => {
    clearTranscriptionArea();
  });
}

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
if (tutorCopyBtn) {
  tutorCopyBtn.addEventListener("click", () => {
    copyTutorAnswerToClipboard().catch((e) => setStudyWorkflowStatus(`Copy failed: ${e.message}`, true));
  });
}
if (tutorInsertBtn) {
  tutorInsertBtn.addEventListener("click", () => {
    insertTutorAnswerIntoCurrentNote();
  });
}
if (tutorCopyBtn) tutorCopyBtn.disabled = !String(lastTutorAnswerText || "").trim();
if (tutorInsertBtn) tutorInsertBtn.disabled = !String(lastTutorAnswerText || "").trim();
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
  if (!sourceFilesEl) return;
  const selected = [...(sourceFilesEl.files || [])];
  if (!selected.length) {
    sourceFilesEl.click();
    setSourceFileSelection("Choose screenshots/files from your device.");
    return;
  }
  await importSourcePickerFiles();
});
if (sourceAddFilesBtn) {
  sourceAddFilesBtn.addEventListener("click", () => {
    sourceFilesEl?.click();
  });
}
if (sourceFilesEl) {
  sourceFilesEl.addEventListener("change", async () => {
    const files = [...(sourceFilesEl.files || [])];
    if (!files.length) {
      setSourceFileSelection(SOURCE_UPLOAD_HINT);
      return;
    }
    setSourceFileSelection(`Selected ${files.length} file(s): ${summarizeFileNames(files)}`);
    await importSourcePickerFiles();
  });
}
importUrlsBtn.addEventListener("click", async () => {
  const urls = parseUrlInput(sourceUrlsEl.value).slice(0, 8);
  if (!urls.length) {
    setSourceStatus("Enter at least one URL.", true);
    return;
  }
  await importSources({ sources: [], urls });
});
bindDropZone(sourceDropZoneEl, {
  onFiles: (files) => {
    importFilesFromDevice(files, { setStatus: setSourceStatus, context: "sources" }).catch((e) => {
      setSourceStatus(formatImportError(e), true);
    });
  },
  onOpenPicker: () => sourceFilesEl?.click()
});

if (tabBtnWriteEl) {
  tabBtnWriteEl.addEventListener("click", () => {
    setView("notes");
    setActiveTab("write");
  });
}
if (tabBtnSourcesEl) {
  tabBtnSourcesEl.addEventListener("click", () => {
    setActiveTab("sources");
    setView("sources");
  });
}
if (tabBtnStudyEl) {
  tabBtnStudyEl.addEventListener("click", () => {
    setActiveTab("study");
    setView("study_tools");
  });
}
if (tabOpenSourcesBtn) tabOpenSourcesBtn.addEventListener("click", () => setView("sources"));
if (tabOpenStudyBtn) tabOpenStudyBtn.addEventListener("click", () => setView("study_tools"));

navViewLinkEls.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = String(btn.dataset.viewLink || "home");
    setView(target);
  });
});
if (railProfileBtnEl) railProfileBtnEl.addEventListener("click", () => goToAccountView());
if (topProfileBtnEl) topProfileBtnEl.addEventListener("click", () => goToAccountView());

if (homeComposeBtnEl) {
  homeComposeBtnEl.addEventListener("click", () => {
    runHomePrompt().catch((e) => {
      if (tutorOutputEl) tutorOutputEl.textContent = `Tutor error: ${e.message}`;
    });
  });
}
if (homeComposerInputEl) {
  homeComposerInputEl.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    runHomePrompt().catch((err) => {
      if (tutorOutputEl) tutorOutputEl.textContent = `Tutor error: ${err.message}`;
    });
  });
}
if (homeAttachBtnEl) {
  homeAttachBtnEl.addEventListener("click", () => {
    if (!chatAttachFilesEl) return;
    chatAttachFilesEl.click();
  });
}
if (tutorAttachBtnEl) {
  tutorAttachBtnEl.addEventListener("click", () => {
    if (!chatAttachFilesEl) return;
    chatAttachFilesEl.click();
  });
}
if (chatAttachFilesEl) {
  chatAttachFilesEl.addEventListener("change", async () => {
    await importChatPickerFiles();
  });
}
bindDropZone(homeDropZoneEl, {
  onFiles: (files) => {
    importFilesFromDevice(files, { setStatus: setChatAttachStatus, context: "chat" }).catch((e) => {
      setChatAttachStatus(formatImportError(e), true);
    });
  },
  onOpenPicker: () => chatAttachFilesEl?.click()
});
bindDropZone(tutorDropZoneEl, {
  onFiles: (files) => {
    importFilesFromDevice(files, { setStatus: setChatAttachStatus, context: "chat" }).catch((e) => {
      setChatAttachStatus(formatImportError(e), true);
    });
  },
  onOpenPicker: () => chatAttachFilesEl?.click()
});
document.addEventListener("paste", (e) => {
  handlePasteUpload(e).catch((err) => {
    const msg = formatImportError(err);
    if (currentView === "sources") setSourceStatus(msg, true);
    else setChatAttachStatus(msg, true);
  });
});
if (homeChipTranscribeEl) {
  homeChipTranscribeEl.addEventListener("click", () => {
    setView("notes");
    setActiveTab("write");
    if (recordBtn && !recorder) recordBtn.click();
  });
}
if (homeChipFileSummaryEl) {
  homeChipFileSummaryEl.addEventListener("click", () => {
    setView("sources");
    sourceUrlsEl?.focus();
  });
}
if (homeChipHomeworkEl) {
  homeChipHomeworkEl.addEventListener("click", () => {
    setView("study_tools");
    tutorQuestionEl?.focus();
  });
}
if (homeChipYoutubeEl) {
  homeChipYoutubeEl.addEventListener("click", () => {
    setView("sources");
    sourceUrlsEl?.focus();
  });
}
if (homeChipMoreEl) homeChipMoreEl.addEventListener("click", () => setView("study_tools"));
if (homeFeedViewAllEl) homeFeedViewAllEl.addEventListener("click", () => setView("study_tools"));
if (homeFeedClearEl) {
  homeFeedClearEl.addEventListener("click", () => {
    if (!confirm("Clear Momentum feed history on this device?")) return;
    clearMomentumFeed();
  });
}
if (homeActionNewNoteEl) {
  homeActionNewNoteEl.addEventListener("click", () => {
    setView("notes");
    clearEditor();
    titleEl?.focus();
    fireAndForgetTrack("home.quick_action", { action: "new_note" });
  });
}
if (homeActionImportEl) {
  homeActionImportEl.addEventListener("click", () => {
    setView("sources");
    sourceUrlsEl?.focus();
    fireAndForgetTrack("home.quick_action", { action: "import_sources" });
  });
}
if (homeActionStudyEl) {
  homeActionStudyEl.addEventListener("click", () => {
    setView("study_tools");
    tutorQuestionEl?.focus();
    fireAndForgetTrack("home.quick_action", { action: "study_tools" });
  });
}
if (homeRefreshMetricsBtnEl) {
  homeRefreshMetricsBtnEl.addEventListener("click", async () => {
    setHomeQuickStatus("Refreshing study outcomes...");
    try {
      await Promise.all([loadBillingStatus(), loadAnalyticsSummary(), loadLearningPlan({ force: true }), loadWorkspaceBrief({ force: true })]);
      updateHomeOutcomeMetrics();
      setHomeQuickStatus("Study outcomes updated.");
    } catch (e) {
      setHomeQuickStatus(`Could not refresh outcomes: ${e.message}`, true);
    }
  });
}
if (homeUpgradeBtnEl) {
  homeUpgradeBtnEl.addEventListener("click", () => {
    const state = loadPaywallPromptState();
    fireAndForgetTrack("billing.promo_click", { reason: state.lastReason || "manual" });
    startCheckout();
  });
}
if (homeUpgradeDismissEl) {
  homeUpgradeDismissEl.addEventListener("click", () => {
    dismissHomeUpgradePrompt();
  });
}

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
    lastTutorAnswerText = "";
    lastTutorAnswerCitations = [];
    if (tutorCopyBtn) tutorCopyBtn.disabled = true;
    if (tutorInsertBtn) tutorInsertBtn.disabled = true;
  });
}

if (sourcesRefreshBtn) sourcesRefreshBtn.addEventListener("click", () => renderSourcesManager());
if (sourcesFilterInputEl) {
  sourcesFilterInputEl.addEventListener("input", () => {
    renderSourcesManager();
  });
}
if (sourcesSortSelectEl) {
  sourcesSortSelectEl.addEventListener("change", () => {
    renderSourcesManager();
  });
}
if (sourcesCopyContextBtnEl) {
  sourcesCopyContextBtnEl.addEventListener("click", () => {
    copyVisibleSourceContextBundle().catch((e) => {
      setSourceStatus(`Copy failed: ${e.message}`, true);
    });
  });
}
if (sourcesClearBtn) {
  sourcesClearBtn.addEventListener("click", async () => {
    if (!confirm("Clear all sources attached to this note?")) return;
    const existing = loadSourcesForCurrentNote();
    await Promise.all(existing.map((row) => deleteSourceAssetBlob(String(row?.assetId || ""))));
    saveSourcesForCurrentNote([]);
    renderSourcesManager();
    renderLearningFeed();
    setSourceStatus("Cleared sources for this note.");
  });
}
if (studyWorkflowRecallBtn) {
  studyWorkflowRecallBtn.addEventListener("click", () => {
    runStudyWorkflow("recall").catch((e) => setStudyWorkflowStatus(`Workflow error: ${e.message}`, true));
  });
}
if (studyWorkflowExamBtn) {
  studyWorkflowExamBtn.addEventListener("click", () => {
    runStudyWorkflow("exam").catch((e) => setStudyWorkflowStatus(`Workflow error: ${e.message}`, true));
  });
}
if (studyWorkflowWeakBtn) {
  studyWorkflowWeakBtn.addEventListener("click", () => {
    runStudyWorkflow("weak").catch((e) => setStudyWorkflowStatus(`Workflow error: ${e.message}`, true));
  });
}

onboardingCloseEl.addEventListener("click", closeOnboarding);
onboardingOverlayEl.addEventListener("click", (e) => {
  if (e.target === onboardingOverlayEl) closeOnboarding();
});
onboardingStartEl.addEventListener("click", () => {
  closeOnboarding();
  setView("notes");
  setActiveTab("write");
  titleEl.focus();
});
onboardingStudyEl.addEventListener("click", () => {
  closeOnboarding();
  setView("study_tools");
});
onboardingEmailSaveEl.addEventListener("click", () => saveOnboardingEmail());
if (refreshLearningBtn) {
  refreshLearningBtn.addEventListener("click", () => {
    setLearningPlanSuppressed(false);
    loadLearningPlan({ force: true });
  });
}
if (clearLearningBtn) {
  clearLearningBtn.addEventListener("click", () => {
    if (!confirm("Clear Personalized Learning plan on this device?")) return;
    clearPersonalizedLearningPlan();
  });
}
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
if (themeSelectEl) {
  themeSelectEl.addEventListener("change", () => {
    const t = String(themeSelectEl.value || "clyde");
    applyTheme(t);
    saveTheme(t);
  });
}

window.addEventListener("popstate", () => {
  const fromUrl = readViewFromUrl() || "home";
  setView(fromUrl, { persist: false, updateUrl: false });
});

(async function init() {
  registerServiceWorker();
  await loadConfig();
  await loadMe();
  if (!me) {
    window.location.href = "/welcome.html";
    return;
  }
  await loadAccountProfile();
  try {
    const focusOn = localStorage.getItem(authScopedKey("focus_mode_v1")) === "1";
    if (focusOn) document.body.classList.add("focus-mode");
  } catch {}
  loadTheme();
  renderWorkspaceBrief();
  updateNoteFlowStatus({ message: "Draft mode" });
  setStudyWorkflowStatus("");
  const explicitView = readViewFromUrl();
  const savedView = readStoredView();
  const fromLoginPage = /\/login\.html(?:$|\?)/.test(String(document.referrer || ""));
  const initialView = explicitView || (fromLoginPage ? "home" : savedView || "home");
  setView(initialView, { persist: false, updateUrl: true, replaceHistory: true });
  setSourceFileSelection(SOURCE_UPLOAD_HINT);
  setChatAttachSelection(CHAT_UPLOAD_HINT);
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
  await loadWorkspaceBrief({ force: true }).catch(() => {});
  await loadDashboard();
  await loadReferralCode();
  flushFlashcardReviewQueue().catch(() => {});
  window.addEventListener("online", () => flushFlashcardReviewQueue().catch(() => {}));
  if (IS_NATIVE_SHELL) {
    // Store wrappers: avoid showing any purchase/upgrade CTAs or external billing portals.
    setHidden(subscribeBtn, true);
    setHidden(manageBtn, true);
    setHidden(cancelMembershipBtn, true);
    setHidden(upgradeLearningBtn, true);
    setHidden(upgradeSourcesBtn, true);
    setHidden(upgradeAiBtn, true);
  }
  // Keep safe area correct on resize/orientation changes (mobile Safari).
  window.addEventListener("resize", () => syncBottomAdSafeArea());
  renderView();
  if (!onboardingSeen()) openOnboarding();
  else if (!tutorialSeen()) openTutorial();
})();

subscribeBtn.addEventListener("click", () => startCheckout());
manageBtn.addEventListener("click", () => openPortal());
