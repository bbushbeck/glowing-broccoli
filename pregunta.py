import random

class pregunta:

    # def __init__(self):
    #     self.texto = ""
    #     self.correcta = ""
    #     self.incorrecta = [""]
    #     self.valor  = 0

    def __init__(self, text, correct, incorrect, value):
        self.texto = text
        self.correcto = correct
        self.incorrecto = incorrect
        self.valor = value

    def display(self):
        print(self.texto, "\n")
        respuestas = [self.correcto]
        for i in self.incorrecto:
            respuestas.append(i)
        random.shuffle(respuestas)
        for i in respuestas:
            if self.correcto == i:
                icorrecta = i
        print(respuestas)
        
        