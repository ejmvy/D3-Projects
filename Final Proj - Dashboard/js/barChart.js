/*
*    barChart.js
*    Source: https://bl.ocks.org/mbostock/3885304
*    Mastering Data Visualization with D3.js
*    FreedomCorp Dashboard
*/


BarChart = function(_parentElement, _variable, _title) {
  this.parentElement = _parentElement;
  this.variable = _variable;
  this.title = _title;

  this.initVis();

}


BarChart.prototype.initVis = function() {
  var vis = this;

  // vis.svg = d3.select("svg"),
  vis.margin = {top: 40, right: 50, bottom: 30, left: 60}
  vis.width = 350 - vis.margin.left - vis.margin.right
  vis.height = 180 - vis.margin.top - vis.margin.bottom

  vis.svg = d3.select(vis.parentElement)
    .append('svg')
      .attr('width', vis.width + vis.margin.right + vis.margin.left)
      .attr('height', vis.height + vis.margin.bottom + vis.margin.top)

  vis.x = d3.scaleBand()
    .domain(["electronics", "furniture", "appliances", "materials"])
    .range([0, vis.width])
    .padding(0.5)
  vis.y = d3.scaleLinear()
    .range([vis.height, 0]);

  vis.color = d3.scaleOrdinal(d3.schemeReds[5]);

  vis.g = vis.svg.append("g")
    .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

  vis.t = () => { return d3.transition().duration(1000); }

  vis.linePath = vis.g.append("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke-width", "3px");

  vis.yAxisCall = d3.axisLeft()
    .ticks(4);
  vis.xAxisCall = d3.axisBottom()
    
  vis.xAxis = vis.g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0,' + vis.height + ')');
  vis.yAxis = vis.g.append('g')
    .attr('class', 'y-axis');


  vis.g.append('text')
    .attr('class', 'title')
    .attr('y', -15)
    .attr('x', -50)
    .attr('font-size', '12px')
    .attr('text-anchor', 'start')
    .text(vis.title);


   

  
  vis.wrangleData();
}


BarChart.prototype.wrangleData = function() {
  var vis = this;

  // vis.variable = $('#var-select').val();

  vis.dataFiltered = nestedCalls.map(function(category) {
    return {
      category: category.key,
      size: (category.values.reduce(function(acc, next) {
        return acc + next[vis.variable]
      }, 0) / category.values.length)
    }
  })


  vis.updateVis();
}


BarChart.prototype.updateVis = function() {
  var vis = this;

  vis.y.domain([0, d3.max(vis.dataFiltered, d => { return +d.size; })])


  vis.xAxisCall.scale(vis.x);
  vis.xAxis.transition(vis.t()).call(vis.xAxisCall);
  vis.yAxisCall.scale(vis.y);
  vis.yAxis.transition(vis.t()).call(vis.yAxisCall);

  vis.rects = vis.g.selectAll('rect')
    .data(vis.dataFiltered, function(d) {
      return d.category;
    })

  vis.rects.exit()
    .attr('class', 'exit')
    .transition(vis.t())
    .attr('height', 0)
    .attr('y', vis.height)
    .style('fill-opacity', 0.1)
    .remove();


  vis.rects
    .attr('class', 'update')
    .transition(vis.t())
      .attr('y', function(d) { return vis.y(d.size); })
      .attr('x', function(d) { return vis.x(d.category); })
      .attr('height', function(d) { return (vis.height - vis.y(d.size))})
      .attr('width', vis.x.bandwidth)

  vis.rects.enter()
    .append('rect')
    .attr('class', 'enter')
    .attr('y', function(d) { return vis.y(d.size); })
    .attr('x', function(d) { return vis.x(d.category); })
    .attr('height', function(d) { return (vis.height - vis.y(d.size))})
    .attr('width', vis.x.bandwidth)
    .attr('fill', function(d) { return vis.color(d.category)})

}


