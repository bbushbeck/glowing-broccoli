from flask import Flask, render_template
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATES_DIR = os.path.join(BASE_DIR, "proyecto", "templates")
STATIC_DIR = os.path.join(BASE_DIR, "proyecto", "static")

# Flask configurado para usar proyecto/templates y proyecto/static
app = Flask(__name__, template_folder=TEMPLATES_DIR, static_folder=STATIC_DIR, static_url_path="/static")

@app.route("/")
def index():
    # render_template buscará proyecto/templates/game.html
    return render_template("game.html")

if __name__ == "__main__":
    app.run(debug=True)