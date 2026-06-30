// bumpea el ?v=N de todos los scripts/css en index.html para forzar refresh sin ctrl+F5.
// uso:
//   node tools/bump-version.mjs          -> auto-incrementa (?v=2 -> ?v=3, etc.)
//   node tools/bump-version.mjs --set 7  -> fija un valor especifico

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HTML = path.resolve(__dirname, "..", "index.html");

const args = process.argv.slice(2);
const setIdx = args.indexOf("--set");
const forced = setIdx !== -1 ? parseInt(args[setIdx + 1], 10) : null;

const src = await fs.readFile(HTML, "utf8");
const matches = Array.from(src.matchAll(/\?v=(\d+)/g)).map(m => parseInt(m[1], 10));
if (!matches.length) {
  console.error("no encontre ningun ?v=N en index.html. agregalos manualmente la primera vez.");
  process.exit(1);
}
const current = Math.max(...matches);
const next = forced != null && !isNaN(forced) ? forced : current + 1;

const out = src.replace(/\?v=\d+/g, "?v=" + next);
await fs.writeFile(HTML, out);
console.log("version: " + current + " -> " + next + " (" + matches.length + " refs actualizadas)");
