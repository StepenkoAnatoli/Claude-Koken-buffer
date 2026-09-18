'use strict';

const fs = require('fs');
const path = require('path');
const fm = require('./fm');

const SPEC = 'koken-bus/1';
const ROOT = path.resolve(__dirname, '..', '..');
const BUS = path.join(ROOT, 'bus');
const MODULES_FILE = path.join(BUS, 'modules.json');

/** intent = what the sender wants back. Closed set: the recipient must not guess. */
const INTENTS = {
  ask: 'A question. Expects an `answer`.',
  answer: 'A reply to an `ask`. Requires `re`.',
  propose: 'A concrete proposal to adopt something. Expects `review`, `accept`, or `reject`.',
  review: 'A critique of a named message. Requires `re`. Expects `revise` or a decision.',
  revise: 'A reworked version of an earlier message. Requires `re`.',
  handoff: 'Transfer of work with everything needed to continue. Expects `ack`.',
  decision: 'A ruling that binds later messages. Only `human` may send status `agreed`.',
  ack: 'Receipt confirmation, no new content.',
  note: 'Context for the record. Expects nothing.',
};

/** status = where the message is in its lifecycle. */
const STATUSES = {
  draft: 'Written but not routed. Ignored by `inbox`.',
  open: 'Routed and awaiting the recipient. Shows in `inbox`.',
  answered: 'The recipient replied; the reply carries `re`.',
  agreed: 'Binding on later messages. `human` only.',
  superseded: 'Replaced by a later message that names it in `re`.',
  rejected: 'Considered and declined; the reason lives in the reply.',
  archived: 'Handled and out of the working set.',
};

const TERMINAL = new Set(['agreed', 'superseded', 'rejected', 'archived']);
const REQUIRE_RE = new Set(['answer', 'review', 'revise']);

const DIRS = {
  threads: path.join(BUS, 'threads'),
  outbox: path.join(BUS, 'outbox'),
  inbox: path.join(BUS, 'inbox'),
  archive: path.join(BUS, 'archive'),
};

// ---------------------------------------------------------------- utilities

function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function loadModules() {
  const data = readJSON(MODULES_FILE);
  const map = new Map();
  for (const m of data.modules) map.set(m.id, m);
  return map;
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile() && entry.name.endsWith('.md')) out.push(full);
  }
  return out;
}

function rel(p) {
  return path.relative(ROOT, p).split(path.sep).join('/');
}

/** UTC to the second — sortable, timezone-free, stable in diffs. */
function nowStamp(date = new Date()) {
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

function slugify(text, max = 48) {
  const s = String(text)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  if (s.length <= max) return s || 'message';
  // Truncate at a word boundary so slugs stay readable.
  const cut = s.slice(0, max);
  const lastDash = cut.lastIndexOf('-');
  return (lastDash > max * 0.5 ? cut.slice(0, lastDash) : cut).replace(/-$/, '') || 'message';
}

function asList(value) {
  if (value === undefined || value === null || value === '') return [];
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  return String(value)
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

// ------------------------------------------------------------------- store

/**
 * A message lives in exactly ONE canonical file:
 *   bus/threads/<thread>/<nnn>-<from>-to-<to>-<slug>.md
 * `inbox/` and `outbox/` hold relative-path pointers, so a message is never
 * duplicated and two copies can never drift apart.
 */
function load() {
  const modules = loadModules();
  const files = walk(DIRS.threads);
  const messages = [];

  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const { meta, body, errors } = fm.parse(text);
    const seq = Number.parseInt(path.basename(file).slice(0, 3), 10);
    messages.push({
      file,
      rel: rel(file),
      thread: path.basename(path.dirname(file)),
      seq: Number.isNaN(seq) ? 0 : seq,
      meta,
      body,
      parseErrors: errors,
    });
  }

  messages.sort((a, b) => {
    const d = String(a.meta.date || '').localeCompare(String(b.meta.date || ''));
    if (d !== 0) return d;
    if (a.thread !== b.thread) return a.thread.localeCompare(b.thread);
    return a.seq - b.seq;
  });

  return { modules, messages };
}

function byId(messages) {
  const map = new Map();
  for (const m of messages) if (m.meta.id) map.set(String(m.meta.id), m);
  return map;
}

function threadDir(thread) {
  return path.join(DIRS.threads, thread);
}

function nextSeq(thread) {
  const dir = threadDir(thread);
  if (!fs.existsSync(dir)) return 1;
  let max = 0;
  for (const name of fs.readdirSync(dir)) {
    const n = Number.parseInt(name.slice(0, 3), 10);
    if (!Number.isNaN(n) && n > max) max = n;
  }
  return max + 1;
}

function makeId(thread, seq, from) {
  return `${thread}.${String(seq).padStart(3, '0')}.${from}`;
}

function pointerPath(kind, module, message) {
  const base = path.basename(message.file, '.md');
  return path.join(DIRS[kind], module, `${base}.ptr`);
}

function writePointer(kind, module, message) {
  const p = pointerPath(kind, module, message);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, `${message.rel}\n`, 'utf8');
  return p;
}

function clearPointers(message) {
  const removed = [];
  for (const kind of ['inbox', 'outbox']) {
    const root = DIRS[kind];
    if (!fs.existsSync(root)) continue;
    for (const module of fs.readdirSync(root)) {
      const p = pointerPath(kind, module, message);
      if (fs.existsSync(p)) {
        fs.unlinkSync(p);
        removed.push(rel(p));
      }
    }
  }
  return removed;
}

function readPointers(kind, module) {
  const dir = path.join(DIRS[kind], module);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.ptr'))
    .map((f) => {
      const target = fs.readFileSync(path.join(dir, f), 'utf8').trim();
      return { pointer: path.join(dir, f), target, exists: fs.existsSync(path.join(ROOT, target)) };
    });
}

function writeMessage(message) {
  fs.mkdirSync(path.dirname(message.file), { recursive: true });
  fs.writeFileSync(message.file, fm.serialize(message.meta, message.body), 'utf8');
}

function setStatus(message, status) {
  message.meta.status = status;
  writeMessage(message);
}

module.exports = {
  SPEC,
  ROOT,
  BUS,
  DIRS,
  INTENTS,
  STATUSES,
  TERMINAL,
  REQUIRE_RE,
  MODULES_FILE,
  loadModules,
  load,
  byId,
  walk,
  rel,
  nowStamp,
  slugify,
  asList,
  threadDir,
  nextSeq,
  makeId,
  writeMessage,
  writePointer,
  clearPointers,
  readPointers,
  pointerPath,
  setStatus,
};
