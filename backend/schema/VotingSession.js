const mongoose = require('mongoose');

const VotingSessionSchema = new mongoose.Schema({
    roomCode: { type: String, required: true },
    qid: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true }, 
    votingResponse: [{ type: mongoose.Schema.Types.ObjectId, ref: 'VotingResponse' }], 
});

module.exports = mongoose.model('VotingSession', VotingSessionSchema);
