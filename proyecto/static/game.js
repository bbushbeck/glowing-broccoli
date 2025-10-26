// Juego de decisiones completamente en cliente (funciona con Live Server y con Flask estático)
// DEBUG: mensaje en consola para verificar que el script carga.
console.log("game.js cargado");

const STORAGE_KEY = "decision_game_state_v1";

const decision_tree = {
  "start": {
    "question": "Te encuentras en un cruce. ¿Qué camino tomas?",
    "options": {
      "left": {"text": "Camino de la izquierda", "next": "forest"},
      "right": {"text": "Camino de la derecha", "next": "river"}
    }
  },
  "forest": {
    "question": "Entras en un bosque oscuro y ves una cabaña. ¿Qué haces?",
    "options": {
      "enter": {"text": "Entrar a la cabaña", "next": "inside"},
      "keep": {"text": "Seguir por el bosque", "next": "clearing"}
    }
  },
  "river": {
    "question": "Llegas a un río ancho. Hay un bote y un puente en mal estado. ¿Qué eliges?",
    "options": {
      "boat": {"text": "Tomar el bote", "next": "island"},
      "bridge": {"text": "Cruzar el puente", "next": "bridge_break"}
    }
  },
  "inside": {
    "question": "Dentro hay un anciano amable que te ofrece ayuda.",
    "options": {
      "accept": {"text": "Aceptar su ayuda", "next": null, "result": "El anciano te cura y te guía fuera. ¡Has ganado!"},
      "decline": {"text": "Rechazar y salir", "next": null, "result": "Te pierdes en el bosque. Fin."}
    }
  },
  "clearing": {
    "question": "Encuentras un claro con un cofre.",
    "options": {
      "open": {"text": "Abrir el cofre", "next": null, "result": "El cofre tenía provisiones. Sobrevives. Fin."},
      "ignore": {"text": "Ignorar y seguir", "next": null, "result": "Te encuentras con un lobo y pierdes. Fin."}
    }
  },
  "island": {
    "question": "El bote te deja en una pequeña isla con una torre.",
    "options": {
      "climb": {"text": "Subir la torre", "next": null, "result": "Encuentras un faro y pides ayuda. Salvaste el día. Fin."},
      "rest": {"text": "Descansar en la playa", "next": null, "result": "Un rescate te encuentra más tarde. Fin."}
    }
  },
  "bridge_break": {
    "question": "El puente se rompe y caes a una cueva subterránea.",
    "options": {
      "explore": {"text": "Explorar la cueva", "next": null, "result": "Encuentras tesoros pero te quedas atrapado. Fin."},
      "light": {"text": "Buscar luz y salir", "next": null, "result": "Logras salir y regresar a casa. Fin."}
    }
  }
};

let state = {
  currentNode: "start",
  history: [],
  result: null
};

const questionEl = document.getElementById("question");
const choicesForm = document.getElementById("choices-form");
const resultEl = document.getElementById("result");
const restartBtn = document.getElementById("restart");
const historyList = document.getElementById("history-list");

if (!questionEl || !choicesForm || !resultEl || !restartBtn || !historyList) {
  console.error("Elementos DOM no encontrados. Revisa los IDs en game.html");
  console.log("questionEl:", questionEl, "choicesForm:", choicesForm, "resultEl:", resultEl, "restartBtn:", restartBtn, "historyList:", historyList);
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Error guardando estado:", e);
  }
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const s = JSON.parse(raw);
      if (s && typeof s === "object") {
        state = s;
      }
    } catch (e) {
      console.warn("No se pudo parsear estado guardado, reiniciando:", e);
      state = { currentNode: "start", history: [], result: null };
    }
  }
}

function resetState() {
  state = { currentNode: "start", history: [], result: null };
  saveState();
}

function renderNode(nodeId) {
  console.log("renderNode:", nodeId);
  const node = decision_tree[nodeId];
  if (!node) {
    questionEl.textContent = "Nodo no encontrado.";
    choicesForm.innerHTML = "";
    return;
  }

  state.currentNode = nodeId;
  state.result = null;
  saveState();

  questionEl.textContent = node.question;

  resultEl.classList.add("hidden");
  resultEl.innerHTML = "";

  choicesForm.innerHTML = "";
  Object.entries(node.options).forEach(([key, opt]) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice";
    btn.textContent = opt.text;
    btn.addEventListener("click", () => {
      chooseOption(nodeId, key);
    });
    choicesForm.appendChild(btn);
  });

  updateHistoryUI();
}

function showResult(text) {
  console.log("showResult:", text);
  questionEl.textContent = "Resultado final";
  choicesForm.innerHTML = "";
  resultEl.classList.remove("hidden");
  resultEl.innerHTML = `<p>${escapeHtml(text)}</p><button id="restart2" class="btn">Reiniciar</button>`;
  document.getElementById("restart2").addEventListener("click", () => {
    restartGame();
  });
}

function chooseOption(nodeId, choiceKey) {
  const node = decision_tree[nodeId];
  const opt = node.options[choiceKey];
  if (!opt) return;

  state.history.push({ node: nodeId, question: node.question, choice_key: choiceKey, choice_text: opt.text });
  saveState();

  if (opt.next === null || opt.next === undefined) {
    state.result = opt.result || "Fin del juego.";
    saveState();
    showResult(state.result);
  } else {
    renderNode(opt.next);
  }
}

function updateHistoryUI() {
  if (!state.history || state.history.length === 0) {
    historyList.innerHTML = "(Sin movimientos todavía)";
    return;
  }
  const ol = document.createElement("ol");
  state.history.forEach(h => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${escapeHtml(h.question)}</strong> — ${escapeHtml(h.choice_text)}`;
    ol.appendChild(li);
  });
  historyList.innerHTML = "";
  historyList.appendChild(ol);
}

function restartGame() {
  resetState();
  renderNode(state.currentNode);
}

function escapeHtml(unsafe) {
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Inicialización
try {
  loadState();
  console.log("Estado inicial:", state);
  if (state.result) {
    showResult(state.result);
  } else {
    renderNode(state.currentNode || "start");
  }
} catch (e) {
  console.error("Error inicializando juego:", e);
}

restartBtn.addEventListener("click", () => {
  restartGame();
});