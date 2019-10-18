//jquery.on(ready)...
$(function () {

	//initialize command log
  AppContext["commandIndex"] = 0;
  AppContext["commands"] = [''];
  //handle input
  $('#chatForm').submit(function(e){
  	e.preventDefault();
    outboundRouter(AppContext, $('#chatInput').val());
    //command log code
    var chatInput = $('#chatInput').val();
    var isCommand = (chatInput.indexOf('/') === 0);
    if(isCommand){
      AppContext.commands.unshift(chatInput);
      AppContext.commandIndex = -1;  
    }
    $('#chatInput').val('');  
  });
  //handle output
  AppContext.socket.on('msg', function(msg){
		$('#chatLog').append($(`<p class='chat-output-style'></p>`).text(msg));

    /*
    console.log('chatlog height: ', $('#chatLog').height());
    console.log('scroll height: ', $('#chatLog')[0].scrollHeight);
    if($('#chatLogContainer').height() > 400){
      $('#chatLogContainer').addClass("chat-output-noscroll");
    }*/
	});
  //handle up and down arrow keys
  $('#chatInput').keydown(function(e){
    if(e.keyCode == 38){
      if(AppContext.commandIndex<AppContext.commands.length){
        AppContext.commandIndex++;  
      }
      $('#chatInput').val(AppContext.commands[AppContext.commandIndex]);
    }
    if(e.keyCode == 40){
      if(AppContext.commandIndex>=0){
        AppContext.commandIndex--;
      }
      $('#chatInput').val(AppContext.commands[AppContext.commandIndex]);
    }
  });

});


function toggleChatDarkmode(){
  $("#chatLog").toggleClass("chat-log-darkmode");
  $("#chatInput").toggleClass("chat-input-darkmode");
}

function chatError(msg){
  $('#chatLog').append($(`<p class='chat-output-style'></p>`).text(msg));

}

function clearChatLog(){
  $('#chatLog').empty();
  $('#chatLog').removeClass("chat-output-scroll");
}