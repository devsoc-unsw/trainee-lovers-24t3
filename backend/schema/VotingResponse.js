const mongoose = require('mongoose');

const VotingResponseSchema = new mongoose.Schema({
    uid: { type: mongoose.Schema.Types.ObjectId, ref: 'GameUser', required: true },
    response: { type: Boolean, required: true }
});

module.exports = mongoose.model('VotingResponse', VotingResponseSchema);
