// el motor del juego. es una maquina de estados q pinta una pantalla a la vez dentro de #app.
// no sabe nada del contenido: todo lo lee de GAME (data.js) y dibuja segun el "type" del reto.

const STORAGE_KEY = "emocioaventura.state";

let root = null;
let state = defaultState();
let solving = false; // candado: cuando un reto ya se resolvio, no dejo q sigan clickeando hasta avanzar

function defaultState() {
  return {
    seenStart: false,
    stars: 0,
    badges: [],            // nombres de insignias ganadas
    completedWorlds: [],   // ids de mundos terminados
    currentWorld: null,    // indice del mundo q se esta jugando
    currentChallenge: 0
  };
}

// ----------------------------------------------------------------- guardado
function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* nada, si no hay storage seguimos igual */ }
}
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) state = Object.assign(defaultState(), JSON.parse(raw));
  } catch (e) { /* si esta corrupto arrancamos limpio */ }
}
function resetProgress() {
  state = defaultState();
  // arrancamos limpios desde el menu de inicio: asi el niño vuelve a ver el dragoncito y el castillo
  save();
  renderStart();
}

// ----------------------------------------------------------------- arranque
function init() {
  root = document.getElementById("app");
  load();
  attachJuice();
  attachVoice();
  // musica suave de fondo. el archivo lo agrega la autora en audio/music/background.mp3;
  // si no esta, el Audio falla silencioso y el juego sigue igual.
  // el navegador bloquea autoplay hasta el primer click — esta funcion ya maneja el reintento
  Sound.startBgMusic("audio/music/sergequadrado-the-moon-song-113106.mp3");
  routeToCurrent();
}

// ----------------------------------------------------------------- narracion (TTS)
// los niños de 5-6 todavia no leen, asi q el juego se les lee solo:
// 1) al entrar a cada pantalla narramos la instruccion principal
// 2) al pasar el mouse por una opcion/boton/texto, narramos ese textito
// el audicuento usa Sound.setStoryMode(true) para q el hover no le pise la narracion

// hover solo en lo q importa: las opciones de respuesta, los botones grandes y las islas del mapa.
// caritas/hud/decorativos NO entran para no abrumar al niño con voces
const VOICE_SEL = ".OptionBtn,.ChoiceCard,.ClassifyItem,.Light,.PrimaryBtn,.StartCta,.Island.is-open,[data-voice]";

let hoveredVoiceEl = null;
let autoNarrateTimer = null;
// "generacion" de narracion: si arranca una nueva tanda, las anteriores se cancelan
let narrateGen = 0;
// mientras la auto-narracion suena, ignoramos el hover (asi no se corta la pregunta
// si el cursor cae sobre una respuesta al cargar la pantalla)
let autoNarrating = false;

function voiceTextOf(el) {
  if (!el) return "";
  const dv = el.getAttribute && el.getAttribute("data-voice");
  if (dv) return dv;
  // limpiamos el texto: una sola linea, sin espacios raros
  return (el.textContent || "").replace(/\s+/g, " ").trim();
}

function attachVoice() {
  // hover: solo en aparatos con mouse (en tablet/movil no aplica el hover)
  const canHover = window.matchMedia && window.matchMedia("(hover: hover)").matches;
  if (!canHover) return;
  // usamos pointermove (no pointerover) porq pointermove SOLO se dispara cuando el cursor
  // se mueve de verdad. asi al cargar una pantalla nueva, no se "narra solo" la opcion
  // q quedo bajo el cursor — y la auto-narracion de la pregunta puede sonar tranquila
  function checkHover(e) {
    if (Sound.isMuted() || Sound.isStoryMode() || autoNarrating) return;
    if (!e.target.closest) return;
    const el = e.target.closest(VOICE_SEL);
    if (el === hoveredVoiceEl) return;
    if (el && el.hasAttribute && el.hasAttribute("disabled")) { hoveredVoiceEl = null; return; }
    hoveredVoiceEl = el;
    if (!el) return;
    const txt = voiceTextOf(el);
    if (txt) Sound.narrate(txt);
  }
  document.addEventListener("pointermove", checkHover);
}

// narra la instruccion principal de la pantalla actual.
// junta el globo de la mascota + la pregunta + las opciones (para q en movil,
// donde no hay hover, el niño escuche todo sin tener q tocar).
// las caritas (pick-face) no se leen — son visuales, no tienen texto
function autoNarrateMain(extra) {
  if (Sound.isMuted() || Sound.isStoryMode()) return;
  const parts = [];
  if (extra) parts.push(extra);
  const bubble = document.querySelector(".Guide-bubble");
  if (bubble) parts.push(bubble.textContent.trim());
  const q = document.querySelector(".QuestionText");
  if (q) parts.push(q.textContent.trim());
  // opciones textuales dentro del reto (no aplica para pick-face porq son SVG)
  const optSel = ".ChallengeBody .OptionBtn, .ChallengeBody .ChoiceCard, .ChallengeBody .ClassifyItem, .ChallengeBody .Light";
  Array.prototype.forEach.call(document.querySelectorAll(optSel), function (n) {
    const t = (n.textContent || "").replace(/\s+/g, " ").trim();
    if (t) parts.push(t);
  });
  // quito repetidos
  const seen = {};
  const clean = parts.filter(function (p) { if (!p || seen[p]) return false; seen[p] = 1; return true; });
  if (!clean.length) return;
  schedulePartsNarrate(clean);
}

// arranca con un retrasito asi suena DESPUES del click y la pantalla ya pintada
function scheduleNarrate(text) {
  schedulePartsNarrate([text]);
}

function schedulePartsNarrate(parts) {
  if (autoNarrateTimer) { clearTimeout(autoNarrateTimer); autoNarrateTimer = null; }
  narrateGen++;
  autoNarrating = true;
  // tambien reseteamos el elemento "bajo el cursor" asi al terminar la cola, el primer
  // pointermove se considera entrada nueva y narra el elemento
  hoveredVoiceEl = null;
  const myGen = narrateGen;
  autoNarrateTimer = setTimeout(function () {
    autoNarrateTimer = null;
    narrateSequence(parts, 0, myGen);
  }, 380);
}

