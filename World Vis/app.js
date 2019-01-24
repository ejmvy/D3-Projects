
var width = 960;
var height = 600;
var selector = document.querySelector('select');
// var selectorValue = 

var format = d3.format(',');

// var x = d3.scaleLinear()
//                 .domain([1, 10])
//                 .rangeRound([600, 860])

var svg = d3.select('svg')
    .attr('width', width)
    .attr('height', height)


// var legend = svg.append('g')
//     .attr('class', 'key')
//     .attr('transform', 'translate(0, 40)');

// legend.append("text")
//     .attr("class", "caption")
//     .attr("x", x.range()[0])
//     .attr("y", -6)
//     .attr("fill", "#000")
//     .attr("text-anchor", "start")
//     .attr("font-weight", "bold")


d3.queue()
    .defer(d3.json, '//unpkg.com/world-atlas@1.1.4/world/50m.json')
    .defer(d3.csv, 'data/country_data.csv', function(row) {
        return {
            country: row.country,
            countryCode: row.countryCode,
            population: +row.population,
            medianAge: +row.medianAge,
            fertilityRate: +row.fertilityRate,
            populationDensity: +row.population / + row.landArea
        }
    })

    .await(function(error, mapData, popData) {
        if (error) throw error;


        var geoData = topojson.feature(mapData, mapData.objects.countries).features;

        popData.forEach(row => {
            var countries = geoData.filter(d => d.id === row.countryCode);
            countries.forEach(country => country.properties = row);
            
        });

        
        var proj = d3.geoMercator()
                    .scale(125)
                    .translate([width / 2, height / 1.4]);

        var path = d3.geoPath()
                    .projection(proj);

        var tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])
                    .html(d => {
                        return "<strong>Country: </strong><span class='details'>" + d.properties.country + "<br></span>"
                        + "<strong>Population: </strong><span class='details'>" + d.properties.population + "<br></span>";
                    })

        svg.call(tip);
        
        svg.selectAll('.country')
            .data(geoData)
            .enter()
                .append('path')
                .classed('country', true)
                .attr('d', path) 
                    .style('stroke', 'white')
                    .style('stroke-width', 0.3)
                    .on('mouseover', function(d) {
                        tip.show(d);

                        d3.select(this)
                            // .style('opacity', 1)
                            .style('stroke', 'white')
                            .style('stroke-width', 3)
                    })
                    .on('mouseout', function(d) {
                        tip.hide(d);

                        d3.select(this)
                            // .style('opacity', 0)
                            .style('stroke', 'white')
                            .style('stroke-width', 0.3)
                    })
             
      
        
        var select = d3.select('select');
        // var selectVal = select.property('value');

        select 
            // .on('change', d => )
            .on('change', function(d) {
                setColor(d3.event.target.value);
                updateTip(d3.event.target.value);


            })


        setColor(select.property('value'));

        function updateTip(val) {
            // var selectVal = d3.event.target.value;
            //     console.log(selectVal);

                tip
                    .html(d => {
                        return "<strong>Country: </strong><span class='details'>" + d.properties.country + "<br></span>"
                        + "<strong>" + val + ":  </strong><span class='details'>" + d.properties[val] + "<br></span>";
                    })
        }
        

        function setColor(val) {

            var colorRanges = {
                population: ['pink', 'purple'],
                populationDensity: ['orange', 'brown'],
                medianAge: ['white', 'brown'],
                fertilityRate: ['white', 'green']
            };
    
            var scale = d3.scaleLinear()
                .domain([0, d3.max(popData, d => d[val])])
                .range(colorRanges[val]);
        

            d3.selectAll('.country')
                .transition()
                .duration(750)
                .ease(d3.easeBackIn)
                .attr('fill', d => {
                    var data = d.properties[val];
                    return data ? scale(data) : '#ccc';
                })
                
            var color = d3.scaleThreshold()
                .domain(d3.range(2, 10))
                .range(colorRanges[val]);
            
            var x = d3.scaleLinear()
                .domain([1, 10])
                .rangeRound([600, 860])
                
                

            var legend = svg.append('g')
                .attr('class', 'key')
                .attr('transform', 'translate(0, 40)');

            legend.selectAll('rect')
                .data(color.range().map(function(d) {
                    d = color.invertExtent(d);
                    if (d[0] == null) d[0] = x.domain()[0];
                    if (d[1] == null) d[1] = x.domain()[1];
                    return d;
                }))
                .enter().append("rect")
                    .attr("height", 8)
                    .attr("x", function(d) { return x(d[0]); })
                    .attr("width", function(d) { return x(d[1]) - x(d[0]); })
                    .attr("fill", function(d) { return color(d[0]); });

            legend.append("text")
                .attr("class", "caption")
                .attr("x", x.range()[0])
                .attr("y", -6)
                .attr("fill", "#000")
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text(`${val}`);

            // legend
            //     .text(`${val}`);

            legend.call(d3.axisBottom(x)
                .tickSize(13)
                .tickFormat(function(x, i) { return i ? x + "%" : x + "%"; })
                .tickValues(color.domain()))
                .select(".domain")
                .remove();
        }




        

    })