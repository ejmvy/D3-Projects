// var margin = { left: 100, right: 10, top: 10, bottom: 150 }
// var width = 800 - margin.left - margin.right;
// var height = 600 - margin.top - margin.bottom;
var width = 800;
var height = 600;
var padding = 100;

var time = 0;


var svg = d3.select('svg')
    .attr('width', width)
    .attr('height', height);

var g = svg.append('g')
    .attr('transform', 'translate(100,0)');

var xLabel = g.append('text')
    .attr('x', width /2)
    .attr('y', height + 30)
    .attr('dy', '-1.5em')
    .attr('font-size', '20px')
    .style('text-anchor', 'middle')
    .text('CO2 Emissions');

var yLabel = g.append('text')
    .attr('x', - height / 2)
    .attr('y', - 20)
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .text('Methane Emissions');

var timeLabel = g.append('text')
    .attr('x', width - 150)
    .attr('y', height - 80)
    .attr('font-size', '40px')
    .attr('opacity', '0.4')
    .attr('text-anchor', 'middle')
    .text('1970');

var tooltip = d3.select('body')
    .append('div')
        .classed('tooltip', true);

//AXIS
var xAxis = g.append('g')
    .attr('transform', 'translate(0, 550)');
                

var yAxis = g.append('g')
    .attr('transform', 'translate(70,0)');
                


d3.queue()
    .defer(d3.csv, '/data/co2.csv', formatter)
    .defer(d3.csv, '/data/methane.csv', formatter)
    .defer(d3.csv, '/data/urbanpop.csv', formatter)
    .defer(d3.csv, '/data/population.csv', formatter)
    .defer(d3.csv, '/data/gdp.csv', formatter)
    .awaitAll(function(error, allData) {
        if (error) throw error;

        var yearObj = formatAllData(allData);
        var yearRange = d3.extent(Object.keys(yearObj).map(year => +year));

        var years = Object.keys(yearObj);
        // years = parseInt(years);
        console.log(years);

        console.log(years[0]);
        
        
        
        // d3.interval(function() {
        //     time = (time < 42) ? time+1 : 0
        //     drawPlot(years[time])
        // },500);

        // d3.select('input')
        //     .property('min', yearRange[0])
        //     .property('max', yearRange[1])
        //     .property('value', yearRange[0])
        //     .on('input', () => drawPlot(+d3.event.target.value));

        drawPlot(years[0]);





        function drawPlot(year) {
            var data = yearObj[year];
            var t = d3.transition().duration(500);



            // SCALES
            var radiusScale = d3.scaleLinear()
                .domain([0, 1])
                .range([5, 35]);
            
            var xScale = d3.scaleLinear()
                .domain(d3.extent(data, d => d.co2 / d.population))
                .range([padding, width - padding]);
            
            var yScale = d3.scaleLinear()
                .domain(d3.extent(data, d => d.methane / d.population))
                .range([height - padding, padding]);
        
            var colorScale = d3.scaleLinear()
                .domain(d3.extent(data, d=> d.gdp / d.population))
                .range(['orange', 'black']);
        
            // LABELS
        
            xAxis
                .call(d3.axisBottom(xScale));
            
            yAxis
                .call(d3.axisLeft(yScale));
                
            
        
            var circles = g.selectAll('circle')
                .data(data, d => d.region);
        
        
            circles 
                .exit()
                .transition(t)
                    .attr('r', 0)
                .remove();
            
            circles
                .enter()
                .append('circle')
                    .on('mousemove touchmove', showTooltip)
                    .on('mouseout touchend', hideTooltip)
                    .attr('cx', d => xScale(d.co2 / d.population))
                    .attr('cy', d => yScale(d.methane / d.population))
                    .attr('stroke', 'white')
                    .attr('stroke-width', 1)
                .merge(circles)
                .transition(t)
                    .attr('cx', d => xScale(d.co2 / d.population))
                    .attr('cy', d => yScale(d.methane / d.population))
                    .attr('r', d => radiusScale(d.urban / d.population))
                    .attr('fill', d => colorScale(d.gdp / d.population));
        
            timeLabel.text(+(time + 1970));
        };
        
        function showTooltip(d) {
            
            tooltip     
                .style('opacity', 1)
                .style('left', d3.event.x -(tooltip.node().offsetWidth / 2) + 'px')
                .style('top', d3.event.y + -155 + 'px')
                .html(`
                    <p><span style= "color:#ccc">Region:</span> ${d.region}</p>
                    <p><span style= "color:#ccc">Population:</span> ${d3.format(',.0f')(d.population)}</p>
                    <p><span style= "color:#ccc">Urban Pop:</span> ${d3.format(',.0f')(d.urban)}</p>
                    <p><span style= "color:#ccc">CO2 Emissions:</span> ${d.co2.toLocaleString()}</p>
                    <p><span style= "color:#ccc">Methane Emissions:</span> ${d.methane.toLocaleString()}</p>
                    <p><span style= "color:#ccc">GDP /person:</span> ${(d.gdp/d.population).toLocaleString()}</p>
                `)
        }
        
        function hideTooltip(d) {
            tooltip 
                .style('opacity', 0)
        }
        
        
        // debugger;
        function formatAllData(data) {
            var yearObj = {};
            data.forEach(function(arr) {
        
                // get indicator key
                var indicator  = arr[0].indicator.replace(',', '').split(' ')[0].toLowerCase();
                console.log(indicator);
        
                arr.forEach(function(obj) {
        
                    //get current region
                    var region = obj.region;
                    // console.log(region);
        
                    // parse through every year and add region
                    for (var year in obj) {
                        if(parseInt(year)) {
                            // if year is not in our year object - add it with an empty array
                            if(!yearObj[year]) yearObj[year] = [];
        
                            //assign that year to a var
                            var yearArr = yearObj[year];
                            //find region within obj data
                            var regionObj = yearArr.find(el => el.region === region);
                            
                            //if it exists in array - add data to that array
                            if(regionObj) regionObj[indicator] = obj[year];
        
                            //if it doesnt - create new aray 
                            else {
                                var newObj = {region: region};
                                newObj[indicator] = obj[year];
                                yearArr.push(newObj);
                            }
                        }
                    }
                })
            });
            //remove years that dont have complete data sets 
            for (var year in yearObj) {
                yearObj[year] = yearObj[year].filter(validRegion);
                if(yearObj[year].length === 0) delete yearObj[year];
            }
            return yearObj;
        
        }
        
        function validRegion(d) {
            for (var key in d) {
                if (d[key] === null) return false;
            }
            return true;
        }
        
    });
    


