function pullDOM(dom_map){
	$('#main').empty();
		//sort by the order attribute
	dom_map.sort(compare);
	AppContext.dom_map = dom_map;
	//build the dom into html
	dom_map.map((node, index)=>{
		if(node.tagname!=='TEXT'){
			node.model = document.createElement(node.tagname);
			var $node = $(node.model);
			var node_id = 'node'+node.id
			$node.attr('id', node_id );
			if(node.parent == null){
				//new code for tracking actions
				$node.attr('contenteditable', true);
					//$node.on("selectstart", handleSelectStart);
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
	});
};

//helper function for sorting by order attribute
function compare(a,b) {
  if (a.order < b.order)
     return -1;
  if (a.order > b.order)
    return 1;
  return 0;
}
