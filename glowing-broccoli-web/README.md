# Glowing Broccoli Web Game

## Overview
Glowing Broccoli is a web-based financial quiz game that allows users to test their knowledge through a series of questions. Players can register, log in, and compete for high scores.

## Project Structure
```
glowing-broccoli-web
├── app.py
├── game
│   ├── __init__.py
│   ├── pregunta.py
│   ├── jugador.py
│   └── main.py
├── templates
│   ├── index.html
│   └── play.html
├── static
│   ├── css
│   │   └── style.css
│   └── js
│       └── app.js
├── requirements.txt
└── README.md
```

## Installation
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/glowing-broccoli.git
   ```
2. Navigate to the project directory:
   ```
   cd glowing-broccoli-web
   ```
3. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

## Usage
1. Run the application:
   ```
   python app.py
   ```
2. Open your web browser and go to `http://127.0.0.1:5000` to access the game.

## Features
- User registration and login
- Interactive quiz game with financial questions
- Score tracking and leaderboard functionality

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.