// reproduce parts[i], parts[i+1], ... encadenadas con onend.
// si otra narracion arranca, narrateGen cambia y esta cola se descarta sola
function narrateSequence(parts, i, myGen) {
  if (myGen !== narrateGen) return;
  if (i >= parts.length) {
    if (myGen === narrateGen) autoNarrating = false;
    return;
  }
  Sound.narrate(parts[i], {
    onend: function () {
      // pequeña pausa entre partes para q se respiren
      setTimeout(function () { narrateSequence(parts, i + 1, myGen); }, 120);
    }
  });
}

// feedback divertido para los niños: al tocar cualquier cosa interactiva sale un estallido
// de partículas de colores, y al pasar el mouse suena un tiquito suave
const JUICY_SELECTOR = ".PrimaryBtn,.IconBtn,.OptionBtn,.ChoiceCard,.FaceCard,.Island.is-open,.Light,.ClassifyItem,.ClassifyBox,.MapBuddy,.PlayBtn";
let lastHoverSound = 0;
function attachJuice() {
  document.addEventListener("pointerdown", function (e) {
    if (e.target.closest && e.target.closest(JUICY_SELECTOR)) popBurst(e.clientX, e.clientY);
  }, true);
  // el sonidito de hover solo en aparatos con mouse (en tablet no aplica)
  const canHover = window.matchMedia && window.matchMedia("(hover: hover)").matches;
  if (canHover) {
    document.addEventListener("pointerover", function (e) {
      if (!e.target.closest || !e.target.closest(JUICY_SELECTOR)) return;
      const now = (window.performance && performance.now) ? performance.now() : 0;
      if (now - lastHoverSound < 90) return; // no spamear el sonido
      lastHoverSound = now;
      Sound.hover();
    }, true);
  }
}

// estallido de confetitos chiquitos en el punto (x, y) de la pantalla
function popBurst(x, y) {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#FFC93C", "#FF5DA2", "#1FC8C8", "#6BCB77", "#FF8C42", "#7C6FF0"];
  const layer = document.createElement("div");
  layer.className = "PopBurst";
  layer.style.left = x + "px";
  layer.style.top = y + "px";
  let html = '<span class="PopRipple"></span>';
  for (let i = 0; i < 8; i++) {
    const ang = (i / 8) * Math.PI * 2 + Math.random();
    const dist = 34 + Math.random() * 16;
    html += `<span class="PopBit" style="--dx:${(Math.cos(ang) * dist).toFixed(0)}px; --dy:${(Math.sin(ang) * dist).toFixed(0)}px; background:${colors[i % colors.length]}"></span>`;
  }
  layer.innerHTML = html;
  document.body.appendChild(layer);
  setTimeout(function () { layer.remove(); }, 700);
}

// al abrir/recargar siempre arrancamos en el menu de inicio (pantalla home con castillo).
// el progreso queda guardado igual, el niño solo tiene q darle a "Comenzar aventura" para volver al mapa.
function routeToCurrent() {
  return renderStart();
}

function isWorldDone(id) { return state.completedWorlds.indexOf(id) !== -1; }
function allWorldsDone() { return state.completedWorlds.length >= GAME.worlds.length; }

// el mundo desbloqueado es el primero q no este completado
function firstUnlockedIndex() {
  for (let i = 0; i < GAME.worlds.length; i++) {
    if (!isWorldDone(GAME.worlds[i].id)) return i;
  }
  return GAME.worlds.length; // todos hechos
}

// pinta los colores del mundo activo en variables css
function applyPalette(world) {
  const r = document.documentElement;
  if (!world) {
    r.style.setProperty("--world-primary", "#7C6FF0");
    r.style.setProperty("--world-secondary", "#A99BFF");
    r.style.setProperty("--world-accent", "#FFD23F");
    r.style.setProperty("--world-bg", "#F3F1FF");
    return;
  }
  r.style.setProperty("--world-primary", world.palette.primary);
  r.style.setProperty("--world-secondary", world.palette.secondary);
  r.style.setProperty("--world-accent", world.palette.accent || world.palette.secondary);
  r.style.setProperty("--world-bg", world.palette.bg);
}

// ----------------------------------------------------------------- helpers ui
function esc(s) {
  return String(s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
  });
}

// barra de arriba con estrellas, mute y reinicio. va en casi todas las pantallas
function hud(showBack) {
  const muteIcon = Sound.isMuted() ? "bi-volume-mute-fill" : "bi-volume-up-fill";
  return `
    <div class="Hud">
      <div class="Hud-stars" aria-label="Estrellas">
        <i class="bi bi-star-fill"></i><span id="starCount">${state.stars}</span>
      </div>
      <div class="Hud-actions">
        ${showBack ? `<button class="btn IconBtn" id="backToMap" title="Volver al mapa"><i class="bi bi-map-fill"></i></button>` : ""}
        <button class="btn IconBtn" id="repeatBtn" title="Escuchar de nuevo"><i class="bi bi-volume-up-fill"></i></button>
        <button class="btn IconBtn" id="muteBtn" title="Silenciar"><i class="bi ${muteIcon}"></i></button>
        <button class="btn IconBtn" id="resetBtn" title="Reiniciar progreso"><i class="bi bi-arrow-counterclockwise"></i></button>
      </div>
    </div>`;
}

// engancha los botones del hud (se llama despues de pintar)
function wireHud() {
  const mute = document.getElementById("muteBtn");
  if (mute) mute.addEventListener("click", function () {
    const m = Sound.toggleMute();
    mute.querySelector("i").className = "bi " + (m ? "bi-volume-mute-fill" : "bi-volume-up-fill");
    // si silencia, tambien cancelo lo q estaba por narrarse
    if (m) {
      narrateGen++;
      autoNarrating = false;
      if (autoNarrateTimer) { clearTimeout(autoNarrateTimer); autoNarrateTimer = null; }
    }
  });
  const reset = document.getElementById("resetBtn");
  if (reset) reset.addEventListener("click", function () {
    Sound.click();
    if (confirm("¿Seguro que quieres reiniciar todo el progreso?")) resetProgress();
  });
  const back = document.getElementById("backToMap");
  if (back) back.addEventListener("click", function () { Sound.click(); state.currentWorld = null; save(); renderMap(); });
  const repeat = document.getElementById("repeatBtn");
  if (repeat) repeat.addEventListener("click", function () {
    Sound.ensureCtx(); Sound.click();
    autoNarrateMain();
  });
}

