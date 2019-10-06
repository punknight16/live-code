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


function toggleChatDarkmode(){
  $("#chatLog").toggleClass("chat-log-darkmode");
  $("#chatInput").toggleClass("chat-input-darkmode");
}