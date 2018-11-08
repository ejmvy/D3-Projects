var margin = { left: 100, right:10, top: 10, bottom: 150}

var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var flag = true;

var t = d3.transition().duration(750);

var svg = d3.select('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);
    
var g = svg.append('g')
        .attr('transform', 'translate(100,10)');


var xAxisGroup = g.append('g')
        .attr('transform', 'translate(0,' + height + ')');
        
var yAxisGroup = g.append('g')
        .attr('transform', 'translate(' + (margin.left - 100) + ',0)');



var xScale = d3.scaleBand()
    .range([0, width])
    .paddingInner(0.3)
    .paddingOuter(0.3);  

var yScale = d3.scaleLinear()
    .range([height, 0]);

// X Label
g.append('text')
    .attr('x', width / 2)
    .attr('y', height + 15)
    .attr('dy', '1.5em')
    .attr('font-size', "30px")
    .style('text-anchor', 'middle') 
    .text('Month'); 

//Y Label
var yLabel = g.append('text')
    .attr('x', -height / 2)
    .attr('y', -60)
    .attr('font-size', '30px')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .text('Revenue');

d3.json('./revenues.json', function(error,data) {
    if (error) throw error;
    console.log(data);


    data.forEach(function(d) {
        d.revenue = +d.revenue;
        d.profit = +d.profit;
    });

    d3.interval(function() {
        var newData = flag ? data : data.slice(1);

        update(newData)
        flag = !flag
    }, 1000);

    update(data);
});

function update(data) {
    // var maxRev = d3.max(data, d => d.revenue);
    var value = flag ? "revenue" : "profit";

    xScale.domain(data.map(function(d) { return d.month; }))
    yScale.domain([0, d3.max(data, function(d) { return d[value] })])

    var xAxisCall = d3.axisBottom(xScale);
    xAxisGroup.transition(t).call(xAxisCall);

    var yAxisCall = d3.axisLeft(yScale);
    yAxisGroup.transition(t).call(yAxisCall);


    // JOIN new data with old elements 
    var rects = g.selectAll('rect')
        .data(data, function(d) {
            return d.month;
        });

    // EXIT old elements not present in new data
    rects.exit()
            .attr('fill', 'grey')
        .transition(t)
            .attr('y', yScale(0))
            .attr('height', 0)
            .remove();

    //UPDATE old elements present in new data
    rects.transition(t)
        .attr('width', xScale.bandwidth)
        .attr('height', function(d) {return height - yScale(d[value]);})
        .attr('x', function(d) {return xScale(d.month);})
        .attr('y', function(d) {return yScale(d[value]);})

    // ENTER new elements present in new data
    rects.enter()
        .append('rect')
            .attr('height', 0)
            .attr('width', xScale.bandwidth)
            .attr('y', yScale(0))
            .attr('x', function(d) {return xScale(d.month);})
            .attr('fill', 'DarkGreen')
        .merge(rects)
        .transition(t)
            .attr('x', function(d) {return xScale(d.month);})
            .attr('width', xScale.bandwidth)
            .attr('y', function(d) {return yScale(d[value]);})
            .attr('height', function(d) {return height - yScale(d[value]);})


    var label = flag ? "Revenue" : "Profit";
    yLabel.text(label);
            
}