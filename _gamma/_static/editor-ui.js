$(function(){
	AppContext.socket.emit('/pull DOM');

	AppContext.socket.on('DOM', function(dom_map){
		$('#main').empty();
		
		dom_map.sort(compare);
		dom_map.map((node, index)=>{
			if(node.tagname!=='TEXT'){
				var $node = $(document.createElement(node.tagname));
				var node_id = 'node'+node.id
				$node.attr('id', node_id );
				if(node.parent == null){
					
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
				      console.log("Exists!");
				      $(node_parent).append(node.text);
				      clearInterval(checkExist);
				   }
					}, 100);
				}
			}
		});
	});
});

function compare(a,b) {
  if (a.order < b.order)
     return -1;
  if (a.order > b.order)
    return 1;
  return 0;
}

function myfunction(e){
	/*
	var anchor = document.getSelection().anchorNode;
	var focus = document.getSelection().focusNode;
	var offset = window.getSelection().focusOffset;
	var id = getSelectionStart().id
	var tagname = getSelectionStart().tagName
	//console.log('anchor: ', anchor);
	//console.log('focus: ', focus);
	//console.log('offset: ', offset);
	console.log('id: ', id);
	console.log('tagname: ', tagname);

	//get root node
	var parent = document.querySelector('.js-parent'),
  child = document.querySelector('.js-child'),

	console.log(parent.getRootNode().nodeName); // #document
  console.log(child.getRootNode().nodeName); // #document
  */
  var dom_map = buildDomMap();
  console.log('dom_map: ', JSON.stringify(dom_map));

}

function buildDomMap(){
	var sections = [...document.getElementsByTagName('SECTION')];
	console.log('sections: ', sections);
	var json_doc = [];
	sections.map((section, index)=>{
		var id = json_doc.length;
		json_doc.push({id: id, tagname: 'SECTION', parent: null, order: index});
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
			var id = json_doc.length;
			json_doc.push({id: id, tagname: 'TEXT', parent: parent_id, order: index, text: node.nodeValue});
		} else {
			var id = json_doc.length;
			json_doc.push({id: id, tagname: node.tagName, parent: parent_id, order: index});
			if(node.childNodes.length > 0){
				crawlNode(node, id, json_doc);
			}	
		}
	});
}

function getSelectionStart() {
   var node = document.getSelection().anchorNode;
   return (node.nodeType == 3 ? node.parentNode : node);
}

function getCaretPosition(){
	//test
}