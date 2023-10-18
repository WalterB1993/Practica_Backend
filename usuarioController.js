require('rootpath')();
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var usuario_Db = require("model/user.js");


app.get('/', (req, res) => {

    usuario_Db.getAll((err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(resultado);
        }
    });

});

app.get('/mail', (req, res) => {

    usuario_Db.getByEmail((err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(resultado);
        }
    });

});




app.post('/', (req, res) => {

    let usuario = req.body;
    usuario_Db.create(usuario, (err, rows) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(rows);
        }
    });

});

app.put('/', (req, res) => {

    usuario = req.body;
    usuario_Db.update(usuario, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {

            res.send(resultado);
        }

    });

});

app.delete('/:mail', (req, res) => {

    let id_usuario_a_eliminar = req.params.mail;
    usuario_Db.delete(id_usuario_a_eliminar, (err, result_model) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (result_model.detail.affectedRows == 0) {
                res.status(404).send(result_model.message);

            } else {
                res.send(result_model);
            }
        }
    });

});






module.exports = app;