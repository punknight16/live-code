function editDOM(flag, data, AppContext){
	//test case /row --add '[{"id":6,"tagname":"BUTTON","parent":0,"order":3},{"id":7,"tagname":"TEXT","parent":6,"order":0,"text":"HI"}]'
	//test case /row --edit '[{"id":7,"tagname":"TEXT","parent":6,"order":0,"text":"SUBMIT"}]'
	//test case /row --destroy '[{"id":6,"tagname":"BUTTON","parent":0,"order":3},{"id":7,"tagname":"TEXT","parent":6,"order":0,"text":"HI"}]'
	var node_id = '';
	switch(flag){
		case '--list':
			//show table modal
			callModal(JSON.stringify(AppContext.dom_map.map((row)=>{
				if(row.tagname=='TEXT'){
					return {"id":row.id, "tagname": row.tagname, "parent": row.parent, "order": row.order, "text": row.text};
				} else {
					return {"id":row.id, "tagname": row.tagname, "parent": row.parent, "order": row.order};
				}
				
			})));
			break;
		case '--add':
			var row_arr = JSON.parse(data.substring(1, data.length-1));
			row_arr.map((row, index)=>{
				addRow(row);
				AppContext.dom_map.push(row);
				node_id = row.parent
			});
			break;
		case '--edit':
			var row_arr = JSON.parse(data.substring(1, data.length-1));
			row_arr.map((row, index)=>{
				editRow(row);
				node_id = row.parent
			});
			break;
		case '--destroy':
			
			var row_arr = JSON.parse(data.substring(1, data.length-1));
			row_arr.map((row, index)=>{
				destroyRow(row);
				node_id = row.parent
			}); 
			break;
		default:
			console.log('flag not found');
	}
	return node_id;
}

function setCaretPos(el){
	if(Object.keys(el).length){
		console.log('el: ', el);
		var sel = window.getSelection();
		var range = document.createRange();
		range.selectNodeContents(el[0]); // Assuming el is a jQuery object
		sel.removeAllRanges();
		sel.addRange(range);
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
		//new code for tracking actions
		
		$node.on("input", handleInput);
		//end new code
		var node_id = 'node'+node.id
		$node.attr('id', node_id );
		if(node.parent == null){
			$node.attr('contenteditable', true);
			$node.one("selectstart", domListener);
			$('#main').append($node);	
		} else {
			
			var sibling_row = getSiblingRow(node.parent, node.order);
			console.log('sibling_row: ', sibling_row)
			if(sibling_row && sibling_row.model){
				var node_id = '#node'+node.parent;
				
				sibling_row.model.parentNode.insertBefore(node.model, sibling_row.model);	
			} else {
				var node_id = '#node'+node.parent;
				$(node_id).append($node);
			}
			
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

function getSiblingRow(parent, order){
	
	var sibling_row = {order: 100};
	AppContext.dom_map.map((row)=>{
		
		if(row.order > order && row.order < sibling_row.order && parent == row.parent && row.model){
			sibling_row = row;
		}
	});
	
	if(sibling_row.order == 100){
		return undefined
	} else {
		return sibling_row;	
	}
	
}