/*TODO normalize data to num images*/
class LineChart {

  constructor(holder) {
  	this.holder = d3.select(holder);
    this.margin = {"left": 15, "right": 15, "top": 5, "bottom": 25};
    this.scale_x = d3.scaleLinear();
    this.scale_y = d3.scaleLinear();

    this.x_axis = this.holder.append("g").attr("class", "xAxis");
    this.y_axis = this.holder.append("g").attr("class", "yAxis");

    this.line = d3.line()
      .defined(d => !isNaN(d[0]))
      .x(d => this.scale_x(d[0]))
      .y(d => this.scale_y(d[1].length));

    this.path = this.holder.append("path").attr("class", "main");

  }

  updateData(data){
    this.width = this.holder.node().parentNode.clientWidth;
    this.height = 150;

    this.data = data;
    this.holder
      .attr("width", this.width)
      .attr("height", this.height);
    
    this.drawTimeline();
  }

  drawTimeline(){
    const max_items = d3.max(this.data.map(e => e[1].length));
    this.scale_x.domain([1988, 2015]).range([this.margin.left, this.width - this.margin.right]);
    this.scale_y.domain([max_items, 0]).range([this.margin.top, this.height - this.margin.bottom]);

    this.x_axis
      .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
      .call(d3.axisBottom(this.scale_x).ticks(this.width / 80, "f").tickSizeOuter(0));

    this.y_axis
      .attr("transform", `translate(${this.margin.left},0)`)
      .transition().duration(200)
      .call(d3.axisLeft(this.scale_y).ticks(max_items, "f"));

    this.path
      .datum(this.data)
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", this.line);
  }

}