function editDOM(flag, data, AppContext){
	//test case /pull goodbye.json
	//test case /row --add '[{"id":"abc","tagname":"BUTTON","parent":"8fl5gk","order":2}, {"id":"def","nodetype":2,"tagname":"class","parent":"abc","order":0,"text":"button is-primary btn btn-primary mui-btn mui-btn--primary"},{"id":"ghi","tagname":"TEXT","parent":"abc","order":0,"text":"HI"}]'
	//test case /row --edit '[{"id":"ghi","tagname":"TEXT","parent":6,"order":0,"text":"SUBMIT"}]'
	//test case /row --destroy '[{"id":"abc"}, {"id":"def"}, {"id":"ghi"}]'
	//test case /row --insert '[{"id":"ghi", "tagname": "TEXT", "offset": 0, "text":"Ok, "}]'
	//test case /row --insert '[{"id":"def", "tagname": "class", "offset": 0, "text":"test_class "}]'
	//test case /row --replace '[{"id":"ghi", "tagname": "TEXT", "search_str": "HI", "new_str":"Submit Now"}]'
	//test case /row --swap '[{"tagname": "TEXT", "search_str": "HI", "new_str":"Submit Now"}]'
	//test case /row --swap '[{"tagname": "class", "search_str": "btn", "new_str":"removed_btn"}]'
	var node_id = '';
	switch(flag){
		case '--sort':
			AppContext.dom_map.sort(tagSort);
			break;
		case '--list':
			//show table modal
			callModal(JSON.stringify(AppContext.dom_map.map((row)=>{
				var hasModel = (row.model.nodeType > 0);
				if(row.tagname=='TEXT' || row.nodetype == 2){
					return {"id":row.id, "nodetype": row.nodetype, "tagname": row.tagname, "parent": row.parent, "order": row.order, "text": row.text, "hasModel": hasModel};
				} else {
					return {"id":row.id, "nodetype": row.nodetype, "tagname": row.tagname, "parent": row.parent, "order": row.order, "hasModel": hasModel};
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
			}); 
			break;
		case '--insert':
			var row_arr = JSON.parse(data.substring(1, data.length-1));
			row_arr.map((row, index)=>{
				insertValue(row);
			});
			break;
		case '--replace':
			var row_arr = JSON.parse(data.substring(1, data.length-1));
			row_arr.map((row, index)=>{
				replaceValue(row);
			});
			break;
		case '--swap':
			var row_arr = JSON.parse(data.substring(1, data.length-1));
			row_arr.map((row, index)=>{
				swapValue(row);
			});
			break;
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
	var found_row_index = AppContext.dom_map.findIndex((row)=>{
		return (row.id == node.id)
	});
	if(found_row_index == -1){
		throw 'node_id does not exist';
	} else {
		var found_row = AppContext.dom_map[found_row_index];
		found_row.model.parentNode.removeChild(found_row.model);
		AppContext.dom_map.splice(found_row_index, 1);
	}
	
}

function swapValue(node){
	if(node.tagname == 'TEXT' || node.tagname == 'class'){
		AppContext.dom_map.map((row)=>{
			if(node.tagname == row.tagname){
				var new_text = row.text.replace(node.search_str, node.new_str);
				row.model.nodeValue = new_text;
				row.text = new_text;
			}
		});
	}
}

function replaceValue(node){
	if(node.tagname == 'TEXT' || node.tagname == 'class'){
		var found_row = AppContext.dom_map.find((row)=>{
				return (row.id == node.id)
			});
		if(found_row == undefined){
			throw 'node_id does not exist';
		}
		var new_text = found_row.text.replace(node.search_str, node.new_str); 
		found_row.model.nodeValue = new_text;
		found_row.text = new_text;
	}
}


function insertValue(node){
	console.log('here at insert value');
	switch(node.tagname){
		case 'TEXT':
			var found_row = AppContext.dom_map.find((row)=>{
				return (row.id == node.id)
			});
			if(found_row == undefined){
				throw 'node_id does not exist';
			}
			var left_text = found_row.text.slice(0, node.offset); 
			var right_text = found_row.text.slice(node.offset);
			found_row.model.nodeValue = left_text + node.text + right_text;
			found_row.text = left_text + node.text + right_text;
			break;
		case 'class':
			var found_row = AppContext.dom_map.find((row)=>{
				return (row.id == node.id)
			});
			if(found_row == undefined){
				throw 'node_id does not exist';
			}
			var left_text = found_row.text.slice(0, node.offset); 
			var right_text = found_row.text.slice(node.offset);
			found_row.model.nodeValue = left_text + node.text + right_text;
			found_row.text = left_text + node.text + right_text;
			break;
		default:
			console.log('no tagname');
	}	
}

function editRow(node){
	
	
	if(node.tagname=='TEXT'){
		
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
			
			found_row.model.remove();
			
			var parent_row = getRowByID(found_row.parent);
			placeNode(found_row, parent_row);
		}
	}
}

function addRow(node){
	
	if(node.nodetype == 2){
			var node_id = '#node'+node.parent;
			$(node_id).attr(node.tagname, node.text);
			
			node.model = $(node_id)[0].getAttributeNode(node.tagname);
	} else if (node.tagname!=='TEXT'){
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
		
		if(JSON.stringify(node.text).replace(/\\n\s+/g, "").length==2){
			//do nothing
			
		} else {
			
			
			var node_parent = '#node'+node.parent;
			var checkExist = setInterval(function() {
		   if ($(node_parent).length) {
		   		node.model = document.createTextNode(node.text);
		      var parent_row = getRowByID(node.parent);
					placeNode(node, parent_row);
		      clearInterval(checkExist);
				}
			}, 100);
		}
	}
}

function placeNode(row, parent_row){
	console.log('parent_row: ', parent_row);
	var array = [ ...parent_row.model.childNodes ];
	if(array.length==0){
		$(parent_row.model).append($(row.model));
		
	} else  {
		var json_doc = [];
		console.log('array: ', array);
		array.map((test_node)=>{
			var found_row = getRow(test_node);
			if(found_row !== undefined){
				json_doc.push(found_row);	
			}
		});
		json_doc.sort(tagSort);
		console.log('json_doc: ', json_doc);
		console.log('row.order: ', row.order);
		for (var i = 0; i < json_doc.length; i++) {
			if(json_doc[i].order > row.order){
				$(row.model).insertBefore($(json_doc[i].model));
				break;
			} else if (i == json_doc.length-1){
				$(parent_row.model).append(row.model);
				break;
			} else if (json_doc[i].order<row.order && json_doc[i+1]>row.order){
				$(row.model).insertAfter($(json_doc[i].model));
				break;
			}
		};
	}
};
