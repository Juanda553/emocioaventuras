// dibjos de los personajes en SVG

const FACE_STROKE = "#3a3540";

// ids unicos pa los defs
let _svgIdSeq = 0;
function uniqueId(prefix) { _svgIdSeq++; return (prefix || "g") + _svgIdSeq; }

// colores por emocon
const EMOTION_COLORS = {
  happy: "#FFC93C",
  sad: "#5B8DEF",
  angry: "#E63946",
  scared: "#7E6CC2",
  surprised: "#1FC8C8",
  disgust: "#5BAE4F",
  neutral: "#9AA7C7"
};

// helper de path
function path(d, w) {
  return `<path d="${d}" fill="none" stroke="${FACE_STROKE}" stroke-width="${w || 4}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

// piezas de la cara segun la emocon
function faceFeatures(emotion, cx, cy, r) {
  const x = (fx) => cx + fx * r;
  const y = (fy) => cy + fy * r;
  const lx = x(-0.32), rx = x(0.32), ey = y(-0.16);
  const sw = Math.max(3, r * 0.09);

  // ojos
  const dotEyes = `
    <circle cx="${lx}" cy="${ey}" r="${r * 0.18}" fill="${FACE_STROKE}"/>
    <circle cx="${rx}" cy="${ey}" r="${r * 0.18}" fill="${FACE_STROKE}"/>
    <ellipse cx="${lx + r * 0.06}" cy="${ey - r * 0.08}" rx="${r * 0.06}" ry="${r * 0.085}" fill="#ffffff"/>
    <ellipse cx="${rx + r * 0.06}" cy="${ey - r * 0.08}" rx="${r * 0.06}" ry="${r * 0.085}" fill="#ffffff"/>
    <circle cx="${lx - r * 0.06}" cy="${ey + r * 0.08}" r="${r * 0.03}" fill="#ffffff" opacity="0.85"/>
    <circle cx="${rx - r * 0.06}" cy="${ey + r * 0.08}" r="${r * 0.03}" fill="#ffffff" opacity="0.85"/>`;
  const wideEyes = `
    <circle cx="${lx}" cy="${ey}" r="${r * 0.18}" fill="#fff" stroke="${FACE_STROKE}" stroke-width="${sw * 0.7}"/>
    <circle cx="${rx}" cy="${ey}" r="${r * 0.18}" fill="#fff" stroke="${FACE_STROKE}" stroke-width="${sw * 0.7}"/>
    <circle cx="${lx}" cy="${ey + r * 0.02}" r="${r * 0.07}" fill="${FACE_STROKE}"/>
    <circle cx="${rx}" cy="${ey + r * 0.02}" r="${r * 0.07}" fill="${FACE_STROKE}"/>`;

  let brows = "", eyes = dotEyes, mouth = "", extra = "";

  switch (emotion) {
    case "happy":
      brows = path(`M${x(-0.52)} ${y(-0.44)} Q${x(-0.32)} ${y(-0.54)} ${x(-0.16)} ${y(-0.44)}`, sw) +
              path(`M${x(0.16)} ${y(-0.44)} Q${x(0.32)} ${y(-0.54)} ${x(0.52)} ${y(-0.44)}`, sw);
      mouth = path(`M${x(-0.4)} ${y(0.24)} Q${cx} ${y(0.68)} ${x(0.4)} ${y(0.24)}`, sw * 1.2);
      extra = `
        <circle cx="${x(-0.56)}" cy="${y(0.16)}" r="${r * 0.14}" fill="#FF8FA3" opacity="0.55"/>
        <circle cx="${x(0.56)}" cy="${y(0.16)}" r="${r * 0.14}" fill="#FF8FA3" opacity="0.55"/>`;
      break;
    case "sad":
      brows = path(`M${x(-0.52)} ${y(-0.28)} L${x(-0.16)} ${y(-0.44)}`, sw) +
              path(`M${x(0.16)} ${y(-0.44)} L${x(0.52)} ${y(-0.28)}`, sw);
      mouth = path(`M${x(-0.4)} ${y(0.56)} Q${cx} ${y(0.2)} ${x(0.4)} ${y(0.56)}`, sw * 1.2);
      extra = `<path d="M${lx} ${y(0.16)} q${-r * 0.1} ${r * 0.16} 0 ${r * 0.24} q${r * 0.1} ${-r * 0.08} 0 ${-r * 0.24} z" fill="#5B8DEF"/>`;
      break;
    case "angry":
      brows = path(`M${x(-0.52)} ${y(-0.48)} L${x(-0.16)} ${y(-0.28)}`, sw) +
              path(`M${x(0.16)} ${y(-0.28)} L${x(0.52)} ${y(-0.48)}`, sw);
      mouth = path(`M${x(-0.36)} ${y(0.56)} Q${cx} ${y(0.36)} ${x(0.36)} ${y(0.56)}`, sw * 1.2);
      break;
    case "scared": {
      brows = path(`M${x(-0.54)} ${y(-0.38)} L${x(-0.18)} ${y(-0.56)}`, sw) +
              path(`M${x(0.18)} ${y(-0.56)} L${x(0.54)} ${y(-0.38)}`, sw);
      // ojos abiertos
      eyes = `
        <circle cx="${lx}" cy="${ey}" r="${r * 0.17}" fill="#fff" stroke="${FACE_STROKE}" stroke-width="${sw * 0.7}"/>
        <circle cx="${rx}" cy="${ey}" r="${r * 0.17}" fill="#fff" stroke="${FACE_STROKE}" stroke-width="${sw * 0.7}"/>
        <circle cx="${lx}" cy="${ey}" r="${r * 0.075}" fill="${FACE_STROKE}"/>
        <circle cx="${rx}" cy="${ey}" r="${r * 0.075}" fill="${FACE_STROKE}"/>`;
      // boca
      mouth = `<ellipse cx="${cx}" cy="${y(0.5)}" rx="${r * 0.12}" ry="${r * 0.16}" fill="${FACE_STROKE}"/>`;
      // goticas
      extra =
        `<path d="M${x(0.56)} ${y(-0.40)} q${-r * 0.1} ${r * 0.16} 0 ${r * 0.24} q${r * 0.1} ${-r * 0.08} 0 ${-r * 0.24} z" fill="#7CC7FF"/>` +
        `<path d="M${x(-0.58)} ${y(-0.26)} q${-r * 0.08} ${r * 0.13} 0 ${r * 0.2} q${r * 0.08} ${-r * 0.07} 0 ${-r * 0.2} z" fill="#7CC7FF"/>`;
      break;
    }
    case "surprised":
      brows = path(`M${x(-0.56)} ${y(-0.56)} Q${x(-0.32)} ${y(-0.68)} ${x(-0.12)} ${y(-0.56)}`, sw) +
              path(`M${x(0.12)} ${y(-0.56)} Q${x(0.32)} ${y(-0.68)} ${x(0.56)} ${y(-0.56)}`, sw);
      eyes = wideEyes;
      mouth = `<circle cx="${cx}" cy="${y(0.48)}" r="${r * 0.22}" fill="${FACE_STROKE}"/>`;
      break;
    case "disgust":
      brows = path(`M${x(-0.52)} ${y(-0.36)} L${x(-0.16)} ${y(-0.28)}`, sw) +
              path(`M${x(0.16)} ${y(-0.28)} L${x(0.52)} ${y(-0.36)}`, sw);
      eyes = path(`M${x(-0.48)} ${ey} Q${lx} ${y(-0.24)} ${x(-0.16)} ${ey}`, sw * 0.8) +
             path(`M${x(0.16)} ${ey} Q${rx} ${y(-0.24)} ${x(0.48)} ${ey}`, sw * 0.8);
      mouth = path(`M${x(-0.36)} ${y(0.48)} Q${x(-0.1)} ${y(0.36)} ${cx} ${y(0.48)} Q${x(0.18)} ${y(0.6)} ${x(0.36)} ${y(0.48)}`, sw);
      extra = path(`M${x(-0.12)} ${y(0.04)} L${x(0.12)} ${y(0.04)}`, sw * 0.6) +
              path(`M${x(-0.1)} ${y(0.16)} L${x(0.1)} ${y(0.16)}`, sw * 0.6);
      break;
    case "neutral":
    default:
      brows = path(`M${x(-0.52)} ${y(-0.4)} L${x(-0.16)} ${y(-0.4)}`, sw) +
              path(`M${x(0.16)} ${y(-0.4)} L${x(0.52)} ${y(-0.4)}`, sw);
      mouth = path(`M${x(-0.32)} ${y(0.48)} L${x(0.32)} ${y(0.48)}`, sw);
      break;
  }
  // agrupo en clases pa animr al pasar el mouse
  return extra + `<g class="cBrows">${brows}</g>` + `<g class="cEyes">${eyes}</g>` + `<g class="cMouth">${mouth}</g>`;
}

// solo la carita redonda
function drawFace(emotion, color) {
  const skin = color || "#FFD8A8";
  return `
    <svg viewBox="0 0 120 120" class="FaceSvg" role="img" aria-hidden="true">
      <circle cx="60" cy="62" r="50" fill="${skin}" stroke="${FACE_STROKE}" stroke-width="3"/>
      ${faceFeatures(emotion, 60, 62, 50)}
    </svg>`;
}

// personaje completo (cuepo, brazos, orejas y cara)
function drawCharacter(emotion) {
  const c = EMOTION_COLORS[emotion] || "#FFD8A8";
  const dark = shade(c, -0.26);
  const light = mixHex(c, "#ffffff", 0.6);
  const bellyC = mixHex(c, "#ffffff", 0.78);
  const id = uniqueId("ch");
  const bodyG = "bg-" + id;
  const bellyG = "by-" + id;

  // brazos ariba si esta feliz o sorprendido, sino caidos
  const armUp = (emotion === "happy" || emotion === "surprised");
  const leftArm = armUp
    ? `<ellipse cx="22" cy="80" rx="11" ry="15" fill="${dark}" stroke="${FACE_STROKE}" stroke-width="3.5" transform="rotate(-30 22 80)"/>`
    : `<ellipse cx="26" cy="104" rx="11" ry="15" fill="${dark}" stroke="${FACE_STROKE}" stroke-width="3.5" transform="rotate(18 26 104)"/>`;
  const rightArm = armUp
    ? `<ellipse cx="118" cy="80" rx="11" ry="15" fill="${dark}" stroke="${FACE_STROKE}" stroke-width="3.5" transform="rotate(30 118 80)"/>`
    : `<ellipse cx="114" cy="104" rx="11" ry="15" fill="${dark}" stroke="${FACE_STROKE}" stroke-width="3.5" transform="rotate(-18 114 104)"/>`;

  // orejas
  const innerEarC = mixHex(c, "#FFB3C7", 0.5);
  const ears =
    `<ellipse cx="44" cy="42" rx="13" ry="16" fill="${c}" stroke="${FACE_STROKE}" stroke-width="3.5"/>` +
    `<ellipse cx="96" cy="42" rx="13" ry="16" fill="${c}" stroke="${FACE_STROKE}" stroke-width="3.5"/>`;
  const innerEars =
    `<ellipse cx="44" cy="44" rx="6" ry="9" fill="${innerEarC}" opacity="0.95"/>` +
    `<ellipse cx="96" cy="44" rx="6" ry="9" fill="${innerEarC}" opacity="0.95"/>`;
  // cola
  const tail = `<ellipse cx="124" cy="116" rx="10" ry="13" fill="${dark}" stroke="${FACE_STROKE}" stroke-width="3" transform="rotate(30 124 116)"/>`;

  // idle al azar
  const idle = ["idleSway", "idleHop", "idleWobble"][Math.floor(Math.random() * 3)];
  return `
    <svg viewBox="0 0 140 168" class="CharacterSvg ${idle}" role="img" aria-hidden="true">
      <defs>
        <radialGradient id="${bodyG}" cx="34%" cy="28%" r="80%">
          <stop offset="0%" stop-color="${light}"/>
          <stop offset="60%" stop-color="${c}"/>
          <stop offset="100%" stop-color="${dark}"/>
        </radialGradient>
        <radialGradient id="${bellyG}" cx="50%" cy="32%" r="72%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="${bellyC}"/>
        </radialGradient>
      </defs>
      <!-- sombra -->
      <ellipse cx="70" cy="160" rx="46" ry="8" fill="#000" opacity="0.18"/>
      <!-- pies -->
      <ellipse cx="54" cy="150" rx="16" ry="10" fill="${dark}" stroke="${FACE_STROKE}" stroke-width="3.5"/>
      <ellipse cx="54" cy="146" rx="7" ry="3" fill="${light}" opacity="0.7"/>
      <ellipse cx="86" cy="150" rx="16" ry="10" fill="${dark}" stroke="${FACE_STROKE}" stroke-width="3.5"/>
      <ellipse cx="86" cy="146" rx="7" ry="3" fill="${light}" opacity="0.7"/>
      ${leftArm}
      ${rightArm}
      ${tail}
      ${ears}
      <!-- cuepo -->
      <circle cx="70" cy="86" r="48" fill="url(#${bodyG})" stroke="${FACE_STROKE}" stroke-width="4"/>
      ${innerEars}
      <!-- vientre -->
      <ellipse cx="70" cy="108" rx="28" ry="20" fill="url(#${bellyG})"/>
      <!-- brillo -->
      <ellipse cx="50" cy="62" rx="18" ry="13" fill="#ffffff" opacity="0.5"/>
      <ellipse cx="44" cy="56" rx="6" ry="4" fill="#ffffff" opacity="0.95"/>
      <!-- mejilas -->
      <ellipse cx="38" cy="98" rx="11" ry="7" fill="#FF8FA3" opacity="0.7"/>
      <ellipse cx="102" cy="98" rx="11" ry="7" fill="#FF8FA3" opacity="0.7"/>
      ${faceFeatures(emotion, 70, 84, 44)}
    </svg>`;
}

// pelota mascta de los compañeros del mapa
function drawMascot(color, mood) {
  const c = color || "#FFC93C";
  const dark = shade(c, -0.2);
  mood = mood || "happy";

  let mouth, brows = "", extra = "", eyeY = 66;
  if (mood === "cheer") {
    mouth = `<path d="M50 84 Q70 110 90 84" fill="${FACE_STROKE}" opacity="0.12"/><path d="M50 84 Q70 108 90 84" fill="none" stroke="${FACE_STROKE}" stroke-width="5" stroke-linecap="round"/>`;
    extra = `
      <path d="M70 8 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 z" fill="${c}"/>
      <path d="M116 30 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2 z" fill="${c}"/>
      <path d="M22 34 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2 z" fill="${c}"/>`;
  } else if (mood === "oops") {
    mouth = `<path d="M54 92 Q70 80 86 92" fill="none" stroke="${FACE_STROKE}" stroke-width="5" stroke-linecap="round"/>`;
    extra = `<path d="M104 58 q-5 9 0 13 q5 -4 0 -13 z" fill="#7CC7FF"/>`;
    eyeY = 68;
  } else {
    mouth = `<path d="M52 86 Q70 104 88 86" fill="none" stroke="${FACE_STROKE}" stroke-width="5" stroke-linecap="round"/>`;
    extra = `<path d="M70 14 l4 9 9 4 -9 4 -4 9 -4 -9 -9 -4 9 -4 z" fill="${c}"/>`;
  }

  // brazos
  const arms = mood === "cheer"
    ? `<ellipse cx="20" cy="58" rx="8" ry="13" fill="${dark}" transform="rotate(-35 20 58)"/>
       <ellipse cx="120" cy="58" rx="8" ry="13" fill="${dark}" transform="rotate(35 120 58)"/>`
    : `<ellipse cx="22" cy="84" rx="8" ry="13" fill="${dark}" transform="rotate(20 22 84)"/>
       <ellipse cx="118" cy="84" rx="8" ry="13" fill="${dark}" transform="rotate(-20 118 84)"/>`;

  return `
    <svg viewBox="0 0 140 140" class="MascotSvg" role="img" aria-hidden="true">
      <defs>
        <radialGradient id="glow-${c.replace('#','')}" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
          <stop offset="55%" stop-color="${c}" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="${c}"/>
        </radialGradient>
      </defs>
      <circle cx="70" cy="72" r="58" fill="${c}" opacity="0.18"/>
      ${arms}
      <circle cx="70" cy="70" r="46" fill="url(#glow-${c.replace('#','')})" stroke="${FACE_STROKE}" stroke-width="3"/>
      ${brows}
      <g class="cEyes">
        <circle cx="55" cy="${eyeY}" r="7" fill="${FACE_STROKE}"/>
        <circle cx="85" cy="${eyeY}" r="7" fill="${FACE_STROKE}"/>
        <circle cx="57" cy="${eyeY - 3}" r="2.4" fill="#fff"/>
        <circle cx="87" cy="${eyeY - 3}" r="2.4" fill="#fff"/>
      </g>
      <g class="cMouth">${mouth}</g>
      <circle cx="44" cy="82" r="6" fill="#FF8FA3" opacity="0.55"/>
      <circle cx="96" cy="82" r="6" fill="#FF8FA3" opacity="0.55"/>
      ${extra}
    </svg>`;
}

// mascotas por mundo
function drawWorldMascot(worldId, mood) {
  mood = mood || "happy";
  switch (worldId) {
    case "joy": return _mascotSun(mood);
    case "sadness": return _mascotCloud(mood);
    case "anger": return _mascotDragon(mood);
    case "fear": return _mascotGhost(mood);
    case "surprise": return _mascotStar(mood);
    case "disgust": return _mascotMushroom(mood);
    default: return _mascotSun(mood);
  }
}

// cara segun la emocon
function mascotFace(emotion, accent, cx, cy, scale) {
  scale = scale || 1;
  const eyeOffX = 16 * scale;
  const eyeY = cy - 4 * scale;
  const eyeR = 11 * scale;
  const hlW = 4 * scale, hlH = 5 * scale;
  const sparkR = 2 * scale;
  const sw = 3.5 * scale;
  const lx = cx - eyeOffX, rx = cx + eyeOffX;
  const mouthY = cy + 16 * scale;

  // ojos
  const standardEyes = `<g class="cEyes">
    <circle cx="${lx}" cy="${eyeY}" r="${eyeR}" fill="${FACE_STROKE}"/>
    <circle cx="${rx}" cy="${eyeY}" r="${eyeR}" fill="${FACE_STROKE}"/>
    <ellipse cx="${lx + 3 * scale}" cy="${eyeY - 4 * scale}" rx="${hlW}" ry="${hlH}" fill="#ffffff"/>
    <ellipse cx="${rx + 3 * scale}" cy="${eyeY - 4 * scale}" rx="${hlW}" ry="${hlH}" fill="#ffffff"/>
    <circle cx="${lx - 3 * scale}" cy="${eyeY + 4 * scale}" r="${sparkR}" fill="#ffffff" opacity="0.85"/>
    <circle cx="${rx - 3 * scale}" cy="${eyeY + 4 * scale}" r="${sparkR}" fill="#ffffff" opacity="0.85"/>
  </g>`;

  let brows = "", eyes = standardEyes, mouth = "", extra = "";

  if (emotion === "cheer") {
    // boca grande y destellos
    mouth = `<g class="cMouth">
      <path d="M${cx - 12 * scale} ${mouthY} Q${cx} ${mouthY + 14 * scale} ${cx + 12 * scale} ${mouthY} Q${cx} ${mouthY + 4 * scale} ${cx - 12 * scale} ${mouthY} Z"
            fill="#FF6B8B" stroke="${FACE_STROKE}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"/>
    </g>`;
    extra = _msSparkle(cx - 36 * scale, cy - 24 * scale, "#FFD23F") +
            _msSparkle(cx + 34 * scale, cy - 20 * scale, "#FF8FA3") +
            _msSparkle(cx - 4 * scale, cy - 36 * scale, "#FFE08A");
  } else if (emotion === "oops") {
    // boca y gotita
    mouth = `<g class="cMouth">
      <path d="M${cx - 9 * scale} ${mouthY + 4 * scale} Q${cx} ${mouthY - 3 * scale} ${cx + 9 * scale} ${mouthY + 4 * scale}"
            fill="none" stroke="${FACE_STROKE}" stroke-width="${sw}" stroke-linecap="round"/>
    </g>`;
    extra = `<path d="M${cx + 26 * scale} ${cy - 14 * scale} q${-4 * scale} ${7 * scale} 0 ${11 * scale} q${4 * scale} ${-4 * scale} 0 ${-11 * scale} z"
            fill="#7CC7FF" stroke="${FACE_STROKE}" stroke-width="${2 * scale}"/>`;
  } else if (emotion === "happy") {
    // sonrisa
    mouth = `<g class="cMouth">
      <path d="M${cx - 9 * scale} ${mouthY} Q${cx} ${mouthY + 8 * scale} ${cx + 9 * scale} ${mouthY}"
            fill="none" stroke="${FACE_STROKE}" stroke-width="${sw}" stroke-linecap="round"/>
    </g>`;
  } else if (emotion === "sad") {
    // cejas tristes
    brows = `<g class="cBrows">
      <path d="M${lx - 9 * scale} ${eyeY - 11 * scale} L${lx + 9 * scale} ${eyeY - 18 * scale}" stroke="${FACE_STROKE}" stroke-width="${sw}" stroke-linecap="round"/>
      <path d="M${rx - 9 * scale} ${eyeY - 18 * scale} L${rx + 9 * scale} ${eyeY - 11 * scale}" stroke="${FACE_STROKE}" stroke-width="${sw}" stroke-linecap="round"/>
    </g>`;
    mouth = `<g class="cMouth">
      <path d="M${cx - 9 * scale} ${mouthY + 4 * scale} Q${cx} ${mouthY - 3 * scale} ${cx + 9 * scale} ${mouthY + 4 * scale}"
            fill="none" stroke="${FACE_STROKE}" stroke-width="${sw}" stroke-linecap="round"/>
    </g>`;
    // lagrima
    extra = `<path d="M${lx - 1 * scale} ${eyeY + 13 * scale} q${-3 * scale} ${5 * scale} 0 ${8 * scale} q${3 * scale} ${-3 * scale} 0 ${-8 * scale} z"
            fill="#7CC7FF" stroke="${FACE_STROKE}" stroke-width="${1.5 * scale}"/>`;
  } else if (emotion === "angry") {
    // cejas V de enojo
    brows = `<g class="cBrows">
      <path d="M${lx - 11 * scale} ${eyeY - 19 * scale} L${lx + 11 * scale} ${eyeY - 9 * scale}" stroke="${FACE_STROKE}" stroke-width="${sw * 1.25}" stroke-linecap="round"/>
      <path d="M${rx - 11 * scale} ${eyeY - 9 * scale} L${rx + 11 * scale} ${eyeY - 19 * scale}" stroke="${FACE_STROKE}" stroke-width="${sw * 1.25}" stroke-linecap="round"/>
    </g>`;
    // boca
    mouth = `<g class="cMouth">
      <path d="M${cx - 7 * scale} ${mouthY + 3 * scale} Q${cx} ${mouthY - 4 * scale} ${cx + 7 * scale} ${mouthY + 3 * scale}"
            fill="none" stroke="${FACE_STROKE}" stroke-width="${sw}" stroke-linecap="round"/>
    </g>`;
    // vapor
    extra = `<path d="M${lx - 4 * scale} ${cy - 38 * scale} q${-3 * scale} ${-5 * scale} 0 ${-9 * scale} q${3 * scale} ${4 * scale} 0 ${9 * scale} z" fill="#C7C7C7" stroke="${FACE_STROKE}" stroke-width="${1.4 * scale}" opacity="0.85"/>` +
            `<path d="M${rx + 2 * scale} ${cy - 40 * scale} q${-2.5 * scale} ${-4 * scale} 0 ${-7 * scale} q${2.5 * scale} ${3 * scale} 0 ${7 * scale} z" fill="#C7C7C7" stroke="${FACE_STROKE}" stroke-width="${1.2 * scale}" opacity="0.7"/>`;
  } else if (emotion === "scared") {
    // ojos grandes
    eyes = `<g class="cEyes">
      <circle cx="${lx}" cy="${eyeY}" r="${eyeR * 1.05}" fill="#ffffff" stroke="${FACE_STROKE}" stroke-width="${sw * 0.7}"/>
      <circle cx="${rx}" cy="${eyeY}" r="${eyeR * 1.05}" fill="#ffffff" stroke="${FACE_STROKE}" stroke-width="${sw * 0.7}"/>
      <circle cx="${lx}" cy="${eyeY}" r="${eyeR * 0.48}" fill="${FACE_STROKE}"/>
      <circle cx="${rx}" cy="${eyeY}" r="${eyeR * 0.48}" fill="${FACE_STROKE}"/>
      <ellipse cx="${lx + 2 * scale}" cy="${eyeY - 3 * scale}" rx="${2 * scale}" ry="${3 * scale}" fill="#ffffff"/>
      <ellipse cx="${rx + 2 * scale}" cy="${eyeY - 3 * scale}" rx="${2 * scale}" ry="${3 * scale}" fill="#ffffff"/>
    </g>`;
    brows = `<g class="cBrows">
      <path d="M${lx - 8 * scale} ${eyeY - 14 * scale} L${lx + 8 * scale} ${eyeY - 20 * scale}" stroke="${FACE_STROKE}" stroke-width="${sw}" stroke-linecap="round"/>
      <path d="M${rx - 8 * scale} ${eyeY - 20 * scale} L${rx + 8 * scale} ${eyeY - 14 * scale}" stroke="${FACE_STROKE}" stroke-width="${sw}" stroke-linecap="round"/>
    </g>`;
    mouth = `<g class="cMouth">
      <ellipse cx="${cx}" cy="${mouthY + 2 * scale}" rx="${4 * scale}" ry="${5 * scale}" fill="${FACE_STROKE}"/>
    </g>`;
    // gotita de sudor
    extra = `<path d="M${rx + 13 * scale} ${eyeY - 12 * scale} q${-3 * scale} ${5 * scale} 0 ${8 * scale} q${3 * scale} ${-3 * scale} 0 ${-8 * scale} z"
            fill="#7CC7FF" stroke="${FACE_STROKE}" stroke-width="${1.5 * scale}"/>`;
  } else if (emotion === "surprised") {
    // ojos enormes
    eyes = `<g class="cEyes">
      <circle cx="${lx}" cy="${eyeY}" r="${eyeR * 1.15}" fill="#ffffff" stroke="${FACE_STROKE}" stroke-width="${sw * 0.7}"/>
      <circle cx="${rx}" cy="${eyeY}" r="${eyeR * 1.15}" fill="#ffffff" stroke="${FACE_STROKE}" stroke-width="${sw * 0.7}"/>
      <circle cx="${lx}" cy="${eyeY}" r="${eyeR * 0.45}" fill="${FACE_STROKE}"/>
      <circle cx="${rx}" cy="${eyeY}" r="${eyeR * 0.45}" fill="${FACE_STROKE}"/>
      <ellipse cx="${lx - 1 * scale}" cy="${eyeY - 2 * scale}" rx="${1.5 * scale}" ry="${2.5 * scale}" fill="#ffffff"/>
      <ellipse cx="${rx - 1 * scale}" cy="${eyeY - 2 * scale}" rx="${1.5 * scale}" ry="${2.5 * scale}" fill="#ffffff"/>
    </g>`;
    brows = `<g class="cBrows">
      <path d="M${lx - 10 * scale} ${eyeY - 19 * scale} Q${lx} ${eyeY - 25 * scale} ${lx + 10 * scale} ${eyeY - 19 * scale}" stroke="${FACE_STROKE}" stroke-width="${sw}" stroke-linecap="round" fill="none"/>
      <path d="M${rx - 10 * scale} ${eyeY - 19 * scale} Q${rx} ${eyeY - 25 * scale} ${rx + 10 * scale} ${eyeY - 19 * scale}" stroke="${FACE_STROKE}" stroke-width="${sw}" stroke-linecap="round" fill="none"/>
    </g>`;
    mouth = `<g class="cMouth">
      <ellipse cx="${cx}" cy="${mouthY + 2 * scale}" rx="${6 * scale}" ry="${7 * scale}" fill="${FACE_STROKE}"/>
    </g>`;
    extra = _msSparkle(cx - 30 * scale, cy - 26 * scale, "#FFD23F") +
            _msSparkle(cx + 30 * scale, cy - 22 * scale, "#FF5DA2") +
            _msSparkle(cx + 2 * scale, cy - 36 * scale, "#fff");
  } else if (emotion === "disgust") {
    // ojos cerrados de asco
    eyes = `<g class="cEyes">
      <path d="M${lx - 9 * scale} ${eyeY + 1 * scale} Q${lx} ${eyeY - 7 * scale} ${lx + 9 * scale} ${eyeY + 1 * scale}" stroke="${FACE_STROKE}" stroke-width="${sw * 0.9}" stroke-linecap="round" fill="none"/>
      <path d="M${rx - 9 * scale} ${eyeY + 1 * scale} Q${rx} ${eyeY - 7 * scale} ${rx + 9 * scale} ${eyeY + 1 * scale}" stroke="${FACE_STROKE}" stroke-width="${sw * 0.9}" stroke-linecap="round" fill="none"/>
    </g>`;
    brows = `<g class="cBrows">
      <path d="M${lx - 10 * scale} ${eyeY - 16 * scale} L${lx + 10 * scale} ${eyeY - 11 * scale}" stroke="${FACE_STROKE}" stroke-width="${sw}" stroke-linecap="round"/>
      <path d="M${rx - 10 * scale} ${eyeY - 11 * scale} L${rx + 10 * scale} ${eyeY - 16 * scale}" stroke="${FACE_STROKE}" stroke-width="${sw}" stroke-linecap="round"/>
    </g>`;
    mouth = `<g class="cMouth">
      <path d="M${cx - 10 * scale} ${mouthY + 2 * scale} Q${cx - 4 * scale} ${mouthY - 4 * scale} ${cx} ${mouthY + 2 * scale} Q${cx + 4 * scale} ${mouthY + 6 * scale} ${cx + 10 * scale} ${mouthY + 2 * scale}"
            stroke="${FACE_STROKE}" stroke-width="${sw}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </g>`;
    // lengua
    extra = `<path d="M${cx + 4 * scale} ${mouthY + 5 * scale} q${4 * scale} ${4 * scale} ${1 * scale} ${8 * scale} q${-5 * scale} ${-2 * scale} ${-3 * scale} ${-7 * scale} z"
            fill="#FF8FB0" stroke="${FACE_STROKE}" stroke-width="${1.5 * scale}"/>`;
  } else {
    mouth = `<g class="cMouth">
      <line x1="${cx - 7 * scale}" y1="${mouthY}" x2="${cx + 7 * scale}" y2="${mouthY}" stroke="${FACE_STROKE}" stroke-width="${sw}" stroke-linecap="round"/>
    </g>`;
  }
  return brows + eyes + mouth + extra;
}

