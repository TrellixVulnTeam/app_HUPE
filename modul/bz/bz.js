module.exports.add_edit_bz = async function(data) {
    var html = await global.aps.compilesync(global.config.dir.modul + '/bz/tpl/add_edit_bz.html');

    global.function.get_io({
        append: {
            elem: '#content',
            html: html
        }
    })
}