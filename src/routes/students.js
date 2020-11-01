const express = require('express');
const router = express.Router();
const db = require('../database/index');

// Retorna os estudantes cadastrados de acordo
// com os parâmetros passados
router.get('/', (req, res, next) => {
    // Parâmetros.
    /*const limit = req.params.limit;
    const page = req.params.page;
    const name = req.params.name;*/
    var pagina =1;
    var limite = 25;
    var nome = "";
    var parametros = [];
    
    var sql = `SELECT * FROM students `;
    var where = " where ID IN (SELECT ID FROM students where upper(nome) like upper(?))";

    if(req.query["nome"]){
        nome = '%' + req.query["nome"] + '%';
        parametros.push(nome);
        sql += where;
    }

    if(req.query["limite"]){
        limite = req.query["limite"];
    }
    parametros.push(parseInt(limite));

    pagina = pagina -1;
    if(req.query["pagina"]){
        pagina = (req.query["pagina"] - 1) * limite;
    }
    parametros.push(pagina);
    
    sql += "ORDER BY nome LIMIT ? OFFSET ?"
    
    db.all(sql, parametros, (err, rows) => {
        if (err) {
            res.status(400).send({ error: err.message });
            return;
        }
        res.status(200).send({
            message: "Sucesso.",
            students: rows
        });
    });
});

// Insere um aluno.
router.post('/', (req, res, next) => {
    // Recebe a requisição com os dados do novo
    // aluno a ser criado.
    const student =  {
        // TODO: Verificar formato RGA (fazer em um controller)
        rga: req.body.rga,
        nome: req.body.nome,
        curso: req.body.curso
    };
    const sql = `INSERT INTO students (rga, nome, curso) VALUES(?, ?, ?)`;
    db.run(sql, [student.rga, student.nome, student.curso], function (err) {
        if (err) {
            res.status(400).send({ error: err.message });
            return;
        }
        res.status(201).send({
            message: 'Aluno criado com sucesso.',
            student: student,
            id: this.lastID
        })
        console.log(`A row has been inserted with id ${this.lastID}`);
    })
});

// Retorna um aluno de um ID específico.
router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    const sql = `SELECT * FROM students WHERE id = ?`
    db.get(sql, id, (err, row) => {
        if (err) {
            res.status(400).send({ error: err.message });
            return;
        }

        if (!row) {
            res.status(404).send({ message: 'Aluno não encontrado' });
            return;
        }
        
        res.status(200).send({
            message: 'Sucesso.',
            data: row
        });
    })
});

// Atualiza um aluno.
router.patch('/:id', (req, res, next) => {
    const data = {
        nome: req.body.nome,
        rga: req.body.rga,
        curso: req.body.curso
    }
    db.run(
        `UPDATE students SET
            nome = COALESCE(?, nome),
            rga = COALESCE(?, rga),
            curso = COALESCE(?, curso)
        WHERE id = ?`,
        [data.nome, data.rga, data.curso, req.params.id],
        function (err) {
            if (err) {
                res.status(400).send({ error: err.message });
                return;
            }

            if (!this.changes) {
                res.status(404).send({ message: 'Aluno não encontrado' });
                return;
            }

            res.status(200).send({
                message: 'Sucesso',
                data: data,
                changes: this.changes
            });
        }
    )
})

// Deleta um aluno.
router.delete('/:id', (req, res, next) => {
    const sql = 'DELETE FROM students WHERE id = ?';
    const param = req.params.id;

    db.run(sql, param, function(err) {
        if (err) {
            res.status(400).send({ error: err.message });
            return;
        }

        if (!this.changes) {
            res.status(404).send({ message: 'Aluno não encontrado' });
            return;
        }

        res.status(200).send({
            message: 'Aluno deletado com sucesso.',
            changes: this.changes
        });
    })
});

router.post('/:id', (req, res, next) => {
    res.status(405).send({ message: 'Método não permitido.' });
});

router.delete('/', (req, res, next) => {
    res.status(405).send({ message: 'Método não permitido.' });
});

router.patch('/', (req, res, next) => {
    res.status(405).send({ message: 'Método não permitido.' });
});

module.exports = router;