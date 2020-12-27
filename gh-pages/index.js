

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
  	d3.csv("./assets/data.csv", function(d) {
  		let des_name = d.designer;
	  	if (des_name.split("Womenswear")){
	  		des_name = des_name.split("Womenswear")[0];
	  	}
	  	return {
	  		year: parseInt(d.year),
	  		designer: des_name.trim(),
	  		cluster: parseInt(d.cluster),
	  		file_name: d.file_name.replace("&", "_")
	  	};
	}).then(function(data) {
		const year_array = Array.from({length: 2015-1991}, (_, i) => i + 1991).map(d => [d, []]);
		let formatted = 
			Object.assign(...Array.from(d3.group(data, d => d.cluster, d => d.year), 
				function([key, value]){
					const array_vals = Array.from(value);
					let new_obj = {};
					let year_obj = year_array.map(function(e){
						let found_item = array_vals.find(f => f[0] === e[0]);
						return found_item ? [found_item[0], found_item[1].map(f => ({[f["designer"]]: f["file_name"]}))] : e;
					})
					new_obj[key] = year_obj;
					return new_obj;
				}));	
		const timeline = new Timeline(".timeline", ".listOfTrends", formatted, "373");
	});

  }
};