var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/_pages/room.html');
});

app.use('/_static', express.static('_static'));

io.on('connection', function(socket){
	//console.log('connection established by: ', socket.id);
	socket.on('chat message', function(msg){
		//console.log('message received: ', msg);
    io.emit('chat message', msg);
  });
});

http.listen(process.env.PORT || 3000, function(){
	console.log('listening on env.PORT or port 3000');
});