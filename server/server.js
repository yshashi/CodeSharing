const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(__dirname + '/dist'));

io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle code updates
    socket.on('updateCode', (code) => {
        // Broadcast the updated code to all connected clients
        io.emit('updatedCode', code);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
