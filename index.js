var express = require('express');
var socket = require('socket.io');
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "web_socket"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

// App setup
var app = express();
var server = app.listen(4000, function(){
    console.log('listening for requests on port 4000');
});

// Static files
app.use(express.static('public'));

// Socket setup & pass server
var io = socket(server);
io.on('connection', (socket) => {

    console.log('made socket connection', socket.id);

    // get user list 
    con.query("SELECT * FROM users where id!='1' ", function (err, result, fields) {
        if (err) throw err;
        io.sockets.emit('user-list', result);
    });

    socket.on('chat-load', function(data){
        con.query("SELECT * FROM chat_rooms where `receiverId`='"+data.id+"' ", function (err, result, fields) {
            if (err) throw err;
            io.sockets.emit('chat-list', result);
        });
    });

    socket.on('send-msg', function(data){
        var sql = "INSERT INTO chat_rooms (senderId, receiverId,message,msgSenderId) VALUES ('"+data.senderId+"', '"+data.receiverId+"','"+data.message+"','"+data.senderId+"')";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });

        var sql = "INSERT INTO chat_rooms (senderId, receiverId,message,msgSenderId) VALUES ('"+data.receiverId+"', '"+data.senderId+"','"+data.message+"','"+data.senderId+"')";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("2 record inserted");
        });

        con.query("SELECT * FROM chat_rooms where `receiverId`='"+data.receiverId+"' ", function (err, result, fields) {
            if (err) throw err;
            io.sockets.emit('chat-list', result);
        });
    });

});