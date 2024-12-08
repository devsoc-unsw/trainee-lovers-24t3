const mongoose = require('mongoose');
const GameSessionSchema = new mongoose.Schema({
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GameUser' }], 
    isActive: { type: Boolean, default: true },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }], 
    votingSessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'VotingSession' }],
});

module.exports = mongoose.model('GameSession', GameSessionSchema);
