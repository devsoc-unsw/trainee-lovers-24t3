let ioInstance;

const createGame = require("./dbFunctions").createGame;
const joinGame = require("./dbFunctions").joinGame;
const userMap = require("./dbFunctions").userMap;
const addQuestion = require("./dbFunctions").addQuestion;

function initializeSocketServer(server) {
  if (ioInstance) return ioInstance;

  const { Server } = require("socket.io");
  ioInstance = new Server(server, {
    cors: {
      origin: ["http://localhost:3000", "http://localhost:3001"],
      methods: ["GET", "POST", "DELETE"],
    },
  });

  ioInstance.on("connection", (socket) => {
    console.log("New connection:", socket.id);

    socket.on("create-room", async (username, callback) => {
      try {
        createGame(username, (err, result) => {
          if (err) {
            console.error("Error creating room: ", err);
            // send a callback to the client with the error message
            callback({ error: err });
          } else {
            const roomCode = result.roomCode;
            socket.join(result.roomCode);
            ioInstance.to(roomCode).emit("update-room", userMap(roomCode));

            console.log(`${username} created room:`, result.roomCode);
            callback(null, result);
          }
        });
      } catch (error) {
        console.error(error);
        callback({ error: "error creating room" });
      }
    });

    socket.on("join-room", (roomCode, username, callback) => {
      try {
        joinGame(roomCode, username, (err, result) => {
          if (err) {
            console.error("Error joining room: ", err);
            return callback({ error: err });
          }

          socket.join(roomCode);

          // will send back the userId & roomcode to the client
          callback(null, result);

          ioInstance.to(roomCode).emit("update-room", userMap(roomCode));
          console.log(`${username} joined room:`, roomCode);
        });
      } catch (error) {
        console.error(error);
        callback({ error: "error joining room" });
      }
    });
  });
  console.log("Socket.IO server initialized");
  return ioInstance;
}

module.exports = { initializeSocketServer };
