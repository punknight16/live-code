function outboundRouter(AppContext, cmd){
	if(cmd.substring(0, 1) == '/'){
		//var cmd_arr = cmd.split(' ');
		var cmd_arr = cmd.match(/(?:[^\s']+|'[^']*')+/g);
		//console.log('cmd_arr: ', cmd_arr);
		
		switch(cmd_arr[0]){
			case '/push':
				
				var data = pushDOM(cmd[1]);
				AppContext.socket.emit(cmd, data);
				break;
			case '/pull':
				
				AppContext.socket.emit(cmd);
				break;
			case '/darkmode':
				toggleChatDarkmode();
				break;
			case '/row':
				if(cmd_arr[1]){
					AppContext.socket.emit(cmd);
					editDOM(cmd_arr[1], cmd_arr[2], AppContext);
					setCaretPos($('#node5')); //need to set caret position to last node created
				} else {
					chatError('<need arguments "/row --flag [row_data] "');
				}
				break;
			default:
				console.log('cmd not found: ', cmd);
		}	
	} else {
		console.log('msg: ', cmd);
		AppContext.socket.emit(cmd);
	}
}