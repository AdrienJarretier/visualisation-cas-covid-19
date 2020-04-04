

function formatDate(date) {

    return (date).toLocaleDateString(undefined, { day: 'numeric', month: 'long' });

}

$(function () {

    $('#tooltip').hide();

    function generateGetBoundingClientRect(x = 0, y = 0) {
        return () => ({
            width: 0,
            height: 0,
            top: y,
            right: x,
            bottom: y,
            left: x,
        });
    }

    const virtualElement = {
        getBoundingClientRect: generateGetBoundingClientRect(),
    };

    const tooltip = document.querySelector('#tooltip');
    const instance = Popper.createPopper(virtualElement, tooltip, {
        placement: 'right-end',
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: [10, 20],
                },
            },
        ]
    });
    // const instance = createPopper(virtualElement, popper);

    document.addEventListener('mousemove', ({ clientX: x, clientY: y }) => {
        virtualElement.getBoundingClientRect = generateGetBoundingClientRect(x, y);
        instance.update();
    });

    // var checkboxes = document.getElementsByTagName('input');
    // for (var i=0; i<checkboxes.length; i++)  {
    //     if (checkboxes[i].type == 'checkbox')   {
    //         checkboxes[i].checked = false;
    //     }
    // }


    // set the dimensions of the canvas

    var default_width = 1200;
    var default_height = 600;
    var default_ratio = default_width / default_height;

    var margin = { top: 20, right: 80, bottom: 90, left: 80 },
        width = default_width - margin.left - margin.right,
        height = default_height - margin.top - margin.bottom;


    // Determine current size, which determines vars
    function set_vars() {
        //alert('setting vars')
        current_width = window.innerWidth;
        current_height = window.innerHeight;

        current_ratio = current_width / current_height;

        // Check if height is limiting factor
        if (current_ratio > default_ratio) {
            h = current_height;
            w = h * default_ratio;
            // Else width is limiting
        } else {
            w = current_width;
            h = w / default_ratio;
        }

        // Set new width and height based on graph dimensions
        if (w > 1200) {
            w = 1200;
        }
        if (h > 600) {
            h = 600;
        }

        width = w - margin.left - margin.right;
        height = h - margin.top - margin.bottom;

    };

    async function drawBarchart(geoid) {

        set_vars();

        // set the ranges
        var x = d3.scaleTime().range([0, width], .05);
        var y = d3.scaleLinear().range([height, 0]);


        var xAxis = d3.axisBottom(x).tickFormat((d, i) => formatDate(d));

        var yAxis = d3.axisLeft(y).ticks(10).tickFormat((d, i) => (d).toLocaleString());


        d3.select("#barchart").html('')
        
        // add the SVG element
        var svg = d3.select("#barchart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Define the div for the tooltip
        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // ajax request to GET the data 
        var data = await d3.json("api/cases/" + geoid);

        svg.html('')

        data.forEach(function (d) {
            d.date = new Date(d.date);
        });

        // scale the range of the data
        x.domain(d3.extent(data, function (d) { return d.date; }));
        y.domain([0, d3.max(data, function (d) { return d.cases; })]);

        x.range([0, width]);
        xAxis.scale(x)


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
            .attr("x", function (d) { return x(d.date) - width / (data.length); })
            .attr("width", width / (data.length))
            .attr("y", function (d) { return y(d.cases); })
            .attr("height", function (d) { return height - y(d.cases); })
            .on("mouseover", function (d) {
                // div.transition()
                //     .duration(200)
                //     .style("opacity", .9);
                // div.html(formatTime(d.date) + "<br>" + d.cases + " cases")
                //     .style("left", (d3.event.pageX + 5) + "px")
                //     .style("top", (d3.event.pageY - 28) + "px");

                $('#tooltip').show();


                $('#tooltip').html(formatDate(d.date) + "<br>" + d.cases + " nouveaux cas");


            })
            .on("mouseout", function () {

                $('#tooltip').hide();

            });

        // axis titles
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left - 5)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "axisTitle")
            .text("Nombre de nouveaux cas");

        svg.append("text")
            .attr("transform",
                "translate(" + (width / 2) + " ," +
                (height + margin.bottom - 30) + ")")
            .attr("class", "axisTitle")
            .text("Date");

        function changeYaxisScale() {

            let scaleSwitch = $("#logCheckbox")[0];

            if (scaleSwitch.checked) {
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
                .duration(600)
                .call(yAxis)

            d3.selectAll("rect")
                .transition()
                .delay(0)
                .duration(600)
                .attr("y", function (d) {
                    if (d.cases == 0) { return y(d.cases + 1); }
                    else { return y(d.cases) }
                })
                .attr("height", function (d) {
                    if (d.cases == 0) { return height - y(d.cases + 1); }
                    else { return height - y(d.cases) }
                })
        }

        changeYaxisScale();

        $("#logCheckbox").change(changeYaxisScale);

        // d3.select("#logCheckbox").on("click", changeYaxisScale);


    }

    // ----------------------- DROP BOX MANAGEMENT

    // -----

    var current_geoid = null
    async function select_country(geoid, name) {
        current_geoid = geoid
        drawBarchart(geoid);
        d3.select('#dropdownMenuButton').html(name)
    }

    // -----

    function disp_countries(countries) {

        d3.select('menu_items').html('')

        for(let geoid in countries) {

            let c_data = countries[geoid]
            let name = c_data.name

            d3.select('#dropdown-items').append('a')
            .attr('href','#')
            .attr('class','dropdown-item')
            .html(name)
            .on('click', function() {
                select_country(geoid, name)
            })
        }
    }

    // -----

    async function load_countries() {

        let countries = await d3.json("api/countries");
        
        disp_countries(countries);

        let first_geoid = Object.keys(countries)[0]
        let first_name = countries[first_geoid].name
        select_country(first_geoid, first_name)
    }

    // ----------------------- MAIN

    load_countries();

    var resizeTimer;
    window.onresize = function (event) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            var s = d3.selectAll('svg');
            s = s.remove();
            drawBarchart(current_geoid);
        }, 100);
    }
});




