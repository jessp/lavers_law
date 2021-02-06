

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
  	d3.csv("./assets/fashion_years.csv", function(d) {
  		return {
		  	year: parseInt(d.year),
		  	count: parseInt(d.name)
		}

  	}).then(function(years) {
	  	d3.csv("./assets/data.csv", function(d) {
	  		let des_name = d.designer;
		  	if (des_name.split("Womenswear")){
		  		des_name = des_name.split("Womenswear")[0];
		  	}
		  	return {
		  		year: parseInt(d.year),
		  		designer: des_name.trim(),
		  		cluster: parseInt(d.cluster),
		  		file_name: d.file_name.substring(0, d.file_name.length - 3) + "png"
		  	};
		}).then(function(data) {
			let formatted = 
				Object.assign(...Array.from(d3.group(data, d => d.cluster, d => d.year), 
					function([key, value]){
						const array_vals = Array.from(value);
						const min_year = Math.min(...array_vals.map(e => e[0]));
						const max_year = Math.max(...array_vals.map(e => e[0]));
						const year_array = Array.from({length: max_year + 1 - min_year}, (_, i) => i + min_year).map(d => [d, []]);
						let new_obj = {};
						let year_obj = year_array.map(function(e){
							let found_item = array_vals.find(f => f[0] === e[0]);
							return found_item ? [found_item[0], found_item[1].map(f => ({[f["designer"]]: f["file_name"]}))] : e;
						})
						new_obj[key] = year_obj;
						return new_obj;
					}));	

			const trend_line = new LineChart(".selectedTrend .chart svg", years, ".normalizeButton");
			const timeline = new Timeline(".timeline", ".listOfTrends", formatted, "350", e => trend_line.updateData(e));
			
			
			let table_data = [...Array.from(d3.group(data, d => d.cluster))]
				.map(function([key, value]){
					let obj = new Object();
					obj["Image"] = `./assets/out_sm/${value[5]["file_name"]}`;
					obj["Name"] = descriptions["" + value[0]["cluster"]]["name"];
					obj["Trend"] = formatted[value[0]["cluster"]];
					obj["1st Year"] = d3.min(value, d => d.year);
					let grouped_by_year = [...Array.from(d3.group(value, d => d.year))];
					let peak_year_count = d3.max([...Array.from(d3.group(value, d => d.year))], e => e[1].length);
					obj["Peak"] = grouped_by_year.find(d => d[1].length === peak_year_count)[0];
					obj["# Looks"] = value.length;
					let grouped_by_designer = [...Array.from(d3.group(value, d => d.designer))];
					let max_designer_count = d3.max(grouped_by_designer.map(e => e[1].length));
					let representative_designer = grouped_by_designer.filter(e => e[1].length === max_designer_count);
					obj["Common Designer"] = representative_designer.length === 1 && representative_designer[0][1].length > 1 ? representative_designer[0][0] : "-";
					return obj;
				});

			let table = new Table(".compareTable", table_data, "#tableCollapser");
		});
	})
  }
};