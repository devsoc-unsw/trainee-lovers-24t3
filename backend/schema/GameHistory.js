const mongoose = require('mongoose');

// this one stores the UUID of the GameSession, so do not put roomCode here
const GameHistorySchema = new mongoose.Schema({
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GameUser' }],
    gameSessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GameSession' }], 
});

module.exports = mongoose.model('GameHistory', GameHistorySchema);
