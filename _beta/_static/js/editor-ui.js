$(function(){
	//add anonymous function that listner to each content editable section
	var sections = document.getElementsByTagName("section");
	for (var i = 0; i < sections.length; i++) {
		sections[i].addEventListener("input", function(e) {
			var focus_value = window.getSelection().focusNode.nodeValue;
			AppContext.cursor_saved = savePosition(e.target, focus_value);
			/*
			//get Offset of user editing
			AppContext.sel = window.getSelection();
			//AppContext.cursor_offset = sel.anchorOffset;
			AppContext.cursor_saved = savePosition(AppContext.sel);
			console.log("AppContext.cursor_saved: ", AppContext.cursor_saved[0]);
			*/
			//now emit
	    var section_id = $(e.path[0]).attr('id');
	    var html = $(e.path[0]).html();
	    var edit = JSON.stringify({section_id: section_id, html: html});
	    AppContext.socket.emit('section edit', edit);
		}, false);
	};

	AppContext.socket.on('section edit', function(edit){
		var section_edit = JSON.parse(edit);
		var section_id = '#'+section_edit.section_id;
		var section_html = section_edit.html;
		$(section_id).html(section_html);
		//if you are focused on the edited element, reset to your cursor_offset
		var cursor_id = $(getSelectionStart()).attr('id');
		if(cursor_id === section_edit.section_id){
			//console.log('add range here');
			restorePosition(AppContext.cursor_saved, cursor_id);
			/*
			var el = document.getElementById(cursor_id);
			var range = document.createRange();
			var sel = window.getSelection();
			//console.log('el.childNodes: ', el.childNodes);
			range.setStart(AppContext.cursor_saved[0], AppContext.cursor_offset);
			range.collapse(true);
			sel.removeAllRanges();
			sel.addRange(range);
			*/
		}
		
	});
});

function savePosition(target_node, focus_value) {
	var result = [];
	var childNodes = target_node.childNodes;
	var selection_node = window.getSelection().focusNode.nodeValue;
	//console.log("target_node.childNodes: ", target_node.childNodes);
	AppContext.cursor_obj = buildSave(target_node, focus_value);
	result = [null, window.getSelection().focusOffset];
	//console.log('cursor_obj: ', AppContext.cursor_obj);
	/*
		var section_child = $(this).text();
		var selection_node = window.getSelection().focusNode.nodeValue;
		if(section_child == selection_node){
			console.log('index: ', index);
			result = [target_node, index, window.getSelection().focusOffset ];
		}
		//var test = this.isEqualNode(window.getSelection().focusNode)
		//console.log('test: ', test);
	});*/
	return result;
  
}

function buildSave(target_node, focus_value){
	
	var cursor_obj = {};
	var array = [ ...target_node.childNodes ];
	
	var test_index = array.findIndex((el)=>{return (el.nodeValue == focus_value)});
	if(test_index !== -1){
		cursor_obj['childNodes'] = test_index;
		return cursor_obj;
	} 

	cursor_obj['childNodes'] =  array.map((node, index)=>{
		if(node.childNodes.length == 0) return {};
		else return buildSave(node, focus_value)
	});
	
	return cursor_obj
}

function buildRestore(el, cursor_obj, root_el, root_cursor_obj){
	console.log('el: ', el);
	console.log('cursor_obj: ', cursor_obj);
	console.log('root_el: ', root_el);
	console.log('root_cursor_obj: ', root_cursor_obj);
	
	
	//console.log('typeof cursor_obj.childNodes: ', typeof cursor_obj.childNodes);
	if(typeof cursor_obj.childNodes == 'object'){
		var childNodes_index = cursor_obj.childNodes.findIndex((el)=>{
			return (Object.keys(el).indexOf('childNodes')!==-1)
		});
		if(childNodes_index == -1){
			console.log('hereA')
			console.log('root cursor_obj shooud be smaller');
			console.log('root_cursor_obj: ', root_cursor_obj);
			
			return buildRestore(root_el, root_cursor_obj, root_el, root_cursor_obj)
			
		} else if (typeof cursor_obj.childNodes[childNodes_index] == 'object') {
			console.log('here B')
			var param0 =  el.childNodes[childNodes_index];
			var param1 =  cursor_obj.childNodes[childNodes_index];
			root_cursor_obj.childNodes[childNodes_index] = {};
			return buildRestore(param0, param1, root_el, root_cursor_obj);
		} else {
			console.log('here C');
			return el.childNodes[childNodes_index];
		}	
	} else {
		//console.log('el.childNodes: ', el.childNodes);
		console.log('here D');
		return el.childNodes[cursor_obj.childNodes];
	}

}

function restorePosition(saved, section_id) {
  var el = document.getElementById(section_id);
	var range = document.createRange();
	var sel = window.getSelection();
	
	var restore_node = buildRestore(el, AppContext.cursor_obj, el, AppContext.cursor_obj);
	//console.log('typeof restore_node: ', typeof restore_node);
	//console.log('restore_node: ', restore_node);
	range.setStart(restore_node, saved[1]);
	range.collapse(true);
	sel.removeAllRanges();
	sel.addRange(range);
}


function getSelectionStart() {
   var node = document.getSelection().anchorNode;
   return (node.nodeType == 3 ? node.parentNode : node);
}


