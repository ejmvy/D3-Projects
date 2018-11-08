var margin = { left: 100, right:10, top: 10, bottom: 150}

var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;


var svg = d3.select('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);
    
var g = svg.append('g')
        .attr('transform', 'translate(100,10)');

// X Label
g.append('text')
    .attr('x', width / 2)
    .attr('y', height + 15)
    .attr('dy', '1.5em')
    .attr('font-size', "30px")
    .style('text-anchor', 'middle') 
    .text('Months'); 

//Y Label
g.append('text')
    .attr('x', -height / 2)
    .attr('y', -60)
    .attr('font-size', '30px')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .text('Revenues');

d3.json('./revenues.json', function(error,data) {
    if (error) throw error;
    console.log(data);

    var maxRev = d3.max(data, d => d.revenue);


    data.forEach(function(d) {
        d.revenue = +d.revenue;
    

    var xScale = d3.scaleBand()
        .domain(data.map(function(d) {
            return d.month;
        }))
        .range([0, width])
        .paddingInner(0.3)
        .paddingOuter(0.3);

    var yScale = d3.scaleLinear()
        .domain([0, maxRev])
        .range([height, 0]);

    var xAxis = d3.axisBottom(xScale);
    g.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

    var yAxis = d3.axisLeft(yScale);
    g.append('g')
        .attr('transform', 'translate(' + (margin.left - 100) + ',0)')
        .call(yAxis);

    var rects = g.selectAll('rect')
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
            
            .attr('fill', 'DarkGreen')
            });

    d3.interval(function() {
        console.log('Hellooo');
    }, 1000);
    
    })