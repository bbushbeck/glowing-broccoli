class jugador:
    def __init__(self, nombre, correo, contraseña):
        self.nombre = nombre
        self.correo = correo
        self.contraseña = contraseña

    def sumar_puntos(self, puntos):
        self.puntos += puntos

    def mostrar_info(self):
        return f'Nombre: {self.nombre}, Puntos: {self.puntos}'

#oadload

