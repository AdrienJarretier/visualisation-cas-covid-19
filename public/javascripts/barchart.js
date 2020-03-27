

$(function (){
// set the dimensions of the canvas
var margin = {top: 20, right: 20, bottom: 70, left: 40},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;


// set the ranges
var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
var y = d3.scale.linear().range([height, 0]);


var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);


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
        "Date": "A",
        "Cases": 20	
    },
    {
        "Date" : "B",
        "Cases": 12
    },
    {
        "Date" : "C",
        "Cases": 47
    },
    {
        "Date" : "D",
        "Cases": 34
    },
    {
        "Date" : "E",
        "Cases" : 54
    },
    {
        "Date" : "F",
        "Cases" : 21
    },
    {
        "Date" : "G",
        "Cases" : 57
    },
    {
        "Date" : "H",
        "Cases" : 31
    },
    {
        "Date" : "I",
        "Cases" : 17
    },
    {
        "Date" : "J",
        "Cases" : 5
    },
    {
        "Date" : "K",
        "Cases" : 23
    }
]`);


// load the data
console.log(data)

data.forEach(function(d) {
    d.Date = d.Date;
    d.Cases = +d.Cases;
});

// scale the range of the data
x.domain(data.map(function(d) { return d.Date; }));
y.domain([0, d3.max(data, function(d) { return d.Cases; })]);

// add axis
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
.selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", "-.55em")
    .attr("transform", "rotate(-90)" );

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
    .attr("x", function(d) { return x(d.Date); })
    .attr("width", x.rangeBand())
    .attr("y", function(d) { return y(d.Cases); })
    .attr("height", function(d) { return height - y(d.Cases); });
});