$(function () {
	//instantiate socket
	AppContext.socket = io();
	//instantiate messages log from query paramater
	var messages = JSON.parse(getParameterByName('m'));
	if(messages !== null){
		messages.map((msg)=>{
			$('#chatLog').append($(`<p class='chat-output-style'></p>`).text(msg));
		});	
	}

	//instantiate messages log from server
	AppContext.socket.on('start chat', function(messages){
		JSON.parse(messages).map((msg)=>{
			$('#chatLog').append($(`<p class='chat-output-style'></p>`).text(msg));
		});
	});
});