/**
 * fix-utf8.mjs — Batch fix double-encoded UTF-8 (Mojibake) in .jsx/.js files.
 *
 * Problem: UTF-8 bytes were read as Windows-1252 (CP1252) then re-encoded as UTF-8.
 * Solution: Map each char back to its CP1252 byte value, then decode as UTF-8.
 *
 * Usage: node fix-utf8.mjs [--dry-run]
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const DRY_RUN = process.argv.includes('--dry-run');
const TARGET_DIR = join(import.meta.dirname, 'src');
const EXTENSIONS = new Set(['.jsx', '.js']);

// CP1252 bytes 0x80-0x9F map to these Unicode code points (differs from Latin-1)
const CP1252_SPECIAL = {
  0x20AC: 0x80, // €
  0x201A: 0x82, // ‚
  0x0192: 0x83, // ƒ
  0x201E: 0x84, // „
  0x2026: 0x85, // …
  0x2020: 0x86, // †
  0x2021: 0x87, // ‡
  0x02C6: 0x88, // ˆ
  0x2030: 0x89, // ‰
  0x0160: 0x8A, // Š
  0x2039: 0x8B, // ‹
  0x0152: 0x8C, // Œ
  0x017D: 0x8E, // Ž
  0x2018: 0x91, // '
  0x2019: 0x92, // '
  0x201C: 0x93, // "
  0x201D: 0x94, // "
  0x2022: 0x95, // •
  0x2013: 0x96, // –
  0x2014: 0x97, // —
  0x02DC: 0x98, // ˜
  0x2122: 0x99, // ™
  0x0161: 0x9A, // š
  0x203A: 0x9B, // ›
  0x0153: 0x9C, // œ
  0x017E: 0x9E, // ž
  0x0178: 0x9F, // Ÿ
};

/** Convert a Unicode char back to its CP1252 byte value, or -1 if impossible */
function charToCp1252Byte(ch) {
  const cp = ch.codePointAt(0);
  if (cp < 0x80) return cp;          // ASCII: same
  if (cp <= 0xFF) return cp;          // Latin-1 range: same byte value
  return CP1252_SPECIAL[cp] ?? -1;    // CP1252 special or unknown
}

/** Check if a byte value is a valid UTF-8 continuation byte (10xxxxxx) */
function isContinuation(b) {
  return (b & 0xC0) === 0x80;  // 0x80..0xBF
}

function fixDoubleEncoding(content) {
  const chars = [...content]; // spread to handle surrogate pairs
  const result = [];
  let i = 0;

  while (i < chars.length) {
    const b0 = charToCp1252Byte(chars[i]);

    // Try to detect a double-encoded UTF-8 sequence
    if (b0 >= 0xC0 && b0 <= 0xDF && i + 1 < chars.length) {
      // 2-byte UTF-8: 110xxxxx 10xxxxxx
      const b1 = charToCp1252Byte(chars[i + 1]);
      if (b1 !== -1 && isContinuation(b1)) {
        const decoded = Buffer.from([b0, b1]).toString('utf8');
        if (!decoded.includes('\uFFFD') && decoded.length === 1) {
          result.push(decoded);
          i += 2;
          continue;
        }
      }
    } else if (b0 >= 0xE0 && b0 <= 0xEF && i + 2 < chars.length) {
      // 3-byte UTF-8: 1110xxxx 10xxxxxx 10xxxxxx
      const b1 = charToCp1252Byte(chars[i + 1]);
      const b2 = charToCp1252Byte(chars[i + 2]);
      if (b1 !== -1 && b2 !== -1 && isContinuation(b1) && isContinuation(b2)) {
        const decoded = Buffer.from([b0, b1, b2]).toString('utf8');
        if (!decoded.includes('\uFFFD') && decoded.length === 1) {
          result.push(decoded);
          i += 3;
          continue;
        }
      }
    } else if (b0 >= 0xF0 && b0 <= 0xF7 && i + 3 < chars.length) {
      // 4-byte UTF-8: 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
      const b1 = charToCp1252Byte(chars[i + 1]);
      const b2 = charToCp1252Byte(chars[i + 2]);
      const b3 = charToCp1252Byte(chars[i + 3]);
      if (b1 !== -1 && b2 !== -1 && b3 !== -1 &&
          isContinuation(b1) && isContinuation(b2) && isContinuation(b3)) {
        const decoded = Buffer.from([b0, b1, b2, b3]).toString('utf8');
        if (!decoded.includes('\uFFFD')) {
          result.push(decoded);
          i += 4;
          continue;
        }
      }
    }

    // Not a double-encoded sequence, keep as-is
    result.push(chars[i]);
    i++;
  }

  return result.join('');
}

function walkDir(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    try {
      const stat = statSync(full);
      if (stat.isDirectory() && entry !== 'node_modules' && entry !== '.git') {
        walkDir(full, files);
      } else if (stat.isFile() && EXTENSIONS.has(extname(entry))) {
        files.push(full);
      }
    } catch { /* skip */ }
  }
  return files;
}

// Main
const files = walkDir(TARGET_DIR);
let fixedCount = 0;

for (const file of files) {
  const original = readFileSync(file, 'utf-8');
  const fixed = fixDoubleEncoding(original);

  if (fixed !== original) {
    fixedCount++;
    const relPath = file.replace(TARGET_DIR, 'src');
    if (DRY_RUN) {
      console.log(`[DRY-RUN] Would fix: ${relPath}`);
    } else {
      writeFileSync(file, fixed, 'utf-8');
      console.log(`[FIXED] ${relPath}`);
    }
  }
}

console.log(`\nDone! Fixed ${fixedCount}/${files.length} files.`);
if (DRY_RUN) console.log('(Dry run - no files were modified)');
