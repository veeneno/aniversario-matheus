document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === 'matheus' && password === 'niver') {
            // Redireciona para a página admin
            window.location.href = 'admin.html';
        } else {
            alert('Usuário ou senha incorretos!');
        }
    });
});
