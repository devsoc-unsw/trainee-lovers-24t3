const { initializeSocketServer } = require('./socketServer');
const http = require('http');
const { choosePlayers, joinGame, addQuestion, votePlayer, storeAnswer, userMap } = require('./dbFunctions');

const server = http.createServer();
const connectDB = require('./db');
connectDB();
initializeSocketServer(server);

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// storeAnswer('675df3b91a40fdb2674b5749', '675d7e0281830e4a5bdd4d25', '20', '0E7R');
// storeAnswer('675df3b91a40fdb2674b5749', '675df505725fb32809eb775d', '30', '0E7R');
choosePlayers('0E7R','675df3b91a40fdb2674b5749');
// addQuestion('poop', 'pee', '0E7R');
// votePlayer('0E7R', '675df3b91a40fdb2674b5749', '675df505725fb32809eb775d', 1);
