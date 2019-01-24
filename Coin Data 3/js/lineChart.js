


//Make new constructor function - new OOP object 
LineChart = function(_parentElement, _coin) {
    this.parentElement = _parentElement;
    this.coin = _coin;

    this.initVis();
};

LineChart.prototype.initVis = function() {
    var vis = this;

    //set up svg
    vis.margin = { left:80, right:100, top:50, bottom:100 },
    vis.height = 550 - vis.margin.top - vis.margin.bottom, 
    vis.width = 800 - vis.margin.left - vis.margin.right;

    vis.svg = d3.select(vis.parentElement)
        .append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom);

    vis.g = vis.svg.append("g")
        .attr("transform", "translate(" + vis.margin.left + 
            ", " + vis.margin.top + ")");


    //Transition 
    vis.t = function() {
        return d3.transition().duration(1000);
    }

    vis.bisectDate = d3.bisector(function(d) { return d.year; }).left;




    // Add the line 
    vis.linePath = vis.g.append("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke-width", "3px");

    vis.title = vis.g.append('text')
        .attr('x', vis.width /2)
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .text(vis.coin)


    //LABELS
    vis.xLabel = vis.g.append('text')
        .attr('class', 'xLabel')
        .attr('x', vis.width / 2)
        .attr('y', vis.height + 50)
        .attr('font-size', '20px')
        .attr('text-anchor', 'middle')
        .text('Time');

    vis.yLabel = vis.g.append('text')
        .attr('class', 'yLabel')
        .attr('x', -170)
        .attr('y', -60)
        .attr('font-size', '20px')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .text('Price USD');

    // Y-Axis label



    // Scales
    vis.x = d3.scaleTime().range([0, vis.width]);
    vis.y = d3.scaleLinear().range([vis.height, 0]);

    // Axis generators
    vis.xAxisCall = d3.axisBottom()
        .ticks(4);
    vis.yAxisCall = d3.axisLeft()
        .ticks(6)
        .tickFormat(function(d) { return parseInt(d / 1000) + "k"; });

    // Axis groups
    vis.xAxis = vis.g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + vis.height + ")");
    vis.yAxis = vis.g.append("g")
        .attr("class", "y axis")

    // vis.yAxis.append("text")
    //     .attr("class", "axis-title")
    //     .attr("transform", "rotate(-90)")
    //     .attr("y", 6)
    //     .attr("dy", ".71em")
    //     .style("text-anchor", "end")
    //     .attr("fill", "#5D6971")
    //     .text("Population)");

    vis.wrangleData();
};

LineChart.prototype.wrangleData = function() {
    var vis = this;

    vis.coin = $('#coin-select').val(),
    vis.value = $('#var-select').val();
    vis.sliderValues = $('#date-slider').slider('values');
    vis.mainData = newData[vis.coin].filter(function(d) {
        return ((d.date >= vis.sliderValues[0]) && (d.date <= vis.sliderValues[1]));
    });

    vis.updateVis();
};

LineChart.prototype.updateVis = function() {
    var vis = this;
    // vis.coin = $('#coin-select').val();

    //update the scales
    vis.x.domain(d3.extent(vis.mainData, function(d) { return d.date; }));
    vis.y.domain([d3.min(vis.mainData, function(d) { return d[vis.value]; }) / 1.005, 
        d3.max(vis.mainData, function(d) { return d[vis.value]; }) * 1.005]);

    var formatSi = d3.format(".2s");
    function formatAbbreviation(x) {
        var s = formatSi(x);
        switch (s[s.length - 1]) {
            case "G": return s.slice(0, -1) + "B";
            case "k": return s.slice(0, -1) + "K";
        }
        return s;
    }


    vis.xAxisCall.scale(vis.x)
    vis.xAxis.transition(vis.t()).call(vis.xAxisCall);
    vis.yAxisCall.scale(vis.y)
    vis.yAxis.transition(vis.t()).call(vis.yAxisCall.tickFormat(formatAbbreviation));



    // /******************************** Tooltip Code ********************************/


    d3.select(".focus").remove();
    d3.select(".overlay").remove();

    var focus = vis.g.append("g")
        .attr("class", "focus")
        .style("display", "none");
    focus.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("y1", 0)
        .attr("y2", vis.height);
    focus.append("line")
        .attr("class", "y-hover-line hover-line")
        .attr("x1", 0)
        .attr("x2", vis.width);
    focus.append("circle")
        .attr("r", 5);
    focus.append("text")
        .attr("x", 15)
        .attr("dy", ".31em");
    vis.svg.append("rect")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")")
        .attr("class", "overlay")
        .attr("width", vis.width)
        .attr("height", vis.height)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);
        
    function mousemove() {
        var x0 = vis.x.invert(d3.mouse(this)[0]),
            i = vis.bisectDate(vis.mainData, x0, 1),
            d0 = vis.mainData[i - 1],
            d1 = vis.mainData[i],
            d = (d1 && d0) ? (x0 - d0.date > d1.date - x0 ? d1 : d0) : 0;
        focus.attr("transform", "translate(" + vis.x(d.date) + "," + vis.y(d[vis.value]) + ")");
        focus.select("text").text(function() { return d3.format("$,")(d[vis.value].toFixed(2)); });
        focus.select(".x-hover-line").attr("y2", vis.height - vis.y(d[vis.value]));
        focus.select(".y-hover-line").attr("x2", - vis.x(d.date));
    }
    
        // Update y-axis label
    var newLabel = (vis.value == "price_usd") ? "Price (USD)" :
        ((vis.value == "market_cap") ? "Market Capitalization (USD)" :
            "24 Hour Trading Volume (USD)")
    vis.yLabel.text(newLabel)

    line = d3.line()
        .x(function(d) { return vis.x(d.date); })
        .y(function(d) { return vis.y(d[vis.value]); });

    // // Add line to chart
    vis.g.select(".line")
        .attr("stroke", color(vis.coin))
        .transition(vis.t)
        .attr("d", line(vis.mainData));


    /******************************** Tooltip Code ********************************/


};



    




