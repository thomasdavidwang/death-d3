(function (React$1, ReactDOM, d3$1) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React$1);
  var ReactDOM__default = /*#__PURE__*/_interopDefaultLegacy(ReactDOM);
  var d3__default = /*#__PURE__*/_interopDefaultLegacy(d3$1);

  var dataURL = './src/data/deaths2020.csv';

  var parseDate = d3.timeParse("%m/%d/%Y %I:%M %p");
  var formatDate = d3.timeFormat("%b");
  var formatDay = d3.timeFormat("%b %d");

  var useData = function () {
    var ref = React$1.useState(null);
    var data = ref[0];
    var setData = ref[1];

    React$1.useEffect(function () {
      d3$1.csv(dataURL).then(function (d) { return setData(d); });
    });

    return data;
  };

  var Dropdown = function (ref) {
  	var values = ref.values;
  	var parentCallback = ref.parentCallback;

  	var ref$1 = React$1.useState(values[0]);
  	ref$1[0];
  	var setCurr = ref$1[1];
  	var optList = [];

  	for (var i = 0; i < values.length;i++){
  		optList.push(React__default['default'].createElement( 'option', { value: values[i] }, values[i]));
  	}

  	return(
  		React__default['default'].createElement( 'label', null, "Select Bin Range: ", React__default['default'].createElement( 'select', { onChange: function (e){
  				setCurr(e.target.value);
  				parentCallback(e.target.value);
  			} },
  				optList
  			)
  		)
  	);
  };

  var Textbox = function (ref) {
  	var text = ref.text;

  	return(
  		React.createElement( 'div', { class: "textbox" },
  			text
  		)
  	);
  };

  var height = window.outerHeight/2, width = window.outerWidth/2;
  var margin = {top: 10, right: 30, bottom: 30, left: 40};

  //Capitalizes first letter, lowercases all of the rest
  function textFormat(string) {
  	var temp = string.toLowerCase();
    	return temp.charAt(1).toUpperCase() + temp.slice(2);
  }

  //Finds the average of an array
  function average(d){
  	var sum = 0;

      for(var i = 0; i < d.length; i++) {
      	sum += d[i].length;
      }

      return sum/d.length;
  }

  var drawChart = function (data, bin) {

  	//Appends SVG to page
  	var svg = d3__default['default'].select("div#chart")
  		.append("svg")
  		.attr("width", width + margin.left + margin.right)
  		.attr("height", height + margin.top + margin.bottom)
  		.append("g")
  		.attr("transform",
  		  "translate(" + margin.left + "," + margin.top + ")"); 

      //Parses CSV file dates
      data.forEach(function (d) {
      	d.date = parseDate(d["DateOfDeath"]);
      }); 

      //Scaler for the Y axis, bounds defined later
  	var yScale = d3__default['default'].scaleLinear()
  		.range([height,0]);

  	//Scaler for the X axis, based off of min + max dates
  	var dateExtent = d3__default['default'].extent(data, function (data) { return data.date; });
  	var xScale = d3__default['default'].scaleTime()
  		.domain(dateExtent)
  		.range([0,width]); 

  	//Empty divs to be populated in update()
      var yAxis = svg.append("g");
      var xAxis = svg.append("g");

      //Label for the X Axis
      svg.append("text")             
  	    .attr("transform",
  	            "translate(" + (width/2) + " ," + 
  	                           (height + margin.top + 20) + ")")
  	    .style("text-anchor", "middle")
  	    .text("Date");

  	//Lable for the Y Axis
  	svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Total Number of Deaths"); 

      //Grouping div for bars
      var bars = svg.append("g");

      //Div for mean line
  	var meanLine = svg.append("g")
  		.attr("id", "meanLine");

  	//TickManner: Interval for histogram binning
  	var tickManner; 
  	switch(bin.toLowerCase()) {
  		case "month":
  			tickManner = d3__default['default'].timeMonth; 
  			break; 
  		case "week":
  			tickManner = d3__default['default'].timeWeek;
  			break;  
  		case "day":
  			tickManner = d3__default['default'].timeDay; 
  			break; 
  	}

  	//Histogram Settings
  	var histogram = d3__default['default'].histogram()
      	.value(function (d) { return d.date; })
      	.domain(xScale.domain())
      	.thresholds(xScale.ticks(tickManner));

      //Binned Data
      var histData = histogram(data);

      //Sets bounds for Y Scale
      var deathExtent = d3__default['default'].extent(histData, function (d) { return d.length; });
      yScale.domain([0,deathExtent[1]]);

      //Propogates Y Axis
      yAxis
      	.transition()
      	.duration(1000)
      	.call(d3__default['default'].axisLeft(yScale));

      //Propogates X Axis
      xAxis
      	.attr("transform", ("translate(0, " + height + " )"))
  		.call(d3__default['default'].axisBottom(xScale).tickFormat(formatDate));

  	//Selects existing bars
  	var allBars  = bars.selectAll("rect")
  		.data(histData); 

  	//Transitions + adds additional bars
  	allBars.enter()
  		.append("rect")
  		//Mouseover function for text box and color shift. 
  		.on("mouseover", function (d, i){
  			//Manipulates Text Box
  			var allData = "Total Deaths from " + formatDay(d.x0) + " to " + formatDay(d.x1) +": "+ d.length + "<br/>" + "<br/>"; 
  			for (var i = 0; i < d.length; i++){
  			 	allData += textFormat(d[i].DeceasedFirstName) + " " + textFormat(d[i].DeceasedLastName) + " " + d[i].DateOfDeath + "<br/>";
  			}
  			d3__default['default'].select("div.textbox").style("opacity", .9).html(allData); 	

  			//Changes Color
  			d3__default['default'].select(event.currentTarget)
  				.style("fill", "#005EFB");
          })

          //Resets bars on mouse out
          .on("mouseout", function () {
          	d3__default['default'].select(event.currentTarget)
  			.style("fill", "#009FFA");
          })
  		.merge(allBars)
  		.attr("x", function (d) { return xScale(d.x0); })
  		.attr("y", yScale(average(histData)))
          .attr("width", function (d) { return xScale(d.x1) - xScale(d.x0); })
          .attr("stroke", "rgb(0,0,0)")
          .style("fill", "#009FFA");

      allBars.enter()
      	.selectAll("rect")
      	.transition()
      	.duration(1000)
  		.attr("y", function (d) { return yScale(d.length); })
          .attr("height", function (d) { return height - yScale(d.length); });
      
      //Removes excess bars
      allBars.exit().remove();

      //Removes existing mean line 
      meanLine.selectAll("line").remove();

      //Draws new mean line
      meanLine.append("line")
      	.style("stroke", "black")
      	.attr("y1", yScale(average(histData)))
      	.attr("y2", yScale(average(histData)))
      	.attr("x1", 0)
      	.attr("x2", width);

  };

  var Barchart = function (ref) {
  	var data = ref.data;
  	var bin = ref.bin;


  	React$1.useEffect(function () {
  		drawChart(data, bin);

  		return (function () { return d3__default['default'].selectAll("svg").remove(); })
  	}, [bin]);

  	return(
  		React.createElement( React.Fragment, null )
  	);
  };

  var Chart = function (ref) {
  	var data = ref.data;

  	var ranges = ["month", "week", "day"];

  	var text = null;
  	
  	var ref$1 = React$1.useState("month");
  	var bin = ref$1[0];
  	var setBin = ref$1[1];

  	return(
  		React.createElement( 'div', { id: "datavis" },
  			React.createElement( 'div', { id: "chart" }
  			),
  			React.createElement( Dropdown, { id: "selectButton", values: ranges, parentCallback: function (d) { return setBin(d); } }),
  			React.createElement( Barchart, { data: data, bin: bin }),
  			React.createElement( Textbox, { text: text })
  		)
  	);
  };

  var App = function () {
    var data = useData();

    if (!data) {
      return React__default['default'].createElement( 'pre', null, "Loading..." );
    }

    return (
      React__default['default'].createElement( Chart, { data: data })
    );
  };

  var rootElement = document.getElementById("root");
  ReactDOM__default['default'].render(React__default['default'].createElement( App, null ), rootElement);

}(React, ReactDOM, d3));
