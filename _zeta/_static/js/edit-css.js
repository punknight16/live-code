function editCSS(flag, data, AppContext){
	// /css --add 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css'
	// /css --add 'https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css'
	// /css --add 'http://cdn.muicss.com/mui-0.10.0/css/mui.min.css'
	switch (flag){
		case '--add':
			console.log('data: ', data);
			var css_url = data.substring(1, data.length-1);
			console.log('--add css_url: ', css_url);
			var styles = `@import url('${css_url}');`;
		  var newSS=document.createElement('link');
		  newSS.rel='stylesheet';
		  newSS.href='data:text/css,'+escape(styles);
		  document.getElementsByTagName("head")[0].appendChild(newSS);
			break;
		default:
			console.log('flag not found');
	}
}