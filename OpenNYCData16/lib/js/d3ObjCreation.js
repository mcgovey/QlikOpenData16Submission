
var dataObjCreator = function (reply) {

	//store raw dimensions and create variable for final labels
	var rawDimLabels = reply.qHyperCube.qDimensionInfo,
		rawMeasLabels = reply.qHyperCube.qMeasureInfo,
		datapts 	= reply.qHyperCube.qDataPages[0].qMatrix
		labels = [];

	//loop through dimension and measure labels and add to array
	for (var i = 0; i <= rawDimLabels.length - 1; i++) {
			labels.push(rawDimLabels[i].qFallbackTitle);
	};
	for (var i = 0; i <= rawMeasLabels.length - 1; i++) {
			labels.push(rawMeasLabels[i].qFallbackTitle);
	};
	var data = [];
	//labels ["Date", "Cloud Cover", "Temperature Classification", "Turnstile Entries", "Taxi Passengers"]

	for (var index = datapts.length - 1; index >= 0; index--) {
		var tempData ={};
		for (var j = labels.length - 1; j >= 0; j--) {
			//hard coded limit to check if text or number
//*************************Remove magic number
			if (j<3) {
				tempData[labels[j]] = datapts[index][j].qText;
			} else{
				tempData[labels[j]] = datapts[index][j].qNum;
			};
		};
		data.push(tempData);
	};

	return data;
}


var dataNoDimObjCreator = function (reply) {

	//store raw dimensions and create variable for final labels
	var rawMeasLabels = reply.qHyperCube.qMeasureInfo,
		datapts 	= reply.qHyperCube.qDataPages[0].qMatrix
		labels = [];

	for (var i = 0; i <= rawMeasLabels.length - 1; i++) {
			labels.push(rawMeasLabels[i].qFallbackTitle);
	};
	var data = [];

	for (var i = 0; i < datapts[0].length; i++) {
		var tempData = {};
		tempData ={
			label: labels[i],
			value: datapts[0][i].qNum
		};
		data.push(tempData);
	};

	return data;
}


function nFormatter(num, digits) {
  var si = [
    { value: 1E18, symbol: "E" },
    { value: 1E15, symbol: "P" },
    { value: 1E12, symbol: "T" },
    { value: 1E9,  symbol: "G" },
    { value: 1E6,  symbol: "M" },
    { value: 1E3,  symbol: "k" }
  ], i;
  for (i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[i].symbol;
    }
  }
  return num.toString();
}