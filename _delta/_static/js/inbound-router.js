function inboundRouter(AppContext, cmd, data){
	if(cmd.substring(0, 1) == '/'){
		//var cmd_arr = cmd.split(' ');
		var cmd_arr = cmd.match(/(?:[^\s']+|'[^']*')+/g);
		switch(cmd_arr[0]){
			case '/pull':
				console.log('/pull fired')
				pullDOM(data);
				break;
			case '/row':
				editDOM(cmd_arr[1], cmd_arr[2], AppContext);
				break;
			default:
				console.log('echo cmd: ', cmd);
			  console.log('echo data: ', data);
		}	
	} else {
		console.log('msg: ', cmd);
	}
}