var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime-types');
var cache = {};

function send404(response){
	response.writeHead(404, {'Content-Type': 'text/plain'});
	response.write('Error 404: resource not found');
	response.end();
}

function sendFile(response, filePath, fileContents){
	response.writeHead(200, {"content-type": mime.lookup(path.basename(filePath))});
	response.end(fileContents);
}

function serveStatic(response, cache, absPath){
	if(cache[absPath]) {
		sendFile(response, absPath, cache[absPath]);
	} else {
		fs.exists(absPath, function(exists){
			if(!exists) send404(response);
			else {
				fs.readFile(absPath, function(err, data){
					if(err) send404(response);
					else {
						cache[absPath] = data;
						sendFile(response, absPath, data);
					}
				});
			} 
		});
	}
}

var server = http.createServer(function(req, res){
	var filePath = false;

	if(req.url == '/') filePath = '_static/index.html';
	else filePath = '_static'+req.url;

	var absPath = './' + filePath;
	serveStatic(res, cache, absPath);
}).listen(process.env.PORT || 3000, function(){
	console.log('server is up an running on port 3000 or process.env.PORT');
});

var chatServer = require('./_scripts/chat-server');
chatServer.listen(server);