var margin = {top: 0, right: 10, left: 10, bottom: 10}
var width = 300 - margin.left - margin.right;
var height = 170 - margin.top - margin.bottom;
var padding = 10;

var t = d3.transition().duration(750)


var svg = d3.select('#country-total')
    .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        // .attr('height', height - margin.top - margin.bottom)

var g = svg.append('g')
    .attr('transform', 'translate(50, -10)')
    .attr('z-index', 2)



var xScale = d3.scaleBand()
    .domain(["beer", "wine", "spirit"])
    .range([0, width])
    
var yScale = d3.scaleLinear()
    .domain([0, 500])
    .range([height, 0])
    

var yLabel = g.append('text')
    .attr('x', -height /2 )
    .attr('y', -35)
    .attr('font-size', '12px')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .text('Amount');

var linePath = g.append('path')
    .attr('class', 'line')
    .attr('fill', 'none')
    .attr('stroke-width', '3px')

// var color = d3.scaleOrdinal(d3.schemeReds[4]);



var xAxis = g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0, 160)')

var yAxis = g.append('g')
    .attr('class', 'y-axis')



function drawBarChart(countryData) {
    
    
    countryData.forEach(function(country) {
        
    })

    console.log(countryData);

    // var country = placeData.filter(function(d) {
    //     return d.key == "Ireland";
    // })

    // var data = countryData.filter(function(country) {
    //     var alcs = ["beer", "wine", "spirit"];
        
      
    // });

    // console.log(data);

    // var alcArray = [
    //    { type: "beer", amount: place.beer },
    //    { type: "wine", amount: place.wine },
    //    { type: "spirit", amount: place.spirit }
    // ]

    // country = country[0];
    // console.log(country)

    // var keys = Object.entries(country);
    // console.log(keys['beer']);

    // var data = country.filter(function(d) {
    //     return {
    //         type: "beer", amount: d.beer,
    //         type: "wine", amount: d.wine,
    //         type: "spirit", amount: d.spirit
    //     }

    // })

    // console.log(data);
    // console.log(data.length);


    // yScale.domain([0, d3.max(data, d => { return +d.amount; } )])


    var xAxisCall = d3.axisBottom(xScale);
    xAxis.transition(t).call(xAxisCall);

    var yAxisCall = d3.axisLeft(yScale)
        .ticks(4)
    yAxis.transition(t).call(yAxisCall);


    // var rects = g.selectAll('rect')
    //     .data(data, function(d) {
    //         return d.type;
    //     })

    // rects.exit()
    //     .attr('class', 'exit')
    //     .transition(t)
    //     .attr('height', 0)
    //     .attr('y', height)
    //     .style('fill-opacity', 0.1)
    //     .remove()

    // rects   
    //     .attr('class', 'update')
    //     .transition(t)
    //         .attr('y', function(d) { return yScale(d.amount); })
    //         .attr('x', function(d) { return xScale(d.type); })
    //         .attr('height', function(d) { return (height - yScale(d.amount))})
    //         .attr('width', xScale.bandwidth)

    // rects.enter()
    //     .append('rect')
    //     .attr('class', 'enter')
    //     .attr('y', function(d) { return yScale(d.amount); })
    //     .attr('x', function(d) { return xScale(d.type); })
    //     .attr('height', function(d) { return (height - yScale(d.amount))})
    //     .attr('width', xScale.bandwidth)
    //     .attr('fill', function(d) { return color(d.type)})
    
}

