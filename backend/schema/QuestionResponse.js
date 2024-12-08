const mongoose = require('mongoose');

const QuestionResponseSchema = new mongoose.Schema({
    qid: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true }, 
    uid: { type: mongoose.Schema.Types.ObjectId, ref: 'GameUser', required: true }, 
    response: { type: String, required: true },
});

module.exports = mongoose.model('QuestionResponse', QuestionResponseSchema);
