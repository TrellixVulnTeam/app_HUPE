const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);

global.path = path;

global.function = require('./component/function');
require('./data/config');


const io = require("./component/socket_connect")(server);
global.io = io;

global.db = new require('./component/mysql');

require("./component/socket_events");

// (async function() {
//     const rows = await db.getall('SELECT * FROM dle_users Limit 10');
//     console.log(rows)
// })();

// var mysql = new Tmysql;
// global.mysql = mysql;
// global.mysql.connect();


const aps = require("./component/app");
var $aps = new aps(app);

app.use(express.static(global.path.join(__dirname, './')));

$aps.get("index.html");