const util = require('util');

var connection;

module.exports = class Tmysql {
    constructor() {

    }
    connect = async(host = null, user = null, database = null, password = null) => {
        const mysql = require("mysql2");
        if (!host) {
            var bd = {
                host: global.config.bd.host,
                user: global.config.bd.user,
                database: global.config.bd.database,
                password: global.config.bd.password
            }
        } else {
            var bd = {
                host: host,
                user: user,
                database: database,
                password: password
            }
        }
        connection = mysql.createConnection({
            host: bd.host,
            user: bd.user,
            database: bd.database,
            password: bd.password
        });
        connection.connect(function(err) {
            if (err) {
                return global.function.error("Ошибка: <br>" + err.message);
            } else {
                console.log("Подключение к серверу MySQL успешно установлено");
            }
        });

    }
    tquery = (sql) => {
        return new Promise((resolve, reject) => {
            if (!connection) {
                global.mysql.connect();

            }
            if (sql) {
                connection.query(sql, function(error, result, fields) {
                    // connection.end(); // end connection
                    if (error) {
                        return global.function.error("Ошибка: <br>" + error);
                    } else {
                        return resolve(result);
                    }
                });
            } else {
                //connection.end(); // end connection
                // code:  handle the case 
            }

        })
    }
    query = async(sql) => {

        if (!connection) {
            global.mysql.connect();

        }
        const rows = connection.query(sql, function(error, result, fields) {
            if (error) {
                return global.function.error("Ошибка: <br>" + error);
            } else {
                return result;
            }
        });
        return rows;
    }
};