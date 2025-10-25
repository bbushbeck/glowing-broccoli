from pregunta import pregunta
from jugador import jugador

def main():
    pregunta1 = pregunta("¿Cuál es la capital de Francia?", "París", ["Londres", "Berlín", "Madrid"], 10)
    pregunta1.display()
    pregunta1.display()

main()