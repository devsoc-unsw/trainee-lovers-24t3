let ioInstance;
let rooms = {};

import { Server } from 'socket.io';

function initializeSocketServer(server) {

  ioInstance = new Server(server, {
    cors: {
      origin: [
        'http://localhost:3000',
        'https://trainee-warden-24t2-keyword.vercel.app', 
        'http://localhost:3001',
        'https://warden-games.vercel.app'
      ],
      methods: ["GET", "POST"],
      credentials: true
    },
  });

  const userMap = (roomCode) => {
    return rooms[roomCode].users.map(user => ({
      uid: user.uid,
      username: user.username,
      isHost: user.uid === rooms[roomCode].host,
      readyStatus: user.readyStatus,
      roundLoaded: user.roundLoaded
    }));
  };

  ioInstance.on('connection', (socket) => {
    console.log('New connection:', socket.id);

    socket.on('create-room', (username, uid, roomCode, callback) => {
      rooms[roomCode] = {
        host: uid,
        users: [{ socket: socket.id, username, uid, readyStatus: false, roundLoaded: false }],
        gameStart: false,
        timer: 240,
        defaultTime: 240,
        intervalId: null
      };

      socket.join(roomCode);
      ioInstance.to(roomCode).emit('update-room', userMap(roomCode));
      console.log(`${username} created room: ${roomCode}`);
      callback({ success: true });
      console.log(rooms);
    });

    socket.on('join-room', (roomCode, username, uid, callback) => {
        if (!rooms[roomCode]) {
          // If the room doesn't exist, send an error message to the client
          callback({ error: `Room ${roomCode} does not exist.` });
          return;
        }
    
        // Check if the user already exists in the room
        const existingUser = rooms[roomCode].users.find((user) => user.uid === uid);
        if (!existingUser) {
          rooms[roomCode].users.push({
            socket: socket.id,
            username: username,
            uid: uid,
            readyStatus: false,
            roundLoaded: false,
          });
        } else {
          console.log("update socket id for user ", username, " to ", socket.id);
          existingUser.socket = socket.id;
        }
    
        socket.join(roomCode);
    
        const usersInRoom = userMap(roomCode);

        console.log('users in room ', usersInRoom)
    
        // update callback function with the list of users
        callback({ users: usersInRoom });
    
        // alert users that u joined room
        ioInstance.to(roomCode).emit('update-room', usersInRoom);
    });

    socket.on('start-game', (roomCode) => {
      if (!rooms[roomCode]) return;
    
      rooms[roomCode].gameStart = true;
      ioInstance.to(roomCode).emit('game-started');
      console.log(`Game started in room ${roomCode}`);
    });

    socket.on('update-ready', (roomCode, userId) => {
      console.log('updated ready for userId: ', userId)  
      updateReady(roomCode, userId);
    });

    socket.on('disconnect', () => {
      console.log('disconnect is called')
      for (const roomCode in rooms) {
        const userIndex = rooms[roomCode].users.findIndex(user => user.socket === socket.id);
        if (userIndex !== -1) {
            rooms[roomCode].users.splice(userIndex, 1);

            ioInstance.to(roomCode).emit('update-room', userMap(roomCode));

            if (rooms[roomCode].users.length === 0) {
              clearInterval(rooms[roomCode].intervalId);
              delete rooms[roomCode];
              console.log(`Room ${roomCode} deleted as it is now empty.`);
            }

            break;
        }       
      }
    });

    socket.on('check-room-exist', (roomCode, callback) => {
      if (!rooms[roomCode]) {
        callback({ error: `Room ${roomCode} does not exist.` });
      } else {
        callback(userMap(roomCode));
      }
    });

    socket.on('leave-room', (roomCode, userId) => {
      console.log('leave room is called')  
      if (!rooms[roomCode] || !rooms[roomCode].users) {
        return;
      }

      const userIndex = rooms[roomCode].users.findIndex(user => user.uid === userId);
      socket.leave(roomCode);
      console.log(`${userId} left room: ${roomCode}`);
        
      if (userIndex !== -1) {
        rooms[roomCode].users.splice(userIndex, 1);

        ioInstance.to(roomCode).emit('update-room', rooms[roomCode].users.map(user => ({
          username: user.username,
          isHost: user.uid === rooms[roomCode].host,
          readyStatus: user.readyStatus,
          roundLoaded: user.roundLoaded
        })));

        // If the room is empty, delete it
        if (rooms[roomCode].users.length === 0) {
          clearInterval(rooms[roomCode].intervalId);
          delete rooms[roomCode];
          console.log(`Room ${roomCode} deleted as it is now empty.`);
        }
      }
    });

    socket.on('update-time', (roomCode, time) => {
      if (time == "2 min") {
        time = 120;
      } else if (time == "4 min") {
        time = 240;
      } else if (time == "6 min") {
        time = 360;
      } else if (time == "8 min") {
        time = 480;
      } else {
        return;
      }

      console.log('time is', time);

      if (rooms[roomCode]) {
        rooms[roomCode].defaultTime = time;
        rooms[roomCode].timer = time;
        console.log('default time is now', rooms[roomCode].defaultTime);
      }
    });

    socket.on('player-loaded-round', (roomCode, userId) => {
      if (rooms[roomCode]) {
        const user = rooms[roomCode].users.find(user => user.uid === userId);
        if (!user) {
          console.log('user not found for round loaded');
          return;
        }
        user.roundLoaded = true;
        ioInstance.to(roomCode).emit('update-room', userMap(roomCode));

        console.log(`yo ${rooms[roomCode].defaultTime}`);
        // loop through users and check if roundLoaded == true
        const allUsersLoaded = rooms[roomCode].users.every(user => user.roundLoaded === true);
        let intervalId = null
        if (allUsersLoaded && rooms[roomCode].gameStart) {
          // clear existing timers
          if (rooms[roomCode].intervalId) {
            clearInterval(rooms[roomCode].intervalId);
          }

          intervalId = setInterval(() => {
            if (rooms[roomCode] && rooms[roomCode].timer > 0) {
              rooms[roomCode].timer--;
              // console.log('timer is now',  rooms[roomCode].timer);
              ioInstance.to(roomCode).emit('countdown-update', rooms[roomCode].timer);
            } else {
              // clear the interval once it reaches 0
              clearInterval(intervalId);
              ioInstance.to(roomCode).emit('countdown-update', rooms[roomCode].timer);
              rooms[roomCode].timer = rooms[roomCode].defaultTime;
              rooms[roomCode].gameStart = false;
              rooms[roomCode].users.forEach(user => user.roundLoaded = false);
              rooms[roomCode].intervalId = null;
              ioInstance.to(roomCode).emit('game-end');
            }
          }, 1000)
        }
        // store the interval ID for the room.
        rooms[roomCode].intervalId = intervalId
      }
    });

    socket.on('trigger-game-end', (roomCode) => {
      console.log('trigger game end is called')
      console.log(rooms[roomCode]);
      if (rooms[roomCode]) {
        clearInterval(rooms[roomCode].intervalId);
        rooms[roomCode].timer = rooms[roomCode].defaultTime;
        rooms[roomCode].intervalId = null;
        rooms[roomCode].gameStart = false;
        ioInstance.to(roomCode).emit('game-end');
      }
    });

    // The socket that will take the signal when host clicks start game
    socket.on('all-ready', (roomCode, category, cyborg, time) => {
      // maybe add a check if user is actually host here

      rooms[roomCode].gameStart = true;
      ioInstance.to(roomCode).emit('game-start', category, cyborg, time);
      
      // make all ready status false
      rooms[roomCode].users.forEach(user => user.readyStatus = false);
    });

    socket.on('get-word', (roomCode, categoryName) => {
      const generateRandomWord = require('./server').default;
      const room = rooms[roomCode];
      if (!room) {
        console.log('Room not found');
        return;
      }

      if (room.wordGenerated === undefined) {
        room.wordGenerated = false;
      }
      
      if (room.wordGenerated) {
        console.log('Identities have already been generated for this room');
        return;
      }
    
      const allUsersLoaded = room.users.every(user => user.roundLoaded === true);
      if (allUsersLoaded) {
        generateRandomWord(categoryName, (err, word) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log('word generated is ', word)
          ioInstance.to(roomCode).emit('word-generated', word);
        });
      } else {
        console.log('not all users are loaded (generation of words)');
      }
    });

    socket.on('generate-identity', (roomCode, numCyborgs) => {
      const room = rooms[roomCode];
      if (!room) {
        console.log('Room not found');
        return;
      }

      if (room.identitiesGenerated === undefined) {
        room.identitiesGenerated = false;
      }
      
      if (room.identitiesGenerated) {
        console.log('Identities have already been generated for this room');
        return;
      }
    
      const allUsersLoaded = room.users.every(user => user.roundLoaded === true);

      if (numCyborgs === "RANDOM") {
        numCyborgs = Math.floor(Math.random() * (room.users.length + 1));
        console.log('numCyborgs is ', numCyborgs);
      }

      if (allUsersLoaded) {
        const users = rooms[roomCode].users;
        const identities = Array(numCyborgs).fill('CYBORG');
        const numScientists = users.length - numCyborgs;
        identities.push(...Array(numScientists).fill('SCIENTIST'));
        shuffleArray(identities);
        for (let i = 0; i < users.length; i++) {
          ioInstance.to(users[i].socket).emit('identity-generated', identities[i]);
        }
      } else {
        console.log('not all users are loaded');
      }
    });
  });
  console.log('Socket.IO server initialized');
  return ioInstance;
}

// randomise the order of the identities
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function updateReady(roomCode, userId) {
  console.log('users in updateReadyAre for roomCode are : ', rooms[roomCode])
  console.log('rooms data structure ', rooms)
  if (!rooms[roomCode]) {
    console.log('room not found');
    return;
  }
  const user = rooms[roomCode].users.find(user => user.uid === userId);
  if (!user) {
    console.log('user not found');
    return;
  }
  user.readyStatus = !user.readyStatus;
  console.log('update ready for userID: ', userId)
  ioInstance.to(roomCode).emit('update-room', userMap(roomCode));
}

export { initializeSocketServer };