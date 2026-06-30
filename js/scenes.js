0// los fondos animados de cada mundo y el confeti de las celebraciones.
// todo se dibuja con divs/spans q luego anima el css, asi q aca solo armo el html con posiciones variads.

function rnd(min, max) { return min + Math.random() * (max - min); }

// repite un "molde" n veces metiendole posiciones/delays aleatorios para q no quede simetrico
function scatter(n, build) {
  let out = "";
  for (let i = 0; i < n; i++) out += build(i);
  return out;
}

// elige uno al azar de una lista (para colores de globos, flores, etc)
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// nube grande del menu (bumps arriba Y abajo pa que se vea como nube de verdad)
function drawCloudBase() {
  return `<svg class="HeroCloudSvg" viewBox="0 0 500 220" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <radialGradient id="heroCloudGrad" cx="50%" cy="25%" r="80%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="65%" stop-color="#f4f8fd"/>
        <stop offset="100%" stop-color="#dde6f1"/>
      </radialGradient>
    </defs>
    <path d="M 30 130
      C 0 130, -5 80, 32 72
      C 22 28, 100 18, 122 60
      C 112 12, 200 8, 222 52
      C 232 8, 320 12, 322 56
      C 342 18, 422 24, 416 72
      C 462 60, 514 90, 482 130
      C 518 142, 500 188, 458 178
      C 446 210, 372 210, 354 178
      C 338 210, 266 210, 248 178
      C 232 210, 160 210, 142 178
      C 126 210, 56 210, 44 178
      C 4 188, -10 142, 30 130 Z"
      fill="url(#heroCloudGrad)" stroke="#cfdbe9" stroke-width="2.5"/>
    <!-- brillos -->
    <ellipse cx="120" cy="82" rx="36" ry="14" fill="#fff" opacity="0.7"/>
    <ellipse cx="240" cy="58" rx="48" ry="16" fill="#fff" opacity="0.6"/>
    <ellipse cx="380" cy="70" rx="36" ry="14" fill="#fff" opacity="0.6"/>
  </svg>`;
}

// el arcoiris (lo uso en alegria y en el mapa)
function rainbowSvg() {
  return `<svg class="rainbow" viewBox="0 0 120 64" aria-hidden="true">
    <path d="M6 62 A54 54 0 0 1 114 62" fill="none" stroke="#FF6B6B" stroke-width="6"/>
    <path d="M16 62 A44 44 0 0 1 104 62" fill="none" stroke="#FFA94D" stroke-width="6"/>
    <path d="M26 62 A34 34 0 0 1 94 62" fill="none" stroke="#FFD43B" stroke-width="6"/>
    <path d="M36 62 A24 24 0 0 1 84 62" fill="none" stroke="#69DB7C" stroke-width="6"/>
    <path d="M46 62 A14 14 0 0 1 74 62" fill="none" stroke="#4DABF7" stroke-width="6"/>
  </svg>`;
}