// destello
function _msSparkle(cx, cy, color) {
  return `<path d="M${cx} ${cy - 6} l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2 z" fill="${color}"/>`;
}

// solecito (alegria)
function _mascotSun(mood) {
  const c = "#FFC93C";
  const dark = "#E89B1F";
  const id = uniqueId("sn");
  const bodyG = "bg-" + id;
  // rayos
  let rays = "";
  for (let i = 0; i < 10; i++) {
    const ang = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const s = Math.sin(ang), co = Math.cos(ang);
    const inX = (70 + co * 44).toFixed(1);
    const inY = (70 + s * 44).toFixed(1);
    const outX = (70 + co * 62).toFixed(1);
    const outY = (70 + s * 62).toFixed(1);
    rays += `<line x1="${inX}" y1="${inY}" x2="${outX}" y2="${outY}" stroke="${dark}" stroke-width="10" stroke-linecap="round"/>` +
            `<line x1="${inX}" y1="${inY}" x2="${outX}" y2="${outY}" stroke="${c}" stroke-width="6" stroke-linecap="round"/>`;
  }
  return `<svg viewBox="0 0 140 140" class="MascotSvg" role="img" aria-hidden="true">
    <defs>
      <radialGradient id="${bodyG}" cx="36%" cy="32%" r="78%">
        <stop offset="0%" stop-color="#FFF6BD"/>
        <stop offset="65%" stop-color="${c}"/>
        <stop offset="100%" stop-color="${dark}"/>
      </radialGradient>
    </defs>
    <!-- halo -->
    <circle cx="70" cy="72" r="68" fill="#FFE08A" opacity="0.22"/>
    <!-- sombra -->
    <ellipse cx="70" cy="130" rx="36" ry="5" fill="#000" opacity="0.13"/>
    ${rays}
    <!-- cuepo -->
    <circle cx="70" cy="72" r="40" fill="url(#${bodyG})" stroke="${FACE_STROKE}" stroke-width="4"/>
    <!-- brillo -->
    <ellipse cx="54" cy="56" rx="14" ry="10" fill="#fff" opacity="0.55"/>
    <ellipse cx="48" cy="52" rx="5" ry="3.5" fill="#fff" opacity="0.95"/>
    <!-- mejilas -->
    <ellipse cx="40" cy="84" rx="9" ry="6" fill="#FFAEC2"/>
    <ellipse cx="100" cy="84" rx="9" ry="6" fill="#FFAEC2"/>
    ${mascotFace(mood === "cheer" || mood === "oops" ? mood : "happy", c, 70, 70)}
  </svg>`;
}

