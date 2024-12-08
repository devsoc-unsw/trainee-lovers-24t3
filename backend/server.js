const { initializeSocketServer } = require('./socketServer');
const http = require('http');

const server = http.createServer();
const connectDB = require('./db');
connectDB();
initializeSocketServer(server);

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});

const fs = require('fs');
const path = require('path');

// schemas
const Question = require('./schema/Question');
const GameSession = require('./schema/GameSession');
const GameUser = require('./schema/GameUser');

function generateRandomWord(categoryName, callback) {
  fs.readdir('categoryWords', (err, files) => {
    if (err) {
      console.error(err);
      callback(err, null);
      return;
    }

    const categoryFile = files.find(file => file === `${categoryName}.txt`);
    if (!categoryFile) {
      const error = `No file found for category: ${categoryName}`;
      console.error(error);
      callback(new Error(error), null);
      return;
    }

    fs.readFile(path.join('categoryWords', categoryFile), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        callback(err, null);
        return;
      }

      const words = data.split('\n');
      const randomIndex = Math.floor(Math.random() * words.length);
      callback(null, words[randomIndex]);
    });
  });
}

const createGame = async (gameId, username, callback) => {
  // first create user
  const newUser = new GameUser({
    gameId: gameId,
    username: username,
    isHost: true,
  });

  await newUser.save();

  const newGame = new GameSession({
    gameId: gameId,
    users: [newUser._id],
    isActive: true,
    questions: [],
    votingSessions: [],
  });

  await newGame.save();

  try {
    await newGame.save();
    console.log("Game started:", newGame);
    callback(null, newGame);
  } catch (err) {
    console.error(err.message);
    callback(err, null);
  }
};

// find game
const findGame = async (gameId) => {
  try {
    const game = await GameSession.findOne({ gameId: gameId });
    if (!game) {
      console.error(`Game not found with gameId: ${gameId}`);
      return null;
    } else {
      console.log("Game found:", game);
    }
    return game;
  }
  catch (err) {
    console.error(err.message);
    return null;
  }
}

// need to correspond each response to this quesiton
const addQuestion = async (questionContent) => {
  const newQuestion = new Question({
    questionContent: questionContent,
    questionResponses: [],
    winner: null,
  });

  try {
      await newQuestion.save();
      console.log("Question saved:", newQuestion);
  } catch (err) {
      console.error(err.message);
  }
};

// createGame("1234", "KJ", (err, game) => {
//   if (err) {
//     console.error(err);
//   } else {
//   }
// });

findGame("1234");

// addQuestion("How many hoes you got?");

module.exports = generateRandomWord;