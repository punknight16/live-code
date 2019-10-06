function outboundRouter(AppContext, cmd){
	if(cmd.substring(0, 1) == '/'){
		var cmd_arr = cmd.split(' ');
		switch(cmd_arr[0]){
			case '/push':
				console.log('/push fired')
				var data = pushDOM(cmd[1]);
				AppContext.socket.emit(cmd, data);
				break;
			case '/pull':
				console.log('/pull fired');
				AppContext.socket.emit(cmd);
				break;
			case '/darkmode':
				toggleChatDarkmode();
			default:
				console.log('cmd not found: ', cmd);
		}	
	} else {
		console.log('msg: ', cmd);
		AppContext.socket.emit(cmd);
	}
}