const express = require('express');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');

const io = new Server({ cors: true });
const app = express();

app.use(bodyParser.json());

// map email to socket id 
const emailToSocketMapping = new Map();
const socketIdToEmailMapping = new Map();

io.on('connection', (socket) => {
    socket.on("join-room", (data) => {
        const { emailId, roomId } = data;
        console.log('User with email ' + emailId + 'Joined room ' + roomId);
        emailToSocketMapping.set(emailId, socket.id);
        socketIdToEmailMapping.set(socket.id, emailId);
        socket.join(roomId);
        socket.emit("joined-room", { roomId });
        socket.broadcast.to(roomId).emit("user-joined", { emailId });
    });


    socket.on("call-user", (data) => {
        const { emailId, offer } = data;
        const fromEmail = socketIdToEmailMapping.get(socket.id)
        const socketId = emailToSocketMapping.get(emailId);
        socket.to(socketId).emit("incoming-call", { from: fromEmail, offer });
    });

    socket.on("call-accepted", (data) => {
        const { emailId, ans } = data;
        const socketId = emailToSocketMapping.get(emailId);
        socket.to(socketId).emit("call-accepted", { ans });
    });

});

app.listen(8000, () => {
    console.log('Server listening on port 8000');
});
io.listen(8001);