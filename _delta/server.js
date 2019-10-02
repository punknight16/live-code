var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

app.get('/', function(req, res){
	res.sendFile(__dirname + '/_pages/index.html');
});

app.use('/_static', express.static('_static'));

io.on('connection', function(socket){
	console.log('client connected');
	
  
  socket.on('disconnect', function(){
  	console.log('client disconnected')
  });

});

http.listen(process.env.PORT || 3000, function(){
	console.log('listening on env.PORT or port 3000');
});