// boton grande estandar
function bigButton(id, text, icon) {
  return `<button class="btn PrimaryBtn" id="${id}">${icon ? `<i class="bi ${icon}"></i> ` : ""}${esc(text)}</button>`;
}

// la mascota guia del mundo diciendo algo en un globo de dialgo. la criatura cambia segun el mundo
function guideBubble(text, worldId, mood) {
  return `
    <div class="Guide">
      <div class="Guide-mascot">${drawWorldMascot(worldId || "joy", mood || "happy")}</div>
      <div class="Guide-bubble">${esc(text)}</div>
    </div>`;
}

// capa de escenario animado q va detras del contenido. si no hay mundo, pongo uno neutro
function sceneLayer(world) {
  return worldScene(world ? world.id : "default");
}

// celebracion de acierto: confeti q cae + una estrella q vuela al contador
function celebrate() {
  const wrap = document.createElement("div");
  wrap.innerHTML = confettiBurst(40);
  const node = wrap.firstElementChild;
  if (node) {
    document.body.appendChild(node);
    setTimeout(function () { node.remove(); }, 3200);
  }
  flyStarToHud();
}

function flyStarToHud() {
  const target = document.querySelector(".Hud-stars");
  if (!target) return;
  const tr = target.getBoundingClientRect();
  const star = document.createElement("div");
  star.className = "FlyStar";
  star.innerHTML = '<i class="bi bi-star-fill"></i>';
  star.style.left = (window.innerWidth / 2) + "px";
  star.style.top = (window.innerHeight / 2) + "px";
  document.body.appendChild(star);
  // arranco la animacion en el siguiente frame para q el navegador note el cambio
  requestAnimationFrame(function () {
    star.style.left = (tr.left + tr.width / 2) + "px";
    star.style.top = (tr.top + tr.height / 2) + "px";
    star.style.transform = "translate(-50%, -50%) scale(0.4)";
    star.style.opacity = "0.2";
  });
  setTimeout(function () {
    star.remove();
    target.classList.add("bump");
    setTimeout(function () { target.classList.remove("bump"); }, 420);
  }, 760);
}

// ----------------------------------------------------------------- pantalla inicio
function renderStart() {
  applyPalette(null);
  document.body.className = "world-intro-bg";
  // pantalla hero estilo libro de cuentos: titulo bicolor centrado, subtitulo italica,
  // castillo+colinas+sol del sceneLayer, dragoncito con bocadillo abajo a la izq y boton rosita
  // abajo a la derecha. asi se ve como la referencia.
  root.innerHTML = `
    ${sceneLayer({ id: "hero" })}
    <div class="Screen StartScreen">
      <div class="StartScreen-top">
        <h1 class="GameTitle GameTitle-split">
          <span class="Title-emocio">EMOCIO</span><span class="Title-aventura">AVENTURA</span>
        </h1>
        <p class="GameSubtitle GameSubtitle-italic">Misión Emociones</p>
      </div>
      <div class="Hero-mascot">
        <button class="Hero-bubble" id="heroBubble" type="button" data-voice="El reino de las emociones necesita tu ayuda">El reino de las emociones necesita tu ayuda</button>
        <div class="Hero">${drawHero("happy")}</div>
      </div>
      <button class="StartCta" id="startBtn" type="button">empezar</button>
    </div>`;
  document.getElementById("startBtn").addEventListener("click", function () {
    Sound.ensureCtx(); Sound.click();
    // si ya termino toda la aventura, lo llevamos al final; si no, al mapa para que siga
    if (allWorldsDone()) return renderFinal();
    renderMap();
  });
  // el bocadillo es clickable: al tocarlo lo narramos (es la garantia de q suene, porq
  // el click es user gesture y desbloquea el autoplay del navegador). tambien intentamos
  // narrar de una al cargar — algunos navegadores lo permiten, otros no
  const bubble = document.getElementById("heroBubble");
  if (bubble) bubble.addEventListener("click", function () {
    Sound.ensureCtx();
    scheduleNarrate("El reino de las emociones necesita tu ayuda");
  });
  scheduleNarrate("El reino de las emociones necesita tu ayuda");
}

