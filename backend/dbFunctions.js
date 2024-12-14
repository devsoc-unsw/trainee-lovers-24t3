
// schemas
const Question = require('./schema/Question');
const QuestionResponse = require('./schema/QuestionResponse');
const GameSession = require('./schema/GameSession');
const GameUser = require('./schema/GameUser');
const VotingResponse = require('./schema/VotingResponse');
const VotingSession = require('./schema/VotingSession');

const generateUniqueRoomCode = async () => {
  let roomCode;
  let isUnique = false;

  while (!isUnique) {
    roomCode = Math.random().toString(36).substring(2, 6).toUpperCase();

    const existingGame = await GameSession.findOne({ roomCode });
    if (!existingGame) {
      isUnique = true;
    }
  }

  return roomCode;
};

const createGame = async (username, callback) => {
  // first create user
  const roomCode = await generateUniqueRoomCode();

  const newUser = new GameUser({
    roomCode: roomCode,
    username: username,
    isHost: true,
  });

  await newUser.save();

  // generate a 4 letter number roomCode that is not exisitng

  const newGame = new GameSession({
    roomCode: roomCode,
    users: [newUser._id],
    isActive: true,
    questions: [],
    votingSessions: [],
    atQuestion: 0,
  });

  await newGame.save();

  try {
    await newGame.save();
    console.log("Game started:", newGame);
    callback(null, {
      userId: newUser._id,
      message: "Game created successfully",
      roomCode: roomCode
    });
  } catch (err) {
    console.error(err.message);
    callback(err, null);
  }
};

// find game
const findGame = async (roomCode) => {
  try {
    const game = await GameSession.findOne({ roomCode: roomCode });
    if (!game) {
      console.error(`Game not found with roomCode: ${roomCode}`);
      return null;
    }

    return game;
  }
  catch (err) {
    console.error(err.message);
    return null;
  }
}

const joinGame = async (roomCode, username, callback) => {
  try {
    const game = await findGame(roomCode);
    if (!game) {
      return callback(new Error(`Game not found with roomCode: ${roomCode}`), null);
    } 

    const newUser = new GameUser({
      roomCode: roomCode,
      username: username
    })

    await newUser.save();

    // Include player to the game
    game.users.push(newUser._id);
    await game.save();

    return callback(null, {
      userId: newUser._id,
      roomCode: roomCode
    });

  } catch (err) {
    console.error(err.message);
    return callback(err, null);
  }
}

const userMap = async (roomCode) => {
  try {
    const game = await findGame(roomCode);
    if (!game) {
      throw new Error(`Game not found for roomCode: ${roomCode}`);
    }

    await game.populate('users');
    // might need to return more 
    return game.users.map((user) => ({
      username: user.username,
      points: user.points,
      isActive: user.isActive,
      isHost: user.isHost,
    }));
  } catch (error) {
    console.error(`Error in userMap: ${error.message}`);
    throw error; 
  }
}


