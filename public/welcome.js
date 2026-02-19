const cloudBadgeEl = document.getElementById("welcome-cloud-badge");
const welcomeMessageEl = document.getElementById("welcome-message");
const welcomeVideoEl = document.getElementById("welcome-demo-video");
const welcomeVideoFrameEl = document.getElementById("welcome-video-frame");
const welcomeVideoMenuEl = document.getElementById("welcome-video-menu");
const welcomeVideoOpenLinkEl = document.getElementById("welcome-video-open-link");
const welcomeVideoDownloadLinkEl = document.getElementById("welcome-video-download-link");

let token = localStorage.getItem("ai_notes_token") || "";
const welcomeVideoSources = [
  "/media/welcome-classroom-v3.mp4?v=3",
  "/media/welcome-classroom-v2.mp4?v=2",
  "/media/welcome-classroom-v1.mp4?v=1"
];
let activeWelcomeVideoIndex = 0;
let welcomeVideoProbeTimer = null;
let welcomeVideoMenuTimer = null;

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
  if (!welcomeVideoEl) return;
  welcomeVideoEl.title = msg;
  if (isError) console.warn(msg);
}

function clearVideoProbe() {
  if (!welcomeVideoProbeTimer) return;
  clearTimeout(welcomeVideoProbeTimer);
  welcomeVideoProbeTimer = null;
}

function clearVideoMenuTimer() {
  if (!welcomeVideoMenuTimer) return;
  clearTimeout(welcomeVideoMenuTimer);
  welcomeVideoMenuTimer = null;
}

function closeWelcomeVideoMenu() {
  if (!welcomeVideoMenuEl) return;
  welcomeVideoMenuEl.classList.add("hidden");
  clearVideoMenuTimer();
}

function openWelcomeVideoMenu() {
  if (!welcomeVideoMenuEl) return;
  welcomeVideoMenuEl.classList.remove("hidden");
  clearVideoMenuTimer();
  welcomeVideoMenuTimer = setTimeout(() => {
    closeWelcomeVideoMenu();
  }, 7000);
}

function tryNextWelcomeVideo(reason) {
  const next = activeWelcomeVideoIndex + 1;
  if (next < welcomeVideoSources.length) {
    setVideoStatus(`Switching video source (${reason})...`);
    setWelcomeVideoSource(next);
    return;
  }
  setVideoStatus("Playback failed in this browser. Use the Open video button.", true);
}

function armVideoProbe() {
  if (!welcomeVideoEl) return;
  clearVideoProbe();
  welcomeVideoProbeTimer = setTimeout(() => {
    if (!welcomeVideoEl) return;
    if (welcomeVideoEl.readyState >= 2) return;
    tryNextWelcomeVideo("compatibility fallback");
  }, 4500);
}

function setWelcomeVideoSource(index) {
  if (!welcomeVideoEl) return;
  if (index < 0 || index >= welcomeVideoSources.length) return;
  activeWelcomeVideoIndex = index;
  const src = welcomeVideoSources[index];
  welcomeVideoEl.src = src;
  welcomeVideoEl.load();
  setVideoStatus(`Loading demo video (${index + 1}/${welcomeVideoSources.length})...`);
  armVideoProbe();
  if (welcomeVideoOpenLinkEl) welcomeVideoOpenLinkEl.href = src;
  if (welcomeVideoDownloadLinkEl) welcomeVideoDownloadLinkEl.href = src;
}

function initWelcomeVideoFallback() {
  if (!welcomeVideoEl) return;

  setWelcomeVideoSource(0);

  welcomeVideoEl.addEventListener("loadeddata", () => {
    clearVideoProbe();
    setVideoStatus("Demo video ready.");
  });

  welcomeVideoEl.addEventListener("canplay", () => {
    clearVideoProbe();
    setVideoStatus("Demo video ready.");
  });

  welcomeVideoEl.addEventListener("stalled", () => {
    tryNextWelcomeVideo("stalled stream");
  });

  welcomeVideoEl.addEventListener("error", () => {
    clearVideoProbe();
    tryNextWelcomeVideo("decode error");
  });

  welcomeVideoEl.addEventListener("dblclick", (e) => {
    e.preventDefault();
    if (!welcomeVideoMenuEl) return;
    if (welcomeVideoMenuEl.classList.contains("hidden")) openWelcomeVideoMenu();
    else closeWelcomeVideoMenu();
  });

  document.addEventListener("click", (e) => {
    if (!welcomeVideoMenuEl || !welcomeVideoFrameEl) return;
    const target = e.target;
    if (target instanceof Node && welcomeVideoFrameEl.contains(target)) return;
    closeWelcomeVideoMenu();
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
