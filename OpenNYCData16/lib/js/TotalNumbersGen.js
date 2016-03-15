// JavaScript

require( ["js/qlik", 
	"./bower_components/d3/d3.js", 
	"./bower_components/d3/lib/colorbrewer/colorbrewer.js",
	"./lib/js/d3ObjCreation.js"
	], 

	function ( qlik, d3 ) {

	function TotalAvgRides(reply, app){
		//get flat JSON-style data variable
		var dataset = dataObjCreator(reply);

		//remove all IDs if they exist
		$('#taxiPsngNum').remove();
		$('#taxiPsngPct').remove();
		$('#subwayPsngNum').remove();
		$('#subwayPsngPct').remove();
		$('#subwayPsngNumLower').remove();
		$('#taxiPsngNumLower').remove();

		// store individual vars as numbers
		var taxiRiders 				= Number(dataset[0]["Average Taxi Passengers by Day"]),
			subwayRiders 			= Number(dataset[0]["Average Subway Rides by Day"]);
		
		// format numbers
		var taxiRidersFormatted 	= nFormatter(taxiRiders,1),
			subwayRidersFormatted 	= nFormatter(subwayRiders,1),
			totalRiders 			= nFormatter((taxiRiders+subwayRiders),0);
// console.log(totalRiders);
		// add taxi and subway number headers
		$('#subwayPsngHeader').append('<h1 id="subwayPsngNum" class="headerNums subwayColor">'+subwayRidersFormatted+'</h1>');
		$('#taxiPsngHeader').append('<h1 id="taxiPsngNum" class="headerNums taxiColor">'+taxiRidersFormatted+'</h1>');


		$('#subwayPsngHeaderLower').append('<h1 id="subwayPsngNumLower" class="headerPcts subwayColor">'+subwayRidersFormatted+'</h1>');
		$('#taxiPsngHeaderLower').append('<h1 id="taxiPsngNumLower" class="headerPcts taxiColor">'+taxiRidersFormatted+'</h1>');


		// calculate taxi and subway proportions
		var taxiproportion			= ((taxiRiders/(taxiRiders+subwayRiders))*100).toFixed(0)+'%',
			subwayproportion 			= ((subwayRiders/(taxiRiders+subwayRiders))*100).toFixed(0)+'%';

		// add taxi and subway proportion numbers
		$('#subwayPsngHeader').append('<h1 id="subwayPsngPct" class="headerPcts subwayColor">'+subwayproportion+'</h1>');
		$('#taxiPsngHeader').append('<h1 id="taxiPsngPct" class="headerPcts taxiColor">'+taxiproportion+'</h1>');

		$('#subwayPsngPct').hover(
			function () {
			    $(this).attr('title', 'Of '+totalRiders+' average daily passengers '+subwayproportion+' rode the subway.');
			}
		);

		$('#taxiPsngPct').hover(
			function () {
			    $(this).attr('title', 'Of '+totalRiders+' average daily passengers '+taxiproportion+' were taxi passengers.');
			}
		);
		//d3 proportion chart

		//Width and height
		var w = $("#proportionChart").width();
		var h = $("#proportionChart").height();
		var padding = 25;
		var ypaddingtop = 10;

		var data= dataNoDimObjCreator(reply);

		// var dataset = dataObjCreator(reply);

		//Create scale functions
		var xScale = d3.scale.linear()
							 .domain([0, d3.max(data, function(d) { return Number(d.value); })*1.1])
							 .range([padding, w - padding]);

		var yScale = d3.scale.ordinal()
							 // .domain([0, 10])
							 .domain(data.map(function(d) { return d.label; }))
							 .rangeRoundBands([h - padding, padding], 0.1);

		//Define X axis
		var xAxis = d3.svg.axis()
						  .scale(xScale)
						  .orient("bottom")
						  .ticks(5);

		//Define Y axis
		var yAxis = d3.svg.axis()
						  .scale(yScale)
						  .orient("left")
						  .ticks(5);


		//Define color ordinals
		var color = d3.scale.ordinal()
			.range(["#fee090", "#4575b4"]);

		//d3 remove
		d3.select("#proportionChart svg")
					.remove();

		//Create SVG element
		var svg = d3.select("#proportionChart")
					.append("svg")
					.attr("width", w)
					.attr("height", h);

		//Create subway bar
		svg.append("g")
			.attr("id", "rect")
			.selectAll("rect")
			.data(data)
			.enter()
			.append("rect")
			.attr("height", yScale.rangeBand())
			.attr("x", padding)
			.attr("width",1)
			.attr("y", function(d) {
				return yScale(d.label);
			})
			.style("fill", function (d) {
				return color(d.label);
			})
	      .transition()
	      	.delay(700)
	      	.duration(1300)
	      	.attr("width",function(d) {
				return xScale( Number(d.value) );
			})
	      ;

	  //   //add text to bars
	  //   svg.append("g")
	  //   	.attr("id","inBarText")
	  //   	.selectAll("text")
	  //   	.data(data)
	  //   	.enter()
	  //   	.append("text")
	  //   	.attr('class','barLabel')
			// .attr("fill", "white")
	  //   	.attr("x", padding)
	  //   	.attr("y", function (d) {
			// 	return yScale(d.label);
	  //   	})
			// .attr("text-anchor", "middle")
			// .attr("text", function (d) {
			// 	return d.label + ': ' + d.value;
			// });

		//Create X axis
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + (h - padding + 5) + ")")
			.call(xAxis);

	}

	var app = qlik.openApp('KM Open Data Challenge.qvf', config);
	app.createCube({
	"qInitialDataFetch": [
		{
			"qHeight": 20,
			"qWidth": 2
		}
	],
	"qDimensions": [],
	"qMeasures": [
		{
			"qLabel": "Average Taxi Passengers by Day",
			"qLibraryId": "kSmzc",
			"qSortBy": {
				"qSortByState": 0,
				"qSortByFrequency": 0,
				"qSortByNumeric": 0,
				"qSortByAscii": 1,
				"qSortByLoadOrder": 0,
				"qSortByExpression": 0,
				"qExpression": {
					"qv": " "
				}
			}
		},
		{
			"qLabel": "Average Subway Rides by Day",
			"qLibraryId": "zJRat",
			"qSortBy": {
				"qSortByState": 0,
				"qSortByFrequency": 0,
				"qSortByNumeric": 0,
				"qSortByAscii": 1,
				"qSortByLoadOrder": 0,
				"qSortByExpression": 0,
				"qExpression": {
					"qv": " "
				}
			}
		}
	],
	"qSuppressZero": false,
	"qSuppressMissing": false,
	"qMode": "S",
	"qInterColumnSortOrder": [],
	"qStateName": "$"
	},TotalAvgRides);
});