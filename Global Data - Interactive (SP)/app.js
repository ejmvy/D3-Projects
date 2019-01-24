
// var padding = 40;
var margin = { left: 100, right: 10, top: 10, bottom: 150 }
var width = 800 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;


var svg = d3.select('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)

var g = svg.append('g')
    .attr('transform', 'translate(100,60)');


var time = 0;
var interval;
var newData;

// X Label
var xLabel = g.append('text')
    .attr('x', width /2)
    .attr('y', height + 15)
    .attr('dy', '1.5em')
    .attr('font-size', '20px')
    .style('text-anchor', 'middle')
    .text('GDP Per Capita ($)');

var yLabel = g.append('text')
    .attr('x', - height / 2)
    .attr('y', - 60)
    .attr('font-size', '20px')
    .style('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .text('Life Expectancy (Years)');

var timeLabel = g.append('text')
    .attr('x', width - 40)
    .attr('y', height - 10)
    .attr('font-size', '40px')
    .attr('opacity', '0.4')
    .attr('text-anchor', 'middle')
    .text('1800');

// var tip = d3.tip().attr('class', 'tooltip')
//     .html(function(d) { return d });
        
// g.call(tip);

var tooltip = d3.select('body')
    .append('div')
        .classed('tooltip', true);


// SCALES 

var xScale = d3.scaleLog()
    // .domain(d3.extent([newData, d => d.]))
    .domain([142, 150000])
    .range([0, width])
    .base(10);
    
var yScale = d3.scaleLinear()
    .domain([0, 90])
    .range([height, 0]);

var colorScale = d3.scaleOrdinal(d3.schemeCategory10)
    // .range(d3.schemePastel1);

var area = d3.scaleLinear()
    .range([25*Math.PI, 1500*Math.PI])
    .domain([2000, 1400000000]);

// LABELS

var xAxis = d3.axisBottom(xScale)
    .tickValues([400, 4000, 40000])
    .tickFormat(d3.format("$"));
g.append('g')
    .attr('transform', 'translate(0, ' + height + ')')
    .call(xAxis)

var yAxis = d3.axisLeft(yScale)
    g.append('g')
    // .attr('transform', 'translate(0, 0)')
    .call(yAxis)


var continents = ["europe", "asia", "americas", "africa"];

var legend = g.append('g')
    .attr('transform', 'translate(' + (width -10) + ',' + (height - 225) +')');

continents.forEach(function(continent, i) {
    var legendRow = legend.append('g')
        .attr('transform', 'translate(0, '+ (i * 20) +')');

    legendRow.append('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', colorScale(continent));

    legendRow.append('text')
        .attr('x', -10)
        .attr('y', 10)
        .attr('text-anchor', 'end')
        .style('text-transform', 'capitalize')
        .text(continent);
})


// DATA 

d3.json('data.json', function(error, data) {
    if (error) throw error;


    newData = data.map(function(year) {
        return year["countries"].filter(function(country) {
            return (country.income !== null && country.life_exp !== null);
        }).map(function(d) {
            d.income = +d.income;
            d.life_exp = +d.life_exp;
            return d;
        })
    })



        

    update(newData[0]);

})

$('#playBtn')
    .on('click', function() {
        var button = $(this);
        if(button.text() === 'Play') {
            button.text('Pause');
            interval = setInterval(step, 200);
        } else {
            button.text('Play');
            clearInterval(interval);
        }

$('#resetBtn')
    .on("click", function() {
        time = 0;
        update(newData[0]);
    })   
});

$('#continent-select')
    .on('change', function() {
        update(newData[time]);
    })

$('#date-slider').slider({
    max: 2014,
    min: 1800,
    step: 1,
    slide: function(event, ui) {
        time = ui.value - 1800;
        update(newData[time]);
    }
})

function step() {
    time = (time < 214) ? time+1 : 0
    update(newData[time]);

}

function update(data) {
    
    var t = d3.transition().duration(100);

    var continent = $('#continent-select').val();

    var data = data.filter(function(d) {
        if (continent == "all") {return true;}
        else {
            return d.continent == continent;
        }
    })
    
    // JOIN new data with old elements
    
    
    var circles = g.selectAll('circle')
        .data(data, function(d) {
            return d.country;
        });

    // EXIT old elements not present in new data
    circles.exit().remove();
            
    // UPDATE AND ENTER

    circles.enter()
        .append('circle')
            .attr('fill', d => colorScale(d.continent))
            .on('mouseover touchstart', showTooltip)
            .on('mouseout touchend', hideTooltip)
        .merge(circles)
        .transition(t)
            .attr('cx', d => xScale(d.income))
            .attr('cy', d => yScale(d.life_exp))
            .attr("r", function(d){ return Math.sqrt(area(d.population) / Math.PI) })

    //update time label
    timeLabel.text(+(time + 1800))
    $('#year')[0].innerHTML = +(time + 1800)

    $('#date-slider').slider('value', +(time + 1800))


    

    function showTooltip(d) {
        tooltip 
            .style('opacity', 1)
            .style('left', d3.event.x - (tooltip.node().offsetWidth/2) + "px")
            .style('top', d3.event.y - 175 + 'px')
            .html(`
                <p>Country: ${d.country}</p>
                <p>Continent: ${d.continent}</p>
                <p>Life Exp: ${d3.format('.2f')(d.life_exp)}</p>
                <p>Income: ${d3.format('$,.0f')(d.income)}</p>
                <p>Population: ${d3.format(',.0f')(d.population)}</p>
    `);
    }

    function hideTooltip(d) {
        tooltip
            .style('opacity', 0);
    }
}