//     var yearValues = d3.nest()
//     .key(function(d) { return d["Indicator Name"]; })
//     .key(function(d) { return d["1960"]; })
//     .object(allData);

// console.log(JSON.stringify(yearValues));






function formatter(row) {
    var removeRows = [
        "Arab World", 
        "Central Europe and the Baltics",
        "Caribbean small states",
        "East Asia & Pacific (excluding high income)",
        "Early-demographic dividend",
        "East Asia & Pacific",
        "Europe & Central Asia (excluding high income)",
        "Europe & Central Asia",
        "Euro area",
        "European Union",
        "Fragile and conflict affected situations",
        "High income",
        "Heavily indebted poor countries (HIPC)",
        "IBRD only",
        "IDA & IBRD total",
        "IDA total",
        "IDA blend",
        "IDA only",
        "Not classified",
        "Latin America & Caribbean (excluding high income)",
        "Latin America & Caribbean",
        "Least developed countries: UN classification",
        "Low income",
        "Lower middle income",
        "Low & middle income",
        "Late-demographic dividend",
        "Middle East & North Africa",
        "Middle income",
        "Middle East & North Africa (excluding high income)",
        "North America",
        "OECD members",
        "Other small states",
        "Pre-demographic dividend",
        "Pacific island small states",
        "Post-demographic dividend",
        "Sub-Saharan Africa (excluding high income)",
        "Sub-Saharan Africa",
        "Small states",
        "East Asia & Pacific (IDA & IBRD countries)",
        "Europe & Central Asia (IDA & IBRD countries)",
        "Latin America & the Caribbean (IDA & IBRD countries)",
        "Middle East & North Africa (IDA & IBRD countries)",
        "South Asia (IDA & IBRD)",
        "Sub-Saharan Africa (IDA & IBRD countries)",
        "Upper middle income",
        "World"
    ];

    var obj = {
        region: row["Country Name"],
        indicator: row["Indicator Name"]
    }
    if (removeRows.indexOf(obj.region) > -1) return;
    for(var key in row) {
        if(parseInt(key)) obj[key] = +row[key] || null;
    }
    return obj;
}