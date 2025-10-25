document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const gameForm = document.getElementById('game-form');

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = '/play';
                } else {
                    alert(data.message);
                }
            });
        });
    }

    // Handle registration form submission
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;

            fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Registration successful! Please log in.');
                    window.location.reload();
                } else {
                    alert(data.message);
                }
            });
        });
    }

    // Handle game form submission
    if (gameForm) {
        gameForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const answer = document.getElementById('answer').value;

            fetch('/submit-answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ answer })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update the game interface with the new question or score
                    document.getElementById('question').innerText = data.next_question;
                    document.getElementById('score').innerText = `Score: ${data.score}`;
                } else {
                    alert(data.message);
                }
            });
        });
    }
});