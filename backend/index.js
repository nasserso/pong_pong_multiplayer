const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const cors = require("cors")
const GameArea = require("./GameArea");

const app = express();
app.use(cors());
const server = createServer(app);
const io = new Server(server, {cors: {origin: '*'}});

const game = new GameArea();
const SERVER_TICK = 40;

setInterval(() =>{
  game.ball.update();
  game.collision();
  updateEmit();
}, SERVER_TICK);

const isNumber = (value) => typeof value === "number";

function updateEmit() {
  io.emit("update", {
    padLeft: {
      x: isNumber(game.padLeft?.x) ? game.padLeft?.x : 10,
      y: isNumber(game.padLeft?.y) ? game.padLeft?.y : 10
    }, 
    padRight: {
      x: isNumber(game.padRight?.x) ? game.padRight?.x : 580,
      y: isNumber(game.padRight?.y) ? game.padRight?.y : 10
    }, 
    ball: {
      x: isNumber(game.ball?.x) ? game.ball?.x : 300,
      y: isNumber(game.ball?.x) ? game.ball?.y : 300
    },
  });
}

io.on('connection', (socket) => {
  console.log('a user connected');
  const side = game.addPad();
  socket.emit("pad", side);

  socket.on('up-left', () => {
    game.moveLeftUp()
    // updateEmit(socket);
  });
  socket.on('down-left', () => {
    game.moveLeftDown();
    // updateEmit(socket);    
  });
  socket.on('up-right', () => {
    game.moveRightUp();
    // updateEmit(socket);    
  });
  socket.on('down-right', () => {
    game.moveRightDown();
    // updateEmit(socket);    
  });

  socket.on('disconnect', () => {
    // TODO: remove pad
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});