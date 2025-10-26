import random

class Pregunta:

    def __init__(self, text, correct, incorrect):
        self.texto = text
        self.correcto = correct
        self.incorrecto = incorrect

    def randomiza(self):
        respuestas = [self.correcto]
        for i in self.incorrecto:
            respuestas.append(i)
        random.shuffle(respuestas)
        for i in respuestas:
            if self.correcto == i:
                icorrecta = i

        