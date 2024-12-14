const mongoose = require('mongoose');

const VotingSessionSchema = new mongoose.Schema({
    roomCode: { type: String, required: true },
    qid: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true }, 
    votingResponse: [{ type: mongoose.Schema.Types.ObjectId, ref: 'VotingResponse' }], 
    playersChosen: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GameUser' }],
    allPlayersChosen: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GameUser' }],
});

module.exports = mongoose.model('VotingSession', VotingSessionSchema);
