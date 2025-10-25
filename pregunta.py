from random import random

class pregunta:

    def __init__(self):
        self.texto = ""
        self.correcta = ""
        self.incorrecta = [""]
        self.valor  = 0

    def _init__(self, text, correct, incorrect, value):
        self.texto = text
        self.correcto = correct
        self.incorrecto = incorrect
        self.valor = value

    def display(self):
        print(self.texto, "\n")
        respuestas = [self.correcta]
        for i in self.incorrecta:
            respuestas.append(self.incorrecta[i])
        random. shuffle(respuestas)
        for i in respuestas:
            if self.correcta == respuestas[i]:
                icorrecta = i
        print(respuestas)
        
        