#Implementar en la app porfas
from flask import Flask, render_template, jsonify
import os
from datetime import datetime

# Rutas absolutas proporcionadas
TEMPLATES_DIR = r"C:\Users\angel\Documents\GitHub\glowing-broccoli\proyecto\templates"
REGISTRO_PATH = r"C:\Users\angel\Documents\GitHub\glowing-broccoli\proyecto\registro.txt"

# Instancia Flask (usa la carpeta de templates indicada)
scoreboard_app = Flask(__name__, template_folder=TEMPLATES_DIR)

def read_registro(path=REGISTRO_PATH):
    """
    Lee registro.txt y devuelve lista de tuplas (user, score).
    Formato por línea: <usuario> <password> <puntaje>
    - Ignora la contraseña.
    - Ignora líneas mal formadas o con puntaje no numérico.
    - Ordena por puntaje descendente.
    """
    entries = []
    if not os.path.exists(path):
        return entries
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            parts = line.split()
            if len(parts) < 3:
                continue
            user = parts[0]
            score_part = parts[-1]
            try:
                score = int(score_part)
            except ValueError:
                continue
            entries.append((user, score))
    entries.sort(key=lambda x: (-x[1], x[0].lower()))
    return entries

@scoreboard_app.route("/")
def index():
    entries = read_registro()
    updated = "desconocida"
    try:
        updated = datetime.fromtimestamp(os.path.getmtime(REGISTRO_PATH)).strftime("%Y-%m-%d %H:%M:%S")
    except Exception:
        pass
    return render_template("scoreboard.html", entries=entries, updated=updated)

@scoreboard_app.route("/api/scoreboard")
def api_scoreboard():
    entries = read_registro()
    data = [{"user": u, "score": s} for u, s in entries]
    return jsonify(data)

if __name__ == "__main__":
    print("Usando archivo de registro:", REGISTRO_PATH)
    scoreboard_app.run(debug=True)