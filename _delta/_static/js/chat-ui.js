//jquery.on(ready)...
$(function () {
	//handle input
  
  $('#chatForm').submit(function(e){
  	e.preventDefault();
    outboundRouter(AppContext, $('#chatInput').val());
    $('#chatInput').val('');  
  });
  //handle output
  AppContext.socket.on('msg', function(msg){
		$('#chatLog').append($(`<p class='chat-output-style'></p>`).text(msg));
	});
});