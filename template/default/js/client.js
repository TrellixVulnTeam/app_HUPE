const sockets = io("http://localhost:3000");

//user = get_cookie('user');
user = {
    login: 'hova',
}

sockets.emit('conn', user);

sockets.on('connection', (socket) => {
    console.log('a user connected');

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
        if ((data.append) && (data.append != '')) {
            if (!data.html)
                data.html = '';
            $(data.append).append(data.html);
        }
    });
});