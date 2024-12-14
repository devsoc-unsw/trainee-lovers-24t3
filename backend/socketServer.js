let ioInstance;

const createGame = require('./dbFunctions').createGame;
const joinGame = require('./dbFunctions').joinGame;
const userMap = require('./dbFunctions').userMap;
const addQuestion = require('./dbFunctions').addQuestion;
const storeAnswer = require('./dbFunctions').storeAnswer;
const getQuestions = require('./dbFunctions').getQuestions;
const votePlayer = require('./dbFunctions').votePlayer;

function initializeSocketServer(server) {

  if (ioInstance) return ioInstance;

  const { Server } = require('socket.io');
  ioInstance = new Server(server, {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3001'],
      methods: ["GET", "POST", "DELETE"]
    },
  });

  ioInstance.on('connection', (socket) => {
    console.log('New connection:', socket.id);

    socket.on('create-room', async (username, callback) => {
      try {
        createGame(username, async (err, result) => {
          if (err) {
            console.error("Error creating room: ", err);
            // send a callback to the client with the error message
            callback({ error: err });
          } else {
            const roomCode = result.roomCode;
            socket.join(result.roomCode);
            const users = await userMap(roomCode);
            ioInstance.to(roomCode).emit('update-room', users);

            console.log(`${username} created room:`, result.roomCode);
            callback(null, result);
          }
        });
      } catch (error) {
        console.error(error);
        callback({ error: "error creating room" });
      }
    });

    socket.on('join-room', (roomCode, username, callback) => {
      try {
        joinGame(roomCode, username, (err, result) => {
          if (err) {
            console.error("Error joining room: ", err);
            return callback({error: err});
          }

          socket.join(roomCode);

          // will send back the userId & roomcode to the client
          callback(null, result);

          ioInstance.to(roomCode).emit('update-room', userMap(roomCode));
          console.log(`${username} joined room:`, roomCode);
        });
      } catch (error) {
        console.error(error);
        callback({error: "error joining room"});
      }
    });

    socket.on('add-question', async (roomCode, questionsSelected, callback) => {
      try {
        for (const question of questionsSelected) {
          await addQuestion(question.question, question.keyword, roomCode);
        }
      } catch (error) {
          console.error(error);
          callback({error: "error adding question"});
      }
    });

    socket.on('save-question', async (roomCode, questionsAnswered, userId) => {
      try {
        for (const question of questionsAnswered) {
          await storeAnswer(question.qid, userId, question.response, roomCode);
        }

        console.log("All questions saved");
      } catch (error) {
        console.error(error);
      }
    });


    socket.on('start-game', async (roomCode, callback) => {
      try {
        const questions = await getQuestions(roomCode);
        if (questions) {
          ioInstance.to(roomCode).emit('display-questions', { questions });
          console.log("Questions displayed to room:", roomCode);
          console.log(questions);
          callback(null, { message: 'Game started successfully', questions });
        } 
      } catch (error) {
        console.error(error);
      }
    });

    socket.on('vote-player', async (roomCode, qid, pid, response) => {
      try {
        const allVoted = await votePlayer(roomCode, qid, pid, response);
        console.log("Player ", pid, "voted for question:", qid, " with response:", response);

        if (allVoted) {
          // if all voted, then emit to display results and move onto next question
          ioInstance.to(roomCode).emit('display-question-results', qid);
        }
      } catch (error) {
        console.error(error);
      }
    });

  });

  console.log('Socket.IO server initialized');
  return ioInstance;
}

module.exports = { initializeSocketServer };