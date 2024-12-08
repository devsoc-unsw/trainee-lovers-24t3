const { initializeSocketServer } = require('./socketServer');
const http = require('http');

const server = http.createServer();
const connectDB = require('./db');

connectDB();
initializeSocketServer(server);

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});

const fs = require('fs');
const path = require('path');
const Question = require('./schema/Question');

function generateRandomWord(categoryName, callback) {
  fs.readdir('categoryWords', (err, files) => {
    if (err) {
      console.error(err);
      callback(err, null);
      return;
    }

    const categoryFile = files.find(file => file === `${categoryName}.txt`);
    if (!categoryFile) {
      const error = `No file found for category: ${categoryName}`;
      console.error(error);
      callback(new Error(error), null);
      return;
    }

    fs.readFile(path.join('categoryWords', categoryFile), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        callback(err, null);
        return;
      }

      const words = data.split('\n');
      const randomIndex = Math.floor(Math.random() * words.length);
      callback(null, words[randomIndex]);
    });
  });
}

const addQuestion = async () => {
  const newQuestion = new Question({
    questionContent: "What is your WAM?",
    questionResponses: [],
    winner: null,
  });

  try {
      await newQuestion.save();
      console.log("Question saved:", newQuestion);
  } catch (err) {
      console.error(err.message);
  }
};

addQuestion();

module.exports = generateRandomWord;