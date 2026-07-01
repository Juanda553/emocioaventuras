// aca vive todo el contenido del juego. el motor solo lee esto y arma las pantallas,
// asi q si el cliente quiere cambiar un texto o un reto se hace aca y listo, sin tocar engine.js

const GAME = {
  title: "EmociAventura – Misión Emociones: Aventura en el Reino",
  finalBadge: "Maestro del Reino de las Emociones",

  worlds: [

    // ---------------------------------------------------------------- mundo 1
    {
      id: "joy",
      name: "Mundo de la Alegría",
      palette: { primary: "#FFC93C", secondary: "#FF8C42", accent: "#6BCB77", bg: "#FFF6E0" },
      mascotColor: "#FFC93C",
      intro: "¡Bienvenido al Mundo de la Alegría! El reino ha perdido su luz brillante… Solo tú puedes ayudar a recuperarla completando los retos.",
      introButton: "Comenzar misión",
      badge: "Semilla de la Alegría",
      reward: "¡Felicidades! Has recuperado la Energía de la Alegría",
      challenges: [
        {
          type: "pick-face",
          title: "Descubre la alegría",
          instruction: "Haz clic en el niño que está feliz",
          options: [
            { emotion: "happy", correct: true },
            { emotion: "sad", correct: false },
            { emotion: "angry", correct: false },
            { emotion: "scared", correct: false }
          ],
          feedbackOk: "¡Muy bien! Has encontrado la alegría",
          feedbackError: "Intenta de nuevo, mira bien las caritas"
        },
        {
          type: "multi-select",
          title: "¿Cuándo me siento feliz?",
          instruction: "Selecciona las situaciones que te hacen sentir feliz",
          options: [
            { text: "Niño jugando", icon: "bi-balloon-heart", correct: true },
            { text: "Niño llorando", icon: "bi-cloud-rain", correct: false },
            { text: "Niño compartiendo", icon: "bi-people", correct: true }
          ],
          feedbackOk: "¡La alegría aparece cuando hacemos cosas que nos gustan!"
        },
        {
          // este es de expresion, todas las opciones valen, es puro refuerzo positvo
          type: "single-choice",
          title: "Expreso mi alegría",
          instruction: "Elige lo que te hace feliz",
          question: "¿Qué te hace feliz?",
          allCorrect: true,
          options: [
            { text: "Jugar", icon: "bi-controller", correct: true },
            { text: "Familia", icon: "bi-people-fill", correct: true },
            { text: "Amigos", icon: "bi-emoji-smile-fill", correct: true }
          ],
          feedbackOk: "¡Qué bonito! Todos sentimos alegría de formas diferentes"
        },
        {
          type: "story",
          title: "Comparto la alegría",
          instruction: "Tu amigo está triste… ¿qué haces?",
          situation: "Tu amigo está triste… ¿qué haces?",
          options: [
            { text: "Abrazarlo", icon: "bi-heart-fill", correct: true },
            { text: "Ignorarlo", icon: "bi-x-circle-fill", correct: false },
            { text: "Compartir un juguete", icon: "bi-gift-fill", correct: true }
          ],
          feedbackOk: "¡Compartir alegría hace el mundo mejor!",
          feedbackFinal: "¡Compartir alegría hace el mundo mejor!"
        }
      ]
    },

    // ---------------------------------------------------------------- mundo 2
    {
      id: "sadness",
      name: "Mundo de la Tristeza",
      palette: { primary: "#5B8DEF", secondary: "#9AA7C7", accent: "#B8A1E0", bg: "#EAF1FB" },
      mascotColor: "#5B8DEF",
      intro: "El cielo del reino está gris… Lee esta historia y ayuda a recuperar la calma.",
      introButton: "Leer el cuento",
      badge: "Nube que sana",
      reward: "La tristeza nos ayuda a expresar lo que sentimos… y no estamos solos",
      challenges: [
        {
          type: "audio-story",
          title: "Escucho y comprendo",
          instruction: "Escucha el cuento y luego responde",
          audio: "audio/nube.mp3",
          storyTitle: "La nube que no quería llorar",
          // texto completo por si el mp3 no esta, asi el juego no se traba
          storyText: "Había una vez una pequeña nube que vivía en el cielo del Reino de las Emociones. Era blanca, esponjosa y le gustaba flotar muy alto. Pero un día empezó a sentirse diferente: ya no quería jugar, ni moverse, ni brillar. Estaba triste, pero no lo entendía. Intentó esconderse detrás de otras nubes, pero la tristeza seguía ahí. Entonces una gotita cayó de su cuerpo, luego otra, y otra más: la nube estaba llorando. \"No quiero llorar\", dijo, \"llorar es feo\". Pero no pudo detener sus lágrimas. En ese momento, una nube grande y suave se acercó: \"Está bien llorar. A veces, llorar nos ayuda a sentirnos mejor. Cuando estás triste puedes llorar, puedes hablar y puedes pedir un abrazo\". La pequeña nube dejó de esconderse y lloró sin miedo. Poco a poco se sintió más ligera y tranquila, y ya no estaba sola. Entendió que la tristeza también es una emoción, que está bien sentirla, y que cuando la expresamos podemos sentirnos mejor. Y el cielo volvió a llenarse de calma y colores.",
          questions: [
            {
              question: "¿Cómo se sentía la nube?",
              options: [
                { text: "Feliz", icon: "bi-emoji-smile-fill", correct: false },
                { text: "Triste", icon: "bi-emoji-frown-fill", correct: true },
                { text: "Enojada", icon: "bi-emoji-angry-fill", correct: false }
              ]
            },
            {
              question: "¿Por qué estaba triste?",
              options: [
                { text: "Estaba sola", icon: "bi-person", correct: true },
                { text: "Estaba jugando", icon: "bi-controller", correct: false }
              ]
            },
            {
              question: "¿Qué hizo la nube?",
              options: [
                { text: "Lloró", icon: "bi-droplet-fill", correct: true },
                { text: "Se escondió", icon: "bi-eye-slash-fill", correct: false }
              ]
            },
            {
              question: "¿Qué la ayudó?",
              options: [
                { text: "Hablar con alguien", icon: "bi-chat-heart-fill", correct: true },
                { text: "Ignorar lo que sentía", icon: "bi-x-circle-fill", correct: false }
              ]
            }
          ],
          feedbackOk: "¡Muy bien! Entendiste la historia y la tristeza"
        },
        {
          type: "pick-face",
          title: "Caritas tristes",
          instruction: "Haz clic en quien está triste",
          options: [
            { emotion: "sad", correct: true },
            { emotion: "happy", correct: false },
            { emotion: "surprised", correct: false },
            { emotion: "angry", correct: false }
          ],
          feedbackOk: "¡Muy bien! Reconociste la tristeza",
          feedbackError: "Intenta de nuevo, mira bien las caritas"
        },
        {
          type: "single-choice",
          title: "Así me siento",
          instruction: "¿Qué hago cuando estoy triste?",
          question: "¿Qué hago cuando estoy triste?",
          options: [
            { text: "Lloro", icon: "bi-droplet-fill", correct: true },
            { text: "Busco ayuda", icon: "bi-people-fill", correct: true },
            { text: "Me río", icon: "bi-emoji-laughing-fill", correct: false }
          ],
          feedbackOk: "Está bien expresar la tristeza"
        },
        {
          type: "single-choice",
          title: "¿Qué puedo hacer?",
          instruction: "¿Qué puedo hacer cuando estoy triste?",
          question: "¿Qué puedo hacer?",
          options: [
            { text: "Hablar con alguien", icon: "bi-chat-heart-fill", correct: true },
            { text: "Abrazar", icon: "bi-heart-fill", correct: true },
            { text: "Guardarlo todo", icon: "bi-lock-fill", correct: false }
          ],
          feedbackOk: "Hablar y pedir un abrazo nos ayuda mucho"
        }
      ]
    },

    // ---------------------------------------------------------------- mundo 3
    {
      id: "anger",
      name: "Mundo del Enojo",
      palette: { primary: "#E63946", secondary: "#FF7B54", accent: "#FFB74D", bg: "#FFEDE6" },
      mascotColor: "#E63946",
      intro: "Un volcán está a punto de explotar… El enojo necesita ser controlado.",
      introButton: "Comenzar misión",
      badge: "Guardián del Volcán",
      reward: "¡Has calmado el volcán!",
      challenges: [
        {
          type: "pick-face",
          title: "Detecta el enojo",
          instruction: "¿Quién está enojado?",
          options: [
            { emotion: "angry", correct: true },
            { emotion: "happy", correct: false },
            { emotion: "sad", correct: false },
            { emotion: "surprised", correct: false }
          ],
          feedbackOk: "¡Muy bien! Ese es el enojo",
          feedbackError: "Intenta de nuevo, mira sus cejas y su boca"
        },
        {
          type: "multi-select",
          title: "¿Qué lo causa?",
          instruction: "¿Qué causa el enojo?",
          options: [
            { text: "Quitar un juguete", icon: "bi-controller", correct: true },
            { text: "No dejar jugar", icon: "bi-slash-circle", correct: true },
            { text: "Dar un regalo", icon: "bi-gift", correct: false }
          ],
          feedbackOk: "¡Eso es! A veces el enojo aparece cuando algo no nos gusta"
        },
        {
          // reto especial del semforo. primero se exploran los 3 colores y luego 2 preguntas en secuencia
          type: "traffic-light",
          title: "Semáforo emocional",
          instruction: "Haz clic en cada color para aprender qué hacer cuando te sientes enojado",
          lights: [
            { color: "red", label: "PARAR", title: "ALTO", text: "Detente un momento. No grites ni pegues." },
            { color: "yellow", label: "PENSAR", title: "PIENSA", text: "Respira profundo. Cuenta hasta 5. ¿Qué puedes hacer?" },
            { color: "green", label: "ACTUAR", title: "ACTÚA", text: "Habla con calma. Pide ayuda. Busca una solución." }
          ],
          questions: [
            {
              question: "¿Qué haces primero cuando estás enojado?",
              options: [
                { text: "Pensar", icon: "bi-lightbulb-fill", correct: false },
                { text: "Parar", icon: "bi-stop-circle-fill", correct: true },
                { text: "Gritar", icon: "bi-megaphone-fill", correct: false }
              ]
            },
            {
              question: "¿Y después de parar?",
              options: [
                { text: "Pensar", icon: "bi-lightbulb-fill", correct: true },
                { text: "Gritar", icon: "bi-megaphone-fill", correct: false }
              ]
            }
          ],
          feedbackOk: "¡Muy bien! Ahora sabes cómo controlar el enojo"
        },
        {
          type: "single-choice",
          title: "Calma el volcán",
          instruction: "¿Qué te ayuda a calmar el volcán?",
          question: "¿Qué te ayuda a calmarte?",
          options: [
            { text: "Respirar profundo", icon: "bi-wind", correct: true },
            { text: "Contar hasta 5", icon: "bi-123", correct: true },
            { text: "Golpear", icon: "bi-fire", correct: false }
          ],
          feedbackOk: "¡Has calmado el volcán!"
        }
      ]
    },

    // ---------------------------------------------------------------- mundo 4
    {
      id: "fear",
      name: "Mundo del Miedo",
      palette: { primary: "#2E2A6E", secondary: "#7E6CC2", accent: "#FFD56B", bg: "#ECEAF6" },
      mascotColor: "#7E6CC2",
      intro: "El reino está un poco oscuro… pero no todo lo que da miedo es peligroso. Lee esta historia y conviértete en valiente.",
      introButton: "Leer el cuento",
      badge: "Valiente del Reino",
      reward: "¡Has recuperado la energía del valor!",
      challenges: [
        {
          type: "audio-story",
          title: "Escucho y comprendo",
          instruction: "Escucha el cuento y luego responde",
          audio: "audio/valiente.mp3",
          storyTitle: "El niño valiente y la oscuridad",
          storyText: "Había una vez un niño llamado Mateo. Le gustaba jugar, reír y pasar tiempo con su familia. Pero había algo que no le gustaba nada: le daba miedo la oscuridad. Cuando llegaba la noche y apagaban la luz, su corazón latía más rápido. \"¿Y si hay un monstruo? ¿Y si algo está escondido?\", pensaba, y se tapaba con su cobija. Pero el miedo seguía ahí. Una noche, su mamá entró: \"El miedo es una emoción y todos lo sentimos alguna vez. Pero no todo lo que parece miedo es peligroso\". Le dio una pequeña linterna: \"Esta luz puede ayudarte a ver mejor, y también puedes llamarme si me necesitas\". Mateo respiró profundo. Esa noche encendió su linterna, miró alrededor y descubrió que no había monstruos: solo su juguete, una silla y su osito. Mateo sonrió. Desde ese día entendió que sentir miedo está bien, y que ser valiente no es no tener miedo, sino enfrentar lo que sentimos paso a paso, pidiendo ayuda y respirando profundo. Y poco a poco, la oscuridad dejó de ser tan aterradora.",
          questions: [
            {
              question: "¿Cómo se sentía el niño?",
              options: [
                { text: "Feliz", icon: "bi-emoji-smile-fill", correct: false },
                { text: "Asustado", icon: "bi-emoji-dizzy-fill", correct: true },
                { text: "Enojado", icon: "bi-emoji-angry-fill", correct: false }
              ]
            },
            {
              question: "¿Qué le daba miedo?",
              options: [
                { text: "La oscuridad", icon: "bi-moon-stars-fill", correct: true },
                { text: "Jugar", icon: "bi-controller", correct: false }
              ]
            },
            {
              question: "¿Qué hizo el niño?",
              options: [
                { text: "Encendió una luz", icon: "bi-lightbulb-fill", correct: true },
                { text: "Se quedó solo llorando", icon: "bi-emoji-frown-fill", correct: false }
              ]
            },
            {
              question: "¿Qué lo ayudó?",
              options: [
                { text: "Pedir ayuda", icon: "bi-people-fill", correct: true },
                { text: "Esconderse siempre", icon: "bi-eye-slash-fill", correct: false }
              ]
            }
          ],
          feedbackOk: "¡Muy bien! Entendiste el miedo y cómo enfrentarlo"
        },
        {
          type: "pick-face",
          title: "¿Quién tiene miedo?",
          instruction: "Haz clic en quien tiene miedo",
          options: [
            { emotion: "scared", correct: true },
            { emotion: "happy", correct: false },
            { emotion: "angry", correct: false },
            { emotion: "neutral", correct: false }
          ],
          feedbackOk: "¡Correcto! Mira sus ojos y su expresión",
          feedbackError: "Observa sus ojos y su expresión"
        },
        {
          type: "multi-select",
          title: "¿A qué le temo?",
          instruction: "¿Qué cosas pueden dar miedo?",
          options: [
            { text: "Oscuridad", icon: "bi-moon-stars", correct: true },
            { text: "Ruidos fuertes", icon: "bi-volume-up", correct: true },
            { text: "Cumpleaños", icon: "bi-cake2", correct: false }
          ],
          feedbackOk: "Sentir miedo de algunas cosas es normal"
        },
        {
          type: "multi-select",
          title: "Soy valiente",
          instruction: "¿Qué puedes hacer cuando sientes miedo?",
          options: [
            { text: "Pedir ayuda", icon: "bi-people", correct: true },
            { text: "Encender la luz", icon: "bi-lightbulb", correct: true },
            { text: "Respirar profundo", icon: "bi-wind", correct: true },
            { text: "Esconderse siempre", icon: "bi-box-arrow-in-down", correct: false }
          ],
          feedbackOk: "Ser valiente no es no tener miedo… es aprender a enfrentarlo"
        }
      ]
    },

    // ---------------------------------------------------------------- mundo 5
    {
      id: "surprise",
      name: "Mundo de la Sorpresa",
      palette: { primary: "#1FC8C8", secondary: "#FF5DA2", accent: "#FFD23F", bg: "#E8FBFB" },
      mascotColor: "#1FC8C8",
      intro: "¡Algo inesperado pasó en el reino! Ayúdanos a descubrir la emoción de la sorpresa.",
      introButton: "Comenzar misión",
      badge: "Explorador de lo Inesperado",
      reward: "¡Has descubierto el poder de la sorpresa!",
      challenges: [
        {
          type: "pick-face",
          title: "¿Quién está sorprendido?",
          instruction: "Haz clic en quien está sorprendido",
          options: [
            { emotion: "surprised", correct: true },
            { emotion: "happy", correct: false },
            { emotion: "sad", correct: false },
            { emotion: "angry", correct: false }
          ],
          feedbackOk: "¡Esa es la cara de sorpresa!",
          feedbackError: "Mira bien, la sorpresa abre mucho los ojos y la boca"
        },
        {
          // arrastrar o tocar cada situacon a su caja
          type: "classify",
          title: "Agradable o desagradable",
          instruction: "Lleva cada situación a su caja",
          boxes: ["Agradable", "Desagradable"],
          items: [
            { text: "Un regalo inesperado", icon: "bi-gift-fill", box: "Agradable" },
            { text: "Una fiesta sorpresa", icon: "bi-balloon-heart-fill", box: "Agradable" },
            { text: "Un globo que explota fuerte", icon: "bi-exclamation-diamond-fill", box: "Desagradable" },
            { text: "Tropezar de repente", icon: "bi-arrow-down-circle-fill", box: "Desagradable" }
          ],
          feedbackOk: "¡Muy bien! No todas las sorpresas son iguales"
        },
        {
          type: "pick-face",
          title: "La cara de sorpresa",
          instruction: "¿Cómo es la cara de sorpresa?",
          options: [
            { emotion: "surprised", correct: true },
            { emotion: "disgust", correct: false },
            { emotion: "neutral", correct: false },
            { emotion: "sad", correct: false }
          ],
          feedbackOk: "¡Correcto! Esa es la sorpresa",
          feedbackError: "Intenta de nuevo, mira los ojos bien abiertos"
        },
        {
          type: "single-choice",
          title: "¿Qué hago cuando me sorprendo?",
          instruction: "¿Qué hago cuando me sorprendo?",
          question: "¿Qué hago cuando me sorprendo?",
          options: [
            { text: "Respiro y observo", icon: "bi-eye-fill", correct: true },
            { text: "Me asusto y grito", icon: "bi-megaphone-fill", correct: false },
            { text: "Pregunto qué pasó", icon: "bi-question-circle-fill", correct: true }
          ],
          feedbackOk: "¡Muy bien! Respirar y observar nos ayuda"
        }
      ]
    },

    // ---------------------------------------------------------------- mundo 6
    {
      id: "disgust",
      name: "Mundo del Asco",
      palette: { primary: "#5BAE4F", secondary: "#8E6FB0", accent: "#A7D88A", bg: "#EEF7EA" },
      mascotColor: "#5BAE4F",
      intro: "El reino necesita cuidarse. Descubre cómo el asco nos protege y nos ayuda a cuidarnos.",
      introButton: "Comenzar misión",
      badge: "Protector del Cuerpo",
      reward: "El asco nos protege y nos ayuda a cuidarnos",
      challenges: [
        {
          type: "pick-face",
          title: "Detecta el asco",
          instruction: "Haz clic en quien siente asco",
          options: [
            { emotion: "disgust", correct: true },
            { emotion: "happy", correct: false },
            { emotion: "surprised", correct: false },
            { emotion: "sad", correct: false }
          ],
          feedbackOk: "¡Eso es! Esa es la cara de asco",
          feedbackError: "Mira la nariz arrugada y la boca"
        },
        {
          type: "multi-select",
          title: "¿Qué nos cuida del asco?",
          instruction: "¿De qué nos cuida el asco?",
          options: [
            { text: "Comida dañada", icon: "bi-trash", correct: true },
            { text: "Basura", icon: "bi-trash2", correct: true },
            { text: "Una flor", icon: "bi-flower1", correct: false },
            { text: "Barro sucio", icon: "bi-droplet-half", correct: true }
          ],
          feedbackOk: "¡Muy bien! El asco nos avisa de cosas que pueden hacernos daño"
        },
        {
          type: "single-choice",
          title: "¿Qué hago?",
          instruction: "¿Qué hago cuando algo me da asco?",
          question: "¿Qué hago?",
          options: [
            { text: "Me alejo", icon: "bi-arrow-right-circle-fill", correct: true },
            { text: "Lo toco igual", icon: "bi-hand-index-thumb-fill", correct: false },
            { text: "Aviso a un adulto", icon: "bi-people-fill", correct: true }
          ],
          feedbackOk: "¡Correcto! Alejarse y avisar es lo mejor"
        },
        {
          type: "multi-select",
          title: "Me cuido",
          instruction: "¿Cómo me cuido?",
          options: [
            { text: "Lavarme las manos", icon: "bi-droplet", correct: true },
            { text: "No comer cosas del suelo", icon: "bi-x-circle", correct: true },
            { text: "Tocar todo sucio", icon: "bi-hand-index-thumb", correct: false }
          ],
          feedbackOk: "El asco nos protege y nos ayuda a cuidarnos"
        }
      ]
    }

  ]
};
