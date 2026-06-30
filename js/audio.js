// maneja todo el sonido. los efectos los genero con Web Audio (sin archivos),
// y los audiocuentos si son mp3 q el usuario agrega despues. si faltan, no pasa nada.

const Sound = (function () {
  let ctx = null;
  let muted = false;
  // cuando esta sonando el audicuento no quiero q el hover narre encima
  let storyMode = false;

  // el AudioContext hay q crearlo despues de q el usuario toque algo (politica del navegador)
  function ensureCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctx = new AC();
    }
    if (ctx && ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  // toca una notita simple. la uso como ladrilo para armar los efectos
  function beep(freq, start, dur, type, gainPeak) {
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type || "sine";
    osc.frequency.value = freq;
    const t0 = ctx.currentTime + start;
    // envolvente suave para q no suene feo/seco
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(gainPeak || 0.2, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  // sonidito de cuando ganas (sube tipo arpegio alegre)
  function success() {
    if (muted || !ensureCtx()) return;
    beep(523.25, 0, 0.16, "triangle", 0.25);   // do
    beep(659.25, 0.12, 0.16, "triangle", 0.25); // mi
    beep(783.99, 0.24, 0.28, "triangle", 0.25); // sol
  }

  // cuando se gana la insignia, algo un poco mas festivo
  function fanfare() {
    if (muted || !ensureCtx()) return;
    beep(523.25, 0, 0.15, "triangle", 0.25);
    beep(659.25, 0.13, 0.15, "triangle", 0.25);
    beep(783.99, 0.26, 0.15, "triangle", 0.25);
    beep(1046.5, 0.39, 0.4, "triangle", 0.28);
  }

  // "intenta de nuevo": suave, dos notas q bajan, nada agresvo
  function tryAgain() {
    if (muted || !ensureCtx()) return;
    beep(392, 0, 0.18, "sine", 0.16);
    beep(311.13, 0.14, 0.26, "sine", 0.16);
  }

  // clic de boton
  function click() {
    if (muted || !ensureCtx()) return;
    beep(440, 0, 0.06, "square", 0.08);
  }

  // tiquito suavecito al pasar el mouse por encima (bien bajito para q no canse)
  function hover() {
    if (muted || !ensureCtx()) return;
    beep(720, 0, 0.04, "sine", 0.04);
  }

  function toggleMute() {
    muted = !muted;
    // si silencia mientras esta narrando, tambien cortamos la voz (mp3 o TTS)
    if (muted) {
      if (currentAudio) { try { currentAudio.pause(); } catch (e) {} currentAudio = null; }
      if (hasSpeech()) window.speechSynthesis.cancel();
    }
    return muted;
  }
  function isMuted() { return muted; }

  // ----- Narracion (Web Speech API): para los audiocuentos
  // el navegador (Chrome/Edge/Brave/Firefox) ya trae voces en español; las usamos asi no
  // toca grabar mp3s. la voz se elige automatica al primer uso
  function hasSpeech() { return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window; }

  let chosenVoice = null;
  // damos puntaje a cada voz disponible y nos quedamos con la mas "humana".
  // las voces clasicas de Windows (Sabina, Helena, Raul) suenan robotcas y dan miedo a un niño.
  // las "Natural / Neural / Online" de Microsoft, las de Google (Chrome) y las de Apple
  // son neuronales y suenan mucho mas calidas
  function scoreVoice(v) {
    if (!v || !v.lang) return -1;
    const name = (v.name || "").toLowerCase();
    const lang = v.lang.toLowerCase();
    let s = 0;
    // idioma: español primero, dentro de eso latam suena mas amable
    if (lang.startsWith("es")) s += 50;
    else return -1; // si no es español, descartamos
    if (lang.startsWith("es-mx") || lang.startsWith("es-us") || lang.startsWith("es-419")) s += 8;
    else if (lang.startsWith("es-co") || lang.startsWith("es-ar") || lang.startsWith("es-cl")) s += 6;
    else if (lang.startsWith("es-es")) s += 4;
    // voces neuronales (suenan humanas): bonus grande
    if (/natural|neural|online/.test(name)) s += 40;
    // google (chrome) y apple suelen ser de buena calidad
    if (/google/.test(name)) s += 25;
    if (/(apple|siri)/.test(name)) s += 20;
    // nombres femeninos conocidos q tienden a sonar mejor para niños
    if (/(paulina|monica|mónica|sabina|helena|elvira|laura|dalia|ximena|jorge\b)/.test(name)) s += 8;
    if (/(female|mujer|woman)/.test(name)) s += 6;
    // penalizar voces masculinas (los niños responden mejor a femenina, suelen ser maternales)
    if (/(male|hombre|raul|raúl|pablo|diego|jorge)/.test(name)) s -= 12;
    // penalizamos las voces locales viejas de Microsoft (las clasicas son robtotcas)
    if (v.localService && /microsoft/.test(name) && !/natural|neural|online/.test(name)) s -= 10;
    return s;
  }

  function pickSpanishVoice() {
    if (!hasSpeech()) return null;
    if (chosenVoice) return chosenVoice;
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;
    // ordenamos por puntaje y tomamos la mejor en español
    const scored = voices
      .map(function (v) { return { v: v, s: scoreVoice(v) }; })
      .filter(function (x) { return x.s >= 0; })
      .sort(function (a, b) { return b.s - a.s; });
    if (scored.length) chosenVoice = scored[0].v;
    else chosenVoice = voices[0]; // fallback: lo q sea
    return chosenVoice;
  }
  // las voces a veces cargan async, asi q escuchamos el evento
  if (hasSpeech() && typeof window.speechSynthesis.onvoiceschanged !== "undefined") {
    window.speechSynthesis.onvoiceschanged = function () { chosenVoice = null; pickSpanishVoice(); };
  }

  // ----- mp3 pre-grabados (ElevenLabs)
  // si existe window.UI_AUDIO (cargado desde audio/ui/manifest.js) preferimos el mp3,
  // q suena mucho mejor q el TTS del navegador. si falta el texto, fallback a TTS.
  let currentAudio = null;
  function manifestFor(text) {
    if (!text || !window.UI_AUDIO) return null;
    return window.UI_AUDIO[text] || window.UI_AUDIO[String(text).trim()] || null;
  }
  function stopCurrentAudio() {
    if (currentAudio) {
      try { currentAudio.pause(); } catch (e) {}
      currentAudio.onended = null;
      currentAudio.onerror = null;
      currentAudio.onplay = null;
      currentAudio = null;
    }
  }

  // habla un texto. opts: { rate, pitch, onend, onstart, onerror }
  function speak(text, opts) {
    if (muted || !text) return null;
    // siempre cortamos lo anterior (mp3 o TTS) para no apilar voces
    stopCurrentAudio();
    if (hasSpeech()) window.speechSynthesis.cancel();

    const mp3 = manifestFor(text);
    if (mp3) {
      const a = new Audio(mp3);
      currentAudio = a;
      a.volume = 1;
      // usamos las propiedades directas (no addEventListener) asi stopCurrentAudio
      // puede limpiarlas con = null y NO disparar onend cuando el audio se corta a la fuerza
      a.onplay = function () { if (opts && opts.onstart) opts.onstart(); };
      a.onended = function () {
        if (currentAudio === a) currentAudio = null;
        if (opts && opts.onend) opts.onend();
      };
      a.onerror = function () {
        if (currentAudio === a) currentAudio = null;
        // si falla el mp3 (archivo corrupto, etc.) intentamos TTS como ultimo recurso
        if (hasSpeech()) ttsSpeak(text, opts);
        else if (opts && opts.onerror) opts.onerror();
      };
      const p = a.play();
      if (p && typeof p.catch === "function") p.catch(function () { /* el error handler lo agarra */ });
      return a;
    }

    if (!hasSpeech()) return null;
    return ttsSpeak(text, opts);
  }

  // hablar usando Web Speech (fallback / sin mp3)
  function ttsSpeak(text, opts) {
    const u = new SpeechSynthesisUtterance(text);
    const v = pickSpanishVoice();
    if (v) u.voice = v;
    u.lang = (v && v.lang) || "es-ES";
    const isNeural = v && /natural|neural|online|google|apple|siri/i.test(v.name || "");
    const defaultRate = isNeural ? 0.95 : 0.92;
    const defaultPitch = isNeural ? 1.05 : 1.15;
    u.rate = (opts && typeof opts.rate === "number") ? opts.rate : defaultRate;
    u.pitch = (opts && typeof opts.pitch === "number") ? opts.pitch : defaultPitch;
    u.volume = 1;
    if (opts && opts.onend) u.onend = opts.onend;
    if (opts && opts.onstart) u.onstart = opts.onstart;
    if (opts && opts.onerror) u.onerror = opts.onerror;
    window.speechSynthesis.speak(u);
    return u;
  }

  function speakPause() {
    if (currentAudio && !currentAudio.paused) { currentAudio.pause(); return; }
    if (hasSpeech() && window.speechSynthesis.speaking) window.speechSynthesis.pause();
  }
  function speakResume() {
    if (currentAudio && currentAudio.paused) { currentAudio.play().catch(function () {}); return; }
    if (hasSpeech() && window.speechSynthesis.paused) window.speechSynthesis.resume();
  }
  function speakStop() {
    stopCurrentAudio();
    if (hasSpeech()) window.speechSynthesis.cancel();
  }
  function isSpeaking() {
    if (currentAudio && !currentAudio.paused && !currentAudio.ended) return true;
    return hasSpeech() && window.speechSynthesis.speaking;
  }
  function isPausedSpeak() {
    if (currentAudio && currentAudio.paused && currentAudio.currentTime > 0 && !currentAudio.ended) return true;
    return hasSpeech() && window.speechSynthesis.paused;
  }

  // narracion para UI (instrucciones, opciones, hover). respeta el modo cuento:
  // si esta sonando el audiocuento, no interrumpe
  function narrate(text, opts) {
    if (storyMode) return null;
    return speak(text, opts);
  }
  function setStoryMode(on) {
    storyMode = !!on;
    // si entra en modo cuento, paro cualquier narracion de UI q estuviera sonando
    if (storyMode) {
      if (currentAudio) { try { currentAudio.pause(); } catch (e) {} currentAudio = null; }
      if (hasSpeech()) window.speechSynthesis.cancel();
    }
  }
  function isStoryMode() { return storyMode; }

  return {
    success, fanfare, tryAgain, click, hover, toggleMute, isMuted, ensureCtx,
    speak, speakPause, speakResume, speakStop, isSpeaking, isPausedSpeak, hasSpeech,
    narrate, setStoryMode, isStoryMode
  };
})();


// intenta cargar un mp3. devuelve el Audio si carga, o null si no existe.
// asi el engine sabe si mostrar el reproductor o el texto del cuento
function loadStoryAudio(src) {
  return new Promise(function (resolve) {
    const audio = new Audio();
    let done = false;
    function ok() { if (!done) { done = true; resolve(audio); } }
    function fail() { if (!done) { done = true; resolve(null); } }
    audio.addEventListener("canplaythrough", ok, { once: true });
    audio.addEventListener("error", fail, { once: true });
    // por si nunca dispara ningun evento (archivo raro), corto a los 3s
    setTimeout(fail, 3000);
    audio.preload = "auto";
    audio.src = src;
    audio.load();
  });
}
