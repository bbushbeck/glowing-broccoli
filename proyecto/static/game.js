// game.js - Juego aventuras financieras
// Objetivo: enseñar finanzas a niños con decisiones dramáticas, múltiples ramas y finales desbloqueables.
console.log("game.js cargado - versión ampliada y rejugable");

const STORAGE_KEY = "decision_game_finanzas_v2_state";
const ENDINGS_KEY = "decision_game_finanzas_v2_endings_unlocked";

const decision_tree = {
  "start": {
    "question": "Es tu cumpleaños y recibiste $300. En la fiesta están Mateo, tu mejor amigo, y tu Abuela que siempre da consejos. ¿Qué haces primero?",
    "options": {
      "celebrate": {"text": "Gastar con Mateo en juegos y comida", "next": "spend_with_mateo"},
      "plan": {"text": "Escuchar a la Abuela y planear qué hacer con el dinero", "next": "listen_abuela"},
      "business_idea": {"text": "Invertir en materiales para vender postales", "next": "start_business"}
    }
  },

  // RAMA: gastar con Mateo → riesgo de deuda o aprendizaje rápido
  "spend_with_mateo": {
    "question": "Te diviertes mucho, pero al final de la fiesta ves una bicicleta que quieres. Mateo te sugiere pedir un préstamo a un 'prestamista' del barrio. ¿Qué haces?",
    "options": {
      "ask_loan": {"text": "Pedir el préstamo y comprar la bici", "next": "bad_loan"},
      "wait_bike": {"text": "Esperar y ahorrar para la bicicleta", "next": "save_for_bike"},
      "sell_stuff": {"text": "Vender alguno de tus juguetes para comprarla", "next": "sell_toy"}
    }
  },

  "bad_loan": {
    "question": "El prestamista pide recuperar más dinero por intereses. A los pocos meses empieza a pedir más. ¿Cómo gestionas la deuda?",
    "options": {
      "ignore": {"text": "Ignorar y esperar que se vaya", "next": null, "result": "El problema creció y fue difícil solucionarlo. Aprendiste que pedir préstamos sin plan trae problemas.", "end_id": "deuda_mala"},
      "work_more": {"text": "Buscar pequeños trabajos para pagar la deuda", "next": "work_jobs"}
    }
  },

  "work_jobs": {
    "question": "Con pequeños trabajos logras pagar gran parte. ¿Qué más aprendes?",
    "options": {
      "learn_budget": {"text": "Hacer un presupuesto y no pedir préstamos malos", "next": null, "result": "Aprendiste responsabilidad y cómo salir de la deuda con esfuerzo. 🎓 Fin con aprendizaje.", "end_id": "salida_deuda"},
      "continue_loans": {"text": "Seguir pidiendo préstamos", "next": null, "result": "Ciclo de deudas... Aprendiste lo que no debes repetir. ⚠️ Fin.", "end_id": "ciclo_deuda"}
    }
  },

  "save_for_bike": {
    "question": "Ahorraste poquito a poco y la Abuela te regaló una parte por ser paciente. ¿Qué sientes?",
    "options": {
      "proud": {"text": "Te sientes orgulloso y sigues ahorrando para otras metas", "next": null, "result": "¡Buen trabajo! Paciencia y metas claras te dieron la bicicleta sin deudas. 🚲 Fin feliz.", "end_id": "ahorro_paciente"},
      "spend_now": {"text": "Gastar el resto en golosinas", "next": null, "result": "Disfrutaste, pero aprendiste que gastar sin plan puede retrasar tus metas. 🍭 Fin con lección.", "end_id": "gasto_impulsivo"}
    }
  },

  "sell_toy": {
    "question": "Vendiste un juguete y compraste la bici. Te sientes mal por haber perdido algo querido. ¿Qué haces con el dinero sobrante?",
    "options": {
      "save_sobrante": {"text": "Ahorras lo que quedó", "next": null, "result": "Aprendiste sobre costo de oportunidad: obtener algo cuesta renunciar a otra cosa. 🧠 Fin reflexivo.", "end_id": "costo_oportunidad"},
      "spend_sobrante": {"text": "Gastas el resto rápido", "next": null, "result": "Tu bici fue alegría momentánea; aprendiste a valorar mejor tus cosas. 🎈 Fin.", "end_id": "compra_emocional"}
    }
  },

  // RAMA: escuchar a la Abuela → educación, fondo de emergencia, inversión en educación
  "listen_abuela": {
    "question": "La Abuela sugiere: 'Parte en ahorro, parte en ayuda, parte en aprender'. ¿Cómo divides $300?",
    "options": {
      "split_3": {"text": "100 ahorro / 100 aprender / 100 ayudar", "next": "three_way"},
      "mostly_save": {"text": "200 ahorro / 50 aprender / 50 ayudar", "next": "mostly_save"},
      "invest_learning": {"text": "50 ahorro / 250 aprender", "next": "big_invest_learning"}
    }
  },

  "three_way": {
    "question": "Con $100 para aprender, te inscribes a un curso pequeño; el ahorro te sirve para emergencias y ayudas una escuela local. ¿Qué pasa después?",
    "options": {
      "grow_skills": {"text": "Usas lo aprendido para ofrecer clases y ganas dinero", "next": null, "result": "Invertir en educación te dio habilidades y ganancias. ¡Gran final! 🎨💼", "end_id": "inversion_educacion"},
      "dont_use": {"text": "No practicas lo aprendido", "next": null, "result": "El curso no rindió porque no lo aplicaste. Aprendiste que estudiar requiere práctica. 📚 Fin.", "end_id": "curso_no_aplicado"}
    }
  },

  "mostly_save": {
    "question": "Un mes después tu vecina necesita ayuda con la tienda y te ofrece pagar por trabajar. ¿Qué haces?",
    "options": {
      "work_and_add": {"text": "Trabajas y agregas lo ganado al ahorro", "next": null, "result": "Ahorraste más y tu fondo de emergencia creció. 👍 Fin responsable.", "end_id": "fondo_emergencia"},
      "spend_earnings": {"text": "Usas lo ganado para comprarte algo", "next": null, "result": "Disfrutaste, pero perdiste oportunidad de fortalecer tu fondo. 🍪 Fin con lección.", "end_id": "oportunidad_perdida"}
    }
  },

  "big_invest_learning": {
    "question": "Invertiste mucho en aprender arte; te aceptan a un concurso importante, pero te piden materiales extra que cuestan $150 más. ¿Cómo reaccionas?",
    "options": {
      "ask_sponsor": {"text": "Pides a la Abuela o al banco micropréstamo responsable", "next": "bank_loan_request"},
      "sell_help": {"text": "Organizas un bazar para conseguir lo que falta", "next": "bazaar_fundraiser"}
    }
  },

  "bank_loan_request": {
    "question": "La Sra. Rivera del banco ofrece un microcrédito con condiciones claras y una educación sobre interés. ¿Aceptar?",
    "options": {
      "accept_bank": {"text": "Aceptar el microcrédito y pagar en partes", "next": null, "result": "Con el microcrédito responsable pudiste participar y ganaste experiencia. Aprendiste a usar préstamos útiles. 🏆 Fin bueno.", "end_id": "microcredito_responsable"},
      "decline_bank": {"text": "Declinar y buscar más ideas", "next": "bazaar_fundraiser"}
    }
  },

  "bazaar_fundraiser": {
    "question": "Organizas el bazar con amigos; vendes dibujos, galletas y ahorras para los materiales. ¿Resultado?",
    "options": {
      "success": {"text": "Logras juntar lo que necesitabas", "next": null, "result": "La creatividad y trabajo en equipo te permitieron alcanzar la meta sin deudas. 🌟 Fin inspirador.", "end_id": "emprendimiento_colaborativo"},
      "not_enough": {"text": "No alcanzas y decides posponer el concurso", "next": null, "result": "Aprendiste a planear mejor la próxima vez. ⏳ Fin con aprendizaje.", "end_id": "planificar_mejor"}
    }
  },

  // RAMA: emprender desde el inicio
  "start_business": {
    "question": "Compraste materiales y vas al parque a vender postales con Mateo. El primer día ganas $80. ¿Qué haces con las ganancias?",
    "options": {
      "reinvest": {"text": "Reinvertir en materiales para vender más", "next": "grow_business"},
      "spend_profit": {"text": "Gastar en una consola que viste", "next": "spend_on_console"},
      "save_profit": {"text": "Guardar las ganancias y planear", "next": "save_and_plan"}
    }
  },

  "grow_business": {
    "question": "Al reinvertir tu negocio crece: haces anuncios en la escuela y encuentras clientes. En dos meses tienes $500. ¿Qué haces?",
    "options": {
      "legalize": {"text": "Hablar con la Abuela sobre formalizar el negocio (pequeña contabilidad)", "next": null, "result": "Aprendiste a llevar cuentas y tu negocio fue más sólido. 🧾 Fin emprendedor responsable.", "end_id": "empresaria_joven"},
      "splurge": {"text": "Gastar en moda para impresionar", "next": null, "result": "Disfrutaste el éxito, pero descuidaste la administración. Aprendizaje: disciplina también importa. 🪪 Fin.", "end_id": "emprendimiento_sin_orden"}
    }
  },

  "spend_on_console": {
    "question": "La consola te da alegría, pero tu negocio necesita materiales para seguir. Mateo te ofrece crear juntos un torneo de videojuegos para generar mas ingresos. ¿Aceptar la propuesta?",
    "options": {
      "partner_yes": {"text": "Aceptar trabajar con Mateo", "next": null, "result": "El torneo funcionó y aprendieron a dividir ganancias y responsabilidades. 🤝 Fin colaborativo.", "end_id": "asociacion_exitosa"},
      "partner_no": {"text": "Decir que no y buscar otro plan", "next": null, "result": "Seguiste solo, fue más difícil, pero aprendiste mucho. 💪 Fin de crecimiento personal.", "end_id": "crecimiento_individual"}
    }
  },

  "save_and_plan": {
    "question": "Guardaste y haces un plan de negocios con la Abuela. Al presentar tu idea, una tienda local compra tus postales. ¿Qué haces con la ganancia grande?",
    "options": {
      "expand": {"text": "Contratar ayuda y expandir", "next": null, "result": "Elegiste escalar con cuidado y crear oportunidades para otros. 🌱 Fin muy positivo.", "end_id": "expansion_social"},
      "save_all": {"text": "Ahorrar todo para seguridad", "next": null, "result": "Tienes un gran colchón, pero perdiste la oportunidad de crecer. Aprendiste equilibrio. 🛡️ Fin.", "end_id": "ahorro_extremo"}
    }
  }
};

