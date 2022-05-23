module.exports = function(server) {
    const config = global.config;
    server.listen(config.server.port, () => {
        console.log('Server listening at port %d', config.server.port)
    })

    return require('socket.io')(server, {
        cors: {
            origin: config.server.http + '://' + config.server.host + ':' + config.server.port,
            methods: ['GET', 'POST']
        }
    })
};