// nubecita (tristeza)
function _mascotCloud(mood) {
  const c = "#EAF1F8";
  const dark = "#B7C5DB";
  const id = uniqueId("cl");
  const bodyG = "bg-" + id;
  return `<svg viewBox="0 0 140 140" class="MascotSvg" role="img" aria-hidden="true">
    <defs>
      <radialGradient id="${bodyG}" cx="40%" cy="34%" r="82%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="65%" stop-color="${c}"/>
        <stop offset="100%" stop-color="${dark}"/>
      </radialGradient>
    </defs>
    <!-- sombra -->
    <ellipse cx="70" cy="124" rx="46" ry="5" fill="#000" opacity="0.13"/>
    <!-- goticas (pies) -->
    <path d="M46 92 q -7 12 0 18 q 7 -6 0 -18 z" fill="#7CC7FF" stroke="${FACE_STROKE}" stroke-width="2.5"/>
    <ellipse cx="49" cy="98" rx="1.5" ry="2.4" fill="#fff" opacity="0.85"/>
    <path d="M94 92 q -7 12 0 18 q 7 -6 0 -18 z" fill="#7CC7FF" stroke="${FACE_STROKE}" stroke-width="2.5"/>
    <ellipse cx="97" cy="98" rx="1.5" ry="2.4" fill="#fff" opacity="0.85"/>
    <!-- cuepo de nube -->
    <path d="M28 92
      C 12 92, 14 70, 30 68
      C 30 50, 56 48, 60 62
      C 62 38, 96 38, 100 62
      C 118 60, 124 88, 110 92 Z"
      fill="url(#${bodyG})" stroke="${FACE_STROKE}" stroke-width="4" stroke-linejoin="round"/>
    <!-- brillos -->
    <ellipse cx="44" cy="58" rx="12" ry="6" fill="#fff" opacity="0.7"/>
    <ellipse cx="38" cy="54" rx="4" ry="2.5" fill="#fff" opacity="0.95"/>
    <!-- mejilas -->
    <ellipse cx="38" cy="80" rx="8" ry="5.5" fill="#A6B8D2" opacity="0.7"/>
    <ellipse cx="102" cy="80" rx="8" ry="5.5" fill="#A6B8D2" opacity="0.7"/>
    ${mascotFace(mood === "cheer" || mood === "oops" ? mood : "sad", c, 70, 72, 0.85)}
  </svg>`;
}

