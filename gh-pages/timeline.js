class Timeline {
  constructor(holder) {
  	this.width = d3.select(holder).node().clientWidth;
  	this.height = 350;
  	this.margin = {"left": 80, "right": 20, "top": 50, "bottom": 20};
  	if (this.width < 600){
  		this.margin = {"left": 10, "right": 0, "top": 50, "bottom": 20};
  	}

  	this.holder = d3.select(holder)
  		.select("svg")
  		.attr("width", this.width)
  		.attr("height", this.height);

  	this.scale_x = d3.scaleLinear([1988, 2015], [this.margin.left, this.width-this.margin.right]);
  	this.scale_y = d3.scaleLinear([8, 0], [this.margin.top, this.height-this.margin.bottom]);

  	this.axis_y = d3.axisLeft(this.scale_y);
  	this.axis_x = d3.axisBottom(this.scale_x)
  		.tickFormat(d3.format(".0f"));

  	this.axis_x_group = this.holder.append("g")
  		.attr("class", "timelineX")
	    .attr("transform", `translate(${0},${this.height - this.margin.bottom})`)
	    .call(this.axis_x);

	this.axis_y_group = this.holder.append("g")
		.attr("class", "timelineY")
	    .attr("transform", `translate(${this.margin.left},${0})`)
	    .call(this.axis_y);

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


  	this.populateTimeline();
  }

  populateTimeline(){
  	const image_height = this.scale_y(0) - this.scale_y(1);
  	const image_width = this.scale_x(1990) - this.scale_x(1989);
  	const ratio = 399/445;
  	const true_width = image_height/ratio;
  	// const true_height = Math.min(image_width*ratio, image_height);

  	this.img_group = this.holder.selectAll("g.imageGroup")
  		.data(Object.values(this.images), d => d[0])
  		.enter()
  		.append("g")
  		.attr("class", "imageGroup")
  		.attr("transform", d => `translate(${this.scale_x(parseInt(Object.keys(d)[0]))-true_width/2.15},${-image_height})`)
  		.selectAll("image")
  		.data(function(d){ return Object.values(d)[0] })
  		.enter()
  		.append("image")
  		.attr("height", image_height)
  		.attr("href", function(d){
  			return `./assets/${Object.values(d)[0]}`;
  		})
  		.attr("transform", (d, i) => `translate(${0},${this.scale_y(i)})`)

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
