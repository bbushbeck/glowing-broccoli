class jugador:
    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = password

    def __str__(self):
        return f"Jugador: {self.name}, Email: {self.email}"