// dragoncito (enojo)
function _mascotDragon(mood) {
  const c = "#E63946";
  const dark = "#A8202E";
  const light = "#FF6F7A";
  const bellyC = "#FFE4D0";
  const bellyDark = "#F0B8A0";
  const flame = "#FFA94D";
  const id = uniqueId("dr");
  const bodyG = "bg-" + id;
  const bellyG = "by-" + id;
  return `<svg viewBox="0 0 140 140" class="MascotSvg" role="img" aria-hidden="true">
    <defs>
      <radialGradient id="${bodyG}" cx="34%" cy="30%" r="78%">
        <stop offset="0%" stop-color="${light}"/>
        <stop offset="60%" stop-color="${c}"/>
        <stop offset="100%" stop-color="${dark}"/>
      </radialGradient>
      <radialGradient id="${bellyG}" cx="50%" cy="32%" r="72%">
        <stop offset="0%" stop-color="#FFFAEC"/>
        <stop offset="100%" stop-color="${bellyDark}"/>
      </radialGradient>
    </defs>
    <!-- sombra -->
    <ellipse cx="70" cy="128" rx="38" ry="5" fill="#000" opacity="0.16"/>
    <!-- alitas -->
    <ellipse cx="22" cy="78" rx="14" ry="20" fill="${dark}" stroke="${FACE_STROKE}" stroke-width="3" transform="rotate(-20 22 78)"/>
    <ellipse cx="118" cy="78" rx="14" ry="20" fill="${dark}" stroke="${FACE_STROKE}" stroke-width="3" transform="rotate(20 118 78)"/>
    <!-- cola con llama -->
    <path d="M110 110 Q 128 112 126 126 Q 116 120 106 116 Z" fill="${dark}" stroke="${FACE_STROKE}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M126 124 Q 134 114 128 102 Q 124 112 120 114 Q 122 120 126 124 Z" fill="${flame}" stroke="${FACE_STROKE}" stroke-width="2"/>
    <!-- cuernos -->
    <path d="M54 42 L 50 24 Q 60 28 62 40 Z" fill="${dark}" stroke="${FACE_STROKE}" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M86 42 L 90 24 Q 80 28 78 40 Z" fill="${dark}" stroke="${FACE_STROKE}" stroke-width="2.5" stroke-linejoin="round"/>
    <!-- cuepo -->
    <circle cx="70" cy="78" r="40" fill="url(#${bodyG})" stroke="${FACE_STROKE}" stroke-width="4"/>
    <!-- panza -->
    <ellipse cx="70" cy="94" rx="24" ry="18" fill="url(#${bellyG})"/>
    <!-- brillo -->
    <ellipse cx="54" cy="62" rx="13" ry="9" fill="#fff" opacity="0.55"/>
    <ellipse cx="48" cy="58" rx="5" ry="3.5" fill="#fff" opacity="0.95"/>
    <!-- mejilas -->
    <ellipse cx="42" cy="84" rx="8" ry="5.5" fill="#FF6F8A" opacity="0.85"/>
    <ellipse cx="98" cy="84" rx="8" ry="5.5" fill="#FF6F8A" opacity="0.85"/>
    ${mascotFace(mood === "cheer" || mood === "oops" ? mood : "angry", c, 70, 76)}
  </svg>`;
}

