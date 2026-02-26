/**
 * Pure-JS JSON file store — no native dependencies.
 * Drop-in replacement for better-sqlite3 for local persistence.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_PATH = path.join(__dirname, '..', 'notematica.db.json');

let _db = null;

function load() {
  if (_db) return _db;
  if (fs.existsSync(DB_PATH)) {
    try { _db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); return _db; } catch {}
  }
  _db = { notebooks: [], sources: [], messages: [], notes: [], profiles: [], sessions: [], _seq: {} };
  seed();
  save();
  return _db;
}

function save() {
  fs.writeFileSync(DB_PATH, JSON.stringify(_db, null, 2));
}

function nextId(table) {
  _db._seq[table] = (_db._seq[table] || 0) + 1;
  return _db._seq[table];
}

function now() { return new Date().toISOString(); }

function normalizeUsername(username) {
  return String(username || '').trim().toLowerCase();
}

function normalizeRole(role) {
  return role === 'owner' ? 'owner' : 'user';
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  if (!stored || !stored.includes(':')) return false;
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const test = crypto.scryptSync(password, salt, 64).toString('hex');
  const hashBuf = Buffer.from(hash, 'hex');
  const testBuf = Buffer.from(test, 'hex');
  if (hashBuf.length !== testBuf.length) return false;
  return crypto.timingSafeEqual(hashBuf, testBuf);
}

function hashToken(token) {
  return crypto.createHash('sha256').update(String(token)).digest('hex');
}

function seed() {
  const nbId = nextId('notebooks');
  _db.notebooks.push({ id: nbId, name: 'My Research', source_count: 1, created_at: now(), updated_at: now() });
  const srcId = nextId('sources');
  _db.sources.push({ id: srcId, notebook_id: nbId, name: 'Getting Started.txt', type: 'txt',
    content: 'Welcome to Notematica AI! Add your sources — PDFs, text, URLs, audio, or video — and start chatting with your content.',
    summary: 'Introduction and welcome guide for Notematica AI.', created_at: now() });
  _db.notes.push({ id: nextId('notes'), notebook_id: nbId, title: 'Welcome',
    body: 'This is your first note. You can add more from the Studio panel.', created_at: now() });
}

// ── Public API ─────────────────────────────────────────────────────────────

const db = {
  ensureShape() {
    load();
    if (!Array.isArray(_db.notebooks)) _db.notebooks = [];
    if (!Array.isArray(_db.sources)) _db.sources = [];
    if (!Array.isArray(_db.messages)) _db.messages = [];
    if (!Array.isArray(_db.notes)) _db.notes = [];
    if (!Array.isArray(_db.profiles)) _db.profiles = [];
    if (!Array.isArray(_db.sessions)) _db.sessions = [];
    if (!_db._seq || typeof _db._seq !== 'object') _db._seq = {};
    if (Array.isArray(_db.profiles) && _db.profiles.length > 0) {
      _db.profiles = _db.profiles.map(p => ({ ...p, role: normalizeRole(p.role) }));
      if (!_db.profiles.some(p => p.role === 'owner')) {
        const oldest = [..._db.profiles].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))[0];
        const idx = _db.profiles.findIndex(p => p.id === oldest.id);
        if (idx >= 0) _db.profiles[idx].role = 'owner';
      }
    }
    save();
  },

  // Profiles
  getProfiles() {
    load();
    if (!Array.isArray(_db.profiles)) {
      _db.profiles = [];
      save();
    }
    return _db.profiles
      .map(p => ({ id: p.id, username: p.username, role: normalizeRole(p.role), created_at: p.created_at, updated_at: p.updated_at }))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },
  getProfilePublic(id) {
    load();
    if (!Array.isArray(_db.profiles)) _db.profiles = [];
    const p = _db.profiles.find(x => x.id === +id);
    if (!p) return null;
    return { id: p.id, username: p.username, role: normalizeRole(p.role), created_at: p.created_at, updated_at: p.updated_at };
  },
  createProfile(username, password, role = 'user') {
    load();
    if (!Array.isArray(_db.profiles)) _db.profiles = [];
    const normalized = normalizeUsername(username);
    const exists = _db.profiles.some(p => normalizeUsername(p.username) === normalized);
    if (exists) return null;
    const profile = {
      id: nextId('profiles'),
      username: String(username).trim(),
      role: normalizeRole(role),
      password_hash: hashPassword(password),
      created_at: now(),
      updated_at: now()
    };
    _db.profiles.push(profile);
    save();
    return { id: profile.id, username: profile.username, role: profile.role, created_at: profile.created_at, updated_at: profile.updated_at };
  },
  updateOwnProfile(profileId, username) {
    load();
    if (!Array.isArray(_db.profiles)) _db.profiles = [];
    const profile = _db.profiles.find(p => p.id === +profileId);
    if (!profile) return { error: 'not_found' };

    const normalized = normalizeUsername(username);
    const exists = _db.profiles.some(p => p.id !== +profileId && normalizeUsername(p.username) === normalized);
    if (exists) return { error: 'duplicate' };

    profile.username = String(username).trim();
    profile.updated_at = now();
    save();
    return { id: profile.id, username: profile.username, role: normalizeRole(profile.role), created_at: profile.created_at, updated_at: profile.updated_at };
  },
  updateOwnProfilePassword(profileId, currentPassword, newPassword) {
    load();
    if (!Array.isArray(_db.profiles)) _db.profiles = [];
    const profile = _db.profiles.find(p => p.id === +profileId);
    if (!profile) return { error: 'not_found' };
    if (!verifyPassword(currentPassword, profile.password_hash)) return { error: 'bad_password' };

    profile.password_hash = hashPassword(newPassword);
    profile.updated_at = now();
    save();
    return { id: profile.id, username: profile.username, role: normalizeRole(profile.role), created_at: profile.created_at, updated_at: profile.updated_at };
  },
  deleteOwnProfile(profileId, password) {
    load();
    if (!Array.isArray(_db.profiles)) _db.profiles = [];
    const idx = _db.profiles.findIndex(p => p.id === +profileId);
    if (idx < 0) return { error: 'not_found' };
    if (!verifyPassword(password, _db.profiles[idx].password_hash)) return { error: 'bad_password' };
    const role = normalizeRole(_db.profiles[idx].role);
    const ownerCount = _db.profiles.filter(p => normalizeRole(p.role) === 'owner').length;
    if (role === 'owner' && ownerCount <= 1) return { error: 'last_owner' };
    const deletedProfileId = _db.profiles[idx].id;
    _db.profiles.splice(idx, 1);
    _db.sessions = _db.sessions.filter(s => s.profile_id !== deletedProfileId);
    save();
    return { success: true };
  },
  verifyProfileCredentials(username, password) {
    load();
    if (!Array.isArray(_db.profiles)) _db.profiles = [];
    const normalized = normalizeUsername(username);
    const profile = _db.profiles.find(p => normalizeUsername(p.username) === normalized);
    if (!profile) return null;
    if (!verifyPassword(password, profile.password_hash)) return null;
    return { id: profile.id, username: profile.username, role: normalizeRole(profile.role), created_at: profile.created_at, updated_at: profile.updated_at };
  },
  getProfileCount() {
    load();
    if (!Array.isArray(_db.profiles)) return 0;
    return _db.profiles.length;
  },
  createSession(profileId, ttlHours = 24 * 7) {
    load();
    if (!Array.isArray(_db.sessions)) _db.sessions = [];
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000).toISOString();
    const session = {
      id: nextId('sessions'),
      profile_id: +profileId,
      token_hash: hashToken(token),
      created_at: now(),
      expires_at: expiresAt
    };
    _db.sessions.push(session);
    save();
    return { token, expires_at: expiresAt };
  },
  getProfileByToken(token) {
    load();
    if (!Array.isArray(_db.sessions) || !Array.isArray(_db.profiles)) return null;
    const tokenHash = hashToken(token);
    const session = _db.sessions.find(s => s.token_hash === tokenHash);
    if (!session) return null;
    if (new Date(session.expires_at) <= new Date()) {
      _db.sessions = _db.sessions.filter(s => s.id !== session.id);
      save();
      return null;
    }
    const profile = _db.profiles.find(p => p.id === session.profile_id);
    if (!profile) return null;
    return { id: profile.id, username: profile.username, role: normalizeRole(profile.role), created_at: profile.created_at, updated_at: profile.updated_at };
  },
  revokeSession(token) {
    load();
    if (!Array.isArray(_db.sessions)) _db.sessions = [];
    const tokenHash = hashToken(token);
    const before = _db.sessions.length;
    _db.sessions = _db.sessions.filter(s => s.token_hash !== tokenHash);
    if (_db.sessions.length !== before) save();
  },

  // Notebooks
  getNotebooks() {
    const d = load();
    return d.notebooks.map(nb => ({
      ...nb,
      source_count: d.sources.filter(s => s.notebook_id === nb.id).length
    })).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  },
  getNotebook(id) {
    load(); return _db.notebooks.find(n => n.id === +id) || null;
  },
  createNotebook(name) {
    load();
    const nb = { id: nextId('notebooks'), name, source_count: 0, created_at: now(), updated_at: now() };
    _db.notebooks.push(nb); save(); return nb;
  },
  updateNotebook(id, name) {
    load();
    const nb = _db.notebooks.find(n => n.id === +id);
    if (!nb) return null;
    nb.name = name; nb.updated_at = now(); save(); return nb;
  },
  deleteNotebook(id) {
    load();
    _db.notebooks = _db.notebooks.filter(n => n.id !== +id);
    _db.sources  = _db.sources.filter(s => s.notebook_id !== +id);
    _db.messages = _db.messages.filter(m => m.notebook_id !== +id);
    _db.notes    = _db.notes.filter(n => n.notebook_id !== +id);
    save();
  },
  touchNotebook(id) {
    load();
    const nb = _db.notebooks.find(n => n.id === +id);
    if (nb) { nb.updated_at = now(); save(); }
  },

  // Sources
  getSources(notebookId) {
    load();
    return _db.sources
      .filter(s => s.notebook_id === +notebookId)
      .map(s => ({ id: s.id, notebook_id: s.notebook_id, name: s.name, type: s.type, summary: s.summary, created_at: s.created_at }))
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  },
  getSourcesWithContent(notebookId) {
    load();
    return _db.sources.filter(s => s.notebook_id === +notebookId);
  },
  createSource(notebookId, name, type, content, summary) {
    load();
    const src = { id: nextId('sources'), notebook_id: +notebookId, name, type, content, summary, created_at: now() };
    _db.sources.push(src); save();
    return { id: src.id, notebook_id: src.notebook_id, name: src.name, type: src.type, summary: src.summary, created_at: src.created_at };
  },
  deleteSource(notebookId, sourceId) {
    load();
    _db.sources = _db.sources.filter(s => !(s.id === +sourceId && s.notebook_id === +notebookId));
    save();
  },

  // Messages
  getMessages(notebookId) {
    load();
    return _db.messages.filter(m => m.notebook_id === +notebookId).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  },
  addMessage(notebookId, role, content) {
    load();
    const msg = { id: nextId('messages'), notebook_id: +notebookId, role, content, created_at: now() };
    _db.messages.push(msg); save(); return msg;
  },
  deleteMessages(notebookId) {
    load(); _db.messages = _db.messages.filter(m => m.notebook_id !== +notebookId); save();
  },

  // Notes
  getNotes(notebookId) {
    load();
    return _db.notes.filter(n => n.notebook_id === +notebookId).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },
  addNote(notebookId, title, body) {
    load();
    const note = { id: nextId('notes'), notebook_id: +notebookId, title, body, created_at: now() };
    _db.notes.push(note); save(); return note;
  },
  deleteNote(notebookId, noteId) {
    load(); _db.notes = _db.notes.filter(n => !(n.id === +noteId && n.notebook_id === +notebookId)); save();
  }
};

db.ensureShape();

module.exports = db;
