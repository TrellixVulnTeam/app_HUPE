module.exports = class Tlogin {
    constructor() {

    }
    search = (nick) => {
        var us = global.mysql.query(`select * from dle_users where name ='${nick}'`);
        return us;
    }

}