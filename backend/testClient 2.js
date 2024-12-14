const io = require('socket.io-client');
const socket = io('http://localhost:3000'); 

// this file is used to test socket connections,
// run testClient.js with the backend running and see the console.logs
socket.emit(
    'display-questions',
    '8V0Q',
    (response) => {
        if (response.error) {
            console.error('Error from server:', response.error);
        } else {
            console.log('Server response:', response.message);
        }
    }
);
