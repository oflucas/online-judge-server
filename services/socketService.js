var redisClient = require('../modules/redisClient');
const TIMEOUT_IN_SECONDS = 3600;

module.exports = function(io) {
    // collaboration sessionsId map
    // in fact, redis is simply saving collaborations info
    // for sessionId with no participants for TIMEOUT_IN_SECONDS.
    var collaborations = [];
    // map from socketId to sessionId
    var socketIdToSessionId = [];
    // redis key prefix, we want to share the same redis with other app
    var sessionPath = '/temp_sessions';

    io.on('connection', socket => {
        let sessionId = socket.handshake.query['sessionId'];

        socketIdToSessionId[socket.id] = sessionId;
        // add socket.id to corresponding collaboration session participants
        if (!(sessionId in collaborations)) {
          // a sessionId not in memory (collaborations)
          redisClient.get(sessionPath + '/' + sessionId, function(data) {
            if (data) {
              // check redis to restore
              console.log('session terminated previously; restoring from redis.');
              collaborations[sessionId] = {
                'cachedChangeEvents' : JSON.parse(data),
                'participants': []
              }
            } else {
                // create a new session
                console.log('creating new session');
                collaborations[sessionId] = {
                  'cachedChangeEvents' : [],
                  'participants': [socket.id]
                }
            }
          });
        } else {
          // sessionId in collaborations
          collaborations[sessionId]['participants'].push(socket.id);
        }

        // socket event listeners on 'change' event
        socket.on('change', delta => {
          let sessionId = socketIdToSessionId[socket.id];
          if (sessionId in collaborations) {
            collaborations[sessionId]['cachedChangeEvents'].push(
              // data struct = [socket event name, data, timestamp]
              ['change', delta, Date.now()]
            );
          }
          forwardEvents(socket.id, 'change', delta);
        });

        // socket event listeners on 'cursorMove' event
        socket.on('cursorMove', cursor => {
          cursor = JSON.parse(cursor);
          // to know whose cursor changes, we insert a 'socketId' key in it
          cursor['socketId'] = socket.id;
          forwardEvents(socket.id, 'cursorMove', JSON.stringify(cursor));
        });

        socket.on('restoreBuffer', () => {
          let sessionId = socketIdToSessionId[socket.id];
          console.log('restoring buffer for session: ' + sessionId + ', for socket: ' + socket.id);
          if (sessionId in collaborations) {
            let changeEvents = collaborations[sessionId]['cachedChangeEvents'];
            for (let i = 0; i < changeEvents.length; i++) {
              socket.emit(changeEvents[i][0], changeEvents[i][1]);
            }
          }
        });

        socket.on('disconnect', function() {
          let sessionId = socketIdToSessionId[socket.id];
          console.log('socket:' + socket.id + ' disconnected.');

          if (sessionId in collaborations) {
            // must exist... just be safe here
            let participants = collaborations[sessionId]['participants'];
            let index = participants.indexOf(socket.id);
            if (index >= 0) {
              // must exist... just be safe here
              participants.splice(index, 1); // delete 1 elem at index
              if (participants.length == 0) {
                console.log('last participant left. storing edit events in redis.');
                let key = sessionPath + '/' + sessionId;
                let value = JSON.stringify(collaborations[sessionId]['cachedChangeEvents']);
                redisClient.set(key, value, redisClient.redisPrint);
                redisClient.expire(key, TIMEOUT_IN_SECONDS);
                delete collaborations[sessionId];
              }
            }
          }
        });

        function forwardEvents(socketId, eventName, dataString) {
          console.log( eventName + ' session:' + socketIdToSessionId[socketId] + " " + dataString ) ;
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
