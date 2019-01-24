var width = 800;
var height = 400;
var mapData;
var countryData;
// var select = document.querySelector('select');


var map = d3.select('#world-map')
    .append('svg')
        .attr('width', width)
        .attr('height', height);



d3.queue()
    .defer(d3.json, '//unpkg.com/world-atlas@1.1.4/world/50m.json')
    .defer(d3.csv, 'data/drinks.csv', function(row) {
        return {
            country: row.country,
            countryCode: row.country_code,
            continent: row.continent,
            beer: +row.beer_servings,
            spirits: +row.spirit_servings,
            wine: +row.wine_servings,
            total_litres: +row.total_litres_of_pure_alcohol

        }
    })

    .await(function(error, mapData, countryData) {
        if(error) throw error;

        console.log(mapData)
        console.log(countryData)

        var alcValue = d3.select('input[name="data-type"]:checked').attr('value');
        var geoData = topojson.feature(mapData, mapData.objects.countries).features;

        // countryData.forEach(row => {
        //     var countries = geoData.filter(d => d.id == d.countryCode);
        //     countries.forEach(country => country.properties = row);
        // })
        geoData.forEach(d => {
            var countries = countryData.filter(row => row.countryCode === d.id);
            countries.properties = d.properties;
        })

        // console.log(countryData)
        // console.log(countries)
        console.log(geoData[0].properties)

        var wineAvg = d3.extent(geoData, d => d.properties.wine);
        console.log(wineAvg)







        var proj = d3.geoMercator()
            .scale(125)
            .translate([width / 2, height / 2]);

        var path = d3.geoPath()
            .projection(proj)


        var colorRange = {
            beer: ['orange', 'brown'],
            spirits: ['brown', 'black'],
            wine: ['pink', 'purple']
        };

        // var colorScale = d3.scaleLinear()
        //     .domain(d3.extent())

        map.selectAll('.country')
            .data(geoData)
            .enter()
                .append('path')
                .classed('country', true)
                .attr('d', path)
                    .style('stroke', 'white')
                    .style('stroke-width', 0,3)



    })
        // var select = d3.select('select');
        // var value = select.property('value');
        // console.log(value)

        // console.log(select.val)

    //     select  
    //         .on('change', function(d) {
    //             console.log(d3.event.target.value);
    //         })

    //     // setColor(select.property('value'));
    //     var colorRange = {
    //         beer: ['orange', 'brown'],
    //         spirits: ['brown', 'black'],
    //         wine: ['pink', 'purple']
    //     };
    
    //     var scale = d3.scaleLinear()
    //         .domain(wineAvg)
    //         .range(colorRange.wine);
    
    
    //     d3.selectAll('.country')
    //         .transition()
    //         .duration(750)
    //         .ease(d3.easeBackIn)
    //         .attr('fill', d => {
    //             var val = d.properties['wine'];
    //             return val ? scale(val) : '#ccc';
    //         });



    //     function setColor(val) {

    //         var colorRange = {
    //             beer: ['orange', 'brown'],
    //             spirits: ['brown', 'black'],
    //             wine: ['pink', 'purple']
    //         };
        
    //         var scale = d3.scaleLinear()
    //             .domain([0, d3.max(countryData, d => d.properties[val])])
    //             .range(colorRange[val]);
        
        
    //         d3.selectAll('.country')
    //             .transition()
    //             .duration(750)
    //             .ease(d3.easeBackIn)
    //             .attr('fill', d => scale(d.properties[val]));
    //             // .attr('fill', d => {
    //             //     var data = d[val];
    //             //     return data ? scale(data) : '#ccc';
    //             // })
        
    //         // var color = d3.scaleThreshold()
    //         //     .domain(d3.range([2,10]))
        
        
    //     }

    // })


