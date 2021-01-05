class Timeline {

  constructor(timelineHolder, list_holder, data, selected_cluster, callback) {
  	this.circle_width = 40;

  	this.holder = d3.select(timelineHolder);
  	this.list_holder = d3.select(list_holder);
    this.scroll_holder = this.list_holder.node().parentNode;
  	this.data = data;
  	this.selected_cluster = selected_cluster;
  	this.images = this.data[this.selected_cluster];
    this.callback = callback;
    this.disable_scroll = false;
    this.scroll_width = 0;
    this.scroll_pos = 0;
    this.clones_height = 75 * Object.keys(this.data).length;
    this.leftArrow = d3.select(this.scroll_holder)
      .append("div").attr("class", "leftArrow arrow")
      .on("click", d => {
        if (this.scroll_pos - 75 <= 0){
          this.setScrollPos(this.scroll_width - this.clones_height - 75);
        } else {
          this.setScrollPos(this.scroll_pos - 75);
        }
        return null;
      });

    this.leftArrow.append("svg")
      .append("path")
      .attr("d", "M16 0 L0 8 L16 16");
    
    this.rightArrow = d3.select(this.scroll_holder)
      .append("div").attr("class", "rightArrow arrow")
      .on("click", d => {
        if (this.clones_height + this.scroll_pos + 75 >= this.scroll_width){
          this.setScrollPos(0);
        } else {
          this.setScrollPos(this.scroll_pos + 75);
        }
        return null;
      });

    this.rightArrow.append("svg")
      .append("path")
      .attr("d", "M0 16 L16 8 L0 0");

  	this.populateTrendList();
  	this.populateTimeline();

    this.reCalc();
    d3.select(this.scroll_holder).on("scroll", () =>  window.requestAnimationFrame(this.scrollUpdate.bind(this)));

  }

  populateTrendList(){
    const cluster_text = descriptions["" + this.selected_cluster] || {"name": "", "description": "", "order": 0};
    const trend_images_half = 
      Object.entries(this.data)
        .map(e => [e[0], Object.values(Object.values(e[1]
            .filter(f => f[1].length > 0))[2][1][0])[0]])
        .sort((a, b) => descriptions["" + a[0]]["order"] - descriptions["" + b[0]]["order"]);

    const trend_images = trend_images_half.concat(trend_images_half);


    const this_image = trend_images.find(e => e[0] === "" + this.selected_cluster);
    
    d3.select(".selectedTrend").select("h3").html(cluster_text["name"]);
    d3.select(".textTrend").select("p").html(cluster_text["description"]);
    d3.select(".imTrend")
      .style("background-image", `url('./assets/out_md/${this_image[1]}')`);
    
    const sectionStart = document.getElementById("chooseStyle");

    this.callback(this.data["" + this.selected_cluster]);

    this.list_holder.selectAll("div")
  		.data(trend_images, (d, i) => d[0] + i)
  		.join("div")
      .attr("class", d => d[0] === this.selected_cluster ? "selected" : "")
  		.style("background-image", function(d){
  			return `url('./assets/out_md/${d[1]}')`;
  		})
  		.on("click", (e, d) => {
  			this.selected_cluster = d[0];
  			this.images = this.data[this.selected_cluster];
        this.populateTrendList();
  			this.populateTimeline();
        sectionStart.scrollIntoView({behavior: "smooth"});
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
  				return `Trend appears <span class='emphasis'>${num_items} time${num_items > 1 ? "s" : ""}</span class='emphasis'><span class='emphasis hideOnSmall'> in ${year}</span>, in the following show${num_items > 1 ? "s" : ""}:`
  			}
  			return "";
  		});

  	this.segments.select(".fashionLabel ul")
  		.selectAll("li")
  		.data(d => Object.entries(this.reduceArray(d[1])))
  		.join("li")
  		.html(function(d){
  			const image_html = d[1].map(e => `<img src='./assets/out_sm/${e}'>`).join("");
  			return `${d[0]} ${image_html}`
  		})
      .each(function(d){
        const that = d3.select(this);
        const parent = d3.select(that.node().parentNode.parentNode.parentNode);
        that.selectAll("img")
          .on("click", function(e){
            const imgSrc = this.src;
            parent.select(".yearLabel div")
              .style("background-image", `url(${imgSrc.replace("out_sm", "out_md")}`);
          });
      })


  	this.segments.select(".yearLabel div")
  		.style("background-image", function(d){
  			const num_items = d[1].length;
  			if (num_items > 0){
  				let name = Object.values(d[1][0])[0];
  				return `url('./assets/out_md/${name}')`;
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

//adapted from https://codepen.io/vincentorback/pen/OpdNJa
getScrollPos (arrow) {
  const context = this.scroll_holder;
  return (context.pageXOffset || context.scrollLeft);
}

setScrollPos (pos) {
  const context = this.scroll_holder;
  context.scrollLeft = pos;
}

reCalc () {
  const context = this.scroll_holder;
  this.scroll_pos = this.getScrollPos();
  this.scroll_width = context.scrollWidth;

  if (this.scroll_pos <= 0) {
    this.setScrollPos(1); // Scroll 1 pixel to allow upwards scrolling
  }
}

scrollUpdate () {

  if (!this.disable_scroll) {
    this.scroll_pos = this.getScrollPos();

    if (this.clones_height + this.scroll_pos >= this.scroll_width) {
      // Scroll to the top when you’ve reached the bottom
      this.setScrollPos(1) // Scroll down 1 pixel to allow upwards scrolling
      this.disable_scroll = true
    } else if (this.scroll_pos <= 0) {
      // Scroll to the bottom when you reach the top
      this.setScrollPos(this.scroll_width - this.clones_height);
      this.disable_scroll = true
    }
  }
  if (this.disable_scroll) {
    // Disable scroll-jumping for a short time to avoid flickering
    window.setTimeout(() => {
      return this.disable_scroll = false;
    }, 40)
  }
}

}
