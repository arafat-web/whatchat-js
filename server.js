const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname + '/public'));

const groups = {};

io.on('connection', (socket) => {
  let userName;
  let groupName;

  socket.on('join group', (data) => {
    userName = data.userName;
    groupName = data.groupName;

    if (!groups[groupName]) {
      groups[groupName] = [];
    }

    groups[groupName].push(userName);
    socket.join(groupName);
    io.to(groupName).emit('join group', `${userName} joined the group`);
  });

  socket.on('chat message', (msg) => {
    io.to(groupName).emit('chat message', {
      userName: userName,
      msg: msg
    });
  })

  socket.on('disconnect', () => {
    if (userName && groupName) {
      groups[groupName] = groups[groupName].filter(user => user !== userName);
      io.to(groupName).emit('leave', `${userName} left the group`);
    }
  });
});

server.listen(3001, '192.168.0.112', () => {
  console.log('listening on 103.133.143.99:3001');
});
