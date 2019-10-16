function editDOM(flag, data, AppContext){
	//test case /row --add '[{"id":6,"tagname":"BUTTON","parent":0,"order":3},{"id":7,"tagname":"TEXT","parent":6,"order":0,"text":"HI"}]'
	//test case /row --edit '[{"id":7,"tagname":"TEXT","parent":6,"order":0,"text":"SUBMIT"}]'
	//test case /row --destroy '[{"id":6,"tagname":"BUTTON","parent":0,"order":3},{"id":7,"tagname":"TEXT","parent":6,"order":0,"text":"HI"}]'
	var node_id = '';
	switch(flag){
		case '--sort':
			AppContext.dom_map.sort(tagSort);
			break;
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
			row_arr.sort(tagSort);
			console.log('--add row_arr: ', row_arr);
			row_arr.map((row, index)=>{
				addRow(row);
				AppContext.dom_map.push(row);
				//node_id = row.parent
			});
			break;
		case '--edit':
			var row_arr = JSON.parse(data.substring(1, data.length-1));
			row_arr.map((row, index)=>{
				editRow(row);
				console.log('row edited: ', row);
				//node_id = row.parent
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

function tagSort(a, b){
	if(a.tagname == 'TEXT' && b.tagname !== 'TEXT') return 1
	else if(b.tagname == 'TEXT' && a.tagname !=='TEXT') return -1
	else if(a.tagname == b.tagname){
		if(a.order > b.order) return 1
		else return -1
	}
	else return 0;
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
	console.log('edit Row fired!');
	console.log('node.tagname: ', node.tagname);
	if(node.tagname=='TEXT'){
		console.log('should be here!');
		var found_row = AppContext.dom_map.find((row)=>{
			return (row.id == node.id)
		});
		if(found_row == undefined){
			throw 'node_id does not exist';
		}
		found_row.model.nodeValue = node.text;
		found_row.text = node.text;
		if(found_row.order !=node.order || found_row.parent != node.parent){
			found_row.order = node.order;
			found_row.parent = node.parent;
			
			found_row.model.remove();
			
			var parent_row = getRowByID(found_row.parent);
			placeNode(found_row, parent_row);
		}
		
	} else {
		var found_row = AppContext.dom_map.find((row)=>{
			return (row.id == node.id)
		});
		if(found_row == undefined){
			throw 'node_id does not exist';
		}
		found_row.parent = node.parent;
		if(found_row.order !=node.order || found_row.parent != node.parent){
			found_row.order = node.order;
			console.log('p found_row.model before: ', found_row.model);
			found_row.model.remove();
			console.log('p found_row.model after: ', found_row.model);
			var parent_row = getRowByID(found_row.parent);
			placeNode(found_row, parent_row);
		}
	}
}

function addRow(node){
	console.log('node added: ', node);
	if(node.tagname!=='TEXT'){
		//non-Text nodes
		node.model = document.createElement(node.tagname);
		var $node = $(node.model);
		//new code for tracking actions
		$node.on("keydown", handleKeypress);
		$node.on("input", handleInput);
		//end new code
		var node_id = 'node'+node.id
		$node.attr('id', node_id );
		if(node.parent == null){
			//Section Nodes
			$node.attr('contenteditable', true);
			$node.one("selectstart", domListener);
			$('#main').append($node);	
		} else {
			//Paragraph nodes and everything else
			var parent_row = getRowByID(node.parent);
			placeNode(node, parent_row);
			
		}
	} else {
		
		//if(JSON.stringify(node.text).match(/\\/));
		//else {
			var node_parent = '#node'+node.parent;
			var checkExist = setInterval(function() {
		   if ($(node_parent).length) {
		   		node.model = document.createTextNode(node.text);
		      $(node_parent).append(node.model);
		      clearInterval(checkExist);
				}
			}, 100);
		//}
	}
}

function placeNode(row, parent_row){
	var array = [ ...parent_row.model.childNodes ];
	console.log('p row.model: ', row.model);
	if(array.length==0){
		$(parent_row.model).append($(row.model));
	} else  {
		var json_doc = [];
		array.map((test_node)=>{
			json_doc.push(getRow(test_node));
		})
		json_doc.sort(tagSort);

		for (var i = 0; i < json_doc.length; i++) {
			if(json_doc[i].order > row.order){
				console.log('HERE A');
				console.log('row.model: ', row.model);
				console.log('test_row.mode: ', json_doc[i].model);
				$(row.model).insertBefore($(json_doc[i].model));
				break;
			} else if (i == json_doc.length-1){
				console.log('HERE B');
				console.log('row.model: ', row.model);
				console.log('test_row.model: ', json_doc[i].model);
				$(parent_row.model).append(row.model);
				break;
			} else if (json_doc[i].order<row.order && json_doc[i+1]>row.order){
				console.log('HERE C');
				console.log('row.model: ', row.model);
				console.log('test_row.mode: ', json_doc[i].model);
				$(row.model).insertAfter($(json_doc[i].model));
				break;
			}
		};
	}
};
/*
function getSiblingRow(row){
	var sibling_row = AppContext.dom_map.find((test_row)=>{
		return (test_row.parent == row.parent && row.order+1 == test_row.order);
	})
	console.log('sibling_row: ', sibling_row);
	return sibling_row;
}*/