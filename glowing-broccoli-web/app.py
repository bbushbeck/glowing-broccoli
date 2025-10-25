from flask import Flask, render_template, request, redirect, url_for
from game.main import main as game_main
from game.jugador import jugador

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        # Here you would typically validate the user's credentials
        return redirect(url_for('play'))
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']
        jugador1 = jugador(name, email, password)
        # Here you would typically save the new player to a database
        return redirect(url_for('play'))
    return render_template('register.html')

@app.route('/play')
def play():
    # This is where you would integrate the game logic
    return render_template('play.html')

if __name__ == '__main__':
    app.run(debug=True)