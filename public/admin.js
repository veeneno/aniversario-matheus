let filtroAtual = 'nome';

document.addEventListener("DOMContentLoaded", () => {
    const filtroSelect = document.getElementById('filtro');
    const btnFiltrar = document.getElementById('btnFiltrar');

    function carregarDados(filtro) {
        fetch(`/api/presencas?filtro=${filtro}`)
            .then(response => response.json())
            .then(data => {
                const tbody = document.querySelector('#tabelaPresencas tbody');
                tbody.innerHTML = '';

                data.forEach(p => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${p.nome}</td>
                        <td>${p.idade}</td>
                        <td>${new Date(p.data_inscricao).toLocaleString('pt-BR')}</td>
                        <td>
                            <button class="btn delete" onclick="excluirPresenca(${p.id})">Excluir</button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            })
            .catch(error => console.error('Erro:', error));
    }

    // Excluir presença
    window.excluirPresenca = function(id) {
        if (confirm("Você tem certeza que deseja excluir esta presença?")) {
            fetch(`/api/presencas/${id}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    alert('Presença excluída com sucesso!');
                    carregarDados(filtroAtual); // Atualiza a tabela
                } else {
                    alert('Erro ao excluir a presença.');
                }
            })
            .catch(error => console.error('Erro:', error));
        }
    }

    // Carregar dados inicialmente
    carregarDados(filtroAtual);

    btnFiltrar.addEventListener('click', () => {
        filtroAtual = filtroSelect.value;
        carregarDados(filtroAtual);
    });
});
