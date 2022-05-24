module.exports = function(data) {
    const Tlogin = require("./../../component/sitelogin");
    var login = new Tlogin;
    global.active = login.active(data);
    if (!global.active) {
        global.socket.emit('message', {
            append: {
                elem: 'body',
                html: '<h1>Эти пришло авторизация</h1>'
            }
        })
        setTimeout(() => {
            global.socket.emit('message', {
                append: {
                    elem: 'body',
                    html: '<h1>Эти 222222</h1>'
                }
            })
        }, 5000);
    }
}