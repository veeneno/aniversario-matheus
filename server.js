const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./presencas.db');

app.use(cors());
app.use(bodyParser.json());

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS presencas (id INTEGER PRIMARY KEY, nome TEXT, idade INTEGER, data_inscricao TEXT)");
});

app.post('/api/rsvp', (req, res) => {
    const presencas = req.body;
    const stmt = db.prepare("INSERT INTO presencas (nome, idade, data_inscricao) VALUES (?, ?, ?)");

    presencas.forEach(p => {
        stmt.run(p.nome, p.idade, new Date().toISOString());
    });

    stmt.finalize();
    res.sendStatus(200);
});

app.get('/api/presencas', (req, res) => {
    const filtro = req.query.filtro || 'nome'; // Default para filtrar por nome
    const orderBy = filtro === 'idade' ? 'idade' : filtro === 'data' ? 'data_inscricao' : 'nome';

    db.all(`SELECT * FROM presencas ORDER BY ${orderBy}`, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.delete('/api/presencas/:id', (req, res) => {
    const id = req.params.id;

    db.run("DELETE FROM presencas WHERE id = ?", id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.sendStatus(204);
    });
});

app.put('/api/presencas/:id', (req, res) => {
    const id = req.params.id;
    const { nome, idade } = req.body;

    db.run("UPDATE presencas SET nome = ?, idade = ? WHERE id = ?", [nome, idade, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.sendStatus(204);
    });
});


app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
