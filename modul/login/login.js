module.exports = function(data) {
    const Tlogin = require("./../../component/sitelogin");
    var login = new Tlogin;
    global.active = login.active(data);
    if (!global.active) {
        global.socket.emit('message', {
            script: '$("body").html("");',
            append: {
                elem: 'body',
                html: global.aps.compile(global.config.dir.modul + '/login/login.html'),
            }
        })
    }
}