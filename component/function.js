const fs = require("fs");

module.exports.error = function(err) {
    if (global.socket)
        global.socket.emit('error', err);

    console.log(err);

}
module.exports.get_io = function(data, rezim = '') {
    if (rezim.toLowerCase() == 'all') {
        global.io.sockets.emit('message', data);
    } else {
        global.socket.emit('message', data);
    }
}

module.exports.set_status = async function(data) {
    var otprav = true;
    if (!data.rezim)
        data.rezim = 0;
    if (data.val == 0) {
        data.user = await global.db.getval("SELECT user FROM app_status WHERE socket = ?", [data.socket]);
        await global.db.update("DELETE FROM app_status WHERE socket = ?", [data.socket]);
        var row = await global.db.getrow("SELECT count(user) as count FROM app_status WHERE user = ? ", [data.user]);
        if (row.count > 0) otprav = false
        else {
            var row = {
                name: 'Не в стети',
                image: 'nevseti.svg'
            }
        }
    } else {
        if (!data.val) {
            data.val = await global.db.getval("SELECT status FROM app_status WHERE user = ? LIMIT 1 ", [data.user]);
        }
        if (!data.val) {
            data.val = global.config.status.default;
        }
        var row = await global.db.getrow("SELECT count(user) as count FROM app_status WHERE user = ? and socket = ? ", [data.user, data.socket]);
        if (row.count < 1) {
            await global.db.update(`INSERT INTO app_status (user,status, rezim, socket) VALUES (?,?,?,?)`, [data.user, data.val, data.rezim, data.socket]);
        } else {
            await global.db.update(`UPDATE app_status set status = ?, rezim = ? WHERE user = ?`, [data.val, data.rezim, data.user]);
        }
        var row = await global.db.getrow("SELECT name, image FROM app_s_status WHERE id = ? ", [data.val]);
    }
    var script = '';
    if (data.user) {
        var script = `$('[ava_user=${data.user.toLowerCase()}]').css('background', 'url(${global.config.url.status}${row.image})').attr('title','${row.name}');`;
        script += `$('[ava_user=${data.user.toLowerCase()}]').closest('.k-hbox').find('#idpostatus').text('${row.name}');`;
    }
    if (otprav)
        await global.function.get_io({
            script: script,
        }, 'all')
}

module.exports.existUpload = async function() {
    var director = global.config.dir.server + global.config.dir.upload;
    if (!fs.existsSync(director)) {
        fs.mkdirSync(director);
    }
}

module.exports.existUploadiconBZ = async function() {
    this.existUpload();
    var director = global.config.dir.server + global.config.dir.upload + '/icon_bz/';
    if (!fs.existsSync(director)) {
        fs.mkdirSync(director);
    }
}

module.exports.compiledropdownlist = async function(tabl, column, sort = '') {
    var arrcol = column.split(',');
    var sql = `SELECT ${column} FROM ${tabl} ${sort}`;
    var rows = await global.db.getall(sql);

    return await JSON.stringify(rows);

}