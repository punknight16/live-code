var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};

exports.listen = function(server){
	io = socketio.listen(server);
	io.set('log level', 1);
	io.sockets.on('connection', function(socket){
		guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
		joinRoom(socket, 'Lobby');
		handleMessageBroadcasting(socket, nickNames);
		handleNameChangeAttempts(scoket, nickNames, namesUsed);
		handleRoomJoining(socket);
		socket.ion('rooms', function(){
			socket.emit('rooms', io.sockets.manager.rooms);
		});
		handleClientDisconnection(socket, nickNames, namesUsed);
	})
};

function assignGuestName(socket, guestNumber, nickNames, namesUsed){
	var name = 'Guest'+guestNumber;
	nickNames[socket.id] = name;
	socket.emit('nameRsult', {
		success: true,
		name: name
	});
	namesUsed.push(name);
	return guestNumber++;
}

function joinRoom(socket, room){
	socket.join(room);
	currentRoom[socket.id] = room;
	socket.emit('joinResult', {room: room});
	socket.broadcast.to(room).emit('message', {
		text: nickNames[socket.id] + ' has joined '+ room +'.'
	});
	console.log('io.sockets: ', io.sockets.clients(room));
	var usersInRoom = io.sockets.clients(room);
	if(usersInRoom.length > 1){
		var usersInRoomSummary = 'Users currently in ' + room +':';
		for (var index in usersInRoom){
			var userSocketId = usersInRoom[index].id;
			if(userSocketId != socket.id){
				if(index>0){
					usersInRoomSummary+=', ';
					usersInRoomSummary+=nickNames[userSocketId];

				}
			}
		}
		usersInRoomSummary+='.';
		socket.emit('message', {text: usersInRoomSummary});
	}
};

function handleNameChangeAttempts(socket, nickNames, namesUsed){
	socket.on('nameAttempt', function(name){
		if(name.indexOf('Guest')==0){
			socket.emit('nameResult', {
				success: false,
				message: 'names cannot begin with "guest".'
			});
		} else {
			if(namesUsed.indexOf(name)== -1){
				var previousName = nickNames[socket.id];
				var previousNameIndex = namesUsed.indexOf(previousName);
				namesUsed.push(name);
				delete namesUsed[previousNameIndex]
				socket.emit('nameResult', {
					success: true,
					name: name
				});
				socket.broadcast.to(currentRoom[socket.id]).emit('message', {
					text: previousname + ' is known as ' + name + '.'
				});
			} else {
				socket.emit('nameResult', {
					success: false,
					message: 'That name is already in use.'
				});
			}
		}
	})
}

function handleRoomJoining(socket){
	socket.on('join', function(room){
		socket.leave(currentRoom[socket.id]);
		joinRoom(socket, room.newRoom);
	});
}

function handleClientDiscoonection(socket){
	socket.on('disconnect', function(){
		var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
		delete namesUsed[nameIndex];
		delete nicknames[sockt.id];
	});
}