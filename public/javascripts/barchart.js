

$(function () {



    var checkboxes = document.getElementsByTagName('input');

    for (var i=0; i<checkboxes.length; i++)  {
        if (checkboxes[i].type == 'checkbox')   {
            checkboxes[i].checked = false;
        }
    }


    // set the dimensions of the canvas
    var margin = { top: 20, right: 80, bottom: 70, left: 40 },
        width = 1200 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;


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

    var formatTime = d3.timeFormat("%e %B");
    // Define the div for the tooltip
    var div = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);

    // ajax request to GET the data 

    async function drawBarchart() {

        var data = await d3.json("api/cases/FR");

        console.log(data);

        data.forEach(function (d) {
            d.date = new Date(d.date);
        });

        // scale the range of the data
        x.range([0, width], .05).domain(d3.extent(data, function (d) { return d.date; }));
        y.domain([0, d3.max(data, function (d) { return d.cases; })]);



        dateMin = d3.min(data, function (d) { return d.cases; })
        // add axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("y", 0)
            .attr("x", width + 40)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Time")
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.55em")
            .attr("transform", "rotate(-80)");


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
            .attr("x", function (d) { return x(d.date); })
            .attr("width", width / data.length)
            .attr("y", function (d) { return y(d.cases); })
            .attr("height", function (d) { return height - y(d.cases); })
            .on("mouseover", function(d) {		
                div.transition()		
                    .duration(200)		
                    .style("opacity", .9);		
                div	.html(formatTime(d.date) + "<br/>"  + d.cases+ " cases")	
                    .style("left", (d3.event.pageX + 5) + "px")		
                    .style("top", (d3.event.pageY - 28) + "px");	
                })					
            .on("mouseout", function(d) {		
                div.transition()		
                    .duration(500)		
                    .style("opacity", 0);	
            });


        document.getElementsByTagName('input')
        d3.select("#logCheckbox").on("click", function() {
            if(this.checked) {
                y = d3.scaleLog()
                    .domain([1, d3.max(data, function (d) { return d.cases; })])
                    .range([height, 0]);
            } else {
                y = d3.scaleLinear()
                    .domain([0, d3.max(data, function (d) { return d.cases; })])
                    .range([height, 0]);
            }

            yAxis.scale(y);
            
            d3.select("g.axis.y")
                .transition()
                .duration(500)
                .call(yAxis);
            
            d3.selectAll("rect")
                .transition()
                .delay(400)
                .duration(600)
                .attr("y", function (d) { if(d.cases==0){return y(d.cases+1);}
                else{return y(d.cases)}})
                .attr("height", function (d) { if(d.cases==0){return height - y(d.cases+1);}
                else{return height - y(d.cases)}})
            })
    }
    drawBarchart();
});




