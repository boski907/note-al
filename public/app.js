const authCardEl = document.getElementById("auth-card");
const workspaceEl = document.getElementById("workspace");
const emailEl = document.getElementById("auth-email");
const passwordEl = document.getElementById("auth-password");
const registerBtn = document.getElementById("register-btn");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const authStatusEl = document.getElementById("auth-status");
const cloudBadgeEl = document.getElementById("cloud-badge");
const subscribeBtn = document.getElementById("subscribe-btn");
const manageBtn = document.getElementById("manage-btn");
const billingStatusEl = document.getElementById("billing-status");

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
const formatButtons = [...document.querySelectorAll("[data-cmd]")];
const clearFormatBtn = document.getElementById("clear-format-btn");
const recordBtn = document.getElementById("record-btn");
const genCardsBtn = document.getElementById("gen-cards-btn");
const studyBtn = document.getElementById("study-btn");
const testprepBtn = document.getElementById("testprep-btn");

const overlayEl = document.getElementById("study-overlay");
const overlayTitleEl = document.getElementById("overlay-title");
const overlayBodyEl = document.getElementById("overlay-body");
const overlayCloseEl = document.getElementById("overlay-close");

const adBottomBarEl = document.getElementById("ad-bottom-bar");
const adBottomSlotEl = document.getElementById("ad-bottom-slot");

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

function escapeHtml(v) {
  return String(v)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
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
  } catch (e) {
    setBillingStatus(`Billing status error: ${e.message}`, true);
  }
}

async function startCheckout() {
  if (!token) return setBillingStatus("Log in first to subscribe.", true);
  setBillingStatus("Opening checkout...");
  try {
    const data = await api("/api/billing/create-checkout-session", { method: "POST" });
    if (!data.url) throw new Error("Missing checkout url");
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
    window.location.href = data.url;
  } catch (e) {
    setBillingStatus(`Portal error: ${e.message}`, true);
  }
}

async function register() {
  try {
    const email = emailEl.value;
    const password = passwordEl.value;
    const data = await api("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
    token = data.token;
    me = data.user;
    localStorage.setItem("ai_notes_token", token);
    setAuthStatus(`Registered as ${me.email}`);
    updateAuthUi();
    await loadNotes();
    await loadBillingStatus();
  } catch (err) {
    setAuthStatus(err.message, true);
  }
}

async function login() {
  try {
    const email = emailEl.value;
    const password = passwordEl.value;
    const data = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
    token = data.token;
    me = data.user;
    localStorage.setItem("ai_notes_token", token);
    setAuthStatus(`Logged in as ${me.email}`);
    updateAuthUi();
    await loadNotes();
    await loadBillingStatus();
  } catch (err) {
    setAuthStatus(err.message, true);
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
          idx += 1;
          reviewed += 1;
          showBack = false;
          if (idx >= cards.length) {
            overlayBodyEl.innerHTML = `<div class="muted">Done. You reviewed ${cards.length} cards.</div>`;
          } else {
            if (reviewed % 3 === 0) {
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

registerBtn.addEventListener("click", register);
loginBtn.addEventListener("click", login);
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

(async function init() {
  await loadConfig();
  await loadMe();
  updateAuthUi();
  if (me) {
    await loadNotes();
    await loadBillingStatus();
  } else {
    setAuthStatus("Sign in to start writing notes.");
  }
})();

subscribeBtn.addEventListener("click", () => startCheckout());
manageBtn.addEventListener("click", () => openPortal());
