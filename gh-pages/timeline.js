class Timeline {
  constructor(holder) {
  	this.block_height = 200;
  	const circle_color = "red";
  	const stroke_width = 3;

  	this.holder = d3.select(holder);
  	this.svg = this.holder.append("svg")
  		.attr("height", this.block_height/2 * 25 + "px");

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
  		.attr("class", "timelineSegment")
  		.style("height", this.block_height + "px")
  		.style("left", (d, i) => i%2 === 0 ? "0%" : "55%")
  		.style("width", "47.5%")
  		.style("margin-top", (d, i) => i * this.block_height/2 + "px")

  	this.holder.selectAll("div.timelineSegment")
  		.append("p")

  	this.holder.selectAll("div.timelineSegment")
  		.append("ul")

  	this.holder.selectAll("div.timelineSegment")
  		.append("div");

  	this.svg.append("line")
  		.attr("class", "centreLine")
  		.attr("x1", "47.5%")
  		.attr("x2", "47.5%")
  		.attr("y1", "0%")
  		.attr("y2", "100%")
  		.attr("stroke-dasharray", "8 4");

  	this.svg.append("line")
  		.attr("class", "redLine")
  		.attr("stroke", circle_color)
  		.attr("stroke-width", stroke_width)
  		.attr("fill", "none")
  		.attr("x1", "47.5%")
  		.attr("x2", "47.5%");

  	this.dashes = this.svg.selectAll(".dashLine")
  		.data(this.images, e => Object.keys(e)[0])
  		.enter()
  		.append("g")
  		.attr("class", "dashLine")
  		.attr("transform", (d, i) => `translate(0, ${this.block_height/2 * i})`)

  	this.dashes.append("line")
  		.attr("x1", "calc(47.5% - 6px)")
  		.attr("x2", "calc(47.5% + 6px)")
  		.attr("y1", "-6px")
  		.attr("y2", "6px")
  		.attr("stroke-width", circle_color/2);

  	this.dashes.append("line")
  		.attr("x1", "calc(47.5% + 6px)")
  		.attr("x2", "calc(47.5% - 6px)")
  		.attr("y1", "-6px")
  		.attr("y2", "6px")
  		.attr("stroke-width", circle_color/2);

  	this.dashes.append("text")
  		.attr("x", "50%")
  		.attr("dy", 4)
  		.text(d => Object.keys(d)[0]);

  	this.dashes.append("circle")
  		.attr("class", "littleCircle")
  		.attr("r",0)
  		.attr("cx", "47.5%")
  		.attr("fill", circle_color);

  	this.dashes.append("circle")
  		.attr("class", "bigCircle")
  		.attr("r",0)
  		.attr("cx", "47.5%")
  		.attr("fill", "none")
  		.attr("stroke", circle_color)
  		.attr("stroke-width", stroke_width);

  	this.dashes.append("line")
  		.attr("class", "timeLineDash")
  		.attr("x1", "47.5%")
  		.attr("fill", "none")
  		.attr("stroke", circle_color)
  		.attr("stroke-width", stroke_width);

  	this.populateTimeline();
  }

  populateTimeline(){

  	this.segments.selectAll("p")
  		.html(function(d){
  			const num_items = Object.values(d)[0].length;
  			if (num_items > 0){
  				return `Trend appears <strong>${num_items}</strong> time${num_items > 1 ? "s" : ""}`
  			}
  			return "";
  		});

  	this.segments.selectAll("div")
  		.style("background-image", function(d){
  			const num_items = Object.values(d)[0].length;
  			if (num_items > 0){
  				return 'url("./assets/' + Object.values(Object.values(d)[0][0])[0] + '")';
  			}
  			return null;
  		})

  	this.segments.selectAll("ul")
  		.selectAll("li")
  		.data(d => Object.entries(this.reduceArray(Object.values(d)[0])))
  		.enter()
  		.append("li")
  		.html(function(d){
  			return `${d[0]} ${d[1].length > 1 ? "(x" + d[1].length + ")" : ""}`
  		})

  	this.dashes.selectAll(".timeLineDash")
  		.attr("x2", function(d){
  			if(Object.values(d)[0].length === 0) {
  				return "47.5%";
  			}
  			const index = parseInt(Object.keys(d)[0]) - 1989;
  			if (index % 2 === 0){
  				return "0%";
  			} else {
  				return "100%";
  			}
  		});

  	this.dashes.selectAll("text")
  		.attr("x", "51%")
  		.attr("dy", function(d){
  			if(Object.values(d)[0].length === 0) {
  				return 4;
  			}
  			const index = parseInt(Object.keys(d)[0]) - 1989;
  			if (index % 2 === 0){
  				return 4;
  			} else {
  				return -6;
  			}
  		})

  	this.dashes.selectAll(".littleCircle")
  		.attr("r", d => Object.values(d)[0].length > 0 ? 5 : 0)

  	this.dashes.selectAll(".bigCircle")
  		.attr("r", d => Object.values(d)[0].length * 4)

  	this.svg.select(".redLine")
  		.attr("y1", (this.images.findIndex(e => Object.values(e)[0].length > 0)/2 * this.block_height))
  		.attr("y2", (this.findLastIndex(this.images)/2 * this.block_height));


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
