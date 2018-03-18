module.exports = function(io) {
    // collaboration sessionsId map
    var collaborations = [];
    // map from socketId to sessionId
    var socketIdToSessionId = [];

    io.on('connection', socket => {
        let sessionId = socket.handshake.query['sessionId'];

        socketIdToSessionId[socket.id] = sessionId;
        // add socket.id to corresponding collaboration session participants
        if (!(sessionId in collaborations)) {
          console.log("creating new session");
          collaborations[sessionId] = {
            'participants': []
          };
        }
        collaborations[sessionId]['participants'].push(socket.id);


        // socket event listeners
        socket.on('change', delta => {
            console.log( "change " + socketIdToSessionId[socket.id] + " " + delta ) ;
            let sessionId = socketIdToSessionId[socket.id];

            if (sessionId in collaborations) {
              let participants = collaborations[sessionId]['participants'];
              for (let i = 0; i < participants.length; i++) {
                if (socket.id != participants[i]) {
                  io.to(participants[i]).emit('change', delta);
                }
              }
            } else {
              console.warn('could not tie socket.id to any collaboration');
            }
        });
      });
}
