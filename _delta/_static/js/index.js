var AppContext = {};
AppContext.socket = io();
AppContext.socket.emit('/pull goodbye.json', {data: 'hi'});
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
  console.log('cmd: ', cmd);
  console.log('data: ', data);
  socketRouter(AppContext, cmd, data)
});