// fantasmita (miedo)
function _mascotGhost(mood) {
  const c = "#D4CCEF";
  const dark = "#9484C9";
  const id = uniqueId("gh");
  const bodyG = "bg-" + id;
  return `<svg viewBox="0 0 140 140" class="MascotSvg" role="img" aria-hidden="true">
    <defs>
      <radialGradient id="${bodyG}" cx="40%" cy="26%" r="82%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="60%" stop-color="${c}"/>
        <stop offset="100%" stop-color="${dark}"/>
      </radialGradient>
    </defs>
    <!-- sombra -->
    <ellipse cx="70" cy="130" rx="36" ry="4.5" fill="#000" opacity="0.12"/>
    <!-- halo -->
    <ellipse cx="70" cy="70" rx="60" ry="58" fill="${c}" opacity="0.25"/>
    <!-- cuepo del fantasma -->
    <path d="M26 70
      Q 26 22 70 22
      Q 114 22 114 70
      L 114 112
      Q 100 118 90 108
      Q 78 120 70 108
      Q 58 120 50 108
      Q 36 118 26 112
      Z"
      fill="url(#${bodyG})" stroke="${FACE_STROKE}" stroke-width="4" stroke-linejoin="round"/>
    <!-- brazos -->
    <ellipse cx="22" cy="80" rx="8" ry="12" fill="${dark}" stroke="${FACE_STROKE}" stroke-width="3"/>
    <ellipse cx="118" cy="80" rx="8" ry="12" fill="${dark}" stroke="${FACE_STROKE}" stroke-width="3"/>
    <!-- brillo -->
    <ellipse cx="50" cy="42" rx="16" ry="10" fill="#fff" opacity="0.7"/>
    <ellipse cx="44" cy="38" rx="6" ry="4" fill="#fff" opacity="0.95"/>
    <!-- mejilas -->
    <ellipse cx="42" cy="76" rx="8" ry="5" fill="#D5A8DA" opacity="0.85"/>
    <ellipse cx="98" cy="76" rx="8" ry="5" fill="#D5A8DA" opacity="0.85"/>
    ${mascotFace(mood === "cheer" || mood === "oops" ? mood : "scared", c, 70, 64)}
  </svg>`;
}

// estrellita (sorpresa)
function _mascotStar(mood) {
  const c = "#1FC8C8";
  const dark = "#0F9494";
  const light = "#A0F0F0";
  const id = uniqueId("st");
  const bodyG = "bg-" + id;
  // estrlla de 5 puntas (chunky pa q los ojos quepan)
  const cx = 70, cy = 74, R = 52, r = 34;
  let starPath = "";
  for (let i = 0; i < 10; i++) {
    const ang = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const rad = i % 2 === 0 ? R : r;
    const px = (cx + Math.cos(ang) * rad).toFixed(1);
    const py = (cy + Math.sin(ang) * rad).toFixed(1);
    starPath += (i === 0 ? "M" : "L") + px + " " + py + " ";
  }
  starPath += "Z";
  return `<svg viewBox="0 0 140 140" class="MascotSvg" role="img" aria-hidden="true">
    <defs>
      <radialGradient id="${bodyG}" cx="36%" cy="28%" r="82%">
        <stop offset="0%" stop-color="${light}"/>
        <stop offset="60%" stop-color="${c}"/>
        <stop offset="100%" stop-color="${dark}"/>
      </radialGradient>
    </defs>
    <!-- sombra -->
    <ellipse cx="70" cy="132" rx="36" ry="4.5" fill="#000" opacity="0.14"/>
    <!-- halo -->
    <circle cx="70" cy="74" r="62" fill="${c}" opacity="0.18"/>
    <!-- destellos -->
    ${_msSparkle(18, 30, "#FFD23F")}
    ${_msSparkle(120, 28, "#FF5DA2")}
    ${_msSparkle(122, 116, "#FFD23F")}
    ${_msSparkle(18, 112, "#FF5DA2")}
    ${_msSparkle(70, 12, "#fff")}
    <!-- estrella -->
    <path d="${starPath}" fill="url(#${bodyG})" stroke="${FACE_STROKE}" stroke-width="4" stroke-linejoin="round"/>
    <!-- brillo -->
    <ellipse cx="54" cy="58" rx="14" ry="9" fill="#fff" opacity="0.65"/>
    <ellipse cx="48" cy="54" rx="5" ry="3" fill="#fff" opacity="0.95"/>
    <!-- mejilas -->
    <ellipse cx="46" cy="86" rx="7" ry="5" fill="#FF8FA3" opacity="0.85"/>
    <ellipse cx="94" cy="86" rx="7" ry="5" fill="#FF8FA3" opacity="0.85"/>
    ${mascotFace(mood === "cheer" || mood === "oops" ? mood : "surprised", c, 70, 74, 0.85)}
  </svg>`;
}

