class Pregunta:
    def __init__(self, texto, respuesta_correcta, opciones):
        self.texto = texto
        self.respuesta_correcta = respuesta_correcta
        self.opciones = opciones

    def es_correcta(self, respuesta):
        return respuesta == self.respuesta_correcta

def cargar_preguntas():
    preguntas = [
        Pregunta("¿Cuál es la moneda oficial de Japón?", "Yen", ["Dólar", "Yen", "Euro", "Libra"]),
        Pregunta("¿Qué es un activo?", "Un recurso que tiene valor", ["Una deuda", "Un recurso que tiene valor", "Un gasto", "Ninguna de las anteriores"]),
        Pregunta("¿Qué es un presupuesto?", "Un plan financiero", ["Un plan financiero", "Un tipo de inversión", "Una cuenta bancaria", "Ninguna de las anteriores"]),
    ]
    return preguntas