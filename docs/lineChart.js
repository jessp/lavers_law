/*TODO normalize data to num images*/
class LineChart {

  constructor(holder, year_data, button) {
  	this.holder = d3.select(holder);
    this.year_data = year_data;
    this.normalized = false;
    this.margin = {"left": 10, "right": 15, "top": 15, "bottom": 35};
    this.scale_x = d3.scaleLinear();
    this.scale_y = d3.scaleLinear();

    this.x_axis = this.holder.append("g").attr("class", "xAxis");
    this.y_axis = this.holder.append("g").attr("class", "yAxis");

    this.line = d3.line()
      .defined(d => !isNaN(d[0]))
      .x(d => this.scale_x(d[0]))
      .y(d => this.scale_y(this.normalized ? d[1].length/this.year_data.find(f => f["year"] === d[0])["count"] * 100 : d[1].length));

    this.path = this.holder.append("path").attr("class", "main");

    this.y_title = d3.select(holder)
        .append("text")
        .attr("class", "xAxisTitle")
        .attr("text-anchor", "middle");

    this.button = d3.select(button)
      .on("click", () => {
        this.normalized = !this.normalized;
        this.drawTimeline();
      });

  }

  updateData(data){
    this.width = this.holder.node().parentNode.clientWidth;
    this.height = 145;

    this.data = data;
    this.holder
      .attr("width", this.width)
      .attr("height", this.height);
    
    this.drawTimeline();
  }

  drawTimeline(){
    const max_items = this.normalized ? d3.max(this.data.map(e => e[1].length/this.year_data.find(f => f["year"] === e[0])["count"])) * 100 : d3.max(this.data.map(e => e[1].length));
    this.scale_x
      .domain([1990, 2014])
      .range([this.margin.left, this.width - this.margin.right]);
    this.scale_y
      .domain([max_items, 0])
      .range([this.margin.top, this.height - this.margin.bottom]);

    this.y_title
      .transition().duration(300)
      .attr("transform", `translate(${(this.width - this.margin.left - this.margin.right)/2 + this.margin.left},${this.height - 3})`)
      .text("Collection Year");

    this.x_axis
      .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
      .call(d3.axisBottom(this.scale_x).ticks(this.width / 80, "f").tickSizeOuter(0));

    this.y_axis
      .attr("transform", `translate(${this.margin.left},0)`)
      .transition().duration(300)
      .call(d3.axisRight(this.scale_y)
        .ticks(this.normalized ? 4 : max_items)
        .tickSize(this.width - this.margin.left - this.margin.right)
        .tickFormat((d, i) => {
          if (this.normalized){
            return i !== 0 ? `${d}%` : `${d}% of photos this year include this look`;
          }
          return i !== 0 ? `${d}` : `${d} appearances on runways`;
        }))
      .call(g => g.select(".domain")
        .remove())
      .call(g => g.selectAll(".tick text")
        .attr("y", -8)
        .attr("x", 1))

    this.path
      .datum(this.data)
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", this.line);
  }

}