// hongo (asco)
function _mascotMushroom(mood) {
  const capC = "#D04B45";
  const capDark = "#9A2D28";
  const capLight = "#F08882";
  const stemC = "#FFF3D9";
  const stemDark = "#E8D5A6";
  const id = uniqueId("mu");
  const capG = "cg-" + id;
  const stemG = "sg-" + id;
  return `<svg viewBox="0 0 140 140" class="MascotSvg" role="img" aria-hidden="true">
    <defs>
      <radialGradient id="${capG}" cx="38%" cy="28%" r="78%">
        <stop offset="0%" stop-color="${capLight}"/>
        <stop offset="60%" stop-color="${capC}"/>
        <stop offset="100%" stop-color="${capDark}"/>
      </radialGradient>
      <radialGradient id="${stemG}" cx="50%" cy="30%" r="80%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="${stemDark}"/>
      </radialGradient>
    </defs>
    <!-- sombra -->
    <ellipse cx="70" cy="132" rx="34" ry="5" fill="#000" opacity="0.16"/>
    <!-- hojita verde -->
    <path d="M92 122 q 14 -2 20 -12 q -10 -4 -18 6 z" fill="#5BAE4F" stroke="${FACE_STROKE}" stroke-width="2"/>
    <!-- tallo -->
    <path d="M46 78 L 46 116 Q 46 130 60 130 L 80 130 Q 94 130 94 116 L 94 78 Z"
          fill="url(#${stemG})" stroke="${FACE_STROKE}" stroke-width="4" stroke-linejoin="round"/>
    <!-- sombrero -->
    <path d="M14 80 Q 14 22 70 22 Q 126 22 126 80 Q 126 92 114 92 L 26 92 Q 14 92 14 80 Z"
          fill="url(#${capG})" stroke="${FACE_STROKE}" stroke-width="4" stroke-linejoin="round"/>
    <!-- puntos blancos -->
    <circle cx="36" cy="58" r="9" fill="#fff" stroke="${FACE_STROKE}" stroke-width="2"/>
    <circle cx="70" cy="40" r="11" fill="#fff" stroke="${FACE_STROKE}" stroke-width="2"/>
    <circle cx="102" cy="56" r="9" fill="#fff" stroke="${FACE_STROKE}" stroke-width="2"/>
    <circle cx="52" cy="76" r="5" fill="#fff" stroke="${FACE_STROKE}" stroke-width="1.5"/>
    <circle cx="88" cy="78" r="5" fill="#fff" stroke="${FACE_STROKE}" stroke-width="1.5"/>
    <!-- brillo -->
    <ellipse cx="46" cy="42" rx="14" ry="8" fill="#fff" opacity="0.45"/>
    <ellipse cx="40" cy="38" rx="5" ry="3" fill="#fff" opacity="0.85"/>
    <!-- mejilas -->
    <ellipse cx="54" cy="108" rx="6" ry="4.5" fill="#FF8FA3" opacity="0.85"/>
    <ellipse cx="86" cy="108" rx="6" ry="4.5" fill="#FF8FA3" opacity="0.85"/>
    ${mascotFace(mood === "cheer" || mood === "oops" ? mood : "disgust", capC, 70, 104, 0.72)}
  </svg>`;
}

// dragoncito grande del menu de incio
function drawHero(mood) {
  mood = mood || "happy";
  const c = "#E63946";
  const dark = "#A8202E";
  const light = "#FF7080";
  const bellyDark = "#F0B8A0";
  const flame = "#FFA94D";
  const id = uniqueId("hr");
  const bodyG = "bg-" + id;
  const bellyG = "by-" + id;
  return `<svg viewBox="0 0 220 200" class="MascotSvg HeroSvg" role="img" aria-hidden="true">
    <defs>
      <radialGradient id="${bodyG}" cx="32%" cy="28%" r="82%">
        <stop offset="0%" stop-color="${light}"/>
        <stop offset="60%" stop-color="${c}"/>
        <stop offset="100%" stop-color="${dark}"/>
      </radialGradient>
      <radialGradient id="${bellyG}" cx="50%" cy="32%" r="72%">
        <stop offset="0%" stop-color="#FFFAEC"/>
        <stop offset="100%" stop-color="${bellyDark}"/>
      </radialGradient>
    </defs>
    <!-- sombra -->
    <ellipse cx="110" cy="188" rx="58" ry="8" fill="#000" opacity="0.18"/>
    <!-- destellos -->
    ${_msSparkle(22, 32, "#FFD23F")}
    ${_msSparkle(198, 40, "#FFE08A")}
    ${_msSparkle(28, 156, "#FF8FA3")}
    ${_msSparkle(202, 160, "#FFD23F")}
    ${_msSparkle(110, 14, "#fff")}
    <!-- alitas -->
    <ellipse cx="38" cy="106" rx="24" ry="34" fill="${dark}" stroke="${FACE_STROKE}" stroke-width="4" transform="rotate(-22 38 106)"/>
    <ellipse cx="38" cy="98" rx="10" ry="14" fill="${c}" opacity="0.55" transform="rotate(-22 38 98)"/>
    <ellipse cx="182" cy="106" rx="24" ry="34" fill="${dark}" stroke="${FACE_STROKE}" stroke-width="4" transform="rotate(22 182 106)"/>
    <ellipse cx="182" cy="98" rx="10" ry="14" fill="${c}" opacity="0.55" transform="rotate(22 182 98)"/>
    <!-- cola con llama -->
    <path d="M164 134 Q 196 132 196 162 Q 182 154 158 148 Z" fill="${dark}" stroke="${FACE_STROKE}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M194 158 Q 210 144 204 122 Q 198 138 188 142 Q 192 152 194 158 Z" fill="${flame}" stroke="${FACE_STROKE}" stroke-width="2.5"/>
    <path d="M198 150 q -4 -8 -2 -14 q 6 6 4 14 z" fill="#FFD23F"/>
    <!-- cuernos -->
    <path d="M82 58 L 74 26 Q 90 32 94 54 Z" fill="${dark}" stroke="${FACE_STROKE}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M138 58 L 146 26 Q 130 32 126 54 Z" fill="${dark}" stroke="${FACE_STROKE}" stroke-width="3" stroke-linejoin="round"/>
    <!-- cuepo -->
    <circle cx="110" cy="110" r="60" fill="url(#${bodyG})" stroke="${FACE_STROKE}" stroke-width="5"/>
    <!-- panza -->
    <ellipse cx="110" cy="134" rx="34" ry="24" fill="url(#${bellyG})"/>
    <!-- brillo -->
    <ellipse cx="86" cy="82" rx="22" ry="14" fill="#fff" opacity="0.55"/>
    <ellipse cx="76" cy="76" rx="8" ry="5" fill="#fff" opacity="0.98"/>
    <!-- mejilas -->
    <ellipse cx="72" cy="124" rx="13" ry="9" fill="#FF6F8A" opacity="0.9"/>
    <ellipse cx="148" cy="124" rx="13" ry="9" fill="#FF6F8A" opacity="0.9"/>
    ${mascotFace(mood === "cheer" || mood === "oops" ? mood : "happy", c, 110, 106, 1.5)}
  </svg>`;
}

