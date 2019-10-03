var fs = require('fs');

function socketRouter(socket, cmd, data){
	if(cmd.substring(0, 1) == '/'){
		var cmd_arr = cmd.split(' ');
		switch(cmd_arr[0]){
			case '/pull':
				console.log('/pull fired')
				pullDOM(socket, cmd_arr[1]);
				break;
			default:
				console.log(cmd);
			  console.log(data);
			  socket.emit('msg', data);
		}	
	} else {
		console.log(cmd);
		console.log(data);
		socket.emit('msg', cmd);
	}
}


function pullDOM(socket, filename){
	var abs_path = __dirname.substring(0, __dirname.length - 4);
	var dom_str = fs.readFileSync(abs_path+ '/_data/'+filename);
	var dom_table = JSON.parse(dom_str);
	console.log(dom_table);
	socket.emit(`/pull ${filename}`, dom_table);
}

module.exports = socketRouter;