const Db = require('./../component/src/sql').default;
module.exports = new Db(global.config.bd);