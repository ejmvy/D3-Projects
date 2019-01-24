

d3.queue()
    .defer(d3.json, '//unpkg.com/world-atlas@1.1.4/world/50m.json')
    .defer(d3.csv, 'data/drinks.csv', function(row) {
        return {
            country: row.country,
            countryCode: row.country_code,
            continent: row.continent,
            beer: +row.beer_servings,
            spirit: +row.spirit_servings,
            wine: +row.wine_servings,
            total_litres: +row.total_litres_of_pure_alcohol
        }
    })

    .await(function(error, mapData, countryData) {
        if (error) throw error;


        var geoData = topojson.feature(mapData, mapData.objects.countries).features;

        countryData.forEach(row => {
            var countries = geoData.filter(d => d.id === row.countryCode);
            countries.forEach(country => country.properties = row);
            
        });

        var alcVal = d3.select('input[name="data-type"]:checked').attr('value');

        console.log(countryData);

        var allData = countryData;

        var data = d3.nest()
            .key(function(d) {
                return d.continent
            })
            .rollup(function(v) { return {
                count: v.length,
                beer: d3.sum(v, function(d) { return d.beer }),
                wine: d3.sum(v, function(d) { return d.wine }),
                spirit: d3.sum(v, function(d) { return d.spirit })
            }; })
            .entries(countryData);

        console.log(data);

        var placeData = d3.nest()
            .key(function(d) {
                return d.country
            })
            .entries(countryData);

        // console.log(placeData);






        var drink = document.querySelector('#drink');


        drawMap(geoData, countryData, alcVal);
        drawPie(data, alcVal);
        drawBarChart(countryData);


        d3.selectAll('input[name="data-type"]')
            .on('change', () => {
                // setColor(d3.event.target.value);
                // updateTip(d3.event.target.value);
                alcVal = d3.event.target.value;
                drawMap(geoData, countryData, alcVal);
                drawPie(data, alcVal);
                drink.innerText = d3.event.target.value;
                console.log(drink);
            })
        

    })

