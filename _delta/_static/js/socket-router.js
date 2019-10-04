/*function socketRouter(AppContext, cmd, data){
	if(cmd.substring(0, 1) == '/'){
		var cmd_arr = cmd.split(' ');
		switch(cmd_arr[0]){
			case '/pull':
				console.log('/pull fired')
				pullDOM(data);
				break;
			default:
				console.log('echo cmd: ', cmd);
			  console.log('echo data: ', data);
		}	
	} else {
		console.log('msg: ', cmd);
	}
}*/