// forma de la isla por mundo
function islandShape(id) {
  switch (id) {
    case "sadness":
      return { d: "M24 72 C 22 148, 60 184, 95 184 C 130 184, 168 148, 166 72 C 120 104, 70 104, 24 72 Z", sh: "M95 102 C 132 104, 154 86, 166 72 C 168 148, 130 184, 95 184 Z", grx: 80 };
    case "anger":
      return { d: "M44 72 C 50 134, 88 200, 95 204 C 102 200, 140 134, 146 72 C 118 100, 72 100, 44 72 Z", sh: "M95 98 C 118 100, 134 88, 146 72 C 140 134, 102 200, 95 204 Z", grx: 68 };
    case "fear":
      return { d: "M18 72 C 22 116, 56 140, 62 160 C 70 184, 120 184, 128 160 C 134 140, 168 116, 172 72 C 120 104, 70 104, 18 72 Z", sh: "M95 100 C 132 104, 154 86, 172 72 C 168 116, 134 140, 128 160 C 120 184, 95 184, 95 160 Z", grx: 86 };
    case "surprise":
      return { d: "M30 74 L52 128 L95 202 L138 128 L160 74 C 120 102, 70 102, 30 74 Z", sh: "M95 102 C 120 102, 142 90, 160 74 L138 128 L95 202 Z", grx: 80, facets: true };
    case "disgust":
      return { d: "M24 72 C 22 128, 44 150, 54 156 C 58 168, 70 168, 74 156 C 80 148, 90 168, 96 168 C 102 168, 112 148, 118 156 C 122 168, 134 168, 138 156 C 148 150, 168 128, 166 72 C 120 104, 70 104, 24 72 Z", sh: "M95 102 C 132 104, 154 86, 166 72 C 168 128, 148 150, 138 156 C 134 168, 122 168, 118 156 C 112 148, 102 168, 96 168 Z", grx: 80 };
    default:
      return { d: "M26 72 C 32 126, 66 176, 95 192 C 124 176, 158 126, 164 72 C 124 104, 66 104, 26 72 Z", sh: "M95 100 C 124 104, 150 88, 164 72 C 158 126, 124 176, 95 192 Z", grx: 78 };
  }
}

// dibuja la isla flotante
function drawIsland(id, accent) {
  const a = accent || "#6BCB77";
  const s = islandShape(id);
  const grx = s.grx;

  // tiño el cesped segn el mundo
  const EMO = { joy: "happy", sadness: "sad", anger: "angry", fear: "scared", surprise: "surprised", disgust: "disgust" };
  const emoColor = EMOTION_COLORS[EMO[id]] || a;
  const gDark = mixHex("#3f8a38", emoColor, 0.62);
  const gMain = mixHex("#5fb050", emoColor, 0.6);
  const gLight = mixHex("#9ad97f", emoColor, 0.5);
  const gBlade = mixHex("#2f6e2c", emoColor, 0.6);

  // matitas de pasto
  let tufts = "";
  const n = 10;
  const x0 = 95 - grx + 6;
  const step = (2 * (grx - 6)) / (n - 1);
  for (let i = 0; i < n; i++) {
    const tx = (x0 + i * step).toFixed(1);
    const ty = 66 + (i % 2 ? 5 : 0);
    tufts += `<circle cx="${tx}" cy="${ty}" r="10" fill="${gDark}"/>`;
  }

  return `
    <svg viewBox="0 0 190 205" class="IslandSvg" aria-hidden="true">
      <!-- piedritas -->
      <ellipse cx="26" cy="172" rx="8" ry="5" fill="#9a6b43" opacity="0.7"/>
      <ellipse cx="164" cy="182" rx="7" ry="5" fill="#9a6b43" opacity="0.6"/>
      <!-- tierra -->
      <path d="${s.d}" fill="#9a6b43"/>
      <path d="${s.sh}" fill="#7c5635" opacity="0.9"/>
      <!-- mas piedritas -->
      <ellipse cx="82" cy="112" rx="9" ry="6" fill="#7c5635" opacity="0.5"/>
      <ellipse cx="104" cy="128" rx="7" ry="5" fill="#b0815a" opacity="0.5"/>
      <!-- raices -->
      <path d="M48 82 q -5 16 1 30" stroke="${gDark}" stroke-width="3.5" fill="none"/>
      <circle cx="49" cy="114" r="4" fill="${gMain}"/>
      <path d="M142 82 q 5 16 -1 30" stroke="${gDark}" stroke-width="3.5" fill="none"/>
      <circle cx="140" cy="116" r="4" fill="${gMain}"/>
      <!-- playa -->
      <ellipse cx="95" cy="76" rx="${grx + 6}" ry="26" fill="#EAD8AC"/>
      <ellipse cx="95" cy="80" rx="${grx + 6}" ry="20" fill="#DCC796"/>
      <!-- cesped -->
      <ellipse cx="95" cy="60" rx="${grx + 4}" ry="26" fill="${gDark}"/>
      ${tufts}
      <ellipse cx="95" cy="56" rx="${grx}" ry="23" fill="${gMain}"/>
      <ellipse cx="80" cy="50" rx="${Math.max(30, grx - 24)}" ry="14" fill="${gLight}" opacity="0.75"/>
      <circle cx="${(95 - grx + 12).toFixed(0)}" cy="56" r="8" fill="${gDark}"/>
      <circle cx="${(95 + grx - 14).toFixed(0)}" cy="58" r="7" fill="${gDark}"/>
      ${grassBlades(grx, gBlade)}
      ${islandProps(id, a)}
    </svg>`;
}

// detalls encima del cesped
function islandProps(id, a) {
  switch (id) {
    case "joy":
      return sunflower(38, 46) +
        tinyFlower(150, 54, "#FF5DA2") + tinyFlower(58, 60, "#FF8C42") +
        `<g class="i-flutter"><ellipse cx="150" cy="24" rx="5" ry="7" fill="${a}"/><ellipse cx="159" cy="24" rx="5" ry="7" fill="${a}"/><line x1="154.5" y1="18" x2="154.5" y2="30" stroke="#5a4030" stroke-width="2"/></g>` +
        `<path class="i-tw" d="M120 30 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2 z" fill="#FFE08A"/>`;
    case "sadness":
      return `<ellipse cx="148" cy="22" rx="20" ry="11" fill="#9FB3D8"/><ellipse cx="136" cy="24" rx="11" ry="9" fill="#9FB3D8"/><ellipse cx="160" cy="24" rx="11" ry="9" fill="#9FB3D8"/>` +
        `<line class="i-drop" x1="138" y1="32" x2="138" y2="38" stroke="#5B8DEF" stroke-width="3" stroke-linecap="round"/>` +
        `<line class="i-drop" style="animation-delay:.35s" x1="150" y1="32" x2="150" y2="38" stroke="#5B8DEF" stroke-width="3" stroke-linecap="round"/>` +
        `<line class="i-drop" style="animation-delay:.7s" x1="162" y1="32" x2="162" y2="38" stroke="#5B8DEF" stroke-width="3" stroke-linecap="round"/>` +
        sunflower(40, 48, "#7FA8E8") + tinyFlower(120, 58, "#9AA7C7") +
        `<ellipse cx="86" cy="62" rx="13" ry="4" fill="#7FA8E8" opacity="0.55"/>`;
    case "anger":
      return `<path d="M26 60 L44 28 L62 60 Z" fill="#7a4a3a"/><path d="M34 41 L44 28 L54 41 Q44 49 34 41 Z" fill="#FF7B54"/>` +
        `<circle class="i-smoke" cx="44" cy="26" r="5" fill="#cfc4be" opacity="0.55"/>` +
        `<circle class="i-smoke" style="animation-delay:1.2s" cx="49" cy="24" r="4" fill="#cfc4be" opacity="0.5"/>` +
        `<path d="M118 58 l8 -5 -3 7 7 -2" stroke="#FF7B54" stroke-width="2.5" fill="none" stroke-linecap="round"/>` +
        `<ellipse cx="150" cy="60" rx="9" ry="6" fill="#6e4527"/><ellipse cx="148" cy="58" rx="4" ry="3" fill="#8a5a40"/>`;
    case "fear":
      return `<circle cx="150" cy="22" r="12" fill="#FFE7A6"/><circle cx="146" cy="19" r="2.5" fill="#E9CE86"/><circle cx="153" cy="26" r="2" fill="#E9CE86"/>` +
        `<path class="i-tw" d="M30 24 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2 z" fill="#FFF3B0"/>` +
        `<path class="i-tw" style="animation-delay:1s" d="M126 14 l1.6 3 3 1.6 -3 1.6 -1.6 3 -1.6 -3 -3 -1.6 3 -1.6 z" fill="#FFF3B0"/>` +
        `<path class="i-tw" style="animation-delay:.5s" d="M40 40 l1.4 3 3 1.4 -3 1.4 -1.4 3 -1.4 -3 -3 -1.4 3 -1.4 z" fill="#FFF3B0"/>` +
        `<circle class="i-bub" cx="120" cy="56" r="3.5" fill="#FFF3B0" opacity="0.9"/>`;
    case "surprise":
      return `<rect x="30" y="40" width="22" height="18" rx="2" fill="${a}"/><rect x="38" y="40" width="6" height="18" fill="#fff" opacity="0.8"/><rect x="30" y="46" width="22" height="5" fill="#fff" opacity="0.6"/>` +
        `<circle cx="38" cy="38" r="3.5" fill="${a}"/><circle cx="44" cy="38" r="3.5" fill="${a}"/>` +
        `<path class="i-tw" d="M150 22 l2.4 5 5 2.4 -5 2.4 -2.4 5 -2.4 -5 -5 -2.4 5 -2.4 z" fill="${a}"/>` +
        `<path class="i-tw" style="animation-delay:.8s" d="M120 32 l1.8 4 4 1.8 -4 1.8 -1.8 4 -1.8 -4 -4 -1.8 4 -1.8 z" fill="#FFD23F"/>` +
        `<rect x="132" y="60" width="6" height="4" fill="#FF5DA2" transform="rotate(20 135 62)"/><rect x="150" y="58" width="6" height="4" fill="#1FC8C8" transform="rotate(-15 153 60)"/>`;
    case "disgust":
      return `<ellipse cx="38" cy="48" rx="9" ry="6" fill="#E0564E"/><rect x="35" y="48" width="6" height="9" rx="2" fill="#F2E6D0"/><circle cx="35" cy="46" r="1.6" fill="#fff"/><circle cx="41" cy="49" r="1.6" fill="#fff"/>` +
        `<ellipse cx="52" cy="52" rx="6" ry="4" fill="#C24B45"/><rect x="50" y="52" width="4" height="6" rx="1.5" fill="#F2E6D0"/>` +
        `<circle class="i-bub" cx="150" cy="44" r="6" fill="rgba(91,174,79,0.35)" stroke="#5BAE4F"/>` +
        `<ellipse cx="130" cy="62" rx="16" ry="5" fill="#6f9e4a" opacity="0.6"/>` +
        `<g class="i-flutter"><ellipse cx="120" cy="40" rx="3" ry="2" fill="#3a3540"/><line x1="117" y1="38" x2="123" y2="38" stroke="#3a3540" stroke-width="1"/></g>`;
    default:
      return "";
  }
}