// devuelve la capa de escenario segun el mundo. va detras del contenido (pointer-events none).
// cada mundo trae un monton de detalles + un "suelo" abajo para q no se vea vacio
function worldScene(id) {
  let inner = "";
  const BALLOON = ["#FF8C42", "#6BCB77", "#FF5DA2", "#FFD23F", "#7C6FF0", "#1FC8C8"];
  const FLOWER = ["#FF5DA2", "#FFD23F", "#FF8C42", "#7C6FF0", "#FFFFFF"];
  switch (id) {
    case "joy":
      // pradera soleada: sol, arcoiris, nubes, globos, mariposas, brillos y flores en el suelo
      inner = `
        <div class="sky-sun"></div>
        ${rainbowSvg()}
        ${scatter(6, (i) => `<span class="par" data-par="${6 + i * 3}" style="top:${(rnd(5, 42)) | 0}%; left:${(rnd(2, 82)) | 0}%"><span class="sky-cloud ${i % 2 ? "sm" : ""}"></span></span>`)}
        ${scatter(9, () => `<span class="sky-balloon" style="left:${(rnd(3, 95)) | 0}%; animation-delay:${rnd(0, 9).toFixed(1)}s; --bc:${pick(BALLOON)}"></span>`)}
        ${scatter(6, () => `<span class="butterfly" style="top:${(rnd(22, 66)) | 0}%; left:${(rnd(6, 90)) | 0}%; animation-delay:${rnd(0, 6).toFixed(1)}s; --bc:${pick(BALLOON)}"></span>`)}
        ${scatter(20, () => `<span class="spark" style="left:${(rnd(2, 98)) | 0}%; top:${(rnd(6, 80)) | 0}%; animation-delay:${rnd(0, 2.5).toFixed(2)}s"></span>`)}
        <div class="ground ground-grass"></div>
        ${scatter(11, (i) => `<span class="g-flower" style="left:${(2 + i * 9) | 0}%; --bc:${pick(FLOWER)}; --h:${(rnd(26, 50)) | 0}px"></span>`)}`;
      break;
    case "sadness":
      // dia gris y lluvioso: nubarrones, lluvia fuerte, neblina y charcos abajo
      inner = `
        <span class="sky-cloud big" style="top:10%; left:10%"></span>
        <span class="sky-cloud big" style="top:8%; left:62%; animation-delay:-7s"></span>
        <span class="sky-cloud" style="top:30%; left:38%; animation-delay:-4s"></span>
        ${scatter(40, () => `<span class="rain-drop" style="left:${(rnd(1, 99)) | 0}%; animation-delay:${rnd(0, 1.6).toFixed(2)}s; animation-duration:${rnd(0.8, 1.5).toFixed(2)}s"></span>`)}
        <div class="ground ground-water"></div>
        ${scatter(4, (i) => `<span class="puddle" style="left:${(8 + i * 24) | 0}%; animation-delay:${rnd(0, 2).toFixed(2)}s"></span>`)}`;
      break;
    case "anger":
      // tierra volcanica: volcan, brasas subiendo, chispas y un suelo de lava brillando
      inner = `
        <div class="volcano"></div>
        ${scatter(26, () => `<span class="ember" style="left:${(rnd(28, 72)) | 0}%; animation-delay:${rnd(0, 3).toFixed(2)}s; animation-duration:${rnd(2, 4).toFixed(2)}s"></span>`)}
        ${scatter(14, () => `<span class="spark" style="left:${(rnd(2, 98)) | 0}%; top:${(rnd(10, 70)) | 0}%; animation-delay:${rnd(0, 2).toFixed(2)}s"></span>`)}
        <div class="ground ground-lava"></div>
        ${scatter(5, (i) => `<span class="lava-bubble" style="left:${(10 + i * 20) | 0}%; animation-delay:${rnd(0, 2.5).toFixed(2)}s"></span>`)}`;
      break;
    case "fear":
      // noche estrellada: luna, muchas estrellas, luciernagas, murcielagos y cerros oscuros
      inner = `
        <div class="night-moon"></div>
        ${scatter(40, () => `<span class="twinkle" style="left:${(rnd(2, 98)) | 0}%; top:${(rnd(3, 74)) | 0}%; animation-delay:${rnd(0, 3).toFixed(2)}s; --sz:${rnd(3, 7).toFixed(1)}px"></span>`)}
        ${scatter(7, () => `<span class="firefly" style="left:${(rnd(6, 92)) | 0}%; top:${(rnd(30, 78)) | 0}%; animation-delay:${rnd(0, 4).toFixed(2)}s"></span>`)}
        ${scatter(3, (i) => `<span class="par" data-par="${14 + i * 6}" style="top:${(rnd(14, 34)) | 0}%; left:${(rnd(15, 80)) | 0}%"><span class="bat"></span></span>`)}
        <div class="ground ground-hills"></div>`;
      break;
    case "surprise":
      // fiesta sorpresa: serpentinas, regalos flotando, signos y muchos brillos de colores
      inner = `
        ${scatter(5, (i) => `<span class="streamer s${(i % 4) + 1}" style="left:${(6 + i * 20) | 0}%"></span>`)}
        ${scatter(26, () => `<span class="spark" style="left:${(rnd(2, 98)) | 0}%; top:${(rnd(6, 90)) | 0}%; animation-delay:${rnd(0, 2.5).toFixed(2)}s; --sc:${pick(BALLOON)}"></span>`)}
        ${scatter(6, (i) => `<span class="mark" style="left:${(rnd(6, 92)) | 0}%; top:${(rnd(10, 78)) | 0}%; animation-delay:${rnd(0, 4).toFixed(2)}s; --mc:${pick(BALLOON)}">${i % 2 ? "!" : "?"}</span>`)}
        ${scatter(5, () => `<span class="gift-float" style="left:${(rnd(6, 92)) | 0}%; animation-delay:${rnd(0, 7).toFixed(1)}s; --bc:${pick(BALLOON)}"></span>`)}
        <div class="ground ground-confetti"></div>`;
      break;
    case "disgust":
      // pantano: burbujas, moscas zumbando, hojas cayendo y suelo verdoso con hongos
      inner = `
        ${scatter(18, () => `<span class="bubble" style="left:${(rnd(4, 96)) | 0}%; animation-delay:${rnd(0, 5).toFixed(2)}s; animation-duration:${rnd(4, 7).toFixed(2)}s; --bsz:${(rnd(10, 28)) | 0}px"></span>`)}
        ${scatter(7, () => `<span class="leaf" style="left:${(rnd(6, 92)) | 0}%; animation-delay:${rnd(0, 6).toFixed(2)}s"></span>`)}
        ${scatter(6, () => `<span class="fly" style="left:${(rnd(10, 90)) | 0}%; top:${(rnd(20, 70)) | 0}%; animation-delay:${rnd(0, 3).toFixed(2)}s"></span>`)}
        <div class="ground ground-swamp"></div>
        ${scatter(4, (i) => `<span class="g-mushroom" style="left:${(8 + i * 24) | 0}%"></span>`)}`;
      break;
    case "map":
      // cielo de mundo flotante con varias capas: sol, nubes a distintas profundidades,
      // mini-islas, pajaritos, un banco de nubes al fondo y destellos.
      // los data-par hacen el parallax (cada capa se mueve distinto al seguir el cursor/dedo)
      inner = `
        <div class="map-sun"></div>
        <div class="cloud-bank"></div>
        ${rainbowSvg()}
        <span class="sky-balloon" style="left:90%; --bc:#FF5DA2"></span>
        <span class="sky-balloon" style="left:4%; --bc:#7C6FF0; animation-delay:-4s"></span>
        <span class="sky-balloon" style="left:48%; --bc:#1FC8C8; animation-delay:-7.5s"></span>
        <span class="sky-balloon" style="left:30%; --bc:#FFD23F; animation-delay:-2s"></span>
        <span class="par" data-par="6" style="top:8%; left:3%"><span class="sky-cloud big"></span></span>
        <span class="par" data-par="14" style="top:4%; left:54%"><span class="sky-cloud big"></span></span>
        <span class="par" data-par="9" style="top:30%; left:82%"><span class="sky-cloud"></span></span>
        <span class="par" data-par="20" style="top:50%; left:1%"><span class="sky-cloud"></span></span>
        <span class="par" data-par="11" style="top:72%; left:64%"><span class="sky-cloud"></span></span>
        <span class="par" data-par="26" style="top:62%; left:28%"><span class="sky-cloud sm"></span></span>
        <span class="par" data-par="8" style="top:42%; left:44%"><span class="sky-cloud sm"></span></span>
        <span class="par" data-par="16" style="top:18%; left:30%"><span class="sky-cloud sm"></span></span>
        <span class="par" data-par="12" style="top:86%; left:8%"><span class="sky-cloud"></span></span>
        <span class="par" data-par="18" style="top:80%; left:84%"><span class="sky-cloud sm"></span></span>
        <span class="par" data-par="10" style="top:38%; left:14%"><span class="sky-cloud sm"></span></span>
        <span class="par" data-par="22" style="top:22%; left:90%"><span class="sky-cloud sm"></span></span>
        <span class="par" data-par="30" style="top:18%; left:38%"><span class="far-island lg" style="--fi:#8AC36A"></span></span>
        <span class="par" data-par="40" style="top:46%; left:88%"><span class="far-island" style="--fi:#7FC8E8"></span></span>
        <span class="par" data-par="22" style="top:82%; left:18%"><span class="far-island sm" style="--fi:#F2B66D"></span></span>
        <span class="par" data-par="36" style="top:88%; left:74%"><span class="far-island sm" style="--fi:#C9A0E8"></span></span>
        <span class="par" data-par="28" style="top:30%; left:8%"><span class="far-island sm" style="--fi:#F2849E"></span></span>
        <span class="par" data-par="16" style="top:28%; left:18%"><span class="bird"></span></span>
        <span class="par" data-par="16" style="top:24%; left:24%"><span class="bird" style="animation-delay:-3s"></span></span>
        <span class="par" data-par="24" style="top:60%; left:52%"><span class="bird"></span></span>
        <span class="par" data-par="20" style="top:50%; left:70%"><span class="bird" style="animation-delay:-6s"></span></span>
        ${scatter(28, () => `<span class="twinkle" style="left:${rnd(2, 98)}%; top:${rnd(4, 94)}%; animation-delay:${rnd(0, 3).toFixed(2)}s; --sz:${rnd(3, 7).toFixed(1)}px"></span>`)}`;
      break;
    case "hero":
      // pantalla de inicio: castillo flotando sobre una nube grande esponjosa, cielo abierto con sol
      // y muchas nubes pequeñitas. nada de colinas/arbolitos/camino — sensación de reino flotante.
      // el dragoncito hero va aparte en renderStart con su bocadillo
      inner = `
        <div class="sky-sun" style="top:8%; right:6%; width:150px; height:150px;"></div>
        ${scatter(8, (i) => `<span class="par" data-par="${4 + i * 4}" style="top:${(rnd(4, 40)) | 0}%; left:${(rnd(2, 90)) | 0}%"><span class="sky-cloud ${i % 3 === 0 ? "big" : (i % 3 === 1 ? "" : "sm")}"></span></span>`)}
        <span class="par" data-par="22" style="top:26%; left:14%"><span class="bird"></span></span>
        <span class="par" data-par="18" style="top:20%; left:64%"><span class="bird" style="animation-delay:-4s"></span></span>
        ${scatter(4, () => `<span class="butterfly" style="top:${(rnd(46, 68)) | 0}%; left:${(rnd(18, 82)) | 0}%; animation-delay:${rnd(0, 6).toFixed(1)}s; --bc:${pick(BALLOON)}"></span>`)}
        ${scatter(12, () => `<span class="twinkle" style="left:${rnd(2, 98)}%; top:${rnd(8, 60)}%; animation-delay:${rnd(0, 3).toFixed(2)}s; --sz:${rnd(3, 6).toFixed(1)}px"></span>`)}
        <div class="Hero-cloud">${drawCloudBase()}</div>
        <div class="Hero-castle">${drawCastle()}</div>`;
      break;
    default:
      inner = scatter(14, () => `<span class="spark" style="left:${rnd(2, 98)}%; top:${rnd(6, 88)}%; animation-delay:${rnd(0, 2.5).toFixed(2)}s"></span>`);
  }
  return `<div class="Scene Scene-${id}" aria-hidden="true">${inner}</div>`;
}

// lluvia de confeti para los aciertos y la recompensa. se autodestrye solo (el css lo hace caer)
function confettiBurst(n) {
  const colors = ["#FFC93C", "#FF5DA2", "#1FC8C8", "#6BCB77", "#FF8C42", "#7C6FF0"];
  const pieces = scatter(n || 36, (i) => {
    const left = rnd(0, 100).toFixed(1);
    const delay = rnd(0, 0.5).toFixed(2);
    const dur = rnd(1.6, 2.8).toFixed(2);
    const col = colors[i % colors.length];
    const rot = rnd(0, 360).toFixed(0);
    const w = rnd(7, 13).toFixed(0);
    return `<span class="confetti-piece" style="left:${left}%; background:${col}; animation-delay:${delay}s; animation-duration:${dur}s; --rot:${rot}deg; width:${w}px; height:${(w * 1.4).toFixed(0)}px"></span>`;
  });
  return `<div class="ConfettiLayer" aria-hidden="true">${pieces}</div>`;
}
