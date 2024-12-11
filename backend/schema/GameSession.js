const mongoose = require('mongoose');
const GameSessionSchema = new mongoose.Schema({
    gameId: { type: String, required: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GameUser' }], 
    isActive: { type: Boolean, default: true },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }], 
    votingSessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'VotingSession' }],
    atQuestion: {type: Int, default: 0}
});

module.exports = mongoose.model('GameSession', GameSessionSchema);
