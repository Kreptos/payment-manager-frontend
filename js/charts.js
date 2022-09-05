
 arr = {"received":[], "sent":[]};

$.getJSON('../data/data.json', function(data){
   
    $.each(data, function(key){

        arr.sent.push(data[key].sent)
        arr.received.push(data[key].received);
        
    });
    
});
console.log(arr.received);

function drawChart(data1){
    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Column chart with negative values'
        },
        xAxis: {
            
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Получено',
            data: data1
        }]
    });
};

drawChart(arr.received);