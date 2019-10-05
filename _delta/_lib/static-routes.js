function staticRouter(req, res){
	console.log(req.url);
	switch(req.url){
		case '/':
			var abs_path = __dirname.substring(0, __dirname.length - 4) + '/_pages/index.html';
			res.sendFile(abs_path);	
			break;
		default:
			res.setStatus = 404;
			res.end('error 404');
	}
}

module.exports = staticRouter;
