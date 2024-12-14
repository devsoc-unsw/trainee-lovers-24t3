const io = require('socket.io-client');
const socket = io('http://localhost:3000'); 

// this file is used to test socket connections,
// run testClient.js with the backend running and see the console.logs
socket.emit(
  'save-question',
  '8V0Q',
  [
    {
        qid: '675d7948bb602fc711d82242',
        response: 1
    },
    {
        qid: '675d7948bb602fc711d82249',
        response: 0
    }
  ],
  '675d72b8ca3a66d46b92f607',
  (response) => {
    if (response.error) {
      console.error('Error from server:', response.error);
    } else {
      console.log('Server response:', response.message);
    }
  }
);
