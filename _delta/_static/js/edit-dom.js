function editDOM(flag, data, AppContext){
	//test case /row --add '[{"id":6,"tagname":"BUTTON","parent":0,"order":3},{"id":7,"tagname":"TEXT","parent":6,"order":0,"text":"HI"}]'
	//test case /row --edit '[{"id":7,"tagname":"TEXT","parent":6,"order":0,"text":"SUBMIT"}]'
	//test case /row --destroy '[{"id":7,"tagname":"TEXT","parent":6,"order":0,"text":"SUBMIT"}]'
	console.log('editDOM fired');
	switch(flag){
		case '--list':
			//show table modal
			callModal(JSON.stringify(AppContext.dom_map));
			break;
		case '--add':
			var row_arr = JSON.parse(data.substring(1, data.length-1));
			row_arr.map((row, index)=>{
				addRow(row);
				AppContext.dom_map.push(row);
			});
			break;
		case '--edit':
			var row_arr = JSON.parse(data.substring(1, data.length-1));
			row_arr.map((row, index)=>{
				editRow(row);
			});
			break;
		case '--destroy':
			console.log('destroy');
			var row_arr = JSON.parse(data.substring(1, data.length-1));
			row_arr.map((row, index)=>{
				destroyRow(row);
			}); 
			break;
		default:
			console.log('flag not found');
	}
}

function destroyRow(node){
	var found_row = AppContext.dom_map.find((row)=>{
		return (row.id == node.id)
	});
	if(found_row == undefined){
		throw 'node_id does not exist';
	}
	found_row.model.parentNode.removeChild(found_row.model);
}


function editRow(node){
	//console.log('edit Row fired!');
	if(node.tagname=='TEXT'){
		var found_row = AppContext.dom_map.find((row)=>{
			return (row.id == node.id)
		});
		if(found_row == undefined){
			throw 'node_id does not exist';
		}
		found_row.model.nodeValue = node.text;
		found_row.text = node.text;
	} else {
		console.log('might not ever have to edit a non-text node');
	}
}

function addRow(node){
	if(node.tagname!=='TEXT'){
		node.model = document.createElement(node.tagname);
		var $node = $(node.model);
		var node_id = 'node'+node.id
		$node.attr('id', node_id );
		if(node.parent == null){
			//new code for tracking actions
			$node.attr('contenteditable', true);
			//$node.on("selectstart", domListener);
			//$node.on("input", handleInput);
			//end new code
			$('#main').append($node);	
		} else {
			var node_id = '#node'+node.parent;
			$(node_id).append($node);
		}
	} else {
		
		if(JSON.stringify(node.text).match(/\\/));
		else {
			var node_parent = '#node'+node.parent;
			var checkExist = setInterval(function() {
		   if ($(node_parent).length) {
		   		node.model = document.createTextNode(node.text);
		      $(node_parent).append(node.model);
		      clearInterval(checkExist);
		   }
			}, 100);
		}
	}
}