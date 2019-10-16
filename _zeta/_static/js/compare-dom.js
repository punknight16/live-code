function compareDom(){
	
	var dom_map1 = AppContext.dom_map;
	var dom_map2 = buildDomMap(AppContext);
	cleanDomMap2(dom_map1, dom_map2);
	console.log('dom_map1: ', dom_map1);
	console.log('dom_map2: ', dom_map2);
	//check if any nodes are destroyed
	var destroy_cmds = destroyCmds(dom_map1, dom_map2);
	console.log('destroy_cmds: ', destroy_cmds);
	var add_cmds = addCmds(dom_map1, dom_map2);
	console.log('add_cmds: ', add_cmds);
	var edit_cmds = editCmds(dom_map1, dom_map2);
	return [destroy_cmds, add_cmds, edit_cmds];
}

function cleanDomMap2(dom_map1, dom_map2){
	dom_map1.map((row, index)=>{
		var isFound = dom_map2.find((new_row)=>{
			return (new_row.model.isSameNode(row.model))
		});
		dom_map2.map((obj, index)=>{
			if(obj.parent == isFound.id){
				obj.parent = row.id;
			}
		});
		isFound.id = row.id;
	});
}

function editCmds(dom_map1, dom_map2){
	var edit_cmds = [];
	dom_map1.map((row, index)=>{
		var isFound = dom_map2.find((new_row)=>{
			return (new_row.model.isSameNode(row.model))
		});
		if(isFound){
			var change = false;
			if(row.parent !== isFound.parent){
				change = true;
				row.parent = isFound.parent;	
			}
			if(row.order !== isFound.order){
				change = true;
				row.order = isFound.order;	
			}
			if(isFound.text && row.text !== isFound.text){
				change = true;
				row.text = isFound.text;	
			}
			if(change){
				edit_cmds.push(row);
			}
		}
	})
	return edit_cmds;
}

function addCmds(dom_map1, dom_map2){
	var add_cmds = [];
	dom_map2.map((row, index)=>{
		var isFound = dom_map1.find((new_row)=>{
			return (new_row.model.isSameNode(row.model))
		});
		if(isFound == undefined){
			
			dom_map1.push(row);
			var el_id = 'node'+row.id;
			$(row.model).attr('id', el_id);
			add_cmds.push(row);
		}
	})
	return add_cmds;
}


function destroyCmds(dom_map1, dom_map2){
	var destroy_cmds = [];
	dom_map1.map((row, index)=>{
		var isFound = dom_map2.find((new_row)=>{
			return (new_row.model.isSameNode(row.model))
		});
		if(isFound == undefined){
			console.log('destroy row!: ', row);
			destroy_cmds.push(row)
		}
	})
	return destroy_cmds;
}