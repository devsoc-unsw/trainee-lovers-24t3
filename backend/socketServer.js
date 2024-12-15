let ioInstance;

const createGame = require('./dbFunctions').createGame;
const joinGame = require('./dbFunctions').joinGame;
const userMap = require('./dbFunctions').userMap;
const addQuestion = require('./dbFunctions').addQuestion;
const storeAnswer = require('./dbFunctions').storeAnswer;
const getQuestions = require('./dbFunctions').getQuestions;
const votePlayer = require('./dbFunctions').votePlayer;
const getCurrentWinner = require('./dbFunctions').getCurrentWinner;
const choosePlayers = require('./dbFunctions').choosePlayers;

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
            console.log("We have these users:", users);

            console.log(`${username} created room:`, result.roomCode);
            callback(null, result);
          }
        });
      } catch (error) {
        console.error(error);
        callback({ error: "error creating room" });
      }
    });

    socket.on("join-room", async (roomCode, username, callback) => {
      try {
        joinGame(roomCode, username, async (err, result) => {
          if (err) {
            console.error("Error joining room: ", err);
            return callback({error: err});
          }

          socket.join(roomCode);

          try {
            const users = await userMap(roomCode);
            ioInstance.to(roomCode).emit("update-room", users);

            console.log(`${username} joined room:`, roomCode);

            callback(null, result);
          } catch (err) {
            callback({ error: "error while fetching users "})
          }

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
        let allAnswered = false;
        for (const question of questionsAnswered) {
          allAnswered = await storeAnswer(question.qid, userId, question.response, roomCode);
        }

        // if all answered then emit all answered
        if (allAnswered) {
          // first index
          const players = await choosePlayers(roomCode, questionsAnswered[0].qid);
          // will send the all-answered event to the room prompting the route to display the questions
          ioInstance.to(roomCode).emit('all-answered', { player1: players.player1, player2: players.player2 });
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
          // then choose players for next question
          const players = await choosePlayers(roomCode, qid);
          if (!players) {
            console.error('No players could be chosen.');
          }
      
          switch (players.status) {
            case 'NEXT_QUESTION':
              console.log('All players have been chosen, moving to the next question.');
              // give the winner of the previous question and next question
              ioInstance.to(roomCode).emit('next-question', { winner: players.winner, questionId: players.qid });
            case 'NO_MORE_QUESTIONS':
              console.log('No more questions to display. Ending the game.');
              ioInstance.to(roomCode).emit('end-game');      
            case 'PLAYERS_SELECTED':
              ioInstance.to(roomCode).emit('display-results', { player1: players.player1, player2: players.player2 });      
            default:
              console.error('Unknown status received from choosePlayers:', players.status);
          }
        }
      } catch (error) {
        console.error(error);
      }
    });

    // retrieving winner
    socket.on('get-winner', async (roomCode, questionId, callback) => {
      try {
        // will return 0 for first person 1 for second person
        const winner = await getCurrentWinner(roomCode, questionId);
        callback(null, winner);
      } catch (error) {
        console.error(error);
      }
    });
  });

  console.log('Socket.IO server initialized');
  return ioInstance;
}

module.exports = { initializeSocketServer };