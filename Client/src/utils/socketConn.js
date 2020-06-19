import io from 'socket.io-client';
const socketURL = 'http://localhost:5000';

export default io(socketURL);