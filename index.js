var express = require('express');
var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

let connectedUser = [];


function removeUser(id) {
    connectedUser.forEach((user, index) => {
        if (user.id === id) {
            connectedUser.splice(index, 1);
        }
    })
}

io.on('connection', function(socket){
    connectedUser.push(socket);
    socket.on('disconnect', function(){
        console.log('user ' + socket.id + ' disconnected.');
        removeUser(socket.id);
    });

    socket.on('chat message', function(msg){
        connectedUser.forEach((user, ind) => {
            console.log(user.id);
        });
        connectedUser.forEach((sock, i) => {
            if (sock.id !== socket.id) {
                sock.emit('chat message', msg);
            }
        })
    });

    socket.on('typing', function (id, typing_) {
        console.log(id + ' is typing.');
        connectedUser.forEach((sock, i) => {
            if (sock.id !== socket.id) {
                sock.emit('typing', id);
            }
        })
    })
});


