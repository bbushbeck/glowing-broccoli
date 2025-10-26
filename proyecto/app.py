import os
from flask import Flask, render_template, request, redirect, url_for, session
from pregunta import Pregunta
import random

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

def verificar_usuario(nombre, contrasena):
    """Verifica si el usuario existe y la contraseña coincide."""
    if not os.path.exists(ruta_registro):
        return False, "No hay usuarios registrados"

    with open(ruta_registro, "r", encoding="utf-8") as f:
        for linea in f:
            datos = linea.strip().split()
            if len(datos) < 3:
                continue
            nombre_txt, contrasena_txt, puntos = datos

            if nombre == nombre_txt:
                if contrasena == contrasena_txt:
                    return True, int(puntos)
                else:
                    return False, "Contraseña incorrecta"

    return False, "Usuario no encontrado"


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
            # ✅ Redirige a pregunta.html
            return redirect(url_for('menu'))
        else:
            # ❌ Si no es válido, mostrar error
            return render_template('login.html', error=info)

    # GET → muestra el formulario
    return render_template('login.html')

@app.route('/menu')
def menu():
    return render_template('menu.html')

# Página de preguntas (solo accesible si ya inició sesión)
@app.route('/pregunta')
def pregunta():
    random.shuffle(preguntas)
    preg = preguntas[0].texto
    respuesta1 = preguntas[0].correcto
    respuesta2 = preguntas[0].incorrecto[0]
    respuesta3 = preguntas[0].incorrecto[1]
    respuesta4 = preguntas[0].incorrecto[2]
    return render_template('pregunta.html', texto = preg, r1 = respuesta1, r2 = respuesta2, r3 = respuesta3, r4 = respuesta4, user = session['usuario'], score = session['puntos'])

@app.route('/aventura')
def aventura():
    return render_template('aventura.html')

@app.route('/scoreboard')
def scoreboard():
    return render_template('scoreboard.html')

# Cerrar sesión
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))


if __name__ == '__main__':
    app.run(debug=True)