// ----------------------------------------------------------------- mapa de mundos
function renderMap() {
  applyPalette(null);
  document.body.className = "map-bg";
  state.currentWorld = null;
  save();

  const unlocked = firstUnlockedIndex();
  // cada mundo es una islita flotante. les doy posiciones tipo zig-zag para q se sienta un archipielgo
  // layout horizontal: 3 columnas x 2 filas en zig-zag. las columnas van simetricas (9 / 42.5 / 76)
  // para q los compañeros de los lados queden a la misma distancia de las islas
  const spots = [
    { x: 9, y: 6 }, { x: 42.5, y: 1 }, { x: 76, y: 7 },
    { x: 76, y: 53 }, { x: 42.5, y: 58 }, { x: 9, y: 53 }
  ];
  const islands = GAME.worlds.map(function (w, i) {
    const done = isWorldDone(w.id);
    const isOpen = i === unlocked || done;
    const stateIcon = done ? "bi-check-circle-fill" : (isOpen ? "bi-star-fill" : "bi-lock-fill");
    // cada isla muestra la mascota tematica de su mundo (solecito, nubecita, dragoncito, fantasmita, estrellita, hongo).
    // las cerradas usan la misma criatura pero el css las pone en gris (.Island.is-locked .Island-buddy)
    const buddy = drawWorldMascot(w.id, "happy");
    const cls = (isOpen ? "is-open" : "is-locked") + (done ? " is-done" : "") + (i === unlocked && !done ? " is-current" : "");
    // narramos el nombre del mundo cuando el niño pone el mouse encima (solo islas abiertas)
    const voiceAttr = isOpen ? ` data-voice="${esc(w.name)}"` : "";
    return `
      <button class="Island ${cls}" data-index="${i}"${voiceAttr} ${isOpen ? "" : "disabled"}
              style="left:${spots[i].x}%; top:${spots[i].y}%; --isl:${w.palette.primary}; --isl-bg:${w.palette.bg}; --bob:${(i * 0.7).toFixed(1)}s; animation-delay:${(i * 0.4).toFixed(1)}s">
        ${i === unlocked && !done ? '<span class="Island-here">¡Vas aquí!</span>' : ""}
        <span class="Island-badge"><i class="bi ${stateIcon}"></i></span>
        <span class="Island-buddy">${buddy}</span>
        <span class="Island-rock">${drawIsland(w.id, w.palette.primary)}</span>
        <span class="Island-name">${esc(w.name)}</span>
      </button>`;
  }).join("");

  root.innerHTML = `
    ${sceneLayer({ id: "map" })}
    ${hud(false)}
    <div class="Screen MapScreen">
      <h2 class="ScreenTitle">Mapa del Reino</h2>
      <p class="ScreenHint">Salta a tu próxima isla</p>
      <div class="Archipelago">
        <svg class="Archi-paths" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M20 26 C 34 18, 40 16, 44 21" /><path d="M52 21 C 66 16, 72 20, 76 27" />
          <path d="M80 33 C 86 48, 86 54, 80 67" /><path d="M76 73 C 64 80, 56 80, 52 78" />
          <path d="M44 78 C 32 80, 24 78, 20 73" />
        </svg>
        ${islands}
      </div>
      <button class="MapBuddy MapBuddy-left" title="¡Salúdame!" style="--bob:0.6s">${drawMascot("#FF5DA2", "happy")}</button>
      <button class="MapBuddy MapBuddy-right" title="¡Salúdame!" style="--bob:2.1s">${drawMascot("#1FC8C8", "happy")}</button>
    </div>`;

  wireHud();
  attachSceneParallax();
  Array.prototype.forEach.call(document.querySelectorAll(".Island.is-open"), function (btn) {
    btn.addEventListener("click", function () {
      Sound.ensureCtx(); Sound.click();
      enterWorld(parseInt(btn.getAttribute("data-index"), 10));
    });
  });
  // los compañeros de los lados: al tocarlos saltan, suenan y dicen algo
  Array.prototype.forEach.call(document.querySelectorAll(".MapBuddy"), function (b) {
    b.addEventListener("click", function () {
      Sound.ensureCtx(); Sound.success();
      b.classList.remove("is-hop"); void b.offsetWidth; b.classList.add("is-hop");
      talkBuddy(b);
    });
  });
  // narramos el titulo del mapa
  scheduleNarrate("Mapa del Reino");
}

// frasecitas de animo q sueltan los compañeros del mapa
const BUDDY_PHRASES = ["¡Hola!", "¡Tú puedes!", "¡Vamos!", "¡Qué bien!", "¡A explorar!", "¡Eres genial!"];
let buddyPhraseIdx = 0;
function talkBuddy(b) {
  const old = b.querySelector(".BuddyTalk");
  if (old) old.remove();
  const t = document.createElement("span");
  t.className = "BuddyTalk";
  t.textContent = BUDDY_PHRASES[buddyPhraseIdx % BUDDY_PHRASES.length];
  buddyPhraseIdx++;
  b.appendChild(t);
  setTimeout(function () { if (t.parentNode) t.remove(); }, 1600);
}

// parallax: el fondo se mueve un poquito siguiendo el cursor/dedo, para q se sienta vivo.
// muevo cada capa (con data-par) distinto segun su "profundidad"
let parHandler = null;
function attachSceneParallax() {
  if (parHandler) { window.removeEventListener("pointermove", parHandler); parHandler = null; }
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const layers = document.querySelectorAll(".Scene .par");
  if (!layers.length) return;
  parHandler = function (e) {
    const dx = (e.clientX - window.innerWidth / 2) / window.innerWidth;
    const dy = (e.clientY - window.innerHeight / 2) / window.innerHeight;
    Array.prototype.forEach.call(layers, function (l) {
      const p = parseFloat(l.getAttribute("data-par")) || 0;
      l.style.transform = "translate(" + (dx * p).toFixed(1) + "px," + (dy * p).toFixed(1) + "px)";
    });
  };
  window.addEventListener("pointermove", parHandler);
}

// q emocion "vive" en cada mundo, para mostrar el personaje correcto en su isla
function emotionForWorld(id) {
  return { joy: "happy", sadness: "sad", anger: "angry", fear: "scared", surprise: "surprised", disgust: "disgust" }[id] || "neutral";
}

// como narrar una carita (las FaceCard son SVG, no tienen texto propio)
function voiceForEmotion(em) {
  return {
    happy: "Carita feliz",
    sad: "Carita triste",
    angry: "Carita enojada",
    scared: "Carita asustada",
    surprised: "Carita sorprendida",
    disgust: "Carita de asco",
    neutral: "Carita tranquila"
  }[em] || "Carita";
}

// ----------------------------------------------------------------- intro del mundo
function enterWorld(i) {
  state.currentWorld = i;
  state.currentChallenge = 0;
  save();
  renderWorldIntro(i);
}

function renderWorldIntro(i) {
  const w = GAME.worlds[i];
  applyPalette(w);
  document.body.className = "world-intro-bg";
  root.innerHTML = `
    ${sceneLayer(w)}
    ${hud(true)}
    <div class="Screen IntroScreen">
      <h2 class="ScreenTitle">${esc(w.name)}</h2>
      ${guideBubble(w.intro, w.id, "happy")}
      ${bigButton("introBtn", w.introButton, "bi-play-fill")}
    </div>`;
  wireHud();
  document.getElementById("introBtn").addEventListener("click", function () {
    Sound.ensureCtx(); Sound.click();
    renderChallenge(i, 0);
  });
  // narramos solo la intro de la mascota (el nombre del mundo se VE en el titulo)
  autoNarrateMain();
}

