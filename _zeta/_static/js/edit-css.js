function editCSS(flag, data, AppContext){
	// /css --add '[{"id": "a1", "url": "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"}]'
	// /css --add '[{"id": "b2", "url": "https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css"}]'
	// /css --add '[{"id": "c3", "url": "http://cdn.muicss.com/mui-0.10.0/css/mui.min.css"}]'
	// /css --edit '[{"id": "a1", "url": "https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css"}]'
	// /css --edit '[{"id": "a1", "url": "http://cdn.muicss.com/mui-0.10.0/css/mui.min.css"}]'
	// /css --destroy '[{"id":"a1"}]'

	if(typeof AppContext.css_map == 'undefined'){
		AppContext.css_map = [];
	}
	switch (flag){
		case '--list':
			//show table modal
			callModal(JSON.stringify(AppContext.css_map.map((row)=>{
				var hasModel = (row.model.nodeType > 0);
				var name = row.url.split('/').pop();
				return {"id":row.id, "name": name, "order": row.order, "hasModel": hasModel};
			})));
			break;
		case '--add':
			console.log('hereA');
			var css_arr = JSON.parse(data.substring(1, data.length-1));
			css_arr.map((row, index)=>{
				addCssRow(row, AppContext);;
			});
			break;
		case '--destroy':
			var css_arr = JSON.parse(data.substring(1, data.length-1));
			css_arr.map((row, index)=>{
				destroyCssRow(row, AppContext);;
			});
			break;
		case '--edit':
			console.log('hereB');
			var css_arr = JSON.parse(data.substring(1, data.length-1));
			css_arr.map((row, index)=>{
				editCssRow(row, AppContext);;
			});
			break;
		default:
			console.log('flag not found');
	}
}

function editCssRow(css_row, AppContext){
	var found_row_index = AppContext.css_map.findIndex((row)=>{
		return (row.id == css_row.id)
	});
	if(found_row_index == -1){
		throw 'node_id does not exist';
	} else {
		var styles = `@import url('${css_row.url}');`;
		var found_row = AppContext.css_map[found_row_index];
		found_row.model.href='data:text/css,'+escape(styles);
		css_row.model = found_row.model;
		AppContext.css_map.splice(found_row_index, 1, css_row);
	}
}


function addCssRow(css_row, AppContext){
	var styles = `@import url('${css_row.url}');`;
  var newSS=document.createElement('link');
  //new stuff
  var id = css_row.id;
  newSS.id = 'css'+ id;
  //end
  newSS.rel='stylesheet';
  newSS.href='data:text/css,'+escape(styles);
  document.getElementsByTagName("head")[0].appendChild(newSS);
  //this new too
  AppContext.css_map.push({id: id, url: css_row.url, order: AppContext.css_map.length, model: newSS});
}

function destroyCssRow(css_row, AppContext){
	var found_row_index = AppContext.css_map.findIndex((row)=>{
		return (row.id == css_row.id)
	});
	if(found_row_index == -1){
		throw 'node_id does not exist';
	} else {
		var found_row = AppContext.css_map[found_row_index];
		found_row.model.parentNode.removeChild(found_row.model);
		AppContext.css_map.splice(found_row_index, 1);
	}
}