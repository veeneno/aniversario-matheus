document.addEventListener("DOMContentLoaded", () => {
    // Configurando o banner rotativo
    const images = document.querySelectorAll('.banner img');
    let currentIndex = 0;

    function showNextImage() {
        images[currentIndex].classList.remove('active'); // Remove a classe 'active' da imagem atual
        currentIndex = (currentIndex + 1) % images.length; // Atualiza o índice
        images[currentIndex].classList.add('active'); // Adiciona a classe 'active' à nova imagem
    }

    setInterval(showNextImage, 3000); // Troca de imagem a cada 3 segundos

    // Configurando o formulário
    const form = document.getElementById('rsvpForm');
    const numPessoasInput = document.getElementById('numPessoas');
    const pessoasInputs = document.getElementById('pessoasInputs');

    numPessoasInput.addEventListener('input', () => {
        const numPessoas = parseInt(numPessoasInput.value, 10) || 0; // Converte para número
        pessoasInputs.innerHTML = ''; // Limpa os inputs anteriores

        for (let i = 0; i < numPessoas; i++) {
            pessoasInputs.innerHTML += `
                <input type="text" id="nome${i}" placeholder="Nome ${i + 1}" required>
                <input type="number" id="idade${i}" placeholder="Idade ${i + 1}" required>
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
