var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

//router
app.get('/', function(req, res){
	res.sendFile(__dirname + '/_pages/index.html');
});

app.use('/_static', express.static('_static'));

//socket.io stuff with a wildcard


io.on('connection', function(socket){
	console.log('client connected');

	var onevent = socket.onevent;
	socket.onevent = function (packet) {
	    var args = packet.data || [];
	    onevent.call (this, packet);    // original call
	    packet.data = ["*"].concat(args);
	    onevent.call(this, packet);      // additional call to catch-all
	};
	socket.on("*",function(event,data) {
	  console.log(event);
	  console.log(data);
	  socket.emit('msg', data);
	});
  
  socket.on('disconnect', function(){
  	console.log('client disconnected')
  });
});

//listen!
http.listen(process.env.PORT || 3000, function(){
	console.log('listening on env.PORT or port 3000');
});