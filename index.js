const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);

global.path = path;


global.function = require('./component/function');
require('./data/config');


const io = require("./component/socket_connect")(server);
global.io = io;

require("./component/socket_events");

var __importDefault = (this && this.__importDefault) || function(mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });

const Db = __importDefault(require('./component/src/sql')).default;
const db = new Db(global.config.bd);

(async function() {
    const rows = await db.getall('SELECT * FROM dle_users Limit 10');
    console.log(rows)
})();

// var mysql = new Tmysql;
// global.mysql = mysql;
// global.mysql.connect();


const aps = require("./component/app");
var $aps = new aps(app);

app.use(express.static(global.path.join(__dirname, './')));

$aps.get("index.html");