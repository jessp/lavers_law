class Table {

  constructor(holder, data, collapse_button) {
    this.table = d3.select(holder);
    this.data = data;
    this.collapse_button = d3.select(collapse_button);
    this.svg_width = 100;
    this.svg_height = 30;
    this.prev_sort = null;
    this.sort = "1st Year";
    const max_items = d3.max(this.data, d => d3.max(d["Trend"], g => g[1].length));
    this.scale_x = d3.scaleLinear()
      .domain([1991, 2014])
      .range([0, this.svg_width]);
    this.scale_y = d3.scaleLinear()
      .domain([max_items, 0])
      .range([0, this.svg_height]);

    this.line = d3.line()
      .defined(d => !isNaN(d[0]))
      .x(d => this.scale_x(d[0]))
      .y(d => this.scale_y(d[1].length));

    this.table.append("thead")
      .append("tr")
      .selectAll("th")
      .data(Object.keys(this.data[0]), d => d)
      .enter()
      .append("th")
      .style("width", d => {
        if (d === "Name"){
          return "180px";
        } else if (d ===  "Common Designer"){
          return "100px";
        } else {
          return null;
        }
      }
      )
      .on("click", (d, e) => {
        if (e !== "Image" && e !== "Trend"){
          this.sort = e;
          this.sortData();
        }
        return null;
      });

    this.table_body = this.table.append("tbody");
    this.drawTable();
    this.sortData();

    this.collapse_button.on("click", () => {
      const table_parent = d3.select(this.table.node().parentNode);
      const is_hiding = table_parent.classed("hideExtra");
      table_parent.classed("hideExtra", !is_hiding);
      this.collapse_button.html(is_hiding ? "Show Top Only" : "Show All");
      return null;
    })

  }

  sortData(){
    const is_name = this.sort === "Name" || this.sort === "Common Designer";
    const reverse = this.sort === this.prev_sort;

    this.table_body.selectAll("tr").sort((a, b) => {
      if (is_name){
        if (reverse){
          if(a[this.sort] < b[this.sort]) { return -1; }
          if(a[this.sort] > b[this.sort]) { return 1; }
          return 0;
        } else {
          if(a[this.sort] < b[this.sort]) { return 1; }
          if(a[this.sort] > b[this.sort]) { return -1; }
          return 0;
        }
      } else {
        if (reverse){
          return a[this.sort] - b[this.sort];
        } else {
          return b[this.sort] - a[this.sort];
        }
      }
    });

    this.table.selectAll("th")
      .html(d => {
        if (d === this.sort){
          if (this.prev_sort === this.sort){
            return d + " ↑";
          } else {
            return d + " ↓";
          }
        } else {
          return d;
        }
      });

    if (this.prev_sort === this.sort){
      this.prev_sort = null;
    } else {
      this.prev_sort = this.sort;
    }

  }

  drawTrendLine(year_data){
    const inner_svg = d3.create("svg")
      .attr("viewBox", [0, 0, this.svg_width, this.svg_height])
      .attr("width", this.svg_width)
      .attr("height", this.svg_height);

    inner_svg.append("path")
      .attr("d", () => this.line(year_data));
    return inner_svg.node();

  }

  drawTable(){
    this.table_body
      .selectAll("tr")
      .data(this.data, e => e["Name"])
      .join(
        enter => enter.append("tr")
          .selectAll("td")
          .data(e => Object.entries(e))
          .join("td")
          .html(d => {
            if (d[0] === "Image"){
              return `<div style="background-image: url(${d[1]})"></div>`
            }
            else if (d[0] === "Trend"){
              return this.drawTrendLine(d[1]).outerHTML;
            }
            return d[1];
          })
      )

  }

}