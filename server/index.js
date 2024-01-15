const express = require('express');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');

const io = new Server({ cors: true });
const app = express();

app.use(bodyParser.json());

// map email to socket id 
const emailToSocketMapping = new Map();

io.on('connection', (socket) => {
    socket.on("join-room", (data) => {
        const { emailId, roomId } = data;
        console.log('User with email ' + emailId + 'Joined room ' + roomId);
        emailToSocketMapping.set(emailId, socket.id);
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-joined', { emailId });
    });
});

app.listen(8000, () => {
    console.log('Server listening on port 8000');
});
io.listen(8001);