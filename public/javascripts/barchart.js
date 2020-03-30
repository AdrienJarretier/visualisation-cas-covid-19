

$(function () {



    var checkboxes = document.getElementsByTagName('input');

    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].type == 'checkbox') {
            checkboxes[i].checked = false;
        }
    }


    // set the dimensions of the canvas
    var margin = { top: 20, right: 80, bottom: 200, left: 40 },
        width = 1200 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;


    var margin2 = { top: 430, right: 80, bottom: 10, left: 40 },
        height2 = 500 - margin2.top - margin2.bottom

    // set the ranges
    var x = d3.scaleTime();

    // Duplicate xScale for brushing ref later
    x2 = d3.scaleTime()
        .range([0, width]);


    var y = d3.scaleLinear().range([height, 0]);


    var xAxis = d3.axisBottom(x)

    // zoom axis
    var xAxis2 = d3.axisBottom(x2)

    var yAxis = d3.axisLeft(y).ticks(10);


    // add the SVG element
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0)
        .attr("id", "mouse-tracker")
        .style("fill", "white");


    var formatTime = d3.timeFormat("%e %B");
    // Define the div for the tooltip
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // ajax request to GET the data 

    async function drawBarchart() {

        var data = await d3.json("api/cases/FR");
        
        data.forEach(function (d) {
            d.date = new Date(d.date);
        });

        // scale the range of the data
        x.range([0, width], .05).domain(d3.extent(data, function (d) { return d.date; }));
        y.domain([0, d3.max(data, function (d) { return d.cases; })]);

        x2.domain(x.domain())

        var context = svg.append("g") // Brushing context box container
            .attr("transform", "translate(" + 0 + "," + 410 + ")")
            .attr("class", "context");

        //append clip path for lines plotted, hiding those part out of bounds
        svg.append("defs")
            .append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);
        // --------------------------------------------------------------------------------------------


        var brush = d3.brush()//for slider bar at the bottom
            .on("brush", brushed);

        context.append("g") // Create brushing xAxis
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height2 + ")")
            .call(xAxis2);

        var contextArea = d3.area() // Set attributes for area chart in brushing context graph
            .x(function (d) { return x2(d.date); }) // x is scaled to xScale2
            .y0(height2) // Bottom line begins at height2 (area chart not inverted) 
            .y1(0); // Top line of area, 0 (area chart not inverted)

        // //plot the rect as the bar at the bottom
        context.append("path") // Path is created using svg.area details
            .attr("class", "area")
            .attr("d", contextArea(data)) // pass first categories data .values to area path generator 
            .attr("fill", "#E61111");

        // //append the brush for the selection of subsection  
        context.append("g")
            .attr("class", "x brush")
            .call(brush)
            .select("rect")
            .attr("height", height2) 
            //.attr("fill", "#E61111");


        // --------------------------------------------------------------------------------------------
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
            .on("mouseover", function (d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(formatTime(d.date) + "<br/>" + d.cases + " cases")
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });


        document.getElementsByTagName('input')
        d3.select("#logCheckbox").on("click", function () {
            if (this.checked) {
                y = d3.scaleLog()
                    .domain([1, d3.max(data, function (d) { return d.cases; })])
                    .range([height, 0]);
            } else {
                y = d3.scaleLinear()
                    .domain([0, d3.max(data, function (d) { return d.cases; })])
                    .range([height, 0]);
            }

            yAxis.scale(y);

            d3.select("y axis")
                .transition()
                .duration(500)
                .call(yAxis);

            d3.selectAll("rect").data(data)
                .transition()
                .delay(400)
                .duration(600)
                .attr("y", function (d) {
                    if (d.cases == 0) { return y(d.cases + 1); }
                    else { return y(d.cases) }
                })
                .attr("height", function (d) {
                    if (d.cases == 0) { return height - y(d.cases + 1); }
                    else { return height - y(d.cases) }
                })
        })

        function brushed() {

            //console.log(brush.extent())

            x.domain(brush.extent()); // If brush is empty then reset the Xscale domain to default, if not then make it the brush extent 

            //xAxis = d3.axisBottom().scale(x);
            var t = d3.transition()
                .duration(500).delay(400)


            svg.select("x axis") // replot xAxis with transition when brush used
                .transition()
                .call(xAxis);

            // //maxY = findMaxY(categories); // Find max Y rating value categories data with "visible"; true
            // //yScale.domain([0,maxY]); // Redefine yAxis domain based on highest y value of categories data with "visible"; true

            // //svg.select(".y.axis") // Redraw yAxis
            // //  .transition()
            // //  .call(yAxis);   



            d3.selectAll("rect")
                 .data(data)
                 .transition(t)
                 .attr("x", function (d) { return x(d.date); })
        };
    }
    drawBarchart();
});








