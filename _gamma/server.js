var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

var dom_str = fs.readFileSync(__dirname + '/data.json');
var dom_table = JSON.parse(dom_str);
console.log(dom_table);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.use('/_static', express.static('_static'));

io.on('connection', function(socket){
	console.log('client connected');
	socket.on('/pull DOM', function(){
		socket.emit('DOM', dom_table);
	})
  
  socket.on('disconnect', function(){
  	console.log('client disconnected')
  });

});

http.listen(process.env.PORT || 3000, function(){
	console.log('listening on env.PORT or port 3000');
});