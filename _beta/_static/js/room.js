//jquery.on(ready)...
$(function () {
	//handle input
  var socket = io();
  $('#chatForm').submit(function(e){
  	e.preventDefault();
    socket.emit('chat message', $('#chatInput').val());
    $('#chatInput').val('');
  });
  //handle output
  socket.on('chat message', function(msg){
  	console.log('fired');
		$('#chatLog').append($(`<p class='chat-output-style'></p>`).text(msg));
	});
});