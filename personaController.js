require('rootpath')();
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var personaDb = require("model/persona.js");



app.get('/', (req, res) => {

    personaDb.getAll((err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(resultado);
        }
    });

});

app.get('/apellido', (req, res) => {

    personaDb.getByApellido((err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(resultado);
        }
    });

});

app.get('/email', (req, res) => {

    personaDb.getUser((err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(resultado);
        }
    });

});







app.delete('/:dni', (req, res) => {

    let id_persona_a_eliminar = req.params.dni;
    personaDb.delete(id_persona_a_eliminar, (err, result_model) => {
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



app.put("/:dni", (req, res) => {
    let persona = req.body;
    personaDb.update(persona, (err, rows) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(rows);
        }
    });
  }
);

module.exports = app;