// Estado del juego (incluye finales desbloqueados)
let state = { currentNode: "start", history: [], result: null };
let unlockedEndings = loadUnlockedEndings(); // cargamos al inicio

// Elementos DOM
const questionEl = document.getElementById("question");
const choicesForm = document.getElementById("choices-form");
const resultEl = document.getElementById("result");
const restartBtn = document.getElementById("restart");
const historyList = document.getElementById("history-list");

// Guardado / carga de estado
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { console.warn("No se pudo guardar estado:", e); }
}
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (s && typeof s === "object") state = s;
    }
  } catch (e) {
    console.warn("No se pudo cargar estado, iniciando nuevo:", e);
    state = { currentNode: "start", history: [], result: null };
  }
}
function resetState() {
  state = { currentNode: "start", history: [], result: null };
  saveState();
}

// Manejo de finales desbloqueados
function loadUnlockedEndings() {
  try {
    const raw = localStorage.getItem(ENDINGS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function unlockEnding(id, title) {
  if (!id) return;
  unlockedEndings = loadUnlockedEndings();
  if (!unlockedEndings[id]) {
    unlockedEndings[id] = { title: title || id, date: new Date().toISOString() };
    localStorage.setItem(ENDINGS_KEY, JSON.stringify(unlockedEndings));
  }
}
function renderUnlockedEndingsUI() {
  // Añadimos la lista de finales desbloqueados al final del resultEl (si existe)
  const containerId = "endings-container";
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    container.style.marginTop = "12px";
    container.style.paddingTop = "8px";
    container.style.borderTop = "1px dashed #ccc";
    resultEl.appendChild(container);
  }
  container.innerHTML = "<h4>Finales desbloqueados</h4>";
  const keys = Object.keys(unlockedEndings || {});
  if (keys.length === 0) {
    container.innerHTML += "<p>(Aún no desbloqueas ninguno — ¡sigue jugando!)</p>";
    return;
  }
  const ol = document.createElement("ol");
  keys.forEach(k => {
    const li = document.createElement("li");
    const info = unlockedEndings[k];
    li.textContent = `${info.title} — desbloqueado el ${new Date(info.date).toLocaleString()}`;
    ol.appendChild(li);
  });
  container.appendChild(ol);
}

// Renderizar nodo
function renderNode(nodeId) {
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
    btn.addEventListener("click", () => chooseOption(nodeId, key));
    choicesForm.appendChild(btn);
  });

  updateHistoryUI();
}

