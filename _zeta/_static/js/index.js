var AppContext = {};
AppContext.socket = io(window.location.href, {transports: ['websocket']});
//test cases
//AppContext.socket.emit('/pull goodbye.json', {data: 'hi'});
//AppContext.socket.emit('/push button.json', {data: 'hi'});
if(typeof AppContext.dom_map == 'undefined'){
	AppContext.dom_map = buildDomMap();
}
//create universal character
var onevent = AppContext.socket.onevent;
AppContext.socket.onevent = function (packet) {
    var args = packet.data || [];
    onevent.call (this, packet);    // original call
    packet.data = ["*"].concat(args);
    onevent.call(this, packet);      // additional call to catch-all
};

AppContext.socket.on("*",function(cmd,data) {
	//client socket router
  //console.log('cmd: ', cmd);
  //console.log('data: ', data);
  inboundRouter(AppContext, cmd, data)
});