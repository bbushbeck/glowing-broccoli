import os
from flask import Flask, render_template, request, redirect, url_for, session
from pregunta import Pregunta
import random
from datetime import datetime
from flask import jsonify

app = Flask(__name__)

#Lee el archivo de preguntas y las convierte en una lista
preguntas = []
def leer_preguntas(archivo):
    with open(archivo, 'r', encoding='utf-8') as file:
        for line in file:
            # Eliminamos saltos de línea y espacios extra
            line = line.strip()
            # Separamos por el delimitador "|"
            partes = line.split("|")
            if len(partes) == 5:
                pregunta_texto = partes[0]
                respuesta_correcta = partes[1]
                respuestas_incorrectas = partes[2:]
                pregunta = Pregunta(pregunta_texto, respuesta_correcta, respuestas_incorrectas)
                preguntas.append(pregunta)
            else:
                print(f"Formato incorrecto en la línea: {line}")
    return preguntas

leer_preguntas(os.path.join(app.root_path, "preguntas_finanzas.txt"))
usuario = ""
app.secret_key = "clave_super_secreta"  # necesaria para usar sesiones

# Ruta del archivo de usuarios
ruta_registro = os.path.join(app.root_path, "registro.txt")

def actualizar_puntaje(usuario, nuevo_puntaje):
    if not os.path.exists(ruta_registro):
        return
    lineas_nuevas = []
    with open(ruta_registro, "r", encoding="utf-8") as f:
        for linea in f:
            datos = linea.strip().split()
            if len(datos) < 3:
                continue
            nombre = datos[0]
            password = " ".join(datos[1:-1])
            if nombre == usuario:
                lineas_nuevas.append(f"{nombre} {password} {nuevo_puntaje}\n")
            else:
                lineas_nuevas.append(linea + "\n")
    with open(ruta_registro, "w", encoding="utf-8") as f:
        f.writelines(lineas_nuevas)


def verificar_usuario(nombre, contrasena):
    """Verifica si el usuario existe y la contraseña coincide."""
    if not os.path.exists(ruta_registro):
        return False, "No hay usuarios registrados"

    with open(ruta_registro, "r", encoding="utf-8") as f:
        for linea in f:
            datos = linea.strip().split()
            if len(datos) < 3:
                continue
            nombre_txt = datos[0]
            puntos = datos[-1]
            contrasena_txt = " ".join(datos[1:-1])

            if nombre == nombre_txt:
                if contrasena == contrasena_txt:
                    return True, int(puntos)
                else:
                    return False, "Contraseña incorrecta"

    return False, "Usuario no encontrado"

def read_registro(path=ruta_registro):
    entries = []
    if not os.path.exists(path):
        return entries
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            parts = line.strip().split()
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


# Página de login
@app.route('/', methods=['GET', 'POST'])
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        usuario = request.form['usuario']
        password = request.form['password']
        
        ok, info = verificar_usuario(usuario, password)

        if ok:
            # ✅ Guardamos datos del usuario en sesión
            session['usuario'] = usuario
            session['puntos'] = info
            actualizar_puntaje(session['usuario'], session['puntos'])
            # ✅ Redirige a pregunta.html
            return redirect(url_for('menu'))
        else:
            # ❌ Si no es válido, mostrar error
            return render_template('login.html', error=info)

    # GET → muestra el formulario
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        usuario = request.form['usuario'].strip()
        password = request.form['password'].strip()

        # Validaciones básicas
        if not usuario or not password:
            return render_template('register.html', error="Completa todos los campos")

        if len(password) < 4:
            return render_template('register.html', error="La contraseña debe tener al menos 4 caracteres")

        # Verificar si el usuario ya existe
        if os.path.exists(ruta_registro):
            with open(ruta_registro, "r", encoding="utf-8") as f:
                for linea in f:
                    datos = linea.strip().split()
                    if len(datos) >= 1 and datos[0] == usuario:
                        return render_template('register.html', error="El usuario ya existe")

        # Registrar nuevo usuario con puntaje inicial 0
        with open(ruta_registro, "a", encoding="utf-8") as f:
            f.write(f"{usuario} {password} 0\n")

        return render_template('register.html', mensaje="Usuario registrado con éxito. Ahora inicia sesión.")

    return render_template('register.html')

