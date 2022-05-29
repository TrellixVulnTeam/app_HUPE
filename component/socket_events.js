global.io.on('connection', function(socket) {

    global.socket = socket;
    var ID = (socket.id).toString().substr(0, 5)
    var time = (new Date).toLocaleTimeString()

    socket.on('conn', async function(data) {
        const date = new Date().toLocaleString().replace(',', '');
        console.log(date + ' - Подключился клиент: ' + socket.id);
        data.socketid = socket.id;
        socket.emit('connection', data);
        require('./../' + global.config.dir.modul + '/login/login')(data);


    });

    socket.on('message', function(data) {

        if (data.modul && data.modul.name && data.modul.name != '') {

            var mfun = '';
            if (data.modul.function && data.modul.function != '')
                mfun = '.' + data.modul.function;

            if (data.modul.name.toLowerCase() == 'function') {
                var func = require('./../component/function');
            } else if (data.modul.name.toLowerCase() == 'component') {
                var func = require('./../component/' + data.modul.file);
            } else {
                var func = require('./../' + global.config.dir.modul + '/' + data.modul.name + '/' + data.modul.file);
            }
            eval(`func${mfun}(data)`);
        }
        if (data.script && data.script != '') {
            eval(data.script);
        }

    })

    socket.on('disconnect', function() {
        var time = (new Date).toLocaleString().replace(',', '');
        console.log(time + ' - Отключился клиент: ' + socket.id);
        global.function.set_status({ socket: socket.id, val: 0 })

    })
})

module.exports = function() {

}