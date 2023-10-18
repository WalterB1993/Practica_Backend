require('rootpath')();

var usuario_db = {};

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



usuario_db.getAll = function (funCallback) {
    var consulta = 'SELECT * FROM usuario';
    connection.query(consulta, function (err, rows) {
        if (err) {
            funCallback(err);
            return;
        } else {
            funCallback(undefined, rows);
        }
    });
};

usuario_db.getByEmail = function (funCallback) {
    var consulta = 'SELECT mail FROM usuario WHERE persona_dni=?';
    connection.query(consulta, function (err, rows) {
        if (err) {
            funCallback(err);
            return;
        } else {
            funCallback(undefined, rows);
        }
    });
};



usuario_db.create = function (usuario, funcallback) {
    consulta = "INSERT INTO usuario (mail, nickname, pass) VALUES (?,?,?);";
    params = [usuario.mail, usuario.nickname, usuario.pass];

    connection.query(consulta, params, (err, detail_bd) => {
        if (err) {

            if (err.code == "ER_DUP_ENTRY") {
                funcallback({
                    mensajito: "el usuario ya fue registrado",
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
                mensajito: "se creo la el usaurio " + usuario.nickname,
                detalle: detail_bd
            });
        }
    });
}

usuario_db.delete = function (id_persona_a_eliminar, retorno) {
    consulta = 'DELETE FROM usuario WHERE mail = ?';
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

usuario_db.update = function (usuario, funcallback) {

    parametros = [usuario.nickname, usuario.pass, usuario.mail];
    consulta = "UPDATE usuario SET nickname = ?, pass = ? WHERE mail = ?";

    connection.query(consulta, parametros, function (err, rows) {
        if (err) {
            funcallback(err);
        }
        else {
            funcallback(null, rows)
        }
    });
}

    module.exports = usuario_db;