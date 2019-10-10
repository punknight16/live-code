function domListener(e){
	console.log('dom listener fired');
}

function handleInput(e){
	console.log('e: ', e.which);
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
	});
}

function handleKeypress(e){
	e.preventDefault();
	console.log('keypress hit');
	if (event.keyCode == 13) {
		var id = AppContext.dom_map.length;
		var cmd = `/row --add '[{"id":${id},"tagname":"P","parent":0,"order":3},{"id":${id+1},"tagname":"BR","parent":${id},"order":0}]'`;
		outboundRouter(AppContext, cmd);
	}
}