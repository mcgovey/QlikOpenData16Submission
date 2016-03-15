
require( ["js/qlik", 
	"./bower_components/d3/d3.js", 
	"./bower_components/d3/lib/colorbrewer/colorbrewer.js",
	"./lib/js/d3ObjCreation.js"
	], 

	function ( qlik, d3 ) {

		function DateSplitFields(reply, app){
		//Width and height
		var w = $("#D3Scatter").width();
		var h = $("#D3Scatter").height();
		var padding 	= 70,
			ypadding	= 30;


		var dataset = dataObjCreator(reply);

		//Create scale functions
		var xScale = d3.scale.linear()
							 .domain([0, d3.max(dataset, function(d) { return d["Turnstile Entries"]; })])
							 .range([padding, w - padding]);

		var yScale = d3.scale.linear()
							 .domain([0, d3.max(dataset, function(d) { return d["Taxi Passengers"]; })])
							 .range([h - ypadding, ypadding]);

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
			.range(colorbrewer.Paired[3]);

		//Define cloud ordinals	
		var colorCloud = d3.scale.ordinal()
			.range(colorbrewer.YlGnBu[6]);
			// .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

		// Define the div for the tooltip
		var div = d3.select("#D3Scatter").append("div")	
			.style("background-color","#999")
			.style("color","#fff")
			.attr("class", "tooltip")				
			.style("opacity", 0);


		//d3 remove
		d3.select("#D3Scatter svg")
					.remove();

		//Create SVG element
		var svg = d3.select("#D3Scatter")
					.append("svg")
					.attr("width", w)
					.attr("height", h);

		//Create circles
		svg.append("g")
		   .attr("id", "circles")
		   .selectAll("circle")
		   .data(dataset)
		   .enter()
		   .append("circle")
		   .attr("cx", function(d) {
				return xScale(d["Turnstile Entries"]);
		   })
		   .attr("cy", function(d) {
				return yScale(d["Taxi Passengers"]);
		   })
		   .attr("r", 4)
	      .style("fill", function(d) { return color(d["Temperature Classification"]); })
	      .on("mouseover", function(d) {		
			div.transition()		
			.duration(200)		
			.style("opacity", .9);		
			div.html('Date: '+d["Date"] + "<br/>"  + 'Subway: '+d["Turnstile Entries"] + "<br/>"  + 'Taxi: '+d["Taxi Passengers"] + "<br/>"  + 'Weather: '+d["Cloud Cover"] + "<br/>"  + 'Temperature: '+d["Temperature Classification"])	
			.style("left", d3.select(this).attr("cx") + "px")		
			.style("top", d3.select(this).attr("cy") + "px");	
			})					
		  .on("mouseout", function(d) {		
			div.transition()		
			.duration(500)		
			.style("opacity", 0);	
		  });

		//Create X axis
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + (h - ypadding + 5) + ")")
			.call(xAxis);

		//Create Y axis
		svg.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + (padding - 5) + ",0)")
			.call(yAxis);

		// Attach selection to link Cloud Cover color lis
		d3.select("#linkCloudColor").on("click", function() {
		  updateData($(this).attr("id"));
		  $('#scatterCloudLegendDiv').hide();
		  $('#scatterTempLegendDiv').show();
		});

		// Attach selection to link Temperature color lis
		d3.select("#linkTempColor").on("click", function() {
		  updateData($(this).attr("id"));
		  $('#scatterCloudLegendDiv').show();
		  $('#scatterTempLegendDiv').hide();
		});

		// select date on click
		d3.selectAll('#circles circle').on("click", function (d) {
			// console.log(d)
			app.field('Date').selectMatch(d["Date"], true);
			div.transition()		
				.duration(500)		
				.style("opacity", 0);	
		});

		// Update colors
	    function updateData(value) {
			var svg = d3.select("#D3Scatter")
						.select("#circles")
						.selectAll("circle");

	    	if (value==='linkCloudColor') {
				svg.style("fill", function (d) {
						return colorCloud(d["Cloud Cover"]);
					});
	    	} else if (value==='linkTempColor') {
				svg.style("fill", function (d) {
						return color(d["Temperature Classification"]);
					});
	    	};

	    }
		// //On click, update with new data			
		// d3.select("input")
		// 	.on("click", function() {

		// 		//New values for dataset
		// 		var numValues = dataset.length;						 		//Count original length of dataset
		// 		var maxRange = Math.random() * 1000;						//Max range of new values
		// 		dataset = [];  						 				 		//Initialize empty array
		// 		for (var i = 0; i < numValues; i++) {				 		//Loop numValues times
		// 			var newNumber1 = Math.floor(Math.random() * maxRange);	//New random integer
		// 			var newNumber2 = Math.floor(Math.random() * maxRange);	//New random integer
		// 			dataset.push([newNumber1, newNumber2]);					//Add new number to array
		// 		}
				
		// 		//Update scale domains
		// 		xScale.domain([0, d3.max(dataset, function(d) { return d[0]; })]);
		// 		yScale.domain([0, d3.max(dataset, function(d) { return d[1]; })]);

		// 		//Update all circles
		// 		svg.selectAll("circle")
		// 		   .data(dataset)
		// 		   .transition()
		// 		   .duration(1000)
		// 		   .attr("cx", function(d) {
		// 				return xScale(d[0]);
		// 		   })
		// 		   .attr("cy", function(d) {
		// 				return yScale(d[1]);
		// 		   });

		// 		//Update X axis
		// 		svg.select(".x.axis")
		// 			.transition()
		// 			.duration(1000)
		// 			.call(xAxis);
				
		// 		//Update Y axis
		// 		svg.select(".y.axis")
		// 			.transition()
		// 			.duration(1000)
		// 			.call(yAxis);

		// 	});
	}
	//open apps -- inserted here --
	var app = qlik.openApp('KM Open Data Challenge.qvf', config);

	app.createCube({
	"qInitialDataFetch": [
		{
			"qHeight": 2000,
			"qWidth": 5
		}
	],
	"qDimensions": [
		{
			"qLabel": "Date",
			"qLibraryId": "01f936ce-ccb4-4bfa-ab81-036e2f50c837",
			"qNullSuppression": true,
			"qOtherTotalSpec": {
				"qOtherMode": "OTHER_OFF",
				"qSuppressOther": true,
				"qOtherSortMode": "OTHER_SORT_DESCENDING",
				"qOtherCounted": {
					"qv": "5"
				},
				"qOtherLimitMode": "OTHER_GE_LIMIT"
			}
		},
		{
			"qLabel": "Cloud Cover",
			"qLibraryId": "vWkbjSz",
			"qNullSuppression": true,
			"qOtherTotalSpec": {
				"qOtherMode": "OTHER_OFF",
				"qSuppressOther": true,
				"qOtherSortMode": "OTHER_SORT_DESCENDING",
				"qOtherCounted": {
					"qv": "5"
				},
				"qOtherLimitMode": "OTHER_GE_LIMIT"
			}
		},
		{
			"qLabel": "Temperature Classification",
			"qLibraryId": "073ad5d7-4f67-4cda-a387-a4545adfcea3",
			"qNullSuppression": true,
			"qOtherTotalSpec": {
				"qOtherMode": "OTHER_OFF",
				"qSuppressOther": true,
				"qOtherSortMode": "OTHER_SORT_DESCENDING",
				"qOtherCounted": {
					"qv": "5"
				},
				"qOtherLimitMode": "OTHER_GE_LIMIT"
			}
		}
	],
	"qMeasures": [
		{
			"qLabel": "Turnstile Entries",
			"qLibraryId": "mqnVj",
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
			"qLabel": "Taxi Passengers",
			"qLibraryId": "SCAmFTm",
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
	},DateSplitFields);
} );