// ----------------------------------------------------------------- marco comun de reto
// arma el cascaron (hud + titulo + instruccion + cuerpo) y devuelve el div del cuerpo
function challengeShell(world, chIndex, ch) {
  applyPalette(world);
  document.body.className = "challenge-bg";
  const total = world.challenges.length;
  // barrita de progreso del mundo (rellena segun el reto en q vas)
  const dots = world.challenges.map(function (_, k) {
    return `<span class="Pip ${k < chIndex ? "done" : (k === chIndex ? "now" : "")}"></span>`;
  }).join("");
  root.innerHTML = `
    ${sceneLayer(world)}
    ${hud(true)}
    <div class="Screen ChallengeScreen">
      <div class="ChallengeHead">
        <div class="Progress"><span class="ChallengeStep">Reto ${chIndex + 1} de ${total}</span><div class="Pips">${dots}</div></div>
        <h2 class="ChallengeTitle">${esc(ch.title)}</h2>
        ${guideBubble(ch.instruction, world.id, "happy")}
      </div>
      <div class="ChallengeBody" id="challengeBody"></div>
    </div>`;
  wireHud();
  return document.getElementById("challengeBody");
}

// reparte segun el tipo de reto
function renderChallenge(worldIndex, chIndex) {
  state.currentWorld = worldIndex;
  state.currentChallenge = chIndex;
  solving = false; // reto nuevo, vuelvo a permitir clicks
  save();

  const world = GAME.worlds[worldIndex];
  const ch = world.challenges[chIndex];
  const body = challengeShell(world, chIndex, ch);

  switch (ch.type) {
    case "pick-face": renderPickFace(body, ch); break;
    case "multi-select": renderMultiSelect(body, ch); break;
    case "single-choice": renderSingleChoice(body, ch); break;
    case "story": renderStory(body, ch); break;
    case "audio-story": return renderAudioStory(body, ch); // ese maneja su propia narracion
    case "traffic-light": renderTrafficLight(body, ch); break;
    case "classify": renderClassify(body, ch); break;
    default: body.textContent = "Reto no disponible"; return;
  }
  // narramos la instruccion del reto (la del globo de la mascota) + la pregunta si la hay
  autoNarrateMain();
}

// se llama cuando el reto quedo resuelto del todo
function solveChallenge(ch) {
  if (solving) return;   // ya estaba resuelto, ignoro toques repetidos (evita estrellas de mas)
  solving = true;
  // bloqueo los clicks del reto mientras corre la animacion de festejo
  const cb = document.getElementById("challengeBody");
  if (cb) cb.style.pointerEvents = "none";

  state.stars += 1;
  save();
  Sound.success();
  const sc = document.getElementById("starCount");
  if (sc) sc.textContent = state.stars;
  // primero la fiesta en pantalla, y un ratico despues aparece la mascota a felictar
  celebrate();
  const msg = ch.feedbackOk || ch.feedbackFinal || "¡Muy bien!";
  setTimeout(function () { showSuccess(msg); }, 750);
}

function advance() {
  const world = GAME.worlds[state.currentWorld];
  const next = state.currentChallenge + 1;
  if (next < world.challenges.length) {
    renderChallenge(state.currentWorld, next);
  } else {
    completeWorld(state.currentWorld);
  }
}

// ----------------------------------------------------------------- reto: elegir carita
function renderPickFace(body, ch) {
  // barajo un poco las opciones para q la correcta no quede siempr igual
  const opts = shuffle(ch.options.slice());
  body.innerHTML = `<div class="FaceGrid">${opts.map(function (o, idx) {
    return `<button class="FaceCard" data-correct="${o.correct ? 1 : 0}" data-i="${idx}" aria-label="${esc(voiceForEmotion(o.emotion))}" style="--bob:${(idx * 0.25).toFixed(2)}s">${drawCharacter(o.emotion)}</button>`;
  }).join("")}</div>`;

  Array.prototype.forEach.call(body.querySelectorAll(".FaceCard"), function (card) {
    card.addEventListener("click", function () {
      Sound.ensureCtx();
      if (card.getAttribute("data-correct") === "1") {
        solveChallenge(ch);
      } else {
        card.classList.add("is-wrong");
        setTimeout(function () { card.classList.remove("is-wrong"); }, 500);
        showError(ch.feedbackError || "Intenta de nuevo, mira bien las caritas");
      }
    });
  });
}

// ----------------------------------------------------------------- reto: seleccion multiple
function renderMultiSelect(body, ch) {
  body.innerHTML = `
    <div class="CardGrid">${ch.options.map(function (o, idx) {
      return `<button class="ChoiceCard" data-i="${idx}">
        <span class="ChoiceCard-check"><i class="bi bi-check-lg"></i></span>
        <span class="ChoiceCard-ico"><i class="bi ${o.icon || "bi-emoji-smile"}"></i></span>
        <span class="ChoiceCard-txt">${esc(o.text)}</span>
      </button>`;
    }).join("")}</div>
    <div class="ChallengeActions">${bigButton("confirmBtn", "Confirmar", "bi-check-lg")}</div>`;

  const cards = body.querySelectorAll(".ChoiceCard");
  Array.prototype.forEach.call(cards, function (card) {
    card.addEventListener("click", function () {
      Sound.ensureCtx(); Sound.click();
      card.classList.toggle("is-selected");
    });
  });

  document.getElementById("confirmBtn").addEventListener("click", function () {
    Sound.ensureCtx();
    let ok = true;
    Array.prototype.forEach.call(cards, function (card, idx) {
      const picked = card.classList.contains("is-selected");
      const correct = !!ch.options[idx].correct;
      if (picked !== correct) ok = false;
    });
    if (ok) solveChallenge(ch);
    else showError("Casi… revisa bien tu selección");
  });
}

// ----------------------------------------------------------------- reto: opcion unica
function renderSingleChoice(body, ch) {
  // si la pregunta es igual a la instruccion (q ya sale en el globo), no la repito
  if (ch.question && ch.question !== ch.instruction) body.innerHTML = `<p class="QuestionText">${esc(ch.question)}</p>`;
  const wrap = document.createElement("div");
  wrap.className = "OptionList";
  ch.options.forEach(function (o, idx) {
    const b = document.createElement("button");
    b.className = "OptionBtn";
    b.textContent = o.text;
    b.addEventListener("click", function () {
      Sound.ensureCtx();
      // si el reto marca allCorrect, cualquiera vale (es de expresion personal)
      if (ch.allCorrect || o.correct) {
        solveChallenge(ch);
      } else {
        b.classList.add("is-wrong");
        setTimeout(function () { b.classList.remove("is-wrong"); }, 500);
        showError("Mmm… esa no es. Inténtalo de nuevo");
      }
    });
    wrap.appendChild(b);
  });
  body.appendChild(wrap);
}

