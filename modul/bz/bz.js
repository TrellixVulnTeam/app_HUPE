const fs = require("fs");

module.exports.add_edit_bz = async function(data) {
    var html = await global.aps.compilesync(global.config.dir.modul + '/bz/tpl/add_edit_bz.html');

    global.function.get_io({
        append: {
            elem: '#content',
            html: html
        }
    })
}

function getRandomName() {
    return parseInt((Math.random() * 10000000000000000000)).toString(36)
}

module.exports.save_new_bz = async function(data) {

    global.function.existUploadiconBZ();
    if (data.images) {
        var images = Buffer.from(data.images.buff);
        var nameext = global.path.extname(data.images.name);
        var name_img = getRandomName() + nameext;
        var files = global.config.dir.server + global.config.dir.upload + `/icon_bz/${name_img}`;
        fs.writeFileSync(files, images);
    }
}

module.exports.prover_ident = async function(data) {

    var row = await global.db.getrow("SELECT count(id) as count FROM app_bz WHERE ident = ? ", [data.ident]);
    if (row.count > 0) {
        var script = `$('#idcheind').css("display","").removeClass("cliconcheck").addClass("nocheck").attr("title","Идентификатор занят");`;
    } else {
        var script = `$('#idcheind').css("display","").removeClass("nocheck").addClass("cliconcheck").attr("title","Идентификатор свободен");`;
    }

    global.function.get_io({
        script: script
    })
}