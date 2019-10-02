window.AppContext.handleChange = function (inputType, new_text){
	console.log('inputType: ', inputType);
	AppContext.counter++;
	console.log('counter: ', AppContext.counter);
	switch(inputType){
		case 'insertText':
			var caret_selection = getCaretSelection();
			var anchor_row = getRow(caret_selection.anchor_node);

		
			//var focus_row = getRow(AppContext.caret_selection.focus_node);
			//console.log(`anchor_row: ${JSON.stringify(anchor_row)}, focus_row: ${JSON.stringify(focus_row)}`);
			if(anchor_row == undefined){
				AppContext.dom_map = buildDomMap();
			} else {
				insertText(AppContext.caret_selection, anchor_row, new_text);	
			}
			break;
		case 'insertParagraph':
			var parent_row = getRowParent(AppContext.caret_selection.anchor_node);
			
			insertParagraph(AppContext.caret_selection, parent_row, new_text);
			break;
	}
	
}

window.AppContext.handleSelection = function(e){
	AppContext.caret_selection = getCaretSelection();
	console.log("AppContext.caret_selection: ", AppContext.caret_selection);
}

function getCaretSelection(){
	var caret_selection = {};
	caret_selection.anchor_node = document.getSelection().anchorNode;
	caret_selection.anchor_offset = window.getSelection().anchorOffset;
	caret_selection.focus_node = document.getSelection().focusNode;
	caret_selection.focus_offset = window.getSelection().focusOffset;
	if(caret_selection.anchor_offset>caret_selection.focus_offset){
		var mem = caret_selection.anchor_offset;
		caret_selection.anchor_offset = caret_selection.focus_offset;
		caret_selection.focus_offset = mem;
	}
	return caret_selection
}

function getRow(node){
	return AppContext.dom_map.find((dom_row)=>{
		return (node.isEqualNode(dom_row.model));
	});
}

function getRowParent(node){
	var node_index = AppContext.dom_map.findIndex((dom_row)=>{
		return (node.isEqualNode(dom_row.model));
	});
	if(AppContext.dom_map[node_index].model.nodeType == 3){
		var parent_index = AppContext.dom_map.findIndex((dom_row)=>{
			return (dom_row.id == AppContext.dom_map[node_index].parent);
		})
		AppContext.siblingOrder = AppContext.dom_map[parent_index].order;
		return AppContext.dom_map[parent_index];
	} else {
		AppContext.siblingOrder = AppContext.dom_map[node_index].order;
		return AppContext.dom_map[node_index];
	}
}

function insertText(caret_selection, row, new_text){
	if(row.text){
		row.text = row.text.slice(0, caret_selection.anchor_offset) + new_text + row.text.slice(caret_selection.focus_offset);
	} else {
		row.text = new_text
	}
	console.log("row.text after: ", row.text);
}

function insertParagraph(caret_selection, parent_row, new_text){
	
	var id = AppContext.dom_map.length;
	AppContext.dom_map.push({
		id: id, tagname: 'P', parent: parent_row.parent, order: AppContext.siblingOrder+1,
		model: document.getSelection().anchorNode
	});
	AppContext.dom_map.push({id: id+1, tagname: 'BR', parent: id, order: 0, 
		model: document.getSelection().anchorNode.childNodes[0]
	});
	$(getElement()).attr('id', 'node'+id);
	console.log('AppContext.dom_map: ', AppContext.dom_map);
}

function getElement(){
   var node = document.getSelection().anchorNode;
   return (node.nodeType == 3 ? node.parentNode : node);
}

function buildDomMap(){
	var sections = [...document.getElementsByTagName('SECTION')];
	console.log('sections: ', sections);
	var json_doc = [];
	sections.map((section, index)=>{
		var id = json_doc.length;
		json_doc.push({id: id, tagname: 'SECTION', parent: null, order: index, model: section});
		if(section.childNodes.length>0){
			crawlNode(section, id, json_doc);
		}
	});
	console.log('json_doc: ', json_doc);
	return json_doc;		
}

function crawlNode(target_node, parent_id, json_doc){
	var array = [ ...target_node.childNodes ];
	console.log('children node array: ', array);
	array.map((node, index)=>{
		if(node.nodeType == 3){
			//what do if text node?
			//if(JSON.stringify(node.nodeValue).match(/\\/));
			//json_doc[parent_id].text = node.nodeValue;
			var id = json_doc.length;
			json_doc.push({id: id, tagname: 'TEXT', parent: parent_id, order: index, text: node.nodeValue, model: node});
		} else {
			var id = json_doc.length;
			json_doc.push({id: id, tagname: node.tagName, parent: parent_id, order: index, model: node});
			if(node.childNodes.length > 0){
				crawlNode(node, id, json_doc);
			}	
		}
	});
}
