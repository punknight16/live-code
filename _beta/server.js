var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var currentSnapshot = {
	m: ['hello world!', 'this should work!']
};
app.get('/', function(req, res){
	res.sendFile(__dirname + '/_pages/room.html');
});

app.use('/_static', express.static('_static'));

io.on('connection', function(socket){
	console.log('client connected');
	io.emit('start chat', JSON.stringify(currentSnapshot.m));
	//console.log('connection established by: ', socket.id);
	socket.on('chat message', function(msg){
		//console.log('message received: ', msg);
		currentSnapshot.m.push(msg);
    io.emit('chat message', msg);
  });

  socket.on('section edit', function(edit){
  	io.emit('section edit', edit);
  });
  
  socket.on('disconnect', function(){
  	console.log('client disconnected')
  	io.emit('chat message', 'client disconnected');
  });
});

http.listen(process.env.PORT || 3000, function(){
	console.log('listening on env.PORT or port 3000');
});