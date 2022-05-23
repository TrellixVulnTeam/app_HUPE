module.exports = function() {
    global.io.on('connection', function(socket) {

        global.socket = socket;
        var ID = (socket.id).toString().substr(0, 5)
        var time = (new Date).toLocaleTimeString()

        socket.on('conn', function(data) {
            console.log('Подключился клиент: ' + global.socket.id);
            const Tlogin = require("./../component/sitelogin");
            var login = new Tlogin;
            var user = login.search(data.login)
            socket.emit('connection', data);
        });

        socket.on('message', function(data) {
            var time = (new Date).toLocaleTimeString()

        })

        socket.on('disconnect', function() {
            var time = (new Date).toLocaleTimeString();
            console.log('Отключился клиент: ' + global.socket.id);

        })
    })

}