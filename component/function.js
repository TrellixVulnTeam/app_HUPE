module.exports = function error(err) {
    if (global.socket)
        global.socket.emit('error', err);

    console.log(err);

}