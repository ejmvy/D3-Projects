var width = 350;
var height = 200;
var radius = Math.min(width, height) / 1.5;

var pie = d3.select('#continent-total')
    .append('svg')
        .attr('width', width)
        .attr('height', height)
    .append('g')
        .attr('transform', 'translate(100, ' + height/2 +')')
        .classed('chart', true);

var t = d3.transition().duration(750)


function drawPie(data, alcVal) {

    var pie = d3.select('#continent-total')

    var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(d => {
                return "<strong>Continent: </strong><span class='details'>" + d.data.key + "<br></span>"
                + `<strong>${uppercase(alcVal)}: </strong><span class='details'>"${d.data.value[alcVal]}"<br></span>`;
            })
    
        svg.call(tip);



    var continents = [];

    data.forEach(function(d) {
        continents.push(d.key);
        return continents;
    })

    // console.log(data)
    // console.log(continents);

    var colorScale = d3.scaleOrdinal()
                     .domain(continents)
                     .range(["#ab47bc", "#7e57c2", "#26a69a", "#42a5f5", "#78909c", '#c21807']);
                    // .range(d3.schemeSpectral[k]);
    

    var arcs = d3.pie()
        .value(d => d.value[alcVal])
        (data);

   

    var path = d3.arc()
        .outerRadius(radius /2)
        .innerRadius(0)


    var update  = pie  
                    .select('.chart')
                    .selectAll('.arc')
                    .data(arcs)

    update
        .exit()
        .remove();

    update    
        .enter()
            .append('path')
                .classed('arc', true)
                .attr('stroke', '#ccc')
                .attr('stroke-width', '0.25px')
            .merge(update)
                .attr('fill', d => colorScale(d.data.key))
                .attr('opacity', 0.6)
                .attr('d', path)
                .on('mouseover', function(d) {
                    tip.show(d);
        
                    d3.select(this)
                        .style('opacity', 1)
                        .style('stroke-width', 1)
                })
                .on('mouseout', function(d) {
                    tip.hide(d);
        
                    d3.select(this)
                        .style('opacity', 0.6)
                        .attr('stroke-width', '0.25px')
                })

            
     
    addLegend(colorScale);
    // writeTip(alcVal);


    function writeTip(val) {

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(d => {
                return "<strong>Country: </strong><span class='details'>" + d.data.key + "<br></span>"
                + `<strong>${uppercase(val)}: </strong><span class='details'>"${d.values[val]}"<br></span>`;
            })
    
        svg.call(tip);
    
    
        // svg.selectAll('arc')
        path
            .on('mouseover', function(d) {
                tip.show(d);
    
                d3.select(this)
                    .style('opacity', 1)
                    .style('stroke-width', 1)
            })
            .on('mouseout', function(d) {
                tip.hide(d);
    
                d3.select(this)
                    // .style('opacity', 0)
                    .attr('stroke-width', '0.25px')
            })
    
        
    
    }

}




function addLegend(colorScale) {

    // var colorScale = d3.scaleOrdinal()
    //     .domain(continents)
    //     .range(["#ab47bc", "#7e57c2", "#26a69a", "#42a5f5", "#78909c", '#c21807']);

    var legend = pie.append('g')
        .attr('transform', 'translate(230, ' + (-80) + ')')

    var legendArray = [
        { label: "Asia", color: colorScale("Asia")},
        { label: "Europe", color: colorScale("Europe")},
        { label: "Africa", color: colorScale("Africa")},
        { label: "North America", color: colorScale("North America")},
        { label: "South America", color: colorScale("South America")},
        { label: "Oceania", color: colorScale("Oceania")}
    ]
        
    var legendRow = legend.selectAll('.legend')
        .data(legendArray)
        .enter()
        .append('g')
            .attr('class', 'legendRow')
            .attr('transform', (d, i) => {
                return 'translate(0, ' + (i * 30) + ')';
            })

    legendRow.append('rect')
            .attr('class', 'legendRect')
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', d => { return d.color})

    legendRow.append('text')
            .attr('class', 'legendText')
            .attr('x', -10)
            .attr('y', 10)
            .attr('text-anchor', 'end')
            .text(d => { return d.label})


}