// Mostrar resultado final y registrar final desbloqueado si aplica
function showResult(text, end_id) {
  questionEl.textContent = "Resultado final";
  choicesForm.innerHTML = "";
  resultEl.classList.remove("hidden");
  resultEl.innerHTML = `<p>${escapeHtml(text)}</p><div style="margin-top:8px;"><button id="restart2" class="btn">Reiniciar</button> <button id="view_history" class="btn secondary">Ver historial</button></div>`;

  // Si hay un end_id, desbloquéalo (usamos un título corto para mostrar)
  if (end_id) {
    // Títulos amigables para algunos end_ids
    const titles = {
      "deuda_mala": "Deuda peligrosa",
      "salida_deuda": "Superación de deuda",
      "ciclo_deuda": "Ciclo de deudas",
      "ahorro_paciente": "Ahorradora paciente",
      "gasto_impulsivo": "Gasto impulsivo",
      "costo_oportunidad": "Costo de oportunidad",
      "compra_emocional": "Compra emocional",
      "inversion_educacion": "Inversión en educación",
      "curso_no_aplicado": "Curso no aprovechado",
      "fondo_emergencia": "Fondo de emergencia",
      "oportunidad_perdida": "Oportunidad perdida",
      "microcredito_responsable": "Microcrédito responsable",
      "emprendimiento_colaborativo": "Emprendimiento colaborativo",
      "planificar_mejor": "Planificar mejor",
      "empresaria_joven": "Pequeña empresaria",
      "emprendimiento_sin_orden": "Emprendimiento sin orden",
      "asociacion_exitosa": "Asociación exitosa",
      "crecimiento_individual": "Crecimiento individual",
      "expansion_social": "Expansión con impacto",
      "ahorro_extremo": "Ahorro extremo"
    };
    const title = titles[end_id] || end_id;
    unlockEnding(end_id, title);
  }

  // Mostrar finales desbloqueados en UI
  renderUnlockedEndingsUI();

  document.getElementById("restart2").addEventListener("click", () => restartGame());
  document.getElementById("view_history").addEventListener("click", () => {
    // Desplazar el historial a la vista (o mostrarlo de forma destacada)
    alert("Historial:\n" + state.history.map((h, i) => `${i+1}. ${h.question} — ${h.choice_text}`).join("\n"));
  });
}

