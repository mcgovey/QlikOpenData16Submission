define( ["jquery", "text!./style.css"], function ( $, cssContent ) {
	'use strict';
	$( "<style>" ).html( cssContent ).appendTo( "head" );
	return {
		initialProperties: {
			qListObjectDef: {
				qShowAlternatives: true,
				qFrequencyMode: "V",
				qInitialDataFetch: [{
					qWidth: 2,
					qHeight: 50
				}]
			}
		},
		definition: {
			type: "items",
			component: "accordion",
			items: {
				dimension: {
					type: "items",
					label: "Dimensions",
					ref: "qListObjectDef",
					min: 1,
					max: 1,
					items: {
						label: {
							type: "string",
							ref: "qListObjectDef.qDef.qFieldLabels.0",
							label: "Label",
							show: true
						},
						libraryId: {
							type: "string",
							component: "library-item",
							libraryItemType: "dimension",
							ref: "qListObjectDef.qLibraryId",
							label: "Dimension",
							show: function ( data ) {
								return data.qListObjectDef && data.qListObjectDef.qLibraryId;
							}
						},
						field: {
							type: "string",
							expression: "always",
							expressionType: "dimension",
							ref: "qListObjectDef.qDef.qFieldDefs.0",
							label: "Field",
							show: function ( data ) {
								return data.qListObjectDef && !data.qListObjectDef.qLibraryId;
							}
						},
						frequency: {
							type: "string",
							component: "dropdown",
							label: "Frequency mode",
							ref: "qListObjectDef.qFrequencyMode",
							options: [{
								value: "N",
								label: "No frequency"
							}, {
								value: "V",
								label: "Absolute value"
							}, {
								value: "P",
								label: "Percent"
							}, {
								value: "R",
								label: "Relative"
							}],
							defaultValue: "V"
						},
						columns: {
							type: "string",
							component: "dropdown",
							label: "Number of Columns",
							ref: "qListObjectDef.qNumColumns",
							options: [{
								value: "1",
								label: "One"
							},{
								value: "2",
								label: "Two"
							},{
								value: "3",
								label: "Three"
							},{
								value: "4",
								label: "Four"
							},{
								value: "6",
								label: "Six"
							},{
								value: "8",
								label: "Eight"
							},{
								value: "10",
								label: "Ten"
							},{
								value: "12",
								label: "Twelve"
							}],
							defaultValue: "1"
						},
					}
				},
				sorting: {
					uses: "sorting"
				},
				settings: {
					uses: "settings"
				}
			}
		},
		snapshot: {
			canTakeSnapshot: true
		},
		paint: function ( $element, layout ) {
			// console.log(layout.qListObject);//qSize.qcy
			var self = this, html = "<section class='menu-"+layout.qListObject.qNumColumns+"'><ul>";
			var tempHtml='', htmlArr=[], innerHtml ='';
			this.backendApi.eachDataRow( function ( rownum, row ) {
				tempHtml = '<li class="data state' + row[0].qState + '" data-value="' + row[0].qElemNumber + '">' + row[0].qText;
				if ( row[0].qFrequency ) {
					tempHtml += '<span>' + row[0].qFrequency + '</span>';
				}
				tempHtml += '</li>';
				htmlArr.push([row[0].qNum, tempHtml])

			} );
			htmlArr.sort(function(a, b) {return a[0] - b[0]});
			// console.log(htmlArr);
			for (var i = 0; i <= htmlArr.length - 1; i++) {

				innerHtml+=htmlArr[i][1]
			};

			html += innerHtml;

			html += "</ul></section>";
			$element.html( html );
			if ( this.selectionsEnabled ) {
				$element.find( 'li' ).on( 'qv-activate', function () {
					if ( this.hasAttribute( "data-value" ) ) {
						var value = parseInt( this.getAttribute( "data-value" ), 10 ), dim = 0;
						self.selectValues( dim, [value], true );
						$( this ).toggleClass( "selected" );
					}
				} );
			}
		}
	};
} );
