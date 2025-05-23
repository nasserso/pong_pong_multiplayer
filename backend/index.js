const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const cors = require("cors")

const app = express();
app.use(cors());
const server = createServer(app);
const io = new Server(server, {cors: {origin: '*'}});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('ping', () => {
    console.log('PING');
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});