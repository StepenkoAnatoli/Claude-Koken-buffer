'use strict';
/**
 * Front-matter parser/serializer for koken-bus/1 envelopes.
 *
 * Deliberately a STRICT SUBSET of YAML so that the bus needs no dependencies
 * and so that two different agents cannot disagree about what a file means:
 *
 *   key: scalar            -> string | boolean | (quoted string)
 *   key: [a, b, c]         -> array of strings
 *   key:                   -> empty string
 *
 * No nesting, no block lists, no multi-line values, no anchors, no comments.
 * Anything else is a hard parse error surfaced by `buffer validate`.
 */

const DELIM = '---';

/** Canonical field order — keeps git diffs stable across agents. */
const FIELD_ORDER = [
  'spec',
  'id',
  'thread',
  'from',
  'to',
  'via',
  'cc',
  'date',
  'intent',
  'status',
  're',
  'subject',
  'evidence',
  'artifacts',
  'labels',
  'reconstructed',
];

function parseScalar(raw) {
  const v = raw.trim();
  if (v === '') return '';
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (
    (v.startsWith('"') && v.endsWith('"') && v.length >= 2) ||
    (v.startsWith("'") && v.endsWith("'") && v.length >= 2)
  ) {
    return v.slice(1, -1);
  }
  if (v.startsWith('[') && v.endsWith(']')) {
    const inner = v.slice(1, -1).trim();
    if (inner === '') return [];
    return inner.split(',').map((part) => {
      const p = part.trim();
      if (
        (p.startsWith('"') && p.endsWith('"')) ||
        (p.startsWith("'") && p.endsWith("'"))
      ) {
        return p.slice(1, -1);
      }
      return p;
    });
  }
  return v;
}

function serializeScalar(value) {
  if (Array.isArray(value)) {
    return '[' + value.map((v) => String(v)).join(', ') + ']';
  }
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  const s = String(value);
  if (s === '') return '';
  // Quote when the value could be misread as structure.
  if (/^[[\]{}>|&*!%@`'"#-]/.test(s) || /:\s/.test(s)) {
    return '"' + s.replace(/"/g, '\\"') + '"';
  }
  return s;
}

/**
 * @returns {{meta: object, body: string, errors: string[]}}
 */
function parse(text) {
  const errors = [];
  const normalized = text.replace(/\r\n/g, '\n');
  const lines = normalized.split('\n');

  if (lines[0].trim() !== DELIM) {
    return {
      meta: {},
      body: normalized,
      errors: ['envelope must begin with a `---` front-matter delimiter on line 1'],
    };
  }

  let end = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trim() === DELIM) {
      end = i;
      break;
    }
  }
  if (end === -1) {
    return { meta: {}, body: normalized, errors: ['front matter is not closed by a `---` line'] };
  }

  const meta = {};
  for (let i = 1; i < end; i += 1) {
    const line = lines[i];
    if (line.trim() === '') continue;
    if (/^\s/.test(line)) {
      errors.push(`front matter line ${i + 1}: indentation is not allowed (no nested values)`);
      continue;
    }
    const idx = line.indexOf(':');
    if (idx === -1) {
      errors.push(`front matter line ${i + 1}: expected "key: value", got ${JSON.stringify(line)}`);
      continue;
    }
    const key = line.slice(0, idx).trim();
    if (!/^[a-z][a-z0-9_]*$/.test(key)) {
      errors.push(`front matter line ${i + 1}: invalid key ${JSON.stringify(key)} (use lower_snake)`);
      continue;
    }
    if (Object.prototype.hasOwnProperty.call(meta, key)) {
      errors.push(`front matter line ${i + 1}: duplicate key ${JSON.stringify(key)}`);
      continue;
    }
    meta[key] = parseScalar(line.slice(idx + 1));
  }

  const body = lines.slice(end + 1).join('\n').replace(/^\n+/, '');
  return { meta, body, errors };
}

function serialize(meta, body) {
  const keys = []
    .concat(FIELD_ORDER.filter((k) => Object.prototype.hasOwnProperty.call(meta, k)))
    .concat(Object.keys(meta).filter((k) => !FIELD_ORDER.includes(k)).sort());

  const out = [DELIM];
  for (const key of keys) {
    const value = meta[key];
    if (value === undefined || value === null) continue;
    if (Array.isArray(value) && value.length === 0) continue;
    out.push(`${key}: ${serializeScalar(value)}`);
  }
  out.push(DELIM, '');
  out.push(String(body).replace(/\r\n/g, '\n').replace(/\s*$/, ''));
  out.push('');
  return out.join('\n');
}

module.exports = { parse, serialize, FIELD_ORDER };
