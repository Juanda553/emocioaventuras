// genera mp3s para todos los textos narrables del juego usando ElevenLabs.
// uso:
//   PowerShell:
//     $env:ELEVENLABS_API_KEY="tu_clave"
//     $env:ELEVENLABS_VOICE_ID="EXAVITQu4vr4xnSDxMaL"  (opcional, default Sarah)
//     node tools/generate-audio.mjs
//   cmd:
//     set ELEVENLABS_API_KEY=tu_clave
//     set ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL
//     node tools/generate-audio.mjs
//
// salida: audio/ui/*.mp3 + audio/ui/manifest.js
// es idempotente: si el mp3 ya esta, lo salta. usa --force para regenerar todo

import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "audio", "ui");
const DATA_FILE = path.join(ROOT, "js", "data.js");

const API_KEY = process.env.ELEVENLABS_API_KEY;
// voice_ids publicos (sirven con cualquier cuenta). cambiar segun lo q te guste:
//   Sarah   EXAVITQu4vr4xnSDxMaL  (suave, neutral — default)
//   Alice   Xb7hH8MSUJpSbSDYk0k2  (calida, expresiva)
//   Charlotte XB0fDUnXU5powFXDhCwa (madura, dulce)
//   Lily    pFZP5JQG7iQjIQuC4Bku  (joven, cantarina)
//   Matilda XrExE9yKIg1WjnnlVkGX  (calma, cuenta cuentos)
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "EXAVITQu4vr4xnSDxMaL";
const MODEL_ID = process.env.ELEVENLABS_MODEL || "eleven_multilingual_v2";
const FORCE = process.argv.includes("--force");
const DRY = process.argv.includes("--dry-run");

if (!API_KEY && !DRY) {
  console.error("Falta ELEVENLABS_API_KEY. Defini tu clave en la variable de entorno.");
  process.exit(1);
}

function hashText(t) {
  return crypto.createHash("sha1").update(t).digest("hex").slice(0, 10);
}

async function loadGame() {
  const src = await fs.readFile(DATA_FILE, "utf8");
  const m = src.match(/const GAME = ([\s\S]*?);\s*$/m);
  if (!m) throw new Error("no encuentro GAME en data.js");
  // evaluamos el objeto literal — confiamos en el contenido del repo
  return eval("(" + m[1] + ")");
}

// junta los textos criticos: solo lo q necesita un niño q no lee.
// se OMITE lo decorativo (titulos de pantalla, mapa, HUD, caritas, islas, etc.)
function collectTexts(GAME) {
  const out = new Set();
  GAME.worlds.forEach(function (w) {
    if (w.name) out.add(w.name); // nombre del mundo, se narra al hover en la isla
    if (w.intro) out.add(w.intro);
    if (w.reward) out.add(w.reward);
    if (w.introButton) out.add(w.introButton); // "Comenzar misión", "Leer el cuento"
    w.challenges.forEach(function (c) {
      if (c.instruction) out.add(c.instruction);
      if (c.question && c.question !== c.instruction) out.add(c.question);
      if (c.situation && c.situation !== c.instruction) out.add(c.situation);
      if (c.feedbackOk) out.add(c.feedbackOk);
      if (c.feedbackError) out.add(c.feedbackError);
      if (c.feedbackFinal && c.feedbackFinal !== c.feedbackOk) out.add(c.feedbackFinal);
      if (c.storyText) out.add(c.storyText);
      (c.options || []).forEach(function (o) { if (o.text) out.add(o.text); });
      (c.lights || []).forEach(function (l) {
        if (l.label) out.add(l.label); // texto visible del boton del semaforo: "PARAR", "PENSAR", "ACTUAR"
        if (l.title && l.text) out.add(l.title + ". " + l.text); // texto largo del modal
      });
      (c.questions || []).forEach(function (q) {
        if (q.question) out.add(q.question);
        (q.options || []).forEach(function (o) { if (o.text) out.add(o.text); });
      });
      (c.items || []).forEach(function (it) { if (it.text) out.add(it.text); });
    });
  });
  if (GAME.finalBadge) out.add("¡" + GAME.finalBadge + "!");

  // textos hardcoded en engine.js (botones de UI, mensajes de error fallback, feedback default)
  // estos NO viven en data.js pero el motor los muestra/narra, asi q los pre-grabamos tambien
  [
    // botones primarios
    "Siguiente reto",
    "Seguir intentando",
    "Continuar",
    "Ya escuché, continuar",
    "Volver al mapa",
    "Ver mi premio",
    "Jugar de nuevo",
    "Confirmar",
    "Entendido",
    "empezar",
    // mensajes de error/feedback default
    "¡Muy bien!",
    "Casi… revisa bien tu selección",
    "Mmm… esa no es. Inténtalo de nuevo",
    "Esa opción no ayuda mucho… prueba otra",
    "Piensa otra vez en la historia… ¿cuál será?",
    "Recuerda el semáforo: primero parar",
    "Esa va en la otra caja, mira bien",
    // narracion del menu principal y mapa
    "El reino de las emociones necesita tu ayuda",
    "Mapa del Reino"
  ].forEach(function (t) { out.add(t); });

  return Array.from(out);
}

