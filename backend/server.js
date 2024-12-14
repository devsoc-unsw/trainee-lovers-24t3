const { initializeSocketServer } = require('./socketServer');
const http = require('http');
const { createGame, joinGame, addQuestion, storeAnswer } = require('./dbFunctions');


const server = http.createServer();
const connectDB = require('./db');
connectDB();
initializeSocketServer(server);

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});