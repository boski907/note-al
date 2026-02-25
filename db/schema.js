/**
 * Pure-JS JSON file store — no native dependencies.
 * Drop-in replacement for better-sqlite3 for local persistence.
 */
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'notematica.db.json');

let _db = null;

function load() {
  if (_db) return _db;
  if (fs.existsSync(DB_PATH)) {
    try { _db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); return _db; } catch {}
  }
  _db = { notebooks: [], sources: [], messages: [], notes: [], _seq: {} };
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

module.exports = db;