// ----------------------------------------------------------------- reto: historia
function renderStory(body, ch) {
  // la situacion solo la muestro aparte si no es la misma q la instruccion del globo
  if (ch.situation && ch.situation !== ch.instruction) body.innerHTML = `<p class="QuestionText">${esc(ch.situation)}</p>`;
  const wrap = document.createElement("div");
  wrap.className = "OptionList";
  ch.options.forEach(function (o) {
    const b = document.createElement("button");
    b.className = "OptionBtn";
    b.textContent = o.text;
    b.addEventListener("click", function () {
      Sound.ensureCtx();
      if (o.correct) {
        solveChallenge(ch);
      } else {
        b.classList.add("is-wrong");
        setTimeout(function () { b.classList.remove("is-wrong"); }, 500);
        showError("Esa opción no ayuda mucho… prueba otra");
      }
    });
    wrap.appendChild(b);
  });
  body.appendChild(wrap);
}

// ----------------------------------------------------------------- reto: audiocuento
// usa el TTS del navegador (Web Speech API) para narrar el texto del cuento. asi no toca grabar mp3s.
// si por alguna razon el navegador no tiene TTS (raro hoy en dia), caemos al texto plano.
function renderAudioStory(body, ch) {
  body.innerHTML = `<div class="StoryBox" id="storyBox"></div>`;
  const boxEl = document.getElementById("storyBox");

  // ajustamos titulo/instruccion para q hablen de ESCUCHAR (este reto siempre es audicuento ahora)
  const titleEl = document.querySelector(".ChallengeTitle");
  if (titleEl) titleEl.textContent = "Escucho y comprendo";
  const bubbleEl = document.querySelector(".Guide-bubble");
  if (bubbleEl) bubbleEl.textContent = "Escucha el cuento y luego responde";

  // si el navegador no tiene TTS (caso muy raro), caemos a leer el texto
  if (!Sound.hasSpeech()) {
    boxEl.innerHTML = `
      <h3 class="StoryTitle">${esc(ch.storyTitle)}</h3>
      <div class="StoryText">${esc(ch.storyText)}</div>
      ${bigButton("toQuiz", "Continuar", "bi-arrow-right")}`;
    document.getElementById("toQuiz").addEventListener("click", function () {
      Sound.click();
      startQuiz(ch, boxEl);
    });
    return;
  }

  // el reproductor TTS: play/pausa y un boton chiquito para volver a empezar
  boxEl.innerHTML = `
    <h3 class="StoryTitle">${esc(ch.storyTitle)}</h3>
    <div class="AudioPlayer">
      <button class="btn PlayBtn" id="playBtn" type="button" aria-label="Escuchar el cuento"><i class="bi bi-play-fill"></i></button>
      <button class="btn PlayBtn PlayBtn-secondary" id="restartBtn" type="button" aria-label="Volver a empezar"><i class="bi bi-arrow-counterclockwise"></i></button>
      <span class="AudioHint" id="audioHint">Toca el play para escuchar el cuento</span>
    </div>
    ${bigButton("toQuiz", "Ya escuché, continuar", "bi-arrow-right")}`;

  const playBtn = document.getElementById("playBtn");
  const restartBtn = document.getElementById("restartBtn");
  const hint = document.getElementById("audioHint");
  // estados: "idle" (nunca empezo), "playing", "paused", "ended"
  let state = "idle";

  function setIcon(name) { playBtn.querySelector("i").className = "bi " + name; }
  function setState(next) {
    state = next;
    if (next === "playing") { setIcon("bi-pause-fill"); hint.textContent = "Escuchando…"; }
    else if (next === "paused") { setIcon("bi-play-fill"); hint.textContent = "Pausado — toca para seguir"; }
    else if (next === "ended") { setIcon("bi-play-fill"); hint.textContent = "¡Listo! Puedes escucharlo otra vez si quieres"; }
    else { setIcon("bi-play-fill"); hint.textContent = "Toca el play para escuchar el cuento"; }
  }

  playBtn.addEventListener("click", function () {
    Sound.ensureCtx();
    if (state === "idle" || state === "ended") {
      // entramos en modo cuento: hover no narra, no interrumpe
      Sound.setStoryMode(true);
      Sound.speak(ch.storyText, {
        onstart: function () { setState("playing"); },
        onend: function () { Sound.setStoryMode(false); setState("ended"); },
        onerror: function () { Sound.setStoryMode(false); setState("ended"); }
      });
      // por si onstart tarda, mostramos pause de una
      setState("playing");
    } else if (state === "playing") {
      Sound.speakPause();
      setState("paused");
    } else if (state === "paused") {
      Sound.speakResume();
      setState("playing");
    }
  });

  restartBtn.addEventListener("click", function () {
    Sound.setStoryMode(false);
    Sound.speakStop();
    Sound.click();
    setState("idle");
  });

  document.getElementById("toQuiz").addEventListener("click", function () {
    Sound.setStoryMode(false);
    Sound.speakStop();
    Sound.click();
    startQuiz(ch, boxEl);
  });
}

// va mostrando las preguntas del cuento una por una
function startQuiz(ch, boxEl) {
  let qi = 0;
  function showQuestion() {
    const q = ch.questions[qi];
    boxEl.innerHTML = `
      <div class="QuizProgress">Pregunta ${qi + 1} de ${ch.questions.length}</div>
      <p class="QuestionText">${esc(q.question)}</p>
      <div class="OptionList" id="quizOpts"></div>`;
    const list = document.getElementById("quizOpts");
    q.options.forEach(function (o) {
      const b = document.createElement("button");
      b.className = "OptionBtn";
      b.textContent = o.text;
      b.addEventListener("click", function () {
        Sound.ensureCtx();
        if (o.correct) {
          qi += 1;
          if (qi < ch.questions.length) { Sound.click(); showQuestion(); }
          else solveChallenge(ch);
        } else {
          b.classList.add("is-wrong");
          setTimeout(function () { b.classList.remove("is-wrong"); }, 500);
          showError("Piensa otra vez en la historia… ¿cuál será?");
        }
      });
      list.appendChild(b);
    });
    scheduleNarrate(q.question);
  }
  showQuestion();
}

