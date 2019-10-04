var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var staticRouter = require('./_lib/static-routes');
var socketRouter = require('./_lib/socket-routes');

//router


app.use('/_static', express.static('_static'));

app.get('*', function(req, res){
	staticRouter(req, res)
});

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

	socket.on("*",function(cmd,data) {
	  socketRouter(socket, cmd, data, io);
	});
  
  socket.on('disconnect', function(){
  	console.log('client disconnected')
  });
});




//listen!
http.listen(process.env.PORT || 3000, function(){
	console.log('listening on env.PORT or port 3000');
});