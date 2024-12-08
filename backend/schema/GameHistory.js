const mongoose = require('mongoose');

const GameHistorySchema = new mongoose.Schema({
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GameUser' }],
    gameSessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GameSession' }], 
});

module.exports = mongoose.model('GameHistory', GameHistorySchema);
