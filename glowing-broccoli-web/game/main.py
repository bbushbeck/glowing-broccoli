from flask import Flask, render_template, request, redirect, url_for
from game.jugador import jugador

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        Pmail = request.form['email']
        Ppasw = request.form['password']
        # Here you would typically validate the user's credentials
        return redirect(url_for('play'))
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        Pname = request.form['name']
        Pmail = request.form['email']
        Ppasw = request.form['password']
        jugador1 = jugador(Pname, Pmail, Ppasw)
        # Here you would typically save the new player to a database
        return redirect(url_for('play'))
    return render_template('register.html')

@app.route('/play')
def play():
    return render_template('play.html')

if __name__ == '__main__':
    app.run(debug=True)