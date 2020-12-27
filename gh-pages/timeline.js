class Timeline {
  constructor(timelineHolder, list_holder, data, selected_cluster) {
  	this.circle_width = 40;

  	this.holder = d3.select(timelineHolder);
  	this.list_holder = d3.select(list_holder);
  	this.data = data;
  	this.selected_cluster = selected_cluster;

  	const images = [
  	"2013_Devastée Womenswear Spring-Summer 2013_da3c48f10d33115e8f44f9bd31194946fd86e6bbcfbf19967bf5990784f7f26e.jpg",
  	"2013_Sass & Bide_f61d01ecf6d386fe6e7084875e80d95098eb43fd42bcb7672ffc8deda031d530.jpg",
  	"2014_Bastian Visch KABK - Den Haag 2014_d425d3cf87a69c0fcff656b72bca534da624c95aa705a2afcd8d6675be859360.jpg"
  	];
  	this.temp_images = images;
  	this.images = this.data[this.selected_cluster];

  	this.segments = this.holder.selectAll("div.timelineSegment")
  		.data(this.images, d => d[0])
  		.enter()
  		.append("div")
  		.attr("class", "timelineSegment");

  	this.segments
  		.append("div")
  		.attr("class", "yearLabel")
  		.append("p")
  		.html(d => d[0]);

  	this.segments.selectAll(".yearLabel")
  		.append("div");

  	let circleHolder = this.segments
  		.append("div")
  		.attr("class", "dotLabel")
  		.append("svg")
  		.attr("width", this.circle_width)
  		.attr("height", this.circle_width);

  	circleHolder.append("circle")
  		.attr("class", "bigCircle")
  		.attr("r", 0)
  		.attr("cx", this.circle_width/2)
  		.attr("cy", this.circle_width/2);

  	circleHolder.append("circle")
  		.attr("class", "littleCircle")
  		.attr("r", 4)
  		.attr("cx", this.circle_width/2)
  		.attr("cy", this.circle_width/2);

  	let fashion_label = this.segments
  		.append("div")
  		.attr("class", "fashionLabel");

  	fashion_label.append("p");

  	fashion_label.append("ul");

  	this.populateTrendList();
  	this.populateTimeline();
  }

  populateTrendList(){
  	const trend_images = Object.entries(this.data).map(e => [e[0], Object.values(e[1].find(f => f[1].length > 0)[1][0])[0]]);
  	this.list_holder.selectAll("div")
  		.data(trend_images, d => d[0])
  		.enter()
  		.append("div")
  		.style("background-image", function(d){
  			return `url('./assets/out_md/${d[1].substring(0, d[1].length - 3)}png')`;
  		})
  		.on("click", (e, d) => {
  			this.selected_cluster = d[0];
  			this.images = this.data[this.selected_cluster];
  			d3.select(".imTrend")
  				.attr("src", `./assets/out_md/${d[1].substring(0, d[1].length - 3)}png`);
  			this.populateTimeline();
  		});
  }

  populateTimeline(){

  	this.segments
  		.data(this.images, d => d[0])
  		.enter()

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
  			return `${d[0]} (${image_html})`
  		})

  	this.segments.select(".bigCircle")
  		.attr("r", function(d){
  			const num_items = d[1].length;
  			return num_items * 3;
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

  	this.segments.exit();

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
