const emailEl = document.getElementById("auth-email");
const passwordEl = document.getElementById("auth-password");
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const authStatusEl = document.getElementById("auth-status");
const cloudBadgeEl = document.getElementById("cloud-badge");

let token = localStorage.getItem("ai_notes_token") || "";

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("/sw.js").catch(() => {});
}

function setStatus(msg, isError = false) {
  authStatusEl.textContent = msg;
  authStatusEl.style.color = isError ? "#b91c1c" : "#0f172a";
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
    throw new Error(data.error || `${res.status} ${res.statusText}`);
  }
  return data;
}

async function loadConfig() {
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

async function login() {
  try {
    const data = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: emailEl.value,
        password: passwordEl.value
      })
    });
    const hasSession = Boolean(data?.auth?.hasSession || data?.token);
    if (!hasSession) {
      setStatus("Sign-in completed but no session cookie was set.", true);
      return;
    }
    const accessToken = String(data?.token || "").trim();
    if (accessToken) {
      token = accessToken;
      localStorage.setItem("ai_notes_token", accessToken);
    } else {
      token = "__cookie__";
      localStorage.removeItem("ai_notes_token");
    }
    window.location.href = "/";
  } catch (e) {
    setStatus(e.message, true);
  }
}

async function register() {
  try {
    const data = await api("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: emailEl.value,
        password: passwordEl.value
      })
    });
    const hasSession = Boolean(data?.auth?.hasSession || data?.token);
    if (hasSession) {
      const accessToken = String(data?.token || "").trim();
      if (accessToken) {
        token = accessToken;
        localStorage.setItem("ai_notes_token", accessToken);
      } else {
        token = "__cookie__";
        localStorage.removeItem("ai_notes_token");
      }
      window.location.href = "/";
      return;
    }
    setStatus(data.message || "Registered. Confirm your email if required.");
  } catch (e) {
    setStatus(e.message, true);
  }
}

async function checkExistingSession() {
  try {
    await api("/api/auth/me", { method: "GET" });
    token = "__cookie__";
    localStorage.removeItem("ai_notes_token");
    window.location.href = "/";
  } catch {
    localStorage.removeItem("ai_notes_token");
    token = "";
  }
}

loginBtn.addEventListener("click", login);
registerBtn.addEventListener("click", register);
passwordEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") login();
});

(async function init() {
  registerServiceWorker();
  await loadConfig();
  await checkExistingSession();
})();
