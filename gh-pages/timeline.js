class Timeline {
  constructor(holder) {
  	this.block_height = 200;
  	const circle_color = "red";
  	const stroke_width = 4;
  	this.circle_width = 40;

  	this.holder = d3.select(holder);

  	const images = [
  	"2013_Devastée Womenswear Spring-Summer 2013_da3c48f10d33115e8f44f9bd31194946fd86e6bbcfbf19967bf5990784f7f26e.jpg",
  	"2013_Sass & Bide_f61d01ecf6d386fe6e7084875e80d95098eb43fd42bcb7672ffc8deda031d530.jpg",
  	"2014_Bastian Visch KABK - Den Haag 2014_d425d3cf87a69c0fcff656b72bca534da624c95aa705a2afcd8d6675be859360.jpg"
  	];
  	const year_array = Array.from({length: 2015-1989}, (_, i) => i + 1989);
  	const possible_designers = 
  		["Acne Studios", "Alexander Wang", "Chanel",
  		"Versace", "Gucci", "Prada"];

  	this.images = year_array.map(function(e){
  		const num_images = Math.random() > 0.3 ? new Array(Math.floor(Math.random() * possible_designers.length)) : [];
	  	let img_array = [];
	  	for (let i = 0; i < num_images.length; i++){
	  		let temp_designer = possible_designers[Math.floor(Math.random() * possible_designers.length)];
	  		let temp_img = images[Math.floor(Math.random() * images.length)];
	  		img_array.push(
	  			{[temp_designer]: temp_img}
	  		);
	  	}
	  	return {
	  		[e]:img_array
	  	}
	});

  	this.segments = this.holder.selectAll("div.timelineSegment")
  		.data(this.images, e => Object.keys(e)[0])
  		.enter()
  		.append("div")
  		.attr("class", "timelineSegment");

  	this.holder.selectAll("div.timelineSegment")
  		.append("div")
  		.attr("class", "yearLabel")
  		.append("p")
  		.html(d => Object.keys(d)[0]);

  	let circleHolder = this.holder.selectAll("div.timelineSegment")
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

  	let fashionLabel = this.holder.selectAll("div.timelineSegment")
  		.append("div")
  		.attr("class", "fashionLabel");

  	fashionLabel.append("div");

  	fashionLabel.append("p");

  	fashionLabel.append("ul");

  	this.populateTimeline();
  }

  populateTimeline(){

  	this.holder.selectAll("div.timelineSegment")
  		.attr("class", function(d){
  			if (Object.values(d)[0].length < 1){
  				return "timelineSegment noItems"
  			} 
  			return "timelineSegment";
  		})

  	this.holder.selectAll(".fashionLabel p")
  		.html(function(d){
  			const num_items = Object.values(d)[0].length;
  			if (num_items > 0){
  				return `Trend appears <strong>${num_items}</strong> time${num_items > 1 ? "s" : ""}`
  			}
  			return "";
  		});

  	this.holder.selectAll(".fashionLabel div")
  		.style("background-image", function(d){
  			const num_items = Object.values(d)[0].length;
  			if (num_items > 0){
  				return 'url("./assets/' + Object.values(Object.values(d)[0][0])[0] + '")';
  			}
  			return null;
  		})

  	this.holder.selectAll(".fashionLabel ul")
  		.selectAll("li")
  		.data(d => Object.entries(this.reduceArray(Object.values(d)[0])))
  		.enter()
  		.append("li")
  		.html(function(d){
  			return `${d[0]} ${d[1].length > 1 ? "(x" + d[1].length + ")" : ""}`
  		})

  	this.holder.selectAll(".bigCircle")
  		.attr("r", function(d){
  			const num_items = Object.values(d)[0].length;
  			return num_items * 3;
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
