/*
 * Bootstrap-based responsive mashup
 * @owner Enter you name here (xxx)
 */
/*
 *    Fill in host and port for Qlik engine
 */
var prefix = window.location.pathname.substr( 0, window.location.pathname.toLowerCase().lastIndexOf( "/extensions" ) + 1 );

var config = {
	host: window.location.hostname,
	prefix: prefix,
	port: window.location.port,
	isSecure: window.location.protocol === "https:"
};
//to avoid errors in dev-hub: you can remove this when you have added an app
var app;
require.config( {
	baseUrl: (config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port : "" ) + config.prefix + "resources"
} );

require( ["js/qlik", "./bower_components/d3/d3.js", "./lib/js/Scatter.js"], function ( qlik, d3, scatterJS ) {

	var control = false;
	qlik.setOnError( function ( error ) {
		$( '#popupText' ).append( error.message + "<br>" );
		if ( !control ) {
			control = true;
			$( '#popup' ).delay( 1000 ).fadeIn( 1000 ).delay( 11000 ).fadeOut( 1000 );
		}
	} );
	$( "body" ).css( "overflow: hidden;" );
	function AppUi ( app ) {
		var me = this;
		this.app = app;
		app.global.isPersonalMode( function ( reply ) {
			me.isPersonalMode = reply.qReturn;
		} );
		app.getAppLayout( function ( layout ) {
			$( "#title" ).html( layout.qTitle );
			$( "#title" ).attr( "title", "Last reload:" + layout.qLastReloadTime.replace( /T/, ' ' ).replace( /Z/, ' ' ) );
			//TODO: bootstrap tooltip ??
		} );
		app.getList( 'SelectionObject', function ( reply ) {
			$( "[data-qcmd='back']" ).parent().toggleClass( 'disabled', reply.qSelectionObject.qBackCount < 1 );
			$( "[data-qcmd='forward']" ).parent().toggleClass( 'disabled', reply.qSelectionObject.qForwardCount < 1 );
		} );
		app.getList( "BookmarkList", function ( reply ) {
			var str = "";
			reply.qBookmarkList.qItems.forEach( function ( value ) {
				if ( value.qData.title ) {
					str += '<li><a data-id="' + value.qInfo.qId + '">' + value.qData.title + '</a></li>';
				}
			} );
			str += '<li><a data-cmd="create">Create</a></li>';
			$( '#qbmlist' ).html( str ).find( 'a' ).on( 'click', function () {
				var id = $( this ).data( 'id' );
				if ( id ) {
					app.bookmark.apply( id );
				} else {
					var cmd = $( this ).data( 'cmd' );
					if ( cmd === "create" ) {
						$( '#createBmModal' ).modal();
					}
				}
			} );
		} );
		$( "[data-qcmd]" ).on( 'click', function () {
			var $element = $( this );
			switch ( $element.data( 'qcmd' ) ) {
				//app level commands
				case 'clearAll':
					app.clearAll();
					break;
				case 'back':
					app.back();
					break;
				case 'forward':
					app.forward();
					break;
				// case 'lockAll':
				// 	app.lockAll();
				// 	break;
				// case 'unlockAll':
				// 	app.unlockAll();
				// 	break;
				case 'createBm':
					var title = $( "#bmtitle" ).val(), desc = $( "#bmdesc" ).val();
					app.bookmark.create( title, desc );
					$( '#createBmModal' ).modal( 'hide' );
					break;
			}
		} );
	}

	//dynamic resizing - window heigh minus space for fixed content
	$('nav.sidebar').height($(window).height()-80);
	if ($('div.contentsection').height()<$(window).height()-85) {
		$('div.contentsection').height($(window).height()-85);	
	};
	

	// var offset = 80;

	// $('.navbar li a').click(function(event) {
	//     event.preventDefault();
	//     console.log($(this).attr('class'));
	//     $($(this).attr('class'))[0].scrollIntoView();
	//     scrollBy(0, -offset);
	// });


	//callbacks -- inserted here --

	function StationList(reply, app){
		var stations = reply.qListObject.qDataPages[0].qMatrix;
		var stationLIs='';
		$.each(stations, function(key, value){
		stationLIs += '<option>'+stations[key][0].qText+'</option>';
		//console.log('each station', stationLIs);
		});
		//console.log('reply',stationLIs);
		
		$('#listStation').append(stationLIs);
	}

	//open apps -- inserted here --
	var app = qlik.openApp('KM Open Data Challenge.qvf', config);


	//get objects -- inserted here --
	app.getObject('QVCompareMap','WFfcuCC');
	app.getObject('QVCompareTemperature','URnA');
	app.getObject('QVCompareCloudCover','CsJppJJ');
	app.getObject('QVFilterTemperature','tHpJ');//WJpAHD
	app.getObject('QVFilterCloudCover','ExQYbJ');//ZDPrXmJ
	app.getObject('QVFilterWeekday','vbnXPxU');//juUBRE
	app.getObject('QVFilterMonth','XWupcV');//FrxEmRt
	app.getObject('CurrentSelections','CurrentSelections');
	app.getObject('QV03','WjQfPC');
	// app.getObject('QV02','nLhJBa');
	// app.getObject('QV01','jdKjB');
	//create cubes and lists -- inserted here --
	

	//Select links
	$('a#linkSelectWknd').click(function (event) {
		event.preventDefault();
		app.field("Date.Calendar.Weekday").select([2, 3], true);
	});
	
if ( app ) {
		new AppUi( app );
	}

} );