const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = new sqlite3.Database(':memory:'); // Use um banco de dados em memória para testes

// Criação de tabela de presenças
db.serialize(() => {
    db.run("CREATE TABLE presencas (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, idade INTEGER, data_inscricao TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
});

// Rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para o admin
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Rota para o formulário
app.get('/formulario', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'formulario.html'));
});

// API para registrar presença
app.post('/api/rsvp', (req, res) => {
    const presencas = req.body;
    const stmt = db.prepare("INSERT INTO presencas (nome, idade) VALUES (?, ?)");

    presencas.forEach(p => {
        stmt.run(p.nome, p.idade);
    });

    stmt.finalize();
    res.status(201).json({ message: 'Presenças registradas com sucesso!' });
});

// API para obter presenças
app.get('/api/presencas', (req, res) => {
    const filtro = req.query.filtro || 'nome';
    db.all(`SELECT * FROM presencas ORDER BY ${filtro}`, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// API para excluir presença
app.delete('/api/presencas/:id', (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM presencas WHERE id = ?", id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Presença excluída com sucesso!' });
    });
});

// Inicie o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
