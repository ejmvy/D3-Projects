// var margin = { left: 100, right:10, top: 10, botton: 150}

var width = 600;
var height = 400;
var padding = 40;
// var numBars = 12;
// var barPadding = 10;
// var barWidth = width / numBars - barPadding;

var svg = d3.select('svg')
        .attr('width', width)
        .attr('height', height)
    
var g = svg.append('g');

d3.json('./revenues.json', function(error,data) {
    if (error) throw error;
    console.log(data);

    var maxRev = d3.max(data, d => d.revenue);


    data.forEach(function(d){
        d.revenue = +d.revenue;
    

    var xScale = d3.scaleBand()
        .domain(data.map(function(d) {
            return d.month;
        }))
        .range([padding, width - padding])
        .paddingInner(0.3)
        .paddingOuter(0.3);

    var yScale = d3.scaleLinear()
        .domain([0, maxRev])
        .range([height - padding, padding]);

    var xAxis = d3.axisBottom(xScale);

    var yAxis = d3.axisLeft(yScale);

    d3.select('svg')
        .append('g')
            .attr('transform', 'translate(0,' + (height - padding) + ')')
            .call(xAxis);

    d3.select('svg')
        .append('g')
            .attr('transform', 'translate(' + padding + ',0)')
            .call(yAxis);

    var rects = svg.selectAll('rect')
        .data(data);
    
    rects.enter()
        .append('rect')
            .attr('width', xScale.bandwidth)
            .attr('height', function(d) {
                return height - yScale(d.revenue);
            })
            .attr('x', function(d) {
                return xScale(d.month);
            })
            .attr('y', function(d) {
                return yScale(d.revenue);
            })
            
            .attr('fill', 'purple')
            });

    d3.select('svg')
        .append('text')
            .attr('x', width / 2)
            .attr('y', height -20)
            .attr('dy', '1.5em')
            .style('text-anchor', 'middle') 
            .text('Months'); 

    });