// need to correspond each response to this quesiton
const addQuestion = async (questionContent, keyword, roomCode) => {
  try {
    const newQuestion = new Question({
      questionContent: questionContent,
      keyword: keyword,
      questionResponses: [],
      winner: null,
    });

    // create the voting session for this question
    const newVotingSession = new VotingSession({
      roomCode: roomCode,
      qid: newQuestion._id,
      votingResponse: [],
    });


    // push to the game session
    const game = await findGame(roomCode);
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

const storeAnswer = async (qid, playerId, response, roomCode) => {
  try {
    const game = await findGame(roomCode);
    if (!game) {
      throw new Error(`Game not found with roomCode: ${roomCode}`)
    }

    const question = await Question.findById(qid);
    if (!question) {
      throw new Error(`Question not found with qid: ${qid}`)
    }

    const newResponse = new QuestionResponse({
      qid: qid,
      uid: playerId,
      response: response
    })
  
    await newResponse.save();

    question.questionResponses.push(newResponse._id);
    await question.save();

    console.log("Player response saved:", newResponse);
    console.log("questionresponses.length = ", question.questionResponses.length, "game.users.length = ", game.users.length);

    
    // calculate the winner for this question
    if (question.questionResponses.length === game.users.length) {
      // this replaces the object ids with the actual objects
      await question.populate('questionResponses');

      // loop through all responses and find who has the max
      // response
      let maxResponse = -1;
      let winnerId = null;
      question.questionResponses.forEach((res) => {
        if (res.response > maxResponse) {
          maxResponse = res.response;
          winnerId = res.uid;
        }
      });

      question.winner = winnerId;
      await question.save();

      console.log(`Winner for question ${qid}: ${winnerId}`);
    }
    
  } catch (err) {
    console.error(err.message);
  }
}

const votePlayer = async (roomCode, questionId, playerId, response) => {
  try {
    const votingResponse = await VotingResponse.create({
      uid: playerId,
      response: response
    });

    console.log('VotingResponse Created:', votingResponse);

    // find the votingSession
    const updateVotes = await VotingSession.findOneAndUpdate(
      { roomCode: roomCode, qid: questionId },
      { $push: { votingResponse: votingResponse._id } }
    );

    if (updateVotes) {
      console.log('VotingSession Updated:', updateVotes);
    } else {
      console.log(`VotingSession not found for given roomCode ${roomCode} and questionId ${questionId}`);
      return false;
    }

    const game = await GameSession.findOne({ roomCode });
    if (!game) {
      console.error(`Game not found with roomCode: ${roomCode}`);
      return false;
    }

    const totalPlayers = game.users.length;

    if (updateVotes.votingResponse.length === totalPlayers) {
      console.log('All players have voted');
      return true;
    } else {
      console.log('Not all players have voted');
      return false;
    }
  } catch (err) {
    console.error(err.message);
  }
}

// once all voted return 

// pass in previous player ids so we don't choose the same players
const chooseRandomPlayer = async (prevPlayerIds, roomCode, questionId) => {
  const game = await findGame(roomCode);
  const players = game.users;
  const randomIndex = Math.floor(Math.random() * players.length);
  const randomPlayer = players[randomIndex];
  
  if (prevPlayerIds.length === players.length) {
    console.error("All players have been chosen");
    // TODO: End game / get next question
    // Currently undefined behaviour
    return null;
  }

  if (prevPlayerIds.includes(randomPlayer)) {
    return chooseRandomPlayer(prevPlayerIds, roomCode, questionId);
  }

  return randomPlayer;

}

// obtains the winner with the more votes in the current voting ession
const getCurrentWinner = async (roomCode, questionId, votingSessionId) => {
  // find the voting session
  const votingSession = await VotingSession.findOne({ roomCode: roomCode, qid: questionId });
  if (!votingSession) {
    console.error(`VotingSession not found for roomCode ${roomCode} and questionId ${questionId}`);
    return null;
  }

  // find the voting responses
  const votingResponses = await VotingResponse.find({ _id: { $in: votingSession.votingResponse } });
  if (!votingResponses) {
    console.error(`VotingResponses not found for votingSessionId ${votingSessionId}`);
    return null;
  }

  // count the votes
  const voteCount = votingResponses.reduce((acc, response) => {
    if (response.response) {
      acc[response.uid] = acc[response.uid] ? acc[response.uid] + 1 : 1;
    }
    return acc;
  }, {});

  // find the player with the most votes
  const winnerId = Object.keys(voteCount).reduce((a, b) => voteCount[a] > voteCount[b] ? a : b);
  return winnerId;
}

const getNextQuestion = (roomCode) => {
  // increment game schema "atQuestion" field
  // return the question at that index
  game = findGame(roomCode);
  game.atQuestion += 1;
  
  if (game.atQuestion == game.questions.length) {
    // TODO: end game
    return null;
  }

  const nextQuestion = game.questions[game.atQuestion];
  return nextQuestion;
}

const getQuestions = async (roomCode) => {
  try {
    const game = await findGame(roomCode);
    if (!game) {
      console.error(`Game not found for roomCode: ${roomCode}`);
      return null;
    }

    await game.populate('questions');

    return game.questions;
  } catch (error) {
    console.error(`Error in displayQuestions: ${error.message}`);
    throw error; 
  }
}

// endGame function
// - set game to inactive

// addQuestion("How many hoes you got?", "1234");
// votePlayer("1234", "67597ed7e687558ab23b1098", "675505ea22d896b1e6954880", true);
// createGame("KJ", (err, game) => {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log(game);
//   }
// });
// addQuestion("How many huzzie you got?", "CS80");
// storeAnswer("675d0bdf36f9bfb9d9affc65", "675c433a555598051dba0842", 5, "CS80");

module.exports = {
  createGame,
  joinGame,
  addQuestion,
  storeAnswer,
  votePlayer,
  chooseRandomPlayer,
  getCurrentWinner,
  getNextQuestion,
  userMap,
  getQuestions
};