// Elegir opción
function chooseOption(nodeId, choiceKey) {
  const node = decision_tree[nodeId];
  const opt = node.options[choiceKey];
  if (!opt) return;

  // Guardamos en el historial
  state.history.push({ node: nodeId, question: node.question, choice_key: choiceKey, choice_text: opt.text, timestamp: new Date().toISOString() });
  saveState();

  // Si la opción termina la historia (next null) mostramos el resultado y desbloqueamos final si end_id presente
  if (opt.next === null || opt.next === undefined) {
    state.result = opt.result || "Fin del juego.";
    saveState();
    // opt puede contener end_id (si quieres definir finales en opciones), pero en este árbol uso end_id en node return
    // si la opción en el árbol original incluyó un 'end_id', úsalo. Sino, tratamos de detectar en el nodo actual.
    const end_id = opt.end_id || opt.endId || opt.end_id || opt.end || (opt.result && extract_end_id_from_node(nodeId, choiceKey));
    showResult(state.result, end_id);
  } else {
    renderNode(opt.next);
  }
}

// util: extraer end_id si lo definimos en el nodo (fallback)
function extract_end_id_from_node(nodeId, choiceKey) {
  // En este diseño, ya añadimos end_id directamente en las opciones que terminan.
  return null;
}

// Actualizar historial en UI
function updateHistoryUI() {
  if (!state.history || state.history.length === 0) {
    historyList.innerHTML = "(Sin decisiones todavía)";
    return;
  }
  const ol = document.createElement("ol");
  state.history.forEach(h => {
    const li = document.createElement("li");
    const time = new Date(h.timestamp).toLocaleTimeString();
    li.innerHTML = `<strong>${escapeHtml(h.question)}</strong> — ${escapeHtml(h.choice_text)} <small style="color:#666">(${time})</small>`;
    ol.appendChild(li);
  });
  historyList.innerHTML = "";
  historyList.appendChild(ol);
}

// Reiniciar juego
function restartGame() {
  resetState();
  loadState(); // asegura estado limpio
  renderNode(state.currentNode);
}

// Escapar HTML (seguro para mostrar texto)
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
  // Si ya hay un resultado guardado, mostrarlo y la lista de finales desbloqueados
  if (state.result) {
    // Intentamos encontrar si el último paso fue un final con end_id consultando la última entrada del historial
    const last = state.history.length ? state.history[state.history.length - 1] : null;
    // No siempre tenemos end_id guardado aquí, así que mostramos el resultado sin end_id inicial
    showResult(state.result, null);
  } else {
    renderNode(state.currentNode || "start");
  }
} catch (e) {
  console.error("Error inicializando juego:", e);
  resetState();
  renderNode("start");
}

// Botón reiniciar principal
if (restartBtn) restartBtn.addEventListener("click", () => restartGame());
