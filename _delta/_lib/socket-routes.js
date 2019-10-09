var fs = require('fs');

function socketRouter(socket, cmd, data, io){
	if(cmd.substring(0, 1) == '/'){
		var cmd_arr = cmd.split(' ');
		switch(cmd_arr[0]){

			case '/row':
				console.log('/row fired');
				socket.broadcast.emit(cmd);
				break;

			case '/pull':
				console.log('/pull fired')
				pullDOM(socket, cmd_arr[1]);
				break;
			case '/push':
				console.log('/push fired');
				pushDOM(socket, cmd_arr[1], data);
				break;
			default:
				console.log(cmd);
			  console.log(data);
			  socket.emit('msg', `<unknown cmd '${cmd_arr[0]}'>`);
		}	
	} else {
		console.log(cmd);
		console.log(data);
		io.emit('msg', cmd);
	}
}


function pullDOM(socket, filename){
	var abs_path = __dirname.substring(0, __dirname.length - 4);
	readFile(abs_path+ '/_data/'+filename, function(file_data){
		if(file_data.length==0){
			socket.emit('msg', `<file not found: '${filename}'>`);
		} else {
			socket.emit(`/pull ${filename}`, file_data);
			socket.emit('msg', `/pull ${filename}`);	
		}
	});
}

function pushDOM(socket, filename, data){
	var abs_path = __dirname.substring(0, __dirname.length - 4);
	writeFile(abs_path+ '/_data/'+filename, data, function(err){
		if(err){
			socket.emit('msg', `<error: '${err}'>`);
		} else {
			socket.emit('msg', `/push ${filename}`);	
			socket.emit('msg', '<file saved>');
		}
	});
}

function readFile(file_path, cb){
	fs.exists(file_path, function(exists){
		if(exists){
			fs.readFile(file_path, 'utf8', function(err, data){
				if(err) throw err;
				var file_data = JSON.parse(data || '[]');
				cb(file_data);
			});
		} else {
			cb([]);
		}
	});
}

function writeFile(file_path, file_data, cb){
	fs.writeFile(file_path, JSON.stringify(file_data), 'utf8', function(err){
		return cb(err)
	});
}

module.exports = socketRouter;