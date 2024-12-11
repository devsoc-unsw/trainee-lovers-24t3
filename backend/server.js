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
const VotingResponse = require('./schema/VotingResponse');
const VotingSession = require('./schema/VotingSession');

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
const addQuestion = async (questionContent, gameId) => {
  try {
    const newQuestion = new Question({
      questionContent: questionContent,
      questionResponses: [],
      winner: null,
    });

    // create the voting session for this question
    const newVotingSession = new VotingSession({
      sessionId: gameId,
      qid: newQuestion._id,
      votingResponse: [],
    });


    // push to the game session
    const game = await findGame(gameId);
    if (game) {
      game.questions.push(newQuestion._id);
      game.votingSessions.push(newVotingSession._id);
      await game
        .save()
        .then(() => console.log("Game updated with new question"))
        .catch((err) => console.error(err));
    }


    await Promise.all([newQuestion.save(), newVotingSession.save(), game.save()]);
    console.log("Question saved:", newQuestion);
  } catch (err) {
      console.error(err.message);
  }
};

const votePlayer = async (gameId, questionId, playerId, response) => {
  try {
    const votingResponse = await VotingResponse.create({
      uid: playerId,
      response: response
    });

    console.log('VotingResponse Created:', votingResponse);

    // find the votingSession
    const updateVotes = await VotingSession.findOneAndUpdate(
      { sessionId: gameId, qid: questionId },
      { $push: { votingResponse: votingResponse._id } }
    );

    if (updateVotes) {
      console.log('VotingSession Updated:', updateVotes);
    } else {
      console.log(`VotingSession not found for given gameId ${gameId} and questionId ${questionId}`);
    }

  } catch (err) {
    console.error(err.message);
  }
}


// createGame("1234", "KJ", (err, game) => {
//   if (err) {
//     console.error(err);
//   } else {
//   }
// });

// addQuestion("How many hoes you got?", "1234");
// votePlayer("1234", "67597ed7e687558ab23b1098", "675505ea22d896b1e6954880", true);

module.exports = generateRandomWord;