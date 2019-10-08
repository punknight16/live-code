function editDOM(flag, data, AppContext){
	//test case /row --add "<p>This is a test</p>"
	console.log('editDOM fired');
	var dom_rows = [];
	switch(flag){
		case '--list':
			//show table modal
			callModal(JSON.stringify(AppContext.dom_map));
			break;
		case '--add':
			var $el = $(data.substring(1, data.length-1));
			console.log('$el: ', $el);
			var id = AppContext.dom_map.length;
			dom_rows.push({
				id: id, 
				tagname: $el[0].nodeName, 
				parent: 0, 
				order: 0
			});
			dom_rows.push({
				id: id+1, 
				tagname: 'TEXT', 
				parent: id, 
				order: 0
			});
			break;
	}
	console.log('dom_rows: ', dom_rows);
	return dom_rows;
}