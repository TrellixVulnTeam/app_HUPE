global.io.on('connection', function(socket) {

    global.socket = socket;
    var ID = (socket.id).toString().substr(0, 5)
    var time = (new Date).toLocaleTimeString()

    socket.on('conn', async function(data) {
        console.log('Подключился клиент: ' + global.socket.id);
        socket.emit('connection', data);
        require('./../' + global.config.dir.modul + '/login/login')(data);
        //var user = login.search(data.login)
        // var us;
        // var user = await login.search('fullname', 'name = ?', [data.login], 1);
        // var a = user;

    });

    socket.on('message', function(data) {
        var time = (new Date).toLocaleTimeString()

    })

    socket.on('disconnect', function() {
        var time = (new Date).toLocaleTimeString();
        console.log('Отключился клиент: ' + global.socket.id);

    })
})

module.exports = function() {

}