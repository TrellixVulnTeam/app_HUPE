const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
var jsdom = require('jsdom');
const { JSDOM } = jsdom;
global.jsdom = JSDOM;

global.path = path;

global.function = require('./component/function');
require('./data/config');

global.parser = require('./component/parser');


const io = require("./component/socket_connect")(server);
global.io = io;

global.db = new require('./component/mysql');

require("./component/socket_events");
require("./gulpfile");

// (async function() {
//     const rows = await db.getall('SELECT * FROM dle_users Limit 10');
//     console.log(rows)
// })();

// var mysql = new Tmysql;
// global.mysql = mysql;
// global.mysql.connect();

const ap = require("./component/app");
global.aps = new ap(app);

app.use(express.static(global.path.join(__dirname, './')));
//app.use(express.static('public'))

global.aps.get("index.html");