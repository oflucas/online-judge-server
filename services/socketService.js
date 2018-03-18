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

        // socket event listeners on 'change' event
        socket.on('change', delta => {
          forwardEvents(socket.id, 'change', delta);
        });

        // socket event listeners on 'cursorMove' event

        socket.on('cursorMove', cursor => {
          cursor = JSON.parse(cursor);
          // to know whose cursor changes, we insert a 'socketId' key in it
          cursor['socketId'] = socket.id;
          forwardEvents(socket.id, 'cursorMove', JSON.stringify(cursor));
        });

        function forwardEvents(socketId, eventName, dataString) {
          console.log( eventName + socketIdToSessionId[socketId] + " " + dataString ) ;
          let sessionId = socketIdToSessionId[socketId];
          if (sessionId in collaborations) {
            let participants = collaborations[sessionId]['participants'];
            for (let i = 0; i < participants.length; i++) {
              if (socket.id != participants[i]) {
                io.to(participants[i]).emit(eventName, dataString);
              }
            }
          } else {
            console.warn('could not tie socket.id to any collaboration');
          }
        }
      });
}
