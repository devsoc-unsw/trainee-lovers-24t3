const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    questionContent: { type: String, required: true },
    questionResponses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'QuestionResponse' }],
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'GameUser' }, 
});

module.exports = mongoose.model('Question', QuestionSchema);
