function pushDOM(){
	return buildDomMap();
}

function buildDomMap(){
	var sections = [...document.getElementsByTagName('SECTION')];
	console.log('sections: ', sections);
	var json_doc = [];
	sections.map((section, index)=>{
		var id = generateId();
		json_doc.push({id: id, tagname: 'SECTION', parent: null, order: index, model: section});
		if(section.childNodes.length>0){
			crawlNode(section, id, json_doc);
		}
	});
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
			var id = generateId();
			json_doc.push({id: id, tagname: 'TEXT', parent: parent_id, order: index, 
				text: node.nodeValue, model: node});
		} else {
			var id = generateId();
			json_doc.push({id: id, tagname: node.tagName, parent: parent_id, order: index, 
				model: node});
			if(node.childNodes.length > 0){
				crawlNode(node, id, json_doc);
			}	
		}
	});
}

function generateId(){
	return Math.random().toString(36).substring(7);
}