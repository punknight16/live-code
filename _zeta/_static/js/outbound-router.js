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
			case '/clear':
				clearChatLog();
				break;
			case '/row':
				if(cmd_arr[1]){
					AppContext.socket.emit(cmd);
					var node_id = editDOM(cmd_arr[1], cmd_arr[2], AppContext);
					
					setCaretPos($('#node'+node_id)); //need to set caret position to last node created
				} else {
					chatError('<need arguments "/row --flag [row_data] "');
				}
				break;
			case '/compare':
				var [destroy_cmds, add_cmds, edit_cmds] = compareDom();
				var destroy_str = '';
				destroy_cmds.map((obj, index)=>{
					if(index == destroy_cmds.length-1){
						destroy_str += `{"id": "${obj.id}"}`
					} else {
						destroy_str += `{"id": "${obj.id}"},`	
					}
				});
				
				var cmd1 = `/row --destroy '[${destroy_str}]'`;
				AppContext.socket.emit(cmd1);
				var add_str = '';
				add_cmds.map((obj, index)=>{
					if(index == add_cmds.length-1){
						add_str += `{"id": "${obj.id}", "nodetype": "${obj.nodetype}", "tagname": "${obj.tagname}", "parent": "${obj.parent}", "order": ${obj.order}`;
						if(obj.text) add_str += `, "text": "${obj.text}"}`;
						else add_str += `}`;
					} else {
						add_str += `{"id": "${obj.id}", "nodetype": "${obj.nodetype}", "tagname": "${obj.tagname}", "parent": "${obj.parent}", "order": ${obj.order}`;
						if(obj.text) add_str += `, "text": "${obj.text}"},`;
						else add_str += `},`;
					}
				});
				var cmd2 = `/row --add '[${add_str}]'`;
				AppContext.socket.emit(cmd2);
				var edit_str = '';
				edit_cmds.map((obj, index)=>{
					if(index == edit_cmds.length-1){
						edit_str += `{"id": "${obj.id}", "nodetype": "${obj.nodetype}", "tagname": "${obj.tagname}", "parent": "${obj.parent}", "order": ${obj.order}`;
						if(obj.text) edit_str += `, "text": "${obj.text}"}`;
						else edit_str += `}`;
					} else {
						edit_str += `{"id": "${obj.id}", "nodetype": "${obj.nodetype}", "tagname": "${obj.tagname}", "parent": "${obj.parent}", "order": ${obj.order}`;
						if(obj.text) edit_str += `, "text": "${obj.text}"},`;
						else edit_str += `},`;
					}
				});
				var cmd3 = `/row --edit '[${edit_str}]'`;
				console.log('cmd3: ', cmd3);
				AppContext.socket.emit(cmd3);
				break;
			default:
				console.log('cmd not found: ', cmd);
		}	
	} else {
		console.log('msg: ', cmd);
		AppContext.socket.emit(cmd);
	}
}