var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req, res){
	console.log(req.url);
	switch(req.url){
		case '/':
			var stream = fs.createReadStream(__dirname+'/index.html');
			stream.pipe(res);
			break;
		case '/push-dom.js':
			var stream = fs.createReadStream(__dirname+'/push-dom.js');
			stream.pipe(res);
			break;
		case '/pull-dom.js':
			var stream = fs.createReadStream(__dirname+'/pull-dom.js');
			stream.pipe(res);
			break;
		case '/styles.css':
			var stream = fs.createReadStream(__dirname+'/styles.css');
			stream.pipe(res);
			break;
		default:
			res.end('not found');
	}
}).listen(3000);