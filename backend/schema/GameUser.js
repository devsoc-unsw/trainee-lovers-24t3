const mongoose = require('mongoose');

const GameUserSchema = new mongoose.Schema({
    gameId: { type: String, required: true },
    username: { type: String, required: true },
    points: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model('GameUser', GameUserSchema);
