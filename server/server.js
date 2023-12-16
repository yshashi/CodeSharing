const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const path = require('path');
const cors = require('cors');
app.use(cors({
    origin: 'https://code-sharing.adaptable.app',
    credentials: true
}));

// Serve Angular app
app.use(express.static(path.join(__dirname, 'dist')));

// Serve Angular app for any other route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle code updates
    socket.on('updateCode', (code) => {
        console.log(code)
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
