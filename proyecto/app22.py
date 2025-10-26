import os
from flask import Flask, render_template, request, redirect, url_for, session

app = Flask(__name__)
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
            return redirect(url_for('pregunta'))
        else:
            # ❌ Si no es válido, mostrar error
            return render_template('login.html', error=info)

    # GET → muestra el formulario
    return render_template('login.html')


# Página de preguntas (solo accesible si ya inició sesión)
@app.route('/pregunta')
def pregunta():
    if 'usuario' not in session:
        return redirect(url_for('login'))

    return render_template('pregunta.html', usuario=session['usuario'], puntos=session['puntos'])


# Cerrar sesión
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))


if __name__ == '__main__':
    app.run(debug=True)
