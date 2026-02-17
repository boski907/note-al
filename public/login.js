const emailEl = document.getElementById("auth-email");
const passwordEl = document.getElementById("auth-password");
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const authStatusEl = document.getElementById("auth-status");
const cloudBadgeEl = document.getElementById("cloud-badge");

let token = localStorage.getItem("ai_notes_token") || "";

function setStatus(msg, isError = false) {
  authStatusEl.textContent = msg;
  authStatusEl.style.color = isError ? "#b91c1c" : "#0f172a";
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
    token = data.token;
    localStorage.setItem("ai_notes_token", token);
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
    token = data.token || "";
    if (token) {
      localStorage.setItem("ai_notes_token", token);
      window.location.href = "/";
      return;
    }
    setStatus(data.message || "Registered. Confirm your email if required.");
  } catch (e) {
    setStatus(e.message, true);
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

loginBtn.addEventListener("click", login);
registerBtn.addEventListener("click", register);
passwordEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") login();
});

(async function init() {
  await loadConfig();
  await checkExistingSession();
})();
