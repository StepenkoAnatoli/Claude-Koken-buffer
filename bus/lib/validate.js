'use strict';

const fs = require('fs');
const path = require('path');
const core = require('./core');

const ID_RE = /^[a-z0-9][a-z0-9-]*\.\d{3}\.[a-z0-9-]+$/;
const THREAD_RE = /^[a-z0-9][a-z0-9-]*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
const FILE_RE = /^\d{3}-[a-z0-9-]+-to-[a-z0-9-]+-.+\.md$/;

/**
 * Every rule the bus enforces. Each finding is {level, where, rule, message}.
 * `error`   -> the bus is inconsistent; fix before committing.
 * `warning` -> legal but probably not what you meant.
 */
function validate() {
  const findings = [];
  const { modules, messages } = core.load();
  const ids = core.byId(messages);
  const seen = new Map();

  const add = (level, where, rule, message) => findings.push({ level, where, rule, message });

  // ---- registry ----------------------------------------------------------
  for (const [id, m] of modules) {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) {
      add('error', 'bus/modules.json', 'module-id', `module id ${JSON.stringify(id)} must be lower-kebab`);
    }
    for (const field of ['name', 'kind', 'access', 'role']) {
      if (!m[field]) add('error', 'bus/modules.json', 'module-fields', `module "${id}" is missing "${field}"`);
    }
    if (m.kind && !['human', 'agent'].includes(m.kind)) {
      add('error', 'bus/modules.json', 'module-kind', `module "${id}" kind must be human|agent`);
    }
    if (m.access && !['repo', 'paste', 'mixed'].includes(m.access)) {
      add('error', 'bus/modules.json', 'module-access', `module "${id}" access must be repo|paste|mixed`);
    }
  }

  // ---- messages ----------------------------------------------------------
  for (const msg of messages) {
    const where = msg.rel;
    for (const e of msg.parseErrors) add('error', where, 'front-matter', e);
    if (msg.parseErrors.length) continue;

    const meta = msg.meta;

    if (meta.spec !== core.SPEC) {
      add('error', where, 'spec', `spec must be "${core.SPEC}", found ${JSON.stringify(meta.spec ?? null)}`);
    }

    for (const field of ['id', 'thread', 'from', 'to', 'date', 'intent', 'status', 'subject']) {
      if (meta[field] === undefined || meta[field] === '') {
        add('error', where, 'required-field', `missing required field "${field}"`);
      }
    }

    const id = String(meta.id || '');
    if (id) {
      if (!ID_RE.test(id)) {
        add('error', where, 'id-format', `id ${JSON.stringify(id)} must look like <thread>.<nnn>.<from>`);
      }
      if (seen.has(id)) add('error', where, 'id-unique', `duplicate id ${id} (also ${seen.get(id)})`);
      else seen.set(id, where);
    }

    if (meta.thread && !THREAD_RE.test(String(meta.thread))) {
      add('error', where, 'thread-format', `thread ${JSON.stringify(meta.thread)} must be lower-kebab`);
    }
    if (meta.thread && meta.thread !== msg.thread) {
      add('error', where, 'thread-path', `thread field "${meta.thread}" does not match folder "${msg.thread}"`);
    }

    if (meta.date && !DATE_RE.test(String(meta.date))) {
      add('error', where, 'date-format', `date ${JSON.stringify(meta.date)} must be UTC YYYY-MM-DDThh:mm:ssZ`);
    }

    // participants
    const parties = [
      ['from', core.asList(meta.from)],
      ['to', core.asList(meta.to)],
      ['cc', core.asList(meta.cc)],
      ['via', core.asList(meta.via)],
    ];
    for (const [field, list] of parties) {
      if (field === 'from' && list.length > 1) {
        add('error', where, 'from-single', '"from" must name exactly one module');
      }
      for (const party of list) {
        if (!modules.has(party)) {
          add('error', where, 'unknown-module', `"${field}" names unregistered module "${party}" — add it to bus/modules.json`);
        }
      }
    }
    const from = String(meta.from || '');
    if (from && core.asList(meta.to).includes(from)) {
      add('warning', where, 'self-send', `"${from}" is both sender and recipient`);
    }

    // intent / status vocabularies
    if (meta.intent && !Object.prototype.hasOwnProperty.call(core.INTENTS, meta.intent)) {
      add('error', where, 'intent-vocab', `unknown intent "${meta.intent}" — one of: ${Object.keys(core.INTENTS).join(', ')}`);
    }
    if (meta.status && !Object.prototype.hasOwnProperty.call(core.STATUSES, meta.status)) {
      add('error', where, 'status-vocab', `unknown status "${meta.status}" — one of: ${Object.keys(core.STATUSES).join(', ')}`);
    }

    // reply integrity
    const reList = core.asList(meta.re);
    if (core.REQUIRE_RE.has(String(meta.intent)) && reList.length === 0) {
      add('error', where, 're-required', `intent "${meta.intent}" must set "re" to the message it responds to`);
    }
    for (const ref of reList) {
      if (!ids.has(ref)) add('error', where, 're-resolves', `"re" names unknown message id "${ref}"`);
      else if (ref === id) add('error', where, 're-self', 'a message cannot reply to itself');
    }

    // authority
    if (meta.intent === 'decision' && meta.status === 'agreed' && from !== 'human') {
      add('error', where, 'decision-authority', 'only "human" may send a decision with status "agreed" — use status "propose"/"open" instead');
    }

    // evidence boundary of this repository, enforced mechanically
    if (meta.evidence !== undefined) {
      const ok = ['none', 'external', 'repository'];
      if (!ok.includes(String(meta.evidence))) {
        add('error', where, 'evidence-vocab', `evidence must be one of ${ok.join('|')}`);
      }
    }

    // artifacts must exist
    for (const artifact of core.asList(meta.artifacts)) {
      const target = path.join(core.ROOT, artifact);
      if (!fs.existsSync(target)) {
        add('error', where, 'artifact-exists', `artifacts names missing path "${artifact}"`);
      }
    }

    // filename ↔ front matter.
    // Constructed, not pattern-guessed: module ids and slugs both contain
    // hyphens, so any regex split of the filename is ambiguous. We build the
    // prefix the envelope implies and require the filename to carry it.
    const base = path.basename(msg.file);
    if (!FILE_RE.test(base)) {
      add('error', where, 'filename', 'filename must be <nnn>-<from>-to-<to>-<slug>.md');
    } else {
      const seq = base.slice(0, 3);
      const toList = core.asList(meta.to);
      if (from && toList.length) {
        // The filename records addressing AT SEND TIME and is never rewritten
        // (renaming would break every pointer and the id↔file correspondence).
        // `buffer route` may add recipients later, so any original recipient —
        // or the `all` marker — is a legal filename segment.
        const legal = [...toList, 'all'].map((t) => `${seq}-${from}-to-${t}-`);
        if (!legal.some((p) => base.startsWith(p))) {
          add(
            'error',
            where,
            'filename-parties',
            `filename must start with one of ${legal.map((p) => `"${p}"`).join(' / ')} (from "${from}")`,
          );
        }
      }
      if (id && !id.endsWith(`.${seq}.${from}`)) {
        add('error', where, 'filename-id', `filename sequence "${seq}" does not match id "${id}"`);
      }
    }

    if (!msg.body.trim()) {
      add('error', where, 'body-empty', 'message body is empty');
    }
  }

  // ---- routing pointers ---------------------------------------------------
  for (const kind of ['inbox', 'outbox']) {
    const root = core.DIRS[kind];
    if (!fs.existsSync(root)) continue;
    for (const module of fs.readdirSync(root)) {
      if (!fs.statSync(path.join(root, module)).isDirectory()) continue;
      if (!modules.has(module)) {
        add('error', `bus/${kind}/${module}`, 'pointer-module', `${kind} exists for unregistered module "${module}"`);
      }
      for (const ptr of core.readPointers(kind, module)) {
        if (!ptr.exists) {
          add('error', core.rel(ptr.pointer), 'pointer-dangling', `points at missing file "${ptr.target}"`);
        }
      }
    }
  }

  // every open message must be routed to each recipient's inbox
  for (const msg of messages) {
    if (msg.meta.status !== 'open') continue;
    for (const to of core.asList(msg.meta.to)) {
      if (!modules.has(to)) continue;
      if (!fs.existsSync(core.pointerPath('inbox', to, msg))) {
        add('warning', msg.rel, 'unrouted', `status is "open" but no inbox pointer for "${to}" — run: bus/buffer route ${msg.meta.id}`);
      }
    }
  }

  // archived/terminal messages must not linger in an inbox
  for (const msg of messages) {
    if (!core.TERMINAL.has(String(msg.meta.status))) continue;
    for (const to of core.asList(msg.meta.to)) {
      if (fs.existsSync(core.pointerPath('inbox', to, msg))) {
        add('warning', msg.rel, 'stale-inbox', `status is "${msg.meta.status}" but still in ${to}'s inbox — run: bus/buffer archive ${msg.meta.id}`);
      }
    }
  }

  return { findings, messages, modules };
}

module.exports = { validate, ID_RE, THREAD_RE, DATE_RE, FILE_RE };
