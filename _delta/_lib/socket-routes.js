function socketRouter(socket, cmd, data){
	switch(cmd){
		case '/test':
			console.log('test')
			break;
		default:
			console.log(cmd);
		  console.log(data);
		  socket.emit('msg', data);
	}
}

module.exports = socketRouter;