require('rootpath')();

var persona_db = {};

const { query } = require('express');
const mysql = require('mysql');
const configuracion = require("config.json");


var connection = mysql.createConnection(configuracion.database);
connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("base de datos conectada");
    }
});


persona_db.getAll = function (funCallback) {
    var consulta = 'SELECT * FROM backend.persona';
    connection.query(consulta, function (err, rows) {
        if (err) {
            funCallback(err);
            return;
        } else {
            funCallback(undefined, rows);
        }
    });
}

persona_db.getByApellido = function (funCallback) {
    var consulta = 'SELECT apellido FROM backend.persona WHERE dni = ?';
    connection.query(consulta, function (err, rows) {
        if (err) {
            funCallback(err);
            return;
        } else {
            funCallback(undefined, rows);
        }
    });
};

persona_db.getUser = function (funCallback) {
    let consulta = 'SELECT nickname FROM backend.persona JOIN backend.usuario WHERE dni = ?';
    connection.query(consulta, function (err, rows) {
        if (err) {
            funCallback(err);
            return;
        } else {
            funCallback(undefined, rows);
        }
    });
};


persona_db.create = function (persona, funcallback) {
    consulta = 'INSERT INTO persona (dni, nombre, apellido) VALUES (?,?,?);';
    params = [persona.dni, persona.apellido, persona.nombre];

    connection.query(consulta, params, (err, detail_bd) => {
        if (err) {

            if (err.code == "ER_DUP_ENTRY") {
                funcallback({
                    mensajito: "La persona ya fue registrada",
                    detalle: err
                });
            } else {
                funcallback({
                    mensajito: "error diferente",
                    detalle: err
                });
            }
        } else {

            funcallback(undefined, {
                mensajito: "se creo la persona " + persona.nombre + persona.apellido,
                detalle: detail_bd
            });
        }
    });
}

persona_db.delete = function (id_persona_a_eliminar, retorno) {
    consulta = 'DELETE FROM backend.persona WHERE dni = ?';
    params = [id_persona_a_eliminar];

    connection.query(consulta, params, (err, result) => {
        if (err) {
            retorno({ message: err.code, detail: err }, undefined);
        } else {

            if (result.affectedRows == 0) {
                retorno(undefined, {
                    message: "No se encontro a la persona",
                    detalle: result
                });
            } else {
                retorno(undefined, {
                    mensajito: "se elimino la persona",
                    detail: result
                });
            }
        }
    });
}

persona_db.update = function (persona, funcallback) {

    parametros = [persona.nombre, persona.apellido, persona.dni];
    $query = `UPDATE backend.persona set nombre = ?, apellido = ? WHERE dni = ?`;

    connection.query($query, parametros, function (err, rows) {
        if (err) {
            funcallback.status(500).send({
                messaje: "error en back end",
                detail: err
            });
            return;
        } else {
            if (rows.affectedRows == 0) {
                funcallback.status(404).send({
                    message: "no se encontro la persona con el dni: " + req.params.dni,
                    detail: rows
                });
            } else {
                funcallback(null, rows)

            }
        }
    }
    )
};

module.exports = persona_db;