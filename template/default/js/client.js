const sockets = io("http://localhost:3000");
var socket_id = '';
//user = get_cookie('user');
user = {
    login: get_cookie('login'),
    hash: get_cookie('session'),
    session: session
}

sockets.emit('conn', user);

sockets.on('connection', (socket) => {
    console.log('a user connected');
    socket_id = socket.socketid;
    sockets.on('disconnect', () => {
        console.log('user disconnected');
    });

    sockets.on('error', (data) => {
        error_show(data);
    });

    sockets.on('message', function(data) {
        if ((data.script) && (data.script != '')) {
            eval(data.script);
        }
        if ((data.append) && (data.append.html != '')) {
            $(data.append.elem).add_elem(data.append.html);
        }
        if ((data.add) && (data.add.html != '')) {
            $(data.add.elem).append(data.add.html);
        }
        if ((data.script_end) && (data.script_end != '')) {
            eval(data.script_end);
        }
    });
});