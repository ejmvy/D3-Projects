


//set up svg
var margin = { left:80, right:100, top:50, bottom:100 },
    height = 500 - margin.top - margin.bottom, 
    width = 800 - margin.left - margin.right;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + 
        ", " + margin.top + ")");


//Transition 
var t = function() {
    return d3.transition().duration(1000);
}


// Time parser for x-scale
var parseTime = d3.timeParse("%d/%m/%Y");
var formatTime = d3.timeFormat("%d/%m/%Y");
var bisectDate = d3.bisector(function(d) { return d.year; }).left;


//Event Listeners
$('#coin-select').on('change', update)
$('#var-select').on('change', update)

$('#date-slider').slider({
    range: true,
    max: parseTime('31/10/2017').getTime(),
    min: parseTime('12/5/2013').getTime(),
    step: 86400000,
    values: [parseTime("12/5/2013").getTime(), parseTime("31/10/2017").getTime()],
    slide: function(event, ui) {
        $('#dateLabel1').text(formatTime(new Date(ui.values[0])));
        $('#dateLabel2').text(formatTime(new Date(ui.values[1])));
        update();
    }
})


// Add the line 
g.append("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-with", "3px");


//LABELS
var xLabel = g.append('text')
    .attr('class', 'xLabel')
    .attr('x', width / 2)
    .attr('y', height + 50)
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .text('Time');

var yLabel = g.append('text')
    .attr('class', 'yLabel')
    .attr('x', -170)
    .attr('y', -60)
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .text('Price USD');


// Scales
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Axis generators
var xAxisCall = d3.axisBottom()
    .ticks(4);
var yAxisCall = d3.axisLeft()
    .ticks(6)
    .tickFormat(function(d) { return parseInt(d / 1000) + "k"; });

// Axis groups
var xAxis = g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")");
var yAxis = g.append("g")
    .attr("class", "y axis")
    
// Y-Axis label
yAxis.append("text")
    .attr("class", "axis-title")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .attr("fill", "#5D6971")
    .text("Population)");




d3.json("data/coins.json").then(function(data) {
    // Parsing the data

    console.log(data);
    newData = {};

    for(var coin in data) {

        newData[coin] = data[coin].filter(function(d) {
            return (d["price_usd"] !== null);
        })

        newData[coin].forEach(function(d) {
            d['price_usd'] = +d['price_usd'];
            d['24h_vol'] = +d['24h_vol'];
            d['market_cap'] = +d['market_cap'];
            d['date'] = parseTime(d['date'])
        });
    }

    // var dateMin = d3.min(newData[coin], d=> d.date);
    // var dateMax = d3.max(newData[coin], d=> d.date);
    // console.log(dateMin, dateMax);
    
    update();

})

function update() {
    var coin = $('#coin-select').val(),
    value = $('#var-select').val();
    sliderValues = $('#date-slider').slider('values');
    var mainData = newData[coin].filter(function(d) {
        return ((d.date >= sliderValues[0]) && (d.date <= sliderValues[1]));
    });

    console.log(mainData);

    // console.log(value);
    
    //update the scales
    x.domain(d3.extent(mainData, function(d) { return d.date; }));
    y.domain([d3.min(mainData, function(d) { return d[value]; }) / 1.005, 
        d3.max(mainData, function(d) { return d[value]; }) * 1.005]);

    var formatSi = d3.format(".2s");
    function formatAbbreviation(x) {
        var s = formatSi(x);
        switch (s[s.length - 1]) {
            case "G": return s.slice(0, -1) + "B";
            case "k": return s.slice(0, -1) + "K";
        }
        return s;
    }


    xAxisCall.scale(x)
    xAxis.transition(t()).call(xAxisCall);
    yAxisCall.scale(y)
    yAxis.transition(t()).call(yAxisCall.tickFormat(formatAbbreviation));


    // Set scale domains
    
    // // Generate axes once scales have been set
    

    // /******************************** Tooltip Code ********************************/


    d3.select(".focus").remove();
    d3.select(".overlay").remove();

    var focus = g.append("g")
        .attr("class", "focus")
        .style("display", "none");
    focus.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("y1", 0)
        .attr("y2", height);
    focus.append("line")
        .attr("class", "y-hover-line hover-line")
        .attr("x1", 0)
        .attr("x2", width);
    focus.append("circle")
        .attr("r", 5);
    focus.append("text")
        .attr("x", 15)
        .attr("dy", ".31em");
    svg.append("rect")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);
        
    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(mainData, x0, 1),
            d0 = mainData[i - 1],
            d1 = mainData[i],
            d = (d1 && d0) ? (x0 - d0.date > d1.date - x0 ? d1 : d0) : 0;
        focus.attr("transform", "translate(" + x(d.date) + "," + y(d[value]) + ")");
        focus.select("text").text(function() { return d3.format("$,")(d[value].toFixed(2)); });
        focus.select(".x-hover-line").attr("y2", height - y(d[value]));
        focus.select(".y-hover-line").attr("x2", -x(d.date));
    }

    line = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d[value]); });

    // // Add line to chart
    g.select('.line')
        .transition(t)
        .attr("d", line(mainData));

    var newText = (value == "price_usd") ? "Price (USD)" :
        ((value == "market_cap") ?  "Market Capitalization (USD)" : "24 Hour Trading Volume (USD)")
    yLabel.text(newText);
    /******************************** Tooltip Code ********************************/

}

