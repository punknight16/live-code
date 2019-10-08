function outboundRouter(AppContext, cmd){
	if(cmd.substring(0, 1) == '/'){
		//var cmd_arr = cmd.split(' ');
		var cmd_arr = cmd.match(/(?:[^\s']+|'[^']*')+/g);
		//console.log('cmd_arr: ', cmd_arr);
		
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
				break;
			case '/row':
				console.log('AppContext.dom_map: ', AppContext.dom_map);
				if(cmd_arr[1]){
					editDOM(cmd_arr[1], cmd_arr[2], AppContext);	
				} else {
					chatError('<need arguments "/row --flag [row] "');
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