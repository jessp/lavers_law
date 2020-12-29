class Timeline {

  constructor(timelineHolder, list_holder, data, selected_cluster) {
  	this.circle_width = 40;

  	this.holder = d3.select(timelineHolder);
  	this.list_holder = d3.select(list_holder);
  	this.data = data;
  	this.selected_cluster = selected_cluster;
  	this.images = this.data[this.selected_cluster];

  	this.populateTrendList();
  	this.populateTimeline();
  }

  populateTrendList(){
    const cluster_text = descriptions["" + this.selected_cluster] || {"name": "", "description": "", "order": 0};
    d3.select(".textTrend").select("h3").html(cluster_text["name"]);
    d3.select(".textTrend").select("p").html(cluster_text["description"]);

  	const trend_images = 
      Object.entries(this.data)
        .map(e => [e[0], Object.values(Object.values(e[1]
            .filter(f => f[1].length > 0))[2][1][0])[0]])
        .sort((a, b) => descriptions["" + a[0]]["order"] - descriptions["" + b[0]]["order"]);

    this.list_holder.selectAll("div")
  		.data(trend_images, d => d[0])
  		.join("div")
      .attr("class", d => d[0] === this.selected_cluster ? "selected" : "")
  		.style("background-image", function(d){
  			return `url('./assets/out_md/${d[1].substring(0, d[1].length - 3)}png')`;
  		})
  		.on("click", (e, d) => {
  			this.selected_cluster = d[0];
  			this.images = this.data[this.selected_cluster];
        this.populateTrendList();
  			this.populateTimeline();
  		});
  }

  populateTimeline(){
  	const circle_width = this.circle_width;

  	this.segments = this.holder.selectAll("div.timelineSegment")
  		.data(this.images, d => d[0])
  		.join(
        	enter => enter.append("div"),
        	update => update,
        	exit => exit
            	.attr("class", "timelineSegment toRemove")
          		.call(exit => exit.transition().delay(750)
            	.remove())
        )
  		.attr("class", "timelineSegment")
  		.each(function(d){
  			let that = d3.select(this);

  			if (that.select(".yearLabel").node() === null){
  				let yearLabel = that.append("div")
  					.attr("class", "yearLabel");
  			
	  			yearLabel
			  		.append("p")
			  		.html(d[0]);

			  	yearLabel
			  		.append("div");

				let circleHolder = that
			  		.append("div")
			  		.attr("class", "dotLabel")
			  		.append("svg");

			  	circleHolder.append("circle")
			  		.attr("class", "littleCircle")
			  		.attr("cx", circle_width/2)
			  		.attr("cy", circle_width/2)
			  		.attr("r", 4);

			  	let fashion_label = that
			  		.append("div")
			  		.attr("class", "fashionLabel");

			  	fashion_label.append("p");

			  	fashion_label.append("ul");
  			}
  		});


  	this.segments
  		.attr("class", function(d){
  			if (d[1].length < 1){
  				return "timelineSegment noItems"
  			} 
  			return "timelineSegment";
  		})

  	this.segments.select(".fashionLabel p")
  		.html(function(d){
  			const num_items = d[1].length;
  			const year = d[0];
  			if (num_items > 0){
  				return `Trend appears <span class='emphasis'>${num_items} time${num_items > 1 ? "s" : ""}</span class='emphasis'><span class='emphasis hideOnSmall'> in ${year}</span>, in the following shows:`
  			}
  			return "";
  		});

  	this.segments.select(".fashionLabel ul")
  		.selectAll("li")
  		.data(d => Object.entries(this.reduceArray(d[1])))
  		.join("li")
  		.html(function(d){
  			const image_html = d[1].map(e => `<img src='./assets/out_sm/${e.substring(0, e.length - 3)}png'>`).join("");
  			return `${d[0]} ${image_html}`
  		})


  	this.segments.select(".yearLabel div")
  		.style("background-image", function(d){
  			const num_items = d[1].length;
  			if (num_items > 0){
  				let name = Object.values(d[1][0])[0];
  				return `url('./assets/out_md/${name.substring(0, name.length - 3)}png')`;
  			}
  			return null;
  		})

  }

  //from https://stackoverflow.com/questions/54177679/how-to-group-an-array-of-objects-by-key
  reduceArray(array){
  		return array.reduce((acc, element) => {
		  // Extract key and height value array
		  const [key, heightValue] = Object.entries(element)[0];
		  // Get or create if non-exist, and push height value from array, index 0
		  (acc[key] || (acc[key] = [])).push(heightValue);
		  return acc;
		}, {});
  }

//adapted from https://stackoverflow.com/questions/40929260/find-last-index-of-element-inside-array-by-certain-condition
findLastIndex(array) {
	var index = array.slice().reverse().findIndex(x => Object.values(x)[0].length > 0);
	var count = array.length - 1
	var finalIndex = index >= 0 ? count - index : index;
	return finalIndex;
}


}
