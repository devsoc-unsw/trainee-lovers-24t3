const mongoose = require('mongoose');

const GameUserSchema = new mongoose.Schema({
    roomCode: { type: String, required: true },
    username: { type: String, required: true },
    points: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isHost: { type: Boolean, default: false },
});

module.exports = mongoose.model('GameUser', GameUserSchema);