// ----------------------------------------------------------------- reto: semaforo (solo enojo)
function renderTrafficLight(body, ch) {
  const seen = {}; // marca q luces ya abrio el niño
  body.innerHTML = `
    <div class="TrafficLight">
      ${ch.lights.map(function (l, idx) {
        return `<button class="Light Light-${l.color}" data-i="${idx}">
          <span class="Light-bulb"></span>
          <span class="Light-label">${esc(l.label)}</span>
        </button>`;
      }).join("")}
    </div>
    <p class="ScreenHint" id="tlHint">Toca cada color para descubrir qué hacer</p>
    <div class="ChallengeActions" id="tlActions"></div>`;

  Array.prototype.forEach.call(body.querySelectorAll(".Light"), function (btn) {
    btn.addEventListener("click", function () {
      Sound.ensureCtx(); Sound.click();
      const idx = parseInt(btn.getAttribute("data-i"), 10);
      const light = ch.lights[idx];
      showLightModal(light);
      seen[idx] = true;
      btn.classList.add("is-seen");
      // cuando ya vio los 3, habilito la mini-secuencia de preguntas
      if (Object.keys(seen).length === ch.lights.length) {
        document.getElementById("tlHint").textContent = "¡Muy bien! Ahora responde";
        const actions = document.getElementById("tlActions");
        if (!actions.innerHTML) {
          actions.innerHTML = bigButton("tlGo", "Continuar", "bi-arrow-right");
          document.getElementById("tlGo").addEventListener("click", function () {
            Sound.click();
            trafficQuiz(ch, body);
          });
        }
      }
    });
  });
}

// las 2 preguntitas en secuenca: parar -> pensar
function trafficQuiz(ch, body) {
  let qi = 0;
  function showQ() {
    const q = ch.questions[qi];
    body.innerHTML = `
      <div class="QuizProgress">Paso ${qi + 1} de ${ch.questions.length}</div>
      <p class="QuestionText">${esc(q.question)}</p>
      <div class="OptionList" id="tlQuizOpts"></div>`;
    const list = document.getElementById("tlQuizOpts");
    q.options.forEach(function (o) {
      const b = document.createElement("button");
      b.className = "OptionBtn";
      b.textContent = o.text;
      b.addEventListener("click", function () {
        Sound.ensureCtx();
        if (o.correct) {
          qi += 1;
          if (qi < ch.questions.length) { Sound.click(); showQ(); }
          else solveChallenge(ch);
        } else {
          b.classList.add("is-wrong");
          setTimeout(function () { b.classList.remove("is-wrong"); }, 500);
          showError("Recuerda el semáforo: primero parar");
        }
      });
      list.appendChild(b);
    });
    scheduleNarrate(q.question);
  }
  showQ();
}

// usa el modal de bootstrap para mostrar el texto de cada color
function showLightModal(light) {
  let modalEl = document.getElementById("lightModal");
  if (!modalEl) {
    modalEl = document.createElement("div");
    modalEl.id = "lightModal";
    modalEl.className = "modal fade";
    modalEl.tabIndex = -1;
    modalEl.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content LightModal">
          <div class="modal-body">
            <h3 class="LightModal-title" id="lightModalTitle"></h3>
            <p class="LightModal-text" id="lightModalText"></p>
            <button class="btn PrimaryBtn" data-bs-dismiss="modal">Entendido</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modalEl);
  }
  modalEl.querySelector(".LightModal").setAttribute("data-color", light.color);
  document.getElementById("lightModalTitle").textContent = light.title;
  document.getElementById("lightModalText").textContent = light.text;
  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  modal.show();
  // leemos el titulo y el textito del color para el niño
  scheduleNarrate(light.title + ". " + light.text);
}

// ----------------------------------------------------------------- reto: clasificar (sorpresa)
function renderClassify(body, ch) {
  // pool de items + dos cajas. funciona tocando (item y luego caja) y tambien arrastrando
  body.innerHTML = `
    <div class="ClassifyPool" id="pool">
      ${shuffle(ch.items.slice()).map(function (it, idx) {
        return `<button class="ClassifyItem" draggable="true" data-box="${esc(it.box)}" data-i="${idx}">${esc(it.text)}</button>`;
      }).join("")}
    </div>
    <div class="ClassifyBoxes">
      ${ch.boxes.map(function (b) {
        return `<div class="ClassifyBox" data-box="${esc(b)}">
          <div class="ClassifyBox-title">${esc(b)}</div>
          <div class="ClassifyBox-drop"></div>
        </div>`;
      }).join("")}
    </div>`;

  let selected = null; // item elegido por toque
  let placed = 0;
  const totalItems = ch.items.length;

  function tryPlace(item, boxName) {
    if (item.getAttribute("data-box") === boxName) {
      // bien: lo meto en la caja y lo desactivo
      const drop = body.querySelector('.ClassifyBox[data-box="' + cssEscape(boxName) + '"] .ClassifyBox-drop');
      item.classList.remove("is-selected");
      item.classList.add("is-placed");
      item.setAttribute("draggable", "false");
      drop.appendChild(item);
      Sound.click();
      placed += 1;
      if (placed === totalItems) solveChallenge(ch);
    } else {
      item.classList.add("is-wrong");
      setTimeout(function () { item.classList.remove("is-wrong"); }, 500);
      showError("Esa va en la otra caja, mira bien");
    }
  }

  // ---- modo toque
  Array.prototype.forEach.call(body.querySelectorAll(".ClassifyItem"), function (item) {
    item.addEventListener("click", function () {
      if (item.classList.contains("is-placed")) return;
      Sound.ensureCtx();
      if (selected === item) { item.classList.remove("is-selected"); selected = null; return; }
      if (selected) selected.classList.remove("is-selected");
      selected = item;
      item.classList.add("is-selected");
    });
    // ---- modo arrastrar
    item.addEventListener("dragstart", function (e) {
      if (item.classList.contains("is-placed")) return;
      selected = item;
      e.dataTransfer.setData("text/plain", "x");
    });
  });

  Array.prototype.forEach.call(body.querySelectorAll(".ClassifyBox"), function (box) {
    const boxName = box.getAttribute("data-box");
    box.addEventListener("click", function () {
      if (selected) tryPlace(selected, boxName);
    });
    box.addEventListener("dragover", function (e) { e.preventDefault(); box.classList.add("is-over"); });
    box.addEventListener("dragleave", function () { box.classList.remove("is-over"); });
    box.addEventListener("drop", function (e) {
      e.preventDefault();
      box.classList.remove("is-over");
      if (selected) tryPlace(selected, boxName);
    });
  });
}

