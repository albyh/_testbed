var markerList = [];

function initialize() {

	c = new Config; 
	
	$('#search-by-name-btn').on('click', function(){ searchName( map, $('#search-by-name').val() ) });
	$('#search-clear').on('click', function(){
		m.hideMapMarkers( );
		resetSearch( 'name' )
		resetSearch( 'city' )
		m.addMarkerToMap( map, facilityDb.data )
	});

	//initialize the map with div (map-container) and options (mapOptions)
	var map = new google.maps.Map(document.getElementById('map-container'), m.mapOptions );

	m.prev_infowindow = false; //track if there's an open infowindow as a map property

	facilityDb.getFacilityJson( map );

}

function resetSearch( resetType ){
	if ( resetType === 'city' ){
		$('#search-by-city-btn').text( 'Filter by City' );
		$('#search-by-city-btn').removeClass( 'btn-danger' );
	} else if( resetType === 'name' ){
		$('#search-criteria').text('ALL Facilities' );
		$('#search-clear').hide();
	}
}


function populateCitySearchDropdown( map, list ){
	var cities = _.reduce(window.facilityDb.data, function(result, value) {
	  if(result.indexOf(value.address.city) === -1) {
	    result.push(value.address.city);
	  }
		return result;
	  }, []).sort()

	_(cities).forEach(function(city){
		$('<li />' , { 	'id' 	: city,
						'text' 	: city	}).appendTo( '#dynamic-city-list' ) ;
	});



	//bind event handler after list created
	$('.dropdown-menu li').on('click', function(){
  		$('.dropdown-toggle').html($(this).html() + '<span class="caret"></span>');
  		//this.textContent and $(this).text() = city
  		searchCity( map , $(this).text() )
  		$('#search-by-city-btn').addClass( 'btn-danger' );
	})

}

function searchName( map, searchStr ){
	var markerData = {}, noMatch=true;

	//console.log( 'search string: ' + searchStr );
	//search for all instances of searchStr
	_(facilityDb.data).forEach( function( location , key ){
		if( location.name.indexOf( searchStr.toUpperCase() ) >= 0 ){
			noMatch = false;
			markerData[key] =  location ;
		}
	} );

	if (noMatch){
		errorMsg( "No Matches found for "+searchStr )
	} else {
		resetSearch( 'city' ); //clear any city search indicators

		// remove all prior markers
		m.hideMapMarkers( );

		//add/display new markers
		markerList = m.addMarkerToMap( map, markerData ) //, markerList )
		$('#search-criteria').text('Facility Name Includes: ' + searchStr.toUpperCase() );

		$('#search-clear').show(); //display 'clear search/display all' button once there's a search filter
	}

	$('#search-by-name').val(''); // Reset search field

	m.closeOpenInfoWindow( map )
}

function searchCity( map, searchCity ){
	var markerData = {}, noMatch=true;

	_(facilityDb.data).forEach( function( location , key ){
		if( location.address.city.toUpperCase() === searchCity.toUpperCase() ){
			noMatch = false;
			markerData[key] =  location ;
		}
	} );

	if (noMatch){
		errorMsg( "No Matches found for "+searchCity )
	} else {
		m.hideMapMarkers( );
		//debugger
		markerList = m.addMarkerToMap( map, markerData ) //, markerList )

		$('#search-criteria').text('City: ' + searchCity.toUpperCase() );

		$('#search-clear').show(); //display 'clear search/display all' button once there's a search filter
	}

	m.closeOpenInfoWindow( map )
}

function errorMsg( msg ){
	return alert( msg );
}

//add an event listener to display the map, event is 'load', function to call is 'initialize'
google.maps.event.addDomListener(window, 'load', initialize );
