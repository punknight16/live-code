function domListener(e){
	console.log('dom listener fired');
	//AppContext.caret_selection = getCaretSelection();
}

function handleInput(e){
	console.log('handleInput fired');
	/*console.log('e: ', e.which);
	e.preventDefault();
	//if enter key is hit, create new paragraph tag
	//split the anchorSelection between the new paragraph tag and the old
	$(document).one('keyup', function(event) {
		console.log('event.keyCode: ', event.keyCode);
		if (event.keyCode == 13) {
			event.preventDefault()
			console.log('enter hit');
			//document.execCommand('insertHTML', false, '');
			var cmd = `/row --add '[{"id":6,"tagname":"BUTTON","parent":0,"order":3},{"id":7,"tagname":"TEXT","parent":6,"order":0,"text":"HI"}]'`;
			outboundRouter(AppContext, cmd);
			return
		}
	});*/
}

function handleKeypress(e){
	/*
	e.preventDefault();
	console.log('e: ', e);
	console.log('keypress hit');
	if (event.keyCode == 13) {
		//get selection info
		var caret_selection = getCaretSelection();
		var [left_text, right_text] = splitTextNode(caret_selection);
		console.log('left_text: ', left_text);
		console.log('right_text: ', right_text);
		var row = getRow(caret_selection.anchor_node);
		var parent_row = getRowByID(row.parent);
		console.log('row: ', row);
		if(left_text=='' && right_text){
			var cmd1 = `/row --destroy '[{"id":${row.id}, "tagname":"TEXT","parent":0,"order":0}]'`;
			outboundRouter(AppContext, cmd1);
			var id = AppContext.dom_map.length;
			var cmd2 = `/row --add '[{"id":${id+1},"tagname":"BR","parent":${id},"order":${row.order}}]'`;
			outboundRouter(AppContext, cmd2);
			var cmd3 = `/row --add '[{"id":${id+2},"tagname":"P","parent":${parent_row.parent},"order":${row.order+1}},{"id":${id+3},"tagname":"TEXT","parent":${id},"order":0, "text":"${right_text}"}]'`;
			outboundRouter(AppContext, cmd3);


		} else if(right_text){
			
			var cmd1 = `/row --edit '[{"id":${row.id}, "tagname":"TEXT","parent":${row.parent},"order":${row.order}, "text":"${left_text}"}]'`;
			outboundRouter(AppContext, cmd1);
			var id = AppContext.dom_map.length;
			
			var cmd2 = `/row --add '[{"id":${id},"tagname":"P","parent":${parent_row.parent},"order":${parent_row.order+0.5}}, {"id":${id+1},"tagname":"TEXT","parent":${id},"order":0, "text":"${right_text}"}]'`;
			outboundRouter(AppContext, cmd2);
		} else {
			var id = AppContext.dom_map.length;
			var cmd = `/row --add '[{"id":${id},"tagname":"P","parent":${parent_row.parent},"order":${parent_row.order+1}},{"id":${id+1},"tagname":"BR","parent":${id},"order":0}]'`;
			outboundRouter(AppContext, cmd);	
		}
	}
	*/
}
/*
function splitTextNode(caret_selection){
	var row = getRow(caret_selection.focus_node);
	if(row.text){
		var left_text = row.text.slice(0, caret_selection.anchor_offset); 
		var right_text = row.text.slice(caret_selection.focus_offset);
		return [left_text, right_text];
	} else {
		return [undefined, undefined];
	}

}
*/
function getRow(node){
	return AppContext.dom_map.find((dom_row)=>{
		return (node.isEqualNode(dom_row.model));
	});
}

function getRowByID(id){
	return AppContext.dom_map.find((dom_row)=>{
		return (id == dom_row.id);
	});
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
	//console.log('caret_selection: ', caret_selection);
	return caret_selection
}