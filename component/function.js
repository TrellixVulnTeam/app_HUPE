module.exports.error = function(err) {
    if (global.socket)
        global.socket.emit('error', err);

    console.log(err);

}
module.exports.get_io = function(data) {
    global.socket.emit('message', data)
}