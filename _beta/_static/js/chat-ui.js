//jquery.on(ready)...
$(function () {
	//handle input
  
  $('#chatForm').submit(function(e){
  	e.preventDefault();
    AppContext.socket.emit('chat message', $('#chatInput').val());
    $('#chatInput').val('');
  });
  //handle output
  AppContext.socket.on('chat message', function(msg){
		$('#chatLog').append($(`<p class='chat-output-style'></p>`).text(msg));
	});
});