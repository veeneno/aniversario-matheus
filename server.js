const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path'); // Adicione esta linha

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Para servir arquivos estáticos

// Conexão com o banco de dados SQLite
const db = new sqlite3.Database(':memory:'); // Ou use um arquivo específico

// Criação da tabela (exemplo)
db.serialize(() => {
    db.run("CREATE TABLE presencas (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, idade INTEGER, data_inscricao DATETIME DEFAULT CURRENT_TIMESTAMP)");
});

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint para receber RSVP
app.post('/api/rsvp', (req, res) => {
    const presencas = req.body;
    const stmt = db.prepare("INSERT INTO presencas (nome, idade) VALUES (?, ?)");

    presencas.forEach(p => {
        stmt.run(p.nome, p.idade);
    });

    stmt.finalize();
    res.status(201).json({ message: "Presenças registradas com sucesso!" });
});

// Endpoint para listar presenças
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

// Endpoint para deletar presença
app.delete('/api/presencas/:id', (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM presencas WHERE id = ?", id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: "Presença excluída com sucesso!" });
    });
});

// Início do servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
