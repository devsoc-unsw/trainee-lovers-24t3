
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
      throw new Error(`Game not found with roomCode: ${roomCode}`);
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
      playersChosen: [],
      allChosenPlayers: [],
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

      // also return true to say everyone submitted
      return true;
    }

    return false;
    
  } catch (err) {
    console.error(err.message);
    return false;
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
      { $push: { votingResponse: votingResponse._id } },
      { new: true} // this returns the updated document
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
    throw err;
  }
}

const chooseTwoRandomPlayers = (players) => {
  const shuffledPlayers = [...players].sort(() => 0.5 - Math.random());
  return shuffledPlayers.slice(0, 2);
};

const chooseOneRandomPlayer = (players) => {
  const randomIndex = Math.floor(Math.random() * players.length);
  return players[randomIndex];
};

const choosePlayers = async (roomCode, questionId) => {
  try {
    const game = await findGame(roomCode);
    if (!game) {
      throw new Error(`Game not found for roomCode: ${roomCode}`);
    }

    await game.populate('users', 'username');

    const players = game.users; 

    let votingSession = await VotingSession.findOne({ roomCode, qid: questionId });
    if (!votingSession) {
      votingSession = await VotingSession.create({
        roomCode,
        qid: questionId,
        votingResponse: [],
        playersChosen: [], 
        allPlayersChosen: [],
      });
    }

    // will only cosign of the id.
    const allChosenPlayers = new Set(votingSession.allPlayersChosen.map(player => player.toString()));

    // If no players are chosen yet (first round)
    if (votingSession.playersChosen.length < 2) {
      // Select two random unique players
      const unchosenPlayers = players.filter(player => !allChosenPlayers.has(player._id.toString()));
      if (unchosenPlayers.length < 2) {
        throw new Error('Not enough unchosen players to start the first round.');
      }

      const [player1, player2] = chooseTwoRandomPlayers(unchosenPlayers);

      // player chosen are the players currently being voted on
      votingSession.playersChosen = [player1._id, player2._id];
      votingSession.allPlayersChosen.push(player1._id, player2._id);
      await votingSession.save();

      console.log('First round ting: Players chosen:', { player1: player1.username, player2: player2.username });
      return { status: 'PLAYERS_SELECTED', player1: player1.username, player2: player2.username };
    }

    // this will be 0 or 1 depending on votes
    const chosenWinnerIndex = await getCurrentWinner(roomCode, questionId);
    console.log('Chosen winner index:', chosenWinnerIndex);
    // check if chosenWinnerIndex is null;
    if (chosenWinnerIndex === null) {
      throw new Error('No voting responses so cannot choose a winner.');
    };
    const currentWinnerId = votingSession.playersChosen[chosenWinnerIndex];
    const currentWinner = players.find(player => player._id.toString() === currentWinnerId.toString());
    const remainingPlayers = players.filter(player => !allChosenPlayers.has(player._id.toString()));

    if (remainingPlayers.length === 0) {
      // then should return an indicator to move onto next question
      console.log('No more players to choose from');

      //find next question
      const nextQuestion = getNextQuestion(roomCode);
      if (!nextQuestion) {
        console.log('No more questions to choose from');
        return { status: 'NO_MORE_QUESTIONS' };
      }

      return { status: 'NEXT_QUESTION', newQuestion: nextQuestion };
    }

    const newPlayer = chooseOneRandomPlayer(remainingPlayers);

    votingSession.playersChosen = [currentWinner._id, newPlayer._id];
    votingSession.allPlayersChosen.push(newPlayer._id);
    // reset the voting responses
    votingSession.votingResponse = [];

    await votingSession.save();
    console.log('Players chosen:', { player1: currentWinner.username, player2: newPlayer.username });
    return { status: 'PLAYERS_SELECTED', player1: currentWinner.username, player2: newPlayer.username };
  } catch (error) {
    console.error('Error in choosePlayers:', error.message);
    throw error;
  }
};


// obtains the winner with the more votes in the current voting ession
const getCurrentWinner = async (roomCode, questionId) => {
  // find the voting session
  const votingSession = await VotingSession.findOne({ roomCode: roomCode, qid: questionId });
  if (!votingSession) {
    console.error(`VotingSession not found for roomCode ${roomCode} and questionId ${questionId}`);
    return null;
  }

  // find the voting responses correlating to the current question
  const votingResponses = await VotingResponse.find({ _id: { $in: votingSession.votingResponse } });
  if (!votingResponses || votingResponses.length === 0) {
    console.error(`no votingResponses`);
    return null;
  }

  // count the votes
  const voteResult = votingResponses.reduce(
    (acc, response) => {
      if (response.response === 1) {
        acc.secondPersonVotes += 1; // Increment votes for the second person
      } else if (response.response === 0) {
        acc.firstPersonVotes += 1; // Increment votes for the first person
      }
      return acc;
    },
    { firstPersonVotes: 0, secondPersonVotes: 0 } // Initial counts
  );

  let winner = 0;
  if (voteResult.firstPersonVotes > voteResult.secondPersonVotes) {
    winner = 0;
  } else if (voteResult.secondPersonVotes > voteResult.firstPersonVotes) {
    winner = 1;
  } else {
    winner = 0; // just give firstPerson the win lawl
  }
  return winner;
}

const getNextQuestion = async (roomCode) => {
  try {
    const game = await findGame(roomCode);
    if (!game) {
      throw new Error(`Game not found for roomCode: ${roomCode}`);
    }

    game.atQuestion += 1;

    if (game.atQuestion >= game.questions.length) {
      console.log(game.atQuestion, game.questions.length);
      console.log('All questions completed, ending game.');
      game.isActive = false;
      // Mark the game as inactive
      await game.save();
       // Signal that there are no more questions
      return null;
    }

    await game.save();

    const nextQuestionId = game.questions[game.atQuestion];
    const nextQuestion = await Question.findById(nextQuestionId);

    if (!nextQuestion) {
      throw new Error(`Question not found for ID: ${nextQuestionId}`);
    }

    return nextQuestion;
  } catch (error) {
    console.error('Error in getNextQuestion:', error.message);
    throw error;
  }
};


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
  choosePlayers,
  getCurrentWinner,
  getNextQuestion,
  userMap,
  getQuestions
};