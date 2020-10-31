const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    // Parâmetros.
    /*const limit = req.params.limit;
    const page = req.params.page;
    const name = req.params.name;*/
    res.status(200).send({
        // TODO: retornar alunos.
        message: 'Sucesso.'
    });
});

router.post('/', (req, res, next) => {
    const student = {
        rga: req.body.rga,
        nome: req.body.nome,
        curso: req.body.curso
    };
    res.status(201).send({
        message: 'Sucesso.'
    });
});

router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    // TODO: Retornar aluno pelo ID.
    res.status(200).send({
        message: 'Sucesso.'
    });
});

router.post('/:id', (req, res, next) => {
    const id = req.params.id;
    const student = {
        id: id,
        rga: req.body.rga,
        nome: req.body.nome,
        curso: req.body.curso
    };
    res.status(201).send({
        message: 'Sucesso.'
    });
});

module.exports = router;