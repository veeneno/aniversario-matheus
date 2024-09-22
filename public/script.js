document.addEventListener("DOMContentLoaded", () => {
    // Configurando o banner rotativo
    const images = document.querySelectorAll('.banner img');
    let currentIndex = 0;

    function showNextImage() {
        images[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.add('active');
    }

    setInterval(showNextImage, 3000); // Troca de imagem a cada 3 segundos

    // Configurando o formulário
    const form = document.getElementById('rsvpForm');
    const numPessoasInput = document.getElementById('numPessoas');
    const pessoasInputs = document.getElementById('pessoasInputs');

    numPessoasInput.addEventListener('change', () => {
        const numPessoas = numPessoasInput.value;
        pessoasInputs.innerHTML = ''; // Limpa os inputs anteriores

        for (let i = 0; i < numPessoas; i++) {
            pessoasInputs.innerHTML += `
                <label for="nome${i}">Nome ${i + 1}:</label>
                <input type="text" id="nome${i}" required>
                <label for="idade${i}">Idade ${i + 1}:</label>
                <input type="number" id="idade${i}" required>
            `;
        }
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const presencas = [];

        for (let i = 0; i < numPessoasInput.value; i++) {
            const nome = document.getElementById(`nome${i}`).value;
            const idade = document.getElementById(`idade${i}`).value;
            presencas.push({ nome, idade });
        }

        // Enviar os dados para o servidor
        fetch('/api/rsvp', {  // Mude localhost:3000 para /api/rsvp
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(presencas)
        })
        .then(response => {
            if (response.ok) {
                alert('Dados enviados com sucesso!');
                form.reset();
                pessoasInputs.innerHTML = '';
            } else {
                alert('Erro ao enviar os dados.');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao enviar os dados.');
        });
    });
});