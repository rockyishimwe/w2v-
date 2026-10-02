/**
 * Translation audit.
 *
 * Lists every key passed to `t(...)` across the app and reports the ones
 * missing from the Kinyarwanda or French dictionaries. Run it after adding
 * UI copy:  node scripts/i18n-audit.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const SRC = "src";

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (
      /\.tsx?$/.test(full) &&
      !full.includes(`${path.sep}i18n${path.sep}`)
    )
      out.push(full);
  }
  return out;
}

const KEY_PATTERN = /\bt\(\s*\n?\s*"((?:[^"\\]|\\.)*)"/g;

const used = new Map();
for (const file of walk(SRC)) {
  const source = fs.readFileSync(file, "utf8");
  for (const match of source.matchAll(KEY_PATTERN)) {
    const key = match[1].replace(/\\"/g, '"').replace(/\\'/g, "'");
    if (!used.has(key)) used.set(key, []);
    used.get(key).push(file);
  }
}

// The dictionaries are TypeScript; read the keys straight out of the source.
const dictSource = fs.readFileSync("src/i18n/dictionaries.ts", "utf8");
function keysOf(name) {
  const start = dictSource.indexOf(`const ${name}: Dictionary = {`);
  if (start === -1) return new Set();
  const end = dictSource.indexOf("\n};", start);
  const body = dictSource.slice(start, end);
  const keys = new Set();
  for (const match of body.matchAll(
    /^\s{2}(?:"((?:[^"\\]|\\.)*)"|([A-Za-z_$][\w$]*)):/gm,
  )) {
    keys.add((match[1] ?? match[2]).replace(/\\"/g, '"'));
  }
  return keys;
}

const tables = { rw: keysOf("rw"), fr: keysOf("fr") };
let missingTotal = 0;

for (const [locale, keys] of Object.entries(tables)) {
  const missing = [...used.keys()].filter((key) => !keys.has(key));
  missingTotal += missing.length;
  console.log(`\n${locale}: ${keys.size} entries, ${missing.length} missing`);
  for (const key of missing) console.log(`  · ${key}`);
}

const unused = [...tables.rw].filter((key) => !used.has(key));
if (unused.length) {
  console.log(`\nIn the dictionary but never used (${unused.length}):`);
  for (const key of unused) console.log(`  · ${key}`);
}

console.log(`\n${used.size} keys in use across the app.`);
process.exitCode = missingTotal > 0 ? 1 : 0;

export { used, tables, pathToFileURL };
