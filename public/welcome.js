const cloudBadgeEl = document.getElementById("welcome-cloud-badge");
const welcomeMessageEl = document.getElementById("welcome-message");
const welcomeVideoEl = document.getElementById("welcome-demo-video");
const welcomeVideoStatusEl = document.getElementById("welcome-video-status");
const welcomeVideoOpenLinkEl = document.getElementById("welcome-video-open-link");
const welcomeVideoDownloadLinkEl = document.getElementById("welcome-video-download-link");

let token = localStorage.getItem("ai_notes_token") || "";
const welcomeVideoSources = [
  "/media/welcome-classroom-v3.mp4?v=3",
  "/media/welcome-classroom-v2.mp4?v=2",
  "/media/welcome-classroom-v1.mp4?v=1"
];
let activeWelcomeVideoIndex = 0;

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("/sw.js").catch(() => {});
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
  if (!res.ok) throw new Error(data.error || `${res.status} ${res.statusText}`);
  return data;
}

function setWelcomeMessage() {
  if (!welcomeMessageEl) return;
  const hour = new Date().getHours();
  let greeting = "Ready to study smarter today?";
  if (hour < 12) greeting = "Good morning. Ready to start your study session?";
  else if (hour < 18) greeting = "Good afternoon. Let's make progress on your classes.";
  else greeting = "Good evening. Keep your momentum with one focused study block.";
  welcomeMessageEl.textContent = greeting;
}

function setVideoStatus(msg, isError = false) {
  if (!welcomeVideoStatusEl) return;
  welcomeVideoStatusEl.textContent = msg;
  welcomeVideoStatusEl.style.color = isError ? "#b91c1c" : "";
}

function setWelcomeVideoSource(index) {
  if (!welcomeVideoEl) return;
  if (index < 0 || index >= welcomeVideoSources.length) return;
  activeWelcomeVideoIndex = index;
  const src = welcomeVideoSources[index];
  welcomeVideoEl.src = src;
  welcomeVideoEl.load();
  if (welcomeVideoOpenLinkEl) welcomeVideoOpenLinkEl.href = src;
  if (welcomeVideoDownloadLinkEl) welcomeVideoDownloadLinkEl.href = src;
}

function initWelcomeVideoFallback() {
  if (!welcomeVideoEl) return;

  setWelcomeVideoSource(0);

  welcomeVideoEl.addEventListener("loadeddata", () => {
    setVideoStatus("Demo video ready.");
  });

  welcomeVideoEl.addEventListener("error", () => {
    const next = activeWelcomeVideoIndex + 1;
    if (next < welcomeVideoSources.length) {
      setVideoStatus("Trying another compatible video version...");
      setWelcomeVideoSource(next);
      return;
    }
    setVideoStatus("Playback failed in this browser. Use the Open video button.", true);
  });
}

async function loadConfig() {
  if (!cloudBadgeEl) return;
  try {
    const cfg = await api("/api/config", { method: "GET" });
    cloudBadgeEl.textContent = cfg.cloudSync ? "Supabase cloud sync" : "Local mode";
    cloudBadgeEl.style.borderColor = cfg.cloudSync ? "#0284c7" : "#84cc16";
    cloudBadgeEl.style.background = cfg.cloudSync ? "#e0f2fe" : "#ecfccb";
    cloudBadgeEl.style.color = cfg.cloudSync ? "#075985" : "#365314";
  } catch {
    cloudBadgeEl.textContent = "Config unavailable";
  }
}

async function checkExistingSession() {
  if (!token) return;
  try {
    await api("/api/auth/me", { method: "GET" });
    window.location.href = "/";
  } catch {
    localStorage.removeItem("ai_notes_token");
    token = "";
  }
}

(async function init() {
  registerServiceWorker();
  setWelcomeMessage();
  initWelcomeVideoFallback();
  await loadConfig();
  await checkExistingSession();
})();
