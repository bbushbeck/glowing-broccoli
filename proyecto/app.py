from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

# Página de login
@app.route('/', methods=['GET', 'POST'])
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        usuario = request.form['usuario']
        password = request.form['password']

        # Validación simple
        if usuario == 'admin' and password == '1234':
            # Redirigir a la página siguiente
            return redirect(url_for('pregunta'))
        else:
            # Mostrar un mensaje de error (simple)
            return render_template('login.html', error='Usuario o contraseña incorrectos')

    return render_template('login.html')

# Página siguiente
@app.route('/pregunta')
def pregunta():
    return render_template('pregunta.html')

if __name__ == '__main__':
    app.run(debug=True)