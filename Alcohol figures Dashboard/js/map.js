// var width = 600;
// var height = 350;

function uppercase(word) {
    var start= word.slice(0,1).toUpperCase();
    return start + word.slice(1);
}

var svg = d3.select('#world-map')
    .append('svg')
        // .attr('width', '800px')


function drawMap(geoData, countryData, alcVal) {



    var proj = d3.geoMercator()
        .scale(100)
        .translate([340, 200]);

    var path = d3.geoPath()
        .projection(proj);



    svg.selectAll('.country')
        .data(geoData)
        .enter()
        .append('path')
        .classed('country', true)
        .attr('d', path) 
            .style('stroke', 'white')
            .style('stroke-width', 0.3)
        // .on('click', makeBarChart)
           


    setColor(alcVal);
    writeTip(alcVal);

    function writeTip(val) {
        var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(d => {
            return "<strong>Country: </strong><span class='details'>" + d.properties.country + "<br></span>"
            + `<strong>${uppercase(val)}: </strong><span class='details'>"${d.properties[val]}"<br></span>`;
        })

        svg.call(tip);


        svg.selectAll('.country')
            .on('mouseover', function(d) {
                tip.show(d);

                d3.select(this)
                    // .style('opacity', 1)
                    .style('stroke', 'white')
                    .style('stroke-width', 1.5)
            })
            .on('mouseout', function(d) {
                tip.hide(d);

                d3.select(this)
                    // .style('opacity', 0)
                    .style('stroke', 'white')
                    .style('stroke-width', 0.3)
            })

    }



    function setColor(val) {

    var colorRanges = {
        wine: ['pink', 'purple'],
        beer: ['orange', 'brown'],
        spirit: ['white', 'brown']
    };

    var scale = d3.scaleLinear()
        .domain([0, d3.max(countryData, d => d[val])])
        .range(colorRanges[val]);


    d3.selectAll('.country')
        .transition()
        .duration(750)
        .ease(d3.easeBackIn)
        .attr('fill', d => {
            var data = d.properties[val];
            return data ? scale(data) : '#ccc';
        })


    }
}



