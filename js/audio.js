// maneja todo el sonido. los efectos los genero con Web Audio (sin archivos),
// y los audiocuentos si son mp3 q el usuario agrega despues. si faltan, no pasa nada.

const Sound = (function () {
  let ctx = null;
  let muted = false;

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
    // si silencia mientras esta narrando, tambien cortamos la voz
    if (muted && hasSpeech()) window.speechSynthesis.cancel();
    return muted;
  }
  function isMuted() { return muted; }

  // ----- Narracion (Web Speech API): para los audiocuentos
  // el navegador (Chrome/Edge/Brave/Firefox) ya trae voces en español; las usamos asi no
  // toca grabar mp3s. la voz se elige automatica al primer uso
  function hasSpeech() { return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window; }

  let chosenVoice = null;
  function pickSpanishVoice() {
    if (!hasSpeech()) return null;
    if (chosenVoice) return chosenVoice;
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;
    // preferimos español, primero femenina si la encontramos (suena mas calida para niños)
    const esVoices = voices.filter(function (v) { return v.lang && v.lang.toLowerCase().startsWith("es"); });
    const list = esVoices.length ? esVoices : voices;
    const female = list.find(function (v) { return /female|mujer|paulina|monica|helena|sabina|sofia|lucia|elena/i.test(v.name); });
    chosenVoice = female || list[0];
    return chosenVoice;
  }
  // las voces a veces cargan async, asi q escuchamos el evento
  if (hasSpeech() && typeof window.speechSynthesis.onvoiceschanged !== "undefined") {
    window.speechSynthesis.onvoiceschanged = function () { chosenVoice = null; pickSpanishVoice(); };
  }

  // habla un texto. opts: { rate, pitch, onend, onstart }
  function speak(text, opts) {
    if (muted || !hasSpeech() || !text) return null;
    // siempre cancelo antes — asi no se apilan utterances
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = pickSpanishVoice();
    if (v) u.voice = v;
    u.lang = (v && v.lang) || "es-ES";
    u.rate = (opts && typeof opts.rate === "number") ? opts.rate : 0.95; // un toque mas lento, los niños siguen mejor
    u.pitch = (opts && typeof opts.pitch === "number") ? opts.pitch : 1.05;
    u.volume = 1;
    if (opts && opts.onend) u.onend = opts.onend;
    if (opts && opts.onstart) u.onstart = opts.onstart;
    if (opts && opts.onerror) u.onerror = opts.onerror;
    window.speechSynthesis.speak(u);
    return u;
  }
  function speakPause() { if (hasSpeech() && window.speechSynthesis.speaking) window.speechSynthesis.pause(); }
  function speakResume() { if (hasSpeech() && window.speechSynthesis.paused) window.speechSynthesis.resume(); }
  function speakStop() { if (hasSpeech()) window.speechSynthesis.cancel(); }
  function isSpeaking() { return hasSpeech() && window.speechSynthesis.speaking; }
  function isPausedSpeak() { return hasSpeech() && window.speechSynthesis.paused; }

  return {
    success, fanfare, tryAgain, click, hover, toggleMute, isMuted, ensureCtx,
    speak, speakPause, speakResume, speakStop, isSpeaking, isPausedSpeak, hasSpeech
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