@app.route('/menu')
def menu():
    return render_template('menu.html', user = session['usuario'], score = session['puntos'])

# Página de preguntas (solo accesible si ya inició sesión)
@app.route('/pregunta')
def pregunta():
    random.shuffle(preguntas)
    preg = preguntas[0].texto
    banco = [preguntas[0].correcto, preguntas[0].incorrecto[0], preguntas[0].incorrecto[1], preguntas[0].incorrecto[2]]
    random.shuffle(banco)
    return render_template('pregunta.html', texto = preg, r1 = banco[0], r2 = banco[1], r3 = banco[2], r4 = banco[3], user = session['usuario'], score = session['puntos'])

@app.route('/aventura')
def aventura():
    return render_template('aventura.html')

@app.route('/verificar_respuesta', methods=['POST'])
def verificar_respuesta():
    respuesta_seleccionada = request.form['respuesta']  # Opción seleccionada por el usuario
    pregunta_actual = preguntas[0]  # Suponiendo que siempre se muestra la primera pregunta

    # Verificamos si la respuesta seleccionada es correcta
    if respuesta_seleccionada == pregunta_actual.correcto:
        session['puntos'] += 50
        actualizar_puntaje(session['usuario'], session['puntos'])
        mensaje = "¡Correcto!"
    else:
        # Si la respuesta es incorrecta, no cambiamos el puntaje
        mensaje = f"Incorrecto. La respuesta correcta era: {pregunta_actual.correcto}"
        
    random.shuffle(preguntas)
    pregunta_actual = preguntas[0]
    banco = [pregunta_actual.correcto, pregunta_actual.incorrecto[0], pregunta_actual.incorrecto[1], pregunta_actual.incorrecto[2]]
    random.shuffle(banco)
    # Luego de verificar, redirigimos a la página de preguntas, mostrando el mensaje
    return render_template('pregunta.html', 
                           texto=pregunta_actual.texto, 
                           r1 = banco[0], 
                           r2 = banco[1], 
                           r3 = banco[2], 
                           r4 = banco[3],
                           user=session['usuario'], 
                           score=session['puntos'], 
                           mensaje=mensaje)

def actualizar_puntaje(usuario, nuevo_puntaje):
    """Actualiza el puntaje del usuario en registro.txt"""
    if not os.path.exists(ruta_registro):
        return

    lineas_nuevas = []
    with open(ruta_registro, "r", encoding="utf-8") as f:
        for linea in f:
            datos = linea.strip().split()
            if len(datos) < 3:
                continue
            nombre = datos[0]
            password = " ".join(datos[1:-1])
            # Si es el usuario actual, actualizamos su puntaje
            if nombre == usuario:
                lineas_nuevas.append(f"{nombre} {password} {nuevo_puntaje}\n")
            else:
                lineas_nuevas.append(linea + "\n")

    # Sobrescribimos el archivo con la nueva información
    with open(ruta_registro, "w", encoding="utf-8") as f:
        f.writelines(lineas_nuevas)

# Cerrar sesión
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route("/scoreboard")
def scoreboard():
    entries = read_registro()
    updated = "desconocida"
    try:
        updated = datetime.fromtimestamp(os.path.getmtime(ruta_registro)).strftime("%Y-%m-%d %H:%M:%S")
    except Exception:
        pass
    return render_template("scoreboard.html", entries=entries, updated=updated)

@app.route("/api/scoreboard")
def api_scoreboard():
    entries = read_registro()
    data = [{"user": u, "score": s} for u, s in entries]
    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)
