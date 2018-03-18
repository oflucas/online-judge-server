module.exports = function(io) {
  // receive
  io.on('connection', (socket) => {
    console.log(socket);

    // handshake to get some identity info
    var message = socket.handshake.query['message'];
    console.log(message);

    // response
    //  socket.id is to specify receiver
    io.to(socket.id).emit('message', 'hehe from server');
  });
}
