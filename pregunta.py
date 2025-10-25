import random

class pregunta:

    def __init__(self, text, correct, incorrect, value):
        self.texto = text
        self.correcto = correct
        self.incorrecto = incorrect
        self.valor = value

    def display(self):
        print(self.texto)
        respuestas = [self.correcto]
        for i in self.incorrecto:
            respuestas.append(i)
        random.shuffle(respuestas)
        for i in respuestas:
            if self.correcto == i:
                icorrecta = i
        for i in respuestas:
            print ("- " ,i)
        
        