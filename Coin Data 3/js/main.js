





var mainData;
var donutData = [];
var lineChart,
    donutChart1,
    donutChart2;
var parseTime = d3.timeParse("%d/%m/%Y");
var formatTime = d3.timeFormat("%d/%m/%Y");
var color = d3.scaleOrdinal(d3.schemeDark2);

//Event Listeners
$('#coin-select').on('change', function() { 
    coinChanged();
})
$('#var-select').on('change', function() { lineChart.wrangleData(); })

$('#date-slider').slider({
    range: true,
    max: parseTime('31/10/2017').getTime(),
    min: parseTime('12/5/2013').getTime(),
    step: 86400000,
    values: [parseTime("12/5/2013").getTime(), parseTime("31/10/2017").getTime()],
    slide: function(event, ui) {
        $('#dateLabel1').text(formatTime(new Date(ui.values[0])));
        $('#dateLabel2').text(formatTime(new Date(ui.values[1])));
        lineChart.wrangleData();
    }
})


function arcClicked(arc) {
    console.log(arc);
    $('#coin-select').val(arc.data.coin);
    coinChanged();

}

function coinChanged() {
    donutChart1.wrangleData();
    donutChart2.wrangleData();
    lineChart.wrangleData();
}


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
        donutData.push({
            "coin": coin,
            "data": newData[coin].slice(-1)[0]
        })
    }

    console.log(donutData);

    lineChart = new LineChart("#line-area");
    
    donutChart1 = new DonutChart('#donut-area1', '24h_vol');
    donutChart2 = new DonutChart('#donut-area2', 'market_cap');


})

// function updateCharts() {
//     lineChart1.wrangleData()
//     lineChart2.wrangleData()
//     lineChart3.wrangleData()
//     lineChart4.wrangleData()
//     lineChart5.wrangleData()
// }