// girasol
function sunflower(cx, cy, petal) {
  const p = petal || "#FFC93C";
  let petals = "";
  for (let i = 0; i < 8; i++) {
    const ang = (i / 8) * Math.PI * 2;
    const px = (cx + Math.cos(ang) * 10).toFixed(1);
    const py = (cy + Math.sin(ang) * 10).toFixed(1);
    petals += `<circle cx="${px}" cy="${py}" r="4.5" fill="${p}"/>`;
  }
  return `<g>${petals}<circle cx="${cx}" cy="${cy}" r="5.5" fill="#8a5a2b"/></g>`;
}

// florecita chiqita
function tinyFlower(cx, cy, color) {
  const c = color || "#FF5DA2";
  return `<g><circle cx="${cx - 4}" cy="${cy}" r="2.6" fill="${c}"/><circle cx="${cx + 4}" cy="${cy}" r="2.6" fill="${c}"/><circle cx="${cx}" cy="${cy - 4}" r="2.6" fill="${c}"/><circle cx="${cx}" cy="${cy + 4}" r="2.6" fill="${c}"/><circle cx="${cx}" cy="${cy}" r="2.6" fill="#FFE08A"/></g>`;
}

// matas de pasto
function grassBlades(grx, color) {
  const c = color || "#3f8a38";
  let out = "";
  const xs = [95 - grx + 18, 95 - grx + 34, 95, 95 + grx - 34, 95 + grx - 18];
  for (let i = 0; i < xs.length; i++) {
    const x = xs[i];
    out += `<path d="M${x} 64 q -3 -8 -1 -12 M${x} 64 q 3 -7 1 -11" stroke="${c}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  }
  return out;
}

// aclara/oscurece un hex
function shade(hex, t) {
  const n = hex.replace("#", "");
  let r = parseInt(n.substring(0, 2), 16);
  let g = parseInt(n.substring(2, 4), 16);
  let b = parseInt(n.substring(4, 6), 16);
  const f = (v) => Math.max(0, Math.min(255, Math.round(v + 255 * t)));
  r = f(r); g = f(g); b = f(b);
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

// mezcla dos hex
function mixHex(c1, c2, t) {
  const p = (h) => { const n = h.replace("#", ""); return [parseInt(n.substring(0, 2), 16), parseInt(n.substring(2, 4), 16), parseInt(n.substring(4, 6), 16)]; };
  const a = p(c1), b = p(c2);
  const m = a.map((v, i) => Math.round(v + (b[i] - v) * t));
  return "#" + m.map((v) => v.toString(16).padStart(2, "0")).join("");
}

// castillo del menu
function drawCastle() {
  // colores
  const stone = "#DCE3EE";
  const stoneDark = "#B6C0D4";
  const roof = "#3D4E73";
  const door = "#6B4523";
  const window_ = "#FFC93C";
  return `<svg viewBox="0 0 200 180" class="CastleSvg" aria-hidden="true">
    <!-- torres -->
    <rect x="22" y="76" width="40" height="84" fill="${stone}" stroke="${FACE_STROKE}" stroke-width="3"/>
    <rect x="138" y="76" width="40" height="84" fill="${stone}" stroke="${FACE_STROKE}" stroke-width="3"/>
    <!-- techos -->
    <path d="M16 76 L 42 32 L 68 76 Z" fill="${roof}" stroke="${FACE_STROKE}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M132 76 L 158 32 L 184 76 Z" fill="${roof}" stroke="${FACE_STROKE}" stroke-width="3" stroke-linejoin="round"/>
    <!-- banderas laterales -->
    <line x1="42" y1="32" x2="42" y2="14" stroke="${FACE_STROKE}" stroke-width="2"/>
    <path d="M42 14 L 58 18 L 42 22 Z" fill="#5B8DEF" stroke="${FACE_STROKE}" stroke-width="1.5"/>
    <line x1="158" y1="32" x2="158" y2="14" stroke="${FACE_STROKE}" stroke-width="2"/>
    <path d="M158 14 L 174 18 L 158 22 Z" fill="#5BAE4F" stroke="${FACE_STROKE}" stroke-width="1.5"/>
    <!-- muralla -->
    <rect x="62" y="106" width="76" height="54" fill="${stone}" stroke="${FACE_STROKE}" stroke-width="3"/>
    <!-- almenas -->
    <rect x="62" y="96" width="10" height="14" fill="${stone}" stroke="${FACE_STROKE}" stroke-width="2.5"/>
    <rect x="80" y="96" width="10" height="14" fill="${stone}" stroke="${FACE_STROKE}" stroke-width="2.5"/>
    <rect x="98" y="96" width="10" height="14" fill="${stone}" stroke="${FACE_STROKE}" stroke-width="2.5"/>
    <rect x="116" y="96" width="10" height="14" fill="${stone}" stroke="${FACE_STROKE}" stroke-width="2.5"/>
    <rect x="128" y="96" width="10" height="14" fill="${stone}" stroke="${FACE_STROKE}" stroke-width="2.5"/>
    <!-- torre central -->
    <rect x="80" y="58" width="40" height="50" fill="${stoneDark}" stroke="${FACE_STROKE}" stroke-width="3"/>
    <path d="M74 58 L 100 18 L 126 58 Z" fill="${roof}" stroke="${FACE_STROKE}" stroke-width="3" stroke-linejoin="round"/>
    <!-- bandera central -->
    <line x1="100" y1="18" x2="100" y2="2" stroke="${FACE_STROKE}" stroke-width="2"/>
    <path d="M100 2 L 118 8 L 100 14 Z" fill="#E63946" stroke="${FACE_STROKE}" stroke-width="1.5"/>
    <!-- ventanas -->
    <rect x="92" y="74" width="16" height="22" rx="8" fill="${window_}" stroke="${FACE_STROKE}" stroke-width="2"/>
    <rect x="34" y="100" width="14" height="18" rx="7" fill="${window_}" stroke="${FACE_STROKE}" stroke-width="2"/>
    <rect x="152" y="100" width="14" height="18" rx="7" fill="${window_}" stroke="${FACE_STROKE}" stroke-width="2"/>
    <!-- puerta -->
    <path d="M88 160 L 88 138 Q 88 124 100 124 Q 112 124 112 138 L 112 160 Z" fill="${door}" stroke="${FACE_STROKE}" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="106" cy="142" r="1.6" fill="#FFD23F"/>
  </svg>`;
}