// version chiquita de CSS.escape por si el navegador no lo trae (los nombres de caja son simples igual)
function cssEscape(s) {
  if (window.CSS && CSS.escape) return CSS.escape(s);
  return s.replace(/[^a-zA-Z0-9_-]/g, "\\$&");
}

// ----------------------------------------------------------------- overlays de feedback
function showSuccess(message) {
  const world = GAME.worlds[state.currentWorld];
  const overlay = makeOverlay("ok");
  overlay.innerHTML = `
    <div class="FeedbackCard FeedbackCard-pop">
      <div class="Mascot Mascot-md Mascot-bounce">${drawWorldMascot(world.id, "cheer")}</div>
      <p class="FeedbackText">${esc(message)}</p>
      <div class="FeedbackStar"><i class="bi bi-star-fill"></i> +1 estrella</div>
      ${bigButton("nextBtn", "Siguiente reto", "bi-arrow-right")}
    </div>`;
  document.getElementById("nextBtn").addEventListener("click", function () {
    Sound.click();
    overlay.remove();
    advance();
  });
  scheduleNarrate(message);
}

function showError(message) {
  Sound.tryAgain();
  const world = GAME.worlds[state.currentWorld];
  const overlay = makeOverlay("soft");
  overlay.innerHTML = `
    <div class="FeedbackCard FeedbackCard-soft FeedbackCard-pop">
      <div class="Mascot Mascot-sm">${drawWorldMascot(world ? world.id : "fear", "oops")}</div>
      <p class="FeedbackText">${esc(message)}</p>
      ${bigButton("retryBtn", "Seguir intentando", "bi-arrow-repeat")}
    </div>`;
  document.getElementById("retryBtn").addEventListener("click", function () {
    Sound.click();
    overlay.remove();
  });
  scheduleNarrate(message);
}

function makeOverlay(kind) {
  const old = document.getElementById("overlay");
  if (old) old.remove();
  const ov = document.createElement("div");
  ov.id = "overlay";
  ov.className = "Overlay Overlay-" + kind;
  document.body.appendChild(ov);
  return ov;
}

// ----------------------------------------------------------------- recompensa
function completeWorld(worldIndex) {
  const world = GAME.worlds[worldIndex];
  // guardo q el mundo quedo hecho y su insignia (sin duplicar)
  if (!isWorldDone(world.id)) state.completedWorlds.push(world.id);
  if (state.badges.indexOf(world.badge) === -1) state.badges.push(world.badge);
  state.currentWorld = null;
  state.currentChallenge = 0;
  save();
  Sound.fanfare();
  renderReward(world);
}

function renderReward(world) {
  applyPalette(world);
  document.body.className = "reward-bg";
  root.innerHTML = `
    ${sceneLayer(world)}
    ${confettiBurst(60)}
    ${hud(false)}
    <div class="Screen RewardScreen">
      <div class="Mascot Mascot-lg Mascot-bounce">${drawWorldMascot(world.id, "cheer")}</div>
      <h2 class="ScreenTitle">${esc(world.reward)}</h2>
      <div class="BadgeWon">
        <i class="bi bi-award-fill"></i>
        <span>${esc(world.badge)}</span>
      </div>
      ${bigButton("rewardNext", allWorldsDone() ? "Ver mi premio" : "Volver al mapa", "bi-arrow-right")}
    </div>`;
  wireHud();
  document.getElementById("rewardNext").addEventListener("click", function () {
    Sound.click();
    if (allWorldsDone()) renderFinal();
    else renderMap();
  });
  scheduleNarrate(world.reward);
}

// ----------------------------------------------------------------- pantalla final
function renderFinal() {
  applyPalette(null);
  document.body.className = "final-bg";
  const badges = GAME.worlds.map(function (w) {
    return `<div class="FinalBadge"><i class="bi bi-award-fill"></i><span>${esc(w.badge)}</span></div>`;
  }).join("");
  root.innerHTML = `
    ${sceneLayer({ id: "surprise" })}
    ${confettiBurst(80)}
    <div class="Screen FinalScreen">
      <div class="Mascot Mascot-md Mascot-bounce">${drawWorldMascot("joy", "cheer")}</div>
      <div class="TrophyBig"><i class="bi bi-trophy-fill"></i></div>
      <h1 class="GameTitle">¡${esc(GAME.finalBadge)}!</h1>
      <p class="StartText">Recuperaste todas las energías del reino. ¡Eres todo un explorador de las emociones!</p>
      <div class="FinalBadges">${badges}</div>
      <button class="btn PrimaryBtn" id="finalReset"><i class="bi bi-arrow-counterclockwise"></i> Jugar de nuevo</button>
    </div>`;
  Sound.fanfare();
  document.getElementById("finalReset").addEventListener("click", function () {
    Sound.click();
    if (confirm("¿Quieres volver a empezar la aventura?")) resetProgress();
  });
  scheduleNarrate("¡" + GAME.finalBadge + "!");
}

// ----------------------------------------------------------------- utilidades
// baraja simple (Fisher-Yates) para q las opciones no salgan siemrpe en el mismo orden
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
  }
  return arr;
}

// arranco cuando el DOM esta listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
