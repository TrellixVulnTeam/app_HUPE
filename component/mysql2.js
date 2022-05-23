const db = require('./../component/src/db');

module.exports = new db(global.config.bd);