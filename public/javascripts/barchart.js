

$(function (){
// set the dimensions of the canvas
var margin = {top: 20, right: 80, bottom: 70, left: 40},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;


// set the ranges
var x = d3.scaleTime();
var y = d3.scaleLinear().range([height, 0]);


var xAxis = d3.axisBottom(x)

var yAxis = d3.axisLeft(y).ticks(10);


// add the SVG element
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");


// ajax request to GET the data here


var data = JSON.parse(`[
    {
        "Date": "2020-03-18T00:00:00.000Z",
        "Cases": 1	,
        "CumulCases":0
    },
    {
        "Date": "2020-03-22T00:00:00.000Z",
        "Cases": 2	,
        "CumulCases":2
    },
    {
        "Date" : "2020-03-23T00:00:00.000Z",
        "Cases": 6,
        "CumulCases":8
    },
    {
        "Date" : "2020-03-24T00:00:00.000Z",
        "Cases": 8,
        "CumulCases":14
    },
    {
        "Date" : "2020-03-25T00:00:00.000Z",
        "Cases": 16,
        "CumulCases":24
    },
    {
        "Date" : "2020-03-26T00:00:00.000Z",
        "Cases" : 30,
        "CumulCases":46
    },
    {
        "Date" : "2020-03-27T00:00:00.000Z",
        "Cases" : 60,
        "CumulCases":106 
    }
]`);

//var parseDate = d3.timeParse("%Y-%m-%d");

// load the data

async function drawBarchart (){

    var data = await d3.json("api/cases/FR");

    console.log(data);

data.forEach(function(d) {
    d.date = new Date(d.date);
});

// scale the range of the data
x.range([0, width], .05).domain(d3.extent(data, function(d) { return d.date; }));
y.domain([0, d3.max(data, function(d) { return d.cases; })]);



dateMin = d3.min(data, function(d) {return d.cases;})
// add axis
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
.append("text")
    .attr("y", 0)
    .attr("x", width+40)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Time")
.selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", "-.55em")
    .attr("transform", "rotate(-80)" );


svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 5)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Number of cases");


// Add bar chart
svg.selectAll("bar")
    .data(data)
.enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.date); })
    .attr("width", width/data.length)
    .attr("y", function(d) { return y(d.cases); })
    .attr("height", function(d) { return height - y(d.cases); });
}
drawBarchart();










});