async function tts(text) {
  const url = "https://api.elevenlabs.io/v1/text-to-speech/" + VOICE_ID;
  const body = {
    text: text,
    model_id: MODEL_ID,
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.35,
      use_speaker_boost: true
    }
  };
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": API_KEY,
      "Content-Type": "application/json",
      "Accept": "audio/mpeg"
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error("ElevenLabs " + res.status + ": " + errText);
  }
  return Buffer.from(await res.arrayBuffer());
}

async function fileExists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const GAME = await loadGame();
  const texts = collectTexts(GAME);
  const totalChars = texts.reduce(function (s, t) { return s + t.length; }, 0);
  console.log("textos a generar: " + texts.length);
  console.log("caracteres totales: " + totalChars);
  console.log("voz: " + VOICE_ID + " | modelo: " + MODEL_ID);
  if (DRY) {
    texts.forEach(function (t, i) {
      console.log("[" + (i + 1) + "] " + hashText(t) + ": " + t.slice(0, 70) + (t.length > 70 ? "..." : ""));
    });
    return;
  }

  const manifest = {};
  let made = 0, skipped = 0, failed = 0;
  for (let i = 0; i < texts.length; i++) {
    const text = texts[i];
    const id = hashText(text);
    const file = id + ".mp3";
    const filePath = path.join(OUT_DIR, file);

    const exists = await fileExists(filePath);
    if (exists && !FORCE) {
      manifest[text] = "audio/ui/" + file; // solo apuntamos si el archivo existe de verdad
      skipped++;
      console.log("[" + (i + 1) + "/" + texts.length + "] skip " + id);
      continue;
    }

    const preview = text.slice(0, 60).replace(/\s+/g, " ");
    console.log("[" + (i + 1) + "/" + texts.length + "] gen " + id + ': "' + preview + (text.length > 60 ? "..." : "") + '"');
    try {
      const buf = await tts(text);
      await fs.writeFile(filePath, buf);
      manifest[text] = "audio/ui/" + file;
      made++;
    } catch (e) {
      failed++;
      console.error("  ERROR: " + e.message);
      // si falla por auth, plan o rate-limit, mejor parar (no seguir gastando intentos)
      const status = (e.message.match(/ElevenLabs (\d+)/) || [])[1];
      if (status === "401" || status === "402" || status === "403" || status === "429") {
        console.error("  parando por error de auth/cuota/plan (" + status + ")");
        break;
      }
    }
    // un pequeño respiro entre llamadas
    await new Promise(function (r) { setTimeout(r, 250); });
  }

  const manifestPath = path.join(OUT_DIR, "manifest.js");
  const keys = Object.keys(manifest);
  if (keys.length === 0) {
    console.log("\nno se genero ningun mp3. NO escribo manifest.js (asi el juego sigue con TTS).");
  } else {
    const lines = [
      "// generado por tools/generate-audio.mjs — no editar a mano",
      "window.UI_AUDIO = " + JSON.stringify(manifest, null, 2) + ";"
    ];
    await fs.writeFile(manifestPath, lines.join("\n"));
    console.log("\nmanifest: " + manifestPath + " (" + keys.length + " entradas)");
  }
  console.log("nuevos: " + made + ", saltados: " + skipped + ", fallidos: " + failed);
}

main().catch(function (e) { console.error(e); process.exit(1); });
