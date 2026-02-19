const cloudBadgeEl = document.getElementById("welcome-cloud-badge");
const welcomeMessageEl = document.getElementById("welcome-message");

let token = localStorage.getItem("ai_notes_token") || "";

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
  await loadConfig();
  await checkExistingSession();
})();
