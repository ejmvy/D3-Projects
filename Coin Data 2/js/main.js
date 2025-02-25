





var mainData;
var lineChart1,
    lineChart2,
    lineChart3,
    lineChart4,
    lineChart5;
var parseTime = d3.timeParse("%d/%m/%Y");
var formatTime = d3.timeFormat("%d/%m/%Y");


//Event Listeners
$('#coin-select').on('change', updateCharts)
$('#var-select').on('change', updateCharts)

$('#date-slider').slider({
    range: true,
    max: parseTime('31/10/2017').getTime(),
    min: parseTime('12/5/2013').getTime(),
    step: 86400000,
    values: [parseTime("12/5/2013").getTime(), parseTime("31/10/2017").getTime()],
    slide: function(event, ui) {
        $('#dateLabel1').text(formatTime(new Date(ui.values[0])));
        $('#dateLabel2').text(formatTime(new Date(ui.values[1])));
        updateCharts();
    }
})




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

    lineChart1 = new LineChart('#chart-area1', "bitcoin");
    lineChart2 = new LineChart('#chart-area2', "ethereum");
    lineChart3 = new LineChart('#chart-area3', "bitcoin_cash");
    lineChart4 = new LineChart('#chart-area4', "litecoin");
    lineChart5 = new LineChart('#chart-area5', "ripple");
    
    

})

function updateCharts() {
    lineChart1.wrangleData()
    lineChart2.wrangleData()
    lineChart3.wrangleData()
    lineChart4.wrangleData()
    lineChart5.wrangleData()
}
