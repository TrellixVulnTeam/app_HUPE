module.exports = class Tlogin {
    constructor() {

    }
    active = (data) => {
        if (data.id && data.id != '') {
            return true;
        } else {
            return false;
        }
    }
    search = (col, where, massiv = null, limit = 0) => {
        where = (where != '') ? 'where ' + where : where;
        col = (col == '') ? '*' : col;
        limit = (limit > 1) ? `limit ${limit}` : '';

        var sql = `select ${col} from dle_users ${where} ${limit}`;
        if (limit = 1) {
            var rows = global.db.getrow(sql, massiv);
        } else {
            var rows = global.db.getAll(sql, massiv);
        }
        return rows;
    };

}