function inboundRouter(AppContext, cmd, data){
	if(cmd.substring(0, 1) == '/'){
		//var cmd_arr = cmd.split(' ');
		var cmd_arr = cmd.match(/(?:[^\s']+|'[^']*')+/g);
		switch(cmd_arr[0]){
			case '/pull':
				pullDOM(data);
				break;
			case '/row':
				console.log('cmd_arr: ', JSON.stringify(cmd_arr));
				editDOM(cmd_arr[1], cmd_arr[2], AppContext);
				break;
			default:
				console.log('echo cmd: ', cmd);
			  console.log('echo data: ', data);
		}	
	} else {
		//console.log('msg: ', cmd);	
	}
}